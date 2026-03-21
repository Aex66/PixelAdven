/**
 * Central battle controller — manages BattleStream, protocol interpretation, and battle lifecycle.
 *
 * Supports:
 *  - Player vs Wild Pokemon
 *  - Player vs Trainer NPC  (despawnOnEnd = true)
 *  - Player vs Gym Leader   (despawnOnEnd = false)
 *  - Player vs Player (PvP)
 *
 * Architecture is extensible for doubles (two Pokemon per side).
 * The unit of "active Pokemon" is tracked per side and per slot ('a' = primary, 'b' = secondary).
 */
import { Player as IPlayer, Entity, system } from '@minecraft/server';
import { BattleStreams, RandomPlayerAI } from '../simulator.js';
import { BATTLE_FORMAT_ID } from '../formats.js';
import { packLongHandToSet, packTeamForShowdown } from '../teamPacker.js';
import { PlayerBattleHandler } from './PlayerBattleHandler.js';
import { StrongHeuristicsAI } from './StrongHeuristicsAI.js';
import { collectEntityStats, spawnPokemon } from '../../Pokemon Calculations/spawn.js';
import { setScore } from '../utils.js';
import { longHand } from '../../Pokemon Database/@types/types.js';
import pokemonMoves from '../../../Letters/pokemon/moves.js';
import TypeList from '../../../Letters/pokemon/TypeList.js';

// ─── Visual constants ──────────────────────────────────────────────────────────

const ATTACK_PARTICLES: Record<string, string> = {
    None: '', Fire: 'pokeworld:fire_attack', Water: 'pokeworld:water_attack',
    Normal: '', Electric: 'pokeworld:electric_attack', Grass: 'pokeworld:grass_attack',
    Ground: 'pokeworld:ground_attack', Rock: 'pokeworld:rock_attack',
    Ice: 'pokeworld:ice_attack', Fighting: 'pokeworld:fighting_attack',
    Poison: 'pokeworld:poison_attack', Ghost: 'pokeworld:ghost_attack',
    Psychic: 'pokeworld:psychic_attack', Dragon: 'pokeworld:dragon_attack',
    Fairy: 'pokeworld:fairy_attack', Steel: 'pokeworld:steel_attack',
    Dark: 'pokeworld:dark_attack', Bug: 'pokeworld:bug_attack',
    Flying: 'pokeworld:flying_attack',
};

// Populated once at module load: lowercase move display name → type index
const MOVE_TYPE_MAP = new Map<string, number>(
    Object.entries(pokemonMoves as Record<string, { type: number }>)
        .map(([name, data]) => [name.toLowerCase(), data.type])
);

// ─── Timing constants ──────────────────────────────────────────────────────────

const LOG_QUEUE_INTERVAL_TICKS = 20; // 1 second
const BATTLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 min safety net

// ─── Types ─────────────────────────────────────────────────────────────────────

export type BattlerKind = 'player' | 'wild' | 'trainer' | 'gymleader';
type SlotKey = 'a' | 'b';

/**
 * Runtime state for one side of a battle.
 * `activePokemon` maps slot key → in-world entity.
 *   Slot 'a' is the primary (and only) slot in singles.
 *   Slot 'b' is the secondary slot (doubles — future).
 */
export interface BattlerInfo {
    kind: BattlerKind;
    sideId: 'p1' | 'p2';
    displayName: string;
    team: [number, string, any][];
    /** In-world entities currently deployed for this side, keyed by slot */
    activePokemon: Map<SlotKey, Entity | null>;
    // Player-specific
    player?: IPlayer;
    handler?: PlayerBattleHandler;
    // Entity-based (wild entity, trainer NPC, gym leader NPC)
    entity?: Entity;
    // Trainers despawn their NPC when the battle ends; gym leaders stay
    despawnOnEnd?: boolean;
    /**
     * AI difficulty for non-player battlers.
     * 0 (or undefined) → RandomPlayerAI  |  1–5 → StrongHeuristicsAI
     * Higher values make the AI choose more optimal actions more often.
     */
    difficulty?: number;
}

/**
 * Config used to describe one side before the BattleStream exists.
 * Passed to createArena; a PlayerBattleHandler / AI is wired up internally.
 */
export type BattlerConfig =
    | { kind: 'player';    player: IPlayer; sideId: 'p1' | 'p2'; team: [number, string, any][] }
    | { kind: 'wild';      entity: Entity;  sideId: 'p1' | 'p2'; team: [number, string, any][];               difficulty?: number }
    | { kind: 'trainer' | 'gymleader'; entity: Entity; sideId: 'p1' | 'p2'; team: [number, string, any][]; despawnOnEnd: boolean; difficulty?: number };

export interface ArenaSession {
    readonly id: string;
    readonly stream: InstanceType<typeof BattleStreams.BattleStream>;
    readonly battlers: Map<'p1' | 'p2', BattlerInfo>;
    readonly spectators: Set<IPlayer>;
    readonly logQueue: LogEntry[];
    startTime: number;
    ended: boolean;
    winner: string | null;
    turn: number;
    entityInBattle(entity: Entity): boolean;
    end(): void;
}

interface LogEntry {
    line: string;
    onSent?: () => void;
}

// ─── Battle registry ───────────────────────────────────────────────────────────

export const BATTLES = new Map<string, ArenaSession>();

// ─── Log queue processor ───────────────────────────────────────────────────────

let logQueueInterval: number | null = null;

function processLogQueue(session: ArenaSession): void {
    if (session.logQueue.length === 0) return;
    const entry = session.logQueue.shift()!;
    // Empty line is used as a timing placeholder (for callbacks only)
    if (entry.line) {
        for (const battler of session.battlers.values()) {
            if (battler.kind === 'player' && battler.player?.isValid)
                battler.player.sendMessage(`§7${entry.line}`);
        }
        for (const spec of session.spectators) {
            if (spec.isValid) spec.sendMessage(`§7${entry.line}`);
        }
    }
    entry.onSent?.();
}

function startLogQueueProcessor(): void {
    if (logQueueInterval != null) return;
    logQueueInterval = system.runInterval(() => {
        for (const session of BATTLES.values()) {
            if (!session.ended) processLogQueue(session);
        }
    }, LOG_QUEUE_INTERVAL_TICKS);
}

// ─── Protocol helpers ──────────────────────────────────────────────────────────

function parseProtocolLine(line: string): { cmd: string; args: string[] } {
    if (!line.startsWith('|')) return { cmd: '', args: [] };
    const parts = line.slice(1).split('|');
    return { cmd: parts[0] ?? '', args: parts.slice(1) };
}

function cleanIdent(ident: string): string {
    return ident.replace(/^p\da?: /i, '');
}

function parseHP(condition: string): string {
    if (!condition || condition === '0 fnt') return '§c0 HP§r';
    return condition.split(' ')[0] ?? condition;
}

const STATUS_NAMES: Record<string, string> = {
    par: '§e[PAR]§r', brn: '§6[BRN]§r', psn: '§5[PSN]§r',
    tox: '§5[TOX]§r', slp: '§8[SLP]§r', frz: '§b[FRZ]§r',
};

/**
 * Convert a Showdown protocol line to a human-readable chat message.
 * `p2Kind` controls the flavour of switch messages for non-wild opponents.
 */
function formatProtocolLine(line: string, p2Kind: BattlerKind = 'wild'): string | null {
    const { cmd, args } = parseProtocolLine(line);
    switch (cmd) {
        case 'turn':
            return `§8§m            §r §7Turn ${args[0]}§r §8§m            §r`;
        case 'move': {
            const user = cleanIdent(args[0] ?? '');
            const move = args[1] ?? '?';
            const target = args[2] ? ` on §e${cleanIdent(args[2])}§r` : '';
            return `§e${user}§r used §b${move}§r${target}!`;
        }
        case 'switch':
        case 'drag': {
            const details = args[1] ?? '';
            const species = details.split(',')[0] ?? cleanIdent(args[0] ?? '');
            const isP1 = (args[0] ?? '').startsWith('p1');
            if (isP1) return `§aGo, §e${species}§a!§r`;
            return p2Kind === 'wild'
                ? `§cA wild §e${species}§c appeared!§r`
                : `§e${species}§r was sent out!`;
        }
        case '-damage': {
            const poke = cleanIdent(args[0] ?? '');
            return `§c${poke}§r lost HP! §7(${parseHP(args[1] ?? '')})§r`;
        }
        case '-heal': {
            const poke = cleanIdent(args[0] ?? '');
            return `§a${poke}§r recovered HP! §7(${parseHP(args[1] ?? '')})§r`;
        }
        case 'faint':
            return `§e${cleanIdent(args[0] ?? '')}§c fainted!§r`;
        case '-supereffective':
            return `§6It's super effective!§r`;
        case '-resisted':
            return `§7It's not very effective...§r`;
        case '-immune':
            return `§7It doesn't affect §e${cleanIdent(args[0] ?? '')}§7...§r`;
        case '-miss':
            return `§7${cleanIdent(args[0] ?? '')} missed!§r`;
        case '-crit':
            return `§eA critical hit!§r`;
        case '-status': {
            const poke = cleanIdent(args[0] ?? '');
            const status = STATUS_NAMES[args[1] ?? ''] ?? args[1] ?? '';
            return `§e${poke}§r ${status}`;
        }
        case '-curestatus':
            return `§a${cleanIdent(args[0] ?? '')}§r cured its status!`;
        case '-boost': {
            const poke = cleanIdent(args[0] ?? '');
            return `§e${poke}§r's §b${args[1] ?? '?'}§r rose by ${args[2] ?? '?'}!`;
        }
        case '-unboost': {
            const poke = cleanIdent(args[0] ?? '');
            return `§e${poke}§r's §c${args[1] ?? '?'}§r fell by ${args[2] ?? '?'}!`;
        }
        case '-weather': {
            const w: Record<string, string> = {
                RainDance: '§9Rain started falling.§r', Sandstorm: '§6A sandstorm kicked up.§r',
                SunnyDay: '§eThe sunlight turned harsh.§r', Hail: '§bIt started to hail.§r',
                none: '§7The weather cleared up.§r',
            };
            return w[args[0] ?? ''] ?? null;
        }
        case 'win':
            return `§a§l${args[0]}§r §awon the battle!§r`;
        case 'tie':
            return '§7The battle ended in a tie.§r';
        case 'cant':
            return `§e${cleanIdent(args[0] ?? '')}§r can't move! §7(${args[1] ?? ''})§r`;
        case '-item':
            return `§e${cleanIdent(args[0] ?? '')}§r is holding §b${args[1] ?? '?'}§r!`;
        case '-ability':
            return `§e${cleanIdent(args[0] ?? '')}§r's ability: §b${args[1] ?? '?'}§r`;
        // Silently ignore metadata / setup lines
        case 'player': case 'teamsize': case 'gametype': case 'gen': case 'tier':
        case 'rule': case 'start': case 't:': case 'upkeep': case '-nothing':
        case 'clearpoke': case 'poke': case 'teampreview': case 'request': case '':
            return null;
        default:
            return null;
    }
}

// ─── Entity helpers ────────────────────────────────────────────────────────────

/**
 * Resolve a Showdown ident string (e.g. "p1a: Pikachu", "p2b") to the
 * in-world entity for that slot, or null if not yet spawned.
 */
function getActiveEntity(battlers: Map<'p1' | 'p2', BattlerInfo>, identStr: string): Entity | null {
    const match = identStr.match(/^(p[12])([ab])/);
    if (!match) return null;
    return battlers.get(match[1] as 'p1' | 'p2')?.activePokemon.get(match[2] as SlotKey) ?? null;
}

// ─── Camera animation ──────────────────────────────────────────────────────────

/**
 * For every player battler in the session, play a 40-tick camera clip:
 * camera behind the attacker's Pokemon, facing the target's Pokemon.
 * Works for all battle types and is transparent to the caller.
 */
function playBattleCameraAnimation(
    session: ArenaSession,
    attackerIdent: string,
    targetIdent: string
): void {
    const attackerEntity = getActiveEntity(session.battlers, attackerIdent);
    const targetEntity   = getActiveEntity(session.battlers, targetIdent);
    if (!targetEntity?.isValid) return;

    for (const battler of session.battlers.values()) {
        if (battler.kind !== 'player' || !battler.player?.isValid) continue;
        const player = battler.player;
        // Fall back to the player entity if the attacker's Pokemon isn't spawned yet
        const atkEnt = (attackerEntity?.isValid ? attackerEntity : player) as unknown as Entity;

        const atkTag = `rotbatk_${player.name.slice(0, 8).replace(/[^a-zA-Z0-9]/g, '')}`;
        const defTag = `rotbdef_${player.name.slice(0, 8).replace(/[^a-zA-Z0-9]/g, '')}`;
        try {
            atkEnt.addTag(atkTag);
            targetEntity.addTag(defTag);
            player.runCommand(
                `execute at @e[tag=${atkTag}] rotated ~ 0 positioned ^-4 ^6 ^-4 run camera @s set minecraft:free ease 0.1 linear pos ~~~ facing @e[tag=${defTag}]`
            );
            system.runTimeout(() => {
                try { player.camera.clear(); } catch { /* player may have left */ }
                try { atkEnt.removeTag(atkTag); } catch { /* entity gone */ }
                try { targetEntity.removeTag(defTag); } catch { /* entity gone */ }
            }, 40);
        } catch { /* Camera errors must never crash the battle */ }
    }
}

// ─── Status / HP sync ──────────────────────────────────────────────────────────

const SHOWDOWN_STATUS_MAP: Record<string, number> = {
    psn: 1, brn: 2, par: 3, slp: 4, frz: 5, tox: 8,
};

function syncEntityCondition(entity: Entity | null, conditionId: number): void {
    if (!entity) return;
    try { if (entity.isValid) setScore(entity, 'condition', conditionId); } catch { /* gone */ }
}

function syncEntityHP(entity: Entity | null, hpStr: string): void {
    if (!entity) return;
    try {
        if (!entity.isValid) return;
        const match = hpStr.match(/^(\d+)/);
        if (match) setScore(entity, 'HP_Low', parseInt(match[1], 10));
    } catch { /* gone */ }
}

// ─── Battle theme ──────────────────────────────────────────────────────────────

function scheduleBattleTheme(player: IPlayer, session: ArenaSession): void {
    if (session.ended) {
        try { player.runCommand('stopsound @s underground.battle_theme'); } catch { /* gone */ }
        return;
    }
    try { if (player.isValid) player.playSound('underground.battle_theme'); } catch { /* gone */ }
    system.runTimeout(() => scheduleBattleTheme(player, session), 1825);
}

// ─── Trainer team reader ───────────────────────────────────────────────────────

/**
 * Read a trainer/gym leader's party from their entity's dynamic property
 * `trainer_party` (JSON array of [id, species, longHand] tuples).
 */
function readEntityTeam(entity: Entity): [number, string, any][] | null {
    try {
        const raw = entity.getDynamicProperty('trainer_party') as string | undefined;
        if (!raw) return null;
        const parsed = JSON.parse(raw) as [number, string, any][];
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
    } catch { return null; }
}

// ─── Battle class ──────────────────────────────────────────────────────────────

export class Battle {
    private session: ArenaSession | null = null;

    /** For catch-rate calculations — current turn number */
    get turn(): number {
        return this.session?.turn ?? 0;
    }

    // ── Public factory methods ──────────────────────────────────────────────────

    /** Player encounters a wild Pokemon entity. */
    static startWild(
        player: IPlayer,
        wildEntity: Entity,
        playerTeam: [number, string, any][] | null
    ): ArenaSession | null {
        if (!playerTeam?.length) {
            player.sendMessage('§cYou have no Pokemon to battle with!');
            return null;
        }
        const wildData    = collectEntityStats(wildEntity);
        const wildSpecies = (wildEntity.typeId as string).replace('pokeworld:wild_', '');
        return Battle.createArena(
            { kind: 'player', player, sideId: 'p1', team: playerTeam },
            { kind: 'wild', entity: wildEntity, sideId: 'p2', team: [[0, wildSpecies, wildData]] }
        );
    }

    /**
     * Player battles a trainer NPC.
     * The trainer entity must expose its party via dynamic property `trainer_party`.
     * The trainer NPC despawns when the battle ends.
     * @param difficulty  0 = RandomPlayerAI, 1–5 = StrongHeuristicsAI (default 0)
     */
    static startTrainer(
        player: IPlayer,
        trainerEntity: Entity,
        playerTeam: [number, string, any][] | null,
        difficulty = 0
    ): ArenaSession | null {
        if (!playerTeam?.length) {
            player.sendMessage('§cYou have no Pokemon to battle with!');
            return null;
        }
        const trainerTeam = readEntityTeam(trainerEntity);
        if (!trainerTeam?.length) {
            player.sendMessage('§cThis trainer has no Pokemon!');
            return null;
        }
        return Battle.createArena(
            { kind: 'player', player, sideId: 'p1', team: playerTeam },
            { kind: 'trainer', entity: trainerEntity, sideId: 'p2', team: trainerTeam, despawnOnEnd: true, difficulty }
        );
    }

    /**
     * Player battles a gym leader NPC.
     * Same as trainer but the NPC entity is NOT removed when the battle ends.
     * @param difficulty  0 = RandomPlayerAI, 1–5 = StrongHeuristicsAI (default 3)
     */
    static startGymLeader(
        player: IPlayer,
        gymLeaderEntity: Entity,
        playerTeam: [number, string, any][] | null,
        difficulty = 3
    ): ArenaSession | null {
        if (!playerTeam?.length) {
            player.sendMessage('§cYou have no Pokemon to battle with!');
            return null;
        }
        const leaderTeam = readEntityTeam(gymLeaderEntity);
        if (!leaderTeam?.length) {
            player.sendMessage('§cThe gym leader has no Pokemon!');
            return null;
        }
        return Battle.createArena(
            { kind: 'player', player, sideId: 'p1', team: playerTeam },
            { kind: 'gymleader', entity: gymLeaderEntity, sideId: 'p2', team: leaderTeam, despawnOnEnd: false, difficulty }
        );
    }

    /** Two players battle each other (PvP). */
    static startPvP(
        player1: IPlayer,
        player2: IPlayer,
        team1: [number, string, any][] | null,
        team2: [number, string, any][] | null
    ): ArenaSession | null {
        if (!team1?.length) { player1.sendMessage('§cYou have no Pokemon to battle with!'); return null; }
        if (!team2?.length) { player2.sendMessage('§cYou have no Pokemon to battle with!'); return null; }
        return Battle.createArena(
            { kind: 'player', player: player1, sideId: 'p1', team: team1 },
            { kind: 'player', player: player2, sideId: 'p2', team: team2 }
        );
    }

    // ── Core arena factory ──────────────────────────────────────────────────────

    private static createArena(
        p1Config: BattlerConfig,
        p2Config: BattlerConfig
    ): ArenaSession | null {
        // Reject if any player is already in a battle
        for (const cfg of [p1Config, p2Config]) {
            if (cfg.kind === 'player') {
                if (Array.from(BATTLES.values()).some(s => s.entityInBattle(cfg.player as any))) {
                    cfg.player.sendMessage('§cYou are already in a battle!');
                    return null;
                }
            }
        }

        const stream  = new BattleStreams.BattleStream();
        const streams = BattleStreams.getPlayerStreams(stream);

        // Build runtime BattlerInfo from config
        const buildBattler = (cfg: BattlerConfig): BattlerInfo => {
            const info: BattlerInfo = {
                kind:         cfg.kind,
                sideId:       cfg.sideId,
                displayName:  cfg.kind === 'player'
                                  ? cfg.player.name
                                  : cfg.kind === 'wild'
                                      ? cfg.entity.typeId.replace('pokeworld:wild_', '')
                                      : (cfg.entity.nameTag || cfg.kind),
                team:         cfg.team,
                activePokemon: new Map(),
            };
            if (cfg.kind === 'player') {
                info.player = cfg.player;
            } else {
                info.entity = cfg.entity;
                // Wild entity IS the deployed Pokemon — pre-populate slot 'a'
                if (cfg.kind === 'wild') info.activePokemon.set('a', cfg.entity);
            }
            if ('despawnOnEnd' in cfg) info.despawnOnEnd = cfg.despawnOnEnd;
            if ('difficulty' in cfg)  info.difficulty   = cfg.difficulty;
            return info;
        };

        const p1 = buildBattler(p1Config);
        const p2 = buildBattler(p2Config);

        const session: ArenaSession = {
            id:          `arena_${Date.now()}_${p1.displayName}`,
            stream,
            battlers:    new Map([['p1', p1], ['p2', p2]]),
            spectators:  new Set(),
            logQueue:    [],
            startTime:   Date.now(),
            ended:       false,
            winner:      null,
            turn:        0,

            entityInBattle(entity: Entity) {
                for (const battler of this.battlers.values()) {
                    if (battler.entity?.id === entity.id) return true;
                    if ((battler.player as any)?.id === entity.id) return true;
                    for (const ent of battler.activePokemon.values()) {
                        if (ent?.id === entity.id) return true;
                    }
                }
                return false;
            },

            end() {
                if (this.ended) return;
                this.ended = true;
                BATTLES.delete(this.id);

                for (const battler of this.battlers.values()) {
                    // Remove all in-world battle Pokemon entities
                    for (const ent of battler.activePokemon.values()) {
                        if (!ent?.isValid) continue;
                        try { ent.removeTag('battle'); } catch { /* ignore */ }
                        try { ent.remove(); } catch { /* ignore */ }
                    }
                    battler.activePokemon.clear();

                    // Stop music for player battlers
                    if (battler.kind === 'player') {
                        try { battler.player?.runCommand('stopsound @s underground.battle_theme'); } catch { /* gone */ }
                    }

                    // Despawn trainer/gym leader NPC if configured to do so
                    if ((battler.kind === 'trainer' || battler.kind === 'gymleader')
                            && battler.despawnOnEnd && battler.entity?.isValid) {
                        try { battler.entity.remove(); } catch { /* ignore */ }
                    }
                }
            },
        };

        BATTLES.set(session.id, session);

        // Start battle music for all player battlers
        for (const battler of session.battlers.values()) {
            if (battler.kind === 'player' && battler.player)
                scheduleBattleTheme(battler.player, session);
        }
        startLogQueueProcessor();

        const p1PackedTeam = p1Config.team.map(([id, sp, data]) => packLongHandToSet(data, sp, `p1_${id}`));
        const p2PackedTeam = p2Config.team.map(([id, sp, data]) => packLongHandToSet(data, sp, `p2_${id}`));

        (async () => {
            try {
                // ── Start the battle ───────────────────────────────────────────
                streams.omniscient.write(`>start ${JSON.stringify({ formatid: BATTLE_FORMAT_ID })}\n`);
                streams.omniscient.write(
                    `>player p1 ${JSON.stringify({ name: p1.displayName, team: packTeamForShowdown(p1PackedTeam) })}\n`
                );
                streams.omniscient.write(
                    `>player p2 ${JSON.stringify({ name: p2.displayName, team: packTeamForShowdown(p2PackedTeam) })}\n`
                );

                // ── Wire up handlers / AI per side ─────────────────────────────
                const streamsBySide: Record<'p1' | 'p2', any> = { p1: streams.p1, p2: streams.p2 };
                for (const [sideKey, battler] of session.battlers) {
                    const side = sideKey as 'p1' | 'p2';
                    if (battler.kind === 'player') {
                        battler.handler = new PlayerBattleHandler(
                            battler.player!,
                            streamsBySide[side],
                            () => streams.omniscient.write('>forcetie\n')
                        );
                        battler.handler.start();
                    } else {
                        // Pick AI based on difficulty: 0 / undefined = random, 1-5 = heuristic
                        const diff = battler.difficulty ?? 0;
                        const ai = diff > 0
                            ? new StrongHeuristicsAI(streamsBySide[side], { difficulty: diff })
                            : new RandomPlayerAI(streamsBySide[side]);
                        ai.start();
                    }
                }

                // ── Announce battle start ──────────────────────────────────────
                const startMsg =
                    p2Config.kind === 'wild'
                        ? `§6§lA wild §e${p2.displayName}§6§l appeared!§r`
                        : p2Config.kind === 'gymleader'
                            ? `§e§lGym Leader §6${p2.displayName}§e§l wants to battle!§r`
                            : p2Config.kind === 'player'
                                ? `§e${p2.displayName}§r wants to battle!`
                                : `§cTrainer §e${p2.displayName}§c wants to battle!§r`;
                session.logQueue.push({ line: startMsg });

                // Camera animation chaining — see comment on nextCameraStartTick below
                let nextCameraStartTick = 0;

                // ── Omniscient stream loop ─────────────────────────────────────
                for await (const chunk of streams.omniscient) {
                    if (session.ended) break;
                    const p2Kind = p2.kind;
                    const lines  = (typeof chunk === 'string' ? chunk : '').split('\n');

                    for (const line of lines) {
                        if (!line.trim()) continue;
                        console.warn(line);
                        if (line === 'update' || line === 'sideupdate' || line === 'end') continue;
                        if (!line.startsWith('|')) continue;

                        const { cmd, args } = parseProtocolLine(line);

                        // ── Turn counter ───────────────────────────────────────
                        if (cmd === 'turn') session.turn = parseInt(args[0] ?? '0', 10) || 0;

                        // ── Switch / drag: update active Pokemon entity ────────
                        if (cmd === 'switch' || cmd === 'drag') {
                            const identStr  = args[0] ?? '';
                            const slotMatch = identStr.match(/^(p[12])([ab])/);
                            if (slotMatch) {
                                const sideId  = slotMatch[1] as 'p1' | 'p2';
                                const slot    = slotMatch[2] as SlotKey;
                                const battler = session.battlers.get(sideId);
                                if (battler) {
                                    const species = (args[1] ?? '').split(',')[0].trim().toLowerCase();
                                    if (battler.kind === 'player' && battler.player) {
                                        const idx = battler.team.findIndex(([, n]) => n.toLowerCase() === species);
                                        if (idx >= 0) {
                                            void spawnPokemon(
                                                battler.player as any,
                                                battler.team[idx] as any,
                                                idx,
                                                false,
                                                (entity) => {
                                                    battler.activePokemon.set(slot, entity);
                                                    entity.addTag('battle');
                                                }
                                            );
                                        }
                                    } else if (battler.kind === 'wild' && battler.entity) {
                                        battler.activePokemon.set(slot, battler.entity);
                                        try { battler.entity.addTag('battle'); } catch { /* ignore */ }
                                    } else if (
                                        (battler.kind === 'trainer' || battler.kind === 'gymleader')
                                        && battler.entity
                                    ) {
                                        // TODO Step 5: spawn the trainer's Pokemon entity at the battle position.
                                        // For now the trainer NPC itself is used as a placeholder so that
                                        // camera, particles, and HP sync have a valid entity reference.
                                        battler.activePokemon.set(slot, battler.entity);
                                        try { battler.entity.addTag('battle'); } catch { /* ignore */ }
                                    }
                                }
                            }
                        }

                        // ── HP sync ────────────────────────────────────────────
                        if (cmd === '-damage' || cmd === '-heal' || cmd === '-sethp') {
                            syncEntityHP(
                                getActiveEntity(session.battlers, args[0] ?? ''),
                                args[1] ?? ''
                            );
                        }

                        // ── Status / condition sync ────────────────────────────
                        if (cmd === '-status') {
                            syncEntityCondition(
                                getActiveEntity(session.battlers, args[0] ?? ''),
                                SHOWDOWN_STATUS_MAP[args[1] ?? ''] ?? 0
                            );
                        }
                        if (cmd === '-curestatus' || cmd === '-cureteam') {
                            syncEntityCondition(getActiveEntity(session.battlers, args[0] ?? ''), 0);
                        }
                        if (cmd === '-start' && (args[1] ?? '').toLowerCase().includes('confusion')) {
                            syncEntityCondition(getActiveEntity(session.battlers, args[0] ?? ''), 6);
                        }
                        if (cmd === '-end' && (args[1] ?? '').toLowerCase().includes('confusion')) {
                            syncEntityCondition(getActiveEntity(session.battlers, args[0] ?? ''), 0);
                        }

                        // ── Camera animation + attack particle on |move| ───────
                        //
                        // Both |move| lines of a turn can arrive in the same stream chunk,
                        // so we chain them: animation 1 starts now (delay=0, 40 ticks reserved),
                        // animation 2 starts at delay=40, etc.
                        if (cmd === 'move') {
                            const now = system.currentTick;
                            if (nextCameraStartTick < now) nextCameraStartTick = now;

                            const delay = nextCameraStartTick - now;
                            nextCameraStartTick += 40;

                            const attackerIdent = args[0] ?? '';
                            const targetIdent   = args[2] ?? '';

                            if (delay === 0) {
                                playBattleCameraAnimation(session, attackerIdent, targetIdent);
                            } else {
                                system.runTimeout(
                                    () => playBattleCameraAnimation(session, attackerIdent, targetIdent),
                                    delay
                                );
                            }

                            // Hold battle menu for all player handlers until animations finish
                            for (const battler of session.battlers.values()) {
                                battler.handler?.setFormHold(nextCameraStartTick - now);
                            }

                            // Spawn attack particle on the target when the camera ends (delay + 40)
                            const moveName = args[1] ?? '';
                            if (moveName && targetIdent && !targetIdent.startsWith('[')) {
                                const typeNum  = MOVE_TYPE_MAP.get(moveName.toLowerCase()) ?? 0;
                                const typeName = (TypeList[typeNum] as string | undefined) ?? 'None';
                                const particle = ATTACK_PARTICLES[typeName] ?? '';
                                if (particle) {
                                    const entitySnap = getActiveEntity(session.battlers, targetIdent);
                                    if (entitySnap) {
                                        system.runTimeout(() => {
                                            try {
                                                if (entitySnap.isValid)
                                                    entitySnap.dimension.spawnParticle(particle, entitySnap.location);
                                            } catch { /* ignore */ }
                                        }, delay + 40);
                                    }
                                }
                            }
                        }

                        // ── Log to chat ────────────────────────────────────────
                        const formatted = formatProtocolLine(line, p2Kind);
                        if (formatted) session.logQueue.push({ line: formatted });

                        // ── Battle end ─────────────────────────────────────────
                        if (cmd === 'win') {
                            session.winner = args[0] ?? null;
                            // Send personalised win/lose messages directly (different per player in PvP)
                            for (const battler of session.battlers.values()) {
                                if (battler.kind === 'player' && battler.player?.isValid) {
                                    const isWinner = session.winner === battler.player.name;
                                    battler.player.sendMessage(
                                        isWinner ? '§a§lYou won the battle!§r' : '§c§lYou lost the battle...§r'
                                    );
                                }
                            }
                            // Empty entry — fires end() after the current queue drains
                            session.logQueue.push({ line: '', onSent: () => session.end() });
                        }
                        if (cmd === 'tie') {
                            session.logQueue.push({
                                line: '§7The battle ended in a tie.§r',
                                onSent: () => session.end(),
                            });
                        }
                    }
                }
            } catch (err) {
                console.warn('[Battle] Stream error:', err);
                session.end();
            }
        })();

        // Safety-net timeout
        system.runTimeout(() => {
            if (!session.ended && Date.now() - session.startTime > BATTLE_TIMEOUT_MS)
                session.end();
        }, BATTLE_TIMEOUT_MS / 50);

        return session;
    }

    entityInBattle(entity: Entity): boolean {
        return this.session?.entityInBattle(entity) ?? false;
    }

    end(): void {
        this.session?.end();
    }
}

// ─── Utility exports ───────────────────────────────────────────────────────────

/** Find the active ArenaSession for a player by name (across all battle types). */
export function getBattleSessionForPlayer(playerName: string): ArenaSession | null {
    for (const session of BATTLES.values()) {
        for (const battler of session.battlers.values()) {
            if (battler.kind === 'player' && battler.player?.name === playerName) return session;
        }
    }
    return null;
}

/** Thin wrapper for catch-rate code that needs the current turn number. */
export function getBattleForCatch(playerName: string): { turn: number } {
    return { turn: getBattleSessionForPlayer(playerName)?.turn ?? 0 };
}

/** Extract a valid (alive) party from the PC selection map. */
export function getPlayerTeamFromSelected(
    selected: Record<string, Record<number, [id: number, name: string, data: longHand]>>,
    playerName: string
): [number, string, any][] | null {
    const team = selected[playerName];
    if (!team) return null;
    const result: [number, string, any][] = [];
    for (let i = 0; i < 6; i++) {
        const slot = team[i];
        if (slot && slot[2]?.Base_Health && (slot[2].Current_Health ?? slot[2].Base_Health) > 0)
            result.push([slot[0], slot[1], slot[2]]);
    }
    return result.length > 0 ? result : null;
}
