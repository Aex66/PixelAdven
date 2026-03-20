
import { Player, system } from "@minecraft/server";
import { ActionForm } from "../../../../Papers/FormPaper.js";
import { TutorialConfig, TutorialType } from "./config.js";

export const tagTutorial = {} as { [tag: string]: typeof TutorialConfig.starter };

Object.entries(TutorialConfig).forEach(t => tagTutorial[t[1].tag] = t[1]);

export function openTutorial(player: Player, tour: TutorialType) {
    system.run(() => {
        const cats = Object.keys(tour.categories);
        const form = new ActionForm();
        form.setTitle(tour.name);
        form.setBody(tour.description);
        cats.forEach(cat => form.addButton(cat));
        form.send(player, res => {
            if (res.canceled || res.selection === cats.length) return;
            tutorialPages(player, tour, cats[res.selection], 0);
        });
    });
}

function tutorialPages(player: Player, tour: TutorialType, cat: string, index: number) {
    const add = index + 1 < tour.categories[cat].pages.length ? 1 : 0;
    const form = new ActionForm();
    form.setTitle(tour.categories[cat].title);
    form.setBody(tour.categories[cat].pages[index]);
    if (add) form.addButton("Next Page");
    if (index > 0) form.addButton("Previous Page");
    form.addButton("Return to Categories");
    form.send(player, res => {
        if (res.canceled) return openTutorial(player, tour);
        if (add && res.selection === 0) return tutorialPages(player, tour, cat, index + 1);
        if (index > 0 ? add ? res.selection === 1 : res.selection === 0 : false) return tutorialPages(player, tour, cat, index - 1);
        openTutorial(player, tour);
    });
}

import "./interval.js";
import './commands.js';