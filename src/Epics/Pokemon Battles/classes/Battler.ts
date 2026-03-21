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

export type BattlerKind = 'player' | 'wild' | 'trainer' | 'gymleader';
export type SlotKey = 'a' | 'b';

export abstract class Battler {
    abstract readonly kind: BattlerKind;

    readonly sideId: 'p1' | 'p2';
    readonly displayName: string;
    readonly team: [number, string, any][];

    /**
     * Currently deployed in-world entities for this side, keyed by slot.
     * Slot 'a' is the primary (and only) slot in singles.
     * Slot 'b' is the secondary slot for doubles (future).
     */
    readonly activePokemon: Map<SlotKey, Entity | null> = new Map();

    constructor(sideId: 'p1' | 'p2', displayName: string, team: [number, string, any][]) {
        this.sideId    = sideId;
        this.displayName = displayName;
        this.team      = team;
    }

    /**
     * Wire up this battler's Showdown player stream.
     *  - PlayerBattler  → creates PlayerBattleHandler and shows UI
     *  - WildBattler    → starts RandomPlayerAI
     *  - TrainerBattler → starts RandomPlayerAI or StrongHeuristicsAI
     *
     * `onRun` is the callback to execute when the player hits "Run".
     * AI battlers can safely ignore it.
     */
    abstract start(playerStream: any, onRun?: () => void): void;

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
     * removing in-world Pokemon entities, etc.
     */
    abstract onEnd(winnerName: string | null): void;

    /**
     * Delay the battle form for this battler by the given number of ticks from now.
     * Only meaningful for PlayerBattler (delegates to PlayerBattleHandler.setFormHold).
     * All other battlers no-op by default.
     */
    setFormHold(_ticks: number): void {}

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
