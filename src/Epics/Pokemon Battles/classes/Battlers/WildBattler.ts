/**
 * WildBattler — battle participant backed by a wild Pokemon entity.
 *
 * The wild entity IS the Pokemon (it is both the controller and the active
 * Pokemon in slot 'a'), so no separate spawn is needed.  Uses RandomPlayerAI
 * for all decisions.
 */
import { Entity } from '@minecraft/server';
import { RandomPlayerAI } from '../../simulator.js';
import { Battler, SlotKey } from './Battler.js';
import { collectEntityStats } from '../../../Pokemon Calculations/spawn.js';

export class WildBattler extends Battler {
    readonly kind = 'wild' as const;
    /** The wild Pokemon entity in the world. */
    readonly entity: Entity;

    constructor(entity: Entity, sideId: 'p1' | 'p2') {
        const species = entity.typeId.replace('pokeworld:wild_', '');
        const data    = collectEntityStats(entity);
        super(sideId, species, [[0, species, data]]);
        this.entity = entity;
        // Pre-populate slot 'a' — the wild entity is available immediately.
        this.activePokemon.set('a', entity);
    }

    start(playerStream: any): void {
        const ai = new RandomPlayerAI(playerStream);
        (ai as any).start();
    }

    onSwitch(slot: SlotKey, _species: string): void {
        // Wild Pokemon only ever has one Pokemon — itself.
        this.activePokemon.set(slot, this.entity);
        try { this.entity.addTag('battle'); } catch { /* already tagged or gone */ }
    }

    onEnd(_winnerName: string | null): void {
        for (const ent of this.activePokemon.values()) {
            if (!ent?.isValid) continue;
            try { ent.removeTag('battle'); } catch { /* ignore */ }
        }
        this.activePokemon.clear();
    }

    override ownsEntity(entity: Entity): boolean {
        if (this.entity.id === entity.id) return true;
        return super.ownsEntity(entity);
    }
}
