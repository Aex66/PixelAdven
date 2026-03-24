import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';

export class SupereffectiveHandler implements IHandler {
    handle(session: BattleSession, _message: string): void {
        session.addLog({ text: "§cIt's super effective!§r" });
    }
}
