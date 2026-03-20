/*
PokéWorld: Ascension
Legendary Set Collection Quests (Gen 1–4)
*/

import type { Quest } from "./questEngine.js";
import { Player as IPlayer } from "@minecraft/server";

export const legendarySetQuests: Quest[] = [

    // ========================================================
    // GEN 1 — KANTO
    // ========================================================

    {
        id: "legendary_birds",
        displayName: "Kanto Stormbringers",
        category: "Legendary Sets",
        icon: "textures/items/ui/quests/legendary/gen1_birds.png",
        requirements: [
            { type: "own_species", species: "articuno" },
            { type: "own_species", species: "zapdos" },
            { type: "own_species", species: "moltres" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§bTitle Unlocked: §3Stormbringer");
        }
    },

    {
        id: "kanto_masters",
        displayName: "Genetic Apex",
        category: "Legendary Sets",
        icon: "textures/items/ui/quests/legendary/gen1_masters.png",
        requirements: [
            { type: "own_species", species: "mewtwo" },
            { type: "own_species", species: "mew" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§dTitle Unlocked: §5Genetic Apex");
        }
    },

    // ========================================================
    // GEN 2 — JOHTO
    // ========================================================

    {
        id: "legendary_beasts",
        displayName: "Johto Elemental Beasts",
        category: "Legendary Sets",
        icon: "textures/items/ui/quests/legendary/gen2_beasts.png",
        requirements: [
            { type: "own_species", species: "raikou" },
            { type: "own_species", species: "entei" },
            { type: "own_species", species: "suicune" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§6Title Unlocked: §eBeastbound");
        }
    },

    {
        id: "tower_duo",
        displayName: "Tower of Legends",
        category: "Legendary Sets",
        icon: "textures/items/ui/quests/legendary/gen2_duo.png",
        requirements: [
            { type: "own_species", species: "lugia" },
            { type: "own_species", species: "hooh" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§eTitle Unlocked: §6Skykeeper");
        }
    },

    {
        id: "time_traveler",
        displayName: "Guardian of Time",
        category: "Legendary Sets",
        icon: "textures/items/ui/quests/legendary/gen2_mythic.png",
        requirements: [
            { type: "own_species", species: "celebi" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§aTitle Unlocked: §2Timewalker");
        }
    },

    // ========================================================
    // GEN 3 — HOENN
    // ========================================================

    {
        id: "legendary_regis",
        displayName: "Titan Awakening",
        category: "Legendary Sets",
        icon: "textures/items/ui/quests/legendary/gen3_regis.png",
        requirements: [
            { type: "own_species", species: "regirock" },
            { type: "own_species", species: "regice" },
            { type: "own_species", species: "registeel" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§2Title Unlocked: §aTitan Warden");
        }
    },

    {
        id: "eon_duo",
        displayName: "Eon Bond",
        category: "Legendary Sets",
        icon: "textures/items/ui/quests/legendary/gen3_eon.png",
        requirements: [
            { type: "own_species", species: "latias" },
            { type: "own_species", species: "latios" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§bTitle Unlocked: §3Eon Sovereign");
        }
    },

    {
        id: "weather_trio",
        displayName: "Forces of Nature",
        category: "Legendary Sets",
        icon: "textures/items/ui/quests/legendary/gen3_weather.png",
        requirements: [
            { type: "own_species", species: "groudon" },
            { type: "own_species", species: "kyogre" },
            { type: "own_species", species: "rayquaza" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§aTitle Unlocked: §2Sky Sovereign");
        }
    },

    {
        id: "hoenn_mythics",
        displayName: "Cosmic Visitors",
        category: "Legendary Sets",
        icon: "textures/items/ui/quests/legendary/gen3_mythics.png",
        requirements: [
            { type: "own_species", species: "jirachi" },
            { type: "own_species", species: "deoxys" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§dTitle Unlocked: §5Starborn");
        }
    },

    // ========================================================
    // GEN 4 — SINNOH
    // ========================================================

    {
        id: "lake_guardians",
        displayName: "Lake Guardians",
        category: "Legendary Sets",
        icon: "textures/items/ui/quests/legendary/gen4_lake.png",
        requirements: [
            { type: "own_species", species: "uxie" },
            { type: "own_species", species: "mesprit" },
            { type: "own_species", species: "azelf" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§bTitle Unlocked: §3Mind Triad");
        }
    },

    {
        id: "creation_trio",
        displayName: "Creation Authority",
        category: "Legendary Sets",
        icon: "textures/items/ui/quests/legendary/gen4_creation.png",
        requirements: [
            { type: "own_species", species: "dialga" },
            { type: "own_species", species: "palkia" },
            { type: "own_species", species: "giratina" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§5Title Unlocked: §dReality Sovereign");
        }
    },

    {
        id: "sinnoh_mythics",
        displayName: "Myths of Sinnoh",
        category: "Legendary Sets",
        icon: "textures/items/ui/quests/legendary/gen4_mythics.png",
        requirements: [
            { type: "own_species", species: "manaphy" },
            { type: "own_species", species: "darkrai" },
            { type: "own_species", species: "shaymin" },
            { type: "own_species", species: "arceus" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§dTitle Unlocked: §5Myth Incarnate");
        }
    },

    {
        id: "legendary_master_gen4",
        displayName: "Ascension of Legends",
        category: "Legendary Sets",
        icon: "textures/items/ui/quests/legendary/master.png",
        requirements: [
            { type: "own_species", species: "articuno" },
            { type: "own_species", species: "zapdos" },
            { type: "own_species", species: "moltres" },
            { type: "own_species", species: "mewtwo" },
            { type: "own_species", species: "mew" },
            { type: "own_species", species: "raikou" },
            { type: "own_species", species: "entei" },
            { type: "own_species", species: "suicune" },
            { type: "own_species", species: "lugia" },
            { type: "own_species", species: "hooh" },
            { type: "own_species", species: "celebi" },
            { type: "own_species", species: "regirock" },
            { type: "own_species", species: "regice" },
            { type: "own_species", species: "registeel" },
            { type: "own_species", species: "latias" },
            { type: "own_species", species: "latios" },
            { type: "own_species", species: "groudon" },
            { type: "own_species", species: "kyogre" },
            { type: "own_species", species: "rayquaza" },
            { type: "own_species", species: "jirachi" },
            { type: "own_species", species: "deoxys" },
            { type: "own_species", species: "uxie" },
            { type: "own_species", species: "mesprit" },
            { type: "own_species", species: "azelf" },
            { type: "own_species", species: "dialga" },
            { type: "own_species", species: "palkia" },
            { type: "own_species", species: "giratina" },
            { type: "own_species", species: "heatran" },
            { type: "own_species", species: "regigigas" },
            { type: "own_species", species: "cresselia" },
            { type: "own_species", species: "manaphy" },
            { type: "own_species", species: "darkrai" },
            { type: "own_species", species: "shaymin" },
            { type: "own_species", species: "arceus" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§5Title Unlocked: §dLegend Sovereign");
        }
    }

];