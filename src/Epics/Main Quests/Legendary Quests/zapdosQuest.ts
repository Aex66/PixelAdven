import { world, Player, ItemStack } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
import { readPokemon } from "../../Pokemon Database/main";
import { grammarText } from '../../../Papers/Paragraphs/ExtrasParagraphs';
import { math } from '../../Pokemon Calculations/main';
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

  if (hitEntity.typeId === "pokeworld:npc_thunder_engineer") {
    handleZapdosNPC(damagingEntity);
  }

  if (hitEntity.typeId === "pokeworld:zapdos_shrine") {
    handleZapdosShrine(damagingEntity);
  }
});

// Drop source data
const dropSources: Record<string, string> = {
  "pokeworld:wild_electabuzz": "pokeworld:charged_feather",
  "pokeworld:wild_luxray": "pokeworld:storm_crystal",
  "pokeworld:wild_electrike": "pokeworld:thunder_fragment"
};
const allKeys = ["charged_feather", "storm_crystal", "thunder_fragment"];

// Drop logic (triggered externally in Battle.ts)
export function runZapdosDropLogic(player: Player, typeId: string) {
  const stage = player.getDynamicProperty("quest_zapdos_stage");
  if (typeof stage !== "number" || stage !== 1) return;

  const itemId = dropSources[typeId];
  if (!itemId) return;

  const key = itemId.split(":")[1];
  const alreadyGot = player.getDynamicProperty(`zapdos_${key}`) === true;
  if (alreadyGot) return;

  if (Math.random() > 0.25) return;

  const inv = player.getComponent("inventory")?.container;
  if (inv) {
    inv.addItem(new ItemStack(itemId, 1));
    player.sendMessage(`§eYou obtained a §f${key.replace(/_/g, " ")}§e!`);
  }

  player.setDynamicProperty(`zapdos_${key}`, true);

  const gotAll = allKeys.every(k => player.getDynamicProperty(`zapdos_${k}`) === true);
  if (gotAll) {
    player.setDynamicProperty("quest_zapdos_stage", 2);
    player.sendMessage("§eYou’ve gathered the charged relics. Return to the engineer.");
  }
}

function handleZapdosNPC(player: Player) {
  // --- CHAPTER 6 GATEKEEPER ---
  const chapter6 = Number(player.getDynamicProperty("quest_chapter6_stage") ?? 0);

  // Player must begin Chapter 6 before doing Articuno quest
  if (chapter6 < 1) {
    player.sendMessage("§cYou must begin §5Story Quest – Chapter 6§c before starting the Articuno quest!");
    return;
  }
  // --- END GATEKEEPER ---
  const stage = Number(player.getDynamicProperty("quest_zapdos_stage") ?? 0);
  const hasCaught = hasCaughtLegendary(player, "Zapdos");
  const summoned = player.getDynamicProperty("quest_zapdos_summoned") === true;

  const form = new ActionFormData().title("§eZapdos Quest");
  let responseMap: string[] = [];

  const caughtAndCompleted = hasCaught && stage >= 5;

  if (caughtAndCompleted) {
    form.body("§cYou've already caught Zapdos. To challenge it again, you must complete the quest again.");
    form.button("§7No thanks");         // 0
    form.button("§cRestart Quest");     // 1
    responseMap = ["no", "reset"];
  } else if (summoned) {
    form.body("§6You failed to catch Zapdos last time. You may try again with a second Lightning Orb.");
    form.button("Give me another chance");
    responseMap = ["retry"];
  } else {
    switch (stage) {
      case 0:
        form.body("§fBegin your journey to summon the legendary Zapdos. Seek out electric relics.");
        form.button("Begin Hunt");
        responseMap = ["start"];
        break;
      case 1: {
        const lines: string[] = [];
        for (const [pokemonId, itemId] of Object.entries(dropSources)) {
          const pokemonName = grammarText(pokemonId);
          const itemName = titleCase(
            itemId.split(":")[1].replace(/_/g, " ")
          );
          lines.push(`§b• §f${itemName} §7(from §9${pokemonName}§7)`);
        }

        form.body(
          "§fDefeat Electric Pokémon to obtain:\n\n" +
          lines.join("\n")
        );
        form.button("Still hunting...");
        responseMap = ["progress"];
        break;
      }

      case 2:
        form.body("§fYou've proven yourself. Take this Lightning Orb to the shrine.");
        form.button("Receive Lightning Orb");
        responseMap = ["get_orb"];
        break;
      case 3:
        form.body("§fUse the Lightning Orb at the shrine to summon Zapdos.");
        form.button("On my way!");
        responseMap = ["go"];
        break;
      case 4:
        form.body("§aYou caught Zapdos! Your legend grows.");
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

    // Reset quest if chosen
    if (choice === "reset") {
      player.setDynamicProperty("quest_zapdos_stage", 0);
      player.setDynamicProperty("quest_zapdos_summoned", false);
      for (const key of allKeys) {
        player.setDynamicProperty(`zapdos_${key}`, false);
      }
      player.sendMessage("§eThe Zapdos quest has been reset. Speak to the NPC again to begin.");
      return;
    }

    const inv = player.getComponent("inventory")?.container;

    // Retry summon logic
    if (choice === "retry") {
      let hasOrb = false;

      for (let i = 0; i < inv?.size; i++) {
        const item = inv.getItem(i);
        if (item?.typeId === "pokeworld:lightning_orb") {
          hasOrb = true;
          break;
        }
      }

      if (!hasOrb) {
        inv?.addItem(new ItemStack("pokeworld:lightning_orb", 1));
        player.sendMessage("§eHere’s another chance. Use this orb wisely.");
      } else {
        player.sendMessage("§6You already have a Lightning Orb.");
      }

      // 🔑 ALLOW RESUMMON
      player.setDynamicProperty("quest_zapdos_summoned", false);
      return;
    }

    // Progress quest normally
    switch (choice) {
      case "start":
        player.setDynamicProperty("quest_zapdos_stage", 1);
        player.sendMessage("§aThe hunt begins!");
        break;
      case "get_orb":
        removeRelicItems(player, allKeys);
        player.runCommand("give @s pokeworld:lightning_orb 1");
        player.setDynamicProperty("quest_zapdos_stage", 3);
        break;
      case "done":
        player.setDynamicProperty("quest_zapdos_stage", 5); // lock Zapdos quest
        player.sendMessage("§aZapdos has joined your journey!");
        player.setDynamicProperty("quest_chapter6_stage", 2);
        progressLegendaryCatch(player, "Zapdos");
        break;
    }
  });
}



function handleZapdosShrine(player: Player) {
  const stage = player.getDynamicProperty("quest_zapdos_stage") ?? 0;
  const summoned = player.getDynamicProperty("quest_zapdos_summoned") === true;
  const hasCaught = hasCaughtLegendary(player, "Zapdos");
  const inv = player.getComponent("inventory")?.container;

  if (hasCaught) {
    player.sendMessage("§eYou already caught Zapdos. You must redo the quest to try again.");
    return;
  }

  if (summoned) {
    player.sendMessage("§6You already summoned Zapdos. Return if you caught it.");
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
    if (item?.typeId === "pokeworld:lightning_orb") {
      orbSlotIndex = i;
      break;
    }
  }

  if (stage === 3 && orbSlotIndex !== -1) {
    inv.setItem(orbSlotIndex, undefined); // consume orb
    player.setDynamicProperty("quest_zapdos_summoned", true);

    const loc = player.location;
    const entity = player.dimension.spawnEntity("pokeworld:wild_zapdos" as any, {
      x: loc.x,
      y: loc.y + 1,
      z: loc.z
    });

    if (!entity) return player.sendMessage("§cFailed to summon Zapdos.");

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
    player.sendMessage("§eZapdos thunders down from the sky...");
  } else {
    player.sendMessage("§cYou must have a Lightning Orb and be ready.");
  }
}

function hasCaughtLegendary(player: Player, species: string): boolean {
  const owned = readPokemon(player, species, false);
  return Object.keys(owned).length > 0;
}
