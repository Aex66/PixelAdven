import { Player, system, world } from "@minecraft/server";
import { ModalFormData, ActionFormData } from "@minecraft/server-ui";
import { Backpack } from "../Misc/backbag";
import { backpackConfig } from "../../Letters/pokemon/backpackConfig";

/* =========================
   ITEM POOLS
   ========================= */

const BALLS: string[] = [
  "pokeworld:beastball", "pokeworld:cherishball", "pokeworld:diveball", "pokeworld:dreamball",
  "pokeworld:duskball", "pokeworld:fastball", "pokeworld:friendball", "pokeworld:greatball",
  "pokeworld:healball", "pokeworld:heavyball", "pokeworld:levelball", "pokeworld:loveball",
  "pokeworld:lureball", "pokeworld:luxuryball", "pokeworld:moonball", "pokeworld:netball",
  "pokeworld:pokeball", "pokeworld:premierball", "pokeworld:quickball", "pokeworld:repeatball",
  "pokeworld:safariball", "pokeworld:sportball", "pokeworld:timerball", "pokeworld:ultraball",
];

const EV_BERRIES: string[] = [
  "pokeworld:pomeg_berry", "pokeworld:kelpsy_berry", "pokeworld:qualot_berry",
  "pokeworld:hondew_berry", "pokeworld:grepa_berry", "pokeworld:tamato_berry",
];

const BERRIES: string[] = [
  "pokeworld:aspear_berry", "pokeworld:cheri_berry", "pokeworld:chesto_berry", "pokeworld:leppa_berry",
  "pokeworld:lum_berry", "pokeworld:oran_berry", "pokeworld:pecha_berry", "pokeworld:persim_berry",
  "pokeworld:rawst_berry", "pokeworld:sitrus_berry", "pokeworld:figy_berry", "pokeworld:wiki_berry",
  "pokeworld:mago_berry", "pokeworld:aguav_berry", "pokeworld:iapapa_berry", "pokeworld:occa_berry",
  "pokeworld:passho_berry", "pokeworld:wacan_berry", "pokeworld:rindo_berry", "pokeworld:yache_berry",
  "pokeworld:chople_berry", "pokeworld:kebia_berry", "pokeworld:shuca_berry", "pokeworld:coba_berry",
  "pokeworld:payapa_berry", "pokeworld:tanga_berry", "pokeworld:charti_berry", "pokeworld:kasib_berry",
  "pokeworld:haban_berry", "pokeworld:colbur_berry", "pokeworld:babiri_berry", "pokeworld:chilan_berry",
  "pokeworld:liechi_berry", "pokeworld:ganlon_berry", "pokeworld:salac_berry", "pokeworld:roseli_berry",
  "pokeworld:petaya_berry", "pokeworld:apicot_berry", "pokeworld:lansat_berry", "pokeworld:maranga_berry",
  "pokeworld:starf_berry", "pokeworld:enigma_berry", "pokeworld:micle_berry", "pokeworld:kee_berry",
  "pokeworld:custap_berry", "pokeworld:jaboca_berry", "pokeworld:rowap_berry",

];

const HEALING: string[] = [
  "pokeworld:antidote", "pokeworld:burn_heal", "pokeworld:energy_powder", "pokeworld:full_heal",
  "pokeworld:full_restore", "pokeworld:heal_powder", "pokeworld:hyper_potion", "pokeworld:ice_heal",
  "pokeworld:max_potion", "pokeworld:max_revive", "pokeworld:paralyze_heal", "pokeworld:potion",
  "pokeworld:revive", "pokeworld:super_potion",
];

const EVO_STONES: string[] = [
  "pokeworld:dawn_stone", "pokeworld:dusk_stone", "pokeworld:fire_stone", "pokeworld:ice_stone",
  "pokeworld:leaf_stone", "pokeworld:moon_stone", "pokeworld:oval_stone", "pokeworld:sun_stone",
  "pokeworld:thunder_stone", "pokeworld:water_stone",
];

const MEGA_STONES: string[] = [
  "pokeworld:aerodactylite", "pokeworld:alakazite", "pokeworld:beedrillite", "pokeworld:blastoisinite",
  "pokeworld:charizardite_x", "pokeworld:charizardite_y", "pokeworld:gengarite", "pokeworld:gyaradosite",
  "pokeworld:kangaskhanite", "pokeworld:mewtwonite_x", "pokeworld:mewtwonite_y", "pokeworld:pidgeotite",
  "pokeworld:pinsirite", "pokeworld:slowbronite", "pokeworld:venusaurite", "pokeworld:scizorite",
];

const SHARDS: string[] = [
  "pokeworld:blue_shard", "pokeworld:green_shard", "pokeworld:red_shard", "pokeworld:yellow_shard",
];

const EGGS: string[] = [
  "pokeworld:two_kilo_egg", "pokeworld:five_kilo_egg", "pokeworld:seven_kilo_egg", "pokeworld:ten_kilo_egg",
];

const X_ITEMS: string[] = [
  "pokeworld:x_accuracy", "pokeworld:x_attack", "pokeworld:x_defense",
  "pokeworld:x_spatk", "pokeworld:x_spdef", "pokeworld:x_speed",
];

const TRADE_MATS: string[] = ["pokeworld:heart_scale"];
const RARE_CANDY: string[] = ["pokeworld:rare_candy"];
const ABILITY: string[] = ["pokeworld:ability_capsule"];

const MISC: string[] = [
  "pokeworld:awakening", "pokeworld:dire_hit", "pokeworld:energy_root", "pokeworld:ether",
  "pokeworld:fresh_water", "pokeworld:guard_spec", "pokeworld:lemonade", "pokeworld:max_elixir",
  "pokeworld:max_ether", "pokeworld:moomoo_milk", "pokeworld:rage_candy_bar", "pokeworld:rare_bone",
  "pokeworld:sacred_ash", "pokeworld:shiny_charm",
];

/* =========================
   WEIGHTED LOOT ENGINE
   ========================= */

type Category =
  | "balls" | "berries" | "healing" | "evo" | "mega" | "shards"
  | "eggs" | "xitems" | "trademats" | "rarecandy" | "ability" | "misc";

const CATEGORY_ITEMS: Record<Category, string[]> = {
  balls: BALLS, berries: BERRIES, healing: HEALING,
  evo: EVO_STONES, mega: MEGA_STONES, shards: SHARDS, eggs: EGGS,
  xitems: X_ITEMS, trademats: TRADE_MATS, rarecandy: RARE_CANDY,
  ability: ABILITY, misc: MISC,
};

interface TierWeights {
  weights: Partial<Record<Category, number>>;
  rollsMin: number;
  rollsMax: number;
  stack: Partial<Record<Category, [number, number]>>;
}

const EV_BERRY_CHANCE: Record<keyof typeof TIERS, number> = {
  pokeball: 0.05,   // 5% per ticket
  greatball: 0.15,  // 15% per ticket
  ultraball: 0.20,  // 20%
  masterball: 0.25, // 25%
  legendary: 0.30,  // 35%
};

const CRATE_DISPLAY_NAMES: Record<string, string> = {
  "pokeworld:pokeball_crate": "§aPokéball Crate",
  "pokeworld:greatball_crate": "§bGreatball Crate",
  "pokeworld:ultraball_crate": "§6Ultraball Crate",
  "pokeworld:masterball_crate": "§dMasterball Crate",
  "pokeworld:legendary_crate": "§cLegendary Crate",
};

type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

function getItemRarity(id: string): Rarity {

  if (MEGA_STONES.includes(id)) return "legendary";
  if (ABILITY.includes(id)) return "epic";
  if (RARE_CANDY.includes(id)) return "rare";
  if (TRADE_MATS.includes(id)) return "rare";
  if (EVO_STONES.includes(id)) return "rare";
  if (EGGS.includes(id)) return "uncommon";
  if (SHARDS.includes(id)) return "uncommon";

  return "common";
}

const TIERS: Record<"pokeball" | "greatball" | "ultraball" | "masterball" | "legendary", TierWeights> = {
  pokeball: {
    weights: {
      balls: 6,
      berries: 6,
      healing: 5,
      shards: 3,
      misc: 3,
      evo: 1,
      xitems: 1,
      rarecandy: 1,
      eggs: 1,
      mega: 0,
      ability: 0,
      trademats: 1,
    },
    rollsMin: 1, rollsMax: 2,
    stack: {
      balls: [1, 3],
      berries: [2, 6],
      healing: [1, 3],
      shards: [1, 3],
      misc: [1, 2],
      evo: [1, 1],
      xitems: [1, 1],
      rarecandy: [1, 1],
      eggs: [1, 1],
      trademats: [1, 2],
    }
  },
  greatball: {
    weights: {
      balls: 7,
      berries: 5,
      healing: 6,
      shards: 3,
      misc: 3,
      evo: 2,
      xitems: 2,
      rarecandy: 2,
      eggs: 2,
      ability: 0,
      trademats: 2,
    },
    rollsMin: 2, rollsMax: 3,
    stack: {
      balls: [1, 4],
      berries: [2, 6],
      healing: [1, 4],
      shards: [1, 4],
      misc: [1, 3],
      evo: [1, 1],
      xitems: [1, 2],
      rarecandy: [1, 2],
      eggs: [1, 1],
      trademats: [1, 2],
    }
  },
  ultraball: {
    weights: {
      balls: 7,
      berries: 3,
      healing: 6,
      shards: 3,
      misc: 3,
      evo: 3,
      xitems: 3,
      rarecandy: 3,
      eggs: 2,
      ability: 1,
      trademats: 2,
    },
    rollsMin: 3, rollsMax: 4,
    stack: {
      balls: [2, 5],
      berries: [2, 5],
      healing: [1, 4],
      shards: [2, 5],
      misc: [1, 3],
      evo: [1, 1],
      xitems: [1, 2],
      rarecandy: [1, 3],
      eggs: [1, 1],
      ability: [1, 1],
      trademats: [1, 3],
    }
  },
  masterball: {
    weights: {
      balls: 6,
      berries: 2,
      healing: 5,
      shards: 3,
      misc: 3,
      evo: 4,
      xitems: 3,
      rarecandy: 4,
      eggs: 3,
      mega: 3,
      ability: 2,
      trademats: 3,
    },
    rollsMin: 4, rollsMax: 5,
    stack: {
      balls: [2, 6],
      berries: [2, 4],
      healing: [2, 5],
      shards: [3, 6],
      misc: [1, 3],
      evo: [1, 1],
      xitems: [1, 3],
      rarecandy: [2, 5],
      eggs: [1, 1],
      mega: [1, 1],
      ability: [1, 1],
      trademats: [1, 3],
    }
  },
  legendary: {
    weights: {
      balls: 7,
      berries: 1,
      healing: 4,
      shards: 4,
      misc: 2,
      evo: 5,
      xitems: 4,
      rarecandy: 6,
      eggs: 4,
      mega: 6,
      ability: 4,
      trademats: 4,
    },
    rollsMin: 5, rollsMax: 6,
    stack: {
      balls: [3, 6],
      berries: [2, 4],
      healing: [2, 5],
      shards: [4, 8],
      misc: [1, 3],
      evo: [1, 2],
      xitems: [1, 3],
      rarecandy: [3, 7],
      eggs: [1, 1],
      mega: [1, 1],
      ability: [1, 1],
      trademats: [1, 4],
    }
  },
};

const EGG_DISPLAY_NAMES: Record<string, string> = {
  "pokeworld:two_kilo_egg": "2km Egg",
  "pokeworld:five_kilo_egg": "5km Egg",
  "pokeworld:seven_kilo_egg": "7km Egg",
  "pokeworld:ten_kilo_egg": "10km Egg",
};

function getBackpackDisplayName(id: string): string {

  // Egg overrides
  if (EGG_DISPLAY_NAMES[id]) {
    return EGG_DISPLAY_NAMES[id];
  }

  // Backpack config lookup
  for (const category of Object.values(backpackConfig)) {
    const item = category.find(i => i.id === id);
    if (item) return item.displayName;
  }

  // Clean fallback formatting
  const raw = id.replace("pokeworld:", "");

  return raw
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function openCratesBatch(
  player: Player,
  tierKey: keyof typeof TIERS,
  ticketsUsed: number
) {
  const totals = new Map<string, number>();
  const cfg = TIERS[tierKey];

  for (let i = 0; i < ticketsUsed; i++) {
    const rolls = randInt(cfg.rollsMin, cfg.rollsMax);

    // -------------------------
    // Normal weighted rolls
    // -------------------------
    for (let r = 0; r < rolls; r++) {
      const cat = weightedPickCategory(cfg.weights);
      const id = pickItemFromCategory(cat);
      const qty = pickStackFor(cat, cfg);

      giveToBackpack(player, id, qty);
      totals.set(id, (totals.get(id) ?? 0) + qty);
    }

    // -------------------------
    // 🎯 EV Berry chance (ONCE per ticket)
    // -------------------------
    const evChance = EV_BERRY_CHANCE[tierKey];
    if (evChance > 0 && Math.random() < evChance) {
      const berry = EV_BERRIES[randInt(0, EV_BERRIES.length - 1)];

      const qty =
        tierKey === "legendary" ? randInt(1, 3) :
          tierKey === "masterball" ? randInt(1, 2) :
            1;

      giveToBackpack(player, berry, qty);
      totals.set(berry, (totals.get(berry) ?? 0) + qty);
    }
  }

  // -------------------------
  // Output summary
  // -------------------------
  const entries = [...totals.entries()]
    .sort(([a], [b]) =>
      getBackpackDisplayName(a).localeCompare(getBackpackDisplayName(b))
    )
    .map(([id, qty]) => `${getBackpackDisplayName(id)} ×${qty}`);

  const rows: string[] = [];
  for (let i = 0; i < entries.length; i += 4) {
    rows.push(entries.slice(i, i + 4).join(" §7|§r "));
  }
  showCrateRewardsUI(player, tierKey, ticketsUsed, totals);
}

function showCrateRewardsUI(
  player: Player,
  tierKey: keyof typeof TIERS,
  ticketsUsed: number,
  totals: Map<string, number>
) {

  const groups = {
    common: [] as string[],
    uncommon: [] as string[],
    rare: [] as string[],
    epic: [] as string[],
    legendary: [] as string[],
  };

  for (const [id, qty] of totals.entries()) {

    const rarity = getItemRarity(id);
    const name = getBackpackDisplayName(id);

    groups[rarity].push(`• ${name} ×${qty}`);
  }

  const section = (title: string, items: string[]) => {
    if (!items.length) return "";
    return `\n§l${title}\n${items.join("\n")}`;
  };

  const crateName =
    tierKey.charAt(0).toUpperCase() + tierKey.slice(1);

  const body =
    `§7Used: §f${ticketsUsed} Ticket${ticketsUsed > 1 ? "s" : ""}\n` +
    section("§aCOMMON", groups.common) +
    section("§bUNCOMMON", groups.uncommon) +
    section("§5RARE", groups.rare) +
    section("§dEPIC", groups.epic) +
    section("§cLEGENDARY", groups.legendary);

  const form = new ActionFormData()
    .title(`§d${crateName} Crate Rewards`)
    .body(body)
    .button("§aClose");

  form.show(player);
}


function findBackpackCategory(itemId: string): string | null {
  for (const category of Object.keys(backpackConfig)) {
    if (backpackConfig[category].some(i => i.id === itemId)) {
      return category;
    }
  }
  return null;
}

function giveToBackpack(player: Player, id: string, qty: number) {
  const category = findBackpackCategory(id);

  // 🎒 Preferred path: Backpack
  if (category) {
    const backpack = new Backpack(player);
    backpack.addItem(category, id, qty);
    backpack.save();
    return;
  }

  // 🧯 Fallback path: normal give (unregistered items)
  try {
    player.runCommand(`give @s ${id} ${qty}`);
  } catch {
    player.runCommand(`give "${player.name}" ${id} ${qty}`);
  }
}

// Helper functions
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function weightedPickCategory(weights: Partial<Record<Category, number>>): Category {
  const entries = Object.entries(weights).filter(([, w]) => (w ?? 0) > 0) as [Category, number][];
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let roll = Math.random() * total;
  for (const [cat, w] of entries) {
    if (roll < w) return cat;
    roll -= w;
  }
  return entries[entries.length - 1][0];
}

function pickItemFromCategory(cat: Category): string {
  const pool = CATEGORY_ITEMS[cat];
  return pool[randInt(0, pool.length - 1)];
}

function pickStackFor(cat: Category, tierCfg: TierWeights): number {
  const range = tierCfg.stack[cat];
  if (!range) return 1;
  return randInt(range[0], range[1]);
}

/* =========================
   CRATE HANDLING
   ========================= */

const CRATE_TICKETS: Record<string, string> = {
  "pokeworld:pokeball_crate": "pokeworld:pokeball_ticket",
  "pokeworld:greatball_crate": "pokeworld:greatball_ticket",
  "pokeworld:ultraball_crate": "pokeworld:ultraball_ticket",
  "pokeworld:masterball_crate": "pokeworld:masterball_ticket",
  "pokeworld:legendary_crate": "pokeworld:legendary_ticket",
};

const CRATE_TIERS: Record<string, keyof typeof TIERS> = {
  "pokeworld:pokeball_crate": "pokeball",
  "pokeworld:greatball_crate": "greatball",
  "pokeworld:ultraball_crate": "ultraball",
  "pokeworld:masterball_crate": "masterball",
  "pokeworld:legendary_crate": "legendary",
};

const crateLocks = new Set<string>();
const lockTimeouts = new Map<string, number>();

// Failsafe for crate lockouts
system.runInterval(() => {
  const now = Date.now();
  for (const [key, expiry] of lockTimeouts.entries()) {
    if (now >= expiry) {
      crateLocks.delete(key);
      lockTimeouts.delete(key);
    }
  }
}, 20);

world.afterEvents.entityHitEntity.subscribe(ev => {
  const player = ev.damagingEntity;
  const crate = ev.hitEntity;
  if (!(player instanceof Player) || !crate) return;

  const crateId = crate.typeId;
  if (!(crateId in CRATE_TICKETS)) return;

  const lockKey = crate.id;

  if (crateLocks.has(lockKey)) {
    player.sendMessage("§cThis crate is currently being used by another player.");
    return;
  }

  const ticketId = CRATE_TICKETS[crateId];
  const tierKey = CRATE_TIERS[crateId];

  const inv = player.getComponent("minecraft:inventory")!.container;
  let count = 0;
  for (let i = 0; i < inv.size; i++) { const item = inv.getItem(i); if (item?.typeId === ticketId) count += item.amount; }
  if (count <= 0) { player.sendMessage("§cYou don't have any tickets for this crate!"); return; }

  crateLocks.add(lockKey);
  lockTimeouts.set(lockKey, Date.now() + 10000);

  const form = new ModalFormData()
    .title("§bCrate Opening")
    .slider(`How many §e${ticketId.replace("pokeworld:", "")}§r tickets do you want to use?`, 1, count, {
      valueStep: 1,
      defaultValue: 1
    });
  form.show(player).then(res => {
    if (res.canceled) { crateLocks.delete(lockKey); lockTimeouts.delete(lockKey); return; }
    const numTickets = res.formValues?.[0] as number;
    if (!numTickets || numTickets <= 0 || numTickets > count) { player.sendMessage("§cInvalid ticket amount."); crateLocks.delete(lockKey); lockTimeouts.delete(lockKey); return; }

    const confirmForm = new ModalFormData()
      .title("§aConfirm Crate Use")
      .toggle(`Use §e${numTickets} §r${ticketId.replace("pokeworld:", "")}?`, { defaultValue: false });
    confirmForm.show(player).then(confirmRes => {
      if (confirmRes.canceled || !(confirmRes.formValues?.[0] as boolean)) { crateLocks.delete(lockKey); lockTimeouts.delete(lockKey); return; }

      let toRemove = numTickets;
      for (let i = 0; i < inv.size; i++) {
        const item = inv.getItem(i);
        if (item?.typeId === ticketId) {
          const take = Math.min(toRemove, item.amount);
          const newAmount = item.amount - take;
          toRemove -= take;

          if (newAmount > 0) {
            item.amount = newAmount;
            inv.setItem(i, item);
          } else {
            inv.setItem(i, undefined);
          }

          if (toRemove <= 0) break;
        }
      }

      const crateName = CRATE_DISPLAY_NAMES[crateId] ?? crateId;

      player.sendMessage(
        `§a[Crate] Opening §f${numTickets} §7ticket${numTickets > 1 ? "s" : ""} §aon ${crateName}`
      );

      world.getDimension("overworld").runCommand(
        `playanimation @e[type=${crateId},c=1,x=${crate.location.x},y=${crate.location.y},z=${crate.location.z}] animation.ball_crate.open_v2`
      );

      system.runTimeout(() => {
        if (!player.isValid) { crateLocks.delete(lockKey); lockTimeouts.delete(lockKey); return; }
        openCratesBatch(player, tierKey, numTickets);

        world.getDimension("overworld").runCommand(
          `playanimation @e[type=${crateId},c=1,x=${crate.location.x},y=${crate.location.y},z=${crate.location.z}] animation.ball_crate.closed`
        );

        crateLocks.delete(lockKey);
        lockTimeouts.delete(lockKey);
      }, 20 * 6);
    });
  });
});
