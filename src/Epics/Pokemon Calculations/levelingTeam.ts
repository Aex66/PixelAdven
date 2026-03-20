/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
Aex66 (Developer)
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- 
© Copyright 2023 all rights reserved by Mo9ses.
Do NOT steal, copy the code, or claim it as yours!
*/

import { Player, world, system } from "@minecraft/server";
import { ActionForm } from "../../Papers/FormPaper.js";
import { pokemonText } from "../../Papers/Paragraphs/ExtrasParagraphs.js";
import { pokemonGrowth } from "../../Letters/pokemon/growth.js";
import { selected } from "../Main/Forms/PC/main.js";
import { writePokemon } from "../Pokemon Database/main.js";
import wildPokemon from "../../Letters/pokemon/wild.js";
import pokemonMoves from "../../Letters/pokemon/moves.js";
import { calculateHealth, calculateNatureStat } from "./functions.js";
import { longHand } from "../Pokemon Database/@types/types.js";

/* =========================
   PARTY STAT RECALCULATION
   (EXTRACTED, NO BEHAVIOR CHANGE)
   ========================= */
export function recalculatePartyStats(mon: longHand, species: string) {
  const nature = mon.Nature?.[1] ?? 0;

  // --- HP ---
  const oldHP = mon.Base_Health ?? 1;

  mon.Base_Health = Math.floor(
    calculateHealth(
      species,
      mon.level,
      mon.IV_health ?? 0,
      mon.EV_health ?? 0
    )
  );

  mon.Current_Health = Math.min(
    (mon.Current_Health ?? 1) + Math.max(0, mon.Base_Health - oldHP),
    mon.Base_Health
  );

  // --- Other stats ---
  const stats = [
    ["attack", "Base_Atk"],
    ["defense", "Base_Def"],
    ["speed", "Base_Spd"],
    ["special_attack", "Base_Sp_Atk"],
    ["special_defense", "Base_Sp_Def"],
  ] as const;

  for (const [key, base] of stats) {
    (mon as any)[`Base_${key}`] = Math.floor(
      calculateNatureStat(
        species,
        nature,
        mon.level,
        base,
        mon[`IV_${key}`] ?? 0,
        mon[`EV_${key}`] ?? 0
      )
    );
  }
}

/* =========================
   TEAM LEVELING CHECK
   ========================= */
export function checkExperienceForTeam(player: Player) {
  const team = selected[player.name];
  if (!team) return;

  for (let slot = 0; slot < 6; slot++) {
    if (!team[slot]) continue;

    const mon = team[slot][2];
    if (mon.level >= 100) continue;

    const species = pokemonText(team[slot][1]);
    const growthType = wildPokemon[species]?.Growth;
    if (!growthType) continue;

    let nextLevelExp = pokemonGrowth[growthType]?.[mon.level];
    if (nextLevelExp === undefined) continue;

    let leveledUp = false;
    let needsWrite = false;

    while ((mon.Experience ?? 0) >= nextLevelExp && mon.level < 100) {
      mon.level++;

      // 🔒 HARD CAP
      if (mon.level >= 100) {
        mon.level = 100;
        mon.Experience = 0;

        player.sendMessage(
          `§a${team[slot][1]} reached the maximum level (Lv. 100)!`
        );
        break;
      }

      mon.Experience -= nextLevelExp;
      if (mon.Experience < 0) mon.Experience = 0;

      player.sendMessage(
        `§a${team[slot][1]} leveled up to §eLv. ${mon.level}§a!`
      );

      nextLevelExp = pokemonGrowth[growthType]?.[mon.level];
      if (nextLevelExp === undefined) {
        mon.Experience = 0;
        break;
      }

      // ⭐ Friendship gain (benched)
      mon.friendShipLevel = Math.min(
        255,
        (mon.friendShipLevel ?? 0) + 1
      );

      // ✅ REPLACED INLINE STAT LOGIC WITH FUNCTION
      recalculatePartyStats(mon, species);

      // ----- Move learning logic (unchanged) -----
      const moveKey = Object.keys(wildPokemon[species]?.Moves ?? {}).find(k => {
        const [min, max] = k.split("-").map(Number);
        return mon.Variant >= min && mon.Variant <= max;
      });

      const moveSet = wildPokemon[species]?.Moves?.[moveKey ?? "0-1"] ?? [];
      const newMoves = (moveSet as [string, number][])
        .filter(([, level]) => level === mon.level)
        .map(([name]) => name)
        .filter(move => move in pokemonMoves);

      if (newMoves.length > 0) {
        const moveSlots = ["Move1", "Move2", "Move3", "Move4"] as const;
        const ppSlots = ["Move1_PP", "Move2_PP", "Move3_PP", "Move4_PP"] as const;

        const currentMoves = moveSlots.map(k => {
          const idx = mon[k];
          return Object.keys(pokemonMoves)[idx] ?? "None";
        });

        for (const [index, move] of newMoves.entries()) {
          if (currentMoves.includes(move)) continue;

          const moveIndex = Object.keys(pokemonMoves).indexOf(move);
          if (moveIndex === -1) continue;

          player.sendMessage(
            `§b${team[slot][1]} can now learn §e${move}§b!`
          );

          const form = new ActionForm();
          form.setTitle(`Learn ${move}?`);
          form.setBody(`Which move slot should be replaced with ${move}?`);

          form.addButton(`Slot 1: ${currentMoves[0]}`);
          form.addButton(`Slot 2: ${currentMoves[1]}`);
          form.addButton(`Slot 3: ${currentMoves[2]}`);
          form.addButton(`Slot 4: ${currentMoves[3]}`);
          form.addButton("§cDon't Learn This Move");

          system.runTimeout(() => {
            form.send(player, res => {
              const sel = res.selection;
              if (res.canceled || sel === undefined || sel === 4) return;
              if (sel < 0 || sel > 3) return;

              const moveKey = moveSlots[sel];
              const ppKey = ppSlots[sel];

              mon[moveKey] = moveIndex;
              mon[ppKey] = pokemonMoves[move]?.pp ?? 10;

              player.sendMessage(
                `§a${team[slot][1]} learned §e${move}§a in Move Slot ${sel + 1}.`
              );

              writePokemon(player, team[slot][1], team[slot][0], mon);
            });
          }, index * 40);
        }
      } else {
        needsWrite = true;
      }

      nextLevelExp = pokemonGrowth[growthType]?.[mon.level];
      leveledUp = true;
    }

    if (leveledUp && needsWrite) {
      const index = slot > 0 ? slot + 1 : "";
      player.runCommand(`scoreboard players set @s poke${index}Lvl ${mon.level}`);
      player.runCommand(`scoreboard players set @s poke${index}HP ${Math.floor(mon.Current_Health ?? 0)}`);
      player.runCommand(`scoreboard players set @s poke${index}HPmax ${Math.floor(mon.Base_Health ?? 1)}`);

      writePokemon(player, team[slot][1], team[slot][0], mon);
    }
  }
}
