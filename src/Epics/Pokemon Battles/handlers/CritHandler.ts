import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';

export class CritHandler implements IHandler {
    handle(session: BattleSession, _message: string): void {
        session.addLog({ text: '§6A critical hit!§r' });
    }
}
