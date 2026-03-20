import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { catchtype } from "./type_catch.js";

export function poison0(player: Player) {
    const poison0 = new ActionForm()
    poison0.setTitle('Begin Catch Quest!!!')
    poison0.setBody('Hello Trainer!! Are you ready to Start the Poison Type Catching Quest')
    poison0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    poison0.addButton('Back', 'textures/items/crate.png') // 0
    poison0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s poisonquest 1');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function poison1(player: Player) {
    const poison1 = new ActionForm()
    poison1.setTitle('Lvl 1 Poison Type Catch Quest Completed!!!')
    poison1.setBody('Congrats Please click the button Below to claim your reward for Catching 10 Poison Type Pokemon!!!')
    poison1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    poison1.addButton('Back', 'textures/items/crate.png') // 0
    poison1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s poisonquest 2');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function poison2(player: Player) {
    const poison2 = new ActionForm()
    poison2.setTitle('Lvl 2 Poison Type Catch Quest Completed!!!')
    poison2.setBody('Congrats Please click the button Below to claim your reward for Catching 50 Poison Type Pokemon!!!')
    poison2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    poison2.addButton('Back', 'textures/items/crate.png') // 0
    poison2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s poisonquest 3');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function poison3(player: Player) {
    const poison3 = new ActionForm()
    poison3.setTitle('Lvl 3 Poison Type Catch Quest Completed!!!')
    poison3.setBody('Congrats Please click the button Below to claim your reward for Catching 100 Poison Type Pokemon!!!')
    poison3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    poison3.addButton('Back', 'textures/items/crate.png') // 0
    poison3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s poisonquest 4');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function poison4(player: Player) {
    const poison4 = new ActionForm()
    poison4.setTitle('Lvl 4 Poison Type Catch Quest Completed!!!')
    poison4.setBody('Congrats Please click the button Below to claim your reward for Catching 150 Poison Type Pokemon!!!')
    poison4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    poison4.addButton('Back', 'textures/items/crate.png') // 0
    poison4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s poisonquest 5');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function poison5(player: Player) {
    const poison5 = new ActionForm()
    poison5.setTitle('Lvl 5 Poison Type Catch Quest Completed!!!')
    poison5.setBody('Congrats Please click the button Below to claim your reward for Catching 250 Poison Type Pokemon!!!')
    poison5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    poison5.addButton('Back', 'textures/items/crate.png') // 0
    poison5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s poisonquest 6');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function poison6(player: Player) {
    const poison6 = new ActionForm()
    poison6.setTitle('Lvl 6 Poison Type Catch Quest Completed!!!')
    poison6.setBody('Congrats Please click the button Below to claim your reward for Catching 500 Poison Type Pokemon!!!')
    poison6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    poison6.addButton('Back', 'textures/items/crate.png') // 0
    poison6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s poisonquest 7');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function poison7(player: Player) {
    const poison7 = new ActionForm()
    poison7.setTitle('Lvl 7 Poison Type Catch Quest Completed!!!')
    poison7.setBody('Congrats Please click the button Below to claim your reward for Catching 1k Poison Type Pokemon!!!')
    poison7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    poison7.addButton('Back', 'textures/items/crate.png') // 0
    poison7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s poisonquest 8');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function poison8(player: Player) {
    const poison8 = new ActionForm()
    poison8.setTitle('Lvl 8 Poison Type Catch Quest Completed!!!')
    poison8.setBody('Congrats Please click the button Below to claim your reward for Catching 2.5k Poison Type Pokemon!!!')
    poison8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    poison8.addButton('Back', 'textures/items/crate.png') // 0
    poison8.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 2 0');
            player.runCommand('scoreboard players set @s poisonquest 9');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function poison9(player: Player) {
    const poison9 = new ActionForm()
    poison9.setTitle('Lvl 9 Poison Type Catch Quest Completed!!!')
    poison9.setBody('Congrats Please click the button Below to claim your reward for Catching 5k Poison Type Pokemon!!!')
    poison9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    poison9.addButton('Back', 'textures/items/crate.png') // 0
    poison9.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 3 0');
            player.runCommand('scoreboard players set @s poisonquest 10');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function poison10(player: Player) {
    const poison10 = new ActionForm()
    poison10.setTitle('Lvl 10 Poison Type Catch Quest Completed!!!')
    poison10.setBody('Congrats Please click the button Below to claim your reward for Catching 10k Poison Type Pokemon!!!')
    poison10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    poison10.addButton('Back', 'textures/items/crate.png') // 0
    poison10.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 5 0');
            player.runCommand('scoreboard players set @s poisonquest 11');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function poison0_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Poison Quest Stage 0 completed!');
  player.runCommand('scoreboard players set @s poisonquest 1');
}

export function poison1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Poison Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s poisonquest 2');
}

export function poison2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Poison Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s poisonquest 3');
}

export function poison3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Poison Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s poisonquest 4');
}

export function poison4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Poison Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s poisonquest 5');
}

export function poison5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Poison Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
  player.runCommand('scoreboard players set @s poisonquest 6');
}

export function poison6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Poison Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
  player.runCommand('scoreboard players set @s poisonquest 7');
}

export function poison7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Poison Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0');
  player.runCommand('scoreboard players set @s poisonquest 8');
}

export function poison8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Poison Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2 0');
  player.runCommand('scoreboard players set @s poisonquest 9');
}

export function poison9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Poison Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3 0');
  player.runCommand('scoreboard players set @s poisonquest 10');
}

export function poison10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Poison Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5 0');
  player.runCommand('scoreboard players set @s poisonquest 11');
}
