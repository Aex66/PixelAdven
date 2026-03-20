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
import { Player as IPlayer, world } from '@minecraft/server';
import { grammarText } from '../../Papers/Paragraphs/ExtrasParagraphs.js';
import type { longHand, shortHand } from './@types/types.js';
import pokemoneNatures from '../../Letters/pokemon/natures.js';
import pokemonList from '../../Letters/pokemon/list.js';

world.sendMessage('§a§l[ROT] §r§aThe Pokemon Database has been loaded!');

function getKey(type: string): string {
    return `ROT:${type}`;
}

/**
 * Lists all of the pokemon the player has in storage
 * @param player The player
 * @returns {string[]} The list of storages the player has
 */
export function listStorage(player: IPlayer): string[] {
    const species = new Set<string>();
    for (const speciesName of pokemonList) {
        const raw = player.getDynamicProperty(getKey(speciesName)) as string;
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        if (Object.keys(parsed).length > 0) species.add(speciesName);
    }
    return [...species];
}

/**
 * Writes or updates a pokemon to the player's storage
 * @param {IPlayer} player The player to write to
 * @param {string} type The pokemon type / identifer
 * @param {number} id The pokemon's ROT ID
 * @param {longHand} data Data to save or update
 */
export function writePokemon(player: IPlayer, type: string, id: number, data: longHand): void {
    type = grammarText(type).replace('Wild', '').trim().replace(/\s/g, '_');
    const key = getKey(type);
    const raw = player.getDynamicProperty(key) as string;
    const currentData = JSON.parse(raw ?? '{}') ?? {};

    if (currentData.hasOwnProperty(id))
        Object.assign(currentData[id], translateData(data, 'short-hand'));
    else
        currentData[id] = translateData(data, 'short-hand');

    player.setDynamicProperty(key, JSON.stringify(currentData));
}

/**
 * Reads a pokemon from the player's storage
 * @param {IPlayer} player The player to read from
 * @param {string} type The pokemon type / identifer
 * @param {string[]} ignoreIDs The rIDs to ignore
 * @returns {{ [rID: string]: longHand }} The pokemon data
 */
export function readPokemon(player: IPlayer, type: string, longHand: boolean, ignoreIDs?: number[]): { [rID: string]: longHand } {
    const raw = player.getDynamicProperty(getKey(type)) as string;
    const data = JSON.parse(raw ?? '{}') ?? {};
    if (ignoreIDs) ignoreIDs.forEach(id => delete data[id]);
    if (longHand) Object.keys(data).forEach(key => data[key] = translateData(data[key], 'long-hand'));
    return data;
}

/**
 * Deletes a pokemon from the player's storage
 * @param {IPlayer} player The player to delete from
 * @param {string} type The pokemon type / identifer
 * @param {number} id The pokemon's ROT ID
 */
export function deletePokemon(player: IPlayer, type: string, id: number): void {
    type = grammarText(type).replace('Wild', '').trim().replace(/\s/g, '_');
    const key = getKey(type);
    const raw = player.getDynamicProperty(key) as string;
    const data = JSON.parse(raw ?? '{}') ?? {};
    delete data[id];
    player.setDynamicProperty(key, JSON.stringify(data));
}

/**
 * Translate pokemon data from short hand to long hand and vice-versa
 * @param {shortHand | longHand} data The data to translate
 * @param {'shortHand' | 'longHand'} properties Long hand or short hand
 */
export function translateData(data: shortHand | longHand, properties: 'long-hand'): longHand;
export function translateData(data: shortHand | longHand, properties: 'short-hand'): shortHand;
export function translateData(data: shortHand | longHand, properties: 'short-hand' | 'long-hand'): shortHand | longHand {
    const output = {} as any;
    Object.keys(data).forEach(key => {
        //Long hand -> Short hand
        if (properties === 'short-hand') {
            data = data as longHand;
            if (key === 'level' && data.hasOwnProperty(key)) return output.lv = data[key];
            if (key === 'Move1' && data.hasOwnProperty(key)) return output.M1 = data[key];
            if (key === 'Move2' && data.hasOwnProperty(key)) return output.M2 = data[key];
            if (key === 'Move3' && data.hasOwnProperty(key)) return output.M3 = data[key];
            if (key === 'Move4' && data.hasOwnProperty(key)) return output.M4 = data[key];
            if (key === 'Move1_PP' && data.hasOwnProperty(key)) return output.M1pp = data[key];
            if (key === 'Move2_PP' && data.hasOwnProperty(key)) return output.M2pp = data[key];
            if (key === 'Move3_PP' && data.hasOwnProperty(key)) return output.M3pp = data[key];
            if (key === 'Move4_PP' && data.hasOwnProperty(key)) return output.M4pp = data[key];
            if (key === 'Base_Health' && data.hasOwnProperty(key)) return output.HP = data[key];
            if (key === 'Current_Health' && data.hasOwnProperty(key)) return output.CH = data[key];
            if (key === 'Base_speed' && data.hasOwnProperty(key)) return output.SP = data[key];
            if (key === 'Base_attack' && data.hasOwnProperty(key)) return output.ATK = data[key];
            if (key === 'Base_defense' && data.hasOwnProperty(key)) return output.DEF = data[key];
            if (key === 'Base_special_attack' && data.hasOwnProperty(key)) return output.SPA = data[key];
            if (key === 'Base_special_defense' && data.hasOwnProperty(key)) return output.SPD = data[key];
            if (key === 'IV_health' && data.hasOwnProperty(key)) return output.IVhp = data[key];
            if (key === 'IV_speed' && data.hasOwnProperty(key)) return output.IVsp = data[key];
            if (key === 'IV_attack' && data.hasOwnProperty(key)) return output.IVatk = data[key];
            if (key === 'IV_defense' && data.hasOwnProperty(key)) return output.IVdef = data[key];
            if (key === 'IV_special_attack' && data.hasOwnProperty(key)) return output.IVspa = data[key];
            if (key === 'IV_special_defense' && data.hasOwnProperty(key)) return output.IVspd = data[key];
            if (key === 'EV_health' && data.hasOwnProperty(key)) return output.EVhp = data[key];
            if (key === 'EV_speed' && data.hasOwnProperty(key)) return output.EVsp = data[key];
            if (key === 'EV_attack' && data.hasOwnProperty(key)) return output.EVatk = data[key];
            if (key === 'EV_defense' && data.hasOwnProperty(key)) return output.EVdef = data[key];
            if (key === 'EV_special_attack' && data.hasOwnProperty(key)) return output.EVspa = data[key];
            if (key === 'EV_special_defense' && data.hasOwnProperty(key)) return output.EVspd = data[key];
            if (key === 'Nature' && data.hasOwnProperty(key)) return output.Na = data[key][1];
            if (key === 'DMax' && data.hasOwnProperty(key)) return output.DM = data[key];
            if (key === 'Gender' && data.hasOwnProperty(key)) return output.Gdr = data[key];
            if (key === 'Size' && data.hasOwnProperty(key)) return output.SZ = data[key];
            if (key === 'Terra' && data.hasOwnProperty(key)) return output.TER = data[key];
            if (key === 'Slot' && data.hasOwnProperty(key)) return output.St = data[key];
            if (key === 'Box' && data.hasOwnProperty(key)) return output.Bx = data[key];
            if (key === 'Ability' && data.hasOwnProperty(key)) return output.Abl = data[key];
            if (key === 'Variant' && data.hasOwnProperty(key)) return output.Vr = data[key];
            if (key === 'Traded' && data.hasOwnProperty(key)) return output.Tr = data[key];
            if (key === 'Nickname' && data.hasOwnProperty(key)) return output.NN = data[key];
            if (key === 'Evolution_index' && data.hasOwnProperty(key)) return output.Ev = data[key];
            if (key === 'Experience' && data.hasOwnProperty(key)) return output.Ex = data[key];
            if (key === 'heldItem' && data.hasOwnProperty(key)) return output.Hi = data[key];
            if (key === 'friendShipLevel' && data.hasOwnProperty(key)) return output.fsl = data[key];
            if (key === 'pokeBall' && data.hasOwnProperty(key)) return output.ball = data[key];
        }
        //Short hand -> Long hand
        if (properties === 'long-hand') {
            data = data as shortHand;
            if (key === 'lv' && data.hasOwnProperty(key)) return output.level = data[key];
            if (key === 'M1' && data.hasOwnProperty(key)) return output.Move1 = data[key];
            if (key === 'M2' && data.hasOwnProperty(key)) return output.Move2 = data[key];
            if (key === 'M3' && data.hasOwnProperty(key)) return output.Move3 = data[key];
            if (key === 'M4' && data.hasOwnProperty(key)) return output.Move4 = data[key];
            if (key === 'M1pp' && data.hasOwnProperty(key)) return output.Move1_PP = data[key];
            if (key === 'M2pp' && data.hasOwnProperty(key)) return output.Move2_PP = data[key];
            if (key === 'M3pp' && data.hasOwnProperty(key)) return output.Move3_PP = data[key];
            if (key === 'M4pp' && data.hasOwnProperty(key)) return output.Move4_PP = data[key];
            if (key === 'HP' && data.hasOwnProperty(key)) return output.Base_Health = data[key];
            if (key === 'CH' && data.hasOwnProperty(key)) return output.Current_Health = data[key];
            if (key === 'SP' && data.hasOwnProperty(key)) return output.Base_speed = data[key];
            if (key === 'ATK' && data.hasOwnProperty(key)) return output.Base_attack = data[key];
            if (key === 'DEF' && data.hasOwnProperty(key)) return output.Base_defense = data[key];
            if (key === 'SPA' && data.hasOwnProperty(key)) return output.Base_special_attack = data[key];
            if (key === 'SPD' && data.hasOwnProperty(key)) return output.Base_special_defense = data[key];
            if (key === 'IVhp' && data.hasOwnProperty(key)) return output.IV_health = data[key];
            if (key === 'IVsp' && data.hasOwnProperty(key)) return output.IV_speed = data[key];
            if (key === 'IVatk' && data.hasOwnProperty(key)) return output.IV_attack = data[key];
            if (key === 'IVdef' && data.hasOwnProperty(key)) return output.IV_defense = data[key];
            if (key === 'IVspa' && data.hasOwnProperty(key)) return output.IV_special_attack = data[key];
            if (key === 'IVspd' && data.hasOwnProperty(key)) return output.IV_special_defense = data[key];
            if (key === 'EVhp' && data.hasOwnProperty(key)) return output.EV_health = data[key];
            if (key === 'EVsp' && data.hasOwnProperty(key)) return output.EV_speed = data[key];
            if (key === 'EVatk' && data.hasOwnProperty(key)) return output.EV_attack = data[key];
            if (key === 'EVdef' && data.hasOwnProperty(key)) return output.EV_defense = data[key];
            if (key === 'EVspa' && data.hasOwnProperty(key)) return output.EV_special_attack = data[key];
            if (key === 'EVspd' && data.hasOwnProperty(key)) return output.EV_special_defense = data[key];
            if (key === 'Na' && data.hasOwnProperty(key)) return output.Nature = [pokemoneNatures.values[data[key]][2] || 'N/A', data[key]];
            if (key === 'DM' && data.hasOwnProperty(key)) return output.DMax = data[key];
            if (key === 'TER' && data.hasOwnProperty(key)) return output.Terra = data[key];
            if (key === 'Bx' && data.hasOwnProperty(key)) return output.Box = data[key];
            if (key === 'St' && data.hasOwnProperty(key)) return output.Slot = data[key];
            if (key === 'SZ' && data.hasOwnProperty(key)) return output.Size = data[key];
            if (key === 'Gdr' && data.hasOwnProperty(key)) return output.Gender = data[key];
            if (key === 'Abl' && data.hasOwnProperty(key)) return output.Ability = data[key];
            if (key === 'Vr' && data.hasOwnProperty(key)) return output.Variant = data[key];
            if (key === 'Tr' && data.hasOwnProperty(key)) return output.Traded = data[key];
            if (key === 'NN' && data.hasOwnProperty(key)) return output.Nickname = data[key];
            if (key === 'Ev' && data.hasOwnProperty(key)) return output.Evolution_index = data[key];
            if (key === 'Ex' && data.hasOwnProperty(key)) return output.Experience = data[key];
            if (key === 'Hi' && data.hasOwnProperty(key)) return output.heldItem = data[key];
            if (key === 'fsl' && data.hasOwnProperty(key)) return output.friendShipLevel = data[key];
            if (key === 'ball' && data.hasOwnProperty(key)) return output.pokeBall = data[key];
        }
    });
    return output;
}

import '../Main/Forms/PC/main.js';
import './commands.js';