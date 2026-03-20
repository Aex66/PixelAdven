import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { catchtype } from "./type_catch.js";

export function rock0(player: Player) {
    const rock0 = new ActionForm()
    rock0.setTitle('Begin Catch Quest!!!')
    rock0.setBody('Hello Trainer!! Are you ready to Start the Rock Type Catching Quest')
    rock0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    rock0.addButton('Back', 'textures/items/crate.png') // 0
    rock0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s rockquest 1');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function rock1(player: Player) {
    const rock1 = new ActionForm()
    rock1.setTitle('Lvl 1 Rock Type Catch Quest Completed!!!')
    rock1.setBody('Congrats Please click the button Below to claim your reward for Catching 10 Rock Type Pokemon!!!')
    rock1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    rock1.addButton('Back', 'textures/items/crate.png') // 0
    rock1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s rockquest 2');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function rock2(player: Player) {
    const rock2 = new ActionForm()
    rock2.setTitle('Lvl 2 Rock Type Catch Quest Completed!!!')
    rock2.setBody('Congrats Please click the button Below to claim your reward for Catching 50 Rock Type Pokemon!!!')
    rock2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    rock2.addButton('Back', 'textures/items/crate.png') // 0
    rock2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s rockquest 3');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function rock3(player: Player) {
    const rock3 = new ActionForm()
    rock3.setTitle('Lvl 3 Rock Type Catch Quest Completed!!!')
    rock3.setBody('Congrats Please click the button Below to claim your reward for Catching 100 Rock Type Pokemon!!!')
    rock3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    rock3.addButton('Back', 'textures/items/crate.png') // 0
    rock3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s rockquest 4');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function rock4(player: Player) {
    const rock4 = new ActionForm()
    rock4.setTitle('Lvl 4 Rock Type Catch Quest Completed!!!')
    rock4.setBody('Congrats Please click the button Below to claim your reward for Catching 150 Rock Type Pokemon!!!')
    rock4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    rock4.addButton('Back', 'textures/items/crate.png') // 0
    rock4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s rockquest 5');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function rock5(player: Player) {
    const rock5 = new ActionForm()
    rock5.setTitle('Lvl 5 Rock Type Catch Quest Completed!!!')
    rock5.setBody('Congrats Please click the button Below to claim your reward for Catching 250 Rock Type Pokemon!!!')
    rock5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    rock5.addButton('Back', 'textures/items/crate.png') // 0
    rock5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s rockquest 6');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function rock6(player: Player) {
    const rock6 = new ActionForm()
    rock6.setTitle('Lvl 6 Rock Type Catch Quest Completed!!!')
    rock6.setBody('Congrats Please click the button Below to claim your reward for Catching 500 Rock Type Pokemon!!!')
    rock6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    rock6.addButton('Back', 'textures/items/crate.png') // 0
    rock6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s rockquest 7');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function rock7(player: Player) {
    const rock7 = new ActionForm()
    rock7.setTitle('Lvl 7 Rock Type Catch Quest Completed!!!')
    rock7.setBody('Congrats Please click the button Below to claim your reward for Catching 1k Rock Type Pokemon!!!')
    rock7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    rock7.addButton('Back', 'textures/items/crate.png') // 0
    rock7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s rockquest 8');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function rock8(player: Player) {
    const rock8 = new ActionForm()
    rock8.setTitle('Lvl 8 Rock Type Catch Quest Completed!!!')
    rock8.setBody('Congrats Please click the button Below to claim your reward for Catching 2.5k Rock Type Pokemon!!!')
    rock8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    rock8.addButton('Back', 'textures/items/crate.png') // 0
    rock8.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 2 0');
            player.runCommand('scoreboard players set @s rockquest 9');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function rock9(player: Player) {
    const rock9 = new ActionForm()
    rock9.setTitle('Lvl 9 Rock Type Catch Quest Completed!!!')
    rock9.setBody('Congrats Please click the button Below to claim your reward for Catching 5k Rock Type Pokemon!!!')
    rock9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    rock9.addButton('Back', 'textures/items/crate.png') // 0
    rock9.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 3 0');
            player.runCommand('scoreboard players set @s rockquest 10');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function rock10(player: Player) {
    const rock10 = new ActionForm()
    rock10.setTitle('Lvl 10 Rock Type Catch Quest Completed!!!')
    rock10.setBody('Congrats Please click the button Below to claim your reward for Catching 10k Rock Type Pokemon!!!')
    rock10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    rock10.addButton('Back', 'textures/items/crate.png') // 0
    rock10.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 5 0');
            player.runCommand('scoreboard players set @s rockquest 11');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function rock0_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Rock Quest Stage 0 completed!');
  player.runCommand('scoreboard players set @s rockquest 1');
}

export function rock1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Rock Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s rockquest 2');
}

export function rock2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Rock Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s rockquest 3');
}

export function rock3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Rock Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s rockquest 4');
}

export function rock4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Rock Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s rockquest 5');
}

export function rock5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Rock Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
  player.runCommand('scoreboard players set @s rockquest 6');
}

export function rock6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Rock Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
  player.runCommand('scoreboard players set @s rockquest 7');
}

export function rock7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Rock Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0');
  player.runCommand('scoreboard players set @s rockquest 8');
}

export function rock8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Rock Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2 0');
  player.runCommand('scoreboard players set @s rockquest 9');
}

export function rock9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Rock Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3 0');
  player.runCommand('scoreboard players set @s rockquest 10');
}

export function rock10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Rock Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5 0');
  player.runCommand('scoreboard players set @s rockquest 11');
}
