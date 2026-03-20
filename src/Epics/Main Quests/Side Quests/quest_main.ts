import { Player, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import PlayerScore from "../../../Papers/PlayerPaper.js";

import {
  catching0, catching1, catching2, catching3, catching4,
  catching5, catching6, catching7, catching8, catching9, catching10,
  catching1_reward, catching2_reward, catching3_reward, catching4_reward,
  catching5_reward, catching6_reward, catching7_reward, catching8_reward,
  catching9_reward, catching10_reward
} from "./catch.js";

import {
  egg0, egg1, egg2, egg3, egg4, egg5, egg6, egg7, egg8, egg9, egg10,
  egg1_reward, egg2_reward, egg3_reward, egg4_reward, egg5_reward,
  egg6_reward, egg7_reward, egg8_reward, egg9_reward, egg10_reward
} from "./egg.js";

import {
  fishing0, fishing1, fishing2, fishing3, fishing4,
  fishing5, fishing6, fishing7, fishing8, fishing9, fishing10,
  fishing1_reward, fishing2_reward, fishing3_reward, fishing4_reward,
  fishing5_reward, fishing6_reward, fishing7_reward, fishing8_reward,
  fishing9_reward, fishing10_reward
} from "./fishing.js";

import {
  mining0, mining1, mining2, mining3, mining4,
  mining5, mining6, mining7, mining8, mining9, mining10,
  mining1_reward, mining2_reward, mining3_reward, mining4_reward,
  mining5_reward, mining6_reward, mining7_reward, mining8_reward,
  mining9_reward, mining10_reward
} from "./mining.js";

import {
  money0, money1, money2, money3, money4, money5, money6, money7,
  money1_reward, money2_reward, money3_reward, money4_reward,
  money5_reward, money6_reward, money7_reward
} from "./money.js";

import {
  swimming0, swimming1, swimming2, swimming3, swimming4,
  swimming5, swimming6, swimming7, swimming8, swimming9, swimming10,
  swimming1_reward, swimming2_reward, swimming3_reward, swimming4_reward,
  swimming5_reward, swimming6_reward, swimming7_reward, swimming8_reward,
  swimming9_reward, swimming10_reward
} from "./swimming.js";

import {
  walking0, walking1, walking2, walking3, walking4,
  walking5, walking6, walking7, walking8, walking9, walking10,
  walking1_reward, walking2_reward, walking3_reward, walking4_reward,
  walking5_reward, walking6_reward, walking7_reward, walking8_reward,
  walking9_reward, walking10_reward
} from "./walking.js";

import {
  pokestop0, pokestop1, pokestop2, pokestop3, pokestop4,
  pokestop5, pokestop6, pokestop7, pokestop8, pokestop9, pokestop10,
  pokestop1_reward, pokestop2_reward, pokestop3_reward, pokestop4_reward,
  pokestop5_reward, pokestop6_reward, pokestop7_reward, pokestop8_reward,
  pokestop9_reward, pokestop10_reward
} from "./pokestop.js";

import { catchtype } from "./type_catch.js";

// =========================
// AUTO-CLAIM TOGGLE HELPERS
// =========================

const AUTO_CLAIM_TAG = "sidequest_autoclaim";

function hasAutoClaim(player: Player): boolean {
  return player.hasTag(AUTO_CLAIM_TAG);
}

function toggleAutoClaim(player: Player) {
  if (hasAutoClaim(player)) {
    player.removeTag(AUTO_CLAIM_TAG);
    player.sendMessage("§cAuto-Claim Disabled §7– rewards must be claimed manually.");
  } else {
    player.addTag(AUTO_CLAIM_TAG);
    player.sendMessage("§aAuto-Claim Enabled §7– rewards will be claimed automatically.");
  }
}

// =========================
// SIDE QUEST CONFIG
// =========================

export const sideQuestConfig = [
  {
    id: "catchquest",
    name: "Catching",
    score: "pcatch",
    thresholds: [0, 10, 50, 100, 150, 250, 500, 1000, 2500, 5000, 10000],
    stages: [catching0, catching1, catching2, catching3, catching4, catching5, catching6, catching7, catching8, catching9, catching10],
    rewards: [null, catching1_reward, catching2_reward, catching3_reward, catching4_reward, catching5_reward, catching6_reward, catching7_reward, catching8_reward, catching9_reward, catching10_reward],
    icon: "textures/items/quest_ui/pokeball.png"
  },
  {
    id: "fishquest",
    name: "Fishing",
    score: "fishing",
    thresholds: [0, 10, 50, 100, 150, 250, 500, 1000, 2500, 5000, 10000],
    stages: [fishing0, fishing1, fishing2, fishing3, fishing4, fishing5, fishing6, fishing7, fishing8, fishing9, fishing10],
    rewards: [null, fishing1_reward, fishing2_reward, fishing3_reward, fishing4_reward, fishing5_reward, fishing6_reward, fishing7_reward, fishing8_reward, fishing9_reward, fishing10_reward],
    icon: "textures/items/fishing_rod_uncast.png"
  },
  {
    id: "minequest",
    name: "Mining",
    score: "mining",
    thresholds: [0, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
    stages: [mining0, mining1, mining2, mining3, mining4, mining5, mining6, mining7, mining8, mining9, mining10],
    rewards: [null, mining1_reward, mining2_reward, mining3_reward, mining4_reward, mining5_reward, mining6_reward, mining7_reward, mining8_reward, mining9_reward, mining10_reward],
    icon: "textures/items/wood_pickaxe.png"
  },
  {
    id: "walk_quest",
    name: "Walking",
    score: "walk_steps",
    thresholds: [0, 2500, 5000, 10000, 15000, 25000, 50000, 100000, 250000, 500000, 1000000],
    stages: [walking0, walking1, walking2, walking3, walking4, walking5, walking6, walking7, walking8, walking9, walking10],
    rewards: [null, walking1_reward, walking2_reward, walking3_reward, walking4_reward, walking5_reward, walking6_reward, walking7_reward, walking8_reward, walking9_reward, walking10_reward],
    icon: "textures/items/quest_ui/walking.png"
  },
  {
    id: "pokestop_quest",
    name: "Pokestop Visits",
    score: "stopspin",
    thresholds: [0, 25, 75, 150, 250, 400, 600, 900, 1250, 1750, 2500],
    stages: [pokestop0, pokestop1, pokestop2, pokestop3, pokestop4, pokestop5, pokestop6, pokestop7, pokestop8, pokestop9, pokestop10],
    rewards: [null, pokestop1_reward, pokestop2_reward, pokestop3_reward, pokestop4_reward, pokestop5_reward, pokestop6_reward, pokestop7_reward, pokestop8_reward, pokestop9_reward, pokestop10_reward],
    icon: "textures/items/quest_ui/pokestop.png"
  },
  {
    id: "swim_quest",
    name: "Swimming",
    score: "swim_steps",
    thresholds: [0, 2500, 5000, 10000, 15000, 25000, 50000, 100000, 250000, 500000, 1000000],
    stages: [swimming0, swimming1, swimming2, swimming3, swimming4, swimming5, swimming6, swimming7, swimming8, swimming9, swimming10],
    rewards: [null, swimming1_reward, swimming2_reward, swimming3_reward, swimming4_reward, swimming5_reward, swimming6_reward, swimming7_reward, swimming8_reward, swimming9_reward, swimming10_reward],
    icon: "textures/items/quest_ui/swimming.png"
  },
  {
    id: "egg_quest",
    name: "Hatching",
    score: "egg_count",
    thresholds: [0, 10, 15, 25, 50, 100, 150, 200, 250, 500, 1000],
    stages: [egg0, egg1, egg2, egg3, egg4, egg5, egg6, egg7, egg8, egg9, egg10],
    rewards: [null, egg1_reward, egg2_reward, egg3_reward, egg4_reward, egg5_reward, egg6_reward, egg7_reward, egg8_reward, egg9_reward, egg10_reward],
    icon: "textures/items/quest_ui/eggs.png"
  },
  {
    id: "money_quest",
    name: "Money",
    score: "Money",
    thresholds: [0, 50000, 100000, 250000, 500000, 1000000, 2500000, 5000000],
    stages: [money0, money1, money2, money3, money4, money5, money6, money7],
    rewards: [null, money1_reward, money2_reward, money3_reward, money4_reward, money5_reward, money6_reward, money7_reward],
    icon: "textures/items/quest_ui/money.png"
  }
];

// =========================
// MAIN SIDE QUEST MENU
// =========================

export function openSideQuestMenu(player: Player) {
  const form = new ActionFormData()
    .title("§7§rSide Quests")
    .body("Choose a side quest to view your progress.");

  for (const quest of sideQuestConfig) {
    const stage = Number(PlayerScore.getScore(player, quest.id) ?? 0);
    const progress = Number(PlayerScore.getScore(player, quest.score) ?? 0);

    // For display we still want "next target", so we show the *next* threshold.
    const nextTarget = quest.thresholds[stage];

    const label =
      stage >= quest.stages.length
        ? `§a${quest.name} §7(Complete)`
        : `§e${quest.name}: ${progress}/${nextTarget}`;

    form.button(label, quest.icon);
  }

  form.button("§dType Catch Quests", "textures/items/quest_ui/type.png");
  form.button("§bCheck Quest Stats", "textures/items/quest_ui/info.png");

  const autoLabel = hasAutoClaim(player)
    ? "§aAuto-Claim: ON"
    : "§cAuto-Claim: OFF";

  form.button(autoLabel, "textures/items/quest_ui/settings.png");

  form.show(player).then((res) => {
    if (res.canceled) return;

    const questCount = sideQuestConfig.length;

    if (res.selection < questCount) {
      const quest = sideQuestConfig[res.selection];
      const stage = Number(PlayerScore.getScore(player, quest.id) ?? 0);
      const progress = Number(PlayerScore.getScore(player, quest.score) ?? 0);

      if (stage >= quest.stages.length) {
        player.sendMessage("§aYou’ve already completed this quest line!");
        return;
      }

      // ====== GATING FIX ======
      // Stage 0: ALWAYS allowed (start quest, no progress requirement)
      // Stage >= 1: require progress >= thresholds[stage]
      let required: number | undefined = undefined;
      if (stage > 0 && stage < quest.thresholds.length) {
        required = quest.thresholds[stage];
      }

      if (required !== undefined && progress < required) {
        const remaining = required - progress;
        player.sendMessage(
          `§cNot ready yet. §7You still need §e${remaining} §7more for §b${quest.name} §7(stage ${stage}).`
        );
        return;
      }
      // =========================

      // Eligible → run the current stage handler
      quest.stages[stage](player);

    } else if (res.selection === questCount) {
      catchtype(player);
    } else if (res.selection === questCount + 1) {
      showQuestStats(player);
    } else if (res.selection === questCount + 2) {
      toggleAutoClaim(player);
      system.run(() => openSideQuestMenu(player));
    }
  });
}

// =========================
// QUEST STATS
// =========================

function showQuestStats(player: Player) {
  player.runCommand(
    'tellraw @s {"rawtext":[{"text":"§e[Pokemon Caught]: §r"},{"score":{"name":"@s","objective":"pcatch"}}]}'
  );
  player.runCommand(
    'tellraw @s {"rawtext":[{"text":"§e[Pokemon Reeled In]: §r"},{"score":{"name":"@s","objective":"fishing"}}]}'
  );
  player.runCommand(
    'tellraw @s {"rawtext":[{"text":"§e[Distance Walked]: §r"},{"score":{"name":"@s","objective":"walk_steps"}}]}'
  );
  player.runCommand(
    'tellraw @s {"rawtext":[{"text":"§e[Distance Swam]: §r"},{"score":{"name":"@s","objective":"swim_steps"}}]}'
  );
  player.runCommand(
    'tellraw @s {"rawtext":[{"text":"§e[Eggs Hatched]: §r"},{"score":{"name":"@s","objective":"egg_count"}}]}'
  );
  player.runCommand(
    'tellraw @s {"rawtext":[{"text":"§e[Money]: §r"},{"score":{"name":"@s","objective":"Money"}}]}'
  );
}

// =========================
// AUTO-CLAIM LOOP
// =========================

system.runInterval(() => {
  for (const player of world.getPlayers()) {
    if (!hasAutoClaim(player)) continue;

    for (const quest of sideQuestConfig) {
      tryAutoAdvanceQuest(player, quest);
    }
  }
}, 40);

function tryAutoAdvanceQuest(player: Player, quest: any) {
  const stage = Number(PlayerScore.getScore(player, quest.id) ?? 0);
  const progress = Number(PlayerScore.getScore(player, quest.score) ?? 0);

  if (stage === 0 || stage >= quest.stages.length) return;

  const required = quest.thresholds[stage];
  if (required === undefined || progress < required) return;

  quest.rewards?.[stage]?.(player);
}
