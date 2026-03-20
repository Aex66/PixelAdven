import { world, Player, ItemStack } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
import { readPokemon } from "../../Pokemon Database/main";
import { progressLegendaryCatch } from "./legendaryQuestUtils";

const relicKeys = ["root_fragment", "leaf_shard", "ancient_amber"];
const ruinFlags = ["mew_ruin_1", "mew_ruin_2", "mew_ruin_3"];
const dnaKeys = ["unstable_cell", "memory_fluid", "pure_dna"];

const dropSources: Record<string, string> = {
  "pokeworld:wild_parasect": "pokeworld:root_fragment",
  "pokeworld:wild_tropius": "pokeworld:leaf_shard",
  "pokeworld:wild_breloom": "pokeworld:ancient_amber",
  "pokeworld:wild_ditto": "pokeworld:unstable_cell",
  "pokeworld:wild_zangoose": "pokeworld:memory_fluid",
  "pokeworld:wild_smeargle": "pokeworld:pure_dna"
};

// 🔧 Shared removal helper (same pattern as Zapdos / Mewtwo)
function removeRelicItems(player: Player, itemIds: string[]) {
  const inv = player.getComponent("inventory")?.container;
  if (!inv) return;

  for (let i = 0; i < inv.size; i++) {
    const item = inv.getItem(i);
    if (!item) continue;

    const key = item.typeId.split(":")[1];
    if (itemIds.includes(key)) {
      inv.setItem(i, undefined);
    }
  }
}

// ================== DROP LOGIC ==================
export function runMewDropLogic(player: Player, typeId: string) {
  const stage = player.getDynamicProperty("quest_mew_stage");
  if (typeof stage !== "number") return;

  const itemId = dropSources[typeId];
  if (!itemId) return;

  const key = itemId.split(":")[1];
  if (player.getDynamicProperty(`mew_${key}`) === true) return;
  if (Math.random() > 0.25) return;

  const inv = player.getComponent("inventory")?.container;
  inv?.addItem(new ItemStack(itemId, 1));
  player.sendMessage(`§dYou obtained a §f${key.replace(/_/g, " ")}§d!`);
  player.setDynamicProperty(`mew_${key}`, true);

  if (stage === 1 && relicKeys.every(k => player.getDynamicProperty(`mew_${k}`) === true)) {
    player.setDynamicProperty("quest_mew_stage", 2);
    player.sendMessage("§dYou've recovered the jungle relics. Now find the ancient ruins.");
  }

  if (stage === 3 && dnaKeys.every(k => player.getDynamicProperty(`mew_${k}`) === true)) {
    player.setDynamicProperty("quest_mew_stage", 4);
    player.sendMessage("§dYou’ve collected enough DNA components. Return to the researcher.");
  }
}

// ================== RUINS ==================
export function visitMewRuin(player: Player, ruinIndex: number) {
  const stage = player.getDynamicProperty("quest_mew_stage");
  if (stage !== 2 || ruinIndex < 1 || ruinIndex > 3) return;

  const flag = `mew_ruin_${ruinIndex}`;
  if (player.getDynamicProperty(flag) === true) return;

  player.setDynamicProperty(flag, true);
  player.sendMessage("§dYou investigated a jungle ruin.");

  if (ruinFlags.every(f => player.getDynamicProperty(f) === true)) {
    player.setDynamicProperty("quest_mew_stage", 3);
    player.sendMessage("§dYou’ve visited all the ruins. Seek rare Pokémon for DNA samples.");
  }
}

// ================== NPC ==================
export function handleMewNPC(player: Player) {
  const chapter6 = Number(player.getDynamicProperty("quest_chapter6_stage") ?? 0);
  if (chapter6 < 1) {
    player.sendMessage("§cYou must begin §5Story Quest – Chapter 6§c before starting the Mew quest!");
    return;
  }

  const stage = Number(player.getDynamicProperty("quest_mew_stage") ?? 0);
  const hasCaught = Object.keys(readPokemon(player, "Mew", false)).length > 0;
  const summoned = player.getDynamicProperty("quest_mew_summoned") === true;

  const form = new ActionFormData().title("§dMew Quest");
  let responseMap: string[] = [];

  if (hasCaught && stage >= 6) {
    form.body("§dYou've already caught Mew. To challenge it again, you must complete the quest again.");
    form.button("§7No thanks");
    form.button("§cRestart Quest");
    responseMap = ["no", "reset"];
  } else if (summoned) {
    form.body("§dYou failed to catch Mew. You are eligible for one retry.");
    form.button("§6Retry Summon");
    responseMap = ["retry"];
  } else {
    switch (stage) {
      case 0:
        form.body("§7Recover three relic fragments from jungle Pokémon.");
        form.button("§aBegin Quest");
        responseMap = ["start"];
        break;
      case 1:
        form.body("§dCollect: Root Fragment, Leaf Shard, Ancient Amber");
        form.button("§eTrack Progress");
        responseMap = ["progress"];
        break;
      case 2:
        form.body("§dVisit the three ancient ruins in the jungle.");
        form.button("§aOn it!");
        responseMap = ["ruins"];
        break;
      case 3:
        form.body("§dCollect DNA samples from jungle Pokémon.");
        form.button("§aSearch DNA");
        responseMap = ["dna"];
        break;
      case 4:
        form.body("§dExchange DNA for the Mystic Orb.");
        form.button("§aExchange DNA");
        responseMap = ["exchange"];
        break;
      case 5:
        form.body("§dUse the Mystic Orb at the shrine to summon Mew.");
        form.button("§dTo the shrine!");
        responseMap = ["go"];
        break;
      case 6:
        form.body("§aYou caught Mew! A mythical bond has formed.");
        form.button("§fThank you");
        responseMap = ["done"];
        break;
      default:
        form.body("§cUnknown quest stage.");
        form.button("OK");
        responseMap = ["error"];
    }
  }

  form.show(player).then(res => {
    if (res.canceled) return;
    const choice = responseMap[res.selection];
    const inv = player.getComponent("inventory")?.container;

    switch (choice) {
      case "reset":
        player.setDynamicProperty("quest_mew_stage", 0);
        player.setDynamicProperty("quest_mew_summoned", false);
        for (const k of [...relicKeys, ...ruinFlags, ...dnaKeys]) {
          player.setDynamicProperty(`mew_${k}`, false);
        }
        player.sendMessage("§dThe Mew quest has been reset.");
        break;

      case "retry": {
        if (!inv) return;

        let hasOrb = false;
        for (let i = 0; i < inv.size; i++) {
          if (inv.getItem(i)?.typeId === "pokeworld:mystic_orb") {
            hasOrb = true;
            break;
          }
        }

        if (!hasOrb) {
          inv.addItem(new ItemStack("pokeworld:mystic_orb", 1));
          player.sendMessage("§dHere’s another Mystic Orb.");
        } else {
          player.sendMessage("§7You already have a Mystic Orb.");
        }

        player.setDynamicProperty("quest_mew_summoned", false);
        break;
      }

      case "start":
        player.setDynamicProperty("quest_mew_stage", 1);
        player.sendMessage("§dThe relic hunt begins!");
        break;

      case "exchange": {
        if (!inv) return;

        // 🔥 CONSUME DNA ONCE
        removeRelicItems(player, dnaKeys);

        // 🎁 GIVE ORB
        inv.addItem(new ItemStack("pokeworld:mystic_orb", 1));

        // ➡️ ADVANCE QUEST
        player.setDynamicProperty("quest_mew_stage", 5);

        player.sendMessage("§dDNA consumed. You received the Mystic Orb.");
        break;
      }

      case "done":
        player.setDynamicProperty("quest_mew_stage", 7);
        player.sendMessage("§dMew has joined your journey!");
        progressLegendaryCatch(player, "Mew");
        break;
    }
  });
}
