import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

function titleCase(text: string): string {
  return text.replace(/\w\S*/g, word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  );
}

const legendaryDropSources: Record<string, Record<string, string>> = {
  Articuno: {
    frost_crystal: "Wild Piloswine",
    frozen_feather: "Wild Sneasel",
    ancient_ice: "Wild Snorunt"
  },
  Moltres: {
    magma_heart: "Wild Magmar",
    blazing_scale: "Wild Slugma",
    coal_fragment: "Wild Torkoal"
  },
  Zapdos: {
    charged_feather: "Wild Electabuzz",
    storm_crystal: "Wild Luxray",
    thunder_fragment: "Wild Electrike"
  },
  Mewtwo: {
    glitched_drive: "Wild Porygon",
    plasma_node: "Wild Magneton",
    mind_core: "Wild Beldum"
  }
};

// Gen 1 Quests
const gen1Quests = [
  { id: "Articuno",name: "Articuno",color: "§b",items: ["frost_crystal", "frozen_feather", "ancient_ice"]},
  { id: "Moltres", name: "Moltres", color: "§6", items: ["magma_heart", "blazing_scale", "coal_fragment"] },
  { id: "Zapdos", name: "Zapdos", color: "§e", items: ["charged_feather", "storm_crystal", "thunder_fragment"] },
  { id: "Mewtwo", name: "Mewtwo", color: "§d", items: ["glitched_drive", "plasma_node", "mind_core"] },
  { id: "Mew", name: "Mew", color: "§d", items: ["root_fragment", "leaf_shard", "ancient_amber", "unstable_cell", "memory_fluid", "pure_dna"] }
];

// Gen 2 Quests
const gen2Quests = [
  { id: "Raikou", name: "Raikou", color: "§e", items: ["shattered_stone", "fractured_column", "old_keystone", "jagged_rock", "voltaic_fragment", "ancient_core"] },
  { id: "Entei", name: "Entei", color: "§c", items: ["burned_stone", "scorched_metal", "crumbling_brick", "burned_shard", "cracked_plate", "lava_embers"] },
  { id: "Suicune", name: "Suicune", color: "§b", items: ["frosted_leaf", "ancient_shell", "mirror_splinter", "crystal_fang", "tidal_heart", "glacier_mirror"] }
];

// 🧭 Main Quest Menu
export function openLegendaryQuestMenu(player: Player) {
  const form = new ActionFormData()
    .title("§lLegendary Quests")
    .body("Choose a generation:");

  form.button("§9Gen 1 Legends");
  form.button("§aGen 2 Legends");

  form.show(player).then(res => {
    if (res.canceled || res.selection === undefined) return;

    if (res.selection === 0) {
      openLegendaryGenerationMenu(player, gen1Quests, "Gen 1");
    } else if (res.selection === 1) {
      openLegendaryGenerationMenu(player, gen2Quests, "Gen 2");
    }
  });
}

// 🧭 Submenu for Generational Quests
function openLegendaryGenerationMenu(player: Player, quests: typeof gen1Quests, title: string) {
  const form = new ActionFormData()
    .title(`§7§7§r${title} Quests`);

  for (const q of quests) {
    form.button(`${q.color}${q.name}`, `textures/items/item_base_UI/${q.id}.png`);
  }

  form.button("§aBack");

  form.show(player).then(res => {
    if (res.canceled) return;

    if (res.selection === quests.length) {
      openLegendaryQuestMenu(player);
      return;
    }

    const selected = quests[res.selection];
    openLegendaryQuestDetail(player, selected);
  });
}

// 📋 Quest Detail View
function openLegendaryQuestDetail(player: Player, quest: typeof gen1Quests[number]) {
  const form = new ActionFormData()
    .title(`${quest.color}${quest.name} Quest`);

  const stage = typeof player.getDynamicProperty(`quest_${quest.id}_stage`) === "number"
    ? player.getDynamicProperty(`quest_${quest.id}_stage`) as number
    : 0;

  const sources = legendaryDropSources[quest.id] ?? {};

  const itemStatus = quest.items.map(id => {
    const got = player.getDynamicProperty(`${quest.id}_${id}`) === true;
    const symbol = got ? "§a✔" : "§c✖";

    const itemName = titleCase(id.replace(/_/g, " "));
    const source = sources[id];

    return source
      ? `${symbol} §f${itemName} §7(from §9${source}§7)`
      : `${symbol} §f${itemName}`;
  }).join("\n");

  form.body(
    `§fProgress:\n${itemStatus}\n\n` +
    `§fStage: ${getStageLabel(stage)}`
  );

  form.button("§aBack");

  form.show(player).then(res => {
    if (res.canceled) return;
    const gen = gen1Quests.some(q => q.id === quest.id) ? gen1Quests : gen2Quests;
    const title = gen === gen1Quests ? "Gen 1" : "Gen 2";
    openLegendaryGenerationMenu(player, gen, title);
  });
}

// 🎯 Stage Display
function getStageLabel(stage: number): string {
  switch (stage) {
    case 0: return "§7Not started";
    case 1: return "§aHunting relics";
    case 2: return "§aReady to exchange";
    case 3: return "§eHas orb – go to shrine";
    case 4: return "§a✔ Completed";
    default: return "§7Unknown";
  }
}
