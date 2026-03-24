import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';
import { parseProtocolLine } from '../protocol.js';
import { getActiveEntity, syncEntityCondition } from '../battleEffects.js';

export class EndHandler implements IHandler {
    handle(session: BattleSession, message: string): void {
        const { args } = parseProtocolLine(message);
        if (!(args[1] ?? '').toLowerCase().includes('confusion')) return;
        syncEntityCondition(getActiveEntity(session.battlers, args[0] ?? ''), 0);
    }
}
