/*
PokéWorld: Ascension
Fossil Collection Quests
*/

import type { Quest } from "./questEngine.js";
import { Player as IPlayer } from "@minecraft/server";

// ============================================================
// FOSSIL QUESTS
// ============================================================

export const fossilQuests: Quest[] = [

    // ========================================================
    // KANTO FOSSILS
    // ========================================================

    {
        id: "fossil_kanto",
        displayName: "Kanto Relics",
        category: "Fossils",
        icon: "textures/ui/quests/Gen1Fossil.png",
        requirements: [
            { type: "own_species", species: "kabuto" },
            { type: "own_species", species: "omanyte" },
            { type: "own_species", species: "aerodactyl" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§6Title Unlocked: §eAncient Revivalist");
        }
    },

    // ========================================================
    // HOENN FOSSILS
    // ========================================================

    {
        id: "fossil_hoenn",
        displayName: "Hoenn Excavation",
        category: "Fossils",
        icon: "textures/ui/quests/Gen3Fossil.png",
        requirements: [
            { type: "own_species", species: "lileep" },
            { type: "own_species", species: "anorith" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§2Title Unlocked: §aHoenn Paleontologist");
        }
    },

    // ========================================================
    // SINNOH FOSSILS
    // ========================================================

    {
        id: "fossil_sinnoh",
        displayName: "Sinnoh Restoration",
        category: "Fossils",
        icon: "textures/ui/quests/Gen4Fossil.png",
        requirements: [
            { type: "own_species", species: "cranidos" },
            { type: "own_species", species: "shieldon" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§bTitle Unlocked: §3Sinnoh Excavator");
        }
    },

    // ========================================================
    // UNOVA FOSSILS
    // ========================================================

    {
        id: "fossil_unova",
        displayName: "Unova Resurgence",
        category: "Fossils",
        icon: "textures/ui/quests/Gen5Fossil.png",
        requirements: [
            { type: "own_species", species: "tirtouga" },
            { type: "own_species", species: "archen" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§1Title Unlocked: §9Unova Reconstructor");
        }
    },

    // ========================================================
    // KALOS FOSSILS
    // ========================================================

    {
        id: "fossil_kalos",
        displayName: "Kalos Reawakening",
        category: "Fossils",
        icon: "textures/ui/quests/Gen6Fossil.png",
        requirements: [
            { type: "own_species", species: "tyrunt" },
            { type: "own_species", species: "amaura" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§dTitle Unlocked: §5Kalos Paleomaster");
        }
    },

    // ========================================================
    // GALAR FOSSILS
    // ========================================================

    {
        id: "fossil_galar",
        displayName: "Galarian Anomalies",
        category: "Fossils",
        icon: "textures/ui/quests/Gen8Fossil.png",
        requirements: [
            { type: "own_species", species: "dracozolt" },
            { type: "own_species", species: "arctozolt" },
            { type: "own_species", species: "dracovish" },
            { type: "own_species", species: "arctovish" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§2Title Unlocked: §aFossil Splicer");
        }
    },

    // ========================================================
    // MASTER FOSSIL COLLECTION
    // ========================================================

    {
        id: "fossil_master",
        displayName: "Fossil Dominion",
        category: "Fossils",
        icon: "textures/items/dino_fossil.png",
        requirements: [
            { type: "own_species", species: "kabuto" },
            { type: "own_species", species: "omanyte" },
            { type: "own_species", species: "aerodactyl" },
            { type: "own_species", species: "lileep" },
            { type: "own_species", species: "anorith" },
            { type: "own_species", species: "cranidos" },
            { type: "own_species", species: "shieldon" },
            { type: "own_species", species: "tirtouga" },
            { type: "own_species", species: "archen" },
            { type: "own_species", species: "tyrunt" },
            { type: "own_species", species: "amaura" },
            { type: "own_species", species: "dracozolt" },
            { type: "own_species", species: "arctozolt" },
            { type: "own_species", species: "dracovish" },
            { type: "own_species", species: "arctovish" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§cTitle Unlocked: §4Fossil Overlord");
        }
    }

];