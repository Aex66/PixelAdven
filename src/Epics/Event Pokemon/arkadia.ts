// ============================================================
// SCRIPT EVENT HANDLER

import { system, ScriptEventSource, Player } from "@minecraft/server";
import AbilityList from "../../Letters/pokemon/Abilities";
import pokemonList from "../../Letters/pokemon/list";
import pokemoneNatures from "../../Letters/pokemon/natures";
import TypeList from "../../Letters/pokemon/TypeList";
import wildPokemon from "../../Letters/pokemon/wild";
import { pokemonText } from "../../Papers/Paragraphs/ExtrasParagraphs";
import { selected } from "../Main/Forms/PC/main";
import { checkSidebarFree, PokemonName } from "../Pokemon Calculations/calculations";
import { ballTags } from "../Pokemon Calculations/catch";
import { calculateHealth, calculateNatureStat } from "../Pokemon Calculations/functions";
import { getRandomMoves } from "../Pokemon Calculations/moves";
import { longHand } from "../Pokemon Database/@types/types";
import { writePokemon } from "../Pokemon Database/main";
import { findNextFreePCSlot, findNextFreePCSlotForPlayer } from "../Pokemon Database/PcControls";

// ============================================================
system.afterEvents.scriptEventReceive.subscribe(
({ id, sourceType, sourceEntity: caller }) => {

    if (sourceType !== ScriptEventSource.Entity || !caller) return;
    if (!(caller instanceof Player)) return;

    switch (id) {
        case "pokeworld:give_motivation_cubchoo":
            givePresetCubchoo(caller);
            break;
    }

}, { namespaces: ["pokeworld"] });


// ============================================================
// GIVE PRESET CUBCHOO USING YOUR EXACT LOGIC
// ============================================================
function givePresetCubchoo(player: Player) {

    // IMPORTANT:
    // pokecreate uses NAME ONLY, never "pokeworld:*"
    const species = "cubchoo";
    const pokeID = species; // << this is what pokecreate does

    // wild data uses full namespaced id
    const wildId = `pokeworld:wild_${species}`;

    const wildData = wildPokemon[wildId];

    // ------------------------------------
    // FIXED VALUES (your requested presets)
    // ------------------------------------
    const level = 15;
    const variant = 0; // << ALWAYS 0
    const terraIceIndex = TypeList.indexOf("Ice");

    // ------------------------------------
    // RANDOMIZED NATURE (same as your system)
    // ------------------------------------
    const randomNature = Math.floor(Math.random() * pokemoneNatures.values.length);


    // ------------------------------------
    // ABILITY SELECTION — EXACTLY LIKE calculatePokemon
    // ------------------------------------
    const rawAbilities = wildData?.Abilities;
    let validAbilities: (string | null)[] = [null, null, null];

    if (rawAbilities && typeof rawAbilities === "object" && !Array.isArray(rawAbilities)) {
        for (const key of Object.keys(rawAbilities)) {
            const [start, end] = key.split("-").map(Number);
            if (variant >= start && variant <= end) {
                validAbilities = rawAbilities[key];
                break;
            }
        }

        if (validAbilities.every(a => a === null) && rawAbilities["default"]) {
            validAbilities = rawAbilities["default"];
        }

    } else if (Array.isArray(rawAbilities)) {
        validAbilities = rawAbilities;
    }

    const possibleAbilities = validAbilities
        .map((a, i) => ({ name: a, slot: i }))
        .filter(a => a.name !== null);

    const chosenAbility = (
        possibleAbilities.length > 0
            ? possibleAbilities[Math.floor(Math.random() * possibleAbilities.length)].name
            : "Adaptability"
    ) as typeof AbilityList[number];

    const abilityIndex = AbilityList.indexOf(chosenAbility);


    // ------------------------------------
    // GENDER SELECTION — MATCHES calculatePokemon
    // ------------------------------------
    const rawGender = wildData?.Gender;
    let chosenGender = "Genderless";

    if (Array.isArray(rawGender) && rawGender.length > 0) {
        const roll = Math.random() * 100;
        let cumulative = 0;

        for (const [percent, gender] of rawGender) {
            cumulative += percent;
            if (roll <= cumulative) {
                chosenGender = gender;
                break;
            }
        }
    }

    const genderIndex = chosenGender === "Male"
        ? 1
        : chosenGender === "Female"
            ? 2
            : 0;


    // ------------------------------------
    // FIXED IVs (ALL 15)
    // ------------------------------------
    const IV_HP = 15;
    const IV_Atk = 15;
    const IV_Def = 15;
    const IV_SpAtk = 15;
    const IV_SpDef = 15;
    const IV_Spd = 15;

    // EVs are all 0
    const EV_HP = 0, EV_Atk = 0, EV_Def = 0, EV_SpAtk = 0, EV_SpDef = 0, EV_Spd = 0;


    // ------------------------------------
    // RANDOM MOVES (variant = 0)
    // ------------------------------------
    const moves = getRandomMoves(wildId, level, variant);


    // ------------------------------------
    // BASE STAT CALCULATION
    // ------------------------------------
    const baseStats = pokemonText(species);
    const { box, slot } = findNextFreePCSlotForPlayer(player);
    const baseHealth = ~~calculateHealth(baseStats, level, IV_HP, EV_HP);

    function nat(stat: string, iv: number, ev: number) {
        return ~~calculateNatureStat(
            baseStats,
            randomNature,
            level,
            stat as any,
            iv,
            ev
        );
    }


    // ============================================================
    // FINAL LONGHAND OBJECT (IDENTICAL FORMAT TO YOUR SYSTEM)
    // ============================================================
    const longHandData: longHand = {
        Move1_PP: moves[0]?.[2]?.pp ?? 0,
        Move2_PP: moves[1]?.[2]?.pp ?? 0,
        Move3_PP: moves[2]?.[2]?.pp ?? 0,
        Move4_PP: moves[3]?.[2]?.pp ?? 0,

        Move1: moves[0]?.[1] ?? -1,
        Move2: moves[1]?.[1] ?? -1,
        Move3: moves[2]?.[1] ?? -1,
        Move4: moves[3]?.[1] ?? -1,

        level,

        Nature: ['', randomNature],
        Terra: ['', terraIceIndex],
        Ability: ['', abilityIndex],
        Gender: [chosenGender, genderIndex],

        IV_health: IV_HP,
        IV_attack: IV_Atk,
        IV_defense: IV_Def,
        IV_special_attack: IV_SpAtk,
        IV_special_defense: IV_SpDef,
        IV_speed: IV_Spd,

        EV_health: EV_HP,
        EV_attack: EV_Atk,
        EV_defense: EV_Def,
        EV_special_attack: EV_SpAtk,
        EV_special_defense: EV_SpDef,
        EV_speed: EV_Spd,

        Base_Health: baseHealth,
        Base_attack: nat("Base_Atk", IV_Atk, EV_Atk),
        Base_defense: nat("Base_Def", IV_Def, EV_Def),
        Base_special_attack: nat("Base_Sp_Atk", IV_SpAtk, EV_SpAtk),
        Base_special_defense: nat("Base_Sp_Def", IV_SpDef, EV_SpDef),
        Base_speed: nat("Base_Spd", IV_Spd, EV_Spd),

        Current_Health: baseHealth,

        DMax: (() => {
            const range = wildData?.DMax ?? [0, 1];
            return ~~(Math.random() * (range[1] - range[0])) + range[0];
        })(),

        Evolution_index: 0,

        Traded: true,
        Nickname: "Motivation",

        Experience: 0,
        Variant: variant,

        heldItem: -1,
        friendShipLevel: 0,
        pokeBall: "arkadiaball",
        Size: 0,
        Box: box,
        Slot: slot
    };


    // ------------------------------------
    // SEND TO PC
    // ------------------------------------
    sendPokemonToPC(player, pokeID, longHandData);
}


// ============================================================
// SEND TO PLAYER PC (matching pokecreate EXACTLY)
// ============================================================
function sendPokemonToPC(pcPlayer: Player, pokeID: string, longHand: longHand) {

    let rID = ~~(Math.random() * 999999999);

    writePokemon(pcPlayer, pokeID, rID, longHand);

    const freeSlot = checkSidebarFree(pcPlayer);

    pcPlayer.sendMessage(`§a✚ §7You received §b${pokeID} §7(§fMotivation§7)`);

    if (!freeSlot) {
        pcPlayer.sendMessage(`§a✚ §7Sent to your PC.`);
        return;
    }

    pcPlayer.sendMessage(`§a✚ §7Added to your Party.`);

    if (!selected.hasOwnProperty(pcPlayer.name)) selected[pcPlayer.name] = {};
    selected[pcPlayer.name][freeSlot] = [rID, pokeID, longHand];

    system.run(() => {

        const slot = freeSlot > 0 ? freeSlot + 1 : "";

        // EXACT pokecreate behavior:
        const pokeIndex = pokemonList.indexOf(pokeID as PokemonName);

        pcPlayer.runCommand(`scoreboard players set @s poke${slot}rID ${rID}`);
        pcPlayer.runCommand(`scoreboard players set @s poke${slot}Id ${pokeIndex}`);
        pcPlayer.runCommand(`scoreboard players set @s poke${slot}Ball ${
            Object.keys(ballTags).indexOf(longHand.pokeBall)
        }`);

        pcPlayer.runCommand(`scoreboard players set @s poke${slot}Lvl ${longHand.level}`);
        pcPlayer.runCommand(`scoreboard players set @s poke${slot}Var ${longHand.Variant}`);
        pcPlayer.runCommand(`scoreboard players set @s poke${slot}HP ${longHand.Current_Health}`);
        pcPlayer.runCommand(`scoreboard players set @s poke${slot}HPmax ${longHand.Base_Health}`);
    });
}
