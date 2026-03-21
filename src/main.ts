console.warn('Imported main file')
import { Player, system, world} from '@minecraft/server';
import { sleep } from './Papers/Paragraphs/ExtrasParagraphs.js';
import { updateLang } from './Papers/LangPaper.js';
import Commands from './Papers/CommandPaper/CommandPaper.js';
import Server from './Papers/ServerPaper.js';

/*
 * Welcome to the Main page!
 * Main Developer: Mo9ses
 * Sub developer: Nobody!
 * Link to name: MAIN ROT
 */

/**
 * The startup function
 */
export async function startup(): Promise<void> {
    await Server.startServer();
    updateLang();
    //Checks ROT command arguments for imperfections 
    Commands.list.forEach((cmd, i) => {
        try {
            const length = Object.keys(cmd.aR).length, fakeArgs = cmd.aR;
            if (length && !cmd.sT[0].length) throw Error(`Command "${cmd.name}" has no starting args, but has args.`);
            if (!length && cmd.sT[0].length) throw Error(`Command "${cmd.name}" has starting args, but no args.`);
            if (cmd.sT[0].some(a => !cmd.aR.hasOwnProperty(a))) throw Error(`Some of the starting arguments for the command "${cmd.name}" don't exist.`);
            Object.assign(fakeArgs, { '-2': { nA: cmd.sT[0] } });
            for (const arg in fakeArgs) {
                if (fakeArgs[arg].nN && !fakeArgs[arg].nA.length) throw Error(`Argument "${arg}" from command "${cmd.name}" needs next args but, there are no args afther it.`);
                const realArgs = fakeArgs[arg].nA.filter(a => cmd.aR.hasOwnProperty(a));
                if (arg != '-1' && fakeArgs[arg].nA.length !== realArgs.length) throw Error(`Argument "${arg}" from command "${cmd.name}" is asking for next argument(s) that don't exist!`);
                const argTypes = realArgs.map(a => ['sta', 'dyn', 'ukn'].includes(cmd.aR[a].tY) ? '' : cmd.aR[a].tY), test: string[] = [];
                argTypes.forEach(t => (!test.includes(t) || t === '') && test.unshift(t));
                if (test.length !== argTypes.length) throw Error(`Argument "${arg}" from command "${cmd.name}" has two of the same types for the next arg!`);
            }
        } catch (e) {
            Commands.list.splice(i, 1);
        }
    });
}


updateLang();
world.afterEvents.worldLoad.subscribe(async () => {
    sleep(10);
    await startup();
});
import './Epics/Pokemon Battles/main.js'
import './Papers/ServerPaper.js';
import './Tales/beforeChat.js';
import './Tales/playerConnect.js';
import './Epics/Main Quests/main.js'
import './Epics/NoSpawn/main.js'
import './Epics/Casino/main.js'
import './Epics/Spawns/main.js';
import './Epics/Main/main.js';
import './Epics/Markets/main.js';
import './Epics/Pokemon Breeding/breeding_machine.js'
import './Epics/Pokemon Calculations/main.js';
import './Epics/Pokemon Database/main.js';
import './Epics/Trading/main.js';
import './Epics/Items/main.js';
import './Epics/Misc/main.js';
import './Epics/UI Overhaul/main.js';
import './Epics/Crates/main.js';
import './Epics/howToPlay/howToPlayMain.js'
import './Epics/Outbreaks/Main.js'
import './Epics/Event Pokemon/main.js'
import './Epics/TeamGyms/main.js'
// Listen for the scriptevent trigger
system.afterEvents.scriptEventReceive.subscribe(event => {
    if (event.id === "aex:menu"){
        
    }
    if (event.id !== "remove:str_scores") return;

    const source = event.sourceEntity;
    if (!(source instanceof Player)) return;

    let removed = 0;

    for (const objective of world.scoreboard.getObjectives()) {
        if (objective.id.startsWith("STR:")) {
            world.scoreboard.removeObjective(objective);
            removed++;
        }
    }

    const message = removed > 0
        ? `§aRemoved ${removed} scoreboard(s) starting with 'STR:'`
        : `§eNo scoreboards starting with 'STR:' were found.`;

    source.sendMessage(message);
});