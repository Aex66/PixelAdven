/**
 * Player-controlled battle actor.
 * Extends RandomPlayerAI but overrides receiveRequest to show Minecraft UI forms
 * instead of making random choices.
 */
import { Entity, Player, Player as IPlayer, system } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
import { RandomPlayerAI } from '../simulator.js';
import { BATTLE_ITEMS, getBattleItemsFromBackpack } from '../battleItems.js';
import { Backpack } from '../../Misc/backbag.js';
import { _catch } from '../../Pokemon Calculations/catch.js';

// ---- Types for the Showdown request shape (the .d.ts is incomplete, so we use our own) ----

interface ShowdownMove {
    move: string;
    id: string;
    pp?: number;
    maxpp?: number;
    target?: string;
    disabled?: boolean | string;
}

interface ShowdownPokemonSlot {
    ident: string;        // "p1: Pikachu"
    details: string;      // "Pikachu, L25, M"
    condition: string;    // "267/267" | "189/267 par" | "0 fnt"
    active: boolean;
    moves: string[];
    item: string;
    baseAbility: string;
}

interface ShowdownActiveData {
    moves: ShowdownMove[];
    trapped?: boolean;
    maybeTrapped?: boolean;
    canMegaEvo?: boolean;
}

interface ShowdownRequest {
    wait?: true;
    active?: ShowdownActiveData[];
    forceSwitch?: boolean[];
    teamPreview?: true;
    side: {
        id: string;        // "p1"
        name: string;
        pokemon: ShowdownPokemonSlot[];
    };
    noCancel?: boolean;
}

// ---- Helpers ----

/**
 * Convert a backpack item ID to Showdown's item ID format.
 * 'pokeworld:super_potion' → 'superpotion'
 */
function toShowdownItemId(backpackId: string): string {
    return backpackId.replace(/^[^:]+:/, '').replace(/[^a-z0-9]/gi, '').toLowerCase();
}

/** Parse condition string into displayable HP. "267/267 par" → "267/267 par" */
function formatCondition(condition: string): string {
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
function speciesFromDetails(details: string): string {
    return (details ?? '?').split(',')[0].trim();
}

/** Show an ActionFormData to a player, retrying if the player is busy */
async function showFormWithRetry(form: ActionFormData, player: IPlayer, maxRetries = 20): Promise<{ selection: number } | null> {
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
function resolveAllyNames(party: ShowdownPokemonSlot[], totalSlots: number): [string, string] {
    const active = party.filter(p => p.active);
    return [
        speciesFromDetails(active[0]?.details ?? '?'),
        totalSlots > 1 ? speciesFromDetails(active[1]?.details ?? '?') : '?',
    ];
}

// ---- Main class ----

export class PlayerBattleHandler extends RandomPlayerAI {
    private readonly mc_player: IPlayer;
    /** Called when the player selects "Run". Should write >forcetie to main stream. */
    private readonly onRun: () => void;
    /** Track whether we're currently showing a form to avoid re-entrancy */
    private isHandling = false;
    /** Game tick before which the battle form must not be shown (camera animation hold) */
    private formHoldUntilTick = 0;
    /** Set by Battle.ts after construction, only present in wild battles. */
    private catchContext: CatchContext | null = null;

    /** The most recent |request| payload received from Showdown. Used for post-battle state sync. */
    lastRequest: unknown = null;
    /** Updated by Battle.ts on |switch|/|drag| — names of the foe's active Pokemon. */
    foeActiveNames: [string, string] = ['Foe 1', 'Foe 2'];

    constructor(
        mc_player: IPlayer,
        stream: ConstructorParameters<typeof RandomPlayerAI>[0],
        onRun: () => void
    ) {
        super(stream);
        this.mc_player = mc_player;
        this.onRun = onRun;
    }

    /** Called by Battle.ts to wire up catch mechanics for wild battles. */
    setCatchContext(ctx: CatchContext): void {
        this.catchContext = ctx;
    }

    /** Called by Battle.ts when a move animation starts. Prevents the form from appearing early. */
    setFormHold(durationTicks: number): void {
        this.formHoldUntilTick = system.currentTick + durationTicks;
    }

    private waitForFormHold(): Promise<void> {
        const remaining = this.formHoldUntilTick - system.currentTick;
        if (remaining <= 0) return Promise.resolve();
        return new Promise<void>(resolve => system.runTimeout(resolve, remaining));
    }

    receiveError(error: Error): void {
        // Unavailable choice = showdown will resend the request
        if (error.message.startsWith('[Unavailable choice]')) return;
        // For other errors, show in chat and don't crash
        this.mc_player.sendMessage(`§c[Battle Error] ${error.message}`);
    }

    receiveRequest(request: unknown): void {
        const req = request as ShowdownRequest;

        // Always store the last request — used for HP/PP/status sync at battle end.
        if (!req.wait) this.lastRequest = req;

        if (req.wait) return; // Nothing to do this turn

        // Kick off async form handling - don't await since this method is synchronous
        this.dispatchRequest(req).catch(err => {
            console.warn('[PlayerBattleHandler] UI error:', err);
            // Fallback: first available move or pass
            const firstAvailable = req.active?.[0]?.moves?.findIndex(m => !m.disabled) ?? -1;
            this.choose(firstAvailable >= 0 ? `move ${firstAvailable + 1}` : 'pass');
        });
    }

    private async dispatchRequest(req: ShowdownRequest): Promise<void> {
        if (this.isHandling) return;
        this.isHandling = true;
        try {
            // Wait for any active camera animation to finish before showing the form.
            // This also ensures chat logs from the turn are visible before UI appears.
            await this.waitForFormHold();

            if (req.forceSwitch) {
                await this.handleForceSwitchAsync(req);
            } else if (req.teamPreview) {
                // Auto-accept team preview — must send "team 123456" (no spaces, no commas)
                const count = req.side.pokemon.length;
                this.choose(`team ${Array.from({ length: count }, (_, i) => i + 1).join('')}`);
            } else if (req.active) {
                await this.handleMoveRequestAsync(req);
            }
        } finally {
            this.isHandling = false;
        }
    }

    // ---- Move Request ----

    private async handleMoveRequestAsync(req: ShowdownRequest): Promise<void> {
        const activeSlots = req.active!;
        const isDoubles   = activeSlots.length > 1;

        // In doubles we collect one action per active slot then send them comma-separated.
        if (isDoubles) {
            await this.handleDoublesRequestAsync(req);
            return;
        }

        // ── Singles path (unchanged) ─────────────────────────────────────────────
        const active = activeSlots[0];
        const activePokemon = req.side.pokemon.find(p => p.active) ?? req.side.pokemon[0];
        const activeSpecies = speciesFromDetails(activePokemon?.details ?? '?');
        const hpDisplay = formatCondition(activePokemon?.condition ?? '?');

        while (true) {
            const mainForm = new ActionFormData();
            mainForm.title('§3§3§rMenu');
            mainForm.body(`§e${activeSpecies}§r  HP: ${hpDisplay}`);
            mainForm.button('Pokemon');
            mainForm.button('Moves');
            mainForm.button('Bag');
            mainForm.button('Run');

            const res = await showFormWithRetry(mainForm, this.mc_player);
            if (!res) continue;

            switch (res.selection) {
                case 0: {
                    if (active.trapped || active.maybeTrapped) {
                        this.mc_player.sendMessage('§cCan\'t switch! Your Pokémon is trapped!');
                        continue;
                    }
                    const switched = await this.handleSwitchMenuAsync(req.side.pokemon, false);
                    if (switched != null) {
                        this.choose(`switch ${switched}`);
                        return;
                    }
                    continue;
                }
                case 1: {
                    const madeChoice = await this.showMovesFormAsync(active);
                    if (madeChoice) return;
                    continue;
                }
                case 2: {
                    const bagResult = await this.showBagAsync(active, req.side.pokemon);
                    if (bagResult === 'chose') return;
                    continue;
                }
                case 3: {
                    this.onRun();
                    return;
                }
            }
        }
    }

    // ---- Doubles Request ----

    /**
     * In doubles, the player must choose an action for each active slot.
     * Actions are collected in order, then sent as "action1, action2".
     */
    private async handleDoublesRequestAsync(req: ShowdownRequest): Promise<void> {
        const activeSlots = req.active!;
        const party       = req.side.pokemon;
        const actions: string[] = [];

        // Track which switch slots are already chosen this turn to prevent the same
        // party member from being sent in twice.
        const switchedSlots = new Set<number>();

        for (let slotIdx = 0; slotIdx < activeSlots.length; slotIdx++) {
            const active = activeSlots[slotIdx];

            // If this slot has no Pokemon (fainted and no replacement), pass.
            const activeMons = party.filter(p => p.active);
            const activePokemon = activeMons[slotIdx] ?? activeMons[0];
            if (!activePokemon || activePokemon.condition === '0 fnt') {
                actions.push('pass');
                continue;
            }

            const species  = speciesFromDetails(activePokemon.details);
            const hp       = formatCondition(activePokemon.condition);
            const slotLabel = activeSlots.length > 1 ? ` §7[Slot ${slotIdx + 1}]§r` : '';

            let chose = false;
            while (!chose) {
                const mainForm = new ActionFormData();
                mainForm.title('§3§3§rMenu');
                mainForm.body(`§e${species}§r  HP: ${hp}${slotLabel}`);
                mainForm.button('Pokemon');
                mainForm.button('Moves');
                mainForm.button('Bag');
                mainForm.button('Run');

                const res = await showFormWithRetry(mainForm, this.mc_player);
                if (!res) continue;

                switch (res.selection) {
                    case 0: { // Switch
                        if (active.trapped || active.maybeTrapped) {
                            this.mc_player.sendMessage('§cCan\'t switch! Your Pokémon is trapped!');
                            continue;
                        }
                        const switched = await this.handleSwitchMenuAsync(party, false, undefined, switchedSlots);
                        if (switched != null) {
                            actions.push(`switch ${switched}`);
                            switchedSlots.add(switched);
                            chose = true;
                        }
                        break;
                    }
                    case 1: { // Moves
                        const moveAction = await this.showDoublesMovesFormAsync(
                            active, slotIdx, activeSlots.length, party, this.foeActiveNames
                        );
                        if (moveAction) {
                            actions.push(moveAction);
                            chose = true;
                        }
                        break;
                    }
                    case 2: { // Bag
                        const bagResult = await this.showBagAsync(active, party);
                        if (bagResult === 'chose') {
                            // Bag items consume the entire turn for all slots in doubles;
                            // remaining slots auto-pass.
                            while (actions.length < activeSlots.length - 1) actions.push('pass');
                            this.choose(actions.join(', '));
                            return;
                        }
                        break;
                    }
                    case 3: { // Run
                        this.onRun();
                        return;
                    }
                }
            }
        }

        this.choose(actions.join(', '));
    }

    // ---- Doubles move selection (with target) ----

    /**
     * Show moves form for a doubles slot. Returns the full action string
     * (e.g. "move 2 1") or null if the player went back.
     */
    private async showDoublesMovesFormAsync(
        active: ShowdownActiveData,
        slotIdx: number,
        totalSlots: number,
        party?: ShowdownPokemonSlot[],
        foeNames?: [string, string]
    ): Promise<string | null> {
        const form = new ActionFormData();
        form.title('§2§2§rMoves');

        for (const m of active.moves) {
            const label = `${(m.move ?? '—').padEnd(20, '#')}${m.pp ?? 0}/${m.maxpp ?? 0}`;
            form.button(m.disabled ? `§8${label}§r` : label);
        }

        const res = await showFormWithRetry(form, this.mc_player);
        if (!res) return null;

        const m = active.moves[res.selection];
        if (!m || m.disabled) return this.showDoublesMovesFormAsync(active, slotIdx, totalSlots, party, foeNames);

        const moveIndex = res.selection + 1;

        const target = m.target ?? 'normal';
        const needsTarget = (
            target === 'normal' || target === 'adjacentFoe' || target === 'adjacentAlly' ||
            target === 'adjacentAllyOrSelf' || target === 'any'
        );

        if (!needsTarget || totalSlots < 2) {
            return `move ${moveIndex}`;
        }

        const allyNames = resolveAllyNames(party ?? [], totalSlots);

        const targetNum = await this.showTargetSelectionAsync(
            target, slotIdx, allyNames, foeNames ?? ['Foe 1', 'Foe 2']
        );
        if (targetNum === null) return null;
        return `move ${moveIndex} ${targetNum}`;
    }

    /**
     * Shows a target picker for doubles moves with real Pokemon names.
     * Foe = §c red, Ally = §a green, Self = §b light blue.
     */
    private async showTargetSelectionAsync(
        targetType: string,
        mySlotIdx: number,
        allyNames: [string, string],
        foeNames: [string, string]
    ): Promise<number | null> {
        const form = new ActionFormData();
        form.title('Target');

        const options: { label: string; value: number }[] = [];

        if (targetType !== 'adjacentAlly' && targetType !== 'adjacentAllyOrSelf') {
            options.push({ label: `§c${foeNames[0]}§r`, value: 1 });
            options.push({ label: `§c${foeNames[1]}§r`, value: 2 });
        }
        if (targetType === 'adjacentAlly' || targetType === 'adjacentAllyOrSelf' || targetType === 'any') {
            const partnerIdx = mySlotIdx === 0 ? 1 : 0;
            options.push({ label: `§a${allyNames[partnerIdx]}§r`, value: -(partnerIdx + 1) });
        }
        if (targetType === 'adjacentAllyOrSelf') {
            options.push({ label: `§b${allyNames[mySlotIdx]}§r`, value: -(mySlotIdx + 1) });
        }

        for (const opt of options) form.button(opt.label);
        form.button('§7← Back');

        const res = await showFormWithRetry(form, this.mc_player);
        if (!res || res.selection === options.length) return null;

        return options[res.selection]?.value ?? null;
    }

    // ---- Moves Sub-menu (Singles) ----

    /**
     * Show the moves list for singles. Returns true if a move was chosen, false if player went back.
     */
    private async showMovesFormAsync(active: ShowdownActiveData): Promise<boolean> {
        const form = new ActionFormData();
        form.title('§2§2§rMoves');

        for (let i = 0; i < active.moves.length; i++) {
            const m = active.moves[i];
            const moveName = m.move ?? '—';
            const pp     = m.pp    ?? 0;
            const maxpp  = m.maxpp ?? 0;
            const label = `${moveName.padEnd(20, '#')}${pp}/${maxpp}`;
            form.button(m.disabled ? `§8${label}§r` : label);
        }

        const res = await showFormWithRetry(form, this.mc_player);
        if (!res) return false;

        const m = active.moves[res.selection];
        if (!m || m.disabled) {
            return this.showMovesFormAsync(active);
        }

        this.choose(`move ${res.selection + 1}`);
        return true;
    }

    // ---- Bag ----

    /**
     * Show the bag main menu with category buttons, each leading to its own sub-menu.
     * Returns 'chose' if an item was used, or 'back' if the player went back.
     */
    private async showBagAsync(
        active: ShowdownActiveData,
        party: ShowdownPokemonSlot[]
    ): Promise<'chose' | 'back'> {
        const backpack = new Backpack(this.mc_player as unknown as Player);

        while (true) {
            const form = new ActionFormData();
            form.title('§5§5§rBag');
            form.button('Healing');
            form.button('Pokeballs');
            form.button('Berries');
            form.button('Battle Items');
            form.button('§7← Back');

            const res = await showFormWithRetry(form, this.mc_player);
            if (!res || res.selection === 4) return 'back';

            let result: 'chose' | 'back' | 'continue' = 'continue';

            switch (res.selection) {
                case 0: result = await this.showBagCategoryAsync(backpack, 'heal', 'Healing', party); break;
                case 1: result = await this.showBagCategoryAsync(backpack, 'ball', 'Pokeballs', party); break;
                case 2: result = await this.showBagCategoryAsync(backpack, 'berry', 'Berries', party); break;
                case 3: {
                    this.mc_player.sendMessage('§eFeature not available yet');
                    continue;
                }
            }

            if (result === 'chose') return 'chose';
            // 'back' or 'continue' → re-show bag main menu
        }
    }

    /**
     * Show items of a single bag category. Returns 'chose' if an item was used,
     * 'back' to go back to the bag main menu, or 'continue' if nothing happened.
     */
    private async showBagCategoryAsync(
        backpack: Backpack,
        category: 'heal' | 'ball' | 'revive' | 'berry',
        title: string,
        party: ShowdownPokemonSlot[]
    ): Promise<'chose' | 'back' | 'continue'> {
        const isWild = this.catchContext !== null;

        // Pokeballs only allowed in wild battles
        if (category === 'ball' && !isWild) {
            this.mc_player.sendMessage('§cYou can only use Pokéballs in wild battles!');
            return 'continue';
        }

        // For the Healing category, also include revives
        const cats: typeof category[] = category === 'heal' ? ['heal', 'revive'] : [category];
        const available = getBattleItemsFromBackpack(backpack, cats);

        if (available.length === 0) {
            this.mc_player.sendMessage(`§cNo ${title.toLowerCase()} items!`);
            return 'continue';
        }

        while (true) {
            // Re-read counts (they change after use)
            const items = getBattleItemsFromBackpack(backpack, cats);
            if (items.length === 0) return 'back';

            const form = new ActionFormData();
            form.title(title);

            for (const { item, count } of items) {
                form.button(`${item.label}  §7x${count}`);
            }
            form.button('§7← Back');

            const res = await showFormWithRetry(form, this.mc_player);
            if (!res || res.selection === items.length) return 'back';

            const chosen = items[res.selection];
            if (!chosen) return 'back';

            const { id, item } = chosen;

            if (item.category === 'ball') {
                const ctx = this.catchContext!;
                const wildEntity = ctx.getWildEntity();
                if (!wildEntity?.isValid) {
                    this.mc_player.sendMessage('§cNo target to throw at!');
                    return 'back';
                }
                if (!item.ballTag) {
                    this.mc_player.sendMessage('§cThis ball is not configured!');
                    return 'back';
                }

                backpack.removeItem(item.backpackCategory, id, 1);
                backpack.save();

                const allBallKeys = Object.values(BATTLE_ITEMS)
                    .filter(i => i.ballTag)
                    .map(i => i.ballTag!);
                for (const bt of allBallKeys) {
                    try { wildEntity.removeTag(bt); } catch { /* not tagged */ }
                }
                wildEntity.addTag(item.ballTag);

                const catchResult = await _catch(wildEntity, { turn: ctx.getTurn() });
                if (catchResult === 'POKEMON_CAUGHT') {
                    ctx.onCaught();
                    return 'chose';
                }
                this.choose('used-ball');
                return 'chose';

            } else if (item.category === 'heal' || item.category === 'berry') {
                const activePokemon = party.find(p => p.active);
                if (!activePokemon || activePokemon.condition === '0 fnt') {
                    this.mc_player.sendMessage('§cNo valid target!');
                    continue;
                }

                const activeIdx = party.indexOf(activePokemon) + 1;

                backpack.removeItem(item.backpackCategory, id, 1);
                backpack.save();

                const species = speciesFromDetails(activePokemon.details);
                this.mc_player.sendMessage(`§a${species} used ${item.label}!§r`);
                this.choose(`bag-item ${toShowdownItemId(id)} ${activeIdx}`);
                return 'chose';

            } else if (item.category === 'revive') {
                const fainted = party.filter(p =>
                    !p.active && (p.condition === '0 fnt' || p.condition.endsWith(' fnt'))
                );
                if (fainted.length === 0) {
                    this.mc_player.sendMessage('§cNo fainted Pokémon to revive!');
                    continue;
                }

                const target = await this.showReviveTargetAsync(fainted);
                if (!target) continue;

                const targetIdx = party.indexOf(target) + 1;

                backpack.removeItem(item.backpackCategory, id, 1);
                backpack.save();

                const species = speciesFromDetails(target.details);
                this.mc_player.sendMessage(`§a${species} was revived!§r`);
                this.choose(`bag-item ${toShowdownItemId(id)} ${targetIdx}`);
                return 'chose';
            }
        }
    }

    // ---- Revive target selection ----

    private async showReviveTargetAsync(targets: ShowdownPokemonSlot[]): Promise<ShowdownPokemonSlot | null> {
        const form = new ActionFormData();
        form.title('§5§5§rChoose target');
        for (const p of targets) {
            form.button(`§e${speciesFromDetails(p.details)}§r\n§7${formatCondition(p.condition)}`);
        }
        form.button('§7← Back');

        const res = await showFormWithRetry(form, this.mc_player);
        if (!res || res.selection === targets.length) return null;
        return targets[res.selection] ?? null;
    }

    // ---- Force Switch (after faint) ----

    private async handleForceSwitchAsync(req: ShowdownRequest): Promise<void> {
        const choices: string[] = [];
        const excludeSlots = new Set<number>();

        for (let slot = 0; slot < req.forceSwitch!.length; slot++) {
            const mustSwitch = req.forceSwitch![slot];
            if (!mustSwitch) {
                choices.push('pass');
                continue;
            }

            const slotIdx = await this.handleSwitchMenuAsync(req.side.pokemon, true, slot, excludeSlots);
            if (slotIdx != null) {
                choices.push(`switch ${slotIdx}`);
                excludeSlots.add(slotIdx);
            } else {
                choices.push('pass');
            }
        }

        this.choose(choices.join(', '));
    }

    // ---- Switch Menu ----

    /**
     * Show switch party list. Returns 1-based party slot chosen, or null if player went back.
     * @param noCancel     If true, don't show a back button (force switch).
     * @param forSlot      Slot label for the prompt (doubles force switch).
     * @param excludeSlots 1-based slot numbers already chosen this turn (doubles).
     */
    private async handleSwitchMenuAsync(
        party: ShowdownPokemonSlot[],
        noCancel: boolean,
        forSlot?: number,
        excludeSlots?: Set<number>
    ): Promise<number | null> {
        const candidates: { slot: number; pokemon: ShowdownPokemonSlot }[] = [];
        for (let i = 0; i < party.length; i++) {
            const p = party[i];
            if (p.active) continue;
            if (p.condition === '0 fnt' || p.condition.endsWith(' fnt')) continue;
            if (excludeSlots?.has(i + 1)) continue;
            candidates.push({ slot: i + 1, pokemon: p });
        }

        if (candidates.length === 0) {
            // Nothing to switch to
            return null;
        }

        const form = new ActionFormData();
        // Title matches oldmenu.ts spawnPokemonForm — UI style binding
        form.title('Your team');
        form.body(forSlot != null ? `Choose a Pokémon to send in (slot ${forSlot + 1}):` : 'Choose a Pokémon to send in:');

        for (const { pokemon } of candidates) {
            const species = speciesFromDetails(pokemon.details);
            const hp = formatCondition(pokemon.condition);
            form.button(`§e${species}§r\n§7HP: ${hp}`);
        }

        if (!noCancel) {
            form.button('§7← Back');
        }

        const res = await showFormWithRetry(form, this.mc_player);
        if (!res) return noCancel ? null : null;

        const backIdx = noCancel ? -1 : candidates.length;
        if (!noCancel && res.selection === backIdx) {
            return null; // Back
        }

        const chosen = candidates[res.selection];
        return chosen?.slot ?? null;
    }

    // ---- Util ----

    private getSwitchTargets(party: ShowdownPokemonSlot[]): ShowdownPokemonSlot[] {
        return party.filter(p => {
            if (p.active) return false;
            if (p.condition === '0 fnt' || p.condition.endsWith(' fnt')) return false;
            return true;
        });
    }
}
