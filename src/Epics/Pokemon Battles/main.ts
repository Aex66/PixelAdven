/**
 * Pokemon Battles - Showdown-powered battle system.
 * Entry point: wires up wild encounter trigger.
 */
import { Player, world, system } from '@minecraft/server';
import { Battle, BATTLES, getPlayerTeamFromSelected } from './classes/Battle.js';
import { math } from '../Pokemon Calculations/main.js';
import { selected } from '../Main/Forms/PC/main.js';

world.afterEvents.entityHitEntity.subscribe(async ({ damagingEntity, hitEntity }) => {
    if (!(damagingEntity instanceof Player)) return;
    if (!hitEntity || !hitEntity.typeId) return;

    const typeId = hitEntity.typeId as string;
    if (!typeId.startsWith('pokeworld:wild_')) return;
    if (Array.from(BATTLES.values()).some(battle => battle.entityInBattle(hitEntity))) return;
    const player = damagingEntity as Player;
    const team = getPlayerTeamFromSelected(selected, player.name);
    if (!team) return player.sendMessage('§cYou have no Pokemon to battle with!');
    math(hitEntity, player);
    hitEntity.addEffect("slowness", 999999, { amplifier: 255, showParticles: false });
    system.runTimeout(() => {
        Battle.startWild(player, hitEntity, team);
    }, 5)
});