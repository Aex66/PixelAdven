import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { catchtype } from "./type_catch.js";

export function dark0(player: Player) {
    const dark0 = new ActionForm()
    dark0.setTitle('Begin Catch Quest!!!')
    dark0.setBody('Hello Trainer!! Are you ready to Start the Dark Type Catching Quest')
    dark0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    dark0.addButton('Back', 'textures/items/crate.png') // 0
    dark0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s darkquest 1');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function dark1(player: Player) {
    const dark1 = new ActionForm()
    dark1.setTitle('Lvl 1 Dark Type Catch Quest Completed!!!')
    dark1.setBody('Congrats Please click the button Below to claim your reward for Catching 10 Dark Type Pokemon!!!')
    dark1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    dark1.addButton('Back', 'textures/items/crate.png') // 0
    dark1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s darkquest 2');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function dark2(player: Player) {
    const dark2 = new ActionForm()
    dark2.setTitle('Lvl 2 Dark Type Catch Quest Completed!!!')
    dark2.setBody('Congrats Please click the button Below to claim your reward for Catching 50 Dark Type Pokemon!!!')
    dark2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    dark2.addButton('Back', 'textures/items/crate.png') // 0
    dark2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s darkquest 3');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function dark3(player: Player) {
    const dark3 = new ActionForm()
    dark3.setTitle('Lvl 3 Dark Type Catch Quest Completed!!!')
    dark3.setBody('Congrats Please click the button Below to claim your reward for Catching 100 Dark Type Pokemon!!!')
    dark3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    dark3.addButton('Back', 'textures/items/crate.png') // 0
    dark3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s darkquest 4');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function dark4(player: Player) {
    const dark4 = new ActionForm()
    dark4.setTitle('Lvl 4 Dark Type Catch Quest Completed!!!')
    dark4.setBody('Congrats Please click the button Below to claim your reward for Catching 150 Dark Type Pokemon!!!')
    dark4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    dark4.addButton('Back', 'textures/items/crate.png') // 0
    dark4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s darkquest 5');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function dark5(player: Player) {
    const dark5 = new ActionForm()
    dark5.setTitle('Lvl 5 Dark Type Catch Quest Completed!!!')
    dark5.setBody('Congrats Please click the button Below to claim your reward for Catching 250 Dark Type Pokemon!!!')
    dark5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    dark5.addButton('Back', 'textures/items/crate.png') // 0
    dark5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s darkquest 6');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function dark6(player: Player) {
    const dark6 = new ActionForm()
    dark6.setTitle('Lvl 6 Dark Type Catch Quest Completed!!!')
    dark6.setBody('Congrats Please click the button Below to claim your reward for Catching 500 Dark Type Pokemon!!!')
    dark6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    dark6.addButton('Back', 'textures/items/crate.png') // 0
    dark6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s darkquest 7');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function dark7(player: Player) {
    const dark7 = new ActionForm()
    dark7.setTitle('Lvl 7 Dark Type Catch Quest Completed!!!')
    dark7.setBody('Congrats Please click the button Below to claim your reward for Catching 1k Dark Type Pokemon!!!')
    dark7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    dark7.addButton('Back', 'textures/items/crate.png') // 0
    dark7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s darkquest 8');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function dark8(player: Player) {
    const dark8 = new ActionForm()
    dark8.setTitle('Lvl 8 Dark Type Catch Quest Completed!!!')
    dark8.setBody('Congrats Please click the button Below to claim your reward for Catching 2.5k Dark Type Pokemon!!!')
    dark8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    dark8.addButton('Back', 'textures/items/crate.png') // 0
    dark8.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 2 0');
            player.runCommand('scoreboard players set @s darkquest 9');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function dark9(player: Player) {
    const dark9 = new ActionForm()
    dark9.setTitle('Lvl 9 Dark Type Catch Quest Completed!!!')
    dark9.setBody('Congrats Please click the button Below to claim your reward for Catching 5k Dark Type Pokemon!!!')
    dark9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    dark9.addButton('Back', 'textures/items/crate.png') // 0
    dark9.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 3 0');
            player.runCommand('scoreboard players set @s darkquest 10');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function dark10(player: Player) {
    const dark10 = new ActionForm()
    dark10.setTitle('Lvl 10 Dark Type Catch Quest Completed!!!')
    dark10.setBody('Congrats Please click the button Below to claim your reward for Catching 10k Dark Type Pokemon!!!')
    dark10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    dark10.addButton('Back', 'textures/items/crate.png') // 0
    dark10.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 5 0');
            player.runCommand('scoreboard players set @s darkquest 11');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}


export function dark1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Dark Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s darkquest 2');
}

export function dark2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Dark Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s darkquest 3');
}

export function dark3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Dark Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s darkquest 4');
}

export function dark4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Dark Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s darkquest 5');
}

export function dark5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Dark Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
  player.runCommand('scoreboard players set @s darkquest 6');
}

export function dark6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Dark Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
  player.runCommand('scoreboard players set @s darkquest 7');
}

export function dark7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Dark Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0');
  player.runCommand('scoreboard players set @s darkquest 8');
}

export function dark8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Dark Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2 0');
  player.runCommand('scoreboard players set @s darkquest 9');
}

export function dark9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Dark Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3 0');
  player.runCommand('scoreboard players set @s darkquest 10');
}

export function dark10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Dark Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5 0');
  player.runCommand('scoreboard players set @s darkquest 11');
}
