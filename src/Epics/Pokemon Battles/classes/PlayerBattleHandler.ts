/**
 * Player-controlled battle actor.
 * Extends RandomPlayerAI but overrides receiveRequest to show Minecraft UI forms
 * instead of making random choices.
 */
import { Entity, Player as IPlayer, system } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';

// ---- Helpers ----

/**
 * Convert a backpack item ID to Showdown's item ID format.
 * 'pokeworld:super_potion' → 'superpotion'
 */
export function toShowdownItemId(backpackId: string): string {
    return backpackId.replace(/^[^:]+:/, '').replace(/[^a-z0-9]/gi, '').toLowerCase();
}

/** Parse condition string into displayable HP. "267/267 par" → "267/267 par" */
export function formatCondition(condition: string): string {
    if (!condition) return '?';
    if (condition === '0 fnt') return '§cFainted§r';
    const parts = condition.split(' ');
    const hp = parts[0] ?? '?/?';
    const status = parts[1] ?? '';
    const statusColor: Record<string, string> = {
        par: '§e[PAR]§r', brn: '§6[BRN]§r', psn: '§5[PSN]§r',
        tox: '§5[TOX]§r', slp: '§8[SLP]§r', frz: '§b[FRZ]§r',
    };
    return `${hp}${status ? ' ' + (statusColor[status] ?? `[${status.toUpperCase()}]`) : ''}`;
}

/** Extract species name from details string "Pikachu, L25, M" */
export function speciesFromDetails(details: string): string {
    return (details ?? '?').split(',')[0].trim();
}

/** Show an ActionFormData to a player, retrying if the player is busy */
export async function showFormWithRetry(form: ActionFormData, player: IPlayer, maxRetries = 20): Promise<{ selection: number } | null> {
    for (let i = 0; i < maxRetries; i++) {
        const res = await form.show(player);
        if (res.cancelationReason === 'UserBusy') {
            // Wait a tick and retry
            await new Promise<void>(resolve => {
                const id = (player as any).__server__?.system?.runTimeout
                    ? undefined
                    : system.run(resolve);
                void id;
                system.run(resolve);
            });
            continue;
        }
        if (res.canceled) return null;
        return { selection: res.selection ?? 0 };
    }
    return null;
}

// ---- Catch context ----

/**
 * Provided by Battle.ts for wild battles only.
 * Enables the Bag menu to show Pokéballs and trigger the catch sequence.
 */
export interface CatchContext {
    /** Returns the wild entity (null if already gone). */
    getWildEntity: () => Entity | null;
    /** Returns the current battle turn (for Timer Ball calculation). */
    getTurn: () => number;
    /**
     * Called when a Pokemon is successfully caught.
     * Responsible for adding it to the PC and ending the battle.
     */
    onCaught: () => void;
}

/** Resolve the names of own active Pokemon from the party (slot a, slot b). */
export function resolveAllyNames(party: ShowdownPokemonSlot[], totalSlots: number): [string, string] {
    const active = party.filter(p => p.active);
    return [
        speciesFromDetails(active[0]?.details ?? '?'),
        totalSlots > 1 ? speciesFromDetails(active[1]?.details ?? '?') : '?',
    ];
}