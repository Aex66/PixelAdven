import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { openSideQuestMenu } from "./quest_main.js";

export function egg0(player: Player) {
    const egg0 = new ActionForm()
    egg0.setTitle('Begin Hatching Quest!!!')
    egg0.setBody('Hello Trainer!! Are you ready to Start the Hatching Quest')
    egg0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    egg0.addButton('Back', 'textures/items/crate.png') // 0
    egg0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s egg_quest 1');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }

    })
}
export function egg1(player: Player) {
    const egg1 = new ActionForm()
    egg1.setTitle('Lvl 1 Hatching Quest Completed!!!')
    egg1.setBody('Congrats Please click the button Below to claim your reward for hatching 10 Pokemon!!!')
    egg1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    egg1.addButton('Back', 'textures/items/crate.png') // 0
    egg1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s egg_quest 2');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }

    })
}
export function egg2(player: Player) {
    const egg2 = new ActionForm()
    egg2.setTitle('Lvl 2 Hatching Quest Completed!!!')
    egg2.setBody('Congrats Please click the button Below to claim your reward for hatching 15 Pokemon!!!')
    egg2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    egg2.addButton('Back', 'textures/items/crate.png') // 0
    egg2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s egg_quest 3');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }

    })
}
export function egg3(player: Player) {
    const egg3 = new ActionForm()
    egg3.setTitle('Lvl 3 Hatching Quest Completed!!!')
    egg3.setBody('Congrats Please click the button Below to claim your reward for hatching 25 Pokemon!!!')
    egg3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    egg3.addButton('Back', 'textures/items/crate.png') // 0
    egg3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s egg_quest 4');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }

    })
}
export function egg4(player: Player) {
    const egg4 = new ActionForm()
    egg4.setTitle('Lvl 4 Hatching Quest Completed!!!')
    egg4.setBody('Congrats Please click the button Below to claim your reward for hatching 50 Pokemon!!!')
    egg4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    egg4.addButton('Back', 'textures/items/crate.png') // 0
    egg4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s egg_quest 5');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }

    })
}
export function egg5(player: Player) {
    const egg5 = new ActionForm()
    egg5.setTitle('Lvl 5 Hatching Quest Completed!!!')
    egg5.setBody('Congrats Please click the button Below to claim your reward for hatching 100 Pokemon!!!')
    egg5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    egg5.addButton('Back', 'textures/items/crate.png') // 0
    egg5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s egg_quest 6');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }

    })
}
export function egg6(player: Player) {
    const egg6 = new ActionForm()
    egg6.setTitle('Lvl 6 Hatching Quest Completed!!!')
    egg6.setBody('Congrats Please click the button Below to claim your reward for hatching 150 Pokemon!!!')
    egg6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    egg6.addButton('Back', 'textures/items/crate.png') // 0
    egg6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s egg_quest 7');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }

    })
}
export function egg7(player: Player) {
    const egg7 = new ActionForm()
    egg7.setTitle('Lvl 7 Hatching Quest Completed!!!')
    egg7.setBody('Congrats Please click the button Below to claim your reward for hatching 200 Pokemon!!!')
    egg7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    egg7.addButton('Back', 'textures/items/crate.png') // 0
    egg7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s egg_quest 8');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }

    })
}
export function egg8(player: Player) {
    const egg8 = new ActionForm()
    egg8.setTitle('Lvl 8 Hatching Quest Completed!!!')
    egg8.setBody('Congrats Please click the button Below to claim your reward for hatching 250 Pokemon!!!')
    egg8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    egg8.addButton('Back', 'textures/items/crate.png') // 0
    egg8.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 2 0');
            player.runCommand('scoreboard players set @s egg_quest 9');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }

    })
}
export function egg9(player: Player) {
    const egg9 = new ActionForm()
    egg9.setTitle('Lvl 9 Hatching Quest Completed!!!')
    egg9.setBody('Congrats Please click the button Below to claim your reward for hatching 500 Pokemon!!!')
    egg9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    egg9.addButton('Back', 'textures/items/crate.png') // 0
    egg9.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 3 0');
            player.runCommand('scoreboard players set @s egg_quest 10');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }

    })
}
export function egg10(player: Player) {
    const egg10 = new ActionForm()
    egg10.setTitle('Lvl 10 Hatching Quest Completed!!!')
    egg10.setBody('Congrats Please click the button Below to claim your reward for hatching 1000 Pokemon!!!')
    egg10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    egg10.addButton('Back', 'textures/items/crate.png') // 0
    egg10.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 5 0');
            player.runCommand('scoreboard players set @s egg_quest 11');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }

    })
}

export function egg1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Egg Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s egg_quest 2');
}

export function egg2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Egg Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s egg_quest 3');
}

export function egg3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Egg Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s egg_quest 4');
}

export function egg4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Egg Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s egg_quest 5');
}

export function egg5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Egg Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
  player.runCommand('scoreboard players set @s egg_quest 6');
}

export function egg6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Egg Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
  player.runCommand('scoreboard players set @s egg_quest 7');
}

export function egg7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Egg Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0');
  player.runCommand('scoreboard players set @s egg_quest 8');
}

export function egg8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Egg Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2 0');
  player.runCommand('scoreboard players set @s egg_quest 9');
}

export function egg9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Egg Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3 0');
  player.runCommand('scoreboard players set @s egg_quest 10');
}

export function egg10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Egg Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5 0');
  player.runCommand('scoreboard players set @s egg_quest 11');
}
