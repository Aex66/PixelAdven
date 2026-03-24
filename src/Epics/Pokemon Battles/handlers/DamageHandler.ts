import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';
import { parseProtocolLine, parseHP, parsePokemonIdent } from '../protocol.js';
import { syncEntityHP } from '../battleEffects.js';

export class DamageHandler implements IHandler {
    handle(session: BattleSession, message: string): void {
        const { args } = parseProtocolLine(message); // ["p2a: Pikachu", "10"]
        const pokemon = parsePokemonIdent(args[0] ?? '');
        if (!pokemon) return;
        const pokemonEntity = session.getActiveEntity(pokemon.position);
        if (!pokemonEntity) return;

        session.addLog({
            text: `§c${pokemon.name}§r lost HP! §7(${parseHP(args[1] ?? '')})§r`,
        }, () => {
            syncEntityHP(pokemonEntity, args[1] ?? '');
        });
    }
}
