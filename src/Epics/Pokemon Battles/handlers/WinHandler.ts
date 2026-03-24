import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';
import { parseProtocolLine } from '../protocol.js';
import { PlayerBattler } from '../classes/Battlers/PlayerBattler.js';

export class WinHandler implements IHandler {
    handle(session: BattleSession, message: string): void {
        const { args } = parseProtocolLine(message);
        session.winner = args[0] ?? null;
        for (const battler of session.battlers.values()) {
            if (battler instanceof PlayerBattler && battler.player?.isValid) {
                const isWinner = session.winner === battler.player.name;
                battler.player.sendMessage(
                    isWinner
                        ? '§a§lYou won the battle!§r'
                        : '§c§lYou lost the battle...§r'
                );
            }
        }
        const winLine = `§a§l${args[0] ?? ''}§r §awon the battle!§r`;
        session.addLog({ text: winLine }, () => session.end());
    }
}
