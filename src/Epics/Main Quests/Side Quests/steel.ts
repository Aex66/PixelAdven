import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { catchtype } from "./type_catch.js";

export function steel0(player: Player) {
    const steel0 = new ActionForm()
    steel0.setTitle('Begin Catch Quest!!!')
    steel0.setBody('Hello Trainer!! Are you ready to Start the Steel Type Catching Quest')
    steel0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    steel0.addButton('Back', 'textures/items/crate.png') // 0
    steel0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s steelquest 1');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function steel1(player: Player) {
    const steel1 = new ActionForm()
    steel1.setTitle('Lvl 1 Steel Type Catch Quest Completed!!!')
    steel1.setBody('Congrats Please click the button Below to claim your reward for Catching 10 Steel Type Pokemon!!!')
    steel1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    steel1.addButton('Back', 'textures/items/crate.png') // 0
    steel1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s steelquest 2');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function steel2(player: Player) {
    const steel2 = new ActionForm()
    steel2.setTitle('Lvl 2 Steel Type Catch Quest Completed!!!')
    steel2.setBody('Congrats Please click the button Below to claim your reward for Catching 50 Steel Type Pokemon!!!')
    steel2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    steel2.addButton('Back', 'textures/items/crate.png') // 0
    steel2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s steelquest 3');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function steel3(player: Player) {
    const steel3 = new ActionForm()
    steel3.setTitle('Lvl 3 Steel Type Catch Quest Completed!!!')
    steel3.setBody('Congrats Please click the button Below to claim your reward for Catching 100 Steel Type Pokemon!!!')
    steel3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    steel3.addButton('Back', 'textures/items/crate.png') // 0
    steel3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s steelquest 4');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function steel4(player: Player) {
    const steel4 = new ActionForm()
    steel4.setTitle('Lvl 4 Steel Type Catch Quest Completed!!!')
    steel4.setBody('Congrats Please click the button Below to claim your reward for Catching 150 Steel Type Pokemon!!!')
    steel4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    steel4.addButton('Back', 'textures/items/crate.png') // 0
    steel4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s steelquest 5');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function steel5(player: Player) {
    const steel5 = new ActionForm()
    steel5.setTitle('Lvl 5 Steel Type Catch Quest Completed!!!')
    steel5.setBody('Congrats Please click the button Below to claim your reward for Catching 250 Steel Type Pokemon!!!')
    steel5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    steel5.addButton('Back', 'textures/items/crate.png') // 0
    steel5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s steelquest 6');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function steel6(player: Player) {
    const steel6 = new ActionForm()
    steel6.setTitle('Lvl 6 Steel Type Catch Quest Completed!!!')
    steel6.setBody('Congrats Please click the button Below to claim your reward for Catching 500 Steel Type Pokemon!!!')
    steel6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    steel6.addButton('Back', 'textures/items/crate.png') // 0
    steel6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s steelquest 7');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function steel7(player: Player) {
    const steel7 = new ActionForm()
    steel7.setTitle('Lvl 7 Steel Type Catch Quest Completed!!!')
    steel7.setBody('Congrats Please click the button Below to claim your reward for Catching 1k Steel Type Pokemon!!!')
    steel7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    steel7.addButton('Back', 'textures/items/crate.png') // 0
    steel7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s steelquest 8');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function steel8(player: Player) {
    const steel8 = new ActionForm()
    steel8.setTitle('Lvl 8 Steel Type Catch Quest Completed!!!')
    steel8.setBody('Congrats Please click the button Below to claim your reward for Catching 2.5k Steel Type Pokemon!!!')
    steel8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    steel8.addButton('Back', 'textures/items/crate.png') // 0
    steel8.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 2 0');
            player.runCommand('scoreboard players set @s steelquest 9');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function steel9(player: Player) {
    const steel9 = new ActionForm()
    steel9.setTitle('Lvl 9 Steel Type Catch Quest Completed!!!')
    steel9.setBody('Congrats Please click the button Below to claim your reward for Catching 5k Steel Type Pokemon!!!')
    steel9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    steel9.addButton('Back', 'textures/items/crate.png') // 0
    steel9.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 3 0');
            player.runCommand('scoreboard players set @s steelquest 10');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function steel10(player: Player) {
    const steel10 = new ActionForm()
    steel10.setTitle('Lvl 10 Steel Type Catch Quest Completed!!!')
    steel10.setBody('Congrats Please click the button Below to claim your reward for Catching 10k Steel Type Pokemon!!!')
    steel10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    steel10.addButton('Back', 'textures/items/crate.png') // 0
    steel10.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 5 0');
            player.runCommand('scoreboard players set @s steelquest 11');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function steel0_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Steel Quest Stage 0 completed!');
  player.runCommand('scoreboard players set @s steelquest 1');
}

export function steel1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Steel Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s steelquest 2');
}

export function steel2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Steel Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s steelquest 3');
}

export function steel3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Steel Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s steelquest 4');
}

export function steel4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Steel Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s steelquest 5');
}

export function steel5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Steel Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
  player.runCommand('scoreboard players set @s steelquest 6');
}

export function steel6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Steel Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
  player.runCommand('scoreboard players set @s steelquest 7');
}

export function steel7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Steel Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0');
  player.runCommand('scoreboard players set @s steelquest 8');
}

export function steel8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Steel Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2 0');
  player.runCommand('scoreboard players set @s steelquest 9');
}

export function steel9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Steel Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3 0');
  player.runCommand('scoreboard players set @s steelquest 10');
}

export function steel10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Steel Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5 0');
  player.runCommand('scoreboard players set @s steelquest 111');
}
