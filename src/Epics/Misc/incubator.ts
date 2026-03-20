import { Player, system, world, Entity } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import pokemonList from "../../Letters/pokemon/list";
import { listStorage, readPokemon, writePokemon } from "../Pokemon Database/main";
import { selected } from "../Main/Forms/PC/main";
import { calculatePokemon, checkSidebarFree, PokemonName } from "../Pokemon Calculations/calculations";
import { longHand, shortHand } from "../Pokemon Database/@types/types";
import { hatchingConfig } from "../Pokemon Calculations/hatching";
import { ballTags } from "../Pokemon Calculations/catch";
import { findNextFreePCSlot } from "../Pokemon Database/PcControls";


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
  return Math.round((total / 186) * 100);
}

interface IncubatorSlot {
  owner: string | null; // null means free to claim
  eggType: "two_kilo" | "five_kilo" | "seven_kilo" | "ten_kilo";
  pokeName: PokemonName;
  pokemonData: longHand;
  rID: number;
  startTick: number;
  hatchTick: number;
  readyTick?: number;
  status: "hatching" | "ready" | "failed";
}

const FAILURE_CHANCE = 0.1;
const ABANDON_TIME = 20 * 60 * 30; // 30 min in ticks (20 ticks/sec)

const HATCH_TIMES: Record<string, number> = {
  "two_kilo": 6000,
  "five_kilo": 12000,
  "seven_kilo": 18000,
  "ten_kilo": 24000
};

// Initialize slots if missing
world.afterEvents.entityLoad.subscribe(ev => {
  const incubator = ev.entity;
  if (incubator.typeId === "pokeworld:incubator" && !incubator.getDynamicProperty("slots")) {
    incubator.setDynamicProperty("slots", JSON.stringify([]));
  }
});

// Hit detection: crouch-hit for admin, otherwise player UI
world.afterEvents.entityHitEntity.subscribe(event => {
  const player = event.damagingEntity;
  const target = event.hitEntity;
  if (!(player instanceof Player)) return;
  if (!target || target.typeId !== "pokeworld:incubator") return;

  if (player.isSneaking && player.hasTag("admin")) {
    openForceHatchMenu(player, target);
  } else {
    openIncubatorUI(player, target);
  }
});

// Player UI
function openIncubatorUI(player: Player, incubator: Entity) {
  const raw = incubator.getDynamicProperty("slots");
  let slots: IncubatorSlot[] = JSON.parse(typeof raw === "string" ? raw : "[]");

  const playerSlots = slots.filter(s => s.owner === player.name || s.owner === null);
  const form = new ActionFormData().title("Egg Incubator");

  if (playerSlots.length > 0) {
    let bodyText = `Your slots:\n`;
    playerSlots.forEach((slot, index) => {
      let statusText = "";
      if (slot.status === "ready") {
        if (slot.owner) {
          const abandonLeft = slot.readyTick
            ? Math.max(0, slot.readyTick + ABANDON_TIME - system.currentTick)
            : 0;
          const mins = Math.floor(abandonLeft / 1200);
          const secs = Math.floor((abandonLeft % 1200) / 20);
          statusText = `✅ Ready - ${mins}m ${secs}s Till Egg is Free To Claim.`;
        } else {
          statusText = "✅ Ready - Anyone can claim!";
        }
      } else if (slot.status === "failed") {
        statusText = "❌ Failed";
      } else {
        const hatchLeft = Math.max(0, slot.hatchTick - system.currentTick);
        const mins = Math.floor(hatchLeft / 1200);
        const secs = Math.floor((hatchLeft % 1200) / 20);
        statusText = `⏳ Hatching - ${mins}m ${secs}s`;
      }
      const ownerText = slot.owner ? "" : " (Unclaimed)";
      bodyText += `Slot ${index + 1}: ${slot.eggType}${ownerText} - ${statusText}\n`;
    });

    form.body(bodyText);

    playerSlots.forEach(slot => {
      if (slot.status === "ready") form.button(`Collect ${slot.eggType}`);
      else if (slot.status === "failed") form.button(`Discard ${slot.eggType}`);
    });

    if (slots.length < 3) {
      form.button("Deposit New Egg");
    }
  } else {
    form.body("Select an egg to deposit:");
    form.button("Two Kilo Egg");
    form.button("Five Kilo Egg");
    form.button("Seven Kilo Egg");
    form.button("Ten Kilo Egg");
  }

  form.show(player).then(res => {
    if (res.canceled) return;

    if (playerSlots.length > 0) {
      const readySlots = playerSlots.filter(s => s.status === "ready");
      const failedSlots = playerSlots.filter(s => s.status === "failed");
      const actionIndex = res.selection;

      if (actionIndex < readySlots.length) {
        const slot = readySlots[actionIndex];
        if (slot.owner === null) {
          slot.owner = player.name;
          player.sendMessage(`§a✅ You claimed an abandoned ${slot.eggType} egg!`);
        }
        writePokemon(player, slot.pokeName, slot.rID, slot.pokemonData);
        finalizeToParty(player, slot.rID, slot.pokeName, slot.pokemonData);
        const ivPercent = getIVPercent(slot.pokemonData);

        player.sendMessage(
          `§a🐣 You hatched a §e${slot.pokeName}§a!\n§7IVs: §e${ivPercent}%%`
        );
        slots = slots.filter(s => s !== slot);
      } else if (actionIndex < readySlots.length + failedSlots.length) {
        const slot = failedSlots[actionIndex - readySlots.length];
        player.sendMessage("You discarded a failed egg.");
        slots = slots.filter(s => s !== slot);
      } else {
        if (slots.length < 3) {
          depositEgg(player, slots, incubator);
          return;
        } else {
          player.sendMessage(`§cThis incubator is full.`);
        }
      }
    } else {
      depositEgg(player, slots, incubator, res.selection);
      return;
    }

    incubator.setDynamicProperty("slots", JSON.stringify(slots));
  });
}

// Deposit new egg
function depositEgg(player: Player, slots: IncubatorSlot[], incubator: Entity, directSelection?: number) {
  const eggTypes = ["two_kilo", "five_kilo", "seven_kilo", "ten_kilo"] as const;
  type EggType = typeof eggTypes[number];

  let selection = directSelection;

  if (selection === undefined) {
    const form = new ActionFormData().title("Choose an Egg");
    eggTypes.forEach(type => form.button(`${type.replace("_", " ")} Egg`));
    form.show(player).then(res => {
      if (!res.canceled) {
        depositEgg(player, slots, incubator, res.selection);
      }
    });
    return;
  }

  const eggType: EggType = eggTypes[selection]; // ✅ typed as the union now

  // ✅ Check inventory for egg item
  const inv = player.getComponent("inventory");
  let hasEgg = false;

  for (let i = 0; i < inv.container.size; i++) {
    const item = inv.container.getItem(i);
    if (item && item.typeId === `pokeworld:${eggType}_egg`) {
      hasEgg = true;
      if (item.amount > 1) {
        item.amount--;
        inv.container.setItem(i, item);
      } else {
        inv.container.setItem(i, undefined);
      }
      break;
    }
  }

  if (!hasEgg) {
    player.sendMessage(`§cYou don't have a ${eggType.replace("_", " ")} egg to deposit!`);
    return;
  }

  // ✅ Egg was consumed — now continue
  const randomItem = hatchingConfig[eggType][Math.floor(Math.random() * hatchingConfig[eggType].length)];
  const variant = Math.random() < 1 / 500 ? randomItem.variant[1] : randomItem.variant[0];
  const calculations = calculatePokemon(randomItem.pokeName, variant, "pokeball");
  const rID = ~~(Math.random() * 999999999);

  slots.push({
    owner: player.name,
    eggType,
    pokeName: randomItem.pokeName,
    pokemonData: calculations,
    rID,
    startTick: system.currentTick,
    hatchTick: system.currentTick + HATCH_TIMES[eggType],
    status: "hatching"
  });

  player.sendMessage(`You deposited a ${eggType.replace("_", " ")} egg.`);
  incubator.setDynamicProperty("slots", JSON.stringify(slots));
}

// Admin force hatch
function openForceHatchMenu(player: Player, incubator: Entity) {
  const raw = incubator.getDynamicProperty("slots");
  let slots: IncubatorSlot[] = JSON.parse(typeof raw === "string" ? raw : "[]");

  if (slots.length === 0) {
    player.sendMessage(`§cNo active eggs in this incubator.`);
    return;
  }

  const form = new ActionFormData().title("Force Hatch (Admin)");

  slots.forEach((slot, index) => {
    const statusText = slot.status === "hatching"
      ? "⏳ Hatching"
      : slot.status === "ready"
        ? "✅ Ready"
        : "❌ Failed";
    form.button(`Slot ${index + 1}: ${slot.owner ?? "Unclaimed"} - ${slot.eggType} (${statusText})`);
  });

  form.show(player).then(res => {
    if (res.canceled) return;

    const slot = slots[res.selection];
    if (slot.status === "hatching") {
      slot.status = "ready";
      slot.readyTick = system.currentTick;
      player.sendMessage(`§a✅ Forced hatch for ${slot.owner ?? "unclaimed"} ${slot.eggType} egg!`);

      if (slot.owner) {
        const ownerPlayer = world.getPlayers().find(p => p.name === slot.owner);
        if (ownerPlayer) {
          ownerPlayer.sendMessage(`§e⚡ Your ${slot.eggType} egg was force-hatched by an admin!`);
        }
      }

      incubator.setDynamicProperty("slots", JSON.stringify(slots));
    } else {
      player.sendMessage(`§7That slot is already ${slot.status}.`);
    }
  });
}

// Ticker: hatching, abandon check, broadcast
system.runInterval(() => {
  const dimensions = [
    world.getDimension("overworld"),
    world.getDimension("nether"),
    world.getDimension("the_end")
  ];

  for (const dim of dimensions) {
    for (const incubator of dim.getEntities({ type: "pokeworld:incubator" })) {
      const raw = incubator.getDynamicProperty("slots");
      let slots: IncubatorSlot[] = JSON.parse(typeof raw === "string" ? raw : "[]");
      let changed = false;

      slots.forEach(slot => {
        if (slot.status === "hatching" && system.currentTick >= slot.hatchTick) {
          slot.status = Math.random() < FAILURE_CHANCE ? "failed" : "ready";
          if (slot.status === "ready") {
            slot.readyTick = system.currentTick;
            if (slot.owner) {
              const owner = world.getPlayers().find(p => p.name === slot.owner);
              if (owner) {
                owner.sendMessage(`§a✅ Your ${slot.eggType.replace("_", " ")} egg is ready to collect!`);
              }
            }
          }
          changed = true;
        }

        if (
          slot.status === "ready" &&
          slot.owner &&
          slot.readyTick &&
          system.currentTick > slot.readyTick + ABANDON_TIME
        ) {
          const ownerPlayer = world.getPlayers().find(p => p.name === slot.owner);
          if (ownerPlayer) {
            ownerPlayer.sendMessage(`§e⚠️ Your ${slot.eggType} egg has been left too long and is now free to claim!`);
          }

          slot.owner = null;

          const pos = incubator.location;
          const coords = `X: ${Math.floor(pos.x)} Y: ${Math.floor(pos.y)} Z: ${Math.floor(pos.z)}`;

          for (const p of world.getPlayers()) {
            p.sendMessage(`§6📢 An abandoned ${slot.eggType.replace("_", " ")} egg is now free to claim! Incubator at ${coords}.`);
          }

          changed = true;
        }
      });

      if (changed) {
        incubator.setDynamicProperty("slots", JSON.stringify(slots));
      }
    }
  }
}, 20);

// Finalize Pokémon to party/PC
function finalizeToParty(
  player: Player,
  rID: number,
  name: PokemonName,
  calc: longHand
) {
  const freeSlot = checkSidebarFree(player); // 0..5 or undefined

  // ===============================
  // TEAM FULL → SEND TO PC
  // ===============================
  if (freeSlot === undefined) {

    // Get current PC data
    const results = listStorage(player).map(mon => [
      mon,
      readPokemon(player, mon, false)
    ]) as unknown as [string, { [rID: string]: shortHand }][];

    // Use your existing global slot finder
    const next = findNextFreePCSlot(results);

    // Assign Box + Slot properly (PC is 1-based box, 0-based slot)
    calc.Box = next.box;
    calc.Slot = next.slot;

    writePokemon(player, name, rID, calc);

    player.sendMessage(`§a✚ §7Pokemon Sent To Your PC`);
    return;
  }

  // ===============================
  // ADD TO PARTY
  // ===============================

  // 🔓 Important: ensure it does NOT claim PC ownership
  delete (calc as any).Box;
  delete (calc as any).Slot;

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
}