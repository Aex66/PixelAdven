import { Player, world, ScoreboardObjective } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { openLegendaryQuestMenu } from "./Legendary Quests/legendaryQuestTracker";
import { openSideQuestMenu, sideQuestConfig } from "./Side Quests/quest_main";
import { openStoryQuestMenu } from "./Story Quests/openStoryQuestMenu";
import { typeQuests } from "./Side Quests/type_catch";
import { openMenu } from "../Misc/menu";
import { openCollectionsMenu } from "./PokeSpecific Quests/collectionMenu";

export function openStoryQuestTracker(player: Player, questId: string, title: string) {
  const stage = Number(player.getDynamicProperty(`quest_${questId}_stage`) ?? 0);
  const tracker = storyQuestTrackers[questId];

  const text =
    tracker?.[stage] ??
    "§cUnknown quest stage. Please contact an Admin.";

  const form = new ActionFormData()
    .title(title)
    .body(`§fCurrent Objective:\n\n§e${text}`)
    .button("Back");

  form.show(player);
}

const storyQuestTrackers: Record<string, Record<number, string>> = {
  chapter1: {
    0: "Visit the Lab on the hill to collect your starter Pokémon.[FOLLOW THE HANGING SIGNS!!!!]",
    1: "Confirm your starter Pokémon and claim your rewards.",
    2: "Talk to Nurse Nico in the Pokémon Center at spawn.",
    3: "Visit the PokéMart and buy any item.",
    4: "Claim your Chapter 1 completion rewards.",
    5: "✅ Chapter 1 completed. Proceed to Chapter 2."
  },

  chapter2: {
    0: "Head into the wild and catch your first Pokémon.",
    1: "Catch at least one Pokémon.",
    2: "Claim your Chapter 2 rewards.",
    3: "✅ Chapter 2 completed. Proceed to Chapter 3."
  },

  chapter3: {
    0: "Catch Pokémon until you have a full team of 6 Pokémon.",
    1: "Catch Pokémon until you have at least 6 total Pokémon.",
    2: "Claim your Chapter 3 rewards.",
    3: "✅ Chapter 3 completed. Proceed to Chapter 4."
  },

  chapter4: {
    0: "Find the Fishing Guru and begin learning how to fish.",
    1: "Talk to the Fishing Guru and obtain an Old Rod.",
    2: "Fish with the Old Rod until it levels up.",
    3: "Claim your Chapter 4 rewards.",
    4: "✅ Chapter 4 completed. Proceed to Chapter 5."
  },

  chapter5: {
    0: "Begin the Gym Challenge by tracking Chapter 5.",
    1: "Defeat all 8 Gym Leaders.",
    2: "Claim your Chapter 5 rewards.",
    3: "✅ Chapter 5 completed. Legendary quests unlocked."
  },

  chapter6: {
    0: "Begin the Legendary Challenge by tracking Chapter 6.",
    1: "Catch any Legendary Pokémon (Articuno, Moltres, Zapdos, or Mewtwo).",
    2: "Confirm your captured Legendary Pokémon.",
    3: "Claim your Chapter 6 rewards.",
    4: "✅ Chapter 6 completed. Proceed to Chapter 7."
  },

  chapter7: {
    0: "Begin the Elite Four Challenge.",
    1: "Defeat all Elite Four members and the Champion.",
    2: "Confirm completion of the Elite Four challenge.",
    3: "Claim your Chapter 7 rewards.",
    4: "✅ Chapter 7 completed. You are now a Champion."
  }
};

const legendaryQuests = [
  { id: "Articuno", name: "Articuno", color: "§b", items: ["ice_shard", "frozen_core", "ancient_ice"] },
  { id: "Moltres", name: "Moltres", color: "§6", items: ["molten_heart", "blazing_scale", "coal_fragment"] },
  { id: "Zapdos", name: "Zapdos", color: "§e", items: ["charged_feather", "storm_crystal", "thunder_fragment"] },
  { id: "Mewtwo", name: "Mewtwo", color: "§d", items: ["glitched_drive", "plasma_node", "mind_core"] },
  { id: "Mew", name: "Mew", color: "§d", items: ["root_fragment", "leaf_shard", "ancient_amber", "unstable_cell", "memory_fluid", "pure_dna"] },
  { id: "Raikou", name: "Raikou", color: "§e", items: ["cracked_column", "ancient_brick", "mystic_rubble", "stormhide_shard", "sparked_mane", "charged_core"] },
  { id: "Entei", name: "Entei", color: "§c", items: ["charred_brick", "lava_fragment", "obsidian_plate", "ember_tooth", "flame_shard", "blazing_fur"] },
  { id: "Suicune", name: "Suicune", color: "§b", items: ["shimmering_pebble", "waterlogged_clay", "ancient_stone", "crystal_fang", "tidal_heart", "glacier_mirror"] }
];

const storyQuests = [
  { id: "chapter1", name: "The Journey Begins", color: "§d", stages: 5 },
  { id: "chapter2", name: "Your First Catch", color: "§b", stages: 3 },
];

// 🧭 Main Quest Menu
export function openQuestMenu(player: Player) {
  const form = new ActionFormData()
    .title("§7§7§rQuest Menu")
    .button("§cStory Quests", "textures/items/story.png")
    .button("§aSide Quests", "textures/items/side.png")
    .button("§dPokédex Collections", "textures/items/search.png");

  // ✅ Legendary Quests only unlock after Chapter 5 completion
  const chapter5Stage = Number(player.getDynamicProperty("quest_chapter5_stage") ?? 0);
  if (chapter5Stage >= 3) {
    form.button("§6Legendary Quests", "textures/items/legendary.png");
  }

  // ✅ Quest Reset stays visible for Admins regardless
  if (player.hasTag("Admin") || player.hasTag("Owner")) {
    form.button("§c⚠ Admin: Reset Quest", "textures/items/config.png");
  }

  form.button("Back", "textures/items/left_arrow.png"); // ✅ Added openMenu button

  form.show(player).then(res => {
    if (res.canceled) {
      openMenu(player);
      return;
    }

    let index = 0;

    if (res.selection === index++) {
      openStoryQuestMenu(player);

    } else if (res.selection === index++) {
      openSideQuestMenu(player);

    } else if (res.selection === index++) {
      openCollectionsMenu(player);

    } else if (chapter5Stage >= 3 && res.selection === index++) {
      openLegendaryQuestMenu(player);

    } else if ((player.hasTag("Admin") || player.hasTag("Owner")) && res.selection === index++) {
      openQuestResetTypeMenu(player);

    } else if (res.selection === index++) {
      openMenu(player);
    }
  });
}

// 📂 Choose reset category (Story / Legendary / Side)
function openQuestResetTypeMenu(admin: Player) {
  const form = new ActionFormData()
    .title("§cReset Quests")
    .button("§dStory Quests")
    .button("§6Legendary Quests")
    .button("§aSide Quests");

  form.show(admin).then(res => {
    if (res.canceled) return;
    if (res.selection === 0) openResetPlayerMenu(admin, "story");
    if (res.selection === 1) openResetPlayerMenu(admin, "legendary");
    if (res.selection === 2) openResetPlayerMenu(admin, "side");
  });
}

// 🧑 Select Player to Reset
function openResetPlayerMenu(admin: Player, type: "story" | "legendary" | "side") {
  const players = [...world.getPlayers()];
  if (players.length === 0) {
    admin.sendMessage("§cNo players online.");
    return;
  }

  const form = new ModalFormData()
    .title(`§cReset ${type === "story" ? "Story" : type === "legendary" ? "Legendary" : "Side"} Quest`)
    .dropdown("Select Player", players.map(p => p.name));

  form.show(admin).then(res => {
    if (res.canceled) return;
    const target = players[res.formValues[0] as number];
    if (type === "story") openResetStoryQuestMenu(admin, target);
    if (type === "legendary") openResetLegendaryQuestMenu(admin, target);
    if (type === "side") openResetSideQuestHub(admin, target);
  });
}

// 🔧 Scoreboard helpers
function getObj(name: string): ScoreboardObjective | undefined {
  try {
    return world.scoreboard.getObjective(name);
  } catch {
    return undefined;
  }
}

function setScoreSafe(target: Player, objective: string, value: number): boolean {
  const obj = getObj(objective);
  if (!obj) return false;
  try {
    obj.setScore(target, value);
    return true;
  } catch {
    return false;
  }
}

// ========== STORY RESET ==========
function openResetStoryQuestMenu(admin: Player, target: Player) {
  const form = new ModalFormData()
    .title(`§cReset Story Quest for ${target.name}`)
    .dropdown("Select Quest", storyQuests.map(q => q.name));

  form.show(admin).then(res => {
    if (res.canceled) return;
    const quest = storyQuests[res.formValues[0] as number];

    const stageForm = new ModalFormData()
      .title(`§cSet Stage for ${quest.name}`)
      .dropdown("Set Quest Stage", Array.from({ length: quest.stages + 1 }, (_, i) => `${i} - Stage ${i}`));

    stageForm.show(admin).then(stageRes => {
      if (stageRes.canceled) return;
      const newStage = stageRes.formValues[0] as number;

      target.setDynamicProperty(`quest_${quest.id}_stage`, newStage);
      admin.sendMessage(`§aReset §f${quest.name} §aquest for §f${target.name} §ato stage §e${newStage}`);
      target.sendMessage(`§6Your §f${quest.name} §6quest was reset by an Admin.`);
    });
  });
}

// ========== LEGENDARY RESET ==========
function openResetLegendaryQuestMenu(admin: Player, target: Player) {
  const form = new ModalFormData()
    .title(`§cReset Legendary Quest for ${target.name}`)
    .dropdown("Select Quest", legendaryQuests.map(q => q.name))
    .dropdown("Reset Type", [
      "Soft Reset (Set Stage)",
      "§c⚠ FULL WIPE (Delete All Quest Data)"
    ]);

  form.show(admin).then(res => {
    if (res.canceled) return;

    const quest = legendaryQuests[res.formValues[0] as number];
    const resetType = res.formValues[1] as number;

    // -------------------------------
    // FULL WIPE (NUCLEAR OPTION)
    // -------------------------------
    if (resetType === 1) {
      const confirm = new ModalFormData()
        .title(`§4CONFIRM FULL WIPE`)
        .toggle(`Delete ALL data for ${quest.name}?`, { defaultValue: false });

      confirm.show(admin).then(confirmRes => {
        if (confirmRes.canceled) return;
        if (!confirmRes.formValues[0]) {
          admin.sendMessage("§7Full wipe cancelled.");
          return;
        }

        const upper = quest.id;                 // Articuno
        const lower = quest.id.toLowerCase();   // articuno

        // 🔥 Stage + summoned (both casings)
        target.setDynamicProperty(`quest_${upper}_stage`, undefined);
        target.setDynamicProperty(`quest_${upper}_summoned`, undefined);
        target.setDynamicProperty(`quest_${lower}_stage`, undefined);
        target.setDynamicProperty(`quest_${lower}_summoned`, undefined);

        // 🔥 Item flags (both casings)
        for (const item of quest.items) {
          target.setDynamicProperty(`${upper}_${item}`, undefined);
          target.setDynamicProperty(`${lower}_${item}`, undefined);
        }

        admin.sendMessage(
          `§c[WIPE] Completely erased ALL §f${quest.name} §cquest data for §f${target.name}`
        );
        target.sendMessage(
          `§4Your §f${quest.name} §4Legendary quest was fully wiped by an Admin.`
        );
      });

      return;
    }

    // -------------------------------
    // SOFT RESET (UNCHANGED BEHAVIOR)
    // -------------------------------
    const stageForm = new ModalFormData()
      .title(`§cSet Stage for ${quest.name}`)
      .dropdown("Set Quest Stage", [
        "0 - Not Started",
        "1 - Hunting Relics",
        "2 - Ready to Exchange",
        "3 - Has Orb",
        "4 - Completed"
      ]);

    stageForm.show(admin).then(stageRes => {
      if (stageRes.canceled) return;

      const newStage = stageRes.formValues[0] as number;

      const key = quest.id.toLowerCase();

      target.setDynamicProperty(`quest_${key}_stage`, newStage);
      target.setDynamicProperty(`quest_${key}_summoned`, false);

      for (const item of quest.items) {
        target.setDynamicProperty(`${key}_${item}`, newStage >= 2);
      }

      admin.sendMessage(
        `§aReset §f${quest.name} §aquest for §f${target.name} §ato stage §e${newStage}`
      );
      target.sendMessage(
        `§6Your §f${quest.name} §6quest was reset by an Admin.`
      );
    });
  });
}

// ========== SIDE QUEST RESET ==========
function openResetSideQuestHub(admin: Player, target: Player) {
  const form = new ActionFormData()
    .title(`§aSide Quest Reset — ${target.name}`)
    .button("§bGeneral Side Quests")
    .button("§eType Catch Quests")
    .button("§cReset ALL Side Quests");

  form.show(admin).then(res => {
    if (res.canceled) return;
    if (res.selection === 0) openResetGeneralSideQuest(admin, target);
    if (res.selection === 1) openResetTypeCatchSideQuest(admin, target);
    if (res.selection === 2) confirmResetAllSideQuests(admin, target);
  });
}

// --- General side quests (from sideQuestConfig)
function openResetGeneralSideQuest(admin: Player, target: Player) {
  const names = sideQuestConfig.map(q => q.name);
  const form = new ModalFormData()
    .title(`§bGeneral Side Quests — ${target.name}`)
    .dropdown("Select Quest", names)
    .dropdown("Set Stage", ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]) // generic; clamped later
    .toggle("Also reset PROGRESS scoreboard to 0?", { defaultValue: true })


  form.show(admin).then(res => {
    if (res.canceled) return;

    const idx = res.formValues[0] as number;
    const stageRequested = Number(res.formValues[1] as number);
    const resetProgress = Boolean(res.formValues[2]);

    const quest = sideQuestConfig[idx];
    const maxStage = Math.max(0, (quest?.stages?.length ?? 0)); // stages.length (claimable functions count)
    const newStage = Math.min(Math.max(stageRequested, 0), maxStage);

    // Stage scoreboard
    const stageOk = setScoreSafe(target, quest.id, newStage);

    // Optional progress scoreboard reset
    let progressOk = true;
    if (resetProgress && quest.score) {
      progressOk = setScoreSafe(target, quest.score, 0);
    }

    // Feedback
    if (!stageOk) {
      admin.sendMessage(`§c[Side] Could not set stage. Missing objective: §f${quest.id}`);
      return;
    }
    if (resetProgress && !progressOk) {
      admin.sendMessage(`§e[Side] Stage set, but progress objective missing: §f${quest.score}`);
    }

    admin.sendMessage(`§a[Side] Set §f${quest.name} §astage to §e${newStage} §afor §f${target.name}${resetProgress ? " §7(and reset progress)" : ""}.`);
    target.sendMessage(`§6Your side quest §f${quest.name} §6was adjusted by an Admin.`);
  });
}

// --- Type Catch side quests (from typeQuests)
function openResetTypeCatchSideQuest(admin: Player, target: Player) {
  const names = typeQuests.map(q => q.name);
  const form = new ModalFormData()
    .title(`§eType Catch Quests — ${target.name}`)
    .dropdown("Select Quest", names)
    .dropdown("Set Stage", ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]) // generic; clamped later
    .toggle("Also reset PROGRESS scoreboard to 0?", { defaultValue: true })


  form.show(admin).then(res => {
    if (res.canceled) return;

    const idx = res.formValues[0] as number;
    const stageRequested = Number(res.formValues[1] as number);
    const resetProgress = Boolean(res.formValues[2]);

    const quest = typeQuests[idx];
    const maxStage = Math.max(0, (quest?.stages?.length ?? 0));
    const newStage = Math.min(Math.max(stageRequested, 0), maxStage);

    const stageOk = setScoreSafe(target, quest.id, newStage);

    let progressOk = true;
    if (resetProgress && quest.score) {
      progressOk = setScoreSafe(target, quest.score, 0);
    }

    if (!stageOk) {
      admin.sendMessage(`§c[Type] Could not set stage. Missing objective: §f${quest.id}`);
      return;
    }
    if (resetProgress && !progressOk) {
      admin.sendMessage(`§e[Type] Stage set, but progress objective missing: §f${quest.score}`);
    }

    admin.sendMessage(`§a[Type] Set §f${quest.name} §astage to §e${newStage} §afor §f${target.name}${resetProgress ? " §7(and reset progress)" : ""}.`);
    target.sendMessage(`§6Your type catch quest §f${quest.name} §6was adjusted by an Admin.`);
  });
}

// --- Confirm and reset ALL side quests (both groups)
function confirmResetAllSideQuests(admin: Player, target: Player) {
  const form = new ModalFormData()
    .title(`§cReset ALL Side Quests — ${target.name}`)
    .toggle("Reset PROGRESS counters too?", { defaultValue: true })


  form.show(admin).then(res => {
    if (res.canceled) return;
    const resetProgress = Boolean(res.formValues[0]);

    let stageCount = 0;
    let progressCount = 0;

    // General side quests
    for (const q of sideQuestConfig) {
      if (setScoreSafe(target, q.id, 0)) stageCount++;
      if (resetProgress && q.score && setScoreSafe(target, q.score, 0)) progressCount++;
    }
    // Type catch side quests
    for (const q of typeQuests) {
      if (setScoreSafe(target, q.id, 0)) stageCount++;
      if (resetProgress && q.score && setScoreSafe(target, q.score, 0)) progressCount++;
    }

    admin.sendMessage(`§a[All Side] Reset §e${stageCount} §astage objectives${resetProgress ? ` and §e${progressCount} §aprogress objectives` : ""} for §f${target.name}.`);
    target.sendMessage(`§6All your Side Quests were reset by an Admin${resetProgress ? " (including progress)" : ""}.`);
  });
}
