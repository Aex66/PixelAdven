/**
 * In-battle Pokémon wrapper around longHand data (same object references as selected[]).
 */
export class Pokemon {
    /** Set true when this party member is KO’d in the current battle. */
    fainted = false;

    constructor(
        public readonly pokeId: number,
        /** Species id string (e.g. pokeworld:wild_pikachu) — same as tuple[1]. */
        public readonly species: string,
        /** Mutable longHand stats object — same reference as tuple[2]. */
        public data: any
    ) {}
}

export interface PartyPokemon {
    uuid: string;
    /** Index in the party array (0-based); matches player’s team slot order. */
    slot: number;
    /** True once this Pokémon has used a move this battle (for future rewards). */
    participated: boolean;
    /** Present for all slots built from a real team; holds longHand + fainted. */
    pokemon?: Pokemon;
}

function randomUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/** Builds party entries from legacy `[id, species, data][]` tuples (preserves data references). */
export function buildPartyFromTuples(tuples: [number, string, any][]): PartyPokemon[] {
    return tuples.map(([id, species, data], slot) => ({
        uuid:         randomUuid(),
        slot,
        participated: false,
        pokemon:      new Pokemon(id, species, data),
    }));
}

export type EffectState = Record<string, unknown>;
