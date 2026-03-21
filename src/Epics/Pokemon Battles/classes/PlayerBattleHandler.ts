/**
 * Player-controlled battle actor.
 * Extends RandomPlayerAI but overrides receiveRequest to show Minecraft UI forms
 * instead of making random choices.
 */
import { Player as IPlayer, system } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
import { RandomPlayerAI } from '../simulator.js';

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

// ---- Main class ----

export class PlayerBattleHandler extends RandomPlayerAI {
    private readonly mc_player: IPlayer;
    /** Called when the player selects "Run". Should write >forcetie to main stream. */
    private readonly onRun: () => void;
    /** Track whether we're currently showing a form to avoid re-entrancy */
    private isHandling = false;
    /** Game tick before which the battle form must not be shown (camera animation hold) */
    private formHoldUntilTick = 0;

    constructor(
        mc_player: IPlayer,
        stream: ConstructorParameters<typeof RandomPlayerAI>[0],
        onRun: () => void
    ) {
        super(stream);
        this.mc_player = mc_player;
        this.onRun = onRun;
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
        const active = req.active![0];
        const activePokemon = req.side.pokemon.find(p => p.active) ?? req.side.pokemon[0];
        const activeSpecies = speciesFromDetails(activePokemon?.details ?? '?');
        const hpDisplay = formatCondition(activePokemon?.condition ?? '?');

        // Loop so Bag / Back buttons can return here without recursion
        while (true) {
            const mainForm = new ActionFormData();
            // Title and button names match oldmenu.ts — these are UI style bindings
            mainForm.title('§3§3§rMenu');
            mainForm.body(`§e${activeSpecies}§r  HP: ${hpDisplay}`);
            mainForm.button('Pokemon');
            mainForm.button('Moves');
            mainForm.button('Bag');
            mainForm.button('Run');

            const res = await showFormWithRetry(mainForm, this.mc_player);
            if (!res) continue; // Player closed — re-show, they must pick

            switch (res.selection) {
                case 0: { // Pokemon → switch menu
                    if (active.trapped || active.maybeTrapped) {
                        this.mc_player.sendMessage('§cCan\'t switch! Your Pokémon is trapped!');
                        continue;
                    }
                    const switched = await this.handleSwitchMenuAsync(req.side.pokemon, false);
                    if (switched != null) {
                        this.choose(`switch ${switched}`);
                        return;
                    }
                    continue; // Back → re-show main menu
                }
                case 1: { // Moves
                    const madeChoice = await this.showMovesFormAsync(active);
                    if (madeChoice) return;
                    continue; // Back → re-show main menu
                }
                case 2: { // Bag — no functionality yet, just re-open
                    continue;
                }
                case 3: { // Run
                    this.onRun();
                    return;
                }
            }
        }
    }

    // ---- Moves Sub-menu ----

    /**
     * Show the moves list. Returns true if a move was chosen, false if player went back.
     * Title matches oldmenu.ts moveForm — UI style binding.
     */
    private async showMovesFormAsync(active: ShowdownActiveData): Promise<boolean> {
        const form = new ActionFormData();
        form.title('§2§2§rMoves');

        for (let i = 0; i < active.moves.length; i++) {
            const m = active.moves[i];
            const moveName = m.move ?? '—';
            const pp     = m.pp    ?? 0;
            const maxpp  = m.maxpp ?? 0;
            // padEnd(20, '#') matches old menu format — '#' is invisible in the custom resource pack
            const label = `${moveName.padEnd(20, '#')}${pp}/${maxpp}`;
            form.button(m.disabled ? `§8${label}§r` : label);
        }

        const res = await showFormWithRetry(form, this.mc_player);
        if (!res) return false; // Closed/back → return to main menu

        const m = active.moves[res.selection];
        if (!m || m.disabled) {
            // Picked a disabled move — re-show moves form
            return this.showMovesFormAsync(active);
        }

        this.choose(`move ${res.selection + 1}`);
        return true;
    }

    // ---- Force Switch (after faint) ----

    private async handleForceSwitchAsync(req: ShowdownRequest): Promise<void> {
        // noCancel = true means player cannot go back
        const choices: string[] = [];

        for (let slot = 0; slot < req.forceSwitch!.length; slot++) {
            const mustSwitch = req.forceSwitch![slot];
            if (!mustSwitch) {
                choices.push('pass');
                continue;
            }

            const slotIdx = await this.handleSwitchMenuAsync(req.side.pokemon, true, slot);
            choices.push(slotIdx != null ? `switch ${slotIdx}` : 'pass');
        }

        this.choose(choices.join(', '));
    }

    // ---- Switch Menu ----

    /**
     * Show switch party list. Returns 1-based party slot chosen, or null if player went back.
     * @param noCancel If true, don't show a back button (force switch).
     */
    private async handleSwitchMenuAsync(
        party: ShowdownPokemonSlot[],
        noCancel: boolean,
        forSlot?: number
    ): Promise<number | null> {
        const candidates: { slot: number; pokemon: ShowdownPokemonSlot }[] = [];
        for (let i = 0; i < party.length; i++) {
            const p = party[i];
            if (p.active) continue;
            if (p.condition === '0 fnt' || p.condition.endsWith(' fnt')) continue;
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
