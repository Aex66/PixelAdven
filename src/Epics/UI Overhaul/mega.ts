import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../Papers/FormPaper.js";



system.runInterval(function () {
    world.getAllPlayers().forEach(function (player) {
        if (!player.hasTag('mega')) return;
        player.removeTag('mega');

        system.run(() => openuim(player));
    });
});

function openuim(player: Player) {
    const mega = new ActionForm()
    mega.setTitle('Which Prize do you Choose?')
    mega.addButton('Aerodactylite', 'textures/items/mega_stone/aerodactylite.png') // 0
    mega.addButton('Alakazite', 'textures/items/mega_stone/alakazite.png') // 1
    mega.addButton('Beedrillite', 'textures/items/mega_stone/beedrillite.png') // 2
    mega.addButton('Blastoisite', 'textures/items/mega_stone/blastoisinite.png') // 3
    mega.addButton('Charizardite_X', 'textures/items/mega_stone/charizardite_x.png') // 4
    mega.addButton('Charizardite_Y', 'textures/items/mega_stone/charizardite_y.png') // 5
    mega.addButton('Gengarite', 'textures/items/mega_stone/gengarite.png') // 6
    mega.addButton('Gyaraosite', 'textures/items/mega_stone/gyaradosite.png') // 7
    mega.addButton('Kangaskhanite', 'textures/items/mega_stone/kangaskhanite.png') // 8
    mega.addButton('Pidgeotite', 'textures/items/mega_stone/pidgeotite.png') // 9
    mega.addButton('Pinsirite', 'textures/items/mega_stone/pinsirite.png') // 10
    mega.addButton('Slowbronite', 'textures/items/mega_stone/slowbronite.png') // 11
    mega.addButton('Venusaurite', 'textures/items/mega_stone/venusaurite.png') // 12
    mega.addButton('Retry', 'textures/items/crate_tickets/legendary_ticket.png') // 13
    mega.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) player.runCommand('function Aerodactylite');

        if (res.selection === 1) player.runCommand('function Alakazite');

        if (res.selection === 2) player.runCommand('function Beedrillite');

        if (res.selection === 3) player.runCommand('function Blastoisite');

        if (res.selection === 4) player.runCommand('function Charizardite_X');

        if (res.selection === 5) player.runCommand('function Charizardite_Y');

        if (res.selection === 6) player.runCommand('function Gengarite');

        if (res.selection === 7) player.runCommand('function Gyaraosite');

        if (res.selection === 8) player.runCommand('function Kangaskhanite');

        if (res.selection === 9) player.runCommand('function Pidgeotite');

        if (res.selection === 10) player.runCommand('function Pinsirite');

        if (res.selection === 11) player.runCommand('function Slowbronite');

        if (res.selection === 12) player.runCommand('function Venusaurite');

        if (res.selection === 13) player.runCommand('function Retry');
    })
}