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
import { Entity, system, TicksPerSecond } from '@minecraft/server';
import { RandomPlayerAI } from '../../simulator.js';
import { Battler, SlotKey } from './Battler.js';
import { spawnPokemon } from '../../../Pokemon Calculations/spawn.js';
import { teleportToSlot } from '../../battleArena.js';
import { BattleSession } from '../Battle.js';

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
    ai: RandomPlayerAI;

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

    override setBattle(battle: BattleSession): void {
        super.setBattle(battle);
        this.ai = new RandomPlayerAI(this.battle.stream);
    }

    onSwitch(slot: SlotKey, species: string): void {
        const idx = this.findTeamIndex(slot, species);
        if (idx < 0) return;
        this.deployedIndices.set(slot, idx);

        const prev = this.activePokemon.get(slot);
        if (prev?.isValid && prev.id !== this.entity.id) {
            try { prev.removeTag('battle'); } catch { /* gone */ }
            try { prev.remove(); } catch { /* gone */ }
        }

        const slotPos = this.arenaSlotPositions.get(slot);

        void spawnPokemon(
            this.entity as any,
            this.team[idx] as any,
            idx,
            false,
            (entity) => {
                this.activePokemon.set(slot, entity);
                entity.addTag('battle');
                if (slotPos) teleportToSlot(entity, slotPos);
            },
        );
    }

    onEnd(_winnerName: string | null, _result?: import('../../postBattle.js').BattleResult): void {
        for (const ent of this.activePokemon.values()) {
            if (!ent?.isValid) continue;
            try { ent.removeTag('battle'); } catch { /* ignore */ }
            // Remove spawned Pokemon entities (but not the NPC itself — handled below)
            if (ent.id !== this.entity.id) {
                try { ent.remove(); } catch { /* ignore */ }
            }
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

    receiveRequest(request: any): void {
        console.warn(`Trainer battler received request: ${JSON.stringify(request, null, 2)}`)
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
