import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { catchtype } from "./type_catch.js";

export function fire0(player: Player) {
    const fire0 = new ActionForm()
    fire0.setTitle('Begin Catch Quest!!!')
    fire0.setBody('Hello Trainer!! Are you ready to Start the Fire Type Catching Quest')
    fire0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    fire0.addButton('Back', 'textures/items/crate.png') // 0
    fire0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s firequest 1');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fire1(player: Player) {
    const fire1 = new ActionForm()
    fire1.setTitle('Lvl 1 Fire Type Catch Quest Completed!!!')
    fire1.setBody('Congrats Please click the button Below to claim your reward for Catching 10 Fire Type Pokemon!!!')
    fire1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    fire1.addButton('Back', 'textures/items/crate.png') // 0
    fire1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s firequest 2');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fire2(player: Player) {
    const fire2 = new ActionForm()
    fire2.setTitle('Lvl 2 Fire Type Catch Quest Completed!!!')
    fire2.setBody('Congrats Please click the button Below to claim your reward for Catching 50 Fire Type Pokemon!!!')
    fire2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    fire2.addButton('Back', 'textures/items/crate.png') // 0
    fire2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s firequest 3');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fire3(player: Player) {
    const fire3 = new ActionForm()
    fire3.setTitle('Lvl 3 Fire Type Catch Quest Completed!!!')
    fire3.setBody('Congrats Please click the button Below to claim your reward for Catching 100 Fire Type Pokemon!!!')
    fire3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    fire3.addButton('Back', 'textures/items/crate.png') // 0
    fire3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s firequest 4');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fire4(player: Player) {
    const fire4 = new ActionForm()
    fire4.setTitle('Lvl 4 Fire Type Catch Quest Completed!!!')
    fire4.setBody('Congrats Please click the button Below to claim your reward for Catching 150 Fire Type Pokemon!!!')
    fire4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    fire4.addButton('Back', 'textures/items/crate.png') // 0
    fire4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s firequest 5');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fire5(player: Player) {
    const fire5 = new ActionForm()
    fire5.setTitle('Lvl 5 Fire Type Catch Quest Completed!!!')
    fire5.setBody('Congrats Please click the button Below to claim your reward for Catching 250 Fire Type Pokemon!!!')
    fire5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    fire5.addButton('Back', 'textures/items/crate.png') // 0
    fire5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s firequest 6');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fire6(player: Player) {
    const fire6 = new ActionForm()
    fire6.setTitle('Lvl 6 Fire Type Catch Quest Completed!!!')
    fire6.setBody('Congrats Please click the button Below to claim your reward for Catching 500 Fire Type Pokemon!!!')
    fire6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    fire6.addButton('Back', 'textures/items/crate.png') // 0
    fire6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s firequest 7');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fire7(player: Player) {
    const fire7 = new ActionForm()
    fire7.setTitle('Lvl 7 Fire Type Catch Quest Completed!!!')
    fire7.setBody('Congrats Please click the button Below to claim your reward for Catching 1k Fire Type Pokemon!!!')
    fire7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    fire7.addButton('Back', 'textures/items/crate.png') // 0
    fire7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s firequest 8');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fire8(player: Player) {
    const fire8 = new ActionForm()
    fire8.setTitle('Lvl 8 Fire Type Catch Quest Completed!!!')
    fire8.setBody('Congrats Please click the button Below to claim your reward for Catching 2.5k Fire Type Pokemon!!!')
    fire8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    fire8.addButton('Back', 'textures/items/crate.png') // 0
    fire8.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 2 0');
            player.runCommand('scoreboard players set @s firequest 9');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fire9(player: Player) {
    const fire9 = new ActionForm()
    fire9.setTitle('Lvl 9 Fire Type Catch Quest Completed!!!')
    fire9.setBody('Congrats Please click the button Below to claim your reward for Catching 5k Fire Type Pokemon!!!')
    fire9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    fire9.addButton('Back', 'textures/items/crate.png') // 0
    fire9.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 3 0');
            player.runCommand('scoreboard players set @s firequest 10');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fire10(player: Player) {
    const fire10 = new ActionForm()
    fire10.setTitle('Lvl 10 Fire Type Catch Quest Completed!!!')
    fire10.setBody('Congrats Please click the button Below to claim your reward for Catching 10k Fire Type Pokemon!!!')
    fire10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    fire10.addButton('Back', 'textures/items/crate.png') // 0
    fire10.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 5 0');
            player.runCommand('scoreboard players set @s firequest 11');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function fire0_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fire Quest Stage 0 completed!');
  player.runCommand('scoreboard players set @s firequest 1');
}

export function fire1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fire Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s firequest 2');
}

export function fire2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fire Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s firequest 3');
}

export function fire3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fire Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s firequest 4');
}

export function fire4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fire Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s firequest 5');
}

export function fire5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fire Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
  player.runCommand('scoreboard players set @s firequest 6');
}

export function fire6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fire Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
  player.runCommand('scoreboard players set @s firequest 7');
}

export function fire7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fire Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0');
  player.runCommand('scoreboard players set @s firequest 8');
}

export function fire8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fire Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2 0');
  player.runCommand('scoreboard players set @s firequest 9');
}

export function fire9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fire Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3 0');
  player.runCommand('scoreboard players set @s firequest 10');
}

export function fire10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Fire Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5 0');
  player.runCommand('scoreboard players set @s firequest 11');
}
