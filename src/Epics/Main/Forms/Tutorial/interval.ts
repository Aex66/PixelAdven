

import { system, world } from "@minecraft/server";
import { openTutorial, tagTutorial } from "./main.js";

system.runInterval(() => world.getAllPlayers().forEach(player => {
    const found = player.getTags().find(tag => tag in tagTutorial);
    if(!found) return;

    player.removeTag(found);
    openTutorial(player, tagTutorial[found]);
}, 20));