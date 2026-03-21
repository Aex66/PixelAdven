// @ts-nocheck
import { Player, EquipmentSlot, world, ItemStack, ItemTypes, Entity, system, Vector3 } from "@minecraft/server";
import { ModalFormData, ActionFormData } from "@minecraft/server-ui";
import { grammarText } from "../../Papers/Paragraphs/ExtrasParagraphs";
import { math } from "../Pokemon Calculations/main";

type RodType = "old" | "good" | "super";

type BaitType =
  | "none"
  | "common_bait"
  | "rare_bait"
  | "shiny_bait"
  | "loot_bait";

type BaitEffect = {
  rareBoost?: number;
  shinyBoost?: number;
  lootBoost?: number;
};

type FishingData = {
  progress: Record<RodType, number>;
  catchStreak: number;
};

function hasShinyCharm(player: Player): boolean {
  const eq = player.getComponent("equippable");
  const off = eq?.getEquipment(EquipmentSlot.Offhand);
  return off?.typeId === "pokeworld:shiny_charm";
}

function getFishingData(player: Player): FishingData {
  const raw = player.getDynamicProperty("fishing_progress") as string;
  try {
    return raw ? JSON.parse(raw) : { progress: { old: 0, good: 0, super: 0 }, catchStreak: 0 };
  } catch {
    return { progress: { old: 0, good: 0, super: 0 }, catchStreak: 0 };
  }
}

function saveFishingData(player: Player, data: FishingData) {
  player.setDynamicProperty("fishing_progress", JSON.stringify(data));

  const oldRodLevel = Math.floor((data.progress.old ?? 0) / 25);
  if (player.getDynamicProperty("quest_chapter4_stage") === 2 && oldRodLevel >= 1) {
    player.sendMessage("§aYour Old Rod leveled up! Open Chapter 4 menu to complete the step.");
  }
}

function openAdminResetMenu(admin: Player) {
  const players = world.getPlayers();
  const playerNames = players.map(p => p.name);
  const form = new ModalFormData()
    .title("🎣 Fishing Progress Reset")
    .dropdown("Select a player", playerNames)
    .dropdown("Select Rod Type to Reset", ["old", "good", "super", "all"]);

  form.show(admin).then(res => {
    if (res.canceled) return;
    const playerIndex = Number(res.formValues?.[0]);
    const rodIndex = Number(res.formValues?.[1]);

    const target = players[playerIndex];
    const rod = ["old", "good", "super", "all"][rodIndex] as RodType | "all";

    if (!target) {
      admin.sendMessage("§cPlayer not found.");
      return;
    }

    const progressData = getFishingData(target);
    const fishingDataRaw = target.getDynamicProperty("fishing_data") as string ?? "{}";
    const fishingData = JSON.parse(fishingDataRaw);

    if (rod === "all") {
      progressData.progress = { old: 0, good: 0, super: 0 };
      fishingData.rods = [];
    } else {
      progressData.progress[rod] = 0;
      fishingData.rods = (fishingData.rods ?? []).filter((r: RodType) => r !== rod);
    }

    saveFishingData(target, progressData);
    target.setDynamicProperty("fishing_data", JSON.stringify(fishingData));
    admin.sendMessage(`§aReset ${rod === "all" ? "all rods" : rod + " rod"} for §e${target.name}`);
  });
}

function canClaimRod(player: Player, rodType: RodType): boolean {
  const data = getFishingData(player);
  if (rodType === "old") return true;
  if (rodType === "good") return Math.floor(data.progress.old / 25) >= 3;
  if (rodType === "super") return Math.floor(data.progress.good / 25) >= 3;
  return false;
}

function updateRodLore(
  rod: ItemStack,
  rodType: RodType,
  level: number,
  progress: number,
  shinyProgress?: number
) {
  const required = 25;

  const lore = [
    `§r§l§6[${rodType[0].toUpperCase() + rodType.slice(1)} Rod]`,
    `§7Level: ${Math.min(level, 5)}/5`,
    `§8Progress: ${progress % required}/25 Catches`
  ];

  if (shinyProgress !== undefined) {
    lore.push(`§dShiny Chain: ${shinyProgress}/25`);
  }

  rod.setLore(lore);
}

function openFishingGuruMenu(player: Player, rodType: "old" | "good" | "super") {
  const fishingDataRaw = player.getDynamicProperty("fishing_data") as string ?? "{}";
  const data = JSON.parse(fishingDataRaw);

  const hasRod = data.rods?.includes(rodType);

  const form = new ActionFormData();
  form.title("§6Fishing Guru");

  if (rodType === "old") {
    if (hasRod) {
      form.body("§7You've already received the Old Rod.");

      if (player.getDynamicProperty("quest_chapter4_stage") === 1) {
        player.setDynamicProperty("quest_chapter4_stage", 2);
        player.sendMessage("§aYour Chapter 4 quest advanced! Time to fish and level up your Old Rod.");
      }
    } else {
      form.body("§eSo you want to fish, eh? Take this Old Rod. It may not be fancy, but it's a start!");
      form.button("§7Get Old Rod");
    }
  }

  if (rodType === "good") {
    if (!canClaimRod(player, "good")) {
      form.body("§7A true angler must master the Old Rod first.\n§7Return when you've proven your patience and skill.");
    } else if (hasRod) {
      form.body("§7You've already received the Good Rod.");
    } else {
      form.body("§eYou’ve come a long way! With this Good Rod, you’ll find better Pokémon in the water.");
      form.button("§aGet Good Rod");
    }
  }

  if (rodType === "super") {
    if (!canClaimRod(player, "super")) {
      form.body("§7Even the ocean tests us.\n§7Come back once your journey with the Good Rod is complete.");
    } else if (hasRod) {
      form.body("§7You've already received the Super Rod.");
    } else {
      form.body("§eYou’re a true angler! Take this Super Rod. With it, you might reel in something incredible!");
      form.button("§bGet Super Rod");
    }
  }

  const isAdmin = player.hasTag("Admin") || player.hasTag("Owner");
  if (isAdmin) openAdminResetMenu(player);

  form.show(player).then(res => {
    if (res.canceled || res.selection !== 0) return;

    giveFishingRod(player, rodType);

    if (!data.rods) data.rods = [];
    if (!data.rods.includes(rodType)) data.rods.push(rodType);
    player.setDynamicProperty("fishing_data", JSON.stringify(data));

    if (rodType === "old" && player.getDynamicProperty("quest_chapter4_stage") === 1) {
      player.setDynamicProperty("quest_chapter4_stage", 2);
      player.sendMessage("§aYou’ve received your Old Rod — Chapter 4 quest advanced!");
    }
  });
}

function giveFishingRod(player: Player, rodType: RodType) {
  const data = getFishingData(player);
  const progress = data.progress[rodType] ?? 0;
  const level = Math.floor(progress / 25);
  const rodTypeItem = ItemTypes.get("fishing_rod");
  if (!rodTypeItem) return;

  const rod = new ItemStack(rodTypeItem, 1);
  rod.nameTag = rodType === "old" ? "§7Old Rod"
    : rodType === "good" ? "§aGood Rod"
      : "§bSuper Rod";

  updateRodLore(rod, rodType, level, progress);
  const invComp = player.getComponent("minecraft:inventory") as any;
  const inv = invComp?.container;
  if (!inv) return;

  inv.addItem(rod);
  player.sendMessage(`§eYou received a ${rod.nameTag.replace("§7", "").replace("§a", "").replace("§b", "")}!`);
}

world.afterEvents.entityHitEntity.subscribe(ev => {
  if (!(ev.damagingEntity instanceof Player)) return;

  if (ev.hitEntity.typeId === "pokeworld:fishing_guru1") openFishingGuruMenu(ev.damagingEntity, "old");
  if (ev.hitEntity.typeId === "pokeworld:fishing_guru2") openFishingGuruMenu(ev.damagingEntity, "good");
  if (ev.hitEntity.typeId === "pokeworld:fishing_guru3") openFishingGuruMenu(ev.damagingEntity, "super");
});

// -----------------------------------------------
//              POKÉMON POOL TABLES
// -----------------------------------------------

const common = [
  "wild_squirtle", "wild_totodile", "wild_mudkip", "wild_piplup",
  "wild_psyduck", "wild_poliwag", "wild_tentacool", "wild_slowpoke",
  "wild_krabby", "wild_horsea", "wild_goldeen", "wild_staryu",
  "wild_magikarp", "wild_chinchou", "wild_marill", "wild_wooper",
  "wild_qwilfish", "wild_corsola", "wild_remoraid",
  "wild_lotad", "wild_surskit", "wild_carvanha",
  "wild_wailmer", "wild_barboach", "wild_corphish",
  "wild_feebas", "wild_clamperl", "wild_luvdisc",
  "wild_piplup", "wild_buizel", "wild_shellos", "wild_finneon", "wild_mantyke"
];

const uncommon = [
  "wild_wartortle", "wild_croconaw", "wild_marshtomp", "wild_prinplup",
  "wild_golduck", "wild_poliwhirl", "wild_slowbro", "wild_seel",
  "wild_shellder", "wild_kingler", "wild_seadra", "wild_seaking",
  "wild_starmie", "wild_gyarados", "wild_lanturn", "wild_azumarill",
  "wild_quagsire", "wild_octillery", "wild_mantine",
  "wild_lombre", "wild_ludicolo", "wild_sharpedo",
  "wild_whiscash", "wild_crawdaunt",
  "wild_bibarel", "wild_floatzel", "wild_gastrodon", "wild_lumineon"
];

const rare = [
  "wild_blastoise", "wild_feraligatr", "wild_swampert", "wild_empoleon",
  "wild_poliwrath", "wild_tentacruel", "wild_dewgong",
  "wild_cloyster", "wild_kingdra", "wild_wailord",
  "wild_milotic", "wild_relicanth"
];

const veryRare = [
  "wild_slowking", "wild_politoed",
  "wild_gorebyss", "wild_huntail"
];

const ultraRare = [
  "wild_lapras", "wild_vaporeon"
];

const BAIT_EFFECTS: Record<BaitType, BaitEffect> = {
  none: {},

  common_bait: {
    rareBoost: 5
  },

  rare_bait: {
    rareBoost: 15
  },

  shiny_bait: {
    shinyBoost: 1   // used differently
  },

  loot_bait: {
    lootBoost: 20
  }
};


function pickRandom(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)];
}

function getRodType(player: Player): RodType | "none" {
  try {
    const equip = player.getComponent("equippable");
    const mainhand = equip?.getEquipment(EquipmentSlot.Mainhand);
    if (!mainhand) return "none";

    const lore = mainhand.getLore();

    if (lore.some(l => l.includes("Old Rod"))) return "old";
    if (lore.some(l => l.includes("Good Rod"))) return "good";
    if (lore.some(l => l.includes("Super Rod"))) return "super";

    return "none";
  } catch {
    return "none";
  }
}

function giveFishingLoot(player: Player) {
  const lootTable = [
    { weight: 40, item: "pokeworld:poke_ball", name: "Poké Ball" },
    { weight: 20, item: "pokeworld:oran_berry", name: "Oran Berry" },
    { weight: 15, item: "pokeworld:potion", name: "Potion" },
    { weight: 10, item: "pokeworld:great_ball", name: "Great Ball" },
    { weight: 10, item: "pokeworld:pecha_berry", name: "Pecha Berry" },
    { weight: 5, item: "pokeworld:ultra_ball", name: "Ultra Ball" },
    { weight: 5, item: "pokeworld:super_potion", name: "Super Potion" }
  ];

  let total = lootTable.reduce((sum, x) => sum + x.weight, 0);
  let roll = Math.random() * total;

  for (const loot of lootTable) {
    if (roll < loot.weight) {

      const invComp = player.getComponent("minecraft:inventory");
      if (!invComp) return;

      const container = (invComp as any).container;
      if (!container) return;

      const itemType = ItemTypes.get(loot.item);
      if (!itemType) return;

      const item = new ItemStack(itemType, 1);
      container.addItem(item);

      player.sendMessage(`§bYou fished up a ${loot.name}!`);
      player.runCommand("playsound random.pop @s");
      return;
    }

    roll -= loot.weight;
  }
}

function getBait(player: Player): BaitType {
  const eq = player.getComponent("equippable") as any;
  const off = eq?.getEquipment(EquipmentSlot.Offhand);

  if (!off) return "none";

  switch (off.typeId) {
    case "pokeworld:common_bait":
      return "common_bait";

    case "pokeworld:rare_bait":
      return "rare_bait";

    case "pokeworld:shiny_bait":
      return "shiny_bait";

    case "pokeworld:loot_bait":
      return "loot_bait";

    default:
      return "none";
  }
}

function consumeBait(player: Player) {
  const eq = player.getComponent("equippable") as any;
  const off = eq?.getEquipment(EquipmentSlot.Offhand);

  if (!off) return;

  off.amount--;

  if (off.amount <= 0) {
    eq.setEquipment(EquipmentSlot.Offhand, undefined);
  } else {
    eq.setEquipment(EquipmentSlot.Offhand, off);
  }
}


// -----------------------------------------------
//          CATCH SUCCESS + SPAWNING FIX
// -----------------------------------------------

function onCatchSuccess(player: Player, rodType: RodType, pokemonId: string, hook: Entity) {

  const bait = getBait(player);
  const baitEffect = BAIT_EFFECTS[bait];
  const shinyBoost = baitEffect.shinyBoost ?? 0;

  const data = getFishingData(player);
  data.progress[rodType]++;
  data.catchStreak += 1 + shinyBoost;

  const SHINY_THRESHOLD = 25;
  let shinyTriggered = false;

  if (data.catchStreak >= SHINY_THRESHOLD) {
    shinyTriggered = true;
    data.catchStreak = 0;
  }

  saveFishingData(player, data);

  const hpKeys = ["pokeHP", "poke2HP", "poke3HP", "poke4HP", "poke5HP", "poke6HP"];
  const allDead = hpKeys.every(k =>
    (world.scoreboard.getObjective(k)?.getScore(player) ?? 0) <= 0
  );

  if (allDead) {
    hook.kill();
    player.sendMessage("§cYou shouldn’t fish without any usable Pokémon!");
    player.runCommand("playsound random.burp @s");
    return;
  }

  // -------------------------------------------------
  //                SHINY SPAWN (FIXED)
  // -------------------------------------------------

  if (shinyTriggered) {

    const spawnEvent = hasShinyCharm(player)
      ? "minecraft:sf_spawned"
      : "minecraft:sc_spawned";

    player.runCommand(
      `summon pokeworld:${pokemonId} ~ ~1 ~ ~ ~ ${spawnEvent}`
    );

    player.runCommand("playsound random.wildencounter @s");
    player.sendMessage("§eOh!!! A Wild Pokémon Appears!!!");
    player.sendMessage("§a::::You Reeled In A Catch!:::");
    hook.kill();
    return;
  }

  // -------------------------------------------------
  //                NORMAL SPAWN (FIXED)
  // -------------------------------------------------

  if (hasShinyCharm(player)) {
    player.runCommand(
      `summon pokeworld:${pokemonId} ~ ~1 ~ ~ ~ minecraft:sc_spawned`
    );
  } else {
    player.runCommand(`summon pokeworld:${pokemonId} ~ ~1 ~`);
  }

  player.runCommand("playsound random.wildencounter @s");
  player.sendMessage("§eOh!!! A Wild Pokémon Appears!!!");
  player.sendMessage("§a::::You Reeled In A Catch!:::");

  // -------------------------------------------------
  // Retrieve spawned Pokémon safely
  // -------------------------------------------------

  const spawned = [...player.dimension.getEntities({
    type: `pokeworld:${pokemonId}`,
    maxDistance: 6,
    location: player.location
  })][0];

  if (!spawned) {
    player.sendMessage("§cSomething went wrong... no Pokémon spawned.");
    hook.kill();
    return;
  }

  const entity = spawned;

  if (pokemonId.includes("ditto")) {
    player.sendMessage("§cOops! You can’t currently fight Ditto!");
    entity.kill();
    return;
  }

  if (entity.hasTag("battle")) {
    player.sendMessage("§cThis Pokémon is currently in a battle!");
    entity.kill();
    return;
  }

  entity.addTag(`ODW:${player.nameTag}`);
  entity.runCommand("scriptevent pokeworld:type_change");

  math(entity, player);

  player.sendMessage(`§e${grammarText(entity.typeId)} accepts to fight you!`);
  entity.dimension.spawnParticle("minecraft:basic_flame_particle", entity.getHeadLocation());
  entity.teleport(player.location);

  const direction = player.getViewDirection();
  player.applyKnockback({ x: direction.x * -2, z: direction.z * -2 }, 0.5);

  player.runCommand("scoreboard players add @s fishing 1");
  player.addTag("next");
  player.addTag("battle");

  player.runCommand("title @s actionbar 0");
  entity.addTag("battle");

  entity.addEffect("slowness", 999999, { amplifier: 255, showParticles: false });

  hook.kill();
  // TODO: Use new battle api

  consumeBait(player);

  const equip = player.getComponent("equippable");
  const mainhand = equip?.getEquipment(EquipmentSlot.Mainhand);

  if (mainhand?.typeId === "minecraft:fishing_rod") {
    const rodTypeFromLore =
      mainhand.getLore()?.find(l => l.includes("Old Rod")) ? "old" :
        mainhand.getLore()?.find(l => l.includes("Good Rod")) ? "good" :
          mainhand.getLore()?.find(l => l.includes("Super Rod")) ? "super" : rodType;
    const rodItem = ItemTypes.get("fishing_rod");
    if (!rodItem) return;

    const newRod = new ItemStack(rodItem, 1);
    newRod.nameTag = mainhand.nameTag;

    updateRodLore(
      newRod,
      rodTypeFromLore as RodType,
      Math.floor(data.progress[rodType] / 25),
      data.progress[rodType],
      data.catchStreak
    );
    const equip = player.getComponent("equippable") as any;
    equip?.setEquipment?.(EquipmentSlot.Mainhand, newRod);
  }
}

// --------------------------------------------------------
//                     MAIN FISHING LOGIC
// --------------------------------------------------------

function handleFishing(hook: Entity) {
  const ownerName = hook.getDynamicProperty("owner") as string;
  const player = [...world.getPlayers()].find(p => p.name === ownerName);
  if (!player) return;

  const rodType = hook.getDynamicProperty("rodType") as RodType ?? "old";

  const bait = getBait(player);
  const baitEffect = BAIT_EFFECTS[bait];

  let roll = Math.floor(Math.random() * 100);

  const blockUnderHook = hook.dimension.getBlock(hook.location);
  if (!blockUnderHook || blockUnderHook.typeId !== "minecraft:water") {
    player.sendMessage("§cYou need to fish in water!");
    hook.kill();
    return;
  }

  // -------------------------------------------------
  // Loot Chance (modified by bait)
  // -------------------------------------------------

  const lootChance = 10 + (baitEffect.lootBoost ?? 0);

  if (roll < lootChance) {
    giveFishingLoot(player);
    hook.kill();
    return;
  }

  let mon: string | null = null;

  const rareBoost = baitEffect.rareBoost ?? 0;

  // -------------------------------------------------
  // Old Rod
  // -------------------------------------------------

  if (rodType === "old") {
    if (roll < 70 - rareBoost) mon = pickRandom(common);
    else if (roll < 85) mon = pickRandom(uncommon);
    else if (roll < 95 + rareBoost) mon = pickRandom(rare);
  }

  // -------------------------------------------------
  // Good Rod
  // -------------------------------------------------

  if (rodType === "good") {
    if (roll < 50 - rareBoost) mon = pickRandom(common);
    else if (roll < 70) mon = pickRandom(uncommon);
    else if (roll < 90 + rareBoost) mon = pickRandom(rare);
    else if (roll < 98 + rareBoost) mon = pickRandom(veryRare);
  }

  // -------------------------------------------------
  // Super Rod
  // -------------------------------------------------

  if (rodType === "super") {
    if (roll < 30 - rareBoost) mon = pickRandom(common);
    else if (roll < 55) mon = pickRandom(uncommon);
    else if (roll < 80 + rareBoost) mon = pickRandom(rare);
    else if (roll < 95 + rareBoost) mon = pickRandom(veryRare);
    else if (roll < 98 + rareBoost) mon = pickRandom(ultraRare);
  }

  if (mon) onCatchSuccess(player, rodType, mon, hook);
  else player.sendMessage("§c::::Darn...Not Even A Nibble:::");

  hook.kill();
}

// --------------------------------------------------------
//                     SCHEDULER
// --------------------------------------------------------

system.runInterval(() => {
  const overworld = world.getDimension("overworld");

  for (const hook of overworld.getEntities({ type: "minecraft:fishing_hook" })) {

    if (!hook?.isValid) continue;

    let hookPos: Vector3;
    try {
      hookPos = hook.location;
    } catch {
      continue;
    }

    if (!hook.hasTag("fishing")) {

      let block;
      try {
        block = overworld.getBlock(hookPos);
      } catch {
        continue;
      }

      const invalidSpot = !block || block.typeId !== "minecraft:water";

      if (invalidSpot) {

        const nearest = [...world.getPlayers()].reduce((a, b) => {
          if (!b.isValid) return a;
          try {
            return !a || distance(b.location, hookPos) < distance(a.location, hookPos) ? b : a;
          } catch {
            return a;
          }
        }, null as Player | null);

        try {
          hook.kill();
        } catch { }

        if (nearest?.isValid) {
          nearest.sendMessage("§cYou can’t fish outside of water!");
          nearest.runCommand("playsound random.burp @s");
        }

        continue;
      }

      hook.addTag("fishing");

      const nearest = [...world.getPlayers()].reduce((a, b) => {
        if (!b.isValid) return a;
        try {
          return !a || distance(b.location, hookPos) < distance(a.location, hookPos) ? b : a;
        } catch {
          return a;
        }
      }, null as Player | null);

      if (nearest?.isValid) {
        hook.setDynamicProperty("owner", nearest.name);
        hook.setDynamicProperty("rodType", getRodType(nearest));
        hook.setDynamicProperty("castTime", Date.now());
      }

      continue;
    }

    const cast = hook.getDynamicProperty("castTime") as number;
    const ownerName = hook.getDynamicProperty("owner") as string;
    const player = [...world.getPlayers()].find(p => p.name === ownerName);

    if (!cast || !player?.isValid) continue;

    const elapsed = Date.now() - cast;

    if (elapsed >= 3000 && elapsed < 4000 && !hook.getDynamicProperty("dot1")) {
      player.sendMessage("§7.");
      hook.setDynamicProperty("dot1", true);
    } else if (elapsed >= 6000 && elapsed < 7000 && !hook.getDynamicProperty("dot2")) {
      player.sendMessage("§7..");
      hook.setDynamicProperty("dot2", true);
    } else if (elapsed >= 9000 && elapsed < 10000 && !hook.getDynamicProperty("dot3")) {
      player.sendMessage("§7...");
      hook.setDynamicProperty("dot3", true);
    }

    if (elapsed >= 10000) {
      try {
        handleFishing(hook);
      } catch { }
    }
  }
}, 20);
