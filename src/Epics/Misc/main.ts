
import "./biomeCommand";
import "./viewTeamCommand";
import "./backbag"; // it wasnt imported :sob:
import "./healCommand";
import "./giftSystem";
import "./Trivia";
import './scriptevents'
import './weights'
import './menu'
import './Warps'
import './pokestop'
import './despawn'
import './Special'
import './incubator'
import './fossil_machine'
import './fishing'
import './sidebarDisable'
import './grand_underground'
import './trainerTagTransfer'
import './cleanup'
import './elevator'
import './Moderation'
import './broadcast'
import './AdminTeamModifier'
import './leaderboard'
import './playerRank'
import './pokeballEvent'

import { world, Player, system } from "@minecraft/server";

const DP_KEY = "rot:trainer_ids"; // dynamic property storing all used string IDs

// --------------------------------------------------------
// 🔹 Load saved Trainer IDs (returns a Set<string>)
// --------------------------------------------------------
function loadUsedIDs(): Set<string> {
    let raw = world.getDynamicProperty(DP_KEY);
    if (!raw || typeof raw !== "string") return new Set();
    try {
        return new Set(JSON.parse(raw));
    } catch {
        return new Set();
    }
}

// --------------------------------------------------------
// 🔹 Save Trainer IDs to dynamic property
// --------------------------------------------------------
function saveUsedIDs(set: Set<string>) {
    world.setDynamicProperty(DP_KEY, JSON.stringify([...set]));
}

// --------------------------------------------------------
// 🔹 Generate a unique 6-digit string ID (e.g. "032551")
// --------------------------------------------------------
function generateUniqueID(used: Set<string>): string {
    let id: string;

    do {
        const num = Math.floor(Math.random() * 1_000_000); // 0–999999
        id = num.toString().padStart(6, "0"); // ALWAYS 6 digits
    } while (used.has(id));

    return id;
}

// --------------------------------------------------------
// 🔹 Safe scoreboard get
// --------------------------------------------------------
function getScore(player: Player, objective: string): number | null {
    try {
        const obj = world.scoreboard.getObjective(objective);
        return obj.getScore(player);
    } catch {
        return null;
    }
}

// --------------------------------------------------------
// 🔹 Safe scoreboard set
// --------------------------------------------------------
function setScore(player: Player, objective: string, value: number) {
    try {
        let obj = world.scoreboard.getObjective(objective);
        if (!obj) obj = world.scoreboard.addObjective(objective, objective);
        obj.setScore(player, value);
    } catch (err) {
        console.warn("Scoreboard error:", err);
    }
}

// --------------------------------------------------------
// 🔹 Assign TrainerID if missing
// --------------------------------------------------------
function assignTrainerID(player: Player) {
    let current = getScore(player, "TrainerId");

    // Convert existing scoreboard value → 6-digit string if valid
    if (current !== null && current >= 0) {
        const existingID = current.toString().padStart(6, "0");

        // Make sure dynamic property remembers it
        const used = loadUsedIDs();
        if (!used.has(existingID)) {
            used.add(existingID);
            saveUsedIDs(used);
        }

        return; // they already have an ID
    }

    // Generate new ID
    const used = loadUsedIDs();
    const newID = generateUniqueID(used);
    used.add(newID);
    saveUsedIDs(used);

    // Set scoreboard (numeric), pad later when displayed
    setScore(player, "TrainerId", Number(newID));

    player.sendMessage(`§aYour Trainer ID has been assigned: §b${newID}`);
}

// --------------------------------------------------------
// 🔹 Run on player join
// --------------------------------------------------------
world.afterEvents.playerSpawn.subscribe(ev => {
    if (!ev.initialSpawn) return;
    assignTrainerID(ev.player);
});

// --------------------------------------------------------
// 🔹 Periodic safety check (every 10 seconds)
// --------------------------------------------------------
system.runInterval(() => {
    for (const player of world.getPlayers()) {
        assignTrainerID(player);
    }
}, 200);

//const list = world.scoreboard.getObjectives().map(o => o.id).filter(o => !o.startsWith('STR:'))
//console.warn(JSON.stringify(list, null, 2))