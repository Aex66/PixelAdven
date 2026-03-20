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
Â© Copyright 2023 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Website: https://www.rotmc.ml
Thank you!
*/
import { StatusEffectsValues } from "../../../Letters/pokemon/moves.js";

type pokeballs = "empty" | "pokeball" | "greatball" | "ultraball" | "masterball" | "safariball" | "fastball" | "levelball" | "lureball" | "heavyball" | "loveball" | "friendball" | "moonball" | "netball" | "diveball" | "nestball" | "repeatball" | "timerball" | "luxuryball" | "premierball" | "duskball" | "healball" | "quickball" | "cherishball" | "parkball" | "dreamball" | "beastball"| "arkadiaball"

interface shortHand {
    level: any;
    IV_health: any;
    IV_attack: any;
    IV_defense: any;
    IV_special_attack: any;
    IV_special_defense: any;
    IV_speed: any;
    lv: number; // level
    Ex: number; // Experience
    NN: string; // Nickname
    SZ: number; // size

    M1pp: number,
    M2pp: number,
    M3pp: number,
    M4pp: number,

    M1: number,
    M2: number,
    M3: number,
    M4: number,

    HP: number; // Base_Health
    CH: number; // Current_Health
    SP: number; // Base_speed
    ATK: number; // Base_attack
    DEF: number; // Base_defense
    SPA: number; // Base_special_attack
    SPD: number; // Base_special_defense

    IVhp: number; // IV_health
    IVsp: number; // IV_speed
    IVatk: number; // IV_attack
    IVdef: number; // IV_defense
    IVspa: number; // IV_special_attack
    IVspd: number; // IV_special_defense

    EVhp: number; // EV_health
    EVsp: number; // EV_speed
    EVatk: number; // EV_attack
    EVdef: number; // EV_defense
    EVspa: number; // EV_special_attack
    EVspd: number; // EV_special_defense

    Na: number; // Nature
    DM: number; // DMax
    Vr: number; // Variant

    Tr: boolean; // Trade
    Ev: number; // Evolutions
    Bx: number; //Box
    St: number; //St
    Hi: number;
    Abl: number;

    fsl: number;

    ball: pokeballs
    Gdr: number;
    
    TER: number; // Terra
}

interface longHand {
    level: number; // lv
    Experience: number; //Ex
    
    Nickname: string; //NN
    Size: number; //SZ

    Move1: number,
    Move2: number,
    Move3: number,
    Move4: number,

    Move1_PP: number,
    Move2_PP: number,
    Move3_PP: number,
    Move4_PP: number,

    condition?: 0 | StatusEffectsValues 

    Type_1?: string;
    Type_2?: string;

    Base_Health: number; // HP
    Current_Health: number; // HP
    Base_speed: number; // SP
    Base_attack: number; // ATK
    Base_defense: number; // DEF
    Base_special_attack: number; // SPA
    Base_special_defense: number; // SPD

    IV_health: number;
    IV_speed: number;
    IV_attack: number;
    IV_defense: number;
    IV_special_attack: number;
    IV_special_defense: number;

    EV_health: number;
    EV_speed: number;
    EV_attack: number;
    EV_defense: number;
    EV_special_attack: number;
    EV_special_defense: number;

    Nature: [string, number]; // Na
    DMax: number; // DM
    Variant: number; // Vr

    Traded: boolean; //Tr

    Evolution_index: number;
    Gender: [string, number]; //Gdr
    Box: number; //Bx
    Slot: number; //St
    heldItem: number;
    Ability: [string, number];

    friendShipLevel: number;

    pokeBall: pokeballs
    
    Terra: [string, number]; //TER
}
