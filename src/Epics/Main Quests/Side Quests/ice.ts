import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { catchtype } from "./type_catch.js";

export function ice0(player: Player) {
    const ice0 = new ActionForm()
    ice0.setTitle('Begin Catch Quest!!!')
    ice0.setBody('Hello Trainer!! Are you ready to Start the Ice Type Catching Quest')
    ice0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    ice0.addButton('Back', 'textures/items/crate.png') // 0
    ice0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s icequest 1');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ice1(player: Player) {
    const ice1 = new ActionForm()
    ice1.setTitle('Lvl 1 Ice Type Catch Quest Completed!!!')
    ice1.setBody('Congrats Please click the button Below to claim your reward for Catching 10 Ice Type Pokemon!!!')
    ice1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    ice1.addButton('Back', 'textures/items/crate.png') // 0
    ice1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s icequest 2');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ice2(player: Player) {
    const ice2 = new ActionForm()
    ice2.setTitle('Lvl 2 Ice Type Catch Quest Completed!!!')
    ice2.setBody('Congrats Please click the button Below to claim your reward for Catching 50 Ice Type Pokemon!!!')
    ice2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    ice2.addButton('Back', 'textures/items/crate.png') // 0
    ice2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s icequest 3');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ice3(player: Player) {
    const ice3 = new ActionForm()
    ice3.setTitle('Lvl 3 Ice Type Catch Quest Completed!!!')
    ice3.setBody('Congrats Please click the button Below to claim your reward for Catching 100 Ice Type Pokemon!!!')
    ice3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    ice3.addButton('Back', 'textures/items/crate.png') // 0
    ice3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s icequest 4');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ice4(player: Player) {
    const ice4 = new ActionForm()
    ice4.setTitle('Lvl 4 Ice Type Catch Quest Completed!!!')
    ice4.setBody('Congrats Please click the button Below to claim your reward for Catching 150 Ice Type Pokemon!!!')
    ice4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    ice4.addButton('Back', 'textures/items/crate.png') // 0
    ice4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s icequest 5');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ice5(player: Player) {
    const ice5 = new ActionForm()
    ice5.setTitle('Lvl 5 Ice Type Catch Quest Completed!!!')
    ice5.setBody('Congrats Please click the button Below to claim your reward for Catching 250 Ice Type Pokemon!!!')
    ice5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    ice5.addButton('Back', 'textures/items/crate.png') // 0
    ice5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s icequest 6');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ice6(player: Player) {
    const ice6 = new ActionForm()
    ice6.setTitle('Lvl 6 Ice Type Catch Quest Completed!!!')
    ice6.setBody('Congrats Please click the button Below to claim your reward for Catching 500 Ice Type Pokemon!!!')
    ice6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    ice6.addButton('Back', 'textures/items/crate.png') // 0
    ice6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s icequest 7');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ice7(player: Player) {
    const ice7 = new ActionForm()
    ice7.setTitle('Lvl 7 Ice Type Catch Quest Completed!!!')
    ice7.setBody('Congrats Please click the button Below to claim your reward for Catching 1k Ice Type Pokemon!!!')
    ice7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    ice7.addButton('Back', 'textures/items/crate.png') // 0
    ice7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s icequest 8');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ice8(player: Player) {
    const ice8 = new ActionForm()
    ice8.setTitle('Lvl 8 Ice Type Catch Quest Completed!!!')
    ice8.setBody('Congrats Please click the button Below to claim your reward for Catching 2.5k Ice Type Pokemon!!!')
    ice8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    ice8.addButton('Back', 'textures/items/crate.png') // 0
    ice8.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 2 0');
            player.runCommand('scoreboard players set @s icequest 9');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ice9(player: Player) {
    const ice9 = new ActionForm()
    ice9.setTitle('Lvl 9 Ice Type Catch Quest Completed!!!')
    ice9.setBody('Congrats Please click the button Below to claim your reward for Catching 5k Ice Type Pokemon!!!')
    ice9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    ice9.addButton('Back', 'textures/items/crate.png') // 0
    ice9.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 3 0');
            player.runCommand('scoreboard players set @s icequest 10');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ice10(player: Player) {
    const ice10 = new ActionForm()
    ice10.setTitle('Lvl 10 Ice Type Catch Quest Completed!!!')
    ice10.setBody('Congrats Please click the button Below to claim your reward for Catching 10k Ice Type Pokemon!!!')
    ice10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    ice10.addButton('Back', 'textures/items/crate.png') // 0
    ice10.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 5 0');
            player.runCommand('scoreboard players set @s icequest 11');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function ice0_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ice Quest Stage 0 completed!');
  player.runCommand('scoreboard players set @s icequest 1');
}

export function ice1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ice Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s icequest 2');
}

export function ice2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ice Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s icequest 3');
}

export function ice3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ice Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s icequest 4');
}

export function ice4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ice Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s icequest 5');
}

export function ice5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ice Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
  player.runCommand('scoreboard players set @s icequest 6');
}

export function ice6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ice Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
  player.runCommand('scoreboard players set @s icequest 7');
}

export function ice7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ice Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0');
  player.runCommand('scoreboard players set @s icequest 8');
}

export function ice8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ice Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2 0');
  player.runCommand('scoreboard players set @s icequest 9');
}

export function ice9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ice Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3 0');
  player.runCommand('scoreboard players set @s icequest 10');

}

export function ice10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Ice Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5 0');
  player.runCommand('scoreboard players set @s icequest 11');

}
