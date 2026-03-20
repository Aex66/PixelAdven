import { Player, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { Backpack} from "../../Misc/backbag";
import { backpackConfig } from "../../../Letters/pokemon/backpackConfig";

const eliteFour = ["electric", "fighting", "psychic", "steel", "champion"];

// 🏆 Chapter 7: Battle the Elite Four
export function openChapter7Menu(player: Player) {
  let stage = Number(player.getDynamicProperty("quest_chapter7_stage") ?? 0);

  // Track progress for each Elite Four battle
  const beaten: Record<string, boolean> = {};
  for (const e of eliteFour) {
    beaten[e] = player.getDynamicProperty(`elite4_${e}_beaten`) === true;
  }

  // === Auto-complete if all are beaten ===
  if (stage === 1 && eliteFour.every(e => beaten[e])) {
    stage = 2;
    player.setDynamicProperty("quest_chapter7_stage", stage);
  }

  const form = new ActionFormData().title("§dChapter 7: The Elite Four Challenge");

  if (stage === 0) {
    form.body(
      "§7Your final trial before becoming Champion!\nDefeat the Elite Four in order:\n\n" +
      "⚡ Electric Master\n" +
      "🥊 Fighting Expert\n" +
      "🔮 Psychic Sage\n" +
      "⚙️ Steel Strategist\n" +
      "👑 Champion with no set type"
    );
    form.button("§aTrack Quest");
  }
  else if (stage === 1) {
    let status = "§eElite Four Progress:\n";
    status += `⚡ Electric: ${beaten.electric ? "§a✔" : "§c✖"}\n`;
    status += `🥊 Fighting: ${beaten.fighting ? "§a✔" : "§c✖"}\n`;
    status += `🔮 Psychic: ${beaten.psychic ? "§a✔" : "§c✖"}\n`;
    status += `⚙️ Steel: ${beaten.steel ? "§a✔" : "§c✖"}\n`;
    status += `👑 Champion: ${beaten.champion ? "§a✔" : "§c✖"}\n`;

    form.body(status + "\nDefeat all Elite Four members to complete this challenge!");
    form.button("§7Check Again");
  }
  else if (stage === 2) {
    form.body("§aYou’ve conquered the Elite Four!\nClick below to complete this chapter.");
    form.button("§6Complete Quest");
  }
  else if (stage === 3) {
    form.body("§aChapter 7 complete!\nClick below to claim your rewards.");
    form.button("§6Claim Rewards");
  }
  else {
    form.body("§7This chapter is complete!\nYou are now recognized as a Champion!");
    form.button("§7Done");
  }

  form.show(player).then((res) => {
    if (res.canceled) return;

    if (stage === 0 && res.selection === 0) {
      player.setDynamicProperty("quest_chapter7_stage", 1);
      player.sendMessage("§dQuest is now tracked! Defeat the Elite Four.");
    }

    if (stage === 2 && res.selection === 0) {
      player.setDynamicProperty("quest_chapter7_stage", 3);
      player.sendMessage("§aIncredible! You’ve bested the Elite Four!");
    }

    if (stage === 3 && res.selection === 0) {
      // 🎁 Rewards (Backpack-integrated)
      const backpack = new Backpack(player);
      const totals = new Map<string, number>();

      const rewards: [string, number][] = [
        ["pokeworld:masterball", 1],
        ["pokeworld:rare_candy", 20],
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
      player.runCommand(`scoreboard players add @s Money 25000`);

      player.setDynamicProperty("quest_chapter7_stage", 4);
      player.sendMessage("§6You claimed your Chapter 7 rewards!");
    }
  });
}

// 🏷️ Called from mcfunctions after each Elite Four win
export function markEliteFourBeaten(player: Player, type: string) {
  if (!eliteFour.includes(type)) return;

  player.setDynamicProperty(`elite4_${type}_beaten`, true);

  const allBeaten = eliteFour.every(
    e => player.getDynamicProperty(`elite4_${e}_beaten`) === true
  );

  if (allBeaten && Number(player.getDynamicProperty("quest_chapter7_stage") ?? 0) === 1) {
    player.setDynamicProperty("quest_chapter7_stage", 2);
    player.sendMessage("§bAll Elite Four members defeated! Return to the quest menu to finalize.");
  }
}

system.afterEvents.scriptEventReceive.subscribe(ev => {
  if (!(ev.sourceEntity instanceof Player)) return;

  for (const e of eliteFour) {
    if (ev.id === `pokeworld:quest_chapter7_${e}`) {
      markEliteFourBeaten(ev.sourceEntity, e);
      break;
    }
  }
});
