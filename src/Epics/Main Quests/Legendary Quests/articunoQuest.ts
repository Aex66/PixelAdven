import { world, Player, ItemStack } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
import { readPokemon } from '../../Pokemon Database/main';
import { math } from '../../Pokemon Calculations/main';
import { grammarText } from '../../../Papers/Paragraphs/ExtrasParagraphs';
import { progressLegendaryCatch } from './legendaryQuestUtils';

function titleCase(text: string): string {
  return text.replace(/\w\S*/g, word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  );
}
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

// Register entity hit triggers
world.afterEvents.entityHitEntity.subscribe(({ damagingEntity, hitEntity }) => {
  if (!(damagingEntity instanceof Player)) return;

  if (hitEntity.typeId === "pokeworld:npc_frost_researcher") {
    handleArticunoNPC(damagingEntity);
  }

  if (hitEntity.typeId === "pokeworld:articuno_shrine") {
    handleArticunoShrine(damagingEntity);
  }
});

// Item drop logic
const dropSources: Record<string, string> = {
  "pokeworld:wild_piloswine": "pokeworld:frost_crystal",
  "pokeworld:wild_sneasel": "pokeworld:frozen_feather",
  "pokeworld:wild_snorunt": "pokeworld:ancient_ice"
};
const allKeys = ["frost_crystal", "frozen_feather", "ancient_ice"];

export function runArticunoDropLogic(player: Player, typeId: string) {
  const stage = player.getDynamicProperty("quest_articuno_stage");
  if (typeof stage !== "number" || stage !== 1) return;

  const itemId = dropSources[typeId];
  if (!itemId) return;

  const key = itemId.split(":")[1];
  const alreadyGot = player.getDynamicProperty(`articuno_${key}`) === true;
  if (alreadyGot) return;

  if (Math.random() > 0.25) return;

  const inv = player.getComponent("inventory")?.container;
  if (inv) {
    inv.addItem(new ItemStack(itemId, 1));
    player.sendMessage(`§bYou obtained a §f${key.replace(/_/g, " ")}§b!`);
  }

  player.setDynamicProperty(`articuno_${key}`, true);

  const gotAll = allKeys.every(k => player.getDynamicProperty(`articuno_${k}`) === true);
  if (gotAll) {
    player.setDynamicProperty("quest_articuno_stage", 2);
    player.sendMessage("§bYou’ve gathered the frozen relics. Return to the Ice Sage.");
  }
}

// Quest logic
function handleArticunoNPC(player: Player) {
  // --- CHAPTER 6 GATEKEEPER ---
  const chapter6 = Number(player.getDynamicProperty("quest_chapter6_stage") ?? 0);
  if (chapter6 < 1) {
    player.sendMessage("§cYou must begin §5Story Quest – Chapter 6§c before starting the Articuno quest!");
    return;
  }
  // --- END GATEKEEPER ---

  const stage = Number(player.getDynamicProperty("quest_articuno_stage") ?? 0);

  // ✅ FIX: stage 0 can NEVER be summoned
  if (stage === 0 && player.getDynamicProperty("quest_articuno_summoned") === true) {
    player.setDynamicProperty("quest_articuno_summoned", false);
  }

  const hasCaught = hasCaughtLegendary(player, "Articuno");
  const summoned = player.getDynamicProperty("quest_articuno_summoned") === true;

  const form = new ActionFormData().title("§bArticuno Quest");
  let responseMap: string[] = [];

  const caughtAndCompleted = hasCaught && stage >= 5;

  if (caughtAndCompleted) {
    form.body("§cYou've already caught Articuno. To challenge it again, you must complete the quest again.");
    form.button("§7No thanks");
    form.button("§cRestart Quest");
    responseMap = ["no", "reset"];
  }
  else if (summoned) {
    form.body("§3You failed to catch Articuno last time. You may try again with a second Ice Orb.");
    form.button("Give me another chance");
    responseMap = ["retry"];
  }
  else {
    switch (stage) {
      case 0:
        form.body("§fBegin your journey to summon the legendary Articuno. Seek out frozen relics.");
        form.button("Begin Hunt");
        responseMap = ["start"];
        break;

      case 1: {
        const lines: string[] = [];
        for (const [pokemonId, itemId] of Object.entries(dropSources)) {
          const pokemonName = grammarText(pokemonId);
          const itemName = titleCase(itemId.split(":")[1].replace(/_/g, " "));
          lines.push(`§b• §f${itemName} §7(from §9${pokemonName}§7)`);
        }

        form.body("§fDefeat Ice Pokémon to obtain:\n\n" + lines.join("\n"));
        form.button("Still hunting...");
        responseMap = ["progress"];
        break;
      }

      case 2:
        form.body("§fYou've proven yourself. Take this Ice Orb to the shrine.");
        form.button("Receive Ice Orb");
        responseMap = ["get_orb"];
        break;

      case 3:
        form.body("§fUse the Ice Orb at the shrine to summon Articuno.");
        form.button("On my way!");
        responseMap = ["go"];
        break;

      case 4:
        form.body("§aYou caught Articuno! Your legend grows.");
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
      player.setDynamicProperty("quest_articuno_stage", 0);
      player.setDynamicProperty("quest_articuno_summoned", false);
      for (const key of allKeys) {
        player.setDynamicProperty(`articuno_${key}`, false);
      }
      player.sendMessage("§bThe Articuno quest has been reset. Speak to the NPC again to begin.");
      return;
    }

    const inv = player.getComponent("inventory")?.container;

    if (choice === "retry") {
      let hasOrb = false;

      for (let i = 0; i < inv?.size; i++) {
        const item = inv.getItem(i);
        if (item?.typeId === "pokeworld:ice_orb") {
          hasOrb = true;
          break;
        }
      }

      if (!hasOrb) {
        inv?.addItem(new ItemStack("pokeworld:ice_orb", 1));
        player.sendMessage("§bHere’s another chance. Use this orb wisely.");
      } else {
        player.sendMessage("§3You already have an Ice Orb.");
      }

      // 🔑 ALLOW RESUMMON AFTER FAILED ATTEMPT
      player.setDynamicProperty("quest_articuno_summoned", false);

      return;
    }

    switch (choice) {
      case "start":
        player.setDynamicProperty("quest_articuno_stage", 1);
        player.sendMessage("§aThe hunt begins!");
        break;

      case "get_orb":
        removeRelicItems(player, allKeys);
        player.runCommand("give @s pokeworld:ice_orb 1");
        player.setDynamicProperty("quest_articuno_stage", 3);
        break;

      case "done":
        player.setDynamicProperty("quest_articuno_stage", 5);
        player.sendMessage("§aArticuno has joined your journey!");
        player.setDynamicProperty("quest_chapter6_stage", 2);
        progressLegendaryCatch(player, "Articuno");
        break;
    }
  });
}

function handleArticunoShrine(player: Player) {
  const stage = player.getDynamicProperty("quest_articuno_stage") ?? 0;
  const summoned = player.getDynamicProperty("quest_articuno_summoned") === true;
  const hasCaught = hasCaughtLegendary(player, "Articuno");
  const inv = player.getComponent("inventory")?.container;

  if (hasCaught) {
    player.sendMessage("§bYou already caught Articuno. You must redo the quest to try again.");
    return;
  }

  if (summoned) {
    player.sendMessage("§3You already summoned Articuno. Return if you caught it.");
    return;
  }

  const hpKeys = ["pokeHP", "poke2HP", "poke3HP", "poke4HP", "poke5HP", "poke6HP"];
  const allDead = hpKeys.every(key => {
    const score = world.scoreboard.getObjective(key)?.getScore(player) ?? 0;
    return score <= 0;
  });

  if (allDead) {
    player.sendMessage(`§cYou don't have any Pokemon left to fight!`);
    return;
  }

  let orbSlotIndex = -1;
  for (let i = 0; i < inv?.size; i++) {
    const item = inv.getItem(i);
    if (item?.typeId === "pokeworld:ice_orb") {
      orbSlotIndex = i;
      break;
    }
  }

  if (stage === 3 && orbSlotIndex !== -1) {
    inv.setItem(orbSlotIndex, undefined);
    player.setDynamicProperty("quest_articuno_summoned", true);

    const loc = player.location;
    const entity = player.dimension.spawnEntity("pokeworld:wild_articuno" as any, {
      x: loc.x,
      y: loc.y + 1,
      z: loc.z
    });

    if (!entity) return player.sendMessage("§cFailed to summon Articuno.");

    entity.addTag(`ODW:${player.nameTag}`);
    entity.runCommand(`scriptevent pokeworld:type_change`);
    math(entity, player);

    player.sendMessage(`§e${grammarText(entity.typeId)} accepts to fight you!`);
    entity.dimension.spawnParticle(`minecraft:basic_flame_particle`, entity.getHeadLocation());

    entity.teleport(player.location);
    let direction = player.getViewDirection();
    player.applyKnockback({ x: direction.x * -2, z: direction.z * -2 }, 0.5);

    player.addTag('next');
    player.addTag('battle');
    player.runCommand('title @s actionbar 0');
    entity.addTag("battle");
    entity.addEffect('slowness', 999999, { amplifier: 255, showParticles: false });

    // TODO: Use new battle api
    player.sendMessage("§bArticuno descends in a flurry of snow...");
  } else {
    player.sendMessage("§cYou must have an Ice Orb and be ready.");
  }
}

function hasCaughtLegendary(player: Player, species: string): boolean {
  const owned = readPokemon(player, species, false);
  return Object.keys(owned).length > 0;
}
