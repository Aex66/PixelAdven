import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';
import { parseProtocolLine, cleanIdent } from '../protocol.js';
import { PlayerBattler } from '../classes/Battlers/PlayerBattler.js';
import type { SlotKey } from '../classes/Battlers/Battler.js';

export class SwitchHandler implements IHandler {
    handle(session: BattleSession, message: string): void {
        const { args } = parseProtocolLine(message);
        const identStr  = args[0] ?? '';
        const slotMatch = identStr.match(/^(p[12])([ab])/);
        if (!slotMatch) return;
        const sideId  = slotMatch[1] as 'p1' | 'p2';
        const slot    = slotMatch[2] as SlotKey;
        const battler = session.battlers.get(sideId);
        if (battler) {
            const species = (args[1] ?? '').split(',')[0].trim().toLowerCase();
            battler.onSwitch(slot, species);
        }

        const oppSideId = sideId === 'p1' ? 'p2' : 'p1';
        const oppBattler = session.battlers.get(oppSideId);
        if (oppBattler instanceof PlayerBattler) {
            const displaySpecies = (args[1] ?? '').split(',')[0].trim();
            const slotIndex = slot === 'a' ? 0 : 1;
            oppBattler.foeActiveNames[slotIndex] = displaySpecies || 'Foe';
        }

        const details  = args[1] ?? '';
        const species  = details.split(',')[0]?.trim() ?? cleanIdent(args[0] ?? '');
        const isP1     = (args[0] ?? '').startsWith('p1');
        const line = isP1
            ? `§aGo, §e${species}§a!§r`
            : session.opponentKind === 'wild'
                ? `§cA wild §e${species}§c appeared!§r`
                : `§e${species}§r was sent out!`;
        session.addLog({ text: line });
    }
}
