/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
Aex66 (Developer)
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
__________ ___________________
\______   \\_____  \__    ___/
 |       _/ /   |   \|    |
 |    |   \/    |    \    |
 |____|_  /\_______  /____|
        \/         \/
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
© Copyright 2023 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Website: https://www.rotmc.ml
Thank you!
*/
import { world, ItemStack, system, Player as IPlayer, Container } from "@minecraft/server";
import { metricNumbers } from "./Paragraphs/ConvertersParagraphs.js";
import { ActionForm, MessageForm, ModalForm } from "./FormPaper.js";
import { ID, confirmForm } from "./Paragraphs/ExtrasParagraphs.js";
import { TemplateTypes } from "./@types/TemplateTypes.js";
import { PlayerType } from "./@types/PlayerTypes.js";
import Player from "./PlayerPaper.js";

class MarketPaper {
    config: TemplateTypes['config'];
    forms: { [id: string]: TemplateTypes['form'] };
    buttons: { [id: string]: TemplateTypes['button'] };
    private backlist: { [name: string]: string } = {};

    constructor(config: TemplateTypes['config'], forms?: { [id: string]: TemplateTypes['form'] }, buttons?: { [id: string]: TemplateTypes['button'] }) {
        this.config = config;
        this.forms = forms ?? {};
        this.buttons = buttons ?? {};

        [this.config.buttons].flat(1).forEach((button, index) => {
            if(typeof button !== 'object') return;
            const random = ID();
            this.addButton(random, button);
            this.config.buttons.splice(index, 1, random);
        });

        // If they want to use entities, add an event listener
        if(config.entity) world.afterEvents.entityHitEntity.subscribe(data => {
            if (data.hitEntity?.typeId !== config.entity || !(data.damagingEntity instanceof IPlayer)) return;
            try {
                this.openMain(Player.playerType(data.damagingEntity));
            }
            catch (e) {
                //console.warn(e + e.stack);
            }
        });
     
        // If they want to use tags, add an event listener
        if(config.tag) system.runInterval(() => world.getAllPlayers().forEach(player => player.hasTag(config.tag) && this.openMain(Player.playerType(player))), 40);
    }

    addForm(id: string, form: TemplateTypes['form']): this {
        this.forms[id] = form;
        return this;
    }
    addButton(id: string, button: TemplateTypes['button']): this {
        this.buttons[id] = button;
        return this;
    }

    openMain(player: PlayerType): void {
        player.removeTag(this.config.tag);
        try {
            this.config.open?.(player);
        } catch (e) {
            console.warn(e + e.stack);
        }
        const form = new ActionForm();
        form.setTitle(this.config.name);
        form.setBody(this.config.description);
        this.config.buttons.forEach((button: string) => form.addButton(this.buttons[button].text, this.buttons[button].icon));
    }
}

export default MarketPaper;