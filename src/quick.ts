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
export const quick = {
    menuItem: 'pokeworld:pokedex',
    //ROT settings:
    prefix: '!',
    release: 5,
    displayChatTime: true,
    chatStyle: '$rank $player §f$msg§r',
    chatRanks: true,
    rankStyle: '',
    defaultRank: '§f',
    YourDiscord: 'https://discord.gg/pixeladvenbe',
    discord: 'https://discord.gg/2ADBWfcC6S',
    adminTag: 'v',
    hideAdminTag: false,
    rottleRewards: [
        //Example of commands: 'give "@rottler" diamond',
    ],
    rottleAttemps: 10,
    afkTime: 250,
    rateLimit: 2,
    defaultNameColor: '§e',
    defaultChatColor: '§f',
    displayHealth: false,
    bannedPlayers: {},
    dimNotAllowedLoc: { loc: { x: 10, y: -60, z: 10 }, dim: 'overworld' },
    maxHomes: 5,
    homeDims: ['minecraft:overworld', 'minecraft:the_end', 'minecraft:nether'],
    enchantmentList: ['aqua_affinity', 'bane_of_arthropods', 'binding', 'blast_protection', 'channeling', 'depth_strider', 'efficiency', 'feather_falling', 'fire_aspect', 'fire_protection', 'flame', 'fortune', 'frost_walker', 'impaling', 'infinity', 'knockback', 'looting', 'loyalty', 'luck_of_the_sea', 'lure', 'mending', 'multishot', 'piercing', 'power', 'projectile_protection', 'protection', 'punch', 'quick_charge', 'respiration', 'riptide', 'sharpness', 'silk_touch', 'smite', 'soul_speed', 'swift_sneak', 'thorns', 'unbreaking', 'vanishing'],
    toggle: {
        Server: {
            clearchat: true,
            members: true,
            tps: true,
        },
        Management: {
            ban: true,
            unban: true,
            tac: true,
            inventory: true,
            kicktags: true,
        },
        Structure: {
            leaderboard: true,
            text: true
        },
        Pokemon: {
            battle: true
        },
        ROT: {
            help: true //Please keep this command at the bottom
        }
    },
    epics: {
        "Pokemon Database": {
            enabled: true,
            entry: "main",
            scorebards: [],
            $uiVars: {
                0: 'Lvl: $lvl',
                1: '§dLvl: $lvl Shiny',
                2: 'Lvl: $lvl Alolan',
                3: '§dLvl: $lvl Aln-Shiny',
                4: 'Lvl: $lvl Galar',
                5: '§dLvl: $lvl Glr-Shiny',
                6: 'Lvl: $lvl Hisuian',
                7: '§dLvl: $lvl Hsn-Shiny',
                8: 'Lvl: $lvl Paldean',
                9: '§dLvl: $lvl Pdn-Shiny',
            }
        },
        "Pokemon Calculations": {
            enabled: true,
            entry: "main"
        },
        "Items": {
            enabled: true,
            entry: "main"
        },
        "Pokemon Battles": {
            enabled: true,
            entry: 'main',
            tag: 'battle',

        }
    },
    tales: [
        'beforeChat',
        'playerConnect'
    ],
    version: 'CHG'
} as const;
export default quick;