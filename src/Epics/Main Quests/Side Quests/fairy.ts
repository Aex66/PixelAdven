import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { catchtype } from "./type_catch.js";

export function fairy0(player: Player) {
    const fairy0 = new ActionForm()
    fairy0.setTitle('Begin Catch Quest!!!')
    fairy0.setBody('Hello Trainer!! Are you ready to Start the Fairy Type Catching Quest')
    fairy0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    fairy0.addButton('Back', 'textures/items/crate.png') // 0
    fairy0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s fairyquest 1');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fairy1(player: Player) {
    const fairy1 = new ActionForm()
    fairy1.setTitle('Lvl 1 Fairy Type Catch Quest Completed!!!')
    fairy1.setBody('Congrats Please click the button Below to claim your reward for Catching 10 Fairy Type Pokemon!!!')
    fairy1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    fairy1.addButton('Back', 'textures/items/crate.png') // 0
    fairy1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s fairyquest 2');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fairy2(player: Player) {
    const fairy2 = new ActionForm()
    fairy2.setTitle('Lvl 2 Fairy Type Catch Quest Completed!!!')
    fairy2.setBody('Congrats Please click the button Below to claim your reward for Catching 50 Fairy Type Pokemon!!!')
    fairy2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    fairy2.addButton('Back', 'textures/items/crate.png') // 0
    fairy2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s fairyquest 3');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fairy3(player: Player) {
    const fairy3 = new ActionForm()
    fairy3.setTitle('Lvl 3 Fairy Type Catch Quest Completed!!!')
    fairy3.setBody('Congrats Please click the button Below to claim your reward for Catching 100 Fairy Type Pokemon!!!')
    fairy3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    fairy3.addButton('Back', 'textures/items/crate.png') // 0
    fairy3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s fairyquest 4');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fairy4(player: Player) {
    const fairy4 = new ActionForm()
    fairy4.setTitle('Lvl 4 Fairy Type Catch Quest Completed!!!')
    fairy4.setBody('Congrats Please click the button Below to claim your reward for Catching 150 Fairy Type Pokemon!!!')
    fairy4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    fairy4.addButton('Back', 'textures/items/crate.png') // 0
    fairy4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s fairyquest 5');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fairy5(player: Player) {
    const fairy5 = new ActionForm()
    fairy5.setTitle('Lvl 5 Fairy Type Catch Quest Completed!!!')
    fairy5.setBody('Congrats Please click the button Below to claim your reward for Catching 250 Fairy Type Pokemon!!!')
    fairy5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    fairy5.addButton('Back', 'textures/items/crate.png') // 0
    fairy5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s fairyquest 6');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fairy6(player: Player) {
    const fairy6 = new ActionForm()
    fairy6.setTitle('Lvl 6 Fairy Type Catch Quest Completed!!!')
    fairy6.setBody('Congrats Please click the button Below to claim your reward for Catching 500 Fairy Type Pokemon!!!')
    fairy6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    fairy6.addButton('Back', 'textures/items/crate.png') // 0
    fairy6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s fairyquest 7');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fairy7(player: Player) {
    const fairy7 = new ActionForm()
    fairy7.setTitle('Lvl 7 Fairy Type Catch Quest Completed!!!')
    fairy7.setBody('Congrats Please click the button Below to claim your reward for Catching 1k Fairy Type Pokemon!!!')
    fairy7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    fairy7.addButton('Back', 'textures/items/crate.png') // 0
    fairy7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s fairyquest 8');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fairy8(player: Player) {
    const fairy8 = new ActionForm()
    fairy8.setTitle('Lvl 8 Fairy Type Catch Quest Completed!!!')
    fairy8.setBody('Congrats Please click the button Below to claim your reward for Catching 2.5k Fairy Type Pokemon!!!')
    fairy8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    fairy8.addButton('Back', 'textures/items/crate.png') // 0
    fairy8.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 2 0');
            player.runCommand('scoreboard players set @s fairyquest 9');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fairy9(player: Player) {
    const fairy9 = new ActionForm()
    fairy9.setTitle('Lvl 9 Fairy Type Catch Quest Completed!!!')
    fairy9.setBody('Congrats Please click the button Below to claim your reward for Catching 5k Fairy Type Pokemon!!!')
    fairy9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    fairy9.addButton('Back', 'textures/items/crate.png') // 0
    fairy9.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 3 0');
            player.runCommand('scoreboard players set @s fairyquest 10');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fairy10(player: Player) {
    const fairy10 = new ActionForm()
    fairy10.setTitle('Lvl 10 Fairy Type Catch Quest Completed!!!')
    fairy10.setBody('Congrats Please click the button Below to claim your reward for Catching 10k Fairy Type Pokemon!!!')
    fairy10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    fairy10.addButton('Back', 'textures/items/crate.png') // 0
    fairy10.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 5 0');
            player.runCommand('scoreboard players set @s fairyquest 11');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fairy0_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fairy Quest Stage 0 completed!');
  player.runCommand('scoreboard players set @s fairyquest 1');
}

export function fairy1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fairy Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s fairyquest 2');
}

export function fairy2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fairy Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s fairyquest 3');
}

export function fairy3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fairy Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s fairyquest 4');
}

export function fairy4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fairy Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s fairyquest 5');
}

export function fairy5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fairy Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
  player.runCommand('scoreboard players set @s fairyquest 6');
}

export function fairy6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fairy Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
  player.runCommand('scoreboard players set @s fairyquest 7');
}

export function fairy7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fairy Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0');
  player.runCommand('scoreboard players set @s fairyquest 8');
}

export function fairy8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fairy Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2 0');
  player.runCommand('scoreboard players set @s fairyquest 9');
}

export function fairy9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fairy Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3 0');
  player.runCommand('scoreboard players set @s fairyquest 10');
}

export function fairy10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fairy Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5 0');
  player.runCommand('scoreboard players set @s fairyquest 11');
}
