/**
 * PlayerBattler — battle participant backed by a real Minecraft player.
 *
 * Responsibilities:
 *  - Creates and starts a PlayerBattleHandler (the Showdown-facing UI layer).
 *  - Spawns the player's active Pokemon as in-world entities for camera targeting.
 *  - Stops battle music and removes spawned Pokemon entities on battle end.
 */
import { Entity, Player as IPlayer } from '@minecraft/server';
import { Battler, SlotKey } from './Battler.js';
import { PlayerBattleHandler, CatchContext } from '../PlayerBattleHandler.js';
import { spawnPokemon } from '../../../Pokemon Calculations/spawn.js';
import {
    BattleResult, SyncableRequest,
    syncPokemonState, distributeExpAndEv, runLevelUpChecks, showBattleSummary,
    BattleSummary,
} from '../../postBattle.js';

export class PlayerBattler extends Battler {
    readonly kind = 'player' as const;
    readonly player: IPlayer;
    handler?: PlayerBattleHandler;

    constructor(player: IPlayer, sideId: 'p1' | 'p2', team: [number, string, any][]) {
        super(sideId, player.name, team);
        this.player = player;
    }

    start(playerStream: any, onRun?: () => void): void {
        this.handler = new PlayerBattleHandler(
            this.player,
            playerStream,
            onRun ?? (() => {})
        );
        this.handler.start();
    }

    onSwitch(slot: SlotKey, species: string): void {
        // Find the matching team slot by species name (case-insensitive).
        const idx = this.team.findIndex(
            ([, n]) => (n as string).toLowerCase() === species
        );
        if (idx < 0) return;

        void spawnPokemon(
            this.player as any,
            this.team[idx] as any,
            idx,
            false,
            (entity) => {
                this.activePokemon.set(slot, entity);
                entity.addTag('battle');
            }
        );
    }

    onEnd(winnerName: string | null, result?: BattleResult): void {
        // ── 1. Music stop ───────────────────────────────────────────────────────
        try { this.player?.runCommand('stopsound @s underground.battle_theme'); } catch { /* gone */ }

        // ── 2. Remove spawned battle Pokemon entities ───────────────────────────
        for (const ent of this.activePokemon.values()) {
            if (!ent?.isValid) continue;
            try { ent.removeTag('battle'); } catch { /* ignore */ }
            try { ent.remove(); } catch { /* ignore */ }
        }
        this.activePokemon.clear();

        if (!this.player?.isValid) return;

        // ── 3. State sync (HP / PP / status → longHand → writePokemon) ─────────
        const lastReq = this.handler?.lastRequest as SyncableRequest | null ?? null;
        syncPokemonState(this.player, this.team, lastReq);

        // ── 4. EXP & EV distribution, level-up, summary ────────────────────────
        const isWinner   = winnerName === this.player.name;
        const isTie      = winnerName === null;
        const outcome    = isWinner ? 'win' : isTie ? 'tie' : 'lose';
        const expSummary = new Map<number, number>(); // slot → totalExpGained

        if (isWinner && result?.faintedEntries?.length) {
            // Find entries where this battler's side did the fainting
            const relevantEntries = result.faintedEntries.filter(
                e => e.attackerSideId === this.sideId
            );

            for (const entry of relevantEntries) {
                const gained = distributeExpAndEv(this.team, entry);
                for (const [slot, exp] of gained) {
                    expSummary.set(slot, (expSummary.get(slot) ?? 0) + exp);
                }
            }
        }

        // Level-up checks (calls checkExperienceForTeam internally)
        const levelsGained = isWinner && expSummary.size > 0
            ? runLevelUpChecks(this.player, this.team)
            : new Map<number, number>();

        // Build per-Pokemon EXP summary list
        const expGains: BattleSummary['expGains'] = [];
        for (const [slotIdx, expGained] of expSummary) {
            const mon = this.team[slotIdx];
            if (!mon) continue;
            expGains.push({
                name:         String(mon[1]).split(':').pop()?.replace(/wild_/, '') ?? mon[1],
                expGained,
                levelsGained: levelsGained.get(slotIdx) ?? 0,
            });
        }

        // Trainer reward only if player won
        const reward = isWinner ? (result?.trainerReward ?? 0) : 0;

        if (reward > 0) {
            try {
                this.player.runCommand(`scoreboard players add @s coins ${reward}`);
            } catch { /* scoreboard may not exist */ }
        }

        // Show summary (async, non-blocking)
        void showBattleSummary(this.player, { outcome, expGains, trainerReward: reward });
    }

    /**
     * Called by Battle.ts after start() to wire up catch mechanics (wild battles only).
     * The handler must already exist (i.e. start() must have been called first).
     */
    configureCatch(ctx: CatchContext): void {
        this.handler?.setCatchContext(ctx);
    }

    override setFormHold(ticks: number): void {
        this.handler?.setFormHold(ticks);
    }

    override ownsEntity(entity: Entity): boolean {
        // The player entity itself counts as part of this battler.
        if (this.player.id === entity.id) return true;
        return super.ownsEntity(entity);
    }
}
