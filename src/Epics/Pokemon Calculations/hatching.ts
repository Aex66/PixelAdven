import { EntityEquippableComponent, EquipmentSlot, ItemStack, Player, system, world } from "@minecraft/server"
import pokemonList from "../../Letters/pokemon/list"
import { writePokemon } from "../Pokemon Database/main";
import { selected } from "../Main/Forms/PC/main";
import { PokemonName, calculatePokemon, checkSidebarFree } from "./calculations";
import { ballTags } from "./catch";
import { longHand } from "../Pokemon Database/@types/types";
import { findNextFreePCSlotForPlayer } from "../Pokemon Database/PcControls";

function getIVPercent(p: longHand): number {
    const ivs = [
        p.IV_health,
        p.IV_attack,
        p.IV_defense,
        p.IV_special_attack,
        p.IV_special_defense,
        p.IV_speed
    ];

    const total = ivs.reduce((a, b) => a + b, 0);
    return Math.round((total / 186) * 100);
}

export const hatchingConfig: HatchingConfig = {
    "two_kilo": [
        // -=- Expanded Form Of Data -=-
        { pokeName: "Abra", variant: [0, 1] },
        { pokeName: "Aipom", variant: [0, 1] },
        { pokeName: "Aron", variant: [0, 1] },
        { pokeName: "Azurill", variant: [0, 1] },
        { pokeName: "Barboach", variant: [0, 1] },
        { pokeName: "Bellsprout", variant: [0, 1] },
        { pokeName: "Bergmite", variant: [0, 1] },
        { pokeName: "Bonsly", variant: [0, 1] },
        { pokeName: "Budew", variant: [0, 1] },
        { pokeName: "Buizel", variant: [0, 1] },
        { pokeName: "Bulbasaur", variant: [0, 1] },
        { pokeName: "Buneary", variant: [0, 1] },
        { pokeName: "Bunnelby", variant: [0, 1] },
        { pokeName: "Cacnea", variant: [0, 1] },
        { pokeName: "Caterpie", variant: [0, 1] },
        { pokeName: "Charmander", variant: [0, 1] },
        { pokeName: "Chikorita", variant: [0, 1] },
        { pokeName: "Chimchar", variant: [0, 1] },
        { pokeName: "Chinchou", variant: [0, 1] },
        { pokeName: "Clefairy", variant: [0, 1] },
        { pokeName: "Cleffa", variant: [0, 1] },
        { pokeName: "Cottonee", variant: [0, 1] },
        { pokeName: "Cubone", variant: [0, 1] },
        { pokeName: "Cyndaquil", variant: [0, 1] },
        { pokeName: "Diglett", variant: [0, 1] },
        { pokeName: "Drifloon", variant: [0, 1] },
        { pokeName: "Dunsparce", variant: [0, 1] },
        { pokeName: "Duskull", variant: [0, 1] },
        { pokeName: "Dwebble", variant: [0, 1] },
        { pokeName: "Elekid", variant: [0, 1] },
        { pokeName: "Exeggcute", variant: [0, 1] },
        { pokeName: "Fletchling", variant: [0, 1] },
        { pokeName: "Fomantis", variant: [0, 1] },
        { pokeName: "Gastly", variant: [0, 1] },
        { pokeName: "Geodude", variant: [0, 1] },
        { pokeName: "Gligar", variant: [0, 1] },
        { pokeName: "Goldeen", variant: [0, 1] },
        { pokeName: "Growlithe", variant: [0, 1] },
        { pokeName: "Gulpin", variant: [0, 1] },
        { pokeName: "Hoppip", variant: [0, 1] },
        { pokeName: "Igglybuff", variant: [0, 1] },
        { pokeName: "Illumise", variant: [0, 1] },
        { pokeName: "Jigglypuff", variant: [0, 1] },
        { pokeName: "Krabby", variant: [0, 1] },
        { pokeName: "Kricketot", variant: [0, 1] },
        { pokeName: "Larvesta", variant: [0, 1] },
        { pokeName: "Lechonk", variant: [0, 1] },
        { pokeName: "Lillipup", variant: [0, 1] },
        { pokeName: "Litleo", variant: [0, 1] },
        { pokeName: "Luvdisc", variant: [0, 1] },
        { pokeName: "Machop", variant: [0, 1] },
        { pokeName: "Magby", variant: [0, 1] },
        { pokeName: "Magikarp", variant: [0, 1] },
        { pokeName: "Makuhita", variant: [0, 1] },
        { pokeName: "Mantyke", variant: [0, 1] },
        { pokeName: "Mareep", variant: [0, 1] },
        { pokeName: "Meditite", variant: [0, 1] },
        { pokeName: "Minccino", variant: [0, 1] },
        { pokeName: "Misdreavus", variant: [0, 1] },
        { pokeName: "Mudkip", variant: [0, 1] },
        { pokeName: "Munna", variant: [0, 1] },
        { pokeName: "Murkrow", variant: [0, 1] },
        { pokeName: "Nidoran_F", variant: [0, 1] },
        { pokeName: "Nidoran_M", variant: [0, 1] },
        { pokeName: "Oddish", variant: [0, 1] },
        { pokeName: "Oshawott", variant: [0, 1] },
        { pokeName: "Patrat", variant: [0, 1] },
        { pokeName: "Pichu", variant: [0, 1] },
        { pokeName: "Pidgey", variant: [0, 1] },
        { pokeName: "Pidove", variant: [0, 1] },
        { pokeName: "Pikachu", variant: [0, 1] },
        { pokeName: "Pikipek", variant: [0, 1] },
        { pokeName: "Piplup", variant: [0, 1] },
        { pokeName: "Poliwag", variant: [0, 1] },
        { pokeName: "Poochyena", variant: [0, 1] },
        { pokeName: "Porygon", variant: [0, 1] },
        { pokeName: "Purrloin", variant: [0, 1] },
        { pokeName: "Rattata", variant: [0, 1] },
        { pokeName: "Remoraid", variant: [0, 1] },
        { pokeName: "Rhyhorn", variant: [0, 1] },
        { pokeName: "Seedot", variant: [0, 1] },
        { pokeName: "Shellder", variant: [0, 1] },
        { pokeName: "Slowpoke", variant: [0, 1] },
        { pokeName: "Slugma", variant: [0, 1] },
        { pokeName: "Smoliv", variant: [0, 1] },
        { pokeName: "Smoochum", variant: [0, 1] },
        { pokeName: "Sneasel", variant: [0, 1] },
        { pokeName: "Snivy", variant: [0, 1] },
        { pokeName: "Snubbull", variant: [0, 1] },
        { pokeName: "Spearow", variant: [0, 1] },
        { pokeName: "Spheal", variant: [0, 1] },
        { pokeName: "Spinarak", variant: [0, 1] },
        { pokeName: "Spoink", variant: [0, 1] },
        { pokeName: "Spritzee", variant: [0, 1] },
        { pokeName: "Squirtle", variant: [0, 1] },
        { pokeName: "Starly", variant: [0, 1] },
        { pokeName: "Staryu", variant: [0, 1] },
        { pokeName: "Stufful", variant: [0, 1] },
        { pokeName: "Swablu", variant: [0, 1] },
        { pokeName: "Swinub", variant: [0, 1] },
        { pokeName: "Swirlix", variant: [0, 1] },
        { pokeName: "Tepig", variant: [0, 1] },
        { pokeName: "Togepi", variant: [0, 1] },
        { pokeName: "Torchic", variant: [0, 1] },
        { pokeName: "Totodile", variant: [0, 1] },
        { pokeName: "Trapinch", variant: [0, 1] },
        { pokeName: "Treecko", variant: [0, 1] },
        { pokeName: "Turtwig", variant: [0, 1] },
        { pokeName: "Tyrogue", variant: [0, 1] },
        { pokeName: "Venipede", variant: [0, 1] },
        { pokeName: "Venonat", variant: [0, 1] },
        { pokeName: "Volbeat", variant: [0, 1] },
        { pokeName: "Wailmer", variant: [0, 1] },
        { pokeName: "Weedle", variant: [0, 1] },
        { pokeName: "Whismur", variant: [0, 1] },
        { pokeName: "Wimpod", variant: [0, 1] },
        { pokeName: "Wingull", variant: [0, 1] },
        { pokeName: "Woobat", variant: [0, 1] },
        { pokeName: "Wooper", variant: [0, 1] },
        { pokeName: "Wurmple", variant: [0, 1] },
        { pokeName: "Yungoos", variant: [0, 1] },
        { pokeName: "Zigzagoon", variant: [0, 1] },
        { pokeName: "Zubat", variant: [0, 1] }
    ],
    "five_kilo": [
        // -=- Expanded Form Of Data -=-
        { pokeName: "Abra", variant: [0, 1] },
        { pokeName: "Anorith", variant: [0, 1] },
        { pokeName: "Aron", variant: [0, 1] },
        { pokeName: "Azurill", variant: [0, 1] },
        { pokeName: "Baltoy", variant: [0, 1] },
        { pokeName: "Bellsprout", variant: [0, 1] },
        { pokeName: "Blitzle", variant: [0, 1] },
        { pokeName: "Bonsly", variant: [0, 1] },
        { pokeName: "Bouffalant", variant: [0, 1] },
        { pokeName: "Bronzor", variant: [0, 1] },
        { pokeName: "Budew", variant: [0, 1] },
        { pokeName: "Buizel", variant: [0, 1] },
        { pokeName: "Bulbasaur", variant: [0, 1] },
        { pokeName: "Buneary", variant: [0, 1] },
        { pokeName: "Burmy", variant: [0, 1] },
        { pokeName: "Cacnea", variant: [0, 1] },
        { pokeName: "Carnivine", variant: [0, 1] },
        { pokeName: "Carvanha", variant: [0, 1] },
        { pokeName: "Charmander", variant: [0, 1] },
        { pokeName: "Chatot", variant: [0, 1] },
        { pokeName: "Cherubi", variant: [0, 1] },
        { pokeName: "Chespin", variant: [0, 1] },
        { pokeName: "Chikorita", variant: [0, 1] },
        { pokeName: "Chimchar", variant: [0, 1] },
        { pokeName: "Chinchou", variant: [0, 1] },
        { pokeName: "Chingling", variant: [0, 1] },
        { pokeName: "Clamperl", variant: [0, 1] },
        { pokeName: "Combee", variant: [0, 1] },
        { pokeName: "Corphish", variant: [0, 1] },
        { pokeName: "Corsola", variant: [0, 1] },
        { pokeName: "Cottonee", variant: [0, 1] },
        { pokeName: "Croagunk", variant: [0, 1] },
        { pokeName: "Cubone", variant: [0, 1] },
        { pokeName: "Cyndaquil", variant: [0, 1] },
        { pokeName: "Diglett", variant: [0, 1] },
        { pokeName: "Doduo", variant: [0, 1] },
        { pokeName: "Drifloon", variant: [0, 1] },
        { pokeName: "Drilbur", variant: [0, 1] },
        { pokeName: "Drowzee", variant: [0, 1] },
        { pokeName: "Ducklett", variant: [0, 1] },
        { pokeName: "Dunsparce", variant: [0, 1] },
        { pokeName: "Durant", variant: [0, 1] },
        { pokeName: "Duskull", variant: [0, 1] },
        { pokeName: "Eevee", variant: [0, 1] },
        { pokeName: "Ekans", variant: [0, 1] },
        { pokeName: "Electrike", variant: [0, 1] },
        { pokeName: "Elekid", variant: [0, 1] },
        { pokeName: "Emolga", variant: [0, 1] },
        { pokeName: "Exeggcute", variant: [0, 1] },
        { pokeName: "Farfetch'd", variant: [0, 1] },
        { pokeName: "Feebas", variant: [0, 1] },
        { pokeName: "Fennekin", variant: [0, 1] },
        { pokeName: "Finneon", variant: [0, 1] },
        { pokeName: "Foongus", variant: [0, 1] },
        { pokeName: "Froakie", variant: [0, 1] },
        { pokeName: "Fuecoco", variant: [0, 1] },
        { pokeName: "Gastly", variant: [0, 1] },
        { pokeName: "Girafarig", variant: [0, 1] },
        { pokeName: "Glameow", variant: [0, 1] },
        { pokeName: "Gligar", variant: [0, 1] },
        { pokeName: "Goldeen", variant: [0, 1] },
        { pokeName: "Gothita", variant: [0, 1] },
        { pokeName: "Grimer", variant: [0, 1] },
        { pokeName: "Growlithe", variant: [0, 1] },
        { pokeName: "Happiny", variant: [0, 1] },
        { pokeName: "Heatmor", variant: [0, 1] },
        { pokeName: "Heracross", variant: [0, 1] },
        { pokeName: "Hippopotas", variant: [0, 1] },
        { pokeName: "Hoppip", variant: [0, 1] },
        { pokeName: "Horsea", variant: [0, 1] },
        { pokeName: "Houndour", variant: [0, 1] },
        { pokeName: "Illumise", variant: [0, 1] },
        { pokeName: "Joltik", variant: [0, 1] },
        { pokeName: "Kabuto", variant: [0, 1] },
        { pokeName: "Kangaskhan", variant: [0, 1] },
        { pokeName: "Karrablast", variant: [0, 1] },
        { pokeName: "Koffing", variant: [0, 1] },
        { pokeName: "Krabby", variant: [0, 1] },
        { pokeName: "Larvesta", variant: [0, 1] },
        { pokeName: "Lickitung", variant: [0, 1] },
        { pokeName: "Lileep", variant: [0, 1] },
        { pokeName: "Litten", variant: [0, 1] },
        { pokeName: "Lotad", variant: [0, 1] },
        { pokeName: "Lunatone", variant: [0, 1] },
        { pokeName: "Machop", variant: [0, 1] },
        { pokeName: "Magby", variant: [0, 1] },
        { pokeName: "Magnemite", variant: [0, 1] },
        { pokeName: "Makuhita", variant: [0, 1] },
        { pokeName: "Mankey", variant: [0, 1] },
        { pokeName: "Mantine", variant: [0, 1] },
        { pokeName: "Mantyke", variant: [0, 1] },
        { pokeName: "Maractus", variant: [0, 1] },
        { pokeName: "Mareanie", variant: [0, 1] },
        { pokeName: "Mareep", variant: [0, 1] },
        { pokeName: "Marill", variant: [0, 1] },
        { pokeName: "Meowth", variant: [0, 1] },
        { pokeName: "Miltank", variant: [0, 1] },
        { pokeName: "Mime Jr.", variant: [0, 1] },
        { pokeName: "Minccino", variant: [0, 1] },
        { pokeName: "Mudkip", variant: [0, 1] },
        { pokeName: "Munchlax", variant: [0, 1] },
        { pokeName: "Natu", variant: [0, 1] },
        { pokeName: "Nidoran_F", variant: [0, 1] },
        { pokeName: "Nidoran_F", variant: [0, 1] },
        { pokeName: "Nosepass", variant: [0, 1] },
        { pokeName: "Numel", variant: [0, 1] },
        { pokeName: "Oddish", variant: [0, 1] },
        { pokeName: "Omanyte", variant: [0, 1] },
        { pokeName: "Onix", variant: [0, 1] },
        { pokeName: "Oshawott", variant: [0, 1] },
        { pokeName: "Pachirisu", variant: [0, 1] },
        { pokeName: "Panpour", variant: [0, 1] },
        { pokeName: "Pansage", variant: [0, 1] },
        { pokeName: "Pansear", variant: [0, 1] },
        { pokeName: "Paras", variant: [0, 1] },
        { pokeName: "Pawmi", variant: [0, 1] },
        { pokeName: "Petilil", variant: [0, 1] },
        { pokeName: "Phanpy", variant: [0, 1] },
        { pokeName: "Pichu", variant: [0, 1] },
        { pokeName: "Pineco", variant: [0, 1] },
        { pokeName: "Pinsir", variant: [0, 1] },
        { pokeName: "Piplup", variant: [0, 1] },
        { pokeName: "Poliwag", variant: [0, 1] },
        { pokeName: "Ponyta", variant: [0, 1] },
        { pokeName: "Popplio", variant: [0, 1] },
        { pokeName: "Porygon", variant: [0, 1] },
        { pokeName: "Psyduck", variant: [0, 1] },
        { pokeName: "Quaxly", variant: [0, 1] },
        { pokeName: "Qwilfish", variant: [0, 1] },
        { pokeName: "Ralts", variant: [0, 1] },
        { pokeName: "Relicanth", variant: [0, 1] },
        { pokeName: "Rhyhorn", variant: [0, 1] },
        { pokeName: "Roggenrola", variant: [0, 1] },
        { pokeName: "Rowlet", variant: [0, 1] },
        { pokeName: "Sableye", variant: [0, 1] },
        { pokeName: "Sandshrew", variant: [0, 1] },
        { pokeName: "Scyther", variant: [0, 1] },
        { pokeName: "Seel", variant: [0, 1] },
        { pokeName: "Seviper", variant: [0, 1] },
        { pokeName: "Sewaddle", variant: [0, 1] },
        { pokeName: "Shellder", variant: [0, 1] },
        { pokeName: "Shelmet", variant: [0, 1] },
        { pokeName: "Shroomish", variant: [0, 1] },
        { pokeName: "Shuckle", variant: [0, 1] },
        { pokeName: "Shuppet", variant: [0, 1] },
        { pokeName: "Skarmory", variant: [0, 1] },
        { pokeName: "Skitty", variant: [0, 1] },
        { pokeName: "Skorupi", variant: [0, 1] },
        { pokeName: "Slowpoke", variant: [0, 1] },
        { pokeName: "Smoochum", variant: [0, 1] },
        { pokeName: "Sneasel", variant: [0, 1] },
        { pokeName: "Snivy", variant: [0, 1] },
        { pokeName: "Snorunt", variant: [0, 1] },
        { pokeName: "Snover", variant: [0, 1] },
        { pokeName: "Snubbull", variant: [0, 1] },
        { pokeName: "Solosis", variant: [0, 1] },
        { pokeName: "Solrock", variant: [0, 1] },
        { pokeName: "Sprigatito", variant: [0, 1] },
        { pokeName: "Squirtle", variant: [0, 1] },
        { pokeName: "Stantler", variant: [0, 1] },
        { pokeName: "Staryu", variant: [0, 1] },
        { pokeName: "Stunky", variant: [0, 1] },
        { pokeName: "Swinub", variant: [0, 1] },
        { pokeName: "Taillow", variant: [0, 1] },
        { pokeName: "Tangela", variant: [0, 1] },
        { pokeName: "Tauros", variant: [0, 1] },
        { pokeName: "Teddiursa", variant: [0, 1] },
        { pokeName: "Tentacool", variant: [0, 1] },
        { pokeName: "Tepig", variant: [0, 1] },
        { pokeName: "Togepi", variant: [0, 1] },
        { pokeName: "Torchic", variant: [0, 1] },
        { pokeName: "Torkoal", variant: [0, 1] },
        { pokeName: "Totodile", variant: [0, 1] },
        { pokeName: "Trapinch", variant: [0, 1] },
        { pokeName: "Treecko", variant: [0, 1] },
        { pokeName: "Tropius", variant: [0, 1] },
        { pokeName: "Trubbish", variant: [0, 1] },
        { pokeName: "Turtwig", variant: [0, 1] },
        { pokeName: "Tympole", variant: [0, 1] },
        { pokeName: "Tyrogue", variant: [0, 1] },
        { pokeName: "Venonat", variant: [0, 1] },
        { pokeName: "Volbeat", variant: [0, 1] },
        { pokeName: "Voltorb", variant: [0, 1] },
        { pokeName: "Vulpix", variant: [0, 1] },
        { pokeName: "Wingull", variant: [0, 1] },
        { pokeName: "Wobbuffet", variant: [0, 1] },
        { pokeName: "Wooper", variant: [0, 1] },
        { pokeName: "Wynaut", variant: [0, 1] },
        { pokeName: "Yamask", variant: [0, 1] },
        { pokeName: "Yanma", variant: [0, 1] },
        { pokeName: "Zangoose", variant: [0, 1] }],
    "seven_kilo": [
        // -=- Expanded Form Of Data -=-
        { pokeName: "Absol", variant: [0, 1] },
        { pokeName: "Aerodactyl", variant: [0, 1] },
        { pokeName: "Anorith", variant: [0, 1] },
        { pokeName: "Archen", variant: [0, 1] },
        { pokeName: "Azurill", variant: [0, 1] },
        { pokeName: "Beldum", variant: [0, 1] },
        { pokeName: "Bonsly", variant: [0, 1] },
        { pokeName: "Budew", variant: [0, 1] },
        { pokeName: "Chansey", variant: [0, 1] },
        { pokeName: "Chingling", variant: [0, 1] },
        { pokeName: "Cleffa", variant: [0, 1] },
        { pokeName: "Cranidos", variant: [0, 1] },
        { pokeName: "Darumaka", variant: [0, 1] },
        { pokeName: "Darumaka", variant: [4, 5] },
        { pokeName: "Diglett", variant: [2, 3] },
        { pokeName: "Elekid", variant: [0, 1] },
        { pokeName: "Farfetch'd", variant: [0, 1] },
        { pokeName: "Farfetch'd", variant: [4, 5] },
        { pokeName: "Feebas", variant: [0, 1] },
        { pokeName: "Geodude", variant: [2, 3] },
        { pokeName: "Grimer", variant: [2, 3] },
        { pokeName: "Happiny", variant: [0, 1] },
        { pokeName: "Igglybuff", variant: [0, 1] },
        { pokeName: "Kabuto", variant: [0, 1] },
        { pokeName: "Kangaskhan", variant: [0, 1] },
        { pokeName: "Lapras", variant: [0, 1] },
        { pokeName: "Lileep", variant: [0, 1] },
        { pokeName: "Magby", variant: [0, 1] },
        { pokeName: "Mantyke", variant: [0, 1] },
        { pokeName: "Mawile", variant: [0, 1] },
        { pokeName: "Meowth", variant: [0, 1] },
        { pokeName: "Meowth", variant: [2, 3] },
        { pokeName: "Meowth", variant: [4, 5] },
        { pokeName: "Mr. Mime", variant: [0, 1] },
        { pokeName: "Munchlax", variant: [0, 1] },
        { pokeName: "Nincada", variant: [0, 1] },
        { pokeName: "Nosepass", variant: [0, 1] },
        { pokeName: "Omanyte", variant: [0, 1] },
        { pokeName: "Pichu", variant: [0, 1] },
        { pokeName: "Riolu", variant: [0, 1] },
        { pokeName: "Sandshrew", variant: [2, 3] },
        { pokeName: "Shieldon", variant: [0, 1] },
        { pokeName: "Smoochum", variant: [0, 1] },
        { pokeName: "Stunfisk", variant: [0, 1] },
        { pokeName: "Stunfisk", variant: [4, 5] },
        { pokeName: "Tauros", variant: [0, 1] },
        { pokeName: "Tirtouga", variant: [0, 1] },
        { pokeName: "Togepi", variant: [0, 1] },
        { pokeName: "Tyrogue", variant: [0, 1] },
        { pokeName: "Vulpix", variant: [2, 3] },
        { pokeName: "Wynaut", variant: [0, 1] },
        { pokeName: "Zigzagoon", variant: [0, 1] },
        { pokeName: "Zigzagoon", variant: [4, 5] }],
    "ten_kilo": [
        // -=- Expanded Form Of Data -=-
        { pokeName: "Absol", variant: [0, 1] },
        { pokeName: "Aerodactyl", variant: [0, 1] },
        { pokeName: "Alomomola", variant: [0, 1] },
        { pokeName: "Amaura", variant: [0, 1] },
        { pokeName: "Archen", variant: [0, 1] },
        { pokeName: "Audino", variant: [0, 1] },
        { pokeName: "Axew", variant: [0, 1] },
        { pokeName: "Bagon", variant: [0, 1] },
        { pokeName: "Beldum", variant: [0, 1] },
        { pokeName: "Carbink", variant: [0, 1] },
        { pokeName: "Chansey", variant: [0, 1] },
        { pokeName: "Chimecho", variant: [0, 1] },
        { pokeName: "Chinchou", variant: [0, 1] },
        { pokeName: "Chingling", variant: [0, 1] },
        { pokeName: "Cranidos", variant: [0, 1] },
        { pokeName: "Darumaka", variant: [0, 1] },
        { pokeName: "Dedenne", variant: [0, 1] },
        { pokeName: "Deino", variant: [0, 1] },
        { pokeName: "Dratini", variant: [0, 1] },
        { pokeName: "Drifloon", variant: [0, 1] },
        { pokeName: "Eevee", variant: [0, 1] },
        { pokeName: "Electabuzz", variant: [0, 1] },
        { pokeName: "Elekid", variant: [0, 1] },
        { pokeName: "Elgyem", variant: [0, 1] },
        { pokeName: "Emolga", variant: [0, 1] },
        { pokeName: "Espurr", variant: [0, 1] },
        { pokeName: "Feebas", variant: [0, 1] },
        { pokeName: "Ferroseed", variant: [0, 1] },
        { pokeName: "Frigibax", variant: [0, 1] },
        { pokeName: "Gible", variant: [0, 1] },
        { pokeName: "Gligar", variant: [0, 1] },
        { pokeName: "Golett", variant: [0, 1] },
        { pokeName: "Goomy", variant: [0, 1] },
        { pokeName: "Happiny", variant: [0, 1] },
        { pokeName: "Hitmonchan", variant: [0, 1] },
        { pokeName: "Hitmonlee", variant: [0, 1] },
        { pokeName: "Jangmo-o", variant: [0, 1] },
        { pokeName: "Jynx", variant: [0, 1] },
        { pokeName: "Kabuto", variant: [0, 1] },
        { pokeName: "Klink", variant: [0, 1] },
        { pokeName: "Lapras", variant: [0, 1] },
        { pokeName: "Larvesta", variant: [0, 1] },
        { pokeName: "Larvitar", variant: [0, 1] },
        { pokeName: "Litwick", variant: [0, 1] },
        { pokeName: "Magby", variant: [0, 1] },
        { pokeName: "Magmar", variant: [0, 1] },
        { pokeName: "Mantine", variant: [0, 1] },
        { pokeName: "Mareep", variant: [0, 1] },
        { pokeName: "Mawile", variant: [0, 1] },
        { pokeName: "Mienfoo", variant: [0, 1] },
        { pokeName: "Miltank", variant: [0, 1] },
        { pokeName: "Mr. Mime", variant: [0, 1] },
        { pokeName: "Munchlax", variant: [0, 1] },
        { pokeName: "Nincada", variant: [0, 1] },
        { pokeName: "Noibat", variant: [0, 1] },
        { pokeName: "Omanyte", variant: [0, 1] },
        { pokeName: "Onix", variant: [0, 1] },
        { pokeName: "Pineco", variant: [0, 1] },
        { pokeName: "Pinsir", variant: [0, 1] },
        { pokeName: "Porygon", variant: [0, 1] },
        { pokeName: "Ralts", variant: [0, 1] },
        { pokeName: "Riolu", variant: [0, 1] },
        { pokeName: "Rockruff", variant: [0, 1] },
        { pokeName: "Rufflet", variant: [0, 1] },
        { pokeName: "Sableye", variant: [0, 1] },
        { pokeName: "Sawk", variant: [0, 1] },
        { pokeName: "Scyther", variant: [0, 1] },
        { pokeName: "Shieldon", variant: [0, 1] },
        { pokeName: "Shinx", variant: [0, 1] },
        { pokeName: "Sigilyph", variant: [0, 1] },
        { pokeName: "Skarmory", variant: [0, 1] },
        { pokeName: "Skorupi", variant: [0, 1] },
        { pokeName: "Slakoth", variant: [0, 1] },
        { pokeName: "Smoochum", variant: [0, 1] },
        { pokeName: "Snorlax", variant: [0, 1] },
        { pokeName: "Sudowoodo", variant: [0, 1] },
        { pokeName: "Throh", variant: [0, 1] },
        { pokeName: "Timburr", variant: [0, 1] },
        { pokeName: "Tirtouga", variant: [0, 1] },
        { pokeName: "Togedemaru", variant: [0, 1] },
        { pokeName: "Trapinch", variant: [0, 1] },
        { pokeName: "Tyrunt", variant: [0, 1] },
        { pokeName: "Unown", variant: [0, 1] }]
}

interface PokeData {
    pokeName: PokemonName;
    variant: [min: number, max: number];
}

interface HatchingConfig {
    "two_kilo": PokeData[];
    "five_kilo": PokeData[];
    "seven_kilo": PokeData[];
    "ten_kilo": PokeData[];
}

// Map egg types → item IDs
const EGG_META: Record<"two_kilo" | "five_kilo" | "seven_kilo" | "ten_kilo", { id: string }> = {
    "two_kilo": { id: "pokeworld:two_kilo_egg" },
    "five_kilo": { id: "pokeworld:five_kilo_egg" },
    "seven_kilo": { id: "pokeworld:seven_kilo_egg" },
    "ten_kilo": { id: "pokeworld:ten_kilo_egg" },
};

// --- Make sure only ONE egg sits in offhand ---
function enforceSingleOffhandEgg(player: Player, eggType: "two_kilo" | "five_kilo" | "seven_kilo" | "ten_kilo") {
    const eq = player.getComponent("equippable") as EntityEquippableComponent | undefined;
    if (!eq) return;

    const eggId = EGG_META[eggType].id;
    const off = eq.getEquipment(EquipmentSlot.Offhand);

    if (off && off.typeId === eggId && off.amount > 1) {
        const extras = off.amount - 1;
        off.amount = 1;
        eq.setEquipment(EquipmentSlot.Offhand, off);

        // Try to move extras into inventory
        const inv = player.getComponent("minecraft:inventory")?.container;
        if (inv) {
            let leftover = extras;
            for (let i = 0; i < inv.size && leftover > 0; i++) {
                const slot = inv.getItem(i);
                if (!slot) {
                    inv.setItem(i, new ItemStack(eggId, leftover));
                    leftover = 0;
                } else if (slot.typeId === eggId && slot.amount < slot.maxAmount) {
                    const canAdd = Math.min(slot.maxAmount - slot.amount, leftover);
                    slot.amount += canAdd;
                    inv.setItem(i, slot);
                    leftover -= canAdd;
                }
            }
            // Try safe insert (never drops items)
            const remaining = safeInsertIntoInventory(player, eggId, leftover);
            if (remaining > 0) {
                // If inventory full, simply restore them into offhand as a stack the player can't use
                const eq = player.getComponent("equippable") as EntityEquippableComponent;
                eq.setEquipment(EquipmentSlot.Offhand, new ItemStack(eggId, 1 + remaining));
            }
        }
    }
}

function safeInsertIntoInventory(player: Player, itemId: string, amount: number) {
    const inv = player.getComponent("minecraft:inventory")?.container;
    if (!inv) return amount;

    let leftover = amount;

    // Fill existing stacks
    for (let i = 0; i < inv.size && leftover > 0; i++) {
        const slot = inv.getItem(i);
        if (slot && slot.typeId === itemId && slot.amount < slot.maxAmount) {
            const add = Math.min(slot.maxAmount - slot.amount, leftover);
            slot.amount += add;
            inv.setItem(i, slot);
            leftover -= add;
        }
    }

    // Fill empty slots
    for (let i = 0; i < inv.size && leftover > 0; i++) {
        const slot = inv.getItem(i);
        if (!slot) {
            const add = Math.min(64, leftover);
            inv.setItem(i, new ItemStack(itemId, add));
            leftover -= add;
        }
    }

    // leftover returned (but NOT dropped)
    return leftover;
}

// --- Remove one egg from offhand (after enforcing) ---
function removeOneEggFromOffhand(player: Player, eggType: "two_kilo" | "five_kilo" | "seven_kilo" | "ten_kilo"): boolean {
    const eq = player.getComponent("equippable") as EntityEquippableComponent | undefined;
    if (!eq) return false;

    const eggId = EGG_META[eggType].id;
    const off = eq.getEquipment(EquipmentSlot.Offhand);

    if (off && off.typeId === eggId) {
        // Always remove the single egg left
        eq.setEquipment(EquipmentSlot.Offhand, undefined);

        // ✅ Reset scoreboard immediately
        player.runCommand(`scoreboard players set @s ${eggType}_egg 0`);
        player.runCommand(`scoreboard players add @s egg_count 1`);
        return true;
    }

    return false;
}

system.afterEvents.scriptEventReceive.subscribe(event => {
    if (!event.sourceEntity) return;
    let entity = event.sourceEntity;
    if (!(entity instanceof Player)) return;
    switch (event.id) {
        case "pokeworld:hatch_egg_two_kilo":
            hatchEgg("two_kilo", entity);
            break;
        case "pokeworld:hatch_egg_five_kilo":
            hatchEgg("five_kilo", entity);
            break;
        case "pokeworld:hatch_egg_seven_kilo":
            hatchEgg("seven_kilo", entity);
            break;
        case "pokeworld:hatch_egg_ten_kilo":
            hatchEgg("ten_kilo", entity);
            break;
    }
})

const randomNumber = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

function hatchEgg(
    eggType: "two_kilo" | "seven_kilo" | "ten_kilo" | "five_kilo",
    player: Player
) {
    enforceSingleOffhandEgg(player, eggType);

    if (!removeOneEggFromOffhand(player, eggType)) {
        player.sendMessage("§cYou must have the correct egg in your offhand to hatch it!");
        return;
    }

    const pool = hatchingConfig[eggType];
    const randomItem = pool[randomNumber(0, pool.length - 1)];
    const variant =
        randomNumber(1, 250) === 250
            ? randomItem.variant[1]
            : randomItem.variant[0];

    const calculations = calculatePokemon(
        randomItem.pokeName,
        variant,
        "pokeball"
    );

    // ✅ NOT IN PC BY DEFAULT
    calculations.Box = -1;
    calculations.Slot = -1;

    const rID = ~~(Math.random() * 999999999);

    writePokemon(player, randomItem.pokeName, rID, calculations);

    const ivPercent = getIVPercent(calculations);
    player.sendMessage(
        `§a🐣 You hatched a §e${randomItem.pokeName}§a!\n§7IVs: §e${ivPercent}%%`
    );

    const freeSlot = checkSidebarFree(player);

    // ===============================
    // SEND TO PC
    // ===============================
    if (!freeSlot) {
        const { box, slot } = findNextFreePCSlotForPlayer(player);
        calculations.Box = box;
        calculations.Slot = slot;

        player.sendMessage(`§a✚ §7Pokemon Sent To Your PC`);
        player.runCommand(`scoreboard players add @s pcatch 1`);
        return;
    }

    // ===============================
    // ADD TO PARTY
    // ===============================
    player.sendMessage(`§a✚ §7Pokemon Added To Your Party`);
    player.runCommand(`scoreboard players add @s pcatch 1`);

    if (!selected.hasOwnProperty(player.name)) selected[player.name] = {};
    selected[player.name][freeSlot] = [Number(rID), randomItem.pokeName, calculations];

    system.run(() => {
        player.runCommand(`scoreboard players set @s poke${freeSlot > 0 ? freeSlot + 1 : ''}rID ${rID}`);
        player.runCommand(`scoreboard players set @s poke${freeSlot > 0 ? freeSlot + 1 : ''}Id ${pokemonList.indexOf(randomItem.pokeName)}`);
        player.runCommand(`scoreboard players set @s poke${freeSlot > 0 ? freeSlot + 1 : ''}Ball ${Object.keys(ballTags).indexOf(calculations.pokeBall)}`);
        player.runCommand(`scoreboard players set @s poke${freeSlot > 0 ? freeSlot + 1 : ''}Lvl ${calculations.level}`);
        player.runCommand(`scoreboard players set @s poke${freeSlot > 0 ? freeSlot + 1 : ''}Var ${calculations.Variant}`);
        player.runCommand(`scoreboard players set @s poke${freeSlot > 0 ? freeSlot + 1 : ''}HP ${calculations.Current_Health ?? 0}`);
        player.runCommand(`scoreboard players set @s poke${freeSlot > 0 ? freeSlot + 1 : ''}HPmax ${calculations.Base_Health}`);
    });
}