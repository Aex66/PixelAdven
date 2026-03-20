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
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import { selected } from '../Main/Forms/PC/main.js';
import pokemonList from '../../Letters/pokemon/list.js';

const cmd = Commands.create({
    name: 'pc',
    category: 'Pokemon Database',
    admin: true
});

cmd.startingArgs(['wipe', 'selected']);

cmd.dynamicType('wipe', ['wipe', 'clear', 'reset'], (player, _, args) => {
    const target = args[0];
    if (target?.name !== player.name && !player.isAdmin) {
        return player.error('You cannot wipe other players because you are not admin');
    }

    // Fully wipe all Pokémon storage dynamic properties
    for (const species of pokemonList) {
        target.setDynamicProperty(`ROT:${species}`, undefined);
    }

    delete selected[target.name];

    for (let i = 0; i < 6; i++) {
        target.runCommand(`scoreboard players set @s poke${i > 0 ? i + 1 : ''}rID 0`);
        target.runCommand(`scoreboard players set @s poke${i > 0 ? i + 1 : ''}Id 0`);
        target.runCommand(`scoreboard players reset @s poke${i > 0 ? i + 1 : ''}Lvl`);
        target.runCommand(`scoreboard players reset @s poke${i > 0 ? i + 1 : ''}Var`);
        target.runCommand(`scoreboard players reset @s poke${i > 0 ? i + 1 : ''}HP`);
        target.runCommand(`scoreboard players reset @s poke${i > 0 ? i + 1 : ''}HPmax`);
        target.runCommand(`scoreboard players reset @s poke${i > 0 ? i + 1 : ''}Ball`);
    }

    player.send('Player PC has been cleared!');
    if (target.name !== player.name) {
        target.send(`Your player's PC has been cleared by ${player.name}`);
    }
}, 'player');


cmd.dynamicType('selected', ['selected', 'team', 'view'], (player, _, args) => {
    player.sendMessage(
    `§7--- Selected Pokémon Data ---\n§f` +
    JSON.stringify(selected[args[0].name], null, 2)
);
}, 'player');

cmd.playerType('player');