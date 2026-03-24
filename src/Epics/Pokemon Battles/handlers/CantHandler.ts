import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';
import { cleanIdent, parseProtocolLine } from '../protocol.js';

export class CantHandler implements IHandler {
    handle(session: BattleSession, message: string): void {
        const { args } = parseProtocolLine(message);
        session.addLog({ text: `§e${cleanIdent(args[0] ?? '')}§r can't move! §7(${args[1] ?? ''})§r` });
    }
}
