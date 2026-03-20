import { Player, world } from "@minecraft/server";
import pokemonList from "../../Letters/pokemon/list";
import pokemoneNatures from "../../Letters/pokemon/natures";
import TypeList from "../../Letters/pokemon/TypeList";
import wildPokemon from "../../Letters/pokemon/wild";
import { pokemonText } from "../../Papers/Paragraphs/ExtrasParagraphs";
import { longHand, pokeballs } from "../Pokemon Database/@types/types";
import { calculateHealth, calculateNatureStat } from "./functions";
import { getRandomMoves } from "./moves";
import { selected } from "../Main/Forms/PC/main";
import AbilityList from "../../Letters/pokemon/Abilities";

const randomNumber = (min: number, max: number) => ~~(Math.random() * (max - min) + min)

export type PokemonName = (typeof pokemonList)[number];

export function calculatePokemon(pokemonId: PokemonName, variant: number, pokeball: pokeballs): longHand {
    let moves = getRandomMoves(`pokeworld:wild_${pokemonId.toLocaleLowerCase()}`, 5, variant);
    const natureIndex = ~~(Math.random() * pokemoneNatures.values.length);
    const TerraIndex = ~~(Math.random() * TypeList.values.length);
    const baseStats = pokemonText(pokemonId);
    const level = 5;
    const friendship = wildPokemon[`pokeworld:wild_${pokemonId.toLowerCase()}`]?.Friendship ?? 0;


    const IVs = {
        health: randomNumber(...pokemoneNatures.constants.IV_HP),
        attack: randomNumber(...pokemoneNatures.constants.IV_Atk),
        defense: randomNumber(...pokemoneNatures.constants.IV_Def),
        special_attack: randomNumber(...pokemoneNatures.constants.IV_Sp_Atk),
        special_defense: randomNumber(...pokemoneNatures.constants.IV_Sp_Def),
        speed: randomNumber(...pokemoneNatures.constants.IV_Spd),
    };

    const EVs = {
        health: randomNumber(...pokemoneNatures.constants.EV_HP),
        attack: randomNumber(...pokemoneNatures.constants.EV_Atk),
        defense: randomNumber(...pokemoneNatures.constants.EV_Def),
        special_attack: randomNumber(...pokemoneNatures.constants.EV_Sp_Atk),
        special_defense: randomNumber(...pokemoneNatures.constants.EV_Sp_Def),
        speed: randomNumber(...pokemoneNatures.constants.EV_Spd),
    };

    const DMaxRange = wildPokemon[`pokeworld:wild_${pokemonId.toLowerCase()}`]?.DMax ?? [0, 1];
    const DMax = ~~(Math.random() * (DMaxRange[1] - DMaxRange[0])) + DMaxRange[0];

    // ✅ Ability selection
    const rawAbilities = wildPokemon[`pokeworld:wild_${pokemonId.toLowerCase()}`]?.Abilities;
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

    const chosenAbility = possibleAbilities.length > 0
        ? possibleAbilities[Math.floor(Math.random() * possibleAbilities.length)].name
        : 'Adaptability';

    const abilityIndex = AbilityList.indexOf(chosenAbility as typeof AbilityList[number]);

    // ✅ Gender selection
    const rawGender = wildPokemon[`pokeworld:wild_${pokemonId.toLowerCase()}`]?.Gender;
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

    const genderIndex =
        chosenGender === "Male" ? 1 :
            chosenGender === "Female" ? 2 : 0;

    const longHandData: longHand = {
        Move1_PP: moves[0] ? (moves[0][2]?.pp ?? 0) : 0,
        Move2_PP: moves[1] ? (moves[1][2]?.pp ?? 0) : 0,
        Move3_PP: moves[2] ? (moves[2][2]?.pp ?? 0) : 0,
        Move4_PP: moves[3] ? (moves[3][2]?.pp ?? 0) : 0,
        Move1: moves[0]?.[1] ?? -1,
        Move2: moves[1]?.[1] ?? -1,
        Move3: moves[2]?.[1] ?? -1,
        Move4: moves[3]?.[1] ?? -1,
        level,
        Nature: ['', natureIndex],
        IV_health: IVs.health,
        IV_attack: IVs.attack,
        IV_defense: IVs.defense,
        IV_special_attack: IVs.special_attack,
        IV_special_defense: IVs.special_defense,
        IV_speed: IVs.speed,
        EV_health: EVs.health,
        EV_attack: EVs.attack,
        EV_defense: EVs.defense,
        EV_special_attack: EVs.special_attack,
        EV_special_defense: EVs.special_defense,
        EV_speed: EVs.speed,
        Base_Health: ~~calculateHealth(baseStats, level, IVs.health, EVs.health),
        Base_attack: ~~calculateNatureStat(baseStats, natureIndex, level, 'Base_Atk', IVs.attack, EVs.attack),
        Base_defense: ~~calculateNatureStat(baseStats, natureIndex, level, 'Base_Def', IVs.defense, EVs.defense),
        Base_special_attack: ~~calculateNatureStat(baseStats, natureIndex, level, 'Base_Sp_Atk', IVs.special_attack, EVs.special_attack),
        Base_special_defense: ~~calculateNatureStat(baseStats, natureIndex, level, 'Base_Sp_Def', IVs.special_defense, EVs.special_defense),
        Base_speed: ~~calculateNatureStat(baseStats, natureIndex, level, 'Base_Spd', IVs.speed, EVs.speed),
        Current_Health: ~~calculateHealth(baseStats, level, IVs.health, EVs.health),
        DMax,
        Evolution_index: 0,
        Traded: false,
        Experience: 0,
        Variant: variant,
        heldItem: -1,
        friendShipLevel: friendship,
        pokeBall: pokeball,
        Terra: ['', TerraIndex],
        Ability: ['', abilityIndex],
        Gender: [chosenGender, genderIndex],
        Nickname: "",
        Size: 0,
        Box: 0,
        Slot: 0
    };

    // ⭐ SHEDINJA SPECIAL CASE ⭐
const idCheck = pokemonText(pokemonId)?.toLowerCase();
if (idCheck && idCheck.includes("shedinja")) {
    longHandData.Base_Health = 1;
    longHandData.Current_Health = 1;
    longHandData.IV_health = 0;
    longHandData.EV_health = 0;
}

    return longHandData;
}

export function checkSidebarFree(player: Player): number | undefined {
    if (!selected[player.name]) selected[player.name] = {};

    for (let i = 0; i < 6; i++) {
        if (!selected[player.name][i]) {
            return i;
        }
    }

    return undefined;
}
