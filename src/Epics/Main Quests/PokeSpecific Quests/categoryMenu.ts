import { Player as IPlayer } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import {getQuestProgress, attemptClaim,getRequirementBreakdown} from "./questEngine.js";
import { allCollectionQuests, openCollectionsMenu } from "./collectionMenu.js";

// ============================================================
// GENERIC CATEGORY MENU
// ============================================================

export async function openQuestCategoryMenu(
    player: IPlayer,
    category: string
) {

    const quests = allCollectionQuests.filter(q => q.category === category);

    if (quests.length === 0) {
        player.sendMessage("§cNo quests found in this category.");
        return;
    }

    const form = new ActionFormData();
    form.title(`§7§7§r§6${category}`);

    for (const quest of quests) {

        const progress = getQuestProgress(player, quest);

        let status = "";

        // 🔥 Special handling for unique_species_count quests
        const uniqueReq = quest.requirements.find(r => r.type === "unique_species_count");
        const shinyReq = quest.requirements.find(r => r.type === "shiny_count");

        if (uniqueReq || shinyReq) {

            const breakdown = getRequirementBreakdown(player, quest);
            const label = breakdown[0]?.label ?? "";

            // Extract current count from label string
            const match = label.match(/\((.*?)\)/);
            const countText = match ? match[1] : `${progress.completed}/${progress.total}`;

            if (progress.claimed) {
                status = `§a✔ Claimed`;
            } else if (progress.complete) {
                status = `§e★ Ready to Claim`;
            } else {
                status = `§a${countText}`;
            }

        } else {

            // Default behavior for normal quests
            if (progress.claimed) {
                status = "§c Claimed";
            } else if (progress.complete) {
                status = "§a Ready to Claim";
            } else {
                status = `§e${progress.completed}/${progress.total}`;
            }
        }

        form.button(`${quest.displayName}\n${status}`, quest.icon);
    }

    // 🔙 Back button
    form.button("§a← Back", "textures/items/left_arrow.png");

    const response = await form.show(player);

    if (response.canceled || response.selection === undefined) return;

    if (response.selection === quests.length) {
        openCollectionsMenu(player);
        return;
    }

    const selectedQuest = quests[response.selection];

    // Open details page (your existing logic)
    const progress = getQuestProgress(player, selectedQuest);
    const breakdown = getRequirementBreakdown(player, selectedQuest);

    let body = `§e${selectedQuest.displayName}\n\n`;

    for (const req of breakdown) {
        body += `${req.met ? "§a✔" : "§c✘"} §2${req.label}\n`;
    }

    body += `\n§aProgress: ${progress.completed}/${progress.total}`;

    const detailForm = new ActionFormData()
        .title("Quest Details")
        .body(body);

    let claimIndex: number | null = null;

    if (progress.complete && !progress.claimed) {
        claimIndex = 0;
        detailForm.button("§aClaim Reward");
    }

    detailForm.button("§a← Back", "textures/items/left_arrow.png");

    const detailRes = await detailForm.show(player);

    if (detailRes.canceled || detailRes.selection === undefined) return;

    if (claimIndex !== null && detailRes.selection === claimIndex) {
        attemptClaim(player, selectedQuest);
        openQuestCategoryMenu(player, category);
        return;
    }

    openQuestCategoryMenu(player, category);
}