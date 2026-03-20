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
export const pokemontypes = {
    "Fire": {
        Null: ['none'],
        Not_Effective: ['fire', 'water', 'rock', 'dragon'],
        Effective: ['normal', 'electric', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'ghost', 'dark', 'fairy'],
        Super_Effective: ['grass', 'ice', 'bug', 'steel']
    },
    "Normal": {
        Null: ['ghost'],
        Not_Effective: ['rock', 'steel'],
        Effective: ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'dragon', 'dark', 'fairy'],
        Super_Effective: ['none']
    },
    "Water": {
        Null: ['none'],
        Not_Effective: ['water', 'grass', 'dragon'],
        Effective: ['normal', 'electric', 'ice', 'fighting', 'poison', 'flying', 'psychic', 'bug', 'ghost', 'dark', 'fairy', 'steel'],
        Super_Effective: ['fire', 'ground', 'rock']
    },
    "Electric": {
        Null: ['ground'],
        Not_Effective: ['electric', 'grass', 'dragon'],
        Effective: ['normal', 'fire', 'ice', 'fighting', 'poison', 'psychic', 'bug', 'rock', 'ghost', 'dark', 'steel', 'fairy'],
        Super_Effective: ['water', 'flying']
    },
    "Grass": {
        Null: ['none'],
        Not_Effective: ['fire', 'grass', 'poison', 'flying', 'bug', 'steel'],
        Effective: ['normal', 'electric', 'ice', 'fighting', 'psychic', 'bug', 'ghost', 'dark', 'fairy'],
        Super_Effective: ['water', 'ground', 'rock']
    },
    "Ice": {
        Null: ['none'],
        Not_Effective: ['fire', 'water', 'ice', 'steel'],
        Effective: ['normal', 'electric', 'fighting', 'poison', 'psychic', 'bug', 'rock', 'ghost', 'dark', 'fairy'],
        Super_Effective: ['grass', 'ground', 'flying', 'dragon']
    },
    "Fighting": {
        Null: ['ghost'],
        Not_Effective: ['poison', 'flying', 'psychic', 'bug', 'fairy'],
        Effective: ['fire', 'water', 'electric', 'grass', 'fighting', 'ground', 'dragon'],
        Super_Effective: ['normal', 'ice', 'rock', 'dark', 'steel'],
    },
    "Poison": {
        Null: ['Steel'],
        Not_Effective: ['poison', 'ground', 'rock', 'ghost'],
        Effective: ['normal', 'fire', 'water', 'electric', 'ice', 'fighting', 'flying', 'psychic', 'bug', 'dragon', 'dark',],
        Super_Effective: ['grass', 'fairy'],
    },
    "Ground": {
        Null: ['flying'],
        Not_Effective: ['grass', 'bug',],
        Effective: ['normal', 'water', 'ice', 'fighting', 'ground', 'psychic', 'ghost', 'dragon', 'dark', 'steel', 'fairy'],
        Super_Effective: ['fire', 'electric', 'poison', 'rock'],
    },
    "Flying": {
        Null: ['none'],
        Not_Effective: ['electric', 'rock', 'steel'],
        Effective: ['normal', 'fire', 'water', 'ice', 'poison', 'ground', 'flying', 'psychic', 'ghost', 'dragon', 'dark', 'fairy'],
        Super_Effective: ['grass', 'fighting', 'bug'],
    },
    "Psychic": {
        Null: ['dark'],
        Not_Effective: ['psychic', 'steel'],
        Effective: ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'ground', 'flying', 'bug', 'rock', 'ghost', 'dragon', 'fairy'],
        Super_Effective: ['fighting', 'poison'],
    },
    "Bug": {
        Null: ['none'],
        Not_Effective: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'],
        Effective: ['normal', 'water', 'electric', 'ice', 'ground', 'bug', 'rock', 'dragon'],
        Super_Effective: ['grass', 'psychic', 'dark'],
    },
    "Rock": {
        Null: ['none'],
        Not_Effective: ['fighting', 'ground', 'steel'],
        Effective: ['normal', 'water', 'electric', 'grass', 'poison', 'psychic', 'rock', 'ghost', 'dragon', 'dark', 'fairy'],
        Super_Effective: ['fire', 'ice', 'flying', 'bug'],
    },
    "Ghost": {
        Null: ['normal'],
        Not_Effective: ['dark'],
        Effective: ['flying', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'],
        Super_Effective: [ 'ghost'],
    },
    "Dragon": {
        Null: ['fairy'],
        Not_Effective: ['steel'],
        Effective: ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dark'],
        Super_Effective: ['dragon'],
    },
    "Dark": {
        Null: ['none'],
        Not_Effective: ['fighting', 'dark', 'fairy'],
        Effective: ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'poison', 'ground', 'flying', 'bug', 'rock', 'dragon', 'steel'],
        Super_Effective: ['psychic', 'ghost'],
    },
    "Steel": {
        Null: ['none'],
        Not_Effective: ['fire', 'water', 'steel'],
        Effective: ['normal', 'grass', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'ghost', 'dragon', 'electric', 'dark'],
        Super_Effective: ['ice', 'rock', 'fairy'],
    },
    "Fairy": {
        Null: ['none'],
        Not_Effective: ['fire', 'poison', 'steel'],
        Effective: ['normal', 'water', 'electric', 'grass', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'fairy', 'ice'],
        Super_Effective: ['fighting', 'dragon', 'dark'],
    }
};