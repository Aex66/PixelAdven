/**
 * Converts ROT addon Pokemon data to Showdown PokemonSet format.
 * Accepts any pokemon data object (compatible with both longHand and collectEntityStats output).
 */
import { Teams, toID } from './simulator.js';
import { MOVE_KEYS } from '../../Letters/pokemon/moves.js';

interface PokemonSetLike {
    name?: string;
    species: string;
    level?: number;
    ability?: string;
    item?: string;
    nature?: string;
    gender?: string;
    moves: string[];
    ivs?: Record<string, number>;
    evs?: Record<string, number>;
    happiness?: number;
    shiny?: boolean;
    [key: string]: unknown;
}


/** Map ROT species names (e.g. wild_pikachu, pikachu) to Showdown species id */
function toShowdownSpecies(rotName: string): string {
    const cleaned = (rotName ?? '')
        .replace(/^wild_/i, '')
        .replace(/\s+/g, '')
        .toLowerCase();
    return toID(cleaned) || cleaned;
}

/** Map ROT nature to Showdown format. Handles both string "relaxed" and tuple ["relaxed", 0]. */
function toShowdownNature(nature: unknown): string {
    if (!nature) return 'Serious';
    const raw = Array.isArray(nature) ? nature[0] : nature;
    const n = String(raw ?? '').trim();
    if (!n) return 'Serious';
    return n.charAt(0).toUpperCase() + n.slice(1).toLowerCase();
}

/** Map ROT item to Showdown format. Handles string or number IDs. */
function toShowdownItem(item: unknown): string {
    if (!item && item !== 0) return '';
    return toID(String(item));
}

/** Map ROT ability to Showdown format. Handles both string and tuple ["raindish", 0]. */
function toShowdownAbility(ability: unknown): string {
    if (!ability) return '';
    const raw = Array.isArray(ability) ? ability[0] : ability;
    return toID(String(raw ?? ''));
}

/** Map ROT move to Showdown format.
 *  - Numeric ID (longHand stores Move1 as index): look up in POKEMON_MOVE_KEYS
 *  - Numeric string ("42"): same lookup
 *  - String name ("Thunderbolt"): toID directly
 *  - Tuple [name, id]: use first element
 */
function toShowdownMove(move: unknown): string {
    if (move == null || move === '' || move === -1 || move === 0) return '';
    const raw = Array.isArray(move) ? move[0] : move;
    if (raw == null || raw === '' || raw === -1 || raw === 0) return '';

    // Numeric: treat as index into the move keys list
    if (typeof raw === 'number') {
        return toID(MOVE_KEYS[raw] ?? '') || '';
    }
    // String that is purely numeric (e.g. serialized longHand)
    const asNum = Number(raw);
    if (!isNaN(asNum) && asNum > 0 && String(raw).trim() === String(asNum)) {
        return toID(MOVE_KEYS[asNum] ?? '') || '';
    }
    return toID(String(raw)) || '';
}

/** Convert any pokemon data object to a PokemonSet for Showdown */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function packLongHandToSet(data: any, speciesId: string, uuid?: string): PokemonSetLike {
    const rawMoves = [data.Move1, data.Move2, data.Move3, data.Move4];
    const moves = rawMoves.map(toShowdownMove).filter(Boolean) as string[];

    const set: PokemonSetLike = {
        name: speciesId,
        species: toShowdownSpecies(speciesId),
        level: Math.min(100, Math.max(1, data.level ?? data.lv ?? 1)),
        ability: toShowdownAbility(data.Ability),
        item: toShowdownItem(data.heldItem),
        nature: toShowdownNature(data.Nature),
        gender: '',
        moves,
        ivs: {
            hp:  data.IV_health         ?? data.IVhp  ?? 31,
            atk: data.IV_attack         ?? data.IVatk ?? 31,
            def: data.IV_defense        ?? data.IVdef ?? 31,
            spa: data.IV_special_attack ?? data.IVspa ?? 31,
            spd: data.IV_special_defense ?? data.IVspd ?? 31,
            spe: data.IV_speed          ?? data.IVsp  ?? 31,
        },
        evs: {
            hp:  data.EV_health         ?? data.EVhp  ?? 0,
            atk: data.EV_attack         ?? data.EVatk ?? 0,
            def: data.EV_defense        ?? data.EVdef ?? 0,
            spa: data.EV_special_attack ?? data.EVspa ?? 0,
            spd: data.EV_special_defense ?? data.EVspd ?? 0,
            spe: data.EV_speed          ?? data.EVsp  ?? 0,
        },
        happiness: data.friendShipLevel ?? data.fsl ?? 255,
        shiny: false,
    };

    if (uuid) (set as Record<string, unknown>).uuid = uuid;
    if (data.Current_Health != null && data.Base_Health != null) {
        (set as Record<string, unknown>).currentHealth = data.Current_Health;
    }
    if (moves.length > 0) {
        const ppSources = [data.Move1_PP ?? data.M1pp, data.Move2_PP ?? data.M2pp,
                           data.Move3_PP ?? data.M3pp, data.Move4_PP ?? data.M4pp];
        (set as Record<string, unknown>).movesInfo = ppSources
            .slice(0, moves.length)
            .map(pp => ({ maxPp: 99, pp: Math.max(0, pp ?? 0) }));
    }

    return set;
}

/** Pack a full team (array of PokemonSet) to Showdown wire format */
export function packTeamForShowdown(team: PokemonSetLike[]): string {
    return Teams.pack(team.filter(Boolean) as never);
}
