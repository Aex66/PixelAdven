import { Player } from "@minecraft/server";
import { GymTeam } from "./gymTypes";

const PLAYER_TEAM_KEY = "pokeworld:player_team";

function isGymTeam(v: unknown): v is GymTeam {
  return v === "Valor" || v === "Mystic" || v === "Instinct";
}

export function getPlayerTeam(player: Player): GymTeam | null {
  const raw = player.getDynamicProperty(PLAYER_TEAM_KEY);
  return isGymTeam(raw) ? raw : null;
}

export function setPlayerTeam(player: Player, team: GymTeam) {
  player.setDynamicProperty(PLAYER_TEAM_KEY, team);
}

export function clearPlayerTeam(player: Player) {
  player.setDynamicProperty(PLAYER_TEAM_KEY, null);
}
