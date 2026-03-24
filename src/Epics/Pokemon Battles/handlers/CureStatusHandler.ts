import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';
import { parseProtocolLine, parsePokemonIdent } from '../protocol.js';
const messages = {
    frz: (pokemon: string) => `§e${pokemon}§r is no longer frozen!`,
    psn: (pokemon: string) => `§e${pokemon}§r is no longer poisoned!`,
    tox: (pokemon: string) => `§e${pokemon}§r is no longer badly poisoned!`,
    brn: (pokemon: string) => `§e${pokemon}§r is no longer burned!`,
    par: (pokemon: string) => `§e${pokemon}§r is no longer paralyzed!`,
    slp: (pokemon: string) => `§e${pokemon}§r is no longer asleep!`,
}
export class CureStatusHandler implements IHandler {
    handle(session: BattleSession, message: string): void {
        const { args } = parseProtocolLine(message); //["p2a: Pikachu", "frz"]
        const pokemon = parsePokemonIdent(args[0] ?? '');
        if (!pokemon) return;
        const pokemonEntity = session.getActiveEntity(pokemon.position);
        if (!pokemonEntity) return;
        const status = args[1] as keyof typeof messages;

        session.addLog({ text: messages[status]?.(pokemon.name) ?? '' }, () => {
            if (!pokemonEntity.isValid) return;
            switch (status) {
            case 'brn':
                pokemonEntity.extinguishFire(true);
                break;
            case 'psn':
            case 'tox':
                pokemonEntity.removeEffect('poison');
                break;
            }
        });
    }
}
