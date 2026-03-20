export interface OutbreakSpeciesFamily {
    base: string;
    middle?: string;
    final?: string;
    weights?: [number, number, number]; // [base, mid, final] odds
}

export interface OutbreakZone {
    name: string;
    x: number;
    y: number;
    z: number;
    radius: number;
    dimension: string;
    families: OutbreakSpeciesFamily[];
}

export const outbreakZones: OutbreakZone[] = [
    {
        name: "Wind Swept Plains",
        x: 378, y: 8, z: -792, radius: 30, dimension: "overworld",
        families: [
            { base: "pokeworld:wild_starly", middle: "pokeworld:wild_staravia", final: "pokeworld:wild_staraptor", weights: [80, 15, 5] },
            { base: "pokeworld:wild_shinx", middle: "pokeworld:wild_luxio", final: "pokeworld:wild_luxray", weights: [80, 15, 5] },
            { base: "pokeworld:wild_bidoof", middle: "pokeworld:wild_bibarel", weights: [88, 12, 0] },
            { base: "pokeworld:wild_buizel", middle: "pokeworld:wild_floatzel", weights: [85, 15, 0] },
            { base: "pokeworld:wild_ponyta", final: "pokeworld:wild_rapidash", weights: [85, 0, 15] },
            { base: "pokeworld:wild_electrike", final: "pokeworld:wild_manectric", weights: [85, 0, 15] },
            { base: "pokeworld:wild_eevee", final: "pokeworld:wild_leafeon", weights: [90, 0, 10] },
            { base: "pokeworld:wild_ralts", middle: "pokeworld:wild_kirlia", final: "pokeworld:wild_gardevoir", weights: [70, 20, 10] },
            { base: "pokeworld:wild_ralts", middle: "pokeworld:wild_kirlia", final: "pokeworld:wild_gallade", weights: [70, 20, 10] },
            { base: "pokeworld:wild_sentret", final: "pokeworld:wild_furret", weights: [88, 12, 0] }
        ]
    },
    {
        name: "Seabreeze Coast",
        x: 904, y: 4, z: -1539, radius: 20, dimension: "overworld",
        families: [
            { base: "pokeworld:wild_magikarp", final: "pokeworld:wild_gyarados", weights: [92, 0, 8] },
            { base: "pokeworld:wild_shellos", final: "pokeworld:wild_gastrodon", weights: [88, 0, 12] },
            { base: "pokeworld:wild_tentacool", final: "pokeworld:wild_tentacruel", weights: [85, 0, 15] },
            { base: "pokeworld:wild_mantyke", final: "pokeworld:wild_mantine", weights: [90, 0, 10] },
            { base: "pokeworld:wild_wingull", final: "pokeworld:wild_pelipper", weights: [85, 0, 15] },
            { base: "pokeworld:wild_krabby", final: "pokeworld:wild_kingler", weights: [85, 0, 15] },
            { base: "pokeworld:wild_corphish", final: "pokeworld:wild_crawdaunt", weights: [87, 0, 13] },
            { base: "pokeworld:wild_luvdisc", weights: [100, 0, 0] }
        ]
    },
    {
        name: "Forgotten Souls Cemetery",
        x: 426, y: 19, z: 904, radius: 15, dimension: "overworld",
        families: [
            { base: "pokeworld:wild_paras", final: "pokeworld:wild_parasect", weights: [88, 0, 12] },
            { base: "pokeworld:wild_kricketot", final: "pokeworld:wild_kricketune", weights: [90, 0, 10] },
            { base: "pokeworld:wild_carnivine", weights: [100, 0, 0] },
            { base: "pokeworld:wild_wooper", final: "pokeworld:wild_quagsire", weights: [85, 0, 15] },
            { base: "pokeworld:wild_misdreavus", final: "pokeworld:wild_mismagius", weights: [85, 0, 15] },
            { base: "pokeworld:wild_duskull", middle: "pokeworld:wild_dusclops", final: "pokeworld:wild_dusknoir", weights: [75, 15, 10] },
            { base: "pokeworld:wild_gastly", middle: "pokeworld:wild_haunter", final: "pokeworld:wild_gengar", weights: [75, 15, 10] },
            { base: "pokeworld:wild_shuppet", final: "pokeworld:wild_banette", weights: [85, 0, 15] }
        ]
    },
    {
        name: "Glaciers Summit",
        x: -83, y: 75, z: 2240, radius: 30, dimension: "overworld",
        families: [
            { base: "pokeworld:wild_sneasel", final: "pokeworld:wild_weavile", weights: [88, 0, 12] },
            { base: "pokeworld:wild_snorunt", final: "pokeworld:wild_glalie", weights: [80, 0, 20] },
            { base: "pokeworld:wild_swinub", middle: "pokeworld:wild_piloswine", final: "pokeworld:wild_mamoswine", weights: [75, 20, 5] },
            { base: "pokeworld:wild_snover", final: "pokeworld:wild_abomasnow", weights: [85, 0, 15] },
            { base: "pokeworld:wild_spheal", middle: "pokeworld:wild_sealeo", final: "pokeworld:wild_walrein", weights: [78, 15, 7] },
            { base: "pokeworld:wild_seel", final: "pokeworld:wild_dewgong", weights: [90, 0, 10] },
            { base: "pokeworld:wild_delibird", weights: [100, 0, 0] }
        ]
    },
    {
        name: "Scorchstone Volcano",
        x: -1190, y: 26, z: -254, radius: 20, dimension: "overworld",
        families: [
            { base: "pokeworld:wild_slugma", final: "pokeworld:wild_magcargo", weights: [85, 0, 15] },
            { base: "pokeworld:wild_numel", final: "pokeworld:wild_camerupt", weights: [85, 0, 15] },
            { base: "pokeworld:wild_magby", final: "pokeworld:wild_magmar", weights: [90, 0, 10] },
            { base: "pokeworld:wild_growlithe", final: "pokeworld:wild_arcanine", weights: [80, 0, 20] },
            { base: "pokeworld:wild_torkoal", weights: [100, 0, 0] },
            { base: "pokeworld:wild_houndour", final: "pokeworld:wild_houndoom", weights: [85, 0, 15] },
            { base: "pokeworld:wild_charmander", middle: "pokeworld:wild_charmeleon", final: "pokeworld:wild_charizard", weights: [70, 20, 10] }
        ]
    },
    {
        name: "Sylvestra Jungle",
        x: -1047, y: 25, z: 1298, radius: 25, dimension: "overworld",
        families: [
            { base: "pokeworld:wild_paras", final: "pokeworld:wild_parasect", weights: [85, 0, 15] },
            { base: "pokeworld:wild_aipom", final: "pokeworld:wild_ambipom", weights: [88, 0, 12] },
            { base: "pokeworld:wild_oddish", final: "pokeworld:wild_vileplume", weights: [82, 8, 10] },
            { base: "pokeworld:wild_shroomish", final: "pokeworld:wild_breloom", weights: [90, 0, 10] },
            { base: "pokeworld:wild_venonat", final: "pokeworld:wild_venomoth", weights: [88, 0, 12] },
            { base: "pokeworld:wild_heracross", final: "pokeworld:wild_heracross", weights: [100, 0, 0] },
            { base: "pokeworld:wild_tropius", final: "pokeworld:wild_tropius", weights: [95, 0, 5] },
            { base: "pokeworld:wild_misdreavus", final: "pokeworld:wild_mismagius", weights: [90, 0, 10] }
        ]
    },
    {
        name: "Pride Rock",
        x: 1613, y: 9, z: 73, radius: 30, dimension: "overworld",
        families: [
            { base: "pokeworld:wild_doduo", final: "pokeworld:wild_dodrio", weights: [88, 0, 12] },
            { base: "pokeworld:wild_girafarig", final: "pokeworld:wild_girafarig", weights: [100, 0, 0] },
            { base: "pokeworld:wild_tauros", final: "pokeworld:wild_tauros", weights: [100, 0, 0] },
            { base: "pokeworld:wild_rhyhorn", middle: "pokeworld:wild_rhydon", final: "pokeworld:wild_rhyperior", weights: [80, 10, 10] },
            { base: "pokeworld:wild_miltank", final: "pokeworld:wild_miltank", weights: [100, 0, 0] },
            { base: "pokeworld:wild_scorupi", final: "pokeworld:wild_drapion", weights: [87, 0, 13] },
            { base: "pokeworld:wild_nidoran_m", middle: "pokeworld:wild_nidorino", final: "pokeworld:wild_nidoking", weights: [75, 15, 10] },
            { base: "pokeworld:wild_nidoran_f", middle: "pokeworld:wild_nidorina", final: "pokeworld:wild_nidoqueen", weights: [75, 15, 10] }
        ]
    },
    {
        name: "Boulderfall Dunes",
        x: 1320, y: 13, z: -480, radius: 45, dimension: "overworld",
        families: [
            { base: "pokeworld:wild_sandshrew", final: "pokeworld:wild_sandslash", weights: [85, 0, 15] },
            { base: "pokeworld:wild_trapinch", middle: "pokeworld:wild_vibrava", final: "pokeworld:wild_flygon", weights: [75, 15, 10] },
            { base: "pokeworld:wild_cacnea", final: "pokeworld:wild_cacturne", weights: [90, 0, 10] },
            { base: "pokeworld:wild_baltoy", final: "pokeworld:wild_claydol", weights: [85, 0, 15] },
            { base: "pokeworld:wild_hippopotas", final: "pokeworld:wild_hippowdon", weights: [90, 0, 10] },
            { base: "pokeworld:wild_gible", middle: "pokeworld:wild_gabite", final: "pokeworld:wild_garchomp", weights: [70, 20, 10] },
            { base: "pokeworld:wild_skorupi", final: "pokeworld:wild_drapion", weights: [87, 0, 13] },
            { base: "pokeworld:wild_numel", final: "pokeworld:wild_camerupt", weights: [85, 0, 15] }
        ]
    },
    {
        name: "Ironpeak Highlands",
        x: 17, y: 162, z: 706, radius: 20, dimension: "overworld",
        families: [
            { base: "pokeworld:wild_geodude", middle: "pokeworld:wild_graveler", final: "pokeworld:wild_golem", weights: [75, 15, 10] },
            { base: "pokeworld:wild_machop", middle: "pokeworld:wild_machoke", final: "pokeworld:wild_machamp", weights: [75, 15, 10] },
            { base: "pokeworld:wild_aron", middle: "pokeworld:wild_lairon", final: "pokeworld:wild_aggron", weights: [75, 15, 10] },
            { base: "pokeworld:wild_swablu", final: "pokeworld:wild_altaria", weights: [85, 0, 15] },
            { base: "pokeworld:wild_nosepass", final: "pokeworld:wild_probopass", weights: [90, 0, 10] },
            { base: "pokeworld:wild_gligar", final: "pokeworld:wild_gliscor", weights: [88, 0, 12] },
            { base: "pokeworld:wild_snorunt", final: "pokeworld:wild_glalie", weights: [85, 0, 15] }
        ]
    }
];
