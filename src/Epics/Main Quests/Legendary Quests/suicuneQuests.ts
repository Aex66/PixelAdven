import { world, Player, ItemStack } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { readPokemon } from "../../Pokemon Database/main";
import { Battle } from "../../Pokemon Battles/classes/Battle";
import { PlayerBattler, WildBattler } from "../../Pokemon Battles/classes/Battler";
import { Pokemon } from "../../Pokemon Battles/classes/Pokemon";
import { math } from "../../Pokemon Calculations/main";
import { progressLegendaryCatch } from "./legendaryQuestUtils";

// Register entity hit triggers
world.afterEvents.entityHitEntity.subscribe(({ damagingEntity, hitEntity }) => {
  if (!(damagingEntity instanceof Player)) return;

  if (hitEntity.typeId === "pokeworld:lake_hermit") {
    handleSuicuneNPC(damagingEntity);
  }

  if (hitEntity.typeId === "pokeworld:suicune_obelisk") {
    handleSuicuneShrine(damagingEntity);
  }
});
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

// Drop source data
const repairDrops: Record<string, string> = {
  "pokeworld:wild_slowpoke": "pokeworld:shimmering_pebble",
  "pokeworld:wild_shellder": "pokeworld:waterlogged_clay",
  "pokeworld:wild_poliwhirl": "pokeworld:ancient_stone"
};
const orbDrops: Record<string, string> = {
  "pokeworld:wild_vaporeon": "pokeworld:crystal_fang",
  "pokeworld:wild_lanturn": "pokeworld:tidal_heart",
  "pokeworld:wild_milotic": "pokeworld:glacier_mirror"
};

const repairKeys = ["shimmering_pebble", "waterlogged_clay", "ancient_stone"];
const orbKeys = ["crystal_fang", "tidal_heart", "glacier_mirror"];

// Drop logic
export function runSuicuneDropLogic(player: Player, typeId: string) {
  const stage = player.getDynamicProperty("quest_suicune_stage");
  if (typeof stage !== "number") return;

  const dropTable = stage === 1 ? repairDrops : stage === 2 ? orbDrops : null;
  const keys = stage === 1 ? repairKeys : stage === 2 ? orbKeys : null;
  if (!dropTable || !keys) return;

  const itemId = dropTable[typeId];
  if (!itemId) return;

  const key = itemId.split(":")[1];
  const alreadyGot = player.getDynamicProperty(`suicune_${key}`) === true;
  if (alreadyGot) return;

  if (Math.random() > 0.25) return;

  const inv = player.getComponent("inventory")?.container;
  if (inv) {
    inv.addItem(new ItemStack(itemId, 1));
    player.sendMessage(`§eYou obtained a §f${key.replace(/_/g, " ")}§e!`);
  }

  player.setDynamicProperty(`suicune_${key}`, true);

  const gotAll = keys.every(k => player.getDynamicProperty(`suicune_${k}`) === true);
  if (gotAll) {
    player.setDynamicProperty("quest_suicune_stage", stage + 1);
    const msg = stage === 1 ? "§6You've gathered the shrine materials. Continue collecting the relics." : "§eThe relics are yours. Return to the Hermit.";
    player.sendMessage(msg);
  }
}

function handleSuicuneNPC(player: Player) {
    // --- CHAPTER 6 GATEKEEPER ---
  const chapter6 = Number(player.getDynamicProperty("quest_chapter6_stage") ?? 0);

  // Player must begin Chapter 6 before doing Articuno quest
  if (chapter6 < 1) {
    player.sendMessage("§cYou must begin §5Story Quest – Chapter 6§c before starting the Articuno quest!");
    return;
  }
  // --- END GATEKEEPER ---
  const stage = Number(player.getDynamicProperty("quest_suicune_stage") ?? 0);
  const hasCaught = Object.keys(readPokemon(player, "Suicune", false)).length > 0;
  const summoned = player.getDynamicProperty("quest_suicune_summoned") === true;

  const form = new ActionFormData().title("§bSuicune Quest");
  let responseMap: string[] = [];

  const caughtAndCompleted = hasCaught && stage >= 7;

  if (caughtAndCompleted) {
    form.body("§cYou've already caught Suicune. To challenge it again, you must complete the quest again.");
    form.button("§7No thanks");
    form.button("§cRestart Quest");
    responseMap = ["no", "reset"];
  } else if (summoned) {
    form.body("§6You failed to catch Suicune. You may try again with a second Mist Orb.");
    form.button("Give me another chance");
    responseMap = ["retry"];
  } else {
    switch (stage) {
      case 0:
        form.body("§fThe sacred waters have dried. Help restore the purity.");
        form.button("Begin Quest");
        responseMap = ["start"];
        break;
      case 1:
        form.body("§fDefeat Water Pokémon to obtain:\n• Shimmering Pebble\n• Waterlogged Clay\n• Ancient Stone");
        form.button("Still hunting...");
        responseMap = ["progress"];
        break;
      case 2:
        form.body("§fDefeat strong Water Pokémon to obtain:\n• Crystal Fang\n• Tidal Heart\n• Glacier Mirror");
        form.button("Still hunting...");
        responseMap = ["hunt"];
        break;
      case 3:
        form.body("§fYou've gathered shrine parts. Receive a Repair Kit.");
        form.button("Exchange for Kit");
        responseMap = ["get_kit"];
        break;
      case 4:
        form.body("§fYou’ve proven yourself. Take this Mist Orb to the shrine.");
        form.button("Receive Mist Orb");
        responseMap = ["get_orb"];
        break;
      case 5:
        form.body("§fUse the Repair Kit on the Obelisk to fix it.");
        form.button("On my way!");
        responseMap = ["go"];
        break;
      case 6:
        form.body("§fUse the Mist Orb at the shrine to summon Suicune.");
        form.button("Summon Suicune");
        responseMap = ["summon"];
        break;
      case 7:
        form.body("§aYou caught Suicune! Your legend grows.");
        form.button("Thank you");
        responseMap = ["done"];
        break;
      default:
        form.body("§cUnknown stage. Please contact an Admin.");
        form.button("OK");
        responseMap = ["error"];
    }
  }

  form.show(player).then(res => {
    if (res.canceled) return;
    const choice = responseMap[res.selection];

    if (choice === "reset") {
      player.setDynamicProperty("quest_suicune_stage", 0);
      player.setDynamicProperty("quest_suicune_summoned", false);
      for (const key of [...repairKeys, ...orbKeys]) {
        player.setDynamicProperty(`suicune_${key}`, false);
      }
      player.sendMessage("§bThe Suicune quest has been reset. Speak to the Hermit again to begin.");
      return;
    }

    const inv = player.getComponent("inventory")?.container;

if (choice === "retry") {
  let hasOrb = false;

  for (let i = 0; i < inv?.size; i++) {
    const item = inv.getItem(i);
    if (item?.typeId === "pokeworld:mist_orb") {
      hasOrb = true;
      break;
    }
  }

  if (!hasOrb) {
    inv?.addItem(new ItemStack("pokeworld:mist_orb", 1));
    player.sendMessage("§eHere’s another chance. Use this orb wisely.");
  } else {
    player.sendMessage("§6You already have a Mist Orb.");
  }

  // 🔑 ALLOW RESUMMON AFTER FAILED ATTEMPT
  player.setDynamicProperty("quest_suicune_summoned", false);
  // ^ change the key if your quest name differs

  return;
}

    switch (choice) {
      case "start":
        player.setDynamicProperty("quest_suicune_stage", 1);
        player.sendMessage("§aThe quest begins!");
        break;
      case "get_kit":
        removeRelicItems(player, repairKeys);
        inv?.addItem(new ItemStack("pokeworld:repair_kit", 1));
        player.setDynamicProperty("quest_suicune_stage", 5);
        break;
      case "get_orb":
        removeRelicItems(player, orbKeys);
        player.runCommand("give @s pokeworld:mist_orb 1");
        player.setDynamicProperty("quest_suicune_stage", 6);
        break;
      case "done":
        player.setDynamicProperty("quest_suicune_stage", 8); // lock Entei quest completed
        player.sendMessage("§aSuicune has joined your journey!");
        progressLegendaryCatch(player, "Suicune");

        break;
    }
  });
}
function handleSuicuneShrine(player: Player) {
  const stage = player.getDynamicProperty("quest_suicune_stage") ?? 0;
  const summoned = player.getDynamicProperty("quest_suicune_summoned") === true;
  const hasCaught = Object.keys(readPokemon(player, "Suicune", false)).length > 0;
  const inv = player.getComponent("inventory")?.container;

  if (hasCaught) {
    player.sendMessage("§6You already caught Suicune. You must redo the quest to try again.");
    return;
  }

  if (summoned) {
    player.sendMessage("§6You already summoned Suicune. Return if you caught it.");
    return;
  }

  if (stage === 5) {
    let kitSlot = -1;
    for (let i = 0; i < inv?.size; i++) {
      const item = inv.getItem(i);
      if (item?.typeId === "pokeworld:repair_kit") {
        kitSlot = i;
        break;
      }
    }

    if (kitSlot !== -1) {
      inv.setItem(kitSlot, undefined);
      player.runCommand("event entity @e[type=pokeworld:suicune_obelisk,r=3] fix");
      player.sendMessage("§eYou repaired the obelisk. Now use the orb to summon Suicune.");
    } else {
      player.sendMessage("§cYou need a Repair Kit to restore the shrine.");
    }

    return;
  }

  if (stage === 6) {
    const hpKeys = ["pokeHP", "poke2HP", "poke3HP", "poke4HP", "poke5HP", "poke6HP"];
    const allDead = hpKeys.every(key => {
      const score = world.scoreboard.getObjective(key)?.getScore(player) ?? 0;
      return score <= 0;
    });

    if (allDead) {
      player.sendMessage(`§cYou don't have any Pokemon left to fight!`);
      return;
    }

    let orbSlot = -1;
    for (let i = 0; i < inv?.size; i++) {
      const item = inv.getItem(i);
      if (item?.typeId === "pokeworld:mist_orb") {
        orbSlot = i;
        break;
      }
    }

    if (orbSlot !== -1) {
      inv.setItem(orbSlot, undefined);
      player.setDynamicProperty("quest_suicune_summoned", true);
      player.setDynamicProperty("quest_suicune_stage", 7);
      player.runCommand("event entity @e[type=pokeworld:suicune_obelisk,r=3] break");

      const loc = player.location;
      const entity = player.dimension.spawnEntity("pokeworld:wild_suicune" as any, {
        x: loc.x,
        y: loc.y + 1,
        z: loc.z
      });

      if (!entity) return player.sendMessage("§cFailed to summon Suicune.");

      entity.addTag(`ODW:${player.nameTag}`);
      entity.runCommand(`scriptevent pokeworld:type_change`);
      math(entity, player);

      player.sendMessage(`§eSuicune accepts to fight you!`);
      entity.dimension.spawnParticle(`minecraft:basic_flame_particle`, entity.getHeadLocation());

      entity.teleport(player.location);
      let direction = player.getViewDirection();
      player.applyKnockback({ x: direction.x * -2, z: direction.z * -2 }, 0.5);

      const playerBattler = new PlayerBattler(player);
      const wildPokemon = new WildBattler(entity);
      wildPokemon.pokemon = new Pokemon(entity, wildPokemon);

      const battle = new Battle(playerBattler, wildPokemon);

      player.addTag('next');
      player.addTag('battle');
      player.runCommand('title @s actionbar 0');
      entity.addTag("battle");
      entity.addEffect('slowness', 999999, { amplifier: 255, showParticles: false });

      battle.start();

      player.sendMessage("§eSuicune glides across the water’s surface...");
    } else {
      player.sendMessage("§cYou must have a Mist Orb to summon Suicune.");
    }

    return;
  }

  player.sendMessage("§cNothing happens...");
}
