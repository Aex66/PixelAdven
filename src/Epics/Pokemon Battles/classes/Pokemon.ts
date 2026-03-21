/**
 * Stub for compatibility with Dex/callback types.
 * Showdown handles battle logic internally - this is for type signatures only.
 */
export class Pokemon {
    name = '';
    species = '';
    level = 100;
    hp = 100;
    maxhp = 100;
    status = '';
    ability = '';
    item = '';
    moves: string[] = [];
}

export type EffectState = Record<string, unknown>;
