import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { openSideQuestMenu } from "./quest_main.js";

export function catching0(player: Player) {
    const catching0 = new ActionForm()
    catching0.setTitle('Begin Catch Quest!!!')
    catching0.setBody('Hello Trainer!! Are you ready to Start the Catching Quest')
    catching0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    catching0.addButton('Back', 'textures/items/crate.png')
    catching0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s catchquest 1');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }
    })
}

export function catching1(player: Player) {
    const catching1 = new ActionForm()
    catching1.setTitle('Lvl 1 Catch Quest Completed!!!')
    catching1.setBody('Reward for catching 10 Pokémon')
    catching1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    catching1.addButton('Back', 'textures/items/crate.png')
    catching1.send(player, function (res) {
        if (res.canceled) return;
        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s catchquest 2');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    })
}

export function catching2(player: Player) {
    const catching2 = new ActionForm()
    catching2.setTitle('Lvl 2 Catch Quest Completed!!!')
    catching2.setBody('Reward for catching 50 Pokémon')
    catching2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    catching2.addButton('Back', 'textures/items/crate.png')
    catching2.send(player, function (res) {
        if (res.canceled) return;
        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s catchquest 3');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    })
}

export function catching3(player: Player) {
    const catching3 = new ActionForm()
    catching3.setTitle('Lvl 3 Catch Quest Completed!!!')
    catching3.setBody('Reward for catching 100 Pokémon')
    catching3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    catching3.addButton('Back', 'textures/items/crate.png')
    catching3.send(player, function (res) {
        if (res.canceled) return;
        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s catchquest 4');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    })
}

export function catching4(player: Player) {
    const catching4 = new ActionForm()
    catching4.setTitle('Lvl 4 Catch Quest Completed!!!')
    catching4.setBody('Reward for catching 150 Pokémon')
    catching4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    catching4.addButton('Back', 'textures/items/crate.png')
    catching4.send(player, function (res) {
        if (res.canceled) return;
        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s catchquest 5');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    })
}

export function catching5(player: Player) {
    const catching5 = new ActionForm()
    catching5.setTitle('Lvl 5 Catch Quest Completed!!!')
    catching5.setBody('Reward for catching 250 Pokémon')
    catching5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    catching5.addButton('Back', 'textures/items/crate.png')
    catching5.send(player, function (res) {
        if (res.canceled) return;
        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s catchquest 6');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    })
}

export function catching6(player: Player) {
    const catching6 = new ActionForm()
    catching6.setTitle('Lvl 6 Catch Quest Completed!!!')
    catching6.setBody('Reward for catching 500 Pokémon')
    catching6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    catching6.addButton('Back', 'textures/items/crate.png')
    catching6.send(player, function (res) {
        if (res.canceled) return;
        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s catchquest 7');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    })
}

export function catching7(player: Player) {
    const catching7 = new ActionForm()
    catching7.setTitle('Lvl 7 Catch Quest Completed!!!')
    catching7.setBody('Reward for catching 1,000 Pokémon')
    catching7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    catching7.addButton('Back', 'textures/items/crate.png')
    catching7.send(player, function (res) {
        if (res.canceled) return;
        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s catchquest 8');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    })
}

export function catching8(player: Player) {
    const catching8 = new ActionForm()
    catching8.setTitle('Lvl 8 Catch Quest Completed!!!')
    catching8.setBody('Reward for catching 2,500 Pokémon')
    catching8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    catching8.addButton('Back', 'textures/items/crate.png')
    catching8.send(player, function (res) {
        if (res.canceled) return;
        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:masterball_ticket 2 0');
            player.runCommand('scoreboard players set @s catchquest 9');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    })
}

export function catching9(player: Player) {
    const catching9 = new ActionForm()
    catching9.setTitle('Lvl 9 Catch Quest Completed!!!')
    catching9.setBody('Reward for catching 5,000 Pokémon')
    catching9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    catching9.addButton('Back', 'textures/items/crate.png')
    catching9.send(player, function (res) {
        if (res.canceled) return;
        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:masterball_ticket 3 0');
            player.runCommand('scoreboard players set @s catchquest 10');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    })
}

export function catching10(player: Player) {
    const catching10 = new ActionForm()
    catching10.setTitle('Lvl 10 Catch Quest Completed!!!')
    catching10.setBody('Reward for catching 10,000 Pokémon')
    catching10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    catching10.addButton('Back', 'textures/items/crate.png')
    catching10.send(player, function (res) {
        if (res.canceled) return;
        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:masterball_ticket 5 0');
            player.runCommand('scoreboard players set @s catchquest 11');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    })
}

/* AUTO-CLAIM REWARDS */

export function catching0_reward(player: Player) {
    player.sendMessage('§a✔ Catching Quest Stage 0 completed!');
    player.runCommand('scoreboard players set @s catchquest 1');
}

export function catching1_reward(player: Player) {
    player.sendMessage('§a✔ Catching Quest Stage 1 completed!');
    player.runCommand('give @s pokeworld:pokeball_ticket 1');
    player.runCommand('scoreboard players set @s catchquest 2');
}

export function catching2_reward(player: Player) {
    player.sendMessage('§a✔ Catching Quest Stage 2 completed!');
    player.runCommand('give @s pokeworld:pokeball_ticket 3');
    player.runCommand('scoreboard players set @s catchquest 3');
}

export function catching3_reward(player: Player) {
    player.sendMessage('§a✔ Catching Quest Stage 3 completed!');
    player.runCommand('give @s pokeworld:greatball_ticket 1');
    player.runCommand('scoreboard players set @s catchquest 4');
}

export function catching4_reward(player: Player) {
    player.sendMessage('§a✔ Catching Quest Stage 4 completed!');
    player.runCommand('give @s pokeworld:greatball_ticket 3');
    player.runCommand('scoreboard players set @s catchquest 5');
}

export function catching5_reward(player: Player) {
    player.sendMessage('§a✔ Catching Quest Stage 5 completed!');
    player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
    player.runCommand('scoreboard players set @s catchquest 6');
}

export function catching6_reward(player: Player) {
    player.sendMessage('§a✔ Catching Quest Stage 6 completed!');
    player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
    player.runCommand('scoreboard players set @s catchquest 7');
}

export function catching7_reward(player: Player) {
    player.sendMessage('§a✔ Catching Quest Stage 7 completed!');
    player.runCommand('give @s pokeworld:masterball_ticket 1 0');
    player.runCommand('scoreboard players set @s catchquest 8');
}

export function catching8_reward(player: Player) {
    player.sendMessage('§a✔ Catching Quest Stage 8 completed!');
    player.runCommand('give @s pokeworld:masterball_ticket 2 0');
    player.runCommand('scoreboard players set @s catchquest 9');
}

export function catching9_reward(player: Player) {
    player.sendMessage('§a✔ Catching Quest Stage 9 completed!');
    player.runCommand('give @s pokeworld:masterball_ticket 3 0');
    player.runCommand('scoreboard players set @s catchquest 10');
}

export function catching10_reward(player: Player) {
    player.sendMessage('§a✔ Catching Quest Stage 10 completed!');
    player.runCommand('give @s pokeworld:masterball_ticket 5 0');
    player.runCommand('scoreboard players set @s catchquest 11');
}
