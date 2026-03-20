import { world, Player, system } from "@minecraft/server";
import { Backpack} from "./backbag";
import { backpackConfig } from "../../Letters/pokemon/backpackConfig";

const COOLDOWN_TICKS = 6000;

// PokéStop Loot
const pokestopLoot: [string, number][] = [
  ...Array(200).fill(["pokeworld:pokeball", 6]),
  ...Array(30).fill(["pokeworld:greatball", 2]),
  ...Array(20).fill(["pokeworld:ultraball", 1]),
  ...Array(50).fill(["pokeworld:potion", 1]),
  ...Array(25).fill(["pokeworld:super_potion", 1]),
  ...Array(15).fill(["pokeworld:hyper_potion", 1]),
  ...Array(5).fill(["pokeworld:max_potion", 1]),
  ...Array(20).fill(["pokeworld:revive", 1]),
  ...Array(10).fill(["pokeworld:max_revive", 1]),
  ...Array(10).fill(["pokeworld:sun_stone", 1]),
  ...Array(10).fill(["pokeworld:moon_stone", 1]),
  ...Array(10).fill(["pokeworld:fire_stone", 1]),
  ...Array(10).fill(["pokeworld:water_stone", 1]),
  ...Array(10).fill(["pokeworld:thunder_stone", 1]),
  ...Array(5).fill(["pokeworld:dusk_stone", 1]),
  ...Array(5).fill(["pokeworld:dawn_stone", 1]),
  ...Array(10).fill(["pokeworld:shiny_stone", 1]),
  ...Array(5).fill(["pokeworld:oval_stone", 1]),
  ...Array(5).fill(["pokeworld:reaper_cloth", 1]),
  ...Array(5).fill(["pokeworld:metal_coat", 1]),
  ...Array(10).fill(["pokeworld:everstone", 1]),
  ...Array(20).fill(["pokeworld:pokeball_ticket", 1]),
  ...Array(15).fill(["pokeworld:greatball_ticket", 1]),
  ...Array(5).fill(["pokeworld:kings_rock", 1]),
  ...Array(5).fill(["pokeworld:dragon_scale", 1]),
  ...Array(5).fill(["pokeworld:up_grade", 1]),
  ...Array(5).fill(["pokeworld:dubious_disc", 1]),
  ...Array(5).fill(["pokeworld:electirizer", 1]),
  ...Array(5).fill(["pokeworld:magmarizer", 1]),
  ...Array(5).fill(["pokeworld:protector", 1]),
  ...Array(5).fill(["pokeworld:prism_scale", 1]),
  ...Array(5).fill(["pokeworld:razor_fang", 1]),
  ...Array(5).fill(["pokeworld:razor_claw", 1]),
  ...Array(5).fill(["pokeworld:deep_sea_tooth", 1]),
  ...Array(5).fill(["pokeworld:deep_sea_scale", 1]),
];
const pokestopBonusLoot = pokestopLoot;

function findBackpackCategory(itemId: string): string | null {
  for (const category of Object.keys(backpackConfig)) {
    if (backpackConfig[category].some(i => i.id === itemId)) {
      return category;
    }
  }
  return null;
}

function getBackpackDisplayName(id: string): string {
  for (const category of Object.values(backpackConfig)) {
    const item = category.find(i => i.id === id);
    if (item) return item.displayName;
  }
  return id.replace("pokeworld:", "");
}

function giveLoot(player: Player, loot: [string, number][], rolls: number) {
  const backpack = new Backpack(player);
  const totals = new Map<string, number>();

  for (let i = 0; i < rolls; i++) {
    const [item, count] = loot[Math.floor(Math.random() * loot.length)];
    const category = findBackpackCategory(item);

    if (category) {
      backpack.addItem(category, item, count);
    } else {
      player.runCommand(`give @s ${item} ${count}`);
    }

    totals.set(item, (totals.get(item) ?? 0) + count);
  }

  backpack.save();

  const lines = [...totals.entries()]
    .map(([id, qty]) => `§7• §f${getBackpackDisplayName(id)} §7x§f${qty}`)
    .join("\n");

  player.sendMessage(`§aPokéStop Rewards:\n${lines}`);
}

// Interaction
world.afterEvents.entityHitEntity.subscribe(event => {
  const player = event.damagingEntity;
  const target = event.hitEntity;

  if (!(player instanceof Player)) return;
  if (target.typeId !== "pokeworld:pokestop") return;

  const score = getScore(player, "pokestop");
  if (score > 0) {
    player.sendMessage(`§cPlease wait ${Math.ceil(score / 20)}s before spinning another PokéStop.`);
    return;
  }

  const isBonus = target.hasTag("Bonus");
  giveLoot(player, isBonus ? pokestopBonusLoot : pokestopLoot, isBonus ? 12 : 6);
  giveLoot(player, [["pokeworld:gift", 2]], 1);

  setScore(player, "pokestop", COOLDOWN_TICKS);
  player.addTag("pokestop");
  player.runCommand("scoreboard players add @s stopspin 1");
});

// Cooldown tick
system.runInterval(() => {
  for (const player of world.getAllPlayers()) {
    const score = getScore(player, "pokestop");
    if (score > 0) {
      setScore(player, "pokestop", score - 1);
      if (score - 1 <= 0) {
        player.removeTag("pokestop");
        player.sendMessage("§aYou can now spin a PokéStop again!");
      }
    }
  }
}, 1);

// Score helpers
function getScore(player: Player, objective: string): number {
  try {
    const obj = world.scoreboard.getObjective(objective);
    return obj?.getScore(player.scoreboardIdentity) ?? 0;
  } catch {
    return 0;
  }
}

function setScore(player: Player, objective: string, value: number) {
  try {
    const obj = world.scoreboard.getObjective(objective);
    if (obj) obj.setScore(player.scoreboardIdentity, value);
  } catch {}
}