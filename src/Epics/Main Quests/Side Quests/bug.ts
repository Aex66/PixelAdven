import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { catchtype } from "./type_catch.js";

export function bug0(player: Player) {
    const bug0 = new ActionForm()
    bug0.setTitle('Begin Catch Quest!!!')
    bug0.setBody('Hello Trainer!! Are you ready to Start the Bug Type Catching Quest')
    bug0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    bug0.addButton('Back', 'textures/items/crate.png') // 0
    bug0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s bugquest 1');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function bug1(player: Player) {
    const bug1 = new ActionForm()
    bug1.setTitle('Lvl 1 Bug Type Catch Quest Completed!!!')
    bug1.setBody('Congrats Please click the button Below to claim your reward for Catching 10 Bug Type Pokemon!!!')
    bug1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    bug1.addButton('Back', 'textures/items/crate.png') // 0
    bug1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s bugquest 2');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function bug2(player: Player) {
    const bug2 = new ActionForm()
    bug2.setTitle('Lvl 2 Bug Type Catch Quest Completed!!!')
    bug2.setBody('Congrats Please click the button Below to claim your reward for Catching 50 Bug Type Pokemon!!!')
    bug2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    bug2.addButton('Back', 'textures/items/crate.png') // 0
    bug2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s bugquest 3');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function bug3(player: Player) {
    const bug3 = new ActionForm()
    bug3.setTitle('Lvl 3 Bug Type Catch Quest Completed!!!')
    bug3.setBody('Congrats Please click the button Below to claim your reward for Catching 100 Bug Type Pokemon!!!')
    bug3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    bug3.addButton('Back', 'textures/items/crate.png') // 0
    bug3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s bugquest 4');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function bug4(player: Player) {
    const bug4 = new ActionForm()
    bug4.setTitle('Lvl 4 Bug Type Catch Quest Completed!!!')
    bug4.setBody('Congrats Please click the button Below to claim your reward for Catching 150 Bug Type Pokemon!!!')
    bug4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    bug4.addButton('Back', 'textures/items/crate.png') // 0
    bug4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s bugquest 5');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function bug5(player: Player) {
    const bug5 = new ActionForm()
    bug5.setTitle('Lvl 5 Bug Type Catch Quest Completed!!!')
    bug5.setBody('Congrats Please click the button Below to claim your reward for Catching 250 Bug Type Pokemon!!!')
    bug5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    bug5.addButton('Back', 'textures/items/crate.png') // 0
    bug5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s bugquest 6');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function bug6(player: Player) {
    const bug6 = new ActionForm()
    bug6.setTitle('Lvl 6 Bug Type Catch Quest Completed!!!')
    bug6.setBody('Congrats Please click the button Below to claim your reward for Catching 500 Bug Type Pokemon!!!')
    bug6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    bug6.addButton('Back', 'textures/items/crate.png') // 0
    bug6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s bugquest 7');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function bug7(player: Player) {
    const bug7 = new ActionForm()
    bug7.setTitle('Lvl 7 Bug Type Catch Quest Completed!!!')
    bug7.setBody('Congrats Please click the button Below to claim your reward for Catching 1k Bug Type Pokemon!!!')
    bug7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    bug7.addButton('Back', 'textures/items/crate.png') // 0
    bug7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s bugquest 8');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function bug8(player: Player) {
    const bug8 = new ActionForm()
    bug8.setTitle('Lvl 8 Bug Type Catch Quest Completed!!!')
    bug8.setBody('Congrats Please click the button Below to claim your reward for Catching 2.5k Bug Type Pokemon!!!')
    bug8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    bug8.addButton('Back', 'textures/items/crate.png') // 0
    bug8.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 2 0');
            player.runCommand('scoreboard players set @s bugquest 9');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function bug9(player: Player) {
    const bug9 = new ActionForm()
    bug9.setTitle('Lvl 9 Bug Type Catch Quest Completed!!!')
    bug9.setBody('Congrats Please click the button Below to claim your reward for Catching 5k Bug Type Pokemon!!!')
    bug9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    bug9.addButton('Back', 'textures/items/crate.png') // 0
    bug9.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 3 0');
            player.runCommand('scoreboard players set @s bugquest 10');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function bug10(player: Player) {
    const bug10 = new ActionForm()
    bug10.setTitle('Lvl 10 Bug Type Catch Quest Completed!!!')
    bug10.setBody('Congrats Please click the button Below to claim your reward for Catching 10k Bug Type Pokemon!!!')
    bug10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    bug10.addButton('Back', 'textures/items/crate.png') // 0
    bug10.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 5 0');
            player.runCommand('scoreboard players set @s bugquest 11');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function bug0_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Bug Quest Stage 0 completed!');
  player.runCommand('scoreboard players set @s bugquest 1');
}

export function bug1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Bug Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s bugquest 2');
}

export function bug2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Bug Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s bugquest 3');
}

export function bug3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Bug Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s bugquest 4');
}

export function bug4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Bug Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s bugquest 5');
}

export function bug5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Bug Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
  player.runCommand('scoreboard players set @s bugquest 6');
}

export function bug6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Bug Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
  player.runCommand('scoreboard players set @s bugquest 7');
}

export function bug7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Bug Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0');
  player.runCommand('scoreboard players set @s bugquest 8');
}

export function bug8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Bug Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2 0');
  player.runCommand('scoreboard players set @s bugquest 9');
}

export function bug9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Bug Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3 0');
  player.runCommand('scoreboard players set @s bugquest 10');
}

export function bug10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Bug Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5 0');
  player.runCommand('scoreboard players set @s bugquest 11');
}
