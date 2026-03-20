import { world, Player, ItemStack, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { readPokemon } from "../../Pokemon Database/main";
import { progressLegendaryCatch } from "./legendaryQuestUtils";

const dropSources: Record<string, string> = {
  "pokeworld:wild_magneton": "pokeworld:plasma_node",
  "pokeworld:wild_porygon": "pokeworld:glitched_drive",
  "pokeworld:wild_beldum": "pokeworld:mind_core"
};
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

const allDropKeys = ["glitched_drive", "plasma_node", "mind_core"];
const DOWNLOAD_DURATION = 600_000; // 10 minutes in milliseconds

// ================== DROP LOGIC ==================
export function runMewtwoDropLogic(player: Player, typeId: string) {
  const stage = Number(player.getDynamicProperty("quest_mewtwo_stage") ?? 0);
  if (stage !== 2) return;

  const itemId = dropSources[typeId];
  if (!itemId) return;

  const key = itemId.split(":")[1];
  if (player.getDynamicProperty(`mewtwo_${key}`) === true) return;

  if (Math.random() > 0.25) return;

  const inv = player.getComponent("inventory")?.container;
  if (inv) {
    inv.addItem(new ItemStack(itemId, 1));
    player.sendMessage(`§eYou obtained a §f${key.replace(/_/g, " ")}§e!`);
  }

  player.setDynamicProperty(`mewtwo_${key}`, true);

  const gotAll = allDropKeys.every(k => player.getDynamicProperty(`mewtwo_${k}`) === true);
  if (gotAll) {
    player.setDynamicProperty("quest_mewtwo_stage", 3);
    player.sendMessage("§dAll components acquired. Return to the scientist.");
  }
}

// ================== EVENT HOOKS ==================
world.afterEvents.entityHitEntity.subscribe(({ damagingEntity, hitEntity }) => {
  if (!(damagingEntity instanceof Player)) return;

  const id = hitEntity.typeId;

  if (id === "pokeworld:terminal_1") handleTerminalInteraction(damagingEntity, "1");
  else if (id === "pokeworld:terminal_2") handleTerminalInteraction(damagingEntity, "2");
  else if (id === "pokeworld:terminal_3") handleTerminalInteraction(damagingEntity, "3");
  else if (id === "pokeworld:rogue_scientist") handleMewtwoNPC(damagingEntity);
  else if (id === "pokeworld:shrine_mewtwo") handleMewtwoShrine(damagingEntity);
});

// ================== TERMINAL LOGIC ==================
function handleTerminalInteraction(player: Player, num: "1" | "2" | "3") {
  const stage = Number(player.getDynamicProperty("quest_mewtwo_stage") ?? 0);
  if (stage !== 1) return;

  const dataKey = `mewtwo_terminal_${num}_start`;
  const doneKey = `mewtwo_terminal_${num}_done`;
  const claimedKey = `mewtwo_terminal_${num}_claimed`;

  const startTime = Number(player.getDynamicProperty(dataKey) ?? 0);
  const now = Date.now();
  const isDone = player.getDynamicProperty(doneKey) === true;
  const isClaimed = player.getDynamicProperty(claimedKey) === true;

  // Already claimed — terminal is dead
  if (isClaimed) {
    player.sendMessage("§cThis terminal has crashed and is no longer accessible.");
    return;
  }

  // Download finished but not claimed yet → show claim menu
  if (isDone && !isClaimed) {
    const form = new ActionFormData()
      .title(`§bResearch Terminal ${num}`)
      .body("§aDownload complete. Data ready for retrieval.\n\n§eWould you like to extract the data drive?")
      .button("§aClaim Data Drive")
      .button("§cCancel");

    form.show(player).then(res => {
      if (res.canceled || res.selection === 1) return;

      // Give item and finalize
      const inv = player.getComponent("inventory")?.container;
      inv?.addItem(new ItemStack(`pokeworld:data_drive${num}`, 1));

      player.setDynamicProperty(claimedKey, true);
      player.sendMessage(`§aYou retrieved §fData Drive ${num}§a from the terminal.`);

      // Check if all three have been claimed
      const allClaimed =
        player.getDynamicProperty("mewtwo_terminal_1_claimed") === true &&
        player.getDynamicProperty("mewtwo_terminal_2_claimed") === true &&
        player.getDynamicProperty("mewtwo_terminal_3_claimed") === true;

      if (allClaimed) {
        player.setDynamicProperty("quest_mewtwo_stage", 2);
        player.sendMessage("§dAll Data Drives acquired. Return to the scientist.");
      }
    });
    return;
  }

  // Download in progress
  if (startTime > 0 && !isDone) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / DOWNLOAD_DURATION, 1);
    const bar = makeProgressBar(progress);

    const form = new ActionFormData()
      .title(`§bResearch Terminal ${num}`)
      .body(
        `§7Download in progress...\n${bar}\n§e${Math.floor(progress * 100)}%\n\n§8You can close this menu and check back later.`
      )
      .button("§cClose");

    form.show(player).then(() => {
      if (progress >= 1) {
        player.setDynamicProperty(doneKey, true);
        player.setDynamicProperty(dataKey, 0);
        player.sendMessage(`§aDownload from Terminal ${num} complete. Return here to retrieve the data drive.`);
      }
    });
    return;
  }

  // No download yet — offer to start
  const form = new ActionFormData()
    .title(`§bResearch Terminal ${num}`)
    .body("§7Accessing terminal logs...\n§fRecovered partial data cache.\n\n§eBegin data download?")
    .button("§aBegin Download")
    .button("§cCancel");

  form.show(player).then(res => {
    if (res.canceled || res.selection === 1) return;

    player.setDynamicProperty(dataKey, now);
    player.sendMessage(`§bData download from Terminal ${num} initiated. This will take 10 minutes.`);
    player.sendMessage("§7You may close this menu and check back later.");

    system.runTimeout(() => {
      const stillStarted = Number(player.getDynamicProperty(dataKey) ?? 0) === now;
      const alreadyDone = player.getDynamicProperty(doneKey) === true;
      if (stillStarted && !alreadyDone) {
        player.setDynamicProperty(doneKey, true);
        player.setDynamicProperty(dataKey, 0);
        player.sendMessage(`§aDownload from Terminal ${num} complete. Return here to retrieve the data drive.`);
      }
    }, Math.ceil(DOWNLOAD_DURATION / 50));
  });
}

function completeDownload(player: Player, num: "1" | "2" | "3") {
  const doneKey = `mewtwo_terminal_${num}_done`;
  const dataKey = `mewtwo_terminal_${num}_start`;
  const inv = player.getComponent("inventory")?.container;

  player.setDynamicProperty(doneKey, true);
  player.setDynamicProperty(dataKey, 0);

  inv?.addItem(new ItemStack(`pokeworld:data_drive_${num}`, 1));
  player.sendMessage(`§aDownload from Terminal ${num} complete. You obtained §fData Drive ${num}§a.`);

  // Check if all drives are done
  const allDone =
    player.getDynamicProperty("mewtwo_terminal_1_done") === true &&
    player.getDynamicProperty("mewtwo_terminal_2_done") === true &&
    player.getDynamicProperty("mewtwo_terminal_3_done") === true;

  if (allDone) {
    player.setDynamicProperty("quest_mewtwo_stage", 2);
    player.sendMessage("§dAll Data Drives acquired. Return to the scientist.");
  }
}

// Helper: progress bar display
function makeProgressBar(progress: number): string {
  const totalBars = 20;
  const filled = Math.floor(progress * totalBars);
  const empty = totalBars - filled;
  return `§a${"█".repeat(filled)}§7${"░".repeat(empty)}`;
}

// ================== NPC LOGIC ==================
function handleMewtwoNPC(player: Player) {
  // --- CHAPTER 6 GATEKEEPER ---
  const chapter6 = Number(player.getDynamicProperty("quest_chapter6_stage") ?? 0);
  if (chapter6 < 1) {
    player.sendMessage("§cYou must begin §5Story Quest – Chapter 6§c before starting the Articuno quest!");
    return;
  }
  // --- END GATEKEEPER ---

  const stage = Number(player.getDynamicProperty("quest_mewtwo_stage") ?? 0);
  const hasCaught = Object.keys(readPokemon(player, "Mewtwo", false)).length > 0;
  const summoned = player.getDynamicProperty("quest_mewtwo_summoned") === true;

  const form = new ActionFormData().title("§dProject Genesis");
  let responseMap: string[] = [];

  switch (true) {
    case hasCaught && stage >= 6:
      form.body("§dYou've already caught Mewtwo. To challenge it again, you must complete the quest again.");
      form.button("§7No thanks");
      form.button("§cRestart Quest");
      responseMap = ["no", "reset"];
      break;

    case summoned:
      form.body("§dYou failed to catch Mewtwo. You are eligible for one retry.");
      form.button("§6Retry Summon");
      responseMap = ["retry"];
      break;

    default:
      switch (stage) {
        case 0:
          form.body("§7Recover data from 3 research terminals.");
          form.button("§aBegin Quest");
          responseMap = ["start"];
          break;

        case 1:
          form.body("§bDownload data from Terminals 1–3.");
          form.button("§eTrack Progress");
          responseMap = ["progress"];
          break;

        case 2:
          form.body("§dDefeat A.I. Pokémon to collect core components.");
          form.button("§eCheck Drops");
          responseMap = ["drops"];
          break;

        case 3:
          form.body("§aExchange your components for the Clone Stabilizer.");
          form.button("§fExchange Items");
          responseMap = ["exchange"];
          break;

        case 4:
          form.body("§dUse the Clone Stabilizer at the Mewtwo shrine.");
          form.button("§cPrepare for Battle");
          responseMap = ["ready"];
          break;

        case 5:
          form.body("§dMewtwo awaits at the shrine...");
          form.button("§cEngage Battle");
          responseMap = ["summon"];
          break;

        case 6:
          form.body("§aYou caught Mewtwo! Your legend grows.");
          form.button("§dThank you");
          responseMap = ["done"];
          break;

        default:
          form.body("§cUnknown stage. Contact staff.");
          form.button("§cClose");
          responseMap = ["error"];
          break;
      }
      break;
  }

  form.show(player).then(res => {
    if (res.canceled) return;

    const choice = responseMap[res.selection];
    const inv = player.getComponent("inventory")?.container;

    switch (choice) {
      case "reset":
        player.setDynamicProperty("quest_mewtwo_stage", 0);
        player.setDynamicProperty("quest_mewtwo_summoned", false);
        for (const key of allDropKeys) {
          player.setDynamicProperty(`mewtwo_${key}`, false);
        }
        player.sendMessage("§dThe Mewtwo quest has been reset. Speak to the NPC to begin.");
        break;

      case "retry": {
        if (!inv) return;

        let hasStabilizer = false;
        for (let i = 0; i < inv.size; i++) {
          const item = inv.getItem(i);
          if (item?.typeId === "pokeworld:clone_stabilizer") {
            hasStabilizer = true;
            break;
          }
        }

        if (!hasStabilizer) {
          inv.addItem(new ItemStack("pokeworld:clone_stabilizer", 1));
          player.sendMessage("§dHere’s another Clone Stabilizer.");
        } else {
          player.sendMessage("§7You already have a Clone Stabilizer.");
        }

        player.setDynamicProperty("quest_mewtwo_summoned", false);
        break;
      }

      case "start":
        player.setDynamicProperty("quest_mewtwo_stage", 1);
        player.sendMessage("§dQuest started: Recover the 3 Data Drives from research terminals.");
        break;

      case "exchange": {
        if (!inv) return;

        // 🔥 CONSUME COMPONENTS (ONCE)
        removeRelicItems(player, allDropKeys);

        // 🎁 GIVE STABILIZER
        inv.addItem(new ItemStack("pokeworld:clone_stabilizer", 1));

        // ➡️ ADVANCE QUEST
        player.setDynamicProperty("quest_mewtwo_stage", 4);

        player.sendMessage("§dComponents consumed. You received a Clone Stabilizer.");
        break;
      }

      case "done":
        player.setDynamicProperty("quest_mewtwo_stage", 7);
        player.sendMessage("§dMewtwo has joined your journey!");
        player.setDynamicProperty("quest_chapter6_stage", 2);
        progressLegendaryCatch(player, "Mewtwo");
        break;
    }
  });
}

// ================== SHRINE LOGIC ==================
function handleMewtwoShrine(player: Player) {
  const stage = Number(player.getDynamicProperty("quest_mewtwo_stage") ?? 0);
  if (stage !== 4) return player.sendMessage("§cThe shrine is inactive.");

  const inv = player.getComponent("inventory")?.container;
  let slot = -1;
  for (let i = 0; i < inv.size; i++) {
    const item = inv.getItem(i);
    if (item && item.typeId === "pokeworld:clone_stabilizer") {
      slot = i;
      break;
    }
  }
  if (slot === -1) return player.sendMessage("§cYou need the Clone Stabilizer.");

  inv.setItem(slot, undefined);
  player.setDynamicProperty("quest_mewtwo_stage", 5);
  player.setDynamicProperty("quest_mewtwo_summoned", true);
  player.runCommand("summon pokeworld:mewtwo ~ ~1 ~");
  player.sendMessage("§dMewtwo has been summoned...");
}
