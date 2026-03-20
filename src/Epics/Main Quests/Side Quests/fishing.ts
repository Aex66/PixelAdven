import { Player, system } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { openSideQuestMenu } from "./quest_main.js";

export function fishing0(player: Player) {
    const fishing0 = new ActionForm()
    fishing0.setTitle('Begin Fish Quest!!!')
    fishing0.setBody('Hello Trainer!! Are you ready to Start the Fishing Quest')
    fishing0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    fishing0.addButton('Back', 'textures/items/crate.png') // 0
    fishing0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s fishquest 1');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }

    })
}
export function fishing1(player: Player) {
    const fishing1 = new ActionForm()
    fishing1.setTitle('Lvl 1 Fish Quest Completed!!!')
    fishing1.setBody('Congrats Please click the button Below to claim your reward for fishing 10 Pokemon!!!')
    fishing1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    fishing1.addButton('Back', 'textures/items/crate.png') // 0
    fishing1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s fishquest 2');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }

    })
}
export function fishing2(player: Player) {
    const fishing2 = new ActionForm()
    fishing2.setTitle('Lvl 2 Fish Quest Completed!!!')
    fishing2.setBody('Congrats Please click the button Below to claim your reward for fishing 50 Pokemon!!!')
    fishing2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    fishing2.addButton('Back', 'textures/items/crate.png') // 0
    fishing2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s fishquest 3');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }

    })
}
export function fishing3(player: Player) {
    const fishing3 = new ActionForm()
    fishing3.setTitle('Lvl 3 Fish Quest Completed!!!')
    fishing3.setBody('Congrats Please click the button Below to claim your reward for fishing 100 Pokemon!!!')
    fishing3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    fishing3.addButton('Back', 'textures/items/crate.png') // 0
    fishing3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s fishquest 4');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }

    })
}
export function fishing4(player: Player) {
    const fishing4 = new ActionForm()
    fishing4.setTitle('Lvl 4 Fish Quest Completed!!!')
    fishing4.setBody('Congrats Please click the button Below to claim your reward for fishing 150 Pokemon!!!')
    fishing4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    fishing4.addButton('Back', 'textures/items/crate.png') // 0
    fishing4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s fishquest 5');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }

    })
}
export function fishing5(player: Player) {
    const fishing5 = new ActionForm()
    fishing5.setTitle('Lvl 5 Fish Quest Completed!!!')
    fishing5.setBody('Congrats Please click the button Below to claim your reward for fishing 250 Pokemon!!!')
    fishing5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    fishing5.addButton('Back', 'textures/items/crate.png') // 0
    fishing5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s fishquest 6');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }

    })
}
export function fishing6(player: Player) {
    const fishing6 = new ActionForm()
    fishing6.setTitle('Lvl 6 Fish Quest Completed!!!')
    fishing6.setBody('Congrats Please click the button Below to claim your reward for fishing 500 Pokemon!!!')
    fishing6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    fishing6.addButton('Back', 'textures/items/crate.png') // 0
    fishing6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s fishquest 7');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }

    })
}
export function fishing7(player: Player) {
    const fishing7 = new ActionForm()
    fishing7.setTitle('Lvl 7 Fish Quest Completed!!!')
    fishing7.setBody('Congrats Please click the button Below to claim your reward for fishing 1k Pokemon!!!')
    fishing7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    fishing7.addButton('Back', 'textures/items/crate.png') // 0
    fishing7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s fishquest 8');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }

    })
}
export function fishing8(player: Player) {
    const fishing8 = new ActionForm()
    fishing8.setTitle('Lvl 8 Fish Quest Completed!!!')
    fishing8.setBody('Congrats Please click the button Below to claim your reward for fishing 2.5k Pokemon!!!')
    fishing8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    fishing8.addButton('Back', 'textures/items/crate.png') // 0
    fishing8.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 2 0');
            player.runCommand('scoreboard players set @s fishquest 9');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }

    })
}
export function fishing9(player: Player) {
    const fishing9 = new ActionForm()
    fishing9.setTitle('Lvl 9 Fish Quest Completed!!!')
    fishing9.setBody('Congrats Please click the button Below to claim your reward for fishing 5k Pokemon!!!')
    fishing9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    fishing9.addButton('Back', 'textures/items/crate.png') // 0
    fishing9.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 3 0');
            player.runCommand('scoreboard players set @s fishquest 10');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }

    })
}
export function fishing10(player: Player) {
    const fishing10 = new ActionForm()
    fishing10.setTitle('Lvl 10 Fish Quest Completed!!!')
    fishing10.setBody('Congrats Please click the button Below to claim your reward for fishing 10k Pokemon!!!')
    fishing10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    fishing10.addButton('Back', 'textures/items/crate.png') // 0
    fishing10.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 5 0');
            player.runCommand('scoreboard players set @s fishquest 11');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }

    })
}

export function fishing1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fishing Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s fishquest 2');
}

export function fishing2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fishing Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s fishquest 3');
}

export function fishing3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fishing Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s fishquest 4');
}

export function fishing4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fishing Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s fishquest 5');
}

export function fishing5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fishing Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
  player.runCommand('scoreboard players set @s fishquest 6');
}

export function fishing6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fishing Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
  player.runCommand('scoreboard players set @s fishquest 7');
}

export function fishing7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fishing Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0');
  player.runCommand('scoreboard players set @s fishquest 8');
}

export function fishing8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fishing Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2 0');
  player.runCommand('scoreboard players set @s fishquest 9');
}

export function fishing9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fishing Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3 0');
  player.runCommand('scoreboard players set @s fishquest 10');
}

export function fishing10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fishing Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5 0');
  player.runCommand('scoreboard players set @s fishquest 11');
}
