import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { catchtype } from "./type_catch.js";

export function ground0(player: Player) {
    const ground0 = new ActionForm()
    ground0.setTitle('Begin Catch Quest!!!')
    ground0.setBody('Hello Trainer!! Are you ready to Start the Ground Type Catching Quest')
    ground0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    ground0.addButton('Back', 'textures/items/crate.png') // 0
    ground0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s groundquest 1');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ground1(player: Player) {
    const ground1 = new ActionForm()
    ground1.setTitle('Lvl 1 Ground Type Catch Quest Completed!!!')
    ground1.setBody('Congrats Please click the button Below to claim your reward for Catching 10 Ground Type Pokemon!!!')
    ground1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    ground1.addButton('Back', 'textures/items/crate.png') // 0
    ground1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s groundquest 2');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ground2(player: Player) {
    const ground2 = new ActionForm()
    ground2.setTitle('Lvl 2 Ground Type Catch Quest Completed!!!')
    ground2.setBody('Congrats Please click the button Below to claim your reward for Catching 50 Ground Type Pokemon!!!')
    ground2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    ground2.addButton('Back', 'textures/items/crate.png') // 0
    ground2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s groundquest 3');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ground3(player: Player) {
    const ground3 = new ActionForm()
    ground3.setTitle('Lvl 3 Ground Type Catch Quest Completed!!!')
    ground3.setBody('Congrats Please click the button Below to claim your reward for Catching 100 Ground Type Pokemon!!!')
    ground3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    ground3.addButton('Back', 'textures/items/crate.png') // 0
    ground3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s groundquest 4');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ground4(player: Player) {
    const ground4 = new ActionForm()
    ground4.setTitle('Lvl 4 Ground Type Catch Quest Completed!!!')
    ground4.setBody('Congrats Please click the button Below to claim your reward for Catching 150 Ground Type Pokemon!!!')
    ground4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    ground4.addButton('Back', 'textures/items/crate.png') // 0
    ground4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s groundquest 5');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ground5(player: Player) {
    const ground5 = new ActionForm()
    ground5.setTitle('Lvl 5 Ground Type Catch Quest Completed!!!')
    ground5.setBody('Congrats Please click the button Below to claim your reward for Catching 250 Ground Type Pokemon!!!')
    ground5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    ground5.addButton('Back', 'textures/items/crate.png') // 0
    ground5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s groundquest 6');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ground6(player: Player) {
    const ground6 = new ActionForm()
    ground6.setTitle('Lvl 6 Ground Type Catch Quest Completed!!!')
    ground6.setBody('Congrats Please click the button Below to claim your reward for Catching 500 Ground Type Pokemon!!!')
    ground6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    ground6.addButton('Back', 'textures/items/crate.png') // 0
    ground6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s groundquest 7');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ground7(player: Player) {
    const ground7 = new ActionForm()
    ground7.setTitle('Lvl 7 Ground Type Catch Quest Completed!!!')
    ground7.setBody('Congrats Please click the button Below to claim your reward for Catching 1k Ground Type Pokemon!!!')
    ground7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    ground7.addButton('Back', 'textures/items/crate.png') // 0
    ground7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s groundquest 8');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ground8(player: Player) {
    const ground8 = new ActionForm()
    ground8.setTitle('Lvl 8 Ground Type Catch Quest Completed!!!')
    ground8.setBody('Congrats Please click the button Below to claim your reward for Catching 2.5k Ground Type Pokemon!!!')
    ground8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    ground8.addButton('Back', 'textures/items/crate.png') // 0
    ground8.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 2 0');
            player.runCommand('scoreboard players set @s groundquest 9');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ground9(player: Player) {
    const ground9 = new ActionForm()
    ground9.setTitle('Lvl 9 Ground Type Catch Quest Completed!!!')
    ground9.setBody('Congrats Please click the button Below to claim your reward for Catching 5k Ground Type Pokemon!!!')
    ground9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    ground9.addButton('Back', 'textures/items/crate.png') // 0
    ground9.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 3 0');
            player.runCommand('scoreboard players set @s groundquest 10');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ground10(player: Player) {
    const ground10 = new ActionForm()
    ground10.setTitle('Lvl 10 Ground Type Catch Quest Completed!!!')
    ground10.setBody('Congrats Please click the button Below to claim your reward for Catching 10k Ground Type Pokemon!!!')
    ground10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    ground10.addButton('Back', 'textures/items/crate.png') // 0
    ground10.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 5 0');
            player.runCommand('scoreboard players set @s groundquest 11');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ground0_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ground Quest Stage 0 completed!');
  player.runCommand('scoreboard players set @s groundquest 1');
}

export function ground1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ground Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s groundquest 2');
}

export function ground2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ground Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s groundquest 3');
}

export function ground3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ground Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s groundquest 4');
}

export function ground4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ground Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s groundquest 5');
}

export function ground5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ground Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
  player.runCommand('scoreboard players set @s groundquest 6');
}

export function ground6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ground Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
  player.runCommand('scoreboard players set @s groundquest 7');
}

export function ground7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ground Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0');
  player.runCommand('scoreboard players set @s groundquest 8');
}

export function ground8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ground Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2 0');
  player.runCommand('scoreboard players set @s groundquest 9');
}

export function ground9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ground Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3 0');
  player.runCommand('scoreboard players set @s groundquest 10');
}

export function ground10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ground Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5 0');
  player.runCommand('scoreboard players set @s groundquest 11');
}
