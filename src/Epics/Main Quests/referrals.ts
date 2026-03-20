// ============================================================
// ⭐ REFERRAL SYSTEM — CLEAN CODES, OFFLINE REWARDS, AUTO CHECKS
// ============================================================

import { Player, world, system } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import Commands from "../../Papers/CommandPaper/CommandPaper";

// ============================================================
// 🎁 REWARDS FOR THE PLAYER WHO ENTERS A CODE (ONE-TIME ONLY)
// ============================================================
const REFERRAL_USER_REWARD = [
    { command: "give @s pokeworld:greatball 5" },
    { command: "give @s pokeworld:rare_candy 2" },
    { command: "scoreboard players add @s Money 2500" },
];

function giveReferralUserReward(player: Player) {
    if (player.getDynamicProperty("referral_user_reward_claimed") === true) {
        return; // already claimed once
    }

    for (const reward of REFERRAL_USER_REWARD) {
        player.runCommand(reward.command);
    }

    player.setDynamicProperty("referral_user_reward_claimed", true);

    player.sendMessage("§aYou received your one-time referral bonus!");
}

// ===============================================
// ✅ /referral COMMAND — Opens the Referral Menu
// ===============================================
const referralCmd = Commands.create({
    name: "referral",
    description: "Open your referral rewards menu",
    admin: false,              // players can use it
    category: "General",
});

// OPTIONAL: Permission check
// If you want ALL players to use it, remove this entire function
function referralPerm(player: Player) {
    // Example: if you want only normal players (not guests)
    // return hasPerm(player, ["Player","Trainer","Owner"]);
    return true; // allow all
}

referralCmd.callback(async (player: Player) => {
    if (!referralPerm(player)) {
        return player.sendMessage("§cYou do not have permission.");
    }

    // Tell the player to close chat before the UI opens
    player.sendMessage("§eClose chat — referral menu opens in §63 seconds§e...");

    // Wait 3 seconds for chat to close
    system.runTimeout(() => {

        // 👉 CALL THE REFERRAL UI YOU ALREADY HAVE
        try {
            openReferralMenu(player);
        } catch (e) {
            player.sendMessage("§cAn error occurred opening the referral menu.");
            console.error(e);
        }

    }, 60); // 60 ticks = 3 seconds
});

// ============================================================
// CONFIG — REWARDS PER REFERRAL MILESTONE
// ============================================================
const REFERRAL_REWARDS = [
    { command: "give @s pokeworld:ultraball 5" },
    { command: "give @s pokeworld:rare_candy 3" },
    { command: "scoreboard players add @s Money 5000" }
];

interface ReferralRegistry {
    [code: string]: string; // code → playerID
}

interface ReferralOfflineStore {
    points: number;
    unclaimed: number;
}

// ============================================================
// UTILS
// ============================================================
function getJSON<T>(target: any, key: string, fallback: T): T {
    try {
        const raw = target.getDynamicProperty(key);
        if (!raw) return fallback;
        return JSON.parse(raw as string) as T;
    } catch {
        return fallback;
    }
}

function setJSON(target: any, key: string, value: any) {
    target.setDynamicProperty(key, JSON.stringify(value));
}

// ============================================================
// CLEAN RANDOM CODE GENERATOR — A-Z, 0-9 ONLY, LENGTH 8
// ============================================================
function generateReferralCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let out = "";
    for (let i = 0; i < 8; i++) {
        out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
}

// ============================================================
// GLOBAL REGISTRY FOR OFFLINE REFERRAL LOOKUPS
// ============================================================
function getRegistry(): ReferralRegistry {
    try {
        return JSON.parse(world.getDynamicProperty("referral_registry") as string ?? "{}");
    } catch {
        return {};
    }
}

function saveRegistry(reg: ReferralRegistry) {
    world.setDynamicProperty("referral_registry", JSON.stringify(reg));
}

function ensureReferralCode(player: Player): string {
    let code = player.getDynamicProperty("referral_code") as string | undefined;

    if (!code) {
        code = generateReferralCode();
        player.setDynamicProperty("referral_code", code);

        const reg = getRegistry();
        reg[code] = player.id;
        saveRegistry(reg);
    }
    return code;
}

function getPlayerIdByReferral(code: string): string | undefined {
    const reg = getRegistry();
    return reg[code];
}

// ============================================================
// GYM / ELITE FOUR TRACKING
// ============================================================
function getGymCount(player: Player): number {
    const gyms = getJSON<string[]>(player, "quest_chapter5_gyms", []);
    return gyms.length;
}

function hasBeatenTwoGyms(player: Player): boolean {
    return getGymCount(player) >= 2;
}

function eliteFourCompleted(player: Player): boolean {
    return (
        player.getDynamicProperty("elite4_electric_beaten") === true &&
        player.getDynamicProperty("elite4_fighting_beaten") === true &&
        player.getDynamicProperty("elite4_psychic_beaten") === true &&
        player.getDynamicProperty("elite4_champion_beaten") === true
    );
}

// ============================================================
// OFFLINE-SAFE REWARD GRANTING
// ============================================================
function addReferralProgressToId(playerId: string, amount: number) {
    // First check if online
    for (const p of world.getPlayers()) {
        if (p.id === playerId) {
            addReferralProgress(p, amount);
            return;
        }
    }

    // Offline → save globally
    let offline = getJSON<ReferralOfflineStore>(world, `referral_offline_${playerId}`, {
        points: 0,
        unclaimed: 0,
    });

    offline.points += amount;
    offline.unclaimed += amount;

    world.setDynamicProperty(`referral_offline_${playerId}`, JSON.stringify(offline));
}

function addReferralProgress(owner: Player, amount: number) {
    let data = getJSON<ReferralOfflineStore>(owner, "referral_data", {
        points: 0,
        unclaimed: 0,
    });

    data.points += amount;
    data.unclaimed += amount;

    setJSON(owner, "referral_data", data);
    owner.sendMessage(`§b[Referral] §aYou earned §e${amount} §areferral point(s)!`);
}

// ============================================================
// CLAIM REFERRAL REWARDS
// ============================================================
export function claimReferralRewards(player: Player) {
    let data = getJSON<ReferralOfflineStore>(player, "referral_data", {
        points: 0,
        unclaimed: 0,
    });

    if (data.unclaimed <= 0) {
        player.sendMessage("§cYou have no referral rewards to claim.");
        return;
    }

    for (let i = 0; i < data.unclaimed; i++) {
        for (const reward of REFERRAL_REWARDS) {
            player.runCommand(reward.command);
        }
    }

    const count = data.unclaimed;
    data.unclaimed = 0;
    setJSON(player, "referral_data", data);

    player.sendMessage(`§aYou claimed §e${count} §areferral reward tier(s)!`);
}

// ============================================================
// AUTO-CHECK 5 MIN FOR GYM & ELITE FOUR UPDATES
// ============================================================
system.runInterval(() => {
    for (const player of world.getPlayers()) {
        const used = player.getDynamicProperty("referral_used") as string;
        if (!used) continue;

        // Gym milestones every 2 gyms
        const gymCount = getGymCount(player);

        let last = Number(player.getDynamicProperty("referral_last_gym_check") ?? 0);
        if (gymCount > last && gymCount % 2 === 0) {
            const ownerId = getPlayerIdByReferral(used);
            if (ownerId) addReferralProgressToId(ownerId, 1);
        }
        player.setDynamicProperty("referral_last_gym_check", gymCount);

        // Elite four check
        let eliteLast = player.getDynamicProperty("referral_elite_done") as boolean;
        if (!eliteLast && eliteFourCompleted(player)) {
            const ownerId = getPlayerIdByReferral(used);
            if (ownerId) addReferralProgressToId(ownerId, 1);
            player.setDynamicProperty("referral_elite_done", true);
        }
    }
}, 20 * 60 * 5); // 5 minutes

// ============================================================
// OFFLINE → ONLINE MERGE
// ============================================================
world.afterEvents.playerSpawn.subscribe(ev => {
    if (!ev.initialSpawn) return;
    const player = ev.player;

    const id = player.id;
    const raw = world.getDynamicProperty(`referral_offline_${id}`);
    if (!raw) return;

    try {
        const stored = JSON.parse(raw as string) as ReferralOfflineStore;
        let cur = getJSON<ReferralOfflineStore>(player, "referral_data", {
            points: 0,
            unclaimed: 0
        });

        cur.points += stored.points;
        cur.unclaimed += stored.unclaimed;

        setJSON(player, "referral_data", cur);
        world.setDynamicProperty(`referral_offline_${id}`, undefined);

        if (stored.unclaimed > 0) {
            player.sendMessage("§eYou received offline referral rewards. Open the Referral Menu.");
        }
    } catch { }
});

// ============================================================
// UI: OPEN REFERRAL MENU
// ============================================================
export function openReferralMenu(player: Player) {
    const code = ensureReferralCode(player);
    const used = player.getDynamicProperty("referral_used");

    const data = getJSON<ReferralOfflineStore>(player, "referral_data", {
        points: 0,
        unclaimed: 0,
    });

    const form = new ActionFormData()
        .title("§dReferral System")
        .body(
            `§7Your Referral Code: §b${code}\n\n` +
            `§7Referral Used: §e${used ?? "§cNone"}\n` +
            `§7Total Referral Points: §a${data.points}\n` +
            `§7Unclaimed Rewards: §6${data.unclaimed}`
        )
        .button("§aEnter Referral Code")
        .button("§bClaim Rewards")
        .button("§cClose");

    form.show(player).then(res => {
        if (res.canceled) return;

        switch (res.selection) {
            case 0: return openCodeEntry(player);
            case 1: return claimReferralRewards(player);
        }
    });
}

// ============================================================
// UI: ENTER REFERRAL CODE
// ============================================================
function openCodeEntry(player: Player) {
    if (!hasBeatenTwoGyms(player)) {
        player.sendMessage("§cYou must beat at least 2 gyms first.");
        return;
    }

    if (player.getDynamicProperty("referral_used")) {
        player.sendMessage("§cYou already used a referral code.");
        return;
    }

    const modal = new ModalFormData()
        .title("§bEnter Referral Code")
        .textField("Enter the 8-digit referral code:", "EXAMPLE: ABCD1234");

    modal.show(player).then(res => {
        if (res.canceled) return;

        const code = (res.formValues?.[0] as string)?.trim().toUpperCase();
        if (!code || code.length !== 8) {
            player.sendMessage("§cInvalid referral code.");
            return;
        }

        const ownerId = getPlayerIdByReferral(code);
        if (!ownerId) {
            player.sendMessage("§cNo player exists with that referral code.");
            return;
        }

        if (ownerId === player.id) {
            player.sendMessage("§cYou cannot use your own referral code.");
            return;
        }

        player.setDynamicProperty("referral_used", code);
        player.sendMessage("§aReferral linked successfully!");

        // ⭐ Give the player their ONE-TIME reward
        giveReferralUserReward(player);

        // ⭐ Reward the owner
        addReferralProgressToId(ownerId, 1);
    });
}
