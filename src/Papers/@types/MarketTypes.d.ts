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
declare interface MarketTypes {
    config: {
        name: string
        from: string;
        description: string;
        entity?: string;
        tag?: string;
        objective: string;
    };
    categories: {
        [name: string]: {
            description: string;
            icon: string;
            items: {
                [itemName: string]: MarketTypes['item'];
            };
        };
    };
    item: {
        id: string;
        icon: string;
        once?: boolean;
        cmd?: string;
        buy?: number;
        sell?: number;
    };
}