/**
 * Pokemon Battles — entry point.
 * Wires up all battle triggers:
 *   - Wild encounter      (player hits a wild entity)
 *   - Trainer battle      (player hits entity tagged "trainer")
 *   - Gym leader battle   (player hits entity tagged "gym_leader")
 *   - PvP                 (player hits another player → accept/decline form)
 */
import { Player, world, system } from '@minecraft/server';
import { ActionFormData, FormCancelationReason } from '@minecraft/server-ui';
import { Battle, BATTLES, getPlayerTeamFromSelected } from './classes/Battle.js';
import { math } from '../Pokemon Calculations/main.js';
import { selected } from '../Main/Forms/PC/main.js';

// ─── Wild encounters ───────────────────────────────────────────────────────────

world.afterEvents.entityHitEntity.subscribe(async ({ damagingEntity, hitEntity }) => {
    if (!(damagingEntity instanceof Player)) return;
    if (!hitEntity?.typeId) return;

    const typeId = hitEntity.typeId as string;
    const player = damagingEntity as Player;

    // ── Wild Pokemon ──────────────────────────────────────────────────────────
    if (typeId.startsWith('pokeworld:wild_')) {
        if (Array.from(BATTLES.values()).some(b => b.entityInBattle(hitEntity))) return;
        const team = getPlayerTeamFromSelected(selected, player.name);
        math(hitEntity, player);
        hitEntity.addEffect('slowness', 999999, { amplifier: 255, showParticles: false });
        system.runTimeout(() => Battle.startWild(player, hitEntity, team), 5);
        return;
    }

    // ── Trainer NPC ───────────────────────────────────────────────────────────
    if (hitEntity.hasTag('trainer')) {
        if (Array.from(BATTLES.values()).some(b =>
            b.entityInBattle(player as any) || b.entityInBattle(hitEntity)
        )) return;
        const team = getPlayerTeamFromSelected(selected, player.name);
        hitEntity.addEffect('slowness', 999999, { amplifier: 255, showParticles: false });
        system.runTimeout(() => Battle.startTrainer(player, hitEntity, team), 5);
        return;
    }

    // ── Gym Leader NPC ────────────────────────────────────────────────────────
    if (hitEntity.hasTag('gym_leader')) {
        if (Array.from(BATTLES.values()).some(b =>
            b.entityInBattle(player as any) || b.entityInBattle(hitEntity)
        )) return;
        const team = getPlayerTeamFromSelected(selected, player.name);
        hitEntity.addEffect('slowness', 999999, { amplifier: 255, showParticles: false });
        system.runTimeout(() => Battle.startGymLeader(player, hitEntity, team), 5);
        return;
    }

    // ── PvP: player hits another player ───────────────────────────────────────
    if (hitEntity instanceof Player) {
        const target = hitEntity as Player;
        const name = target.name;
        if (Array.from(BATTLES.values()).some(b =>
            b.entityInBattle(player as any) || b.entityInBattle(target as any)
        )) return;

        let retries = 0;
        // Show accept/decline form to the target
        function showForm() {
            if (retries > 20) {
                if (!target.isValid) return player.sendMessage(`§c${name} is not online, please try again later.`);
                return player.sendMessage(`§c${name} is busy, please try again later.`);
            }

            retries++;
            const form = new ActionFormData()
                .title('PvP Challenge')
                .body(`§e${player.name}§r wants to battle!\n\nDo you accept?`)
                .button('Accept!')
                .button('Decline');

            form.show(target).then((response) => {
                if (response.canceled && response.cancelationReason === FormCancelationReason.UserBusy) {
                    system.runTimeout(showForm, 20);
                    return;
                }

                if (response.canceled || response.selection !== 0) {
                    player.sendMessage(`§c${target.name} declined the battle.`);
                    return;
                }

                const team1 = getPlayerTeamFromSelected(selected, player.name);
                const team2 = getPlayerTeamFromSelected(selected, target.name);
                if (!team1) return player.sendMessage('§cYou have no Pokemon to battle with!');
                if (!team2) return target.sendMessage('§cYou have no Pokemon to battle with!');
                Battle.startPvP(player, target, team1, team2);
            });
        }
        showForm();
        player.sendMessage(`§aYou have sent a PvP challenge to ${name}.`);
    }
});
