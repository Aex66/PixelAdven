import type { longHand } from "../Pokemon Database/@types/types";

// Pokémon GO teams
export type GymTeam = "Valor" | "Mystic" | "Instinct";

// Where a team battle entity should spawn
export type GymTeamSpawn = {
  x: number;
  y: number;
  z: number;
  dimension: string;
};

// Defender Pokémon (stored on TEAM entity, not gym)
export type GymPokemonSlot = {
  ownerId: string;
  ownerName: string;
  species: string;
  rID: number;
  data: longHand;
};

// Gym anchor data (stored on pokeworld:player_team_gym)
export type GymData = {
  team: GymTeam | null;
  ownerTeamLeader?: string;

  slots: Partial<Record<number, GymPokemonSlot>>; // 0–5 (or more later)

  teamSpawns?: {
    Valor?: GymTeamSpawn;
    Mystic?: GymTeamSpawn;
    Instinct?: GymTeamSpawn;
  };
};

export const TEAM_ENTITY_MAP = {
  Valor: "pokeworld:valor_team",
  Mystic: "pokeworld:mystic_team",
  Instinct: "pokeworld:instinct_team",
} as const;

export const GYM_DATA_KEY = "pokeworld:gym_data";

export const GYM_RECLAIM_KEY = "pokeworld:gym_reclaim";


