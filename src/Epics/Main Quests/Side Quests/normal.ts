import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { catchtype } from "./type_catch.js";

export function normal0(player: Player) {
    const normal0 = new ActionForm()
    normal0.setTitle('Begin Catch Quest!!!')
    normal0.setBody('Hello Trainer!! Are you ready to Start the Normal Type Catching Quest')
    normal0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    normal0.addButton('Back', 'textures/items/crate.png') // 0
    normal0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s normalquest 1');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function normal1(player: Player) {
    const normal1 = new ActionForm()
    normal1.setTitle('Lvl 1 Normal Type Catch Quest Completed!!!')
    normal1.setBody('Congrats Please click the button Below to claim your reward for Catching 10 Normal Type Pokemon!!!')
    normal1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    normal1.addButton('Back', 'textures/items/crate.png') // 0
    normal1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s normalquest 2');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function normal2(player: Player) {
    const normal2 = new ActionForm()
    normal2.setTitle('Lvl 2 Normal Type Catch Quest Completed!!!')
    normal2.setBody('Congrats Please click the button Below to claim your reward for Catching 50 Normal Type Pokemon!!!')
    normal2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    normal2.addButton('Back', 'textures/items/crate.png') // 0
    normal2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s normalquest 3');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function normal3(player: Player) {
    const normal3 = new ActionForm()
    normal3.setTitle('Lvl 3 Normal Type Catch Quest Completed!!!')
    normal3.setBody('Congrats Please click the button Below to claim your reward for Catching 100 Normal Type Pokemon!!!')
    normal3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    normal3.addButton('Back', 'textures/items/crate.png') // 0
    normal3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s normalquest 4');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function normal4(player: Player) {
    const normal4 = new ActionForm()
    normal4.setTitle('Lvl 4 Normal Type Catch Quest Completed!!!')
    normal4.setBody('Congrats Please click the button Below to claim your reward for Catching 150 Normal Type Pokemon!!!')
    normal4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    normal4.addButton('Back', 'textures/items/crate.png') // 0
    normal4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s normalquest 5');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function normal5(player: Player) {
    const normal5 = new ActionForm()
    normal5.setTitle('Lvl 5 Normal Type Catch Quest Completed!!!')
    normal5.setBody('Congrats Please click the button Below to claim your reward for Catching 250 Normal Type Pokemon!!!')
    normal5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    normal5.addButton('Back', 'textures/items/crate.png') // 0
    normal5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s normalquest 6');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function normal6(player: Player) {
    const normal6 = new ActionForm()
    normal6.setTitle('Lvl 6 Normal Type Catch Quest Completed!!!')
    normal6.setBody('Congrats Please click the button Below to claim your reward for Catching 500 Normal Type Pokemon!!!')
    normal6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    normal6.addButton('Back', 'textures/items/crate.png') // 0
    normal6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s normalquest 7');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function normal7(player: Player) {
    const normal7 = new ActionForm()
    normal7.setTitle('Lvl 7 Normal Type Catch Quest Completed!!!')
    normal7.setBody('Congrats Please click the button Below to claim your reward for Catching 1k Normal Type Pokemon!!!')
    normal7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    normal7.addButton('Back', 'textures/items/crate.png') // 0
    normal7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s normalquest 8');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function normal8(player: Player) {
    const normal8 = new ActionForm()
    normal8.setTitle('Lvl 8 Normal Type Catch Quest Completed!!!')
    normal8.setBody('Congrats Please click the button Below to claim your reward for Catching 2.5k Normal Type Pokemon!!!')
    normal8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    normal8.addButton('Back', 'textures/items/crate.png') // 0
    normal8.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 2 0');
            player.runCommand('scoreboard players set @s normalquest 9');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function normal9(player: Player) {
    const normal9 = new ActionForm()
    normal9.setTitle('Lvl 9 Normal Type Catch Quest Completed!!!')
    normal9.setBody('Congrats Please click the button Below to claim your reward for Catching 5k Normal Type Pokemon!!!')
    normal9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    normal9.addButton('Back', 'textures/items/crate.png') // 0
    normal9.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 3 0');
            player.runCommand('scoreboard players set @s normalquest 10');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function normal10(player: Player) {
    const normal10 = new ActionForm()
    normal10.setTitle('Lvl 10 Normal Type Catch Quest Completed!!!')
    normal10.setBody('Congrats Please click the button Below to claim your reward for Catching 10k Normal Type Pokemon!!!')
    normal10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    normal10.addButton('Back', 'textures/items/crate.png') // 0
    normal10.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 5 0');
            player.runCommand('scoreboard players set @s normalquest 11');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function normal0_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Normal Quest Stage 0 completed!');
  player.runCommand('scoreboard players set @s normalquest 1');
}

export function normal1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Normal Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s normalquest 2');
}

export function normal2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Normal Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s normalquest 3');
}

export function normal3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Normal Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s normalquest 4');
}

export function normal4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Normal Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s normalquest 5');
}

export function normal5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Normal Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
  player.runCommand('scoreboard players set @s normalquest 6');
}

export function normal6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Normal Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
  player.runCommand('scoreboard players set @s normalquest 7');
}

export function normal7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Normal Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0');
  player.runCommand('scoreboard players set @s normalquest 8');
}

export function normal8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Normal Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2 0');
  player.runCommand('scoreboard players set @s normalquest 9');
}

export function normal9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Normal Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3 0');
  player.runCommand('scoreboard players set @s normalquest 10');
}

export function normal10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Normal Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5 0');
  player.runCommand('scoreboard players set @s normalquest 11');
}
