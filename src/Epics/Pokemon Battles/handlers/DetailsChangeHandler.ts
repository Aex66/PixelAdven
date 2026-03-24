import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';
import { parseProtocolLine, cleanIdent } from '../protocol.js';

export class DetailsChangeHandler implements IHandler {
    handle(session: BattleSession, message: string): void {
        const { args } = parseProtocolLine(message);
        const details = args[1] ?? '';
        const species = details.split(',')[0]?.trim() ?? '?';
        session.addLog({
            text: `§e${cleanIdent(args[0] ?? '')}§r became §b${species}§r!`,
        });
    }
}
