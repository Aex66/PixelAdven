import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';

export class ResistedHandler implements IHandler {
    handle(session: BattleSession, _message: string): void {
        session.addLog({ text: "§7It's not very effective...§r" });
    }
}
