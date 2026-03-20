import { Player, system } from "@minecraft/server";
import { ActionForm } from "../../../Papers/FormPaper.js";
import { openSideQuestMenu } from "./quest_main.js";

export function pokestop0(player: Player) {
    const pokestop0 = new ActionForm();
    pokestop0.setTitle('Begin Catch Quest!!!');
    pokestop0.setBody('Hello Trainer!! Are you ready to Start the pokestop Quest');
    pokestop0.addButton('Start Quest', 'textures/items/crate_tickets/pokeball_ticket.png');
    pokestop0.addButton('Back', 'textures/items/crate.png');
    pokestop0.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage('Good Luck Trainer!!!');
            player.runCommand('scoreboard players set @s pokestop_quest 1');
        }
        if (res.selection === 1) {
            system.run(() => openSideQuestMenu(player));
        }
    });
}

export function pokestop1(player: Player) {
    const pokestop1 = new ActionForm();
    pokestop1.setTitle('Lvl 1 Pokestop Quest Completed!!!');
    pokestop1.setBody('Reward for spinning 25 Pokestops!');
    pokestop1.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png');
    pokestop1.addButton('Back', 'textures/items/crate.png');
    pokestop1.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:pokeball_ticket 1');
            player.runCommand('scoreboard players set @s pokestop_quest 2');
            player.runCommand('scoreboard players add @s Money 1000');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    });
}

export function pokestop2(player: Player) {
    const pokestop2 = new ActionForm();
    pokestop2.setTitle('Lvl 2 Pokestop Quest Completed!!!');
    pokestop2.setBody('Reward for spinning 75 Pokestops!');
    pokestop2.addButton('Claim Reward', 'textures/items/crate_tickets/pokeball_ticket.png');
    pokestop2.addButton('Back', 'textures/items/crate.png');
    pokestop2.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:pokeball_ticket 3');
            player.runCommand('scoreboard players set @s pokestop_quest 3');
            player.runCommand('scoreboard players add @s Money 2000');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    });
}

export function pokestop3(player: Player) {
    const pokestop3 = new ActionForm();
    pokestop3.setTitle('Lvl 3 Pokestop Quest Completed!!!');
    pokestop3.setBody('Reward for spinning 150 Pokestops!');
    pokestop3.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png');
    pokestop3.addButton('Back', 'textures/items/crate.png');
    pokestop3.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:greatball_ticket 1');
            player.runCommand('scoreboard players set @s pokestop_quest 4');
            player.runCommand('scoreboard players add @s Money 4000');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    });
}

export function pokestop4(player: Player) {
    const pokestop4 = new ActionForm();
    pokestop4.setTitle('Lvl 4 Pokestop Quest Completed!!!');
    pokestop4.setBody('Reward for spinning 250 Pokestops!');
    pokestop4.addButton('Claim Reward', 'textures/items/crate_tickets/greatball_ticket.png');
    pokestop4.addButton('Back', 'textures/items/crate.png');
    pokestop4.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:greatball_ticket 3');
            player.runCommand('scoreboard players set @s pokestop_quest 5');
            player.runCommand('scoreboard players add @s Money 6000');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    });
}

export function pokestop5(player: Player) {
    const pokestop5 = new ActionForm();
    pokestop5.setTitle('Lvl 5 Pokestop Quest Completed!!!');
    pokestop5.setBody('Reward for spinning 400 Pokestops!');
    pokestop5.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png');
    pokestop5.addButton('Back', 'textures/items/crate.png');
    pokestop5.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.runCommand('give @s pokeworld:ultraball_ticket 2 0 ');
            player.runCommand('scoreboard players set @s pokestop_quest 6');
            player.runCommand('scoreboard players add @s Money 10000');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    });
}

export function pokestop6(player: Player) {
    const pokestop6 = new ActionForm();
    pokestop6.setTitle('Lvl 6 Pokestop Quest Completed!!!');
    pokestop6.setBody('Reward for spinning 600 Pokestops!');
    pokestop6.addButton('Claim Reward', 'textures/items/crate_tickets/ultraball_ticket.png');
    pokestop6.addButton('Back', 'textures/items/crate.png');
    pokestop6.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.runCommand('scoreboard players add @s ultracrate 5');
            player.runCommand('give @s pokeworld:ultraball_ticket 5 0 ');
            player.runCommand('scoreboard players set @s pokestop_quest 7');
            player.runCommand('scoreboard players add @s Money 15000');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    });
}

export function pokestop7(player: Player) {
    const pokestop7 = new ActionForm();
    pokestop7.setTitle('Lvl 7 Pokestop Quest Completed!!!');
    pokestop7.setBody('Reward for spinning 900 Pokestops!');
    pokestop7.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png');
    pokestop7.addButton('Back', 'textures/items/crate.png');
    pokestop7.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.runCommand('scoreboard players add @s mastercrate 1');
            player.runCommand('give @s pokeworld:masterball_ticket 1 0 ');
            player.runCommand('scoreboard players set @s pokestop_quest 8');
            player.runCommand('scoreboard players add @s Money 25000');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    });
}

export function pokestop8(player: Player) {
    const pokestop8 = new ActionForm();
    pokestop8.setTitle('Lvl 8 Pokestop Quest Completed!!!');
    pokestop8.setBody('Reward for spinning 1250 Pokestops!');
    pokestop8.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png');
    pokestop8.addButton('Back', 'textures/items/crate.png');
    pokestop8.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.runCommand('scoreboard players add @s mastercrate 2');
            player.runCommand('give @s pokeworld:masterball_ticket 2 0 ');
            player.runCommand('scoreboard players set @s pokestop_quest 9');
            player.runCommand('scoreboard players add @s Money 40000');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    });
}

export function pokestop9(player: Player) {
    const pokestop9 = new ActionForm();
    pokestop9.setTitle('Lvl 9 Pokestop Quest Completed!!!');
    pokestop9.setBody('Reward for spinning 1750 Pokestops!');
    pokestop9.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png');
    pokestop9.addButton('Back', 'textures/items/crate.png');
    pokestop9.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.runCommand('scoreboard players add @s mastercrate 3');
            player.runCommand('give @s pokeworld:masterball_ticket 3 0 ');
            player.runCommand('scoreboard players set @s pokestop_quest 10');
            player.runCommand('scoreboard players add @s Money 60000');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    });
}

export function pokestop10(player: Player) {
    const pokestop10 = new ActionForm();
    pokestop10.setTitle('Lvl 10 Pokestop Quest Completed!!!');
    pokestop10.setBody('Final reward for spinning 2500 Pokestops!');
    pokestop10.addButton('Claim Reward', 'textures/items/crate_tickets/masterball_ticket.png');
    pokestop10.addButton('Back', 'textures/items/crate.png');
    pokestop10.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.runCommand('scoreboard players add @s mastercrate 5');
            player.runCommand('give @s pokeworld:masterball_ticket 5 0 ');
            player.runCommand('scoreboard players set @s pokestop_quest 11');
            player.runCommand('scoreboard players add @s Money 100000');
        }
        if (res.selection === 1) system.run(() => openSideQuestMenu(player));
    });
}


export function pokestop1_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Pokestop Quest Stage 1 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 1');
  player.runCommand('scoreboard players set @s pokestop_quest 2');
}

export function pokestop2_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Pokestop Quest Stage 2 completed!');
  player.runCommand('give @s pokeworld:pokeball_ticket 3');
  player.runCommand('scoreboard players set @s pokestop_quest 3');
}

export function pokestop3_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Pokestop Quest Stage 3 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 1');
  player.runCommand('scoreboard players set @s pokestop_quest 4');
}

export function pokestop4_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Pokestop Quest Stage 4 completed!');
  player.runCommand('give @s pokeworld:greatball_ticket 3');
  player.runCommand('scoreboard players set @s pokestop_quest 5');
}

export function pokestop5_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Pokestop Quest Stage 5 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 2 0 ');
  player.runCommand('scoreboard players set @s pokestop_quest 6');
}

export function pokestop6_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Pokestop Quest Stage 6 completed!');
  player.runCommand('give @s pokeworld:ultraball_ticket 5 0 ');
  player.runCommand('scoreboard players set @s pokestop_quest 7');
}

export function pokestop7_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Pokestop Quest Stage 7 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 1 0 ');
  player.runCommand('scoreboard players set @s pokestop_quest 8');
}

export function pokestop8_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Pokestop Quest Stage 8 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 2 0 ');
  player.runCommand('scoreboard players set @s pokestop_quest 9');
}

export function pokestop9_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Pokestop Quest Stage 9 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 3 0 ');
  player.runCommand('scoreboard players set @s pokestop_quest 10');
}

export function pokestop10_reward(player: Player) {
  // 🔁 AUTO-CLAIM REWARD (NO UI)
  player.sendMessage('§a✔ Pokestop Quest Stage 10 completed!');
  player.runCommand('give @s pokeworld:masterball_ticket 5 0 ');
  player.runCommand('scoreboard players set @s pokestop_quest 11');
}
