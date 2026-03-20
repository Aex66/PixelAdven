import { Pokemon } from "./@types/types";

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

export const MoveDamageType = {
  FORMULA: 0,
  STATUS: 1,
  STATS: 2,
  SPECIAL: 3
} as const

export type MoveDamageTypeValues = (typeof MoveDamageType)[keyof typeof MoveDamageType];

export const StatusMoveTarget = {
  Opponent: 0,
  Self: 1
} as const


export type StatusMoveTargetValues = (typeof StatusMoveTarget)[keyof typeof StatusMoveTarget];

export const StatusEffects = {
  Poisoned: 1,
  Burned: 2,
  Paralyzed: 3,
  Sleep: 4,
  Frozen: 5,
  Confused: 6,
  Flinched: 7,
  BadlyPoisoned:8
} as const

export type StatusEffectsValues = (typeof StatusEffects)[keyof typeof StatusEffects];

export const StatObjective = {
  Atk: 0,
  Sp_Atk: 1,
  Def: 2,
  Sp_Def: 3,
  Spd: 4,
  Accuracy: 5,
  Evasion: 6
}

export type StatObjectiveValues = (typeof StatObjective)[keyof typeof StatObjective];

const pokemonMoves = {
  "None": {
    "pp": 0,
    "type": 0,
    "power": 0,
    "accuracy": 0,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 0,
    "name": "None"
  },
  "10mil Volt Thunderbolt": {
    "pp": 1,
    "type": 4,
    "power": 195,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 1,
    "name": "10mil Volt Thunderbolt"
  },
  "Absorb": {
    "pp": 25,
    "type": 5,
    "power": 20,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 2,
    "name": "Absorb",
    "special": true
  },
  "Accelerock": {
    "pp": 20,
    "type": 13,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 1,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 3,
    "name": "Accelerock"
  },
  "Acid": {
    "pp": 30,
    "type": 8,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 4,
    "name": "Acid",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "SpecialDefense",
            -1
          ]
        ]
      }
    }
  },
  "Acid Armor": {
    "pp": 20,
    "type": 8,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 5,
    "name": "Acid Armor"
  },
  "Acid Downpour": {
    "pp": 1,
    "type": 8,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 6,
    "name": "Acid Downpour"
  },
  "Acid Spray": {
    "pp": 20,
    "type": 8,
    "power": 40,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 7,
    "name": "Acid Spray",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "SpecialDefense",
            -2
          ]
        ]
      }
    }
  },
  "Acrobatics": {
    "pp": 15,
    "type": 10,
    "power": 55,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 8,
    "name": "Acrobatics"
  },
  "Acupressure": {
    "pp": 30,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 9,
    "name": "Acupressure"
  },
  "Aerial Ace": {
    "pp": 20,
    "type": 10,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 10,
    "name": "Aerial Ace"
  },
  "Aeroblast": {
    "pp": 5,
    "type": 10,
    "power": 100,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 11,
    "name": "Aeroblast"
  },
  "After You": {
    "pp": 15,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 2,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 12,
    "name": "After You"
  },
  "Agility": {
    "pp": 30,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 13,
    "name": "Agility",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Air Cutter": {
    "pp": 25,
    "type": 10,
    "power": 60,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 14,
    "critStage": 1,
    "name": "Air Cutter"
  },
  "Air Slash": {
    "pp": 15,
    "type": 10,
    "power": 75,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 15,
    "name": "Air Slash",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          7
        ]
      }
    }
  },
  "All Out Pummeling": {
    "pp": 1,
    "type": 7,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 16,
    "name": "All Out Pummeling"
  },
  "Alluring Voice": {
    "pp": 10,
    "type": 18,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 17,
    "name": "Alluring Voice"
  },
  "Ally Switch": {
    "pp": 15,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 2,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 18,
    "name": "Ally Switch"
  },
  "Amnesia": {
    "pp": 20,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 19,
    "name": "Amnesia",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "SpecialDefense",
            2
          ]
        ]
      }
    }
  },
  "Anchor Shot": {
    "pp": 20,
    "type": 17,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 20,
    "name": "Anchor Shot"
  },
  "Ancient Power": {
    "pp": 5,
    "type": 13,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 21,
    "name": "Ancient Power",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "Defense",
            1
          ],
          [
            "SpecialDefense",
            1
          ],
          [
            "SpecialAttack",
            1
          ],
          [
            "Attack",
            1
          ],
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Apple Acid": {
    "pp": 10,
    "type": 5,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 22,
    "name": "Apple Acid",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "SpecialDefense",
            1
          ]
        ]
      }
    }
  },
  "Aqua Cutter": {
    "pp": 20,
    "type": 3,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 23,
    "name": "Aqua Cutter"
  },
  "Aqua Jet": {
    "pp": 20,
    "type": 3,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 1,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 24,
    "name": "Aqua Jet"
  },
  "Aqua Ring": {
    "pp": 20,
    "type": 3,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 25,
    "name": "Aqua Ring"
  },
  "Aqua Step": {
    "pp": 10,
    "type": 3,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 26,
    "name": "Aqua Step",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Aqua Tail": {
    "pp": 10,
    "type": 3,
    "power": 90,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 27,
    "name": "Aqua Tail"
  },
  "Arm Thrust": {
    "pp": 20,
    "type": 7,
    "power": 15,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 28,
    "name": "Arm Thrust"
  },
  "Armor Cannon": {
    "pp": 5,
    "type": 1,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 29,
    "name": "Armor Cannon",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Defense",
            -1
          ],
          [
            "SpecialDefense",
            -1
          ]
        ]
      }
    }
  },
  "Aromatherapy": {
    "pp": 5,
    "type": 5,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 30,
    "name": "Aromatherapy"
  },
  "Aromatic Mist": {
    "pp": 20,
    "type": 18,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 31,
    "name": "Aromatic Mist"
  },
  "Assist": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 32,
    "name": "Assist"
  },
  "Assurance": {
    "pp": 10,
    "type": 16,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 33,
    "name": "Assurance"
  },
  "Astonish": {
    "pp": 15,
    "type": 14,
    "power": 30,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 34,
    "name": "Astonish",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          7
        ]
      }
    }
  },
  "Astral Barrage": {
    "pp": 5,
    "type": 14,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 35,
    "name": "Astral Barrage"
  },
  "Attack Order": {
    "pp": 15,
    "type": 12,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 36,
    "critStage": 1,
    "name": "Attack Order"
  },
  "Attract": {
    "pp": 15,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 37,
    "name": "Attract"
  },
  "Aura Sphere": {
    "pp": 20,
    "type": 7,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 38,
    "name": "Aura Sphere"
  },
  "Aura Wheel": {
    "pp": 10,
    "type": 4,
    "power": 110,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 39,
    "name": "Aura Wheel",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Aurora Beam": {
    "pp": 20,
    "type": 6,
    "power": 65,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 40,
    "name": "Aurora Beam",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "Attack",
            -1
          ]
        ]
      }
    }
  },
  "Aurora Veil": {
    "pp": 20,
    "type": 6,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 41,
    "name": "Aurora Veil"
  },
  "Autotomize": {
    "pp": 15,
    "type": 17,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "category": "Status",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 42,
    "name": "Autotomize"
  },
  "Avalanche": {
    "pp": 10,
    "type": 6,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": -1,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 43,
    "name": "Avalanche"
  },
  "Axe Kick": {
    "pp": 10,
    "type": 7,
    "power": 120,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 44,
    "name": "Axe Kick",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          6
        ]
      }
    }
  },
  "Baby Doll Eyes": {
    "pp": 30,
    "type": 18,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 1,
    "target": 0,
    "category": "Status",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 45,
    "name": "Baby Doll Eyes"
  },
  "Baddy Bad": {
    "pp": 15,
    "type": 16,
    "power": 80,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 46,
    "name": "Baddy Bad"
  },
  "Baneful Bunker": {
    "pp": 10,
    "type": 8,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 1,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 47,
    "name": "Baneful Bunker"
  },
  "Barb Barrage": {
    "pp": 10,
    "type": 8,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 48,
    "name": "Barb Barrage"
  },
  "Barrage": {
    "pp": 20,
    "type": 2,
    "power": 15,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 49,
    "name": "Barrage"
  },
  "Barrier": {
    "pp": 20,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 50,
    "name": "Barrier"
  },
  "Baton Pass": {
    "pp": 40,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 51,
    "name": "Baton Pass"
  },
  "Beak Blast": {
    "pp": 15,
    "type": 10,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 52,
    "name": "Beak Blast"
  },
  "Beat Up": {
    "pp": 10,
    "type": 16,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 53,
    "name": "Beat Up"
  },
  "Behemoth Bash": {
    "pp": 5,
    "type": 17,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 54,
    "name": "Behemoth Bash"
  },
  "Behemoth Blade": {
    "pp": 5,
    "type": 17,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 55,
    "name": "Behemoth Blade"
  },
  "Belch": {
    "pp": 10,
    "type": 8,
    "power": 120,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 56,
    "name": "Belch"
  },
  "Belly Drum": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 57,
    "name": "Belly Drum",
    "special": true
  },
  "Bestow": {
    "pp": 15,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 58,
    "name": "Bestow"
  },
  "Bide": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 59,
    "name": "Bide"
  },
  "Bind": {
    "pp": 20,
    "type": 2,
    "power": 15,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "special": true,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 60,
    "name": "Bind"
  },
  "Bite": {
    "pp": 25,
    "type": 16,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 61,
    "name": "Bite",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          7
        ]
      }
    }
  },
  "Bitter Blade": {
    "pp": 10,
    "type": 1,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 62,
    "name": "Bitter Blade"
  },
  "Bitter Malice": {
    "pp": 10,
    "type": 14,
    "power": 75,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 63,
    "name": "Bitter Malice",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Attack",
            1
          ]
        ]
      }
    }
  },
  "Black Hole Eclipse": {
    "pp": 1,
    "type": 16,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 64,
    "name": "Black Hole Eclipse"
  },
  "Blast Burn": {
    "pp": 5,
    "type": 1,
    "power": 150,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 65,
    "name": "Blast Burn"
  },
  "Blaze Kick": {
    "pp": 10,
    "type": 1,
    "power": 85,
    "accuracy": 90,
    "category": "Physical",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 66,
    "critStage": 1,
    "name": "Blaze Kick"
  },
  "Blazing Torque": {
    "pp": 10,
    "type": 1,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 67,
    "name": "Blazing Torque",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          2
        ]
      }
    }
  },
  "Bleakwind Storm": {
    "pp": 10,
    "type": 10,
    "power": 100,
    "accuracy": 80,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 68,
    "name": "Bleakwind Storm",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 30,
        "stats": [
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Blizzard": {
    "pp": 5,
    "type": 6,
    "power": 110,
    "accuracy": 70,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 69,
    "name": "Blizzard",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          5
        ]
      }
    }
  },
  "Block": {
    "pp": 5,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 70,
    "name": "Block"
  },
  "Blood Moon": {
    "pp": 5,
    "type": 2,
    "power": 140,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 71,
    "name": "Blood Moon"
  },
  "Bloom Doom": {
    "pp": 1,
    "type": 5,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 72,
    "name": "Bloom Doom"
  },
  "Blue Flare": {
    "pp": 5,
    "type": 1,
    "power": 130,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 73,
    "name": "Blue Flare",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 20,
        "effects": [
          2
        ]
      }
    }
  },
  "Body Press": {
    "pp": 10,
    "type": 7,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 74,
    "name": "Body Press"
  },
  "Body Slam": {
    "pp": 15,
    "type": 2,
    "power": 85,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 75,
    "name": "Body Slam",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          3
        ]
      }
    }
  },
  "Bolt Beak": {
    "pp": 10,
    "type": 4,
    "power": 85,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 76,
    "name": "Bolt Beak"
  },
  "Bolt Strike": {
    "pp": 5,
    "type": 4,
    "power": 130,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 77,
    "name": "Bolt Strike",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 20,
        "effects": [
          3
        ]
      }
    }
  },
  "Bone Club": {
    "pp": 20,
    "type": 9,
    "power": 65,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 78,
    "name": "Bone Club",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          7
        ]
      }
    }
  },
  "Bone Rush": {
    "pp": 10,
    "type": 9,
    "power": 25,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 79,
    "name": "Bone Rush"
  },
  "Bonemerang": {
    "pp": 10,
    "type": 9,
    "power": 50,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 80,
    "name": "Bonemerang"
  },
  "Boomburst": {
    "pp": 10,
    "type": 2,
    "power": 140,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 81,
    "name": "Boomburst"
  },
  "Bounce": {
    "pp": 5,
    "type": 10,
    "power": 85,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 82,
    "name": "Bounce",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          3
        ]
      }
    }
  },
  "Bouncy Bubble": {
    "pp": 20,
    "type": 3,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 83,
    "name": "Bouncy Bubble"
  },
  "Branch Poke": {
    "pp": 40,
    "type": 5,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 84,
    "name": "Branch Poke"
  },
  "Brave Bird": {
    "pp": 15,
    "type": 10,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 85,
    "name": "Brave Bird"
  },
  "Breaking Swipe": {
    "pp": 15,
    "type": 15,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 86,
    "name": "Breaking Swipe",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Attack",
            -1
          ]
        ]
      }
    }
  },
  "Breakneck Blitz": {
    "pp": 1,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 87,
    "name": "Breakneck Blitz"
  },
  "Brick Break": {
    "pp": 15,
    "type": 7,
    "power": 75,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 88,
    "name": "Brick Break"
  },
  "Brine": {
    "pp": 10,
    "type": 3,
    "power": 65,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 89,
    "name": "Brine"
  },
  "Brutal Swing": {
    "pp": 20,
    "type": 16,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 90,
    "name": "Brutal Swing"
  },
  "Bubble": {
    "pp": 30,
    "type": 3,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 91,
    "name": "Bubble",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "Speed",
            -1
          ]
        ]
      }
    }
  },
  "Bubble Beam": {
    "pp": 20,
    "type": 3,
    "power": 65,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 92,
    "name": "Bubble Beam",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Bug Bite": {
    "pp": 20,
    "type": 12,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 93,
    "name": "Bug Bite"
  },
  "Bug Buzz": {
    "pp": 10,
    "type": 12,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 94,
    "name": "Bug Buzz",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "SpecialDefense",
            1
          ]
        ]
      }
    }
  },
  "Bulk Up": {
    "pp": 20,
    "type": 7,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 95,
    "name": "Bulk Up"
  },
  "Bulldoze": {
    "pp": 20,
    "type": 9,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 96,
    "name": "Bulldoze",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "Speed",
            -1
          ]
        ]
      }
    }
  },
  "Bullet Punch": {
    "pp": 30,
    "type": 17,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 1,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 97,
    "name": "Bullet Punch"
  },
  "Bullet Seed": {
    "pp": 30,
    "type": 5,
    "power": 25,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 98,
    "name": "Bullet Seed"
  },
  "Burn Up": {
    "pp": 5,
    "type": 1,
    "power": 130,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 99,
    "name": "Burn Up"
  },
  "Burning Bulwark": {
    "pp": 10,
    "type": 1,
    "power": 0,
    "accuracy": 0,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 100,
    "name": "Burning Bulwark"
  },
  "Burning Jealousy": {
    "pp": 5,
    "type": 1,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 101,
    "name": "Burning Jealousy",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          2
        ]
      }
    }
  },
  "Buzzy Buzz": {
    "pp": 20,
    "type": 4,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 102,
    "name": "Buzzy Buzz",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          3
        ]
      }
    }
  },
  "Calm Mind": {
    "pp": 20,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 103,
    "name": "Calm Mind",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "SpecialDefense",
            1
          ],
          [
            "SpecialAttack",
            1
          ]
        ]
      }
    }
  },
  "Camouflage": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 104,
    "name": "Camouflage"
  },
  "Captivate": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 105,
    "name": "Captivate"
  },
  "Catastropika": {
    "pp": 1,
    "type": 4,
    "power": 210,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 106,
    "name": "Catastropika"
  },
  "Ceaseless Edge": {
    "pp": 15,
    "type": 16,
    "power": 65,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 107,
    "name": "Ceaseless Edge"
  },
  "Celebrate": {
    "pp": 40,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 108,
    "name": "Celebrate"
  },
  "Charge": {
    "pp": 20,
    "type": 4,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 109,
    "name": "Charge",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "SpecialDefense",
            1
          ]
        ]
      }
    }
  },
  "Charge Beam": {
    "pp": 10,
    "type": 4,
    "power": 50,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 110,
    "name": "Charge Beam",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "SpecialAttack",
            1
          ]
        ]
      }
    }
  },
  "Charm": {
    "pp": 20,
    "type": 18,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 111,
    "name": "Charm",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Attack",
            -2
          ]
        ]
      }
    }
  },
  "Chatter": {
    "pp": 20,
    "type": 10,
    "power": 65,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 112,
    "name": "Chatter",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          6
        ]
      }
    }
  },
  "Chilling Water": {
    "pp": 20,
    "type": 3,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 113,
    "name": "Chilling Water",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "Attack",
            -1
          ]
        ]
      }
    }
  },
  "Chilly Reception": {
    "pp": 10,
    "type": 6,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 114,
    "name": "Chilly Reception"
  },
  "Chip Away": {
    "pp": 20,
    "type": 2,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 115,
    "name": "Chip Away"
  },
  "Chloroblast": {
    "pp": 5,
    "type": 5,
    "power": 150,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 116,
    "name": "Chloroblast",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "Speed",
            -11
          ]
        ]
      }
    }
  },
  "Circle Throw": {
    "pp": 10,
    "type": 7,
    "power": 60,
    "accuracy": 90,
    "moveType": 0,
    "priority": -1,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 117,
    "name": "Circle Throw"
  },
  "Clamp": {
    "pp": 15,
    "type": 3,
    "power": 35,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 118,
    "special": true,
    "name": "Clamp"
  },
  "Clanging Scales": {
    "pp": 5,
    "type": 15,
    "power": 110,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 119,
    "name": "Clanging Scales"
  },
  "Clangorous Soul": {
    "pp": 5,
    "type": 15,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 120,
    "name": "Clangorous Soul",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "Defense",
            1
          ],
          [
            "SpecialDefense",
            1
          ],
          [
            "SpecialAttack",
            1
          ],
          [
            "Attack",
            1
          ],
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Clangorous Soulblaze": {
    "pp": 1,
    "type": 15,
    "power": 185,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 121,
    "name": "Clangorous Soulblaze",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "Defense",
            1
          ],
          [
            "SpecialDefense",
            1
          ],
          [
            "SpecialAttack",
            1
          ],
          [
            "Attack",
            1
          ],
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Clear Smog": {
    "pp": 15,
    "type": 8,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 122,
    "name": "Clear Smog"
  },
  "Close Combat": {
    "pp": 5,
    "type": 7,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 123,
    "name": "Close Combat",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Defense",
            -1
          ],
          [
            "SpecialDefense",
            -1
          ]
        ]
      }
    }
  },
  "Coaching": {
    "pp": 10,
    "type": 7,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 124,
    "name": "Coaching"
  },
  "Coil": {
    "pp": 20,
    "type": 8,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 125,
    "name": "Coil",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "Defense",
            1
          ],
          [
            "SpecialDefense",
            1
          ],
          [
            "SpecialAttack",
            1
          ],
          [
            "Attack",
            1
          ],
          [
            "Evasion",
            1
          ],
          [
            "Accuracy",
            1
          ],
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Collision Course": {
    "pp": 5,
    "type": 7,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 126,
    "name": "Collision Course"
  },
  "Combat Torque": {
    "pp": 10,
    "type": 7,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 127,
    "name": "Combat Torque",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          3
        ]
      }
    }
  },
  "Comet Punch": {
    "pp": 15,
    "type": 2,
    "power": 18,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 128,
    "name": "Comet Punch"
  },
  "Comeuppance": {
    "pp": 10,
    "type": 16,
    "power": 1,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 129,
    "name": "Comeuppance"
  },
  "Confide": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 130,
    "name": "Confide",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "SpecialAttack",
            -1
          ]
        ]
      }
    }
  },
  "Confuse Ray": {
    "pp": 10,
    "type": 14,
    "power": 0,
    "accuracy": 100,
    "moveType": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 131,
    "name": "Confuse Ray",
    "effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          6
        ]
      }
    }
  },
  "Confusion": {
    "pp": 25,
    "type": 11,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 132,
    "name": "Confusion",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          6
        ]
      }
    }
  },
  "Constrict": {
    "pp": 35,
    "type": 2,
    "power": 10,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 133,
    "name": "Constrict",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Continental Crush": {
    "pp": 1,
    "type": 13,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 134,
    "name": "Continental Crush"
  },
  "Conversion": {
    "pp": 30,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 135,
    "name": "Conversion"
  },
  "Conversion 2": {
    "pp": 30,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 136,
    "name": "Conversion 2"
  },
  "Copycat": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 137,
    "name": "Copycat"
  },
  "Core Enforcer": {
    "pp": 10,
    "type": 15,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 138,
    "name": "Core Enforcer"
  },
  "Corkscrew Crash": {
    "pp": 1,
    "type": 17,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 139,
    "name": "Corkscrew Crash"
  },
  "Corrosive Gas": {
    "pp": 40,
    "type": 8,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 140,
    "name": "Corrosive Gas"
  },
  "Cosmic Power": {
    "pp": 20,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 141,
    "name": "Cosmic Power",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Defense",
            1
          ],
          [
            "SpecialDefense",
            1
          ]
        ]
      }
    }
  },
  "Cotton Guard": {
    "pp": 10,
    "type": 5,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 142,
    "name": "Cotton Guard",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Defense",
            2
          ]
        ]
      }
    }
  },
  "Cotton Spore": {
    "pp": 40,
    "type": 5,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 143,
    "name": "Cotton Spore",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Speed",
            -2
          ]
        ]
      }
    }
  },
  "Counter": {
    "pp": 20,
    "type": 7,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": -1,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 144,
    "name": "Counter"
  },
  "Court Change": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 145,
    "name": "Court Change"
  },
  "Covet": {
    "pp": 25,
    "type": 2,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 146,
    "name": "Covet"
  },
  "Crabhammer": {
    "pp": 10,
    "type": 3,
    "power": 100,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 147,
    "name": "Crabhammer"
  },
  "Crafty Shield": {
    "pp": 10,
    "type": 18,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 4,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 148,
    "name": "Crafty Shield"
  },
  "Cross Chop": {
    "pp": 5,
    "type": 7,
    "power": 100,
    "accuracy": 80,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 149,
    "name": "Cross Chop"
  },
  "Cross Poison": {
    "pp": 20,
    "type": 8,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 150,
    "critStage": 1,
    "name": "Cross Poison",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          1
        ]
      }
    }
  },
  "Crunch": {
    "pp": 15,
    "type": 16,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 151,
    "name": "Crunch",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "Defense",
            1
          ]
        ]
      }
    }
  },
  "Crush Claw": {
    "pp": 10,
    "type": 2,
    "power": 75,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 152,
    "name": "Crush Claw",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "Defense",
            1
          ]
        ]
      }
    }
  },
  "Crush Grip": {
    "pp": 5,
    "type": 2,
    "power": 75,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 153,
    "name": "Crush Grip"
  },
  "Curse": {
    "pp": 10,
    "type": 14,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 154,
    "name": "Curse",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Defense",
            1
          ],
          [
            "Attack",
            1
          ],
          [
            "Speed",
            -1
          ]
        ]
      }
    }
  },
  "Cut": {
    "pp": 30,
    "type": 2,
    "power": 50,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 155,
    "name": "Cut"
  },
  "Dark Pulse": {
    "pp": 15,
    "type": 16,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 156,
    "name": "Dark Pulse",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 20,
        "effects": [
          7
        ]
      }
    }
  },
  "Dark Void": {
    "pp": 10,
    "type": 16,
    "power": 0,
    "accuracy": 50,
    "moveType": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 157,
    "name": "Dark Void",
    "effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          4
        ]
      }
    }
  },
  "Darkest Lariat": {
    "pp": 10,
    "type": 16,
    "power": 85,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 158,
    "name": "Darkest Lariat"
  },
  "Dazzling Gleam": {
    "pp": 10,
    "type": 18,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 159,
    "name": "Dazzling Gleam"
  },
  "Decorate": {
    "pp": 15,
    "type": 18,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 160,
    "name": "Decorate",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "SpecialAttack",
            2
          ],
          [
            "Attack",
            2
          ]
        ]
      }
    }
  },
  "Defend Order": {
    "pp": 10,
    "type": 12,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 161,
    "name": "Defend Order",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Defense",
            1
          ],
          [
            "SpecialDefense",
            1
          ]
        ]
      }
    }
  },
  "Defense Curl": {
    "pp": 40,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 162,
    "name": "Defense Curl",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Defense",
            1
          ]
        ]
      }
    }
  },
  "Defog": {
    "pp": 15,
    "type": 10,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 163,
    "name": "Defog",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Evasion",
            -1
          ]
        ]
      }
    }
  },
  "Destiny Bond": {
    "pp": 5,
    "type": 14,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 164,
    "name": "Destiny Bond"
  },
  "Detect": {
    "pp": 5,
    "type": 7,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 3,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 165,
    "name": "Detect"
  },
  "Devastating Drake": {
    "pp": 1,
    "type": 15,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 166,
    "name": "Devastating Drake"
  },
  "Diamond Storm": {
    "pp": 5,
    "type": 13,
    "power": 100,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 167,
    "name": "Diamond Storm",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "Defense",
            2
          ]
        ]
      }
    }
  },
  "Dig": {
    "pp": 10,
    "type": 9,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 168,
    "name": "Dig"
  },
  "Dire Claw": {
    "pp": 15,
    "type": 8,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 169,
    "name": "Dire Claw",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          1
        ]
      }
    }
  },
  "Disable": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 170,
    "name": "Disable"
  },
  "Disarming Voice": {
    "pp": 15,
    "type": 18,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 171,
    "name": "Disarming Voice"
  },
  "Discharge": {
    "pp": 15,
    "type": 4,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 172,
    "name": "Discharge",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          3
        ]
      }
    }
  },
  "Dive": {
    "pp": 10,
    "type": 3,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 173,
    "name": "Dive"
  },
  "Dizzy Punch": {
    "pp": 10,
    "type": 2,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 174,
    "name": "Dizzy Punch",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          6
        ]
      }
    }
  },
  "Doodle": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 175,
    "name": "Doodle"
  },
  "Doom Desire": {
    "pp": 5,
    "type": 17,
    "power": 140,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 176,
    "name": "Doom Desire"
  },
  "Double Edge": {
    "pp": 15,
    "type": 2,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 177,
    "name": "Double Edge"
  },
  "Double Hit": {
    "pp": 10,
    "type": 2,
    "power": 35,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 178,
    "name": "Double Hit"
  },
  "Double Iron Bash": {
    "pp": 5,
    "type": 17,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 179,
    "name": "Double Iron Bash",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          7
        ]
      }
    }
  },
  "Double Kick": {
    "pp": 30,
    "type": 7,
    "power": 30,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 180,
    "name": "Double Kick"
  },
  "Double Shock": {
    "pp": 5,
    "type": 4,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 181,
    "name": "Double Shock"
  },
  "Double Slap": {
    "pp": 10,
    "type": 2,
    "power": 15,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 182,
    "name": "Double Slap"
  },
  "Double Team": {
    "pp": 15,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 183,
    "name": "Double Team",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Evasion",
            1
          ]
        ]
      }
    }
  },
  "Draco Meteor": {
    "pp": 5,
    "type": 15,
    "power": 130,
    "accuracy": 90,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 184,
    "name": "Draco Meteor",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "SpecialAttack",
            -2
          ]
        ]
      }
    }
  },
  "Dragon Ascent": {
    "pp": 5,
    "type": 10,
    "power": 120,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 185,
    "name": "Dragon Ascent",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Defense",
            -1
          ],
          [
            "SpecialDefense",
            -1
          ]
        ]
      }
    }
  },
  "Dragon Breath": {
    "pp": 20,
    "type": 15,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 186,
    "name": "Dragon Breath",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          3
        ]
      }
    }
  },
  "Dragon Cheer": {
    "pp": 15,
    "type": 15,
    "power": 0,
    "accuracy": 0,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 187,
    "name": "Dragon Cheer"
  },
  "Dragon Claw": {
    "pp": 15,
    "type": 15,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 188,
    "name": "Dragon Claw"
  },
  "Dragon Dance": {
    "pp": 20,
    "type": 15,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 189,
    "name": "Dragon Dance",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Attack",
            1
          ],
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Dragon Darts": {
    "pp": 10,
    "type": 15,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 190,
    "name": "Dragon Darts"
  },
  "Dragon Energy": {
    "pp": 5,
    "type": 15,
    "power": 150,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 191,
    "name": "Dragon Energy"
  },
  "Dragon Hammer": {
    "pp": 15,
    "type": 15,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 192,
    "name": "Dragon Hammer"
  },
  "Dragon Pulse": {
    "pp": 10,
    "type": 15,
    "power": 85,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 193,
    "name": "Dragon Pulse"
  },
  "Dragon Rage": {
    "pp": 10,
    "type": 15,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 194,
    "name": "Dragon Rage"
  },
  "Dragon Rush": {
    "pp": 10,
    "type": 15,
    "power": 100,
    "accuracy": 75,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 195,
    "name": "Dragon Rush",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          7
        ]
      }
    }
  },
  "Dragon Tail": {
    "pp": 10,
    "type": 15,
    "power": 60,
    "accuracy": 90,
    "moveType": 0,
    "priority": -1,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 196,
    "name": "Dragon Tail"
  },
  "Drain Punch": {
    "pp": 10,
    "type": 7,
    "power": 75,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 197,
    "name": "Drain Punch",
    "special": true
  },
  "Draining Kiss": {
    "pp": 10,
    "type": 18,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 198,
    "name": "Draining Kiss",
    "special": true
  },
  "Dream Eater": {
    "pp": 15,
    "type": 11,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "special": true,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 199,
    "name": "Dream Eater",
    "drain": 0.5
  },
  "Drill Peck": {
    "pp": 20,
    "type": 10,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 200,
    "name": "Drill Peck"
  },
  "Drill Run": {
    "pp": 10,
    "type": 9,
    "power": 80,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 201,
    "name": "Drill Run"
  },
  "Drum Beating": {
    "pp": 10,
    "type": 5,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 202,
    "name": "Drum Beating",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "Speed",
            -1
          ]
        ]
      }
    }
  },
  "Dual Chop": {
    "pp": 15,
    "type": 15,
    "power": 40,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 203,
    "name": "Dual Chop"
  },
  "Dual Wingbeat": {
    "pp": 10,
    "type": 10,
    "power": 40,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 204,
    "name": "Dual Wingbeat"
  },
  "Dynamax Cannon": {
    "pp": 5,
    "type": 15,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 205,
    "name": "Dynamax Cannon"
  },
  "Dynamic Punch": {
    "pp": 5,
    "type": 7,
    "power": 100,
    "accuracy": 50,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 206,
    "name": "Dynamic Punch",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          6
        ]
      }
    }
  },
  "Earth Power": {
    "pp": 10,
    "type": 9,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 207,
    "name": "Earth Power",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "SpecialDefense",
            -1
          ]
        ]
      }
    }
  },
  "Earthquake": {
    "pp": 10,
    "type": 9,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 208,
    "name": "Earthquake"
  },
  "Echoed Voice": {
    "pp": 15,
    "type": 2,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 209,
    "name": "Echoed Voice"
  },
  "Eerie Impulse": {
    "pp": 15,
    "type": 4,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 210,
    "name": "Eerie Impulse",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "SpecialAttack",
            -2
          ]
        ]
      }
    }
  },
  "Eerie Spell": {
    "pp": 5,
    "type": 11,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 211,
    "name": "Eerie Spell"
  },
  "Egg Bomb": {
    "pp": 10,
    "type": 2,
    "power": 100,
    "accuracy": 75,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 212,
    "name": "Egg Bomb"
  },
  "Electric Terrain": {
    "pp": 10,
    "type": 4,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 213,
    "name": "Electric Terrain"
  },
  "Electrify": {
    "pp": 20,
    "type": 4,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 214,
    "name": "Electrify"
  },
  "Electro Ball": {
    "pp": 10,
    "type": 4,
    "power": 75,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 215,
    "name": "Electro Ball"
  },
  "Electro Drift": {
    "pp": 5,
    "type": 4,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 216,
    "name": "Electro Drift"
  },
  "Electro Shot": {
    "pp": 10,
    "type": 4,
    "power": 130,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 217,
    "name": "Electro Shot"
  },
  "Electroweb": {
    "pp": 15,
    "type": 4,
    "power": 55,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 218,
    "name": "Electroweb",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Embargo": {
    "pp": 15,
    "type": 16,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 219,
    "name": "Embargo"
  },
  "Ember": {
    "pp": 25,
    "type": 1,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 220,
    "name": "Ember",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          2
        ]
      }
    }
  },
  "Encore": {
    "pp": 5,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 221,
    "name": "Encore"
  },
  "Endeavor": {
    "pp": 5,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 222,
    "name": "Endeavor"
  },
  "Endure": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 2,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 223,
    "name": "Endure"
  },
  "Energy Ball": {
    "pp": 10,
    "type": 5,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 224,
    "name": "Energy Ball",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "SpecialDefense",
            -1
          ]
        ]
      }
    }
  },
  "Entrainment": {
    "pp": 15,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 225,
    "name": "Entrainment"
  },
  "Eruption": {
    "pp": 5,
    "type": 1,
    "power": 150,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 226,
    "name": "Eruption"
  },
  "Esper Wing": {
    "pp": 10,
    "type": 11,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 227,
    "name": "Esper Wing",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Eternabeam": {
    "pp": 5,
    "type": 15,
    "power": 160,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 228,
    "name": "Eternabeam"
  },
  "Expanding Force": {
    "pp": 10,
    "type": 11,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 229,
    "name": "Expanding Force"
  },
  "Explosion": {
    "pp": 5,
    "type": 2,
    "power": 250,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 230,
    "name": "Explosion"
  },
  "Extrasensory": {
    "pp": 20,
    "type": 11,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 231,
    "name": "Extrasensory",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          7
        ]
      }
    }
  },
  "Extreme Evoboost": {
    "pp": 1,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 232,
    "name": "Extreme Evoboost",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Defense",
            2
          ],
          [
            "SpecialDefense",
            2
          ],
          [
            "SpecialAttack",
            2
          ],
          [
            "Attack",
            2
          ],
          [
            "Speed",
            2
          ]
        ]
      }
    }
  },
  "Extreme Speed": {
    "pp": 5,
    "type": 2,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 2,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 233,
    "name": "Extreme Speed"
  },
  "Facade": {
    "pp": 20,
    "type": 2,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 234,
    "name": "Facade"
  },
  "Fairy Lock": {
    "pp": 10,
    "type": 18,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 235,
    "name": "Fairy Lock"
  },
  "Fairy Wind": {
    "pp": 30,
    "type": 18,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 236,
    "name": "Fairy Wind"
  },
  "Fake Out": {
    "pp": 10,
    "type": 2,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 237,
    "name": "Fake Out"
  },
  "Fake Tears": {
    "pp": 20,
    "type": 16,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 238,
    "name": "Fake Tears",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "SpecialDefense",
            -2
          ]
        ]
      }
    }
  },
  "False Surrender": {
    "pp": 10,
    "type": 16,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 239,
    "name": "False Surrender"
  },
  "False Swipe": {
    "pp": 40,
    "type": 2,
    "power": 40,
    "accuracy": 100,
    "moveType": MoveDamageType.SPECIAL,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "special": true,
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 240,
    "name": "False Swipe"
  },
  "Feather Dance": {
    "pp": 15,
    "type": 10,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 241,
    "name": "Feather Dance",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Attack",
            -1
          ]
        ]
      }
    }
  },
  "Feint": {
    "pp": 10,
    "type": 2,
    "power": 30,
    "accuracy": 100,
    "moveType": 0,
    "priority": 2,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 242,
    "name": "Feint"
  },
  "Feint Attack": {
    "pp": 20,
    "type": 16,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 243,
    "name": "Feint Attack"
  },
  "Fell Stinger": {
    "pp": 25,
    "type": 12,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 244,
    "name": "Fell Stinger"
  },
  "Fickle Beam": {
    "pp": 5,
    "type": 15,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 245,
    "name": "Fickle Beam"
  },
  "Fiery Dance": {
    "pp": 10,
    "type": 1,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 246,
    "name": "Fiery Dance",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 50,
        "stats": [
          [
            "SpecialAttack",
            1
          ]
        ]
      }
    }
  },
  "Fiery Wrath": {
    "pp": 10,
    "type": 16,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 247,
    "name": "Fiery Wrath",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 20,
        "effects": [
          7
        ]
      }
    }
  },
  "Fillet Away": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 248,
    "name": "Fillet Away",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "SpecialAttack",
            1
          ],
          [
            "Attack",
            1
          ],
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Final Gambit": {
    "pp": 5,
    "type": 7,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 249,
    "name": "Final Gambit"
  },
  "Fire Blast": {
    "pp": 5,
    "type": 1,
    "power": 110,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 250,
    "name": "Fire Blast",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          6
        ]
      }
    }
  },
  "Fire Fang": {
    "pp": 15,
    "type": 1,
    "power": 65,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 251,
    "name": "Fire Fang",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          2
        ]
      }
    }
  },
  "Fire Lash": {
    "pp": 15,
    "type": 1,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 252,
    "name": "Fire Lash",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Defense",
            1
          ]
        ]
      }
    }
  },
  "Fire Pledge": {
    "pp": 10,
    "type": 1,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 253,
    "name": "Fire Pledge"
  },
  "Fire Punch": {
    "pp": 15,
    "type": 1,
    "power": 75,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 254,
    "name": "Fire Punch",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          2
        ]
      }
    }
  },
  "Fire Spin": {
    "pp": 15,
    "type": 1,
    "power": 35,
    "accuracy": 85,
    "moveType": 0,
    "special": true,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 255,
    "name": "Fire Spin"
  },
  "First Impression": {
    "pp": 10,
    "type": 12,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 2,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 256,
    "name": "First Impression"
  },
  "Fishious Rend": {
    "pp": 10,
    "type": 3,
    "power": 85,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 257,
    "name": "Fishious Rend"
  },
  "Fissure": {
    "pp": 5,
    "type": 9,
    "power": 0,
    "accuracy": 30,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 258,
    "name": "Fissure"
  },
  "Flail": {
    "pp": 15,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 259,
    "name": "Flail"
  },
  "Flame Burst": {
    "pp": 15,
    "type": 1,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 260,
    "name": "Flame Burst"
  },
  "Flame Charge": {
    "pp": 20,
    "type": 1,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 261,
    "name": "Flame Charge",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Flame Wheel": {
    "pp": 25,
    "type": 1,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 262,
    "name": "Flame Wheel",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          2
        ]
      }
    }
  },
  "Flamethrower": {
    "pp": 15,
    "type": 1,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 263,
    "name": "Flamethrower",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          2
        ]
      }
    }
  },
  "Flare Blitz": {
    "pp": 15,
    "type": 1,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 264,
    "name": "Flare Blitz",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          2
        ]
      }
    }
  },
  "Flash": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 265,
    "name": "Flash",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "Accuracy",
            -1
          ]
        ]
      }
    }
  },
  "Flash Cannon": {
    "pp": 10,
    "type": 17,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 266,
    "name": "Flash Cannon",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "SpecialDefense",
            -1
          ]
        ]
      }
    }
  },
  "Flatter": {
    "pp": 15,
    "type": 16,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 267,
    "name": "Flatter",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          6
        ]
      }
    }
  },
  "Fleur Cannon": {
    "pp": 5,
    "type": 18,
    "power": 130,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 268,
    "name": "Fleur Cannon",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "SpecialAttack",
            1
          ]
        ]
      }
    }
  },
  "Fling": {
    "pp": 10,
    "type": 16,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 269,
    "name": "Fling"
  },
  "Flip Turn": {
    "pp": 20,
    "type": 3,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 270,
    "name": "Flip Turn"
  },
  "Floaty Fall": {
    "pp": 15,
    "type": 10,
    "power": 90,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 271,
    "name": "Floaty Fall",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          7
        ]
      }
    }
  },
  "Floral Healing": {
    "pp": 10,
    "type": 18,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 272,
    "name": "Floral Healing"
  },
  "Flower Shield": {
    "pp": 10,
    "type": 18,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 273,
    "name": "Flower Shield",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Defense",
            2
          ]
        ]
      }
    }
  },
  "Flower Trick": {
    "pp": 10,
    "type": 5,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 274,
    "name": "Flower Trick"
  },
  "Fly": {
    "pp": 15,
    "type": 10,
    "power": 90,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 275,
    "name": "Fly"
  },
  "Flying Press": {
    "pp": 10,
    "type": 7,
    "power": 100,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 276,
    "name": "Flying Press"
  },
  "Focus Blast": {
    "pp": 5,
    "type": 7,
    "power": 120,
    "accuracy": 70,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 277,
    "name": "Focus Blast",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "SpecialDefense",
            -1
          ]
        ]
      }
    }
  },
  "Focus Energy": {
    "pp": 30,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 278,
    "name": "Focus Energy"
  },
  "Focus Punch": {
    "pp": 20,
    "type": 7,
    "power": 150,
    "accuracy": 100,
    "moveType": 0,
    "priority": -3,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 279,
    "name": "Focus Punch"
  },
  "Follow Me": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 2,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 280,
    "name": "Follow Me"
  },
  "Force Palm": {
    "pp": 10,
    "type": 7,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 281,
    "name": "Force Palm",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          3
        ]
      }
    }
  },
  "Foresight": {
    "pp": 40,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 282,
    "name": "Foresight"
  },
  "Forests Curse": {
    "pp": 20,
    "type": 5,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 283,
    "name": "Forests Curse"
  },
  "Foul Play": {
    "pp": 15,
    "type": 16,
    "power": 95,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 284,
    "name": "Foul Play"
  },
  "Freeze Dry": {
    "pp": 20,
    "type": 6,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 285,
    "name": "Freeze Dry",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          5
        ]
      }
    }
  },
  "Freeze Shock": {
    "pp": 5,
    "type": 6,
    "power": 140,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 286,
    "name": "Freeze Shock",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          3
        ]
      }
    }
  },
  "Freezing Glare": {
    "pp": 10,
    "type": 11,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 287,
    "name": "Freezing Glare",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          5
        ]
      }
    }
  },
  "Freezy Frost": {
    "pp": 10,
    "type": 6,
    "power": 100,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 288,
    "name": "Freezy Frost"
  },
  "Frenzy Plant": {
    "pp": 5,
    "type": 5,
    "power": 150,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 289,
    "name": "Frenzy Plant"
  },
  "Frost Breath": {
    "pp": 10,
    "type": 6,
    "power": 60,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 290,
    "critStage": 3,
    "name": "Frost Breath"
  },
  "Frustration": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 291,
    "name": "Frustration"
  },
  "Fury Attack": {
    "pp": 20,
    "type": 2,
    "power": 15,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 292,
    "name": "Fury Attack"
  },
  "Fury Cutter": {
    "pp": 20,
    "type": 12,
    "power": 40,
    "accuracy": 95,
    "category": "Physical",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 293,
    "name": "Fury Cutter"
  },
  "Fury Swipes": {
    "pp": 15,
    "type": 2,
    "power": 18,
    "accuracy": 80,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 294,
    "name": "Fury Swipes"
  },
  "Fusion Bolt": {
    "pp": 5,
    "type": 4,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 295,
    "name": "Fusion Bolt"
  },
  "Fusion Flare": {
    "pp": 5,
    "type": 1,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 296,
    "name": "Fusion Flare"
  },
  "Future Sight": {
    "pp": 10,
    "type": 11,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 297,
    "name": "Future Sight"
  },
  "Gastro Acid": {
    "pp": 10,
    "type": 8,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 298,
    "name": "Gastro Acid"
  },
  "Gear Grind": {
    "pp": 15,
    "type": 17,
    "power": 50,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 299,
    "name": "Gear Grind"
  },
  "Gear Up": {
    "pp": 20,
    "type": 17,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 300,
    "name": "Gear Up",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "SpecialAttack",
            1
          ],
          [
            "Attack",
            1
          ]
        ]
      }
    }
  },
  "Genesis Supernova": {
    "pp": 1,
    "type": 11,
    "power": 185,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 301,
    "name": "Genesis Supernova"
  },
  "Geomancy": {
    "pp": 10,
    "type": 18,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 302,
    "name": "Geomancy",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "SpecialDefense",
            2
          ],
          [
            "SpecialAttack",
            2
          ],
          [
            "Speed",
            2
          ]
        ]
      }
    }
  },
  "Giga Drain": {
    "pp": 10,
    "type": 5,
    "power": 75,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 303,
    "name": "Giga Drain",
    "special": true
  },
  "Giga Impact": {
    "pp": 5,
    "type": 2,
    "power": 150,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 304,
    "name": "Giga Impact"
  },
  "Gigaton Hammer": {
    "pp": 5,
    "type": 17,
    "power": 160,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 305,
    "name": "Gigaton Hammer"
  },
  "Gigavolt Havoc": {
    "pp": 1,
    "type": 4,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 306,
    "name": "Gigavolt Havoc"
  },
  "Glacial Lance": {
    "pp": 5,
    "type": 6,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 307,
    "name": "Glacial Lance"
  },
  "Glaciate": {
    "pp": 10,
    "type": 6,
    "power": 65,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 308,
    "name": "Glaciate",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Glaive Rush": {
    "pp": 5,
    "type": 15,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 309,
    "name": "Glaive Rush"
  },
  "Glare": {
    "pp": 30,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 310,
    "name": "Glare",
    "effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          3
        ]
      }
    }
  },
  "Glitzy Glow": {
    "pp": 15,
    "type": 11,
    "power": 80,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 311,
    "name": "Glitzy Glow"
  },
  "Grass Knot": {
    "pp": 20,
    "type": 5,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 312,
    "name": "Grass Knot"
  },
  "Grass Pledge": {
    "pp": 10,
    "type": 5,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 313,
    "name": "Grass Pledge"
  },
  "Grass Whistle": {
    "pp": 15,
    "type": 5,
    "power": 0,
    "accuracy": 55,
    "moveType": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 314,
    "name": "Grass Whistle",
    "effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          4
        ]
      }
    }
  },
  "Grassy Glide": {
    "pp": 20,
    "type": 5,
    "power": 55,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 315,
    "name": "Grassy Glide"
  },
  "Grassy Terrain": {
    "pp": 10,
    "type": 5,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 316,
    "name": "Grassy Terrain"
  },
  "Grav Apple": {
    "pp": 10,
    "type": 5,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 317,
    "name": "Grav Apple",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Defense",
            -1
          ]
        ]
      }
    }
  },
  "Gravity": {
    "pp": 5,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 318,
    "name": "Gravity"
  },
  "Growl": {
    "pp": 40,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 319,
    "name": "Growl",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Attack",
            -1
          ]
        ]
      }
    }
  },
  "Growth": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 320,
    "name": "Growth",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "SpecialAttack",
            1
          ],
          [
            "Attack",
            1
          ]
        ]
      }
    }
  },
  "Grudge": {
    "pp": 5,
    "type": 14,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 321,
    "name": "Grudge"
  },
  "Guard Split": {
    "pp": 10,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 322,
    "name": "Guard Split"
  },
  "Guard Swap": {
    "pp": 10,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 323,
    "name": "Guard Swap"
  },
  "Guardian Of Alola": {
    "pp": 1,
    "type": 18,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 324,
    "name": "Guardian Of Alola"
  },
  "Guillotine": {
    "pp": 5,
    "type": 2,
    "power": 0,
    "accuracy": 30,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 325,
    "name": "Guillotine"
  },
  "Gunk Shot": {
    "pp": 5,
    "type": 8,
    "power": 120,
    "accuracy": 80,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 326,
    "name": "Gunk Shot",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          1
        ]
      }
    }
  },
  "Gust": {
    "pp": 35,
    "type": 10,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 327,
    "name": "Gust"
  },
  "Gyro Ball": {
    "pp": 5,
    "type": 17,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 328,
    "name": "Gyro Ball"
  },
  "Hail": {
    "pp": 10,
    "type": 6,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 329,
    "name": "Hail"
  },
  "Hammer Arm": {
    "pp": 10,
    "type": 7,
    "power": 100,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 330,
    "name": "Hammer Arm",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Speed",
            11
          ]
        ]
      }
    }
  },
  "Happy Hour": {
    "pp": 30,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 331,
    "name": "Happy Hour"
  },
  "Hard Press": {
    "pp": 10,
    "type": 17,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 332,
    "name": "Hard Press"
  },
  "Harden": {
    "pp": 30,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 333,
    "name": "Harden",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Defense",
            1
          ]
        ]
      }
    }
  },
  "Haze": {
    "pp": 30,
    "type": 6,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 334,
    "name": "Haze"
  },
  "Head Charge": {
    "pp": 15,
    "type": 2,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 335,
    "name": "Head Charge"
  },
  "Head Smash": {
    "pp": 5,
    "type": 13,
    "power": 150,
    "accuracy": 80,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 336,
    "name": "Head Smash"
  },
  "Headbutt": {
    "pp": 15,
    "type": 2,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 337,
    "name": "Headbutt",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          7
        ]
      }
    }
  },
  "Headlong Rush": {
    "pp": 5,
    "type": 9,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 338,
    "name": "Headlong Rush",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "Defense",
            -1
          ]
        ]
      }
    }
  },
  "Heal Bell": {
    "pp": 5,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 339,
    "name": "Heal Bell"
  },
  "Heal Block": {
    "pp": 15,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 340,
    "name": "Heal Block"
  },
  "Heal Order": {
    "pp": 10,
    "type": 12,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 341,
    "name": "Heal Order"
  },
  "Heal Pulse": {
    "pp": 10,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 342,
    "name": "Heal Pulse"
  },
  "Healing Wish": {
    "pp": 10,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 343,
    "name": "Healing Wish"
  },
  "Heart Stamp": {
    "pp": 25,
    "type": 11,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 344,
    "name": "Heart Stamp",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          7
        ]
      }
    }
  },
  "Heart Swap": {
    "pp": 10,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 345,
    "name": "Heart Swap"
  },
  "Heat Crash": {
    "pp": 10,
    "type": 1,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 346,
    "name": "Heat Crash"
  },
  "Heat Wave": {
    "pp": 10,
    "type": 1,
    "power": 95,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 347,
    "name": "Heat Wave",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          2
        ]
      }
    }
  },
  "Heavy Slam": {
    "pp": 10,
    "type": 17,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 348,
    "name": "Heavy Slam"
  },
  "Helping Hand": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 3,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 349,
    "name": "Helping Hand"
  },
  "Hex": {
    "pp": 10,
    "type": 14,
    "power": 65,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 350,
    "name": "Hex"
  },
  "Hidden Power": {
    "pp": 15,
    "type": 2,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 351,
    "name": "Hidden Power"
  },
  "High Horsepower": {
    "pp": 10,
    "type": 9,
    "power": 95,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 352,
    "name": "High Horsepower"
  },
  "High Jump Kick": {
    "pp": 10,
    "type": 7,
    "power": 130,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 353,
    "name": "High Jump Kick"
  },
  "Hold Back": {
    "pp": 40,
    "type": 2,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 354,
    "name": "Hold Back"
  },
  "Hold Hands": {
    "pp": 40,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 355,
    "name": "Hold Hands"
  },
  "Hone Claws": {
    "pp": 15,
    "type": 16,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 356,
    "name": "Hone Claws",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "Attack",
            1
          ],
          [
            "Accuracy",
            1
          ]
        ]
      }
    }
  },
  "Horn Attack": {
    "pp": 25,
    "type": 2,
    "power": 65,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 357,
    "name": "Horn Attack"
  },
  "Horn Drill": {
    "pp": 5,
    "type": 2,
    "power": 0,
    "accuracy": 30,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 358,
    "name": "Horn Drill"
  },
  "Horn Leech": {
    "pp": 10,
    "type": 5,
    "power": 75,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 359,
    "name": "Horn Leech",
    "special": true
  },
  "Howl": {
    "pp": 40,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 360,
    "name": "Howl",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Attack",
            1
          ]
        ]
      }
    }
  },
  "Hurricane": {
    "pp": 10,
    "type": 10,
    "power": 110,
    "accuracy": 70,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 361,
    "name": "Hurricane",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          6
        ]
      }
    }
  },
  "Hydro Cannon": {
    "pp": 5,
    "type": 3,
    "power": 150,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 362,
    "name": "Hydro Cannon"
  },
  "Hydro Pump": {
    "pp": 5,
    "type": 3,
    "power": 110,
    "accuracy": 80,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 363,
    "name": "Hydro Pump"
  },
  "Hydro Steam": {
    "pp": 15,
    "type": 3,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 364,
    "name": "Hydro Steam"
  },
  "Hydro Vortex": {
    "pp": 1,
    "type": 3,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 365,
    "name": "Hydro Vortex"
  },
  "Hyper Beam": {
    "pp": 5,
    "type": 2,
    "power": 150,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 366,
    "name": "Hyper Beam"
  },
  "Hyper Drill": {
    "pp": 5,
    "type": 2,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 367,
    "name": "Hyper Drill"
  },
  "Hyper Fang": {
    "pp": 15,
    "type": 2,
    "power": 80,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 368,
    "name": "Hyper Fang",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          7
        ]
      }
    }
  },
  "Hyper Voice": {
    "pp": 10,
    "type": 2,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 369,
    "name": "Hyper Voice"
  },
  "Hyperspace Fury": {
    "pp": 5,
    "type": 16,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 370,
    "name": "Hyperspace Fury",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "Defense",
            -1
          ]
        ]
      }
    }
  },
  "Hyperspace Hole": {
    "pp": 5,
    "type": 11,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 371,
    "name": "Hyperspace Hole"
  },
  "Hypnosis": {
    "pp": 20,
    "type": 11,
    "power": 0,
    "accuracy": 60,
    "moveType": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 372,
    "name": "Hypnosis",
    "effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          4
        ]
      }
    }
  },
  "Ice Ball": {
    "pp": 20,
    "type": 6,
    "power": 30,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 373,
    "name": "Ice Ball"
  },
  "Ice Beam": {
    "pp": 10,
    "type": 6,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 374,
    "name": "Ice Beam",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          5
        ]
      }
    }
  },
  "Ice Burn": {
    "pp": 5,
    "type": 6,
    "power": 140,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 375,
    "name": "Ice Burn",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          2
        ]
      }
    }
  },
  "Ice Fang": {
    "pp": 15,
    "type": 6,
    "power": 65,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 376,
    "name": "Ice Fang",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          7
        ]
      }
    }
  },
  "Ice Hammer": {
    "pp": 10,
    "type": 6,
    "power": 100,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 377,
    "name": "Ice Hammer",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "Speed",
            -1
          ]
        ]
      }
    }
  },
  "Ice Punch": {
    "pp": 15,
    "type": 6,
    "power": 75,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 378,
    "name": "Ice Punch",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          5
        ]
      }
    }
  },
  "Ice Shard": {
    "pp": 30,
    "type": 6,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 1,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 379,
    "name": "Ice Shard"
  },
  "Ice Spinner": {
    "pp": 15,
    "type": 6,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 380,
    "name": "Ice Spinner"
  },
  "Icicle Crash": {
    "pp": 10,
    "type": 6,
    "power": 85,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 381,
    "name": "Icicle Crash",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          7
        ]
      }
    }
  },
  "Icicle Spear": {
    "pp": 30,
    "type": 6,
    "power": 25,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 382,
    "name": "Icicle Spear"
  },
  "Icy Wind": {
    "pp": 15,
    "type": 6,
    "power": 55,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 383,
    "name": "Icy Wind",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "Speed",
            -1
          ]
        ]
      }
    }
  },
  "Imprison": {
    "pp": 10,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 384,
    "name": "Imprison"
  },
  "Incinerate": {
    "pp": 15,
    "type": 1,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 385,
    "name": "Incinerate"
  },
  "Infernal Parade": {
    "pp": 15,
    "type": 14,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 386,
    "name": "Infernal Parade"
  },
  "Inferno": {
    "pp": 5,
    "type": 1,
    "power": 100,
    "accuracy": 50,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 387,
    "name": "Inferno",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          2
        ]
      }
    }
  },
  "Inferno Overdrive": {
    "pp": 1,
    "type": 1,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 388,
    "name": "Inferno Overdrive"
  },
  "Infestation": {
    "pp": 20,
    "type": 12,
    "power": 20,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "special": true,
    "category": "Special",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 389,
    "name": "Infestation"
  },
  "Ingrain": {
    "pp": 20,
    "type": 5,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 390,
    "name": "Ingrain"
  },
  "Instruct": {
    "pp": 15,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 391,
    "name": "Instruct"
  },
  "Ion Deluge": {
    "pp": 25,
    "type": 4,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 392,
    "name": "Ion Deluge"
  },
  "Iron Defense": {
    "pp": 15,
    "type": 17,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 393,
    "name": "Iron Defense",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Defense",
            2
          ]
        ]
      }
    }
  },
  "Iron Head": {
    "pp": 15,
    "type": 17,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 394,
    "name": "Iron Head",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          7
        ]
      }
    }
  },
  "Iron Tail": {
    "pp": 15,
    "type": 17,
    "power": 100,
    "accuracy": 75,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 395,
    "name": "Iron Tail",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 30,
        "stats": [
          [
            "Defense",
            -1
          ]
        ]
      }
    }
  },
  "Ivy Cudgel": {
    "pp": 10,
    "type": 5,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 396,
    "name": "Ivy Cudgel"
  },
  "Jaw Lock": {
    "pp": 10,
    "type": 16,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 397,
    "name": "Jaw Lock"
  },
  "Jet Punch": {
    "pp": 15,
    "type": 3,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": true,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 398,
    "name": "Jet Punch"
  },
  "Judgment": {
    "pp": 10,
    "type": 2,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 399,
    "name": "Judgment"
  },
  "Jump Kick": {
    "pp": 10,
    "type": 7,
    "power": 100,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 400,
    "name": "Jump Kick"
  },
  "Jungle Healing": {
    "pp": 10,
    "type": 5,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 401,
    "name": "Jungle Healing"
  },
  "Karate Chop": {
    "pp": 25,
    "type": 7,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 402,
    "name": "Karate Chop"
  },
  "Kinesis": {
    "pp": 15,
    "type": 11,
    "power": 0,
    "accuracy": 80,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 403,
    "name": "Kinesis",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Accuracy",
            -1
          ]
        ]
      }
    }
  },
  "Kings Shield": {
    "pp": 10,
    "type": 17,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 1,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 404,
    "name": "Kings Shield"
  },
  "Knock Off": {
    "pp": 20,
    "type": 16,
    "power": 65,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 405,
    "name": "Knock Off"
  },
  "Kowtow Cleave": {
    "pp": 10,
    "type": 16,
    "power": 85,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 406,
    "name": "Kowtow Cleave"
  },
  "Lands Wrath": {
    "pp": 10,
    "type": 9,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 407,
    "name": "Lands Wrath"
  },
  "Laser Focus": {
    "pp": 30,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 3,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 408,
    "name": "Laser Focus"
  },
  "Lash Out": {
    "pp": 5,
    "type": 16,
    "power": 75,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 409,
    "name": "Lash Out"
  },
  "Last Resort": {
    "pp": 5,
    "type": 2,
    "power": 140,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 410,
    "name": "Last Resort"
  },
  "Last Respects": {
    "pp": 10,
    "type": 14,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 411,
    "name": "Last Respects"
  },
  "Lava Plume": {
    "pp": 15,
    "type": 1,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 412,
    "name": "Lava Plume",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          2
        ]
      }
    }
  },
  "Leaf Blade": {
    "pp": 15,
    "type": 5,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 413,
    "critStage": 1,
    "name": "Leaf Blade"
  },
  "Leaf Storm": {
    "pp": 5,
    "type": 5,
    "power": 130,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 414,
    "name": "Leaf Storm",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "SpecialAttack",
            -2
          ]
        ]
      }
    }
  },
  "Leaf Tornado": {
    "pp": 10,
    "type": 5,
    "power": 65,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 415,
    "name": "Leaf Tornado",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 50,
        "stats": [
          [
            "Accuracy",
            -1
          ]
        ]
      }
    }
  },
  "Leafage": {
    "pp": 40,
    "type": 5,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 416,
    "name": "Leafage"
  },
  "Leech Life": {
    "pp": 10,
    "type": 12,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 417,
    "name": "Leech Life",
    "special": true
  },
  "Leech Seed": {
    "pp": 10,
    "type": 5,
    "power": 0,
    "accuracy": 90,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 418,
    "name": "Leech Seed"
  },
  "Leer": {
    "pp": 30,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 419,
    "name": "Leer",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Defense",
            -1
          ]
        ]
      }
    }
  },
  "Lets Snuggle Forever": {
    "pp": 1,
    "type": 18,
    "power": 190,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 420,
    "name": "Lets Snuggle Forever"
  },
  "Lick": {
    "pp": 30,
    "type": 14,
    "power": 30,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 421,
    "name": "Lick",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          3
        ]
      }
    }
  },
  "Life Dew": {
    "pp": 10,
    "type": 3,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 422,
    "name": "Life Dew"
  },
  "Light Of Ruin": {
    "pp": 5,
    "type": 18,
    "power": 140,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 423,
    "name": "Light Of Ruin"
  },
  "Light Screen": {
    "pp": 30,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 424,
    "name": "Light Screen"
  },
  "Light That Burns The Sky": {
    "pp": 1,
    "type": 11,
    "power": 200,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 425,
    "name": "Light That Burns The Sky"
  },
  "Liquidation": {
    "pp": 10,
    "type": 3,
    "power": 85,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 426,
    "name": "Liquidation",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 20,
        "stats": [
          [
            "Defense",
            -1
          ]
        ]
      }
    }
  },
  "Lock On": {
    "pp": 5,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 427,
    "name": "Lock On"
  },
  "Lovely Kiss": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 75,
    "moveType": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 428,
    "name": "Lovely Kiss",
    "effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          4
        ]
      }
    }
  },
  "Low Kick": {
    "pp": 20,
    "type": 7,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 429,
    "name": "Low Kick"
  },
  "Low Sweep": {
    "pp": 20,
    "type": 7,
    "power": 65,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 430,
    "name": "Low Sweep",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "Speed",
            -1
          ]
        ]
      }
    }
  },
  "Lucky Chant": {
    "pp": 30,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 431,
    "name": "Lucky Chant"
  },
  "Lumina Crash": {
    "pp": 10,
    "type": 11,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 432,
    "name": "Lumina Crash",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "SpecialDefense",
            -2
          ]
        ]
      }
    }
  },
  "Lunar Blessing": {
    "pp": 5,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": MoveDamageType.SPECIAL,
    "category": "Status",
    "special": true,
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 433,
    "name": "Lunar Blessing"
  },
  "Lunar Dance": {
    "pp": 10,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 434,
    "name": "Lunar Dance"
  },
  "Lunge": {
    "pp": 15,
    "type": 12,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 435,
    "name": "Lunge",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Attack",
            -1
          ]
        ]
      }
    }
  },
  "Luster Purge": {
    "pp": 5,
    "type": 11,
    "power": 95,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 436,
    "name": "Luster Purge",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "SpecialDefense",
            -1
          ]
        ]
      }
    }
  },
  "Mach Punch": {
    "pp": 30,
    "type": 7,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 1,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 437,
    "name": "Mach Punch"
  },
  "Magic Coat": {
    "pp": 15,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 3,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 438,
    "name": "Magic Coat"
  },
  "Magic Powder": {
    "pp": 20,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 439,
    "name": "Magic Powder"
  },
  "Magic Room": {
    "pp": 10,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 440,
    "name": "Magic Room"
  },
  "Magical Leaf": {
    "pp": 20,
    "type": 5,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 441,
    "name": "Magical Leaf"
  },
  "Magical Torque": {
    "pp": 10,
    "type": 18,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 442,
    "name": "Magical Torque",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          6
        ]
      }
    }
  },
  "Magma Storm": {
    "pp": 5,
    "type": 1,
    "power": 100,
    "accuracy": 75,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 443,
    "name": "Magma Storm"
  },
  "Magnet Bomb": {
    "pp": 20,
    "type": 17,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 444,
    "name": "Magnet Bomb"
  },
  "Magnet Rise": {
    "pp": 10,
    "type": 4,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 445,
    "name": "Magnet Rise"
  },
  "Magnetic Flux": {
    "pp": 20,
    "type": 4,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 446,
    "name": "Magnetic Flux",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Defense",
            1
          ],
          [
            "SpecialDefense",
            1
          ]
        ]
      }
    }
  },
  "Magnitude": {
    "pp": 30,
    "type": 9,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 447,
    "name": "Magnitude"
  },
  "Make It Rain": {
    "pp": 5,
    "type": 17,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 448,
    "name": "Make It Rain",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "SpecialAttack",
            -1
          ]
        ]
      }
    }
  },
  "Malicious Moonsault": {
    "pp": 1,
    "type": 16,
    "power": 180,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 449,
    "name": "Malicious Moonsault"
  },
  "Malignant Chain": {
    "pp": 5,
    "type": 8,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 450,
    "name": "Malignant Chain",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          1
        ]
      }
    }
  },
  "Mat Block": {
    "pp": 10,
    "type": 7,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 4,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 451,
    "name": "Mat Block"
  },
  "Matcha Gotcha": {
    "pp": 15,
    "type": 5,
    "power": 80,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 452,
    "name": "Matcha Gotcha",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 20,
        "effects": [
          2
        ]
      }
    }
  },
  "Max Airstream": {
    "pp": 10,
    "type": 10,
    "power": 10,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 453,
    "name": "Max Airstream"
  },
  "Max Darkness": {
    "pp": 10,
    "type": 16,
    "power": 10,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 454,
    "name": "Max Darkness"
  },
  "Max Flare": {
    "pp": 10,
    "type": 1,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 455,
    "name": "Max Flare"
  },
  "Max Flutterby": {
    "pp": 10,
    "type": 12,
    "power": 10,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 456,
    "name": "Max Flutterby"
  },
  "Max Geyser": {
    "pp": 10,
    "type": 3,
    "power": 10,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 457,
    "name": "Max Geyser"
  },
  "Max Guard": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 458,
    "name": "Max Guard"
  },
  "Max Hailstorm": {
    "pp": 10,
    "type": 6,
    "power": 10,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 459,
    "name": "Max Hailstorm"
  },
  "Max Knuckle": {
    "pp": 10,
    "type": 7,
    "power": 10,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 460,
    "name": "Max Knuckle"
  },
  "Max Lightning": {
    "pp": 10,
    "type": 4,
    "power": 10,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 461,
    "name": "Max Lightning"
  },
  "Max Mindstorm": {
    "pp": 10,
    "type": 11,
    "power": 10,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 462,
    "name": "Max Mindstorm"
  },
  "Max Ooze": {
    "pp": 10,
    "type": 8,
    "power": 10,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 463,
    "name": "Max Ooze"
  },
  "Max Overgrowth": {
    "pp": 10,
    "type": 5,
    "power": 10,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 464,
    "name": "Max Overgrowth"
  },
  "Max Phantasm": {
    "pp": 10,
    "type": 14,
    "power": 10,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 465,
    "name": "Max Phantasm"
  },
  "Max Quake": {
    "pp": 10,
    "type": 9,
    "power": 10,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 466,
    "name": "Max Quake"
  },
  "Max Rockfall": {
    "pp": 10,
    "type": 13,
    "power": 10,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 467,
    "name": "Max Rockfall"
  },
  "Max Starfall": {
    "pp": 10,
    "type": 18,
    "power": 10,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 468,
    "name": "Max Starfall"
  },
  "Max Steelspike": {
    "pp": 10,
    "type": 17,
    "power": 10,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 469,
    "name": "Max Steelspike"
  },
  "Max Strike": {
    "pp": 10,
    "type": 2,
    "power": 10,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 470,
    "name": "Max Strike"
  },
  "Max Wyrmwind": {
    "pp": 10,
    "type": 15,
    "power": 10,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 471,
    "name": "Max Wyrmwind"
  },
  "Me First": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 472,
    "name": "Me First"
  },
  "Mean Look": {
    "pp": 5,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 473,
    "name": "Mean Look"
  },
  "Meditate": {
    "pp": 40,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 474,
    "name": "Meditate",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Attack",
            1
          ]
        ]
      }
    }
  },
  "Mega Drain": {
    "pp": 15,
    "type": 5,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 475,
    "name": "Mega Drain",
    "special": true
  },
  "Mega Kick": {
    "pp": 5,
    "type": 2,
    "power": 120,
    "accuracy": 75,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 476,
    "name": "Mega Kick"
  },
  "Mega Punch": {
    "pp": 20,
    "type": 2,
    "power": 80,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 477,
    "name": "Mega Punch"
  },
  "Megahorn": {
    "pp": 10,
    "type": 12,
    "power": 120,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 478,
    "name": "Megahorn"
  },
  "Memento": {
    "pp": 10,
    "type": 16,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 479,
    "name": "Memento",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "SpecialAttack",
            -2
          ],
          [
            "Attack",
            -2
          ]
        ]
      }
    }
  },
  "Menacing Moonraze Maelstrom": {
    "pp": 1,
    "type": 14,
    "power": 200,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 480,
    "name": "Menacing Moonraze Maelstrom"
  },
  "Metal Burst": {
    "pp": 10,
    "type": 17,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": -1,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 481,
    "name": "Metal Burst"
  },
  "Metal Claw": {
    "pp": 35,
    "type": 17,
    "power": 50,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 482,
    "name": "Metal Claw",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "Attack",
            1
          ]
        ]
      }
    }
  },
  "Metal Sound": {
    "pp": 40,
    "type": 17,
    "power": 0,
    "accuracy": 85,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 483,
    "name": "Metal Sound",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "SpecialDefense",
            -2
          ]
        ]
      }
    }
  },
  "Meteor Assault": {
    "pp": 5,
    "type": 7,
    "power": 150,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 484,
    "name": "Meteor Assault"
  },
  "Meteor Beam": {
    "pp": 10,
    "type": 13,
    "power": 120,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 485,
    "name": "Meteor Beam",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "SpecialAttack",
            1
          ]
        ]
      }
    }
  },
  "Meteor Mash": {
    "pp": 10,
    "type": 17,
    "power": 90,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 486,
    "name": "Meteor Mash",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 20,
        "stats": [
          [
            "Attack",
            1
          ]
        ]
      }
    }
  },
  "Metronome": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 487,
    "name": "Metronome"
  },
  "Mighty Cleave": {
    "pp": 5,
    "type": 13,
    "power": 95,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 488,
    "name": "Mighty Cleave"
  },
  "Milk Drink": {
    "pp": 5,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 489,
    "name": "Milk Drink"
  },
  "Mimic": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 3,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 490,
    "name": "Mimic",
    "special": true
  },
  "Mind Blown": {
    "pp": 5,
    "type": 1,
    "power": 150,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 491,
    "name": "Mind Blown"
  },
  "Mind Reader": {
    "pp": 5,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 492,
    "name": "Mind Reader"
  },
  "Minimize": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 493,
    "name": "Minimize",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Evasion",
            2
          ]
        ]
      }
    }
  },
  "Miracle Eye": {
    "pp": 40,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 494,
    "name": "Miracle Eye"
  },
  "Mirror Coat": {
    "pp": 20,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": -1,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 495,
    "name": "Mirror Coat"
  },
  "Mirror Move": {
    "pp": 20,
    "type": 10,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 496,
    "name": "Mirror Move"
  },
  "Mirror Shot": {
    "pp": 10,
    "type": 17,
    "power": 65,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 497,
    "name": "Mirror Shot",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "Accuracy",
            -1
          ]
        ]
      }
    }
  },
  "Mist": {
    "pp": 30,
    "type": 6,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 498,
    "name": "Mist"
  },
  "Mist Ball": {
    "pp": 5,
    "type": 11,
    "power": 95,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 499,
    "name": "Mist Ball",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 30,
        "stats": [
          [
            "SpecialAttack",
            -1
          ]
        ]
      }
    }
  },
  "Misty Explosion": {
    "pp": 5,
    "type": 18,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 500,
    "name": "Misty Explosion"
  },
  "Misty Terrain": {
    "pp": 10,
    "type": 18,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 501,
    "name": "Misty Terrain"
  },
  "Moonblast": {
    "pp": 15,
    "type": 18,
    "power": 95,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 502,
    "name": "Moonblast",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 30,
        "stats": [
          [
            "SpecialAttack",
            -1
          ]
        ]
      }
    }
  },
  "Moongeist Beam": {
    "pp": 5,
    "type": 14,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 503,
    "name": "Moongeist Beam"
  },
  "Moonlight": {
    "pp": 5,
    "type": 18,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 504,
    "name": "Moonlight"
  },
  "Morning Sun": {
    "pp": 5,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 505,
    "name": "Morning Sun"
  },
  "Mortal Spin": {
    "pp": 15,
    "type": 8,
    "power": 30,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 506,
    "name": "Mortal Spin",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          1
        ]
      }
    }
  },
  "Mountain Gale": {
    "pp": 10,
    "type": 6,
    "power": 100,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 507,
    "name": "Mountain Gale",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Speed",
            -1
          ]
        ]
      }
    }
  },
  "Mud Bomb": {
    "pp": 10,
    "type": 9,
    "power": 65,
    "accuracy": 85,
    "category": "Special",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 508,
    "name": "Mud Bomb"
  },
  "Mud Shot": {
    "pp": 15,
    "type": 9,
    "power": 55,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 509,
    "name": "Mud Shot",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 30,
        "stats": [
          [
            "Speed",
            -1
          ]
        ]
      }
    }
  },
  "Mud Slap": {
    "pp": 10,
    "type": 9,
    "power": 20,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 510,
    "name": "Mud Slap",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Accuracy",
            -1
          ]
        ]
      }
    }
  },
  "Mud Sport": {
    "pp": 15,
    "type": 9,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 511,
    "name": "Mud Sport"
  },
  "Muddy Water": {
    "pp": 10,
    "type": 3,
    "power": 90,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 512,
    "name": "Muddy Water",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 30,
        "stats": [
          [
            "Accuracy",
            -1
          ]
        ]
      }
    }
  },
  "Multi Attack": {
    "pp": 10,
    "type": 2,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 513,
    "name": "Multi Attack"
  },
  "Mystical Fire": {
    "pp": 10,
    "type": 1,
    "power": 75,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 514,
    "name": "Mystical Fire",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "SpecialAttack",
            -1
          ]
        ]
      }
    }
  },
  "Mystical Power": {
    "pp": 10,
    "type": 11,
    "power": 70,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 515,
    "name": "Mystical Power",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "SpecialAttack",
            1
          ]
        ]
      }
    }
  },
  "Nasty Plot": {
    "pp": 20,
    "type": 16,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 516,
    "name": "Nasty Plot",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "SpecialAttack",
            2
          ]
        ]
      }
    }
  },
  "Natural Gift": {
    "pp": 15,
    "type": 2,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 517,
    "name": "Natural Gift"
  },
  "Nature Power": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 518,
    "name": "Nature Power"
  },
  "Natures Madness": {
    "pp": 10,
    "type": 18,
    "power": 0,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 519,
    "name": "Natures Madness"
  },
  "Needle Arm": {
    "pp": 15,
    "type": 5,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 520,
    "name": "Needle Arm",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          7
        ]
      }
    }
  },
  "Never Ending Nightmare": {
    "pp": 1,
    "type": 14,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 521,
    "name": "Never Ending Nightmare"
  },
  "Night Daze": {
    "pp": 10,
    "type": 16,
    "power": 85,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 522,
    "name": "Night Daze",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "Accuracy",
            -1
          ]
        ]
      }
    }
  },
  "Night Shade": {
    "pp": 15,
    "type": 14,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 523,
    "name": "Night Shade"
  },
  "Night Slash": {
    "pp": 15,
    "type": 16,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 524,
    "critStage": 1,
    "name": "Night Slash"
  },
  "Nightmare": {
    "pp": 15,
    "type": 14,
    "power": 0,
    "accuracy": 100,
    "moveType": MoveDamageType.SPECIAL,
    "priority": 0,
    "special": true,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 525,
    "name": "Nightmare"
  },
  "No Retreat": {
    "pp": 5,
    "type": 7,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 526,
    "name": "No Retreat",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Defense",
            1
          ],
          [
            "SpecialDefense",
            1
          ],
          [
            "SpecialAttack",
            1
          ],
          [
            "Attack",
            1
          ],
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Noble Roar": {
    "pp": 30,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 527,
    "name": "Noble Roar",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "SpecialAttack",
            1
          ],
          [
            "Attack",
            1
          ]
        ]
      }
    }
  },
  "Noxious Torque": {
    "pp": 10,
    "type": 8,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 528,
    "name": "Noxious Torque",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          1
        ]
      }
    }
  },
  "Nuzzle": {
    "pp": 20,
    "type": 4,
    "power": 20,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 529,
    "name": "Nuzzle",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          3
        ]
      }
    }
  },
  "Oblivion Wing": {
    "pp": 10,
    "type": 10,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 530,
    "name": "Oblivion Wing",
    "special": true
  },
  "Obstruct": {
    "pp": 10,
    "type": 16,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 1,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 531,
    "name": "Obstruct"
  },
  "Oceanic Operetta": {
    "pp": 1,
    "type": 3,
    "power": 195,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 532,
    "name": "Oceanic Operetta"
  },
  "Octazooka": {
    "pp": 10,
    "type": 3,
    "power": 65,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 533,
    "name": "Octazooka",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 50,
        "stats": [
          [
            "Accuracy",
            1
          ]
        ]
      }
    }
  },
  "Octolock": {
    "pp": 15,
    "type": 7,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 534,
    "name": "Octolock",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "Defense",
            -1
          ],
          [
            "SpecialDefense",
            -1
          ]
        ]
      }
    }
  },
  "Odor Sleuth": {
    "pp": 40,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 535,
    "name": "Odor Sleuth"
  },
  "Ominous Wind": {
    "pp": 5,
    "type": 14,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 536,
    "name": "Ominous Wind",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "Defense",
            1
          ],
          [
            "SpecialDefense",
            1
          ],
          [
            "SpecialAttack",
            1
          ],
          [
            "Attack",
            1
          ],
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Order Up": {
    "pp": 10,
    "type": 15,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 537,
    "name": "Order Up"
  },
  "Origin Pulse": {
    "pp": 10,
    "type": 3,
    "power": 110,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 538,
    "name": "Origin Pulse"
  },
  "Outrage": {
    "pp": 10,
    "type": 15,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 539,
    "name": "Outrage"
  },
  "Overdrive": {
    "pp": 10,
    "type": 4,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 540,
    "name": "Overdrive"
  },
  "Overheat": {
    "pp": 5,
    "type": 1,
    "power": 130,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 541,
    "name": "Overheat",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "SpecialAttack",
            -2
          ]
        ]
      }
    }
  },
  "Pain Split": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": MoveDamageType.SPECIAL,
    "priority": 0,
    "special": true,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 542,
    "name": "Pain Split"
  },
  "Parabolic Charge": {
    "pp": 20,
    "type": 4,
    "power": 65,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 543,
    "name": "Parabolic Charge",
    "special": true
  },
  "Parting Shot": {
    "pp": 20,
    "type": 16,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 544,
    "name": "Parting Shot",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "SpecialAttack",
            1
          ],
          [
            "Attack",
            1
          ]
        ]
      }
    }
  },
  "Pay Day": {
    "pp": 20,
    "type": 2,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 545,
    "name": "Pay Day"
  },
  "Payback": {
    "pp": 10,
    "type": 16,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 546,
    "name": "Payback"
  },
  "Peck": {
    "pp": 35,
    "type": 10,
    "power": 35,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 547,
    "name": "Peck"
  },
  "Perish Song": {
    "pp": 5,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 548,
    "name": "Perish Song"
  },
  "Petal Blizzard": {
    "pp": 15,
    "type": 5,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 549,
    "name": "Petal Blizzard"
  },
  "Petal Dance": {
    "pp": 10,
    "type": 5,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 550,
    "name": "Petal Dance"
  },
  "Phantom Force": {
    "pp": 10,
    "type": 14,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 551,
    "name": "Phantom Force"
  },
  "Photon Geyser": {
    "pp": 5,
    "type": 11,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 552,
    "name": "Photon Geyser"
  },
  "Pika Papow": {
    "pp": 20,
    "type": 4,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 553,
    "name": "Pika Papow"
  },
  "Pin Missile": {
    "pp": 20,
    "type": 12,
    "power": 25,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 554,
    "name": "Pin Missile"
  },
  "Plasma Fists": {
    "pp": 15,
    "type": 4,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 555,
    "name": "Plasma Fists"
  },
  "Play Nice": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 556,
    "name": "Play Nice",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Attack",
            -1
          ]
        ]
      }
    }
  },
  "Play Rough": {
    "pp": 10,
    "type": 18,
    "power": 90,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 557,
    "name": "Play Rough",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "Attack",
            -1
          ]
        ]
      }
    }
  },
  "Pluck": {
    "pp": 20,
    "type": 10,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 558,
    "name": "Pluck"
  },
  "Poison Fang": {
    "pp": 15,
    "type": 8,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 559,
    "name": "Poison Fang",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 50,
        "effects": [
          1
        ]
      }
    }
  },
  "Poison Gas": {
    "pp": 40,
    "type": 8,
    "power": 0,
    "accuracy": 90,
    "moveType": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 560,
    "name": "Poison Gas",
    "effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          1
        ]
      }
    }
  },
  "Poison Jab": {
    "pp": 20,
    "type": 8,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 561,
    "name": "Poison Jab",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          1
        ]
      }
    }
  },
  "Poison Powder": {
    "pp": 35,
    "type": 8,
    "power": 0,
    "accuracy": 75,
    "moveType": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 562,
    "name": "Poison Powder",
    "effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          1
        ]
      }
    }
  },
  "Poison Sting": {
    "pp": 35,
    "type": 8,
    "power": 15,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 563,
    "name": "Poison Sting",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          1
        ]
      }
    }
  },
  "Poison Tail": {
    "pp": 25,
    "type": 8,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 564,
    "name": "Poison Tail",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          1
        ]
      }
    }
  },
  "Pollen Puff": {
    "pp": 15,
    "type": 12,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 565,
    "name": "Pollen Puff"
  },
  "Poltergeist": {
    "pp": 5,
    "type": 14,
    "power": 110,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 566,
    "name": "Poltergeist"
  },
  "Population Bomb": {
    "pp": 10,
    "type": 2,
    "power": 20,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 567,
    "name": "Population Bomb"
  },
  "Pounce": {
    "pp": 20,
    "type": 12,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 568,
    "name": "Pounce",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Speed",
            -1
          ]
        ]
      }
    }
  },
  "Pound": {
    "pp": 35,
    "type": 2,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 569,
    "name": "Pound"
  },
  "Powder": {
    "pp": 20,
    "type": 12,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 570,
    "name": "Powder"
  },
  "Powder Snow": {
    "pp": 25,
    "type": 6,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 571,
    "name": "Powder Snow",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          5
        ]
      }
    }
  },
  "Power Gem": {
    "pp": 20,
    "type": 13,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 572,
    "name": "Power Gem"
  },
  "Power Shift": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 573,
    "name": "Power Shift"
  },
  "Power Split": {
    "pp": 10,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 574,
    "name": "Power Split"
  },
  "Power Swap": {
    "pp": 10,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 575,
    "name": "Power Swap"
  },
  "Power Trick": {
    "pp": 10,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 576,
    "name": "Power Trick"
  },
  "Power Trip": {
    "pp": 10,
    "type": 16,
    "power": 20,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 577,
    "name": "Power Trip"
  },
  "Power Up Punch": {
    "pp": 20,
    "type": 7,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 578,
    "name": "Power Up Punch",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Attack",
            1
          ]
        ]
      }
    }
  },
  "Power Whip": {
    "pp": 10,
    "type": 5,
    "power": 120,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 579,
    "name": "Power Whip"
  },
  "Precipice Blades": {
    "pp": 10,
    "type": 9,
    "power": 120,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 580,
    "name": "Precipice Blades"
  },
  "Present": {
    "pp": 15,
    "type": 2,
    "power": 0,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 581,
    "name": "Present"
  },
  "Prismatic Laser": {
    "pp": 10,
    "type": 11,
    "power": 160,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 582,
    "name": "Prismatic Laser"
  },
  "Protect": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 3,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 583,
    "name": "Protect"
  },
  "Psybeam": {
    "pp": 20,
    "type": 11,
    "power": 65,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 584,
    "name": "Psybeam",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          6
        ]
      }
    }
  },
  "Psyblade": {
    "pp": 15,
    "type": 11,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 585,
    "name": "Psyblade"
  },
  "Psych Up": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": MoveDamageType.SPECIAL,
    "priority": 0,
    "multiHit": false,
    "special": true,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 586,
    "name": "Psych Up"
  },
  "Psychic": {
    "pp": 10,
    "type": 11,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 587,
    "name": "Psychic"
  },
  "Psychic Fangs": {
    "pp": 10,
    "type": 11,
    "power": 85,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 588,
    "name": "Psychic Fangs"
  },
  "Psychic Noise": {
    "pp": 10,
    "type": 11,
    "power": 75,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 589,
    "name": "Psychic Noise"
  },
  "Psychic Terrain": {
    "pp": 10,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 590,
    "name": "Psychic Terrain"
  },
  "Psycho Boost": {
    "pp": 5,
    "type": 11,
    "power": 140,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 591,
    "name": "Psycho Boost",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "SpecialAttack",
            -2
          ]
        ]
      }
    }
  },
  "Psycho Cut": {
    "pp": 20,
    "type": 11,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 592,
    "critStage": 1,
    "name": "Psycho Cut"
  },
  "Psycho Shift": {
    "pp": 10,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 593,
    "name": "Psycho Shift"
  },
  "Psyshield Bash": {
    "pp": 10,
    "type": 11,
    "power": 70,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 594,
    "name": "Psyshield Bash",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Defense",
            1
          ],
          [
            "SpecialDefense",
            1
          ]
        ]
      }
    }
  },
  "Psyshock": {
    "pp": 10,
    "type": 11,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 595,
    "name": "Psyshock"
  },
  "Psystrike": {
    "pp": 10,
    "type": 11,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 596,
    "name": "Psystrike"
  },
  "Psywave": {
    "pp": 15,
    "type": 11,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 597,
    "name": "Psywave"
  },
  "Pulverizing Pancake": {
    "pp": 1,
    "type": 2,
    "power": 210,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 598,
    "name": "Pulverizing Pancake"
  },
  "Punishment": {
    "pp": 5,
    "type": 16,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 599,
    "name": "Punishment"
  },
  "Purify": {
    "pp": 20,
    "type": 8,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 600,
    "name": "Purify"
  },
  "Pursuit": {
    "pp": 20,
    "type": 16,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 601,
    "name": "Pursuit"
  },
  "Pyro Ball": {
    "pp": 5,
    "type": 1,
    "power": 120,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 602,
    "name": "Pyro Ball",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          2
        ]
      }
    }
  },
  "Quash": {
    "pp": 15,
    "type": 16,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 603,
    "name": "Quash"
  },
  "Quick Attack": {
    "pp": 30,
    "type": 2,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 1,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 604,
    "name": "Quick Attack"
  },
  "Quick Guard": {
    "pp": 15,
    "type": 7,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 2,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 605,
    "name": "Quick Guard"
  },
  "Quiver Dance": {
    "pp": 20,
    "type": 12,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 606,
    "name": "Quiver Dance",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "SpecialDefense",
            1
          ],
          [
            "SpecialAttack",
            1
          ],
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Rage": {
    "pp": 20,
    "type": 2,
    "power": 20,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 607,
    "name": "Rage",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Attack",
            1
          ]
        ]
      }
    }
  },
  "Rage Fist": {
    "pp": 10,
    "type": 14,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 608,
    "name": "Rage Fist"
  },
  "Rage Powder": {
    "pp": 20,
    "type": 12,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 2,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 609,
    "name": "Rage Powder"
  },
  "Raging Bull": {
    "pp": 10,
    "type": 2,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 610,
    "name": "Raging Bull"
  },
  "Raging Fury": {
    "pp": 10,
    "type": 1,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 611,
    "name": "Raging Fury",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          6
        ]
      }
    }
  },
  "Rain Dance": {
    "pp": 5,
    "type": 3,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 612,
    "name": "Rain Dance"
  },
  "Rapid Spin": {
    "pp": 40,
    "type": 2,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 613,
    "name": "Rapid Spin",
    "special": true,
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Razor Leaf": {
    "pp": 25,
    "type": 5,
    "power": 55,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 614,
    "critStage": 1,
    "name": "Razor Leaf"
  },
  "Razor Shell": {
    "pp": 10,
    "type": 3,
    "power": 75,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 615,
    "name": "Razor Shell",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "Defense",
            -1
          ]
        ]
      }
    }
  },
  "Razor Wind": {
    "pp": 10,
    "type": 2,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 616,
    "name": "Razor Wind"
  },
  "Recover": {
    "pp": 5,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 617,
    "name": "Recover",
    "special": true
  },
  "Recycle": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 618,
    "name": "Recycle"
  },
  "Reflect": {
    "pp": 20,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 619,
    "name": "Reflect"
  },
  "Reflect Type": {
    "pp": 15,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 620,
    "name": "Reflect Type"
  },
  "Refresh": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": MoveDamageType.SPECIAL,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 621,
    "special": true,
    "name": "Refresh"
  },
  "Relic Song": {
    "pp": 10,
    "type": 2,
    "power": 75,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 622,
    "name": "Relic Song",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          4
        ]
      }
    }
  },
  "Rest": {
    "pp": 5,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 623,
    "name": "Rest",
    "special": true
  },
  "Retaliate": {
    "pp": 5,
    "type": 2,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 624,
    "name": "Retaliate"
  },
  "Return": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 625,
    "name": "Return"
  },
  "Revelation Dance": {
    "pp": 15,
    "type": 2,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 626,
    "name": "Revelation Dance"
  },
  "Revenge": {
    "pp": 10,
    "type": 7,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": -1,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 627,
    "name": "Revenge"
  },
  "Reversal": {
    "pp": 15,
    "type": 7,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 628,
    "name": "Reversal"
  },
  "Revival Blessing": {
    "pp": 1,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 629,
    "name": "Revival Blessing"
  },
  "Rising Voltage": {
    "pp": 20,
    "type": 4,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 630,
    "name": "Rising Voltage"
  },
  "Roar": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": -6,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 631,
    "name": "Roar",
    "special": true
  },
  "Roar Of Time": {
    "pp": 5,
    "type": 15,
    "power": 150,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 632,
    "name": "Roar Of Time"
  },
  "Rock Blast": {
    "pp": 10,
    "type": 13,
    "power": 25,
    "accuracy": 90,
    "moveType": 0,
    "priority": true,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 633,
    "name": "Rock Blast"
  },
  "Rock Climb": {
    "pp": 20,
    "type": 2,
    "power": 90,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 634,
    "name": "Rock Climb",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 20,
        "effects": [
          6
        ]
      }
    }
  },
  "Rock Polish": {
    "pp": 20,
    "type": 13,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 635,
    "name": "Rock Polish",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Speed",
            2
          ]
        ]
      }
    }
  },
  "Rock Slide": {
    "pp": 10,
    "type": 13,
    "power": 75,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 636,
    "name": "Rock Slide",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          7
        ]
      }
    }
  },
  "Rock Smash": {
    "pp": 15,
    "type": 7,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 637,
    "name": "Rock Smash",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 50,
        "stats": [
          [
            "Defense",
            -1
          ]
        ]
      }
    }
  },
  "Rock Throw": {
    "pp": 15,
    "type": 13,
    "power": 50,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 638,
    "name": "Rock Throw"
  },
  "Rock Tomb": {
    "pp": 15,
    "type": 13,
    "power": 60,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 639,
    "name": "Rock Tomb",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "Speed",
            -1
          ]
        ]
      }
    }
  },
  "Rock Wrecker": {
    "pp": 5,
    "type": 13,
    "power": 150,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 640,
    "name": "Rock Wrecker"
  },
  "Role Play": {
    "pp": 10,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 641,
    "name": "Role Play"
  },
  "Rolling Kick": {
    "pp": 15,
    "type": 7,
    "power": 60,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 642,
    "name": "Rolling Kick",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          6
        ]
      }
    }
  },
  "Rollout": {
    "pp": 20,
    "type": 13,
    "power": 30,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 643,
    "name": "Rollout"
  },
  "Roost": {
    "pp": 5,
    "type": 10,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 644,
    "name": "Roost"
  },
  "Rototiller": {
    "pp": 10,
    "type": 9,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 645,
    "name": "Rototiller",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "SpecialAttack",
            1
          ],
          [
            "Attack",
            1
          ]
        ]
      }
    }
  },
  "Round": {
    "pp": 15,
    "type": 2,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 646,
    "name": "Round"
  },
  "Ruination": {
    "pp": 10,
    "type": 16,
    "power": 1,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 647,
    "name": "Ruination"
  },
  "Sacred Fire": {
    "pp": 5,
    "type": 1,
    "power": 100,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 648,
    "name": "Sacred Fire",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          2
        ]
      }
    }
  },
  "Sacred Sword": {
    "pp": 15,
    "type": 7,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 649,
    "name": "Sacred Sword"
  },
  "Safeguard": {
    "pp": 25,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": MoveDamageType.SPECIAL,
    "special": true,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 650,
    "name": "Safeguard"
  },
  "Salt Cure": {
    "pp": 15,
    "type": 13,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 651,
    "name": "Salt Cure"
  },
  "Sand Attack": {
    "pp": 15,
    "type": 9,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 652,
    "name": "Sand Attack",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Accuracy",
            -1
          ]
        ]
      }
    }
  },
  "Sand Tomb": {
    "pp": 15,
    "type": 9,
    "power": 35,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "special": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 653,
    "name": "Sand Tomb"
  },
  "Sandsear Storm": {
    "pp": 10,
    "type": 9,
    "power": 100,
    "accuracy": 80,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 654,
    "name": "Sandsear Storm",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          2
        ]
      }
    }
  },
  "Sandstorm": {
    "pp": 10,
    "type": 13,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 655,
    "name": "Sandstorm"
  },
  "Sappy Seed": {
    "pp": 10,
    "type": 5,
    "power": 100,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 656,
    "name": "Sappy Seed"
  },
  "Savage Spin Out": {
    "pp": 1,
    "type": 12,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 657,
    "name": "Savage Spin Out"
  },
  "Scald": {
    "pp": 15,
    "type": 3,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 658,
    "name": "Scald",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          2
        ]
      }
    }
  },
  "Scale Shot": {
    "pp": 20,
    "type": 15,
    "power": 25,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 659,
    "name": "Scale Shot",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Defense",
            -1
          ],
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Scary Face": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 660,
    "name": "Scary Face",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Speed",
            -2
          ]
        ]
      }
    }
  },
  "Scorching Sands": {
    "pp": 10,
    "type": 9,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 661,
    "name": "Scorching Sands",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          2
        ]
      }
    }
  },
  "Scratch": {
    "pp": 35,
    "type": 2,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 662,
    "name": "Scratch"
  },
  "Screech": {
    "pp": 40,
    "type": 2,
    "power": 0,
    "accuracy": 85,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 663,
    "name": "Screech",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Defense",
            -2
          ]
        ]
      }
    }
  },
  "Searing Shot": {
    "pp": 5,
    "type": 1,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 664,
    "name": "Searing Shot",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          2
        ]
      }
    }
  },
  "Searing Sunraze Smash": {
    "pp": 1,
    "type": 17,
    "power": 200,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 665,
    "name": "Searing Sunraze Smash"
  },
  "Secret Power": {
    "pp": 20,
    "type": 2,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 666,
    "name": "Secret Power"
  },
  "Secret Sword": {
    "pp": 10,
    "type": 7,
    "power": 85,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 667,
    "name": "Secret Sword"
  },
  "Seed Bomb": {
    "pp": 15,
    "type": 5,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 668,
    "name": "Seed Bomb"
  },
  "Seed Flare": {
    "pp": 5,
    "type": 5,
    "power": 120,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 669,
    "name": "Seed Flare",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 40,
        "stats": [
          [
            "SpecialDefense",
            -1
          ]
        ]
      }
    }
  },
  "Seismic Toss": {
    "pp": 20,
    "type": 7,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 670,
    "name": "Seismic Toss"
  },
  "Self Destruct": {
    "pp": 5,
    "type": 2,
    "power": 200,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 671,
    "name": "Self Destruct"
  },
  "Shadow Ball": {
    "pp": 15,
    "type": 14,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 672,
    "name": "Shadow Ball",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "SpecialDefense",
            -1
          ]
        ]
      }
    }
  },
  "Shadow Bone": {
    "pp": 10,
    "type": 14,
    "power": 85,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 673,
    "name": "Shadow Bone",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 20,
        "stats": [
          [
            "Defense",
            -1
          ]
        ]
      }
    }
  },
  "Shadow Claw": {
    "pp": 15,
    "type": 14,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 674,
    "critStage": 1,
    "name": "Shadow Claw"
  },
  "Shadow Force": {
    "pp": 5,
    "type": 14,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 675,
    "name": "Shadow Force"
  },
  "Shadow Punch": {
    "pp": 20,
    "type": 14,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 676,
    "name": "Shadow Punch"
  },
  "Shadow Sneak": {
    "pp": 30,
    "type": 14,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 1,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 677,
    "name": "Shadow Sneak"
  },
  "Sharpen": {
    "pp": 30,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 678,
    "name": "Sharpen",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Attack",
            1
          ]
        ]
      }
    }
  },
  "Shattered Psyche": {
    "pp": 1,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 679,
    "name": "Shattered Psyche"
  },
  "Shed Tail": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 680,
    "name": "Shed Tail"
  },
  "Sheer Cold": {
    "pp": 5,
    "type": 6,
    "power": 5000,
    "accuracy": 30,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 681,
    "name": "Sheer Cold"
  },
  "Shell Side Arm": {
    "pp": 10,
    "type": 8,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 682,
    "name": "Shell Side Arm",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          1
        ]
      }
    }
  },
  "Shell Smash": {
    "pp": 15,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 683,
    "name": "Shell Smash",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Defense",
            -1
          ],
          [
            "SpecialDefense",
            -1
          ],
          [
            "SpecialAttack",
            2
          ],
          [
            "Attack",
            2
          ],
          [
            "Speed",
            2
          ]
        ]
      }
    }
  },
  "Shell Trap": {
    "pp": 5,
    "type": 1,
    "power": 150,
    "accuracy": 100,
    "moveType": 0,
    "priority": -4,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 684,
    "name": "Shell Trap"
  },
  "Shelter": {
    "pp": 10,
    "type": 17,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 685,
    "name": "Shelter",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Defense",
            1
          ]
        ]
      }
    }
  },
  "Shift Gear": {
    "pp": 10,
    "type": 17,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 686,
    "name": "Shift Gear",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Attack",
            1
          ],
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Shock Wave": {
    "pp": 20,
    "type": 4,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 687,
    "name": "Shock Wave"
  },
  "Shore Up": {
    "pp": 5,
    "type": 9,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 688,
    "name": "Shore Up"
  },
  "Signal Beam": {
    "pp": 15,
    "type": 12,
    "power": 75,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 689,
    "name": "Signal Beam",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          6
        ]
      }
    }
  },
  "Silk Trap": {
    "pp": 10,
    "type": 12,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 690,
    "name": "Silk Trap",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Speed",
            -1
          ]
        ]
      }
    }
  },
  "Silver Wind": {
    "pp": 5,
    "type": 12,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 691,
    "name": "Silver Wind",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "Defense",
            1
          ],
          [
            "SpecialDefense",
            1
          ],
          [
            "SpecialAttack",
            1
          ],
          [
            "Attack",
            1
          ],
          [
            "Evasion",
            1
          ],
          [
            "Accuracy",
            1
          ],
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Simple Beam": {
    "pp": 15,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 692,
    "name": "Simple Beam"
  },
  "Sing": {
    "pp": 15,
    "type": 2,
    "power": 0,
    "accuracy": 55,
    "moveType": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 693,
    "name": "Sing",
    "effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          4
        ]
      }
    }
  },
  "Sinister Arrow Raid": {
    "pp": 1,
    "type": 14,
    "power": 180,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 694,
    "name": "Sinister Arrow Raid"
  },
  "Sizzly Slide": {
    "pp": 20,
    "type": 1,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 695,
    "name": "Sizzly Slide",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          2
        ]
      }
    }
  },
  "Sketch": {
    "pp": 1,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 696,
    "name": "Sketch"
  },
  "Skill Swap": {
    "pp": 10,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 697,
    "name": "Skill Swap"
  },
  "Skitter Smack": {
    "pp": 10,
    "type": 12,
    "power": 70,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 698,
    "name": "Skitter Smack",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "SpecialAttack",
            -1
          ]
        ]
      }
    }
  },
  "Skull Bash": {
    "pp": 10,
    "type": 2,
    "power": 130,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 699,
    "name": "Skull Bash",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "Defense",
            1
          ]
        ]
      }
    }
  },
  "Sky Attack": {
    "pp": 5,
    "type": 10,
    "power": 140,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 700,
    "critStage": 1,
    "name": "Sky Attack"
  },
  "Sky Drop": {
    "pp": 10,
    "type": 10,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 701,
    "name": "Sky Drop"
  },
  "Sky Uppercut": {
    "pp": 15,
    "type": 7,
    "power": 85,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 702,
    "name": "Sky Uppercut"
  },
  "Slack Off": {
    "pp": 5,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 703,
    "name": "Slack Off"
  },
  "Slam": {
    "pp": 20,
    "type": 2,
    "power": 80,
    "accuracy": 75,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 704,
    "name": "Slam"
  },
  "Slash": {
    "pp": 20,
    "type": 2,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 705,
    "critStage": 1,
    "name": "Slash"
  },
  "Sleep Powder": {
    "pp": 15,
    "type": 5,
    "power": 0,
    "accuracy": 75,
    "moveType": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 706,
    "name": "Sleep Powder",
    "effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          4
        ]
      }
    }
  },
  "Sleep Talk": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 707,
    "name": "Sleep Talk"
  },
  "Sludge": {
    "pp": 20,
    "type": 8,
    "power": 65,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 708,
    "name": "Sludge",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          1
        ]
      }
    }
  },
  "Sludge Bomb": {
    "pp": 10,
    "type": 8,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 709,
    "name": "Sludge Bomb",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          1
        ]
      }
    }
  },
  "Sludge Wave": {
    "pp": 10,
    "type": 8,
    "power": 95,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 710,
    "name": "Sludge Wave",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          1
        ]
      }
    }
  },
  "Smack Down": {
    "pp": 15,
    "type": 13,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 711,
    "name": "Smack Down"
  },
  "Smart Strike": {
    "pp": 10,
    "type": 17,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 712,
    "name": "Smart Strike"
  },
  "Smelling Salts": {
    "pp": 10,
    "type": 2,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 713,
    "name": "Smelling Salts"
  },
  "Smog": {
    "pp": 20,
    "type": 8,
    "power": 30,
    "accuracy": 70,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 714,
    "name": "Smog",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          1
        ]
      }
    }
  },
  "Smokescreen": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 715,
    "name": "Smokescreen",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Accuracy",
            -1
          ]
        ]
      }
    }
  },
  "Snap Trap": {
    "pp": 15,
    "type": 5,
    "power": 35,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 716,
    "name": "Snap Trap"
  },
  "Snarl": {
    "pp": 15,
    "type": 16,
    "power": 55,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 717,
    "name": "Snarl",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "SpecialAttack",
            -1
          ]
        ]
      }
    }
  },
  "Snatch": {
    "pp": 10,
    "type": 16,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 718,
    "name": "Snatch"
  },
  "Snipe Shot": {
    "pp": 15,
    "type": 3,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 719,
    "name": "Snipe Shot"
  },
  "Snore": {
    "pp": 15,
    "type": 2,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 720,
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [7]
      }
    },
    "name": "Snore"
  },
  "Snowscape": {
    "pp": 10,
    "type": 6,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 721,
    "name": "Snowscape"
  },
  "Soak": {
    "pp": 20,
    "type": 3,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 722,
    "name": "Soak"
  },
  "Soft Boiled": {
    "pp": 5,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 723,
    "name": "Soft Boiled"
  },
  "Solar Beam": {
    "pp": 10,
    "type": 5,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 724,
    "name": "Solar Beam"
  },
  "Solar Blade": {
    "pp": 10,
    "type": 5,
    "power": 125,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 725,
    "name": "Solar Blade"
  },
  "Sonic Boom": {
    "pp": 20,
    "type": 2,
    "power": 20,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 726,
    "name": "Sonic Boom"
  },
  "Soul Stealing 7 Star Strike": {
    "pp": 1,
    "type": 14,
    "power": 195,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 727,
    "name": "Soul Stealing 7 Star Strike"
  },
  "Spacial Rend": {
    "pp": 5,
    "type": 15,
    "power": 100,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 728,
    "name": "Spacial Rend"
  },
  "Spark": {
    "pp": 20,
    "type": 4,
    "power": 65,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 729,
    "name": "Spark",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          3
        ]
      }
    }
  },
  "Sparkling Aria": {
    "pp": 10,
    "type": 3,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 730,
    "name": "Sparkling Aria"
  },
  "Sparkly Swirl": {
    "pp": 5,
    "type": 18,
    "power": 120,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 731,
    "name": "Sparkly Swirl"
  },
  "Spectral Thief": {
    "pp": 10,
    "type": 14,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 732,
    "name": "Spectral Thief"
  },
  "Speed Swap": {
    "pp": 10,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 733,
    "name": "Speed Swap"
  },
  "Spicy Extract": {
    "pp": 15,
    "type": 5,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 734,
    "name": "Spicy Extract",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Defense",
            -2
          ],
          [
            "Attack",
            2
          ]
        ]
      }
    }
  },
  "Spider Web": {
    "pp": 10,
    "type": 12,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 735,
    "name": "Spider Web"
  },
  "Spike Cannon": {
    "pp": 15,
    "type": 2,
    "power": 20,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 736,
    "name": "Spike Cannon"
  },
  "Spikes": {
    "pp": 20,
    "type": 9,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 737,
    "name": "Spikes"
  },
  "Spiky Shield": {
    "pp": 10,
    "type": 5,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 1,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 738,
    "name": "Spiky Shield"
  },
  "Spin Out": {
    "pp": 5,
    "type": 17,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 739,
    "name": "Spin Out",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "Speed",
            -2
          ]
        ]
      }
    }
  },
  "Spirit Break": {
    "pp": 15,
    "type": 18,
    "power": 75,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 740,
    "name": "Spirit Break",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "SpecialAttack",
            -1
          ]
        ]
      }
    }
  },
  "Spirit Shackle": {
    "pp": 10,
    "type": 14,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 741,
    "name": "Spirit Shackle"
  },
  "Spit Up": {
    "pp": 10,
    "type": 2,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 742,
    "name": "Spit Up"
  },
  "Spite": {
    "pp": 10,
    "type": 14,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 743,
    "name": "Spite"
  },
  "Splash": {
    "pp": 40,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 744,
    "name": "Splash"
  },
  "Splintered Stormshards": {
    "pp": 1,
    "type": 13,
    "power": 190,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 745,
    "name": "Splintered Stormshards"
  },
  "Splishy Splash": {
    "pp": 15,
    "type": 3,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 746,
    "name": "Splishy Splash",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          3
        ]
      }
    }
  },
  "Spore": {
    "pp": 15,
    "type": 5,
    "power": 0,
    "accuracy": 100,
    "moveType": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 747,
    "name": "Spore",
    "effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          4
        ]
      }
    }
  },
  "Spotlight": {
    "pp": 15,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 748,
    "name": "Spotlight"
  },
  "Springtide Storm": {
    "pp": 5,
    "type": 18,
    "power": 100,
    "accuracy": 80,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 749,
    "name": "Springtide Storm"
  },
  "Stealth Rock": {
    "pp": 20,
    "type": 13,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 750,
    "name": "Stealth Rock"
  },
  "Steam Eruption": {
    "pp": 5,
    "type": 3,
    "power": 110,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 751,
    "name": "Steam Eruption",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          2
        ]
      }
    }
  },
  "Steamroller": {
    "pp": 20,
    "type": 12,
    "power": 65,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 752,
    "name": "Steamroller",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          7
        ]
      }
    }
  },
  "Steel Beam": {
    "pp": 5,
    "type": 17,
    "power": 140,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 753,
    "name": "Steel Beam"
  },
  "Steel Roller": {
    "pp": 5,
    "type": 17,
    "power": 130,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 754,
    "name": "Steel Roller"
  },
  "Steel Wing": {
    "pp": 25,
    "type": 17,
    "power": 70,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 755,
    "name": "Steel Wing",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 10,
        "stats": [
          [
            "Defense",
            1
          ]
        ]
      }
    }
  },
  "Sticky Web": {
    "pp": 20,
    "type": 12,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 756,
    "name": "Sticky Web",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Speed",
            -1
          ]
        ]
      }
    }
  },
  "Stockpile": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 757,
    "name": "Stockpile"
  },
  "Stoked Sparksurfer": {
    "pp": 1,
    "type": 4,
    "power": 175,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 758,
    "name": "Stoked Sparksurfer"
  },
  "Stomp": {
    "pp": 20,
    "type": 2,
    "power": 65,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 759,
    "name": "Stomp"
  },
  "Stomping Tantrum": {
    "pp": 10,
    "type": 9,
    "power": 75,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 760,
    "name": "Stomping Tantrum"
  },
  "Stone Axe": {
    "pp": 15,
    "type": 13,
    "power": 65,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 761,
    "name": "Stone Axe"
  },
  "Stone Edge": {
    "pp": 5,
    "type": 13,
    "power": 100,
    "accuracy": 80,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 762,
    "critStage": 1,
    "name": "Stone Edge"
  },
  "Stored Power": {
    "pp": 10,
    "type": 11,
    "power": 20,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 763,
    "name": "Stored Power"
  },
  "Storm Throw": {
    "pp": 10,
    "type": 7,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 764,
    "critStage": 3,
    "name": "Storm Throw"
  },
  "Strange Steam": {
    "pp": 10,
    "type": 18,
    "power": 90,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 765,
    "name": "Strange Steam",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 20,
        "effects": [
          6
        ]
      }
    }
  },
  "Strength": {
    "pp": 15,
    "type": 2,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 766,
    "name": "Strength"
  },
  "Strength Sap": {
    "pp": 10,
    "type": 5,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 767,
    "name": "Strength Sap"
  },
  "String Shot": {
    "pp": 40,
    "type": 12,
    "power": 0,
    "accuracy": 95,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 768,
    "name": "String Shot",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Accuracy",
            -2
          ]
        ]
      }
    }
  },
  "Struggle": {
    "pp": 1,
    "type": 2,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 769,
    "name": "Struggle"
  },
  "Struggle Bug": {
    "pp": 20,
    "type": 12,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 770,
    "name": "Struggle Bug",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "SpecialAttack",
            -1
          ]
        ]
      }
    }
  },
  "Stuff Cheeks": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 771,
    "name": "Stuff Cheeks"
  },
  "Stun Spore": {
    "pp": 30,
    "type": 5,
    "power": 0,
    "accuracy": 75,
    "moveType": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 772,
    "name": "Stun Spore",
    "effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          3
        ]
      }
    }
  },
  "Submission": {
    "pp": 20,
    "type": 7,
    "power": 80,
    "accuracy": 80,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 773,
    "name": "Submission"
  },
  "Substitute": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 774,
    "name": "Substitute"
  },
  "Subzero Slammer": {
    "pp": 1,
    "type": 6,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 775,
    "name": "Subzero Slammer"
  },
  "Sucker Punch": {
    "pp": 5,
    "type": 16,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 1,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 776,
    "name": "Sucker Punch"
  },
  "Sunny Day": {
    "pp": 5,
    "type": 1,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 777,
    "name": "Sunny Day"
  },
  "Sunsteel Strike": {
    "pp": 5,
    "type": 17,
    "power": 100,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 778,
    "name": "Sunsteel Strike"
  },
  "Super Fang": {
    "pp": 10,
    "type": 2,
    "power": 80,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 779,
    "name": "Super Fang"
  },
  "Supercell Slam": {
    "pp": 15,
    "type": 4,
    "power": 100,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 780,
    "name": "Supercell Slam"
  },
  "Superpower": {
    "pp": 5,
    "type": 7,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 781,
    "name": "Superpower"
  },
  "Supersonic": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 55,
    "moveType": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 782,
    "name": "Supersonic",
    "effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          6
        ]
      }
    }
  },
  "Supersonic Skystrike": {
    "pp": 1,
    "type": 10,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 783,
    "name": "Supersonic Skystrike"
  },
  "Surf": {
    "pp": 15,
    "type": 3,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 784,
    "name": "Surf"
  },
  "Surging Strikes": {
    "pp": 5,
    "type": 3,
    "power": 75,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 785,
    "name": "Surging Strikes"
  },
  "Swagger": {
    "pp": 15,
    "type": 2,
    "power": 0,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 786,
    "name": "Swagger",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          6
        ]
      }
    }
  },
  "Swallow": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 787,
    "name": "Swallow"
  },
  "Sweet Kiss": {
    "pp": 10,
    "type": 18,
    "power": 0,
    "accuracy": 75,
    "moveType": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 788,
    "name": "Sweet Kiss",
    "effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          6
        ]
      }
    }
  },
  "Sweet Scent": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 789,
    "name": "Sweet Scent",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Evasion",
            -1
          ]
        ]
      }
    }
  },
  "Swift": {
    "pp": 20,
    "type": 2,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 790,
    "name": "Swift"
  },
  "Switcheroo": {
    "pp": 10,
    "type": 16,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 791,
    "name": "Switcheroo"
  },
  "Swords Dance": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 792,
    "name": "Swords Dance",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Attack",
            2
          ]
        ]
      }
    }
  },
  "Synchronoise": {
    "pp": 10,
    "type": 11,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 793,
    "name": "Synchronoise"
  },
  "Synthesis": {
    "pp": 5,
    "type": 5,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 794,
    "name": "Synthesis"
  },
  "Syrup Bomb": {
    "pp": 10,
    "type": 5,
    "power": 60,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 795,
    "name": "Syrup Bomb",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "Speed",
            -1
          ]
        ]
      }
    }
  },
  "Tachyon Cutter": {
    "pp": 10,
    "type": 17,
    "power": 50,
    "accuracy": 0,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/steel_battle.png",
    "id": 796,
    "name": "Tachyon Cutter"
  },
  "Tackle": {
    "pp": 35,
    "type": 2,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 797,
    "name": "Tackle"
  },
  "Tail Glow": {
    "pp": 20,
    "type": 12,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 798,
    "name": "Tail Glow",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "SpecialAttack",
            2
          ]
        ]
      }
    }
  },
  "Tail Slap": {
    "pp": 10,
    "type": 2,
    "power": 25,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 799,
    "name": "Tail Slap"
  },
  "Tail Whip": {
    "pp": 30,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 800,
    "name": "Tail Whip",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Defense",
            -1
          ]
        ]
      }
    }
  },
  "Tailwind": {
    "pp": 15,
    "type": 10,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 801,
    "name": "Tailwind"
  },
  "Take Down": {
    "pp": 20,
    "type": 2,
    "power": 90,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 802,
    "name": "Take Down"
  },
  "Take Heart": {
    "pp": 10,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 803,
    "name": "Take Heart",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "SpecialDefense",
            1
          ],
          [
            "SpecialAttack",
            1
          ]
        ]
      }
    }
  },
  "Tar Shot": {
    "pp": 15,
    "type": 13,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 804,
    "name": "Tar Shot",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Speed",
            -1
          ]
        ]
      }
    }
  },
  "Taunt": {
    "pp": 20,
    "type": 16,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 805,
    "name": "Taunt"
  },
  "Tearful Look": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 806,
    "name": "Tearful Look",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "SpecialAttack",
            -1
          ],
          [
            "Attack",
            -1
          ]
        ]
      }
    }
  },
  "Teatime": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 807,
    "name": "Teatime"
  },
  "Techno Blast": {
    "pp": 5,
    "type": 2,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 808,
    "name": "Techno Blast"
  },
  "Tectonic Rage": {
    "pp": 1,
    "type": 9,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 809,
    "name": "Tectonic Rage"
  },
  "Teeter Dance": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 810,
    "name": "Teeter Dance",
    "effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          6
        ]
      }
    }
  },
  "Telekinesis": {
    "pp": 15,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 811,
    "name": "Telekinesis"
  },
  "Teleport": {
    "pp": 20,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 812,
    "name": "Teleport",
    "special": true
  },
  "Temper Flare": {
    "pp": 10,
    "type": 1,
    "power": 75,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 813,
    "name": "Temper Flare"
  },
  "Tera Blast": {
    "pp": 10,
    "type": 2,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 814,
    "name": "Tera Blast"
  },
  "Tera Starstorm": {
    "pp": 5,
    "type": 2,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 815,
    "name": "Tera Starstorm"
  },
  "Terrain Pulse": {
    "pp": 10,
    "type": 2,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 816,
    "name": "Terrain Pulse"
  },
  "Thief": {
    "pp": 25,
    "type": 16,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 817,
    "name": "Thief"
  },
  "Thousand Arrows": {
    "pp": 10,
    "type": 9,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 818,
    "name": "Thousand Arrows"
  },
  "Thousand Waves": {
    "pp": 10,
    "type": 9,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/ground_battle.png",
    "id": 819,
    "name": "Thousand Waves"
  },
  "Thrash": {
    "pp": 10,
    "type": 2,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 820,
    "name": "Thrash"
  },
  "Throat Chop": {
    "pp": 15,
    "type": 16,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 821,
    "name": "Throat Chop"
  },
  "Thunder": {
    "pp": 10,
    "type": 4,
    "power": 110,
    "accuracy": 70,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 822,
    "name": "Thunder",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          3
        ]
      }
    }
  },
  "Thunder Cage": {
    "pp": 15,
    "type": 4,
    "power": 80,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 823,
    "name": "Thunder Cage"
  },
  "Thunder Fang": {
    "pp": 15,
    "type": 4,
    "power": 65,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 824,
    "name": "Thunder Fang",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          3
        ]
      }
    }
  },
  "Thunder Punch": {
    "pp": 15,
    "type": 4,
    "power": 75,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 825,
    "name": "Thunder Punch",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          3
        ]
      }
    }
  },
  "Thunder Shock": {
    "pp": 30,
    "type": 4,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 826,
    "name": "Thunder Shock",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          3
        ]
      }
    }
  },
  "Thunder Wave": {
    "pp": 20,
    "type": 4,
    "power": 0,
    "accuracy": 90,
    "moveType": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 827,
    "name": "Thunder Wave",
    "effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          3
        ]
      }
    }
  },
  "Thunderbolt": {
    "pp": 15,
    "type": 4,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 828,
    "name": "Thunderbolt",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          3
        ]
      }
    }
  },
  "Thunderclap": {
    "pp": 5,
    "type": 4,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": true,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 829,
    "name": "Thunderclap"
  },
  "Thunderous Kick": {
    "pp": 10,
    "type": 7,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 830,
    "name": "Thunderous Kick",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Defense",
            -1
          ]
        ]
      }
    }
  },
  "Tickle": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 831,
    "name": "Tickle",
    "effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Defense",
            -1
          ],
          [
            "Attack",
            -1
          ]
        ]
      }
    }
  },
  "Tidy Up": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 832,
    "name": "Tidy Up"
  },
  "Topsy Turvy": {
    "pp": 20,
    "type": 16,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 833,
    "name": "Topsy Turvy"
  },
  "Torch Song": {
    "pp": 10,
    "type": 1,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 834,
    "name": "Torch Song",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "SpecialAttack",
            1
          ]
        ]
      }
    }
  },
  "Torment": {
    "pp": 15,
    "type": 16,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 835,
    "name": "Torment"
  },
  "Toxic": {
    "pp": 10,
    "type": 8,
    "power": 0,
    "accuracy": 90,
    "moveType": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 836,
    "name": "Toxic",
    "effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          8
        ]
      }
    }
  },
  "Toxic Spikes": {
    "pp": 20,
    "type": 8,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 837,
    "name": "Toxic Spikes"
  },
  "Toxic Thread": {
    "pp": 20,
    "type": 8,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 838,
    "name": "Toxic Thread",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          1
        ]
      }
    }
  },
  "Trailblaze": {
    "pp": 20,
    "type": 5,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 839,
    "name": "Trailblaze",
    "after_effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Speed",
            1
          ]
        ]
      }
    }
  },
  "Transform": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 840,
    "name": "Transform"
  },
  "Tri Attack": {
    "pp": 10,
    "type": 2,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 841,
    "name": "Tri Attack",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          2
        ]
      }
    }
  },
  "Trick": {
    "pp": 10,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 842,
    "name": "Trick"
  },
  "Trick Or Treat": {
    "pp": 20,
    "type": 14,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/ghost_battle.png",
    "id": 843,
    "name": "Trick Or Treat"
  },
  "Trick Room": {
    "pp": 5,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": -7,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 844,
    "name": "Trick Room"
  },
  "Triple Arrows": {
    "pp": 10,
    "type": 7,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 845,
    "name": "Triple Arrows",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          7
        ]
      }
    }
  },
  "Triple Axel": {
    "pp": 10,
    "type": 6,
    "power": 20,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/ice_battle.png",
    "id": 846,
    "name": "Triple Axel"
  },
  "Triple Dive": {
    "pp": 10,
    "type": 3,
    "power": 30,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 847,
    "name": "Triple Dive"
  },
  "Triple Kick": {
    "pp": 10,
    "type": 7,
    "power": 10,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 848,
    "name": "Triple Kick"
  },
  "Trop Kick": {
    "pp": 15,
    "type": 5,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 849,
    "name": "Trop Kick",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Attack",
            -1
          ]
        ]
      }
    }
  },
  "Trump Card": {
    "pp": 5,
    "type": 2,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 850,
    "name": "Trump Card"
  },
  "Twin Beam": {
    "pp": 10,
    "type": 11,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Special",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 851,
    "name": "Twin Beam"
  },
  "Twineedle": {
    "pp": 20,
    "type": 12,
    "power": 25,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": true,
    "category": "Physical",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 852,
    "name": "Twineedle",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          1
        ]
      }
    }
  },
  "Twinkle Tackle": {
    "pp": 1,
    "type": 18,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fairy_battle.png",
    "id": 853,
    "name": "Twinkle Tackle"
  },
  "Twister": {
    "pp": 20,
    "type": 15,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/dragon_battle.png",
    "id": 854,
    "name": "Twister",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          7
        ]
      }
    }
  },
  "U Turn": {
    "pp": 20,
    "type": 12,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 855,
    "name": "U Turn"
  },
  "Upper Hand": {
    "pp": 15,
    "type": 7,
    "power": 65,
    "accuracy": 100,
    "moveType": 0,
    "priority": true,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 856,
    "name": "Upper Hand"
  },
  "Uproar": {
    "pp": 10,
    "type": 2,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 857,
    "name": "Uproar"
  },
  "V Create": {
    "pp": 5,
    "type": 1,
    "power": 180,
    "accuracy": 95,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 858,
    "name": "V Create",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 100,
        "stats": [
          [
            "Defense",
            -1
          ],
          [
            "SpecialDefense",
            -1
          ],
          [
            "Speed",
            -1
          ]
        ]
      }
    }
  },
  "Vacuum Wave": {
    "pp": 30,
    "type": 7,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 1,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 859,
    "name": "Vacuum Wave"
  },
  "Veevee Volley": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 860,
    "name": "Veevee Volley"
  },
  "Venom Drench": {
    "pp": 20,
    "type": 8,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 861,
    "name": "Venom Drench",
    "after_effects": {
      "stat_change": {
        "target": 0,
        "chance": 10,
        "stats": [
          [
            "SpecialAttack",
            -1
          ],
          [
            "Speed",
            -1
          ]
        ]
      }
    }
  },
  "Venoshock": {
    "pp": 10,
    "type": 8,
    "power": 65,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/poison_battle.png",
    "id": 862,
    "name": "Venoshock"
  },
  "Vice Grip": {
    "pp": 30,
    "type": 2,
    "power": 55,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 863,
    "name": "Vice Grip"
  },
  "Victory Dance": {
    "pp": 10,
    "type": 7,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 864,
    "name": "Victory Dance",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Defense",
            1
          ],
          [
            "Attack",
            1
          ]
        ]
      }
    }
  },
  "Vine Whip": {
    "pp": 25,
    "type": 5,
    "power": 45,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 865,
    "name": "Vine Whip"
  },
  "Vital Throw": {
    "pp": 10,
    "type": 7,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": -1,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 866,
    "name": "Vital Throw"
  },
  "Volt Switch": {
    "pp": 20,
    "type": 4,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 867,
    "name": "Volt Switch"
  },
  "Volt Tackle": {
    "pp": 15,
    "type": 4,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 868,
    "name": "Volt Tackle",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 10,
        "effects": [
          3
        ]
      }
    }
  },
  "Wake Up Slap": {
    "pp": 10,
    "type": 7,
    "power": 70,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/fighting_battle.png",
    "id": 869,
    "name": "Wake Up Slap"
  },
  "Water Gun": {
    "pp": 25,
    "type": 3,
    "power": 40,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 870,
    "name": "Water Gun"
  },
  "Water Pledge": {
    "pp": 10,
    "type": 3,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 871,
    "name": "Water Pledge"
  },
  "Water Pulse": {
    "pp": 20,
    "type": 3,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 872,
    "name": "Water Pulse",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          6
        ]
      }
    }
  },
  "Water Shuriken": {
    "pp": 20,
    "type": 3,
    "power": 15,
    "accuracy": 100,
    "moveType": 0,
    "priority": 1,
    "multiHit": true,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 873,
    "name": "Water Shuriken"
  },
  "Water Sport": {
    "pp": 15,
    "type": 3,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": true,
    "category": "Status",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 874,
    "name": "Water Sport"
  },
  "Water Spout": {
    "pp": 5,
    "type": 3,
    "power": 150,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 875,
    "name": "Water Spout"
  },
  "Waterfall": {
    "pp": 15,
    "type": 3,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 876,
    "name": "Waterfall",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          7
        ]
      }
    }
  },
  "Wave Crash": {
    "pp": 10,
    "type": 3,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 877,
    "name": "Wave Crash"
  },
  "Weather Ball": {
    "pp": 10,
    "type": 2,
    "power": 50,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 878,
    "name": "Weather Ball"
  },
  "Whirlpool": {
    "pp": 15,
    "type": 3,
    "power": 35,
    "accuracy": 85,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "special": true,
    "category": "Special",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 879,
    "name": "Whirlpool"
  },
  "Whirlwind": {
    "pp": 20,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": -6,
    "multiHit": true,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 880,
    "name": "Whirlwind",
    "special": true
  },
  "Wicked Blow": {
    "pp": 5,
    "type": 16,
    "power": 75,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 881,
    "name": "Wicked Blow"
  },
  "Wicked Torque": {
    "pp": 10,
    "type": 16,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/dark_battle.png",
    "id": 882,
    "name": "Wicked Torque",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          4
        ]
      }
    }
  },
  "Wide Guard": {
    "pp": 10,
    "type": 13,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 2,
    "multiHit": true,
    "category": "Status",
    "image": "textures/items/battle_moves/rock_battle.png",
    "id": 883,
    "name": "Wide Guard"
  },
  "Wild Charge": {
    "pp": 15,
    "type": 4,
    "power": 90,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 884,
    "name": "Wild Charge"
  },
  "Wildbolt Storm": {
    "pp": 10,
    "type": 4,
    "power": 100,
    "accuracy": 80,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 885,
    "name": "Wildbolt Storm",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          3
        ]
      }
    }
  },
  "Will O Wisp": {
    "pp": 15,
    "type": 1,
    "power": 0,
    "accuracy": 85,
    "moveType": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/fire_battle.png",
    "id": 886,
    "name": "Will O Wisp",
    "effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          2
        ]
      }
    }
  },
  "Wing Attack": {
    "pp": 35,
    "type": 10,
    "power": 60,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/flying_battle.png",
    "id": 887,
    "name": "Wing Attack"
  },
  "Wish": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 888,
    "name": "Wish"
  },
  "Withdraw": {
    "pp": 40,
    "type": 3,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/water_battle.png",
    "id": 889,
    "name": "Withdraw",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "Defense",
            1
          ]
        ]
      }
    }
  },
  "Wonder Room": {
    "pp": 10,
    "type": 11,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 890,
    "name": "Wonder Room"
  },
  "Wood Hammer": {
    "pp": 15,
    "type": 5,
    "power": 120,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 891,
    "name": "Wood Hammer"
  },
  "Work Up": {
    "pp": 30,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "target": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 892,
    "name": "Work Up",
    "effects": {
      "stat_change": {
        "target": 1,
        "chance": 100,
        "stats": [
          [
            "SpecialAttack",
            1
          ],
          [
            "Attack",
            1
          ]
        ]
      }
    }
  },
  "Worry Seed": {
    "pp": 10,
    "type": 5,
    "power": 0,
    "accuracy": 100,
    "moveType": 2,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/grass_battle.png",
    "id": 893,
    "name": "Worry Seed"
  },
  "Wrap": {
    "pp": 20,
    "type": 2,
    "power": 15,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 894,
    "special": true,
    "name": "Wrap"
  },
  "Wring Out": {
    "pp": 5,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 895,
    "name": "Wring Out"
  },
  "X Scissor": {
    "pp": 15,
    "type": 12,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/bug_battle.png",
    "id": 896,
    "name": "X Scissor"
  },
  "Yawn": {
    "pp": 10,
    "type": 2,
    "power": 0,
    "accuracy": 100,
    "moveType": 1,
    "priority": 0,
    "multiHit": false,
    "category": "Status",
    "image": "textures/items/battle_moves/normal_battle.png",
    "id": 897,
    "name": "Yawn",
    "effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          4
        ]
      }
    }
  },
  "Zap Cannon": {
    "pp": 5,
    "type": 4,
    "power": 120,
    "accuracy": 50,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Special",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 898,
    "name": "Zap Cannon",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 100,
        "effects": [
          3
        ]
      }
    }
  },
  "Zen Headbutt": {
    "pp": 15,
    "type": 11,
    "power": 80,
    "accuracy": 90,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/psychic_battle.png",
    "id": 899,
    "name": "Zen Headbutt",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          7
        ]
      }
    }
  },
  "Zing Zap": {
    "pp": 10,
    "type": 4,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 900,
    "name": "Zing Zap",
    "after_effects": {
      "status_effect": {
        "target": 0,
        "chance": 30,
        "effects": [
          7
        ]
      }
    }
  },
  "Zippy Zap": {
    "pp": 10,
    "type": 4,
    "power": 80,
    "accuracy": 100,
    "moveType": 0,
    "priority": 0,
    "multiHit": false,
    "category": "Physical",
    "image": "textures/items/battle_moves/electric_battle.png",
    "id": 901,
    "name": "Zippy Zap"
  }
} as unknown as { [move: string]: Pokemon.Move };
export default pokemonMoves;