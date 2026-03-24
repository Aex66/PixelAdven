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
import { Player as IPlayer, Entity, system, RawMessage } from '@minecraft/server';
import { BattleStreams } from '../simulator.js';
import { FORMAT_SINGLES, FORMAT_DOUBLES, GameType } from '../formats.js';
import { packLongHandToSet } from '../teamPacker.js';
import { longHand } from '../../Pokemon Database/@types/types.js';
import { Battler, BattlerKind, SlotKey } from './Battlers/Battler.js';
import { PlayerBattler } from './Battlers/PlayerBattler.js';
import { WildBattler } from './Battlers/WildBattler.js';
import { TrainerBattler } from './Battlers/TrainerBattler.js';
import { BattleResult, getTrainerReward } from '../postBattle.js';
import {
    ArenaLayout, computeArenaPositions, playIntroCameraAnimation,
} from '../battleArena.js';
import '../handlers/registerHandlers.js';
import { resetMoveVfxSessionState, type MoveVfxJob } from '../battleEffects.js';
import { parseProtocolLine } from '../protocol.js';
import { ShowdownInterpreter } from '../showdownInterpreter.js';
import { interpret } from '../chunkInterpreter.js';

export type { BattlerKind, SlotKey } from './Battlers/Battler.js';
export type { MoveVfxJob } from '../battleEffects.js';
export { computeContactMeleeDurationTicks } from '../battleEffects.js';

// ─── Timing constants ──────────────────────────────────────────────────────────

const LOG_QUEUE_INTERVAL_TICKS = 20;           // 10 ticks per log line
const BATTLE_TIMEOUT_MS        = 30 * 60 * 1000; // 30-minute safety net

// ─── Session ───────────────────────────────────────────────────────────────────

export interface BattleSession {
    readonly id: string;
    readonly stream: InstanceType<typeof BattleStreams.BattleStream>;
    readonly battlers: Map<'p1' | 'p2', Battler>;
    readonly spectators: Set<IPlayer>;
    readonly logQueue: LogEntry[];
    readonly gameType: GameType;
    startTime: number;
    ended: boolean;
    winner: string | null;
    turn: number;
    /** FIFO queue for move particles / melee so same-turn moves do not overlap visually. */
    moveVfxQueue: MoveVfxJob[];
    /** True while a move-VFX job is running until its completion timeout. */
    processingMoveVfx: boolean;
    /** Sum of {@link MoveVfxJob.durationTicks} for jobs still queued or in progress (for {@link Battler.setFormHold}). */
    pendingMoveVfxTotalTicks: number;
    /** Incremented when the move-VFX queue is cleared (turn boundary / end) to invalidate stale timeouts. */
    moveVfxGen: number;
    /** Money rewarded to the player if they beat a trainer. 0 otherwise. */
    trainerReward: number;
    /** Arena center position for camera targeting. */
    arenaCenter: { x: number; y: number; z: number };
    /** Forward direction (p1 → p2) for camera offset calculation. */
    arenaForward: { x: number; y: number; z: number };
    /** Opponent (p2) battler kind — used for protocol chat formatting. */
    opponentKind: BattlerKind;
    /** Requests waiting to be received by a player*/
    awaitingRequests: (() => void)[];
    entityInBattle(entity: Entity): boolean;
    end(): void;
    addLog(message: RawMessage | null, onSent?: () => void): void;
    interpret(chunk: string): void;
    addSideRequest(callback: () => void): void;
    getActiveEntity(identStr: string): Entity | null;
    setTurn(turn: number): void;
}

interface LogEntry {
    message: RawMessage | null;
    onSent?: () => void;
}

// ─── Battle registry ───────────────────────────────────────────────────────────

export const BATTLES = new Map<string, BattleSession>();

// ─── Log queue processor ───────────────────────────────────────────────────────

let logQueueInterval: number | null = null;

function sendLogLine(session: BattleSession, entry: LogEntry): void {
    if (!entry.message) return;
    for (const battler of session.battlers.values()) {
        if (battler instanceof PlayerBattler && battler.player?.isValid)
            battler.player.sendMessage(entry.message);
    }
    for (const spec of session.spectators) {
        if (spec.isValid) spec.sendMessage(entry.message);
    }
}
function processLogQueue(session: BattleSession): void {
    if (session.logQueue.length === 0) return;
    const entry = session.logQueue.shift()!;
    if (entry.message) {
        sendLogLine(session, entry);
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
// ─── Battle theme ──────────────────────────────────────────────────────────────

function scheduleBattleTheme(player: IPlayer, session: BattleSession): void {
    if (session.ended) {
        try { player.runCommand('stopsound @s underground.battle_theme'); } catch { /* gone */ }
        return;
    }
    try { if (player.isValid) player.playSound('underground.battle_theme'); } catch { /* gone */ }
    system.runTimeout(() => scheduleBattleTheme(player, session), 1825);
}

// ─── Camera helpers ──────────────────────────────────────────────────────────

function getControllerLocation(battler: Battler): { x: number; y: number; z: number } {
    if (battler instanceof PlayerBattler && battler.player?.isValid)
        return battler.player.location;
    if (battler instanceof WildBattler && battler.entity?.isValid)
        return battler.entity.location;
    if (battler instanceof TrainerBattler && battler.entity?.isValid)
        return battler.entity.location;
    return { x: 0, y: 64, z: 0 };
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
    private session: BattleSession | null = null;

    get turn(): number { return this.session?.turn ?? 0; }

    // ── Factory methods ─────────────────────────────────────────────────────────

    /** Wild encounters are always singles. */
    static startWild(
        player: IPlayer,
        wildEntity: Entity,
        playerTeam: [number, string, any][] | null
    ): BattleSession | null {
        if (!playerTeam?.length) {
            player.sendMessage('§cYou have no Pokemon to battle with!');
            return null;
        }
        try {
            if (!wildEntity.getTags().some(t => t.startsWith('ODW:'))) {
                wildEntity.addTag(`ODW:${player.name}`);
            }
        } catch { /* entity may already be invalid */ }

        return Battle.createBattle(
            new PlayerBattler(player, 'p1', playerTeam),
            new WildBattler(wildEntity, 'p2'),
            'singles'
        );
    }

    /**
     * @param difficulty  0 = RandomPlayerAI, 1–5 = StrongHeuristicsAI (default 0)
     * @param gameType    'singles' | 'doubles' (default 'doubles')
     */
    static startTrainer(
        player: IPlayer,
        trainerEntity: Entity,
        playerTeam: [number, string, any][] | null,
        difficulty = 0,
        gameType: GameType = 'doubles'
    ): BattleSession | null {
        if (!playerTeam?.length) {
            player.sendMessage('§cYou have no Pokemon to battle with!');
            return null;
        }
        const trainerTeam = readEntityTeam(trainerEntity);
        if (!trainerTeam?.length) {
            player.sendMessage('§cThis trainer has no Pokemon!');
            return null;
        }
        return Battle.createBattle(
            new PlayerBattler(player, 'p1', playerTeam),
            new TrainerBattler(trainerEntity, 'trainer', 'p2', trainerTeam, {
                despawnOnEnd: true,
                difficulty,
            }),
            gameType
        );
    }

    /**
     * Gym leaders do not despawn on battle end.
     * @param difficulty  0 = RandomPlayerAI, 1–5 = StrongHeuristicsAI (default 3)
     * @param gameType    'singles' | 'doubles' (default 'doubles')
     */
    static startGymLeader(
        player: IPlayer,
        gymLeaderEntity: Entity,
        playerTeam: [number, string, any][] | null,
        difficulty = 3,
        gameType: GameType = 'doubles'
    ): BattleSession | null {
        if (!playerTeam?.length) {
            player.sendMessage('§cYou have no Pokemon to battle with!');
            return null;
        }
        const leaderTeam = readEntityTeam(gymLeaderEntity);
        if (!leaderTeam?.length) {
            player.sendMessage('§cThe gym leader has no Pokemon!');
            return null;
        }
        return Battle.createBattle(
            new PlayerBattler(player, 'p1', playerTeam),
            new TrainerBattler(gymLeaderEntity, 'gymleader', 'p2', leaderTeam, {
                despawnOnEnd: false,
                difficulty,
            }),
            gameType
        );
    }

    /**
     * @param gameType  'singles' | 'doubles' (default 'doubles')
     */
    static startPvP(
        player1: IPlayer,
        player2: IPlayer,
        team1: [number, string, any][] | null,
        team2: [number, string, any][] | null,
        gameType: GameType = 'doubles'
    ): BattleSession | null {
        if (!team1?.length) { player1.sendMessage('§cYou have no Pokemon to battle with!'); return null; }
        if (!team2?.length) { player2.sendMessage('§cYou have no Pokemon to battle with!'); return null; }
        return Battle.createBattle(
            new PlayerBattler(player1, 'p1', team1),
            new PlayerBattler(player2, 'p2', team2),
            gameType
        );
    }

    // ── Core battle factory ──────────────────────────────────────────────────────

    private static createBattle(p1: Battler, p2: Battler, gameType: GameType = 'singles'): BattleSession | null {
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

        // Determine trainer reward up-front (0 if not a trainer battle).
        const trainerBattler = [p1, p2].find(b => b instanceof TrainerBattler) as TrainerBattler | undefined;
        const trainerReward  = trainerBattler
            ? getTrainerReward(
                trainerBattler.entity as any,
                Math.max(...trainerBattler.team.map(([, , d]) => (d?.level ?? 1) as number))
              )
            : 0;

        const session: BattleSession = {
            id:               `battle_${Date.now()}_${p1.displayName}`,
            stream,
            battlers:         new Map<'p1' | 'p2', Battler>([['p1', p1], ['p2', p2]]),
            spectators:       new Set(),
            logQueue:         [],
            gameType,
            startTime:        Date.now(),
            ended:            false,
            winner:           null,
            turn:             0,
            moveVfxQueue:         [],
            processingMoveVfx:    false,
            pendingMoveVfxTotalTicks: 0,
            moveVfxGen: 0,
            trainerReward,
            arenaCenter:  { x: 0, y: 64, z: 0 },
            arenaForward: { x: 0, y: 0, z: 1 },
            opponentKind: p2.kind,
            awaitingRequests: [],

            entityInBattle(entity: Entity): boolean {
                for (const battler of this.battlers.values()) {
                    if (battler.ownsEntity(entity)) return true;
                }
                return false;
            },

            end(): void {
                if (this.ended) return;
                this.ended = true;
                resetMoveVfxSessionState(this);
                BATTLES.delete(this.id);

                const result: BattleResult = {
                    trainerReward: this.trainerReward,
                };

                for (const battler of this.battlers.values()) {
                    battler.onEnd(this.winner, result);
                }
            },
            getActiveEntity(identStr: string): Entity | null {
                const match = identStr.match(/^(p[12])([ab])/);
                if (!match) return null;
                return this.battlers.get(match[1] as 'p1' | 'p2')?.activePokemon.get(match[2] as SlotKey) ?? null;
            },
            addLog(message: RawMessage | null, onSent?: () => void): void {
                this.logQueue.push({ message, onSent });
            },

            interpret(chunk: string): void {
                interpret(this, chunk);
            },

            addSideRequest(callback: () => void): void {
                this.awaitingRequests.push(callback);
            },

            setTurn(turn: number): void {
                if (this.ended) return;
                this.turn = turn;
                resetMoveVfxSessionState(this);
                for (const callback of this.awaitingRequests) {
                    callback();
                }
                this.awaitingRequests = [];
            },
        };

        BATTLES.set(session.id, session);
        p1.setBattle(session);
        p2.setBattle(session);

        // ── Compute arena layout ─────────────────────────────────────────────
        const p1Loc = getControllerLocation(p1);
        const p2Loc = getControllerLocation(p2);
        const layout: ArenaLayout = computeArenaPositions(p1Loc, p2Loc, gameType);

        session.arenaCenter  = layout.center;
        const fwd = { x: p2Loc.x - p1Loc.x, y: 0, z: p2Loc.z - p1Loc.z };
        const fwdLen = Math.sqrt(fwd.x * fwd.x + fwd.z * fwd.z);
        session.arenaForward = fwdLen > 0.01
            ? { x: fwd.x / fwdLen, y: 0, z: fwd.z / fwdLen }
            : { x: 0, y: 0, z: 1 };

        // Assign slot positions to each battler
        p1.arenaSlotPositions.set('a', layout.slots.p1a);
        p1.arenaSlotPositions.set('b', layout.slots.p1b);
        p2.arenaSlotPositions.set('a', layout.slots.p2a);
        p2.arenaSlotPositions.set('b', layout.slots.p2b);

        // Play intro camera for all player battlers (60 ticks to hide entity placement)
        const INTRO_TICKS = 60;
        for (const battler of [p1, p2]) {
            if (battler instanceof PlayerBattler && battler.player?.isValid) {
                playIntroCameraAnimation(battler.player, layout.center, session.arenaForward, INTRO_TICKS);
                battler.setFormHold(INTRO_TICKS);
            }
        }

        // Start battle music for all player battlers.
        for (const battler of session.battlers.values()) {
            if (battler instanceof PlayerBattler)
                scheduleBattleTheme(battler.player, session);
        }
        startLogQueueProcessor();

        (async () => {
            // ── Omniscient stream loop ─────────────────────────────────────
            for await (const chunk of stream) {
                if (session.ended) break;
                try { 
                    session.interpret(chunk); 
                } catch (err) {
                    console.warn('[Battle] Stream error:', err);
                    session.end();
                }
            }
        })();

        system.runTimeout(async () => {
            // ── Announce battle start ──────────────────────────────────────
            const startMsg =
            p2.kind === 'wild'      ? `§6§lA wild §e${p2.displayName}§6§l appeared!§r`
            : p2.kind === 'gymleader' ? `§e§lGym Leader §6${p2.displayName}§e§l wants to battle!§r`
            : p2.kind === 'player'    ? `§e${p2.displayName}§r wants to battle!`
            :                          `§cTrainer §e${p2.displayName}§c wants to battle!§r`;
            session.addLog({ text: startMsg });

            // ── Start the Showdown battle ──────────────────────────────────
            session.stream._write(`>start ${JSON.stringify({
                effectType: 'Format',
                mod: 'underground',
                name: gameType,
                gameType: gameType,
                ruleset: [],
                playerCount: 2,
                banlist: [],
                rated: false,
              })}`);

            let battlerIndex = 1
            for (const battler of session.battlers.values()) {
                try {
                    session.stream._write(`>player p${battlerIndex} ${JSON.stringify({ name: battler.displayName, team: battler.team.map(([id, sp, data]) => packLongHandToSet(data, sp, `p${battlerIndex}_${id}`)) })}`);
                    await system.waitTicks(1);
                    battlerIndex++;
                } catch (err) {
                    console.warn(`[Battle] Error initializing battler ${battlerIndex}:`, err);
                }
            }
        }, 20)

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

export function getBattleSessionForPlayer(playerName: string): BattleSession | null {
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

/**
 * Add a player as a spectator to an existing battle.
 * Spectators receive all log messages but cannot send commands.
 * Returns false if the session is already ended or the player is already a battler/spectator.
 */
export function addSpectator(session: BattleSession, player: IPlayer): boolean {
    if (session.ended) return false;
    if (session.entityInBattle(player as any)) return false;
    if (session.spectators.has(player)) return false;
    session.spectators.add(player);
    player.sendMessage(`§7[Spectating battle ${session.id.slice(-6)}]`);
    return true;
}

/**
 * Remove a spectator from a battle session.
 */
export function removeSpectator(session: BattleSession, player: IPlayer): boolean {
    return session.spectators.delete(player);
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
