/**
 * Abstract base class for all battle participants.
 *
 * Each concrete subclass (PlayerBattler, WildBattler, TrainerBattler) owns:
 *  - its Showdown player stream (AI or UI handler)
 *  - its in-world entity references
 *  - its end-of-battle behaviour (cleanup, rewards, despawns, music stop, etc.)
 *
 * Battle.ts orchestrates the stream loop and delegates battler-specific work
 * to these classes via the abstract interface below.
 */
import { Entity } from '@minecraft/server';
import { BattleResult } from '../../postBattle.js';
import { SlotPosition } from '../../battleArena.js';
import { buildPartyFromTuples, type PartyPokemon } from '../Pokemon.js';
import { BattleSession } from '../Battle.js';

export type BattlerKind = 'player' | 'wild' | 'trainer' | 'gymleader';
export type SlotKey = 'a' | 'b';

export abstract class Battler {
    abstract readonly kind: BattlerKind;
    /** True if the battler has been destroyed */
    destroyed: boolean;
    readonly sideId: 'p1' | 'p2';
    readonly displayName: string;
    /** Party slots with stable uuids, participation flags, and {@link Pokemon} state. */
    readonly party: PartyPokemon[];

    /**
     * Currently deployed in-world entities for this side, keyed by slot.
     * Slot 'a' is the primary (and only) slot in singles.
     * Slot 'b' is the secondary slot for doubles.
     */
    readonly activePokemon: Map<SlotKey, Entity | null> = new Map();

    /** World positions assigned by Battle.ts after arena layout is computed. */
    readonly arenaSlotPositions: Map<SlotKey, SlotPosition> = new Map();

    /** Maps slot → team index currently deployed in that slot. Used to avoid duplicate matching. */
    readonly deployedIndices: Map<SlotKey, number> = new Map();

    battle: BattleSession;
    lastRequest: any | null;

    constructor(sideId: 'p1' | 'p2', displayName: string, teamTuples: [number, string, any][]) {
        this.sideId      = sideId;
        this.displayName = displayName;
        this.party       = buildPartyFromTuples(teamTuples);
        this.destroyed   = false;
    }

    setBattle(battle: BattleSession): void {
        this.battle = battle;
    }

    /** Legacy `[id, species, data][]` view — same data references as `party[].pokemon`. */
    get team(): [number, string, any][] {
        return this.party.map(pp => {
            const p = pp.pokemon;
            if (!p) throw new Error(`PartyPokemon at slot ${pp.slot} has no pokemon`);
            return [p.pokeId, p.species, p.data];
        });
    }

    /**
     * Called by the omniscient stream loop when Showdown reports a
     * switch or drag event for this battler's side.
     * Implementations should update `activePokemon` and do any in-world
     * work (spawn entity, add 'battle' tag, etc.).
     */
    abstract onSwitch(slot: SlotKey, species: string): void;

    /**
     * Called when the battle is fully over.
     * Handle win/lose messages, despawning NPCs, stopping music,
     * removing in-world Pokemon entities, EXP distribution, state sync, etc.
     */
    abstract onEnd(winnerName: string | null, result?: BattleResult): void;

    abstract receiveRequest(request: any): void;

    /**
     * Called on |faint| — removes the entity from the world and clears it from activePokemon.
     * PlayerBattler overrides to handle score-based data save before removal.
     */
    onFaint(slot: SlotKey): void {
        const teamIdx = this.deployedIndices.get(slot);
        if (teamIdx !== undefined) {
            const pp = this.party[teamIdx];
            if (pp?.pokemon) pp.pokemon.fainted = true;
        }
        const ent = this.activePokemon.get(slot);
        if (ent?.isValid) {
            try { ent.remove(); } catch { /* gone */ }
        }
        this.activePokemon.delete(slot);
        this.deployedIndices.delete(slot);
    }

    isValid(): boolean {
        return !this.destroyed;
    }

    /**
     * Delay the battle form for this battler by the given number of ticks from now.
     * Only meaningful for PlayerBattler (delegates to PlayerBattleHandler.setFormHold).
     * All other battlers no-op by default.
     */
    setFormHold(_ticks: number): void {}

    /**
     * Finds the team index for a species, skipping indices already deployed in other slots.
     * This handles the case where two team members share the same species.
     */
    findTeamIndex(slot: SlotKey, species: string): number {
        const usedIndices = new Set<number>();
        for (const [otherSlot, idx] of this.deployedIndices) {
            if (otherSlot !== slot) usedIndices.add(idx);
        }
        return this.party.findIndex(
            (pp, i) =>
                !usedIndices.has(i) &&
                pp.pokemon !== undefined &&
                pp.pokemon.species.toLowerCase() === species.toLowerCase()
        );
    }

    /**
     * Returns true if the given entity is "owned" by this battler —
     * i.e. it is the controller entity or one of the active Pokemon entities.
     * Used by ArenaSession.entityInBattle() to detect already-in-battle entities.
     */
    ownsEntity(entity: Entity): boolean {
        for (const ent of this.activePokemon.values()) {
            if (ent?.id === entity.id) return true;
        }
        return false;
    }
}
