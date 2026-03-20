// travellingAdvice.ts
import { Player, system, world } from "@minecraft/server";

const COOLDOWN_TICKS = 20 * 3; // 3s per-player cooldown
const lastHitTickByPlayer = new Map<string, number>();

const TIPS: string[] = [
  // Simple, game-like hints (no backend jargon)
  "Open the main menu for Bag, Team, Quests, Warps, and more.",
  "Check the Quest menu to see where to go next.",
  "Legendary quests unlock after reaching a certain point in the Main Quests",
  "Use Warps to travel quickly between towns and quest hubs.",
  "The PC lets you sort by a variety of different options",
  "Heal your team before challenging tougher trainers.",
  "Status conditions matter: Burn chips away each turn.",
  "Paralysis slows you down—plan your moves.",
  "Poison adds up over time—carry Antidotes.",
  "Sleep makes catching easier—time your throws.",
  "Fishing battles can start the moment you reel in—be ready!",
  "Old Rod finds common species; Good and Super Rod reach rarer ones.",
  "Some abilities can ignore barriers—don’t rely on shields alone.",
  "Move accuracy counts—save risky moves for safe moments.",
  "Know your types: Water beats Fire; Electric beats Water.",
  "Some moves boost your stats—read descriptions carefully.",
  "A Quick Ball early can be surprisingly effective.",
  "Red HP and a status condition make catches easier.",
  "Try different times or weather—some Pokémon prefer them.",
  "Evolution can change a Pokémon’s ability—watch for new combos.",
  "Keep a balanced team so you always have a winning matchup.",
  "The Auction House lets you buy and sell Pokémon—check it often.",
  "Renew your auctions before they expire to keep them visible.",
  "Talk to NPCs again later—they might have something new.",
  "Berries can cure status—keep a few ready.",
  "Held items can swing a battle—don’t forget to equip them.",
  "Use Biome and Radar tools to help find what you’re hunting.",
  "Priority moves strike first—great for finishing blows.",
  "Swap your lead to match the wild Pokémon’s type.",
  "Protect can stall a turn while you scout moves.",
  "Weather can change battles—watch the skies.",
  "Train a diverse team so you always have an answer.",
  "If a fight looks bad, switch—don’t let a sweep start.",
  "Berries can heal or cure—equip them before long routes.",
  "X items can turn a tough fight in your favor.",
  "Dusk Balls work well at night—plan your hunts.",
  "Heal up and stock balls before summoning a Legendary.",
  "Some Pokémon prefer certain biomes—explore off-road.",
  "Talk to folks in every town—some give items or clues.",
  "Try a different ball type at night or in caves.",
  "Explore off the main path—secrets like items and spawns hide there."
];

function getRandomTip(): string {
  return TIPS[Math.floor(Math.random() * TIPS.length)];
}

function formatTip(tip: string): string {
  return `§6[Traveler]§r ${tip}`;
}

world.afterEvents.entityHitEntity.subscribe((ev) => {
  const hitter = ev.damagingEntity;
  const target = ev.hitEntity;
  if (!(hitter instanceof Player)) return;
  if (!target || target.typeId !== "pokeworld:travelling_npc") return;

  const now = system.currentTick;
  const last = lastHitTickByPlayer.get(hitter.id) ?? 0;
  if (now - last < COOLDOWN_TICKS) return;
  lastHitTickByPlayer.set(hitter.id, now);

  hitter.sendMessage(formatTip(getRandomTip()));
});

world.afterEvents.playerLeave.subscribe((ev) => {
  lastHitTickByPlayer.delete(ev.playerId);
});
