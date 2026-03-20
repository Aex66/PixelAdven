import { world, Player, ItemStack } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { readPokemon } from "../../Pokemon Database/main";
import { math } from "../../Pokemon Calculations/main";
import { grammarText } from "../../../Papers/Paragraphs/ExtrasParagraphs";
import { PlayerBattler, WildBattler } from "../../Pokemon Battles/classes/Battler";
import { Pokemon } from "../../Pokemon Battles/classes/Pokemon";
import { Battle } from "../../Pokemon Battles/classes/Battle";
import { progressLegendaryCatch } from "./legendaryQuestUtils";

// Register entity hit triggers
world.afterEvents.entityHitEntity.subscribe(({ damagingEntity, hitEntity }) => {
  if (!(damagingEntity instanceof Player)) return;

  if (hitEntity.typeId === "pokeworld:tower_guardian") {
    handleEnteiNPC(damagingEntity);
  }

  if (hitEntity.typeId === "pokeworld:entei_obelisk") {
    handleEnteiShrine(damagingEntity);
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
  "pokeworld:wild_slugma": "pokeworld:charred_brick",
  "pokeworld:wild_camerupt": "pokeworld:lava_fragment",
  "pokeworld:wild_magcargo": "pokeworld:obsidian_plate"
};
const orbDrops: Record<string, string> = {
  "pokeworld:wild_arcanine": "pokeworld:ember_tooth",
  "pokeworld:wild_houndoom": "pokeworld:flame_shard",
  "pokeworld:wild_flareon": "pokeworld:blazing_fur"
};

const repairKeys = ["charred_brick", "lava_fragment", "obsidian_plate"];
const orbKeys = ["ember_tooth", "flame_shard", "blazing_fur"];

// Drop logic
export function runEnteiDropLogic(player: Player, typeId: string) {
  const stage = player.getDynamicProperty("quest_entei_stage");
  if (typeof stage !== "number") return;

  const dropTable = stage === 1 ? repairDrops : stage === 2 ? orbDrops : null;
  const keys = stage === 1 ? repairKeys : stage === 2 ? orbKeys : null;
  if (!dropTable || !keys) return;

  const itemId = dropTable[typeId];
  if (!itemId) return;

  const key = itemId.split(":")[1];
  const alreadyGot = player.getDynamicProperty(`entei_${key}`) === true;
  if (alreadyGot) return;

  if (Math.random() > 0.25) return;

  const inv = player.getComponent("inventory")?.container;
  if (inv) {
    inv.addItem(new ItemStack(itemId, 1));
    player.sendMessage(`§eYou obtained a §f${key.replace(/_/g, " ")}§e!`);
  }

  player.setDynamicProperty(`entei_${key}`, true);

  const gotAll = keys.every(k => player.getDynamicProperty(`entei_${k}`) === true);
  if (gotAll) {
    player.setDynamicProperty("quest_entei_stage", stage + 1);
    const msg =
      stage === 1
        ? "§6You've gathered the shrine materials. Continue collecting the relics."
        : "§eThe relics are yours. Return to the Guardian.";
    player.sendMessage(msg);
  }
}

function handleEnteiNPC(player: Player) {
  // --- CHAPTER 6 GATEKEEPER ---
  const chapter6 = Number(player.getDynamicProperty("quest_chapter6_stage") ?? 0);
  if (chapter6 < 1) {
    player.sendMessage("§cYou must begin §5Story Quest – Chapter 6§c before starting the Articuno quest!");
    return;
  }
  // --- END GATEKEEPER ---

  const stage = Number(player.getDynamicProperty("quest_entei_stage") ?? 0);
  const hasCaught = Object.keys(readPokemon(player, "Entei", false)).length > 0;
  const summoned = player.getDynamicProperty("quest_entei_summoned") === true;

  const form = new ActionFormData().title("§cEntei Quest");
  let responseMap: string[] = [];

  const caughtAndCompleted = hasCaught && stage >= 7;

  if (caughtAndCompleted) {
    form.body("§cYou've already caught Entei. To challenge it again, you must complete the quest again.");
    form.button("§7No thanks");
    form.button("§cRestart Quest");
    responseMap = ["no", "reset"];
  } else if (summoned) {
    form.body("§6You failed to catch Entei. You may try again with a second Inferno Orb.");
    form.button("Give me another chance");
    responseMap = ["retry"];
  } else {
    switch (stage) {
      case 0:
        form.body("§fThe Burnt Tower’s core is dormant. Help relight the flame.");
        form.button("Begin Quest");
        responseMap = ["start"];
        break;
      case 1:
        form.body("§fDefeat Fire Pokémon to obtain:\n• Charred Brick\n• Lava Fragment\n• Obsidian Plate");
        form.button("Still hunting...");
        responseMap = ["progress"];
        break;
      case 2:
        form.body("§fDefeat strong Fire Pokémon to obtain:\n• Ember Tooth\n• Flame Shard\n• Blazing Fur");
        form.button("Still hunting...");
        responseMap = ["hunt"];
        break;
      case 3:
        form.body("§fYou've gathered shrine parts. Receive a Repair Kit.");
        form.button("Exchange for Kit");
        responseMap = ["get_kit"];
        break;
      case 4:
        form.body("§fYou’ve proven yourself. Take this Inferno Orb to the shrine.");
        form.button("Receive Inferno Orb");
        responseMap = ["get_orb"];
        break;
      case 5:
        form.body("§fUse the Repair Kit on the Obelisk to fix it.");
        form.button("On my way!");
        responseMap = ["go"];
        break;
      case 6:
        form.body("§fUse the Inferno Orb at the shrine to summon Entei.");
        form.button("Summon Entei");
        responseMap = ["summon"];
        break;
      case 7:
        form.body("§aYou caught Entei! Your legend grows.");
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
    const inv = player.getComponent("inventory")?.container;

    if (choice === "reset") {
      player.setDynamicProperty("quest_entei_stage", 0);
      player.setDynamicProperty("quest_entei_summoned", false);
      for (const key of [...repairKeys, ...orbKeys]) {
        player.setDynamicProperty(`entei_${key}`, false);
      }
      player.sendMessage("§6The Entei quest has been reset. Speak to the Guardian again to begin.");
      return;
    }

    if (choice === "retry") {
      let hasOrb = false;
      for (let i = 0; i < inv?.size; i++) {
        if (inv.getItem(i)?.typeId === "pokeworld:inferno_orb") {
          hasOrb = true;
          break;
        }
      }

      if (!hasOrb) {
        inv?.addItem(new ItemStack("pokeworld:inferno_orb", 1));
        player.sendMessage("§eHere’s another chance. Use this orb wisely.");
      } else {
        player.sendMessage("§6You already have an Inferno Orb.");
      }

      player.setDynamicProperty("quest_entei_summoned", false);
      return;
    }

    switch (choice) {
      case "start":
        player.setDynamicProperty("quest_entei_stage", 1);
        player.sendMessage("§aThe quest begins!");
        break;

      case "get_kit":
        removeRelicItems(player, repairKeys); // ✅ FIX
        inv?.addItem(new ItemStack("pokeworld:repair_kit", 1));
        player.setDynamicProperty("quest_entei_stage", 5);
        break;

      case "get_orb":
        removeRelicItems(player, orbKeys); // ✅ FIX (was broken allKeys)
        player.runCommand("give @s pokeworld:inferno_orb 1");
        player.setDynamicProperty("quest_entei_stage", 6);
        break;

      case "done":
        player.setDynamicProperty("quest_entei_stage", 8);
        player.sendMessage("§aEntei has joined your journey!");
        progressLegendaryCatch(player, "Entei");
        break;
    }
  });
}

function handleEnteiShrine(player: Player) {
  const stage = player.getDynamicProperty("quest_entei_stage") ?? 0;
  const summoned = player.getDynamicProperty("quest_entei_summoned") === true;
  const hasCaught = Object.keys(readPokemon(player, "Entei", false)).length > 0;
  const inv = player.getComponent("inventory")?.container;

  if (hasCaught) {
    player.sendMessage("§6You already caught Entei. You must redo the quest to try again.");
    return;
  }

  if (summoned) {
    player.sendMessage("§6You already summoned Entei. Return if you caught it.");
    return;
  }

  if (stage === 5) {
    let kitSlot = -1;
    for (let i = 0; i < inv?.size; i++) {
      if (inv.getItem(i)?.typeId === "pokeworld:repair_kit") {
        kitSlot = i;
        break;
      }
    }

    if (kitSlot !== -1) {
      inv.setItem(kitSlot, undefined);
      player.runCommand("event entity @e[type=pokeworld:entei_obelisk,r=3] fix");
      player.sendMessage("§eYou repaired the obelisk. Now use the orb to summon Entei.");
    } else {
      player.sendMessage("§cYou need a Repair Kit to restore the shrine.");
    }
    return;
  }

  if (stage === 6) {
    const hpKeys = ["pokeHP", "poke2HP", "poke3HP", "poke4HP", "poke5HP", "poke6HP"];
    const allDead = hpKeys.every(k => (world.scoreboard.getObjective(k)?.getScore(player) ?? 0) <= 0);
    if (allDead) {
      player.sendMessage("§cYou don't have any Pokémon left to fight!");
      return;
    }

    let orbSlot = -1;
    for (let i = 0; i < inv?.size; i++) {
      if (inv.getItem(i)?.typeId === "pokeworld:inferno_orb") {
        orbSlot = i;
        break;
      }
    }

    if (orbSlot !== -1) {
      inv.setItem(orbSlot, undefined);
      player.setDynamicProperty("quest_entei_summoned", true);
      player.setDynamicProperty("quest_entei_stage", 7);
      player.runCommand("event entity @e[type=pokeworld:entei_obelisk,r=3] break");

      const loc = player.location;
      const entei = player.dimension.spawnEntity("pokeworld:wild_entei" as any, {
        x: loc.x,
        y: loc.y + 1,
        z: loc.z
      });

      entei.addTag(`ODW:${player.nameTag}`);
      entei.runCommand(`scriptevent pokeworld:type_change`);
      math(entei, player);

      player.sendMessage(`§e${grammarText(entei.typeId)} accepts to fight you!`);
      entei.dimension.spawnParticle(`minecraft:basic_flame_particle`, entei.getHeadLocation());
      entei.teleport(player.location);

      const direction = player.getViewDirection();
      player.applyKnockback({ x: direction.x * -2, z: direction.z * -2 }, 0.5);

      const playerBattler = new PlayerBattler(player);
      const wildBattler = new WildBattler(entei);
      wildBattler.pokemon = new Pokemon(entei, wildBattler);

      const battle = new Battle(playerBattler, wildBattler);
      player.addTag("next");
      player.addTag("battle");
      player.runCommand("title @s actionbar 0");
      entei.addTag("battle");
      entei.addEffect("slowness", 999999, { amplifier: 255, showParticles: false });

      battle.start();
      player.sendMessage("§eEntei erupts from the volcanic blaze...");
    } else {
      player.sendMessage("§cYou must have an Inferno Orb to summon Entei.");
    }
    return;
  }

  player.sendMessage("§cNothing happens...");
}
