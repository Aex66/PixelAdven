import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { Backpack} from "../../Misc/backbag";
import { backpackConfig } from "../../../Letters/pokemon/backpackConfig";

// Chapter 4: Learn to Fish
export function openChapter4Menu(player: Player) {
  let stage = Number(player.getDynamicProperty("quest_chapter4_stage") ?? 0);

  // 🔹 Load fishing data
  let fishingProgress;
  try {
    fishingProgress = JSON.parse(player.getDynamicProperty("fishing_progress") as string ?? "{}");
  } catch {
    fishingProgress = { progress: { old: 0 }, catchStreak: 0 };
  }

  let fishingData;
  try {
    fishingData = JSON.parse(player.getDynamicProperty("fishing_data") as string ?? "{}");
  } catch {
    fishingData = { rods: [] };
  }

  const hasOldRod = fishingData.rods?.includes("old");
  const oldRodProgress = fishingProgress.progress?.old ?? 0;
  const oldRodLevel = Math.floor(oldRodProgress / 25);

  // 🏆 Auto-complete Chapter 4 if already done
  if (oldRodLevel >= 1 && stage < 4) {
    player.setDynamicProperty("quest_chapter4_stage", 4);
    player.sendMessage("§aYou’ve already gotten the hang of fishing — Chapter 4 completed automatically!");

    // 🎁 Auto-granted rewards (Backpack-integrated)
    const backpack = new Backpack(player);
    const totals = new Map<string, number>();

    const rewards: [string, number][] = [
      ["pokeworld:greatball", 10],
      ["pokeworld:ultraball", 5],
      ["pokeworld:rare_candy", 5],
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
    player.runCommand(`scoreboard players add @s Money 7500`);
    return;
  }

  // 🔄 Auto-skip logic
  if (stage === 1 && hasOldRod) {
    stage = 2;
    player.setDynamicProperty("quest_chapter4_stage", 2);
    player.sendMessage("§aYou already have the Old Rod — skipping ahead!");
  }
  if (stage === 2 && oldRodLevel >= 1) {
    stage = 3;
    player.setDynamicProperty("quest_chapter4_stage", 3);
    player.sendMessage("§aYou already leveled your Old Rod — skipping to rewards!");
  }

  const form = new ActionFormData().title("§aChapter 4: Learn to Fish");

  if (stage === 0) {
    form.body("§7Your next task is to learn how to fish!\n\nFind the §bFishing Guru§7 and claim your Old Rod.");
    form.button("§aTrack Quest");
  }
  else if (stage === 1) {
    form.body("§7Talk to the Fishing Guru to get your Old Rod.\n(Already owning one will auto-skip.)");
    form.button("§7Check Progress");
  }
  else if (stage === 2) {
    form.body("§7Level up your Old Rod by catching Pokémon.\n\n§cKeep fishing until it levels up!");
    form.button("§7Check Again");
  }
  else if (stage === 3) {
    form.body("§aChapter 4 complete!\nClick below to claim your reward.");
    form.button("§6Claim Rewards");
  }
  else {
    form.body("§7This chapter is complete!\nYour journey continues...");
    form.button("§7Done");
  }

  form.show(player).then((res) => {
    if (res.canceled) return;

    if (stage === 0 && res.selection === 0) {
      player.setDynamicProperty("quest_chapter4_stage", 1);
      player.sendMessage("§dQuest is now tracked! Visit the Fishing Guru.");
    }

    if (stage === 3 && res.selection === 0) {
      // 🎁 Rewards (Backpack-integrated)
      const backpack = new Backpack(player);
      const totals = new Map<string, number>();

      const rewards: [string, number][] = [
        ["pokeworld:greatball", 10],
        ["pokeworld:ultraball", 5],
        ["pokeworld:rare_candy", 5],
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
      player.runCommand(`scoreboard players add @s Money 7500`);

      player.setDynamicProperty("quest_chapter4_stage", 4);
      player.sendMessage("§6You claimed your Chapter 4 rewards!");
    }
  });
}
