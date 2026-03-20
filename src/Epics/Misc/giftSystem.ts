import { Player, system, world, ItemStack } from "@minecraft/server";
import { openMenu } from "./menu";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { Backpack } from "./backbag";
import { backpackConfig } from "../../Letters/pokemon/backpackConfig";

const GIFT_ITEM_ID = "pokeworld:gift";
const GIFT_RECEIVED_ITEM = new ItemStack("pokeworld:gift_received", 1);
const giftTracker = new Map<string, Record<string, number>>(); // player.name -> { target.name: timestamp }
const dailyGiftCount: Record<string, { count: number; reset: number }> = {}; // player.name -> { count, timestamp }
let friendshipXP: Record<string, Record<string, number>> = {}; // player.name -> { friend.name: XP }
const FRIENDSHIP_LEVELS = [0, 3, 70, 300, 1000]; // Levels: Good, Great, Ultra, Best

// ================= FRIEND REQUEST HELPERS (ADDED) =================

function getFriendRequests(player: Player): string[] {
  const stored = world.getDynamicProperty(`gift.friendRequests.${player.name}`);
  if (!stored) return [];
  try {
    return JSON.parse(stored as string);
  } catch {
    return [];
  }
}

function setFriendRequests(player: Player, list: string[]) {
  world.setDynamicProperty(`gift.friendRequests.${player.name}`, JSON.stringify(list));
}

function getFriendshipDisplay(player: Player, friend: string): string {
  const xp = friendshipXP[player.name]?.[friend] ?? 0;
  const level = FRIENDSHIP_LEVELS.filter((lvl) => xp >= lvl).length - 1;
  const levelName = ["None", "Good", "Great", "Ultra", "Best"][level] ?? "None";
  const next = FRIENDSHIP_LEVELS[level + 1] ?? FRIENDSHIP_LEVELS[level];
  return `${friend} §7[§a${levelName}§7] §8(${xp}/${next} XP)`;
}

// ================= FRIENDSHIP TIER + LORE HELPERS (ADDED) =================

const FRIEND_TIER_NAMES = ["None", "Good", "Great", "Ultra", "Best"] as const;
type FriendTierName = (typeof FRIEND_TIER_NAMES)[number];

function getFriendshipTierIndexFromXP(xp: number): number {
  const lvl = FRIENDSHIP_LEVELS.filter((v) => xp >= v).length - 1;
  return Math.max(0, Math.min(4, lvl));
}

function getFriendshipTierNameFromXP(xp: number): FriendTierName {
  return FRIEND_TIER_NAMES[getFriendshipTierIndexFromXP(xp)] ?? "None";
}

function formatGiftDate(ts: number): string {
  // simple local-ish stamp; you can change formatting if you want
  const d = new Date(ts);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear());
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${mm}/${dd}/${yy} ${hh}:${mi}`;
}

function buildGiftReceivedItem(sender: string, tierName: FriendTierName, xpSnapshot: number): ItemStack {
  const item = new ItemStack("pokeworld:gift_received", 1);

  // Lore is what we’ll parse later to determine tier rewards.
  // Keep it consistent & easy to parse.
  item.setLore([
    "§7§m--------------------",
    `§dFrom: §f${sender}`,
    `§aFriendship: §f${tierName}`,
    `§7XP: §f${xpSnapshot}`,
    `§8Opened: §f${formatGiftDate(Date.now())}`,
    "§7§m--------------------",
  ]);

  return item;
}

function parseGiftLore(item: ItemStack): { sender?: string; tier?: FriendTierName; xp?: number } {
  let lore: string[] = [];
  try {
    lore = item.getLore() ?? [];
  } catch {
    lore = [];
  }

  const clean = (s: string) => s.replace(/§./g, "").trim();

  let sender: string | undefined;
  let tier: FriendTierName | undefined;
  let xp: number | undefined;

  for (const raw of lore) {
    const line = clean(raw);

    // From: NAME
    if (line.toLowerCase().startsWith("from:")) {
      sender = line.split(":").slice(1).join(":").trim() || undefined;
      continue;
    }

    // Friendship: TIER
    if (line.toLowerCase().startsWith("friendship:")) {
      const t = line.split(":").slice(1).join(":").trim();
      if ((FRIEND_TIER_NAMES as readonly string[]).includes(t)) tier = t as FriendTierName;
      continue;
    }

    // XP: NUMBER
    if (line.toLowerCase().startsWith("xp:")) {
      const n = Number(line.split(":").slice(1).join(":").trim());
      if (!Number.isNaN(n)) xp = n;
      continue;
    }
  }

  return { sender, tier, xp };
}

// ================= LOAD XP =================

system.runInterval(() => {
  const stored = world.getDynamicProperty("gift.friendshipXP") as string;
  if (stored) {
    try {
      friendshipXP = JSON.parse(stored);
    } catch {}
  }
}, 1);

// ================= DAILY RESET =================

system.runInterval(() => {
  const now = Date.now();
  for (const player of world.getAllPlayers()) {
    const entry = dailyGiftCount[player.name];
    if (!entry || now >= entry.reset) {
      dailyGiftCount[player.name] = { count: 0, reset: now + 86400000 };
    }
  }
}, 100);

// ================= MENU OPEN =================

system.afterEvents.scriptEventReceive.subscribe((event) => {
  if (event.id === "gift:save_friendship") {
    world.setDynamicProperty("gift.friendshipXP", JSON.stringify(friendshipXP));
    return;
  }

  const player = event.sourceEntity;
  if (!player || !(player instanceof Player)) return;

  switch (event.id) {
    case "gift:open": {
      const form = new ActionFormData();
      form.title("§7§7§r§dGift Menu");
      form.body("§fWhat would you like to do?");
      form.button("§aSend Gift", "textures/items/send_gift.png");
      form.button("§bOpen Gifts", "textures/items/recieve_gift.png");
      form.button("§9Add Friend", "textures/items/add_friend.png");
      form.button("§eView Friendship XP", "textures/items/check_xp.png");
      form.button("§cManage Friends", "textures/items/manage_friends.png");
      form.button("§8Unblock Players", "textures/items/unblock_friend.png");
      form.button("§8Back", "textures/items/left_arrow");

      form.show(player).then((res) => {
        if (res.canceled) {
          openMenu(player);
          return;
        }
        if (res.selection === 0) return openSendGiftMenu(player);
        if (res.selection === 1) return openAllGifts(player);
        if (res.selection === 2) return openFriendMenu(player);
        if (res.selection === 3) return openFriendshipXPMenu(player);
        if (res.selection === 4) return openFriendManager(player);
        if (res.selection === 5) return openUnblockMenu(player);
      });
      break;
    }
  }
});

// ================= SEND GIFT =================

function openSendGiftMenu(player: Player) {
  const friendList = getFriends(player);
  const onlineFriends = world
    .getAllPlayers()
    .filter((p) => p.name !== player.name && friendList.includes(p.name));
  if (onlineFriends.length === 0) return player.sendMessage("§cNo online friends to send a gift to.");

  const inv = player.getComponent("inventory");
  if (!inv || !inv.container) {
    return player.sendMessage("§cYou need a PokéGift item to send a gift.");
  }

  const form = new ModalFormData();
  form.title("§aSend a Gift");
  const names = onlineFriends.map((p) => p.name);
  form.dropdown("Choose a friend to send a gift to:", names);

  form.show(player).then((res: { canceled: boolean; formValues: any[] }) => {
    if (res.canceled) return;

    const target = onlineFriends[res.formValues[0]];
    if (!target) return;

    const senderMap = giftTracker.get(player.name) ?? {};
    if (senderMap[target.name]) {
      const lastSent = senderMap[target.name];
      const now = Date.now();
      if (now - lastSent < 86400000) {
        const hoursLeft = Math.ceil((86400000 - (now - lastSent)) / 3600000);
        return player.sendMessage(`§cYou can send another gift to ${target.name} in ${hoursLeft} hour(s).`);
      }
      const tag = `gift_from:${player.name}`;
      if (!target.getTags().includes(tag)) {
        delete senderMap[target.name];
      } else {
        return player.sendMessage("§cYou've already sent a gift to this friend. Wait until they open it.");
      }
    }

    let slot = -1;
    for (let i = 0; i < inv.container.size; i++) {
      const item = inv.container.getItem(i);
      if (item && item.typeId === GIFT_ITEM_ID) {
        slot = i;
        break;
      }
    }

    if (slot === -1) {
      return player.sendMessage("§cYou need a PokéGift item to send a gift.");
    }

    const stack = inv.container.getItem(slot);

    if (stack && stack.typeId === GIFT_ITEM_ID) {
      if (stack.amount > 1) {
        const newStack = new ItemStack(GIFT_ITEM_ID, stack.amount - 1);
        inv.container.setItem(slot, newStack);
      } else {
        inv.container.setItem(slot, undefined);
      }
    }

    senderMap[target.name] = Date.now();
    giftTracker.set(player.name, senderMap);
    target.addTag(`gift_from:${player.name}`);

    player.sendMessage(`§aGift sent to ${target.name}!`);
    target.sendMessage(`§bYou received a gift from ${player.name}!`);
  });
}

// ================= ADD FRIEND (FIXED – NO AUTO ADD) =================

function openFriendMenu(player: Player) {
  const onlinePlayers = world.getAllPlayers().filter((p) => p.name !== player.name);

  const friends = getFriends(player);
  const incoming = getFriendRequests(player);
  const blocked = player
    .getTags()
    .filter((t) => t === "block_friends" || t.startsWith("block:"))
    .map((t) => t.replace("block:", ""));

  const filteredPlayers = onlinePlayers.filter(
    (p) =>
      !friends.includes(p.name) &&
      !incoming.includes(p.name) &&
      !blocked.includes(p.name) &&
      !p.getTags().includes(`block:${player.name}`)
  );

  if (filteredPlayers.length === 0) return player.sendMessage("§cNo players online to send a friend request to.");

  const form = new ModalFormData();
  form.title("§9Add a Friend");
  form.dropdown(
    "Select a player to send a friend request to:",
    filteredPlayers.map((p) => p.name)
  );

  form.show(player).then((res: { canceled: boolean; formValues: any[] }) => {
    if (res.canceled) return;

    const target = filteredPlayers[res.formValues[0]];
    if (!target) return;

    const targetRequests = getFriendRequests(target);
    if (targetRequests.includes(player.name)) {
      return player.sendMessage("§cFriend request already sent.");
    }

    targetRequests.push(player.name);
    setFriendRequests(target, targetRequests);

    const confirm = new ActionFormData();
    confirm.title("§9Friend Request");
    confirm.body(`§f${player.name} wants to be your friend. Accept?`);
    confirm.button("§aAccept");
    confirm.button("§cDecline");

    confirm.show(target).then((reply: { canceled: boolean; selection: number }) => {
      setFriendRequests(
        target,
        getFriendRequests(target).filter((n) => n !== player.name)
      );

      if (reply.canceled || reply.selection === 1) {
        player.sendMessage(`§c${target.name} declined your friend request.`);
        openMenu(player);
        return;
      }

      const friendList = getFriends(player);
      const targetList = getFriends(target);

      friendList.push(target.name);
      targetList.push(player.name);

      world.setDynamicProperty(`gift.friends.${player.name}`, JSON.stringify(friendList));
      world.setDynamicProperty(`gift.friends.${target.name}`, JSON.stringify(targetList));

      player.sendMessage(`§aYou are now friends with ${target.name}.`);
      target.sendMessage(`§aYou are now friends with ${player.name}.`);
    });
  });
}

// ================= FRIENDSHIP XP MENU =================

function openFriendshipXPMenu(player: Player) {
  const form = new ActionFormData();
  form.title("§eFriendship XP Levels");

  const friendList = getFriends(player);

  if (friendList.length === 0) {
    player.sendMessage("§cYou have no friends yet.");
    return;
  }

  const display = friendList
    .map((friend) => {
      const xp = friendshipXP[player.name]?.[friend] ?? 0;
      const level = FRIENDSHIP_LEVELS.filter((lvl) => xp >= lvl).length - 1;
      const levelName = ["None", "Good", "Great", "Ultra", "Best"][level] ?? "None";
      return `§b${friend}§f - ${xp} XP (§a${levelName} Friend§f)`;
    })
    .join("");

  form.body(display);
  form.button("Close");
  form.show(player).then(() => openMenu(player));
}

// ================= MANAGE FRIENDS (DISPLAY ONLY CHANGE) =================

function openFriendManager(player: Player) {
  const friendList = getFriends(player);
  if (friendList.length === 0) return player.sendMessage("§cYou have no friends to manage.");

  const form = new ModalFormData();
  form.title("§cManage Friends");
  const names = friendList.map((f) => getFriendshipDisplay(player, f));
  form.dropdown("Select a friend to manage:", names);

  form.show(player).then((res: { canceled: boolean; formValues: any[] }) => {
    if (res.canceled) return openMenu(player);

    const targetName = names[res.formValues[0]].split(" ")[0];
    const choice = new ActionFormData();
    choice.title(`§fManage: §c${targetName}`);
    choice.body(`What would you like to do with §e${targetName}§f?\n§7Select an option below.`);
    choice.button("§cRemove Friend");
    choice.button("§4Block");
    choice.button("§2Unblock");
    choice.button("§7Cancel");

    choice.show(player).then((sel: { canceled: boolean; selection: number }) => {
      if (sel.canceled || sel.selection === 3) return openMenu(player);

      if (sel.selection === 0) {
        const confirm = new ActionFormData();
        confirm.title("§cConfirm Removal");
        confirm.body(`Are you sure you want to remove §e${targetName}§c from your friends list?`);
        confirm.button("§aYes, Remove");
        confirm.button("§cCancel");

        confirm.show(player).then((confirmRes: { canceled: boolean; selection: number }) => {
          if (confirmRes.canceled || confirmRes.selection === 1) return openMenu(player);

          const updated = friendList.filter((f) => f !== targetName);
          world.setDynamicProperty(`gift.friends.${player.name}`, JSON.stringify(updated));

          let targetEntity = world.getAllPlayers().find((p) => p.name === targetName);
          if (targetEntity) {
            const tList = getFriends(targetEntity).filter((f) => f !== player.name);
            world.setDynamicProperty(`gift.friends.${targetName}`, JSON.stringify(tList));
          }

          if (friendshipXP[player.name]?.[targetName]) delete friendshipXP[player.name][targetName];
          if (friendshipXP[targetName]?.[player.name]) delete friendshipXP[targetName][player.name];

          const senderMap = giftTracker.get(player.name);
          if (senderMap && senderMap[targetName]) delete senderMap[targetName];
          const reverseMap = giftTracker.get(targetName);
          if (reverseMap && reverseMap[player.name]) delete reverseMap[player.name];

          const tag = `gift_from:${targetName}`;
          if (player.getTags().includes(tag)) player.removeTag(tag);
          const backTag = `gift_from:${player.name}`;
          if (targetEntity?.getTags().includes(backTag)) targetEntity.removeTag(backTag);

          player.sendMessage(`§e${targetName} has been removed from your friends.`);
          openMenu(player);
        });
      } else if (sel.selection === 1) {
        const confirm = new ActionFormData();
        confirm.title("§4Confirm Block");
        confirm.body(`Are you sure you want to block §c${targetName}§4? This will remove them from your friends list.`);
        confirm.button("§aYes, Block");
        confirm.button("§cCancel");

        confirm.show(player).then((confirmRes: { canceled: boolean; selection: number }) => {
          if (confirmRes.canceled || confirmRes.selection === 1) return openMenu(player);

          const current = player.getTags().filter((t) => t.startsWith("block:"));
          if (!current.includes(`block:${targetName}`)) {
            player.addTag(`block:${targetName}`);
            const updated = friendList.filter((f) => f !== targetName);
            world.setDynamicProperty(`gift.friends.${player.name}`, JSON.stringify(updated));
          }

          player.sendMessage(`§4You have blocked ${targetName}.`);
          openMenu(player);
        });
      } else if (sel.selection === 2) {
        const blocked = player.getTags().includes(`block:${targetName}`);
        if (blocked) {
          player.removeTag(`block:${targetName}`);
          player.sendMessage(`§2You have unblocked ${targetName}.`);
        } else {
          player.sendMessage(`§7${targetName} is not currently blocked.`);
        }
        openMenu(player);
      }
    });
  });
}

// ================= OPEN GIFTS =================

function openAllGifts(player: Player) {
  const tags = player.getTags().filter((t) => t.startsWith("gift_from:"));
  const inventory = player.getComponent("inventory");
  if (!inventory?.container) return;

  const countData = dailyGiftCount[player.name] ?? { count: 0, reset: Date.now() + 86400000 };
  if (countData.count >= 20) {
    return player.sendMessage("§cYou can only open 20 gifts per day.");
  }

  let opened = 0;

  for (const tag of tags) {
    if (countData.count >= 20) break;

    const sender = tag.split(":")[1];

    // --- Tier snapshot BEFORE XP increments (this tier decides gift rewards) ---
    const prevXP = friendshipXP[sender]?.[player.name] ?? 0;
    const tierName = getFriendshipTierNameFromXP(prevXP);

    // Create a new gift_received with lore stamped
    const stampedGift = buildGiftReceivedItem(sender, tierName, prevXP);
    inventory.container.addItem(stampedGift);

    player.removeTag(tag);
    countData.count++;
    opened++;

    // --- Now increment XP as you already do ---
    if (!friendshipXP[sender]) friendshipXP[sender] = {};
    friendshipXP[sender][player.name] = prevXP + 1;

    const prevLevel = FRIENDSHIP_LEVELS.filter((lvl) => prevXP >= lvl).length - 1;
    const newLevel = FRIENDSHIP_LEVELS.filter((lvl) => friendshipXP[sender][player.name] >= lvl).length - 1;

    if (newLevel > prevLevel) {
      const levelName = ["Good", "Great", "Ultra", "Best"][newLevel];
      player.sendMessage(`§aYour friendship with ${sender} increased to ${levelName} Friend!`);
      const senderEntity = world.getAllPlayers().find((p) => p.name === sender);
      if (senderEntity) {
        senderEntity.sendMessage(`§aYour friendship with ${player.name} increased to ${levelName} Friend!`);
      }
    }

    player.sendMessage(`§bYou opened a gift from ${sender}! (+1 Friendship XP)`);
  }

  dailyGiftCount[player.name] = countData;
  if (opened === 0) {
    player.sendMessage("§cNo gifts opened. Either limit reached or none were available.");
  }

  world.setDynamicProperty("gift.friendshipXP", JSON.stringify(friendshipXP));
}

// ================= UNBLOCK =================

function openUnblockMenu(player: Player) {
  const blocked = player
    .getTags()
    .filter((t) => t.startsWith("block:"))
    .map((t) => t.replace("block:", ""));
  if (blocked.length === 0) return player.sendMessage("§cYou have not blocked anyone.");

  const form = new ModalFormData();
  form.title("§8Unblock Players");
  form.dropdown("Select a player to unblock:", blocked);

  form.show(player).then((res: { canceled: boolean; formValues: any[] }) => {
    if (res.canceled) return openMenu(player);

    const target = blocked[res.formValues[0]];
    if (!target) return openMenu(player);

    const confirm = new ActionFormData();
    confirm.title("§7Confirm Unblock");
    confirm.body(`Are you sure you want to unblock §c${target}§7?`);
    confirm.button("§aYes, Unblock");
    confirm.button("§cCancel");

    confirm.show(player).then((choice: { canceled: boolean; selection: number }) => {
      if (choice.canceled || choice.selection === 1) return openMenu(player);

      if (player.getTags().includes(`block:${target}`)) {
        player.removeTag(`block:${target}`);
        player.sendMessage(`§aYou have unblocked ${target}.`);
      } else {
        player.sendMessage(`§7${target} is not currently blocked.`);
      }

      openMenu(player);
    });
  });
}

// ================= FRIEND LIST =================

function getFriends(player: Player): string[] {
  const stored = world.getDynamicProperty(`gift.friends.${player.name}`);
  if (!stored) return [];
  try {
    return JSON.parse(stored as string);
  } catch {
    return [];
  }
}

// ========== POKÉWORLD GIFT OPENING (UPDATED FOR FRIENDSHIP TIERS) ==========

world.afterEvents.itemUse.subscribe((ev) => {
  const player = ev.source;
  const item = ev.itemStack;
  if (!(player instanceof Player) || item.typeId !== "pokeworld:gift_received") return;

  // Parse lore FIRST (before we clear it)
  const loreData = parseGiftLore(item);
  const tier: FriendTierName = loreData.tier ?? "None";
  const senderName = loreData.sender ?? "Unknown";

  player.runCommand(`clear @s pokeworld:gift_received 0 1`);

  interface GiftReward {
    item: string;
    amount: number;
    msg: string;
  }

  // --- Base pools ---
  const COMMON: GiftReward[] = [
    { item: "pokeworld:oran_berry", amount: 3, msg: "§aOran Berries" },
    { item: "pokeworld:sitrus_berry", amount: 2, msg: "§aSitrus Berries" },
    { item: "pokeworld:pokeball", amount: 5, msg: "§aPoké Balls" },
    { item: "pokeworld:greatball", amount: 3, msg: "§aGreat Balls" },
    { item: "pokeworld:nanab_berry", amount: 2, msg: "§aNanab Berries" },
  ];

  const UNCOMMON: GiftReward[] = [
    { item: "pokeworld:potion", amount: 3, msg: "§bPotions" },
    { item: "pokeworld:super_potion", amount: 2, msg: "§bSuper Potions" },
    { item: "pokeworld:revive", amount: 1, msg: "§bRevive" },
    { item: "pokeworld:ultraball", amount: 2, msg: "§bUltra Balls" },
  ];

  const RARE: GiftReward[] = [
    { item: "pokeworld:seven_kilo_egg", amount: 1, msg: "§dSeven-Kilo Egg" },
    { item: "pokeworld:lucky_egg", amount: 1, msg: "§6Lucky Egg" },
  ];

  // --- Tier bonuses (you can add/remove rewards here safely) ---
  // These don’t replace your pools, they just add spice at higher friendship tiers.
  const ULTRA_PLUS: GiftReward[] = [
    { item: "pokeworld:max_revive", amount: 1, msg: "§dMax Revive" },
    { item: "pokeworld:full_restore", amount: 1, msg: "§dFull Restore" },
  ];

  const BEST_PLUS: GiftReward[] = [
    { item: "pokeworld:masterball", amount: 1, msg: "§6Master Ball" },
    { item: "pokeworld:rare_candy", amount: 2, msg: "§6Rare Candy" },
  ];

  function pick(pool: GiftReward[]): GiftReward {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  const rewards: GiftReward[] = [];

// ---------- COMMON (always unlocked) ----------
let commonCount = Math.floor(Math.random() * 3) + 2;
for (let i = 0; i < commonCount; i++) rewards.push(pick(COMMON));

// ---------- UNCOMMON (Good+) ----------
if (tier !== "None") {
  let uncommonCount = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < uncommonCount; i++) rewards.push(pick(UNCOMMON));
}

// ---------- RARE (Great+) ----------
if (tier === "Great" || tier === "Ultra" || tier === "Best") {
  if (Math.random() < 0.35) {
    rewards.push(pick(RARE));
  }
}

// ---------- ULTRA BONUS (Ultra+) ----------
if (tier === "Ultra" || tier === "Best") {
  if (Math.random() < 0.25) {
    rewards.push(pick(ULTRA_PLUS));
  }
}

// ---------- BEST BONUS (Best only) ----------
if (tier === "Best") {
  if (Math.random() < 0.35) {
    rewards.push(pick(BEST_PLUS));
  }
}

  const merged: Record<string, { item: string; total: number; msg: string }> = {};

  for (const r of rewards) {
    if (!merged[r.item]) {
      merged[r.item] = { item: r.item, total: r.amount, msg: r.msg };
    } else {
      merged[r.item].total += r.amount;
    }
  }

  // 🎒 Backpack-integrated reward delivery
  const backpack = new Backpack(player);

  for (const key in merged) {
    const r = merged[key];
    let category: string | null = null;

    for (const cat of Object.keys(backpackConfig)) {
      if (backpackConfig[cat].some((i) => i.id === r.item)) {
        category = cat;
        break;
      }
    }

    if (category) {
      backpack.addItem(category, r.item, r.total);
    } else {
      player.runCommand(`give @s ${r.item} ${r.total}`);
    }
  }

  backpack.save();

  // 📩 Messages (kept same style, just adds tier flavor)
  player.sendMessage(`§dGift Opened! §7(From §f${senderName}§7 • Friendship §a${tier}§7)`);
  player.sendMessage("§dHere's what you received:");
  for (const key in merged) {
    const r = merged[key];
    player.sendMessage(` §7- §f${r.total} ${r.msg}`);
  }
});
