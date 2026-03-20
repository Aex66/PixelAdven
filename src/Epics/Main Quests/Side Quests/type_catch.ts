import { Player, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import PlayerScore from "../../../Papers/PlayerPaper.js";

// Import each quest line’s stage functions + reward functions
import {
  normal0, normal1, normal2, normal3, normal4, normal5, normal6, normal7, normal8, normal9, normal10,
  normal1_reward, normal2_reward, normal3_reward, normal4_reward, normal5_reward,
  normal6_reward, normal7_reward, normal8_reward, normal9_reward, normal10_reward
} from "./normal.js";

import {
  fire0, fire1, fire2, fire3, fire4, fire5, fire6, fire7, fire8, fire9, fire10,
  fire1_reward, fire2_reward, fire3_reward, fire4_reward, fire5_reward,
  fire6_reward, fire7_reward, fire8_reward, fire9_reward, fire10_reward
} from "./fire.js";

import {
  water0, water1, water2, water3, water4, water5, water6, water7, water8, water9, water10,
  water1_reward, water2_reward, water3_reward, water4_reward, water5_reward,
  water6_reward, water7_reward, water8_reward, water9_reward, water10_reward
} from "./water.js";

import {
  electric0, electric1, electric2, electric3, electric4, electric5, electric6, electric7, electric8, electric9, electric10,
  electric1_reward, electric2_reward, electric3_reward, electric4_reward, electric5_reward,
  electric6_reward, electric7_reward, electric8_reward, electric9_reward, electric10_reward
} from "./electric.js";

import {
  grass0, grass1, grass2, grass3, grass4, grass5, grass6, grass7, grass8, grass9, grass10,
  grass1_reward, grass2_reward, grass3_reward, grass4_reward, grass5_reward,
  grass6_reward, grass7_reward, grass8_reward, grass9_reward, grass10_reward
} from "./grass.js";

import {
  ice0, ice1, ice2, ice3, ice4, ice5, ice6, ice7, ice8, ice9, ice10,
  ice1_reward, ice2_reward, ice3_reward, ice4_reward, ice5_reward,
  ice6_reward, ice7_reward, ice8_reward, ice9_reward, ice10_reward
} from "./ice.js";

import {
  fighting0, fighting1, fighting2, fighting3, fighting4, fighting5, fighting6, fighting7, fighting8, fighting9, fighting10,
  fighting1_reward, fighting2_reward, fighting3_reward, fighting4_reward, fighting5_reward,
  fighting6_reward, fighting7_reward, fighting8_reward, fighting9_reward, fighting10_reward
} from "./fighting.js";

import {
  poison0, poison1, poison2, poison3, poison4, poison5, poison6, poison7, poison8, poison9, poison10,
  poison1_reward, poison2_reward, poison3_reward, poison4_reward, poison5_reward,
  poison6_reward, poison7_reward, poison8_reward, poison9_reward, poison10_reward
} from "./poison.js";

import {
  ground0, ground1, ground2, ground3, ground4, ground5, ground6, ground7, ground8, ground9, ground10,
  ground1_reward, ground2_reward, ground3_reward, ground4_reward, ground5_reward,
  ground6_reward, ground7_reward, ground8_reward, ground9_reward, ground10_reward
} from "./ground.js";

import {
  flying0, flying1, flying2, flying3, flying4, flying5, flying6, flying7, flying8, flying9, flying10,
  flying1_reward, flying2_reward, flying3_reward, flying4_reward, flying5_reward,
  flying6_reward, flying7_reward, flying8_reward, flying9_reward, flying10_reward
} from "./flying.js";

import {
  psychic0, psychic1, psychic2, psychic3, psychic4, psychic5, psychic6, psychic7, psychic8, psychic9, psychic10,
  psychic1_reward, psychic2_reward, psychic3_reward, psychic4_reward, psychic5_reward,
  psychic6_reward, psychic7_reward, psychic8_reward, psychic9_reward, psychic10_reward
} from "./psychic.js";

import {
  bug0, bug1, bug2, bug3, bug4, bug5, bug6, bug7, bug8, bug9, bug10,
  bug1_reward, bug2_reward, bug3_reward, bug4_reward, bug5_reward,
  bug6_reward, bug7_reward, bug8_reward, bug9_reward, bug10_reward
} from "./bug.js";

import {
  rock0, rock1, rock2, rock3, rock4, rock5, rock6, rock7, rock8, rock9, rock10,
  rock1_reward, rock2_reward, rock3_reward, rock4_reward, rock5_reward,
  rock6_reward, rock7_reward, rock8_reward, rock9_reward, rock10_reward
} from "./rock.js";

import {
  ghost0, ghost1, ghost2, ghost3, ghost4, ghost5, ghost6, ghost7, ghost8, ghost9, ghost10,
  ghost1_reward, ghost2_reward, ghost3_reward, ghost4_reward, ghost5_reward,
  ghost6_reward, ghost7_reward, ghost8_reward, ghost9_reward, ghost10_reward
} from "./ghost.js";

import {
  dragon0, dragon1, dragon2, dragon3, dragon4, dragon5, dragon6, dragon7, dragon8, dragon9, dragon10,
  dragon1_reward, dragon2_reward, dragon3_reward, dragon4_reward, dragon5_reward,
  dragon6_reward, dragon7_reward, dragon8_reward, dragon9_reward, dragon10_reward
} from "./dragon.js";

import {
  dark0, dark1, dark2, dark3, dark4, dark5, dark6, dark7, dark8, dark9, dark10,
  dark1_reward, dark2_reward, dark3_reward, dark4_reward, dark5_reward,
  dark6_reward, dark7_reward, dark8_reward, dark9_reward, dark10_reward
} from "./dark.js";

import {
  steel0, steel1, steel2, steel3, steel4, steel5, steel6, steel7, steel8, steel9, steel10,
  steel1_reward, steel2_reward, steel3_reward, steel4_reward, steel5_reward,
  steel6_reward, steel7_reward, steel8_reward, steel9_reward, steel10_reward
} from "./steel.js";

import {
  fairy0, fairy1, fairy2, fairy3, fairy4, fairy5, fairy6, fairy7, fairy8, fairy9, fairy10,
  fairy1_reward, fairy2_reward, fairy3_reward, fairy4_reward, fairy5_reward,
  fairy6_reward, fairy7_reward, fairy8_reward, fairy9_reward, fairy10_reward
} from "./fairy.js";

import { openSideQuestMenu } from "./quest_main.js";

// 🔑 Config for all Type Quests
export const typeQuests = [
  {
    id: "normalquest",
    name: "Normal",
    score: "normal",
    thresholds: [0,10,50,100,150,250,500,1000,2500,5000,10000],
    stages: [normal0,normal1,normal2,normal3,normal4,normal5,normal6,normal7,normal8,normal9,normal10],
    rewards: [null, normal1_reward, normal2_reward, normal3_reward, normal4_reward, normal5_reward, normal6_reward, normal7_reward, normal8_reward, normal9_reward, normal10_reward],
    icon: "textures/items/battle_moves/normal.png"
  },
  {
    id: "firequest",
    name: "Fire",
    score: "fire",
    thresholds: [0,10,50,100,150,250,500,1000,2500,5000,10000],
    stages: [fire0,fire1,fire2,fire3,fire4,fire5,fire6,fire7,fire8,fire9,fire10],
    rewards: [null, fire1_reward, fire2_reward, fire3_reward, fire4_reward, fire5_reward, fire6_reward, fire7_reward, fire8_reward, fire9_reward, fire10_reward],
    icon: "textures/items/battle_moves/fire.png"
  },
  {
    id: "waterquest",
    name: "Water",
    score: "water",
    thresholds: [0,10,50,100,150,250,500,1000,2500,5000,10000],
    stages: [water0,water1,water2,water3,water4,water5,water6,water7,water8,water9,water10],
    rewards: [null, water1_reward, water2_reward, water3_reward, water4_reward, water5_reward, water6_reward, water7_reward, water8_reward, water9_reward, water10_reward],
    icon: "textures/items/battle_moves/water.png"
  },
  {
    id: "electricquest",
    name: "Electric",
    score: "electric",
    thresholds: [0,10,50,100,150,250,500,1000,2500,5000,10000],
    stages: [electric0,electric1,electric2,electric3,electric4,electric5,electric6,electric7,electric8,electric9,electric10],
    rewards: [null, electric1_reward, electric2_reward, electric3_reward, electric4_reward, electric5_reward, electric6_reward, electric7_reward, electric8_reward, electric9_reward, electric10_reward],
    icon: "textures/items/battle_moves/electric.png"
  },
  {
    id: "grassquest",
    name: "Grass",
    score: "grass",
    thresholds: [0,10,50,100,150,250,500,1000,2500,5000,10000],
    stages: [grass0,grass1,grass2,grass3,grass4,grass5,grass6,grass7,grass8,grass9,grass10],
    rewards: [null, grass1_reward, grass2_reward, grass3_reward, grass4_reward, grass5_reward, grass6_reward, grass7_reward, grass8_reward, grass9_reward, grass10_reward],
    icon: "textures/items/battle_moves/grass.png"
  },
  {
    id: "icequest",
    name: "Ice",
    score: "ice",
    thresholds: [0,10,50,100,150,250,500,1000,2500,5000,10000],
    stages: [ice0,ice1,ice2,ice3,ice4,ice5,ice6,ice7,ice8,ice9,ice10],
    rewards: [null, ice1_reward, ice2_reward, ice3_reward, ice4_reward, ice5_reward, ice6_reward, ice7_reward, ice8_reward, ice9_reward, ice10_reward],
    icon: "textures/items/battle_moves/ice.png"
  },
  {
    id: "fightingquest",
    name: "Fighting",
    score: "fighting",
    thresholds: [0,10,50,100,150,250,500,1000,2500,5000,10000],
    stages: [fighting0,fighting1,fighting2,fighting3,fighting4,fighting5,fighting6,fighting7,fighting8,fighting9,fighting10],
    rewards: [null, fighting1_reward, fighting2_reward, fighting3_reward, fighting4_reward, fighting5_reward, fighting6_reward, fighting7_reward, fighting8_reward, fighting9_reward, fighting10_reward],
    icon: "textures/items/battle_moves/fighting.png"
  },
  {
    id: "poisonquest",
    name: "Poison",
    score: "poison",
    thresholds: [0,10,50,100,150,250,500,1000,2500,5000,10000],
    stages: [poison0,poison1,poison2,poison3,poison4,poison5,poison6,poison7,poison8,poison9,poison10],
    rewards: [null, poison1_reward, poison2_reward, poison3_reward, poison4_reward, poison5_reward, poison6_reward, poison7_reward, poison8_reward, poison9_reward, poison10_reward],
    icon: "textures/items/battle_moves/poison.png"
  },
  {
    id: "groundquest",
    name: "Ground",
    score: "ground",
    thresholds: [0,10,50,100,150,250,500,1000,2500,5000,10000],
    stages: [ground0,ground1,ground2,ground3,ground4,ground5,ground6,ground7,ground8,ground9,ground10],
    rewards: [null, ground1_reward, ground2_reward, ground3_reward, ground4_reward, ground5_reward, ground6_reward, ground7_reward, ground8_reward, ground9_reward, ground10_reward],
    icon: "textures/items/battle_moves/ground.png"
  },
  {
    id: "flyingquest",
    name: "Flying",
    score: "flying",
    thresholds: [0,10,50,100,150,250,500,1000,2500,5000,10000],
    stages: [flying0,flying1,flying2,flying3,flying4,flying5,flying6,flying7,flying8,flying9,flying10],
    rewards: [null, flying1_reward, flying2_reward, flying3_reward, flying4_reward, flying5_reward, flying6_reward, flying7_reward, flying8_reward, flying9_reward, flying10_reward],
    icon: "textures/items/battle_moves/flying.png"
  },
  {
    id: "psychicquest",
    name: "Psychic",
    score: "psychic",
    thresholds: [0,10,50,100,150,250,500,1000,2500,5000,10000],
    stages: [psychic0,psychic1,psychic2,psychic3,psychic4,psychic5,psychic6,psychic7,psychic8,psychic9,psychic10],
    rewards: [null, psychic1_reward, psychic2_reward, psychic3_reward, psychic4_reward, psychic5_reward, psychic6_reward, psychic7_reward, psychic8_reward, psychic9_reward, psychic10_reward],
    icon: "textures/items/battle_moves/psychic.png"
  },
  {
    id: "bugquest",
    name: "Bug",
    score: "bug",
    thresholds: [0,10,50,100,150,250,500,1000,2500,5000,10000],
    stages: [bug0,bug1,bug2,bug3,bug4,bug5,bug6,bug7,bug8,bug9,bug10],
    rewards: [null, bug1_reward, bug2_reward, bug3_reward, bug4_reward, bug5_reward, bug6_reward, bug7_reward, bug8_reward, bug9_reward, bug10_reward],
    icon: "textures/items/battle_moves/bug.png"
  },
  {
    id: "rockquest",
    name: "Rock",
    score: "rock",
    thresholds: [0,10,50,100,150,250,500,1000,2500,5000,10000],
    stages: [rock0,rock1,rock2,rock3,rock4,rock5,rock6,rock7,rock8,rock9,rock10],
    rewards: [null, rock1_reward, rock2_reward, rock3_reward, rock4_reward, rock5_reward, rock6_reward, rock7_reward, rock8_reward, rock9_reward, rock10_reward],
    icon: "textures/items/battle_moves/rock.png"
  },
  {
    id: "ghostquest",
    name: "Ghost",
    score: "ghost",
    thresholds: [0,10,50,100,150,250,500,1000,2500,5000,10000],
    stages: [ghost0,ghost1,ghost2,ghost3,ghost4,ghost5,ghost6,ghost7,ghost8,ghost9,ghost10],
    rewards: [null, ghost1_reward, ghost2_reward, ghost3_reward, ghost4_reward, ghost5_reward, ghost6_reward, ghost7_reward, ghost8_reward, ghost9_reward, ghost10_reward],
    icon: "textures/items/battle_moves/ghost.png"
  },
  {
    id: "dragonquest",
    name: "Dragon",
    score: "dragon",
    thresholds: [0,10,50,100,150,250,500,1000,2500,5000,10000],
    stages: [dragon0,dragon1,dragon2,dragon3,dragon4,dragon5,dragon6,dragon7,dragon8,dragon9,dragon10],
    rewards: [null, dragon1_reward, dragon2_reward, dragon3_reward, dragon4_reward, dragon5_reward, dragon6_reward, dragon7_reward, dragon8_reward, dragon9_reward, dragon10_reward],
    icon: "textures/items/battle_moves/dragon.png"
  },
  {
    id: "darkquest",
    name: "Dark",
    score: "dark",
    thresholds: [0,10,50,100,150,250,500,1000,2500,5000,10000],
    stages: [dark0,dark1,dark2,dark3,dark4,dark5,dark6,dark7,dark8,dark9,dark10],
    rewards: [null, dark1_reward, dark2_reward, dark3_reward, dark4_reward, dark5_reward, dark6_reward, dark7_reward, dark8_reward, dark9_reward, dark10_reward],
    icon: "textures/items/battle_moves/dark.png"
  },
  {
    id: "steelquest",
    name: "Steel",
    score: "steel",
    thresholds: [0,10,50,100,150,250,500,1000,2500,5000,10000],
    stages: [steel0,steel1,steel2,steel3,steel4,steel5,steel6,steel7,steel8,steel9,steel10],
    rewards: [null, steel1_reward, steel2_reward, steel3_reward, steel4_reward, steel5_reward, steel6_reward, steel7_reward, steel8_reward, steel9_reward, steel10_reward],
    icon: "textures/items/battle_moves/steel.png"
  },
  {
    id: "fairyquest",
    name: "Fairy",
    score: "fairy",
    thresholds: [0,10,50,100,150,250,500,1000,2500,5000,10000],
    stages: [fairy0,fairy1,fairy2,fairy3,fairy4,fairy5,fairy6,fairy7,fairy8,fairy9,fairy10],
    rewards: [null, fairy1_reward, fairy2_reward, fairy3_reward, fairy4_reward, fairy5_reward, fairy6_reward, fairy7_reward, fairy8_reward, fairy9_reward, fairy10_reward],
    icon: "textures/items/battle_moves/fairy.png"
  }
];

// 🧭 Type Catch Quest Menu
export function catchtype(player: Player) {
  const form = new ActionFormData()
    .title("§7§7§rType Catch Quests")
    .body("Choose a type quest to view your progress.");

for (const quest of typeQuests) {
  const stage = Number(PlayerScore.getScore(player, quest.id) ?? 0);
  const progress = Number(PlayerScore.getScore(player, quest.score) ?? 0);

  const nextTarget =
    stage < quest.thresholds.length - 1
      ? quest.thresholds[stage + 1]
      : undefined;

  const label =
    stage >= quest.stages.length
      ? `§a${quest.name} §7(Complete)`
      : `§e${quest.name}: ${progress}/${nextTarget}`;

  form.button(label, quest.icon);
}

form.show(player).then((res) => {
  if (res.canceled) {
    // Back → return to the Side Quest hub
    openSideQuestMenu(player);
    return;
  }

  if (res.selection < 0 || res.selection >= typeQuests.length) {
    openSideQuestMenu(player);
    return;
  }

  const quest = typeQuests[res.selection];
  const stage = Number(PlayerScore.getScore(player, quest.id) ?? 0);
  const progress = Number(PlayerScore.getScore(player, quest.score) ?? 0);

  if (stage >= quest.stages.length) {
    player.sendMessage(`§aYou have already completed all stages of the ${quest.name} quest!`);
    openSideQuestMenu(player);
    return;
  }

  const nextTarget =
    stage < quest.thresholds.length - 1
      ? quest.thresholds[stage + 1]
      : undefined;

  if (nextTarget !== undefined && progress < nextTarget) {
    const remaining = nextTarget - progress;
    player.sendMessage(
      `§cNot ready yet. §7You still need §e${remaining} §7more ${quest.name.toLowerCase()} catches for stage §b${stage + 1}§7.`
    );
    // Stay here so they can pick another type quest or back out
    return;
  }

  // Run the claim for this stage, then bounce back to the hub next tick
  system.run(() => {
    quest.stages[stage](player);
  });
});
}
