/**
 * Battle-usable item configuration, derived from the backpackConfig so
 * item IDs and display names stay in sync automatically.
 *
 * Items are read from / removed via the existing Backpack class (dynamic
 * property storage) — NOT from the player's Minecraft inventory.
 */
import { backpackConfig } from '../../Letters/pokemon/backpackConfig.js';
import { Backpack } from '../Misc/backbag.js';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type BattleItemCategory = 'heal' | 'ball' | 'revive' | 'berry';

export interface BattleItem {
    /** How this item behaves during a Showdown battle. */
    category: BattleItemCategory;
    /** Display name for the Bag form. */
    label: string;
    /** The Backpack category key used for reads/writes (e.g. 'Pokeballs'). */
    backpackCategory: string;
    /**
     * For Poké Balls only: the entity tag to apply before calling `_catch`.
     * Derived automatically from the item ID (strip 'pokeworld:' prefix).
     * Must match a key in `ballTags` from Pokemon Calculations/catch.ts.
     */
    ballTag?: string;
}

// ─── Revive IDs ────────────────────────────────────────────────────────────────
// These live in the 'Healing' backpack category but behave as revives in battle.

const REVIVE_IDS = new Set([
    'pokeworld:revive',
    'pokeworld:max_revive',
    'pokeworld:sacred_ash',
]);

// ─── Battle-usable berry IDs ───────────────────────────────────────────────────
// Only berries with an immediate in-battle effect are included.

const BATTLE_BERRY_IDS = new Set([
    'pokeworld:oran_berry',     // +10 HP
    'pokeworld:sitrus_berry',   // +25 % HP
    'pokeworld:lum_berry',      // cures any status
    'pokeworld:cheri_berry',    // cures paralysis
    'pokeworld:chesto_berry',   // cures sleep
    'pokeworld:pecha_berry',    // cures poison
    'pokeworld:rawst_berry',    // cures burn
    'pokeworld:aspear_berry',   // cures freeze
    'pokeworld:persim_berry',   // cures confusion
    'pokeworld:leppa_berry',    // restores 10 PP to one move
]);

// ─── Build BATTLE_ITEMS from backpackConfig ────────────────────────────────────
// Keeps display names and IDs in sync with the rest of the addon automatically.

function buildBattleItems(): Record<string, BattleItem> {
    const map: Record<string, BattleItem> = {};

    for (const { id, displayName } of backpackConfig.Pokeballs) {
        map[id] = {
            category: 'ball',
            label: displayName,
            backpackCategory: 'Pokeballs',
            // 'pokeworld:pokeball' → 'pokeball' — matches key in ballTags
            ballTag: id.replace('pokeworld:', ''),
        };
    }

    for (const { id, displayName } of backpackConfig.Healing) {
        map[id] = {
            category: REVIVE_IDS.has(id) ? 'revive' : 'heal',
            label: displayName,
            backpackCategory: 'Healing',
        };
    }

    for (const { id, displayName } of backpackConfig.Berries) {
        if (BATTLE_BERRY_IDS.has(id)) {
            map[id] = {
                category: 'berry',
                label: displayName,
                backpackCategory: 'Berries',
            };
        }
    }

    return map;
}

export const BATTLE_ITEMS = buildBattleItems();

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Returns items the player has in their Backpack that can be used in battle.
 * Pass a pre-constructed Backpack instance (avoids redundant dynamic property reads).
 */
export function getBattleItemsFromBackpack(
    backpack: Backpack,
    categories: BattleItemCategory[]
): { id: string; item: BattleItem; count: number }[] {
    const result: { id: string; item: BattleItem; count: number }[] = [];
    for (const [id, item] of Object.entries(BATTLE_ITEMS)) {
        if (!categories.includes(item.category)) continue;
        const count = backpack.getItemCount(item.backpackCategory, id);
        if (count > 0) result.push({ id, item, count });
    }
    return result;
}
