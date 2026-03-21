/**
 * StrongHeuristicsAI — a smarter battle AI that evaluates type matchups,
 * STAB, and estimated damage to choose moves, switches, and team preview order.
 *
 * The `difficulty` option (1–5) controls how often the AI uses heuristic logic
 * vs. a random fallback:
 *   1 → ~20 % heuristic  (nearly random)
 *   3 → ~60 % heuristic  (default for trainers)
 *   5 → 100 % heuristic  (gym leader / hard mode)
 */
import { Dex, BattleStreams } from '../simulator.js';
// ─── Types (Showdown request shapes, kept loose with `any` for compatibility) ──

type AnyPokemon   = any;  // PokemonSwitchRequestData from Showdown side
type MoveOption   = { id: string; pp?: number; disabled?: boolean };
type AnyRequest   = any;

// ─── Options ──────────────────────────────────────────────────────────────────

export interface HeuristicsOptions {
    /** 1 (easiest) – 5 (hardest). Default: 3 */
    difficulty?: number;
}

// ─── AI class ─────────────────────────────────────────────────────────────────

export class StrongHeuristicsAI extends BattleStreams.BattlePlayer {
    private readonly difficulty: number;

    constructor(stream: any, options: HeuristicsOptions = {}) {
        super(stream);
        this.difficulty = Math.max(1, Math.min(5, options.difficulty ?? 3));
    }

    receiveError(error: Error): void {
        if (!error.message.startsWith('[Unavailable choice]'))
            console.warn('[StrongHeuristicsAI]', error.message);
    }

    receiveRequest(request: AnyRequest): void {
        if (request.wait) return;
        if (request.forceSwitch) {
            this.choose(this.handleForceSwitch(request));
        } else if (request.active) {
            this.choose(this.handleMoveChoice(request));
        } else {
            // Team preview or unknown — send default ordering
            this.choose(this.handleTeamPreview(request));
        }
    }

    // ── Move selection ─────────────────────────────────────────────────────────

    private handleMoveChoice(request: AnyRequest): string {
        const { side, active } = request;
        if (!side?.pokemon || !active?.length) return 'pass';

        return (active as any[]).map((activeMon: any, slotIdx: number) => {
            const sidePoke: AnyPokemon = side.pokemon[slotIdx];
            if (!sidePoke || sidePoke.condition?.endsWith(' fnt')) return 'pass';

            const moves: MoveOption[] = activeMon.moves ?? [];
            const available = moves.filter(m => !m.disabled && (m.pp ?? 1) > 0);
            if (!available.length) return 'pass';

            // Randomly fall back to a random move based on difficulty
            if (Math.random() > this.difficulty / 5) {
                const pick = available[Math.floor(Math.random() * available.length)];
                return `move ${moves.indexOf(pick) + 1}`;
            }

            // Heuristic: pick the highest-scoring move against the active foe
            const foe: AnyPokemon = side.foePokemon?.find(
                (p: AnyPokemon) => p.active && !p.condition?.endsWith(' fnt')
            );

            let bestScore = -Infinity;
            let bestIdx   = moves.indexOf(available[0]) + 1;

            for (const m of available) {
                const score = this.scoreMove(m, sidePoke, foe);
                if (score > bestScore) {
                    bestScore = score;
                    bestIdx   = moves.indexOf(m) + 1;
                }
            }
            return `move ${bestIdx}`;
        }).join(', ');
    }

    /**
     * Score a single move option against a defender.
     * Higher = better choice this turn.
     */
    private scoreMove(
        moveOpt: MoveOption,
        attacker: AnyPokemon,
        defender: AnyPokemon | undefined
    ): number {
        // Try both common Dex APIs across @pkmn/sim versions
        const dexAny = Dex as any;
        const moveData = dexAny.moves?.get(moveOpt.id)
                      ?? dexAny.getMove?.(moveOpt.id)
                      ?? null;
        if (!moveData) return 0;

        // Status moves: small flat score so they're only chosen when everything
        // else scores lower (e.g. all physical moves are resisted)
        if (moveData.category === 'Status') return 5;

        const basePower: number = moveData.basePower ?? 0;
        if (basePower === 0) return 0;

        const accuracy: number = moveData.accuracy === true ? 100 : (moveData.accuracy ?? 100);
        let score = basePower * (accuracy / 100);

        // STAB
        if ((attacker?.types as string[] | undefined)?.includes(moveData.type))
            score *= 1.5;

        // Type effectiveness against the defender's types
        if (defender?.types) score *= this.typeMultiplier(moveData.type, defender.types);

        // Burn penalty: halves physical damage output
        if (moveData.category === 'Physical' && attacker?.status === 'brn') score *= 0.5;

        return score;
    }

    // ── Forced switch ──────────────────────────────────────────────────────────

    private handleForceSwitch(request: AnyRequest): string {
        const { side } = request;
        const slots: boolean[] = request.forceSwitch ?? [];
        if (!side?.pokemon) return 'pass';

        const choices = slots.map((mustSwitch: boolean) => {
            if (!mustSwitch) return 'pass';

            const bench: { p: AnyPokemon; slot: number }[] = (side.pokemon as AnyPokemon[])
                .map((p, i) => ({ p, slot: i + 1 }))
                .filter(({ p }) => !p.active && !p.condition?.endsWith(' fnt'));

            if (!bench.length) return 'pass';

            const foe: AnyPokemon = side.foePokemon?.find(
                (p: AnyPokemon) => p.active && !p.condition?.endsWith(' fnt')
            );
            if (!foe) return `switch ${bench[0].slot}`;

            // Choose the bench Pokemon with the best type matchup against the foe
            let bestScore = -Infinity;
            let bestSlot  = bench[0].slot;
            for (const { p, slot } of bench) {
                const score = this.matchupScore(p, foe);
                if (score > bestScore) { bestScore = score; bestSlot = slot; }
            }
            return `switch ${bestSlot}`;
        });

        return choices.join(', ');
    }

    // ── Team preview ───────────────────────────────────────────────────────────

    private handleTeamPreview(request: AnyRequest): string {
        const { side } = request;
        if (!side?.pokemon?.length) return 'default';

        const foes: AnyPokemon[] = side.foePokemon ?? [];

        const scored = (side.pokemon as AnyPokemon[]).map((p, i) => ({
            slot:  i + 1,
            score: foes.reduce((sum, foe) => sum + this.matchupScore(p, foe), 0),
        }));

        scored.sort((a, b) => b.score - a.score);
        return `team ${scored.map(s => s.slot).join('')}`;
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    /**
     * Overall matchup score between two Pokemon.
     * Positive = myPoke has the advantage, negative = disadvantage.
     */
    private matchupScore(myPoke: AnyPokemon, foePoke: AnyPokemon): number {
        const myTypes:  string[] = myPoke.types  ?? [];
        const foeTypes: string[] = foePoke.types ?? [];

        // Best offensive type multiplier my Pokemon can threaten
        const offScore = myTypes.length > 0
            ? Math.max(...myTypes.map(t => this.typeMultiplier(t, foeTypes)))
            : 1;

        // Best offensive type multiplier the foe can threaten against me
        const defScore = foeTypes.length > 0
            ? Math.max(...foeTypes.map(t => this.typeMultiplier(t, myTypes)))
            : 1;

        return offScore - defScore;
    }

    /**
     * Compute the combined type-effectiveness multiplier for one attack type
     * vs. a list of defender types, using Showdown's `damageTaken` table.
     *
     * damageTaken values: 0 = neutral, 1 = super effective (×2),
     *                     2 = not very effective (×0.5), 3 = immune (×0)
     */
    private typeMultiplier(atkType: string, defTypes: string[]): number {
        let mult = 1;
        for (const defType of defTypes) {
            try {
                const typeData = (Dex as any).types?.get(defType);
                const dmgTaken: number = typeData?.damageTaken?.[atkType] ?? 0;
                if (dmgTaken === 1)      mult *= 2;
                else if (dmgTaken === 2) mult *= 0.5;
                else if (dmgTaken === 3) { mult = 0; break; }
            } catch { /* ignore unknown types */ }
        }
        return mult;
    }
}
