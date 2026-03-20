
import Commands from "../../../../Papers/CommandPaper/CommandPaper.js";
import { sleep } from "../../../../Papers/Paragraphs/ExtrasParagraphs.js";
import { TutorialConfig } from "./config.js";

const cmd = Commands.create({
    name: "h2p",
    description: "How to play",
    aliases: ["howtoplay", "how2play", "h2play", "how", "howplay", 'tutorial', 'tut'],
    category: "Tutorial",
});
cmd.startingArgs('screens', false);
cmd.callback(async (player, args) => {
    if(args.length) return;
    player.sendMessage('Please close chat. Tutorial will open in 3 seconds.');
    await sleep(60);
    player.addTag(Object.keys(TutorialConfig)[0]);
});
cmd.dynamicType('screens', Object.keys(TutorialConfig), async (player, value) => {
    player.sendMessage('Please close chat. Tutorial will open in 3 seconds.');
    await sleep(60);
    player.addTag(value);
});