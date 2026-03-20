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
© Copyright 2023 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Website: https://www.rotmc.ml
Thank you!
*/
import { Pokemon } from "../../Letters/pokemon/@types/types";
import pokemoneNatures from "../../Letters/pokemon/natures";
import wildPokemon from "../../Letters/pokemon/wild";

//Function that checks if pokemon is vaild before doing calculation 
export function isVaild(
    pokemon: keyof typeof wildPokemon,
    property?: Pokemon.property[]
) {
    try {
        if (!wildPokemon.hasOwnProperty(pokemon)) return;
        if (property && !property.some(p => wildPokemon[pokemon].hasOwnProperty(p))) return;
        return true;
    } catch (e) {
        if (e instanceof Error) {
            console.warn(e.message, e.stack);
        } else {
            console.warn(e);
        }
    }
}

/**
 * Function: Chooses a random value in defined range
 * Original function: idk
 * Properties used: ranges...
 */
export function randomConstantProperty(property: Pokemon.property) {
    const range = pokemoneNatures.constants[property];
    return ~~(Math.random() * ((range?.[1] ?? 1) - (range?.[0] ?? 0))) + (range?.[0] ?? 0);
}

/**
 * Function: Calculates pokemon health
 * Original function: idk
 * Properties used: Lvl, IV_HP, EV_HP, Base_HP
 */
export function calculateHealth(
    pokemon: keyof typeof wildPokemon | string | number,
    Lvl: number,
    IV_HP: number,
    EV_HP: number
) {

    // Convert key to a string safely
    const key = String(pokemon).toLowerCase();

    // ⭐ Absolute Shedinja override ⭐
    if (key.includes("shedinja")) {
        return 1;
    }

    const mon = wildPokemon[pokemon as keyof typeof wildPokemon];
    return (((IV_HP + (2 * mon.Base_HP) + (EV_HP / 4)) * Lvl) / 100) + 10 + Lvl;
}

/**
 * Function: Calculate a stat that will be affect by a nature value
 * Original function: idk
 * Properties used: Lvl, any...
 */
export function calculateNatureStat(pokemon: keyof typeof wildPokemon, nature: number, Lvl: number, property: keyof typeof wildPokemon['pokeworld:wild_bulbasaur'], IV: number, EV: number) {
    const value = (((IV + (2 * (wildPokemon[pokemon][property] as number)) + (EV / 4)) * Lvl) / 100) + 5;
    const percent = pokemoneNatures.values[nature].find(p => p[0] === property)?.[1] as number;
    return (value / 100) * (100 + (percent ?? 0));
}

export function calculateRawStat(base: number, nature: number, Lvl: number, IV: number, EV: number, property: string) {
    const value = (((IV + (2 * base) + (EV / 4)) * Lvl) / 100) + 5;
    const percent = pokemoneNatures.values[nature].find(p => p[0] === property)?.[1] as number;
    return (value / 100) * (100 + (percent ?? 0));
}