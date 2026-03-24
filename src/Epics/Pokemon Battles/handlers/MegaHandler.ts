import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';
import { parseProtocolLine, cleanIdent } from '../protocol.js';

export class MegaHandler implements IHandler {
    handle(session: BattleSession, message: string): void {
        const { args } = parseProtocolLine(message);
        const stone = args[1] ?? '';
        session.addLog({
            text: `§d§l${cleanIdent(args[0] ?? '')}§r §dMega Evolved${stone ? ` (${stone})` : ''}!§r`,
        });
    }
}
