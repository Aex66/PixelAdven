// @ts-nocheck
import { system, world } from "@minecraft/server";
import Commands from "../../Papers/CommandPaper/CommandPaper";

/**
 * You can use this site:
 * https://mapmaking.fr/tick/
 * to calculate hours/minutes/seconds to ticks
 */

let config: config = {
    //How long will a question last before it stops (in ticks)
    triviaTimeout: 2400,

    //Minimumn Length Until Next Question (in ticks)
    triviaIntervalMin: 12000,

    //Maximumn Length Until Next Question (in ticks)
    triviaIntervalMax: 36000,

    triviaData: [
        {
            question: "What is the first Pokémon in the National Pokédex?",
            answer: "Bulbasaur"
        },
        {
            question: "Which Pokémon is known as the 'Mouse Pokémon'?",
            answer: "Pikachu"
        },
        {
            question: "What type combination is unique to the Pokémon Dragapult?",
            answer: "Dragon/Ghost"
        },
        {
            question: "Which Pokémon evolves into Raichu when exposed to a Thunder Stone?",
            answer: "Pikachu"
        },
        {
            question: "Which Pokémon is famous for saying 'I choose you!' in the anime?",
            answer: "Pikachu"
        },
        {
            question: "What is the only Pokémon that can have the ability 'Wonder Guard'?",
            answer: "Shedinja"
        },
        {
            question: "In which region do you start your journey in Pokémon Sun and Moon?",
            answer: "Alola"
        },
        {
            question: "What is the signature move of the Pokémon Darkrai?",
            answer: "Dark Void"
        },
        {
            question: "Which Legendary Pokémon is known as the 'Temporal Pokémon'?",
            answer: "Dialga"
        },
        {
            question: "What is the name of the item used to evolve Eevee into Leafeon in Pokémon Sword and Shield?",
            answer: "Leaf Stone"
        },
        {
            question: "Which Pokémon is known as the 'Eon Pokémon'?",
            answer: "Latias, Latios"
        },
        {
            question: "What type is super effective against both Ghost and Dark types?",
            answer: "Fairy"
        },
        {
            question: "Which Pokémon has the ability to change its type using the move 'Camouflage'?",
            answer: "Kecleon"
        },
        {
            question: "What is the name of Ash Ketchum's hometown?",
            answer: "Pallet Town"
        },
        {
            question: "Which Pokémon evolves into Gardevoir and Gallade?",
            answer: "Ralts, Kirlia"
        },
        {
            question: "What type of Pokémon is Lugia?",
            answer: "Psychic/Flying"
        },
        {
            question: "Which Pokémon has the highest base stat total?",
            answer: "Arceus"
        },
        {
            question: "What item is used to evolve Porygon into Porygon2?",
            answer: "Upgrade"
        },
        {
            question: "Which Pokémon is known as the 'Genetic Pokémon'?",
            answer: "Mewtwo"
        },
        {
            question: "In Pokémon Red and Blue, which Pokémon can only be obtained through an in-game trade with an NPC?",
            answer: "Farfetch'd"
        },
        {
            question: "Which Pokémon is known as the 'Land Shark Pokémon'?",
            answer: "Garchomp"
        },
        {
            question: "What is the name of the move that only Ditto and Mew can learn naturally?",
            answer: "Transform"
        },
        {
            question: "Which Pokémon is known as the 'Disaster Pokémon'?",
            answer: "Absol"
        },
        {
            question: "What item can be used to evolve Eevee into Vaporeon?",
            answer: "Water Stone"
        },
        {
            question: "Which Pokémon has the National Pokédex number #150?",
            answer: "Mewtwo"
        },
        {
            question: "What is the evolved form of the Pokémon Magikarp?",
            answer: "Gyarados"
        },
        {
            question: "Which Pokémon is known for its signature move 'Roar of Time'?",
            answer: "Dialga"
        },
        {
            question: "What type combination is unique to the Pokémon Toxapex?",
            answer: "Poison/Water"
        },
        {
            question: "What is the name of the villainous team in Pokémon Ruby and Sapphire?",
            answer: "Team Magma"
        },
        {
            question: "Which Pokémon can evolve into either Espeon or Umbreon based on the time of day?",
            answer: "Eevee"
        },
        {
            question: "Which Pokémon evolves into Cloyster?",
            answer: "Shellder"
        },
        {
            question: "What is the only Pokémon that can learn the move 'Judgment'?",
            answer: "Arceus"
        },
        {
            question: "Which Pokémon has the ability 'Multiscale'?",
            answer: "Dragonite, Lugia"
        },
        {
            question: "What is the final evolution of the starter Pokémon Charmander?",
            answer: "Charizard"
        },
        {
            question: "What item is used to evolve Scyther into Scizor?",
            answer: "Metal Coat"
        },
        {
            question: "Which Pokémon is known as the 'Beckon Pokémon'?",
            answer: "Gengar"
        },
        {
            question: "What type of Pokémon is Togekiss?",
            answer: "Fairy/Flying"
        },
        {
            question: "Which Pokémon has the highest Speed stat in the base game?",
            answer: "Deoxys (Speed Form)"
        },
        {
            question: "What is the name of the professor in the Kanto region?",
            answer: "Professor Oak"
        },
        {
            question: "Which Pokémon evolves into Metagross?",
            answer: "Beldum, Metang"
        },
        {
            question: "What is the name of the move that allows a Pokémon to cure its status conditions but at the cost of 50% of its HP?",
            answer: "Healing Wish"
        },
        {
            question: "Which Pokémon is known as the 'Spiral Pokémon'?",
            answer: "Omanyte, Omastar"
        },
        {
            question: "What type combination is unique to the Pokémon Volcanion?",
            answer: "Fire/Water"
        },
        {
            question: "Which Pokémon can only evolve when leveled up in the Sinnoh region's Mount Coronet?",
            answer: "Magneton, Nosepass"
        },
        {
            question: "What is the signature move of the Pokémon Zeraora?",
            answer: "Plasma Fists"
        },
        {
            question: "Which Pokémon is known as the 'Sleeping Pokémon'?",
            answer: "Snorlax"
        },
        {
            question: "Which Legendary Pokémon has the ability 'Pressure'?",
            answer: "Many answers including Lugia, Ho-oh, Suicune, etc."
        },
        {
            question: "What is the name of the team of thieves in Pokémon Black and White?",
            answer: "Team Plasma"
        },
        {
            question: "Which Pokémon can change its form using the item 'Griseous Orb'?",
            answer: "Giratina"
        },
        {
            question: "What is the evolved form of the Pokémon Bagon?",
            answer: "Shelgon, Salamence"
        },
        {
            question: "Which Pokémon is known as the 'Iron Armor Pokémon'?",
            answer: "Aggron"
        },
        {
            question: "What is the name of the item used to evolve Eevee into Flareon?",
            answer: "Fire Stone"
        },
        {
            question: "Which Pokémon is known for its signature move 'Fusion Bolt'?",
            answer: "Zekrom"
        },
        {
            question: "Which Pokémon has the ability 'Protean'?",
            answer: "Greninja, Kecleon"
        },
        {
            question: "What type is super effective against Water, Ground, and Rock types?",
            answer: "Grass"
        },
        {
            question: "What is the name of the villainous team in Pokémon X and Y?",
            answer: "Team Flare"
        },
        {
            question: "Which Pokémon evolves into Kingdra when traded holding a Dragon Scale?",
            answer: "Seadra"
        },
        {
            question: "What is the National Pokédex number of the Pokémon Dragonite?",
            answer: "149"
        },
        {
            question: "Which Pokémon is known as the 'Aura Pokémon'?",
            answer: "Lucario"
        },
        {
            question: "What type combination is unique to the Pokémon Rotom-Wash?",
            answer: "Electric/Water"
        },
        {
            question: "Which Pokémon evolves into Togekiss when exposed to a Shiny Stone?",
            answer: "Togetic"
        },
        {
            question: "What is the name of the region introduced in Pokémon Diamond and Pearl?",
            answer: "Sinnoh"
        },
        {
            question: "Which Pokémon is known for its ability 'Beast Boost'?",
            answer: "Ultra Beasts"
        },
        {
            question: "What type is super effective against Dragon types?",
            answer: "Ice, Dragon, Fairy"
        },
        {
            question: "What is the signature move of the Pokémon Kyogre?",
            answer: "Origin Pulse"
        },
        {
            question: "Which Pokémon is known as the 'Swordsman Pokémon'?",
            answer: "Gallade"
        },
        {
            question: "What type combination is unique to the Pokémon Alolan Muk?",
            answer: "Poison/Dark"
        },
        {
            question: "Which Pokémon evolves into Nidoqueen?",
            answer: "Nidorina"
        },
        {
            question: "What is the name of the move that doubles in power if the target is poisoned?",
            answer: "Venoshock"
        },
        {
            question: "Which Pokémon has the National Pokédex number #25?",
            answer: "Pikachu"
        },
        {
            question: "What is the only Pokémon that can learn the move 'Spacial Rend'?",
            answer: "Palkia"
        },
        {
            question: "Which Pokémon is known as the 'Savior of the Seas'?",
            answer: "Manaphy"
        },
        {
            question: "What type combination is unique to the Pokémon Mimikyu?",
            answer: "Ghost/Fairy"
        },
        {
            question: "Which Pokémon evolves into Bellossom when exposed to a Sun Stone?",
            answer: "Gloom"
        },
        {
            question: "What is the name of the item used to evolve Sneasel into Weavile?",
            answer: "Razor Claw"
        },
        {
            question: "Which Pokémon is known as the 'End of the Line Pokémon'?",
            answer: "Eternatus"
        },
        {
            question: "What type combination is unique to the Pokémon Alolan Exeggutor?",
            answer: "Grass/Dragon"
        },
        {
            question: "Which Pokémon evolves into Scizor when traded holding a Metal Coat?",
            answer: "Scyther"
        },
        {
            question: "What is the name of the Legendary Pokémon that can transform into different forms using the move 'Relic Song'?",
            answer: "Meloetta"
        },
        {
            question: "Which Pokémon is known as the 'Battle Armor Pokémon'?",
            answer: "Kabutops"
        },
        {
            question: "What type combination is unique to the Pokémon Ice Rider Calyrex?",
            answer: "Psychic/Ice"
        },
        {
            question: "Which Pokémon evolves into Politoed when traded holding a King's Rock?",
            answer: "Poliwhirl"
        },
        {
            question: "What is the National Pokédex number of the Pokémon Jirachi?",
            answer: "385"
        },
        {
            question: "Which Pokémon is known as the 'Sun Pokémon'?",
            answer: "Espeon"
        },
        {
            question: "What type combination is unique to the Pokémon Tapu Koko?",
            answer: "Electric/Fairy"
        },
        {
            question: "Which Pokémon evolves into Crobat through high friendship?",
            answer: "Golbat"
        },
        {
            question: "What is the name of the move that heals the user by 50% of its maximum HP?",
            answer: "Roost, Recover"
        },
        {
            question: "Which Pokémon has the ability 'Intrepid Sword'?",
            answer: "Zacian"
        },
        {
            question: "What type is super effective against Psychic and Ghost types?",
            answer: "Dark"
        },
        {
            question: "What is the signature move of the Pokémon Zygarde?",
            answer: "Thousand Arrows"
        },
        {
            question: "Which Pokémon is known as the 'DNA Pokémon'?",
            answer: "Deoxys"
        },
        {
            question: "What type combination is unique to the Pokémon Grimmsnarl?",
            answer: "Dark/Fairy"
        },
        {
            question: "Which Pokémon evolves into Gliscor when holding a Razor Fang and leveled up at night?",
            answer: "Gligar"
        },
        {
            question: "What is the National Pokédex number of the Pokémon Rayquaza?",
            answer: "384"
        },
        {
            question: "Which Pokémon is known as the 'Life Pokémon'?",
            answer: "Xerneas"
        },
        {
            question: "What type combination is unique to the Pokémon Dragapult?",
            answer: "Dragon/Ghost"
        },
        {
            question: "Which Pokémon evolves into Honchkrow when exposed to a Dusk Stone?",
            answer: "Murkrow"
        },
        {
            question: "What is the name of the item used to evolve Feebas into Milotic?",
            answer: "Prism Scale"
        },
        {
            question: "Which Pokémon has the National Pokédex number #151?",
            answer: "Mew"
        },
        {
            question: "What is the only Pokémon that can learn the move 'Glacial Lance'?",
            answer: "Glastrier"
        },
        {
            question: "Which Pokémon is known as the 'Pitch-Black Pokémon'?",
            answer: "Darkrai"
        },
        {
            question: "What type combination is unique to the Pokémon Drampa?",
            answer: "Normal/Dragon"
        },
        {
            question: "Which Pokémon evolves into Rhyperior when traded holding a Protector?",
            answer: "Rhydon"
        },
        {
            question: "What is the name of the region introduced in Pokémon Sword and Shield?",
            answer: "Galar"
        },
        {
            question: "Which Pokémon is known as the 'Stinger Pokémon'?",
            answer: "Beedrill"
        },
        {
            question: "What type is super effective against Rock and Fire types?",
            answer: "Water"
        },
        {
            question: "What is the signature move of the Pokémon Hoopa Unbound?",
            answer: "Hyperspace Fury"
        },
        {
            question: "Which Pokémon evolves into Froslass when exposed to a Dawn Stone?",
            answer: "Snorunt (female)"
        },
        {
            question: "What is the National Pokédex number of the Pokémon Zoroark?",
            answer: "571"
        },
        {
            question: "Which Pokémon is known as the 'Boundary Pokémon'?",
            answer: "Kyurem"
        },
        {
            question: "What type combination is unique to the Pokémon Solgaleo?",
            answer: "Psychic/Steel"
        },
        {
            question: "Which Pokémon evolves into Roserade when exposed to a Shiny Stone?",
            answer: "Roselia"
        },
        {
            question: "What is the name of the item used to evolve Porygon2 into Porygon-Z?",
            answer: "Dubious Disc"
        },
        {
            question: "Which Pokémon has the ability 'Stance Change'?",
            answer: "Aegislash"
        },
        {
            question: "What type is super effective against Steel and Psychic types?",
            answer: "Fire"
        },
        {
            question: "What is the signature move of the Pokémon Groudon?",
            answer: "Precipice Blades"
        },
        {
            question: "Which Pokémon evolves into Togekiss when exposed to a Shiny Stone?",
            answer: "Togetic"
        },
        {
            question: "What is the National Pokédex number of the Pokémon Celebi?",
            answer: "251"
        },
        {
            question: "Which Pokémon is known as the 'Sky High Pokémon'?",
            answer: "Rayquaza"
        },
        {
            question: "What type combination is unique to the Pokémon Turtonator?",
            answer: "Fire/Dragon"
        },
        {
            question: "Which Pokémon evolves into Gliscor when holding a Razor Fang and leveled up at night?",
            answer: "Gligar"
        },
        {
            question: "What is the name of the item used to evolve Magmar into Magmortar?",
            answer: "Magmarizer"
        },
        {
            question: "Which Pokémon has the ability 'Libero'?",
            answer: "Cinderace"
        },
        {
            question: "What type is super effective against Bug and Dark types?",
            answer: "Fairy"
        },
        {
            question: "What is the signature move of the Pokémon Latias and Latios?",
            answer: "Luster Purge, Mist Ball"
        },
        {
            question: "Which Pokémon evolves into Dusknoir when traded holding a Reaper Cloth?",
            answer: "Dusclops"
        },
        {
            question: "What is the National Pokédex number of the Pokémon Genesect?",
            answer: "649"
        },
        {
            question: "Which Pokémon is known as the 'Intertwining Pokémon'?",
            answer: "Sylveon"
        },
        {
            question: "What type combination is unique to the Pokémon Toxtricity?",
            answer: "Electric/Poison"
        },
        {
            question: "Which Pokémon evolves into Slowking when traded holding a King's Rock?",
            answer: "Slowpoke"
        },
        {
            question: "What is the name of the item used to evolve Clamperl into Gorebyss?",
            answer: "Deep Sea Scale"
        },
        {
            question: "Which Pokémon has the ability 'Ice Face'?",
            answer: "Eiscue"
        },
        {
            question: "What type is super effective against Water and Flying types?",
            answer: "Electric"
        },
        {
            question: "What is the signature move of the Pokémon Tapu Koko?",
            answer: "Nature's Madness"
        },
        {
            question: "Which Pokémon evolves into Electivire when traded holding an Electirizer?",
            answer: "Electabuzz"
        },
        {
            question: "What is the National Pokédex number of the Pokémon Jirachi?",
            answer: "385"
        },
        {
            question: "Which Pokémon is known as the 'Temporal Pokémon'?",
            answer: "Dialga"
        },
        {
            question: "What type combination is unique to the Pokémon Mawile?",
            answer: "Steel/Fairy"
        },
        {
            question: "Which Pokémon evolves into Bellossom when exposed to a Sun Stone?",
            answer: "Gloom"
        },
        {
            question: "What is the name of the item used to evolve Sneasel into Weavile?",
            answer: "Razor Claw"
        },
        {
            question: "Which Pokémon has the ability 'Trace'?",
            answer: "Gardevoir, Porygon2, Porygon-Z"
        },
        {
            question: "What type is super effective against Ground and Flying types?",
            answer: "Ice"
        },
        {
            question: "What is the signature move of the Pokémon Victini?",
            answer: "V-create"
        },
        {
            question: "Which Pokémon evolves into Milotic when holding a Prism Scale and leveled up?",
            answer: "Feebas"
        },
        {
            question: "What is the National Pokédex number of the Pokémon Darkrai?",
            answer: "491"
        },
        {
            question: "Which Pokémon is known as the 'Frost Tree Pokémon'?",
            answer: "Abomasnow"
        },
        {
            question: "What type combination is unique to the Pokémon Buzzwole?",
            answer: "Bug/Fighting"
        },
        {
            question: "Which Pokémon evolves into Vikavolt when exposed to a Thunder Stone?",
            answer: "Charjabug"
        },
        {
            question: "What is the name of the item used to evolve Piloswine into Mamoswine?",
            answer: "Ancient Power (move)"
        },
        {
            question: "Which Pokémon has the ability 'Levitate'?",
            answer: "Many answers including Gengar, Rotom, Latias, Latios, etc."
        },
        {
            question: "What type is super effective against Grass and Psychic types?",
            answer: "Bug"
        },
        {
            question: "What is the signature move of the Pokémon Tapu Fini?",
            answer: "Nature's Madness"
        },
        {
            question: "Which Pokémon evolves into Porygon2 when holding an Upgrade and traded?",
            answer: "Porygon"
        },
        {
            question: "What is the National Pokédex number of the Pokémon Genesect?",
            answer: "649"
        },
        {
            question: "Which Pokémon is known as the 'Genetic Pokémon'?",
            answer: "Mewtwo"
        },
        {
            question: "What type combination is unique to the Pokémon Dhelmise?",
            answer: "Ghost/Grass"
        },
        {
            question: "Which Pokémon evolves into Slowking when traded holding a King's Rock?",
            answer: "Slowpoke"
        },
        {
            question: "What is the name of the item used to evolve Clamperl into Huntail?",
            answer: "Deep Sea Tooth"
        },
        {
            question: "Which Pokémon has the ability 'Multiscale'?",
            answer: "Dragonite, Lugia"
        },
        {
            question: "What type is super effective against Psychic and Ghost types?",
            answer: "Dark"
        },
        {
            question: "What is the signature move of the Pokémon Marshadow?",
            answer: "Spectral Thief"
        },
        {
            question: "Which Pokémon evolves into Weavile when holding a Razor Claw and leveled up at night?",
            answer: "Sneasel"
        },
        {
            question: "What is the National Pokédex number of the Pokémon Zygarde?",
            answer: "718"
        },
        {
            question: "Which Pokémon is known as the 'Mystic Pokémon'?",
            answer: "Mesprit"
        },
        {
            question: "What type combination is unique to the Pokémon Bronzong?",
            answer: "Steel/Psychic"
        },
        {
            question: "Which Pokémon evolves into Dusknoir when traded holding a Reaper Cloth?",
            answer: "Dusclops"
        },
        {
            question: "What is the name of the item used to evolve Magmar into Magmortar?",
            answer: "Magmarizer"
        },
        {
            question: "Which Pokémon has the ability 'Trace'?",
            answer: "Gardevoir, Porygon2, Porygon-Z"
        },
        {
            question: "What type is super effective against Fighting and Fairy types?",
            answer: "Poison"
        },
        {
            question: "What is the signature move of the Pokémon Rayquaza?",
            answer: "Dragon Ascent"
        },
        {
            question: "Which Pokémon evolves into Togekiss when exposed to a Shiny Stone?",
            answer: "Togetic"
        },
        {
            question: "What is the National Pokédex number of the Pokémon Meloetta?",
            answer: "648"
        },
        {
            question: "Which Pokémon is known as the 'Tundra Pokémon'?",
            answer: "Amaura, Aurorus"
        },
        {
            question: "What type combination is unique to the Pokémon Silvally?",
            answer: "It can be any type depending on the memory it holds."
        },
        {
            question: "Which Pokémon evolves into Lickilicky when leveled up knowing Rollout?",
            answer: "Lickitung"
        },
        {
            question: "What is the name of the item used to evolve Gligar into Gliscor?",
            answer: "Razor Fang"
        },
        {
            question: "Which Pokémon has the ability 'Battle Bond'?",
            answer: "Greninja (Ash-Greninja)"
        },
        {
            question: "What type is super effective against Dark and Ghost types?",
            answer: "Fairy"
        },
        {
            question: "What is the signature move of the Pokémon Zeraora?",
            answer: "Plasma Fists"
        },
        {
            question: "Which Pokémon evolves into Rhyperior when traded holding a Protector?",
            answer: "Rhydon"
        },
        {
            question: "What is the National Pokédex number of the Pokémon Zeraora?",
            answer: "807"
        },
        {
            question: "Which Pokémon is known as the 'Patron Deity Pokémon'?",
            answer: "Tapu Koko, Tapu Lele, Tapu Bulu, Tapu Fini"
        },
        {
            question: "What type combination is unique to the Pokémon Magearna?",
            answer: "Steel/Fairy"
        },
        {
            question: "Which Pokémon evolves into Porygon-Z when traded holding a Dubious Disc?",
            answer: "Porygon2"
        },
        {
            question: "What is the name of the item used to evolve Rhydon into Rhyperior?",
            answer: "Protector"
        },
        {
            question: "Which Pokémon has the ability 'Arena Trap'?",
            answer: "Dugtrio, Trapinch"
        },
        {
            question: "What type is super effective against Grass and Psychic types?",
            answer: "Bug"
        },
        {
            question: "What is the signature move of the Pokémon Incineroar?",
            answer: "Darkest Lariat"
        },
        {
            question: "Which Pokémon evolves into Aromatisse when traded holding a Sachet?",
            answer: "Spritzee"
        },
        {
            question: "What is the National Pokédex number of the Pokémon Keldeo?",
            answer: "647"
        },
        {
            question: "Which Pokémon is known as the 'Iron Armor Pokémon'?",
            answer: "Aggron"
        },
        {
            question: "What type combination is unique to the Pokémon Heatran?",
            answer: "Fire/Steel"
        },
        {
            question: "Which Pokémon evolves into Whimsicott when exposed to a Sun Stone?",
            answer: "Cottonee"
        },
        {
            question: "What is the name of the item used to evolve Clamperl into Gorebyss?",
            answer: "Deep Sea Scale"
        },
        {
            question: "Which Pokémon has the ability 'Beast Boost'?",
            answer: "Ultra Beasts"
        },
        {
            question: "What type is super effective against Rock and Electric types?",
            answer: "Ground"
        },
        {
            question: "What is the signature move of the Pokémon Xerneas?",
            answer: "Geomancy"
        },
        {
            question: "Which Pokémon evolves into Glaceon when leveled up near an Ice Rock?",
            answer: "Eevee"
        },
        {
            question: "What is the National Pokédex number of the Pokémon Zekrom?",
            answer: "644"
        },
        {
            question: "Which Pokémon is known as the 'Atrocious Pokémon'?",
            answer: "Gyarados"
        },
        {
            question: "What type combination is unique to the Pokémon Dracovish?",
            answer: "Water/Dragon"
        },
        {
            question: "Which Pokémon evolves into Bisharp?",
            answer: "Pawniard"
        },
        {
            question: "What is the name of the item used to evolve Spritzee into Aromatisse?",
            answer: "Sachet"
        },
        {
            question: "Which Pokémon is known for its ability 'Parental Bond'?",
            answer: "Mega Kangaskhan"
        },
        {
            question: "What type is super effective against Bug and Fighting types?",
            answer: "Flying"
        },
        {
            question: "What is the signature move of the Pokémon Necrozma?",
            answer: "Photon Geyser"
        },
        {
            question: "Which Pokémon evolves into Piloswine when leveled up knowing Ancient Power?",
            answer: "Swinub"
        },
        {
            question: "What is the National Pokédex number of the Pokémon Hoopa?",
            answer: "720"
        },
        {
            question: "Which Pokémon is known as the 'Disaster Pokémon'?",
            answer: "Absol"
        },
        {
            question: "What type combination is unique to the Pokémon Wishiwashi?",
            answer: "Water (in both Solo and School forms)"
        },
        {
            question: "Which Pokémon evolves into Alcremie when holding a Sweet and spun around?",
            answer: "Milcery"
        },
        {
            question: "What is the name of the item used to evolve Dusclops into Dusknoir?",
            answer: "Reaper Cloth"
        },
        {
            question: "Which Pokémon has the ability 'Unburden'?",
            answer: "Hawlucha, Sceptile, Drifblim, etc."
        },
        {
            question: "What type is super effective against Grass and Dragon types?",
            answer: "Ice"
        },
        {
            question: "What is the signature move of the Pokémon Ho-Oh?",
            answer: "Sacred Fire"
        },
        {
            question: "Which Pokémon evolves into Conkeldurr when traded?",
            answer: "Gurdurr"
        },
        {
            question: "What is the National Pokédex number of the Pokémon Lugia?",
            answer: "249"
        },
        {
            question: "Which Pokémon is known as the 'Spikes Pokémon'?",
            answer: "Cacturne"
        },
        {
            question: "What type combination is unique to the Pokémon Araquanid?",
            answer: "Water/Bug"
        },
        {
            question: "Which Pokémon evolves into Hitmonlee, Hitmonchan, or Hitmontop depending on its stats?",
            answer: "Tyrogue"
        },
        {
            question: "What is the name of the item used to evolve Happiny into Chansey?",
            answer: "Oval Stone"
        },
        {
            question: "Which Pokémon has the ability 'Regenerator'?",
            answer: "Tangrowth, Reuniclus, Toxapex, etc."
        },
        {
            question: "What type is super effective against Steel and Fairy types?",
            answer: "Fire"
        },
        {
            question: "What is the signature move of the Pokémon Solgaleo?",
            answer: "Sunsteel Strike"
        },
        {
            question: "Which Pokémon evolves into Magnezone when leveled up in a special magnetic field?",
            answer: "Magneton"
        },
        {
            question: "What is the National Pokédex number of the Pokémon Arceus?",
            answer: "493"
        },
        {
            question: "Which Pokémon is known as the 'Meteor Pokémon'?",
            answer: "Minior"
        },
        {
            question: "What type combination is unique to the Pokémon Incineroar?",
            answer: "Fire/Dark"
        },
        {
            question: "Which Pokémon evolves into Clamperl into Huntail when traded holding a Deep Sea Tooth?",
            answer: "Clamperl"
        },
        {
            question: "What is the name of the item used to evolve Sliggoo into Goodra?",
            answer: "Level up during rain"
        },
        {
            question: "Which Pokémon has the ability 'Tough Claws'?",
            answer: "Mega Charizard X, Lycanroc (Midday Form)"
        },
        {
            question: "What type is super effective against Dark and Fighting types?",
            answer: "Fairy"
        },
        {
            question: "What is the signature move of the Pokémon Tapu Lele?",
            answer: "Nature's Madness"
        },
        {
            question: "Which Pokémon evolves into Leafeon when leveled up near a Moss Rock?",
            answer: "Eevee"
        },
        {
            question: "What is the National Pokédex number of the Pokémon Zygarde?",
            answer: "718"
        },
        {
            question: "Which Pokémon is known as the 'Mystic Pokémon'?",
            answer: "Mesprit"
        },
        {
            question: "What type combination is unique to the Pokémon Dhelmise?",
            answer: "Ghost/Grass"
        },
        {
            question: "Which Pokémon evolves into Dusknoir when traded holding a Reaper Cloth?",
            answer: "Dusclops"
        },
        {
            question: "What is the name of the item used to evolve Magmar into Magmortar?",
            answer: "Magmarizer"
        }
    ]
}
interface triviaData {
    question: string
    answer: string
}
interface config {
    triviaTimeout: number
    triviaIntervalMin: number
    triviaIntervalMax: number
    triviaData: triviaData[]
}

const randomNumber = (min: number, max: number) => ~~(Math.random() * (max - min) + min)
const sleep = (n: number) => new Promise<void>(acc => system.runTimeout(acc, n));
const cmd = Commands.create({
    name: 'trivia',
    description: 'Enable / Disable The Trivia Game In Chat',
    admin: false,
    category: "Misc"
});
cmd.callback((player) => {
    player.sendMessage(`§l§6Trivia > §r§f${player.hasTag('IgnoreTrivia') ? 'Enabled' : 'Disabled'} Chat Trivia`)
    if (player.hasTag('IgnoreTrivia')) player.removeTag('IgnoreTrivia')
    else player.addTag('IgnoreTrivia')
})

let queue: triviaData[] = []
for (let i = 0; i < 5; i++) {
    let data = config.triviaData[randomNumber(0, config.triviaData.length)]
    if (queue.find(i => i.question == data.question)) continue;
    queue.push(data)
}
let triviaRunning = false
let currentTriviaData: triviaData | undefined = undefined
async function runTriviaQuestion() {
    triviaRunning = true;

    // Remove used question and replace with a new one
    const used = queue.shift();
    let newQuestion: triviaData;
    do {
        newQuestion = config.triviaData[randomNumber(0, config.triviaData.length)];
    } while (queue.find(q => q.question === newQuestion.question));
    queue.push(newQuestion);

    const data = used!;
    currentTriviaData = data;

    system.runTimeout(async () => {
        if (triviaRunning) {
            triviaRunning = false;
            currentTriviaData = undefined;
            for (const player of world.getAllPlayers()) {
                if (player.hasTag('IgnoreTrivia')) continue;
                player.sendMessage(`§l§6Trivia > §r§fNo one answered the question in time.`);
            }
            await sleep(randomNumber(config.triviaIntervalMin, config.triviaIntervalMax));
            runTriviaQuestion();
        }
    }, config.triviaTimeout);

    for (const player of world.getAllPlayers()) {
        if (player.hasTag('IgnoreTrivia')) continue;
        player.sendMessage(`§l§6Trivia > §r§f${data.question}`);
    }
}

world.beforeEvents.chatSend.subscribe(async (eventData) => {
    if (!triviaRunning) return;
    if (eventData.sender.hasTag('IgnoreTrivia')) return;
    if (!currentTriviaData) return;

    if (eventData.message.toLocaleLowerCase() === currentTriviaData.answer.toLocaleLowerCase()) {
        eventData.cancel = true;

        const winner = eventData.sender;

        // Announce winner to all players
        for (const player of world.getAllPlayers()) {
            if (player.hasTag('IgnoreTrivia')) continue;
            player.sendMessage(`§l§6Trivia > §r§f${winner.name} answered correctly`);
        }

        triviaRunning = false;
        currentTriviaData = undefined;

        // Reward winner
        winner.sendMessage(`§l§6Trivia > §r§fYou won 500 PokéCoins`);

        system.run(() => {
            let obj = world.scoreboard.getObjective('Money');
            if (!obj) obj = world.scoreboard.addObjective('Money');
            obj.addScore(winner, 500);
        });

        await sleep(randomNumber(config.triviaIntervalMin, config.triviaIntervalMax));
        runTriviaQuestion();
    }
});

async function start() {
    let time = randomNumber(config.triviaIntervalMin, config.triviaIntervalMax)
    await sleep(time)
    runTriviaQuestion()
}
start()