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
Website: https://www.rotmc.ml
Docs: https://doc.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you!
*/
import { events, venders } from "./@types/types";
import quick from "../quick.js";

export const listeners: [event: string, callback: Function][] = [];
export function addListener<m extends keyof events, k extends events[m]>(event: m, callback: (data: k) => void): void {
    listeners.push([event, callback]);
}

export const orders: [venders: string, callback: Function][] = [];
export function vender<m extends keyof venders, k extends venders[m]>(vender: m, callback: (value: k[1]) => k[0]): void {
    orders.push([vender, callback]);
}
export function orderVender<m extends keyof venders>(vender: m, parameters: venders[m][1]): [venders[m][0]] {
    const callbacks = orders.filter(o => o[0] === vender), values: any = [];
    for(let i = 0; i < callbacks.length; i++) {
        try {
            const value = callbacks[i][1](parameters);
            if(value) values.push(value);
        } catch (e) {
            console.warn(`One of the vendors "${vender}" had a error     ${e + e.stack}`);
        }
    }
    return values;
}