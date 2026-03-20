/*
PokéWorld: Ascension
Shiny Collection Milestones
*/

import type { Quest } from "./questEngine.js";
import { Player as IPlayer } from "@minecraft/server";

export const shinyMilestoneQuests: Quest[] = [

    {
        id: "shiny_1",
        displayName: "First Sparkle",
        category: "Shiny Hunter",
        icon: "textures/items/ui/quests/shiny/bronze.png",
        requirements: [
            { type: "shiny_count", amount: 1 }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§bTitle Unlocked: §fLucky Trainer");
        }
    },

    {
        id: "shiny_5",
        displayName: "Gleaming Collector",
        category: "Shiny Hunter",
        icon: "textures/items/ui/quests/shiny/silver.png",
        requirements: [
            { type: "shiny_count", amount: 5 }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§bTitle Unlocked: §3Radiant Tamer");
        }
    },

    {
        id: "shiny_15",
        displayName: "Radiant Researcher",
        category: "Shiny Hunter",
        icon: "textures/items/ui/quests/shiny/gold.png",
        requirements: [
            { type: "shiny_count", amount: 15 }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§dTitle Unlocked: §5Prismatic Master");
        }
    },

    {
        id: "shiny_30",
        displayName: "Aurora Vanguard",
        category: "Shiny Hunter",
        icon: "textures/items/ui/quests/shiny/platinum.png",
        requirements: [
            { type: "shiny_count", amount: 30 }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§dTitle Unlocked: §5Shiny Overlord");
        }
    }

];