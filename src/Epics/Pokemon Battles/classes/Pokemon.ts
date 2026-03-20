import { Entity, world } from "@minecraft/server";
import { getScore, randomNumber, setScore } from '../utils';
import { StatusEffects, StatusEffectsValues } from "../../../Letters/pokemon/moves";
import wildPokemon from "../../../Letters/pokemon/wild";
import { grammarText, pokemonText } from "../../../Papers/Paragraphs/ExtrasParagraphs";
import { Battle } from "./Battle";
import { NpcBattler, PlayerBattler, WildBattler } from "./Battler";
import { accuracyDecreaseStages, evasionDecreaseStages, evasionIncreaseStages, statDecreaseStages, statIncreaseStages } from "../constants";
import { getMoves } from "../../Pokemon Calculations/moves";

const statusEffectMessages = {
    [StatusEffects.Poisoned]: "has been poisoned!",
    [StatusEffects.Burned]: "is burning!",
    [StatusEffects.Paralyzed]: "has been paralyzed!",
    [StatusEffects.Sleep]: "is sleeping!",
    [StatusEffects.Frozen]: "is frozen!",
    [StatusEffects.Confused]: "is confused!",
    [StatusEffects.Flinched]: "is flinched!",
    [StatusEffects.BadlyPoisoned]: "has been Badly poisoned!",
}

export type StatName =  'Attack' | 'SpecialAttack' | 'Defense' | 'SpecialDefense' | 'Speed' | 'Accuracy' | 'Evasion'
export class Pokemon {
    owner: PlayerBattler | NpcBattler | WildBattler;
    entity: Entity;
    wild: boolean;
    id: number;
    /**
     * STATS
     */
    private attack: number;
    private defense: number;
    private speed: number;
    private accuracy: number;
    private evasion: number;
    private specialAttack: number;
    private specialDefense: number;
    /**
     * STATS STAGES
     */
    attackStage: number;
    defenseStage: number;
    speedStage: number;
    accuracyStage: number;
    evasionStage: number;
    specialAttackStage: number;
    specialDefenseStage: number;

    type1: number;
    type2: number;

    dead: boolean;

    constructor(entity: Entity, owner: PlayerBattler | NpcBattler | WildBattler){
        if (entity.typeId.includes('wild')) this.wild = true
        else this.wild = true

        this.entity = entity
        this.owner = owner
        
        this.attackStage = 0
        this.defenseStage = 0
        this.speedStage = 0
        this.accuracyStage = 0
        this.evasionStage = 0
        this.specialAttackStage = 0
        this.specialDefenseStage = 0

        const isMega = this.entity.hasTag("mega");

        this.attack = getScore(this.entity, isMega ? "Atk_Mega" : "Atk_Base");
        this.specialAttack = getScore(this.entity, isMega ? "Sp_Atk_Mega" : "Sp_Atk_Base");
        this.defense = getScore(this.entity, isMega ? "Def_Mega" : "Def_Base");
        this.specialDefense = getScore(this.entity, isMega ? "Sp_Def_Mega" : "Sp_Def_Base");
        this.speed = getScore(this.entity, isMega ? "Spd_Mega" : "Spd_Base");
        this.accuracy = 1
        this.evasion = 1
        
        this.type1 = wildPokemon[pokemonText(this.entity.typeId)]?.Type_1
        this.type2 = wildPokemon[pokemonText(this.entity.typeId)]?.Type_2

        this.id = randomNumber(10000, 99999)
    }

    getHealth(){
        if (!this.entity.isValid) return 0
        return getScore(this.entity, 'HP_Low')
    }

    getMaxHealth(){
        if (!this.entity.isValid) return 0
        return getScore(this.entity, 'HP_Base')
    }

    getMoves(){
        let sb = world.scoreboard
        const moves = getMoves([
            sb.getObjective(`move1`).getScore(this.entity) ?? -1,
            sb.getObjective(`move2`).getScore(this.entity) ?? -1,
            sb.getObjective(`move3`).getScore(this.entity) ?? -1,
            sb.getObjective(`move4`).getScore(this.entity) ?? -1
        ])

        moves.forEach((move, i) => { move[2].pp = sb.getObjective(`move${i === 0 ? '' : i + 1}pp`).getScore(this.entity) ?? -1 })

        return moves
    }

getSpeed() {
    const ability = getScore(this.owner.entity, 'ability');
    const hasQuickFeet = ability === 191;

    const paralyzed = this.isParalyzed();
    const burned = this.isBurned();
    const poisoned = this.isPoisoned() || this.isBadlyPoisoned();

    const hasStatus = paralyzed || burned || poisoned;

    // Tailwind effect
    const tailwindMultiplier = getScore(this.owner.entity, 'battle:double_speed_turns') > 1 ? 2 : 1;

    if (hasQuickFeet && hasStatus) {
        // Quick Feet gives 1.5x speed when statused
        return this.speed * 1.5 * tailwindMultiplier;
    }

    if (paralyzed) {
        // Normal speed penalty for paralysis (unless Quick Feet handled it above)
        return this.speed * 0.5 * tailwindMultiplier;
    }

    return this.speed * tailwindMultiplier;
}

    getAccuracy(){
        return this.accuracy
    }

    getEvasion(){
        return this.evasion
    }

getAttack() {
    const ability = getScore(this.owner.entity, 'ability');
    const burned = this.isBurned();
    const paralyzed = this.isParalyzed();
    const poisoned = this.isPoisoned();

    const hasGuts = ability === 90;

    if (hasGuts && (burned || paralyzed || poisoned)) {
        // Guts boost: ignore burn penalty and apply +50% Attack
        return this.attack * 1.5;
    }

    if (burned) {
        // Standard burn penalty (only if not Guts)
        return this.attack * 0.5;
    }

    return this.attack;
}

    getSpecialAttack(){
        return this.specialAttack
    }

    getDefense(){
        return this.defense
    }

    getSpecialDefense(){
        return this.specialDefense
    }
    /**
     * Get the pokemon's current status effect
     * @returns 
     */
    getStatusEffect(): StatusEffectsValues {
        const condition = getScore(this.entity, 'condition') as StatusEffectsValues
        return condition
    }

    /**
     * Modifies the stat stage
     * @param stat 
     * @param value 
     * @returns 
     */
    modifyStat(stat: StatName, value: number){
        if (value > 6 || value < -6) return;

        switch(stat){
            case 'Attack': this.attackStage = value; break;
            case 'SpecialAttack': this.specialAttackStage = value; break;
            case 'Defense': this.defenseStage = value; break;
            case 'SpecialDefense': this.specialDefenseStage = value; break;
            case 'Speed': this.speedStage = value; break;
            case 'Accuracy': this.accuracyStage = value; break;
            case 'Evasion': this.evasionStage = value; break;
        }

        if (this.attackStage < 0) {
            const stage = Math.abs(this.attackStage);
            //@ts-ignore
            this.attack = this.attack * statDecreaseStages[stage];
        } else if (this.attackStage > 0) {
            const stage = this.attackStage;//@ts-ignore
            this.attack = this.attack * statIncreaseStages[stage];
        }
        
        if (this.specialAttackStage < 0) {
            const stage = Math.abs(this.specialAttackStage);//@ts-ignore
            this.specialAttack = this.specialAttack * statDecreaseStages[stage];
        } else if (this.specialAttackStage > 0) {
            const stage = this.specialAttackStage;//@ts-ignore
            this.specialAttack = this.specialAttack * statIncreaseStages[stage];
        }
    
        if (this.defenseStage < 0) {
            const stage = Math.abs(this.defenseStage);//@ts-ignore
            this.defense = this.defense * statDecreaseStages[stage];
        } else if (this.defenseStage > 0) {
            const stage = this.defenseStage;//@ts-ignore
            this.defense = this.defense * statIncreaseStages[stage];
        }
        
        if (this.specialDefenseStage < 0) {
            const stage = Math.abs(this.specialDefenseStage);//@ts-ignore
            this.specialDefense = this.specialDefense * statDecreaseStages[stage];
        } else if (this.specialDefenseStage > 0) {
            const stage = this.specialDefenseStage;//@ts-ignore
            this.specialDefense = this.specialDefense * statIncreaseStages[stage];
        }
    
        if (this.speedStage < 0) {
            const stage = Math.abs(this.speedStage);//@ts-ignore
            this.speed = this.speed * statDecreaseStages[stage];
        } else if (this.speedStage > 0) {
            const stage = this.speedStage;//@ts-ignore
            this.speed = this.speed * statIncreaseStages[stage];
        }
    
        if (this.accuracyStage < 0) {
            const stage = Math.abs(this.accuracyStage);//@ts-ignore
            this.accuracy = 1 * accuracyDecreaseStages[stage];
        } else if (this.accuracyStage > 0) {
            const stage = this.accuracyStage;//@ts-ignore
            this.accuracy = 1 * accuracyIncreaseStages[stage];
        }
    
        if (this.evasionStage < 0) {
            const stage = Math.abs(this.evasionStage);//@ts-ignorev
            this.evasion = 1 * evasionDecreaseStages[stage];
        } else if (this.evasionStage > 0) {
            const stage = this.evasionStage;//@ts-ignore
            this.evasion = 1 * evasionIncreaseStages[stage];
        }
        
        this.attack = Math.floor(this.attack);
        this.specialAttack = Math.floor(this.specialAttack);
        this.defense = Math.floor(this.defense);
        this.specialDefense = Math.floor(this.specialDefense);
        this.speed = Math.floor(this.speed);
    }

    /**
     * Get the current stat stage
     * @param stat The stat name
     * @returns 
     */
    getStat(stat: StatName){
        switch(stat){
            case 'Attack': return this.attackStage;
            case 'SpecialAttack': return this.specialAttackStage;
            case 'Defense': return this.defenseStage;
            case 'SpecialDefense': return this.specialDefenseStage;
            case 'Speed': return this.speedStage;
            case 'Accuracy': return this.accuracyStage;
            case 'Evasion': return this.evasionStage;
        }
    }

    isFainted(){
        return getScore(this.entity, 'HP_Low') < 1
    }

    applyStatus(status: StatusEffectsValues, battle: Battle) {
    const ability = getScore(this.entity, 'ability');

    // Ability 112: Immune to Flinching
    if (status === StatusEffects.Flinched && ability === 112) {
        setScore(this.entity, 'condition', 0);
        return;
    }

    setScore(this.entity, 'condition', status);

    if (status === StatusEffects.Sleep) {
        setScore(this.entity, 'sleepTurns', randomNumber(1, 3));
    }

    if (status === StatusEffects.Flinched && ability === 242) {
        this.modifyStat("Speed", this.getStat("Speed") + 1);
    }

    const message = `§d${grammarText(this.entity.typeId)}§r ${statusEffectMessages[status]}`;
    battle.message(message);
    }

    removeTrapEffect(effectName: string){
        this.entity.removeTag(`TrapEffect:${effectName}`)
    }

    damage(damage: number): boolean {
        const hp = getScore(this.entity, 'HP_Low')
        const newHp = hp - damage

        if (newHp <= 0) {
            setScore(this.entity, 'HP_Low', 0)
            this.dead = true
        } else setScore(this.entity, 'HP_Low', newHp)

        return this.dead
    }
    
    heal(amount: number) {
        const hp = getScore(this.entity, 'HP_Low'), base = getScore(this.entity, 'HP_Base')
        const newHp = hp + amount

        if (newHp >= base)
            return setScore(this.entity, 'HP_Low', base)

        setScore(this.entity, 'HP_Low', newHp)
    }

    setHealth(health: number) {
        setScore(this.entity, 'HP_Low', health)
    }

    isPoisoned() {
        const condition = getScore(this.entity, 'condition')
        return condition === StatusEffects.Poisoned
    }
    
    isBurned() {
        const condition = getScore(this.entity, 'condition')
        return condition === StatusEffects.Burned
    }

    isParalyzed() {
        const condition = getScore(this.entity, 'condition')
        return condition === StatusEffects.Paralyzed
    }

    isAsleep() {
        const condition = getScore(this.entity, 'condition')

        return condition === StatusEffects.Sleep
    }

    isFrozen() {
        const condition = getScore(this.entity, 'condition')
        return condition === StatusEffects.Frozen
    }

    isConfused() {
        const condition = getScore(this.entity, 'condition')

        return condition === StatusEffects.Confused
    }

    isFlinched() {
        const condition = getScore(this.entity, 'condition')
        return condition === StatusEffects.Flinched
    }

    isBadlyPoisoned() {
        const condition = getScore(this.entity, 'condition')
        return condition === StatusEffects.BadlyPoisoned
    }
}