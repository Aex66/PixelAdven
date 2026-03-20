import { Player, system, world, Entity, ItemStack } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import pokemonList from "../../Letters/pokemon/list";
import { writePokemon } from "../Pokemon Database/main";
import { selected } from "../Main/Forms/PC/main";
import { calculatePokemon, checkSidebarFree, PokemonName } from "../Pokemon Calculations/calculations";
import { longHand } from "../Pokemon Database/@types/types";
import { ballTags } from "../Pokemon Calculations/catch";
import { findNextFreePCSlotForPlayer } from "../Pokemon Database/PcControls";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getFossilDisplayName(raw: string) {
  return raw
    .split("_")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getIVPercent(p: longHand): number {
  const ivs = [
    p.IV_health,
    p.IV_attack,
    p.IV_defense,
    p.IV_special_attack,
    p.IV_special_defense,
    p.IV_speed
  ];

  const total = ivs.reduce((a, b) => a + b, 0);
  return Math.round((total / 186) * 100); // 6 stats * 31 max = 186
}

/* -------------------------------------------------------------------------- */
/* BLOCK SUPPORT HELPERS (ADDED)                                              */
/* -------------------------------------------------------------------------- */

const FOSSIL_BLOCK_ID = "pokeworld:fossil_machine";
const PLAYER_BLOCK_DP_KEY = "fossilBlocks";

function getBlockKeyFromBlock(block: any) {
  const l = block.location;
  return `${block.dimension.id}:${l.x},${l.y},${l.z}`;
}

function parseBlockKey(key: string): { dimension: string; x: number; y: number; z: number } | null {
  // format: "minecraft:overworld:123,64,-220" OR "overworld:123,64,-220" depending on API id
  const firstColon = key.indexOf(":");
  if (firstColon === -1) return null;

  const dimension = key.slice(0, firstColon);
  const coords = key.slice(firstColon + 1);
  const parts = coords.split(",");
  if (parts.length !== 3) return null;

  const x = Number(parts[0]);
  const y = Number(parts[1]);
  const z = Number(parts[2]);
  if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(z)) return null;

  return { dimension, x, y, z };
}

function getPlayerBlockSlots(player: Player): Record<string, FossilSlot> {
  const raw = player.getDynamicProperty(PLAYER_BLOCK_DP_KEY);
  return raw ? JSON.parse(raw as string) : {};
}

function savePlayerBlockSlots(player: Player, slots: Record<string, FossilSlot>) {
  player.setDynamicProperty(PLAYER_BLOCK_DP_KEY, JSON.stringify(slots));
}

/* -------------------------------------------------------------------------- */

interface FossilSlot {
  owner: string | null;
  fossilType: string;
  grade: "low" | "mid" | "high";
  pokeName: PokemonName;
  rID: number;
  pokemonData: longHand;
  startTick: number;
  completeTick: number;
  readyTick?: number;
  status: "restoring" | "ready" | "failed";
}

const GRADES = {
  low: { success: 0.5, time: 6000 },
  mid: { success: 0.75, time: 9000 },
  high: { success: 0.95, time: 12000 }
};

const ABANDON_TIME = 20 * 60 * 30;

const fossilMap: Record<string, PokemonName> = {
  old_amber: "Aerodactyl",
  helix: "Omanyte",
  dome: "Kabuto",
  root: "Lileep",
  claw: "Anorith",
  skull: "Cranidos",
  armor: "Shieldon",
  plume: "Archen",
  cover: "Tirtouga",
  jaw: "Tyrunt",
  sail: "Amaura",
  drake: "Dracovish",
  fish: "Dracozolt",
  dino: "Dracozolt"
};

const FOSSIL_IDS = Object.keys(fossilMap).flatMap(fossil =>
  ["low", "mid", "high"].map(grade => `pokeworld:${grade}_${fossil}`)
);

/* -------------------------------------------------------------------------- */

world.afterEvents.entityLoad.subscribe(ev => {
  const machine = ev.entity;
  if (machine.typeId === "pokeworld:fossil_machine" && !machine.getDynamicProperty("slot")) {
    machine.setDynamicProperty("slot", "");
  }
});

world.afterEvents.entityHitEntity.subscribe(event => {
  const player = event.damagingEntity;
  const target = event.hitEntity;
  if (!(player instanceof Player)) return;
  if (!target || target.typeId !== "pokeworld:fossil_machine") return;

  if (player.isSneaking && player.hasTag("admin")) {
    openForceCompleteMenu(player, target);
  } else {
    openFossilMachineUI(player, target);
  }
});

/* -------------------------------------------------------------------------- */
/* BLOCK MACHINE INTERACTION (ADDED)                                          */
/* -------------------------------------------------------------------------- */

world.afterEvents.playerInteractWithBlock.subscribe(ev => {
  const { player, block } = ev;

  // ⚠️ DO NOT instanceof Player here
  if (!block || block.typeId !== FOSSIL_BLOCK_ID) return;

  const key = getBlockKeyFromBlock(block);
  const slots = getPlayerBlockSlots(player);
  const slot = slots[key] ?? null;

  const machineAdapter = {
    getDynamicProperty(id: string) {
      if (id !== "slot") return undefined;
      return slot ? JSON.stringify(slot) : "";
    },
    setDynamicProperty(id: string, value: any) {
      if (id !== "slot") return;

      const current = getPlayerBlockSlots(player);
      if (!value || value === "") delete current[key];
      else current[key] = JSON.parse(value);

      savePlayerBlockSlots(player, current);
    }
  } as unknown as Entity;

  if (player.isSneaking && player.hasTag("admin")) {
    openForceCompleteMenu(player, machineAdapter);
  } else {
    openFossilMachineUI(player, machineAdapter);
  }
});

/* -------------------------------------------------------------------------- */
/* BLOCK BREAK CLEANUP (ADDED)                                                */
/* -------------------------------------------------------------------------- */

world.afterEvents.playerBreakBlock.subscribe(ev => {
  if (ev.brokenBlockPermutation.type.id !== FOSSIL_BLOCK_ID) return;

  const player = ev.player;
  if (!(player instanceof Player)) return;

  const key = getBlockKeyFromBlock(ev.block);
  const slots = getPlayerBlockSlots(player);

  if (slots[key]) {
    delete slots[key];
    savePlayerBlockSlots(player, slots);
  }
});

/* -------------------------------------------------------------------------- */

function openFossilMachineUI(player: Player, machine: Entity) {
  const raw = machine.getDynamicProperty("slot");
  const slot: FossilSlot | null = raw ? JSON.parse(raw as string) : null;

  const form = new ActionFormData().title("🦴 Fossil Machine");

  if (slot) {
    let statusText = "";

    const gradeName = slot.grade.charAt(0).toUpperCase() + slot.grade.slice(1);
    const fossilName = getFossilDisplayName(slot.fossilType);
    const slotLabel = `${gradeName} Grade ${fossilName} Fossil`;

    if (slot.status === "ready") {
      const abandonLeft = slot.readyTick ? Math.max(0, slot.readyTick + ABANDON_TIME - system.currentTick) : 0;
      const mins = Math.floor(abandonLeft / 1200);
      const secs = Math.floor((abandonLeft % 1200) / 20);

      statusText = `✅ Ready Fossil

📦 Slot: §e${slotLabel}
👤 Owner: ${slot.owner ?? "Anyone"}
⏳ Abandon In: ${mins}m ${secs}s`;

    } else if (slot.status === "failed") {
      statusText = `❌ Fossil failed to restore.

📦 Slot: §e${slotLabel}`;

    } else {
      const totalTime = slot.completeTick - slot.startTick;
      const elapsedTime = Math.max(0, system.currentTick - slot.startTick);
      const restoreLeft = Math.max(0, slot.completeTick - system.currentTick);

      const mins = Math.floor(restoreLeft / 1200);
      const secs = Math.floor((restoreLeft % 1200) / 20);

      const progress = elapsedTime / totalTime;
      const totalBars = 20;
      const filledBars = Math.floor(totalBars * progress);
      const emptyBars = totalBars - filledBars;

      const progressBar = `|${'█'.repeat(filledBars)}${'░'.repeat(emptyBars)}|`;

      statusText = `⏳ Restoring Fossil

📦 Slot: §e${slotLabel}
✅ Success: ${Math.round(GRADES[slot.grade].success * 100)}%

${progressBar}

⏳ Time Left: ${mins}m ${secs}s`;
    }

    form.body(statusText);

    if (slot.status === "ready") form.button(`Claim Fossil Pokémon`);
    else if (slot.status === "failed") form.button(`Discard Fossil`);
  } else {
    form.body(`💡 Insert a fossil to restore.\nGrades affect success chance and time required.`);
    form.button("Restore Fossil");
  }

  form.show(player).then(res => {
    if (res.canceled) return;

    if (slot) {
      // CLAIMING READY FOSSIL
      if (slot.status === "ready" && res.selection === 0) {

        if (slot.owner === null) {
          slot.owner = player.name;
          player.sendMessage(`✅ You claimed an abandoned fossil!`);
        }

        const fossilName = getFossilDisplayName(slot.fossilType);
        const ivPercent = getIVPercent(slot.pokemonData);

        player.sendMessage(
          `§a🧬 You restored a §e${slot.pokeName} §afrom the §b${fossilName} Fossil§a!\n§7IVs: §e${ivPercent}%`
        );

        writePokemon(player, slot.pokeName, slot.rID, slot.pokemonData);
        finalizeToParty(player, slot.rID, slot.pokeName, slot.pokemonData);
        machine.setDynamicProperty("slot", "");
      }

      // DISCARD FAILED FOSSIL
      else if (slot.status === "failed" && res.selection === 0) {
        player.sendMessage(`❌ You discarded the failed fossil.`);
        machine.setDynamicProperty("slot", "");
      }

    } else {
      depositFossil(player, machine);
    }
  });
}

/* -------------------------------------------------------------------------- */

function depositFossil(player: Player, machine: Entity) {
  const inv = player.getComponent("inventory")?.container;
  if (!inv) {
    player.sendMessage(`§cInventory error.`);
    return;
  }

  const foundFossils: { id: string; fossilType: string; grade: "low" | "mid" | "high"; amount: number }[] = [];

  for (let slot = 0; slot < inv.size; slot++) {
    const item = inv.getItem(slot);
    if (item && FOSSIL_IDS.includes(item.typeId)) {
      const [_, fossilRaw] = item.typeId.split(":");
      const [grade, ...fossilParts] = fossilRaw.split("_");
      const fossilType = fossilParts.join("_");

      const existing = foundFossils.find(f => f.id === item.typeId);
      if (existing) existing.amount += item.amount;
      else foundFossils.push({ id: item.typeId, fossilType, grade: grade as "low" | "mid" | "high", amount: item.amount });
    }
  }

  if (foundFossils.length === 0) {
    player.sendMessage(`§cYou don't have any fossils to restore.`);
    return;
  }

  const form = new ActionFormData().title("🦴 Select Fossil to Restore");

  for (const fossil of foundFossils) {
    const name = `${fossil.grade.toUpperCase()} ${fossil.fossilType.replace("_", " ")}`;
    form.button(`§b${name} §7(x${fossil.amount})`);
  }

  form.show(player).then(res => {
    if (res.canceled) return;

    const selected = foundFossils[res.selection!];
    if (!selected) {
      player.sendMessage(`§cInvalid selection.`);
      return;
    }

    const clearResult = player.runCommand(`clear @s ${selected.id} 0 1`);
    if (clearResult.successCount === 0) {
      player.sendMessage(`§cYou don't have that fossil.`);
      return;
    }

    const pokeName = fossilMap[selected.fossilType];
    const calc = calculatePokemon(pokeName, 0, "pokeball");
    calc.Box = -1;
    calc.Slot = -1;
    const rID = ~~(Math.random() * 999999999);

    const slot: FossilSlot = {
      owner: player.name,
      fossilType: selected.fossilType,
      grade: selected.grade,
      pokeName,
      rID,
      pokemonData: calc,
      startTick: system.currentTick,
      completeTick: system.currentTick + GRADES[selected.grade].time,
      status: "restoring"
    };

    machine.setDynamicProperty("slot", JSON.stringify(slot));

    const fossilName = getFossilDisplayName(selected.fossilType);
    player.sendMessage(`🧬 You started restoring a ${selected.grade} Grade ${fossilName} Fossil.`);
  });
}

/* -------------------------------------------------------------------------- */

function openForceCompleteMenu(player: Player, machine: Entity) {
  const raw = machine.getDynamicProperty("slot");
  const slot: FossilSlot | null = raw ? JSON.parse(raw as string) : null;
  if (!slot) {
    player.sendMessage(`§cNo fossil in this machine.`);
    return;
  }

  const form = new ActionFormData().title("Force Complete (Admin)");
  form.button(`${slot.owner ?? "Unclaimed"} - ${slot.fossilType} (${slot.status})`);

  form.show(player).then(res => {
    if (res.canceled) return;

    if (slot.status === "restoring") {
      slot.status = "ready";
      slot.readyTick = system.currentTick;
      player.sendMessage(`✅ Forced complete for fossil.`);
      machine.setDynamicProperty("slot", JSON.stringify(slot));
    } else {
      player.sendMessage(`Already ${slot.status}.`);
    }
  });
}

/* -------------------------------------------------------------------------- */
/* ENTITY TIMER LOOP (UNCHANGED)                                              */
/* -------------------------------------------------------------------------- */

system.runInterval(() => {
  const dims = [
    world.getDimension("overworld"),
    world.getDimension("nether"),
    world.getDimension("the_end")
  ];

  for (const dim of dims) {
    for (const machine of dim.getEntities({ type: "pokeworld:fossil_machine" })) {
      const raw = machine.getDynamicProperty("slot");
      if (!raw) continue;

      const slot: FossilSlot = JSON.parse(raw as string);
      let changed = false;

      // RESTORATION FINISHED
      if (slot.status === "restoring" && system.currentTick >= slot.completeTick) {
        const success = Math.random() < GRADES[slot.grade].success;
        slot.status = success ? "ready" : "failed";

        if (slot.status === "ready") {
          slot.readyTick = system.currentTick;

          // 🔔 Notify owner that fossil is ready
          if (slot.owner) {
            const p = world.getPlayers().find(pl => pl.name === slot.owner);
            if (p) {
              const fossilName = getFossilDisplayName(slot.fossilType);
              p.sendMessage(`§a🦴 Your ${slot.grade} Grade ${fossilName} Fossil is ready to claim!`);
            }
          }
        }

        changed = true;
      }

      // ABANDONED FOSSIL BECOMES FREE TO CLAIM
      if (
        slot.status === "ready" &&
        slot.owner &&
        slot.readyTick &&
        system.currentTick > slot.readyTick + ABANDON_TIME
      ) {
        slot.owner = null;

        const pos = machine.location;
        const coords = `X: ${Math.floor(pos.x)} Y: ${Math.floor(pos.y)} Z: ${Math.floor(pos.z)}`;

        for (const p of world.getPlayers()) {
          p.sendMessage(`📢 An abandoned fossil is free to claim at ${coords}!`);
        }

        changed = true;
      }

      if (changed) {
        machine.setDynamicProperty("slot", JSON.stringify(slot));
      }
    }
  }
}, 20);

/* -------------------------------------------------------------------------- */
/* BLOCK TIMER LOOP (ADDED)                                                   */
/* -------------------------------------------------------------------------- */

system.runInterval(() => {
  for (const player of world.getPlayers()) {
    const slots = getPlayerBlockSlots(player);
    const keys = Object.keys(slots);
    if (keys.length === 0) continue;

    let changedAny = false;

    for (const key of keys) {
      const slot = slots[key];
      if (!slot) continue;

      let changed = false;

      // RESTORATION FINISHED
      if (slot.status === "restoring" && system.currentTick >= slot.completeTick) {
        const success = Math.random() < GRADES[slot.grade].success;
        slot.status = success ? "ready" : "failed";

        if (slot.status === "ready") {
          slot.readyTick = system.currentTick;

          // 🔔 Notify owner that fossil is ready (same behavior)
          if (slot.owner) {
            const p = world.getPlayers().find(pl => pl.name === slot.owner);
            if (p) {
              const fossilName = getFossilDisplayName(slot.fossilType);
              p.sendMessage(`§a🦴 Your ${slot.grade} Grade ${fossilName} Fossil is ready to claim!`);
            }
          }
        }

        changed = true;
      }

      // ABANDONED FOSSIL BECOMES FREE TO CLAIM (same behavior)
      if (
        slot.status === "ready" &&
        slot.owner &&
        slot.readyTick &&
        system.currentTick > slot.readyTick + ABANDON_TIME
      ) {
        slot.owner = null;

        const parsed = parseBlockKey(key);
        const coords = parsed
          ? `X: ${Math.floor(parsed.x)} Y: ${Math.floor(parsed.y)} Z: ${Math.floor(parsed.z)}`
          : `X: ? Y: ? Z: ?`;

        for (const p of world.getPlayers()) {
          p.sendMessage(`📢 An abandoned fossil is free to claim at ${coords}!`);
        }

        changed = true;
      }

      if (changed) {
        slots[key] = slot;
        changedAny = true;
      }
    }

    if (changedAny) {
      savePlayerBlockSlots(player, slots);
    }
  }
}, 20);

/* -------------------------------------------------------------------------- */

function finalizeToParty(player: Player, rID: number, name: PokemonName, calc: longHand) {
  const freeSlot = checkSidebarFree(player);

  // ✅ PARTY FULL → PC
  if (freeSlot === undefined) {
    // Only now assign a real PC slot
    const { box, slot } = findNextFreePCSlotForPlayer(player);
    calc.Box = box;
    calc.Slot = slot;

    // ✅ Re-write to update stored data with Box/Slot (no refactor needed)
    writePokemon(player, name, rID, calc);

    player.sendMessage(`§a✚ §7Pokemon Sent To Your PC`);
    player.runCommand(`scoreboard players add @s pcatch 1`);
    return;
  }

  // ✅ PARTY → ensure not in PC
  calc.Box = -1;
  calc.Slot = -1;

  // (optional but safe) re-write to ensure Box/Slot are correct in DB
  writePokemon(player, name, rID, calc);

  if (!selected.hasOwnProperty(player.name)) selected[player.name] = {};
  selected[player.name][freeSlot] = [Number(rID), name, calc];

  const suffix = freeSlot > 0 ? freeSlot + 1 : '';

  system.run(() => {
    player.runCommand(`scoreboard players set @s poke${suffix}rID ${rID}`);
    player.runCommand(`scoreboard players set @s poke${suffix}Id ${pokemonList.indexOf(name)}`);
    player.runCommand(`scoreboard players set @s poke${suffix}Ball ${Object.keys(ballTags).indexOf(calc.pokeBall)}`);
    player.runCommand(`scoreboard players set @s poke${suffix}Lvl ${calc.level}`);
    player.runCommand(`scoreboard players set @s poke${suffix}Var ${calc.Variant}`);
    player.runCommand(`scoreboard players set @s poke${suffix}HP ${calc.Current_Health ?? 0}`);
    player.runCommand(`scoreboard players set @s poke${suffix}HPmax ${calc.Base_Health}`);
  });

  player.sendMessage(`§a✚ §7Pokemon Added To Your Party`);
  player.runCommand(`scoreboard players add @s pcatch 1`);
}
