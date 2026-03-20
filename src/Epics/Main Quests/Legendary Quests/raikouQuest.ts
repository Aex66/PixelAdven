import { world, Player, ItemStack } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { readPokemon } from "../../Pokemon Database/main";
import { grammarText } from "../../../Papers/Paragraphs/ExtrasParagraphs";
import { Battle } from "../../Pokemon Battles/classes/Battle";
import { PlayerBattler, WildBattler } from "../../Pokemon Battles/classes/Battler";
import { Pokemon } from "../../Pokemon Battles/classes/Pokemon";
import { math } from "../../Pokemon Calculations/main";
import { progressLegendaryCatch } from "./legendaryQuestUtils";

// Register entity hit triggers
world.afterEvents.entityHitEntity.subscribe(({ damagingEntity, hitEntity }) => {
  if (!(damagingEntity instanceof Player)) return;

  if (hitEntity.typeId === "pokeworld:tower_hermit") {
    handleRaikouNPC(damagingEntity);
  }

  if (hitEntity.typeId === "pokeworld:raikou_obelisk") {
    handleRaikouShrine(damagingEntity);
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
  "pokeworld:wild_rhyhorn": "pokeworld:cracked_column",
  "pokeworld:wild_bonsly": "pokeworld:ancient_brick",
  "pokeworld:wild_geodude": "pokeworld:mystic_rubble"
};
const orbDrops: Record<string, string> = {
  "pokeworld:wild_jolteon": "pokeworld:stormhide_shard",
  "pokeworld:wild_mareep": "pokeworld:sparked_mane",
  "pokeworld:wild_rotom": "pokeworld:charged_core"
};

const repairKeys = ["cracked_column", "ancient_brick", "mystic_rubble"];
const orbKeys = ["stormhide_shard", "sparked_mane", "charged_core"];

// Drop logic
export function runRaikouDropLogic(player: Player, typeId: string) {
  const stage = player.getDynamicProperty("quest_raikou_stage");
  if (typeof stage !== "number") return;

  const dropTable = stage === 1 ? repairDrops : stage === 3 ? orbDrops : null;
  const keys = stage === 1 ? repairKeys : stage === 3 ? orbKeys : null;
  if (!dropTable || !keys) return;

  const itemId = dropTable[typeId];
  if (!itemId) return;

  const key = itemId.split(":")[1];
  const alreadyGot = player.getDynamicProperty(`raikou_${key}`) === true;
  if (alreadyGot) return;

  if (Math.random() > 0.25) return;

  const inv = player.getComponent("inventory")?.container;
  if (inv) {
    inv.addItem(new ItemStack(itemId, 1));
    player.sendMessage(`§eYou obtained a §f${key.replace(/_/g, " ")}§e!`);
  }

  player.setDynamicProperty(`raikou_${key}`, true);

  const gotAll = keys.every(k => player.getDynamicProperty(`raikou_${k}`) === true);
  if (gotAll) {
    player.setDynamicProperty("quest_raikou_stage", stage + 1);
    const msg = stage === 1
      ? "§6You've gathered the shrine materials. Return to the Hermit."
      : "§eThe relics are yours. Return to the Hermit.";
    player.sendMessage(msg);
  }
}

function handleRaikouNPC(player: Player) {
  // --- CHAPTER 6 GATEKEEPER ---
  const chapter6 = Number(player.getDynamicProperty("quest_chapter6_stage") ?? 0);

  // Player must begin Chapter 6 before doing Articuno quest
  if (chapter6 < 1) {
    player.sendMessage("§cYou must begin §5Story Quest – Chapter 6§c before starting the Articuno quest!");
    return;
  }
  // --- END GATEKEEPER ---
  const stage = Number(player.getDynamicProperty("quest_raikou_stage") ?? 0);
  const hasCaught = Object.keys(readPokemon(player, "Raikou", false)).length > 0;
  const summoned = player.getDynamicProperty("quest_raikou_summoned") === true;

  const form = new ActionFormData().title("§6Raikou Quest");
  let responseMap: string[] = [];

  const caughtAndCompleted = hasCaught && stage >= 7;

  if (caughtAndCompleted) {
    form.body("§cYou've already caught Raikou. To challenge it again, you must complete the quest again.");
    form.button("§7No thanks");
    form.button("§cRestart Quest");
    responseMap = ["no", "reset"];
  } else if (summoned) {
    form.body("§6You failed to catch Raikou. You may try again with a second Static Orb.");
    form.button("Give me another chance");
    responseMap = ["retry"];
  } else {
    switch (stage) {
      case 0:
        form.body("§fThe Burnt Tower Obelisk lies in ruin. Help restore it.");
        form.button("Begin Quest");
        responseMap = ["start"];
        break;
      case 1:
        form.body("§fDefeat Rock Pokémon to obtain:\n• Cracked Column\n• Ancient Brick\n• Mystic Rubble");
        form.button("Still hunting...");
        responseMap = ["progress"];
        break;
      case 2:
        form.body("§fYou’ve gathered shrine parts. Receive a Repair Kit.");
        form.button("Exchange for Kit");
        responseMap = ["get_kit"];
        break;
      case 3:
        form.body("§fDefeat Electric Pokémon to obtain:\n• Stormhide Shard\n• Sparked Mane\n• Charged Core");
        form.button("Still hunting...");
        responseMap = ["hunt"];
        break;
      case 4:
        form.body("§fYou’ve proven yourself. Take this Static Orb to the shrine.");
        form.button("Receive Static Orb");
        responseMap = ["get_orb"];
        break;
      case 5:
        form.body("§fUse the Repair Kit on the Obelisk to fix it.");
        form.button("On my way!");
        responseMap = ["go_repair"];
        break;
      case 6:
        form.body("§fUse the Static Orb at the shrine to summon Raikou.");
        form.button("Summon Raikou");
        responseMap = ["summon"];
        break;
      case 7:
        form.body("§aYou caught Raikou! Your legend grows.");
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
      player.setDynamicProperty("quest_raikou_stage", 0);
      player.setDynamicProperty("quest_raikou_summoned", false);
      for (const key of [...repairKeys, ...orbKeys]) {
        player.setDynamicProperty(`raikou_${key}`, false);
      }
      player.sendMessage("§6The Raikou quest has been reset. Speak to the Hermit again to begin.");
      return;
    }

    const inv = player.getComponent("inventory")?.container;

    if (choice === "retry") {
      let hasOrb = false;

      for (let i = 0; i < inv?.size; i++) {
        const item = inv.getItem(i);
        if (item?.typeId === "pokeworld:static_orb") {
          hasOrb = true;
          break;
        }
      }

      if (!hasOrb) {
        inv?.addItem(new ItemStack("pokeworld:static_orb", 1));
        player.sendMessage("§eHere’s another chance. Use this orb wisely.");
      } else {
        player.sendMessage("§6You already have a Static Orb.");
      }

      // 🔑 ALLOW RESUMMON AFTER FAILED ATTEMPT
      player.setDynamicProperty("quest_raikou_summoned", false);
      // ^ change the key if your quest name differs

      return;
    }


    switch (choice) {
      case "start":
        player.setDynamicProperty("quest_raikou_stage", 1);
        player.sendMessage("§aThe quest begins!");
        break;
      case "get_kit":
        removeRelicItems(player, repairKeys);
        inv?.addItem(new ItemStack("pokeworld:repair_kit", 1));
        player.setDynamicProperty("quest_raikou_stage", 3);
        break;
      case "get_orb":
        removeRelicItems(player, orbKeys);
        player.runCommand("give @s pokeworld:static_orb 1");
        player.setDynamicProperty("quest_raikou_stage", 5);
        break;
      case "done":
        player.setDynamicProperty("quest_raikou_stage", 8); // lock Entei quest completed
        player.sendMessage("§aRaikou has joined your journey!");
        progressLegendaryCatch(player, "Raikou");

        break;
    }
  });
}
function handleRaikouShrine(player: Player) {
  const stage = player.getDynamicProperty("quest_raikou_stage") ?? 0;
  const summoned = player.getDynamicProperty("quest_raikou_summoned") === true;
  const hasCaught = Object.keys(readPokemon(player, "Raikou", false)).length > 0;
  const inv = player.getComponent("inventory")?.container;

  if (hasCaught) {
    player.sendMessage("§6You already caught Raikou. You must redo the quest to try again.");
    return;
  }

  if (summoned) {
    player.sendMessage("§6You already summoned Raikou. Return if you caught it.");
    return;
  }

  // Stage 5: Use Repair Kit
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
      player.runCommand("event entity @e[type=pokeworld:raikou_obelisk,r=3] fix");
      player.setDynamicProperty("quest_raikou_stage", 6);
      player.sendMessage("§eYou repaired the obelisk. Now use the Static Orb.");
    } else {
      player.sendMessage("§cYou need a Repair Kit to restore the shrine.");
    }

    return;
  }

  // Stage 6: Use orb to summon
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
      if (item?.typeId === "pokeworld:static_orb") {
        orbSlot = i;
        break;
      }
    }

    if (orbSlot !== -1) {
      inv.setItem(orbSlot, undefined);
      player.setDynamicProperty("quest_raikou_summoned", true);
      player.setDynamicProperty("quest_raikou_stage", 7);
      player.runCommand("event entity @e[type=pokeworld:raikou_obelisk,r=3] break");

      const loc = player.location;
      const entity = player.dimension.spawnEntity("pokeworld:wild_raikou" as any, {
        x: loc.x,
        y: loc.y + 1,
        z: loc.z
      });

      if (!entity) return player.sendMessage("§cFailed to summon Raikou.");

      entity.addTag(`ODW:${player.nameTag}`);
      entity.runCommand(`scriptevent pokeworld:type_change`);
      math(entity, player);

      player.sendMessage(`§e${grammarText(entity.typeId)} accepts to fight you!`);
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

      player.sendMessage("§eRaikou roars from the storm...");
    } else {
      player.sendMessage("§cYou must have a Static Orb to summon Raikou.");
    }

    return;
  }

  player.sendMessage("§cNothing happens...");
}
