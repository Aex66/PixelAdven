/**
 * WildBattler — battle participant backed by a wild Pokemon entity.
 *
 * The wild entity IS the Pokemon (it is both the controller and the active
 * Pokemon in slot 'a'), so no separate spawn is needed.  Uses RandomPlayerAI
 * for all decisions.
 */
import { Entity, system, TicksPerSecond } from '@minecraft/server';
import { RandomPlayerAI } from '../../simulator.js';
import { Battler, SlotKey } from './Battler.js';
import { collectEntityStats } from '../../../Pokemon Calculations/spawn.js';
import { teleportToSlot } from '../../battleArena.js';
import { BattleSession } from '../Battle.js';

export class WildBattler extends Battler {
    readonly kind = 'wild' as const;
    /** The wild Pokemon entity in the world. */
    readonly entity: Entity;
    ai: RandomPlayerAI;

    constructor(entity: Entity, sideId: 'p1' | 'p2') {
        const species = entity.typeId.replace('pokeworld:wild_', '');
        const data    = collectEntityStats(entity);
        super(sideId, species, [[0, species, data]]);
        this.entity = entity;
        // Pre-populate slot 'a' — the wild entity is available immediately.
        this.activePokemon.set('a', entity);
        this.deployedIndices.set('a', 0);
    }


    override setBattle(battle: BattleSession): void {
        super.setBattle(battle);
        this.ai = new RandomPlayerAI(this.battle.stream);
    }

    onSwitch(slot: SlotKey, _species: string): void {
        this.deployedIndices.set(slot, 0);
        this.activePokemon.set(slot, this.entity);
        try { this.entity.addTag('battle'); } catch { /* already tagged or gone */ }
        const slotPos = this.arenaSlotPositions.get(slot);
        if (slotPos) teleportToSlot(this.entity, slotPos);
    }

    onEnd(_winnerName: string | null, _result?: import('../../postBattle.js').BattleResult): void {
        for (const ent of this.activePokemon.values()) {
            if (!ent?.isValid) continue;
            try { ent.removeTag('battle'); } catch { /* ignore */ }
        }
        this.activePokemon.clear();

        try { if (this.entity?.isValid) this.entity.remove(); } catch { /* already gone */ }
    }

    override ownsEntity(entity: Entity): boolean {
        if (this.entity.id === entity.id) return true;
        return super.ownsEntity(entity);
    }

    receiveRequest(request: any): void {
        console.warn(`Wild battler received request: ${JSON.stringify(request, null, 2)}`)
        this.lastRequest = request;
        const choice = this.ai.receiveRequest(request);
        const MIN_WAIT_TIME = 2.5 * TicksPerSecond;
        const MAX_WAIT_TIME = 4 * TicksPerSecond;
        system.runTimeout(
            () => {
                if (!this.battle?.stream) return; // Battle Ended While timeout was active
                this.battle.stream._write(`>${this.sideId} ${choice}`);
            },
            Math.floor(Math.random() * (MAX_WAIT_TIME - MIN_WAIT_TIME + 1)) +
                MIN_WAIT_TIME
        );
    }
}
