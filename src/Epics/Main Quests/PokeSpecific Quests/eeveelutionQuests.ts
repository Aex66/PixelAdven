/*
PokéWorld: Ascension
Eeveelution Collection Quests
*/

import type { Quest } from "./questEngine.js";
import { Player as IPlayer } from "@minecraft/server";

export const eeveelutionQuests: Quest[] = [

    // ========================================================
    // BASIC EEVEELUTIONS (GEN 1)
    // ========================================================

    {
        id: "eevee_gen1",
        displayName: "Elemental Awakening",
        category: "Evolution Lines",
        icon: "textures/items/book.png",
        requirements: [
            { type: "own_species", species: "vaporeon" },
            { type: "own_species", species: "jolteon" },
            { type: "own_species", species: "flareon" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§eTitle Unlocked: §6Elementalist");
        }
    },

    // ========================================================
    // FRIENDSHIP EVOLUTIONS
    // ========================================================

    {
        id: "eevee_friendship",
        displayName: "Day & Night Bond",
        category: "Evolution Lines",
        icon: "textures/items/book.png",
        requirements: [
            { type: "own_species", species: "espeon" },
            { type: "own_species", species: "umbreon" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§5Title Unlocked: §dTwilight Keeper");
        }
    },

    // ========================================================
    // NATURE EVOLUTIONS
    // ========================================================

    {
        id: "eevee_nature",
        displayName: "Forest & Frost",
        category: "Evolution Lines",
        icon: "textures/items/book.png",
        requirements: [
            { type: "own_species", species: "leafeon" },
            { type: "own_species", species: "glaceon" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§aTitle Unlocked: §bSeason Weaver");
        }
    },

    // ========================================================
    // FAIRY EVOLUTION
    // ========================================================

    {
        id: "eevee_fairy",
        displayName: "Sylvan Grace",
        category: "Evolution Lines",
        icon: "textures/items/book.png",
        requirements: [
            { type: "own_species", species: "sylveon" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§dTitle Unlocked: §2Fae Ascendant");
        }
    },

    // ========================================================
    // MASTER EEVEELUTION
    // ========================================================

    {
        id: "eevee_master",
        displayName: "Eon Mastery",
        category: "Evolution Lines",
        icon: "textures/items/book.png",
        requirements: [
            { type: "own_species", species: "vaporeon" },
            { type: "own_species", species: "jolteon" },
            { type: "own_species", species: "flareon" },
            { type: "own_species", species: "espeon" },
            { type: "own_species", species: "umbreon" },
            { type: "own_species", species: "leafeon" },
            { type: "own_species", species: "glaceon" },
            { type: "own_species", species: "sylveon" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§bTitle Unlocked: §3Eon Master");
        }
    }

];