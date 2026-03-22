/**
 * Battle format configuration for ROT addon.
 * Uses gen9customgame from @pkmn/sim — allows any obtainable Pokemon.
 *
 * SINGLES  — Wild encounters (always 1v1).
 * DOUBLES  — Trainer, Gym Leader, PvP battles (2v2 per side).
 */
export const FORMAT_SINGLES = 'gen9customgame';
export const FORMAT_DOUBLES = 'gen9doublesubers';

export type GameType = 'singles' | 'doubles';

/** Kept for backward compatibility — resolves to singles. */
export const BATTLE_FORMAT_ID = FORMAT_SINGLES;
