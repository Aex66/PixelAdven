import { world, system } from "@minecraft/server";

// 📌 Define multiple polygon zones (city areas)
const areaPolygons: [number, number][][] = [
  [
    // 🔵 City 1
    [-493, -323],
    [-493, -135],
    [-77, -135],
    [-77, -488],
    [-287, -488],
    [-287, -373],
    [-320, -373],
    [-319, -345],
    [-373, -343],
    [-373, -323],
  ],
  [
    // 🔴 City 2 (example)
    [546, 1065],
    [546, 1095],
    [584, 1095],
    [584, 1142],
    [560, 1142],
    [560, 1207],
    [579, 1207],
    [579, 1276],
    [392, 1276],
    [392, 969],
    [470, 969],
    [470, 1029],
    [516, 1029],
    [516, 1065],
  ],
  // ➕ Add more city polygons here
];

// 🧠 Point-in-Polygon check (ray casting)
function isInsideAnyPolygon(
  x: number,
  z: number,
  polygons: [number, number][][] 
): boolean {
  for (const polygon of polygons) {
    let inside = false;
    const len = polygon.length;
    for (let i = 0, j = len - 1; i < len; j = i++) {
      const xi = polygon[i][0],
        zi = polygon[i][1];
      const xj = polygon[j][0],
        zj = polygon[j][1];

      const intersect =
        zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi;
      if (intersect) inside = !inside;
    }
    if (inside) return true;
  }
  return false;
}

// 📍 Get Overworld dimension
const overworld = world.getDimension("overworld");

// 🔁 Run every 5 ticks
system.runInterval(() => {
  // 🧍 Update players in city zones
  for (const player of world.getAllPlayers()) {
    const pos = player.location;
    if (isInsideAnyPolygon(pos.x, pos.z, areaPolygons)) {
      player.runCommand(`scoreboard players set "${player.name}" Poke_Spawn 0`);
    }
  }

  // 💀 Despawn wild Pokémon only inside city zones
  for (const entity of overworld.getEntities()) {
    if (!entity.typeId.startsWith("pokeworld:wild_")) continue;

    const pos = entity.location;
    if (isInsideAnyPolygon(pos.x, pos.z, areaPolygons)) {
      // Add check to ensure the entity still exists
      if (entity?.isValid) {
        // If entity is valid, despawn it
        entity.remove();
      }
    }
  }
}, 5);
