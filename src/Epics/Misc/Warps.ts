import { Player, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { openMenu } from "./menu";

function isStaff(player: Player) {
    return player.hasTag("Admin") || player.hasTag("Owner");
}

function saveTempLocation(player: Player) {
    if (player.hasTag("on_plot") || player.hasTag("visitor")) return;
    const loc = player.location;
    const data = {
        x: Math.floor(loc.x),
        y: Math.floor(loc.y) + 1,
        z: Math.floor(loc.z)
    };
    player.setDynamicProperty("temp_tp", JSON.stringify(data));
}

function getTempLocation(player: Player): { x: number, y: number, z: number } | null {
    try {
        return JSON.parse(player.getDynamicProperty("temp_tp") as string ?? "null");
    } catch {
        return null;
    }
}

function clearTempLocation(player: Player) {
    player.setDynamicProperty("temp_tp", undefined);
}

export function openFlyMenu(player: Player) {

    // 🚫 HARD BLOCK: Pokémon is summoned
    if (player.hasTag("summoned")) {
        player.sendMessage("§cYou must recall your Pokémon before warping.");
        return;
    }

    const form = new ActionFormData();
    form.title("§7§7§rTravel Map");

    const locations: { 
        name: string, 
        icon: string, 
        score: string, 
        coords: { x: number, y: number, z: number } | null 
    }[] = [
        { name: 'Spawn', icon: 'textures/items/poke.png', score: 'spawn', coords: { x: -416, y: 8, z: -273 } },
        { name: 'Boulderfall City', icon: 'textures/minimap/npc2.png', score: 'OOC', coords: { x: 172, y: 47, z: -1971 } },
        { name: 'Obsidian Shade', icon: 'textures/minimap/npc5.png', score: 'OS', coords: { x: 551, y: 49, z: 1227 } },
        { name: 'Seabreeze Shoreline', icon: 'textures/minimap/npc8.png', score: 'SS', coords: { x: 1087, y: 25, z: -1392 } },
        { name: 'Skyforge Heights', icon: 'textures/minimap/npc7.png', score: 'SH', coords: { x: -2261, y: 132, z: -998 } },
        { name: 'Scorchstone City', icon: 'textures/minimap/npc9.png', score: 'SSC', coords: { x: -1142, y: 12, z: -512 } },
        { name: 'Dragonbone Ridge', icon: 'textures/minimap/npc6.png', score: 'DR', coords: { x: 1192, y: 44, z: 1483 } },
        { name: 'Glaciers Edge', icon: 'textures/minimap/npc4.png', score: 'GE', coords: { x: -335, y: 14, z: 2046 } },
        { name: 'Sylvestra City', icon: 'textures/minimap/npc3.png', score: 'SLC', coords: { x: -1202, y: 5, z: 567 } },
        { name: 'Victory Road', icon: 'textures/items/victory.png', score: 'victory', coords: { x: 1941, y: 3, z: -2272 } },
        { name: 'Battle Island', icon: 'textures/items/battle_island.png', score: 'BI', coords: { x: 2833, y: 4, z: 2409 } },
        { name: 'Safari Zone', icon: 'textures/blocks/double_plant_grass_carried.png', score: 'SZ', coords: { x: 1106, y: 7, z: -347 } },
        { name: 'Home', icon: 'textures/items/home.png', score: 'home', coords: null },
    ];

    const available: typeof locations = [];
    const unavailable: string[] = [];

    for (const loc of locations) {
        if (loc.score === "home") {
            if (player.hasTag("has_plot")) {
                form.button(loc.name, loc.icon);
                available.push(loc);
            } else {
                unavailable.push(loc.name);
            }
        } else {
            const playerScore = world.scoreboard.getObjective(loc.score)?.getScore(player) ?? 0;
            if (playerScore === 1) {
                form.button(loc.name, loc.icon);
                available.push(loc);
            } else {
                unavailable.push(loc.name);
            }
        }
    }

    // Optional "Return to Previous Location"
    if (getTempLocation(player)) {
        form.button("§eReturn to Previous Location", "textures/items/ender_pearl.png");
        available.push({ name: "§eReturn to Previous Location", icon: "", score: "temp", coords: null });
    }

    // Back button
    form.button("§8Back", "textures/items/left_arrow");
    const backIndex = available.length;

    form.show(player).then(res => {
        if (res.canceled || res.selection === backIndex) {
            openMenu(player);
            return;
        }

        const selected = available[res.selection];
        if (!selected) {
            player.sendMessage("§cYou have no locations unlocked!");
            return;
        }

        const clearScores = ["Main", "Forest", "Cave", "PowerP", "Ocean", "Safari", "Tower", "Frozen", "Volcano"];
        for (const score of clearScores) {
            player.runCommand(`scoreboard players set @s ${score} 0`);
            player.runCommand("tag @s remove on_plot");
        }

        // HOME teleport
        if (selected.score === "home") {
            if (!isStaff(player)) player.runCommand("gamemode s @s");
            player.addTag("on_plot");

            const x = world.scoreboard.getObjective("plot_x")?.getScore(player) ?? 0;
            const y = world.scoreboard.getObjective("plot_y")?.getScore(player) ?? 64;
            const z = world.scoreboard.getObjective("plot_z")?.getScore(player) ?? 0;

            player.teleport({ x, y, z });
            clearTempLocation(player);
        }

        // RETURN to previous location
        else if (selected.score === "temp") {
            if (!isStaff(player)) player.runCommand("gamemode a @s");
            player.runCommand("tag @s remove on_plot");

            const temp = getTempLocation(player);
            if (temp) player.teleport(temp);
            clearTempLocation(player);
        }

        // CITY teleports
        else {
            saveTempLocation(player);
            if (!isStaff(player)) player.runCommand("gamemode a @s");
            player.runCommand("tag @s remove on_plot");

            player.teleport(selected.coords!);
        }
    });
}
