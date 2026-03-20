/*
PokéWorld: Ascension
Starter Collection Quest Definitions
Built on top of questEngine.ts
*/

import type { Quest } from "./questEngine.js";
import { Player as IPlayer } from "@minecraft/server";

// ============================================================
// STARTER QUESTS
// ============================================================

export const starterQuests: Quest[] = [

    // ========================================================
    // KANTO
    // ========================================================

    {
        id: "starter_kanto",
        displayName: "Kanto Origins",
        category: "Starters",
        icon: "textures/ui/quests/Gen1.png",
        requirements: [
            { type: "own_species", species: "bulbasaur" },
            { type: "own_species", species: "charmander" },
            { type: "own_species", species: "squirtle" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§2Title Unlocked: §aKanto Vanguard");
        }
    },

    // ========================================================
    // JOHTO
    // ========================================================

    {
        id: "starter_johto",
        displayName: "Johto Legacy",
        category: "Starters",
        icon: "textures/ui/quests/Gen2.png",
        requirements: [
            { type: "own_species", species: "chikorita" },
            { type: "own_species", species: "cyndaquil" },
            { type: "own_species", species: "totodile" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§6Title Unlocked: §eJohto Guardian");
        }
    },

    // ========================================================
    // HOENN
    // ========================================================

    {
        id: "starter_hoenn",
        displayName: "Hoenn Awakening",
        category: "Starters",
        icon: "textures/ui/quests/Gen3.png",
        requirements: [
            { type: "own_species", species: "treecko" },
            { type: "own_species", species: "torchic" },
            { type: "own_species", species: "mudkip" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§3Title Unlocked: §bHoenn Conqueror");
        }
    },

    // ========================================================
    // SINNOH
    // ========================================================

    {
        id: "starter_sinnoh",
        displayName: "Sinnoh Dominion",
        category: "Starters",
        icon: "textures/ui/quests/Gen4.png",
        requirements: [
            { type: "own_species", species: "turtwig" },
            { type: "own_species", species: "chimchar" },
            { type: "own_species", species: "piplup" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§bTitle Unlocked: §3Sinnoh Sovereign");
        }
    },

    // ========================================================
    // UNOVA
    // ========================================================

    {
        id: "starter_unova",
        displayName: "Unova Ascension",
        category: "Starters",
        icon: "textures/ui/quests/Gen5.png",
        requirements: [
            { type: "own_species", species: "snivy" },
            { type: "own_species", species: "tepig" },
            { type: "own_species", species: "oshawott" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§1Title Unlocked: §9Unova Champion");
        }
    },

    // ========================================================
    // KALOS
    // ========================================================

    {
        id: "starter_kalos",
        displayName: "Kalos Renaissance",
        category: "Starters",
        icon: "textures/ui/quests/Gen6.png",
        requirements: [
            { type: "own_species", species: "chespin" },
            { type: "own_species", species: "fennekin" },
            { type: "own_species", species: "froakie" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§dTitle Unlocked: §5Kalos Virtuoso");
        }
    },

    // ========================================================
    // ALOLA
    // ========================================================

    {
        id: "starter_alola",
        displayName: "Alola Harmony",
        category: "Starters",
        icon: "textures/ui/quests/Gen7.png",
        requirements: [
            { type: "own_species", species: "rowlet" },
            { type: "own_species", species: "litten" },
            { type: "own_species", species: "popplio" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§aTitle Unlocked: §2Alolan Island Hero");
        }
    },

    // ========================================================
    // GALAR
    // ========================================================

    {
        id: "starter_galar",
        displayName: "Galarian Might",
        category: "Starters",
        icon: "textures/ui/quests/Gen8.png",
        requirements: [
            { type: "own_species", species: "grookey" },
            { type: "own_species", species: "scorbunny" },
            { type: "own_species", species: "sobble" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§2Title Unlocked: §aGalar Apex Trainer");
        }
    },

    // ========================================================
    // PALDEA
    // ========================================================

    {
        id: "starter_paldea",
        displayName: "Paldean Evolution",
        category: "Starters",
        icon: "textures/ui/quests/Gen9.png",
        requirements: [
            { type: "own_species", species: "sprigatito" },
            { type: "own_species", species: "fuecoco" },
            { type: "own_species", species: "quaxly" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§5Title Unlocked: §dPaldea Paragon");
        }
    }

];