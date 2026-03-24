import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';
import { parseProtocolLine, cleanIdent } from '../protocol.js';

export class ImmuneHandler implements IHandler {
    handle(session: BattleSession, message: string): void {
        const { args } = parseProtocolLine(message);
        session.addLog({
            text: `§7It doesn't affect §e${cleanIdent(args[0] ?? '')}§7...§r`,
        });
    }
}
