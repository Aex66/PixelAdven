interface WildTrainerData {
  [trainerName: string]: {
    messages: { opening: string; win: string; lose: string }[]; // <- Change here
    type: string;
    names: string[];
    rate: number;
    function: string;
    noob: {
      pokemon: string[];
      size: [min: number, max: number];
    };
    easy: {
      pokemon: string[];
      size: [min: number, max: number];
    };
    medium: {
      pokemon: string[];
      size: [min: number, max: number];
    };
    hard: {
      pokemon: string[];
      size: [min: number, max: number];
    };
    master: {
      pokemon: string[];
      size: [min: number, max: number];
    };
  };
}

export const WildTrainerData: WildTrainerData = {
  "TeamGym": {
  "messages": [
    {
      "opening": "The gym stands firm against your challenge.",
      "win": "The gym remains undefeated.",
      "lose": "The gym has fallen..."
    }
  ],
  "type": "TeamGym",
  "names": ["Gym"],
  "rate": 100,
  "function": "victories",
  "noob": {
    "pokemon": [],
    "size": [0, 0]
  },
  "easy": {
    "pokemon": [],
    "size": [0, 0]
  },
  "medium": {
    "pokemon": [],
    "size": [0, 0]
  },
  "hard": {
    "pokemon": [],
    "size": [0, 0]
  },
  "master": {
    "pokemon": [],
    "size": [0, 0]
  }
},
  "ArkadiaRep3": {
    messages: [
      {
        "opening": "what? Never seen a skeleton before?",
        "win": "Drink your milk, it’ll make you stronger",
        "lose": "sighs I should’ve stayed at the graveyard"
      },
      {
        "opening": "RAGHH!!!! haha scared you.",
        "win": "I’ve seen bags of bones better than this !",
        "lose": "Crying? There’s just rain in my sockets !!"
      }
    ],
    type: "ArkadiaRep3",
    names: ["Skeletody"],
    rate: 1000,
    function: "arkadia",
    noob: {
      "pokemon": ["Cubone", "Gastly", "Zubat", "Duskull", "Shuppet", "Phanpy"],
      size: [1, 2]
    },
    easy: {
      "pokemon": ["Marowak", "Haunter", "Golbat", "Dusclops", "Banette", "Donphan"],
      size: [2, 3]
    },
    medium: {
      "pokemon": ["Marowak", "Gengar", "Misdreavus", "Dusclops", "Banette", "Donphan", "Cacturne"],
      size: [3, 4]
    },
    hard: {
      "pokemon": ["Gengar", "Mismagius", "Dusknoir", "Cacturne", "Spiritomb", "Froslass", "Weavile", "Absol"],
      size: [4, 5]
    },
    master: {
      "pokemon": ["Gengar", "Dusknoir", "Spiritomb", "Mismagius", "Froslass", "Weavile", "Giratina"],
      size: [5, 6]
    }
  },
  "ArkadiaRep2": {
    messages: [
      {
        opening: "Let’s see how well you’ve trained—no pressure.",
        win: "A good effort, but you’ll need more than instinct to win.",
        lose: "Aghh… I can’t believe I lost. You read me like a book."
      },
      {
        opening: "I’ve studied hundreds of battle patterns… let’s see if you can surprise me.",
        win: "There’s always more to learn. I’m still learning too.",
        lose: "Wow... I didn’t expect that outcome. I’m honestly impressed."
      }
    ],
    type: "ArkadiaRep2",
    names: ["The Legend IRA"],
    rate: 1000,
    function: "arkadia",
    noob: {
      pokemon: ["Pidgey", "Shinx", "Machop", "Poliwag", "Budew", "Ponyta"],
      "size": [1, 2]
    },
    easy: {
      pokemon: ["Staravia", "Grotle", "Kadabra", "Luxio", "Sealeo", "Misdreavus"],
      "size": [2, 3]
    },
    medium: {
      pokemon: ["Floatzel", "Roserade", "Magneton", "Gliscor", "Rapidash", "Dusclops", "Miltank"],
      "size": [3, 4]
    },
    hard: {
      pokemon: ["Togekiss", "Infernape", "Gengar", "Snorlax", "Scizor", "Lanturn", "Flygon", "Clefable"],
      "size": [4, 5]
    },
    master: {
      pokemon: ["Salamence", "Empoleon", "Metagross", "Blissey", "Garchomp", "Latias"],
      "size": [5, 6]
    }
  },
  "ArkadiaHelper1": {
    messages: [
      {
        opening: "Time to show you what I’ve got!",
        win: "Yes! We did it!",
        lose: "No… I can’t believe that…"
      },
      {
        opening: "I hope you’re ready… this is going to be fun!",
        win: "That was way too easy!",
        lose: "Ugh! I need to train harder!"
      }
    ],
    type: "ArkadiaHelper1",
    names: ["FoxMink"],
    rate: 1000,
    function: "arkadia",
    noob: {
      pokemon: ["Pidgey", "Rattata", "Caterpie", "Oddish", "Poliwag", "Sandshrew"],
      "size": [1, 2]
    },
    easy: {
      pokemon: ["Charmander", "Squirtle", "Bulbasaur", "Machop", "Geodude", "Abra"],
      "size": [2, 3]
    },
    medium: {
      pokemon: ["Dratini", "Eevee", "Scyther", "Magnemite", "Haunter", "Lapras"],
      "size": [3, 4]
    },
    hard: {
      pokemon: ["Togepi", "Gyarados", "Arcanine", "Alakazam", "Machamp", "Gardevoir"],
      "size": [4, 5]
    },
    master: {
      pokemon: ["Mewtwo", "Salamence", "Metagross", "Garchomp", "Tyranitar", "Blaziken"],
      "size": [5, 6]
    }
  },
  "ArkadiaHelper": {
    messages: [
      {
        opening: "Aw man, another one? Can’t you guys learn to leave me alone!",
        win: "It’s over, finally. Now get out of here!",
        lose: "Aw man, I lost… Can you leave now?"
      },
      {
        opening: "‘Here we go again… Let’s just get this over with.",
        win: "What was the point if you were gonna lose anyway? Better luck next time I guess.",
        lose: "There, you happy now? You won. Now get out of here."
      }
    ],
    type: "ArkadiaHelper",
    names: ["Gladliator"],
    rate: 1000,
    function: "arkadia",
    noob: {
      pokemon: ["Gastly", "Shuppet", "Shedinja", "Budew", "Turtwig", "Paras"],
      "size": [1, 2]
    },
    easy: {
      pokemon: ["Duskull", "Corsola", "Drifloon", "Gloom", "Cherrim", "Wormadam"],
      "size": [2, 3]
    },
    medium: {
      pokemon: ["Rotom", "Haunter", "Marowak", "Meganium", "Breloom", "Roselia"],
      "size": [3, 4]
    },
    hard: {
      pokemon: ["Spiritomb", "Froslass", "Gengar", "Torterra", "Shiftry", "Roserade"],
      "size": [4, 5]
    },
    master: {
      pokemon: ["Typhlosion", "Dusknoir", "Leafeon", "Tangrowth", "Venusaur", "Giratina"],
      "size": [5, 6]
    }
  },
  "ArkadiaAdvisor2": {
    messages: [
      {
        opening: "Get your blades ready",
        win: "Seems like Arkadia got too strong for you",
        lose: "Yo my pokémon need a buff bro."
      },
      {
        opening: "You better fight with honour",
        win: "Always trust in Wailmer",
        lose: "Surely I’m not the only one that lost"
      }
    ],
    type: "ArkadiaAdvisor2",
    names: ["Zamorr"],
    rate: 1000,
    function: "arkadia",
    noob: {
      pokemon: ["Rhyhorn", "Mantine", "Seedot", "Slakoth", "Anorith", "Larvitar"],
      "size": [1, 2]
    },
    easy: {
      pokemon: ["Miltank", "Yanma", "Dratini", "Seel", "Golbat", "Geodude"],
      "size": [2, 3]
    },
    medium: {
      pokemon: ["Wailmer", "Mr. Mime", "Vaporeon", "Togetic", "Blaziken", "Cacturne", "Absol"],
      "size": [3, 4]
    },
    hard: {
      pokemon: ["Garchomp", "Rhyperior", "Hariyama", "Sceptile", "Snorlax", "Lapras"],
      "size": [4, 5]
    },
    master: {
      pokemon: ["Gyarados", "Articuno", "Aerodactyl", "Rhydon", "Machamp", "Rapidash"],
      "size": [5, 6]
    }
  },
  "ArkadiaOwner": {
    messages: [
      {
        opening: "Are you really here to challenge me? You'll regret your choice.",
        win: "We both knew this would be the result, now go.",
        lose: "Oh? How could this be..."
      },
      {
        opening: "Are you going to make this fight interesting?",
        win: "Just like that, you failed.",
        lose: "I see, you've done well."
      }
    ],
    type: "ArkadiaOwner",
    names: ["Typed"],
    rate: 1000,
    function: "arkadia",
    noob: {
      pokemon: ["Hoothoot", "Totodile", "Omanyte", "Kabuto", "Pinsir", "Rhyhorn", "Magnemite"],
      "size": [1, 2]
    },
    easy: {
      pokemon: ["Marshtomp", "Octillery", "Magcargo", "Scyther", "Quagsire", "Sudowoodo", "Flaaffy"],
      "size": [2, 3]
    },
    medium: {
      pokemon: ["Drapion", "Magnezone", "Shedinja", "Absol", "Milotic", "Mawile", "Nosepass"],
      "size": [3, 4]
    },
    hard: {
      pokemon: ["Sharpedo", "Wailord", "Walrein", "Altaria", "Dusclops", "Glalie", "Empoleon"],
      "size": [4, 5]
    },
    master: {
      pokemon: ["Omastar", "Kabutops", "Heracross", "Kingdra", "Suicune", "Tyranitar", "Garchomp", "Aggron"],
      "size": [5, 6]
    }
  },
  "ArkadiaAdvisor": {
    messages: [
      {
        opening: "Face me if you dare",
        win: "I told you this would happen.",
        lose: "How could this happen, impossible!"
      },
      {
        opening: "Bold of you to challenge me",
        win: "Better luck next time, may we meet once you’ve gotten better.",
        lose: "Well done, you’re better than expected."
      }
    ],
    type: "ArkadiaAdvisor",
    names: ["Paradox"],
    rate: 1000,
    function: "arkadia",
    noob: {
      pokemon: ["Charmander", "Cyndaquill", "Chespin", "Froakie", "Mudkip", "Bulbasaur"],
      "size": [1, 2]
    },
    easy: {
      pokemon: ["Charmeleon", "Pidgeotto", "Meowth", "Machop", "Gastly", "Eevee"],
      "size": [2, 3]
    },
    medium: {
      pokemon: ["Grovyle", "Lairon", "Gabite", "Grotle", "Metang", "Houndoom"],
      "size": [3, 4]
    },
    hard: {
      pokemon: ["Gengar", "Blastoise", "Gyarados", "Dragonite", "Salamence", "Venusaur"],
      "size": [4, 5]
    },
    master: {
      pokemon: ["Charizard", "Metagross", "Rayquaza", "Garchomp", "Lapras", "Tyranitar"],
      "size": [5, 6]
    }
  },
  TowerTeamCHG: {
    messages: [
      {
        opening: "Let’s see if you can withstand the strength of my team!",
        win: "Victory is mine — strategy and strength together never fail.",
        lose: "Impressive... you’ve pushed my Pokémon beyond their limits.",
      },
      {
        opening: "Every battle is a test of skill and will. Ready yourself!",
        win: "Another win proves the bond with my team is unbreakable!",
        lose: "I didn’t expect you to fight with such determination...",
      },
    ],
    type: "TowerTeamCHG",
    names: ["CHG Arctic Wolf"],
    rate: 1000,
    function: "final_elite",
    noob: {
      pokemon: ["Riolu", "Dratini", "Gastly", "Machop", "Ralts", "Aron", "Electrike"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Gabite", "Haunter", "Kirlia", "Crobat", "Hariyama", "Manectric", "Flygon"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Garchomp", "Gallade", "Gengar", "Tyranitar", "Metagross", "Salamence", "Milotic"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Dragonite", "Gliscor", "Scizor", "Infernape", "Togekiss", "Gyarados", "Heracross", "Electivire"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Rayquaza", "Garchomp", "Salamence", "Tyranitar", "Dragonite", "Metagross", "Lucario", "Gengar"],
      size: [5, 6]
    }
  },
  TowerTeamDerek: {
    messages: [
      {
        opening:
          "Welcome challenger to my floor. Let's see if you're worth my attention.",
        win: "You were a decent challenge. Too bad you fell short.",
        lose: "Outsmarted and beaten by you. Next time you won't be as lucky.",
      },
      {
        opening: "Welcome. I've heard much about you. Let's battle!",
        win: "Level up more and treat your team as family. Maybe one day you will beat me.",
        lose: "Bested by the challenger. I thought I'd never see the day I was beaten.",
      },
    ],
    type: "Staff Member",
    names: ["Derek"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Beldum", "Sneasel", "Igglybuff", "Dratini", "Houndour", "Gastly"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Metang", "Weavile", "Jigglypuff", "Dragonair", "Houndoom", "Haunter"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Metagross", "Weavile", "Wigglytuff", "Dragonite", "Houndoom", "Gengar"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Metagross", "Weavile", "Wigglytuff", "Dragonite", "Houndoom", "Electrode"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Metagross", "Weavile", "Wigglytuff", "Dragonite", "Gengar", "Houndoom", "Electrode"],
      size: [5, 6]
    }
  },
  TowerTeamDiamond: {
    messages: [
      {
        opening: "Welcome to my world, let's see if you can stay.",
        win: "You are not ready for this world.",
        lose: "Well done. You've beaten me in my own world.",
      },
      {
        opening: "Welcome, let's see if your mind is sharp enough to win.",
        win: "Calculated and precise, a strong mind wins.",
        lose: "Well played. Your mind is indeed sharp.",
      },
    ],
    type: "Staff Member",
    names: ["Diamond"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Ralts", "Abra", "Natu", "Spoink", "Baltoy", "Chingling", "Meditite", "Wynaut"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Kirlia", "Baltoy", "Drowzee", "Kadabra", "Slowpoke", "Chimecho", "Grumpig"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Gallade", "Xatu", "Hypno", "Kadabra", "Slowbro", "Mr Mime"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Gardevior", "Espeon", "Hypno", "Alakazam", "Slowbro", "Bronzong", "Mr Mime"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Cresselia", "Gardevior", "Espeon", "Alakazam", "Claydol", "Slowking"],
      size: [5, 6]
    }
  },
  TowerTeamHusky: {
    messages: [
      {
        opening: "do you think you can handle the rage of the dragons ",
        win: "looks like you couldn’t handle the dragons",
        lose: "I cause you won fairy and square.",
      },
    ],
    type: "Moderator",
    names: ["Huskylord"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["charmelon", "dratini ", "gible", "bagon", "horsea", "gyarados", "trapinch", "swablu"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["charmelon", "dratini", "gible", "bagon", "horsea", "gyarados", "swablu", "trapinch"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["charmelon", "dragonair", "shelgon", "gabite", "seadra", "gyarados", "altaria", "vibrava"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["charizard", "dragonite", "salamence", "garchomp", "kingdra", "gyarados", "flygon", "altaria"],
      size: [4, 5]
    },
    master: {
      pokemon: ["charizard", "dragonite", "salamence", "garchomp", "kingdra", "dialga", "altaria", "flygon"],
      size: [5, 6]
    }
  },
  FinalEliteFourTeam: {
    messages: [
      {
        opening:
          "You’ve conquered every challenge… now face the storm beyond legends.",
        win: "Your strength was real, but mine is eternal. Fall before me!",
        lose: "Impossible… but undeniable. You’ve shattered the unbreakable.",
      },
      {
        opening:
          "This is where destiny is decided — against me, the final shadow of power.",
        win: "Another crushed beneath the weight of legend. None shall surpass me!",
        lose: "So this is what it feels like… to be defeated by destiny itself.",
      },
    ],
    type: "Elite Four Member",
    names: ["The Legend CHG Arctic Wolf"],
    rate: 1000,
    function: "final_elite",
    noob: {
      pokemon: ["Dratini", "Beldum", "Larvitar", "Aron", "Gastly", "Shuppet", "Ralts"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Dragonair", "Dusclops", "Kirlia", "Metang", "Glalie", "Roselia", "Cacturne"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Froslass", "Dusknoir", "Roserade", "Bronzong", "Kingdra", "Crobat", "Gallade"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Empoleon", "Rhyperior", "Mamoswine", "Electivire", "Togekiss", "Weavile", "Houndoom", "Heracross"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Rayquaza", "Garchomp", "Metagross", "Milotic", "Infernape", "Gliscor", "Scizor", "Spiritomb"],
      size: [5, 6]
    }
  },

  SteelEliteFourTeam: {
    messages: [
      {
        opening: "Systems endure. Trainers adapt — or fail.",
        win: "Your strategy collapsed under pressure.",
        lose: "…You recalculated faster than expected."
      },
      {
        opening: "Steel is not brute force. It is precision.",
        win: "Flaw detected. Outcome resolved.",
        lose: "Anomaly confirmed. You may proceed."
      }
    ],
    type: "Elite Four Member",
    names: ["Axiom"],
    rate: 1000,
    function: "steel_elite",

    noob: {
      // Levels: 5–20
      pokemon: ["Magnemite", "Aron", "Shieldon", "Bronzor", "Skarmory", "Steelix"],
      size: [1, 2]
    },

    easy: {
      // Levels: 21–40
      pokemon: ["Magneton", "Lairon", "Probopass", "Forretress", "Skarmory", "Bronzong", "Bastiodon"],
      size: [2, 3]
    },

    medium: {
      // Levels: 41–60
      pokemon: ["Magnezone","Steelix", "Scizor", "Forretress", "Empoleon", "Bronzong", "Lucario"],
      size: [3, 4]
    },

    hard: {
      // Levels: 61–80
      pokemon: [ "Metagross", "Scizor", "Empoleon", "Bronzong", "Magnezone", "Lucario", "Skarmory"],
      size: [4, 5]
    },

    master: {
      // Levels: 81–100
      pokemon: ["Metagross", "Dialga", "Lucario", "Scizor", "Empoleon", "Magnezone", "Bronzong", "Steelix"],
      size: [5, 6]
    }
  },
  PsychicEliteFourTeam: {
    messages: [
      {
        opening: "I've Given Thee Courtesy Enough.",
        win: "What Failure—Such A Disappointment.",
        lose: "Thy Strength Befitting Of A Champion.",
      },
      {
        opening: "I Will Crush Your Ambition, and Destroy Thy Purpose.",
        win: "Such A Disappointing Outcome. You Reek Of Failure.",
        lose: "You Are Quite Exceptional. Stand Proud The Champion Is Near.",
      },
    ],
    type: "Elite Four Member",
    names: ["Night Raven"],
    rate: 1000,
    function: "psychic_elite",
    noob: {
      pokemon: ["Kirlia", "Ralts", "Abra", "Kadabra", "Lunatone", "Solrock", "Beldum", "Meditite"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Gardevoir", "Metang", "Gallade", "Alakazam", "Espeon", "Starmie", "Exeggutor", "Xatu"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Gardevoir", "Metagross", "Starmie", "Slowbro", "Gallade", "Wobbuffet", "Bronzong", "Espeon"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Gardevoir", "Metagross", "Gallade", "Espeon", "Slowking", "Starmie", "Exeggutor", "Slowbro"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Gardevoir", "Metagross", "Gallade", "Espeon", "Slowking", "Starmie", "Exeggutor", "Xatu"],
      size: [5, 6]
    }
  },
  FireGymTeam: {
    messages: [
      {
        opening: "Hope this will be as fun for you as it is for me!",
        win: "You tried, that's what matters!",
        lose: "I'll have to try harder next time!",
      },
      {
        opening: "Let's see what you've got!",
        win: "Is that what you call strategy?",
        lose: "Oof- Good job!",
      },
    ],
    type: "Fire Gym Leader",
    names: ["Raeh"],
    rate: 1000,
    function: "fire_gym",
    noob: {
      pokemon: ["Charmander", "Cyndaquil", "Torchic", "Slugma", "Ponyta", "Growlithe", "Vulpix"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Charmeleon", "Quilava", "Combusken", "Magmar", "Slugma", "Ponyta", "Growlithe", "Numel"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Charizard", "Rapidash", "Blaziken", "Magcargo", "Camerupt", "Houndoom", "Ninetales"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Charizard", "Infernape", "Blaziken", "Arcanine", "Magmortar", "Camerupt", "Houndoom"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Charizard", "Typhlosion", "Blaziken", "Infernape", "Arcanine", "Magmortar", "Houndoom"],
      size: [5, 6]
    }
  },
  FIghtingEliteFourTeam: {
    messages: [
      {
        opening:
          "Welcome to the dojo pupil, do you have the technique to defeat my team?",
        win: "Only with discipline can a pupil defeat their master.",
        lose: "Your mastered my arts pupil, the dojo welcomes you.",
      },
    ],
    type: "Elite Four Member",
    names: ["Kojiro, master of martial arts"],
    rate: 1000,
    function: "fighting_elite",
    noob: {
      pokemon: ["Mankey", "Machop", "Tyrogue", "Makuhita", "Meditite", "Riolu"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Primeape", "Machoke", "Hitmonlee", "Hitmonchan", "Hariyama", "Meditite", "Monferno"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Hitmontop", "Machamp", "Breloom", "Medicham", "Poliwrath", "Toxicroak", "Gallade"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Lucario", "Infernape", "Heracross", "Breloom", "Machamp", "Gallade", "Medicham", "Hitmontop"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Lucario", "Infernape", "Gallade", "Heracross", "Machamp", "Poliwrath", "Hariyama", "Medicham"],
      size: [5, 6]
    }
  },
  IceGymTeam: {
    messages: [
      {
        opening:
          "In the north, the cold hardens both body and soul. Show me if your spirit can endure the storm!",
        win: "The blizzard rages on, and your fire has been snuffed out!",
        lose: "Heh… even the strongest ice cracks. You’ve earned this victory.",
      },
      {
        opening:
          "The frost of my ancestors flows in my veins, but my spirit burns like a blazing torch! Let’s see if you can withstand the clash of ice and fire in my heart!",
        win: "Like a glacier crushing stone, I prove unshakable! Even the hottest flame cannot melt my resolve!",
        lose: "Hah! Your strength burns brighter than I expected. The frost yields this time… but remember, even ice can return stronger after the thaw.",
      },
    ],
    type: "Ice Gym Leader",
    names: ["Layla, The Ice Queen"],
    rate: 1000,
    function: "ice_gym",
    noob: {
      pokemon: ["Seel", "Shellder", "Smoochum", "Snorunt", "Swinub", "Spheal"],
      size: [2, 2]
    },
    easy: {
      pokemon: ["Dewgong", "Cloyster", "Jynx", "Delibird", "Glalie", "Sealeo", "Piloswine"],
      size: [3, 3]
    },
    medium: {
      pokemon: ["Lapras", "Glalie", "Walrein", "Froslass", "Piloswine", "Sneasel", "Snover", "Mamoswine"],
      size: [4, 4]
    },
    hard: {
      pokemon: ["Walrein", "Froslass", "Mamoswine", "Abomasnow", "Jynx", "Lapras", "Glaceon", "Cloyster"],
      size: [6, 5]
    },
    master: {
      pokemon: ["Lapras", "Walrein", "Mamoswine", "Froslass", "Abomasnow", "Glaceon", "Cloyster", "Weavile"],
      size: [6, 6]
    }
  },
  ElectricEliteFourTeam: {
    messages: [
      {
        opening: "Time to get a little amped.",
        win: "Ya got the vibe, but not quite the beat yet.",
        lose: "ey, now you’ve got it. well done.",
      },
      {
        opening: "Time for a little electric jamming.",
        win: "Aw ya dropped the beat. It’s fine, give it another go.",
        lose: "Now that was electric.",
      },
    ],
    type: "Elite Four Member",
    names: ["Rey"],
    rate: 1000,
    function: "electric_elite",
    noob: {
      pokemon: ["elekid", "shinx", "voltorb", "chinchou", "rotom", "magnemite"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["voltorb", "electabuzz", "luxio", "rotom", "lanturn", "magneton"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Luxray", "Electrode", "Lanturn", "rotom", "electabuzz", "magneton"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Luxray", "Electrode", "Lanturn", "rotom", "electivire", "magnezone"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Luxray", "Electrode", "Lanturn", "rotom", "electivire", "magnezone"],
      size: [5, 6]
    }
  },
  DarkGymTeam: {
    messages: [
      {
        opening:
          "Darkness is my ally, and it will consume you. Are you ready for it?",
        win: "You couldn't escape the shadows... victory belongs to me.",
        lose: "It seems the darkness wasn't enough... I underestimated you.",
      },
      {
        opening:
          "The night has no mercy. Prepare yourself to face my true power.",
        win: "The shadows have swallowed you whole. My victory is inevitable.",
        lose: "You've shown courage, but even the strongest light can't defeat the darkness forever.",
      },
    ],
    type: "Dark Gym Leader",
    names: ["Ghost"],
    rate: 1000,
    function: "dark_gym",
    noob: {
      pokemon: ["Poochyena", "Seedot", "Carvanha", "Sneasel", "Houndour", "Mightyena"],
      size: [2, 2]
    },
    easy: {
      pokemon: ["Murkrow", "Nuzleaf", "Houndoom", "Shiftry", "Sableye", "Cacturne"],
      size: [3, 3]
    },
    medium: {
      pokemon: ["Weavile", "Honchkrow", "Sharpedo", "Drapion", "Spiritomb", "Umbreon"],
      size: [4, 4]
    },
    hard: {
      pokemon: ["Tyranitar", "Sableye", "Skuntank", "Honchkrow", "Weavile", "Drapion", "Absol"],
      size: [5, 5]
    },
    master: {
      pokemon: ["Tyranitar", "Umbreon", "Spiritomb", "Honchkrow", "Weavile", "Houndoom", "Absol", "Sableye"],
      size: [6, 6]
    }
  },
  WaterGymTeam: {
    messages: [
      {
        opening:
          "The sea tests everyone who dares to cross it. Let’s see if you can stay afloat when the pressure rises.",
        win: "Not everyone’s cut out for the open waters. You sank faster than I expected.",
        lose: "Well now... didn’t expect you to hold your course so steady.",
      },
      {
        opening:
          "The sea doesn’t care how strong you think you are. Show me if you can stand your ground when the tide turns.",
        win: "You hesitated. That’s all it takes for the water to swallow you whole.",
        lose: "...You didn’t flinch. That’s rare.",
      },
    ],
    type: "Water Gym Leader",
    names: ["Selka"],
    rate: 1000,
    function: "water_gym",
    noob: {
      pokemon: ["Magikarp", "Lotad", "Carvanha", "Tentacool", "Corphish", "Vaporeon", "Clamperl", "Horsea"],
      size: [2, 2]
    },
    easy: {
      pokemon: ["Gyarados", "Lombre", "Carvanha", "Tentacool", "Corphish", "Vaporeon", "Huntail", "Horsea"],
      size: [3, 3]
    },
    medium: {
      pokemon: ["Gyarados", "Ludicolo", "Sharpedo", "Tentacruel", "Crawdaunt", "Vaporeon", "Huntail", "Seadra"],
      size: [4, 4]
    },
    hard: {
      pokemon: ["Gyarados", "Ludicolo", "Sharpedo", "Tentacruel", "Crawdaunt", "Vaporeon", "Huntail", "Kingdra"],
      size: [5, 5]
    },
    master: {
      pokemon: ["Gyarados", "Ludicolo", "Sharpedo", "Tentacruel", "Crawdaunt", "Vaporeon", "Huntail", "Kingdra"],
      size: [6, 6]
    }
  },
  RockGymTeam: {
    messages: [
      {
        opening: "Stone against stone — let’s see if you can break through.",
        win: "Strategy, patience, and solid defense always win.",
        lose: "You’ve chipped away at my walls… well done.",
      },
      {
        opening: "I am Ninjallo, the Rock that stands unshaken.",
        win: "Like a landslide, I crush what stands before me.",
        lose: "Even mountains can fall — you’ve earned this victory.",
      },
    ],
    type: "Rock Gym Leader",
    names: ["Gym Leader Ninjallo"],
    rate: 1000,
    function: "rock_gym",
    noob: {
      pokemon: ["Geodude", "Onix", "Rhyhorn", "Kabuto", "Omanyte", "Aron"],
      size: [2, 2]
    },
    easy: {
      pokemon: ["Graveler", "Rhydon", "Lairon", "Nosepass", "Lileep", "Anorith"],
      size: [3, 3]
    },
    medium: {
      pokemon: ["Golem", "Omastar", "Kabutops", "Aerodactyl", "Cradily", "Armaldo"],
      size: [4, 4]
    },
    hard: {
      pokemon: ["Aggron", "Bastiodon", "Rampardos", "Relicanth", "Probopass", "Magcargo"],
      size: [5, 5]
    },
    master: {
      pokemon: ["Tyranitar", "Rhyperior", "Aerodactyl", "Cradily", "Rampardos", "Aggron"],
      size: [6, 6]
    }
  },
  GrassGymTeam: {
    messages: [
      {
        opening:
          "I hope you don’t mind pollen — things tend to bloom when I battle. Let’s see if your team can thrive among the wildflowers.",
        win: "Like a young sprout in the shade... You just weren’t ready to grow here yet. That’s okay!",
        lose: "Oh! You bloomed so beautifully out there. May you shine onto others!",
      },
      {
        opening:
          "Some think flowers are fragile… but they grow through stone and storm. Let’s see if you’ve got that same strength in you.",
        win: "Even the strongest vines can be cut down if they grow too fast. Take your time next time.",
        lose: "Oh... you were rooted. Steady. I can’t help but admire that.",
      },
    ],
    type: "Grass Gym Leader",
    names: ["Clover"],
    rate: 1000,
    function: "grass_gym",
    noob: {
      pokemon: ["Oddish", "Oddish", "Shroomish", "Hoppip", "Tropius", "Chikorita", "Leafeon", "Exeggcute"],
      size: [2, 2]
    },
    easy: {
      pokemon: ["Gloom", "Gloom", "Breloom", "Skiploom", "Tropius", "Bayleef", "Leafeon", "Exeggutor"],
      size: [3, 3]
    },
    medium: {
      pokemon: ["Vileplume", "Bellossom", "Breloom", "Jumpluff", "Tropius", "Meganium", "Leafeon", "Exeggutor"],
      size: [4, 4]
    },
    hard: {
      pokemon: ["Vileplume", "Bellossom", "Breloom", "Jumpluff", "Tropius", "Meganium", "Leafeon", "Exeggutor"],
      size: [5, 5]
    },
    master: {
      pokemon: ["Vileplume", "Bellossom", "Breloom", "Jumpluff", "Tropius", "Meganium", "Leafeon", "Exeggutor"],
      size: [6, 6]
    }
  },
  FlyingGymTeam: {
    messages: [
      {
        opening: "I hope you’re ready for this sky high battle",
        win: "Looks like you can’t handle the power of flying pokemon",
        lose: "Looks like I’ve been grounded .",
      },
    ],
    type: "Flying Gym Leader",
    names: ["huskylord"],
    rate: 1000,
    function: "flying_gym",
    noob: {
      pokemon: ["pidgey", "spearow", "starly", "hoothoot", "ledyba", "tallow"],
      size: [2, 2]
    },
    easy: {
      pokemon: ["pidgey", "spearow", "starly", "hoothoot", "ledyba", "tallow"],
      size: [3, 3]
    },
    medium: {
      pokemon: ["pidgeotto", "fearow", "staravia", "noctowl", "gyarados", "swellow"],
      size: [4, 4]
    },
    hard: {
      pokemon: ["pidgeot", "arodytacl", "staraptor", "charizard", "salamance", "gyarados"],
      size: [5, 5]
    },
    master: {
      pokemon: ["pidgeot", "arrodacytl", "staraptor", "Charizard", "salamance", "gyarados"],
      size: [6, 6]
    }
  },
  TrainerRaeh: {
    messages: [
      {
        opening: "Hope this will be as fun for you as it is for me!",
        win: "You tried, that's what matters!",
        lose: "I'll have to try harder next time!",
      },
      {
        opening: "Let's see what you've got!",
        win: "Is that what you call strategy?",
        lose: "Oof- Good job!",
      },
    ],
    type: "Trainer",
    names: ["Raeh"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Sneasel", "Bagon", "Litten", "Bronzor"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Sneasel", "Shelgon", "Bronzor", "Torracat", "Primeape"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Weavile", "Shelgon", "Bronzong", "Incineroar", "Primeape", "Gastrodon"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Weavile", "Salamence", "Bronzong", "Incineroar", "Annihilape", "Gastrodon", "Vikavolt"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Weavile", "Salamence", "Metagross", "Incineroar", "Annihilape", "Gastrodon", "Vikavolt", "Metagross"],
      size: [5, 6]
    }
  },
  DragonGymTeam: {
    messages: [
      {
        opening:
          "Behold, The Sanctuary of Dragons. For I will defeat you fair and square. DESTROY THEM THOSE PESTS MY DRAGOONS!!",
        win: "See? My dragoons shan’t disappoint me.",
        lose: "AH YOU DEFEATED THEM ALL?? Well I promised you rewards, well played trainee now move along.",
      },
      {
        opening:
          "Ah- you’re here! Been waiting for you, now let the excitement begin.. more my beautiful dragons will stomp on your naughtlings!",
        win: "KYAHAHAHA, I knew you’d be defeated.",
        lose: "GAH, YOU DARE TO WIN AGAINST ME? Well maybe next time I shouldn’t have gone harsher, oh also heres you reward- now move along trainee.",
      },
    ],
    type: "Dragon Gym Leader",
    names: ["Jessica"],
    rate: 1000,
    function: "dragon_gym",
    noob: {
      pokemon: ["Vibrava", "Seadra", "Bagon", "Charmander", "Dragonair", "Gible", "Swalbu"],
      size: [2, 2]
    },
    easy: {
      pokemon: ["Vibrava", "Gyarados", "Shelgon", "Charmeleon", "Dragonair", "Gible", "Swalbu"],
      size: [3, 3]
    },
    medium: {
      pokemon: ["Shelgon", "Flygon", "Aerodactyl", "Altaria", "Gabite", "Charmeleon", "Dragonair", "Kingdra"],
      size: [4, 4]
    },
    hard: {
      pokemon: ["Flygon", "Aerodactyl", "Salamence", "Charizard", "Kingdra", "Dragonite", "Garchomp"],
      size: [5, 5]
    },
    master: {
      pokemon: ["Flygon", "Aerodactyl", "Salamence", "Charizard", "Kingdra", "Dragonite", "Altaria", "Garchomp"],
      size: [6, 6]
    }
  },
  AceTrainerMale: {
    messages: [
      {
        opening: "Let’s see if your team can keep up with mine.",
        win: "Told you — strategy beats strength.",
        lose: "Not bad... You’ve trained well.",
      },
      {
        opening: "I study every angle. You ready?",
        win: "That was calculated — and clean.",
        lose: "I underestimated you. Well played.",
      },
    ],
    type: "Ace Trainer",
    names: ["Brandon", "Derek", "Nolan", "Felix", "Victor", "Damien"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Growlithe", "Magikarp", "Abra", "Dratini", "Shinx", "Nidoran_M"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Kadabra", "Dragonair", "Luxio", "Nidorino", "Gabite", "Machoke", "Fraxure"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Lapras", "Arcanine", "Gyarados", "Blissey", "Rhydon", "Lucario", "Exeggutor"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Arcanine", "Gyarados", "Blissey", "Rhydon", "Lucario", "Exeggutor", "Vaporeon", "Espeon"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Alakazam", "Dragonite", "Luxray", "Nidoking", "Garchomp", "Machamp", "Metagross", "Charizard"],
      size: [5, 6]
    }
  },

  AceTrainerFemale: {
    messages: [
      {
        opening: "I’ve trained my team to perfection!",
        win: "Experience and elegance — unbeatable!",
        lose: "Hmph... guess I still have more to learn.",
      },
      {
        opening: "Ready to face my perfectly balanced team?",
        win: "That’s how a real Ace Trainer wins!",
        lose: "You read me like a book... impressive.",
      },
    ],
    type: "Ace Trainer",
    names: ["Aria", "Sophia", "Clara", "Luna", "Nina", "Sasha"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Ralts", "Eevee", "Staryu", "Dratini", "Shinx", "Clefairy"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Kirlia", "Luxio", "Vaporeon", "Staravia", "Gabite", "Nidorina"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Gardevoir", "Luxray", "Altaria", "Floatzel", "Espeon", "Nidoqueen"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Gardevoir", "Altaria", "Luxray", "Floatzel", "Nidoqueen", "Vaporeon", "Blissey", "Dragonair"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Gardevoir", "Altaria", "Luxray", "Milotic", "Espeon", "Dragonite", "Nidoqueen", "Togekiss"],
      size: [5, 6]
    }
  },

  BackpackerMale: {
    messages: [
      {
        opening: "You can learn a lot traveling the world with Pokémon.",
        win: "Another story for the road!",
        lose: "Guess I took a wrong turn this time.",
      },
      {
        opening: "Let’s see how you handle a battle on the move!",
        win: "Looks like my travels paid off!",
        lose: "You’ve got some solid footing!",
      },
    ],
    type: "Backpacker",
    names: ["Liam", "Trent", "Owen", "Casey", "Riley"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Sandshrew", "Hoothoot", "Numel", "Teddiursa", "Zubat", "Machop"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Graveler", "Golbat", "Noctowl", "Camerupt", "Ursaring", "Machoke"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Golem", "Torkoal", "Noctowl", "Hariyama", "Donphan", "Camerupt"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Golem", "Hariyama", "Torkoal", "Donphan", "Noctowl", "Ursaring", "Camerupt"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Golem", "Donphan", "Hariyama", "Torkoal", "Noctowl", "Ursaring", "Camerupt", "Flygon"],
      size: [5, 6]
    }
  },

  BackpackerFemale: {
    messages: [
      {
        opening: "The road teaches more than any classroom!",
        win: "Another victory for my travel journal!",
        lose: "Looks like I’ll learn from this one.",
      },
      {
        opening: "A battle’s just another part of the adventure!",
        win: "Nothing beats the thrill of the open road!",
        lose: "Maybe I need a map after all.",
      },
    ],
    type: "Backpacker",
    names: ["Tina", "Nora", "Lucy", "Ava", "Sierra"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Hoothoot", "Geodude", "Numel", "Shinx", "Machop", "Ponyta"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Noctowl", "Luxio", "Camerupt", "Graveler", "Machoke", "Rapidash"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Noctowl", "Luxray", "Torkoal", "Donphan", "Hariyama", "Rapidash"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Noctowl", "Luxray", "Torkoal", "Hariyama", "Rapidash", "Donphan", "Camerupt"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Noctowl", "Luxray", "Flygon", "Hariyama", "Rapidash", "Donphan", "Camerupt", "Torkoal"],
      size: [5, 6]
    }
  },
  Beauty: {
    messages: [
      {
        opening: "Battles are all about elegance and confidence!",
        win: "Grace always triumphs.",
        lose: "My hair’s still perfect — that’s a win!",
      },
      {
        opening: "Let’s see if your style matches your strength!",
        win: "Fabulous and flawless as always!",
        lose: "Guess looks aren’t everything.",
      },
    ],
    type: "Beauty",
    names: ["Lila", "Tiffany", "Clara", "Sabrina", "Vanessa"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Clefairy", "Skitty", "Goldeen", "Roselia", "Pikachu", "Jigglypuff"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Wigglytuff", "Delcatty", "Roselia", "Lombre", "Luvdisc", "Minun"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Milotic", "Gardevoir", "Roserade", "Raichu", "Wigglytuff", "Clefable"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Milotic", "Roserade", "Raichu", "Clefable", "Lopunny", "Gardevoir", "Delcatty", "Wigglytuff"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Milotic", "Gardevoir", "Roserade", "Lopunny", "Raichu", "Clefable", "Wigglytuff", "Jynx"],
      size: [5, 6]
    }
  },

  BlackBeltMale: {
    messages: [
      {
        opening: "My fists are ready, my Pokémon are too!",
        win: "Another victory earned with discipline!",
        lose: "I must train harder...",
      },
      {
        opening: "Let’s see your technique in action!",
        win: "Strength and focus — unbeatable!",
        lose: "Even masters stumble sometimes.",
      },
    ],
    type: "Black Belt",
    names: ["Ken", "Ryu", "Toshi", "Hiro", "Tak"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Machop", "Mankey", "Meditite", "Tyrogue", "Makuhita", "Hitmonlee"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Machoke", "Primeape", "Hariyama", "Hitmonchan", "Hitmontop", "Meditite"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Machamp", "Primeape", "Hitmonlee", "Hitmonchan", "Hariyama", "Gallade"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Machamp", "Gallade", "Hariyama", "Hitmontop", "Primeape", "Blaziken", "Medicham"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Machamp", "Gallade", "Hariyama", "Blaziken", "Medicham", "Lucario", "Hitmontop", "Primeape"],
      size: [5, 6]
    }
  },

  BlackBeltFemale: {
    messages: [
      {
        opening: "Power comes from within — and from my Pokémon!",
        win: "Discipline wins the day!",
        lose: "That was a fair match.",
      },
      {
        opening: "Let’s test your fighting spirit!",
        win: "That’s true form and balance!",
        lose: "You’ve got more strength than I thought.",
      },
    ],
    type: "Black Belt",
    names: ["Akira", "Yumi", "Sana", "Rei", "Mika"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Machop", "Mankey", "Meditite", "Makuhita", "Tyrogue", "Riolu"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Machoke", "Primeape", "Meditite", "Hitmonlee", "Hitmonchan", "Lucario"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Machamp", "Primeape", "Lucario", "Hitmontop", "Medicham", "Hariyama"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Machamp", "Lucario", "Medicham", "Hariyama", "Hitmontop", "Primeape", "Gallade"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Lucario", "Machamp", "Medicham", "Gallade", "Hariyama", "Primeape", "Hitmontop", "Hitmonchan"],
      size: [5, 6]
    }
  },

  BreederMale: {
    messages: [
      {
        opening: "Every battle helps me understand my Pokémon better!",
        win: "Hard work and care always pay off!",
        lose: "They did their best — that’s what matters.",
      },
      {
        opening: "Healthy Pokémon are happy Pokémon!",
        win: "All that training really shows!",
        lose: "Maybe I need to spend more time at the ranch.",
      },
    ],
    type: "Breeder",
    names: ["Ellie", "May", "Hannah", "Lara", "Molly"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Cleffa", "Igglybuff", "Azurill", "Togepi", "Pichu", "Budew"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Clefairy", "Jigglypuff", "Marill", "Togetic", "Roselia", "Pikachu"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Clefable", "Wigglytuff", "Azumarill", "Togetic", "Roserade", "Raichu"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Clefable", "Wigglytuff", "Azumarill", "Togekiss", "Roserade", "Raichu", "Blissey", "Eevee"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Clefable", "Wigglytuff", "Togekiss", "Roserade", "Raichu", "Blissey", "Vaporeon", "Umbreon"],
      size: [5, 6]
    }
  },

  BreederFemale: {
    messages: [
      {
        opening: "Nurturing Pokémon is my life’s joy!",
        win: "They grow stronger with love!",
        lose: "They tried their hardest — I’m proud!",
      },
      {
        opening: "A battle’s just another way to bond!",
        win: "Such happy, healthy Pokémon!",
        lose: "Maybe I spoiled them too much.",
      },
    ],
    type: "Breeder",
    names: ["Ellie", "May", "Hannah", "Lara", "Molly"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Cleffa", "Igglybuff", "Azurill", "Togepi", "Pichu", "Budew"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Clefairy", "Jigglypuff", "Marill", "Togetic", "Roselia", "Pikachu"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Clefable", "Wigglytuff", "Azumarill", "Togetic", "Roserade", "Raichu"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Clefable", "Wigglytuff", "Azumarill", "Togekiss", "Roserade", "Raichu", "Blissey", "Eevee"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Clefable", "Wigglytuff", "Togekiss", "Roserade", "Raichu", "Blissey", "Vaporeon", "Umbreon"],
      size: [5, 6]
    }
  },
  BugCatcherMale: {
    messages: [
      {
        opening: "Bugs are small but mighty!",
        win: "My team of crawlers wins again!",
        lose: "Guess I need to catch some stronger ones.",
      },
      {
        opening: "The secret to victory? Never underestimate a Bug Pokémon!",
        win: "You got stung!",
        lose: "You squashed my hopes this time.",
      },
    ],
    type: "Bug Catcher",
    names: ["Timmy", "Joey", "Andy", "Sam", "Kyle"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Caterpie", "Weedle", "Wurmple", "Kricketot", "Nincada", "Surskit"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Metapod", "Kakuna", "Silcoon", "Cascoon", "Kricketune", "Dustox"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Butterfree", "Beedrill", "Masquerain", "Beautifly", "Ariados", "Pinsir"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Butterfree", "Beedrill", "Masquerain", "Heracross", "Pinsir", "Venomoth", "Scyther", "Ariados"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Butterfree", "Beedrill", "Masquerain", "Heracross", "Pinsir", "Venomoth", "Scizor", "Yanmega"],
      size: [5, 6]
    }
  },

  BugCatcherFemale: {
    messages: [
      {
        opening: "I love Bug Pokémon — they’re so cute and strong!",
        win: "My little bugs did it!",
        lose: "Aww, I’ll raise them better next time.",
      },
      {
        opening: "Ready to see the beauty of Bug-types?",
        win: "Told you they’re the best!",
        lose: "Even bugs have bad days.",
      },
    ],
    type: "Bug Catcher",
    names: ["Lily", "Anna", "Mia", "Sandy", "Faye"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Caterpie", "Wurmple", "Ledyba", "Spinarak", "Kricketot", "Weedle"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Metapod", "Silcoon", "Ledian", "Ariados", "Dustox", "Beautifly"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Butterfree", "Beautifly", "Ledian", "Venomoth", "Masquerain", "Beedrill"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Butterfree", "Beautifly", "Venomoth", "Masquerain", "Heracross", "Pinsir", "Scyther", "Beedrill"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Butterfree", "Beautifly", "Venomoth", "Heracross", "Pinsir", "Scizor", "Yanmega", "Beedrill"],
      size: [5, 6]
    }
  },

  ExpertMale: {
    messages: [
      {
        opening: "Let’s see if experience can overcome youth!",
        win: "Wisdom always wins the day.",
        lose: "Impressive — you’re no rookie!",
      },
      {
        opening: "My years of training won’t fail me now!",
        win: "Skill honed by time!",
        lose: "Looks like I’ve still got things to learn.",
      },
    ],
    type: "Expert",
    names: ["Walter", "Glen", "Harvey", "Clint", "Ernest"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Machop", "Growlithe", "Ponyta", "Sandshrew", "Poliwag", "Mankey"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Machoke", "Arcanine", "Rapidash", "Poliwhirl", "Primeape", "Graveler"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Machamp", "Arcanine", "Rapidash", "Poliwrath", "Donphan", "Lucario"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Machamp", "Arcanine", "Lucario", "Poliwrath", "Donphan", "Heracross", "Gallade"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Machamp", "Arcanine", "Lucario", "Poliwrath", "Heracross", "Gallade", "Garchomp", "Donphan"],
      size: [5, 6]
    }
  },

  ExpertFemale: {
    messages: [
      {
        opening: "Wisdom and grace — that’s the path to victory.",
        win: "Experience pays off again!",
        lose: "You’re sharper than I expected.",
      },
      {
        opening: "I’ve trained for years to perfect my craft.",
        win: "A perfect victory!",
        lose: "Perhaps I was too confident.",
      },
    ],
    type: "Expert",
    names: ["Irene", "Cora", "Daphne", "Marla", "Evelyn"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Machop", "Staryu", "Vulpix", "Eevee", "Poliwag", "Ponyta"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Machoke", "Starmie", "Ninetales", "Vaporeon", "Rapidash", "Primeape"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Machamp", "Starmie", "Ninetales", "Vaporeon", "Lucario", "Gardevoir"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Machamp", "Lucario", "Gardevoir", "Vaporeon", "Ninetales", "Gallade", "Donphan"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Machamp", "Lucario", "Gardevoir", "Gallade", "Vaporeon", "Ninetales", "Garchomp", "Donphan"],
      size: [5, 6]
    }
  },

  FisherMale: {
    messages: [
      {
        opening: "Nothing beats the thrill of a bite on the line!",
        win: "Another big catch for the record!",
        lose: "Guess the fish got away this time.",
      },
      {
        opening: "Let’s see how you handle a true water team!",
        win: "Smooth sailing!",
        lose: "You reeled me in this time.",
      },
    ],
    type: "Fisher",
    names: ["Bert", "Frank", "Tom", "Eddie", "Joe"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Magikarp", "Goldeen", "Tentacool", "Poliwag", "Remoraid", "Chinchou"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Seaking", "Tentacruel", "Poliwhirl", "Octillery", "Lanturn", "Gyarados"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Seaking", "Tentacruel", "Poliwrath", "Octillery", "Lanturn", "Gyarados", "Whiscash"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Poliwrath", "Tentacruel", "Gyarados", "Whiscash", "Lanturn", "Mantine", "Seaking", "Octillery"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Poliwrath", "Tentacruel", "Gyarados", "Whiscash", "Lanturn", "Mantine", "Kingdra", "Seaking"],
      size: [5, 6]
    }
  },

  FisherFemale: {
    messages: [
      {
        opening: "Fishing’s not just for guys, you know!",
        win: "That’s a perfect catch!",
        lose: "You out-fished me this time.",
      },
      {
        opening: "These waters are my battlefield!",
        win: "Hook, line, and sinker!",
        lose: "You reeled me right in.",
      },
    ],
    type: "Fisher",
    names: ["Marina", "Pearl", "Lana", "Shelly", "Rina"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Goldeen", "Chinchou", "Horsea", "Remoraid", "Magikarp", "Krabby"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Seaking", "Lanturn", "Seadra", "Octillery", "Kingler", "Poliwhirl"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Seaking", "Lanturn", "Kingdra", "Octillery", "Kingler", "Poliwrath"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Kingdra", "Lanturn", "Octillery", "Kingler", "Poliwrath", "Whiscash", "Mantine", "Seaking"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Kingdra", "Lanturn", "Octillery", "Poliwrath", "Whiscash", "Mantine", "Milotic", "Seaking"],
      size: [5, 6]
    }
  },

  Gentleman: {
    messages: [
      {
        opening: "A battle is the true mark of refinement.",
        win: "Splendid performance, old chap!",
        lose: "Well played, you’ve earned my respect.",
      },
      {
        opening: "Care for a civil duel?",
        win: "Marvelous display of skill!",
        lose: "Good heavens, you bested me!",
      },
    ],
    type: "Gentleman",
    names: ["Arthur", "Reginald", "Charles", "Edgar", "Henry"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Growlithe", "Meowth", "Magnemite", "Eevee", "Ponyta", "Voltorb"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Arcanine", "Persian", "Magneton", "Vaporeon", "Rapidash", "Electrode"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Arcanine", "Persian", "Jolteon", "Vaporeon", "Rapidash", "Magneton"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Arcanine", "Persian", "Jolteon", "Vaporeon", "Rapidash", "Magneton", "Ninetales", "Electrode"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Arcanine", "Persian", "Jolteon", "Vaporeon", "Rapidash", "Magneton", "Ninetales", "Electrode"],
      size: [5, 6]
    }
  },
  HikerMale: {
    messages: [
      {
        opening: "The mountain is my home and my battlefield!",
        win: "Solid as a rock!",
        lose: "Guess I slipped on some gravel.",
      },
      {
        opening: "You’ll need more than fancy moves to climb this challenge!",
        win: "Ha! You can’t topple a boulder!",
        lose: "Oof... guess I need to rest my legs.",
      },
    ],
    type: "Hiker",
    names: ["Cliff", "Rocky", "Dale", "Bruce", "Hank"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Geodude", "Onix", "Sandshrew", "Machop", "Nosepass", "Graveler"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Graveler", "Onix", "Machoke", "Sudowoodo", "Golem", "Steelix"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Golem", "Steelix", "Sudowoodo", "Machamp", "Donphan", "Graveler"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Golem", "Steelix", "Sudowoodo", "Machamp", "Donphan", "Probopass", "Graveler", "Rhydon"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Golem", "Steelix", "Sudowoodo", "Machamp", "Donphan", "Probopass", "Rhydon", "Gigalith"],
      size: [5, 6]
    }
  },

  HikerFemale: {
    messages: [
      {
        opening: "I love the mountains — time to show you their strength!",
        win: "Solid as bedrock!",
        lose: "Heh, you’re tougher than you look.",
      },
      {
        opening: "Let’s rumble! My Pokémon are built for this terrain!",
        win: "The earth itself fights with me!",
        lose: "You’ve got some serious endurance.",
      },
    ],
    type: "Hiker",
    names: ["Maya", "June", "Rita", "Erin", "Nina"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Geodude", "Sandshrew", "Onix", "Machop", "Larvitar", "Rhyhorn"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Graveler", "Onix", "Machoke", "Donphan", "Golem", "Rhydon"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Golem", "Steelix", "Donphan", "Machamp", "Rhydon", "Sudowoodo"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Golem", "Steelix", "Donphan", "Machamp", "Rhydon", "Sudowoodo", "Graveler", "Probopass"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Golem", "Steelix", "Donphan", "Machamp", "Rhydon", "Sudowoodo", "Probopass", "Rampardos"],
      size: [5, 6]
    }
  },
  ModelMale: {
    messages: [
      {
        opening: "Battles are just another runway for me.",
        win: "That’s how you strike a winning pose.",
        lose: "Ugh, that wasn’t my best angle.",
      },
      {
        opening: "Time to show off both fashion and skill!",
        win: "Flawless performance!",
        lose: "Guess my look couldn’t distract you.",
      },
    ],
    type: "Model",
    names: ["Andre", "Leo", "Julian", "Marco", "Damien"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Skitty", "Roselia", "Beautifly", "Pikachu", "Smeargle", "Kirlia"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Delcatty", "Roserade", "Raichu", "Masquerain", "Gardevoir", "Lopunny"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Milotic", "Gardevoir", "Lopunny", "Raichu", "Roserade", "Altaria"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Milotic", "Gardevoir", "Lopunny", "Roserade", "Raichu", "Altaria", "Clefable", "Jynx"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Milotic", "Gardevoir", "Lopunny", "Roserade", "Raichu", "Altaria", "Clefable", "Togekiss"],
      size: [5, 6]
    }
  },

  ModelFemale: {
    messages: [
      {
        opening: "Time to show that beauty and strength go hand in hand!",
        win: "Perfection, darling!",
        lose: "Even I can’t win every photoshoot.",
      },
      {
        opening: "You’ll regret underestimating a model!",
        win: "Graceful as ever.",
        lose: "Guess you stole the spotlight this time.",
      },
    ],
    type: "Model",
    names: ["Lila", "Chloe", "Aria", "Sienna", "Tanya"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Skitty", "Roselia", "Eevee", "Clefairy", "Pikachu", "Hoppip"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Delcatty", "Roserade", "Clefable", "Raichu", "Skiploom", "Altaria"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Milotic", "Roserade", "Clefable", "Raichu", "Altaria", "Lopunny"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Milotic", "Roserade", "Clefable", "Raichu", "Altaria", "Lopunny", "Togekiss", "Gardevoir"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Milotic", "Roserade", "Clefable", "Raichu", "Altaria", "Lopunny", "Togekiss", "Gardevoir"],
      size: [5, 6]
    }
  },

  MusicianMale: {
    messages: [
      {
        opening: "Let’s make this battle rock!",
        win: "That hit all the right notes!",
        lose: "Ouch, that was a sour chord.",
      },
      {
        opening: "Feel the rhythm of victory!",
        win: "Encore!",
        lose: "You threw off my tempo.",
      },
    ],
    type: "Musician",
    names: ["Jake", "Ryan", "Theo", "Eli", "Chris"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Whismur", "Jigglypuff", "Chatot", "Kricketot", "Clefairy", "Loudred"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Exploud", "Chatot", "Kricketune", "Clefable", "Loudred", "Vibrava"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Exploud", "Chatot", "Kricketune", "Altaria", "Clefable", "Noctowl"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Exploud", "Chatot", "Kricketune", "Altaria", "Clefable", "Noctowl", "Lopunny", "Togetic"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Exploud", "Chatot", "Kricketune", "Altaria", "Clefable", "Lopunny", "Togekiss", "Noctowl"],
      size: [5, 6]
    }
  },

  MusicianFemale: {
    messages: [
      {
        opening: "Let’s turn this battle into a duet!",
        win: "Music to my ears!",
        lose: "Guess I missed a beat.",
      },
      {
        opening: "Get ready for my rhythm to rock you!",
        win: "Encore-worthy performance!",
        lose: "You stole the show this time.",
      },
    ],
    type: "Musician",
    names: ["Melody", "Harmony", "Clara", "Rina", "Luna"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Whismur", "Jigglypuff", "Clefairy", "Chatot", "Kricketot", "Igglybuff"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Loudred", "Chatot", "Clefable", "Kricketune", "Altaria", "Wigglytuff"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Exploud", "Altaria", "Clefable", "Kricketune", "Lopunny", "Wigglytuff"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Exploud", "Altaria", "Clefable", "Kricketune", "Lopunny", "Wigglytuff", "Togetic", "Noctowl"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Exploud", "Altaria", "Clefable", "Kricketune", "Lopunny", "Wigglytuff", "Togekiss", "Noctowl"],
      size: [5, 6]
    }
  },

  PokeKidMale: {
    messages: [
      {
        opening: "You ready? My Pokémon are awesome!",
        win: "Told ya I’m super strong!",
        lose: "Aww, I almost had you!",
      },
      {
        opening: "Watch me and my team go!",
        win: "That was amazing!",
        lose: "Maybe next time…",
      },
    ],
    type: "Poké Kid",
    names: ["Max", "Tommy", "Ben", "Liam", "Evan"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Pichu", "Eevee", "Togepi", "Budew", "Magby", "Azurill"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Pikachu", "Vaporeon", "Roselia", "Togetic", "Magmar", "Marill"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Raichu", "Flareon", "Roserade", "Togetic", "Magmar", "Azumarill"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Raichu", "Flareon", "Roserade", "Togetic", "Magmar", "Azumarill", "Jolteon", "Vaporeon"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Raichu", "Flareon", "Roserade", "Togekiss", "Magmortar", "Azumarill", "Jolteon", "Vaporeon"],
      size: [5, 6]
    }
  },

  PokeKidFemale: {
    messages: [
      {
        opening: "Let’s have a fun battle!",
        win: "Yay! We did it!",
        lose: "Aw, I lost... but it was fun!",
      },
      {
        opening: "I trained so hard for this!",
        win: "Hehe, that was awesome!",
        lose: "I still had fun though!",
      },
    ],
    type: "Poké Kid",
    names: ["Amy", "Molly", "Ella", "Lily", "Zoe"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Pichu", "Eevee", "Togepi", "Azurill", "Budew", "Magby"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Pikachu", "Espeon", "Togetic", "Marill", "Roselia", "Vulpix"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Raichu", "Vaporeon", "Roserade", "Togetic", "Ninetales", "Azumarill"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Raichu", "Vaporeon", "Roserade", "Togekiss", "Ninetales", "Azumarill", "Espeon", "Jolteon"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Raichu", "Vaporeon", "Roserade", "Togekiss", "Ninetales", "Azumarill", "Espeon", "Jolteon"],
      size: [5, 6]
    }
  },

  PokemonBreederMale: {
    messages: [
      {
        opening: "Raising strong Pokémon is what I do best!",
        win: "Healthy Pokémon make for strong ones!",
        lose: "Maybe I need to give them more time.",
      },
      {
        opening: "Each one of my Pokémon has been raised with love!",
        win: "Love and care always win!",
        lose: "They’ll grow from this loss.",
      },
    ],
    type: "Pokémon Breeder",
    names: ["Evan", "Luke", "Josh", "Mason", "Kyle"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Cleffa", "Igglybuff", "Azurill", "Togepi", "Budew", "Pichu"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Clefairy", "Jigglypuff", "Marill", "Roselia", "Togetic", "Pikachu"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Clefable", "Wigglytuff", "Azumarill", "Roserade", "Togetic", "Raichu"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Clefable", "Wigglytuff", "Azumarill", "Roserade", "Togekiss", "Raichu", "Blissey", "Eevee"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Clefable", "Wigglytuff", "Azumarill", "Roserade", "Togekiss", "Raichu", "Blissey", "Umbreon"],
      size: [5, 6]
    }
  },

  PokemonBreederFemale: {
    messages: [
      {
        opening: "Every Pokémon deserves love and care!",
        win: "They fought their hearts out!",
        lose: "It’s okay — we’ll get stronger together!",
      },
      {
        opening: "My team and I share a special bond!",
        win: "That’s what true partnership looks like!",
        lose: "Our love just wasn’t enough this time.",
      },
    ],
    type: "Pokémon Breeder",
    names: ["Maya", "Holly", "Nina", "Grace", "Sasha"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Cleffa", "Igglybuff", "Azurill", "Budew", "Pichu", "Togepi"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Clefairy", "Jigglypuff", "Marill", "Roselia", "Togetic", "Pikachu"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Clefable", "Wigglytuff", "Azumarill", "Roserade", "Togetic", "Raichu"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Clefable", "Wigglytuff", "Azumarill", "Roserade", "Togekiss", "Raichu", "Blissey", "Eevee"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Clefable", "Wigglytuff", "Azumarill", "Roserade", "Togekiss", "Raichu", "Blissey", "Umbreon"],
      size: [5, 6]
    }
  },

  PoliceOfficerMale: {
    messages: [
      {
        opening: "Freeze! Let’s see your battle skills!",
        win: "Justice served!",
        lose: "You got me this time, citizen.",
      },
      {
        opening: "I enforce both the law and fair battles!",
        win: "Case closed!",
        lose: "I’ll let you off with a warning.",
      },
    ],
    type: "Police Officer",
    names: ["Chase", "Reed", "Grant", "Cole", "Mason"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Growlithe", "Machop", "Poochyena", "Poliwag", "Eevee", "Magnemite"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Arcanine", "Machoke", "Mightyena", "Poliwhirl", "Magneton", "Umbreon"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Arcanine", "Machoke", "Mightyena", "Poliwrath", "Magneton", "Umbreon"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Arcanine", "Machamp", "Mightyena", "Poliwrath", "Magneton", "Umbreon", "Lucario", "Jolteon"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Arcanine", "Machamp", "Mightyena", "Poliwrath", "Magnezone", "Umbreon", "Lucario", "Jolteon"],
      size: [5, 6]
    }
  },

  PoliceOfficerFemale: {
    messages: [
      {
        opening: "Stop right there! Let’s battle fair and square!",
        win: "Justice wins again!",
        lose: "I’ll get you next time, lawbreaker!",
      },
      {
        opening: "You can’t escape the law or a fair fight!",
        win: "Another case closed!",
        lose: "You fought honorably.",
      },
    ],
    type: "Police Officer",
    names: ["Jenny", "Kate", "Ivy", "Tess", "Luna"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Growlithe", "Machop", "Poochyena", "Magnemite", "Eevee", "Poliwag"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Arcanine", "Machoke", "Mightyena", "Magneton", "Poliwhirl", "Espeon"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Arcanine", "Machoke", "Mightyena", "Poliwrath", "Magneton", "Espeon"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Arcanine", "Machamp", "Mightyena", "Poliwrath", "Magneton", "Espeon", "Lucario", "Jolteon"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Arcanine", "Machamp", "Mightyena", "Poliwrath", "Magnezone", "Espeon", "Lucario", "Jolteon"],
      size: [5, 6]
    }
  },
  RisingStarMale: {
    messages: [
      {
        opening: "I’m on my way to the top!",
        win: "See that? That’s my rising potential!",
        lose: "Guess I still have a ways to go.",
      },
      {
        opening: "I’ll prove I’ve got star quality!",
        win: "That’s how future champions battle!",
        lose: "You outshined me this time.",
      },
    ],
    type: "Rising Star",
    names: ["Leo", "Ethan", "Cameron", "Dylan", "Blake"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Shinx", "Machop", "Growlithe", "Poliwag", "Magnemite", "Ralts"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Luxio", "Machoke", "Arcanine", "Poliwhirl", "Magneton", "Kirlia"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Luxray", "Machamp", "Arcanine", "Poliwrath", "Magnezone", "Gardevoir"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Luxray", "Machamp", "Arcanine", "Poliwrath", "Magnezone", "Gardevoir", "Lucario", "Espeon"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Luxray", "Machamp", "Arcanine", "Poliwrath", "Magnezone", "Gardevoir", "Lucario", "Espeon"],
      size: [5, 6]
    }
  },

  RisingStarFemale: {
    messages: [
      {
        opening: "I’m going to be the next big name in Pokémon battles!",
        win: "That’s star power, baby!",
        lose: "You dimmed my shine... for now.",
      },
      {
        opening: "Let’s see whose star burns brighter!",
        win: "A brilliant victory!",
        lose: "Guess you’re the real star.",
      },
    ],
    type: "Rising Star",
    names: ["Hana", "Tess", "Riley", "Mira", "Ava"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Eevee", "Ponyta", "Shinx", "Machop", "Ralts", "Poliwag"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Flareon", "Luxio", "Kirlia", "Machoke", "Rapidash", "Poliwhirl"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Flareon", "Luxray", "Gardevoir", "Machamp", "Rapidash", "Poliwrath"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Flareon", "Luxray", "Gardevoir", "Machamp", "Rapidash", "Poliwrath", "Lucario", "Vaporeon"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Flareon", "Luxray", "Gardevoir", "Machamp", "Rapidash", "Poliwrath", "Lucario", "Vaporeon"],
      size: [5, 6]
    }
  },

  RoughneckMale: {
    messages: [
      {
        opening: "You ready to brawl? I don’t hold back!",
        win: "Yeah! That’s how it’s done!",
        lose: "Tch... got me good.",
      },
      {
        opening: "I’ll crush you and your team!",
        win: "That’s power, baby!",
        lose: "Heh, nice punch back.",
      },
    ],
    type: "Roughneck",
    names: ["Jack", "Brock", "Zane", "Troy", "Cole"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Machop", "Sandshrew", "Mankey", "Growlithe", "Zubat", "Poliwag"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Machoke", "Primeape", "Arcanine", "Golbat", "Poliwhirl", "Graveler"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Machamp", "Primeape", "Arcanine", "Crobat", "Poliwrath", "Golem"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Machamp", "Primeape", "Arcanine", "Crobat", "Poliwrath", "Golem", "Lucario", "Donphan"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Machamp", "Primeape", "Arcanine", "Crobat", "Poliwrath", "Golem", "Lucario", "Donphan"],
      size: [5, 6]
    }
  },

  RoughneckFemale: {
    messages: [
      {
        opening: "I fight just as hard as any guy out here!",
        win: "Tough enough for ya?",
        lose: "Heh, you’re pretty strong yourself.",
      },
      {
        opening: "Let’s see if you can handle this heat!",
        win: "That’s what I’m talkin’ about!",
        lose: "You got lucky this time.",
      },
    ],
    type: "Roughneck",
    names: ["Roxie", "Casey", "Nina", "Tara", "Jess"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Machop", "Growlithe", "Mankey", "Sandshrew", "Zubat", "Makuhita"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Machoke", "Primeape", "Arcanine", "Golbat", "Hariyama", "Poliwhirl"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Machamp", "Primeape", "Arcanine", "Crobat", "Hariyama", "Poliwrath"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Machamp", "Primeape", "Arcanine", "Crobat", "Hariyama", "Poliwrath", "Lucario", "Donphan"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Machamp", "Primeape", "Arcanine", "Crobat", "Hariyama", "Poliwrath", "Lucario", "Donphan"],
      size: [5, 6]
    }
  },

  SailorMale: {
    messages: [
      {
        opening: "The sea’s my life, and battle’s my game!",
        win: "That’s smooth sailing!",
        lose: "Guess my ship’s sunk.",
      },
      {
        opening: "Anchors aweigh — let’s battle!",
        win: "Fair winds and clear seas!",
        lose: "Storm got the better of me.",
      },
    ],
    type: "Sailor",
    names: ["Finn", "Ray", "Tom", "Gus", "Nolan"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Tentacool", "Poliwag", "Horsea", "Goldeen", "Chinchou", "Shellder"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Tentacruel", "Poliwhirl", "Seadra", "Seaking", "Lanturn", "Cloyster"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Tentacruel", "Poliwrath", "Kingdra", "Seaking", "Lanturn", "Cloyster"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Tentacruel", "Poliwrath", "Kingdra", "Seaking", "Lanturn", "Cloyster", "Mantine", "Whiscash"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Tentacruel", "Poliwrath", "Kingdra", "Seaking", "Lanturn", "Cloyster", "Mantine", "Milotic"],
      size: [5, 6]
    }
  },

  SailorFemale: {
    messages: [
      {
        opening: "Don’t think the sea’s only for men!",
        win: "Strong as the tide!",
        lose: "Guess my ship took on water.",
      },
      {
        opening: "I’ll sink your team like a stormy wave!",
        win: "That’s the power of the ocean!",
        lose: "You rode the waves better this time.",
      },
    ],
    type: "Sailor",
    names: ["Marina", "Rosa", "June", "Tess", "Piper"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Tentacool", "Poliwag", "Horsea", "Goldeen", "Chinchou", "Shellder"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Tentacruel", "Poliwhirl", "Seadra", "Seaking", "Lanturn", "Cloyster"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Tentacruel", "Poliwrath", "Kingdra", "Seaking", "Lanturn", "Cloyster"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Tentacruel", "Poliwrath", "Kingdra", "Seaking", "Lanturn", "Cloyster", "Mantine", "Whiscash"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Tentacruel", "Poliwrath", "Kingdra", "Seaking", "Lanturn", "Cloyster", "Mantine", "Milotic"],
      size: [5, 6]
    }
  },

  ScientistMale: {
    messages: [
      {
        opening: "Time to test my theories in battle!",
        win: "The data checks out — victory achieved!",
        lose: "Back to the lab for analysis...",
      },
      {
        opening: "Let’s run an experiment on your team!",
        win: "Hypothesis confirmed — I’m the best!",
        lose: "The results were... unexpected.",
      },
    ],
    type: "Scientist",
    names: ["Albert", "Felix", "Newton", "Miles", "Reed"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Magnemite", "Voltorb", "Grimer", "Koffing", "Porygon", "Ditto"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Magneton", "Electrode", "Muk", "Weezing", "Porygon2", "Hypno"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Magneton", "Electrode", "Muk", "Weezing", "Porygon2", "Hypno"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Magneton", "Electrode", "Muk", "Weezing", "Porygon2", "Hypno", "Alakazam", "Metang"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Magnezone", "Electrode", "Muk", "Weezing", "PorygonZ", "Alakazam", "Metagross", "Jolteon"],
      size: [5, 6]
    }
  },

  ScientistFemale: {
    messages: [
      {
        opening: "Let’s see if you can handle my experiments!",
        win: "The science of victory!",
        lose: "Hmm, unexpected result.",
      },
      {
        opening: "Battle data incoming!",
        win: "Hypothesis confirmed — success!",
        lose: "Error in calculations...",
      },
    ],
    type: "Scientist",
    names: ["Claire", "Ivy", "Nora", "Ellen", "Maya"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Magnemite", "Voltorb", "Grimer", "Koffing", "Porygon", "Ditto"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Magneton", "Electrode", "Muk", "Weezing", "Porygon2", "Hypno"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Magneton", "Electrode", "Muk", "Weezing", "Porygon2", "Hypno"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Magneton", "Electrode", "Muk", "Weezing", "Porygon2", "Hypno", "Alakazam", "Metang"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Magnezone", "Electrode", "Muk", "Weezing", "PorygonZ", "Alakazam", "Metagross", "Jolteon"],
      size: [5, 6]
    }
  },

  StudentMale: {
    messages: [
      {
        opening: "Time for a quick study session!",
        win: "Knowledge really is power!",
        lose: "Guess I didn’t study enough...",
      },
      {
        opening: "Let’s test what I’ve learned!",
        win: "A+ performance!",
        lose: "Ugh, that’s a failing grade.",
      },
    ],
    type: "Student",
    names: ["Eli", "Ryan", "Noah", "Caleb", "Owen"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Abra", "Magnemite", "Eevee", "Natu", "Ralts", "Porygon"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Kadabra", "Magneton", "Espeon", "Xatu", "Kirlia", "Porygon2"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Alakazam", "Magnezone", "Espeon", "Xatu", "Gardevoir", "Porygon2"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Alakazam", "Magnezone", "Espeon", "Xatu", "Gardevoir", "Porygon2", "Jolteon", "Hypno"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Alakazam", "Magnezone", "Espeon", "Xatu", "Gardevoir", "PorygonZ", "Jolteon", "Hypno"],
      size: [5, 6]
    }
  },

  StudentFemale: {
    messages: [
      {
        opening: "I’m studying to become a Pokémon Professor one day!",
        win: "Looks like my research paid off!",
        lose: "I’ll need to take more notes...",
      },
      {
        opening: "Class is in session — let’s battle!",
        win: "Perfect score!",
        lose: "Guess I still have some homework to do.",
      },
    ],
    type: "Student",
    names: ["Lila", "Nina", "Ari", "Sophia", "June"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Abra", "Magnemite", "Eevee", "Natu", "Ralts", "Porygon"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Kadabra", "Magneton", "Espeon", "Xatu", "Kirlia", "Porygon2"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Alakazam", "Magnezone", "Espeon", "Xatu", "Gardevoir", "Porygon2"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Alakazam", "Magnezone", "Espeon", "Xatu", "Gardevoir", "Porygon2", "Jolteon", "Hypno"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Alakazam", "Magnezone", "Espeon", "Xatu", "Gardevoir", "PorygonZ", "Jolteon", "Hypno"],
      size: [5, 6]
    }
  },
  SwimmerMale: {
    messages: [
      {
        opening: "The ocean’s my training ground!",
        win: "Like riding the perfect wave!",
        lose: "Guess I got swept away.",
      },
      {
        opening: "Let’s make a splash!",
        win: "Smooth sailing!",
        lose: "You’ve got some strong currents!",
      },
    ],
    type: "Swimmer",
    names: ["Kai", "Finn", "Leo", "Dylan", "Reef"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Poliwag", "Goldeen", "Tentacool", "Remoraid", "Horsea", "Chinchou"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Poliwhirl", "Seaking", "Tentacruel", "Octillery", "Seadra", "Lanturn"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Poliwrath", "Seaking", "Tentacruel", "Kingdra", "Octillery", "Lanturn"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Poliwrath", "Seaking", "Tentacruel", "Kingdra", "Lanturn", "Octillery", "Whiscash", "Mantine"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Poliwrath", "Tentacruel", "Kingdra", "Lanturn", "Milotic", "Whiscash", "Mantine", "Octillery"],
      size: [5, 6]
    }
  },

  SwimmerFemale: {
    messages: [
      {
        opening: "The sea keeps me calm and ready for anything!",
        win: "That was a perfect dive to victory!",
        lose: "I’m all washed up!",
      },
      {
        opening: "Let’s see who can swim circles around the other!",
        win: "I stayed afloat with style!",
        lose: "Guess I sank that one.",
      },
    ],
    type: "Swimmer",
    names: ["Maya", "Nina", "Coral", "Shelly", "Rina"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Goldeen", "Chinchou", "Poliwag", "Horsea", "Remoraid", "Shellder"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Seaking", "Lanturn", "Poliwhirl", "Seadra", "Octillery", "Cloyster"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Seaking", "Lanturn", "Poliwrath", "Kingdra", "Octillery", "Milotic"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Seaking", "Lanturn", "Poliwrath", "Kingdra", "Octillery", "Milotic", "Whiscash", "Mantine"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Seaking", "Lanturn", "Poliwrath", "Kingdra", "Octillery", "Milotic", "Whiscash", "Mantine"],
      size: [5, 6]
    }
  },

  VeteranMale: {
    messages: [
      {
        opening: "I’ve fought in more battles than you can count.",
        win: "Experience always prevails.",
        lose: "You’ve got the fire of youth!",
      },
      {
        opening: "Let’s see if your skills match your confidence!",
        win: "A veteran’s touch never fades.",
        lose: "Heh, guess I’m getting rusty.",
      },
    ],
    type: "Veteran",
    names: ["Grant", "Darius", "Victor", "Cole", "Logan"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Growlithe", "Machop", "Magnemite", "Poliwag", "Ralts", "Onix"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Arcanine", "Machoke", "Magneton", "Poliwhirl", "Kirlia", "Steelix"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Arcanine", "Machamp", "Magnezone", "Poliwrath", "Gardevoir", "Steelix"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Arcanine", "Machamp", "Magnezone", "Poliwrath", "Gardevoir", "Steelix", "Lucario", "Tyranitar"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Arcanine", "Machamp", "Magnezone", "Poliwrath", "Gardevoir", "Lucario", "Tyranitar", "Metagross"],
      size: [5, 6]
    }
  },

  VeteranFemale: {
    messages: [
      {
        opening: "I’ve been battling since before you were born!",
        win: "Wisdom triumphs again!",
        lose: "Guess I underestimated the new generation.",
      },
      {
        opening: "Let’s see if you can outsmart experience!",
        win: "Still sharp as ever!",
        lose: "I’ll admit, that was impressive.",
      },
    ],
    type: "Veteran",
    names: ["Lara", "Serena", "Mira", "Elise", "Dana"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Eevee", "Growlithe", "Poliwag", "Magnemite", "Ralts", "Machop"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Vaporeon", "Arcanine", "Poliwhirl", "Magneton", "Kirlia", "Machoke"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Vaporeon", "Arcanine", "Poliwrath", "Magnezone", "Gardevoir", "Machamp"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Vaporeon", "Arcanine", "Poliwrath", "Magnezone", "Gardevoir", "Machamp", "Lucario", "Metagross"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Vaporeon", "Arcanine", "Poliwrath", "Magnezone", "Gardevoir", "Lucario", "Metagross", "Tyranitar"],
      size: [5, 6]
    }
  },

  YoungsterMale: {
    messages: [
      {
        opening: "My shorts are comfy and easy to battle in!",
        win: "Haha, I told you I was cool!",
        lose: "Darn, I lost again...",
      },
      {
        opening: "Let’s battle! I’m not afraid!",
        win: "Woo! That was awesome!",
        lose: "You’re too strong!",
      },
    ],
    type: "Youngster",
    names: ["Joey", "Billy", "Max", "Ethan", "Tommy"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Rattata", "Pidgey", "Caterpie", "Weedle", "Zubat", "Ekans"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Raticate", "Pidgeotto", "Butterfree", "Beedrill", "Golbat", "Arbok"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Raticate", "Pidgeot", "Butterfree", "Beedrill", "Golbat", "Arbok"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Raticate", "Pidgeot", "Butterfree", "Beedrill", "Golbat", "Arbok", "Fearow", "Zubat"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Raticate", "Pidgeot", "Butterfree", "Beedrill", "Golbat", "Arbok", "Fearow", "Crobat"],
      size: [5, 6]
    }
  },

  YoungsterFemale: {
    messages: [
      {
        opening: "My Pokémon are super cute and super strong!",
        win: "Yay! I won!",
        lose: "Aw, maybe next time...",
      },
      {
        opening: "You’ll see how strong we are!",
        win: "That was awesome!",
        lose: "You’re really tough!",
      },
    ],
    type: "Youngster",
    names: ["Amy", "Lucy", "Mia", "Zoe", "Holly"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Sentret", "Pidgey", "Nidoran_F", "Zubat", "Caterpie", "Spearow"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Furret", "Pidgeotto", "Nidorina", "Golbat", "Butterfree", "Fearow"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Furret", "Pidgeot", "Nidoqueen", "Crobat", "Butterfree", "Fearow"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Furret", "Pidgeot", "Nidoqueen", "Crobat", "Butterfree", "Fearow", "Arbok", "Wigglytuff"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Furret", "Pidgeot", "Nidoqueen", "Crobat", "Butterfree", "Fearow", "Arbok", "Wigglytuff"],
      size: [5, 6]
    }
  },
  TeamRocketMale: {
    messages: [
      {
        opening: "You’re messing with Team Rocket, kid!",
        win: "Heh, that’s what you get for crossing us!",
        lose: "Boss ain’t gonna like this...",
      },
      {
        opening: "Prepare for trouble!",
        win: "Victory for Team Rocket!",
        lose: "Blasted again!",
      },
    ],
    type: "Team Rocket",
    names: ["James"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Zubat", "Rattata", "Ekans", "Grimer", "Koffing", "Meowth"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Golbat", "Raticate", "Arbok", "Muk", "Weezing", "Persian"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Golbat", "Raticate", "Arbok", "Muk", "Weezing", "Persian", "Houndoom"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Golbat", "Raticate", "Arbok", "Muk", "Weezing", "Persian", "Houndoom", "Crobat"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Golbat", "Raticate", "Arbok", "Muk", "Weezing", "Persian", "Houndoom", "Crobat"],
      size: [5, 6]
    }
  },

  TeamRocketFemale: {
    messages: [
      {
        opening: "You don’t stand a chance against Team Rocket!",
        win: "That’s what I call a clean heist!",
        lose: "How dare you ruin my plans!",
      },
      {
        opening: "Surrender now or prepare to lose!",
        win: "We always get what we want!",
        lose: "I’ll remember this!",
      },
    ],
    type: "Team Rocket",
    names: ["Jesse"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Zubat", "Rattata", "Ekans", "Grimer", "Koffing", "Meowth"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Golbat", "Raticate", "Arbok", "Muk", "Weezing", "Persian"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Golbat", "Raticate", "Arbok", "Muk", "Weezing", "Persian", "Crobat"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Golbat", "Raticate", "Arbok", "Muk", "Weezing", "Persian", "Crobat", "Houndoom"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Golbat", "Raticate", "Arbok", "Muk", "Weezing", "Persian", "Crobat", "Houndoom"],
      size: [5, 6]
    }
  },

  TeamMagmaMale: {
    messages: [
      {
        opening: "The land belongs to Team Magma!",
        win: "Our flames burn bright!",
        lose: "Guess I got doused...",
      },
      {
        opening: "We’ll expand the land for all Pokémon!",
        win: "Team Magma will rise!",
        lose: "I’ll report this to the commander...",
      },
    ],
    type: "Team Magma",
    names: ["Blaze", "Trent", "Dax", "Ronan", "Vince"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Numel", "Houndour", "Baltoy", "Slugma", "Geodude", "Machop"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Camerupt", "Houndoom", "Claydol", "Magcargo", "Graveler", "Machoke"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Camerupt", "Houndoom", "Claydol", "Magcargo", "Graveler", "Rhydon"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Camerupt", "Houndoom", "Claydol", "Magcargo", "Rhydon", "Torkoal", "Golem", "Arcanine"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Camerupt", "Houndoom", "Claydol", "Magcargo", "Rhydon", "Torkoal", "Golem", "Arcanine"],
      size: [5, 6]
    }
  },

  TeamMagmaFemale: {
    messages: [
      {
        opening: "We’ll turn the seas into land!",
        win: "Hot and victorious!",
        lose: "I need more heat in my strategy!",
      },
      {
        opening: "Team Magma’s plans can’t be stopped!",
        win: "We’ll take control of the earth!",
        lose: "This mission’s gone up in smoke!",
      },
    ],
    type: "Team Magma",
    names: ["Tara", "Flame", "Kira", "Nina", "Rhea"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Numel", "Houndour", "Slugma", "Baltoy", "Geodude", "Machop"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Camerupt", "Houndoom", "Claydol", "Magcargo", "Graveler", "Machoke"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Camerupt", "Houndoom", "Claydol", "Magcargo", "Rhydon", "Torkoal"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Camerupt", "Houndoom", "Claydol", "Magcargo", "Rhydon", "Torkoal", "Golem", "Arcanine"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Camerupt", "Houndoom", "Claydol", "Magcargo", "Rhydon", "Torkoal", "Golem", "Arcanine"],
      size: [5, 6]
    }
  },

  TeamAquaMale: {
    messages: [
      {
        opening: "The ocean’s our domain!",
        win: "Team Aqua rules the waves!",
        lose: "Guess I got beached...",
      },
      {
        opening: "The sea will reclaim the land!",
        win: "Tides are in our favor!",
        lose: "I’m all washed up!",
      },
    ],
    type: "Team Aqua",
    names: ["Finn", "Wade", "Drake", "Lars", "Nate"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Carvanha", "Wailmer", "Tentacool", "Goldeen", "Wingull", "Poliwag"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Sharpedo", "Wailord", "Tentacruel", "Seaking", "Pelipper", "Poliwhirl"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Sharpedo", "Wailord", "Tentacruel", "Kingdra", "Pelipper", "Poliwrath"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Sharpedo", "Wailord", "Tentacruel", "Kingdra", "Pelipper", "Poliwrath", "Crawdaunt", "Whiscash"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Sharpedo", "Wailord", "Tentacruel", "Kingdra", "Pelipper", "Poliwrath", "Crawdaunt", "Whiscash"],
      size: [5, 6]
    }
  },

  TeamAquaFemale: {
    messages: [
      {
        opening: "Get ready to be swept away!",
        win: "The sea’s power is unstoppable!",
        lose: "You sank my team!",
      },
      {
        opening: "Our waves will drown your hopes!",
        win: "Smooth victory!",
        lose: "I’ll drift away for now.",
      },
    ],
    type: "Team Aqua",
    names: ["Marina", "Lana", "Coral", "Rina", "Tess"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Carvanha", "Wailmer", "Tentacool", "Goldeen", "Wingull", "Poliwag"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Sharpedo", "Wailord", "Tentacruel", "Seaking", "Pelipper", "Poliwhirl"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Sharpedo", "Wailord", "Tentacruel", "Kingdra", "Pelipper", "Poliwrath"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Sharpedo", "Wailord", "Tentacruel", "Kingdra", "Pelipper", "Poliwrath", "Crawdaunt", "Whiscash"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Sharpedo", "Wailord", "Tentacruel", "Kingdra", "Pelipper", "Poliwrath", "Crawdaunt", "Whiscash"],
      size: [5, 6]
    }
  },

  TeamGalacticMale: {
    messages: [
      {
        opening: "For the glory of Team Galactic!",
        win: "Perfection achieved!",
        lose: "This data is... disappointing.",
      },
      {
        opening: "Our science will reshape the world!",
        win: "A flawless plan, flawlessly executed.",
        lose: "I’ll report this anomaly.",
      },
    ],
    type: "Team Galactic",
    names: ["Blake", "Felix", "Gavin", "Leo", "Mason"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Zubat", "Stunky", "Glameow", "Wurmple", "Croagunk", "Bronzor"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Golbat", "Skuntank", "Purugly", "Dustox", "Toxicroak", "Bronzong"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Golbat", "Skuntank", "Purugly", "Toxicroak", "Bronzong", "Crobat"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Golbat", "Skuntank", "Purugly", "Toxicroak", "Bronzong", "Crobat", "Weavile", "Houndoom"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Golbat", "Skuntank", "Purugly", "Toxicroak", "Bronzong", "Crobat", "Weavile", "Houndoom"],
      size: [5, 6]
    }
  },

  TeamGalacticFemale: {
    messages: [
      {
        opening: "Our mission is absolute perfection!",
        win: "Success — as calculated.",
        lose: "This setback will be analyzed.",
      },
      {
        opening: "We’ll create a new world, one battle at a time!",
        win: "All according to plan.",
        lose: "You’re an unpredictable variable...",
      },
    ],
    type: "Team Galactic",
    names: ["Luna", "Vera", "Cleo", "Iris", "Nadia"],
    rate: 1000,
    function: "victories",
    noob: {
      pokemon: ["Zubat", "Stunky", "Glameow", "Wurmple", "Croagunk", "Bronzor"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Golbat", "Skuntank", "Purugly", "Dustox", "Toxicroak", "Bronzong"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Golbat", "Skuntank", "Purugly", "Toxicroak", "Bronzong", "Crobat"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Golbat", "Skuntank", "Purugly", "Toxicroak", "Bronzong", "Crobat", "Weavile", "Houndoom"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Golbat", "Skuntank", "Purugly", "Toxicroak", "Bronzong", "Crobat", "Weavile", "Houndoom"],
      size: [5, 6]
    }
  },
  ConstructionWorker: {
    messages: [
      {
        opening: "These stones aren't the only thing built tough around here!",
        win: "Ha! Another foundation cracked under pressure!",
        lose: "Guess I need to reinforce my defense..."
      },
      {
        opening: "Careful where you step — one wrong move and it’s rubble!",
        win: "That’s solid work… but I’m still the rock that stands firm!",
        lose: "Looks like I hit a weak spot after all."
      }
    ],
    type: "ConstructionWorker",
    names: ["Grant"],
    rate: 1000,
    function: "rock_gym3",
    noob: {
      pokemon: ["Geodude", "Onix"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Graveler", "Sudowoodo", "Onix"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Graveler", "Golem", "Sudowoodo", "Nosepass"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Golem", "Steelix", "Sudowoodo", "Graveler", "Probopass"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Golem", "Steelix", "Rampardos", "Bastiodon", "Sudowoodo", "Probopass"],
      size: [5, 6]
    }
  },

  MountainHiker: {
    messages: [
      {
        opening: "Every step up the mountain made me stronger!",
        win: "You’ve got spirit, but my team’s built like bedrock!",
        lose: "Guess I slipped on some loose gravel..."
      },
      {
        opening: "I’ve seen more cliffs and caves than most folks dream of!",
        win: "That’s what years of climbing’ll do for ya!",
        lose: "You’ve got the endurance of a real mountaineer!"
      }
    ],
    type: "MountainHiker",
    names: ["Cliff"],
    rate: 1000,
    function: "rock_gym2",
    noob: {
      pokemon: ["Geodude", "Sandshrew"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Graveler", "Onix", "Sudowoodo"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Golem", "Graveler", "Onix", "Sudowoodo"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Steelix", "Sudowoodo", "Golem", "Nosepass", "Graveler"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Steelix", "Golem", "Rampardos", "Bastiodon", "Sudowoodo", "Probopass"],
      size: [5, 6]
    }
  },

  Archaeologist: {
    messages: [
      {
        opening: "These fossils hold secrets of the past — let’s see what you’ve learned!",
        win: "Knowledge and power — both unearthed through patience!",
        lose: "Looks like you uncovered my weak spot..."
      },
      {
        opening: "I’ve dug up more than fossils — I’ve found true strength!",
        win: "You were buried by ancient power!",
        lose: "Guess I should have dusted off my strategy first."
      }
    ],
    type: "Archaeologist",
    names: ["Dr Terra"],
    rate: 1000,
    function: "rock_gym1",
    noob: {
      pokemon: ["Kabuto", "Omanyte"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Lileep", "Anorith", "Kabuto"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Armaldo", "Cradily", "Kabutops", "Omastar"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Cradily", "Armaldo", "Kabutops", "Omastar", "Rampardos"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Cradily", "Armaldo", "Kabutops", "Omastar", "Rampardos", "Bastiodon"],
      size: [5, 6]
    }
  },

  Captain: {
    messages: [
      {
        opening: "Prepare to set sail on a wave of defeat!",
        win: "Another challenger lost at sea!",
        lose: "Heh, looks like my ship’s sprung a leak!"
      },
      {
        opening: "The ocean’s as unpredictable as me — brace yourself!",
        win: "Smooth sailing for me, rough tides for you!",
        lose: "Guess I was swept away this time!"
      }
    ],
    type: "Captain",
    names: ["Marlow"],
    rate: 1000,
    function: "water_gym3",
    noob: {
      pokemon: ["Poliwag", "Tentacool"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Tentacool", "Wingull", "Buizel"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Pelipper", "Floatzel", "Seaking", "Golduck"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Pelipper", "Floatzel", "Whiscash", "Mantine", "Gyarados"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Pelipper", "Floatzel", "Gyarados", "Mantine", "Kingdra", "Lanturn"],
      size: [5, 6]
    }
  },

  SwiftSwimmer: {
    messages: [
      {
        opening: "Hope you can swim, because my Pokémon don’t hold back!",
        win: "Another one dragged under by the current!",
        lose: "You kept up better than I thought!"
      },
      {
        opening: "Let’s make a splash — ready, set, dive!",
        win: "You couldn’t handle the waves!",
        lose: "Guess I’m the one who got swept away."
      }
    ],
    type: "SwiftSwimmer",
    names: ["Marina"],
    rate: 1000,
    function: "water_gym2",
    noob: {
      pokemon: ["Psyduck", "Horsea"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Goldeen", "Horsea", "Buizel"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Seaking", "Floatzel", "Golduck", "Starmie"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Floatzel", "Starmie", "Kingler", "Golduck", "Quagsire"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Floatzel", "Starmie", "Milotic", "Lanturn", "Kingdra", "Golduck"],
      size: [5, 6]
    }
  },

  CruiseChef: {
    messages: [
      {
        opening: "Welcome to my kitchen — today’s special is defeat!",
        win: "Served fresh and steaming — a loss for you!",
        lose: "Seems my dish needed more seasoning..."
      },
      {
        opening: "I cook with passion — and my Pokémon battle the same way!",
        win: "Bon appétit — enjoy your loss!",
        lose: "Looks like you’ve outcooked me!"
      }
    ],
    type: "CruiseChef",
    names: ["Remy Brine"],
    rate: 1000,
    function: "water_gym1",
    noob: {
      pokemon: ["Shellder", "Krabby"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Krabby", "Horsea", "Chinchou"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Kingler", "Lanturn", "Corsola", "Seadra"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Kingler", "Corsola", "Whiscash", "Lanturn", "Octillery"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Kingler", "Lanturn", "Octillery", "Walrein", "Lapras", "Milotic"],
      size: [5, 6]
    }
  },

  WyvernTamer: {
    messages: [
      {
        opening: "Let’s see if you can handle the power of true dragons!",
        win: "Another challenger burned by dragonfire!",
        lose: "Even dragons fall sometimes..."
      },
      {
        opening: "My dragons and I fight as one — prepare yourself!",
        win: "Victory soars on dragon wings!",
        lose: "You grounded me this time!"
      }
    ],
    type: "WyvernTamer",
    names: ["Drake"],
    rate: 1000,
    function: "dragon_gym3",
    noob: {
      pokemon: ["Dratini", "Horsea"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Seadra", "Dragonair", "Altaria"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Altaria", "Dragonair", "Flygon", "Kingdra"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Altaria", "Flygon", "Kingdra", "Salamence", "Dragonite"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Flygon", "Kingdra", "Altaria", "Dragonite", "Salamence", "Garchomp"],
      size: [5, 6]
    }
  },

  ScaledMonk: {
    messages: [
      {
        opening: "Breathe steady — focus your mind, then strike!",
        win: "Discipline conquers chaos.",
        lose: "Even I must meditate on this loss."
      },
      {
        opening: "The spirit of the dragon flows through my veins!",
        win: "You’ve witnessed true harmony in motion!",
        lose: "Balance has shifted… to you."
      }
    ],
    type: "ScaledMonk",
    names: ["Kaida"],
    rate: 1000,
    function: "dragon_gym2",
    noob: {
      pokemon: ["Bagon", "Swablu"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Shelgon", "Altaria", "Vibrava"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Altaria", "Flygon", "Shelgon", "Dragonair"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Altaria", "Flygon", "Kingdra", "Salamence", "Dragonair"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Altaria", "Flygon", "Kingdra", "Salamence", "Garchomp", "Dragonite"],
      size: [5, 6]
    }
  },

  Professor: {
    messages: [
      {
        opening: "Let’s test the limits of dragon evolution!",
        win: "Fascinating! Their potential is remarkable!",
        lose: "Data suggests… I still have more to learn."
      },
      {
        opening: "My research proves dragons are the pinnacle of power!",
        win: "Another experiment — successful!",
        lose: "Anomalous result… you win."
      }
    ],
    type: "Professor",
    names: ["Veyl"],
    rate: 1000,
    function: "dragon_gym1",
    noob: {
      pokemon: ["Dratini", "Gible"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Gible", "Vibrava", "Bagon"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Gabite", "Flygon", "Altaria", "Dragonair"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Garchomp", "Flygon", "Altaria", "Salamence", "Kingdra"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Garchomp", "Salamence", "Kingdra", "Dragonite", "Altaria", "Flygon"],
      size: [5, 6]
    }
  },

  GliderPilot: {
    messages: [
      {
        opening: "The winds are calm now... but not for long!",
        win: "You were swept away by the storm of my skill!",
        lose: "Guess my wings got clipped this time."
      },
      {
        opening: "Let's see how high your team can soar!",
        win: "I fly circles around challengers like you!",
        lose: "Looks like I’ve been grounded... for now."
      }
    ],
    type: "GliderPilot",
    names: ["Skye"],
    rate: 1000,
    function: "flying_gym3",
    noob: {
      pokemon: ["Pidgey", "Hoothoot"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Pidgeotto", "Wingull", "Swablu"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Pelipper", "Altaria", "Fearow", "Togetic"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Altaria", "Crobat", "Noctowl", "Staraptor", "Skarmory"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Altaria", "Staraptor", "Skarmory", "Crobat", "Togekiss", "Pelipper"],
      size: [5, 6]
    }
  },

  Falconer: {
    messages: [
      {
        opening: "My Pokémon and I move together like the wind!",
        win: "You never stood a chance against perfect formation!",
        lose: "Seems the wind changed direction..."
      },
      {
        opening: "You can’t outfly the eyes of a falcon!",
        win: "Precision and control always win the sky!",
        lose: "You caught me in a crosswind this time."
      }
    ],
    type: "Falconer",
    names: ["Gale"],
    rate: 1000,
    function: "flying_gym2",
    noob: {
      pokemon: ["Spearow", "Taillow"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Fearow", "Swellow", "Doduo"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Dodrio", "Swellow", "Noctowl", "Farfetch’d"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Togetic", "Dodrio", "Noctowl", "Swellow", "Gliscor"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Gliscor", "Staraptor", "Togekiss", "Crobat", "Swellow", "Fearow"],
      size: [5, 6]
    }
  },

  SkyCourier: {
    messages: [
      {
        opening: "Special delivery — a gust of defeat!",
        win: "Package received — and that package was your loss!",
        lose: "Heh, looks like my delivery got delayed!"
      },
      {
        opening: "I always deliver victory on time!",
        win: "Right on schedule!",
        lose: "Hah, missed my mark that time!"
      }
    ],
    type: "SkyCourier",
    names: ["Talon"],
    rate: 1000,
    function: "flying_gym1",
    noob: {
      pokemon: ["Zubat", "Starly"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Golbat", "Starly", "Wingull"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Golbat", "Swablu", "Noctowl", "Staravia"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Crobat", "Staraptor", "Pelipper", "Swellow", "Altaria"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Crobat", "Staraptor", "Pelipper", "Skarmory", "Altaria", "Togekiss"],
      size: [5, 6]
    }
  },

  Snowboarder: {
    messages: [
      {
        opening: "Get ready to be frozen in your tracks!",
        win: "That’s a cold, clean victory!",
        lose: "You melted my momentum..."
      },
      {
        opening: "Hope you brought a jacket — things are about to get chilly!",
        win: "You’re iced out!",
        lose: "Looks like I hit some black ice."
      }
    ],
    type: "Snowboarder",
    names: ["Frost"],
    rate: 1000,
    function: "ice_gym1",
    noob: {
      pokemon: ["Swinub", "Seel"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Sealeo", "Sneasel", "Swinub"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Dewgong", "Piloswine", "Sneasel", "Glalie"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Glalie", "Weavile", "Walrein", "Piloswine", "Dewgong"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Weavile", "Glalie", "Walrein", "Froslass", "Lapras", "Cloyster"],
      size: [5, 6]
    }
  },

  IceSculptor: {
    messages: [
      {
        opening: "Precision is everything — one wrong chip, and it all breaks!",
        win: "Perfection carved from victory!",
        lose: "A flaw in my form..."
      },
      {
        opening: "Every battle is like sculpting — I carve my wins from ice itself!",
        win: "Flawless and frozen solid!",
        lose: "You’ve cracked my masterpiece!"
      }
    ],
    type: "IceSculptor",
    names: ["Glacia"],
    rate: 1000,
    function: "ice_gym2",
    noob: {
      pokemon: ["Snorunt", "Spheal"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Sneasel", "Snorunt", "Sealeo"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Glalie", "Cloyster", "Piloswine", "Sneasel"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Glalie", "Froslass", "Weavile", "Cloyster", "Dewgong"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Froslass", "Weavile", "Lapras", "Walrein", "Glalie", "Cloyster"],
      size: [5, 6]
    }
  },

  ArcticResearcher: {
    messages: [
      {
        opening: "Time to put my research to the test!",
        win: "Cold data, colder victory!",
        lose: "My calculations were off... barely."
      },
      {
        opening: "Science says: Ice always wins against fire!",
        win: "Confirmed — theory proven!",
        lose: "Hypothesis disproven... for now."
      }
    ],
    type: "ArcticResearcher",
    names: ["Bruno"],
    rate: 1000,
    function: "ice_gym3",
    noob: {
      pokemon: ["Snover", "Spheal"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Snover", "Sealeo", "Sneasel"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Abomasnow", "Glalie", "Piloswine", "Dewgong"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Abomasnow", "Walrein", "Weavile", "Cloyster", "Froslass"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Abomasnow", "Walrein", "Weavile", "Froslass", "Glalie", "Lapras"],
      size: [5, 6]
    }
  },

  StreetRogue: {
    messages: [
      {
        opening: "The shadows hide my strategy — let’s dance in the dark!",
        win: "You never saw it coming!",
        lose: "Guess you turned out the lights on me..."
      },
      {
        opening: "Stealth and precision — that’s how I fight!",
        win: "Like a shadow in the night!",
        lose: "You caught me off guard this time."
      }
    ],
    type: "StreetRogue",
    names: ["Raven"],
    rate: 1000,
    function: "dark_gym3",
    noob: {
      pokemon: ["Poochyena", "Houndour"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Mightyena", "Houndour", "Sneasel"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Mightyena", "Sneasel", "Cacturne", "Absol"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Weavile", "Cacturne", "Absol", "Umbreon", "Mightyena"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Weavile", "Absol", "Umbreon", "Cacturne", "Spiritomb", "Houndoom"],
      size: [5, 6]
    }
  },

  Occultist: {
    messages: [
      {
        opening: "Do you fear the unknown? You should.",
        win: "The darkness claims another soul.",
        lose: "Even shadows must retreat sometimes."
      },
      {
        opening: "The night whispers to those who listen...",
        win: "You fell right into my void!",
        lose: "The light shines brighter than expected."
      }
    ],
    type: "Occultist",
    names: ["Selene"],
    rate: 1000,
    function: "dark_gym2",
    noob: {
      pokemon: ["Murkrow", "Poochyena"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Mightyena", "Murkrow", "Houndour"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Honchkrow", "Absol", "Houndoom", "Sneasel"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Honchkrow", "Weavile", "Houndoom", "Spiritomb", "Umbreon"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Honchkrow", "Weavile", "Umbreon", "Spiritomb", "Absol", "Houndoom"],
      size: [5, 6]
    }
  },

  NightclubBouncer: {
    messages: [
      {
        opening: "Welcome to the Dark Gym — let’s see if you can handle the pressure!",
        win: "You're out cold!",
        lose: "Guess my shift's over early."
      },
      {
        opening: "Time to show you what real power looks like!",
        win: "Another one down for the count!",
        lose: "Heh, not bad, kid."
      }
    ],
    type: "NightclubBouncer",
    names: ["Vex"],
    rate: 1000,
    function: "dark_gym1",
    noob: {
      pokemon: ["Houndour", "Murkrow"],
      size: [1, 2]
    },
    easy: {
      pokemon: ["Houndoom", "Sneasel", "Mightyena"],
      size: [2, 3]
    },
    medium: {
      pokemon: ["Weavile", "Houndoom", "Cacturne", "Absol"],
      size: [3, 4]
    },
    hard: {
      pokemon: ["Weavile", "Absol", "Cacturne", "Spiritomb", "Umbreon"],
      size: [4, 5]
    },
    master: {
      pokemon: ["Weavile", "Absol", "Umbreon", "Spiritomb", "Houndoom", "Honchkrow"],
      size: [5, 6]
    }
  },
};
