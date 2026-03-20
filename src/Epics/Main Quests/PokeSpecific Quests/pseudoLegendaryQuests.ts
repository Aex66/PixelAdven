/*
PokéWorld: Ascension
Pseudo-Legendary Collection Quests
*/

import type { Quest } from "./questEngine.js";
import { Player as IPlayer } from "@minecraft/server";

export const pseudoLegendaryQuests: Quest[] = [

    // ========================================================
    // BASE PSEUDO COLLECTION
    // ========================================================

    {
        id: "pseudo_base",
        displayName: "Elite Bloodline",
        category: "Elite Species",
        icon: "textures/items/book.png",
        requirements: [
            { type: "own_species", species: "dragonite" },
            { type: "own_species", species: "tyranitar" },
            { type: "own_species", species: "salamence" },
            { type: "own_species", species: "metagross" },
            { type: "own_species", species: "garchomp" },
            { type: "own_species", species: "hydreigon" },
            { type: "own_species", species: "goodra" },
            { type: "own_species", species: "kommo-o" },
            { type: "own_species", species: "dragapult" },
            { type: "own_species", species: "baxcalibur" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§5Title Unlocked: §dMythic Vanguard");
        }
    },

    // ========================================================
    // LEVEL 70 ELITE
    // ========================================================

    {
        id: "pseudo_lv70",
        displayName: "Awakened Titans",
        category: "Elite Species",
        icon: "textures/items/book.png",
        requirements: [
            { type: "own_species_level", species: "dragonite", minLevel: 70 },
            { type: "own_species_level", species: "tyranitar", minLevel: 70 },
            { type: "own_species_level", species: "salamence", minLevel: 70 },
            { type: "own_species_level", species: "metagross", minLevel: 70 },
            { type: "own_species_level", species: "garchomp", minLevel: 70 },
            { type: "own_species_level", species: "hydreigon", minLevel: 70 },
            { type: "own_species_level", species: "goodra", minLevel: 70 },
            { type: "own_species_level", species: "kommo-o", minLevel: 70 },
            { type: "own_species_level", species: "dragapult", minLevel: 70 },
            { type: "own_species_level", species: "baxcalibur", minLevel: 70 }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§cTitle Unlocked: §4Titan Conqueror");
        }
    },

    // ========================================================
    // HIGH IV ELITE
    // ========================================================

    {
        id: "pseudo_iv",
        displayName: "Perfected Bloodline",
        category: "Elite Species",
        icon: "textures/items/book.png",
        requirements: [
            { type: "own_species_iv", species: "dragonite", minIV: 85 },
            { type: "own_species_iv", species: "tyranitar", minIV: 85 },
            { type: "own_species_iv", species: "salamence", minIV: 85 },
            { type: "own_species_iv", species: "metagross", minIV: 85 },
            { type: "own_species_iv", species: "garchomp", minIV: 85 },
            { type: "own_species_iv", species: "hydreigon", minIV: 85 },
            { type: "own_species_iv", species: "goodra", minIV: 85 },
            { type: "own_species_iv", species: "kommo-o", minIV: 85 },
            { type: "own_species_iv", species: "dragapult", minIV: 85 },
            { type: "own_species_iv", species: "baxcalibur", minIV: 85 }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§6Title Unlocked: §eAscended Bloodlord");
        }
    }

];