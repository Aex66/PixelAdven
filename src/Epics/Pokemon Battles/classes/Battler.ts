import { Entity, Player, Vector3 } from "@minecraft/server";
import { Pokemon } from "./Pokemon";
import { Battle } from "./Battle";
import { longHand } from "../../Pokemon Database/@types/types";
import { WildTrainerData } from "../../../Letters/pokemon/TrainerClasses";
import { randomNumber, setScore } from "../utils";
import { getRandomMoves } from "../../Pokemon Calculations/moves";
import pokemoneNatures from "../../../Letters/pokemon/natures";
import { calculateHealth, calculateNatureStat } from "../../Pokemon Calculations/functions";
import { ballTags } from "../../Pokemon Calculations/catch";
import { grammarText } from "../../../Papers/Paragraphs/ExtrasParagraphs";
import AbilityList from "../../../Letters/pokemon/Abilities";
import wildPokemon from "../../../Letters/pokemon/wild";

export type Action = {
    type: 'move' | 'switch' | 'item' | 'run'
    data: any;
};

export class Battler<T extends Player | Entity> {
    runAttempts: number;
    pokemon: Pokemon | undefined;
    action: Action | undefined;
    type: 'Player' | 'WildPokemon' | 'Trainer' | 'GymLeader'
    entity: T
    battle: Battle | undefined;
    opponent: PlayerBattler | WildBattler | NpcBattler | undefined
    id: string;
    isDefeated: boolean;
    disabledMove: number | undefined;
    disabledMoveTurns: number | undefined;
    friendlyName: string | undefined;

    constructor(entity: T){
        this.type =
            entity.typeId === 'minecraft:player'
                ? 'Player'
                : entity.typeId.includes('npc')
                    ? entity.hasTag('Gym')
                        ? 'GymLeader'
                        : 'Trainer'
                    : 'WildPokemon';

        this.id = entity.id
        this.entity = entity
        this.runAttempts = 0
        this.isDefeated = false;
    }

    getAction(){
        return this.action
    }

    /**
     * Sets the battler's action
     * @param action
     */
    setAction(action?: Action){
        this.action = action
    }
}

export class PlayerBattler extends Battler<Player> {
    canSelectAction: boolean = false;
    constructor(player: Player){
        super(player)
    }

    /**
     * Sets the player's action and continues with the battle
     * @param action
     */
    setAction(action?: Action) {
        this.action = action;

        if (!action) {
            return this.canSelectAction = true
        }

        this.canSelectAction = false;
        this.battle.onPlayerAction(this)
    }
}

export class WildBattler extends Battler<Entity> {
    constructor(entity: Entity){
        super(entity)
        this.friendlyName = grammarText(entity.typeId)
    }
}

export class NpcBattler extends Battler<Entity> {
    team: { [index: string]: [name: string, data: longHand ]}
    currentPokemonIndex: number | undefined;
    name: string;
    trainerType: string;
    highestLevelPokemon: number | undefined;
    pokemonsUsed: number;
    messages: { opening: string, win: string, lose: string }
    constructor(entity: Entity){
        super(entity)
        this.team = {}
        this.trainerType = this.entity
            .getTags()
            .filter(str => str.startsWith("TrainerType:"))
            .map(str => str.replace(/^TrainerType:\s*/, ""))[0];
        this.name = WildTrainerData[this.trainerType].names[Math.floor(Math.random() * WildTrainerData[this.trainerType].names.length)]
        this.pokemonsUsed = 0
        this.messages = WildTrainerData[this.trainerType].messages[Math.floor(Math.random() * WildTrainerData[this.trainerType].messages.length)]
        this.friendlyName = `Trainer ${this.name}`
    }

    say(message: "opening" | "win" | "lose"){
        const messageToSay = this.messages[message]
        this.battle.message(`Trainer ${this.name}: ${messageToSay}`)
    }

    createTeam(opponentTeam: { [index: number]: [id: number, name: string, data: longHand] }) {
        const entity = this.entity;
        const trainerType = this.trainerType;
        if (!trainerType) throw Error(`Wild Trainer "${entity.id}" doesnt have a trainer type`);
        const data = WildTrainerData[trainerType];
        if (!data) throw new Error(`Invalid Trainer Type`);

        const difficulty = getTrainerDifficultyByHighestLevel(opponentTeam);
        if (difficulty === 'unknown') throw new Error(`Trainer difficulty is unknown`);

        const category = data[difficulty];
        if (category.size[1] > category.pokemon.length) throw Error(`Trainer Type "${trainerType}" doesnt have enough pokemon for the teamsize`);

        const teamSize = randomNumber(category.size[0], category.size[1]);
        const teamPokemon: string[] = [];

        for (let i = 0; i < teamSize; i++) {
            const randomIndex = Math.floor(Math.random() * category.pokemon.length);
            teamPokemon.push(category.pokemon[randomIndex]);
        }

        const highestLevel = getHighestLevel(opponentTeam);
        teamPokemon.forEach((name, i) => {
            const min = Math.max(5, highestLevel - 2);
            const max = Math.min(100, highestLevel + 2);
            const pokemonLvl = randomNumber(min, max);

            // Variant (can later be randomized if you want)
            const Variant = 0;

            // Moves at level
            const moves = getRandomMoves(`pokeworld:wild_${name.toLowerCase()}`, pokemonLvl, Variant);

            const natureIndex = ~~(Math.random() * pokemoneNatures.values.length);
            const health = ~~calculateHealth(`pokeworld:wild_${name.toLowerCase()}`, pokemonLvl, 31, 85);

            // ✅ Species data (correct key)
            const speciesKey = `pokeworld:wild_${name.toLowerCase()}`;
            const speciesData = wildPokemon[speciesKey];

            // ✅ Ability selection supports variant ranges (e.g. {"0-1":[...],"2-3":[...]})
            let abilityGroup: (string | null)[] = [null, null, null];
            const rawAbilityData = speciesData?.Abilities;

            if (rawAbilityData && typeof rawAbilityData === "object" && !Array.isArray(rawAbilityData)) {
                const abilityMap = rawAbilityData as Record<string, (string | null)[]>;

                // find a matching "start-end" key for this Variant
                for (const key of Object.keys(abilityMap)) {
                    if (key === "default") continue;
                    const [startStr, endStr] = key.split("-");
                    const start = parseInt(startStr);
                    const end = parseInt(endStr);
                    if (Variant >= start && Variant <= end) {
                        abilityGroup = abilityMap[key];
                        break;
                    }
                }

                // fallback to "default"
                if (abilityGroup.every(a => a === null)) {
                    abilityGroup = abilityMap["default"] ?? [null, null, null];
                }
            } else if (Array.isArray(rawAbilityData)) {
                // legacy support
                abilityGroup = rawAbilityData;
            }

            const possibleAbilities = abilityGroup
                .map((a, idx) => ({ name: a, idx }))
                .filter(x => x.name !== null);

            const chosenAbilityName = possibleAbilities.length > 0
                ? possibleAbilities[Math.floor(Math.random() * possibleAbilities.length)].name
                : "Adaptability";

            const abilityIndex = AbilityList.indexOf(chosenAbilityName as typeof AbilityList[number]);

            // ✅ Gender selection (0=Genderless, 1=Male, 2=Female)
            const rawGender = speciesData?.Gender as [number, string][] | undefined;
            let genderIdx = 0;
            let genderName: string = "Genderless";

            if (Array.isArray(rawGender) && rawGender.length > 0) {
                const hasGenderless = rawGender.some(([, g]) => g === "Genderless");
                const totalPercent = rawGender.reduce((sum, [p]) => sum + p, 0);

                if (hasGenderless && (rawGender.length === 1 || totalPercent === 0)) {
                    genderIdx = 0;
                    genderName = "Genderless";
                } else {
                    const roll = Math.random() * 100;
                    let cumulative = 0;
                    for (const [percent, g] of rawGender) {
                        cumulative += percent;
                        if (roll <= cumulative) {
                            if (g === "Male") { genderIdx = 1; genderName = "Male"; }
                            else if (g === "Female") { genderIdx = 2; genderName = "Female"; }
                            else { genderIdx = 0; genderName = "Genderless"; }
                            break;
                        }
                    }
                    // Fallback if rounding left a gap
                    if (cumulative < 100 && (genderIdx === 0 && genderName === "Genderless")) {
                        const lastGender = rawGender[rawGender.length - 1]?.[1];
                        if (lastGender === "Male") { genderIdx = 1; genderName = "Male"; }
                        else if (lastGender === "Female") { genderIdx = 2; genderName = "Female"; }
                        else { genderIdx = 0; genderName = "Genderless"; }
                    }
                }
            }

            const pokemonLongHand: longHand = {
                level: pokemonLvl,
                Experience: 0,
                Move1_PP: moves[0] ? (moves[0][2]?.pp ?? 0) : 0,
                Move2_PP: moves[1] ? (moves[1][2]?.pp ?? 0) : 0,
                Move3_PP: moves[2] ? (moves[2][2]?.pp ?? 0) : 0,
                Move4_PP: moves[3] ? (moves[3][2]?.pp ?? 0) : 0,
                Move1: moves?.[0]?.[1] ?? -1,
                Move2: moves?.[1]?.[1] ?? -1,
                Move3: moves?.[2]?.[1] ?? -1,
                Move4: moves?.[3]?.[1] ?? -1,
                Base_Health: health,
                Base_attack: ~~calculateNatureStat(`pokeworld:wild_${name.toLowerCase()}`, natureIndex, pokemonLvl, 'Base_Atk', 31, 85),
                Base_defense: ~~calculateNatureStat(`pokeworld:wild_${name.toLowerCase()}`, natureIndex, pokemonLvl, 'Base_Def', 31, 85),
                Base_special_attack: ~~calculateNatureStat(`pokeworld:wild_${name.toLowerCase()}`, natureIndex, pokemonLvl, 'Base_Sp_Atk', 31, 85),
                Base_special_defense: ~~calculateNatureStat(`pokeworld:wild_${name.toLowerCase()}`, natureIndex, pokemonLvl, 'Base_Sp_Def', 31, 85),
                Base_speed: ~~calculateNatureStat(`pokeworld:wild_${name.toLowerCase()}`, natureIndex, pokemonLvl, 'Base_Spd', 31, 85),
                Current_Health: health,
                IV_health: 31,
                IV_speed: 31,
                IV_attack: 31,
                Terra: ["", 0],
                IV_defense: 31,
                IV_special_attack: 31,
                IV_special_defense: 31,
                EV_health: 85,
                EV_speed: 85,
                EV_attack: 85,
                EV_defense: 85,
                EV_special_attack: 85,
                EV_special_defense: 85,
                Nature: ["", natureIndex],
                Ability: ["", abilityIndex], // ✅ Injected ability index
                DMax: 0,
                Variant: Variant,
                Traded: false,
                Evolution_index: 0,
                heldItem: 0,
                friendShipLevel: 0,
                pokeBall: "pokeball",
                Gender: [genderName, genderIdx],
                Nickname: "",
                Size: 0,
                Box: 0,
                Slot: 0
            };
            this.team[i] = [name, pokemonLongHand];
        });

        this.highestLevelPokemon = Object.values(this.team)
            .sort((a, b) => b[1].level - a[1].level)[0][1].level;
    }

    deployRandom(){
        if (!this?.team) return;

        ++this.pokemonsUsed

        if (this.pokemon){
            this.pokemon.entity.remove()
            this.pokemon = undefined
        }

        const pokeIndexes = Object.keys(this.team)
        const total = pokeIndexes.length
        const randomIndex = pokeIndexes[Math.floor(Math.random() * total)]

        const poke = this.team[randomIndex]
        const name = poke[0]
        const data = poke[1]

        //@ts-ignore
        const entity = spawnPokemon(this.entity, name)
        entity.runCommand(`scoreboard players set @s "Lvl" ${data.level}`);
        entity.runCommand(`scoreboard players set @s "Ex" ${data.Experience ?? 0}`);
        entity.runCommand(`scoreboard players set @s "HP_Base" ${data.Base_Health}`);
        entity.runCommand(`scoreboard players set @s "HP_Low" ${data?.Current_Health ?? data.Base_Health}`);
        entity.runCommand(`scoreboard players set @s "Atk_Base" ${data.Base_attack}`);
        entity.runCommand(`scoreboard players set @s "Def_Base" ${data.Base_defense}`);
        entity.runCommand(`scoreboard players set @s "Spd_Base" ${data.Base_speed}`);
        entity.runCommand(`scoreboard players set @s "Sp_Atk_Base" ${data.Base_special_attack}`);
        entity.runCommand(`scoreboard players set @s "Sp_Def_Base" ${data.Base_special_defense}`);
        entity.runCommand(`scoreboard players set @s "IV_HP" ${data.IV_health}`);
        entity.runCommand(`scoreboard players set @s "IV_Spd" ${data.IV_speed}`);
        entity.runCommand(`scoreboard players set @s "IV_Atk" ${data.IV_attack}`);
        entity.runCommand(`scoreboard players set @s "IV_Def" ${data.IV_defense}`);
        entity.runCommand(`scoreboard players set @s "IV_Sp_Atk" ${data.IV_special_attack}`);
        entity.runCommand(`scoreboard players set @s "IV_Sp_Def" ${data.IV_special_defense}`);
        entity.runCommand(`scoreboard players set @s "EV_HP" ${data.EV_health}`);
        entity.runCommand(`scoreboard players set @s "EV_Spd" ${data.EV_speed}`);
        entity.runCommand(`scoreboard players set @s "EV_Atk" ${data.EV_attack}`);
        entity.runCommand(`scoreboard players set @s "EV_Def" ${data?.EV_defense}`);
        entity.runCommand(`scoreboard players set @s "EV_Sp_Atk" ${data.EV_special_attack}`);
        entity.runCommand(`scoreboard players set @s "EV_Sp_Def" ${data.EV_special_defense}`);
        entity.runCommand(`scoreboard players set @s "DMax" ${data.DMax}`);
        entity.runCommand(`scoreboard players set @s "nature" ${data.Nature[1]}`);
        entity.runCommand(`scoreboard players set @s "terra" ${data.Terra[1]}`);
        entity.runCommand(`scoreboard players set @s "ability" ${data.Ability[1]}`);
        entity.runCommand(`scoreboard players set @s "Gender" ${data.Gender?.[1] ?? 0}`); // ✅ write gender index
        entity.runCommand(`scoreboard players set @s "Atk_Temp" ${data.Base_attack}`);
        entity.runCommand(`scoreboard players set @s "Def_Temp" ${data.Base_defense}`);
        entity.runCommand(`scoreboard players set @s "Spd_Temp" ${data.Base_speed}`);
        entity.runCommand(`scoreboard players set @s "Sp_Atk_Temp" ${data.Base_special_attack}`);
        entity.runCommand(`scoreboard players set @s "Sp_Def_Temp" ${data.Base_special_defense}`);
        entity.runCommand(`scoreboard players set @s "Variant" ${data.Variant}`); //<------------ VARIANT BEING SET
        entity.runCommand(`scoreboard players set @s "Traded" ${data.Traded ? 1 : 0}`);
        entity.runCommand(`scoreboard players set @s "Evolution_index" ${data.Evolution_index}`);
        entity.runCommand(`scoreboard players set @s "friendShipLevel" ${data.friendShipLevel ?? 0}`);
        entity.runCommand(`scoreboard players set @s "pokeBall" ${Object.keys(ballTags).indexOf(data.pokeBall)}`);
        entity.runCommand(`scoreboard players set @s condition ${data?.condition ?? 0}`);
        entity.runCommand(`scoreboard players set @s "move1" ${data.Move1}`);
        entity.runCommand(`scoreboard players set @s "move2" ${data.Move2}`);
        entity.runCommand(`scoreboard players set @s "move3" ${data.Move3}`);
        entity.runCommand(`scoreboard players set @s "move4" ${data.Move4}`);
        entity.runCommand(`scriptevent pokeworld:type_change`); //<------------ TYPE CHANGE CALLED

        entity.addEffect('slowness', 999999, { amplifier: 255, showParticles: false })
        entity.addTag('battle')
        setScore(entity, 'bid', this.battle.id)

        this.pokemon = new Pokemon(entity, this)
        this.battle.message(`§e${this.name} chooses ${name}!`)

        delete this.team[randomIndex]
        return name
    }
}

function getHighestLevel(playerTeam: { [index: number]: [id: number, name: string, data: longHand] }) {
    let highestLevel = 0
    Object.keys(playerTeam).forEach(i => {
        const pokemonLvl = playerTeam[Number(i)][2].level
        if (highestLevel < pokemonLvl) highestLevel = pokemonLvl
    })
    return highestLevel
}

function getTrainerDifficultyByHighestLevel(playerTeam: { [index: number]: [id: number, name: string, data: longHand] }): 'noob' | 'easy' | 'medium' | 'hard' | 'master' | 'unknown' {
    const highestLevel = getHighestLevel(playerTeam);

    switch (true) {
        case highestLevel >= 1 && highestLevel <= 20:
            return 'noob';
        case highestLevel >= 21 && highestLevel <= 40:
            return 'easy';
        case highestLevel >= 41 && highestLevel <= 60:
            return 'medium';
        case highestLevel >= 61 && highestLevel <= 80:
            return 'hard';
        case highestLevel >= 81 && highestLevel <= 100:
            return 'master';
        default:
            return 'unknown';
    }
}

function addVectors(a: Vector3, b: Vector3): Vector3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

function scaleVector(v: Vector3, scale: number): Vector3 {
  return { x: v.x * scale, y: v.y * scale, z: v.z * scale };
}

function crossProduct(a: Vector3, b: Vector3): Vector3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function spawnPokemon(trainer: Entity, name: string) {
  const dimension = trainer.dimension;
  const trainerLoc = trainer.location;
  const viewDir = trainer.getViewDirection();

  const up = { x: 0, y: 1, z: 0 };
  const rightDir = crossProduct(viewDir, up);

  const spawnOffset = addVectors(
    addVectors(
      scaleVector(viewDir, 0),           // forward 0
      scaleVector(up, 1)                 // up 1
    ),
    scaleVector(rightDir, 2)             // right 2
  );
  const spawnPos = addVectors(trainerLoc, spawnOffset);

  const facingOffset = addVectors(
    addVectors(
      scaleVector(viewDir, 0),
      scaleVector(up, 1)
    ),
    scaleVector(rightDir, 3)
  );
  const facingPos = addVectors(trainerLoc, facingOffset);

  //@ts-ignore
  const entity = dimension.spawnEntity(`pokeworld:${name.toLowerCase()}`, trainerLoc, { spawnEvent: 'pokeworld:variant_one'});

  entity.teleport({ x: spawnPos.x, y: spawnPos.y, z: spawnPos.z }, {
    facingLocation: facingPos
  });

  return entity
}
