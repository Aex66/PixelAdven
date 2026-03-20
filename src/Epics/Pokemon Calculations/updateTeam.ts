import { Player } from "@minecraft/server";
import { selected } from "../Main/Forms/PC/main";
import Commands from "../../Papers/CommandPaper/CommandPaper";
import pokemonList from "../../Letters/pokemon/list";

let cmd = Commands.create({
    name: "updateSidebar",
    category: "test"
})
cmd.callback((player) => updateSidebar(player))

export function updateSidebar(player: Player, slot?: number) {
    if (!selected.hasOwnProperty(player.name)) selected[player.name] = {};
    let slotValues = [0, 1, 2, 3, 4, 5]
    if (slot) slotValues = [slot]
    slotValues.forEach(i => {
        if (!selected[player.name].hasOwnProperty(`${i}`)) {
            player.runCommand(`scoreboard players reset @s poke${i > 0 ? i + 1 : ''}rID`);
            player.runCommand(`scoreboard players reset @s poke${i > 0 ? i + 1 : ''}Id`);
            player.runCommand(`scoreboard players reset @s poke${i > 0 ? i + 1 : ''}Lvl`);
            player.runCommand(`scoreboard players reset @s poke${i > 0 ? i + 1 : ''}Var`);
            player.runCommand(`scoreboard players reset @s poke${i > 0 ? i + 1 : ''}HP`);
            player.runCommand(`scoreboard players reset @s poke${i > 0 ? i + 1 : ''}HPmax`);
            player.runCommand(`scoreboard players reset @s poke${i > 0 ? i + 1 : ''}Ball`);
        } else {
            player.runCommand(`scoreboard players set @s poke${i > 0 ? i + 1 : ''}rID ${selected[player.name][i][0]}`);
            player.runCommand(`scoreboard players set @s poke${i > 0 ? i + 1 : ''}Id ${pokemonList.indexOf(selected[player.name][i][1] as any)}`);
            player.runCommand(`scoreboard players set @s poke${i > 0 ? i + 1 : ''}Lvl ${selected[player.name][i][2].level}`);
            player.runCommand(`scoreboard players set @s poke${i > 0 ? i + 1 : ''}Var ${selected[player.name][i][2].Variant}`);
            player.runCommand(`scoreboard players set @s poke${i > 0 ? i + 1 : ''}HP ${selected[player.name][i][2].Current_Health}`);
            player.runCommand(`scoreboard players set @s poke${i > 0 ? i + 1 : ''}HPmax ${selected[player.name][i][2].Base_Health}`);
        }
    })
}