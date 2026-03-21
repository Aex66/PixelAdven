/**
 * TrainerBattler — battle participant backed by a trainer or gym leader NPC.
 *
 * Both trainer and gym leader share this class.  The only differences are:
 *   - Trainer NPCs despawn when the battle ends; gym leaders do not.
 *   - Gym leaders typically have a higher default AI difficulty.
 *
 * The active Pokemon entity is currently a placeholder (the NPC entity itself)
 * until Step 5 implements actual trainer-party Pokemon spawning.
 */
import { Entity } from '@minecraft/server';
import { RandomPlayerAI } from '../../simulator.js';
import { StrongHeuristicsAI } from '../StrongHeuristicsAI.js';
import { Battler, SlotKey } from './Battler.js';

export class TrainerBattler extends Battler {
    readonly kind: 'trainer' | 'gymleader';
    /** The NPC entity in the world. */
    readonly entity: Entity;
    /** 0 → RandomPlayerAI, 1–5 → StrongHeuristicsAI (higher = smarter). */
    readonly difficulty: number;
    /**
     * When true the NPC entity is removed from the world when the battle ends.
     * Defaults to true for trainers and false for gym leaders.
     */
    readonly despawnOnEnd: boolean;

    constructor(
        entity: Entity,
        kind: 'trainer' | 'gymleader',
        sideId: 'p1' | 'p2',
        team: [number, string, any][],
        options: { difficulty?: number; despawnOnEnd?: boolean } = {}
    ) {
        super(sideId, entity.nameTag || kind, team);
        this.kind        = kind;
        this.entity      = entity;
        this.difficulty  = options.difficulty  ?? 0;
        // Trainers despawn by default; gym leaders stay.
        this.despawnOnEnd = options.despawnOnEnd ?? (kind === 'trainer');
    }

    start(playerStream: any): void {
        const ai = this.difficulty > 0
            ? new StrongHeuristicsAI(playerStream, { difficulty: this.difficulty })
            : new RandomPlayerAI(playerStream);
        ai .start();
    }

    onSwitch(slot: SlotKey, _species: string): void {
        // TODO Step 5: spawn the trainer's actual Pokemon entity at the battle
        // position so camera animations and particles target the right entity.
        // For now the NPC entity is used as a placeholder reference.
        this.activePokemon.set(slot, this.entity);
        try { this.entity.addTag('battle'); } catch { /* ignore */ }
    }

    onEnd(_winnerName: string | null): void {
        for (const ent of this.activePokemon.values()) {
            if (!ent?.isValid) continue;
            try { ent.removeTag('battle'); } catch { /* ignore */ }
        }
        this.activePokemon.clear();

        if (this.despawnOnEnd && this.entity?.isValid) {
            try { this.entity.remove(); } catch { /* ignore */ }
        }
    }

    override ownsEntity(entity: Entity): boolean {
        if (this.entity.id === entity.id) return true;
        return super.ownsEntity(entity);
    }
}
