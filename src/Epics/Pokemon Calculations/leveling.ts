/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
Aex66 (Developer)
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- 
© Copyright 2023 all rights reserved by Mo9ses.
Do NOT steal, copy the code, or claim it as yours!
*/

import { Entity, Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../Papers/FormPaper.js";
import { pokemonText } from "../../Papers/Paragraphs/ExtrasParagraphs.js";
import type { Pokemon } from "../../Letters/pokemon/@types/types.js";
import { pokemonGrowth } from "../../Letters/pokemon/growth.js";
import { selected } from "../Main/Forms/PC/main.js";
import { defineBasics, keys } from "./main.js";
import wildPokemon from "../../Letters/pokemon/wild.js";
import pokemonMoves from "../../Letters/pokemon/moves.js";

export function checkExperience(player: Player, entity: Entity, slot: number) {
    const identity = entity.scoreboardIdentity;
    if (!identity) return;

    if (selected[player.name][slot][2].level >= 100) return;

    const wildName = pokemonText(entity.typeId);
    const nextLevel =
        pokemonGrowth[wildPokemon[wildName].Growth][selected[player.name][slot][2].level];

    system.run(() => {
        // ⛔ HARD GUARD — entity may have been removed
        if (!entity || !entity.isValid) return;

        const experience =
            world.scoreboard.getObjective('Ex')?.getScore(identity) ?? 0;
        if (experience > selected[player.name][slot][2].Experience)
            selected[player.name][slot][2].Experience = experience;

        if ((selected[player.name][slot][2].Experience || 0) < nextLevel && !entity.hasTag('levelup'))
            return;

        player.sendMessage(`§a${selected[player.name][slot][1]} has leveled up!`);
        entity.removeTag('levelup');

        //-----------------------------------------------
        // FRIENDSHIP GAIN
        //-----------------------------------------------
        const frObj = world.scoreboard.getObjective("friendShipLevel");
        const levelUpFriendGain = 3;

        if (frObj) {
            const current = frObj.getScore(entity) ?? 0;
            const updated = Math.min(255, current + levelUpFriendGain);
            frObj.setScore(entity, updated);
            selected[player.name][slot][2].friendShipLevel = updated;
        } else {
            const cur = selected[player.name][slot][2].friendShipLevel ?? 0;
            selected[player.name][slot][2].friendShipLevel = Math.min(255, cur + levelUpFriendGain);
        }

        //-----------------------------------------------
        // LEVEL UP (HARD-CAPPED)
        //-----------------------------------------------

        // ⛔ Final safety check INSIDE async execution
        if (selected[player.name][slot][2].level >= 100) {
            selected[player.name][slot][2].level = 100;
            entity.runCommand(`scoreboard players set @s "Lvl" 100`);
            entity.runCommand(`scoreboard players set @s "Ex" 0`);
            return;
        }

        // Increment level
        selected[player.name][slot][2].level++;

        // 🔒 Absolute clamp
        if (selected[player.name][slot][2].level > 100) {
            selected[player.name][slot][2].level = 100;
        }

        const currentLevel = selected[player.name][slot][2].level;

        // Sync scoreboard
        entity.runCommand(`scoreboard players set @s "Lvl" ${currentLevel}`);

        // Reset experience safely
        selected[player.name][slot][2].Experience -= nextLevel;
        if (selected[player.name][slot][2].Experience < 0 || currentLevel >= 100) {
            selected[player.name][slot][2].Experience = 0;
        }

        entity.runCommand(
            `scoreboard players set @s "Ex" ${selected[player.name][slot][2].Experience}`
        );

        //-----------------------------------------------
        // NEW MOVE LEARNING
        //-----------------------------------------------
        const variant = world.scoreboard.getObjective("Variant")?.getScore(entity) ?? 0;

        const moveKey = Object.keys(wildPokemon[wildName]?.Moves || {}).find(k => {
            const [min, max] = k.split("-").map(Number);
            return variant >= min && variant <= max;
        });

        const moveSet = wildPokemon[wildName]?.Moves?.[moveKey ?? "0-1"] ?? [];
        const newMoves = moveSet.filter(m => m[1] === currentLevel).map(m => m[0]);

        if (newMoves.length > 0) {
            // 🔹 Resolve current moves ONCE
            const currentMoves = [
                selected[player.name][slot][2].Move1,
                selected[player.name][slot][2].Move2,
                selected[player.name][slot][2].Move3,
                selected[player.name][slot][2].Move4
            ].map(i => Object.keys(pokemonMoves)[i] ?? "None");

            newMoves.forEach((move, index) => {
                // ⛔ Pokémon already knows this move → do NOTHING
                if (currentMoves.includes(move)) return;

                const moveIndex = Object.keys(pokemonMoves).indexOf(move);
                if (moveIndex === -1) return;

                // ✅ Only now do we notify the player
                player.sendMessage(`§b${selected[player.name][slot][1]} can now learn §e${move}§b!`);

                const form = new ActionForm();
                form.setTitle(`Learn ${move}?`);
                form.setBody(`Which move slot should be replaced with ${move}?`);

                form.addButton(`Slot 1: ${currentMoves[0]}`);
                form.addButton(`Slot 2: ${currentMoves[1]}`);
                form.addButton(`Slot 3: ${currentMoves[2]}`);
                form.addButton(`Slot 4: ${currentMoves[3]}`);
                form.addButton(`§cDon't Learn This Move`);

                system.runTimeout(() => {
                    form.send(player, (res) => {
                        if (res.canceled || res.selection === undefined || res.selection === 4) {
                            // ❌ No message spam for skipped moves
                            return;
                        }

                        const moveSlotKey = `Move${res.selection + 1}`;
                        (selected[player.name][slot][2] as any)[moveSlotKey] = moveIndex;
                        entity.runCommand(`scoreboard players set @s ${moveSlotKey} ${moveIndex}`);

                        player.sendMessage(`§a${selected[player.name][slot][1]} learned §e${move}§a!`);
                    });
                }, index * 40);
            });
        }

        //-----------------------------------------------
        // ⭐ STAT RECALCULATION ⭐
        //-----------------------------------------------
        const calculations = {} as { [key in Pokemon.property]: number };
        const nature = world.scoreboard.getObjective('nature')?.getScore(entity) ?? 0;

        calculations.Lvl = currentLevel;

        keys.forEach(k => {
            const value = world.scoreboard.getObjective(k)?.getScore(entity);
            calculations[k as Pokemon.property] = value as number;
        });

        //------------------------------------------------
        // ⭐ TRUE POKÉMON HP GAIN LOGIC ⭐
        //------------------------------------------------

        // 1️⃣ Capture OLD HP + OLD MAX HP BEFORE defineBasics overwrites them
        let oldHP = Number(selected[player.name][slot][2].Current_Health ?? 1);
        if (!Number.isFinite(oldHP) || oldHP < 1) oldHP = 1;

        let oldMaxHP = Number(world.scoreboard.getObjective('HP_Base')?.getScore(entity));
        if (!Number.isFinite(oldMaxHP) || oldMaxHP <= 0)
            oldMaxHP = Number(selected[player.name][slot][2].Base_Health ?? oldHP) || oldHP;

        // 2️⃣ Recalculate stats (defineBasics overwrites HP_Base & HP_Low)
        defineBasics(entity, calculations, nature);

        // 3️⃣ Read NEW max HP after defineBasics updated it
        let newMaxHP = Number(world.scoreboard.getObjective('HP_Base')?.getScore(entity));
        if (!Number.isFinite(newMaxHP) || newMaxHP <= 0)
            newMaxHP = oldMaxHP;

        // 4️⃣ TRUE Pokémon HP formula
        const hpGain = newMaxHP > oldMaxHP ? (newMaxHP - oldMaxHP) : 0;
        let newHP = oldHP + hpGain;

        if (newHP > newMaxHP) newHP = newMaxHP;
        if (newHP < 1) newHP = 1;

        newHP = Math.floor(newHP);
        newMaxHP = Math.floor(newMaxHP);

        // 5️⃣ Apply stored values
        selected[player.name][slot][2].Current_Health = newHP;
        selected[player.name][slot][2].Base_Health = newMaxHP;

        // 6️⃣ Update scoreboard with CORRECTED HP
        entity.runCommand(`scoreboard players set @s HP_Low ${newHP}`);
        entity.runCommand(`scoreboard players set @s HP_Base ${newMaxHP}`);

        //-----------------------------------------------
        // ⭐ SHEDINJA SPECIAL RULE ⭐
        //-----------------------------------------------
        if (wildName.toLowerCase() === "shedinja") {
            entity.runCommand(`scoreboard players set @s HP_Low 1`);
            entity.runCommand(`scoreboard players set @s HP_Base 1`);

            selected[player.name][slot][2].Base_Health = 1;
            selected[player.name][slot][2].Current_Health = 1;
            selected[player.name][slot][2].IV_health = 0;
            selected[player.name][slot][2].EV_health = 0;
        }

        //-----------------------------------------------
        // ⭐ SYNC TO PLAYER SCOREBOARD ⭐
        //-----------------------------------------------
        const pokeIndex = slot > 0 ? slot + 1 : '';
        player.runCommand(`scoreboard players set @s poke${pokeIndex}HP ${newHP}`);
        player.runCommand(`scoreboard players set @s poke${pokeIndex}Lvl ${currentLevel}`);
        player.runCommand(`scoreboard players set @s poke${pokeIndex}HPmax ${newMaxHP}`);

    });
}
