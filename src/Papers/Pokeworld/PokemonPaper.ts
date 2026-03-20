import { Entity, world } from "@minecraft/server";
import { StatusEffects, StatusEffectsValues } from "../../Letters/pokemon/moves"
import { Poke as IPoke } from "../@types/PokemonTypes";

class PokemonPaper {

    constructor(){}

create(entity: Entity): IPoke {
        return Object.assign(entity, {
            modifyStat: (stat: string, stage: number) => { return this.modifyStat(entity, stat, stage ) },
            applyStatus: (status: StatusEffectsValues) => { return this.applyStatus(entity, status) },
            takeDamage: (damage: number) => { return this.takeDamage(entity, damage) },
            heal: (amount: number) => { return this.heal(entity, amount) },
            isFainted: () => { return this.isFainted(entity) },
            isAsleep: () => { return this.isAsleep(entity) },
            isConfused: () => { return this.isConfused(entity) },
            isBurned: () => { return this.isBurned(entity) },
            isParalyzed: () => { return this.isParalyzed(entity) },
            isFrozen: () => { return this.isFrozen(entity) },
            isFlinched: () => { return this.isFlinched(entity) },
            isPoisoned: () => { return this.isPoisoned(entity) },
            hasItem: (item: string) => { return this.hasItem(entity, item) }
        }) as IPoke
    }

    isFainted(entity: Entity) {
        if (!world.getEntity(entity.id)) return true

        return false
    }

    modifyStat(entity: Entity, stat: string, stage: number) {

    }
    
    applyStatus(entity: Entity, status: StatusEffectsValues) {
        setScore(entity, 'condition', status)

        if (status === StatusEffects.Sleep) {
            setScore(entity, 'sleepTurns', randomNumber(1, 3))
        };
    }

    takeDamage(entity: Entity, damage: number): boolean {
        const hp = getScore(entity, 'HP_Low')
        const newHp = hp - damage

        if (newHp <= 0) {
            setScore(entity, 'HP_Low', 0)
        } else setScore(entity, 'HP_Low', newHp)

        return newHp <= 0
    }

    heal(entity: Entity, amount: number) {
        const hp = getScore(entity, 'HP_Low'), base = getScore(entity, 'HP_Base')
        const newHp = hp + amount

        if (newHp >= base)
            return setScore(entity, 'HP_Low', base)

        setScore(entity, 'HP_Low', newHp)
    }

    isPoisoned(entity: Entity) {
        const condition = getScore(entity, 'condition')
        if (condition === 0 || condition === -1) return false

        if (condition === StatusEffects.Poisoned) return true
        return false
    }

    isBurned(entity: Entity) {
        const condition = getScore(entity, 'condition')
        if (condition === 0 || condition === -1) return false

        if (condition === StatusEffects.Burned) return true
        return false
    }

    isParalyzed(entity: Entity) {
        const condition = getScore(entity, 'condition')
        if (condition === 0 || condition === -1) return false

        if (condition === StatusEffects.Paralyzed) return true
        return false
    }

    isAsleep(entity: Entity) {
        const condition = getScore(entity, 'condition')
        if (condition === 0 || condition === -1) return false

        if (condition === StatusEffects.Sleep) return true
        return false
    }

    isFrozen(entity: Entity) {
        const condition = getScore(entity, 'condition')
        if (condition === 0 || condition === -1) return false

        if (condition === StatusEffects.Frozen) return true
        return false
    }

    isConfused(entity: Entity) {
        const condition = getScore(entity, 'condition')
        if (condition === 0 || condition === -1) return false

        if (condition === StatusEffects.Confused) return true
        return false
    }

    isFlinched(entity: Entity) {
        const condition = getScore(entity, 'condition')
        if (condition === 0 || condition === -1) return false

        if (condition === StatusEffects.Flinched) return true
        return false
    }

    hasItem(entity: Entity, item: string) {
        return false
    }

    setHealth(entity: Entity, health: number) {
        setScore(entity, 'HP_Low', health)
    }
}

export const Poke = new PokemonPaper()

function getScore(entity: Entity, objectiveId: string) {
    let obj = world.scoreboard.getObjective(objectiveId)
    if (!obj) obj = world.scoreboard.addObjective(objectiveId)
  
    return world.scoreboard.getObjective(objectiveId).getScore(entity.scoreboardIdentity) ?? -1
}
  

function setScore(entity: Entity, objectiveId: string, score: number, action?: 1 | 2) {
    let objective = world.scoreboard.getObjective(objectiveId);
    if (!objective) objective = world.scoreboard.addObjective(objectiveId)
    const previousScore = !!entity.scoreboardIdentity ? objective.getScore(entity.scoreboardIdentity) : 0;
    switch (action) {
      case 1:
        score += previousScore;
        break;
      case 2:
        score -= previousScore;
        break;
      default:
        break;
    }
    if (!entity.scoreboardIdentity) entity.runCommand(`scoreboard players set @s ${objective} ${score}`);
    else {
      objective.setScore(entity.scoreboardIdentity, score);
    }
}

function randomNumber (min: number, max: number) { return  ~~(Math.random() * (max - min) + min) }
