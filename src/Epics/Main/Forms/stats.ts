/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
Aex66 (Developer)
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- 
__________ ___________________
\______   \\_____  \__    ___/
 |       _/ /   |   \|    |
 |    |   \/    |    \    |
 |____|_  /\_______  /____|
        \/         \/ 
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- 
© Copyright 2023 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Website: https://www.rotmc.ml
Thank you!
*/

import { system, world } from "@minecraft/server";
import { PlayerType } from "../../../Papers/@types/PlayerTypes.js";
import { ActionForm } from "../../../Papers/FormPaper.js";
import Commands from "../../../Papers/CommandPaper/CommandPaper.js";

// ================================================
// 🔍 Helper: Load trainer_data for this player
// ================================================
function getTrainerData(player: PlayerType) {
    const raw = world.getDynamicProperty(`trainer_data.${player.name}`);
    if (typeof raw !== "string") return { trainerTypes: [] };

    try {
        const data = JSON.parse(raw);
        if (Array.isArray(data.trainerTypes)) return data;
    } catch { }

    return { trainerTypes: [] };
}

const cmd = Commands.create({
    name: 'stats',
    description: 'See your stats',
    category: 'Pokemon'
});

cmd.callback(player => {
    player.send('The form will be shown in 2 seconds, close chat!');
    system.runTimeout(() => stats(player), 40);
});

// ================================================
// 📄 MAIN STATS FORM
// ================================================
export function stats(player: PlayerType): void {

    // -----------------------------
    // 🧩 Load Gym Completion Data
    // -----------------------------
    const trainerData = getTrainerData(player);
    const types = trainerData.trainerTypes;

    // Strong union type for safety
    type GymName = "rock" | "dark" | "dragon" | "ice" | "grass" | "water" | "flying" | "fire";

    // Badge completion flags
    const gymBadges: Record<GymName, boolean> = {
        rock: types.includes("TrainerType:RockGymTeam"),
        dark: types.includes("TrainerType:DarkGymTeam"),
        dragon: types.includes("TrainerType:DragonGymTeam"),
        ice: types.includes("TrainerType:IceGymTeam"),
        grass: types.includes("TrainerType:GrassGymTeam"),
        water: types.includes("TrainerType:WaterGymTeam"),
        flying: types.includes("TrainerType:FlyingGymTeam"),
        fire: types.includes("TrainerType:FireGymTeam"),
    };

    // Badge textures
    const badgeTextures: Record<GymName | "empty", string> = {
        rock: "textures/items/badges/badge1.png",
        dark: "textures/items/badges/badge2.png",
        dragon: "textures/items/badges/badge3.png",
        ice: "textures/items/badges/badge4.png",
        grass: "textures/items/badges/badge5.png",
        water: "textures/items/badges/badge6.png",
        flying: "textures/items/badges/badge7.png",
        fire: "textures/items/badges/badge8.png",
        empty: "textures/items/badges/badge_empty.png"
    };

    // Badge display order
    const orderedGyms: GymName[] = [
        "rock", "dark", "dragon", "ice",
        "grass", "water", "flying", "fire"
    ];

    // -----------------------------
    // 📄 Build Stats UI
    // -----------------------------
    const form = new ActionForm();
    // XP helpers (local, safe)
    function xpForNextLevel(level: number): number {
        return 100 + (level * 50);
    }

    const level = player.getScore("pw_level") ?? 0;
    const xp = player.getScore("pw_xp") ?? 0;
    const nextXP = xpForNextLevel(level);

    form.setTitle('§4§4§rYOUR STATS');
    form.setBody(
`-------------------------------
§jPokeCoins: §j${player.getScore('Money')}§j
§jPokémon Caught: §j${player.getScore('pcatch')}§j
§jXP: §j${xp}§7 / §j${nextXP}§j - §jLevel: §j${level}§j
§jTrainer Id: §j${(player.getScore('TrainerId') ?? 0).toString().padStart(6, "0")}§r
-------------------------------`
);

    // -----------------------------
    // 🏅 Display Gym Badges
    // -----------------------------
    for (const gym of orderedGyms) {
        if (gymBadges[gym]) form.addButton('', badgeTextures[gym]);
        else form.addButton('', badgeTextures["empty"]);
    }

    form.send(player, res => {
        if (res.canceled) return;
    });
};
