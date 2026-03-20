import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { catchtype } from "./type_catch.js";

export function electric0(player: Player) {
    const electric0 = new ActionForm()
    electric0.setTitle('Begin Catch Quest!!!')
    electric0.setBody('Hello Trainer!! Are you ready to Start the Electric Type Catching Quest')
    electric0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    electric0.addButton('Back', 'textures/items/crate.png') // 0
    electric0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s electricquest 1');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function electric1(player: Player) {
    const electric1 = new ActionForm()
    electric1.setTitle('Lvl 1 Electric Type Catch Quest Completed!!!')
    electric1.setBody('Congrats Please click the button Below to claim your reward for Catching 10 Electric Type Pokemon!!!')
    electric1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    electric1.addButton('Back', 'textures/items/crate.png') // 0
    electric1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s electricquest 2');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function electric2(player: Player) {
    const electric2 = new ActionForm()
    electric2.setTitle('Lvl 2 Electric Type Catch Quest Completed!!!')
    electric2.setBody('Congrats Please click the button Below to claim your reward for Catching 50 Electric Type Pokemon!!!')
    electric2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    electric2.addButton('Back', 'textures/items/crate.png') // 0
    electric2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s electricquest 3');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function electric3(player: Player) {
    const electric3 = new ActionForm()
    electric3.setTitle('Lvl 3 Electric Type Catch Quest Completed!!!')
    electric3.setBody('Congrats Please click the button Below to claim your reward for Catching 100 Electric Type Pokemon!!!')
    electric3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    electric3.addButton('Back', 'textures/items/crate.png') // 0
    electric3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s electricquest 4');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function electric4(player: Player) {
    const electric4 = new ActionForm()
    electric4.setTitle('Lvl 4 Electric Type Catch Quest Completed!!!')
    electric4.setBody('Congrats Please click the button Below to claim your reward for Catching 150 Electric Type Pokemon!!!')
    electric4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    electric4.addButton('Back', 'textures/items/crate.png') // 0
    electric4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s electricquest 5');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function electric5(player: Player) {
    const electric5 = new ActionForm()
    electric5.setTitle('Lvl 5 Electric Type Catch Quest Completed!!!')
    electric5.setBody('Congrats Please click the button Below to claim your reward for Catching 250 Electric Type Pokemon!!!')
    electric5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    electric5.addButton('Back', 'textures/items/crate.png') // 0
    electric5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s electricquest 6');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function electric6(player: Player) {
    const electric6 = new ActionForm()
    electric6.setTitle('Lvl 6 Electric Type Catch Quest Completed!!!')
    electric6.setBody('Congrats Please click the button Below to claim your reward for Catching 500 Electric Type Pokemon!!!')
    electric6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    electric6.addButton('Back', 'textures/items/crate.png') // 0
    electric6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s electricquest 7');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function electric7(player: Player) {
    const electric7 = new ActionForm()
    electric7.setTitle('Lvl 7 Electric Type Catch Quest Completed!!!')
    electric7.setBody('Congrats Please click the button Below to claim your reward for Catching 1k Electric Type Pokemon!!!')
    electric7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    electric7.addButton('Back', 'textures/items/crate.png') // 0
    electric7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s electricquest 8');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function electric8(player: Player) {
    const electric8 = new ActionForm()
    electric8.setTitle('Lvl 8 Electric Type Catch Quest Completed!!!')
    electric8.setBody('Congrats Please click the button Below to claim your reward for Catching 2.5k Electric Type Pokemon!!!')
    electric8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    electric8.addButton('Back', 'textures/items/crate.png') // 0
    electric8.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 2 0');
            player.runCommand('scoreboard players set @s electricquest 9');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function electric9(player: Player) {
    const electric9 = new ActionForm()
    electric9.setTitle('Lvl 9 Electric Type Catch Quest Completed!!!')
    electric9.setBody('Congrats Please click the button Below to claim your reward for Catching 5k Electric Type Pokemon!!!')
    electric9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    electric9.addButton('Back', 'textures/items/crate.png') // 0
    electric9.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 3 0');
            player.runCommand('scoreboard players set @s electricquest 10');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function electric10(player: Player) {
    const electric10 = new ActionForm()
    electric10.setTitle('Lvl 10 Electric Type Catch Quest Completed!!!')
    electric10.setBody('Congrats Please click the button Below to claim your reward for Catching 10k Electric Type Pokemon!!!')
    electric10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    electric10.addButton('Back', 'textures/items/crate.png') // 0
    electric10.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 5 0');
            player.runCommand('scoreboard players set @s electricquest 11');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function electric0_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Electric Quest Stage 0 completed!');
  player.runCommand('scoreboard players set @s electricquest 1');
}

export function electric1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Electric Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s electricquest 2');
}

export function electric2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Electric Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s electricquest 3');
}

export function electric3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Electric Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s electricquest 4');
}

export function electric4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Electric Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s electricquest 5');
}

export function electric5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Electric Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
  player.runCommand('scoreboard players set @s electricquest 6');
}

export function electric6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Electric Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
  player.runCommand('scoreboard players set @s electricquest 7');
}

export function electric7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Electric Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0');
  player.runCommand('scoreboard players set @s electricquest 8');
}

export function electric8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Electric Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2 0');
  player.runCommand('scoreboard players set @s electricquest 9');
}

export function electric9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Electric Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3 0');
  player.runCommand('scoreboard players set @s electricquest 10');
}

export function electric10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Electric Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5 0');
  player.runCommand('scoreboard players set @s electricquest 11');
}
