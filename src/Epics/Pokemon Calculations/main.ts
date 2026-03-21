import { Entity, Player, system, world } from "@minecraft/server";
import { calculateHealth, calculateNatureStat, calculateRawStat, randomConstantProperty } from "./functions.js";
import { pokemonText } from "../../Papers/Paragraphs/ExtrasParagraphs.js";
import { Pokemon } from "../../Letters/pokemon/@types/types.js";
import pokemoneNatures from "../../Letters/pokemon/natures.js";
import wildPokemon from "../../Letters/pokemon/wild.js";
import './pokeCreate.js';
import { getRandomMoves } from "./moves.js";

export const deployed = {} as { [name: string]: [pokemonId: number, index: number, instanceId: string] },
    keys = Object.keys(pokemoneNatures.constants) as Pokemon.property[];

export function math(entity: Entity, player: Player) {
    if (!entity || entity.hasTag("initialized")) return;
    if (!player || !player.isValid) return;

    let highestLevel = 1;
    const team = Object.values(selected?.[player.name] ?? {}).map(p => p[2]?.level ?? 0);
    if (team) {
        if (team.length > 0) {
            highestLevel = Math.max(...team);
        }
    }

    entity.addTag("math");

    const calculations = {} as { [key in Pokemon.property]: number };

    const nature = ~~(Math.random() * pokemoneNatures.values.length);
    entity.runCommand(`scoreboard players set @s "nature" ${nature}`);

    // 🔹 Determine wild status safely (works even before tags are added)
    const isWild =
        entity.typeId.startsWith("pokeworld:wild_") ||
        entity.hasTag("wild");

    // Calculate base min/max around player's team
    let minLevel = Math.max(5, highestLevel - 2);
    let maxLevel = highestLevel + 2;

    // 🔒 Hard cap wild Pokémon at level 50
    if (isWild) {
        maxLevel = Math.min(maxLevel, 50);
    }

    // Ensure minLevel never exceeds maxLevel
    if (minLevel > maxLevel) {
        minLevel = maxLevel;
    }

    // Generate level
    calculations.Lvl = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
    entity.runCommand(`scoreboard players set @s "Lvl" ${calculations.Lvl}`);

    calculations.DMax = ~~(Math.random() * ((wildPokemon[entity.typeId]?.DMax?.[1] ?? 1) - (wildPokemon[entity.typeId]?.DMax?.[0] ?? 0))) + (wildPokemon[entity.typeId]?.DMax?.[0] ?? 0);
    entity.runCommand(`scoreboard players set @s "DMax" ${calculations.DMax}`);

    calculations.Terra = ~~(Math.random() * ((wildPokemon[entity.typeId]?.Terra?.[1] ?? 1) - (wildPokemon[entity.typeId]?.Terra?.[0] ?? 0))) + (wildPokemon[entity.typeId]?.Terra?.[0] ?? 0);
    entity.runCommand(`scoreboard players set @s "terra" ${calculations.Terra}`);

    keys.forEach(k => {
        const value = randomConstantProperty(k);
        calculations[k as Pokemon.property] = value;
        entity.runCommand(`scoreboard players set @s "${k}" ${value}`);
    });

    // ✅ Assign Ability
    const variant = entity.getComponent("minecraft:mark_variant")?.value ?? 0;
    const rawAbilityData = wildPokemon[entity.typeId]?.Abilities;

    let abilityGroup: (string | null)[] = [null, null, null];

    if (rawAbilityData && typeof rawAbilityData === "object" && !Array.isArray(rawAbilityData)) {
        const abilityMap = rawAbilityData as Record<string, (string | null)[]>;

        // Try to match a range like "0-1", "2-3"
        for (const key of Object.keys(abilityMap)) {
            if (key === "default") continue;

            const [startStr, endStr] = key.split("-");
            const start = parseInt(startStr);
            const end = parseInt(endStr);

            if (variant >= start && variant <= end) {
                abilityGroup = abilityMap[key];
                break;
            }
        }

        // Fallback to default if no match found
        if (abilityGroup.every(a => a === null)) {
            abilityGroup = abilityMap["default"] ?? [null, null, null];
        }
    } else if (Array.isArray(rawAbilityData)) {
        // Legacy support for flat array
        abilityGroup = rawAbilityData;
    }

    const possibleAbilities = abilityGroup
        .map((a, i) => ({ name: a, slot: i }))
        .filter(a => a.name !== null);

    if (possibleAbilities.length > 0) {
        const chosen = possibleAbilities[Math.floor(Math.random() * possibleAbilities.length)];
        const abilityIndex = AbilityList.indexOf(chosen.name as typeof AbilityList[number]);
        if (abilityIndex !== -1) {
            entity.runCommand(`scoreboard players set @s "ability" ${abilityIndex}`);
        }
    }


    // ✅ Assign Gender -> writes to "Gender" scoreboard (0: Genderless, 1: Male, 2: Female)
    const rawGenderData = wildPokemon[entity.typeId]?.Gender as [number, string][] | undefined;
    let genderIndex = 0; // default Genderless

    if (Array.isArray(rawGenderData) && rawGenderData.length > 0) {
        const hasGenderless = rawGenderData.some(([, g]) => g === "Genderless");
        const totalPercent = rawGenderData.reduce((sum, [p]) => sum + p, 0);

        if (hasGenderless && (rawGenderData.length === 1 || totalPercent === 0)) {
            // Explicit genderless case like [[0, "Genderless"]]
            genderIndex = 0;
        } else {
            const roll = Math.random() * 100;
            let cumulative = 0;
            for (const [percent, gender] of rawGenderData) {
                cumulative += percent;
                if (roll <= cumulative) {
                    genderIndex = gender === "Male" ? 1 : gender === "Female" ? 2 : 0;
                    break;
                }
            }
            // Fallback if rounding leaves a gap
            if (genderIndex === 0) {
                const lastGender = rawGenderData[rawGenderData.length - 1]?.[1];

                genderIndex = lastGender === "Male" ? 1 : lastGender === "Female" ? 2 : 0;
            }
        }
    }

    entity.runCommand(`scoreboard players set @s "Gender" ${genderIndex}`);

    defineBasics(entity, calculations, nature);

    getRandomMoves(
        entity.typeId,
        calculations.Lvl,
        entity.getComponent('minecraft:mark_variant')?.value ?? 0,
        entity
    );

    entity.addTag("initialized");
}


export function defineBasics(entity: Entity, calculations: { [key in Pokemon.property]: number }, nature: number) {

    const oldHP = world.scoreboard.getObjective("HP_Low")?.getScore(entity) ?? 1;
    const oldMaxHP = world.scoreboard.getObjective("HP_Base")?.getScore(entity) ?? 1;

    let value = ~~calculateHealth(
        pokemonText(entity.typeId),
        calculations.Lvl,
        calculations.IV_HP,
        calculations.EV_HP
    );

    // Always update max HP
    entity.runCommand(`scoreboard players set @s "HP_High" ${value}`);
    entity.runCommand(`scoreboard players set @s "HP_Base" ${value}`);

    // ✅ ONLY sync current HP if Pokémon was already full
    if (oldHP >= oldMaxHP) {
        entity.runCommand(`scoreboard players set @s "HP_Low" ${value}`);
    }

    value = calculateNatureStat(pokemonText(entity.typeId), nature, calculations.Lvl, 'Base_Atk', calculations.IV_Atk, calculations.EV_Atk);
    entity.runCommand(`scoreboard players set @s "Atk_Base" ${~~value}`);

    value = calculateNatureStat(pokemonText(entity.typeId), nature, calculations.Lvl, 'Base_Def', calculations.IV_Def, calculations.EV_Def);
    entity.runCommand(`scoreboard players set @s "Def_Base" ${~~value}`);

    value = calculateNatureStat(pokemonText(entity.typeId), nature, calculations.Lvl, 'Base_Sp_Atk', calculations.IV_Sp_Atk, calculations.EV_Sp_Atk);
    entity.runCommand(`scoreboard players set @s "Sp_Atk_Base" ${~~value}`);

    value = calculateNatureStat(pokemonText(entity.typeId), nature, calculations.Lvl, 'Base_Sp_Def', calculations.IV_Sp_Def, calculations.EV_Sp_Def);
    entity.runCommand(`scoreboard players set @s "Sp_Def_Base" ${~~value}`);

    value = calculateNatureStat(pokemonText(entity.typeId), nature, calculations.Lvl, 'Base_Spd', calculations.IV_Spd, calculations.EV_Spd);
    entity.runCommand(`scoreboard players set @s "Spd_Base" ${~~value}`);

    let variant = entity.getComponent('minecraft:mark_variant')?.value ?? 0;
    entity.runCommand(`scoreboard players set @s "Variant" ${variant}`);
}
system.afterEvents.scriptEventReceive.subscribe(ev => {
    if (!ev.sourceEntity || ev.id !== "pokeworld:define_mega_stats") return;

    const entity = ev.sourceEntity;
    const lvl = getScore(entity, "Lvl") ?? 1;
    const nature = getScore(entity, "nature") ?? 0;

    let value = calculateRawStat(getScore(entity, "Mega_Atk") ?? 0, nature, lvl, getScore(entity, "IV_Atk") ?? 0, getScore(entity, "EV_Atk") ?? 0, "Mega_Atk");
    entity.runCommand(`scoreboard players set @s "Atk_Mega" ${~~value}`);

    value = calculateRawStat(getScore(entity, "Mega_Def") ?? 0, nature, lvl, getScore(entity, "IV_Def") ?? 0, getScore(entity, "EV_Def") ?? 0, "Mega_Def");
    entity.runCommand(`scoreboard players set @s "Def_Mega" ${~~value}`);

    value = calculateRawStat(getScore(entity, "Mega_Sp_Atk") ?? 0, nature, lvl, getScore(entity, "IV_Sp_Atk") ?? 0, getScore(entity, "EV_Sp_Atk") ?? 0, "Mega_Sp_Atk");
    entity.runCommand(`scoreboard players set @s "Sp_Atk_Mega" ${~~value}`);

    value = calculateRawStat(getScore(entity, "Mega_Sp_Def") ?? 0, nature, lvl, getScore(entity, "IV_Sp_Def") ?? 0, getScore(entity, "EV_Sp_Def") ?? 0, "Mega_Sp_Def");
    entity.runCommand(`scoreboard players set @s "Sp_Def_Mega" ${~~value}`);

    value = calculateRawStat(getScore(entity, "Mega_Spd") ?? 0, nature, lvl, getScore(entity, "IV_Spd") ?? 0, getScore(entity, "EV_Spd") ?? 0, "Mega_Spd");
    entity.runCommand(`scoreboard players set @s "Spd_Mega" ${~~value}`);
});


import './names.js';
import './spawn.js';
import './catch.js';
import './moves.js'
import "./starter.js";
import "./hatching.js";
import "./levelingTeam.js";
import "./pokeCreate.js";
import "./updateTeam.js";
import "./nathan's_bs.js";
import './evolving/main.js';
import './SetSize.js'
import './megaAscend.js'
import { getScore } from "../Pokemon Battles/utils.js";
import AbilityList from "../../Letters/pokemon/Abilities.js";
import { selected } from "../Main/Forms/PC/main.js";

