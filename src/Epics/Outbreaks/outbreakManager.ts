import { world, system, Player, Dimension, Vector3 } from "@minecraft/server";
import { OutbreakSpeciesFamily, outbreakZones } from "./outbreakData";

// === CONFIGURATION ===
const OUTBREAK_INTERVAL = 20 * 60 * 60; // 1 hour (72,000 ticks)
const OUTBREAK_DURATION = 20 * 60 * 20; // 20 minutes (24,000 ticks)
const OUTBREAK_MESSAGE_RADIUS = 40;     // 40 blocks from outbreak center
const OUTBREAK_MAX_SPAWNS = 20;         // Total Pokémon before it ends
const OUTBREAK_CHANCE = 0.25;           // 25% chance per hour

// === TYPES ===
interface OutbreakData {
  id: number;
  species: string;
  location: { name: string; x: number; y: number; z: number; radius: number; dimension: string };
  remaining: number;
  active: number;
  spawned: number; // ✅ new
  timer: number;
  idleTimer?: number;
  started?: boolean;
  announced?: Set<number>;
}

function rollEvolutionStage(family: OutbreakSpeciesFamily): string {
  const [baseWeight, midWeight = 0, finalWeight = 0] = family.weights ?? [100, 0, 0];
  const total = baseWeight + midWeight + finalWeight;
  const roll = Math.random() * total;
  if (roll < baseWeight) return family.base;
  if (roll < baseWeight + midWeight && family.middle) return family.middle;
  return family.final ?? family.base;
}

// === STATE ===
let outbreakIdCounter = 0;
export const activeOutbreaks: OutbreakData[] = [];

// === UTILITY ===
function broadcast(message: string) {
  world.sendMessage(`§6[Outbreak] §f${message}`);
}

function getSafeSpawnY(dim: Dimension, x: number, z: number, startY: number): number {
  for (let y = startY + 10; y > 5; y--) {
    const block = dim.getBlock({ x, y, z });
    if (block && !block.isAir && !block.isLiquid) {
      return y + 1;
    }
  }
  return startY;
}

export function spawnOutbreakEntity(outbreak: OutbreakData) {
  const dim = world.getDimension(outbreak.location.dimension);
  const { x, y, z, radius } = outbreak.location;
  const species = outbreak.species;

  const offsetX = (Math.random() - 0.5) * radius * 2;
  const offsetZ = (Math.random() - 0.5) * radius * 2;

  const spawnX = Math.floor(x + offsetX);
  const spawnZ = Math.floor(z + offsetZ);
  const safeY = getSafeSpawnY(dim, spawnX, spawnZ, y);
  const spawnLoc: Vector3 = { x: spawnX + 0.5, y: safeY, z: spawnZ + 0.5 };

  try {
    const entity = dim.spawnEntity(species as any, spawnLoc);
    entity.addTag("outbreak");
    entity.addTag(`outbreak:${species.replace("pokeworld:wild_", "")}`);
    entity.addTag(`outbreak_id:${outbreak.id}`);
  } catch {
    // silently fail if area not loaded
  }
}

// === START / END ===
export function startOutbreak() {
  const zone = outbreakZones[Math.floor(Math.random() * outbreakZones.length)];
  const family = zone.families[Math.floor(Math.random() * zone.families.length)];
  const species = rollEvolutionStage(family);
  const id = Math.floor(Math.random() * 999999);

  const outbreak: OutbreakData = {
    id,
    species,
    location: zone,
    remaining: OUTBREAK_MAX_SPAWNS,
    active: 0,
    spawned: 0, // ✅ initialize
    timer: OUTBREAK_DURATION,
    started: false,
    announced: new Set(),
  };

  activeOutbreaks.push(outbreak);
  broadcast(`A mass outbreak of §e${species.replace("pokeworld:wild_", "")}§f has been detected near §b${zone.name}§f at §a(${zone.x}, ${zone.y}, ${zone.z})§f!`);
  world.setDynamicProperty(`outbreak_active_${id}`, JSON.stringify(outbreak));
}

export function endOutbreak(outbreak: OutbreakData, reason: string) {
  broadcast(`The outbreak in §b${outbreak.location.name}§f has ended (${reason}).`);

  for (const dim of [
    world.getDimension("overworld"),
    world.getDimension("nether"),
    world.getDimension("the_end")
  ]) {
    for (const entity of dim.getEntities({ tags: [`outbreak_id:${outbreak.id}`] })) {
      if (entity.hasTag("battle")) continue; // 👈 ignore battling Pokémon
      entity.remove();
    }
  }

  world.setDynamicProperty(`outbreak_active_${outbreak.id}`, undefined);
  const index = activeOutbreaks.findIndex(o => o.id === outbreak.id);
  if (index !== -1) activeOutbreaks.splice(index, 1);
}

// === TRACKING ===
export function handleOutbreakProgress(player: Player, outbreakIdTag: string, speciesName: string) {
  const outbreakId = outbreakIdTag.split(":")[1];
  const key = `outbreak_progress_${player.name}_${outbreakId}`;
  const newValue = (Number(world.getDynamicProperty(key)) ?? 0) + 1;
  world.setDynamicProperty(key, newValue);

  player.sendMessage(`§e[Outbreak] Defeated/Caught §f${speciesName} §7(${newValue}/20)`);

  if (newValue >= 20) {
    broadcast(`§b${player.name}§f has cleared the outbreak of §e${speciesName}§f!`);
    const outbreak = activeOutbreaks.find(o => o.id === Number(outbreakId));
    if (outbreak) endOutbreak(outbreak, "cleared");
  }
}

// === TIMER ===
system.runInterval(() => {
  for (const outbreak of [...activeOutbreaks]) {
    // Wait until a player enters the zone
    if (!outbreak.started) {
      const dim = world.getDimension(outbreak.location.dimension);
      const players = dim.getPlayers({
        location: { x: outbreak.location.x, y: outbreak.location.y, z: outbreak.location.z },
        maxDistance: outbreak.location.radius + 10,
      });
      if (players.length > 0) {
        outbreak.started = true;
        broadcast(`The §e${outbreak.species.replace("pokeworld:wild_", "")}§f outbreak in §b${outbreak.location.name}§f has begun!`);
        for (let i = 0; i < 5; i++) spawnOutbreakEntity(outbreak);
        outbreak.active = 5;
      } else {
        continue; // Skip countdown until someone enters
      }
    }

    outbreak.timer -= 100;
    const minutesLeft = Math.floor(outbreak.timer / (20 * 60));

    const dim = world.getDimension(outbreak.location.dimension);
    const playersInRange = dim.getPlayers({
      location: { x: outbreak.location.x, y: outbreak.location.y, z: outbreak.location.z },
      maxDistance: OUTBREAK_MESSAGE_RADIUS,
    });

    const sendLocal = (msg: string) => {
      for (const p of playersInRange) p.sendMessage(`§6[Outbreak] §f${msg}`);
    };

    const announce = (minute: number, msg: string) => {
      if (!outbreak.announced?.has(minute) && minutesLeft === minute) {
        outbreak.announced?.add(minute);
        sendLocal(msg);
      }
    };

    announce(15, `The outbreak in §b${outbreak.location.name}§f shows no signs of slowing down!`);
    announce(10, `The Pokémon at §b${outbreak.location.name}§f seem to be dispersing...`);
    announce(5, `The outbreak in §b${outbreak.location.name}§f is starting to die down.`);
    announce(1, `The outbreak at §b${outbreak.location.name}§f is nearly over!`);

    if (outbreak.timer <= 0 || outbreak.remaining <= 0) {
      endOutbreak(outbreak, outbreak.remaining <= 0 ? "depleted" : "expired");
    }
  }
}, 100); // every 5 seconds

// === HEALTH CHECK ===
system.runInterval(() => {
  for (const outbreak of [...activeOutbreaks]) {
    if (!outbreak.started) continue;
    const dim = world.getDimension(outbreak.location.dimension);
    const entities = dim.getEntities({ tags: [`outbreak_id:${outbreak.id}`] });

    const valid = entities.filter(e => {
      const dx = e.location.x - outbreak.location.x;
      const dy = e.location.y - outbreak.location.y;
      const dz = e.location.z - outbreak.location.z;
      return dx * dx + dy * dy + dz * dz <= outbreak.location.radius * outbreak.location.radius;
    });

    const missing = outbreak.active - valid.length;
    if (missing > 0 && outbreak.remaining > 0) {
      outbreak.active = valid.length;
      const spawnCount = Math.min(missing, outbreak.remaining, 5);
      for (let i = 0; i < spawnCount; i++) {
        system.runTimeout(() => spawnOutbreakEntity(outbreak), 10 * i);
      }
      for (let i = 0; i < 5; i++) spawnOutbreakEntity(outbreak);
      outbreak.active = 5;
      outbreak.spawned = 5; // ✅ record total spawned
    }

    if (outbreak.spawned >= OUTBREAK_MAX_SPAWNS && outbreak.active <= 0) {
      endOutbreak(outbreak, "depleted");
    }
  }
}, 200); // every 10 seconds

// === RANDOM OUTBREAK ROLL ===
system.runInterval(() => {
  if (Math.random() < OUTBREAK_CHANCE && activeOutbreaks.length < 2) {
    startOutbreak();
  }
}, OUTBREAK_INTERVAL);
