import { world, system, Entity } from "@minecraft/server";

/* ============================================================
   CONFIG
============================================================ */

const INTERVAL_TICKS = 100; // 5 seconds

/* ============================================================
   SIZE RANDOMIZER
============================================================ */

function applyRandomSize(entity: Entity) {
  if (!entity.hasTag("summoned")) return;

  const objective = world.scoreboard.getObjective("Size");
  if (!objective) return;

  const identity = entity.scoreboardIdentity;
  if (!identity) return;

  const currentSize = objective.getScore(identity);

  // 🔑 Only randomize if Size == 0
  if (currentSize !== 0) return;

  const sizes = [
    { value: 1, weight: 1 },
    { value: 2, weight: 0.3 },
    { value: 3, weight: 0.8 },
    { value: 4, weight: 20 },
    { value: 5, weight: 120 },
    { value: 6, weight: 20 },
    { value: 7, weight: 0.8 },
    { value: 8, weight: 0.3 },
    { value: 9, weight: 1 },
  ];

  const totalWeight = sizes.reduce((sum, s) => sum + s.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const size of sizes) {
    roll -= size.weight;
    if (roll <= 0) {
      objective.setScore(identity, size.value);
      return;
    }
  }
}

/* ============================================================
   AUTO RUNNER
============================================================ */

system.runInterval(() => {
  for (const dimension of [
    world.getDimension("overworld"),
    world.getDimension("nether"),
    world.getDimension("the_end"),
  ]) {
    for (const entity of dimension.getEntities({ tags: ["summoned"] })) {
      applyRandomSize(entity);
    }
  }
}, INTERVAL_TICKS);
