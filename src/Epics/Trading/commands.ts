import { Player, system } from "@minecraft/server";
import { selected } from "../Main/Forms/PC/main.js";
import { deletePokemon, writePokemon } from "../Pokemon Database/main.js";
import pokemonList from "../../Letters/pokemon/list.js";
import { ballTags } from "../Pokemon Calculations/catch.js";
import type { longHand } from "../Pokemon Database/@types/types.d.ts";

export type TradeEntry = {
    sent: [number, string, longHand, number];
    recieved: [number, string, longHand, number] | null;
};

export type TradeEscrow = {
    [requesterName: string]: {
        [accepterName: string]: TradeEntry;
    };
};

export const instance: TradeEscrow = {};

export function completeTrade(requester: Player, accepter: Player) {
    const trade = instance[requester.name]?.[accepter.name];
    if (!trade?.sent || !trade.recieved) {
        requester.sendMessage("§cTrade data is incomplete.");
        return;
    }

    const [sentId, sentName, sentData, sentSlot] = trade.sent;
    const [recvId, recvName, recvData, recvSlot] = trade.recieved;

    sentData.Traded = true;
    recvData.Traded = true;

    writePokemon(accepter, sentName, sentId, sentData);
    writePokemon(requester, recvName, recvId, recvData);

    deletePokemon(requester, sentName, sentId);
    deletePokemon(accepter, recvName, recvId);

    selected[accepter.name] ??= {};
    selected[accepter.name][recvSlot] = [sentId, sentName, sentData];

    selected[requester.name] ??= {};
    selected[requester.name][sentSlot] = [recvId, recvName, recvData];

    updateScoreboard(accepter, recvSlot, sentId, sentName, sentData);
    updateScoreboard(requester, sentSlot, recvId, recvName, recvData);

    requester.sendMessage(`§aYou traded your §e${sentName} §afor §e${recvName}§a!`);
    accepter.sendMessage(`§aYou traded your §e${recvName} §afor §e${sentName}§a!`);

    delete instance[requester.name][accepter.name];
    delete instance[accepter.name]?.[requester.name];

    return {
        senderMon: [recvId, recvName, recvData],
        senderSlot: sentSlot,
        receiverMon: [sentId, sentName, sentData],
        receiverSlot: recvSlot
    };
}

function updateScoreboard(
    player: Player,
    slot: number,
    rID: number,
    name: string,
    data: longHand
) {
    const slotNum = slot + 1;
    const pokeId = pokemonList.indexOf(name as (typeof pokemonList)[number]);
    const pokeBallIndex = Object.keys(ballTags).indexOf(data.pokeBall);

    system.run(() => {
        player.runCommand(`scoreboard players set @s poke${slotNum}rID ${rID}`);
        player.runCommand(`scoreboard players set @s poke${slotNum}Id ${pokeId}`);
        player.runCommand(`scoreboard players set @s poke${slotNum}Lvl ${data.level}`);
        player.runCommand(`scoreboard players set @s poke${slotNum}Var ${data.Variant}`);
        player.runCommand(`scoreboard players set @s poke${slotNum}HP ${data.Current_Health ?? 0}`);
        player.runCommand(`scoreboard players set @s poke${slotNum}HPmax ${data.Base_Health}`);
        player.runCommand(`scoreboard players set @s poke${slotNum}Ball ${pokeBallIndex}`);
    });
}
