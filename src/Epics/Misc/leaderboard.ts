import { world, system, Entity, Player } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { addListener } from "../../Tales/main";

/* ========================================================
   Persistent Offline Leaderboard Storage
======================================================== */

const lastScores = new Map<string, number>();

function loadLBStore(objective: string): Record<string, number> {
    const raw = world.getDynamicProperty(`rot:lb_${objective}`);
    if (!raw) return {};

    try {
        return JSON.parse(raw as string);
    } catch {
        return {};
    }
}

function saveLBStore(objective: string, store: Record<string, number>) {

    let json = JSON.stringify(store);

    if (json.length > 32000) {

        const trimmed = Object.entries(store)
            .map(([name, score]) => ({ name, score }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 100);

        const newStore: Record<string, number> = {};

        for (const e of trimmed) {
            newStore[e.name] = e.score;
        }

        json = JSON.stringify(newStore);
    }

    world.setDynamicProperty(`rot:lb_${objective}`, json);
}

function updateStoredScore(player: Player, objective: string) {

    const obj = world.scoreboard.getObjective(objective);
    if (!obj) return;

    const score = obj.getScore(player.scoreboardIdentity) ?? 0;

    const cacheKey = `${objective}:${player.name}`;
    const last = lastScores.get(cacheKey);

    // 🚀 Only update if score changed
    if (last === score) return;

    lastScores.set(cacheKey, score);

    const store = loadLBStore(objective);

    store[player.name] = score;

    saveLBStore(objective, store);
}

/* ========================================================
   Helpers
======================================================== */

function hasPerm(player: Player): boolean {
    return player.hasTag("Admin") || player.hasTag("Staff");
}

function getScoreSafe(objName: string, player: Entity): number {
    try {
        return world.scoreboard.getObjective(objName)?.getScore(player) ?? 0;
    } catch {
        return 0;
    }
}

/* ========================================================
   Update stored scores on player join
======================================================== */

addListener("playerConnect", (player: Player) => {

    const overworld = world.getDimension("minecraft:overworld");

    for (const ent of overworld.getEntities({ type: "rot:hologram" })) {

        const obj = ent.getDynamicProperty("leaderboardObjective") as string;

        if (obj && obj.length > 0) {
            updateStoredScore(player, obj);
        }
    }

});

/* ========================================================
   Periodic Score Check (lightweight)
======================================================== */

system.runInterval(() => {

    const overworld = world.getDimension("minecraft:overworld");

    for (const ent of overworld.getEntities({ type: "rot:hologram" })) {

        const objective = ent.getDynamicProperty("leaderboardObjective") as string;

        if (!objective) continue;

        for (const p of world.getPlayers()) {
            updateStoredScore(p, objective);
        }
    }

}, 100);

/* ========================================================
   ADMIN / STAFF INTERACTION TO CONFIGURE THE ENTITY
======================================================== */

world.afterEvents.entityHitEntity.subscribe(ev => {

    const player = ev.damagingEntity;
    const entity = ev.hitEntity;

    if (!(player instanceof Player)) return;
    if (!entity || entity.typeId !== "rot:hologram") return;

    if (!hasPerm(player)) {
        player.sendMessage("§cYou do not have permission to manage this leaderboard.");
        return;
    }

    openLeaderboardConfig(player, entity);

});

/* ========================================================
   CONFIG MENU
======================================================== */

function openLeaderboardConfig(player: Player, entity: Entity) {

    const lbName = (entity.getDynamicProperty("leaderboardName") as string) ?? "Unnamed Leaderboard";
    const objective = (entity.getDynamicProperty("leaderboardObjective") as string) ?? "none";

    const form = new ActionFormData()
        .title("Leaderboard Settings")
        .body(`§fName: §e${lbName}\n§fScoreboard: §e${objective}`)
        .button("Set Leaderboard Name")
        .button("Set Scoreboard Objective")
        .button("Reset Leaderboard Display")
        .button("Reset Entity Settings")
        .button("§cClose");

    form.show(player).then(res => {

        if (res.canceled) return;

        switch (res.selection) {
            case 0: setLBName(player, entity); break;
            case 1: setLBObjective(player, entity); break;
            case 2: resetLeaderboardCache(player, entity); break;
            case 3: resetEntitySettings(player, entity); break;
        }

    });

}

/* ========================================================
   Set Leaderboard Name
======================================================== */

function setLBName(player: Player, entity: Entity) {

    const form = new ModalFormData()
        .title("Set Leaderboard Name")
        .textField("Leaderboard Name:", "Top Players");

    form.show(player).then(res => {

        if (res.canceled) return;

        const name = (res.formValues![0] as string)?.trim();

        if (!name) {
            player.sendMessage("§cInvalid name.");
            return;
        }

        entity.setDynamicProperty("leaderboardName", name);

        player.sendMessage(`§aLeaderboard name set to §e${name}`);

    });

}

/* ========================================================
   Set Scoreboard Objective
======================================================== */

function setLBObjective(player: Player, entity: Entity) {

    const form = new ModalFormData()
        .title("Set Scoreboard Objective")
        .textField("Objective:", "money");

    form.show(player).then(res => {

        if (res.canceled) return;

        const obj = (res.formValues![0] as string)?.trim();

        if (!obj) {
            player.sendMessage("§cInvalid scoreboard name.");
            return;
        }

        entity.setDynamicProperty("leaderboardObjective", obj);

        player.sendMessage(`§aLeaderboard objective set to §e${obj}`);

    });

}

/* ========================================================
   Soft Reset Leaderboard (Cache Only)
======================================================== */

function resetLeaderboardCache(player: Player, entity: Entity) {

    const objective = entity.getDynamicProperty("leaderboardObjective") as string;

    if (!objective) {
        player.sendMessage("§cNo objective set for this leaderboard.");
        return;
    }

    world.setDynamicProperty(`rot:lb_${objective}`, "{}");

    player.sendMessage("§eLeaderboard cache reset. It will repopulate as players log in.");

}

/* ========================================================
   Reset Entity
======================================================== */

function resetEntitySettings(player: Player, entity: Entity) {

    entity.setDynamicProperty("leaderboardName", "");
    entity.setDynamicProperty("leaderboardObjective", "");

    player.sendMessage("§cLeaderboard entity reset.");

}

/* ========================================================
   NAME TAG RENDER LOOP
======================================================== */

system.runInterval(() => {

    const overworld = world.getDimension("minecraft:overworld");

    for (const ent of overworld.getEntities({ type: "rot:hologram" })) {

        const lbName = (ent.getDynamicProperty("leaderboardName") as string) ?? "Leaderboard";
        const objName = (ent.getDynamicProperty("leaderboardObjective") as string) ?? "";

        if (!objName || objName.length < 1) {

            ent.nameTag = `§cNo Objective Set`;
            continue;

        }

        const obj = world.scoreboard.getObjective(objName);

        if (!obj) {

            ent.nameTag = `§cInvalid Objective`;
            continue;

        }

        const objStore = loadLBStore(objName);

        const sorted = Object.keys(objStore)
            .map(name => ({ name, score: objStore[name] }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

        let tag = `§l§e${lbName}\n§r`;

        if (sorted.length === 0) {

            tag += "§7No data";

        } else {

            sorted.forEach((entry, idx) => {

                tag += `§f${idx + 1}. §b${entry.name} §7- §a${entry.score}\n`;

            });

        }

        ent.nameTag = tag.trim();

    }

}, 100);

/* ========================================================
   DEBUG TRIGGER
======================================================== */

system.afterEvents.scriptEventReceive.subscribe(
    ({ id, sourceType, sourceEntity }) => {

        if (sourceType !== "Entity" || !(sourceEntity instanceof Player)) return;

        if (id === "leaderboard:debug") {

            sourceEntity.sendMessage("§a[DEBUG] Running leaderboard debug…");

            for (const ent of world.getDimension("minecraft:overworld").getEntities({ type: "rot:hologram" })) {

                ent.nameTag = "§eDEBUG NAME TAG";

            }

        }

    },
    { namespaces: ["leaderboard"] }
);