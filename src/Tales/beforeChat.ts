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

import { system, world } from '@minecraft/server';
import { listeners, orderVender } from './main.js';
import Commands from '../Papers/CommandPaper/CommandPaper.js';
import Player from '../Papers/PlayerPaper.js';
import Lang from '../Papers/LangPaper.js';
import quick from '../quick.js';

/**
 * The rank system and the command starter/runner
 */
world.beforeEvents.chatSend.subscribe(data => {
    try {
        data.cancel = true;

        let text = data.message.replace(/\s+/g, ' ').trim();
        if (text === '') return;

        // Normal chat (not a command)
        if (!text.startsWith(quick.prefix)) {

            // Run beforeChat listeners
            for (const event of listeners) {
                if (event[0] !== 'beforeChat') continue;
                try {
                    event[1]({ message: text, player: data.sender });
                } catch {
                    return data.cancel = true;
                }
            }

            if (text.startsWith(quick.prefix)) 
                return Player.error(data.sender, Lang.cmd.wrongPrefix(quick.prefix));

            if (Player.isAdmin(data.sender) && data.sender.hasTag('mute')) 
                return Player.error(data.sender, Lang.chat.mutted);

            if (!quick.chatRanks) 
                return data.cancel = false;

            const message = Player.getChatColors(data.sender) + 
                text.charAt(0).toUpperCase() + text.slice(1);

            const rank = `§7${Player.getPrefixes(data.sender).join('§r§7, ')}§r§7 ${Player.getNameColor(data.sender)}`;

            const received = orderVender('rankPrefix', data.sender);

            // ⭐ FINAL CHAT MESSAGE — NO TIME INCLUDED
            return Array.from(world.getPlayers()).forEach(plr => {
                plr.sendMessage(
                    `${received.length ? `${received.join('§r ')} ` : ''}${rank}§r§7: ${message}`
                );
            });
        }

        // Command handling
        const args = text.slice(quick.prefix.length).trim().split(/\s+/);
        const command = args.shift().toLowerCase();
        const cmd = Commands.list.find(c => c.name === command || (c.aliases && c.aliases.includes(command)));

        system.run(() => 
            Commands.run(cmd, Player.playerType(data.sender, { from: cmd?.name ?? 'ROT' }), args)
        );

    } catch (e) {
        console.warn(e + e.stack);
        data.cancel = false;
    }
});
