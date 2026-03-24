import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';
import { parseProtocolLine, cleanIdent, parsePokemonIdent } from '../protocol.js';
import { getActiveEntity, SHOWDOWN_STATUS_MAP, syncEntityCondition } from '../battleEffects.js';

const messages = {
    brn: (pokemon: string) => `§e${pokemon}§r is burned!`,
    psn: (pokemon: string) => `§e${pokemon}§r is poisoned!`,
    tox: (pokemon: string) => `§e${pokemon}§r is badly poisoned!`,
    frz: (pokemon: string) => `§e${pokemon}§r is frozen!`,
    par: (pokemon: string) => `§e${pokemon}§r is paralyzed!`,
    slp: (pokemon: string) => `§e${pokemon}§r is asleep!`,
}
export class StatusHandler implements IHandler {
    handle(session: BattleSession, message: string): void {
        const { args } = parseProtocolLine(message); // ["p2a: Caterpie", "brn"]
        const position = parsePokemonIdent(args[0] ?? '');
        if (!position) return;
        const pokemon   = position.name;
        const status = args[1] as keyof typeof messages;
        session.battlers.get('p1').activePokemon
        const pokemonEntity = session.getActiveEntity(position.position);
        if (!pokemonEntity) return;

        session.addLog({ text: messages[status]?.(pokemon) ?? '' }, () => {
            syncEntityCondition(
                pokemonEntity,
                SHOWDOWN_STATUS_MAP[status] ?? 0
            );

            switch (status) {
                case 'brn':
                    pokemonEntity.setOnFire(999999, true)
                    break;
                case 'psn':
                case 'tox':
                    pokemonEntity.addEffect('poison', 99999, {
                        amplifier: 1,
                        showParticles: true,
                      });
                    break;
                
            }
        });
    }
}
