import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { openHowToPlayMain } from "./howToPlayMain";

/**
 * Opens the Step Spawn System guide and biome pages.
 */
export function openStepSpawn(player: Player, biome?: string) {
  if (!biome) return openStepSpawnMain(player);

  const biomes: { [key: string]: { title: string; body: string; prev?: string; next?: string } } = {
    forest: {
      title: "🌲 Forest Biome",
      body: [
        "§eCommon (40%):§r Bulbasaur, Ivysaur, Caterpie, Metapod, Butterfree, Weedle, Kakuna, Beedrill, Pidgey, Pidgeotto, Rattata, Raticate, Oddish, Gloom, Bellsprout, Weepinbell, Paras, Venonat, Exeggcute, Hoothoot, Noctowl, Wurmple, Silcoon, Cascoon, Beautifly, Dustox, Seedot, Shroomish, Taillow, Starly, Bidoof, Bibarel, Budew, Cherubi, Kricketot, Sentret, Zigzagoon",
        "§eUncommon (20%):§r Venusaur, Pidgeot, Parasect, Venomoth, Exeggutor, Vileplume, Victreebel, Bellossom, Skiploom, Jumpluff, Ledyba, Ledian, Spinarak, Ariados, Grovyle, Turtwig, Grotle, Chikorita, Bayleef, Staravia, Roselia, Combee, Cherrim, Shiftry, Breloom, Sunflora, Mime Jr, Mr Mime, Snubbull, Glameow, Pachirisu, Buneary, Burmy",
        "§eRare (15%):§r Torterra, Meganium, Sceptile, Scyther, Pinsir, Heracross, Roserade, Staraptor, Ursaring, Ambipom, Forretress, Gardevoir, Tangela, Cherrim, Vespiquen, Mothim, Wormadam, Granbull, Purugly, Lopunny, Absol, Murkrow, Honchkrow",
        "§eVery Rare (10%):§r Scizor, Yanma, Yanmega, Leafeon, Gallade, Togetic, Togekiss, Mismagius, Drifloon, Drifblim, Rotom, Tangrowth",
        "§eUltra Rare (5%):§r Eevee, Espeon, Umbreon, Porygon, Porygon2, Porygonz, Snorlax, Spiritomb"
      ].join("\n\n"),
      next: "frozen",
    },

    frozen: {
      title: "❄️ Frozen Biome",
      body: [
        "§eCommon (40%):§r Swinub, Snorunt, Spheal, Sneasel, Snover, Delibird",
        "§eUncommon (20%):§r Piloswine, Glalie, Sealeo, Jynx, Smoochum",
        "§eRare (15%):§r Walrein, Abomasnow, Froslass, Weavile",
        "§eVery Rare (10%):§r Mamoswine, Glaceon",
        "§eUltra Rare (5%):§r Abomasnow"
      ].join("\n\n"),
      prev: "forest",
      next: "mountain"
    },

    mountain: {
      title: "🏔️ Mountain Biome",
      body: [
        "§eCommon (40%):§r Geodude, Machop, Zubat, Sandshrew, Aron, Nosepass, Teddiursa, Spearow, Hoothoot, Numel, Slugma, Meditite, Swablu, Phanpy, Gligar, Rhyhorn",
        "§eUncommon (20%):§r Graveler, Machoke, Golbat, Sandslash, Lairon, Onix, Clefairy, Murkrow, Sableye, Mawile, Magnemite, Chingling, Riolu, Pineco",
        "§eRare (15%):§r Golem, Rhydon, Steelix, Donphan, Camerupt, Altaria, Clefable, Ursaring, Medicham, Skarmory, Magneton, Forretress, Lunatone, Solrock, Larvitar, Bagon, Beldum, Gible",
        "§eVery Rare (10%):§r Aggron, Rhyperior, Gliscor, Mamoswine, Weavile, Lucario, Probopass, Crobat, Metang, Shelgon, Gabite, Pupitar, Rampardos, Bastiodon, Absol",
        "§eUltra Rare (5%):§r Tyranitar, Salamence, Metagross, Garchomp, Dragonite"
      ].join("\n\n"),
      prev: "frozen",
      next: "swamp"
    },

    swamp: {
      title: "🐸 Swamp Biome",
      body: [
        "§eCommon (40%):§r Poliwag, Wooper, Lotad, Shellos, Ekans, Grimer, Koffing, Paras, Venonat, Budew, Gulpin, Stunky, Croagunk, Barboach, Psyduck, Gastly, Shuppet, Duskull, Drifloon",
        "§eUncommon (20%):§r Poliwhirl, Lombre, Roselia, Quagsire, Swalot, Skorupi, Weezing, Muk, Parasect, Venomoth, Golduck, Slowpoke, Slowbro, Slowking, Haunter, Misdreavus, Banette, Dusclops",
        "§eRare (15%):§r Poliwrath, Politoed, Ludicolo, Roserade, Toxicroak, Drapion, Vileplume, Victreebel, Golduck, Slowbro, Slowking, Gengar, Mismagius, Dusknoir, Drifblim, Sableye",
        "§eVery Rare (10%):§r Drapion, Skuntank, Seviper, Gastrodon, Carnivine, Toxicroak, Roserade, Spiritomb, Froslass, Rotom",
        "§eUltra Rare (5%):§r Carnivine, Roserade, Politoed, Spiritomb, Rotom"
      ].join("\n\n"),
      prev: "mountain",
      next: "volcano"
    },

    volcano: {
      title: "🔥 Volcano Biome",
      body: [
        "§eCommon (40%):§r Charmander, Cyndaquil, Torchic, Chimchar, Slugma, Numel, Growlithe, Vulpix, Ponyta, Houndour, Geodude, Rhyhorn, Aron",
        "§eUncommon (20%):§r Charmeleon, Quilava, Combusken, Monferno, Magmar, Camerupt, Magcargo, Lairon, Graveler, Rapidash, Ninetales, Arcanine",
        "§eRare (15%):§r Typhlosion, Blaziken, Infernape, Charizard, Camerupt, Magmar, Golem, Rhydon, Torkoal, Aggron, Houndoom",
        "§eVery Rare (10%):§r Magmortar, Rhyperior, Rampardos, Bastiodon, Steelix, Crobat, Aggron",
        "§eUltra Rare (5%):§r Tyranitar, Charizard, Typhlosion, Blaziken, Infernape"
      ].join("\n\n"),
      prev: "swamp",
      next: "desert"
    },

    desert: {
      title: "🏜️ Desert Biome",
      body: [
        "§eCommon (40%):§r Sandshrew, Diglett, Geodude, Ekans, Trapinch, Cacnea, Numel, Slugma, Baltoy, Hippopotas, Nidoranf, Nidoranm, Cubone, Phanpy, Nincada",
        "§eUncommon (20%):§r Sandslash, Dugtrio, Graveler, Arbok, Nidorina, Nidorino, Vulpix, Rhyhorn, Vibrava, Cacturne, Camerupt, Magmar, Lairon, Marowak, Skorupi, Lileep, Anorith, Loudred",
        "§eRare (15%):§r Rhydon, Donphan, Flygon, Hippowdon, Ninetales, Arcanine, Magcargo, Shuckle, Claydol, Drapion, Gligar, Shedinja",
        "§eVery Rare (10%):§r Rhyperior, Gliscor, Magmar, Magmortar, Houndour, Houndoom, Solrock, Lunatone, Kabutops, Omastar, Cradily, Armaldo, Rampardos, Bastiodon",
        "§eUltra Rare (5%):§r Tyranitar, Garchomp, Salamence"
      ].join("\n\n"),
      prev: "volcano",
      next: "jungle"
    },

    jungle: {
      title: "🌴 Jungle Biome",
      body: [
        "§eCommon (40%):§r Bulbasaur, Caterpie, Metapod, Butterfree, Weedle, Kakuna, Beedrill, Oddish, Bellsprout, Paras, Venonat, Exeggcute, Hoppip, Sunkern, Ledyba, Spinarak, Treecko, Turtwig, Shroomish, Seedot, Lotad, Slakoth, Nincada, Roselia, Budew, Cherubi, Burmy, Combee, Yanma, Aipom, Kecleon, Volbeat, Illumise, Chimchar, Cacnea",
        "§eUncommon (20%):§r Ivysaur, Gloom, Weepinbell, Parasect, Venomoth, Skiploom, Sunflora, Ledian, Ariados, Grovyle, Grotle, Breloom, Nuzleaf, Lombre, Vigoroth, Ninjask, Roserade, Cherrim, Wormadam, Mothim, Vespiquen, Yanmega, Ambipom, Monferno, Cacturne",
        "§eRare (15%):§r Venusaur, Vileplume, Victreebel, Exeggutor, Jumpluff, Tropius, Sceptile, Torterra, Slaking, Shedinja, Scyther, Pinsir, Heracross, Staraptor, Shiftry, Infernape, Abomasnow, Lopunny, Granbull, Purugly",
        "§eVery Rare (10%):§r Scizor, Ursaring, Roserade, Leafeon, Gallade, Honchkrow, Mismagius, Drifblim, Rotom",
        "§eUltra Rare (5%):§r Eevee, Espeon, Umbreon, Leafeon, Togekiss"
      ].join("\n\n"),
      prev: "desert",
      next: "ocean"
    },

    ocean: {
      title: "🌊 Ocean Biome",
      body: [
        "§eCommon (40%):§r Magikarp, Tentacool, Wingull, Staryu, Horsea, Chinchou, Remoraid, Krabby, Goldeen, Shellder, Wailmer, Corphish, Carvanha, Buizel, Finneon, Luvdisc, Shellos, Mantyke, Psyduck, Slowpoke, Seel, Poliwag, Lotad, Wooper, Barboach, Spheal, Squirtle, Totodile, Mudkip, Piplup, Azurill",
        "§eUncommon (20%):§r Pelipper, Poliwhirl, Slowbro, Slowking, Wartortle, Croconaw, Marshtomp, Prinplup, Lombre, Qwilfish, Corsola, Clamperl, Marill, Dewgong, Cloyster, Seadra",
        "§eRare (15%):§r Tentacruel, Kingler, Seaking, Lanturn, Crawdaunt, Sharpedo, Floatzel, Lumineon, Whiscash, Octillery, Starmie, Golduck, Wailord, Lapras, Quagsire, Azumarill, Ludicolo, Walrein, Mantine",
        "§eVery Rare (10%):§r Blastoise, Feraligatr, Swampert, Empoleon, Vaporeon, Gyarados, Relicanth, Huntail, Gorebyss, Kingdra, Milotic",
        "§eUltra Rare (5%):§r Feebas, Dragonair, Dragonite"
      ].join("\n\n"),
      prev: "jungle",
      next: "plains"
    },

    plains: {
      title: "🌾 Plains Biome",
      body: [
        "§eCommon (40%):§r Rattata, Raticate, Sentret, Furret, Zigzagoon, Linoone, Bidoof, Bibarel, Pidgey, Pidgeotto, Spearow, Fearow, Taillow, Swellow, Starly, Staravia, Doduo, Mareep, Shinx, Pachirisu, Electrike, Plusle, Minun",
        "§eUncommon (20%):§r Pidgeot, Staraptor, Dodrio, Flaaffy, Electabuzz, Luxio, Snubbull, Skitty, Glameow, Buneary, Mankey, Primeape, Makuhita, Spinda, Girafarig, Chatot",
        "§eRare (15%):§r Raichu, Ampharos, Manectric, Luxray, Granbull, Delcatty, Lopunny, Tauros, Stantler, Smeargle, Eevee, Espeon, Umbreon",
        "§eVery Rare (10%):§r Hitmonlee, Hitmonchan, Hitmontop, Miltank, Porygon, Porygon2",
        "§eUltra Rare (5%):§r Porygonz, Togetic, Togekiss, Snorlax"
      ].join("\n\n"),
      prev: "ocean",
      next: "safari"
    },

    safari: {
      title: "🦒 Safari Biome",
      body: [
        "§eCommon (40%):§r Nidoranf, Nidoranm, Paras, Venonat, Exeggcute, Doduo, Hoothoot, Wooper, Starly, Budew, Gulpin, Surskit, Stunky",
        "§eUncommon (20%):§r Nidorina, Nidorino, Parasect, Venomoth, Exeggutor, Dodrio, Noctowl, Quagsire, Roselia, Masquerain, Yanma, Aipom, Girafarig, Stantler, Swablu, Staravia, Staraptor, Gloom, Roselia, Skorupi",
        "§eRare (15%):§r Nidoqueen, Nidoking, Exeggutor, Pinsir, Scyther, Tauros, Quagsire, Tangela, Roserade, Toxicroak, Drapion, Carnivine",
        "§eVery Rare (10%):§r Kangaskhan, Chansey, Ursaring, Tangrowth, Yanmega, Drapion, Toxicroak, Skuntank, Absol",
        "§eUltra Rare (5%):§r Eevee, Porygon, Porygon2, Porygonz, Ditto, Snorlax"
      ].join("\n\n"),
      prev: "plains",
      next: "cave"
    },

    cave: {
      title: "🕳️ Cave Biome",
      body: [
        "§eCommon (40%):§r Diglett, Geodude, Gastly, Zubat, Beldum",
        "§eUncommon (20%):§r Graveler, Dugtrio, Golbat, Wartortle, Lairon, Gabite, Loudred, Sableye, Kadabra, Claydol, Misdreavus",
        "§eRare (15%):§r Gengar, Exploud, Aggron, Bronzong, Claydol, Magnezone, Toxicroak, Mismagius, Spiritomb",
        "§eVery Rare (10%):§r Shuckle, Gliscor, Lunatone, Solrock, Dusknoir, Probopass",
        "§eUltra Rare (5%):§r Garchomp, Metagross, Tyranitar"
      ].join("\n\n"),
      prev: "safari"
    }
  };

  const data = biomes[biome];
  const form = new ActionFormData().title(`§2🚶 Step Spawn — ${data.title}`).body(data.body);

  if (data.prev) form.button("⬅️ Previous Biome");
  if (data.next) form.button("➡️ Next Biome");
  form.button("🏠 Back to Step Menu");
  form.button("📘 Return to Main How-To-Play");

  form.show(player).then((response) => {
    if (response.canceled) return;
    let index = 0;
    if (data.prev) {
      if (response.selection === index++) return openStepSpawn(player, data.prev);
    }
    if (data.next) {
      if (response.selection === index++) return openStepSpawn(player, data.next);
    }
    if (response.selection === index++) return openStepSpawnMain(player);
    openHowToPlayMain(player);
  });
}

/**
 * Opens the Step Spawn main selection menu.
 */
function openStepSpawnMain(player: Player) {
  const form = new ActionFormData()
    .title("§2🚶 Step Spawn System")
    .body(
      "Pokémon spawn every §e100 steps§r you take, depending on your biome.\n\n" +
        "Each biome has a unique Pokémon list with rarity tiers.\n\n" +
        "Select a biome below to view its Pokémon spawns."
    )
    .button("🌲 Forest Biome")
    .button("❄️ Frozen Biome")
    .button("🏔️ Mountain Biome")
    .button("🐸 Swamp Biome")
    .button("🔥 Volcano Biome")
    .button("🏜️ Desert Biome")
    .button("🌴 Jungle Biome")
    .button("🌊 Ocean Biome")
    .button("🌾 Plains Biome")
    .button("🦒 Safari Biome")
    .button("🕳️ Cave Biome")
    .button("🏠 Return to Main Menu");

  form.show(player).then((response) => {
    if (response.canceled) return;
    const biomes = [
      "forest", "frozen", "mountain", "swamp", "volcano",
      "desert", "jungle", "ocean", "plains", "safari", "cave"
    ];
    if (response.selection < biomes.length) return openStepSpawn(player, biomes[response.selection]);
    openHowToPlayMain(player);
  });
}
