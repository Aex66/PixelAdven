import { Entity, Player, Vector3, world } from "@minecraft/server";
import { getHighestMoves } from "../Pokemon Calculations/moves";
import pokemonMoves from "../../Letters/pokemon/moves";
import { pokemontypes } from "../../Letters/pokemon/types";
import TypeList from "../../Letters/pokemon/TypeList";
import { Pokemon as IPokemon } from "./classes/Pokemon";
import { Pokemon } from "../../Letters/pokemon/@types/types";
import { pokemonText } from "../../Papers/Paragraphs/ExtrasParagraphs";
import wildPokemon from "../../Letters/pokemon/wild";
import { selected } from "../Main/Forms/PC/main";
export const randomNumber = (min: number, max: number) => ~~(Math.random() * (max - min) + min)

export function setScore(
  entity: Entity,
  objectiveId: string,
  score: number,
  action?: 1 | 2
) {
  // 🛑 Entity may have been removed (fainted / despawned)
  if (!entity || !entity.isValid) return;

  let objective = world.scoreboard.getObjective(objectiveId);
  if (!objective) objective = world.scoreboard.addObjective(objectiveId);

  const identity = entity.scoreboardIdentity;

  // Safely get previous score
  let previousScore = 0;
  if (identity) {
    const temp = objective.getScore(identity);
    if (typeof temp === "number" && !Number.isNaN(temp)) {
      previousScore = temp;
    }
  }

  // 🧯 Validate incoming score (prevents NaN crash)
  if (typeof score !== "number" || Number.isNaN(score)) {
    console.warn(`Invalid score detected for ${objectiveId}:`, score);
    score = 0;
  }

  switch (action) {
    case 1:
      score += previousScore;
      break;
    case 2:
      score -= previousScore;
      break;
  }

  // 🛑 Re-check entity validity
  if (!entity.isValid) return;

  if (!identity) {
    entity.runCommand(`scoreboard players set @s ${objectiveId} ${score}`);
  } else {
    objective.setScore(identity, score);
  }
}

export function getScore(entity: Entity | undefined, objectiveId: string): number {
  try {
    if (!entity || !entity.isValid) return -1;

    const identity = entity.scoreboardIdentity;
    if (!identity) return -1;

    let obj = world.scoreboard.getObjective(objectiveId);
    if (!obj) {
      obj = world.scoreboard.addObjective(objectiveId, objectiveId);
    }

    const score = obj.getScore(identity);
    return typeof score === "number" ? score : -1;
  } catch {
    return -1;
  }
}

export function distance(loc1: Vector3, loc2: Vector3): number {
  const dx = loc2.x - loc1.x;
  const dy = loc2.y - loc1.y;
  const dz = loc2.z - loc1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function getMoveByID(id: number) {
  let found: Pokemon.Move;
  for (const move in pokemonMoves) {
    const ID = pokemonMoves[move].id
    if (ID === id) found = pokemonMoves[move]
  }
  return found
}

export function getPlayerTeam(player: Player) {
  return selected[player.name]
}
export function getRandomMove(pokemon: Entity) {
  const level = world.scoreboard.getObjective('Lvl').getScore(pokemon)
  let variant = pokemon.getComponent('minecraft:mark_variant')?.value ?? 0

  const moves = getHighestMoves(pokemon.typeId, level, variant)
  return moves[Math.floor(Math.random() * moves.length)][2].id;
}

export function getType1(pokemon: Entity, move: Pokemon.Move) {
  // 🟣 Terra override
  const isTerra = pokemon.hasTag("Terra");
  const typeScore = isTerra
    ? getScore(pokemon, "terra")
    : getScore(pokemon, "type1");

  if (!typeScore || typeScore === -1) return 1;

  const moveEffectiveness =
    pokemontypes[TypeList[move.type] as keyof typeof pokemontypes];
  const pokemonType = TypeList[typeScore]?.toLowerCase();

  if (moveEffectiveness?.Null?.includes(pokemonType)) return 0;
  else if (moveEffectiveness?.Not_Effective?.includes(pokemonType)) return 0.5;
  else if (moveEffectiveness?.Effective?.includes(pokemonType)) return 1;
  else if (moveEffectiveness?.Super_Effective?.includes(pokemonType)) return 2;

  return 1;
}

export function getType2(pokemon: Entity, move: Pokemon.Move) {
  // 🟣 Terra Pokémon have NO second type
  if (pokemon.hasTag("Terra")) return 1;

  const type2 = getScore(pokemon, "type2");
  if (!type2 || type2 === -1) return 1;

  const moveEffectiveness =
    pokemontypes[TypeList[move.type] as keyof typeof pokemontypes];
  const pokemonType = TypeList[type2]?.toLowerCase();

  if (moveEffectiveness?.Null?.includes(pokemonType)) return 0;
  else if (moveEffectiveness?.Not_Effective?.includes(pokemonType)) return 0.5;
  else if (moveEffectiveness?.Effective?.includes(pokemonType)) return 1;
  else if (moveEffectiveness?.Super_Effective?.includes(pokemonType)) return 2;

  return 1;
}

export function calculateAttackDamage(attacker: IPokemon, defender: IPokemon, moves: Pokemon.Move, type1: number, type2: number, power?: number) {
  const attackerPokemon = attacker, defenderPokemon = defender
  // ===============================
  // ⭐ GEN 9 ACCURATE CRIT SYSTEM
  // ===============================

  // 1. Determine crit stage
  let critStage = moves.critStage ?? 0;   // High-crit moves = 1, others = 0

  // Focus Energy (you use battle:laserfocus)
  if (getScore(attacker.entity, 'battle:laserfocus') > 0) {
    critStage += 2;
  }

  // Super Luck ability (boosts crit stage by 1)
  const SUPER_LUCK_ID = 105; // <-- Use your actual ability ID
  if (getScore(attacker.entity, 'ability') === SUPER_LUCK_ID) {
    critStage += 1;
  }

  // Clamp crit stage
  if (critStage > 3) critStage = 3;

  // 2. Convert stage → crit chance
  let critChance = 0;
  switch (critStage) {
    case 0: critChance = 1 / 24; break;  // ~4.17%
    case 1: critChance = 1 / 8; break;   // 12.5%
    case 2: critChance = 1 / 2; break;   // 50%
    case 3: critChance = 1; break;       // 100%
  }

  // 3. Roll for crit
  const isCrit = Math.random() < critChance;

  // 4. Crit multiplier
  const hasSniper = getScore(attacker.entity, 'ability') === 228; // Sniper ID
  let critical = isCrit ? (hasSniper ? 2.25 : 1.5) : 1;

  // Clear Focus Energy after use
  if (getScore(attacker.entity, 'battle:laserfocus') > 0) {
    setScore(attacker.entity, 'battle:laserfocus', 0);
  }

  // Shell Armor (221) or Battle Armor (17) block all crits — unless attacker has ability 144
  const defenderAbility = getScore(defender.entity, 'ability');
  const abilityScore = getScore(attacker.entity, 'ability');
  const attackerAbility = abilityScore;
  if ((defenderAbility === 221 || defenderAbility === 17) && attackerAbility !== 144) {
    critical = 1;
  }

  let attack = (function () {
    if (moves.category === 'Physical') return attackerPokemon.getAttack()
    else if (moves.category === 'Special') return attackerPokemon.getSpecialAttack()
    else return 1
  })()

  let defense = (function () {
    if (moves.category === 'Physical') return defender.getDefense()
    else if (moves.category === 'Special') return defenderPokemon.getSpecialDefense()
    else return 1
  })()

  let STAB = 1;

  const typeId = pokemonText(attacker.entity.typeId);
  const typings = wildPokemon[typeId];
  const moveType = moves.type;
  const teraType = getScore(attacker.entity, 'terra');
  const isTerastallized = getScore(attacker.entity, 'Transform') === 1;
  const hasAdaptability = getScore(attacker.entity, 'adaptability') === 1;

  const matchesOriginalType =
    moveType === typings.Type_1 || moveType === (typings?.Type_2 ?? 0);
  const matchesTeraType = moveType === teraType;

  if (hasAdaptability) {
    if (isTerastallized && matchesTeraType) {
      STAB = 2.25; // Adaptability + Tera Type
    } else if (matchesOriginalType) {
      STAB = 2.0; // Adaptability with regular typing
    }
  } else {
    if (isTerastallized && matchesTeraType) {
      STAB = 2.0; // Tera Type only
    } else if (matchesOriginalType) {
      STAB = 1.5; // Normal STAB
    }
  }

  const nonContactPhysicalMoves = [
    208, 636, 762, 230, 671, 80, 78, 79, 663, 638, 639, 447, 96, 98, 668, 382,
    379, 326, 269, 242, 592, 53, 554, 852, 614, 581, 545, 736, 36, 39, 52, 190,
    202, 167, 317, 653, 549, 648, 700, 711, 741, 818, 819
  ];


  const isNonContact = nonContactPhysicalMoves.includes(moves.id);
  const hpLow = getScore(attacker.entity, 'HP_Low');
  const hpBase = getScore(attacker.entity, 'HP_Base');

  const typeMatch = moves.type === typings.Type_1 || moves.type === (typings?.Type_2 ?? 0);

  // THCW – Tough Claws boost
  let THCW = 1.0;
  if (attackerAbility === 275 && moves.category === 'Physical' && !isNonContact) {
    THCW = 1.3;
  }

  // ABLT – Torrent, Overgrow, Blaze, Torrent, etc.
  let ABLT = 1.0;
  if (
    typeMatch &&
    hpLow <= hpBase / 3 &&
    (abilityScore === 256 || abilityScore === 274 || abilityScore === 161 || abilityScore === 32)
  ) {
    ABLT = 1.5;
  }

  // TKFT – Thick Fat (reduces Fire/Ice move power)
  let TKFT = 1.0;
  if (defenderAbility === 272 && (moves.type === 1 || moves.type === 6)) {
    TKFT = 0.5;
  }

  let SFCE = 1.0;

  if (
    attackerAbility === 220 &&
    typeof moves.effects === "object" &&
    Object.keys(moves.effects).length > 0
  ) {
    SFCE = 1.3;
  }

  let RKLS = 1.0;
  const recklessMoves = [85, 177, 264, 335, 336, 353, 400, 423, 773, 802, 868, 891, 881];
  const ability = getScore(attacker.entity, 'ability');

  if (recklessMoves.includes(moves.id) && ability === 196) {
    RKLS = 1.2;
  }

  let HSTL = 1.0;
  if (attackerAbility === 100 && moves.category === 'Physical') {
    HSTL = 1.5;
  }
  let THNN = 1.0;

  if (attackerAbility === 265 && (power ?? moves.power) < 60) {
    THNN = 1.5;
  }

  // Heavy Slam & Heat Crash → attacker vs defender ratio
  function calculateWeightBasedPower_AttackerVsDefender(attacker: Entity, defender: Entity): number {
    const atkWeight = getScore(attacker, "weight");
    const defWeight = getScore(defender, "weight");

    if (atkWeight <= 0 || defWeight <= 0) return 0;

    const ratio = atkWeight / defWeight;

    if (ratio >= 5) return 120;
    if (ratio >= 4) return 100;
    if (ratio >= 3) return 80;
    if (ratio >= 2) return 60;
    return 40;
  }

  // Low Kick & Grass Knot → defender’s weight only
  function calculateWeightBasedPower_DefenderOnly(defender: Entity): number {
    const defWeight = getScore(defender, "weight");
    if (defWeight <= 0) return 0;

    if (defWeight >= 2000) return 120;
    if (defWeight >= 1000) return 100;
    if (defWeight >= 500) return 80;
    if (defWeight >= 250) return 60;
    if (defWeight >= 100) return 40;
    return 20;
  }


  // Handle Heavy Slam (348) and Heat Crash (346)
  let basePower: number;

  switch (moves.id) {
    case 348: // Heavy Slam
    case 346: // Heat Crash
      basePower = calculateWeightBasedPower_AttackerVsDefender(attacker.entity, defender.entity);
      break;

    case 429: // Low Kick
    case 312: // Grass Knot
      basePower = calculateWeightBasedPower_DefenderOnly(defender.entity);
      break;

    default:
      basePower = power ? power : moves.power;
      break;
  }

  // ===============================
  // ⛔ Ability 303: Immune unless SE
  // ===============================
  const defenderAbilityScore = getScore(defender.entity, "ability");
  const isSuperEffective = (type1 * type2) >= 2;

  if (defenderAbilityScore === 303 && !isSuperEffective) {
    return { damage: 0, critical: false };
  }

  // ⛔ If a move has 0 base power (status move), it should never deal damage
  if (basePower === 0) {
    return { damage: 0, critical: false };
  }

  // Final adjusted move power
  const adjustedPower =
    basePower * THCW * ABLT * TKFT * SFCE * RKLS * HSTL * THNN;

  let RANDOM = (function () {
    const random = randomNumber(217, 255)
    return random / 255
  })()

  const lvl = getScore(attacker.entity, 'Lvl')
  const currentHP = getScore(defender.entity, 'HP_Low');
  const maxHP = getScore(defender.entity, 'HP_Base');

  // Calculate raw damage first
  let damage = Math.floor(
    ((((2 * lvl) / 5 + 2) * adjustedPower * (attack / defense)) / 50 + 2)
    * STAB * type1 * type2 * critical * RANDOM
  );

  // Apply Sturdy if needed
  if (
    defenderAbility === 250 &&
    currentHP === maxHP &&
    damage >= currentHP &&
    attackerAbility !== 144
  ) {
    damage = currentHP - 1;
  }



  return {
    damage: damage,
    critical: isCrit
  };
}

export namespace BattleUtils {
  /**
   * Updates the effectiveness scoreboards for messages displaying.
   * @param attacker 
   * @param type1 
   * @param type2 
   */
  export function updateEffectiveness(attacker: Entity, type1: number, type2: number): void {
    const effectiveness = {
      "0": 1,
      "0.5": 2,
      "1": 3,
      "2": 4
    };
    //@ts-ignore
    setScore(attacker, 'effectiveness1', effectiveness[type1]);//@ts-ignore
    setScore(attacker, 'effectiveness2', effectiveness[type2]);
  }
  /**
  * Helper function to apply tags needed for camera motions while attacking
  * @param attacker 
  * @param defender 
  */
  export function addBattleTags(attacker: Entity, defender: Entity) {
    attacker.removeTag('defender')
    attacker.removeTag('attacker')
    defender.removeTag('defender')
    defender.removeTag('attacker')

    attacker.addTag('attacker')
    defender.addTag('defender')
  }
}