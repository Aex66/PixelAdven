/**
 * Central battle controller - manages BattleStream, protocol interpretation, and battle lifecycle.
 */
import { Player as IPlayer, Entity, system } from '@minecraft/server';
import { BattleStreams, RandomPlayerAI } from '../simulator.js';
import { BATTLE_FORMAT_ID } from '../formats.js';
import { packLongHandToSet, packTeamForShowdown } from '../teamPacker.js';
import { PlayerBattleHandler } from './PlayerBattleHandler.js';
import { collectEntityStats, spawnPokemon } from '../../Pokemon Calculations/spawn.js';
import { setScore } from '../utils.js';
import { longHand, pokeballs } from '../../Pokemon Database/@types/types.js';
import pokemonMoves from '../../../Letters/pokemon/moves.js';
import TypeList from '../../../Letters/pokemon/TypeList.js';

const ATTACK_PARTICLES: Record<string, string> = {
    None:     '',
    Fire:     'pokeworld:fire_attack',
    Water:    'pokeworld:water_attack',
    Normal:   '',
    Electric: 'pokeworld:electric_attack',
    Grass:    'pokeworld:grass_attack',
    Ground:   'pokeworld:ground_attack',
    Rock:     'pokeworld:rock_attack',
    Ice:      'pokeworld:ice_attack',
    Fighting: 'pokeworld:fighting_attack',
    Poison:   'pokeworld:poison_attack',
    Ghost:    'pokeworld:ghost_attack',
    Psychic:  'pokeworld:psychic_attack',
    Dragon:   'pokeworld:dragon_attack',
    Fairy:    'pokeworld:fairy_attack',
    Steel:    'pokeworld:steel_attack',
    Dark:     'pokeworld:dark_attack',
    Bug:      'pokeworld:bug_attack',
    Flying:   'pokeworld:flying_attack',
};

// Pre-built lookup: lowercase display name → type index (populated once at module load)
const MOVE_TYPE_MAP = new Map<string, number>(
    Object.entries(pokemonMoves as Record<string, { type: number }>)
        .map(([name, data]) => [name.toLowerCase(), data.type])
);

export const BATTLES = new Map<string, ArenaSession>();

const LOG_QUEUE_INTERVAL_MS = 1000;
const BATTLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 min
const AI_DELAY_MS_MIN = 2000;
const AI_DELAY_MS_MAX = 4000;

export interface ArenaSession {
    readonly id: string;
    readonly stream: InstanceType<typeof BattleStreams.BattleStream>;
    readonly participants: Map<string, Combatant>;
    readonly spectators: Set<IPlayer>;
    readonly logQueue: LogEntry[];
    readonly pendingRequests: Map<string, unknown>;
    startTime: number;
    ended: boolean;
    winner: string | null;
    turn: number;
    /** The player's currently active Pokemon entity spawned in the world for the battle */
    playerPokemonEntity: Entity | null;
    entityInBattle(entity: Entity): boolean;
    end(): void;
}

interface LogEntry {
    line: string;
    onSent?: () => void;
}

type Combatant = PlayerCombatant | WildCombatant;

interface PlayerCombatant {
    type: 'player';
    player: IPlayer;
    sideId: string;
    team: [number, string, any][];
}

interface WildCombatant {
    type: 'wild';
    entity: Entity;
    sideId: string;
    team: [number, string, any][];
}

let logQueueInterval: number | null = null;

function processLogQueue(session: ArenaSession): void {
    if (session.logQueue.length === 0) return;
    const entry = session.logQueue.shift()!;
    for (const [_, combatant] of session.participants) {
        if (combatant.type === 'player') {
            combatant.player.sendMessage(`§7${entry.line}`);
        }
    }
    for (const spec of session.spectators) {
        spec.sendMessage(`§7${entry.line}`);
    }
    entry.onSent?.();
}

function startLogQueueProcessor(): void {
    if (logQueueInterval != null) return;
    logQueueInterval = system.runInterval(() => {
        for (const session of BATTLES.values()) {
            if (!session.ended) processLogQueue(session);
        }
    }, LOG_QUEUE_INTERVAL_MS / 50); // 50ms per tick, 1000ms = 20 ticks
}

function parseProtocolLine(line: string): { cmd: string; args: string[] } {
    if (!line.startsWith('|')) return { cmd: '', args: [] };
    const parts = line.slice(1).split('|');
    return { cmd: parts[0] ?? '', args: parts.slice(1) };
}

/** Strip "p1a: " / "p2a: " prefix from Pokemon ident strings */
function cleanIdent(ident: string): string {
    return ident.replace(/^p\da?: /i, '');
}

/** Parse condition string into HP fraction display "189/267" → "189/267" */
function parseHP(condition: string): string {
    if (!condition || condition === '0 fnt') return '§c0 HP§r';
    return condition.split(' ')[0] ?? condition;
}

/** Status code → short display */
const STATUS_NAMES: Record<string, string> = {
    par: '§e[PAR]§r', brn: '§6[BRN]§r', psn: '§5[PSN]§r',
    tox: '§5[TOX]§r', slp: '§8[SLP]§r', frz: '§b[FRZ]§r',
};

/**
 * Convert a Showdown protocol line to a human-readable chat message.
 * Returns null for lines that should be silently ignored.
 */
function formatProtocolLine(line: string): string | null {
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
            const ident = cleanIdent(args[0] ?? '');
            const details = args[1] ?? '';
            const species = details.split(',')[0] ?? ident;
            const isP1 = (args[0] ?? '').startsWith('p1');
            return isP1
                ? `§aGo, §e${species}§a!§r`
                : `§cWild §e${species}§c appeared!§r`;
        }
        case '-damage': {
            const poke = cleanIdent(args[0] ?? '');
            const hp = parseHP(args[1] ?? '');
            return `§c${poke}§r lost HP! §7(${hp})§r`;
        }
        case '-heal': {
            const poke = cleanIdent(args[0] ?? '');
            const hp = parseHP(args[1] ?? '');
            return `§a${poke}§r recovered HP! §7(${hp})§r`;
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
        case '-curestatus': {
            const poke = cleanIdent(args[0] ?? '');
            return `§a${poke}§r cured its status!`;
        }
        case '-boost': {
            const poke = cleanIdent(args[0] ?? '');
            const stat = args[1] ?? '?'; const amount = args[2] ?? '?';
            return `§e${poke}§r's §b${stat}§r rose by ${amount}!`;
        }
        case '-unboost': {
            const poke = cleanIdent(args[0] ?? '');
            const stat = args[1] ?? '?'; const amount = args[2] ?? '?';
            return `§e${poke}§r's §c${stat}§r fell by ${amount}!`;
        }
        case '-weather': {
            const w: Record<string, string> = {
                RainDance: '§9Rain started falling.§r',
                Sandstorm: '§6A sandstorm kicked up.§r',
                SunnyDay: '§eThe sunlight turned harsh.§r',
                Hail: '§bIt started to hail.§r',
                none: '§7The weather cleared up.§r',
            };
            return w[args[0] ?? ''] ?? null;
        }
        case 'win':
            return `§a§l${args[0]}§r §awon the battle!§r`;
        case 'tie':
            return `§7The battle ended in a tie.§r`;
        case 'cant':
            return `§e${cleanIdent(args[0] ?? '')}§r can't move! §7(${args[1] ?? ''})§r`;
        case '-item': {
            const poke = cleanIdent(args[0] ?? '');
            return `§e${poke}§r is holding §b${args[1] ?? '?'}§r!`;
        }
        case '-ability': {
            const poke = cleanIdent(args[0] ?? '');
            return `§e${poke}§r's ability: §b${args[1] ?? '?'}§r`;
        }
        // Silently ignore setup/metadata lines
        case 'player': case 'teamsize': case 'gametype': case 'gen':
        case 'tier': case 'rule': case 'start': case 't:':
        case 'upkeep': case '-nothing': case 'clearpoke': case 'poke':
        case 'teampreview': case 'request': case '':
            return null;
        default:
            return null; // Ignore unknown protocol lines by default
    }
}

/**
 * Play a 40-tick camera animation focused on the battle.
 * Uses player's spawned Pokemon entity (playerPokemon) for accurate positioning.
 * Falls back to the player entity if the Pokemon hasn't spawned yet.
 *
 * When the player attacks: camera behind playerPokemon, facing wild.
 * When the wild attacks:   camera behind wild, facing playerPokemon.
 */
function playCameraAnimation(
    player: IPlayer,
    playerPokemon: Entity | null,
    wildEntity: Entity,
    isP1Attacker: boolean
): void {
    const wildTag      = `rotbw_${player.name.slice(0, 8).replace(/[^a-zA-Z0-9]/g, '')}`;
    const playerPkTag  = `rotbp_${player.name.slice(0, 8).replace(/[^a-zA-Z0-9]/g, '')}`;
    const hasPlayerPk  = !!(playerPokemon && playerPokemon.isValid);

    try {
        wildEntity.addTag(wildTag);

        if (isP1Attacker) {
            if (hasPlayerPk) {
                // Camera: behind the player's Pokemon, facing the wild
                playerPokemon!.addTag(playerPkTag);
                player.runCommand(
                    `execute at @e[tag=${playerPkTag}] rotated ~ 0 positioned ^-4 ^6 ^-4 run camera @s set minecraft:free ease 0.1 linear pos ~~~ facing @e[tag=${wildTag}]`
                );
            } else {
                // Fallback: behind the player themselves, facing the wild
                player.runCommand(
                    `execute at @s rotated ~ 0 positioned ^-4 ^6 ^-4 run camera @s set minecraft:free ease 0.1 linear pos ~~~ facing @e[tag=${wildTag}]`
                );
            }
        } else {
            // Camera: behind the wild, facing the player's Pokemon (or the player)
            const facingLoc = hasPlayerPk ? playerPokemon!.location : player.location;
            player.runCommand(
                `execute at @e[tag=${wildTag}] rotated ~ 0 positioned ^-4 ^6 ^-4 run camera @s set minecraft:free ease 0.1 linear pos ~~~ facing ${facingLoc.x.toFixed(2)} ${(facingLoc.y + 1).toFixed(2)} ${facingLoc.z.toFixed(2)}`
            );
        }

        system.runTimeout(() => {
            try { player.camera.clear(); } catch { /* player may have left */ }
            try { wildEntity.removeTag(wildTag); } catch { /* entity may be gone */ }
            try { if (hasPlayerPk) playerPokemon!.removeTag(playerPkTag); } catch { /* entity may be gone */ }
        }, 40);
    } catch {
        // Camera errors must never crash the battle
    }
}

// Maps Showdown status identifiers to the addon's StatusEffects numeric IDs.
// "tox" (badly poisoned) is distinct from "psn" in Showdown but maps to BadlyPoisoned (8).
const SHOWDOWN_STATUS_MAP: Record<string, number> = {
    psn: 1, // Poisoned
    brn: 2, // Burned
    par: 3, // Paralyzed
    slp: 4, // Sleep
    frz: 5, // Frozen
    tox: 8, // BadlyPoisoned
};

/**
 * Writes a condition ID to the entity's "condition" scoreboard objective.
 * Pass 0 to clear (cured / no status).
 */
function syncEntityCondition(entity: Entity | null, conditionId: number): void {
    if (!entity) return;
    try {
        if (entity.isValid) setScore(entity, 'condition', conditionId);
    } catch { /* entity may have despawned */ }
}

/**
 * Parses a Showdown HP string (e.g. "89/267 psn", "0 fnt") and writes the
 * current HP to the entity's HP_Low scoreboard objective so the in-game UI bar
 * stays in sync with Showdown's authoritative values.
 */
function syncEntityHP(entity: Entity | null, hpStr: string): void {
    if (!entity) return;
    try {
        if (!entity.isValid) return;
        // "89/267 psn"  →  current = 89
        // "0 fnt"       →  fainted, set 0
        const match = hpStr.match(/^(\d+)/);
        if (!match) return;
        const current = parseInt(match[1], 10);
        setScore(entity, 'HP_Low', current);
    } catch { /* entity may have despawned */ }
}

/**
 * Plays the battle theme for a player and reschedules itself every 1825 ticks
 * until the session ends, at which point it stops the sound.
 */
function scheduleBattleTheme(player: IPlayer, session: ArenaSession): void {
    if (session.ended) {
        try { player.runCommand('stopsound @s underground.battle_theme'); } catch { /* player may have left */ }
        return;
    }
    try {
        if (player.isValid) player.playSound('underground.battle_theme');
    } catch { /* player may have left */ }
    system.runTimeout(() => scheduleBattleTheme(player, session), 1825);
}

export class Battle {
    private session: ArenaSession | null = null;
    /** For catch compatibility - current turn number */
    get turn(): number {
        return this.session?.turn ?? 0;
    }

    /** Start a wild battle: player vs wild Pokemon entity. Team must be provided by caller to avoid circular deps. */
    static startWild(
        player: IPlayer,
        wildEntity: Entity,
        playerTeam: [id: number, name: string, data: longHand][] | null
    ): ArenaSession | null {
        if (!playerTeam || playerTeam.length === 0) {
            player.sendMessage('§cYou have no Pokemon to battle with!');
            return null;
        }


        const wildData = collectEntityStats(wildEntity);
        const wildSpecies = (wildEntity.typeId as string).replace('pokeworld:wild_', '');
        const wildTeam: [number, string, any][] = [[0, wildSpecies, wildData]];

        return Battle.createArena(player, playerTeam, wildEntity, wildTeam);
    }

    /** Create arena with player team vs opponent team */
    private static createArena(
        player: IPlayer,
        playerTeam: [id: number, name: string, data: longHand][],
        opponent: Entity,
        opponentTeam: [id: number, name: string, data: longHand][]
    ): ArenaSession | null {
        if (Array.from(BATTLES.values()).some(battle => battle.entityInBattle(player))) {
            player.sendMessage('§cYou are already in a battle!');
            return null;
        }

        const stream = new BattleStreams.BattleStream();
        const streams = BattleStreams.getPlayerStreams(stream);

        const session: ArenaSession = {
            id: `arena_${Date.now()}_${player.name}`,
            stream,
            participants: new Map(),
            spectators: new Set(),
            logQueue: [],
            pendingRequests: new Map(),
            startTime: Date.now(),
            ended: false,
            winner: null,
            turn: 0,
            playerPokemonEntity: null,
            entityInBattle(entity: Entity) {
                return this.participants.has(entity.id);
            },
            end() {
                if (this.ended) return;
                this.ended = true;
                BATTLES.delete(this.id);
                // Despawn the player's battle pokemon entity
                try {
                    if (this.playerPokemonEntity && this.playerPokemonEntity.isValid) {
                        this.playerPokemonEntity.remove();
                    }
                } catch { /* already gone */ }
                this.playerPokemonEntity = null;
                // Stop battle theme for the player
                try { player.runCommand('stopsound @s underground.battle_theme'); } catch { /* player may have left */ }
                // Despawn wild entity (for trainers/gym leaders this will be handled separately)
                try {
                    if (opponent && typeof (opponent as Entity).remove === 'function') {
                        try { (opponent as Entity).removeTag('battle'); } catch { /* tag may not exist */ }
                        (opponent as Entity).remove();
                    }
                } catch { /* despawned */ }
            },
        };

        const playerCombatant: PlayerCombatant = {
            type: 'player',
            player,
            sideId: 'p1',
            team: playerTeam,
        };
        const wildCombatant: WildCombatant = {
            type: 'wild',
            entity: opponent,
            sideId: 'p2',
            team: opponentTeam,
        };

        session.participants.set(player.id, playerCombatant);
        session.participants.set(opponent.id, wildCombatant);

        BATTLES.set(session.id, session);
        scheduleBattleTheme(player, session);
        startLogQueueProcessor();

        const p1Team = playerTeam.map(([id, species, data]) =>
            packLongHandToSet(data, species, `p1_${id}`)
        );
        const p2Team = opponentTeam.map(([id, species, data]) =>
            packLongHandToSet(data, species, `p2_${id}`)
        );

        (async () => {
            try {
                const spec = { formatid: BATTLE_FORMAT_ID };
                streams.omniscient.write(`>start ${JSON.stringify(spec)}\n`);
                streams.omniscient.write(
                    `>player p1 ${JSON.stringify({ name: player.name, team: packTeamForShowdown(p1Team) })}\n`
                );
                streams.omniscient.write(
                    `>player p2 ${JSON.stringify({ name: 'Wild', team: packTeamForShowdown(p2Team) })}\n`
                );

                // Wild AI: random choices with natural delay
                const wildAI = new RandomPlayerAI(streams.p2);
                wildAI.start();

                // Player: show Minecraft UI forms for choices
                const playerHandler = new PlayerBattleHandler(
                    player,
                    streams.p1,
                    () => {
                        // Run Away - end battle as tie
                        streams.omniscient.write('>forcetie\n');
                    }
                );
                playerHandler.start();

                // Announce battle start
                const wildSpeciesName = opponentTeam[0]?.[1] ?? 'Wild Pokemon';
                session.logQueue.push({
                    line: `§6§lA wild §e${wildSpeciesName}§6§l appeared!§r`,
                });

                // Tracks when the next camera animation slot is free (in game ticks).
                // Multiple |move| lines can arrive in the same stream chunk, so we chain
                // them: animation 1 starts now, animation 2 starts 40 ticks later, etc.
                let nextCameraStartTick = 0;

                for await (const chunk of streams.omniscient) {
                    if (session.ended) break;
                    const lines = (typeof chunk === 'string' ? chunk : '').split('\n');
                    for (const line of lines) {
                        if (!line.trim()) continue;
                        console.warn(line);
                        if (line === 'update' || line === 'sideupdate' || line === 'end') continue;
                        if (line.startsWith('|')) {
                            const { cmd, args } = parseProtocolLine(line);

                            // Track turn number
                            if (cmd === 'turn') session.turn = parseInt(args[0] ?? '0', 10) || 0;

                            // Spawn / swap player's Pokemon entity on switch events (including battle start)
                            if ((cmd === 'switch' || cmd === 'drag') && (args[0] ?? '').startsWith('p1')) {
                                const species = (args[1] ?? '').split(',')[0].trim().toLowerCase();
                                const idx = playerTeam.findIndex(([, name]) => name.toLowerCase() === species);
                                if (idx >= 0) {
                                    // spawnPokemon handles despawning the previous entity automatically
                                    void spawnPokemon(player as any, playerTeam[idx] as any, idx, false, (entity) => {
                                        session.playerPokemonEntity = entity;
                                        entity.addTag('battle');
                                    });
                                }
                            }

                            // Tag the opponent's active pokemon entity on switch (works for any battle type)
                            // For wild battles the opponent IS the pokemon; for trainers it will be their deployed entity
                            if ((cmd === 'switch' || cmd === 'drag') && (args[0] ?? '').startsWith('p2')) {
                                const p2 = session.participants.get(opponent.id);
                                const pokemonEntity = (p2 as WildCombatant)?.entity ?? opponent;
                                try { pokemonEntity.addTag('battle'); } catch { /* entity may not be ready */ }
                            }

                            // Sync HP_Low scoreboard on damage / heal / sethp
                            if (cmd === '-damage' || cmd === '-heal' || cmd === '-sethp') {
                                const isP1 = (args[0] ?? '').startsWith('p1');
                                const entity = isP1 ? session.playerPokemonEntity : opponent;
                                syncEntityHP(entity, args[1] ?? '');
                            }

                            // Sync "condition" scoreboard when a status is applied or cured
                            if (cmd === '-status') {
                                const isP1   = (args[0] ?? '').startsWith('p1');
                                const entity = isP1 ? session.playerPokemonEntity : opponent;
                                const id     = SHOWDOWN_STATUS_MAP[args[1] ?? ''] ?? 0;
                                syncEntityCondition(entity, id);
                            }
                            if (cmd === '-curestatus') {
                                const isP1   = (args[0] ?? '').startsWith('p1');
                                const entity = isP1 ? session.playerPokemonEntity : opponent;
                                syncEntityCondition(entity, 0);
                            }
                            if (cmd === '-cureteam') {
                                // Cures the whole team of the affected side — clear the active pokemon
                                const isP1   = (args[0] ?? '').startsWith('p1');
                                const entity = isP1 ? session.playerPokemonEntity : opponent;
                                syncEntityCondition(entity, 0);
                            }
                            // Volatile: confusion (|-start|POKEMON|confusion / |-end|POKEMON|confusion)
                            if (cmd === '-start' && (args[1] ?? '').toLowerCase().includes('confusion')) {
                                const isP1   = (args[0] ?? '').startsWith('p1');
                                const entity = isP1 ? session.playerPokemonEntity : opponent;
                                syncEntityCondition(entity, 6); // Confused = 6
                            }
                            if (cmd === '-end' && (args[1] ?? '').toLowerCase().includes('confusion')) {
                                const isP1   = (args[0] ?? '').startsWith('p1');
                                const entity = isP1 ? session.playerPokemonEntity : opponent;
                                syncEntityCondition(entity, 0);
                            }

                            // Camera animations: chained so each move's 40-tick clip plays in sequence.
                            // Both |move| lines of a turn typically arrive in the same stream chunk, so
                            // without chaining they would both start on the same tick and overlap.
                            if (cmd === 'move') {
                                const isP1Attacker = (args[0] ?? '').startsWith('p1');
                                const now = system.currentTick;

                                // If the chain has expired, restart it from now
                                if (nextCameraStartTick < now) nextCameraStartTick = now;

                                const delay = nextCameraStartTick - now;
                                nextCameraStartTick += 40; // reserve 40 ticks for this clip

                                if (delay === 0) {
                                    playCameraAnimation(player, session.playerPokemonEntity, opponent, isP1Attacker);
                                } else {
                                    // Capture the entity reference at schedule time, not at fire time
                                    const pokemonSnap = session.playerPokemonEntity;
                                    system.runTimeout(() => {
                                        playCameraAnimation(player, pokemonSnap, opponent, isP1Attacker);
                                    }, delay);
                                }

                                // Hold the battle form until ALL queued animations have finished
                                playerHandler.setFormHold(nextCameraStartTick - now);

                                // Spawn attack particle on the target when the camera ends (delay + 40)
                                const moveName  = args[1] ?? '';
                                const targetIdent = args[2] ?? '';
                                if (moveName && targetIdent && !targetIdent.startsWith('[')) {
                                    const typeNum   = MOVE_TYPE_MAP.get(moveName.toLowerCase()) ?? 0;
                                    const typeName  = (TypeList[typeNum] as string | undefined) ?? 'None';
                                    const particle  = ATTACK_PARTICLES[typeName] ?? '';
                                    if (particle) {
                                        const isTargetP1  = targetIdent.startsWith('p1');
                                        const entitySnap  = isTargetP1 ? session.playerPokemonEntity : opponent;
                                        if (entitySnap) {
                                            system.runTimeout(() => {
                                                try {
                                                    if (entitySnap.isValid)
                                                        entitySnap.dimension.spawnParticle(particle, entitySnap.location);
                                                } catch { /* entity may have moved or despawned */ }
                                            }, delay + 40);
                                        }
                                    }
                                }
                            }

                            // Format to human-readable and queue
                            const formatted = formatProtocolLine(line);
                            if (formatted) session.logQueue.push({ line: formatted });

                            // Handle end conditions
                            if (cmd === 'win') {
                                session.winner = args[0] ?? null;
                                const isPlayerWin = session.winner === player.name;
                                session.logQueue.push({
                                    line: isPlayerWin
                                        ? `§a§lYou won the battle!§r`
                                        : `§c§lYou lost the battle...§r`,
                                    onSent: () => session.end(),
                                });
                            }
                            if (cmd === 'tie') {
                                session.logQueue.push({
                                    line: `§7The battle ended in a tie.§r`,
                                    onSent: () => session.end(),
                                });
                            }
                        }
                    }
                }
            } catch (err) {
                console.warn('[Battle] Stream error:', err);
                session.end();
            }
        })();

        system.runTimeout(() => {
            if (!session.ended && Date.now() - session.startTime > BATTLE_TIMEOUT_MS) {
                session.end();
            }
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

/** Create a battle-like object for catch calculations (has turn property) */
export function getBattleForCatch(playerName: string): { turn: number } {
    const session = BATTLES.get(playerName);
    return { turn: session?.turn ?? 0 };
}

/** Helper to extract valid party from selected - call from main.ts to avoid circular imports */
export function getPlayerTeamFromSelected(
    selected: Record<string, Record<number, [id: number, name: string, data: longHand]>>,
    playerName: string
): [number, string, any][] | null {
    const team = selected[playerName];
    if (!team) return null;
    const result: [number, string, any][] = [];
    for (let i = 0; i < 6; i++) {
        const slot = team[i];
        if (slot && slot[2]?.Base_Health && (slot[2].Current_Health ?? slot[2].Base_Health) > 0) {
            result.push([slot[0], slot[1], slot[2]]);
        }
    }
    return result.length > 0 ? result : null;
}
