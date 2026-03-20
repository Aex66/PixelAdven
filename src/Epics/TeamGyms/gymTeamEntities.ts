import { world, Entity } from "@minecraft/server";
import { GymTeam } from "./gymTypes";

const TEAM_ENTITY_MAP: Record<GymTeam, string> = {
  Valor: "pokeworld:valor_team",
  Mystic: "pokeworld:mystic_team",
  Instinct: "pokeworld:instinct_team",
};

// ======================================================
// SPAWN TEAM BATTLE ENTITY
// ======================================================

export function spawnGymTeamEntity(
  team: GymTeam,
  gym: Entity,
  spawn: { x: number; y: number; z: number; dimension: string }
): Entity {
  const dim = world.getDimension(spawn.dimension);

  const ent = dim.spawnEntity(TEAM_ENTITY_MAP[team] as any, {
    x: spawn.x,
    y: spawn.y,
    z: spawn.z,
  });

  // Store defenders on the TEAM entity
  ent.setDynamicProperty(
    "pokeworld:gym_defenders",
    JSON.stringify({ slots: {} })
  );

  // 🔑 REQUIRED TAGS
  ent.addTag(`Gym:${gym.id}`);
  ent.addTag(`GymTeam:${team}`);

  return ent;
}

// ======================================================
// DESPAWN TEAM BATTLE ENTITY (SAFE)
// ======================================================

export function removeGymTeamEntity(
  gym: Entity,
  team: GymTeam
) {
  const dim = gym.dimension;

  for (const e of dim.getEntities({
    tags: [`Gym:${gym.id}`, `GymTeam:${team}`]
  })) {
    e.kill();
  }
}
