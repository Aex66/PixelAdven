import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { openSideQuestMenu } from "./quest_main.js";

export function swimming0(player: Player) {
    const swimming0 = new ActionForm()
    swimming0.setTitle('Begin Catch Quest!!!')
    swimming0.setBody('Hello Trainer!! Are you ready to Start the Swimming Quest')
    swimming0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    swimming0.addButton('Back', 'textures/items/crate.png') // 0
    swimming0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s swim_quest 1');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}

export function swimming1(player: Player) {
    const swimming1 = new ActionForm()
    swimming1.setTitle('Lvl 1 Walking Quest Completed!!!')
    swimming1.setBody('Congrats Please click the button Below to claim your reward for swimming a distance 2.5k Blocks!!!')
    swimming1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    swimming1.addButton('Back', 'textures/items/crate.png') // 0
    swimming1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s swim_quest 2');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function swimming2(player: Player) {
    const swimming2 = new ActionForm()
    swimming2.setTitle('Lvl 2 Walking Quest Completed!!!')
    swimming2.setBody('Congrats Please click the button Below to claim your reward for swimming a distance 5k Blocks!!!')
    swimming2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    swimming2.addButton('Back', 'textures/items/crate.png') // 0
    swimming2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s swim_quest 3');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function swimming3(player: Player) {
    const swimming3 = new ActionForm()
    swimming3.setTitle('Lvl 3 Walking Quest Completed!!!')
    swimming3.setBody('Congrats Please click the button Below to claim your reward for swimming a distance 10k Blocks!!!')
    swimming3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    swimming3.addButton('Back', 'textures/items/crate.png') // 0
    swimming3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s swim_quest 4');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function swimming4(player: Player) {
    const swimming4 = new ActionForm()
    swimming4.setTitle('Lvl 4 Walking Quest Completed!!!')
    swimming4.setBody('Congrats Please click the button Below to claim your reward for swimming a distance 15k Blocks!!!')
    swimming4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    swimming4.addButton('Back', 'textures/items/crate.png') // 0
    swimming4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s swim_quest 5');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function swimming5(player: Player) {
    const swimming5 = new ActionForm()
    swimming5.setTitle('Lvl 5 Walking Quest Completed!!!')
    swimming5.setBody('Congrats Please click the button Below to claim your reward for swimming a distance 25k Blocks!!!')
    swimming5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    swimming5.addButton('Back', 'textures/items/crate.png') // 0
    swimming5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s swim_quest 6');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function swimming6(player: Player) {
    const swimming6 = new ActionForm()
    swimming6.setTitle('Lvl 6 Walking Quest Completed!!!')
    swimming6.setBody('Congrats Please click the button Below to claim your reward for swimming a distance 50k Blocks!!!')
    swimming6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    swimming6.addButton('Back', 'textures/items/crate.png') // 0
    swimming6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s swim_quest 7');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function swimming7(player: Player) {
    const swimming7 = new ActionForm()
    swimming7.setTitle('Lvl 7 Walking Quest Completed!!!')
    swimming7.setBody('Congrats Please click the button Below to claim your reward for swimming a distance 100k Blocks!!!')
    swimming7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    swimming7.addButton('Back', 'textures/items/crate.png') // 0
    swimming7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s swim_quest 8');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function swimming8(player: Player) {
    const swimming8 = new ActionForm()
    swimming8.setTitle('Lvl 8 Walking Quest Completed!!!')
    swimming8.setBody('Congrats Please click the button Below to claim your reward for swimming a distance 250k Blocks!!!')
    swimming8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    swimming8.addButton('Back', 'textures/items/crate.png') // 0
    swimming8.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 2 0');
            player.runCommand('scoreboard players set @s swim_quest 9');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function swimming9(player: Player) {
    const swimming9 = new ActionForm()
    swimming9.setTitle('Lvl 9 Walking Quest Completed!!!')
    swimming9.setBody('Congrats Please click the button Below to claim your reward for swimming a distance 500k Blocks!!!')
    swimming9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    swimming9.addButton('Back', 'textures/items/crate.png') // 0
    swimming9.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 3 0');
            player.runCommand('scoreboard players set @s swim_quest 10');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}
export function swimming10(player: Player) {
    const swimming10 = new ActionForm()
    swimming10.setTitle('Lvl 10 Walking Quest Completed!!!')
    swimming10.setBody('Congrats Please click the button Below to claim your reward for swimming a distance 1M Blocks!!!')
    swimming10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    swimming10.addButton('Back', 'textures/items/crate.png') // 0
    swimming10.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 5 0');
            player.runCommand('scoreboard players set @s swim_quest 11');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }


    })
}

export function swimming1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Swimming Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s swim_quest 2');
}

export function swimming2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Swimming Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s swim_quest 3');
}

export function swimming3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Swimming Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s swim_quest 4');
}

export function swimming4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Swimming Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s swim_quest 5');
}

export function swimming5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Swimming Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
  player.runCommand('scoreboard players set @s swim_quest 6');
}

export function swimming6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Swimming Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
  player.runCommand('scoreboard players set @s swim_quest 7');
}

export function swimming7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Swimming Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0');
  player.runCommand('scoreboard players set @s swim_quest 8');
}

export function swimming8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Swimming Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2 0');
  player.runCommand('scoreboard players set @s swim_quest 9');
}

export function swimming9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Swimming Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3 0');
  player.runCommand('scoreboard players set @s swim_quest 10');
}

export function swimming10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Swimming Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5 0');
  player.runCommand('scoreboard players set @s swim_quest 11');
}
