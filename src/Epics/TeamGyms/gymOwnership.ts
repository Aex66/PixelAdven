import { Entity } from "@minecraft/server";
import { GymTeam } from "./gymTypes";
import { spawnGymTeamEntity, removeGymTeamEntity } from "./gymTeamEntities";
import { getGymData, saveGymData } from "./gymStorage";

// ======================================================
// CHANGE GYM OWNERSHIP
// - Despawns old team entity
// - Spawns new team entity at admin-defined location
// ======================================================

export function changeGymOwnership(
  gym: Entity,
  newTeam: GymTeam
) {
  const data = getGymData(gym);
  const oldTeam = data.team;

  if (oldTeam === newTeam) return;

  // ❌ Remove old team battle entity
  if (oldTeam) {
    removeGymTeamEntity(gym, oldTeam);
  }

  // ✅ Update ownership
  data.team = newTeam;
  saveGymData(gym, data);

  // ✅ Spawn new team battle entity
  const spawn = data.teamSpawns?.[newTeam];
  if (!spawn) return;

  // spawnGymTeamEntity already tags with Gym:<gym.id> and GymTeam:<team>
  spawnGymTeamEntity(newTeam, gym, spawn);
}
