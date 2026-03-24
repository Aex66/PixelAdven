import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';
import { parseProtocolLine } from '../protocol.js';
import { system, TicksPerSecond } from '@minecraft/server';

export class TurnHandler implements IHandler {
    handle(session: BattleSession, message: string): void {
        const { args } = parseProtocolLine(message); // ["1"]
        session.addLog({ text: `§8§m            §r §7Turn ${args[0]}§r §8§m            §r` }, () => {
            system.runTimeout(() => {
                session.setTurn(parseInt(args[0] ?? '0', 10) || 0);
            }, TicksPerSecond * 2);
        });
    }
}
