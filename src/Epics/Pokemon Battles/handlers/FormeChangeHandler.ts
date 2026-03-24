import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';
import { parseProtocolLine, cleanIdent } from '../protocol.js';

export class FormeChangeHandler implements IHandler {
    handle(session: BattleSession, message: string): void {
        const { args } = parseProtocolLine(message);
        const species = args[1] ?? '?';
        session.addLog({
            text: `§e${cleanIdent(args[0] ?? '')}§r transformed into §b${species}§r!`,
        });
    }
}
