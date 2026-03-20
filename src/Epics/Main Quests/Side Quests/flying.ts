import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { catchtype } from "./type_catch.js";

export function flying0(player: Player) {
    const flying0 = new ActionForm()
    flying0.setTitle('Begin Catch Quest!!!')
    flying0.setBody('Hello Trainer!! Are you ready to Start the Flying Type Catching Quest')
    flying0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    flying0.addButton('Back', 'textures/items/crate.png') // 0
    flying0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s flyingquest 1');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function flying1(player: Player) {
    const flying1 = new ActionForm()
    flying1.setTitle('Lvl 1 Flying Type Catch Quest Completed!!!')
    flying1.setBody('Congrats Please click the button Below to claim your reward for Catching 10 Flying Type Pokemon!!!')
    flying1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    flying1.addButton('Back', 'textures/items/crate.png') // 0
    flying1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s flyingquest 2');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function flying2(player: Player) {
    const flying2 = new ActionForm()
    flying2.setTitle('Lvl 2 Flying Type Catch Quest Completed!!!')
    flying2.setBody('Congrats Please click the button Below to claim your reward for Catching 50 Flying Type Pokemon!!!')
    flying2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    flying2.addButton('Back', 'textures/items/crate.png') // 0
    flying2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s flyingquest 3');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function flying3(player: Player) {
    const flying3 = new ActionForm()
    flying3.setTitle('Lvl 3 Flying Type Catch Quest Completed!!!')
    flying3.setBody('Congrats Please click the button Below to claim your reward for Catching 100 Flying Type Pokemon!!!')
    flying3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    flying3.addButton('Back', 'textures/items/crate.png') // 0
    flying3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s flyingquest 4');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function flying4(player: Player) {
    const flying4 = new ActionForm()
    flying4.setTitle('Lvl 4 Flying Type Catch Quest Completed!!!')
    flying4.setBody('Congrats Please click the button Below to claim your reward for Catching 150 Flying Type Pokemon!!!')
    flying4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    flying4.addButton('Back', 'textures/items/crate.png') // 0
    flying4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s flyingquest 5');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function flying5(player: Player) {
    const flying5 = new ActionForm()
    flying5.setTitle('Lvl 5 Flying Type Catch Quest Completed!!!')
    flying5.setBody('Congrats Please click the button Below to claim your reward for Catching 250 Flying Type Pokemon!!!')
    flying5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    flying5.addButton('Back', 'textures/items/crate.png') // 0
    flying5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s flyingquest 6');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function flying6(player: Player) {
    const flying6 = new ActionForm()
    flying6.setTitle('Lvl 6 Flying Type Catch Quest Completed!!!')
    flying6.setBody('Congrats Please click the button Below to claim your reward for Catching 500 Flying Type Pokemon!!!')
    flying6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    flying6.addButton('Back', 'textures/items/crate.png') // 0
    flying6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s flyingquest 7');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function flying7(player: Player) {
    const flying7 = new ActionForm()
    flying7.setTitle('Lvl 7 Flying Type Catch Quest Completed!!!')
    flying7.setBody('Congrats Please click the button Below to claim your reward for Catching 1k Flying Type Pokemon!!!')
    flying7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    flying7.addButton('Back', 'textures/items/crate.png') // 0
    flying7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s flyingquest 8');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function flying8(player: Player) {
    const flying8 = new ActionForm()
    flying8.setTitle('Lvl 8 Flying Type Catch Quest Completed!!!')
    flying8.setBody('Congrats Please click the button Below to claim your reward for Catching 2.5k Flying Type Pokemon!!!')
    flying8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    flying8.addButton('Back', 'textures/items/crate.png') // 0
    flying8.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 2 0');
            player.runCommand('scoreboard players set @s flyingquest 9');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function flying9(player: Player) {
    const flying9 = new ActionForm()
    flying9.setTitle('Lvl 9 Flying Type Catch Quest Completed!!!')
    flying9.setBody('Congrats Please click the button Below to claim your reward for Catching 5k Flying Type Pokemon!!!')
    flying9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    flying9.addButton('Back', 'textures/items/crate.png') // 0
    flying9.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 3 0');
            player.runCommand('scoreboard players set @s flyingquest 10');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function flying10(player: Player) {
    const flying10 = new ActionForm()
    flying10.setTitle('Lvl 10 Flying Type Catch Quest Completed!!!')
    flying10.setBody('Congrats Please click the button Below to claim your reward for Catching 10k Flying Type Pokemon!!!')
    flying10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    flying10.addButton('Back', 'textures/items/crate.png') // 0
    flying10.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 5 0');
            player.runCommand('scoreboard players set @s flyingquest 11');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function flying0_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Flying Quest Stage 0 completed!');
  player.runCommand('scoreboard players set @s flyingquest 1');
}

export function flying1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Flying Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s flyingquest 2');
}

export function flying2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Flying Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s flyingquest 3');
}

export function flying3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Flying Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s flyingquest 4');
}

export function flying4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Flying Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s flyingquest 5');
}

export function flying5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Flying Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
  player.runCommand('scoreboard players set @s flyingquest 6');
}

export function flying6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Flying Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
  player.runCommand('scoreboard players set @s flyingquest 7');
}

export function flying7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Flying Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0');
  player.runCommand('scoreboard players set @s flyingquest 8');
}

export function flying8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Flying Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2 0');
  player.runCommand('scoreboard players set @s flyingquest 9');
}

export function flying9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Flying Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3 0');
  player.runCommand('scoreboard players set @s flyingquest 10');
}

export function flying10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Flying Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5 0');
  player.runCommand('scoreboard players set @s flyingquest 11');
}
