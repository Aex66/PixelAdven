import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { catchtype } from "./type_catch.js";

export function fighting0(player: Player) {
    const fighting0 = new ActionForm()
    fighting0.setTitle('Begin Catch Quest!!!')
    fighting0.setBody('Hello Trainer!! Are you ready to Start the Fighting Type Catching Quest')
    fighting0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    fighting0.addButton('Back', 'textures/items/crate.png') // 0
    fighting0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s fightingquest 1');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fighting1(player: Player) {
    const fighting1 = new ActionForm()
    fighting1.setTitle('Lvl 1 Fighting Type Catch Quest Completed!!!')
    fighting1.setBody('Congrats Please click the button Below to claim your reward for Catching 10 Fighting Type Pokemon!!!')
    fighting1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    fighting1.addButton('Back', 'textures/items/crate.png') // 0
    fighting1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s fightingquest 2');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fighting2(player: Player) {
    const fighting2 = new ActionForm()
    fighting2.setTitle('Lvl 2 Fighting Type Catch Quest Completed!!!')
    fighting2.setBody('Congrats Please click the button Below to claim your reward for Catching 50 Fighting Type Pokemon!!!')
    fighting2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    fighting2.addButton('Back', 'textures/items/crate.png') // 0
    fighting2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s fightingquest 3');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fighting3(player: Player) {
    const fighting3 = new ActionForm()
    fighting3.setTitle('Lvl 3 Fighting Type Catch Quest Completed!!!')
    fighting3.setBody('Congrats Please click the button Below to claim your reward for Catching 100 Fighting Type Pokemon!!!')
    fighting3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    fighting3.addButton('Back', 'textures/items/crate.png') // 0
    fighting3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s fightingquest 4');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fighting4(player: Player) {
    const fighting4 = new ActionForm()
    fighting4.setTitle('Lvl 4 Fighting Type Catch Quest Completed!!!')
    fighting4.setBody('Congrats Please click the button Below to claim your reward for Catching 150 Fighting Type Pokemon!!!')
    fighting4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    fighting4.addButton('Back', 'textures/items/crate.png') // 0
    fighting4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s fightingquest 5');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fighting5(player: Player) {
    const fighting5 = new ActionForm()
    fighting5.setTitle('Lvl 5 Fighting Type Catch Quest Completed!!!')
    fighting5.setBody('Congrats Please click the button Below to claim your reward for Catching 250 Fighting Type Pokemon!!!')
    fighting5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    fighting5.addButton('Back', 'textures/items/crate.png') // 0
    fighting5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s fightingquest 6');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fighting6(player: Player) {
    const fighting6 = new ActionForm()
    fighting6.setTitle('Lvl 6 Fighting Type Catch Quest Completed!!!')
    fighting6.setBody('Congrats Please click the button Below to claim your reward for Catching 500 Fighting Type Pokemon!!!')
    fighting6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    fighting6.addButton('Back', 'textures/items/crate.png') // 0
    fighting6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s fightingquest 7');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fighting7(player: Player) {
    const fighting7 = new ActionForm()
    fighting7.setTitle('Lvl 7 Fighting Type Catch Quest Completed!!!')
    fighting7.setBody('Congrats Please click the button Below to claim your reward for Catching 1k Fighting Type Pokemon!!!')
    fighting7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    fighting7.addButton('Back', 'textures/items/crate.png') // 0
    fighting7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s fightingquest 8');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fighting8(player: Player) {
    const fighting8 = new ActionForm()
    fighting8.setTitle('Lvl 8 Fighting Type Catch Quest Completed!!!')
    fighting8.setBody('Congrats Please click the button Below to claim your reward for Catching 2.5k Fighting Type Pokemon!!!')
    fighting8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    fighting8.addButton('Back', 'textures/items/crate.png') // 0
    fighting8.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 2 0');
            player.runCommand('scoreboard players set @s fightingquest 9');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fighting9(player: Player) {
    const fighting9 = new ActionForm()
    fighting9.setTitle('Lvl 9 Fighting Type Catch Quest Completed!!!')
    fighting9.setBody('Congrats Please click the button Below to claim your reward for Catching 5k Fighting Type Pokemon!!!')
    fighting9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    fighting9.addButton('Back', 'textures/items/crate.png') // 0
    fighting9.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 3 0');
            player.runCommand('scoreboard players set @s fightingquest 10');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fighting10(player: Player) {
    const fighting10 = new ActionForm()
    fighting10.setTitle('Lvl 10 Fighting Type Catch Quest Completed!!!')
    fighting10.setBody('Congrats Please click the button Below to claim your reward for Catching 10k Fighting Type Pokemon!!!')
    fighting10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    fighting10.addButton('Back', 'textures/items/crate.png') // 0
    fighting10.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 5 0');
            player.runCommand('scoreboard players set @s fightingquest 11');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fighting0_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fighting Quest Stage 0 completed!');
  player.runCommand('scoreboard players set @s fightingquest 1');
}

export function fighting1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fighting Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s fightingquest 2');
}

export function fighting2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fighting Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s fightingquest 3');
}

export function fighting3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fighting Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s fightingquest 4');
}

export function fighting4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fighting Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s fightingquest 5');
}

export function fighting5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fighting Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
  player.runCommand('scoreboard players set @s fightingquest 6');
}

export function fighting6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fighting Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
  player.runCommand('scoreboard players set @s fightingquest 7');
}

export function fighting7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fighting Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0');
  player.runCommand('scoreboard players set @s fightingquest 8');
}

export function fighting8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fighting Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2 0');
  player.runCommand('scoreboard players set @s fightingquest 9');
}

export function fighting9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fighting Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3 0');
  player.runCommand('scoreboard players set @s fightingquest 10');
}

export function fighting10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fighting Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5 0');
  player.runCommand('scoreboard players set @s fightingquest 11');
}
