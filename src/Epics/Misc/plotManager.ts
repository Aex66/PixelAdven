import { world, system, Player, ScoreboardObjective } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

const PLOT_COST = 30000;
const MAX_PLOTS = 100;
let plotsSold = 0;

function getScore(player: Player, objective: string): number {
    try {
        const obj = world.scoreboard.getObjective(objective);
        return obj?.getScore(player) ?? 0;
    } catch {
        return 0;
    }
}

function setScore(player: Player, objective: string, value: number) {
    let obj = world.scoreboard.getObjective(objective);
    if (!obj) {
        obj = world.scoreboard.addObjective(objective, objective);
    }
    obj.setScore(player, value);
}

function hasTag(entity: any, tag: string): boolean {
    return entity.getTags().includes(tag);
}

function handlePlotAreaKillCheck() {
    const AREA = { x: -1300, y: 60, z: -80, dx: 20, dy: 30, dz: 20 };

    world.getAllPlayers().forEach(player => {
        if (hasTag(player, "plot_override")) return;

        const loc = player.location;
        if (
            loc.x >= AREA.x && loc.x <= AREA.x + AREA.dx &&
            loc.y >= AREA.y && loc.y <= AREA.y + AREA.dy &&
            loc.z >= AREA.z && loc.z <= AREA.z + AREA.dz
        ) {
            let airAbove = true, airBelow = true;

            for (let y = loc.y + 1; y <= AREA.y + AREA.dy; y++) {
                const block = player.dimension.getBlock({ x: loc.x, y, z: loc.z });
                if (block?.typeId !== "minecraft:air") {
                    airAbove = false;
                    break;
                }
            }

            for (let y = AREA.y; y < loc.y; y++) {
                const block = player.dimension.getBlock({ x: loc.x, y, z: loc.z });
                if (block?.typeId !== "minecraft:air") {
                    airBelow = false;
                    break;
                }
            }

            if (airAbove && airBelow) {
                player.runCommand("kill @s");
            }
        }
    });
}

system.runInterval(() => handlePlotAreaKillCheck(), 40);

world.afterEvents.entityHitEntity.subscribe(async ({ damagingEntity: attacker, hitEntity: manager }) => {
    if (!(attacker instanceof Player)) return;
    if (!hasTag(manager, "PlManager")) return;

    const player = attacker;

    if (hasTag(player, "has_plot")) {
        player.sendMessage("§cYou already own a plot and cannot purchase another.");
        return;
    }

    const balance = getScore(player, "Money");

    if (balance < PLOT_COST) {
        player.sendMessage("§cYou do not have enough funds to purchase a plot. Come back later.");
        return;
    }

    const form = new ActionFormData()
        .title("Plot Purchase")
        .body("Would you like to purchase a plot for 30,000?")
        .button("Yes")
        .button("No");

    const res = await form.show(player);
    if (res.canceled || res.selection !== 0) return;

    // Deduct money
    setScore(player, "Money", balance - PLOT_COST);

    // Add tickingarea
    player.runCommand(`execute at @e[name=PPC] run tickingarea add circle ~ ~ ~ 4 plot_system_b`);

    // Get PPC entity
    const ppc = [...world.getDimension("overworld").getEntities({ type: "armor_stand", name: "PPC" })][0];
    if (!ppc) {
        player.sendMessage("§cPlot system is missing the PPC entity.");
        return;
    }

    // Calculate and save spawn coords
    const spawnX = Math.floor(ppc.location.x + 7);
    const spawnY = Math.floor(ppc.location.y + 32);
    const spawnZ = Math.floor(ppc.location.z + 7);

    setScore(player, "plot_x", spawnX);
    setScore(player, "plot_y", spawnY);
    setScore(player, "plot_z", spawnZ);

      // Delay tickingarea removal and PPC teleport to ensure correct timing
    system.runTimeout(() => {
        // Remove original tickingarea
        player.runCommand("tickingarea remove plot_system");

        // Move PPC entity 80 blocks forward in X
        ppc.teleport(
            { x: ppc.location.x + 80, y: ppc.location.y, z: ppc.location.z },
            { facingLocation: ppc.location }
        );
    }, 40);

    // Notify player
    player.sendMessage("§aYou have successfully purchased a plot. Using the Menu item will allow you to enter and exit your plot.");
    player.addTag("has_plot");

    // Remove temporary tickingarea
    player.runCommand(`tickingarea remove plot_system_b`);

    // Teleport player to spawnpoint
    player.teleport({ x: spawnX, y: spawnY, z: spawnZ });

    // Delayed redstone block fill trigger
    system.runTimeout(() => {
        player.runCommand(`execute as @e[name=PPC] at @s run fill ~ 77 ~ ~ 77 ~ redstone_block`);
    }, 60); // delay in ticks (~0.25s)

    // Track number of plots
    plotsSold++;
    if (plotsSold >= MAX_PLOTS) {
        plotsSold = 0;

        player.runCommand(`execute at @e[name=PPC] run tickingarea add circle ~ ~ ~ 4 plot_system_b`);
        player.runCommand(`execute as @e[type=armor_stand,name=PPC] at @s run tp -1319 80 ~-80`);
        player.runCommand(`tickingarea remove plot_system`);
        player.runCommand(`tickingarea remove plot_system_b`);
        player.runCommand(`execute as @e[name=PPC] at @e[name=PPC] run fill ~-80 77 ~ ~-80 77 ~ redstone_block`)
    }
});