import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';

export class TieHandler implements IHandler {
    handle(session: BattleSession, _message: string): void {
        session.addLog({ text: '§7The battle ended in a tie.§r' }, () => session.end());
    }
}
