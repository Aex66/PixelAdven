import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';
import { parseProtocolLine, cleanIdent, parseHP, parsePokemonIdent } from '../protocol.js';
import { syncEntityHP } from '../battleEffects.js';

export class HealHandler implements IHandler {
    handle(session: BattleSession, message: string): void {
        const { args } = parseProtocolLine(message); // ["p2a: Pikachu", "10"]
        const pokemon = parsePokemonIdent(args[0] ?? '');
        if (!pokemon) return;
        const pokemonEntity = session.getActiveEntity(pokemon.position);

        if (!pokemonEntity) return;
        session.addLog({
            text: `§a${cleanIdent(args[0] ?? '')}§r recovered HP! §7(${parseHP(args[1] ?? '')})§r`,
        }, () => {
            syncEntityHP(pokemonEntity, args[1] ?? '');
        });
    }
}
