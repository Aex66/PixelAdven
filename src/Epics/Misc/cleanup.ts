import { world, system, Player, Entity } from "@minecraft/server";

const RANGE = 12;
const RANGE_SQ = RANGE * RANGE;

const BIKE_RANGE = 6;
const BIKE_RANGE_SQ = BIKE_RANGE * BIKE_RANGE;

const WILD_RANGE = 16;
const WILD_RANGE_SQ = WILD_RANGE * WILD_RANGE;

// ✅ Distance Check (squared for performance)
function within(player: Player, entity: Entity, sq: number): boolean {
  const dx = player.location.x - entity.location.x;
  const dy = player.location.y - entity.location.y;
  const dz = player.location.z - entity.location.z;
  return (dx * dx + dy * dy + dz * dz) <= sq;
}

system.runInterval(() => {
  const overworld = world.getDimension("overworld");
  const players: Player[] = Array.from(world.getPlayers());
  const entities: Entity[] = Array.from(overworld.getEntities());

  // ============================================================
  // ✅ UNIVERSAL CLEANUP — WILD + TRAINER + GYM SAFE
  // ============================================================
  for (const player of players) {
    if (!player.hasTag("next") || !player.hasTag("battle")) continue;

    const requiredODW = `ODW:${player.nameTag}`;
    let inValidBattle = false;

    for (const entity of entities) {
      if (!entity.isValid) continue;

      const tags = entity.getTags();
      const isInBattle = tags.includes("battle");

      if (!isInBattle) continue;

      // ===============================
      // CASE 1 — TRAINER / GYM BATTLE
      // ===============================
      if (!tags.includes("wild")) {
        if (within(player, entity, WILD_RANGE_SQ)) {
          inValidBattle = true;
          break;
        }
        continue;
      }

      // ===============================
      // CASE 2 — WILD POKÉMON BATTLE
      // ===============================
      if (tags.includes("wild") && tags.includes(requiredODW)) {
        if (within(player, entity, WILD_RANGE_SQ)) {
          inValidBattle = true;
          break;
        }
      }
    }

    // ❌ No valid battle found → cleanup
    if (!inValidBattle) {
      player.removeTag("next");
      player.removeTag("battle");
    }
  }

  for (const entity of entities) {
    if (!entity.isValid) continue;

    const tags = entity.getTags();
    const inBattle = tags.includes("battle");
    const isGym = tags.includes("Gym");
    const isSummoned = tags.includes("summoned");

    // ============================================================
    // ✔ Case 0: Summoned Entity (MUST run first)
    // ============================================================
    if (isSummoned) {
      const ownerTag = tags.find(t => t.startsWith("o:"));
      if (!ownerTag) continue;

      const ownerName = ownerTag.substring(2);
      const owner = players.find(p =>
        p.name === ownerName || p.nameTag === ownerName
      );

      if (!owner) {
        entity.remove();
        continue;
      }

      if (!within(owner, entity, RANGE_SQ)) {
        entity.remove();
      }

      continue;
    }

    // ============================================================
    // Case 1: Gym NPC in battle
    // ============================================================
    if (isGym && inBattle) {
      const nearPlayer = players.some(p => within(p, entity, RANGE_SQ));
      if (!nearPlayer && entity.isValid) {
        entity.removeTag("battle");
      }
      continue;
    }

    // ============================================================
    // Case 2: Non-Gym NPC in battle
    // ============================================================
    if (!isGym && inBattle) {
      const nearPlayer = players.some(p => within(p, entity, RANGE_SQ));
      if (!nearPlayer) {
        entity.remove();
      }
      continue;
    }
  }

  // ============================================================
  // BIKE CLEANUP SYSTEM
  // ============================================================

  // PASS 1 — Kill bikes that have no tagged player within 6 blocks
  for (const e of entities) {
    if (!e.isValid) continue;
    if (e.typeId !== "pokeworld:bike") continue;

    let taggedPlayerNear = false;

    for (const p of players) {
      if (!p.hasTag("bike")) continue;

      if (within(p, e, BIKE_RANGE_SQ)) {
        taggedPlayerNear = true;
        break;
      }
    }

    if (!taggedPlayerNear) {
      e.remove();
    }
  }

  // PASS 2 — Remove "bike" tag from any player NOT near a bike
  for (const p of players) {
    if (!p.hasTag("bike")) continue;

    let nearAnyBike = false;

    for (const e of entities) {
      if (!e.isValid) continue;
      if (e.typeId !== "pokeworld:bike") continue;

      if (within(p, e, BIKE_RANGE_SQ)) {
        nearAnyBike = true;
        break;
      }
    }

    if (!nearAnyBike) {
      p.removeTag("bike");
    }
  }

}, 40);

// ===========================================================
world.beforeEvents.playerBreakBlock.subscribe(
  event => (event.cancel = !checkCanDo(event.player))
);
world.beforeEvents.playerInteractWithBlock.subscribe(
  event => (event.cancel = !checkCanDo(event.player))
);
world.beforeEvents.playerInteractWithEntity.subscribe(
  event => (event.cancel = !checkCanDo(event.player))
);

/**
 * Check if a player can perform an action based on the block they are standing on
 */
function checkCanDo(player: Player): boolean {
  const checkPos = { ...player.location, y: 0 };
  const dimension = player.dimension;
  const block = dimension.getBlock(checkPos);
  return !(block.typeId === "minecraft:deny");
}

// Timing (ticks)
const CLEANUP_INTERVAL = 20 * 60 * 30; // 30 minutes
const WARNING_BEFORE = 20 * 10;        // 10 seconds

function scheduleCycle() {
  // 🔔 Warn 10 seconds before cleanup
  system.runTimeout(() => {
    for (const player of world.getPlayers()) {
      if (player.hasTag("ignore")) continue;
      player.sendMessage("§e⚠ Wild entities will be removed in §c10 seconds§e!");
    }
  }, CLEANUP_INTERVAL - WARNING_BEFORE);

  // 💀 Cleanup at 30 minutes
  system.runTimeout(() => {
    for (const dimension of [
      world.getDimension("overworld"),
      world.getDimension("nether"),
      world.getDimension("the_end"),
    ]) {
      for (const entity of dimension.getEntities()) {
        if (!entity.isValid) continue;
        if (entity.hasTag("wild") && !entity.hasTag("battle")) {
          entity.kill();
        }
      }
    }

    for (const player of world.getPlayers()) {
      if (player.hasTag("ignore")) continue;
      player.sendMessage("§a✔ Wild entity cleanup complete.");
    }

    scheduleCycle();
  }, CLEANUP_INTERVAL);
}

scheduleCycle();
