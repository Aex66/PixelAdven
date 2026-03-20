import { Pokemon } from "./@types/types";

const pokemoneNatures = {
    constants: {
        IV_HP: [0, 31],
        IV_Atk: [0, 31],
        IV_Def: [0, 31],
        IV_Sp_Atk: [0, 31],
        IV_Sp_Def: [0, 31],
        IV_Spd: [0, 31],
        EV_HP: [0, 1],
        EV_Atk: [0, 1],
        EV_Def: [0, 1],
        EV_Sp_Atk: [0, 1],
        EV_Sp_Def: [0, 1],
        EV_Spd: [0, 1]
    },
    values: [
        [['Base_Atk', 10], ['Base_Sp_Atk', -10], 'Adamant'], //Adamant 0
        [['Base_Atk', 10], ['Base_Spd', -10], 'Brave'], //Brave 1
        [['Base_Atk', 10], ['Base_Def', -10], 'Lonely'], //Lonely 2
        [['Base_Atk', 10], ['Base_Sp_Def', -10], 'Naughty'], //Naughty 3 
        [['Base_Def', 10], ['Base_Atk', -10], 'Bold'], //Bold 4
        [['Base_Def', 10], ['Base_Sp_Atk', -10], 'Impish'], //Impish 5
        [['Base_Def', 10], ['Base_Sp_Def', -10], 'Lax'], //Lax 6
        [['Base_Def', 10], ['Base_Spd', -10], 'Relaxed'], //Relaxed 7
        [['Base_Sp_Atk', 10], ['Base_Def', -10], 'Mild'], //Mild 8
        [['Base_Sp_Atk', 10], ['Base_Atk', -10], 'Modest'], //Modest 9
        [['Base_Sp_Atk', 10], ['Base_Spd', -10], 'Quiet'], //Quiet 10
        [['Base_Sp_Atk', 10], ['Base_Sp_Def', -10], 'Rash'], //Rash 11
        [['Base_Sp_Def', 10], ['Base_Atk', -10], 'Calm'], //Calm 12
        [['Base_Sp_Def', 10], ['Base_Sp_Atk', -10], 'Careful'], //Careful 13
        [['Base_Sp_Def', 10], ['Base_Def', -10], 'Gentle'], //Gentle 14
        [['Base_Sp_Def', 10], ['Base_Spd', -10], 'Sassy'], //Sassy 15
        [['Base_Spd', 10], ['Base_Def', -10], 'Hasty'], //Hasty 16
        [['Base_Spd', 10], ['Base_Sp_Atk', -10], 'Jolly'], //Jolly 17
        [['Base_Spd', 10], ['Base_Sp_Def', -10], 'Naive'], //Naive 18
        [['Base_Spd', 10], ['Base_Atk', -10], 'Timid'], //Timid 19
        [['Base_Sp_Atk', 10], ['Base_Sp_Atk', -10], 'Bashful'], //Bashful 20
        [['Base_Def', 10], ['Base_Def', -10], 'Docile'], //Docile 21
        [['Base_Atk', 10], ['Base_Atk', -10], 'Hardy'], //Hardy 22
        [['Base_Sp_Def', 10], ['Base_Sp_Def', -10], 'Quirky'], //Quirky 23
        [['Base_Spd', 10], ['Base_Spd', -10], 'Serious'], //Serious 24
    ]
} as {
    constants: {
        [key: string]: [min: number, max: number]
    },
    values: [stat: [stat: Pokemon.property, value: number], stat: [stat: Pokemon.property, value: number], name: string][]
};

export default pokemoneNatures;