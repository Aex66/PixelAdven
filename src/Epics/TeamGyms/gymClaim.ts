import { Entity, world } from "@minecraft/server";
import { GymTeam, TEAM_ENTITY_MAP } from "./gymTypes";
import { getGymData } from "./gymStorage";
import { moveDefendersToReclaimPool } from "./gymPokemon";


type TeamSpawn = {
  x: number;
  y: number;
  z: number;
  dimension: string;
};

function spawnGymTeamEntity(
  gym: Entity,
  team: GymTeam,
  spawn: TeamSpawn,
  preview: boolean
) {
  const dim = world.getDimension(spawn.dimension);

  const entity = dim.spawnEntity(
    TEAM_ENTITY_MAP[team] as any,
    { x: spawn.x, y: spawn.y, z: spawn.z }
  );

  // 🔗 Always link to gym
  entity.addTag(`Gym:${gym.id}`);
  entity.addTag(`GymTeam:${team}`);

  // 👁️ Preview-only marker
  if (preview) {
    entity.addTag("GymPreview");
  }

  return entity;
}


const SPAWN_KEY = "pokeworld:teamSpawns";

// ======================================================
// CLAIM GYM (SPAWN DEFENDER + VISUALS)
// ======================================================

export function claimGym(
  gym: Entity,
  team: GymTeam
) {
  const raw = gym.getDynamicProperty(SPAWN_KEY) as string;
  if (!raw) return;

  let spawns: Record<GymTeam, TeamSpawn>;
  try {
    spawns = JSON.parse(raw);
  } catch {
    return;
  }

  const spawn = spawns[team];
  if (!spawn) return;

  // 🔄 Visual state on the GYM ENTITY
  gym.runCommand(`event entity @s pokeworld:claimed_${team.toLowerCase()}`);

  // 🧹 Move old defenders into reclaim pool BEFORE removal
  for (const dim of [
    world.getDimension("overworld"),
    world.getDimension("nether"),
    world.getDimension("the_end"),
  ]) {
    const oldEntities = dim.getEntities({ tags: [`Gym:${gym.id}`] });
    for (const oldEntity of oldEntities) {
      const oldTeamTag = oldEntity.getTags().find(t => t.startsWith("GymTeam:"));
      if (!oldTeamTag) continue;

      moveDefendersToReclaimPool(gym, oldEntity);
    }
  }

  // 🧹 Remove ALL existing entities tied to this gym
  removeAllGymTeamEntities(gym.id);

  // 🏟️ Spawn REAL defender (same logic as admin preview)
  const defender = spawnGymTeamEntity(gym, team, spawn, false);

  // ❤️ Initial HP
  defender.runCommand(`scoreboard players set @s gym_hp 1000`);

  // 🔥 Sync defender Pokémon data
  const gymData = getGymData(gym);
  defender.setDynamicProperty(
    "pokeworld:gym_defenders",
    JSON.stringify(gymData.slots ?? {})
  );
}

// ======================================================
// NOTIFY GYM AFTER BATTLE (SINGLE AUTHORITY)
// CALLED ONCE WHEN A GYM BATTLE ENDS
// ======================================================

export function notifyNearbyGym(defender: Entity) {
  const objective = world.scoreboard.getObjective("gym_hp");
  if (!objective || !defender.scoreboardIdentity) return;

  // ==================================
  // 🔻 SUBTRACT GYM HP HERE (SCRIPTED)
  // ==================================
  const currentHP = objective.getScore(defender.scoreboardIdentity) ?? 0;
  const newHP = currentHP - 100;

  objective.setScore(defender.scoreboardIdentity, newHP);

  // If still alive, stop here
  if (newHP > 0) return;

  // ==================================
  // 🧠 RESET GYM (HP DEPLETED)
  // ==================================
  const gymTag = defender.getTags().find(t => t.startsWith("Gym:"));
  if (!gymTag) {
    defender.kill();
    return;
  }

  const gymId = gymTag.split(":")[1];

  for (const dim of [
    world.getDimension("overworld"),
    world.getDimension("nether"),
    world.getDimension("the_end"),
  ]) {
    for (const gym of dim.getEntities({ type: "pokeworld:player_team_gym" })) {
      if (gym.id === gymId) {
        // 🔁 Reset THIS gym only
        gym.runCommand(`event pokeworld:claimed_reset`);
        break;
      }
    }
  }

  // 💀 Remove defeated defender
  defender.kill();
}

// ======================================================
// INTERNAL CLEANUP
// ======================================================

function removeAllGymTeamEntities(gymId: string) {
  for (const dim of [
    world.getDimension("overworld"),
    world.getDimension("nether"),
    world.getDimension("the_end"),
  ]) {
    for (const e of dim.getEntities({ tags: [`Gym:${gymId}`] })) {
      e.kill();
    }
  }
}
