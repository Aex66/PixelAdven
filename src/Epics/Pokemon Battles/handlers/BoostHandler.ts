import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';
import { parseProtocolLine, cleanIdent } from '../protocol.js';

export class BoostHandler implements IHandler {
    handle(session: BattleSession, message: string): void {
        const { args } = parseProtocolLine(message);
        const stat = args[1] ?? '?';
        const amt  = args[2] ?? '?';
        session.addLog({
            text: `§e${cleanIdent(args[0] ?? '')}§r's §b${stat}§r rose by ${amt}!`,
        });
    }
}
