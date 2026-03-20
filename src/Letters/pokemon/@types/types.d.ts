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
import type { longHand } from "../../../Epics/Pokemon Database/@types/types.js";
import { MoveDamageTypeValues, StatusEffectsValues, StatusMoveTargetValues } from "../moves.js";

interface result extends longHand {
    recalculate: boolean
    type: string
}

declare namespace Pokemon {

    type property = 'Lvl' | 'IV_HP' | 'EV_HP' | 'Base_HP' | 'IV_Atk' | 'EV_Atk' | 'Base_Atk' | 'IV_Def' | 'EV_Def' | 'Base_Def' | 'IV_Sp_Atk' | 'EV_Sp_Atk' | 'Base_Sp_Atk' | 'IV_Sp_Def' | 'EV_Sp_Def' | 'Base_Sp_Def' | 'IV_Spd' | 'EV_Spd' | 'Base_Spd' | 'Catch_Rate' | 'Type_1' | 'Type_2' | 'DMax' | 'Terra' | 'Moves_Lvl_Up';

    type evolve = {
        conditional?: boolean
        avoidable?: boolean
        requires: {
            variant: any;
            Move1?: string; 
            Stats?: 'atk' | 'def' | 'equal', 
            level?: number, 
            gender?: number, 
            friendShipLevel?: number, 
            health: number | 'max', 
            trade?: boolean | string, 
            helditem?: number, 
            item?: string, 
            time?: 'day' | 'night'
        }
        result: result
    }


    type levelMoves = [name: string, level: number][];
interface wildPokemon {
    Lvl: [min: number, max: number];
    Growth: 'Fluctuating' | 'Slow' | 'Medium Slow' | 'Medium Fast' | 'Fast' | 'Erratic';
    Base_HP: number;
    Base_Atk?: number;
    Base_Def?: number;
    Base_Sp_Atk?: number;
    Base_Sp_Def?: number;
    Base_Spd?: number;
    Base_Exp: number;
    Friendship?: number;
    Base_EV: [name: string, level: number][];
    Catch_Rate?: number | null;
    Type_1: number;
    Type_2?: number;
    Type_3?: number;
    Type_4?: number;
    Type_5?: number;
    Type_6?: number;
    Type_7?: number;
    Type_8?: number;
    Gender?: [percentage: number, gender: string][];
    Abilities: { [key: string]: [string | null, string | null, string | null] };
    evolve?: Pokemon.evolve[];
    DMax?: [min: number, max: number];
    Terra?: [min: number, max: number];
    tm_moves?: {
        [variant: string]: string[];
    };
    Moves?: {
        [key: string]: levelMoves;
    };
}


    type moveCategory = 'Physical' | 'Special' | 'Status';

    interface StatChange {
        target: StatusMoveTargetValues;
        chance: number;
        stats: [objective: string, stages: number][];
    }

    interface StatusEffect {
        target: StatusMoveTargetValues;
        chance: number;
        effects: StatusEffectsValues[]
    }

    interface Move {
        critStage: number;
        pp: number;
        type: number;
        power: number;
        accuracy: number;
        moveType?: MoveDamageTypeValues
        target?: StatusMoveTargetValues
        effects: {
            stat_change: StatChange,
            status_effect: StatusEffect,
        }
        after_effects: {
            stat_change: StatChange,
            status_effect: StatusEffect,
        }
        priority?: boolean;
        multiHit?: boolean;
        category: moveCategory;
        image: string;
        id: number
        name: string
        special?: boolean
        drain?: number
    }
}