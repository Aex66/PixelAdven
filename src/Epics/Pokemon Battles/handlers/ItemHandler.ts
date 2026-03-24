import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';
import { parseProtocolLine, cleanIdent } from '../protocol.js';

export class ItemHandler implements IHandler {
    handle(session: BattleSession, message: string): void {
        const { args } = parseProtocolLine(message);
        const item = args[1] ?? '?';
        session.addLog({
            text: `§e${cleanIdent(args[0] ?? '')}§r's item: §b${item}§r`,
        });
    }
}
