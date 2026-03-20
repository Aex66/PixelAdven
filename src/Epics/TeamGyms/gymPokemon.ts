import { Entity, Player } from "@minecraft/server";
import { GymPokemonSlot } from "./gymTypes";
import { longHand } from "../Pokemon Database/@types/types";
import { GYM_RECLAIM_KEY } from "./gymTypes";

// ======================================================
// DYNAMIC PROPERTY KEY (ON TEAM ENTITY)
// ======================================================

const DEFENDERS_KEY = "pokeworld:gym_defenders";

type GymDefenders = {
  slots: Partial<Record<number, GymPokemonSlot>>;
};

// ======================================================
// HELPERS
// ======================================================

function getDefenders(teamEntity: Entity): GymDefenders {
  const raw = teamEntity.getDynamicProperty(DEFENDERS_KEY);
  if (!raw || typeof raw !== "string") return { slots: {} };

  try {
    return JSON.parse(raw) as GymDefenders;
  } catch {
    return { slots: {} };
  }
}

function saveDefenders(teamEntity: Entity, data: GymDefenders) {
  teamEntity.setDynamicProperty(DEFENDERS_KEY, JSON.stringify(data));
}

// ======================================================
// ADD POKÉMON TO GYM (TEAM ENTITY)
// ======================================================

export function addPokemonToGym(
  teamEntity: Entity,
  player: Player,
  slot: number,
  species: string,
  rID: number,
  data: longHand
) {
  const raw = teamEntity.getDynamicProperty(DEFENDERS_KEY);

  let defenders: GymDefenders;

  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : null;
    defenders = {
      slots:
        parsed && typeof parsed.slots === "object" && parsed.slots !== null
          ? parsed.slots
          : {},
    };
  } catch {
    defenders = { slots: {} };
  }

  // ✅ GUARANTEE slots exists
  if (!defenders.slots) defenders.slots = {};

  if (slot < 0 || slot >= 6) {
    player.sendMessage("§cInvalid gym slot.");
    return;
  }

  if (defenders.slots[slot]) {
    player.sendMessage("§cThat slot is already occupied.");
    return;
  }

  defenders.slots[slot] = {
    ownerId: player.id,
    ownerName: player.name,
    species,
    rID,
    data: JSON.parse(JSON.stringify(data)),
  };

  teamEntity.setDynamicProperty(
    DEFENDERS_KEY,
    JSON.stringify({ slots: defenders.slots })
  );

  player.sendMessage(`§a${species} is now defending the gym.`);
}

// ======================================================
// CLEAR GYM (ON TAKEOVER)
// ======================================================

export function clearGym(teamEntity: Entity) {
  const defenders = getDefenders(teamEntity);

  for (const slot of Object.values(defenders.slots)) {
    if (!slot) continue;

    addPokemonBackToPlayer(
      slot.ownerId,
      slot.species,
      slot.rID,
      slot.data
    );
  }
  teamEntity.setDynamicProperty(
    DEFENDERS_KEY,
    JSON.stringify({ slots: {} })
  );
}

// ======================================================
// YOU WILL IMPLEMENT THIS USING YOUR DB / PARTY SYSTEM
// ======================================================

declare function addPokemonBackToPlayer(
  playerId: string,
  species: string,
  rID: number,
  data: longHand
): void;


type GymReclaimPool = {
  // ownerId -> array of defender slots (whatever your GymPokemonSlot holds)
  byOwner: Record<string, GymPokemonSlot[]>;
};

export function moveDefendersToReclaimPool(gym: Entity, oldTeamEntity: Entity) {
  const defenders = getDefenders(oldTeamEntity);

  const raw = gym.getDynamicProperty(GYM_RECLAIM_KEY);
  let pool: GymReclaimPool = { byOwner: {} };

  if (typeof raw === "string") {
    try { pool = JSON.parse(raw); } catch {}
  }

  for (const slot of Object.values(defenders.slots ?? {})) {
    if (!slot) continue;
    const ownerId = slot.ownerId;
    if (!pool.byOwner[ownerId]) pool.byOwner[ownerId] = [];
    pool.byOwner[ownerId].push(slot);
  }

  // save reclaim pool onto the gym itself
  gym.setDynamicProperty(GYM_RECLAIM_KEY, JSON.stringify(pool));

  // clear defenders off old team entity (optional, but keeps data clean)
  oldTeamEntity.setDynamicProperty(DEFENDERS_KEY, JSON.stringify({ slots: {} }));
}


