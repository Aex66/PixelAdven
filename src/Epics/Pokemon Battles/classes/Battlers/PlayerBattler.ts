/**
 * PlayerBattler — battle participant backed by a real Minecraft player.
 *
 * Responsibilities:
 *  - Creates and starts a PlayerBattleHandler (the Showdown-facing UI layer).
 *  - Spawns the player's active Pokemon as in-world entities for camera targeting.
 *  - Stops battle music and removes spawned Pokemon entities on battle end.
 */
import { Entity, Player as IPlayer, system, world } from '@minecraft/server';
import { Battler, SlotKey } from './Battler.js';
import { CatchContext, speciesFromDetails, formatCondition, showFormWithRetry, resolveAllyNames, toShowdownItemId } from '../PlayerBattleHandler.js';
import { spawnPokemon } from '../../../Pokemon Calculations/spawn.js';
import {
    BattleResult, SyncableRequest,
    syncPokemonState, showBattleSummary,
} from '../../postBattle.js';
import { teleportToSlot } from '../../battleArena.js';
import { setScore } from '../../utils.js';
import { updateSidebar } from '../../../Pokemon Calculations/updateTeam.js';
import { ActionFormData } from '@minecraft/server-ui';
import { Backpack } from '../../../Misc/backbag.js';
import { BATTLE_ITEMS, getBattleItemsFromBackpack } from '../../battleItems.js';
import { _catch } from '../../../Pokemon Calculations/catch.js';

export class PlayerBattler extends Battler {
    readonly kind = 'player' as const;
    readonly player: IPlayer;
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


    constructor(player: IPlayer, sideId: 'p1' | 'p2', team: [number, string, any][]) {
        super(sideId, player.name, team);
        this.player = player;
    }

    receiveRequest(request: ShowdownRequest): void {
        console.warn(`Player battler received request: ${JSON.stringify(request, null, 2)}`)
        if (!this.isValid()) return console.warn(`Player battler is not valid`)

        this.lastRequest = request;

        if (request.wait) return console.warn(`Player battler is waiting`)

       
        // Kick off async form handling - don't await since this method is synchronous
        this.dispatchRequest(request).catch(err => {
            console.warn('[PlayerBattler] UI error:', err);
            // Fallback: first available move or pass
            const firstAvailable = request.active?.[0]?.moves?.findIndex((m) => !m.disabled) ?? -1;
            this.battle.stream._write(`>${this.sideId} ${firstAvailable >= 0 ? `move ${firstAvailable + 1}` : 'pass'}`);
        });
    }

    private choose(choice: string): void {
        this.battle.stream._write(`>${this.sideId} ${choice}`);
    }

    private async dispatchRequest(req: ShowdownRequest): Promise<void> {
        if (this.isHandling) return console.warn(`Player battler is handling another request`)
        this.isHandling = true;

        try {
            // Wait for move animations / log display before showing the form.
            console.warn(`Player battler is waiting for form hold`)
            await this.waitForFormHold();
            console.warn(`Player battler is no longer waiting for form hold`)

            if (req.forceSwitch) {
                console.warn(`Player battler is handling force switch`)
                await this.handleForceSwitchAsync(req);
            } else if (req.teamPreview) {
                console.warn(`Player battler is accepting team preview`)
                // Auto-accept team preview — must send "team 123456" (no spaces, no commas)
                const count = req.side.pokemon.length;
                this.choose(`team ${Array.from({ length: count }, (_, i) => i + 1).join('')}`);
            } else if (req.active) {
                console.warn(`Player battler is handling move request`)
                await this.handleMoveRequestAsync(req);
            }
        } finally {
            this.isHandling = false;
        }
    }

    /** True if the opponent has a non-empty field slot (alive/active Pokémon). */
    private foeSlotHasLivePokemon(slotIdx: 0 | 1): boolean {
        const slotKey = slotIdx === 0 ? 'a' : 'b';
        const foeSide = this.sideId === 'p1' ? 'p2' : 'p1';
        const foe     = this.battle.battlers.get(foeSide);
        return foe?.deployedIndices.has(slotKey) ?? false;
    }

    /** Called by Battle.ts when a move animation starts. Prevents the form from appearing early. */
    override setFormHold(durationTicks: number): void {
        this.formHoldUntilTick = system.currentTick + durationTicks;
    }

    private waitForFormHold(): Promise<void> {
        const remaining = this.formHoldUntilTick - system.currentTick;
        if (remaining <= 0) return Promise.resolve();
        return new Promise<void>(resolve => system.runTimeout(resolve, remaining));
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

            const res = await showFormWithRetry(mainForm, this.player);
            if (!res) continue;

            switch (res.selection) {
                case 0: {
                    if (active.trapped || active.maybeTrapped) {
                        this.player.sendMessage('§cCan\'t switch! Your Pokémon is trapped!');
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

                const res = await showFormWithRetry(mainForm, this.player);
                if (!res) continue;

                switch (res.selection) {
                    case 0: { // Switch
                        if (active.trapped || active.maybeTrapped) {
                            this.player.sendMessage('§cCan\'t switch! Your Pokémon is trapped!');
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

        const res = await showFormWithRetry(form, this.player);
        if (!res) return null;

        const m = active.moves[res.selection];
        if (!m || m.disabled) return this.showDoublesMovesFormAsync(active, slotIdx, totalSlots, party, foeNames);

        const moveIndex = res.selection + 1;

        const target = m.target ?? 'normal';

        // Targets that never need manual selection — Showdown auto-resolves them
        const autoTargets = new Set([
            'all', 'allAdjacentFoes', 'allAdjacent', 'allies',
            'self', 'scripted', 'randomNormal',
            'allySide', 'allyTeam', 'foeSide',
        ]);

        if (autoTargets.has(target) || totalSlots < 2) {
            return `move ${moveIndex}`;
        }

        // These need a manual target pick: normal, adjacentFoe, adjacentAlly,
        // adjacentAllyOrSelf, any
        const allyNames = resolveAllyNames(party ?? [], totalSlots);

        const targetNum = await this.showTargetSelectionAsync(
            target, slotIdx, allyNames, foeNames ?? ['Foe 1', 'Foe 2']
        );
        if (targetNum === null) return null;
        return `move ${moveIndex} ${targetNum}`;
    }

    /**
     * Target picker for doubles moves.
     *
     * All Showdown MoveTarget types and how they're handled:
     *   Auto-resolved (no picker needed):
     *     all, allAdjacentFoes, allAdjacent, allies, self, scripted,
     *     randomNormal, allySide, allyTeam, foeSide
     *   Manual pick required:
     *     normal         — any adjacent (foes + ally + self in doubles)
     *     adjacentFoe    — only foe slots
     *     adjacentAlly   — only ally (partner), NOT self
     *     adjacentAllyOrSelf — ally + self
     *     any            — any Pokemon on the field
     *
     * Fainted slots are filtered. Auto-selects when ≤ 1 valid target remains.
     */
    private async showTargetSelectionAsync(
        targetType: string,
        mySlotIdx: number,
        allyNames: [string, string],
        foeNames: [string, string]
    ): Promise<number | null> {
        const options: { label: string; value: number }[] = [];
        const partnerIdx = mySlotIdx === 0 ? 1 : 0;

        const includeFoes  = targetType !== 'adjacentAlly' && targetType !== 'adjacentAllyOrSelf';
        const includeAlly  = targetType === 'adjacentAlly' || targetType === 'adjacentAllyOrSelf'
                          || targetType === 'any' || targetType === 'normal';
        const includeSelf  = targetType === 'adjacentAllyOrSelf' || targetType === 'normal';

        // Foes (positive indices: 1 = foe slot a, 2 = foe slot b)
        if (includeFoes) {
            if (this.foeSlotHasLivePokemon(0)) options.push({ label: `§c${foeNames[0]}§r`, value: 1 });
            if (this.foeSlotHasLivePokemon(1)) options.push({ label: `§c${foeNames[1]}§r`, value: 2 });
        }

        // Ally partner (negative index: -(partnerSlot+1))
        if (includeAlly) {
            options.push({ label: `§a${allyNames[partnerIdx]}§r`, value: -(partnerIdx + 1) });
        }

        // Self (negative index: -(mySlot+1))
        if (includeSelf) {
            options.push({ label: `§b${allyNames[mySlotIdx]}§r`, value: -(mySlotIdx + 1) });
        }

        if (options.length === 0) return 1;
        if (options.length === 1) return options[0].value;

        const form = new ActionFormData();
        form.title('Target');
        for (const opt of options) form.button(opt.label);
        form.button('§7← Back');

        const res = await showFormWithRetry(form, this.player);
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

        const res = await showFormWithRetry(form, this.player);
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
        const backpack = new Backpack(this.player);

        while (true) {
            const form = new ActionFormData();
            form.title('Bag');
            form.button('Healing');
            form.button('Pokeballs');
            form.button('Berries');
            form.button('Battle Items');
            form.button('§7← Back');

            const res = await showFormWithRetry(form, this.player);
            if (!res || res.selection === 4) return 'back';

            let result: 'chose' | 'back' | 'continue' = 'continue';

            switch (res.selection) {
                case 0: result = await this.showBagCategoryAsync(backpack, 'heal', 'Healing', party); break;
                case 1: result = await this.showBagCategoryAsync(backpack, 'ball', 'Pokeballs', party); break;
                case 2: result = await this.showBagCategoryAsync(backpack, 'berry', 'Berries', party); break;
                case 3: {
                    this.player.sendMessage('§eFeature not available yet');
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
            this.player.sendMessage('§cYou can only use Pokéballs in wild battles!');
            return 'continue';
        }

        // For the Healing category, also include revives
        const cats: typeof category[] = category === 'heal' ? ['heal', 'revive'] : [category];
        const available = getBattleItemsFromBackpack(backpack, cats);

        if (available.length === 0) {
            this.player.sendMessage(`§cNo ${title.toLowerCase()} items!`);
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

            const res = await showFormWithRetry(form, this.player);
            if (!res || res.selection === items.length) return 'back';

            const chosen = items[res.selection];
            if (!chosen) return 'back';

            const { id, item } = chosen;

            if (item.category === 'ball') {
                const ctx = this.catchContext!;
                const wildEntity = ctx.getWildEntity();
                if (!wildEntity?.isValid) {
                    this.player.sendMessage('§cNo target to throw at!');
                    return 'back';
                }
                if (!item.ballTag) {
                    this.player.sendMessage('§cThis ball is not configured!');
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
                    this.player.sendMessage('§cNo valid target!');
                    continue;
                }

                const activeIdx = party.indexOf(activePokemon) + 1;

                backpack.removeItem(item.backpackCategory, id, 1);
                backpack.save();

                const species = speciesFromDetails(activePokemon.details);
                this.player.sendMessage(`§a${species} used ${item.label}!§r`);
                this.choose(`bag-item ${toShowdownItemId(id)} ${activeIdx}`);
                return 'chose';

            } else if (item.category === 'revive') {
                const fainted = party.filter(p =>
                    !p.active && (p.condition === '0 fnt' || p.condition.endsWith(' fnt'))
                );
                if (fainted.length === 0) {
                    this.player.sendMessage('§cNo fainted Pokémon to revive!');
                    continue;
                }

                const target = await this.showReviveTargetAsync(fainted);
                if (!target) continue;

                const targetIdx = party.indexOf(target) + 1;

                backpack.removeItem(item.backpackCategory, id, 1);
                backpack.save();

                const species = speciesFromDetails(target.details);
                this.player.sendMessage(`§a${species} was revived!§r`);
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

        const res = await showFormWithRetry(form, this.player);
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

        const res = await showFormWithRetry(form, this.player);
        if (!res) return noCancel ? null : null;

        const backIdx = noCancel ? -1 : candidates.length;
        if (!noCancel && res.selection === backIdx) {
            return null; // Back
        }

        const chosen = candidates[res.selection];
        return chosen?.slot ?? null;
    }

    onSwitch(slot: SlotKey, species: string): void {
        const idx = this.findTeamIndex(slot, species);
        if (idx < 0) return;
        this.deployedIndices.set(slot, idx);

        const prev = this.activePokemon.get(slot);
        if (prev?.isValid) {
            try { prev.removeTag('battle'); } catch { /* gone */ }
            try { prev.remove(); } catch { /* gone */ }
        }

        const slotPos = this.arenaSlotPositions.get(slot);

        void spawnPokemon(
            this.player as any,
            this.team[idx] as any,
            idx,
            false,
            (entity) => {
                this.activePokemon.set(slot, entity);
                entity.addTag('battle');
                if (slotPos) teleportToSlot(entity, slotPos);
                entity.addEffect('slowness', 9999999, { amplifier: 255, showParticles: false });
            },
        );
    }

    override onFaint(slot: SlotKey): void {
        const ent = this.activePokemon.get(slot);
        if (ent?.isValid) {
            const idx = this.deployedIndices.get(slot);
            if (idx !== undefined && this.party[idx]?.pokemon) {
                const mon = this.party[idx].pokemon!.data as any;
                mon.Current_Health = 0;
                const getScore = (obj: string) => {
                    try {
                        const o = world.scoreboard.getObjective(obj);
                        return o?.getScore(ent!) ?? undefined;
                    } catch { return undefined; }
                };
                const ppVals = [getScore('move1pp'), getScore('move2pp'), getScore('move3pp'), getScore('move4pp')];
                if (ppVals[0] !== undefined) mon.Move1_PP = ppVals[0];
                if (ppVals[1] !== undefined) mon.Move2_PP = ppVals[1];
                if (ppVals[2] !== undefined) mon.Move3_PP = ppVals[2];
                if (ppVals[3] !== undefined) mon.Move4_PP = ppVals[3];
            }
        }
        super.onFaint(slot);
    }

    onEnd(winnerName: string | null, result?: BattleResult): void {
        // ── 0. Clear camera ──────────────────────────────────────────────────────
        try { this.player?.camera.clear(); } catch { /* gone */ }

        // ── 1. Music stop ───────────────────────────────────────────────────────
        try { this.player?.runCommand('stopsound @s underground.battle_theme'); } catch { /* gone */ }

        // ── 2. Remove spawned battle Pokemon entities ───────────────────────────
        for (const ent of this.activePokemon.values()) {
            if (!ent?.isValid) continue;
            try { ent.remove(); } catch { /* ignore */ }
        }
        this.activePokemon.clear();

        if (!this.player?.isValid) return;

        // ── 3. State sync (HP / PP / status → longHand → writePokemon) ─────────
        const lastReq = this.lastRequest as SyncableRequest | null ?? null;
        syncPokemonState(this.player, this.team, lastReq);

        const isWinner = winnerName === this.player.name;
        const isTie    = winnerName === null;
        const outcome  = isWinner ? 'win' : isTie ? 'tie' : 'lose';

        updateSidebar(this.player);

        // Show summary (async, non-blocking)
        void showBattleSummary(this.player, { outcome, expGains: [], trainerReward: 0 });
    }

    /**
     * Called by Battle.ts after start() to wire up catch mechanics (wild battles only).
     * The handler must already exist (i.e. start() must have been called first).
     */
    configureCatch(ctx: CatchContext): void {
        this.catchContext = ctx;
    }

    override ownsEntity(entity: Entity): boolean {
        // The player entity itself counts as part of this battler.
        if (this.player.id === entity.id) return true;
        return super.ownsEntity(entity);
    }
}
