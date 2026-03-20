import { world } from "@minecraft/server";
import pokemonList from "../../Letters/pokemon/list";
import Commands from "../../Papers/CommandPaper/CommandPaper";
import { selected } from "../Main/Forms/PC/main";
const cmd = Commands.create({
    name: 'viewTeam',
    aliases: ['vt'],
    description: 'This command lets you view someones team',
    admin: true,
    category: "Misc"
});

cmd.startingArgs(['player']);
cmd.playerType('player', (sender, target, args) => {
    let pokemon: string[] = []
    if (!selected.hasOwnProperty(target.name)) selected[target.name] = {};
    for (let i = 0; i < 6; i++) {
        if (!selected[target.name].hasOwnProperty(`${i}`)) continue;
        selected[target.name][i][2]
        let pokeId = world.scoreboard.getObjective(`poke${i > 0 ? i + 1 : ''}Id`)?.getScore(target) ?? 0
        let pokeLvl = world.scoreboard.getObjective(`poke${i > 0 ? i + 1 : ''}Lvl`)?.getScore(target) ?? 0
        let pokeVar = world.scoreboard.getObjective(`poke${i > 0 ? i + 1 : ''}Var`)?.getScore(target) ?? 0
        let pokeHP = world.scoreboard.getObjective(`poke${i > 0 ? i + 1 : ''}HP`)?.getScore(target) ?? 0
        let pokeHPmax = world.scoreboard.getObjective(`poke${i > 0 ? i + 1 : ''}HPmax`)?.getScore(target) ?? 0
        pokemon.push(`Slot ${i > 0 ? i + 1 : 1}\n--------\nPokemon: ${pokemonList[pokeId]} ${pokeVar == 0 ? '' : `(Shiny)`}\nHealth: ${pokeHP}/${pokeHPmax}\nLevel: ${pokeLvl}`)
    }
    sender.sendMessage(`${target.name}'s Team\n\n${pokemon.join("\n\n")}`)
}, true);