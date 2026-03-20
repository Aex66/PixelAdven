// ===============================================
// ✅ FULL MODERATION SYSTEM FOR BEDROCK SCRIPTING
// ===============================================

import { world, system, Player } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import Commands from "../../Papers/CommandPaper/CommandPaper";

// ===============================================
// ✅ CONFIG
// ===============================================
const PERSIST_KEY = "pokeworld:moderation:data";
const CHECK_INTERVAL = 20 * 20; // every ~20 seconds

const AFK_LOG_KEY = "pokeworld:anti_afk:log";

interface AFKLogEntry {
    id: string;
    name: string;
    fails: number;
    lastFail: number;
    reason: string;
    dimension: string;
}


const PERMS = {
    mute: ["Mod", "Staff", "Admin"],
    kick: ["Mod", "Staff", "Admin"],
    warn: ["Mod", "Staff", "Admin"],
    tempBan: ["Staff", "Admin"],
    permBan: ["Staff", "Admin"]
};

// Warning escalation
const WARNING_ESCALATION = [
    { count: 2, durationHours: 72 },   // 3 days
    { count: 4, durationHours: 168 },  // 7 days
    { count: 6, durationHours: -1 },   // permanent
];

// ===============================================
// ✅ DATA STRUCTURES
// ===============================================
interface ModerationEntry {
    id: string;
    name: string;
    type: "MUTE" | "TEMPBAN" | "PERMBAN";
    until: number | null;
    reason?: string;
    moderator?: string;
}

interface PlayerRecord {
    warns: number;
    punishments: ModerationEntry[];
}

interface ModerationStore {
    [id: string]: PlayerRecord;
}

// ===============================================
// ✅ LOAD / SAVE STORAGE
// ===============================================
function loadStore(): ModerationStore {
    const raw = world.getDynamicProperty(PERSIST_KEY) as string;
    if (!raw) return {};
    try { return JSON.parse(raw); } catch { return {}; }
}

function saveStore() {
    world.setDynamicProperty(PERSIST_KEY, JSON.stringify(store));
}

function loadAFKLogs(): Record<string, AFKLogEntry> {
    const raw = world.getDynamicProperty(AFK_LOG_KEY) as string;
    if (!raw) return {};
    try { return JSON.parse(raw); } catch { return {}; }
}

let store: ModerationStore = loadStore();

// ===============================================
// ✅ HELPERS
// ===============================================
function dim() {
    return world.getDimension("overworld");
}

async function run(cmd: string) {
    try { await dim().runCommand(cmd); }
    catch { console.warn(`Moderation CMD failed: ${cmd}`); }
}

function getID(p: Player) { return p.id; }

function ensureRecord(id: string): PlayerRecord {
    if (!store[id]) store[id] = { warns: 0, punishments: [] };
    return store[id];
}

function hasPerm(p: Player, tags: string[]) {
    return tags.some(t => p.hasTag(t));
}

// ===============================================
// ✅ APPLY PUNISHMENTS
// ===============================================
async function applyKick(target: Player, reason?: string) {
    await run(`kick "${target.name}" ${reason ? `"${reason}"` : ""}`);
}

async function applyMute(target: Player) {
    await run(`ability "${target.name}" mute true`);
}

async function removeMute(target: Player) {
    await run(`ability "${target.name}" mute false`);
}

async function applyBan(target: Player, entry: ModerationEntry) {
    await applyKick(target, entry.reason ?? "You are banned.");
}

// ===============================================
// ✅ AFK Logging
// ===============================================

async function openAFKLogMenu(mod: Player) {
    const log = loadAFKLogs();
    const entries = Object.values(log);

    if (entries.length === 0) {
        return mod.sendMessage("§aNo Anti-AFK failures logged.");
    }

    let body = "§cAnti-AFK Failures:\n";

    for (const e of entries
        .sort((a, b) => b.lastFail - a.lastFail)
        .slice(0, 15)
    ) {
        body += `\n§6${e.name}`;
        body += `\n§7Fails: §c${e.fails}`;
        body += `\n§7Reason: §f${e.reason}`;
        body += `\n§7Dim: §f${e.dimension}`;
        body += `\n§7When: §f${new Date(e.lastFail).toLocaleString()}`;
        body += `\n§8----------------------`;
    }

    const form = new ActionFormData()
        .title("📋 Anti-AFK Logs")
        .body(body)
        .button("Close");

    await form.show(mod);
}


// ===============================================
// ✅ CREATE PUNISHMENT ENTRY
// ===============================================
function addPunishment(
    player: Player,
    type: "MUTE" | "TEMPBAN" | "PERMBAN",
    hours: number | null,
    mod: Player,
    reason?: string
) {
    const id = getID(player);
    const rec = ensureRecord(id);

    const entry: ModerationEntry = {
        id,
        name: player.name,
        type,
        until: hours === null || hours < 0 ? null : Date.now() + hours * 3600000,
        moderator: mod.name,
        reason
    };

    rec.punishments.push(entry);
    saveStore();
    return entry;
}

// ===============================================
// ✅ WARNING SYSTEM
// ===============================================
async function addWarning(mod: Player, target: Player) {
    const id = getID(target);
    const rec = ensureRecord(id);

    rec.warns++;
    saveStore();

    mod.sendMessage(`§e[Warn] §f${target.name} now has §c${rec.warns} warnings.`);

    const escalation = WARNING_ESCALATION.find(w => w.count === rec.warns);
    if (!escalation) return;

    mod.sendMessage(`§c[Moderation] §f${target.name} reached §c${rec.warns} warnings.`);

    let entry: ModerationEntry;

    if (escalation.durationHours < 0) {
        entry = addPunishment(
            target, "PERMBAN", null, mod,
            `Auto permanent ban from ${rec.warns} warnings`
        );
        mod.sendMessage(`§4Auto Applied: Permanent Ban`);
    } else {
        entry = addPunishment(
            target, "TEMPBAN", escalation.durationHours, mod,
            `Auto ${escalation.durationHours}-hour ban from warnings`
        );
        mod.sendMessage(`§eAuto Applied: ${escalation.durationHours}-hour Ban`);
    }

    await applyBan(target, entry);
}

// ===============================================
// ✅ MUTE MENU
// ===============================================
async function muteMenu(mod: Player, target: Player) {
    const form = new ActionFormData()
        .title(`Mute: ${target.name}`)
        .body("Choose duration:")
        .button("1 Hour")
        .button("6 Hours")
        .button("12 Hours")
        .button("24 Hours")
        .button("48 Hours")
        .button("Custom Hours…")
        .button("Unmute")
        .button("Cancel");

    const res = await form.show(mod);
    if (!res || res.canceled) return;

    const opts = ["1", "6", "12", "24", "48", "custom", "unmute", "cancel"];
    const choice = opts[res.selection];

    if (choice === "cancel") return;

    // ✅ Unmute
    if (choice === "unmute") {
        await removeMute(target);
        const id = getID(target);
        const rec = ensureRecord(id);
        rec.punishments = rec.punishments.filter(p => p.type !== "MUTE");
        saveStore();
        mod.sendMessage(`§a${target.name} has been unmuted.`);
        return;
    }

    // ✅ Duration
    let hours = Number(choice);

    // ✅ Custom hours
    if (choice === "custom") {
        const modal = new ModalFormData()
            .title("Custom Mute Duration")
            .textField("Hours:", "e.g. 72");

        const r = await modal.show(mod);
        if (!r || r.canceled) return;

        hours = Number(r.formValues[0]);
        if (!Number.isFinite(hours)) return mod.sendMessage("§cInvalid hours.");
    }

    addPunishment(target, "MUTE", hours, mod, `Muted by ${mod.name}`);
    await applyMute(target);

    mod.sendMessage(`§b${target.name} muted for ${hours} hours.`);
    try { target.sendMessage(`§cYou have been muted for ${hours} hours.`); } catch { }
}

// ===============================================
// ✅ TEMP BAN MENU
// ===============================================
async function tempBanMenu(mod: Player, target: Player) {
    const form = new ActionFormData()
        .title(`Temp Ban: ${target.name}`)
        .body("Choose duration:")
        .button("1 Hour")
        .button("6 Hours")
        .button("12 Hours")
        .button("24 Hours")
        .button("48 Hours")
        .button("Custom Hours…")
        .button("Cancel");

    const res = await form.show(mod);
    if (!res || res.canceled) return;

    const opts = ["1", "6", "12", "24", "48", "custom", "cancel"];
    const choice = opts[res.selection];

    if (choice === "cancel") return;

    let hours = Number(choice);
    let reason = "";

    if (choice === "custom") {
        const modal = new ModalFormData()
            .title("Custom Temp Ban")
            .textField("Hours:", "e.g. 72")
            .textField("Reason (optional):", "");

        const r = await modal.show(mod);
        if (!r || r.canceled) return;

        hours = Number(r.formValues[0]);
        reason = String(r.formValues[1] ?? "");

        if (!Number.isFinite(hours)) return mod.sendMessage("§cInvalid hours.");
    } else {
        const modal = new ModalFormData()
            .title(`Temp Ban for ${hours} hours`)
            .textField("Reason (optional):", "");

        const r = await modal.show(mod);
        if (!r || r.canceled) return;

        reason = String(r.formValues[0] ?? "");
    }

    const entry = addPunishment(target, "TEMPBAN", hours, mod, reason);
    await applyBan(target, entry);

    mod.sendMessage(`§c${target.name} temp banned for ${hours} hours.`);
}

// ===============================================
// ✅ ACTION MENU
// ===============================================
async function actionMenu(mod: Player, target: Player) {
    const form = new ActionFormData()
        .title(`Moderate: ${target.name}`)
        .body("Choose an action:");

    if (hasPerm(mod, PERMS.warn)) form.button("⚠️ Warn");
    if (hasPerm(mod, PERMS.kick)) form.button("👢 Kick");
    if (hasPerm(mod, PERMS.mute)) form.button("🔇 Mute");
    if (hasPerm(mod, PERMS.tempBan)) form.button("⏳ Temp Ban");
    if (hasPerm(mod, PERMS.permBan)) form.button("⛔ Permanent Ban");
    form.button("Cancel");

    const res = await form.show(mod);
    if (!res || res.canceled) return;

    const options: string[] = [];
    if (hasPerm(mod, PERMS.warn)) options.push("warn");
    if (hasPerm(mod, PERMS.kick)) options.push("kick");
    if (hasPerm(mod, PERMS.mute)) options.push("mute");
    if (hasPerm(mod, PERMS.tempBan)) options.push("tempban");
    if (hasPerm(mod, PERMS.permBan)) options.push("permban");
    options.push("cancel");

    const choice = options[res.selection];

    switch (choice) {
        case "warn": return await addWarning(mod, target);
        case "kick": return await applyKick(target, `Kicked by ${mod.name}`);
        case "mute": return await muteMenu(mod, target);
        case "tempban": return await tempBanMenu(mod, target);
        case "permban": {
            const entry = addPunishment(target, "PERMBAN", null, mod, `Perm ban by ${mod.name}`);
            await applyBan(target, entry);
            mod.sendMessage(`§4${target.name} permanently banned.`);
        }
    }
}

// ===============================================
// ✅ /moderate COMMAND
// ===============================================
const cmd = Commands.create({
    name: "moderate",
    description: "Moderation menu",
    admin: true,
    category: "Moderation",
});

cmd.callback(async (player: Player) => {
    if (!hasPerm(player, ["Mod", "Staff", "Admin"])) {
        return player.sendMessage("§cYou do not have permission.");
    }

    // ✅ Tell the moderator to close chat
    player.sendMessage("§eClose chat — moderation menu opens in §63 seconds§e...");

    // ✅ Wait 3 seconds so the chat can close
    system.runTimeout(async () => {

        const players = world.getPlayers().filter(p => p.name !== player.name);

        if (players.length === 0) {
            return player.sendMessage("§eNo other players online.");
        }

        const form = new ActionFormData()
            .title("Moderation")
            .body("Select a player:");

        for (const p of players)
            form.button(`${p.name}`);

        form.button("📋 Anti-AFK Logs");
        form.button("Cancel");

        const res = await form.show(player);
        if (!res || res.canceled) return;

        if (res.selection === players.length) {
            return await openAFKLogMenu(player);
        }

        if (res.selection > players.length) return;

        const target = players[res.selection];
        await actionMenu(player, target);

    }, 60); // ✅ 3 second delay
});

// ===============================================
// ✅ AUTO-ENFORCEMENT TICK
// ===============================================
system.runInterval(async () => {
    let changed = false;

    for (const p of world.getPlayers()) {
        const id = getID(p);
        const rec = store[id];
        if (!rec) continue;

        for (const pun of [...rec.punishments]) {

            // ✅ TEMP MUTE EXPIRED
            if (pun.type === "MUTE") {
                if (pun.until !== null && Date.now() >= pun.until) {
                    await removeMute(p);
                    rec.punishments = rec.punishments.filter(x => x !== pun);
                    changed = true;
                } else {
                    await applyMute(p);
                }
            }

            // ✅ TEMP BAN EXPIRED
            if (pun.type === "TEMPBAN") {
                if (pun.until !== null && Date.now() >= pun.until) {
                    rec.punishments = rec.punishments.filter(x => x !== pun);
                    changed = true;
                } else {
                    await applyBan(p, pun);
                }
            }

            // ✅ PERMANENT BAN ALWAYS ENFORCED
            if (pun.type === "PERMBAN") {
                await applyBan(p, pun);
            }
        }
    }

    if (changed) saveStore();
}, CHECK_INTERVAL);
