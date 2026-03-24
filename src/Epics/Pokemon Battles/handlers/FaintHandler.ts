import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';
import { parseProtocolLine, parsePokemonIdent, slotKeyFromShowdownPosition as parseSlotKey } from '../protocol.js';

export class FaintHandler implements IHandler {
    handle(session: BattleSession, message: string): void {
        const { args } = parseProtocolLine(message);
        const pokemon = parsePokemonIdent(args[0] ?? '');
        if (!pokemon) return;

        const faintedSide = session.battlers.get(pokemon.playerShowdownId);
        const slotKey = parseSlotKey(pokemon.position);

        session.addLog({ text: `§e${pokemon.name}§c fainted!§r` }, () => {
            if (faintedSide) {
                faintedSide.onFaint(slotKey);
            }
        });
    }
}
