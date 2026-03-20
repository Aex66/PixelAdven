import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { catchtype } from "./type_catch.js";

export function dragon0(player: Player) {
    const dragon0 = new ActionForm()
    dragon0.setTitle('Begin Catch Quest!!!')
    dragon0.setBody('Hello Trainer!! Are you ready to Start the Dragon Type Catching Quest')
    dragon0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    dragon0.addButton('Back', 'textures/items/crate.png') // 0
    dragon0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s dragonquest 1');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function dragon1(player: Player) {
    const dragon1 = new ActionForm()
    dragon1.setTitle('Lvl 1 Dragon Type Catch Quest Completed!!!')
    dragon1.setBody('Congrats Please click the button Below to claim your reward for Catching 10 Dragon Type Pokemon!!!')
    dragon1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    dragon1.addButton('Back', 'textures/items/crate.png') // 0
    dragon1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s dragonquest 2');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function dragon2(player: Player) {
    const dragon2 = new ActionForm()
    dragon2.setTitle('Lvl 2 Dragon Type Catch Quest Completed!!!')
    dragon2.setBody('Congrats Please click the button Below to claim your reward for Catching 50 Dragon Type Pokemon!!!')
    dragon2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    dragon2.addButton('Back', 'textures/items/crate.png') // 0
    dragon2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s dragonquest 3');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function dragon3(player: Player) {
    const dragon3 = new ActionForm()
    dragon3.setTitle('Lvl 3 Dragon Type Catch Quest Completed!!!')
    dragon3.setBody('Congrats Please click the button Below to claim your reward for Catching 100 Dragon Type Pokemon!!!')
    dragon3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    dragon3.addButton('Back', 'textures/items/crate.png') // 0
    dragon3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s dragonquest 4');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function dragon4(player: Player) {
    const dragon4 = new ActionForm()
    dragon4.setTitle('Lvl 4 Dragon Type Catch Quest Completed!!!')
    dragon4.setBody('Congrats Please click the button Below to claim your reward for Catching 150 Dragon Type Pokemon!!!')
    dragon4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    dragon4.addButton('Back', 'textures/items/crate.png') // 0
    dragon4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s dragonquest 5');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function dragon5(player: Player) {
    const dragon5 = new ActionForm()
    dragon5.setTitle('Lvl 5 Dragon Type Catch Quest Completed!!!')
    dragon5.setBody('Congrats Please click the button Below to claim your reward for Catching 250 Dragon Type Pokemon!!!')
    dragon5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    dragon5.addButton('Back', 'textures/items/crate.png') // 0
    dragon5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s dragonquest 6');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function dragon6(player: Player) {
    const dragon6 = new ActionForm()
    dragon6.setTitle('Lvl 6 Dragon Type Catch Quest Completed!!!')
    dragon6.setBody('Congrats Please click the button Below to claim your reward for Catching 500 Dragon Type Pokemon!!!')
    dragon6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    dragon6.addButton('Back', 'textures/items/crate.png') // 0
    dragon6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s dragonquest 7');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function dragon7(player: Player) {
    const dragon7 = new ActionForm()
    dragon7.setTitle('Lvl 7 Dragon Type Catch Quest Completed!!!')
    dragon7.setBody('Congrats Please click the button Below to claim your reward for Catching 1k Dragon Type Pokemon!!!')
    dragon7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    dragon7.addButton('Back', 'textures/items/crate.png') // 0
    dragon7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s dragonquest 8');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function dragon8(player: Player) {
    const dragon8 = new ActionForm()
    dragon8.setTitle('Lvl 8 Dragon Type Catch Quest Completed!!!')
    dragon8.setBody('Congrats Please click the button Below to claim your reward for Catching 2.5k Dragon Type Pokemon!!!')
    dragon8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    dragon8.addButton('Back', 'textures/items/crate.png') // 0
    dragon8.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 2 0');
            player.runCommand('scoreboard players set @s dragonquest 9');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function dragon9(player: Player) {
    const dragon9 = new ActionForm()
    dragon9.setTitle('Lvl 9 Dragon Type Catch Quest Completed!!!')
    dragon9.setBody('Congrats Please click the button Below to claim your reward for Catching 5k Dragon Type Pokemon!!!')
    dragon9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    dragon9.addButton('Back', 'textures/items/crate.png') // 0
    dragon9.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 3 0');
            player.runCommand('scoreboard players set @s dragonquest 10');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function dragon10(player: Player) {
    const dragon10 = new ActionForm()
    dragon10.setTitle('Lvl 10 Dragon Type Catch Quest Completed!!!')
    dragon10.setBody('Congrats Please click the button Below to claim your reward for Catching 10k Dragon Type Pokemon!!!')
    dragon10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    dragon10.addButton('Back', 'textures/items/crate.png') // 0
    dragon10.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 5 0');
            player.runCommand('scoreboard players set @s dragonquest 11');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function dragon0_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Dragon Quest Stage 0 completed!');
  player.runCommand('scoreboard players set @s dragonquest 1');
}

export function dragon1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Dragon Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s dragonquest 2');
}

export function dragon2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Dragon Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s dragonquest 3');
}

export function dragon3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Dragon Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s dragonquest 4');
}

export function dragon4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Dragon Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s dragonquest 5');
}

export function dragon5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Dragon Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
  player.runCommand('scoreboard players set @s dragonquest 6');
}

export function dragon6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Dragon Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
  player.runCommand('scoreboard players set @s dragonquest 7');
}

export function dragon7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Dragon Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0');
  player.runCommand('scoreboard players set @s dragonquest 8');
}

export function dragon8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Dragon Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2 0');
  player.runCommand('scoreboard players set @s dragonquest 9');
}

export function dragon9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Dragon Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3 0');
  player.runCommand('scoreboard players set @s dragonquest 10');
}

export function dragon10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Dragon Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5 0');
  player.runCommand('scoreboard players set @s dragonquest 11');
}
