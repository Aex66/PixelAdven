import { system, world } from "@minecraft/server";

// Blocks that cause instant despawn
const INSTANT_DESPAWN_BLOCKS = [
  "minecraft:lava",
  "minecraft:magma_block",
  "minecraft:fire",
  "minecraft:cactus"
];

const MIN_Y = -64;
const MAX_Y = 320;

system.runInterval(() => {
  for (const player of world.getPlayers()) {
    const dimension = player.dimension;

    for (const entity of dimension.getEntities()) {
      if (!entity.isValid) continue;

      const id = entity.typeId;
      if (!id.startsWith("pokeworld:wild_")) continue;

      const { x, y, z } = entity.location;

      // 🛑 HARD SAFETY CHECK — prevents crash
      if (y <= MIN_Y || y >= MAX_Y) {
        entity.remove();
        continue;
      }

      const blockY = Math.floor(y - 0.1);

      // Extra safety (paranoid but good)
      if (blockY < MIN_Y || blockY > MAX_Y) continue;

      const blockBelow = dimension.getBlock({
        x: Math.floor(x),
        y: blockY,
        z: Math.floor(z)
      });

      if (!blockBelow) continue;

      if (INSTANT_DESPAWN_BLOCKS.includes(blockBelow.typeId)) {
        entity.remove();
      }
    }
  }
}, 1);
