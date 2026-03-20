import { system } from "@minecraft/server";
import { ActionForm } from "../../Papers/FormPaper.js";
import Commands from "../../Papers/CommandPaper/CommandPaper.js";
import { PlayerType } from "../../Papers/@types/PlayerTypes.js";
const cmd = Commands.create({
    name: 'fly',
    description: 'Fly HM',
    category: 'Epics'
});
cmd.callback(player => {
    player.send('Form will be shown in 2 seconds, close chat!');
    system.runTimeout(() => fly(player), 40);
});
const fly = (player: PlayerType) => system.run(() => {
    const form = new ActionForm(), Locations: string[] = [];
    form.setTitle('Travel Map');
    form.setBody(``);
    if (player.getScore('spawn') === 0) {
        form.addButton('No Locations', 'textures/items/badges/badge_empty.png');
        Locations.push('Empty');
    }
    if (player.getScore('spawn') === 1)
        form.addButton('Spawn', 'textures/items/poke.png'); else Locations.push('spawn');
    if (player.getScore('OOC') === 1)
        form.addButton('Ore Oasis City', 'textures/items/badges/badge1.png'); else Locations.push('rock');
    if (player.getScore('OS') === 1)
        form.addButton('Obsidian Shade', 'textures/items/badges/badge2.png'); else Locations.push('dark');
    if (player.getScore('SS') === 1)
        form.addButton('Seabreeze Shoreline', 'textures/items/badges/badge3.png'); else Locations.push('water');
    if (player.getScore('SH') === 1)
        form.addButton('Skyforge Heights', 'textures/items/badges/badge4.png'); else Locations.push('flying');
    if (player.getScore('SSC') === 1)
        form.addButton('Scorchstone City', 'textures/items/badges/badge5.png'); else Locations.push('fire');
    if (player.getScore('DR') === 1)
        form.addButton('Dragonbone Ridge', 'textures/items/badges/badge6.png'); else Locations.push('dragon');
    if (player.getScore('GE') === 1)
        form.addButton('Glaciers Edge', 'textures/items/badges/badge7.png'); else Locations.push('ice');
    if (player.getScore('SLC') === 1)
        form.addButton('Sylvestra City', 'textures/items/badges/badge8.png'); else Locations.push('grass');
    if (player.getScore('victory') === 1)
        form.addButton('Victory Road', 'textures/items/victory.png'); else Locations.push('victoryroad');
    if (player.getScore('home') === 1)
        form.addButton('Home', 'textures/items/home.png'); else Locations.push('home');
    form.addButton('Ok!');
    form.send(player, res => {
        if (res.canceled) return fly(player);
        if (Locations.includes('Empty')) return player.send('You have no locations unlocked!');
        const hasLocations = ['spawn', 'rock', 'dark', 'water', 'flying', 'fire', 'dragon', 'ice', 'grass', 'victoryroad', 'home'];
        Locations.forEach(loc => hasLocations.splice(hasLocations.indexOf(loc), 1));
        player.runCommand(`function ${hasLocations[res.selection]}_tp`);
    });
});