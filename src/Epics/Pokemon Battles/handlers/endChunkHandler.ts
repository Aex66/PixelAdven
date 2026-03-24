import type { IEndChunkHandler } from './types.js';
import type { BattleSession } from '../classes/Battle.js';

/**
 * `end` chunk second line — JSON summary. Battle end is usually triggered by `|win|` / `|tie|` in
 * the public log; this handler is for extra metadata and a safety `end()` if needed.
 */
export class EndChunkHandler implements IEndChunkHandler {
    handle(session: BattleSession, jsonLine: string): void {
        try {
            const data = JSON.parse(jsonLine) as { winner?: string };
            if (typeof data.winner === 'string' && !session.winner)
                session.winner = data.winner;
        } catch {
            /* ignore malformed */
        }
        // Do not call session.end() here — |win| / |tie| handlers already end the session via addLog onSent.
    }
}
