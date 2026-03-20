import { world, system, Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

/* =========================
   CONFIG
========================= */

const XP_PER_CATCH = 25;
const XP_PER_TRAINER_WIN = 100;

/* =========================
   SCOREBOARD SETUP
========================= */

const REQUIRED_OBJECTIVES = [
    "pw_level",
    "pw_xp",
    "pw_pcatch_last",
    "pw_victories_last",
    "pw_xp_claimed"
];

function ensureScoreboards() {
    for (const name of REQUIRED_OBJECTIVES) {
        if (!world.scoreboard.getObjective(name)) {
            world.scoreboard.addObjective(name, name);
        }
    }
}

// Ensure scoreboards once world is ready
system.runTimeout(ensureScoreboards, 1);

/* =========================
   HELPERS
========================= */

function getScore(player: Player, objective: string): number | null {
    const obj = world.scoreboard.getObjective(objective);
    if (!obj || !player.scoreboardIdentity) return null;
    return obj.getScore(player.scoreboardIdentity);
}

function setScore(player: Player, objective: string, value: number) {
    player.runCommand(`scoreboard players set @s ${objective} ${value}`);
}

/* =========================
   LEVEL CURVE
========================= */

function xpForNextLevel(level: number): number {
    return 100 + (level * 50);
}

/* =========================
   XP + LEVEL LOGIC
========================= */

function addXP(player: Player, amount: number) {
    const xpScore = getScore(player, "pw_xp");
    const levelScore = getScore(player, "pw_level");

    // ⛔ Hard stop if scoreboard identity is invalid
    if (xpScore === null || levelScore === null) return;

    let xp = xpScore + amount;
    let level = levelScore;

    let leveledUp = false;
    let rewardsGained = 0;

    while (xp >= xpForNextLevel(level)) {
        xp -= xpForNextLevel(level);
        level++;
        leveledUp = true;

        // 🎁 Reward every 5 levels (ONCE per milestone)
        if (level % 5 === 0) {
            rewardsGained++;
            player.runCommand("give @s pokeworld:greatball_ticket 1");
        }
    }

    setScore(player, "pw_xp", xp);
    setScore(player, "pw_level", level);

    // 🔔 ONE message total
    if (leveledUp) {
        player.sendMessage(`§a⬆ Level Up! You are now §eLevel ${level}`);
    }

    if (rewardsGained > 0) {
        player.sendMessage(`§6🎁 Level Reward Unlocked!`);
    }
}

/* =========================
   PASSIVE XP TRACKING
   (POST-RECLAIM ONLY)
========================= */

system.runInterval(() => {
    for (const player of world.getPlayers()) {

        const claimed = getScore(player, "pw_xp_claimed");
        if (claimed !== 1) continue;

        const catches = getScore(player, "pcatch");
        const wins = getScore(player, "victories");
        const lastCatch = getScore(player, "pw_pcatch_last");
        const lastWins = getScore(player, "pw_victories_last");

        if (
            catches === null ||
            wins === null ||
            lastCatch === null ||
            lastWins === null
        ) continue;

        const newCatches = catches - lastCatch;
        const newWins = wins - lastWins;

        if (newCatches > 0) {
            addXP(player, newCatches * XP_PER_CATCH);
            setScore(player, "pw_pcatch_last", catches);
        }

        if (newWins > 0) {
            addXP(player, newWins * XP_PER_TRAINER_WIN);
            setScore(player, "pw_victories_last", wins);
        }
    }
}, 40); // every 2 seconds

/* =========================
   ONE-TIME XP RECLAIM MENU
========================= */

export function openXPReclaimMenu(player: Player) {
    const claimed = getScore(player, "pw_xp_claimed");
    if (claimed === 1) {
        player.sendMessage("§cYou have already claimed your past XP.");
        return;
    }

    const catches = getScore(player, "pcatch");
    const wins = getScore(player, "victories");

    if (catches === null || wins === null) return;

    const totalXP =
        (catches * XP_PER_CATCH) +
        (wins * XP_PER_TRAINER_WIN);

    const form = new ActionFormData()
        .title("§lXP Reclaim")
        .body(
            `You have past progress that can be converted into XP.\n\n` +
            `§bPokémon Caught: §f${catches}\n` +
            `§bTrainer Victories: §f${wins}\n\n` +
            `§aTotal XP: §e${totalXP}\n\n` +
            `§cThis can only be claimed once.`
        )
        .button("§aClaim XP")
        .button("§cCancel");

    form.show(player).then(res => {
        if (res.canceled || res.selection !== 0) return;

        addXP(player, totalXP);

        // 🔒 Lock reclaim forever
        setScore(player, "pw_xp_claimed", 1);

        // 📌 Set tracking baselines
        setScore(player, "pw_pcatch_last", catches);
        setScore(player, "pw_victories_last", wins);

        player.sendMessage("§a✔ Past XP successfully claimed!");
    });
}
