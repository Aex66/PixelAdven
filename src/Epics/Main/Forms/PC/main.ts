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
import { world, Player as IPlayer, system } from "@minecraft/server";
import { sleep } from "../../../../Papers/Paragraphs/ExtrasParagraphs.js";
import { listStorage, readPokemon } from "../../../Pokemon Database/main.js";
import { addListener } from "../../../../Tales/main.js";
import type { longHand, shortHand } from '../../../Pokemon Database/@types/types.js';
import {debugPC, showResults } from "./search.js";
import pokemonList from "../../../../Letters/pokemon/list.js";
import Player from '../../../../Papers/PlayerPaper.js';
import { ballTags } from "../../../Pokemon Calculations/catch.js";
import { forceRepairAllPCPokemon, PC_REPAIRED_TAG } from "../../../Pokemon Database/PcControls.js";

export const selected = {} as { [name: string]: { [index: number]: [id: number, name: string, data: longHand] } };
addListener('playerConnect', async plr => {
    await sleep(200);
    const player = Player.playerType(plr);
    if (selected.hasOwnProperty(player.name)) return;
    if (!selected.hasOwnProperty(player.name)) selected[player.name] = {};
    for (let i = 0; i < 6; i++) {
        const rID = player.getScore(`poke${i > 0 ? i + 1 : ''}rID`), id = player.getScore(`poke${i > 0 ? i + 1 : ''}Id`);
        if (!rID) continue;
        const mon = readPokemon(player, pokemonList[id], true)?.[`${rID}`];
        if (!mon) continue;
        selected[player.name][i] = [rID, pokemonList[id], mon];
        //Dynamics
        player.runCommand(`scoreboard players set @s poke${i > 0 ? i + 1 : ''}Lvl ${mon.level}`);
        player.runCommand(`scoreboard players set @s poke${i > 0 ? i + 1 : ''}HP ${mon.Current_Health ?? 0}`);
        player.runCommand(`scoreboard players set @s poke${i > 0 ? i + 1 : ''}HPmax ${mon.Base_Health}`);
        player.runCommand(`scoreboard players set @s poke${i > 0 ? i + 1 : ''}Ball ${Object.keys(ballTags).indexOf(mon.pokeBall)}`);
    }
});

world.afterEvents.entityHitEntity.subscribe(async (eventData) => {
    const { damagingEntity, hitEntity } = eventData;
    if (!(damagingEntity instanceof IPlayer)) return;
    if (!hitEntity || hitEntity.typeId !== "pokeworld:pc") return;

    // 🔒 HARD REPAIR — RUN ONCE ONLY
    if (!damagingEntity.hasTag(PC_REPAIRED_TAG)) {
        forceRepairAllPCPokemon(damagingEntity);
        damagingEntity.addTag(PC_REPAIRED_TAG);
        damagingEntity.sendMessage("§a✔ PC layout repaired.");
    }

    // 🔁 ALWAYS re-read AFTER repair
    const has = listStorage(damagingEntity);
    const results = has.map(mon => [
        mon,
        readPokemon(damagingEntity, mon, true)
    ]) as unknown as [string, { [rID: string]: shortHand }][];
    await showResults(damagingEntity, "PC", results, false);
});

const pcOpenLock = new Set<string>();

world.beforeEvents.playerInteractWithBlock.subscribe((eventData) => {
    const { player, block } = eventData;
    if (!(player instanceof IPlayer)) return;
    if (!block || block.typeId !== "pokeworld:pc_block") return;

    // 🚫 Prevent vanilla interaction
    eventData.cancel = true;

    // 🔒 Prevent reopen spam
    if (pcOpenLock.has(player.name)) return;
    pcOpenLock.add(player.name);

    system.run(async () => {

        // 🔧 Repair once
        if (!player.hasTag(PC_REPAIRED_TAG)) {
            forceRepairAllPCPokemon(player);
            player.addTag(PC_REPAIRED_TAG);
            player.sendMessage("§a✔ PC layout repaired.");
        }

        const has = listStorage(player);
        const results = has.map(mon => [
            mon,
            readPokemon(player, mon, true)
        ]) as unknown as [string, { [rID: string]: shortHand }][];

        await showResults(player, "PC", results, false);

        // 🔓 Only unlock AFTER form finishes
        system.runTimeout(() => {
            pcOpenLock.delete(player.name);
        }, 20); // 20 ticks = 1 second (stable)
    });
});