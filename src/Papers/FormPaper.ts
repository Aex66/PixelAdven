/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer)
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
__________ ___________________
\______   \\_____  \__    ___/
 |       _/ /   |   \|    |   
 |    |   \/    |    \    |   
 |____|_  /\_______  /____|   
        \/         \/         
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
Â© Copyright 2023 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Website: https://www.rotmc.ml
Thank you!
*/
import { Player as IPlayer } from '@minecraft/server';
import { ActionFormData, MessageFormData, ModalFormData } from '@minecraft/server-ui';
import type { PlayerType } from './@types/PlayerTypes.js';
//Make it so it will try opening the form every 10 ticks if the user is busy
/*
 * Welcome to the Form page!
 * Main Developer: Mo9ses
 * Sub developer: NOBODY
 * Link to name: FormPaper
*/
export interface simpleFormResponse {
    readonly cancelationReason?: 'UserBusy' | 'UserClosed'
    readonly selection?: number
    readonly canceled: boolean
}
export interface advancedFormResponse {
    readonly cancelationReason?: 'UserBusy' | 'UserClosed'
    readonly formValues?: any[]
    readonly canceled: boolean
}
/**
 * @class A Action Form is simple gametest UI that has only buttons
 * @example const dc = new ActionForm(); dc.show('Mo9ses');
 * @returns Shows a simple action form to the member "Mo9ses"
 */
export class ActionForm {
    title(arg0: string) {
        throw new Error("Method not implemented.");
    }
    body(arg0: string) {
        throw new Error("Method not implemented.");
    }
    button(arg0: string) {
        throw new Error("Method not implemented.");
    }
    show(player: IPlayer, p0: (res: { canceled: boolean; selection: number; }) => void | Promise<void>) {
        throw new Error("Method not implemented.");
    }
    private readonly form: ActionFormData = new ActionFormData();
    /**
     * @function setTitle Sets the title of the form
     * @param {string} text The title text
     * @example .setTitle('Server!');
     * @returns {void}
     */
    setTitle(text: string): void {
        this.form.title(text);
    }
    /**
     * @function setBody Sets the body of the form
     * @param {string} text The body text
     * @example .setBody('Login to be able to play on this server!');
     * @returns {void}
     */
    setBody(text: string): void {
        this.form.body(text);
    }
    /**
     * @function addButton Adds a button to the form
     * @param {string} text The button text
     * @param {string} text The icon path of the button. This is not required to add a button
     * @example .addButton('Ok!', 'textures/UI/agree');
     * @returns {void}
     */
    addButton(text: string, iconPath?: string): void {
        this.form.button(text, iconPath ?? undefined);
    }
    /**
     * @function send The sends the UI to a member
     * @param {string} player The member's you want to send it to
     * @param callback a asynchronous arrow function that will run after the form is filled out (Not fully if a model form).
     * @example .send('Mo9ses');
     * @returns {void}
     */
    async send(player: IPlayer | PlayerType, callback?: (res: simpleFormResponse, player: IPlayer | PlayerType) => void): Promise<void> {
        await this.form.show(player as any).then((res: simpleFormResponse) => {
            if(!callback) return;
            callback(res, player);
        }).catch((err: any) => console.warn(err));
    }
}
/**
 * @class A Message Form is simple gametest UI that has TWO only buttons
 * @example const dc = new MessageForm(); dc.show('Mo9ses');
 * @returns Shows a simple message form to the player "Mo9ses"
 */
export class MessageForm {
    private readonly form: MessageFormData  = new MessageFormData();
    /**
     * @function setTitle Sets the title of the form
     * @param {string} text The title text
     * @example .setTitle('Server!');
     * @returns {void}
     */
    setTitle(text: string): void {
        this.form.title(text);
    }
    /**
     * @function setBody Sets the body of the form
     * @param {string} text The body text
     * @example .setBody('ROT?');
     * @returns {void}
     */
    setBody(text: string): void {
        this.form.body(text);
    }
    /**
     * @function setButton1 Adds the first button to the form
     * @param {string} text The button text
     * @example .setButton1('YESSSSS!');
     * @returns {void}
     */
    setButton1(text: string): void {
        this.form.button2(text);
    }
    /**
     * @function setButton2 Adds the second button to the form
     * @param {string} text The button text
     * @example .setButton2('DOWNLOAD IT!!!');
     * @returns {void}
     */
    setButton2(text: string): void {
        this.form.button1(text);
    }
    /**
     * @function send The sends the UI to a member
     * @param {string} player The member's you want to send it to
     * @param callback a asynchronous arrow function that will run after the form is filled out (Not fully if a model form).
     * @example .send('Mo9ses');
     * @returns {void}
     */
    async send(player: IPlayer | PlayerType, callback?: (res: simpleFormResponse, player: IPlayer | PlayerType) => void): Promise<void> {
        await this.form.show(player as any).then((res: simpleFormResponse) => {
            if(!callback) return;
            callback(res, player);
        }).catch((err: any) => console.warn(err));
    }
}
/**
 * @class A Modal Form is a bit more advanced gametest UI that has sliders, text fields, ane much more, BUT NO BUTTONS!
 * @example const dc = new ModelForm(); dc.show('Mo9ses');
 * @returns Shows a simple ModalForm form to the player "Mo9ses"
 */
export class ModalForm {
    show(player: IPlayer, p0: (res: { canceled: boolean; formValues: any[]; }) => void) {
        throw new Error("Method not implemented.");
    }
    dropdown(arg0: string, names: string[], arg2: number) {
        throw new Error("Method not implemented.");
    }
    title(arg0: string) {
        throw new Error("Method not implemented.");
    }
    private readonly form: ModalFormData = new ModalFormData();
    /**
     * @function setTitle Sets the title of the form
     * @param {string} text The title text
     * @example .setTitle('Server!');
     * @returns {void}
     */
    setTitle(text: string): void {
        this.form.title(text);
    }
    /**
     * @function addInput Add a text box for the member to type in
     * @param {string} label The name for the text box
     * @param {string} placeHolderText The display text in the empty text box
     * @param {string} defaultValue The default text that will be in the box (Not required!)
     * @example .addImput('What is your IP?', '0.0.0.0');
     * @returns {void}
     */
    addInput(label: string, placeHolderText?: string, defaultValue?: string): void {//@ts-ignore
        this.form.textField(label, placeHolderText ?? '', { defaultValue: defaultValue ?? ''});
    }
    /**
     * @function addDropdown Make a drop down menu to the form
     * @param {string} label the name of the drop down
     * @param {string[]} options The options in the drop down
     * @param {number} defaultValueIndex Where should the default value be when you first open the form
     * @example .addDropdown('Where do you live?', ['Mexico', 'America', 'Asia'], 1);
     * @returns {void}
     */
    addDropdown(label: string, options: string[], defaultValueIndex?: number): void {//@ts-ignore
        this.form.dropdown(label, options, { defaultValueIndex: defaultValueIndex ?? 0});
    }
    /**
     * @function addSlider Add a slider that will sliiiiiiiiiiiiide on the fooooooorm!
     * @param {string} label The name of the sliiiiiiider
     * @param {number} minimumValue The smallest number for the slider
     * @param {number} maximumValue The bigest number for the slider
     * @param {number} valueStep The amount should it step each time you move it left or right
     * @param {number} defaultValue Where should it be at when you first open the UI
     * @example .addSlider('Rate ROT', 9, 10, 1, 10);
     * @returns {void}
     */
    addSlider(label: string, minimumValue: number, maximumValue: number, valueStep?: number, defaultValue?: number): void {
        if(minimumValue > maximumValue) throw new Error('[Forms UI Silder] Error - the Min value cannot be greater than the Max value');//@ts-ignore
        this.form.slider(label, minimumValue, maximumValue, { valueStep: valueStep ?? 1, defaultValue: defaultValue ?? ~~(maximumValue / minimumValue) });
    }
    /**
     * @function addToggle Adds a on/off button to the form
     * @param {string} label Then name of the toggle switch
     * @param {boolean} defaultValue Be either on or off when they first open the form
     * @example .addToggle('Cheese?');
     * @returns {void}
     */
    addToggle(label: string, defaultValue?: boolean): void {//@ts-ignore
        this.form.toggle(label, { defaultValue: defaultValue ?? false });
    }
    /**
     * @function send The sends the UI to a member
     * @param {string} player The member's you want to send it to
     * @param callback a asynchronous arrow function that will run after the form is filled out (Not fully if a model form).
     * @example .send('Mo9ses');
     * @returns {void}
     */
    async send(player: IPlayer | PlayerType, callback?: (res: advancedFormResponse, player: IPlayer | PlayerType) => void): Promise<void> {
        await this.form.show(player as any).then((res: advancedFormResponse) => {
            if(!callback) return;
            callback(res, player);
        }).catch((err: any) => console.warn(err));
    }
}