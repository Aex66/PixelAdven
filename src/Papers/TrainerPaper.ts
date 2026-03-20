import { world, Player as IPlayer } from '@minecraft/server';
import { data, TrainerType } from './@types/PlayerTypes.js';
import { connected } from '../Tales/playerConnect.js';
import { selected } from '../Epics/Main/Forms/PC/main.js';
import { longHand } from '../Epics/Pokemon Database/@types/types.js';
import { deployed } from '../Epics/Pokemon Calculations/main.js';
import Player from './PlayerPaper.js';

export class TrainerPaper {
    /**
     * Converts a normal Minecraft player to a pokemon trainer.
     * @param {Player | string} player The player you want to transform
     * @param {playerData} data Additional paper data 
     * @returns {PlayerType} Don't get this confused with playertype
     */
    trainerType(player: IPlayer | string): TrainerType {
        const plr = player instanceof IPlayer ? player : world.getAllPlayers().find(p => p?.name.toLowerCase() === player?.toLowerCase());
        if(!plr || !connected.hasOwnProperty(plr.name)) return;
        return Object.assign(player, {
            isTrainer: true,
            getTeam: () => this.getTeam(plr),
            getActivePokemon: () => this.getActivePokemon(plr),
            getActivePokemonData: () => this.getActivePokemonData(plr),
            getHealingItems: () => this.getHealingItems(plr),
            getPokeballs: () => this.getPokeballs(plr)
        }) as TrainerType;
    }

    getTeam(plr: IPlayer) {
        const pokemons: { pokeIndex: number, data: [id: number, name: string, data: longHand] }[] = []

        const keys = Object.keys(selected[plr.name]);
        if (!keys.length) return []

        keys.forEach((index: any) => {
            const pokemon = selected[plr.name][index]
            pokemons.push({ pokeIndex: index, data: pokemon })
        });

        return pokemons
    }

    getActivePokemon(plr: IPlayer) {
        const pokemon = plr.dimension.getEntities({ tags: [`s:${deployed?.[plr.name]?.[0]}`] })?.[0]
        return pokemon
    }

    getActivePokemonData(plr: IPlayer) {
        const pokemonData = selected?.[plr.name]?.[deployed?.[plr.name]?.[1]]
        return pokemonData
    }

    getHealingItems(plr: IPlayer) {
        const data = [] as { name: string, value: number }[];
        ['potion', 'super_potion', 'hyper_potion', 'max_potion', 'max_revive'].forEach(heal => {
            const value = Player.getScore(plr, heal);
            if (value) data.push({ name: heal, value });
        });

        return data
    }

    getPokeballs(plr: IPlayer) {
        const data = [] as { name: string, value: number }[];
        ['pokeball', 'greatball', 'ultraball', 'masterball'].forEach(ball => {
            const value = Player.getScore(plr, ball);
            if (value) data.push({ name: ball, value });
        });

        return data
    }
}
const Trainer = new TrainerPaper();
export default Trainer;