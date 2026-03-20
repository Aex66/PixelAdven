import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { Backpack} from "../../Misc/backbag";
import { backpackConfig } from "../../../Letters/pokemon/backpackConfig";

export function openChapter1Menu(player: Player) {
  let stage = Number(player.getDynamicProperty("quest_chapter1_stage") ?? 0);

  // === Auto-completion checks ===
  if (stage === 0) {
    const starterGiven = player.getDynamicProperty("starter_received") === true;
    if (starterGiven) stage = 1;
  }
  if (stage === 1) {
    const starterGiven = player.getDynamicProperty("starter_received") === true;
    if (starterGiven) stage = 2;
  }
  if (stage === 2) {
    if (player.getDynamicProperty("talked_nurse_nico") === true) stage = 3;
  }
  if (stage === 3) {
    if (player.getDynamicProperty("bought_item") === true) stage = 4;
  }

  player.setDynamicProperty("quest_chapter1_stage", stage);

  // === UI Display ===
  const form = new ActionFormData().title("§bChapter 1: The Journey Begins");

  if (stage === 0) {
    form.body("§7Your story begins!\nVisit the Lab on the hill to collect your starter Pokémon.");
    form.button("§aTrack Quest");
  } else if (stage === 1) {
    form.body("§aYou collected your starter Pokémon!\nClick below to complete this step.");
    form.button("§6Complete Quest");
  } else if (stage === 2) {
    form.body("§bNext Step:\nTalk to Nurse Nico in the Pokémon Center at spawn.");
    form.button("§aTrack Quest");
  } else if (stage === 3) {
    form.body("§eNext Step:\nVisit the PokéMart and buy any item.");
    form.button("§aTrack Quest");
  } else if (stage === 4) {
    form.body("§aYou’ve completed this chapter!\nClick below to claim your reward.");
    form.button("§6Claim Rewards");
  } else {
    form.body("§7This chapter is complete!");
    form.button("§7Done");
  }

  form.show(player).then((res) => {
    if (res.canceled) return;

    // === Stage 0 ===
    if (stage === 0 && res.selection === 0) {
      player.sendMessage("§dQuest is now tracked! Head to the Lab.");
    }

    // === Stage 1 Rewards ===
    if (stage === 1 && res.selection === 0) {
      player.setDynamicProperty("quest_chapter1_stage", 2);

      const backpack = new Backpack(player);
      const totals = new Map<string, number>();

      const rewards: [string, number][] = [
        ["pokeworld:rare_candy", 3],
        ["pokeworld:pokeball", 10],
      ];

      for (const [item, count] of rewards) {
        let category: string | null = null;

        for (const cat of Object.keys(backpackConfig)) {
          if (backpackConfig[cat].some(i => i.id === item)) {
            category = cat;
            break;
          }
        }

        if (category) {
          backpack.addItem(category, item, count);
        } else {
          player.runCommand(`give @s ${item} ${count}`);
        }

        totals.set(item, (totals.get(item) ?? 0) + count);
      }

      backpack.save();

      const lines = [...totals.entries()]
        .map(([id, qty]) => {
          let name = id.replace("pokeworld:", "");
          for (const cat of Object.values(backpackConfig)) {
            const found = cat.find(i => i.id === id);
            if (found) {
              name = found.displayName;
              break;
            }
          }
          return `§7• §f${name} §7x§f${qty}`;
        })
        .join("\n");

      player.sendMessage(`§aQuest Rewards:\n${lines}`);
      player.sendMessage("§dCongratulations! You’ve completed the first step!");
    }

    // === Stage 4 Rewards ===
    if (stage === 4 && res.selection === 0) {
      const backpack = new Backpack(player);
      const totals = new Map<string, number>();

      const rewards: [string, number][] = [
        ["pokeworld:rare_candy", 5],
        ["pokeworld:greatball", 10],
      ];

      for (const [item, count] of rewards) {
        let category: string | null = null;

        for (const cat of Object.keys(backpackConfig)) {
          if (backpackConfig[cat].some(i => i.id === item)) {
            category = cat;
            break;
          }
        }

        if (category) {
          backpack.addItem(category, item, count);
        } else {
          player.runCommand(`give @s ${item} ${count}`);
        }

        totals.set(item, (totals.get(item) ?? 0) + count);
      }

      backpack.save();

      const lines = [...totals.entries()]
        .map(([id, qty]) => {
          let name = id.replace("pokeworld:", "");
          for (const cat of Object.values(backpackConfig)) {
            const found = cat.find(i => i.id === id);
            if (found) {
              name = found.displayName;
              break;
            }
          }
          return `§7• §f${name} §7x§f${qty}`;
        })
        .join("\n");

      player.sendMessage(`§aChapter Rewards:\n${lines}`);
      player.setDynamicProperty("quest_chapter1_stage", 5);
      player.sendMessage("§6You Completed Chapter 1. Proceed to Chapter 2 when ready!");
    }
  });
}



