import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { readPokemon } from "../../Pokemon Database/main";
import { Backpack} from "../../Misc/backbag";
import { backpackConfig } from "../../../Letters/pokemon/backpackConfig";

// Chapter 6: Catch a Legendary Pokémon
export function openChapter6Menu(player: Player) {
  let stage = Number(player.getDynamicProperty("quest_chapter6_stage") ?? 0);

  // ✅ Authoritative legendary check (database-based, not dynamic props)
  const caughtArticuno = Object.keys(readPokemon(player, "Articuno", false)).length > 0;
  const caughtMoltres  = Object.keys(readPokemon(player, "Moltres", false)).length > 0;
  const caughtZapdos   = Object.keys(readPokemon(player, "Zapdos", false)).length > 0;
  const caughtMewtwo   = Object.keys(readPokemon(player, "Mewtwo", false)).length > 0;

  const hasAnyLegendary = caughtArticuno || caughtMoltres || caughtZapdos;

  const legendaryCaught =
    caughtArticuno ? "Articuno" :
    caughtMoltres  ? "Moltres"  :
    caughtZapdos   ? "Zapdos"   :
    caughtZapdos   ? "Mewtwo"   :
    "";

  // === Auto-completion check ===
  if (stage <= 1 && hasAnyLegendary) {
    stage = 2;
    player.setDynamicProperty("quest_chapter6_stage", 2);
  }

  const form = new ActionFormData().title("§5Chapter 6: The Legendary Challenge");

  if (stage === 0) {
    form.body(
      "§7Your next task is to catch a Legendary Pokémon!\n\n" +
      "Seek out one of the mythical beings roaming the world."
    );
    form.button("§aTrack Quest");
  }
  else if (stage === 1) {
    form.body(
      "§dYou have not caught a Legendary yet.\n" +
      "Defeat their trials and capture one to continue!"
    );
    form.button("§7Check Again");
  }
  else if (stage === 2) {
    form.body(
      `§aAmazing!\n` +
      `You caught a Legendary Pokémon: §f${legendaryCaught}\n\n` +
      `Click below to complete this step.`
    );
    form.button("§6Complete Quest");
  }
  else if (stage === 3) {
    form.body(
      "§aChapter 6 complete!\n" +
      "Click below to claim your reward."
    );
    form.button("§6Claim Rewards");
  }
  else {
    form.body(
      "§7This chapter is complete!\n" +
      "You’ve proven yourself among legends."
    );
    form.button("§7Done");
  }

  form.show(player).then((res) => {
    if (res.canceled) return;

    if (stage === 0 && res.selection === 0) {
      player.setDynamicProperty("quest_chapter6_stage", 1);
      player.sendMessage("§dQuest is now tracked! Catch a Legendary Pokémon.");
    }

    if (stage === 2 && res.selection === 0) {
      player.setDynamicProperty("quest_chapter6_stage", 3);
      player.sendMessage("§aGreat job! You’ve completed the Legendary challenge.");
    }

    if (stage === 3 && res.selection === 0) {
      // 🎁 Rewards (Backpack-integrated)
      const backpack = new Backpack(player);
      const totals = new Map<string, number>();

      const rewards: [string, number][] = [
        ["pokeworld:ultraball", 10],
        ["pokeworld:rare_candy", 10],
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
      player.runCommand(`scoreboard players add @s Money 10000`);

      player.setDynamicProperty("quest_chapter6_stage", 4);
      player.sendMessage("§6You claimed your Chapter 6 rewards!");
    }
  });
}
