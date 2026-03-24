import type { ISideupdateHandler } from './types.js';
import type { BattleSession } from '../classes/Battle.js';
import { Battler } from '../classes/Battlers/Battler.js';
/**
 * `|error|` from a side stream. Errors are also surfaced on the player’s BattleStream socket;
 * this path runs when the same line appears on an omniscient `sideupdate` chunk.
 */
export class SideupdateErrorHandler implements ISideupdateHandler {
    handle(session: BattleSession, battler: Battler, message: string): void {
        const rest = message.replace(/^\|error\|/i, '').trim();
        console.warn(`[Battle] |error| (${battler.sideId}):`, rest);
    }
}

/**
 * `|request|{...}` — normally the Showdown player stream already calls `receiveRequest` on the
 * side’s AI / UI. Leave empty unless you route requests only through omniscient chunks.
 */
export class SideupdateRequestStubHandler implements ISideupdateHandler {
    handle(session: BattleSession, battler: Battler, message: string): void {
        const request = JSON.parse(message.substring(9))
        console.warn(`[Battle] |request| (${battler.sideId}):`, request);
        session.addSideRequest(() => battler.receiveRequest(request));
    }
}
