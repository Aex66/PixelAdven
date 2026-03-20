/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
Aex66 (Developer)
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- 
__________ ___________________
\______   \\_____  \__    ___/
 |       _/ /   |   \|    |   
 |    |   \/    |    \    |   
 |____|_  /\_______  /____|   
        \/         \/         
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- 
© Copyright 2023 all rights reserved by Mo9ses.
*/
import { ActionForm } from "../../../../Papers/FormPaper.js";
import { pokedex } from "./main.js";
import { Backpack, allBagItems } from "../../../Misc/backbag.js";
import { PlayerBattler } from "../../classes/Battler.js";
import { selected } from "../../../Main/Forms/PC/main.js";
import { writePokemon } from "../../../Pokemon Database/main.js";
import { deployed } from "../../../Pokemon Calculations/main.js";
import { applyHealingItem, applyBerryItem } from "./itemEffects.js";
import type { StatusEffectsValues } from "../../../../Letters/pokemon/moves";
import { updateSidebar } from "../../../Pokemon Calculations/updateTeam.js";
import { world } from "@minecraft/server";
import { ballTags } from "../../../Pokemon Calculations/catch.js";

export async function chooseHealingTarget(
  battler: PlayerBattler,
  effectType: string,
  onDeployHeal: () => void,
  isBerry = false
) {
  const form = new ActionForm();
  form.setTitle("Choose Pokémon");

  const team = selected[battler.entity.name];
  if (!team) return;

  for (let i = 0; i < 6; i++) {
    const mon = team[i];
    if (!mon) {
      form.addButton(`Slot ${i + 1}\n§7Empty`);
      continue;
    }

    const name = mon[1];
    const hp = mon[2]?.Current_Health ?? 0;
    const baseHP = mon[2]?.Base_Health ?? 0;
    const isDeployed = deployed[battler.entity.name]?.[0] === mon[0];
    const label = isDeployed
      ? `§6Deployed §7[${hp}/${baseHP}]`
      : `§a${hp}/${baseHP} HP`;

    form.addButton(`§b${name}\n${label}`);
  }

  await form.send(battler.entity, async (res) => {
    if (res.canceled) return;

    const index = res.selection;
    const mon = team[index];
    if (!mon) return;

    const isDeployed = deployed[battler.entity.name]?.[0] === mon[0];
    battler.setAction({ type: "item", data: { type: "healing" } });

    const baseHP = mon[2]?.Base_Health ?? 0;
    const currentHP = mon[2]?.Current_Health ?? 0;
    const currentCondition = (mon[2]?.condition ?? 0) as 0 | StatusEffectsValues;

    // =========================================================
    // ACTIVE POKÉMON HEALING (Scoreboard + Sync)
    // =========================================================
    if (isDeployed) {
      // Run scriptevent to heal deployed Pokémon
      onDeployHeal();

      // Friendship gain for deployed Pokémon
      let friendGain = 0;

      if (isBerry) {
        const calc = applyBerryItem(effectType, currentHP, baseHP, currentCondition);
        if (typeof calc !== "string") friendGain = calc.friend ?? 0;
      } else {
        const calc = applyHealingItem(effectType, currentHP, baseHP, currentCondition);
        if (typeof calc !== "string" && typeof calc !== "number") {
          friendGain = calc.friend ?? 0;
        }
      }

      if (friendGain > 0) {
        // Add friendship to scoreboard
        battler.entity.runCommand(
          `scoreboard players add @s friendShipLevel ${friendGain}`
        );

        // Sync scoreboard → longhand with proper clamp
        const frObj = world.scoreboard.getObjective("friendShipLevel");
        if (frObj) {
          let newFr = frObj.getScore(battler.entity) ?? 0;

          if (newFr > 255) {
            newFr = 255;
            battler.entity.runCommand(
              `scoreboard players set @s friendShipLevel 255`
            );
          }

          mon[2].friendShipLevel = newFr;
        }
      }

      return;
    }

    // =========================================================
    // NON-DEPLOYED HEALING (Longhand + Friendship)
    // =========================================================
    let result: any;

    if (isBerry) {
      result = applyBerryItem(effectType, currentHP, baseHP, currentCondition);
    } else {
      result = applyHealingItem(effectType, currentHP, baseHP, currentCondition);
    }

    if (typeof result === "string") {
      battler.entity.sendMessage(`§e${result}`);
      return;
    }

    mon[2].Current_Health = result.hp;
    mon[2].condition = result.condition;

    // ⭐ Friendship gain (longhand)
    if (result.friend) {
      mon[2].friendShipLevel = Math.min(
        255,
        (mon[2].friendShipLevel ?? 0) + result.friend
      );
    }

    // Save updated Pokémon
    writePokemon(battler.entity, "team", index, mon[2]);

    // Update sidebar UI
    updateSidebar(battler.entity);

    // Message for non-deployed healing
    battler.entity.sendMessage(
      `${battler.entity.name} used a ${effectType.replace("_", " ")}`
    );
  });
}

export function bagForm(player: PlayerBattler) {
  const form = new ActionForm();
  form.setTitle("Bag");
  form.addButton("Healing");
  form.addButton("Pokeballs");
  form.addButton("Berries");
  form.addButton("Battle Items");
  form.send(player.entity, async (res) => {
    if (res.canceled) return pokedex(player);
    if (res.selection === 0) healingForm(player);
    if (res.selection === 1) pokeballForm(player);
    if (res.selection === 2) berryForm(player);
    if (res.selection === 3) battleItemForm(player);
  });
}

function healingForm(player: PlayerBattler) {
  const backpack = new Backpack(player.entity);
  const data = allBagItems
    .filter((item) => item.category === "Healing")
    .map((item) => {
      const amount = backpack.getItemCount(item.category, item.id);
      return {
        name: item.id.split(":")[1],
        fullId: item.id,
        value: amount,
      };
    })
    .filter((i) => i.value > 0);

  const form = new ActionForm();
  form.setTitle("Healing");
  data.forEach(({ name, value }) =>
    form.addButton(`x${value} ${name.replace("_", " ").toUpperCase()}`)
  );

  form.send(player.entity, (res) => {
    if (res.canceled) return bagForm(player);
    const selectedItem = data[res.selection];
    if (!selectedItem || selectedItem.value < 1)
      return player.entity.sendMessage(`§cYou don't have ${selectedItem.name}!`);

    const d = deployed[player.entity.name];
    if (d) {
      const index = Number(d[1]);
      const hp =
        selected[player.entity.name]?.[index]?.[2]?.Current_Health ?? 0;
      player.entity.runCommand(
        `scoreboard players set @s poke${index > 0 ? index + 1 : ""}HP ${hp}`
      );
    }

    chooseHealingTarget(
      player,
      selectedItem.name,
      () => {
        const instanceId = deployed[player.entity.name]?.[2];
        if (!instanceId)
          return player.entity.sendMessage(`§cNo deployed Pokémon instance found.`);
        const match = player.entity.dimension.getEntities({
          tags: [`in:${instanceId}`],
        })[0];
        if (!match)
          return player.entity.sendMessage(`§cCould not find deployed Pokémon.`);
        match.runCommand(`scriptevent pokeworld:${selectedItem.name}`);
      }
    );

    backpack.removeItem("Healing", selectedItem.fullId, 1);
    backpack.save();
  });
}

function berryForm(player: PlayerBattler) {
  const backpack = new Backpack(player.entity);
  const data = allBagItems
    .filter((item) => item.category === "Berries")
    .map((item) => {
      const amount = backpack.getItemCount(item.category, item.id);
      return {
        name: item.id.split(":")[1],
        fullId: item.id,
        value: amount,
      };
    })
    .filter((i) => i.value > 0);

  const form = new ActionForm();
  form.setTitle("Berries");
  data.forEach(({ name, value }) =>
    form.addButton(`x${value} ${name.replace("_", " ").toUpperCase()}`)
  );

  form.send(player.entity, (res) => {
    if (res.canceled) return bagForm(player);
    const selectedItem = data[res.selection];
    if (!selectedItem || selectedItem.value < 1)
      return player.entity.sendMessage(`§cYou don't have ${selectedItem.name}!`);

    chooseHealingTarget(
      player,
      selectedItem.name,
      () => {
        const instanceId = deployed[player.entity.name]?.[2];
        if (!instanceId)
          return player.entity.sendMessage(`§cNo deployed Pokémon instance found.`);
        const match = player.entity.dimension.getEntities({
          tags: [`in:${instanceId}`],
        })[0];
        if (!match)
          return player.entity.sendMessage(`§cCould not find deployed Pokémon.`);
        match.runCommand(`scriptevent pokeworld:${selectedItem.name}`);
      },
      true
    );

    backpack.removeItem("Berries", selectedItem.fullId, 1);
    backpack.save();
  });
}

function battleItemForm(player: PlayerBattler) {
  const backpack = new Backpack(player.entity);
  const data = allBagItems
    .filter((item) => item.category === "BattleItems")
    .map((item) => {
      const amount = backpack.getItemCount(item.category, item.id);
      return {
        name: item.id.split(":")[1],
        fullId: item.id,
        value: amount,
      };
    })
    .filter((i) => i.value > 0);

  const form = new ActionForm();
  form.setTitle("Battle Items");
  data.forEach(({ name, value }) =>
    form.addButton(`x${value} ${name.replace("_", " ").toUpperCase()}`)
  );

  form.send(player.entity, (res) => {
    if (res.canceled) return bagForm(player);
    const selectedItem = data[res.selection];
    if (!selectedItem || selectedItem.value < 1)
      return player.entity.sendMessage(`§cYou don't have ${selectedItem.name}!`);

    const battler = player.pokemon;
    if (!battler)
      return player.entity.sendMessage(
        `§cYou must have a Pokémon deployed to use this!`
      );

    let applied = false;
    switch (selectedItem.name) {
      case "x_attack":
        if (battler.attackStage < 6) {
          battler.attackStage++;
          applied = true;
        }
        break;
      case "x_defend":
        if (battler.defenseStage < 6) {
          battler.defenseStage++;
          applied = true;
        }
        break;
      case "x_sp_atk":
        if (battler.specialAttackStage < 6) {
          battler.specialAttackStage++;
          applied = true;
        }
        break;
      case "x_sp_def":
        if (battler.specialDefenseStage < 6) {
          battler.specialDefenseStage++;
          applied = true;
        }
        break;
      case "x_speed":
        if (battler.speedStage < 6) {
          battler.speedStage++;
          applied = true;
        }
        break;
      case "accuracyStage":
        if (battler.accuracyStage < 6) {
          battler.accuracyStage++;
          applied = true;
        }
        break;
      case "dire_hit":
        if (battler.evasionStage < 6) {
          battler.evasionStage++;
          applied = true;
        }
        break;
    }

    if (applied) {
      player.setAction({ type: "item", data: { type: "healing" } });
      player.entity.sendMessage(
        `${player.entity.name} used a ${selectedItem.name.replace("_", " ")}`
      );

      battler.entity.dimension.spawnParticle(
        "pokeworld:stats_up",
        battler.entity.location
      );

      backpack.removeItem("BattleItems", selectedItem.fullId, 1);
      backpack.save();
    } else {
      player.entity.sendMessage(`§eThat stat is already at max!`);
    }
  });
}

function pokeballForm(player: PlayerBattler) {
  if (!player?.pokemon)
    return player.entity.sendMessage(`§cYou don't have any pokemon active!`);
  if (player.battle.type !== "wild")
    return player.entity.sendMessage(
      `§cYou can only use this function in wild battles!`
    );

  const poke = player.opponent.pokemon;

  const backpack = new Backpack(player.entity);
  const data = allBagItems
    .filter((item) => item.category === "Pokeballs")
    .map((item) => {
      const amount = backpack.getItemCount(item.category, item.id);
      return {
        name: item.id.split(":")[1],
        fullId: item.id,
        value: amount,
      };
    })
    .filter((i) => i.value > 0);

  const form = new ActionForm();
  form.setTitle("Pokeballs");
  data.forEach(({ name, value }) =>
    form.addButton(`x${value} ${name.replace("_", " ").toUpperCase()}`)
  );

  form.send(player.entity, (res) => {
    if (res.canceled) return bagForm(player);
    const selected = data[res.selection];
    if (!selected || selected.value < 1)
      return player.entity.sendMessage(`§cYou don't have ${selected.name}!`);

    backpack.removeItem("Pokeballs", selected.fullId, 1);
    backpack.save();

    for (const tag of Object.keys(ballTags)) {
      poke.entity.removeTag(tag);
    }
    poke.entity.addTag(selected.name);
    player.setAction({ type: "item", data: { type: "pokeball" } });
  });
}
