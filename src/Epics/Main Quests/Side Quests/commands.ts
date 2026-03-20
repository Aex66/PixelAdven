import { system } from "@minecraft/server";
import { sleep } from "../../../Papers/Paragraphs/ExtrasParagraphs.js";
import Commands from "../../../Papers/CommandPaper/CommandPaper.js";
import { openSideQuestMenu } from "./quest_main.js"


const cmd = Commands.create({
    category: 'Quests',
    name: 'quest',
    aliases: ['qst']
});
cmd.startingArgs([], false)
cmd.callback(async function (player) {
    player.send('Close Chat to View Form');
    await sleep(60);
    system.run(() => openSideQuestMenu(player));
})