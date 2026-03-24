import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';
import { parseProtocolLine, cleanIdent } from '../protocol.js';

export class AbilityHandler implements IHandler {
    handle(session: BattleSession, message: string): void {
        const { args } = parseProtocolLine(message);
        const abil = args[1] ?? '?';
        session.addLog({
            text: `§e${cleanIdent(args[0] ?? '')}§r — §b${abil}§r`,
        });
    }
}
