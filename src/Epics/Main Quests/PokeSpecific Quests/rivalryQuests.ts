/*
PokéWorld: Ascension
Rivalry & Opposition Collection Quests
*/

import type { Quest } from "./questEngine.js";
import { Player as IPlayer } from "@minecraft/server";

export const rivalryQuests: Quest[] = [

    // ========================================================
    // HOENN BLOOD FEUD
    // ========================================================

    {
        id: "rival_seviper_zangoose",
        displayName: "Venom & Fang",
        category: "Rivalries",
        icon: "textures/ui/quests/VenomFang.png",
        requirements: [
            { type: "own_species", species: "seviper" },
            { type: "own_species", species: "zangoose" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§5Title Unlocked: §dVendetta Survivor");
        }
    },

    // ========================================================
    // KANTO ARCANE DUEL
    // ========================================================

    {
        id: "rival_alakazam_gengar",
        displayName: "Mind vs Shadow",
        category: "Rivalries",
        icon: "textures/ui/quests/MindShadow.png",
        requirements: [
            { type: "own_species", species: "alakazam" },
            { type: "own_species", species: "gengar" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§dTitle Unlocked: §5Arcane Duelist");
        }
    },

    // ========================================================
    // SKY OPPOSITION
    // ========================================================

    {
        id: "rival_braviary_mandibuzz",
        displayName: "Sky Dominion",
        category: "Rivalries",
        icon: "textures/ui/quests/SkyDominion.png",
        requirements: [
            { type: "own_species", species: "braviary" },
            { type: "own_species", species: "mandibuzz" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§6Title Unlocked: §eSky Rival");
        }
    },

    // ========================================================
    // ELECTRIC VS FIRE
    // ========================================================

    {
        id: "rival_electivire_magmotar",
        displayName: "Voltage & Flame",
        category: "Rivalries",
        icon: "textures/ui/quests/VoltageFlame.png",
        requirements: [
            { type: "own_species", species: "electivire" },
            { type: "own_species", species: "magmortar" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§eTitle Unlocked: §6Elemental Combatant");
        }
    },

    // ========================================================
    // PRIMAL CLASH
    // ========================================================

    {
        id: "rival_kyogre_groudon",
        displayName: "Sea & Land",
        category: "Rivalries",
        icon: "textures/ui/quests/SeaLand.png",
        requirements: [
            { type: "own_species", species: "kyogre" },
            { type: "own_species", species: "groudon" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§3Title Unlocked: §bPrimal Arbiter");
        }
    },

    // ========================================================
    // TIME & SPACE
    // ========================================================

    {
        id: "rival_dialga_palkia",
        displayName: "Temporal Rift",
        category: "Rivalries",
        icon: "textures/ui/quests/TemporalRift.png",
        requirements: [
            { type: "own_species", species: "dialga" },
            { type: "own_species", species: "palkia" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§bTitle Unlocked: §9Dimensional Arbiter");
        }
    },

    // ========================================================
    // SWORD & SHIELD
    // ========================================================

    {
        id: "rival_zacian_zamazenta",
        displayName: "Crowned Conflict",
        category: "Rivalries",
        icon: "textures/ui/quests/CrownedConflict.png",
        requirements: [
            { type: "own_species", species: "zacian" },
            { type: "own_species", species: "zamazenta" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§2Title Unlocked: §aCrowned Duelist");
        }
    },

    // ========================================================
    // AURA VS ILLUSION
    // ========================================================

    {
        id: "rival_lucario_zoroark",
        displayName: "Aura & Illusion",
        category: "Rivalries",
        icon: "textures/ui/quests/AuraIllusion.png",
        requirements: [
            { type: "own_species", species: "lucario" },
            { type: "own_species", species: "zoroark" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§5Title Unlocked: §dPhantom Duelist");
        }
    },

    // ========================================================
    // ICE & FIRE
    // ========================================================

    {
        id: "rival_glaceon_flareon",
        displayName: "Frost & Ember",
        category: "Rivalries",
        icon: "textures/ui/quests/FrostEmber.png",
        requirements: [
            { type: "own_species", species: "glaceon" },
            { type: "own_species", species: "flareon" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§cTitle Unlocked: §eElemental Conflict");
        }
    },

    // ========================================================
    // DRAGON WAR
    // ========================================================

    {
        id: "rival_dragonite_tyranitar",
        displayName: "Sky vs Stone",
        category: "Rivalries",
        icon: "textures/ui/quests/SkyStone.png",
        requirements: [
            { type: "own_species", species: "dragonite" },
            { type: "own_species", species: "tyranitar" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§5Title Unlocked: §dTitan Rival");
        }
    },

    // ========================================================
    // LIGHT VS DARK
    // ========================================================

    {
        id: "rival_xerneas_yveltal",
        displayName: "Life & Destruction",
        category: "Rivalries",
        icon: "textures/ui/quests/LifeDestruction.png",
        requirements: [
            { type: "own_species", species: "xerneas" },
            { type: "own_species", species: "yveltal" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§dTitle Unlocked: §5Balance of Fate");
        }
    },

    // ========================================================
    // MASTER RIVAL COLLECTION
    // ========================================================

    {
        id: "rival_master",
        displayName: "Master of Conflicts",
        category: "Rivalries",
        icon: "textures/ui/quests/MasterofConflicts.png",
        requirements: [
            { type: "own_species", species: "seviper" },
            { type: "own_species", species: "zangoose" },
            { type: "own_species", species: "alakazam" },
            { type: "own_species", species: "gengar" },
            { type: "own_species", species: "braviary" },
            { type: "own_species", species: "mandibuzz" },
            { type: "own_species", species: "kyogre" },
            { type: "own_species", species: "groudon" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§4Title Unlocked: §cConflict Sovereign");
        }
    }

];