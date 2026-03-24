/**
 * Showdown protocol line parsing and shared string helpers for handlers.
 */
import type { SlotKey } from './classes/Battlers/Battler.js';

export function parseProtocolLine(line: string): { cmd: string; args: string[] } {
    if (!line.startsWith('|')) return { cmd: '', args: [] };
    const parts = line.slice(1).split('|');
    return { cmd: parts[0] ?? '', args: parts.slice(1) };
}

export function cleanIdent(ident: string): string {
    return ident.replace(/^p\d[a-z]?: /i, '');
}

/** Showdown side id (`p1` / `p2`). */
export type ShowdownPlayerId = 'p1' | 'p2';

/** Full active-slot id as in Showdown protocol (`p1a` … `p2b`). */
export type ShowdownPositionId = 'p1a' | 'p1b' | 'p2a' | 'p2b';

/** Result of {@link parsePokemonIdent} for strings like `p1a: Caterpie`. */
export interface ParsedPokemonIdent {
    /** Side id passed to Showdown (`p1`, `p2`). */
    playerShowdownId: ShowdownPlayerId;
    /** Full field slot id (`p1a`, `p1b`, `p2a`, `p2b`). */
    position: ShowdownPositionId;
    /** Display species or nickname after the colon (trimmed). */
    name: string;
}

/**
 * Parses a Showdown Pokémon ident, e.g. `p1a: Caterpie` or `p2b: Pikachu`.
 * @returns `null` if the string does not match the expected pattern.
 */
export function parsePokemonIdent(ident: string): ParsedPokemonIdent | null {
    ident = ident.replace('[of] ', '');
    const m = ident.trim().match(/^p([12])([ab]):\s*(.+)$/i);
    if (!m) return null;
    const slot = m[2]!.toLowerCase() as 'a' | 'b';
    const pos = `p${m[1]}${slot}` as ShowdownPositionId;
    return {
        playerShowdownId: `p${m[1]}` as ShowdownPlayerId,
        position: pos,
        name: m[3]!.trim(),
    };
}

/** Field slot letter from a full Showdown position id (`p1a` → `a`, `p2b` → `b`). */
export function slotKeyFromShowdownPosition(position: ShowdownPositionId): SlotKey {
    const ch = position[2];
    return (ch === 'b' ? 'b' : 'a') as SlotKey;
}

export function parseHP(condition: string): string {
    if (!condition || condition === '0 fnt') return '§c0 HP§r';
    return condition.split(' ')[0] ?? condition;
}



/** Status id → display fragment for {@link StatusHandler} chat lines. */
export const STATUS_DISPLAY_NAMES: Record<string, string> = {
    par: '§e[PAR]§r', brn: '§6[BRN]§r', psn: '§5[PSN]§r',
    tox: '§5[TOX]§r', slp: '§8[SLP]§r', frz: '§b[FRZ]§r',
};
