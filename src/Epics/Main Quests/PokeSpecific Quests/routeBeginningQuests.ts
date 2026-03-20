/*
PokéWorld: Ascension
Route Beginnings Collection Quests
Early-Game Themed Sets
*/

import type { Quest } from "./questEngine.js";
import { Player as IPlayer } from "@minecraft/server";

export const routeBeginningQuests: Quest[] = [

    // ========================================================
    // REGIONAL RODENTS
    // ========================================================

    {
        id: "route_rodents",
        displayName: "Trailblazer's Companions",
        category: "Route Beginnings",
        icon: "textures/items/book.png",
        requirements: [
            { type: "own_species", species: "raticate" },
            { type: "own_species", species: "furret" },
            { type: "own_species", species: "linoone" },
            { type: "own_species", species: "bibarel" },
            { type: "own_species", species: "watchog" },
            { type: "own_species", species: "diggersby" },
            { type: "own_species", species: "gumshoos" },
            { type: "own_species", species: "greedent" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§eTitle Unlocked: §6First Steps Champion");
        }
    },

    // ========================================================
    // REGIONAL BIRDS
    // ========================================================

    {
        id: "route_birds",
        displayName: "Wings of the Journey",
        category: "Route Beginnings",
        icon: "textures/items/book.png",
        requirements: [
            { type: "own_species", species: "pidgeot" },
            { type: "own_species", species: "noctowl" },
            { type: "own_species", species: "swellow" },
            { type: "own_species", species: "staraptor" },
            { type: "own_species", species: "unfezant" },
            { type: "own_species", species: "talonflame" },
            { type: "own_species", species: "toucannon" },
            { type: "own_species", species: "corviknight" },
            { type: "own_species", species: "kilowattrel" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§2Title Unlocked: §bSkybound Wanderer");
        }
    },

    // ========================================================
    // EARLY BUG COLLECTION
    // ========================================================

    {
        id: "route_bugs",
        displayName: "Bug Catcher's Pride",
        category: "Route Beginnings",
        icon: "textures/items/book.png",
        requirements: [
            { type: "own_species", species: "butterfree" },
            { type: "own_species", species: "beedrill" },
            { type: "own_species", species: "beautifly" },
            { type: "own_species", species: "dustox" },
            { type: "own_species", species: "kricketune" },
            { type: "own_species", species: "leavanny" },
            { type: "own_species", species: "vikavolt" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§2Title Unlocked: §aForest Scout");
        }
    },

    // ========================================================
    // FIRST CATCH NOSTALGIA SET
    // ========================================================

    {
        id: "route_first_catch",
        displayName: "First Poké Ball Thrown",
        category: "Route Beginnings",
        icon: "textures/items/book.png",
        requirements: [
            { type: "own_species", species: "raticate" },
            { type: "own_species", species: "pidgeot" },
            { type: "own_species", species: "butterfree" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§eTitle Unlocked: §6Rookie Trainer");
        }
    },

    // ========================================================
    // ROUTE VETERAN TIER
    // ========================================================

    {
        id: "route_veteran",
        displayName: "Route Veteran",
        category: "Route Beginnings",
        icon: "textures/items/book.png",
        requirements: [
            { type: "own_species", species: "raticate" },
            { type: "own_species", species: "furret" },
            { type: "own_species", species: "linoone" },
            { type: "own_species", species: "bibarel" },
            { type: "own_species", species: "pidgeot" },
            { type: "own_species", species: "noctowl" },
            { type: "own_species", species: "swellow" },
            { type: "own_species", species: "staraptor" },
            { type: "own_species", species: "butterfree" },
            { type: "own_species", species: "beedrill" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§6Title Unlocked: §ePathfinder");
        }
    },

    // ========================================================
    // MASTER ROUTE COLLECTION
    // ========================================================

    {
        id: "route_master",
        displayName: "Master of Beginnings",
        category: "Route Beginnings",
        icon: "textures/items/book.png",
        requirements: [
            { type: "own_species", species: "raticate" },
            { type: "own_species", species: "furret" },
            { type: "own_species", species: "linoone" },
            { type: "own_species", species: "bibarel" },
            { type: "own_species", species: "watchog" },
            { type: "own_species", species: "diggersby" },
            { type: "own_species", species: "gumshoos" },
            { type: "own_species", species: "greedent" },
            { type: "own_species", species: "pidgeot" },
            { type: "own_species", species: "noctowl" },
            { type: "own_species", species: "swellow" },
            { type: "own_species", species: "staraptor" },
            { type: "own_species", species: "unfezant" },
            { type: "own_species", species: "talonflame" },
            { type: "own_species", species: "toucannon" },
            { type: "own_species", species: "corviknight" },
            { type: "own_species", species: "kilowattrel" },
            { type: "own_species", species: "butterfree" },
            { type: "own_species", species: "beedrill" },
            { type: "own_species", species: "beautifly" },
            { type: "own_species", species: "dustox" },
            { type: "own_species", species: "kricketune" },
            { type: "own_species", species: "leavanny" },
            { type: "own_species", species: "vikavolt" }
        ],
        reward: (player: IPlayer) => {
            player.sendMessage("§aTitle Unlocked: §2Route Legend");
        }
    }

];