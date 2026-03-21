// @ts-nocheck
import { Player, world, Block } from "@minecraft/server";
import { isWithinPlotBounds, loadPlotData } from "./PlotPerms";

const allowedTags = ["onPlot", "Staff", "Owner", "on_plot"];
const regionBypassTags = ["Owner", "Staff", "Admin"]; 

// ❌ Manual clicking blocked — ✔ Redstone allowed
const manualDoorBlocks = [
    "minecraft:oak_door", "minecraft:birch_door", "minecraft:spruce_door",
    "minecraft:jungle_door", "minecraft:acacia_door", "minecraft:dark_oak_door",
    "minecraft:crimson_door", "minecraft:warped_door", "minecraft:iron_door",

    "minecraft:oak_trapdoor", "minecraft:birch_trapdoor", "minecraft:spruce_trapdoor",
    "minecraft:jungle_trapdoor", "minecraft:acacia_trapdoor", "minecraft:dark_oak_trapdoor",
    "minecraft:crimson_trapdoor", "minecraft:warped_trapdoor", "minecraft:iron_trapdoor"
];

// ❌ Fully blocked unless perms
const protectedContainers = [
    "minecraft:chest",
    "minecraft:trapped_chest",
    "minecraft:barrel",
    "minecraft:lever"
];

function hasGeneralPermission(player: Player): boolean {
    return allowedTags.some(tag => player.hasTag(tag));
}

function hasRegionBypass(player: Player): boolean {
    return regionBypassTags.some(tag => player.hasTag(tag));
}

function isInRestrictedRegion(block: Block): boolean {
    const { x, z } = block.location;
    return x <= 1200 && x >= -1200 && z <= 1200 && z >= -1200;
}

function hasPlotPermission(
    player: Player,
    type: "build" | "break" | "open" | "interact"
): boolean {
    const owner = world.getPlayers().find(
        p => p !== player && isWithinPlotBounds(player, p)
    );
    if (!owner || owner.name === player.name) return false;

    const data = loadPlotData(owner);
    const perms = data?.permissions?.[player.name];
    return Boolean(perms?.[type]);
}

// =======================================================================
// 🔒 BLOCK INTERACTION
// =======================================================================
world.beforeEvents.playerInteractWithBlock.subscribe(event => {
    const { player, block } = event;

    // ===============================
    // 1️⃣ Containers (require perms)
    // ===============================
    if (protectedContainers.includes(block.typeId)) {
        if (hasGeneralPermission(player) ||
            hasPlotPermission(player, "open") ||
            hasPlotPermission(player, "interact")) return;

        event.cancel = true;
        player.sendMessage("§cYou can't use this unless you're on a plot.");
        return;
    }

    // =========================================
    // 2️⃣ Manual door/trapdoor use is blocked
    // =========================================
    if (manualDoorBlocks.includes(block.typeId)) {
        if (!hasGeneralPermission(player) &&
            !hasPlotPermission(player, "open") &&
            !hasPlotPermission(player, "interact")) {

            // 🔒 BLOCK MANUAL CLICK
            event.cancel = true;
            player.sendMessage("§cYou can't manually open doors or trapdoors here.");
        }
    }

    // ⚠ Buttons, pressure plates, daylight sensors —
    // NOT in any list → not blocked → always work.
});

// =======================================================================
// 🔨 BLOCK PLACEMENT
// =======================================================================
world.beforeEvents.playerPlaceBlock.subscribe(event => {
    const { player, block } = event;

    if (isInRestrictedRegion(block) && !hasRegionBypass(player)) {
        event.cancel = true;
        player.sendMessage("§cYou can't place blocks in the protected spawn zone.");
        return;
    }

    if (hasGeneralPermission(player) || hasPlotPermission(player, "build")) return;

    event.cancel = true;
    player.sendMessage("§cYou can't place blocks unless you're on a plot.");
});

// =======================================================================
// ⛏ BLOCK BREAKING
// =======================================================================
world.beforeEvents.playerBreakBlock.subscribe(event => {
    const { player, block } = event;

    if (isInRestrictedRegion(block) && !hasRegionBypass(player)) {
        event.cancel = true;
        player.sendMessage("§cYou can't break blocks in the protected spawn zone.");
        return;
    }

    if (hasGeneralPermission(player) || hasPlotPermission(player, "break")) return;

    event.cancel = true;
    player.sendMessage("§cYou can't break blocks unless you're on a plot.");
});
