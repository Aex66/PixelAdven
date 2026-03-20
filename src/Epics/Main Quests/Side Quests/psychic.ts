import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { catchtype } from "./type_catch.js";

export function psychic0(player: Player) {
    const psychic0 = new ActionForm()
    psychic0.setTitle('Begin Catch Quest!!!')
    psychic0.setBody('Hello Trainer!! Are you ready to Start the Psychic Type Catching Quest')
    psychic0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png')
    psychic0.addButton('Back', 'textures/items/crate.png') // 0
    psychic0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s psychicquest 1');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function psychic1(player: Player) {
    const psychic1 = new ActionForm()
    psychic1.setTitle('Lvl 1 Psychic Type Catch Quest Completed!!!')
    psychic1.setBody('Congrats Please click the button Below to claim your reward for Catching 10 Psychic Type Pokemon!!!')
    psychic1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    psychic1.addButton('Back', 'textures/items/crate.png') // 0
    psychic1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s psychicquest 2');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function psychic2(player: Player) {
    const psychic2 = new ActionForm()
    psychic2.setTitle('Lvl 2 Psychic Type Catch Quest Completed!!!')
    psychic2.setBody('Congrats Please click the button Below to claim your reward for Catching 50 Psychic Type Pokemon!!!')
    psychic2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png')
    psychic2.addButton('Back', 'textures/items/crate.png') // 0
    psychic2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s psychicquest 3');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function psychic3(player: Player) {
    const psychic3 = new ActionForm()
    psychic3.setTitle('Lvl 3 Psychic Type Catch Quest Completed!!!')
    psychic3.setBody('Congrats Please click the button Below to claim your reward for Catching 100 Psychic Type Pokemon!!!')
    psychic3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    psychic3.addButton('Back', 'textures/items/crate.png') // 0
    psychic3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s psychicquest 4');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function psychic4(player: Player) {
    const psychic4 = new ActionForm()
    psychic4.setTitle('Lvl 4 Psychic Type Catch Quest Completed!!!')
    psychic4.setBody('Congrats Please click the button Below to claim your reward for Catching 150 Psychic Type Pokemon!!!')
    psychic4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png')
    psychic4.addButton('Back', 'textures/items/crate.png') // 0
    psychic4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s psychicquest 5');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function psychic5(player: Player) {
    const psychic5 = new ActionForm()
    psychic5.setTitle('Lvl 5 Psychic Type Catch Quest Completed!!!')
    psychic5.setBody('Congrats Please click the button Below to claim your reward for Catching 250 Psychic Type Pokemon!!!')
    psychic5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    psychic5.addButton('Back', 'textures/items/crate.png') // 0
    psychic5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
            player.runCommand('scoreboard players set @s psychicquest 6');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function psychic6(player: Player) {
    const psychic6 = new ActionForm()
    psychic6.setTitle('Lvl 6 Psychic Type Catch Quest Completed!!!')
    psychic6.setBody('Congrats Please click the button Below to claim your reward for Catching 500 Psychic Type Pokemon!!!')
    psychic6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png')
    psychic6.addButton('Back', 'textures/items/crate.png') // 0
    psychic6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
            player.runCommand('scoreboard players set @s psychicquest 7');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function psychic7(player: Player) {
    const psychic7 = new ActionForm()
    psychic7.setTitle('Lvl 7 Psychic Type Catch Quest Completed!!!')
    psychic7.setBody('Congrats Please click the button Below to claim your reward for Catching 1k Psychic Type Pokemon!!!')
    psychic7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    psychic7.addButton('Back', 'textures/items/crate.png') // 0
    psychic7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0');
            player.runCommand('scoreboard players set @s psychicquest 8');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function psychic8(player: Player) {
    const psychic8 = new ActionForm()
    psychic8.setTitle('Lvl 8 Psychic Type Catch Quest Completed!!!')
    psychic8.setBody('Congrats Please click the button Below to claim your reward for Catching 2.5k Psychic Type Pokemon!!!')
    psychic8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    psychic8.addButton('Back', 'textures/items/crate.png') // 0
    psychic8.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 2 0');
            player.runCommand('scoreboard players set @s psychicquest 9');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function psychic9(player: Player) {
    const psychic9 = new ActionForm()
    psychic9.setTitle('Lvl 9 Psychic Type Catch Quest Completed!!!')
    psychic9.setBody('Congrats Please click the button Below to claim your reward for Catching 5k Psychic Type Pokemon!!!')
    psychic9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    psychic9.addButton('Back', 'textures/items/crate.png') // 0
    psychic9.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 3 0');
            player.runCommand('scoreboard players set @s psychicquest 10');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function psychic10(player: Player) {
    const psychic10 = new ActionForm()
    psychic10.setTitle('Lvl 10 Psychic Type Catch Quest Completed!!!')
    psychic10.setBody('Congrats Please click the button Below to claim your reward for Catching 10k Psychic Type Pokemon!!!')
    psychic10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png')
    psychic10.addButton('Back', 'textures/items/crate.png') // 0
    psychic10.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Congrats Here\'s Your Reward!!!!');
            player.runCommand('give @s pokeworld:masterball_ticket 5 0');
            player.runCommand('scoreboard players set @s psychicquest 11');
        }
        if (res.selection === 1) {
            system.run(() => catchtype(player));
        }

    })
}
export function psychic0_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Psychic Quest Stage 0 completed!');
  player.runCommand('scoreboard players set @s psychicquest 1');
}

export function psychic1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Psychic Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s psychicquest 2');
}

export function psychic2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Psychic Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s psychicquest 3');
}

export function psychic3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Psychic Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s psychicquest 4');
}

export function psychic4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Psychic Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s psychicquest 5');
}

export function psychic5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Psychic Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0');
  player.runCommand('scoreboard players set @s psychicquest 6');
}

export function psychic6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Psychic Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0');
  player.runCommand('scoreboard players set @s psychicquest 7');
}

export function psychic7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Psychic Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0');
  player.runCommand('scoreboard players set @s psychicquest 8');
}

export function psychic8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Psychic Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2 0');
  player.runCommand('scoreboard players set @s psychicquest 9');
}

export function psychic9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Psychic Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3 0');
  player.runCommand('scoreboard players set @s psychicquest 10');
}

export function psychic10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Psychic Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5 0');
  player.runCommand('scoreboard players set @s psychicquest 11');
}

