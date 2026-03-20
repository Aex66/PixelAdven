import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { openChapter1Menu } from "./Chapter1";
import { openChapter2Menu } from "./Chapter2";
import { openChapter3Menu } from "./Chapter3";
import { openChapter4Menu } from "./Chapter4";
import { openChapter5Menu } from "./Chapter5";
import { openChapter6Menu } from "./Chapter6";
import { openChapter7Menu } from "./Chapter7";
import { openStoryQuestTracker } from "../questMain";
// 🧭 Story Quest Menu Hub
export function openStoryQuestMenu(player: Player) {
  const form = new ActionFormData()
    .title("§dStory Quests")
    .body("Select a chapter to continue your journey:");

  type Entry = {
    id: string;
    title: string;
    open: () => void;
    completedStage: number;
  };

  const entries: Entry[] = [];

  const chapter1Stage = Number(player.getDynamicProperty("quest_chapter1_stage") ?? 0);
  entries.push({
    id: "chapter1",
    title: "§bChapter 1: The Journey Begins",
    open: () => openChapter1Menu(player),
    completedStage: 5
  });

  if (chapter1Stage >= 5) {
    const chapter2Stage = Number(player.getDynamicProperty("quest_chapter2_stage") ?? 0);
    entries.push({
      id: "chapter2",
      title: "§aChapter 2: Your First Catch",
      open: () => openChapter2Menu(player),
      completedStage: 3
    });

    if (chapter2Stage >= 3) {
      const chapter3Stage = Number(player.getDynamicProperty("quest_chapter3_stage") ?? 0);
      entries.push({
        id: "chapter3",
        title: "§aChapter 3: Catch a Full Team of Pokémon",
        open: () => openChapter3Menu(player),
        completedStage: 3
      });

      if (chapter3Stage >= 3) {
        const chapter4Stage = Number(player.getDynamicProperty("quest_chapter4_stage") ?? 0);
        entries.push({
          id: "chapter4",
          title: "§aChapter 4: Learn to Fish",
          open: () => openChapter4Menu(player),
          completedStage: 4
        });

        if (chapter4Stage >= 4) {
          const chapter5Stage = Number(player.getDynamicProperty("quest_chapter5_stage") ?? 0);
          entries.push({
            id: "chapter5",
            title: "§aChapter 5: Battling the Gym Leaders",
            open: () => openChapter5Menu(player),
            completedStage: 3
          });

          if (chapter5Stage >= 3) {
            const chapter6Stage = Number(player.getDynamicProperty("quest_chapter6_stage") ?? 0);
            entries.push({
              id: "chapter6",
              title: "§aChapter 6: The Legendary Challenge",
              open: () => openChapter6Menu(player),
              completedStage: 4
            });

            if (chapter6Stage >= 4) {
              entries.push({
                id: "chapter7",
                title: "§aChapter 7: The Elite Four Challenge",
                open: () => openChapter7Menu(player),
                completedStage: 4
              });
            }
          }
        }
      }
    }
  }

  // Build buttons
  for (const e of entries) {
    form.button(e.title);

    const stage = Number(player.getDynamicProperty(`quest_${e.id}_stage`) ?? 0);
    if (stage < e.completedStage) {
      form.button("§9📘 View Current Objective");
    }
  }

  form.show(player).then(res => {
    if (res.canceled) return;

    let buttonIndex = 0;

    for (const e of entries) {
      // Play button
      if (res.selection === buttonIndex++) {
        e.open();
        return;
      }

      // Tracker button (only if shown)
      const stage = Number(player.getDynamicProperty(`quest_${e.id}_stage`) ?? 0);
      if (stage < e.completedStage) {
        if (res.selection === buttonIndex++) {
          openStoryQuestTracker(player, e.id, e.title);
          return;
        }
      }
    }
  });
}