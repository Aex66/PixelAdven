/**
 * Central battle controller — manages BattleStream, protocol interpretation,
 * and battle lifecycle.
 *
 * Battle participants are represented by Battler subclasses:
 *   PlayerBattler  — real Minecraft player (shows UI, spawns Pokemon entity)
 *   WildBattler    — wild Pokemon entity (RandomPlayerAI)
 *   TrainerBattler — trainer or gym leader NPC (configurable AI difficulty)
 *
 * This file only contains orchestration logic.
 * All battler-specific behaviour lives in the respective class.
 */
import { Player as IPlayer, Entity, system } from '@minecraft/server';
import { BattleStreams } from '../simulator.js';
import { BATTLE_FORMAT_ID } from '../formats.js';
import { packLongHandToSet, packTeamForShowdown } from '../teamPacker.js';
import { setScore } from '../utils.js';
import { longHand } from '../../Pokemon Database/@types/types.js';
import pokemonMoves from '../../../Letters/pokemon/moves.js';
import TypeList from '../../../Letters/pokemon/TypeList.js';
import { Battler, BattlerKind, SlotKey } from './Battlers/Battler.js';
import { PlayerBattler } from './Battlers/PlayerBattler.js';
import { WildBattler } from './Battlers/WildBattler.js';
import { TrainerBattler } from './Battlers/TrainerBattler.js';

export type { BattlerKind, SlotKey } from './Battlers/Battler.js';

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

// Lowercase move display-name → type index; populated once at module load.
const MOVE_TYPE_MAP = new Map<string, number>(
    Object.entries(pokemonMoves as Record<string, { type: number }>)
        .map(([name, data]) => [name.toLowerCase(), data.type])
);

// ─── Timing constants ──────────────────────────────────────────────────────────

const LOG_QUEUE_INTERVAL_TICKS = 20;           // 1 second per log line
const BATTLE_TIMEOUT_MS        = 30 * 60 * 1000; // 30-minute safety net

// ─── Session ───────────────────────────────────────────────────────────────────

export interface ArenaSession {
    readonly id: string;
    readonly stream: InstanceType<typeof BattleStreams.BattleStream>;
    readonly battlers: Map<'p1' | 'p2', Battler>;
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
    if (entry.line) {
        for (const battler of session.battlers.values()) {
            if (battler instanceof PlayerBattler && battler.player?.isValid)
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

function formatProtocolLine(line: string, p2Kind: BattlerKind = 'wild'): string | null {
    const { cmd, args } = parseProtocolLine(line);
    switch (cmd) {
        case 'turn':
            return `§8§m            §r §7Turn ${args[0]}§r §8§m            §r`;
        case 'move': {
            const user   = cleanIdent(args[0] ?? '');
            const move   = args[1] ?? '?';
            const target = args[2] ? ` on §e${cleanIdent(args[2])}§r` : '';
            return `§e${user}§r used §b${move}§r${target}!`;
        }
        case 'switch':
        case 'drag': {
            const details  = args[1] ?? '';
            const species  = details.split(',')[0] ?? cleanIdent(args[0] ?? '');
            const isP1     = (args[0] ?? '').startsWith('p1');
            if (isP1) return `§aGo, §e${species}§a!§r`;
            return p2Kind === 'wild'
                ? `§cA wild §e${species}§c appeared!§r`
                : `§e${species}§r was sent out!`;
        }
        case '-damage':
            return `§c${cleanIdent(args[0] ?? '')}§r lost HP! §7(${parseHP(args[1] ?? '')})§r`;
        case '-heal':
            return `§a${cleanIdent(args[0] ?? '')}§r recovered HP! §7(${parseHP(args[1] ?? '')})§r`;
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
            const poke   = cleanIdent(args[0] ?? '');
            const status = STATUS_NAMES[args[1] ?? ''] ?? args[1] ?? '';
            return `§e${poke}§r ${status}`;
        }
        case '-curestatus':
            return `§a${cleanIdent(args[0] ?? '')}§r cured its status!`;
        case '-boost':
            return `§e${cleanIdent(args[0] ?? '')}§r's §b${args[1] ?? '?'}§r rose by ${args[2] ?? '?'}!`;
        case '-unboost':
            return `§e${cleanIdent(args[0] ?? '')}§r's §c${args[1] ?? '?'}§r fell by ${args[2] ?? '?'}!`;
        case '-weather': {
            const w: Record<string, string> = {
                RainDance: '§9Rain started falling.§r',
                Sandstorm: '§6A sandstorm kicked up.§r',
                SunnyDay:  '§eThe sunlight turned harsh.§r',
                Hail:      '§bIt started to hail.§r',
                none:      '§7The weather cleared up.§r',
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
        case 'player': case 'teamsize': case 'gametype': case 'gen': case 'tier':
        case 'rule': case 'start': case 't:': case 'upkeep': case '-nothing':
        case 'clearpoke': case 'poke': case 'teampreview': case 'request': case '':
            return null;
        default:
            return null;
    }
}

// ─── Entity / sync helpers ─────────────────────────────────────────────────────

/**
 * Resolve a Showdown ident string (e.g. "p1a: Pikachu") to the in-world
 * entity for that slot, or null if not yet spawned.
 */
function getActiveEntity(battlers: Map<'p1' | 'p2', Battler>, identStr: string): Entity | null {
    const match = identStr.match(/^(p[12])([ab])/);
    if (!match) return null;
    return battlers.get(match[1] as 'p1' | 'p2')?.activePokemon.get(match[2] as SlotKey) ?? null;
}

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

// ─── Camera animation ──────────────────────────────────────────────────────────

function playBattleCameraAnimation(
    session: ArenaSession,
    attackerIdent: string,
    targetIdent: string
): void {
    const attackerEntity = getActiveEntity(session.battlers, attackerIdent);
    const targetEntity   = getActiveEntity(session.battlers, targetIdent);
    if (!targetEntity?.isValid) return;

    for (const battler of session.battlers.values()) {
        if (!(battler instanceof PlayerBattler) || !battler.player?.isValid) continue;
        const player = battler.player;
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
                try { player.camera.clear(); } catch { /* gone */ }
                try { atkEnt.removeTag(atkTag); } catch { /* gone */ }
                try { targetEntity.removeTag(defTag); } catch { /* gone */ }
            }, 40);
        } catch { /* Camera errors must never crash the battle */ }
    }
}

// ─── Trainer team reader ───────────────────────────────────────────────────────

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

    get turn(): number { return this.session?.turn ?? 0; }

    // ── Factory methods ─────────────────────────────────────────────────────────

    static startWild(
        player: IPlayer,
        wildEntity: Entity,
        playerTeam: [number, string, any][] | null
    ): ArenaSession | null {
        if (!playerTeam?.length) {
            player.sendMessage('§cYou have no Pokemon to battle with!');
            return null;
        }
        return Battle.createArena(
            new PlayerBattler(player, 'p1', playerTeam),
            new WildBattler(wildEntity, 'p2')
        );
    }

    /**
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
            new PlayerBattler(player, 'p1', playerTeam),
            new TrainerBattler(trainerEntity, 'trainer', 'p2', trainerTeam, {
                despawnOnEnd: true,
                difficulty,
            })
        );
    }

    /**
     * Gym leaders do not despawn on battle end.
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
            new PlayerBattler(player, 'p1', playerTeam),
            new TrainerBattler(gymLeaderEntity, 'gymleader', 'p2', leaderTeam, {
                despawnOnEnd: false,
                difficulty,
            })
        );
    }

    static startPvP(
        player1: IPlayer,
        player2: IPlayer,
        team1: [number, string, any][] | null,
        team2: [number, string, any][] | null
    ): ArenaSession | null {
        if (!team1?.length) { player1.sendMessage('§cYou have no Pokemon to battle with!'); return null; }
        if (!team2?.length) { player2.sendMessage('§cYou have no Pokemon to battle with!'); return null; }
        return Battle.createArena(
            new PlayerBattler(player1, 'p1', team1),
            new PlayerBattler(player2, 'p2', team2)
        );
    }

    // ── Core arena factory ──────────────────────────────────────────────────────

    private static createArena(p1: Battler, p2: Battler): ArenaSession | null {
        // Reject if any player battler is already in a battle.
        for (const battler of [p1, p2]) {
            if (battler instanceof PlayerBattler) {
                if (Array.from(BATTLES.values()).some(s => s.entityInBattle(battler.player as any))) {
                    battler.player.sendMessage('§cYou are already in a battle!');
                    return null;
                }
            }
        }

        const stream  = new BattleStreams.BattleStream();
        const streams = BattleStreams.getPlayerStreams(stream);

        const session: ArenaSession = {
            id:         `arena_${Date.now()}_${p1.displayName}`,
            stream,
            battlers:   new Map<'p1' | 'p2', Battler>([['p1', p1], ['p2', p2]]),
            spectators: new Set(),
            logQueue:   [],
            startTime:  Date.now(),
            ended:      false,
            winner:     null,
            turn:       0,

            entityInBattle(entity: Entity): boolean {
                for (const battler of this.battlers.values()) {
                    if (battler.ownsEntity(entity)) return true;
                }
                return false;
            },

            end(): void {
                if (this.ended) return;
                this.ended = true;
                BATTLES.delete(this.id);
                // Each battler handles its own cleanup (music stop, entity removal,
                // NPC despawn) via onEnd().
                for (const battler of this.battlers.values()) {
                    battler.onEnd(this.winner);
                }
            },
        };

        BATTLES.set(session.id, session);

        // Start battle music for all player battlers.
        for (const battler of session.battlers.values()) {
            if (battler instanceof PlayerBattler)
                scheduleBattleTheme(battler.player, session);
        }
        startLogQueueProcessor();

        const p1PackedTeam = p1.team.map(([id, sp, data]) => packLongHandToSet(data, sp, `p1_${id}`));
        const p2PackedTeam = p2.team.map(([id, sp, data]) => packLongHandToSet(data, sp, `p2_${id}`));

        (async () => {
            try {
                // ── Start the Showdown battle ──────────────────────────────────
                streams.omniscient.write(`>start ${JSON.stringify({ formatid: BATTLE_FORMAT_ID })}\n`);
                streams.omniscient.write(
                    `>player p1 ${JSON.stringify({ name: p1.displayName, team: packTeamForShowdown(p1PackedTeam) })}\n`
                );
                streams.omniscient.write(
                    `>player p2 ${JSON.stringify({ name: p2.displayName, team: packTeamForShowdown(p2PackedTeam) })}\n`
                );

                // ── Wire battlers to their player streams ──────────────────────
                const streamsBySide: Record<'p1' | 'p2', any> = {
                    p1: streams.p1,
                    p2: streams.p2,
                };
                const onRun = () => streams.omniscient.write('>forcetie\n');
                for (const [sideKey, battler] of session.battlers) {
                    battler.start(streamsBySide[sideKey as 'p1' | 'p2'], onRun);
                }

                // ── Announce battle start ──────────────────────────────────────
                const startMsg =
                    p2.kind === 'wild'      ? `§6§lA wild §e${p2.displayName}§6§l appeared!§r`
                  : p2.kind === 'gymleader' ? `§e§lGym Leader §6${p2.displayName}§e§l wants to battle!§r`
                  : p2.kind === 'player'    ? `§e${p2.displayName}§r wants to battle!`
                  :                          `§cTrainer §e${p2.displayName}§c wants to battle!§r`;
                session.logQueue.push({ line: startMsg });

                // Camera animation chaining — see comment on nextCameraStartTick below.
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

                        // ── Switch / drag ──────────────────────────────────────
                        // Delegate completely to each battler class.
                        if (cmd === 'switch' || cmd === 'drag') {
                            const identStr  = args[0] ?? '';
                            const slotMatch = identStr.match(/^(p[12])([ab])/);
                            if (slotMatch) {
                                const sideId  = slotMatch[1] as 'p1' | 'p2';
                                const slot    = slotMatch[2] as SlotKey;
                                const battler = session.battlers.get(sideId);
                                if (battler) {
                                    const species = (args[1] ?? '').split(',')[0].trim().toLowerCase();
                                    battler.onSwitch(slot, species);
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
                        // Both |move| lines of a turn can arrive in the same chunk.
                        // We chain animations: animation 1 starts at delay=0 (40 ticks reserved),
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

                            // Hold battle menu for all player battlers until animations finish.
                            for (const battler of session.battlers.values()) {
                                battler.setFormHold(nextCameraStartTick - now);
                            }

                            // Spawn attack particle on the target when the camera ends (delay + 40).
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
                            // Send personalised win/lose messages to each player battler.
                            for (const battler of session.battlers.values()) {
                                if (battler instanceof PlayerBattler && battler.player?.isValid) {
                                    const isWinner = session.winner === battler.player.name;
                                    battler.player.sendMessage(
                                        isWinner
                                            ? '§a§lYou won the battle!§r'
                                            : '§c§lYou lost the battle...§r'
                                    );
                                }
                            }
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

        // Safety-net timeout.
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

export function getBattleSessionForPlayer(playerName: string): ArenaSession | null {
    for (const session of BATTLES.values()) {
        for (const battler of session.battlers.values()) {
            if (battler instanceof PlayerBattler && battler.player?.name === playerName)
                return session;
        }
    }
    return null;
}

export function getBattleForCatch(playerName: string): { turn: number } {
    return { turn: getBattleSessionForPlayer(playerName)?.turn ?? 0 };
}

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
