import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../../Papers/FormPaper.js";
import './mega.js';
import './fly.js';
import './travellingNPC.js'

system.runInterval(function () {
    world.getAllPlayers().forEach(function (player) {
        if (!player.hasTag('orb')) return;
        player.removeTag('orb');

        system.run(() => openui(player));
    });
});

function openui(player: Player) {
    const orb = new ActionForm()
    orb.setTitle('Which Prize do you Choose?')
    orb.addButton('Lightning Orb', 'textures/items/legendary_orbs/lightning_orb.png') // 0
    orb.addButton('Flame Orb', 'textures/items/legendary_orbs/flame_orb.png') // 1
    orb.addButton('Ice Orb', 'textures/items/legendary_orbs/ice_orb.png') // 2
    orb.addButton('Get Souls', 'textures/items/item_base_UI/Gastly.png') // 3
    orb.send(player, function (res) {
        if (res.canceled) return;

        if (res.selection === 0) player.runCommand('function Lightning_Orb');

        if (res.selection === 1) player.runCommand('function Flame_Orb');

        if (res.selection === 2) player.runCommand('function Ice_Orb');

        if (res.selection === 3) player.runCommand('function Souls');
    })
}