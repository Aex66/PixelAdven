
import quick from '../quick.js';

/*
 * Welcome to the Lang Paper!
 * Main Developer: Mo9ses
 * Notes: This file is ment to pull the IPs, gamertags, and realm codes of the people that use ROT.
 * Sub developer: NOBODY!
*/
const Lang = {} as lang;
export default Lang;


export const updateLang = () => Object.assign(Lang, {
    setup: {
        version: '§6ROT Version: §eV3 part 2, Light!§6, Min Engine: §e1.19.40§6\nAPI: §3ROT Light§6,\nBETA: §eYES§6, ROTJ: §eNO§e\nCoded and Designed By Mo9ses, Copyright 2023 all rights reserved.§r',
        loaded: (ms: number) => `ROT has been loaded in §6${ms}§e milliseconds!§r`,
        
    },
    cmd: {
        unknown: (prefix: string, admin: boolean) => `Unknown command! Make sure you have permission to use that command and make sure you spelt it correctly. Type "§6${prefix}help§e" in chat for a list of available commands${admin ? '' : `. "§7/tag @s add ${quick.adminTag}§e" will give you admin permissions.`}`,
        useForm: 'This command cannot be execute in chat. Use "§6!ui§e" to run it as a form command.§r',
        wrongPrefix: (prefix: string) => `Sorry, the prefix on this server is now "§6${prefix}§e"`,
        noArgs: 'This commands does not have any arguments! You only need to type the command.',
        notAArg: (prefix: string, cmd: string, before: string[], err: string, afther?: string, tip?: string) => `Not sure what you mean by "§6${prefix + cmd}§e${before.length ? ` ${before.join(' ')}` : ''}§r §g${err}§r§6${afther ? ` §g${afther}` : ''}§r§e".... §g${err[0].toUpperCase() + err.slice(1)}§r§e is not a vaild argument.${tip ? ` Maybe try typing §a${tip}§e?` : ''}`,
        noPerms: `You do not have permission to execute this command. "§7/tag @s add ${quick.adminTag}§e" will give you admin permissions.§r`,
        noArgPerm: 'You do not have permission to execute this argument. How do you even know about it?',
        missingArgs: (prefix: string, cmd: string, args: string[], tip?: string) => `The command you typed: "§6${prefix + cmd}${args.length ? ' ' + args.join(' ') : ''}§e" is missing arguments!${tip ? ` Maybe try typing §a${tip}§e at the end.` : ''} If you need more help, type "§6${prefix}help ${cmd}§e" in chat :)`,
        maxArgs: (error: string) => `You typed too many arguments! Try removing "§f${error}§r§e".`,
        needVal: (prefix: string, val: string) => `You need to type a name! If you need more help, type "§6${prefix}help ${val}§e" in chat.`,
        valErr: (prefix: string, val: string) => `The value you typed in is incorrect. If you need more help, type "§6${prefix}help ${val}§e" in chat.§r`,
        openQou: `It seems like you have open quotes somewhere. Maybe close them?`,
        missingPlr: (val: string) => `You need to type a player's name. Did you mean to type "§6${val}§e"?`,

    },
    chat: {
        mutted: 'Sorry, you have been muted by ROT or an admin',

    }

} as lang);