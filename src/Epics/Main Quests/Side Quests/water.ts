import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { catchtype } from "./type_catch.js";

export function water0(player: Player) {
    const water0 = new ActionForm()
    water0.setTitle('Begin Catch Quest!!!')
    water0.setBody('Hello Trainer!! Are you ready to Start the Normal Type Catching Quest')
    water0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    water0.addButton('Back', 'textures/items/crate.png') // 0
    water0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s waterquest 1');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function water1(player: Player) {
    const water1 = new ActionForm()
    water1.setTitle('Lvl 1 Normal Type Catch Quest Completed!!!')
    water1.setBody('Congrats Please click the button Below to claim your reward for Catching 10 Normal Type Pokemon!!!')
    water1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    water1.addButton('Back', 'textures/items/crate.png') // 0
    water1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s waterquest 2');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function water2(player: Player) {
    const water2 = new ActionForm()
    water2.setTitle('Lvl 2 Normal Type Catch Quest Completed!!!')
    water2.setBody('Congrats Please click the button Below to claim your reward for Catching 50 Normal Type Pokemon!!!')
    water2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    water2.addButton('Back', 'textures/items/crate.png') // 0
    water2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s waterquest 3');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function water3(player: Player) {
    const water3 = new ActionForm()
    water3.setTitle('Lvl 3 Normal Type Catch Quest Completed!!!')
    water3.setBody('Congrats Please click the button Below to claim your reward for Catching 100 Normal Type Pokemon!!!')
    water3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    water3.addButton('Back', 'textures/items/crate.png') // 0
    water3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s waterquest 4');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function water4(player: Player) {
    const water4 = new ActionForm()
    water4.setTitle('Lvl 4 Normal Type Catch Quest Completed!!!')
    water4.setBody('Congrats Please click the button Below to claim your reward for Catching 150 Normal Type Pokemon!!!')
    water4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    water4.addButton('Back', 'textures/items/crate.png') // 0
    water4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s waterquest 5');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function water5(player: Player) {
    const water5 = new ActionForm()
    water5.setTitle('Lvl 5 Normal Type Catch Quest Completed!!!')
    water5.setBody('Congrats Please click the button Below to claim your reward for Catching 250 Normal Type Pokemon!!!')
    water5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    water5.addButton('Back', 'textures/items/crate.png') // 0
    water5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s waterquest 6');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function water6(player: Player) {
    const water6 = new ActionForm()
    water6.setTitle('Lvl 6 Normal Type Catch Quest Completed!!!')
    water6.setBody('Congrats Please click the button Below to claim your reward for Catching 500 Normal Type Pokemon!!!')
    water6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    water6.addButton('Back', 'textures/items/crate.png') // 0
    water6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s waterquest 7');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function water7(player: Player) {
    const water7 = new ActionForm()
    water7.setTitle('Lvl 7 Normal Type Catch Quest Completed!!!')
    water7.setBody('Congrats Please click the button Below to claim your reward for Catching 1k Normal Type Pokemon!!!')
    water7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    water7.addButton('Back', 'textures/items/crate.png') // 0
    water7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s waterquest 8');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function water8(player: Player) {
    const water8 = new ActionForm()
    water8.setTitle('Lvl 8 Normal Type Catch Quest Completed!!!')
    water8.setBody('Congrats Please click the button Below to claim your reward for Catching 2.5k Normal Type Pokemon!!!')
    water8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    water8.addButton('Back', 'textures/items/crate.png') // 0
    water8.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 2 0');
            player.runCommand('scoreboard players set @s waterquest 9');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function water9(player: Player) {
    const water9 = new ActionForm()
    water9.setTitle('Lvl 9 Normal Type Catch Quest Completed!!!')
    water9.setBody('Congrats Please click the button Below to claim your reward for Catching 5k Normal Type Pokemon!!!')
    water9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    water9.addButton('Back', 'textures/items/crate.png') // 0
    water9.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 3 0');
            player.runCommand('scoreboard players set @s waterquest 10');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function water10(player: Player) {
    const water10 = new ActionForm()
    water10.setTitle('Lvl 10 Normal Type Catch Quest Completed!!!')
    water10.setBody('Congrats Please click the button Below to claim your reward for Catching 10k Normal Type Pokemon!!!')
    water10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    water10.addButton('Back', 'textures/items/crate.png') // 0
    water10.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 5 0');
            player.runCommand('scoreboard players set @s waterquest 11');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function water0_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Water Quest Stage 0 completed!');
  player.runCommand('scoreboard players set @s waterquest 1');
}

export function water1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Water Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s waterquest 2');
}

export function water2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Water Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s waterquest 3');
}

export function water3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Water Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s waterquest 4');
}

export function water4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Water Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s waterquest 5');
}

export function water5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Water Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
  player.runCommand('scoreboard players set @s waterquest 6');
}

export function water6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Water Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
  player.runCommand('scoreboard players set @s waterquest 7');
}

export function water7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Water Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0');
  player.runCommand('scoreboard players set @s waterquest 8');
}

export function water8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Water Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2 0');
  player.runCommand('scoreboard players set @s waterquest 9');
}

export function water9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Water Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3 0');
  player.runCommand('scoreboard players set @s waterquest 10');
}

export function water10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Water Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5 0');
  player.runCommand('scoreboard players set @s waterquest 11');
}
