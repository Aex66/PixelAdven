import { Player as IPlayer } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { starterQuests } from "./starterQuests.js";
import type { Quest } from "./questEngine.js";
import { openQuestCategoryMenu } from "./categoryMenu.js";
import { fossilQuests } from "./fossilQuests.js";
import { legendarySetQuests } from "./legendarySets.js";
import { eeveelutionQuests } from "./eeveelutionQuests.js";
import { pseudoLegendaryQuests } from "./pseudoLegendaryQuests.js";
import { rivalryQuests } from "./rivalryQuests.js";
import { routeBeginningQuests } from "./routeBeginningQuests.js";
import { dexMilestoneQuests } from "./dexMilestoneQuests.js";
import { openQuestMenu } from "../questMain.js";

// ============================================================
// REGISTER ALL COLLECTION QUESTS HERE
// ============================================================

export const allCollectionQuests: Quest[] = [
    ...starterQuests,
    ...fossilQuests,
    ...legendarySetQuests,
    ...eeveelutionQuests,
    ...pseudoLegendaryQuests,
    ...rivalryQuests,
    ...routeBeginningQuests,
    ...dexMilestoneQuests
];

// ============================================================
// CATEGORY ICON MAP
// ============================================================

const categoryIcons: Record<string, string> = {
    "Starters": "textures/ui/quests/Starters.png",
    "Fossils": "textures/ui/quests/Fossils.png",
    "Legendary Sets": "textures/ui/quests/Legendary.png",
    "Evolution Lines": "textures/ui/quests/Eeveelutions.png",
    "Elite Species": "textures/ui/quests/PsuedoLegendary.png",
    "Rivalries": "textures/ui/quests/Rivalry.png",
    "Route Beginnings": "textures/ui/quests/EarlyRoute.png",
    "Pokédex Milestones": "textures/ui/quests/PokedexCompletion.png"
};

// ============================================================
// OPEN MAIN COLLECTION MENU
// ============================================================

export async function openCollectionsMenu(player: IPlayer) {

    const categories = [...new Set(allCollectionQuests.map(q => q.category))];

    const form = new ActionFormData();
    form.title("§7§7§r§6Pokédex Collections");

    for (const category of categories) {

        const icon = categoryIcons[category];

        form.button(category, icon);
    }

    // 🔙 Back Button
    form.button("§c← Back", "textures/items/left_arrow.png");

    const response = await form.show(player);

    if (response.canceled || response.selection === undefined) return;

    if (response.selection === categories.length) {
        openQuestMenu(player);
        return;
    }

    const selectedCategory = categories[response.selection];

    await openQuestCategoryMenu(player, selectedCategory);
}
