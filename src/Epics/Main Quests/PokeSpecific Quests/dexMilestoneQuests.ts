/*
PokéWorld: Ascension
Pokédex Milestone Quests
Long-Term Collection Progression
*/

import type { Quest } from "./questEngine.js";
import { Player as IPlayer } from "@minecraft/server";

export const dexMilestoneQuests: Quest[] = [

    {
        id: "dex_25",
        displayName: "Rookie Researcher",
        category: "Pokédex Milestones",
        icon: "textures/items/ui/quests/dex/bronze.png",
        requirements: [
            { type: "unique_species_count", amount: 25 }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§6Title Unlocked: §eDex Initiate");
        }
    },

    {
        id: "dex_75",
        displayName: "Field Scholar",
        category: "Pokédex Milestones",
        icon: "textures/items/ui/quests/dex/silver.png",
        requirements: [
            { type: "unique_species_count", amount: 75 }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§7Title Unlocked: §fWildlife Analyst");
        }
    },

    {
        id: "dex_150",
        displayName: "Regional Expert",
        category: "Pokédex Milestones",
        icon: "textures/items/ui/quests/dex/gold.png",
        requirements: [
            { type: "unique_species_count", amount: 150 }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§6Title Unlocked: §eDex Archivist");
        }
    },

    {
        id: "dex_300",
        displayName: "Master Researcher",
        category: "Pokédex Milestones",
        icon: "textures/items/ui/quests/dex/platinum.png",
        requirements: [
            { type: "unique_species_count", amount: 300 }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§bTitle Unlocked: §3Pokédex Master");
        }
    },

    {
        id: "dex_500",
        displayName: "Living Encyclopedia",
        category: "Pokédex Milestones",
        icon: "textures/items/ui/quests/dex/diamond.png",
        requirements: [
            { type: "unique_species_count", amount: 500 }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§dTitle Unlocked: §5Legendary Archivist");
        }
    }

];