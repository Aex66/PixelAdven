import { Player, system } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { openSideQuestMenu } from "./quest_main.js";

export function walking0(player: Player) {
    const walking0 = new ActionForm()
    walking0.setTitle('Begin Catch Quest!!!')
    walking0.setBody('Hello Trainer!! Are you ready to Start the Walking Quest')
    walking0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    walking0.addButton('Back', 'textures/items/crate.png') // 0
    walking0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s walk_quest 1');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }
    })
}

export function walking1(player: Player) {
    const walking1 = new ActionForm()
    walking1.setTitle('Lvl 1 Walking Quest Completed!!!')
    walking1.setBody('Congrats Please click the button Below to claim your reward for walking a distance 2.5k Blocks!!!')
    walking1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    walking1.addButton('Back', 'textures/items/crate.png') // 0
    walking1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s walk_quest 2');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function walking2(player: Player) {
    const walking2 = new ActionForm()
    walking2.setTitle('Lvl 2 Walking Quest Completed!!!')
    walking2.setBody('Congrats Please click the button Below to claim your reward for walking a distance 5k Blocks!!!')
    walking2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    walking2.addButton('Back', 'textures/items/crate.png') // 0
    walking2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s walk_quest 3');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function walking3(player: Player) {
    const walking3 = new ActionForm()
    walking3.setTitle('Lvl 3 Walking Quest Completed!!!')
    walking3.setBody('Congrats Please click the button Below to claim your reward for walking a distance 10k Blocks!!!')
    walking3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    walking3.addButton('Back', 'textures/items/crate.png') // 0
    walking3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s walk_quest 4');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function walking4(player: Player) {
    const walking4 = new ActionForm()
    walking4.setTitle('Lvl 4 Walking Quest Completed!!!')
    walking4.setBody('Congrats Please click the button Below to claim your reward for walking a distance 15k Blocks!!!')
    walking4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    walking4.addButton('Back', 'textures/items/crate.png') // 0
    walking4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s walk_quest 5');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function walking5(player: Player) {
    const walking5 = new ActionForm()
    walking5.setTitle('Lvl 5 Walking Quest Completed!!!')
    walking5.setBody('Congrats Please click the button Below to claim your reward for walking a distance 25k Blocks!!!')
    walking5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    walking5.addButton('Back', 'textures/items/crate.png') // 0
    walking5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s walk_quest 6');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function walking6(player: Player) {
    const walking6 = new ActionForm()
    walking6.setTitle('Lvl 6 Walking Quest Completed!!!')
    walking6.setBody('Congrats Please click the button Below to claim your reward for walking a distance 50k Blocks!!!')
    walking6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    walking6.addButton('Back', 'textures/items/crate.png') // 0
    walking6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s walk_quest 7');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function walking7(player: Player) {
    const walking7 = new ActionForm()
    walking7.setTitle('Lvl 7 Walking Quest Completed!!!')
    walking7.setBody('Congrats Please click the button Below to claim your reward for walking a distance 100k Blocks!!!')
    walking7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    walking7.addButton('Back', 'textures/items/crate.png') // 0
    walking7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s walk_quest 8');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function walking8(player: Player) {
    const walking8 = new ActionForm()
    walking8.setTitle('Lvl 8 Walking Quest Completed!!!')
    walking8.setBody('Congrats Please click the button Below to claim your reward for walking a distance 250k Blocks!!!')
    walking8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    walking8.addButton('Back', 'textures/items/crate.png') // 0
    walking8.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 2 0');
            player.runCommand('scoreboard players set @s walk_quest 9');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function walking9(player: Player) {
    const walking9 = new ActionForm()
    walking9.setTitle('Lvl 9 Walking Quest Completed!!!')
    walking9.setBody('Congrats Please click the button Below to claim your reward for walking a distance 500k Blocks!!!')
    walking9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    walking9.addButton('Back', 'textures/items/crate.png') // 0
    walking9.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 3 0');
            player.runCommand('scoreboard players set @s walk_quest 10');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function walking10(player: Player) {
    const walking10 = new ActionForm()
    walking10.setTitle('Lvl 10 Walking Quest Completed!!!')
    walking10.setBody('Congrats Please click the button Below to claim your reward for walking a distance 1M Blocks!!!')
    walking10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    walking10.addButton('Back', 'textures/items/crate.png') // 0
    walking10.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 5 0');
            player.runCommand('scoreboard players set @s walk_quest 11');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}


export function walking1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Walking Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s walk_quest 2');
}

export function walking2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Walking Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s walk_quest 3');
}

export function walking3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Walking Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s walk_quest 4');
}

export function walking4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Walking Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s walk_quest 5');
}

export function walking5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Walking Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
  player.runCommand('scoreboard players set @s walk_quest 6');
}

export function walking6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Walking Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
  player.runCommand('scoreboard players set @s walk_quest 7');
}

export function walking7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Walking Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0');
  player.runCommand('scoreboard players set @s walk_quest 8');
}

export function walking8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Walking Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2 0');
  player.runCommand('scoreboard players set @s walk_quest 9');
}

export function walking9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Walking Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3 0');
  player.runCommand('scoreboard players set @s walk_quest 10');
}

export function walking10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Walking Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5 0');
  player.runCommand('scoreboard players set @s walk_quest 11');
}
