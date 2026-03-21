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
import { PlayerBattleHandler } from '../PlayerBattleHandler.js';
import { spawnPokemon } from '../../../Pokemon Calculations/spawn.js';

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

    onEnd(_winnerName: string | null): void {
        // Stop battle music.
        try { this.player?.runCommand('stopsound @s underground.battle_theme'); } catch { /* gone */ }

        // Remove any in-world Pokemon entities that were spawned for this battle.
        for (const ent of this.activePokemon.values()) {
            if (!ent?.isValid) continue;
            try { ent.removeTag('battle'); } catch { /* ignore */ }
            try { ent.remove(); } catch { /* ignore */ }
        }
        this.activePokemon.clear();
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
