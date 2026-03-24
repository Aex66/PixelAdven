import type { BattleSession } from '../classes/Battle.js';
import { Battler } from '../classes/Battlers/Battler.js';

/**
 * Public `update` chunk lines (`|move|`, `|turn|`, `|-damage|`, …).
 * @param lookahead — Remaining protocol lines in the same `update` chunk (not consumed).
 */
export interface IUpdateHandler {
    handle(session: BattleSession, message: string, lookahead?: string[]): void;
}

/**
 * `|split|<sideId>` blocks: private line (exact HP for that side) + public line (everyone else).
 * Route by {@link parseProtocolLine private line}’s command.
 */
export interface ISplitHandler {
    handle(
        session: BattleSession,
        splitSideId: 'p1' | 'p2',
        publicLine: string,
        privateLine: string,
        lookahead?: string[]
    ): void;
}

/**
 * `sideupdate` chunk: one line per side (`|request|`, `|error|`, …).
 * Requests are usually already delivered via each side’s Showdown player stream — keep handlers
 * no-op unless you move to omniscient-only routing.
 */
export interface ISideupdateHandler {
    handle(session: BattleSession, battler: Battler, message: string): void;
}

/** `end` chunk: second line is JSON summary (winner, turns, …). */
export interface IEndChunkHandler {
    handle(session: BattleSession, jsonLine: string): void;
}
