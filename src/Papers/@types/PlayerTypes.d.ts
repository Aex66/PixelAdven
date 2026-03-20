
import { Player, Block, Entity, Vector3 } from '@minecraft/server';
import { longHand } from '../../Epics/Pokemon Database/@types/types';
type memoryReturn = {
    write: (key: string, value: any) => any
    read: (key: string) => any
    has: (key: string) => boolean
    release: (key: string) => boolean
}

declare interface data {
    from?: string
    sound?: boolean
}
//@ts-ignore Class inheritance allowed for native defined classe

//@ts-ignore
declare class PlayerType extends Player {
    from: string
    isAdmin: boolean
    memory: memoryReturn
    rID: string
    send(msg: string | number, from?: string, sund?: boolean): void
    tip(msg: string | number, from?: string, sund?: boolean): void
    error(msg: string | number, from?: string, sund?: boolean): void
    getNickname(): string
    getPrefixes(): string[]
    getNameColors(): string[]
    /**
    * Gets the name color of a player
    * @example .getNameColor();
    */
    getNameColor(): string
    /**
     * Get players score on a specific objective
     * @param {string} obj Objective name you want to search
     * @returns {number}
     * @example .getScore('Money')
     */
    getScore(obj: string): number
    setScore(obj: string, num: number): boolean
    hasTags(tags: string[]): boolean
    veiwBlock(getBlock?: boolean): Block | [number, number, number]
    veiwEntity(getPos?: boolean): Entity[] | [number, number, number]
    toLocation(): Vector3
    asyncCommandPaper(text: string): Promise<void>
    // veiwLocation(distance?: [number, number, number]): Location
    protected constructor()
}
//@ts-ignore Class inheritance allowed for native defined classe
declare class TrainerType extends Player {
    /**
     * Defines if this player is a trainer instance
     */
    isTrainer: boolean;
    /**
    * getTeam Gets the player's pokemon team
    * @example .getTeam();
    */
    getTeam(): { pokeIndex: number, data: [id: number, name: string, data: longHand] }[];
    /**
    * getDeployedPokemon Gets the player's deployed pokemon
    * @example .getTeam();
    */
    getActivePokemon(): Entity;
    /**
    * getDeployedPokemonData Gets the player's deployed pokemon's data
    * @example .getTeam();
    */
    getActivePokemonData(): [id: number, name: string, data: longHand];
    /**
    * getHealingItems Gets the player's healing items
    */
    getHealingItems(): { name: string, value: number }[];
    /**
    * getPokeballs Gets the player's pokeballs
    */
    getPokeballs(): { name: string, value: number }[];
    protected constructor()
}

declare class OfflineType {
    name: string
    memory: memoryReturn
    player: PlayerType
    rID: string
    send(msg: string, form?: string, sund?: boolean): void
    tip(msg: string, from?: string, sund?: boolean): void
    error(msg: string, from?: string, sund?: boolean): void
    protected constructor()
}