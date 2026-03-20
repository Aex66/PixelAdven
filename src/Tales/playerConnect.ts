
import { Player as IPlayer, system, world } from '@minecraft/server';
import { ID } from '../Papers/Paragraphs/ExtrasParagraphs.js';
import { listeners } from './main.js';
import Database from '../Papers/DatabasePaper.js';

export const connected: { [name: string]: { memory: { [key: string]: any }, rID: string, release: number } } = {};
export let nameReg: registry, dateReg: registry;

(async function () {
    world.getDimension('overworld').runCommand('scoreboard objectives add "PLRid" dummy');
    nameReg = await Database.registry('PLRname');
    dateReg = await Database.registry('PLRdate');
    system.runInterval(() => {
        if (system.currentTick < 50) return;
        const keys = Object.keys(connected);
        keys.forEach(p => {
            if (!connected[p]?.hasOwnProperty('release')) return delete connected?.[p];
            if (connected[p].release !== 0 && connected[p].release < Date.now()) delete connected[p];
        });
        world.getAllPlayers().filter(p => !keys.includes(p.name)).forEach(p => join(p));
    }, 25);



})();


/**
 * The join function
 * @param {player} player The player
 */
function join(player: IPlayer) {
    if (!player?.nameTag) return;
    let id = world.scoreboard.getObjective('PLRid').getScores().find(p => p.participant.displayName === player.name)?.score;
    if (!id) {
        if (nameReg.has(`$${player.name}`)) id = nameReg.read(`$${player.name}`); 
        else id = Number(ID());
        player.runCommand(`scoreboard players set @s PLRid ${id}`);
        dateReg.write(Date.now(), id);
    } else {
        const find = nameReg.find(id);
        if (find) nameReg.delete(find);
    }
    nameReg.write(`$${player.name}`, id);
    connected[player.name] = { memory: {}, rID: String(id), release: 0 };

    // ⬇️ Add Story Quest starter here
    if (!player.hasTag("StartedStory")) {
        player.addTag("StartedStory");
        player.setDynamicProperty("quest_story_stage", 0);
        player.sendMessage("§dYour story begins... Visit the Lab on the hill in spawn to collect your starter Pokémon!");
    }

    listeners.forEach(event => {
        if (event[0] !== 'playerConnect') return;
        try {
            event[1](player);
        } catch { };
    });
}

world.afterEvents.playerLeave.subscribe(data => leave(data.playerName));
/**
 * The leave function
 * @param name Name?
 */
function leave(name: string) {
    if (!connected.hasOwnProperty(name)) return;
    connected[name].release = Date.now() + 3600000;
    listeners.forEach(event => {
        if (event[0] !== 'playerDisconnect') return;
        try {
            event[1](name);
        } catch { };
    });
}