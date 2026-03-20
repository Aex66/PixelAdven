import { Player, system, world } from "@minecraft/server";
import type { longHand } from "../Pokemon Database/@types/types.d.ts";
import { ActionForm } from "../../Papers/FormPaper.js";
import { addListener } from "../../Tales/main.js";
import { selected } from "../Main/Forms/PC/main.js";
import { deletePokemon, writePokemon } from "../Pokemon Database/main.js";
import { updateSidebar } from "../Pokemon Calculations/updateTeam.js";
import { evolveCheck } from "../Pokemon Calculations/evolving/evolve.js";

// ======================================================
// 🔒 TRADE ESCROW STORAGE (DUAL-INDEXED)
// ======================================================

type TradePoke = { id: number; species: string; data: longHand };

type TradeEscrow = {
  ownerA: string;
  ownerB: string;
  pokeA?: TradePoke;
  pokeB?: TradePoke;
  accepted: Record<string, boolean>;
  startedAt: number;
};

export const instance: Record<string, TradeEscrow> = {};

// ======================================================
// 🔒 BLOCK INTERACTION LOCK (ADDED)
// ======================================================

const tradeBlockLock = new Set<string>();
const TRADE_BLOCK_ID = "pokeworld:trade_machine";

// ======================================================
// 🧩 SELECT PARTY POKÉMON
// ======================================================

async function selectTeamPokemon(
  player: Player
): Promise<[number, string, longHand, number] | null> {
  const team = selected[player.name];
  if (!team) return null;

  const form = new ActionForm();
  form.setTitle("§lSelect a Pokémon");

  // NOTE: We keep a "selection map" aligned to the buttons.
  // We must not compare selection to slots.length directly because buttons include empties + cancel.
  const pickMap: Array<[number, string, longHand, number] | null> = [];

  for (let i = 0; i < 6; i++) {
    const slot = team[i];
    if (!slot) {
      form.addButton(`Slot ${i + 1} - Empty`);
      pickMap.push(null);
    } else {
      const [id, name, data] = slot;
      form.addButton(`Slot ${i + 1} - ${name} (Lvl ${data.level})`);
      pickMap.push([id, name, data, i]);
    }
  }

  form.addButton("§cCancel");

  return new Promise((resolve) => {
    form.send(player, (res) => {
      if (res.canceled || res.selection === undefined) return resolve(null);

      // Cancel button
      if (res.selection === 6) return resolve(null);

      const picked = pickMap[res.selection];
      if (!picked) return resolve(null);

      resolve(picked);
    });
  });
}

// ======================================================
// 🧬 ADD TO PARTY (RETURNS SLOT)
// ======================================================

function addToParty(player: Player, species: string, data: longHand): number {
  if (!selected[player.name]) selected[player.name] = {};

  // Find first empty slot 0..5
  let slot = -1;
  for (let i = 0; i < 6; i++) {
    if (!selected[player.name][i]) {
      slot = i;
      break;
    }
  }
  if (slot === -1) {
    // Party full; still write to DB so it exists in PC storage
    slot = 5; // Sidebar update fallback
  }

  const id = Date.now();
  selected[player.name][slot] = [id, species, data];

  // Persist
  writePokemon(player, species, id, data);
  updateSidebar(player, slot);

  return slot;
}

// ======================================================
// 🧠 TRADE UI
// ======================================================

world.afterEvents.entityHitEntity.subscribe(({ hitEntity, damagingEntity }) => {
  if (hitEntity.typeId !== "pokeworld:trade_machine") return;
  if (!(damagingEntity instanceof Player)) return;
  tradeUI(damagingEntity);
});

// ======================================================
// 🧱 BLOCK TRADE MACHINE INTERACTION (ADDED)
// ======================================================

world.beforeEvents.playerInteractWithBlock.subscribe(eventData => {
  const { player, block } = eventData;

  if (!block || block.typeId !== TRADE_BLOCK_ID) return;

  // prevent vanilla / block interaction
  eventData.cancel = true;

  // prevent infinite reopen loop
  if (tradeBlockLock.has(player.name)) return;
  tradeBlockLock.add(player.name);

  system.run(() => {
    tradeUI(player);

    system.runTimeout(() => {
      tradeBlockLock.delete(player.name);
    }, 5);
  });
});

function tradeUI(player: Player) {
  const form = new ActionForm();
  form.setTitle("§lTrade Pokémon");
  form.addButton("Send Trade Request");
  form.addButton("Accept / View Trade");
  form.addButton("§cCancel Trade");

  form.send(player, (res) => {
    if (res.canceled) return;

    if (res.selection === 0) sendUI(player);
    if (res.selection === 1) acceptUI(player);
    if (res.selection === 2) cancelTrade(player, "Canceled.");
  });
}

// ======================================================
// ✅ HELPERS
// ======================================================

function isInTrade(name: string) {
  const t = instance[name];
  return !!t;
}

function getOtherName(trade: TradeEscrow, name: string) {
  return trade.ownerA === name ? trade.ownerB : trade.ownerA;
}

function cancelTrade(player: Player, reason: string) {
  const trade = instance[player.name];
  if (!trade) {
    player.sendMessage("§cYou are not in a trade.");
    return;
  }

  const otherName = getOtherName(trade, player.name);
  const other = world.getAllPlayers().find((p) => p.name === otherName);

  player.sendMessage(`§cTrade canceled: ${reason}`);
  other?.sendMessage(`§cTrade canceled: ${reason}`);

  // IMPORTANT: We do NOT delete any Pokémon here because we never deleted them on deposit.
  delete instance[trade.ownerA];
  delete instance[trade.ownerB];
}

// ======================================================
// 📤 SEND TRADE (NO DELETE ON DEPOSIT)
// ======================================================

async function sendUI(player: Player) {
  // Prevent multiple trades / overwrites
  if (isInTrade(player.name)) {
    player.sendMessage("§cYou are already in a trade. Cancel it first.");
    return;
  }

  const players = world.getAllPlayers().filter((p) => p.name !== player.name);
  if (!players.length) {
    player.sendMessage("§cNo players online.");
    return;
  }

  const form = new ActionForm();
  form.setTitle("Choose Player");
  players.forEach((p) => form.addButton(p.name));
  form.addButton("§cCancel");

  form.send(player, async (res) => {
    if (res.canceled || res.selection === undefined) return;
    if (res.selection === players.length) return;

    const target = players[res.selection];

    if (isInTrade(target.name)) {
      player.sendMessage(`§c${target.name} is already in a trade.`);
      return;
    }

    const chosen = await selectTeamPokemon(player);
    if (!chosen) return;

    const [id, species, data] = chosen;

    // 🚫 CRITICAL FIX:
    // DO NOT deletePokemon here.
    // We only "stage" a snapshot in escrow, and only delete at finalize.
    const trade: TradeEscrow = {
      ownerA: player.name,
      ownerB: target.name,
      pokeA: { id, species, data: JSON.parse(JSON.stringify(data)) },
      accepted: { [player.name]: true },
      startedAt: Date.now(),
    };

    instance[player.name] = trade;
    instance[target.name] = trade;

    player.sendMessage(`§aStaged ${species} for trade (not deleted).`);
    target.sendMessage(`§e${player.name} wants to trade with you.`);
    target.sendMessage("§7Hit the trade machine → Accept / View Trade.");
  });
}

// ======================================================
// 📥 ACCEPT / DEPOSIT / FINALIZE (NO DELETE ON DEPOSIT)
// ======================================================

async function acceptUI(player: Player) {
  const trade = instance[player.name];
  if (!trade) {
    player.sendMessage("§cNo incoming trade.");
    return;
  }

  // Small status view message
  const otherName = getOtherName(trade, player.name);
  player.sendMessage(
    `§7Trade with §e${otherName}§7: ` +
    `A=${trade.pokeA ? "✅" : "❌"} ` +
    `B=${trade.pokeB ? "✅" : "❌"} ` +
    `YouAccepted=${trade.accepted[player.name] ? "✅" : "❌"}`
  );

  // If player is ownerB and hasn't staged yet, stage now
  if (!trade.pokeB && trade.ownerB === player.name) {
    const chosen = await selectTeamPokemon(player);
    if (!chosen) return;

    const [id, species, data] = chosen;

    // 🚫 CRITICAL FIX:
    // DO NOT deletePokemon here.
    trade.pokeB = { id, species, data: JSON.parse(JSON.stringify(data)) };
    trade.accepted[player.name] = true;

    const ownerA = world.getAllPlayers().find((p) => p.name === trade.ownerA);
    ownerA?.sendMessage(`§a${player.name} staged their Pokémon (not deleted).`);
  } else {
    // If already staged or ownerA viewing, just accept
    trade.accepted[player.name] = true;
  }

  // If both accepted and both pokes present -> finalize
  if (trade.accepted[trade.ownerA] && trade.accepted[trade.ownerB]) {
    finalizeTrade(trade);
  } else {
    player.sendMessage("§eWaiting for other player to accept...");
  }
}

// ======================================================
// 🔄 FINALIZE TRADE (DELETE ONLY HERE)
// ======================================================

function finalizeTrade(trade: TradeEscrow) {
  const pA = world.getAllPlayers().find((p) => p.name === trade.ownerA);
  const pB = world.getAllPlayers().find((p) => p.name === trade.ownerB);
  if (!pA || !pB || !trade.pokeA || !trade.pokeB) return;

  // ✅ NOW it is safe to delete from each owner,
  // because we are immediately writing the received Pokémon.
  // If this fails mid-way, that's still bad, but this is the only place deletion happens now.
  // (And both players are online here, which is your best chance for atomic behavior.)

  try {
    deletePokemon(pA, trade.pokeA.species, trade.pokeA.id);
  } catch (e) {
    pA.sendMessage("§cTrade failed: could not remove your Pokémon.");
    pB.sendMessage("§cTrade failed.");
    return;
  }

  try {
    deletePokemon(pB, trade.pokeB.species, trade.pokeB.id);
  } catch (e) {
    // Attempt to restore A if B deletion fails (best-effort)
    try {
      writePokemon(pA, trade.pokeA.species, trade.pokeA.id, trade.pokeA.data);
    } catch { }
    pA.sendMessage("§cTrade failed: other Pokémon could not be removed.");
    pB.sendMessage("§cTrade failed.");
    return;
  }

  trade.pokeB.data.Traded = true;
  trade.pokeA.data.Traded = true;

  const slotA = addToParty(pA, trade.pokeB.species, trade.pokeB.data);
  const slotB = addToParty(pB, trade.pokeA.species, trade.pokeA.data);

  evolveCheck(pA, [trade.pokeB.id, trade.pokeB.species, trade.pokeB.data], slotA);
  evolveCheck(pB, [trade.pokeA.id, trade.pokeA.species, trade.pokeA.data], slotB);

  pA.sendMessage("§aTrade completed!");
  pB.sendMessage("§aTrade completed!");

  delete instance[trade.ownerA];
  delete instance[trade.ownerB];
}

// ======================================================
// ❌ CLEANUP ON DISCONNECT (SAFE: NO DELETES)
// ======================================================

addListener("playerDisconnect", (name) => {
  const trade = instance[name];
  if (!trade) return;

  const otherName = trade.ownerA === name ? trade.ownerB : trade.ownerA;
  const other = world.getAllPlayers().find((p) => p.name === otherName);

  other?.sendMessage(`§cTrade canceled because ${name} left.`);

  // ✅ SAFE: no Pokémon were deleted on deposit, so we only clear the trade session
  delete instance[trade.ownerA];
  delete instance[trade.ownerB];
});

// ======================================================
// 🧹 OPTIONAL: AUTO-EXPIRE STALE TRADES (PREVENTS "STUCK" TRADES)
// ======================================================

const TRADE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

system.runInterval(() => {
  const now = Date.now();

  for (const key of Object.keys(instance)) {
    const t = instance[key];
    // instance is dual-indexed, so only process once per trade (ownerA key)
    if (!t || t.ownerA !== key) continue;

    if (now - t.startedAt > TRADE_TIMEOUT_MS) {
      const a = world.getAllPlayers().find((p) => p.name === t.ownerA);
      const b = world.getAllPlayers().find((p) => p.name === t.ownerB);

      a?.sendMessage("§cTrade expired (timed out).");
      b?.sendMessage("§cTrade expired (timed out).");

      delete instance[t.ownerA];
      delete instance[t.ownerB];
    }
  }
}, 100);
