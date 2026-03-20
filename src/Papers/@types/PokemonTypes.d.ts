import { Entity } from "@minecraft/server";
import { StatusEffectsValues } from "../../Letters/pokemon/moves";
//@ts-ignore
export class Poke extends Entity {
    /**
     * Modifies a pokemon stat by a certain stage
     * @param stat The stat that will be modified
     * @param stage The stages from -6 to 6
     */
    modifyStat(stat: string, stage: number): boolean;
    /**
     * Adds a status effect to the pokemon
     * @param status The status effect to add
     */
    applyStatus(status: StatusEffectsValues): boolean;
    /**
     * Apply damage to the pokemon
     * @param damage Damage to apply
     * @returns {boolean} If the pokemon died
     */
    takeDamage(damage: number): boolean;
    /**
     * Heal the pokemon
     * @param amount Amount to heal
     */
    heal(amount: number): void;
    /**
     * Check if the pokemon is poisoned
     */
    isPoisoned(): boolean
    /**
     * Check if the pokemon is burned
     */
    isBurned(): boolean
    /**
     * Check if the pokemon is paralyzed
     */
    isParalyzed(): boolean
    /**
     * Check if the pokemon is asleep
     */
    isAsleep(): boolean
    /**
     * Check if the pokemon is frozen
     */
    isFrozen(): boolean
    /**
     * Check if the pokemon is confused
     */
    isConfused(): boolean
    /**
     * Check if the pokemon is flinched
     */
    isFlinched(): boolean
    /**
     * Check if the pokemon is fainted
     */
    isFainted(): boolean
    /**
     * Checks if the pokemon has a specific held item
     */
    hasItem(item: string): boolean
    /**
     * Sets the pokemon health
     * @param health The health
     */
    setHealth(health: number): void;
    protected constructor()
}