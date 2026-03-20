import { Player, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { Backpack} from "../../Misc/backbag";
import { backpackConfig } from "../../../Letters/pokemon/backpackConfig";

// Chapter 2: Catch Your First Pokémon
export function openChapter2Menu(player: Player) {
  let stage = Number(player.getDynamicProperty("quest_chapter2_stage") ?? 0);
  const caught = world.scoreboard.getObjective("pcatch")?.getScore(player) ?? 0;

  // === Auto-completion checks ===
  if (stage === 1 && caught >= 1) {
    stage = 2;
    player.setDynamicProperty("quest_chapter2_stage", stage);
  }

  const form = new ActionFormData().title("§aChapter 2: Catch Your First Pokémon");

  if (stage === 0) {
    form.body("§7Your next task is to catch your very first Pokémon!\n\nHead into the wild and use Poké Balls to catch one.");
    form.button("§aTrack Quest");
  } 
  else if (stage === 1) {
    if (caught >= 1) {
      form.body("§aYou’ve caught your first Pokémon!\nClick below to complete this step.");
      form.button("§6Complete Quest");
    } else {
      form.body("§cYou haven’t caught a Pokémon yet.\nGo out and catch one to continue!");
      form.button("§7Check Again");
    }
  } 
  else if (stage === 2) {
    form.body("§aChapter 2 complete!\nClick below to claim your reward.");
    form.button("§6Claim Rewards");
  } 
  else {
    form.body("§7This chapter is complete!\nYour journey continues...");
    form.button("§7Done");
  }

  form.show(player).then((res) => {
    if (res.canceled) return;

    if (stage === 0 && res.selection === 0) {
      player.setDynamicProperty("quest_chapter2_stage", 1);
      player.sendMessage("§dQuest is now tracked! Catch your first Pokémon.");
    }

    if (stage === 1 && caught >= 1 && res.selection === 0) {
      player.setDynamicProperty("quest_chapter2_stage", 2);
      player.sendMessage("§aGreat job! You’ve caught your first Pokémon!");
    }

    if (stage === 2 && res.selection === 0) {
      // 🎁 Rewards (Backpack-integrated)
      const backpack = new Backpack(player);
      const totals = new Map<string, number>();

      const rewards: [string, number][] = [
        ["pokeworld:greatball", 5],
        ["pokeworld:rare_candy", 3],
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
      player.runCommand(`scoreboard players add @s Money 2500`);

      player.setDynamicProperty("quest_chapter2_stage", 3);
      player.sendMessage("§6You have completed Chapter 2! Rewards claimed. Proceed to Chapter 3.");
    }
  });
}
