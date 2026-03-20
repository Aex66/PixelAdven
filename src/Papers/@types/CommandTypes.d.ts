
import { staticBook } from "../CommandPaper/argumentTypes.js";
import { data } from "./PlayerTypes.js";

interface registerInformation {
    name: string
    description?: string
    aliases?: string[]
    category: string
    admin?: boolean
    toggle?: boolean
    tags?: string[]
    developers?: string[]
    notes?: string
}
interface commandData extends registerInformation {
    sT: [string[], boolean] //Starting arguments and if they are required
    aR: { [key: string]: argumentData } //Arguments and argument data
    cB: Function //Callback
    rM: { cM: boolean, fM: boolean, tG: boolean } //Relay methods. CMD, FORM, TAGS
}

interface argumentData {
    tY: string //The type of argument
    cB: Function //The argument's callback
    nA: string[] //The argument(s) after the current one 
    nN: boolean //If the next argument is required
    tG?: string[] //Tags required for this argument to run
    tV?: any //The value of the type
}

interface numberData {
    min?: number, //The smallest possible number
    max?: number, //The biggest possible number
    float?: boolean //Allow decimals
}
interface timeData {
    min?: number, //The least amount of possible time
    max?: number //The longest possible time
}
declare interface playerData extends data {
    self: boolean //If the player can be their selfs?
}

declare interface argConfig {
    admin?: boolean
    tags?: string[]
    nextArgs?: string[]
    needNextArgs?: boolean
}

export type staticTypes = keyof typeof staticBook