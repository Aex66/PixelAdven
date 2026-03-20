import { world, system, Player, ItemStack, EntityInventoryComponent, EquipmentSlot } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { openFlyMenu } from "./Warps";

const PLOT_DATA_KEY = "plot_data";

export function loadPlotData(player: Player): any {
    try {
        return JSON.parse(player.getDynamicProperty(PLOT_DATA_KEY) as string ?? "{}");
    } catch {
        return {};
    }
}

function savePlotData(player: Player, data: any) {
    player.setDynamicProperty(PLOT_DATA_KEY, JSON.stringify(data));
}

function getPlotOwnerKey(player: Player): string {
    return player.name;
}

export function isWithinPlotBounds(visitor: Player, owner: Player): boolean {
    const x = getScore(owner, "plot_x");
    const y = getScore(owner, "plot_y");
    const z = getScore(owner, "plot_z");

    const minX = x;
    const maxX = x + 59;
    const minY = y - 32;
    const maxY = y + 32;
    const minZ = z;
    const maxZ = z + 59;

    const loc = visitor.location;
    return loc.x >= minX && loc.x <= maxX && loc.y >= minY && loc.y <= maxY && loc.z >= minZ && loc.z <= maxZ;
}

function getScore(player: Player, objective: string): number {
    return world.scoreboard.getObjective(objective)?.getScore(player) ?? 0;
}

function openPlotMenu(player: Player) {
    if (!player.hasTag("on_plot") || player.hasTag("visitor")) return;

    const form = new ActionFormData()
        .title("Plot Manager")
        .button("Add Member")
        .button("Invite Member")
        .button("Edit Permissions")
        .button("Remove Member")
        .button("§cClear All Plot Members")
        .button("§6Kick All Visitors")
        .button("§6Leave Plot");

    form.show(player).then(res => {
        if (res.canceled) return;

        switch (res.selection) {
            case 0:
                showAddMemberMenu(player);
                break;
            case 1:
                showInviteMemberMenu(player);
                break;
            case 2:
                showEditPermissionsMenu(player);
                break;
            case 3:
                showRemoveMemberMenu(player);
                break;
            case 4:
                clearAllPlotMembers(player);
                break;
            case 5:
                kickAllVisitors(player);
                break;
            case 6:
                openFlyMenu(player);
                break;
        }
    });
}

function showAddMemberMenu(owner: Player) {
    const players = world.getPlayers().filter(p => p.name !== owner.name);
    if (players.length === 0) {
        owner.sendMessage("§cThere are no other online players to add.");
        return;
    }
    const form = new ModalFormData().title("Add Member");
    players.forEach(p => form.dropdown("Select player to add", players.map(p => p.name)));
    form.show(owner).then(res => {
        if (res.canceled) return;
        const selectedIndex = Number(res.formValues[0]);
        const selected = players[selectedIndex];

        const data = loadPlotData(owner);
        if (!data.members) data.members = {};
        if (!data.permissions) data.permissions = {};

        data.members[selected.name] = true;
        savePlotData(owner, data);

        owner.sendMessage(`§aAdded ${selected.name} to approved list.`);
    });

}

function showInviteMemberMenu(owner: Player) {
    const ownerKey = getPlotOwnerKey(owner);
    const dataRaw = owner.getDynamicProperty("plot_data") as string ?? "{}";
    const data = JSON.parse(dataRaw);
    const approved = Object.keys(data.members || {});
    if (approved.length === 0) {
        owner.sendMessage("§cYou have no approved members to invite.");
        return;
    }

    const form = new ModalFormData().title("Invite Player").dropdown("Choose who to invite", approved);
    form.show(owner).then(res => {
        if (res.canceled) return;

        const invitedIndex = Number(res.formValues[0]);
        const invited = approved[invitedIndex];
        const target = world.getPlayers().find(p => p.name === invited);

        if (!target) {
            owner.sendMessage("§cThat player is no longer online.");
            return;
        }

        const confirm = new ActionFormData()
            .title("Plot Invite")
            .body(`${owner.name} has invited you to their plot. Accept?`)
            .button("§aAccept")
            .button("§cDecline");

        confirm.show(target).then(confirmRes => {
            if (confirmRes.canceled || confirmRes.selection === 1) {
                owner.sendMessage(`§e${target.name} declined your plot invite.`);
                return;
            }

            const x = getScore(owner, "plot_x");
            const y = getScore(owner, "plot_y");
            const z = getScore(owner, "plot_z");
            target.teleport({ x, y, z });
            target.addTag("visitor");
            owner.sendMessage(`§a${target.name} has joined your plot.`);
            target.sendMessage("§aYou have entered the plot.");
        });
    });
}

function showEditPermissionsMenu(owner: Player) {
    const data = loadPlotData(owner);
    const approved = Object.keys(data.members || {});
    if (approved.length === 0) {
        owner.sendMessage("§cYou have no approved members to edit.");
        return;
    }

    const form = new ModalFormData().title("Edit Permissions").dropdown("Select player", approved);
    form.show(owner).then(res => {
        if (res.canceled) return;

        const index = Number(res.formValues[0]);
        const targetName = approved[index];

        // Fetch the updated data again for accuracy
        const updatedData = loadPlotData(owner);
        const perms = updatedData.permissions?.[targetName] ?? {
            build: false,
            break: false,
            open: false,
            interact: false,
            lava: false,
            water: false,
            tnt: false
        };

        const editForm = new ModalFormData().title("Edit Permissions")
            .dropdown("Select player", approved)
            .toggle("Build", perms.build)
            .toggle("Break Blocks", perms.break)
            .toggle("Open Chests", perms.open)
            .toggle("Use Interactables (Doors/Buttons)", perms.interact)
            .toggle("Place Lava", perms.lava)
            .toggle("Place Water", perms.water)
            .toggle("Place TNT", perms.tnt);

        editForm.show(owner).then(permRes => {
            if (permRes.canceled) return;

            const build = Boolean(permRes.formValues[1]);
            const breakBlocks = Boolean(permRes.formValues[2]);
            const open = Boolean(permRes.formValues[3]);
            const interact = Boolean(permRes.formValues[4]);
            const lava = Boolean(permRes.formValues[5]);
            const water = Boolean(permRes.formValues[6]);
            const tnt = Boolean(permRes.formValues[7]);

            if (!updatedData.permissions) updatedData.permissions = {};
            updatedData.permissions[targetName] = { build, break: breakBlocks, open, interact, lava, water, tnt };
            savePlotData(owner, updatedData);

            owner.sendMessage(`§ePermissions updated for ${targetName}.`);
        });
    });
}


function showRemoveMemberMenu(owner: Player) {
    const data = loadPlotData(owner);
    const approved = Object.keys(data.members || {});
    if (approved.length === 0) {
        owner.sendMessage("§cYou have no members to remove.");
        return;
    }
    const form = new ModalFormData().title("Remove Player").dropdown("Select player", approved);
    form.show(owner).then(res => {
        if (res.canceled) return;
        const removeIndex = Number(res.formValues[0]);
        const toRemove = approved[removeIndex];
        delete data.members[toRemove];
        delete data.permissions?.[toRemove];
        savePlotData(owner, data);

        const target = world.getPlayers().find(p => p.name === toRemove);
        if (target && isWithinPlotBounds(target, owner)) {
            target.removeTag("visitor");
            const x = getScore(target, "plot_x");
            const y = getScore(target, "plot_y");
            const z = getScore(target, "plot_z");
            if (x && y && z) {
                target.teleport({ x, y, z });
                target.sendMessage("§eYou have been removed from this plot and sent home.");
            } else {
                target.teleport({ x: -416, y: 8, z: -273 });
                target.sendMessage("§eYou have been removed from this plot.");
            }
        }
        owner.sendMessage(`§cRemoved ${toRemove} from your plot.`);
    });

}

function kickAllVisitors(owner: Player) {
    for (const player of world.getPlayers()) {
        if (!player.hasTag("visitor")) continue;
        if (!isWithinPlotBounds(player, owner)) continue;

        player.removeTag("visitor");
        const x = getScore(player, "plot_x");
        const y = getScore(player, "plot_y");
        const z = getScore(player, "plot_z");

        if (x && y && z) {
            player.teleport({ x, y, z });
            player.sendMessage("§eYou have been kicked from the plot and returned to your own.");
        } else {
            player.teleport({ x: -416, y: 8, z: -273 });
            player.sendMessage("§eYou have been kicked from the plot.");
        }
    }
    owner.sendMessage("§6All visitors have been kicked from your plot.");
}

function clearAllPlotMembers(owner: Player) {
    const data = loadPlotData(owner);
    data.members = {};
    data.permissions = {};
    savePlotData(owner, data);
    owner.sendMessage("§cAll plot members and permissions have been cleared.");
}

// === Auto remove visitors if owner leaves plot
system.runInterval(() => {
    for (const player of world.getPlayers()) {
        if (!player.hasTag("visitor")) continue;

        const owner = world.getPlayers().find(p => p !== player && isWithinPlotBounds(player, p));

        if (!owner || !owner.hasTag("on_plot")) {
            player.removeTag("visitor");
            const x = getScore(player, "plot_x");
            const y = getScore(player, "plot_y");
            const z = getScore(player, "plot_z");
            if (x && y && z) {
                player.teleport({ x, y, z });
                player.sendMessage("§eYou have returned to your own plot.");
            } else {
                player.teleport({ x: -416, y: 8, z: -273 });
                player.sendMessage("§eYou have been returned to the default location.");
            }
        }
    }
}, 40);

// === Trigger menu on book use
world.afterEvents.itemUse.subscribe(event => {
    const player = event.source;
    if (!(player instanceof Player)) return;

    const equipment = player.getComponent("equippable");

    const handItem = equipment?.getEquipment(EquipmentSlot.Mainhand);

    if (handItem?.typeId === "pokeworld:pokedex" && player.hasTag("on_plot") && !player.hasTag("visitor")) {
        openPlotMenu(player);
    }
});

// === Interaction Enforcement (including container protection)
const containerBlocks = [
    "minecraft:chest", "minecraft:trapped_chest", "minecraft:barrel"
];

const interactableBlocks = [
    "minecraft:oak_door", "minecraft:birch_door", "minecraft:spruce_door",
    "minecraft:jungle_door", "minecraft:acacia_door", "minecraft:dark_oak_door",
    "minecraft:crimson_door", "minecraft:warped_door", "minecraft:iron_door",
    "minecraft:lever", "minecraft:stone_button", "minecraft:oak_button",
    "minecraft:oak_trapdoor", "minecraft:spruce_trapdoor", "minecraft:birch_trapdoor",
    "minecraft:jungle_trapdoor", "minecraft:acacia_trapdoor", "minecraft:dark_oak_trapdoor",
    "minecraft:crimson_trapdoor", "minecraft:warped_trapdoor", "minecraft:iron_trapdoor",
    "minecraft:stone_pressure_plate", "minecraft:light_weighted_pressure_plate",
    "minecraft:heavy_weighted_pressure_plate", "minecraft:oak_pressure_plate",
    "minecraft:spruce_pressure_plate", "minecraft:birch_pressure_plate",
    "minecraft:jungle_pressure_plate", "minecraft:acacia_pressure_plate",
    "minecraft:dark_oak_pressure_plate", "minecraft:crimson_pressure_plate",
    "minecraft:warped_pressure_plate"
];

world.beforeEvents.playerInteractWithBlock.subscribe(event => {
    const { player, block } = event;
    const owner = world.getPlayers().find(p => p !== player && isWithinPlotBounds(player, p));
    if (!owner || player.name === owner.name || player.hasTag("Owner") || player.hasTag("Staff") || player.hasTag("Admin")) return;

    const data = loadPlotData(owner);
    const perms = data?.permissions?.[player.name];

    if (containerBlocks.includes(block.typeId) && !perms?.open) {
        event.cancel = true;
        player.sendMessage("§cYou can't open containers here.");
    }

    if (interactableBlocks.includes(block.typeId) && !perms?.interact) {
        event.cancel = true;
        player.sendMessage("§cYou can't use that here.");
    }
});

// Interaction Enforcement
world.beforeEvents.itemUse.subscribe(({ source: player }) => {
    if (!(player instanceof Player)) return;

    const inventory = player.getComponent("inventory") as EntityInventoryComponent;
    const selectedSlot = (player as any).selectedSlot ?? 0;
    const item = inventory.container?.getItem(selectedSlot);
    const type = item?.typeId ?? "";

    const owner = world.getPlayers().find(p => p !== player && isWithinPlotBounds(player, p));
    if (!owner || player.name === owner.name) return;

    const ownerData = loadPlotData(owner);
    const perms = ownerData.permissions?.[player.name];

    if (type.includes("lava") && !perms?.lava) {
        player.sendMessage("§cYou are not allowed to place lava here.");
    } else if (type.includes("water") && !perms?.water) {
        player.sendMessage("§cYou are not allowed to place water here.");
    } else if (type.includes("tnt") && !perms?.tnt) {
        player.sendMessage("§cYou are not allowed to place TNT here.");
    }
});

world.beforeEvents.playerPlaceBlock.subscribe((event) => {
    const { player, block } = event;
    const owner = world.getPlayers().find(p => p !== player && isWithinPlotBounds(player, p));
    if (!owner || player.name === owner.name || player.hasTag("Owner") || player.hasTag("Staff") || player.hasTag("Admin")) return;

    const ownerData = loadPlotData(owner);
    const perms = ownerData?.permissions?.[player.name] ?? {};

    if (!perms.build) {

        player.sendMessage("§cYou can't place blocks here.");
               event.cancel = true;

    }
});

world.beforeEvents.playerBreakBlock.subscribe((event) => {
    const { player, block } = event;
    const owner = world.getPlayers().find(p => p !== player && isWithinPlotBounds(player, p));
    if (!owner || player.name === owner.name || player.hasTag("Owner") || player.hasTag("Staff") || player.hasTag("Admin")) return;

    const ownerData = loadPlotData(owner);
    const perms = ownerData?.permissions?.[player.name] ?? {};
if (!perms.break) {
        player.sendMessage("§cYou can't break blocks here.");
        event.cancel = true;
    }
});

