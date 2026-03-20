import { Player, system, world } from '@minecraft/server'
import { selected } from '../Main/Forms/PC/main'
import { writePokemon } from '../Pokemon Database/main'
import './Caves'
import './Desert'
import './Forest'
import './Frozen'
import './Jungle'
import './Mountain'
import './Oceans'
import './Plains'
import './Safari'
import './Swamp'
import './Volcano'

// SAFE SCOREBOARD GETTER
function getScore(entity: Player, objective: string): number {
    try {
        return world.scoreboard.getObjective(objective)?.getScore(entity) ?? 0;
    } catch {
        return 0;
    }
}

// SAFE SCOREBOARD SETTER
function setScore(entity: Player, objective: string, value: number): void {
    const obj =
        world.scoreboard.getObjective(objective) ??
        world.scoreboard.addObjective(objective, objective);

    obj.setScore(entity, value);
}

// ⭐ WALKING FRIENDSHIP SYSTEM ⭐
// Every 128 steps → +1 friendship to all team Pokémon (longhand only)

system.runInterval(() => {
    for (const player of world.getPlayers()) {

        // Get persistent step counter
        const steps = getScore(player, "friendSteps");

        if (steps < 128) continue;

        // Subtract threshold instead of reset (handles overflow)
        setScore(player, "friendSteps", steps - 128);

        // Apply friendship to team
        giveWalkingFriendship(player);
    }
}, 20);

function giveWalkingFriendship(player: Player) {

    const team = selected[player.name];
    if (!team) return;

    const gain = 1; // +1 friendship

    for (let i = 0; i < 6; i++) {
        const mon = team[i];
        if (!mon) continue;

        // LONGHAND ONLY — no scoreboard
        mon[2].friendShipLevel = Math.min(
            255,
            (mon[2].friendShipLevel ?? 0) + gain
        );

        // Persist update
        writePokemon(player, "team", i, mon[2]);
    }
}