// =========================================================
// ANTI-AFK SYSTEM — FULLY UPDATED FOR LATEST BEDROCK API
// No deprecated events, no errors, movement polling included
// =========================================================

import { world, Player, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";


const AFK_LOG_KEY = "pokeworld:anti_afk:log";

interface AFKLogEntry {
    id: string;
    name: string;
    fails: number;
    lastFail: number;
    reason: string;
    dimension: string;
}

function loadAFKLog(): Record<string, AFKLogEntry> {
    try {
        return JSON.parse(world.getDynamicProperty(AFK_LOG_KEY) as string ?? "{}");
    } catch {
        return {};
    }
}

function saveAFKLog(log: Record<string, AFKLogEntry>) {
    world.setDynamicProperty(AFK_LOG_KEY, JSON.stringify(log));
}

// ----------------------------------------
// CONFIG
// ----------------------------------------
const CHECK_INTERVAL_MIN = 180; // 3 min
const CHECK_INTERVAL_MAX = 420; // 7 min

const ACTIVITY_DECAY = 1;
const ACTIVITY_MAX = 250;
const ACTIVITY_THRESHOLD = 0;

const STAFF_TAGS = ["Owner", "Admin", "Staff", "Moderator"];

// ----------------------------------------
// STAFF CHECK
// ----------------------------------------
function isStaff(player: Player): boolean {
    return STAFF_TAGS.some(tag => player.hasTag(tag));
}

// ----------------------------------------
// ACTIVITY SYSTEM
// ----------------------------------------
function bump(player: Player, amount = 30) {
    if (!(player instanceof Player)) return;
    if (isStaff(player)) return;

    let a = Number(player.getDynamicProperty("anti_afk") ?? ACTIVITY_MAX);
    a = Math.min(ACTIVITY_MAX, a + amount);
    player.setDynamicProperty("anti_afk", a);
}

// ----------------------------------------
// MANUAL MOVEMENT TRACKING (REPLACEMENT)
// ----------------------------------------
const lastPositions = new Map<string, { x: number; y: number; z: number }>();

system.runInterval(() => {
    for (const player of world.getPlayers()) {
        const prev = lastPositions.get(player.name);
        const cur = player.location;

        if (prev) {
            const dx = prev.x - cur.x;
            const dy = prev.y - cur.y;
            const dz = prev.z - cur.z;

            const distSq = dx * dx + dy * dy + dz * dz;

            // Movement threshold (tiny movements ignored)
            if (distSq > 0.01) bump(player, 4);
        }

        lastPositions.set(player.name, { x: cur.x, y: cur.y, z: cur.z });
    }
}, 5); // every 0.25 seconds

// ----------------------------------------
// Events that DO still exist
// ----------------------------------------

// Right-click, items, interactions
world.beforeEvents.itemUse.subscribe(ev => {
    if (ev.source instanceof Player) bump(ev.source, 40);
});

// Combat
world.afterEvents.entityHitEntity.subscribe(ev => {
    const p = ev.damagingEntity;
    if (p instanceof Player) bump(p, 30);
});

// Chat is activity
world.afterEvents.chatSend.subscribe(ev => bump(ev.sender, 20));

// Player spawn counts as activity
world.afterEvents.playerSpawn.subscribe(ev => {
    if (ev.player instanceof Player) bump(ev.player, 100);
});

// ----------------------------------------
// MAIN DECAY LOOP
// ----------------------------------------
system.runInterval(() => {
    for (const player of world.getPlayers()) {

        if (isStaff(player)) {
            player.setDynamicProperty("anti_afk", ACTIVITY_MAX);
            continue;
        }

        let a = Number(player.getDynamicProperty("anti_afk") ?? ACTIVITY_MAX);
        a -= ACTIVITY_DECAY;
        player.setDynamicProperty("anti_afk", a);

        if (a <= ACTIVITY_THRESHOLD) {
            startHumanCheck(player);
            player.setDynamicProperty("anti_afk", ACTIVITY_MAX);
        }
    }
}, 20);

// ----------------------------------------
// RANDOM HUMAN CHECK
// ----------------------------------------
function startHumanCheck(player: Player) {
    if (isStaff(player)) return;

    const delay = randomRange(CHECK_INTERVAL_MIN, CHECK_INTERVAL_MAX);

    system.runTimeout(() => showHumanCheck(player), delay * 20);
}

// ----------------------------------------
// CAPTCHA
// ----------------------------------------
function showHumanCheck(player: Player) {
    if (!player.isValid) return;
    if (isStaff(player)) return;

    const colors = ["RED", "BLUE", "GREEN", "YELLOW"];
    const correct = colors[Math.floor(Math.random() * colors.length)];
    const shuffled = [...colors].sort(() => Math.random() - 0.5);

    const form = new ActionFormData()
        .title("§cAnti-AFK Check")
        .body(`§eConfirm you're active.\n\n§fClick the color: §6${correct}`);

    shuffled.forEach(c => form.button(c));

    form.show(player).then(res => {
        // ❌ Closed UI / timed out / no response
        if (!res || res.selection === undefined) {
            return kickAFK(player, "No Response to CAPTCHA");
        }

        const choice = shuffled[res.selection];

        // ❌ Wrong answer
        if (choice !== correct) {
            return kickAFK(player, "Failed CAPTCHA");
        }

        // ✅ Passed
        player.sendMessage("§a✔ You passed the Anti-AFK check!");
    });
}

// ----------------------------------------
// KICK
// ----------------------------------------
function kickAFK(player: Player, reason = "Failed Anti-AFK Check") {
    if (isStaff(player)) return;

    const log = loadAFKLog();
    const id = player.id;

    if (!log[id]) {
        log[id] = {
            id,
            name: player.name,
            fails: 0,
            lastFail: 0,
            reason,
            dimension: player.dimension.id
        };
    }

    log[id].fails++;
    log[id].lastFail = Date.now();
    log[id].reason = reason;
    log[id].dimension = player.dimension.id;

    saveAFKLog(log);

    try {
        player.runCommand(`kick @s §cKicked for being AFK`);
    } catch {
        player.teleport({ x: 0, y: -60, z: 0 });
    }
}

// ----------------------------------------
function randomRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// ----------------------------------------
