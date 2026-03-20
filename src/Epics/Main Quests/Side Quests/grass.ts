import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { catchtype } from "./type_catch.js";

export function grass0(player: Player) {
    const grass0 = new ActionForm()
    grass0.setTitle('Begin Catch Quest!!!')
    grass0.setBody('Hello Trainer!! Are you ready to Start the Grass Type Catching Quest')
    grass0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    grass0.addButton('Back', 'textures/items/crate.png') // 0
    grass0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s grassquest 1');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function grass1(player: Player) {
    const grass1 = new ActionForm()
    grass1.setTitle('Lvl 1 Grass Type Catch Quest Completed!!!')
    grass1.setBody('Congrats Please click the button Below to claim your reward for Catching 10 Grass Type Pokemon!!!')
    grass1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    grass1.addButton('Back', 'textures/items/crate.png') // 0
    grass1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s grassquest 2');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function grass2(player: Player) {
    const grass2 = new ActionForm()
    grass2.setTitle('Lvl 2 Grass Type Catch Quest Completed!!!')
    grass2.setBody('Congrats Please click the button Below to claim your reward for Catching 50 Grass Type Pokemon!!!')
    grass2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    grass2.addButton('Back', 'textures/items/crate.png') // 0
    grass2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s grassquest 3');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function grass3(player: Player) {
    const grass3 = new ActionForm()
    grass3.setTitle('Lvl 3 Grass Type Catch Quest Completed!!!')
    grass3.setBody('Congrats Please click the button Below to claim your reward for Catching 100 Grass Type Pokemon!!!')
    grass3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    grass3.addButton('Back', 'textures/items/crate.png') // 0
    grass3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s grassquest 4');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function grass4(player: Player) {
    const grass4 = new ActionForm()
    grass4.setTitle('Lvl 4 Grass Type Catch Quest Completed!!!')
    grass4.setBody('Congrats Please click the button Below to claim your reward for Catching 150 Grass Type Pokemon!!!')
    grass4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    grass4.addButton('Back', 'textures/items/crate.png') // 0
    grass4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s grassquest 5');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function grass5(player: Player) {
    const grass5 = new ActionForm()
    grass5.setTitle('Lvl 5 Grass Type Catch Quest Completed!!!')
    grass5.setBody('Congrats Please click the button Below to claim your reward for Catching 250 Grass Type Pokemon!!!')
    grass5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    grass5.addButton('Back', 'textures/items/crate.png') // 0
    grass5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s grassquest 6');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function grass6(player: Player) {
    const grass6 = new ActionForm()
    grass6.setTitle('Lvl 6 Grass Type Catch Quest Completed!!!')
    grass6.setBody('Congrats Please click the button Below to claim your reward for Catching 500 Grass Type Pokemon!!!')
    grass6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    grass6.addButton('Back', 'textures/items/crate.png') // 0
    grass6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s grassquest 7');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function grass7(player: Player) {
    const grass7 = new ActionForm()
    grass7.setTitle('Lvl 7 Grass Type Catch Quest Completed!!!')
    grass7.setBody('Congrats Please click the button Below to claim your reward for Catching 1k Grass Type Pokemon!!!')
    grass7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    grass7.addButton('Back', 'textures/items/crate.png') // 0
    grass7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s grassquest 8');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function grass8(player: Player) {
    const grass8 = new ActionForm()
    grass8.setTitle('Lvl 8 Grass Type Catch Quest Completed!!!')
    grass8.setBody('Congrats Please click the button Below to claim your reward for Catching 2.5k Grass Type Pokemon!!!')
    grass8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    grass8.addButton('Back', 'textures/items/crate.png') // 0
    grass8.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 2 0');
            player.runCommand('scoreboard players set @s grassquest 9');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function grass9(player: Player) {
    const grass9 = new ActionForm()
    grass9.setTitle('Lvl 9 Grass Type Catch Quest Completed!!!')
    grass9.setBody('Congrats Please click the button Below to claim your reward for Catching 5k Grass Type Pokemon!!!')
    grass9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    grass9.addButton('Back', 'textures/items/crate.png') // 0
    grass9.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 3 0');
            player.runCommand('scoreboard players set @s grassquest 10');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function grass10(player: Player) {
    const grass10 = new ActionForm()
    grass10.setTitle('Lvl 10 Grass Type Catch Quest Completed!!!')
    grass10.setBody('Congrats Please click the button Below to claim your reward for Catching 10k Grass Type Pokemon!!!')
    grass10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    grass10.addButton('Back', 'textures/items/crate.png') // 0
    grass10.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 5 0');
            player.runCommand('scoreboard players set @s grassquest 11');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function grass0_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Grass Quest Stage 0 completed!');
  player.runCommand('scoreboard players set @s grassquest 1');
}

export function grass1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Grass Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s grassquest 2');
}

export function grass2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Grass Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s grassquest 3');
}

export function grass3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Grass Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s grassquest 4');
}

export function grass4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Grass Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s grassquest 5');
}

export function grass5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Grass Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
  player.runCommand('scoreboard players set @s grassquest 6');
}

export function grass6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Grass Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
  player.runCommand('scoreboard players set @s grassquest 7');
}

export function grass7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Grass Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0');
  player.runCommand('scoreboard players set @s grassquest 8');
}

export function grass8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Grass Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2 0');
  player.runCommand('scoreboard players set @s grassquest 9');
}

export function grass9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Grass Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3 0');
  player.runCommand('scoreboard players set @s grassquest 10');
}

export function grass10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Grass Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5 0');
  player.runCommand('scoreboard players set @s grassquest 11');
}
