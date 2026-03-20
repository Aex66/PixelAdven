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

import { system, Player as IPlayer } from "@minecraft/server";
import { confirmForm, pokemonText } from "../../../../Papers/Paragraphs/ExtrasParagraphs.js";
import { ActionForm, MessageForm } from "../../../../Papers/FormPaper.js";
import type { longHand, shortHand } from "../../../Pokemon Database/@types/types.js";
import { pokemonGrowth } from "../../../../Letters/pokemon/growth.js";
import wildPokemon from "../../../../Letters/pokemon/wild.js";
import { selected } from "./main.js";
import { getFirstFreeSlotInBox, showResults } from "./search.js";
import pokemonList from "../../../../Letters/pokemon/list.js";
import quick from "../../../../quick.js";
import { ballTags } from "../../../Pokemon Calculations/catch.js";
import { listStorage, readPokemon, writePokemon } from "../../../Pokemon Database/main.js";
import ItemsList from "../../../../Letters/pokemon/Items.js";

type uiVars = keyof typeof quick.epics["Pokemon Database"]["$uiVars"];

// Tracks last PC page viewed per player
export const currentPCPage: Record<string, number> = {};

function clearPCPosition(data: any) {
  delete data.Box;  delete data.Bx;  delete data.box;  delete data.bx;
  delete data.Slot; delete data.St;  delete data.slot; delete data.st;
}

export function view(player: IPlayer, slotOverride?: number) {
    if (!selected.hasOwnProperty(player.name)) selected[player.name] = {};
    const values = Array(6).fill([]) as [number, string, longHand][];

    for (let i = 0; i < 6; i++) {
        if (!selected[player.name].hasOwnProperty(`${i}`)) continue;
        values[i] = selected[player.name][i];
    }

    const totalOwned = Object.keys(selected[player.name])
        .filter(i => (selected[player.name] as Record<string, [number, string, longHand]>)[i]?.[1]?.length)
        .length;

    if (typeof slotOverride === "number") {

        // SLOT EMPTY → choose immediately
        if (!values[slotOverride]?.[1]?.length) {
            return choose(player, slotOverride);
        }

        const removed = values[slotOverride];

        const data = removed[2];
        const displayName =
            data?.Nickname && data.Nickname.trim().length > 0
                ? data.Nickname
                : removed[1];

        const sad = new MessageForm();
        sad.setTitle("Remove from team?");
        sad.setBody(`Do you want to switch ${displayName} out of your team?`);
        sad.setButton1("§aChoose new Pokémon");
        sad.setButton2("§cRemove from team");

        return sad.send(player, ces => {
            if (ces.selection) return choose(player, slotOverride);

            if (totalOwned <= 1) {
                player.sendMessage(`§cYou cannot remove your last Pokémon.`);
                return;
            }

            // SHIFT TEAM LEFT
            for (let i = slotOverride; i < 5; i++) {
                const next = selected[player.name][i + 1];
                if (next) {
                    selected[player.name][i] = next;
                    player.runCommand(`scoreboard players operation @s poke${i + 1}rID = @s poke${i + 2}rID`);
                    player.runCommand(`scoreboard players operation @s poke${i + 1}Id = @s poke${i + 2}Id`);
                    player.runCommand(`scoreboard players operation @s poke${i + 1}Lvl = @s poke${i + 2}Lvl`);
                    player.runCommand(`scoreboard players operation @s poke${i + 1}Var = @s poke${i + 2}Var`);
                    player.runCommand(`scoreboard players operation @s poke${i + 1}HP = @s poke${i + 2}HP`);
                    player.runCommand(`scoreboard players operation @s poke${i + 1}HPmax = @s poke${i + 2}HPmax`);
                    player.runCommand(`scoreboard players operation @s poke${i + 1}Ball = @s poke${i + 2}Ball`);
                } else {
                    delete selected[player.name][i];
                    player.runCommand(`scoreboard players reset @s poke${i + 1}rID`);
                    player.runCommand(`scoreboard players set @s poke${i + 1}Id 0`);
                    player.runCommand(`scoreboard players reset @s poke${i + 1}Lvl`);
                    player.runCommand(`scoreboard players reset @s poke${i + 1}Var`);
                    player.runCommand(`scoreboard players reset @s poke${i + 1}HP`);
                    player.runCommand(`scoreboard players reset @s poke${i + 1}HPmax`);
                    player.runCommand(`scoreboard players reset @s poke${i + 1}Ball`);
                }
            }

            delete selected[player.name][5];
            player.runCommand(`scoreboard players reset @s poke6rID`);
            player.runCommand(`scoreboard players set @s poke6Id 0`);
            player.runCommand(`scoreboard players reset @s poke6Lvl`);
            player.runCommand(`scoreboard players reset @s poke6Var`);
            player.runCommand(`scoreboard players reset @s poke6HP`);
            player.runCommand(`scoreboard players reset @s poke6HPmax`);
            player.runCommand(`scoreboard players reset @s poke6Ball`);

            // ===============================
            // DEPOSIT INTO CURRENT PC PAGE
            // ===============================
            const [rID, species, pokeData] = removed;

            // Ensure team Pokémon does NOT claim a PC slot
            clearPCPosition(pokeData);

            const pcData = listStorage(player).map(mon => [
                mon,
                readPokemon(player, mon, false)
            ]) as unknown as [string, { [rID: string]: shortHand }][];

            const page = currentPCPage[player.name] ?? 0;
            const targetBox = page + 1; // PC boxes are 1-based

            const slot = getFirstFreeSlotInBox(pcData, targetBox, player);

            if (slot === undefined) {
                player.sendMessage(`§cBox ${targetBox} is full.`);
                return;
            }

            writePokemon(player, species, rID, {
                ...pokeData,
                Box: targetBox,
                Slot: slot
            });

            const refreshed = listStorage(player)
                .map(mon => [mon, readPokemon(player, mon, false)]) as unknown as [string, { [rID: string]: shortHand }][];

            return showResults(player, "PC", refreshed, true);
        });
    }


    const form = new ActionForm();
    form.setTitle("Your team");

    for (let i = 0; i < 6; i++) {
        if (!values[i]?.[1]?.length) {
            form.addButton(`Slot ${i + 1}\nN/A`);
        } else {
            const data = values[i][2];
            const displayName =
                data?.Nickname && data.Nickname.trim().length > 0
                    ? data.Nickname
                    : values[i][1];
            form.addButton(
                `Slot ${i + 1} - ${displayName}\n${quick.epics["Pokemon Database"].$uiVars[values[i][2].Variant as uiVars]
                    .replace("$name", values[i][1])
                    .replace("$lvl", values[i][2].level.toString())}`
            );
        }
    }

    form.send(player, res => {
        if (res.canceled || res.selection === undefined) return;
        choose(player, res.selection);
    });
}

async function choose(player: IPlayer, slot: number): Promise<void> {
    const has = listStorage(player);
    const results = has.map(mon => [mon, readPokemon(player, mon, false)]) as unknown as [string, { [rID: string]: shortHand }][];

    const choosen = await showResults(player, "PC", results, true);
    if (!choosen) return view(player);

    if (Object.values(selected[player.name]).some(p => p[0] === Number(choosen.rID))) {
        return player.sendMessage("§cYou already have this Pokémon in your team!");
    }

    const wildName = pokemonText(choosen.name);
    const nextLevel = pokemonGrowth[wildPokemon[wildName].Growth][choosen.data.level];

    const displayName =
        choosen.data?.Nickname && choosen.data.Nickname.trim().length > 0
            ? choosen.data.Nickname
            : choosen.name;

    const confirm = await confirmForm(
        player,
        'Add this Pokémon?',
        `Are you sure you want to add ${displayName} to your team?\nLvl: ${choosen.data.level}${nextLevel ? ` (${choosen.data.Experience ?? 0}/${nextLevel})` : ''}\nGrowth: ${wildPokemon[wildName].Growth}\nNature: ${choosen.data.Nature[0]}\nCaught With: ${choosen.data.pokeBall}\nTerra Type: ${choosen.data.Terra[0]}\nDynamax Lvl: ${choosen.data.DMax}/10\nTraded: ${choosen.data.Traded}\nHeld Item: ${ItemsList[choosen.data.heldItem] ?? "None"}\nBase:${choosen.data.Base_Health}/${choosen.data.Base_attack}/${choosen.data.Base_defense}/${choosen.data.Base_special_attack}/${choosen.data.Base_special_defense}/${choosen.data.Base_speed}\nIV's:${choosen.data.IV_health}/${choosen.data.IV_attack}/${choosen.data.IV_defense}/${choosen.data.IV_special_attack}/${choosen.data.IV_special_defense}/${choosen.data.IV_speed}\nEV's:${choosen.data.EV_health}/${choosen.data.EV_attack}/${choosen.data.EV_defense}/${choosen.data.EV_special_attack}/${choosen.data.EV_special_defense}/${choosen.data.EV_speed}`,
        '§aYes',
        '§cNo'
    );

    if (!confirm) return choose(player, slot);

    // ======================================
    // HANDLE SWAP: Deposit old team Pokémon
    // ======================================

    const oldTeamMon = selected[player.name]?.[slot];

    if (oldTeamMon) {

        const [oldRID, oldSpecies, oldData] = oldTeamMon;

        const pcData = listStorage(player).map(mon => [
            mon,
            readPokemon(player, mon, false)
        ]) as unknown as [string, { [rID: string]: shortHand }][];

        const page = currentPCPage[player.name] ?? 0;
        const targetBox = page + 1;

        const freeSlot = getFirstFreeSlotInBox(pcData, targetBox, player);

        if (freeSlot === undefined) {
            player.sendMessage(`§cBox ${targetBox} is full. Cannot swap.`);
            return;
        }

        const oldLong = oldData as longHand;

        clearPCPosition(oldLong);

        oldLong.Box = targetBox;
        oldLong.Slot = freeSlot;

        writePokemon(player, oldSpecies, oldRID, oldLong);
    }

    // ======================================
    // REMOVE NEW MON FROM PC
    // ======================================

    clearPCPosition(choosen.data);
    writePokemon(player, choosen.name, Number(choosen.rID), choosen.data);

    // ======================================
    // SET NEW TEAM SLOT
    // ======================================

    if (!selected.hasOwnProperty(player.name)) selected[player.name] = {};
    selected[player.name][slot] = [
        Number(choosen.rID),
        choosen.name,
        choosen.data
    ];

    system.run(() => {
        player.runCommand(`scoreboard players set @s poke${slot > 0 ? slot + 1 : ""}rID ${choosen.rID}`);
        player.runCommand(`scoreboard players set @s poke${slot > 0 ? slot + 1 : ""}Id ${pokemonList.indexOf(choosen.name as any)}`);
        player.runCommand(`scoreboard players set @s poke${slot > 0 ? slot + 1 : ""}Lvl ${choosen.data.level}`);
        player.runCommand(`scoreboard players set @s poke${slot > 0 ? slot + 1 : ""}Var ${choosen.data.Variant}`);
        player.runCommand(`scoreboard players set @s poke${slot > 0 ? slot + 1 : ""}HP ${choosen.data.Current_Health ?? 0}`);
        player.runCommand(`scoreboard players set @s poke${slot > 0 ? slot + 1 : ""}HPmax ${choosen.data.Base_Health}`);
        player.runCommand(`scoreboard players set @s poke${slot > 0 ? slot + 1 : ""}Ball ${Object.keys(ballTags).indexOf(choosen.data.pokeBall)}`);
    });

    await showResults(player, "PC", results, true);
}