import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';
import { parseProtocolLine, cleanIdent } from '../protocol.js';

export class PrimalHandler implements IHandler {
    handle(session: BattleSession, message: string): void {
        const { args } = parseProtocolLine(message);
        session.addLog({
            text: `§c§l${cleanIdent(args[0] ?? '')}§r §c underwent Primal Reversion!§r`,
        });
    }
}
