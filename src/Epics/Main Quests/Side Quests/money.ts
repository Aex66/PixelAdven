import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { openSideQuestMenu } from "./quest_main.js";

export function money0(player: Player) {
    const money0 = new ActionForm()
    money0.setTitle('Begin Catch Quest!!!')
    money0.setBody('Hello Trainer!! Are you ready to Start the Money Quest')
    money0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    money0.addButton('Back', 'textures/items/crate.png') // 0
    money0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s money_quest 1');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}

export function money1(player: Player) {
    const money1 = new ActionForm()
    money1.setTitle('Lvl 1 Money Quest Completed!!!')
    money1.setBody('Congrats Please click the button Below to claim your reward for having 50K PokeCoins!!!')
    money1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    money1.addButton('Back', 'textures/items/crate.png') // 0
    money1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 1 0');
            player.runCommand('scoreboard players set @s money_quest 2');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function money2(player: Player) {
    const money2 = new ActionForm()
    money2.setTitle('Lvl 2 Money Quest Completed!!!')
    money2.setBody('Congrats Please click the button Below to claim your reward for having 100k PokeCoins!!!')
    money2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    money2.addButton('Back', 'textures/items/crate.png') // 0
    money2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!')
            player.runCommand('give @s pokeworld:pokeball_ticket 3 0');
            player.runCommand('scoreboard players set @s money_quest 3');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function money3(player: Player) {
    const money3 = new ActionForm()
    money3.setTitle('Lvl 3 Money Quest Completed!!!')
    money3.setBody('Congrats Please click the button Below to claim your reward for having 250k PokeCoins!!!')
    money3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    money3.addButton('Back', 'textures/items/crate.png') // 0
    money3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 1 0');
            player.runCommand('scoreboard players set @s money_quest 4');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function money4(player: Player) {
    const money4 = new ActionForm()
    money4.setTitle('Lvl 4 Money Quest Completed!!!')
    money4.setBody('Congrats Please click the button Below to claim your reward for having 500k PokeCoins!!!')
    money4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    money4.addButton('Back', 'textures/items/crate.png') // 0
    money4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 3 0');
            player.runCommand('scoreboard players set @s money_quest 5');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function money5(player: Player) {
    const money5 = new ActionForm()
    money5.setTitle('Lvl 5 Money Quest Completed!!!')
    money5.setBody('Congrats Please click the button Below to claim your reward for having 1Mil PokeCoins!!!')
    money5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    money5.addButton('Back', 'textures/items/crate.png') // 0
    money5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s money_quest 6');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function money6(player: Player) {
    const money6 = new ActionForm()
    money6.setTitle('Lvl 6 Money Quest Completed!!!')
    money6.setBody('Congrats Please click the button Below to claim your reward for having 2.5Mil PokeCoins!!!')
    money6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    money6.addButton('Back', 'textures/items/crate.png') // 0
    money6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s money_quest 7');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function money7(player: Player) {
    const money7 = new ActionForm()
    money7.setTitle('Lvl 7 Money Quest Completed!!!')
    money7.setBody('Congrats Please click the button Below to claim your reward for having 5Mil PokeCoins!!!')
    money7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    money7.addButton('Back', 'textures/items/crate.png') // 0
    money7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s money_quest 8');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}


export function money0_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Money Quest Stage 0 completed!');
  player.runCommand('scoreboard players set @s money_quest 1');
}

export function money1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Money Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1 0');
  player.runCommand('scoreboard players set @s money_quest 2');
}

export function money2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Money Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3 0');
  player.runCommand('scoreboard players set @s money_quest 3');
}

export function money3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Money Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1 0');
  player.runCommand('scoreboard players set @s money_quest 4');
}

export function money4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Money Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3 0');
  player.runCommand('scoreboard players set @s money_quest 5');
}

export function money5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Money Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
  player.runCommand('scoreboard players set @s money_quest 6');
}

export function money6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Money Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
  player.runCommand('scoreboard players set @s money_quest 7');
}

export function money7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Money Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0');
  player.runCommand('scoreboard players set @s money_quest 8');
}
