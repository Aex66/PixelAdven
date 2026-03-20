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
Docs: https://docServer.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Website: https://www.rotmc.ml
Thank you!
*/
import { world, Player as IPlayer, GameMode } from '@minecraft/server';
import { data, memoryReturn, OfflineType, PlayerType } from './@types/PlayerTypes.js';
import { connected, nameReg } from '../Tales/playerConnect.js';
import Database from './DatabasePaper.js';
import quick from '../quick.js';
import Commands from './CommandPaper/CommandPaper.js';
/*
 * Welcome to the PlayerPaper!
 * Main Developer: Mo9ses
 * Sub developer: Nobody!
 * Link to name: Player Paper
*/
class PlayerPaper {
    /**
     * Converts a normal Minecraft player to the ROT paper standard
     * @param {Player | string} player The player you want to transform
     * @param {playerData} data Additional paper data 
     * @returns {PlayerType} Don't get this confused with playertype
     */
    playerType(player: IPlayer | string, data?: data): PlayerType {
        const plr = player instanceof IPlayer ? player : world.getAllPlayers().find(p => p?.name.toLowerCase() === player?.toLowerCase());
        if(!plr || !connected.hasOwnProperty(plr.name)) return;
        let sound = true;
        if(data?.hasOwnProperty('sound')) sound = false;
        if(data?.from) data.from = data.from[0].toUpperCase() + data.from.slice(1);
        return Object.assign(player, {
            from: data?.from,
            isAdmin: this.isAdmin(plr),
            memory: this.memory(plr),
            rID: connected[plr.name].rID,
            send: (msg: string, frm?: string, sund?: boolean) => this.send(plr, msg, frm ?? data?.from ?? undefined, sund ?? sound),
            tip: (msg: string, frm?: string, sund?: boolean) => {
                if(sund ?? sound) plr.runCommand('playsound random.toast @s ~~~ 1 0.5');
                plr.sendMessage({'rawtext':[{'text':`§l§e${frm ? `${frm} ` : data?.from ? `${data.from} ` : ''}§aTIP §6>>§r§e `},{'text':msg}]}); //§r
            },
            error: (msg: string, frm?: string, sund?: boolean) => this.error(plr, msg, frm ?? data?.from ?? undefined, sund ?? sound),
            /**
            * getNickname Gets the nickname of a player
            * @example .getNickname();
            */
            getNickname: () => this.getNickname(plr),
            /**
            * getRanks Gets the ranks of a player
            * @example .getPrefixes();
            */
            getPrefixes: () => this.getPrefixes(plr),
            /**
            * Gets the name colors of a player
            * @example .getNameColors();
            */
            getNameColors: () => this.getNameColors(plr),
            /**
            * Gets the name color of a player
            * @example .getNameColor();
            */
            getNameColor: () => this.getNameColor(plr),
            /**
             * Get player's score on a specific objective
             * @param {string} obj Objective name you want to search
             * @example .getScore('Money');
             */
            getScore: (obj: string) => this.getScore(plr, obj),
            setScore: (obj: string, num: number) => this.setScore(plr, obj, num),
            hasTags: (tags: string[]) => {
                let all = true;
                tags.forEach(t => !plr.hasTag(t) && (all = false));
                return all;
            },
            veiwBlock: (getBlock?: boolean) => this.veiwBlock(plr, getBlock),
            veiwEntity: (getPos?: boolean) => {
                const l = plr.getEntitiesFromViewDirection({ maxDistance: 300 });
                return getPos ? [l[0].entity.location, l[0].entity.location.y, l[0].entity.location.z] : l;
            },
            toLocation: () => { return { x: plr.location.x, y: plr.location.y, z: plr.location.z } },
            asyncCommandPaper: async(text: string) => await this.asyncCommandPaper(plr, text)
        }) as PlayerType;
    }
    /**
     * Checks if the player is admin
     * @param {IPlayer} plr The player
     * @returns {boolean}
     */
    isAdmin(plr: IPlayer): boolean {
        return plr.hasTag(quick.adminTag);
    }
    memory(plr: IPlayer): memoryReturn {
        return {
            write: (key: string, value: any): any => connected[plr.name].memory[key] = value,
            read: (key: string): any => connected[plr.name].memory?.[key],
            has: (key: string): any => Boolean(connected[plr.name].memory?.[key]),
            release: (key: string): boolean => delete connected[plr.name].memory?.[key]
        }
    }
    send(plr: IPlayer, msg: string, frm?: string, sund?: boolean): void {
        if(sund) plr.runCommand('playsound random.toast @s ~~~ 1 0.5');
        plr.sendMessage({'rawtext':[{'text':`§l§6${frm ? `${frm} ` : ''}§6>>§r§e `},{'text':msg}]}); //§r
    }
    error(plr: IPlayer, msg: string, frm?: string, sund?: boolean): void {
        if(sund) plr.runCommand('playsound note.bass @s ~~~ 1 1');
        plr.sendMessage({'rawtext':[{'text':`§l§e${frm ? `${frm} ` : ''}§6Error >>§r§e `},{'text':msg}]}); //§r
    }
    getNickname(plr: IPlayer): string {
        const name = plr.getTags().find(tag => tag.startsWith('name:'))?.replace('name:', '')?.trim();
        if(!name?.length) return plr.name;
        if(nameReg.has(`$${name}`)) {
            console.warn('Found name');
            plr.removeTag(`name:${name}`);
            return plr.name;
        }
        return name;
    }
    getPrefixes(plr: IPlayer): string[] {
        const ranks = plr.getTags().filter(tag => tag.startsWith('rank:')).map(c => c.replace('rank:', '').trim());
        ranksDB.allKeys().forEach(k => plr.hasTag(ranksDB.read(k).tag) && ranks.push(ranksDB.read(k).prefix));
        return ranks.length ? ranks : this.isAdmin(plr) ? ['§n§lOperator'] : [quick.defaultRank];
    }
    getNameColors(plr: IPlayer): string[] {
        const colors = plr.getTags().filter(tag => tag.startsWith('color:')).map(c => c.replace('color:', '').trim());
        return colors.length ? colors : [quick.defaultNameColor];
    }
    getNameColor(plr: IPlayer, getNickname?: boolean): string {
        const colors = plr.getTags().filter(tag => tag.startsWith('color:')).map(c => c.replace('color:', '').trim());
        return `${(colors.length ? colors : [quick.defaultNameColor]).join('')}${getNickname ? this.getNickname(plr) : plr.name}`;
    }
    getChatColors(plr: IPlayer): string {
        const chat = plr.getTags().filter(tag => tag.startsWith('chat:')).map(c => c.replace('chat:', '').trim());
        return chat.length ? chat.join('') : quick.defaultChatColor;
    }
    getScore(plr: IPlayer, obj: string): number {
        try {
            const score = world.scoreboard.getObjective(obj)?.getScore(plr.scoreboardIdentity)
            return score ?? 0;
        } catch {
            return 0;
        }
    }
    setScore(plr: IPlayer, obj: string, num: number): boolean {
        try {
            plr.runCommand(`scoreboard players set @s "${obj}" ${num}`);
            return true;
        } catch (e) {
            console.warn(e);
            return false;
        }
    }
    getGamemode(player: IPlayer): keyof typeof GameMode {
        return Object.values(GameMode).find(m => Array.from(player.dimension.getEntities({ name: player.name, gameMode: m, type: 'minecraft:player' }))[0]);
    }
    getBy({ id, name }: { id?: string, name?: string }, typeData?: data): PlayerType {
        if(id) return this.playerType(world.getAllPlayers().find(p => String(Player.getScore(p, 'PLRid')) === id), typeData);
        if(name) return this.playerType(world.getAllPlayers().find(p => p?.name.toLowerCase() === name?.toLowerCase()), typeData);
    }
    veiwBlock(player: IPlayer, getBlock?: boolean) {
        const l = player.getBlockFromViewDirection({ includeLiquidBlocks: true, maxDistance: 300 }).block;
        return getBlock ? l : { x: l.location.x, y: l.location.y, z: l.location.z };
    }
    async asyncCommandPaper(player: IPlayer, text: string): Promise<void> {
        text = text.replace(/\s+/g, ' ').trim();
        if(text === '') return;
        if(!text.startsWith(quick.prefix)) try {
            return await player.runCommand(text) as unknown as void;
        } catch(e) { return; };
        const args = text.slice(quick.prefix.length).trim().split(/\s+/), command = args.shift().toLowerCase(), cmd = Commands.list.find(cmd => cmd.name === command || cmd.aliases && cmd.aliases.includes(command));
        Commands.run(cmd, Player.playerType(player, { from: cmd?.name ?? 'ROT' }), args);
    }
    isConnected(player: IPlayer): boolean {
        return connected.hasOwnProperty(player.name);
    }
    /**
     * Used to execute certain functions on players that might be offline or online
     * @param name The name of the player
     * @param from Where this will be used
     * @param player Additional information that can be used to try to find the player
     * @returns {OfflineType}
     */
    offlinePlayer(name: string, from?: string, player?: IPlayer | string | PlayerType): OfflineType {
        const plr = player instanceof String ? Array.from(world.getPlayers()).find(p => p.name.toLowerCase() === player?.toLowerCase() || p.name.toLowerCase() === name.toLowerCase()) : player as IPlayer;
        return {
            name: name,
            memory: this.memory(plr),
            player: this.playerType(player ?? name),
            rID: connected[name]?.rID,
            send: (msg: string, frm?: string) => {
                plr.runCommand('playsound random.toast @s ~~~ 1 0.5');
                plr.sendMessage({'rawtext':[{'text':`§l§6${frm ? `${frm} ` : from ? `${from} ` : ''}§6>>§r§e `},{'text':msg}]});
            },
            tip: (msg: string, frm?: string) => {
                plr.runCommand('playsound random.toast @s ~~~ 1 0.5');
                plr.sendMessage({'rawtext':[{'text':`§l§e${frm ? `${frm} ` : from ? `${from} ` : ''}§6TIP §a>>§r§e `},{'text':msg}]});
            },
            error: (msg: string, frm?: string) => {
                plr.runCommand('playsound random.glass @s ~~~ 1 0.5');
                plr.sendMessage({'rawtext':[{'text':`§l§e${frm ? `${frm} ` : from ? `${from} ` : ''}§6Error >>§r§e `},{'text':msg}]});
            },

        }
    }
}
const Player = new PlayerPaper();
export default Player;

let ranksDB: database;
(async function () {
    ranksDB = await Database.register('ranks');
})();