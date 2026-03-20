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
import { PlayerType } from "./PlayerTypes";

declare interface TemplateTypes {
    config: {
        name: string
        description: string;
        entity?: string;
        tag?: string;
        
        buttons: string[] | TemplateTypes['button'][];

        open?: (player: PlayerType) => any;
        close?: (player: PlayerType) => any;
        closeMessage?: string;
    };

    button: {
        text?: string;
        icon?: string;
        predicate?: (player: PlayerType) => boolean;
        success?: (player: PlayerType) => any;
        failure?: (player: PlayerType) => any;
    };
    form: {
        title?: string;
        description?: string;
        buttons: string[] | TemplateTypes['button'][];
        back?: boolean
    };
}