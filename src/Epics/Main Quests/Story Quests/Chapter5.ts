import { Player, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { Backpack} from "../../Misc/backbag";
import { backpackConfig } from "../../../Letters/pokemon/backpackConfig";

// 🏟️ Chapter 5: Battling the Gym Leaders
export function openChapter5Menu(player: Player) {
  let stage = Number(player.getDynamicProperty("quest_chapter5_stage") ?? 0);

  // Track gyms beaten
  let gyms: string[] = [];
  try {
    gyms = JSON.parse(player.getDynamicProperty("quest_chapter5_gyms") as string ?? "[]");
  } catch {
    gyms = [];
  }

  const allGyms = ["rock", "dark", "dragon", "ice", "grass", "water", "flying", "fire"];
  const completed = allGyms.every(g => gyms.includes(g));

  // 🔄 Auto-complete if all gyms beaten but stage still 1
  if (stage === 1 && completed) {
    stage = 2;
    player.setDynamicProperty("quest_chapter5_stage", 2);
    player.sendMessage("§aYou’ve already defeated all 8 Gyms! Quest progressed to completion.");
  }

  const form = new ActionFormData().title("§cChapter 5: Battling the Gym Leaders");

  if (stage === 0) {
    form.body("§7Your next challenge: Defeat all 8 Gym Leaders!");
    form.button("§aTrack Quest");
  }
  else if (stage === 1) {
    let progressList = allGyms
      .map(g => `${gyms.includes(g) ? "§a✔" : "§c✖"} §7${g.charAt(0).toUpperCase() + g.slice(1)}`)
      .join("\n");

    form.body("§7Defeat all Gym Leaders:\n\n" + progressList);
    form.button("§7Check Progress");
  }
  else if (stage === 2) {
    form.body("§aChapter 5 complete!\nClick below to claim your reward.");
    form.button("§6Claim Rewards");
  }
  else {
    form.body("§7This chapter is complete!\nThe Elite Four await...");
    form.button("§7Done");
  }

  form.show(player).then((res) => {
    if (res.canceled) return;

    if (stage === 0 && res.selection === 0) {
      player.setDynamicProperty("quest_chapter5_stage", 1);
      player.sendMessage("§dQuest is now tracked! Defeat the Gym Leaders.");
    }

    if (stage === 1 && completed && res.selection === 0) {
      player.setDynamicProperty("quest_chapter5_stage", 2);
      player.sendMessage("§aAmazing! You’ve beaten all 8 Gyms!");
    }

    if (stage === 2 && res.selection === 0) {
      // 🎁 Rewards (Backpack-integrated)
      const backpack = new Backpack(player);
      const totals = new Map<string, number>();

      const rewards: [string, number][] = [
        ["pokeworld:masterball", 1],
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
      player.runCommand(`scoreboard players add @s Money 15000`);

      player.setDynamicProperty("quest_chapter5_stage", 3);
      player.sendMessage("§6You claimed your Chapter 5 rewards!");
    }
  });
}

// ==========================
// 🎯 Script Event Handlers
// ==========================

function markGymComplete(player: Player, gym: string) {
  let gyms: string[] = [];
  try {
    gyms = JSON.parse(player.getDynamicProperty("quest_chapter5_gyms") as string ?? "[]");
  } catch {
    gyms = [];
  }

  if (!gyms.includes(gym)) {
    gyms.push(gym);
    player.setDynamicProperty("quest_chapter5_gyms", JSON.stringify(gyms));
    player.sendMessage(`§b[Quest] §aYou defeated the ${gym} Gym Leader!`);
  }

  const allGyms = ["rock", "dark", "dragon", "ice", "grass", "water", "flying", "fire"];
  if (allGyms.every(g => gyms.includes(g))) {
    if (player.getDynamicProperty("quest_chapter5_stage") === 1) {
      player.setDynamicProperty("quest_chapter5_stage", 2);
      player.sendMessage("§aYou’ve completed all Gym challenges! Check Chapter 5 menu to finish.");
    }
  }
}

// Register scriptevent listeners
const gymList = ["rock", "dark", "dragon", "ice", "grass", "water", "flying", "fire"];
for (const gym of gymList) {
  system.afterEvents.scriptEventReceive.subscribe(ev => {
    if (ev.id === `pokeworld:quest_chapter5_${gym}` && ev.sourceEntity instanceof Player) {
      markGymComplete(ev.sourceEntity, gym);
    }
  });
}
