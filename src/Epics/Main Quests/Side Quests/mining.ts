import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { openSideQuestMenu } from "./quest_main.js";

export function mining0(player: Player) {
    const mining0 = new ActionForm()
    mining0.setTitle('Begin Mining Quest!!!')
    mining0.setBody('Hello Trainer!! Are you ready to Start the Mining Quest')
    mining0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    mining0.addButton('Back', 'textures/items/crate.png')
    mining0.send(player, res => {
        if (res.canceled) return;
        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s minequest 1');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }
    });
}

export function mining1(player: Player) {
    const mining1 = new ActionForm()
    mining1.setTitle('Lvl 1 Mining Quest Completed!!!')
    mining1.setBody('Reward for mining 10 Underground Tunnels')
    mining1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    mining1.addButton('Back', 'textures/items/crate.png')
    mining1.send(player, res => {
        if (res.canceled) return;
        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s minequest 2');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    });
}

export function mining2(player: Player) {
    const mining2 = new ActionForm()
    mining2.setTitle('Lvl 2 Mining Quest Completed!!!')
    mining2.setBody('Reward for mining 25 Underground Tunnels')
    mining2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    mining2.addButton('Back', 'textures/items/crate.png')
    mining2.send(player, res => {
        if (res.canceled) return;
        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s minequest 3');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    });
}

export function mining3(player: Player) {
    const mining3 = new ActionForm()
    mining3.setTitle('Lvl 3 Mining Quest Completed!!!')
    mining3.setBody('Reward for mining 50 Underground Tunnels')
    mining3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    mining3.addButton('Back', 'textures/items/crate.png')
    mining3.send(player, res => {
        if (res.canceled) return;
        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s minequest 4');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    });
}

export function mining4(player: Player) {
    const mining4 = new ActionForm()
    mining4.setTitle('Lvl 4 Mining Quest Completed!!!')
    mining4.setBody('Reward for mining 100 Underground Tunnels')
    mining4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    mining4.addButton('Back', 'textures/items/crate.png')
    mining4.send(player, res => {
        if (res.canceled) return;
        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s minequest 5');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    });
}

export function mining5(player: Player) {
    const mining5 = new ActionForm()
    mining5.setTitle('Lvl 5 Mining Quest Completed!!!')
    mining5.setBody('Reward for mining 250 Underground Tunnels')
    mining5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    mining5.addButton('Back', 'textures/items/crate.png')
    mining5.send(player, res => {
        if (res.canceled) return;
        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:ultraball_ticket 2');
            player.runCommand('scoreboard players add @s ultracrate 2');
            player.runCommand('scoreboard players set @s minequest 6');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    });
}

export function mining6(player: Player) {
    const mining6 = new ActionForm()
    mining6.setTitle('Lvl 6 Mining Quest Completed!!!')
    mining6.setBody('Reward for mining 500 Underground Tunnels')
    mining6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    mining6.addButton('Back', 'textures/items/crate.png')
    mining6.send(player, res => {
        if (res.canceled) return;
        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:ultraball_ticket 5');
            player.runCommand('scoreboard players add @s ultracrate 5');
            player.runCommand('scoreboard players set @s minequest 7');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    });
}

export function mining7(player: Player) {
    const mining7 = new ActionForm()
    mining7.setTitle('Lvl 7 Mining Quest Completed!!!')
    mining7.setBody('Reward for mining 1,000 Underground Tunnels')
    mining7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    mining7.addButton('Back', 'textures/items/crate.png')
    mining7.send(player, res => {
        if (res.canceled) return;
        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:masterball_ticket 1');
            player.runCommand('scoreboard players set @s minequest 8');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    });
}

export function mining8(player: Player) {
    const mining8 = new ActionForm()
    mining8.setTitle('Lvl 8 Mining Quest Completed!!!')
    mining8.setBody('Reward for mining 2,500 Underground Tunnels')
    mining8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    mining8.addButton('Back', 'textures/items/crate.png')
    mining8.send(player, res => {
        if (res.canceled) return;
        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:masterball_ticket 2');
            player.runCommand('scoreboard players add @s mastercrate 2');
            player.runCommand('scoreboard players set @s minequest 9');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    });
}

export function mining9(player: Player) {
    const mining9 = new ActionForm()
    mining9.setTitle('Lvl 9 Mining Quest Completed!!!')
    mining9.setBody('Reward for mining 5,000 Underground Tunnels')
    mining9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    mining9.addButton('Back', 'textures/items/crate.png')
    mining9.send(player, res => {
        if (res.canceled) return;
        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:masterball_ticket 3');
            player.runCommand('scoreboard players set @s minequest 10');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    });
}

export function mining10(player: Player) {
    const mining10 = new ActionForm()
    mining10.setTitle('Lvl 10 Mining Quest Completed!!!')
    mining10.setBody('Reward for mining 10,000 Underground Tunnels')
    mining10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    mining10.addButton('Back', 'textures/items/crate.png')
    mining10.send(player, res => {
        if (res.canceled) return;
        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:masterball_ticket 5');
            player.runCommand('scoreboard players add @s mastercrate 5');
            player.runCommand('scoreboard players set @s minequest 11');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    });
}

export function mining0_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Mining Quest Stage 0 completed!');
  player.runCommand('scoreboard players set @s minequest 1');
}

export function mining1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Mining Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s minequest 2');
}

export function mining2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Mining Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s minequest 3');
}

export function mining3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Mining Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s minequest 4');
}

export function mining4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Mining Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s minequest 5');
}

export function mining5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Mining Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2');
  player.runCommand('scoreboard players add @s ultracrate 2');
  player.runCommand('scoreboard players set @s minequest 6');
}

export function mining6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Mining Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5');
  player.runCommand('scoreboard players add @s ultracrate 5');
  player.runCommand('scoreboard players set @s minequest 7');
}

export function mining7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Mining Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1');
  player.runCommand('scoreboard players set @s minequest 8');
}

export function mining8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Mining Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2');
  player.runCommand('scoreboard players add @s mastercrate 2');
  player.runCommand('scoreboard players set @s minequest 9');
}

export function mining9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Mining Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3');
  player.runCommand('scoreboard players set @s minequest 10');
}

export function mining10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Mining Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5');
  player.runCommand('scoreboard players add @s mastercrate 5');
  player.runCommand('scoreboard players set @s minequest 11');
}
