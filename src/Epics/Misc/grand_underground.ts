// Underground Rewards System (Minecraft Bedrock 1.21.101, Scripting 2.2.0-beta)
// Rewards defined in-script, no reward entity required,
// opens via hitting pokeworld:udg_stone with cooldowns and per-stone locking

import {world,ItemStack,Container,Player,} from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface RewardItem {id: string;weight: number;display: string;texture: string;amount: number;}

interface UndergroundCell {visible: boolean;item: false | RewardItem;}

/* -------------------------------------------------------------------------- */
/* Rewards Config (EDIT THIS)                                                 */
/* -------------------------------------------------------------------------- */

const rewardsConfig: RewardItem[] = [
  { id: "pokeworld:blue_shard", display: "Blue Shard", texture: "textures/items/blue_shard", amount: 1, weight: 40 },
  { id: "pokeworld:dawn_stone", display: "Dawn Stone", texture: "textures/items/dawn_stone", amount: 1, weight: 5 },
  { id: "pokeworld:dusk_stone", display: "Dusk Stone", texture: "textures/items/dusk_stone", amount: 1, weight: 5 },
  { id: "pokeworld:fire_stone", display: "Fire Stone", texture: "textures/items/fire_stone", amount: 1, weight: 5 },
  { id: "pokeworld:green_shard", display: "Green Shard", texture: "textures/items/green_shard", amount: 1, weight: 40 },
  { id: "pokeworld:heart_scale", display: "Heart Scale", texture: "textures/items/heart_scale_fossil", amount: 1, weight: 5 },
  { id: "pokeworld:high_armor", display: "High Armor Fossil", texture: "textures/items/armor_fossil", amount: 1, weight: 0.2 },
  { id: "pokeworld:high_claw", display: "High Claw Fossil", texture: "textures/items/claw_fossil", amount: 1, weight: 0.2 },
  { id: "pokeworld:high_cover", display: "High Cover Fossil", texture: "textures/items/cover_fossil", amount: 1, weight: 0.2 },
  { id: "pokeworld:high_dino", display: "High Dino Fossil", texture: "textures/items/dino_fossil", amount: 1, weight: 0.2 },
  { id: "pokeworld:high_dome", display: "High Dome Fossil", texture: "textures/items/dome_fossil", amount: 1, weight: 0.2 },
  { id: "pokeworld:high_drake", display: "High Drake Fossil", texture: "textures/items/drake_fossil", amount: 1, weight: 0.2 },
  { id: "pokeworld:high_fish", display: "High Fish Fossil", texture: "textures/items/fish_fossil", amount: 1, weight: 0.2 },
  { id: "pokeworld:high_helix", display: "High Helix Fossil", texture: "textures/items/helix_fossil", amount: 1, weight: 0.2 },
  { id: "pokeworld:high_jaw", display: "High Jaw Fossil", texture: "textures/items/jaw_fossil", amount: 1, weight: 0.2 },
  { id: "pokeworld:high_old_amber", display: "High Old Amber Fossil", texture: "textures/items/old_amber", amount: 1, weight: 0.2 },
  { id: "pokeworld:high_plume", display: "High Plume Fossil", texture: "textures/items/plume_fossil", amount: 1, weight: 0.2 },
  { id: "pokeworld:high_root", display: "High Root Fossil", texture: "textures/items/root_fossil", amount: 1, weight: 0.2 },
  { id: "pokeworld:high_sail", display: "High Sail Fossil", texture: "textures/items/sail_fossil", amount: 1, weight: 0.2 },
  { id: "pokeworld:high_skull", display: "High Skull Fossil", texture: "textures/items/skull_fossil", amount: 1, weight: 0.7 },
  { id: "pokeworld:low_armor", display: "Low Armor Fossil", texture: "textures/items/armor_fossil", amount: 1, weight: 0.5 },
  { id: "pokeworld:low_claw", display: "Low Claw Fossil", texture: "textures/items/claw_fossil", amount: 1, weight: 0.5 },
  { id: "pokeworld:low_cover", display: "Low Cover Fossil", texture: "textures/items/cover_fossil", amount: 1, weight: 0.5 },
  { id: "pokeworld:low_dino", display: "Low Dino Fossil", texture: "textures/items/dino_fossil", amount: 1, weight: 0.5 },
  { id: "pokeworld:low_dome", display: "Low Dome Fossil", texture: "textures/items/dome_fossil", amount: 1, weight: 0.5 },
  { id: "pokeworld:low_drake", display: "Low Drake Fossil", texture: "textures/items/drake_fossil", amount: 1, weight: 0.5 },
  { id: "pokeworld:low_fish", display: "Low Fish Fossil", texture: "textures/items/fish_fossil", amount: 1, weight: 0.5 },
  { id: "pokeworld:low_helix", display: "Low Helix Fossil", texture: "textures/items/helix_fossil", amount: 1, weight: 0.5 },
  { id: "pokeworld:low_jaw", display: "Low Jaw Fossil", texture: "textures/items/jaw_fossil", amount: 1, weight: 0.5 },
  { id: "pokeworld:low_old_amber", display: "Low Old Amber Fossil", texture: "textures/items/old_amber", amount: 1, weight: 0.5 },
  { id: "pokeworld:low_plume", display: "Low Plume Fossil", texture: "textures/items/plume_fossil", amount: 1, weight: 0.5 },
  { id: "pokeworld:low_root", display: "Low Root Fossil", texture: "textures/items/root_fossil", amount: 1, weight: 0.5 },
  { id: "pokeworld:low_sail", display: "Low Sail Fossil", texture: "textures/items/sail_fossil", amount: 1, weight: 0.5 },
  { id: "pokeworld:low_skull", display: "Low Skull Fossil", texture: "textures/items/skull_fossil", amount: 1, weight: 0.5 },
  { id: "pokeworld:mid_armor", display: "Mid Armor Fossil", texture: "textures/items/armor_fossil", amount: 1, weight: 0.7 },
  { id: "pokeworld:mid_claw", display: "Mid Claw Fossil", texture: "textures/items/claw_fossil", amount: 1, weight: 0.7 },
  { id: "pokeworld:mid_cover", display: "Mid Cover Fossil", texture: "textures/items/cover_fossil", amount: 1, weight: 0.7 },
  { id: "pokeworld:mid_dino", display: "Mid Dino Fossil", texture: "textures/items/dino_fossil", amount: 1, weight: 0.7 },
  { id: "pokeworld:mid_dome", display: "Mid Dome Fossil", texture: "textures/items/dome_fossil", amount: 1, weight: 0.7 },
  { id: "pokeworld:mid_drake", display: "Mid Drake Fossil", texture: "textures/items/drake_fossil", amount: 1, weight: 0.7 },
  { id: "pokeworld:mid_fish", display: "Mid Fish Fossil", texture: "textures/items/fish_fossil", amount: 1, weight: 0.7 },
  { id: "pokeworld:mid_helix", display: "Mid Helix Fossil", texture: "textures/items/helix_fossil", amount: 1, weight: 0.7 },
  { id: "pokeworld:mid_jaw", display: "Mid Jaw Fossil", texture: "textures/items/jaw_fossil", amount: 1, weight: 0.7 },
  { id: "pokeworld:mid_old_amber", display: "Mid Old Amber Fossil", texture: "textures/items/old_amber", amount: 1, weight: 0.7 },
  { id: "pokeworld:mid_plume", display: "Mid Plume Fossil", texture: "textures/items/plume_fossil", amount: 1, weight: 0.7 },
  { id: "pokeworld:mid_root", display: "Mid Root Fossil", texture: "textures/items/root_fossil", amount: 1, weight: 0.7 },
  { id: "pokeworld:mid_sail", display: "Mid Sail Fossil", texture: "textures/items/sail_fossil", amount: 1, weight: 0.7 },
  { id: "pokeworld:mid_skull", display: "Mid Skull Fossil", texture: "textures/items/skull_fossil", amount: 1, weight: 0.7 },
  { id: "pokeworld:moon_stone", display: "Moon Stone", texture: "textures/items/moon_stone", amount: 1, weight: 5 },
  { id: "pokeworld:red_shard", display: "Red Shard", texture: "textures/items/red_shard", amount: 1, weight: 40 },
  { id: "pokeworld:sun_stone", display: "Sun Stone", texture: "textures/items/sun_stone", amount: 1, weight: 5 },
  { id: "pokeworld:thunder_stone", display: "Thunder Stone", texture: "textures/items/thunder_stone", amount: 1, weight: 5 },
  { id: "pokeworld:water_stone", display: "Water Stone", texture: "textures/items/water_stone", amount: 1, weight: 5 },
  { id: "pokeworld:yellow_shard", display: "Yellow Shard", texture: "textures/items/yellow_shard", amount: 1, weight: 40 },
  { id: "none", display: "Nothing", texture: "textures/blocks/stone", amount: 0, weight: 200 }
];

/* -------------------------------------------------------------------------- */
/* Global State                                                               */
/* -------------------------------------------------------------------------- */

const state = {
  tries: 15,
  rewards: rewardsConfig,
};

// cooldown tracker for udg_stone entities
const stoneCooldowns = new Map<string, { expires: number; inUse: boolean }>();

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface RewardItem {
  id: string;
  display: string;
  texture: string;
  amount: number;
  weight: number;
}

interface UndergroundCell {
  visible: boolean;
  item: RewardItem | false;
  claimed?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Utilities                                                                  */
/* -------------------------------------------------------------------------- */

function pickWeightedReward(rewards: RewardItem[], maxWeightSum: number): RewardItem {
  const random = Math.floor(Math.random() * maxWeightSum);
  let prev = 0;
  for (let i = 0; i < rewards.length; i++) {
    const r = rewards[i];
    const w = r.weight;
    if (random >= prev && random <= w + prev) return r;
    prev += w;
  }
  return rewards[rewards.length - 1];
}

/* -------------------------------------------------------------------------- */
/* Underground Grid Generation & UI Build                                     */
/* -------------------------------------------------------------------------- */

function getUnderground(): UndergroundCell[] {
  const underground: UndergroundCell[] = [];
  const rewards = state.rewards;
  rewards.sort((a, b) => a.weight - b.weight);

  let maxSum = 0;
  rewards.forEach((a) => (maxSum += a.weight));

  for (let i = 0; i < 104; i++) {
    if (Math.floor(Math.random() * 2) !== 0) {
      underground.push({ visible: false, item: false });
    } else {
      const item = pickWeightedReward(rewards, maxSum);
      underground.push({ visible: false, item });
    }
  }
  return underground;
}

function buildUnderground(ui: ActionFormData, underground: UndergroundCell[]): void {
  const STONE = "textures/blocks/stone";
  const GRAVEL = "textures/blocks/gravel";

  underground.forEach((cell) => {
    if (!cell.visible) {
      ui.button(" ", STONE);
      return;
    }

    // Dug & revealed
    if (cell.item === false) {
      // never assigned an item → show stone
      ui.button(" ", STONE);
    } else if (cell.item.id === "none") {
      // “nothing” reward → show gravel
      ui.button("§7Nothing", GRAVEL);
    } else {
      // found an item → keep texture visible
      ui.button(`§f${cell.item.display}`, cell.item.texture);
    }
  });
}

function updateUnderground(underground: UndergroundCell[], pressed: number): UndergroundCell[] {
  if (!underground[pressed]) return underground;
  underground[pressed].visible = true;
  return underground;
}

/* -------------------------------------------------------------------------- */
/* Reward Granting                                                            */
/* -------------------------------------------------------------------------- */

function giveReward(player: Player, underground: UndergroundCell[], selected: number): void {
  const rewardCell = underground[selected];
  if (!rewardCell) return;

  // Already dug
  if (rewardCell.claimed) {
    player.sendMessage("§8>> §7You dug here but found nothing...");
    try {
      player.playSound("random.break", { pitch: 0.8 });
    } catch {}
    return;
  }

  const item = rewardCell.item;

  if (!item || item.id === "none") {
    player.sendMessage("§8>> §7You dug here but found nothing...");
    rewardCell.item = { id: "none", display: "Nothing", texture: "textures/blocks/gravel", amount: 0, weight: 0 };
  } else {
    try {
      player.playSound("random.orb");
    } catch {}
    player.sendMessage(`§8>> §aYou got §2x${item.amount} §f${item.display}§r§a!`);

    const inventory: Container | undefined =
      player.getComponent("minecraft:inventory")?.container ??
      (player.getComponent("inventory") as any)?.container;
    if (inventory && item.amount > 0) {
      const itemAdd = new ItemStack(item.id, item.amount);
      inventory.addItem(itemAdd);
    }
  }

  // Mark as revealed and claimed
  rewardCell.visible = true;
  rewardCell.claimed = true;
}

/* -------------------------------------------------------------------------- */
/* UI Flows                                                                   */
/* -------------------------------------------------------------------------- */

function mineCollapsed(player: Player): void {
  player.sendMessage("§8>> §cThe Mine collapsed!");
  player.runCommand(`scoreboard players add @s mining 1`);
  try {
    player.playSound("random.break", { pitch: 0.5 });
    player.playSound("cauldron.explode", { pitch: 0.5 });
  } catch {}
}

async function openUnderGround(
  player: Player,
  stoneId: string,
  underground?: UndergroundCell[],
  tries = 0
): Promise<void> {
  let grid = underground ?? getUnderground();

  const form = new ActionFormData()
    .title("§5§5§rUnderground")
    .body(`§eYou have §g§l${state.tries - tries} §r§etries left!`);

  buildUnderground(form, grid);
  const result = await form.show(player);

  if (result.canceled) {
    mineCollapsed(player);
    stoneCooldowns.set(stoneId, {
      expires: Date.now() + 30 * 60 * 1000,
      inUse: false,
    });
    return;
  }

  try {
    player.playSound("dig.stone");
  } catch {}

  // Give the reward and update grid
  giveReward(player, grid, result.selection!);
  grid = updateUnderground(grid, result.selection!);

  // Check if last try
  if (tries >= state.tries - 1) {
    mineCollapsed(player);
    stoneCooldowns.set(stoneId, {
      expires: Date.now() + 30 * 60 * 1000,
      inUse: false,
    });
    return;
  }

  // Continue digging
  return openUnderGround(player, stoneId, grid, tries + 1);
}

/* -------------------------------------------------------------------------- */
/* Triggers                                                                   */
/* -------------------------------------------------------------------------- */

world.afterEvents.entityHitEntity.subscribe((data) => {
  if (!(data.damagingEntity instanceof Player)) return;

  if (data.hitEntity.typeId === "pokeworld:mining_tunnel") {
    const player = data.damagingEntity;
    const stoneId = data.hitEntity.id;

    const record = stoneCooldowns.get(stoneId);
    const now = Date.now();

    if (record) {
      if (record.inUse) {
        player.sendMessage("§cThis mineshaft is currently being used by someone else!");
        return;
      }
      if (now < record.expires) {
        const mins = Math.ceil((record.expires - now) / 60000);
        player.sendMessage(`§cThis mineshaft is currently being rebuilt. Try again in ${mins} minute(s).`);
        return;
      }
    }

    stoneCooldowns.set(stoneId, { expires: 0, inUse: true });
    openUnderGround(player, stoneId);
  }
});
