import { Entity } from "@minecraft/server";
import { GymData, GYM_DATA_KEY } from "./gymTypes";

export function getGymData(entity: Entity): GymData {
  const raw = entity.getDynamicProperty(GYM_DATA_KEY);

  if (!raw || typeof raw !== "string") {
    return {
      team: null,
      slots: {},          // ✅ REQUIRED
    };
  }

  try {
    const parsed = JSON.parse(raw);

    return {
      team: parsed.team ?? null,
      ownerTeamLeader: parsed.ownerTeamLeader,
      teamSpawns: parsed.teamSpawns,
      slots: parsed.slots ?? {},   // ✅ REQUIRED
    };
  } catch {
    return {
      team: null,
      slots: {},          // ✅ REQUIRED
    };
  }
}

export function saveGymData(entity: Entity, data: GymData) {
  entity.setDynamicProperty(GYM_DATA_KEY, JSON.stringify(data));
}
