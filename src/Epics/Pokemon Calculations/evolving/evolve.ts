/* REQUIRED HEADERS REMAIN UNCHANGED */
import { Player, system, world } from "@minecraft/server";
import { grammarText, pokemonText } from "../../../Papers/Paragraphs/ExtrasParagraphs.js";
import { deletePokemon, writePokemon } from "../../Pokemon Database/main.js";
import type { Pokemon } from "../../../Letters/pokemon/@types/types.js";
import { calculateHealth, calculateNatureStat } from "../functions.js";
import { longHand } from "../../Pokemon Database/@types/types.js";
import { selected } from "../../Main/Forms/PC/main.js";
import { deployed } from "../main.js";
import wildPokemon from "../../../Letters/pokemon/wild.js";
import pokemonList from "../../../Letters/pokemon/list.js";
import pokemonMoves from "../../../Letters/pokemon/moves.js";
import AbilityList from "../../../Letters/pokemon/Abilities.js";

type EvolutionSource = "UI" | "TRADE";

/* ===========================================================
   ⭐ TRADE-ONLY evolveCheck()
   =========================================================== */
export function evolveCheck(
    player: Player,
    monEntry: any,
    slot: number
) {
    if (!monEntry) return;

    const [id, name, mon] = monEntry;

    if (!selected[player.name]) selected[player.name] = {};
    selected[player.name][slot] = [id, name, mon];

    const evolution = check(player, slot, "TRADE");
    if (!evolution || !evolution.length) return;

    const [, evoData, , ready] = evolution;
    if (!ready) return;

    const requiredHeldItem =
        evoData?.requires?.helditem !== undefined
            ? evoData.requires.helditem
            : null;

    evolve(player, slot, "TRADE", requiredHeldItem);
}

/* ===========================================================
   EVOLVE
   =========================================================== */

export type checkReturn = [
    number,
    Pokemon.evolve,
    { [requirement: string]: [boolean, string | number | boolean, string | number | boolean] },
    boolean
] | [];

export function evolve(
    player: Player,
    index: number,
    source: EvolutionSource = "UI",
    requiredHeldItem: number | null = null
): boolean {

    const pokemon = selected[player.name][index];
    const evolution = check(player, index, source);
    if (!pokemon || !evolution || !evolution.length) return false;

    if (deployed.hasOwnProperty(player.name)) {
        player.sendMessage('§cYou cannot make any pokemon evolve if you currently have it out!');
        return false;
    }

    const newType = evolution[1]?.result?.type
        ? evolution[1].result.type
        : pokemonText(pokemon[1]);

    if (!newType) return false;

    const newPokemon = evolution[1]?.result?.type ? wildPokemon[newType] : false;
    const level = evolution[1]?.result?.level ?? pokemon[2].level;

    const data: longHand = {
        level,
        Experience: pokemon[2].Experience,
        Current_Health: pokemon[2].Current_Health,
        Base_Health: pokemon[2].Base_Health,
        Base_attack: pokemon[2].Base_attack,
        Base_defense: pokemon[2].Base_defense,
        Base_speed: pokemon[2].Base_speed,
        Base_special_attack: pokemon[2].Base_special_attack,
        Base_special_defense: pokemon[2].Base_special_defense,
        EV_attack: pokemon[2].EV_attack,
        EV_defense: pokemon[2].EV_defense,
        EV_health: pokemon[2].EV_health,
        EV_speed: pokemon[2].EV_speed,
        EV_special_attack: pokemon[2].EV_special_attack,
        EV_special_defense: pokemon[2].EV_special_defense,
        IV_attack: pokemon[2].IV_attack,
        IV_defense: pokemon[2].IV_defense,
        IV_health: pokemon[2].IV_health,
        IV_speed: pokemon[2].IV_speed,
        IV_special_attack: pokemon[2].IV_special_attack,
        IV_special_defense: pokemon[2].IV_special_defense,
        Evolution_index: newPokemon ? 0 : evolution[0] + 1,
        Variant: pokemon[2].Variant,
        Nature: pokemon[2].Nature,
        Traded: pokemon[2].Traded,
        DMax: pokemon[2].DMax,
        Move1: pokemon[2].Move1,
        Move2: pokemon[2].Move2,
        Move3: pokemon[2].Move3,
        Move4: pokemon[2].Move4,
        Move1_PP: pokemon[2].Move1_PP,
        Move2_PP: pokemon[2].Move2_PP,
        Move3_PP: pokemon[2].Move3_PP,
        Move4_PP: pokemon[2].Move4_PP,
        heldItem: pokemon[2].heldItem,
        friendShipLevel: pokemon[2].friendShipLevel,
        pokeBall: pokemon[2].pokeBall,
        Terra: pokemon[2].Terra,
        Ability: ['', getNewAbilityIndex(newType, pokemon[2].Variant)],
        Gender: pokemon[2].Gender,
        Nickname: "",
        Size: pokemon[2].Size,
        Box: pokemon[2].Box,
        Slot: pokemon[2].Slot
    };

    deletePokemon(player, pokemon[1], pokemon[0]);
    delete selected[player.name][index];

    if (evolution[1].result?.recalculate || evolution[1].result?.type) {
        data.Base_Health = ~~calculateHealth(newType, level, data.IV_health, data.EV_health);
        data.Current_Health = data.Base_Health;

        data.Base_attack = ~~calculateNatureStat(newType, data.Nature[1], level, 'Base_Atk', data.IV_attack, data.EV_attack);
        data.Base_defense = ~~calculateNatureStat(newType, data.Nature[1], level, 'Base_Def', data.IV_attack, data.EV_attack);
        data.Base_speed = ~~calculateNatureStat(newType, data.Nature[1], level, 'Base_Spd', data.IV_attack, data.EV_attack);
        data.Base_special_attack = ~~calculateNatureStat(newType, data.Nature[1], level, 'Base_Sp_Atk', data.IV_attack, data.EV_attack);
        data.Base_special_defense = ~~calculateNatureStat(newType, data.Nature[1], level, 'Base_Sp_Def', data.IV_attack, data.EV_attack);
    }

    Object.entries(evolution[1]?.result as longHand).forEach(([k, v]) => {
        if (k === "recalculate" || k === "type") return;
        (data as any)[k] = v;
    });

    if (evolution[1].requires.item)
        player.runCommand(`clear @s ${evolution[1].requires.item} 0 1`);

    if (source === "TRADE" && typeof evolution[1].requires.trade === "string")
        player.runCommand(`clear @s ${evolution[1].requires.trade} 0 1`);

    if (source === "TRADE" && requiredHeldItem !== null && data.heldItem === requiredHeldItem)
        data.heldItem = 0;

    const id = ~~(Math.random() * 999999999);
    writePokemon(player, newType, id, data);

    selected[player.name][index] = [id, grammarText(newType).replace('Wild ', ''), data];

    system.run(() => {
        player.runCommand(`scoreboard players set @s poke${index > 0 ? index + 1 : ''}rID ${id}`);
        player.runCommand(`scoreboard players set @s poke${index > 0 ? index + 1 : ''}Id ${pokemonList.indexOf(grammarText(newType).replace('Wild ', '') as 'Bulbasaur')}`);
        player.runCommand(`scoreboard players set @s poke${index > 0 ? index + 1 : ''}Lvl ${data.level}`);
        player.runCommand(`scoreboard players set @s poke${index > 0 ? index + 1 : ''}Var ${data.Variant}`);
        player.runCommand(`scoreboard players set @s poke${index > 0 ? index + 1 : ''}HP ${data.Current_Health ?? 0}`);
        player.runCommand(`scoreboard players set @s poke${index > 0 ? index + 1 : ''}HPmax ${data.Base_Health}`);
    });

    return true;
}

/* ===========================================================
   ABILITY SELECTION (UNCHANGED)
   =========================================================== */

function getNewAbilityIndex(typeId: string, variant: number): number {
    const rawAbilityData = wildPokemon[typeId]?.Abilities;
    let abilityGroup: (string | null)[] = [null, null, null];

    if (rawAbilityData && typeof rawAbilityData === "object" && !Array.isArray(rawAbilityData)) {
        const abilityMap = rawAbilityData as Record<string, (string | null)[]>;
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
        if (abilityGroup.every(a => a === null))
            abilityGroup = abilityMap["default"] ?? abilityGroup;
    } else if (Array.isArray(rawAbilityData)) {
        abilityGroup = rawAbilityData;
    }

    const possible = abilityGroup.map((a, i) => ({ a, i })).filter(e => e.a !== null);
    if (possible.length)
        return AbilityList.indexOf(possible[Math.floor(Math.random() * possible.length)].a as any);

    return -1;
}

const keys = Object.keys(pokemonMoves);

/* ===========================================================
   CHECK — CONTEXT AWARE (FULL LOGIC PRESERVED)
   =========================================================== */

export function check(
    player: Player,
    index: number,
    source: EvolutionSource = "UI"
): checkReturn {

    const pokemon = selected[player.name][index];
    const evolutions = wildPokemon[pokemonText(pokemon[1])]?.evolve;

    if (!pokemon || !Array.isArray(evolutions) || evolutions.length === 0)
        return [];

    const passed: any[] = [];

    evolutions.forEach((evolution, index) => {

        // 🚫 UI NEVER ALLOWS TRADE EVOLUTIONS
        if (source === "UI" && evolution.requires?.trade !== undefined)
            return passed.push([]);

        if (pokemon[2].Evolution_index > index) return passed.push([]);
        if (evolution.hasOwnProperty("conditional") ? evolution.conditional && index !== 0 : false)
            return passed.push([]);

        const correct: {
    [requirement: string]: [boolean, string | number | boolean, string | number | boolean];
} = {};

        if (evolution.requires.variant !== undefined)
            if (pokemon[2].Variant !== evolution.requires.variant)
                return passed.push([]);

        if (evolution.requires.health) {
            if (typeof evolution.requires.health === 'string')
                correct.health = [pokemon[2].Current_Health >= pokemon[2].Base_Health, pokemon[2].Base_Health, pokemon[2].Current_Health];
            if (typeof evolution.requires.health === 'number')
                correct.health = [pokemon[2].Current_Health >= evolution.requires.health, evolution.requires.health, pokemon[2].Current_Health];
        }

        if (evolution.requires.level)
            correct.level = [pokemon[2].level >= evolution.requires.level, evolution.requires.level, pokemon[2].level];

        if (evolution.requires.gender !== undefined) {
            const genderNames = ["Genderless", "Male", "Female"] as const;
            correct.gender = [
                pokemon[2].Gender[1] === evolution.requires.gender,
                genderNames[evolution.requires.gender],
                genderNames[pokemon[2].Gender[1]]
            ];
        }

        if (evolution.requires.friendShipLevel)
            correct.friendShipLevel = [
                pokemon[2].friendShipLevel >= evolution.requires.friendShipLevel,
                evolution.requires.friendShipLevel,
                pokemon[2].friendShipLevel
            ];

        if (evolution.requires.Move1)
            correct.Move1 = [
                keys[pokemon[2].Move1] === evolution.requires.Move1,
                evolution.requires.Move1,
                keys[pokemon[2].Move1]
            ];

        if (evolution.requires.Stats) {
            if (evolution.requires.Stats === "atk")
                correct.Stats = [pokemon[2].Base_attack > pokemon[2].Base_defense, pokemon[2].Base_attack, pokemon[2].Base_defense];
            if (evolution.requires.Stats === "def")
                correct.Stats = [pokemon[2].Base_attack < pokemon[2].Base_defense, pokemon[2].Base_attack, pokemon[2].Base_defense];
            if (evolution.requires.Stats === "equal")
                correct.Stats = [pokemon[2].Base_attack === pokemon[2].Base_defense, pokemon[2].Base_attack, pokemon[2].Base_defense];
        }

        if (evolution.requires.time) {
            const t = world.getTimeOfDay();
            correct.time = [
                evolution.requires.time === "day" ? t < 13000 : t >= 13000,
                evolution.requires.time,
                t < 13000 ? "day" : "night"
            ];
        }

        if (evolution.requires.item) {
            const inv = player.getComponent("minecraft:inventory")?.container;
            let found = false;
            if (inv) for (let i = 0; i < inv.size; i++)
                if (inv.getItem(i)?.typeId === evolution.requires.item) { found = true; break; }
            correct.item = [found, evolution.requires.item, found];
        }

        if (evolution.requires.helditem !== undefined) {
            const monHeld = pokemon[2].heldItem ?? 0;
            correct["helditem"] = [
                monHeld === evolution.requires.helditem,
                evolution.requires.helditem,
                monHeld
            ];
        }

        if (evolution.requires.trade) {
            if (source !== "TRADE") {
                correct.trade = [false, "Trade required", false];
            } else if (typeof evolution.requires.trade === "boolean") {
                correct.trade = [pokemon[2].Traded === true, true, pokemon[2].Traded];
            } else {
                const inv = player.getComponent("minecraft:inventory")?.container;
                let found = false;
                if (inv) for (let i = 0; i < inv.size; i++)
                    if (inv.getItem(i)?.typeId === evolution.requires.trade) { found = true; break; }
                correct.trade = [found && pokemon[2].Traded, evolution.requires.trade, found];
            }
        }

        passed.push([
            Object.values(correct).every(r => r[0] === true),
            evolution,
            correct
        ]);
    });

    const idx = passed.findIndex(e => e[0] === true);
    if (idx === -1) {
        const fail = passed.findIndex(e => e[0] === false);
        if (fail === -1) return [];
        return [fail, passed[fail][1], passed[fail][2], false];
    }

    return [idx, passed[idx][1], passed[idx][2], true];
}
