import { world, system } from "@minecraft/server";
import Commands from "../../Papers/CommandPaper/CommandPaper";

// ✅ Broadcast messages
const broadcastMessages = [
  "§eUtilize the How to play inside the config menu of the Main Dex menu to learn the server mechanics",
  "§bJoin our Discord to stay updated with events and server changes! discord.gg/pixeladvenbe",
  "§aHave a issue or Bug to report? Join the discord to get support! discord.gg/pixeladvenbe",
  "§dTo use items for Battles click the Dex then click the Bag button.",
  "§6To level up Pokemon using rare candies, summon it first, then click it.",
  "§cJoining the discord connects you with more trainers to trade & battle.",
  "§1Visit the Grand Underground in the mesa biome to collect fossils!"
];

// ✅ Interval in seconds
const INTERVAL_SECONDS = 2 * 60 * 60; // 2 hours

let timerRunning = false;
let secondsPassed = 0;
let lastIndex: number | null = null;

// ✅ Guaranteed-safe random selector
function getRandomMessage() {
  let index = Math.floor(Math.random() * broadcastMessages.length);
  if (lastIndex !== null && index === lastIndex) {
    index = (index + 1) % broadcastMessages.length;
  }
  lastIndex = index;
  return broadcastMessages[index];
}

// ✅ 1-second stable heartbeat
system.runInterval(() => {
  if (!timerRunning) return;

  secondsPassed++;

  if (secondsPassed >= INTERVAL_SECONDS) {
    secondsPassed = 0;

    const msg = getRandomMessage();
    for (const player of world.getAllPlayers()) {
      if (player.hasTag("ignore")) continue;
      player.sendMessage("§l§a[Server]§r " + msg);
    }
  }

}, 20); // ✅ ALWAYS stable: 20 ticks = 1 second

// ✅ Start command
const cmd = Commands.create({
  name: 'broadcast',
  description: 'Start the broadcast rotation.',
  admin: true,
  category: "Misc"
});

cmd.callback((player) => {
  if (timerRunning) {
    player.sendMessage("§c[Broadcast] Already running.");
    return;
  }

  timerRunning = true;
  secondsPassed = 0;

  const first = getRandomMessage();
  for (const p of world.getAllPlayers()) {
    if (p.hasTag("ignore")) continue;
    p.sendMessage("§l§a[Server]§r " + first);
  }

  player.sendMessage("§a[Broadcast] Broadcast system started.");
});

// ⭐ AUTO-START BROADCAST ON SERVER LOAD ⭐
system.runTimeout(() => {
  if (timerRunning) return; // already started by command, ignore
  timerRunning = true;
  secondsPassed = 0;

  const first = getRandomMessage();
  for (const p of world.getAllPlayers()) {
    if (p.hasTag("ignore")) continue;
    p.sendMessage("§l§a[Server]§r " + first);
  }

  for (const player of world.getPlayers({ excludeTags: ["ignore"] })) {
  player.sendMessage("§a[Broadcast] Automatic broadcast system initialized.");
}
}, 40);
