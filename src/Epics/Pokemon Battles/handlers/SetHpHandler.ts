import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';
import { syncEntityHP } from '../battleEffects.js';
import { parsePokemonIdent, parseProtocolLine } from '../protocol.js';

export class SetHpHandler implements IHandler {
    handle(session: BattleSession, message: string): void {
        const { args } = parseProtocolLine(message); // ["p2a: Pikachu", "10"]
        const pokemon = parsePokemonIdent(args[0] ?? '');
        if (!pokemon) return;
        const pokemonEntity = session.getActiveEntity(pokemon.position);
        if (!pokemonEntity) return;
        syncEntityHP(pokemonEntity, args[1] ?? '');
    }
}
