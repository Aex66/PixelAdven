import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { catchtype } from "./type_catch.js";

export function ghost0(player: Player) {
    const ghost0 = new ActionForm()
    ghost0.setTitle('Begin Catch Quest!!!')
    ghost0.setBody('Hello Trainer!! Are you ready to Start the Ghost Type Catching Quest')
    ghost0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    ghost0.addButton('Back', 'textures/items/crate.png') // 0
    ghost0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s ghostquest 1');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ghost1(player: Player) {
    const ghost1 = new ActionForm()
    ghost1.setTitle('Lvl 1 Ghost Type Catch Quest Completed!!!')
    ghost1.setBody('Congrats Please click the button Below to claim your reward for Catching 10 Ghost Type Pokemon!!!')
    ghost1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    ghost1.addButton('Back', 'textures/items/crate.png') // 0
    ghost1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s ghostquest 2');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ghost2(player: Player) {
    const ghost2 = new ActionForm()
    ghost2.setTitle('Lvl 2 Ghost Type Catch Quest Completed!!!')
    ghost2.setBody('Congrats Please click the button Below to claim your reward for Catching 50 Ghost Type Pokemon!!!')
    ghost2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    ghost2.addButton('Back', 'textures/items/crate.png') // 0
    ghost2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s ghostquest 3');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ghost3(player: Player) {
    const ghost3 = new ActionForm()
    ghost3.setTitle('Lvl 3 Ghost Type Catch Quest Completed!!!')
    ghost3.setBody('Congrats Please click the button Below to claim your reward for Catching 100 Ghost Type Pokemon!!!')
    ghost3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    ghost3.addButton('Back', 'textures/items/crate.png') // 0
    ghost3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s ghostquest 4');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ghost4(player: Player) {
    const ghost4 = new ActionForm()
    ghost4.setTitle('Lvl 4 Ghost Type Catch Quest Completed!!!')
    ghost4.setBody('Congrats Please click the button Below to claim your reward for Catching 150 Ghost Type Pokemon!!!')
    ghost4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    ghost4.addButton('Back', 'textures/items/crate.png') // 0
    ghost4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s ghostquest 5');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ghost5(player: Player) {
    const ghost5 = new ActionForm()
    ghost5.setTitle('Lvl 5 Ghost Type Catch Quest Completed!!!')
    ghost5.setBody('Congrats Please click the button Below to claim your reward for Catching 250 Ghost Type Pokemon!!!')
    ghost5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    ghost5.addButton('Back', 'textures/items/crate.png') // 0
    ghost5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s ghostquest 6');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ghost6(player: Player) {
    const ghost6 = new ActionForm()
    ghost6.setTitle('Lvl 6 Ghost Type Catch Quest Completed!!!')
    ghost6.setBody('Congrats Please click the button Below to claim your reward for Catching 500 Ghost Type Pokemon!!!')
    ghost6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    ghost6.addButton('Back', 'textures/items/crate.png') // 0
    ghost6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s ghostquest 7');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ghost7(player: Player) {
    const ghost7 = new ActionForm()
    ghost7.setTitle('Lvl 7 Ghost Type Catch Quest Completed!!!')
    ghost7.setBody('Congrats Please click the button Below to claim your reward for Catching 1k Ghost Type Pokemon!!!')
    ghost7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    ghost7.addButton('Back', 'textures/items/crate.png') // 0
    ghost7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s ghostquest 8');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ghost8(player: Player) {
    const ghost8 = new ActionForm()
    ghost8.setTitle('Lvl 8 Ghost Type Catch Quest Completed!!!')
    ghost8.setBody('Congrats Please click the button Below to claim your reward for Catching 2.5k Ghost Type Pokemon!!!')
    ghost8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    ghost8.addButton('Back', 'textures/items/crate.png') // 0
    ghost8.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 2 0');
            player.runCommand('scoreboard players set @s ghostquest 9');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ghost9(player: Player) {
    const ghost9 = new ActionForm()
    ghost9.setTitle('Lvl 9 Ghost Type Catch Quest Completed!!!')
    ghost9.setBody('Congrats Please click the button Below to claim your reward for Catching 5k Ghost Type Pokemon!!!')
    ghost9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    ghost9.addButton('Back', 'textures/items/crate.png') // 0
    ghost9.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 3 0');
            player.runCommand('scoreboard players set @s ghostquest 10');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ghost10(player: Player) {
    const ghost10 = new ActionForm()
    ghost10.setTitle('Lvl 10 Ghost Type Catch Quest Completed!!!')
    ghost10.setBody('Congrats Please click the button Below to claim your reward for Catching 10k Ghost Type Pokemon!!!')
    ghost10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    ghost10.addButton('Back', 'textures/items/crate.png') // 0
    ghost10.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 5 0');
            player.runCommand('scoreboard players set @s ghostquest 11');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ghost0_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ghost Quest Stage 0 completed!');
  player.runCommand('scoreboard players set @s ghostquest 1');
}

export function ghost1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ghost Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s ghostquest 2');
}

export function ghost2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ghost Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s ghostquest 3');
}

export function ghost3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ghost Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s ghostquest 4');
}

export function ghost4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ghost Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s ghostquest 5');
}

export function ghost5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ghost Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
  player.runCommand('scoreboard players set @s ghostquest 6');
}

export function ghost6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ghost Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
  player.runCommand('scoreboard players set @s ghostquest 7');
}

export function ghost7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ghost Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0');
  player.runCommand('scoreboard players set @s ghostquest 8');
}

export function ghost8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ghost Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2 0');
  player.runCommand('scoreboard players set @s ghostquest 9');
}

export function ghost9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ghost Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3 0');
  player.runCommand('scoreboard players set @s ghostquest 10');
}

export function ghost10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ghost Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5 0');
  player.runCommand('scoreboard players set @s ghostquest 11');
}
