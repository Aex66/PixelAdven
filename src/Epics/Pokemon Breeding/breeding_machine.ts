import { ItemStack, Player, system, world, Entity, EquipmentSlot, } from "@minecraft/server";
import { selected } from "../Main/Forms/PC/main";
import { ActionForm } from "../../Papers/FormPaper";
import { deletePokemon, writePokemon } from "../Pokemon Database/main";
import { updateSidebar } from "../Pokemon Calculations/updateTeam";
import { EggCycles } from "./egg_cycles";
import pokemonList from "../../Letters/pokemon/list";
import { PokemonName, calculatePokemon, checkSidebarFree, } from "../Pokemon Calculations/calculations";
import pokemoneNatures from "../../Letters/pokemon/natures";
import { EggGroups } from "./egg_groups";
import { ballTags } from "../Pokemon Calculations/catch";
import { calculateHealth, calculateNatureStat, } from "../Pokemon Calculations/functions";
import { pokemonText } from "../../Papers/Paragraphs/ExtrasParagraphs";
import { EvolutionBase } from "./evolution_base";
import { VariantBaseMap } from "./egg_variants";

// 🔹 pull the same data calculatePokemon uses for gender rolls
import wildPokemon from "../../Letters/pokemon/wild"; // adjust if your export/path differs
import { findNextFreePCSlotForPlayer } from "../Pokemon Database/PcControls";

const spawnedParents = new Map<string, any>();
const BREED_TIME_TICKS = 20 * 60 * 90; // 1.5 hrs in ticks

function getIVPercentFromIVArray(ivs: number[]): number {
  const total = ivs.reduce((a, b) => a + b, 0);
  return Math.round((total / 186) * 100);
}

// --------------------- GENDER HELPERS ---------------------
type GenderStr = "Male" | "Female" | "Genderless" | "Unknown";

function clonePokemonData(data: any) {
  return JSON.parse(JSON.stringify(data));
}

function getGender(poke: any): GenderStr {
  if (!poke) return "Unknown";

  // String-based (existing support)
  if (typeof poke.Gender === "string") {
    const g = poke.Gender.trim();
    if (g === "Male" || g === "Female" || g === "Genderless") return g as GenderStr;
  }

  // Tuple-based ([string, index] or [index])
  if (Array.isArray(poke.Gender)) {
    const [val0, val1] = poke.Gender;
    if (typeof val0 === "string") {
      if (val0 === "Male" || val0 === "Female" || val0 === "Genderless") return val0;
    }
    if (typeof val0 === "number" || typeof val1 === "number") {
      const num = typeof val1 === "number" ? val1 : val0;
      if (num === 1) return "Male";
      if (num === 2) return "Female";
      return "Genderless";
    }
  }

  // Numeric directly
  if (typeof poke.Gender === "number") {
    if (poke.Gender === 1) return "Male";
    if (poke.Gender === 2) return "Female";
    return "Genderless";
  }

  // Legacy fallback: gender or sex fields
  const g2 = (poke.gender ?? poke.sex);
  if (typeof g2 === "string") {
    const norm = g2.trim().toLowerCase();
    if (norm === "male") return "Male";
    if (norm === "female") return "Female";
    if (["genderless", "none", "unknown"].includes(norm)) return "Genderless";
  }

  return "Unknown";
}

// Build the same key shape your calculatePokemon snippet uses
function wildKeyFor(species: string) {
  const pokemonId = (species || "").toLowerCase().replace(/\s+/g, "_");
  return `pokeworld:wild_${pokemonId}`;
}

// Roll gender EXACTLY like your calculatePokemon snippet
function rollGenderLikeCalculatePokemon(species: string): GenderStr {
  const key = wildKeyFor(species);
  const rawGender = (wildPokemon as any)?.[key]?.Gender;
  let chosenGender: GenderStr = "Genderless";

  if (Array.isArray(rawGender) && rawGender.length > 0) {
    const roll = Math.random() * 100;
    let cumulative = 0;
    for (const tuple of rawGender) {
      const percent = Number(tuple?.[0]) || 0;
      const gender = String(tuple?.[1] ?? "");
      cumulative += percent;
      if (roll <= cumulative) {
        if (gender === "Male" || gender === "Female" || gender === "Genderless") {
          chosenGender = gender as GenderStr;
        } else {
          chosenGender = "Genderless";
        }
        break;
      }
    }
  }
  return chosenGender;
}

function genderIndexFromString(g: GenderStr): number {
  return g === "Male" ? 1 : g === "Female" ? 2 : 0;
}

// For your Ditto rule: block if non-Ditto species has 0% female (Ditto can't become that)
function speciesHasAnyFemales(species: string): boolean {
  const key = wildKeyFor(species);
  const rawGender = (wildPokemon as any)?.[key]?.Gender;
  if (!Array.isArray(rawGender)) return false;
  const femaleEntry = rawGender.find((t: any) => String(t?.[1]) === "Female");
  const femalePct = femaleEntry ? Number(femaleEntry[0]) : 0;
  return femalePct > 0;
}

function isDitto(species: string) { return species === "Ditto"; }
// ----------------------------------------------------------

world.afterEvents.entityLoad.subscribe((ev) => {
  const machine = ev.entity;
  if (
    machine.typeId === "pokeworld:breeding_machine" &&
    !machine.getDynamicProperty("pair")
  ) {
    machine.setDynamicProperty("pair", ""); // store as JSON string
  }
});

// === HIT: Open main breeding menu ===
world.afterEvents.entityHitEntity.subscribe((event) => {
  const player = event.damagingEntity;
  const target = event.hitEntity;

  if (!(player instanceof Player)) return;
  if (!target || target.typeId !== "pokeworld:breeding_machine") return;

  if (player.isSneaking && player.hasTag("admin")) {
    openForceBreedMenu(player, target);
  } else {
    openBreedingMainMenu(player, target);
  }
});

export function openBreedingMainMenu(player: Player, machine: Entity) {
  const raw = machine.getDynamicProperty("pair") as string;
  const pair = raw ? JSON.parse(raw) : null;

  const form = new ActionForm();
  form.setTitle("Breeding Machine");

  if (pair) {
    // ✅ Correct nickname/name/species fallback
    const species1 =
      (pair.parent1?.Nickname && pair.parent1.Nickname.trim() !== "")
        ? pair.parent1.Nickname
        : (pair.parent1?.name || pair.species1 || "Empty");

    const species2 =
      (pair.parent2?.Nickname && pair.parent2.Nickname.trim() !== "")
        ? pair.parent2.Nickname
        : (pair.parent2?.name || pair.species2 || "Empty");

    const ticksElapsed = world.getAbsoluteTime() - (pair.startTick ?? 0);
    const ticksLeft = Math.max(0, BREED_TIME_TICKS - ticksElapsed);
    const mins = Math.floor(ticksLeft / 1200);
    const secs = Math.floor((ticksLeft % 1200) / 20);

    // 🥚 If the egg is ready to claim
    if (pair.eggReady) {
      form.setBody(`Breeding Machine:
§7${species1} × ${species2}

§aAn egg is ready to be claimed!
What would you like to do?`);

      form.addButton("§6🥚 Claim Egg");
      form.addButton("§cCancel & Remove Pokémon");
    } else {
      // 🕒 Still breeding, show timer
      form.setBody(`Breeding Machine:
§7${species1} × ${species2}

§fEgg ready in: §e${mins}m ${secs}s

What would you like to do?`);

      // Add buttons depending on state
      if (!pair.parent1 || !pair.parent2) {
        form.addButton(`Add Pokémon to Empty Slot`);
      }
      form.addButton(`§cCancel & Remove Pokémon`);
    }
  } else {
    // No breeding pair yet
    form.setBody(`No active breeding pair. What do you want to do?`);
    form.addButton(`Deposit Pokémon to Breed`);
  }

  form.send(player, (res) => {
    if (res.canceled) return;

    // 🥚 Claim egg if it's ready
    if (pair && pair.eggReady && res.selection === 0) {
      const egg = createBreedingEgg(pair);
      const inv = player.getComponent("minecraft:inventory")?.container;
      if (inv) {
        inv.addItem(egg);
        player.sendMessage(`§aYou claimed your egg!`);
      } else {
        player.sendMessage(`§cNo space in your inventory for the egg!`);
        return;
      }

      // Reset timer and continue breeding
      pair.startTick = world.getAbsoluteTime();
      pair.eggReady = false;
      machine.setDynamicProperty("pair", JSON.stringify(pair));

      player.sendMessage(`§7Your Pokémon are continuing to breed...`);
      return;
    }

    // 🧭 Handle other cases
    if (pair) {
      const openSlot = (!pair.parent1 || !pair.parent2);

      if (pair.eggReady && res.selection === 1) {
        // "Cancel & Remove Pokémon" button when egg ready
        openCancelBreedingMenu(player, machine, pair);
        return;
      }

      if (openSlot && res.selection === 0) {
        openBreedingMenu(player, machine);
      } else if (openSlot && res.selection === 1) {
        openCancelBreedingMenu(player, machine, pair);
      } else if (!openSlot && !pair.eggReady && res.selection === 0) {
        openCancelBreedingMenu(player, machine, pair);
      }
    } else {
      openBreedingMenu(player, machine);
    }
  });
}

function openForceBreedMenu(player: Player, machine: Entity) {
  const pair = JSON.parse(
    (machine.getDynamicProperty("pair") as string) || "null"
  );
  if (!pair) {
    player.sendMessage("§cNo active breeding pair to force breed.");
    return;
  }

  const form = new ActionForm();
  form.setTitle("Admin: Force Breed");
  form.setBody(`Force breed ${pair.species1} × ${pair.species2}?`);
  form.addButton(`✅ Force Now`);
  form.addButton(`❌ Cancel`);

  form.send(player, (res) => {
    if (res.canceled || res.selection !== 0) return;

    const egg = createBreedingEgg(pair);
    player.getComponent("minecraft:inventory").container.addItem(egg);

    pair.startTick = world.getAbsoluteTime();
    machine.setDynamicProperty("pair", JSON.stringify(pair));

    player.sendMessage(`§a✅ Forced breed: Egg produced. Parents keep breeding!`);
  });
}

// === Cancel breeding ===
function openCancelBreedingMenu(player: Player, machine: Entity, pair: any) {
  let species1 = pair.species1 ?? getSpeciesName(pair.parent1);
  let species2 = pair.species2 ?? getSpeciesName(pair.parent2);

  const form = new ActionForm();
  form.setTitle("Cancel Breeding");
  form.setBody(`Choose which Pokémon to remove:`);

  if (pair.parent1) form.addButton(`Remove ${species1}`);
  if (pair.parent2) form.addButton(`Remove ${species2}`);
  form.addButton(`Remove Both`);

  form.send(player, res => {
    if (res.canceled) return;

    if (res.selection === 0 && pair.parent1) {
      returnParentsToParty(player, getSpeciesName(pair.parent1), pair.parent1);
      killParent(machine, "parent1");
      pair.parent1 = null;
      pair.species1 = null;
      pair.gender1 = null;
    } else if (res.selection === 1 && pair.parent2) {
      returnParentsToParty(player, getSpeciesName(pair.parent2), pair.parent2);
      killParent(machine, "parent2");
      pair.parent2 = null;
      pair.species2 = null;
      pair.gender2 = null;
    } else {
      if (pair.parent1) {
        returnParentsToParty(player, getSpeciesName(pair.parent1), pair.parent1);
      }
      if (pair.parent2) {
        returnParentsToParty(player, getSpeciesName(pair.parent2), pair.parent2);
      }
      despawnParents(machine);
      machine.setDynamicProperty("pair", "");
      player.sendMessage(`§aReturned both Pokémon to your team.`);
      return;
    }

    if (!pair.parent1 && !pair.parent2) {
      machine.setDynamicProperty("pair", "");
      despawnParents(machine);
    } else {
      machine.setDynamicProperty("pair", JSON.stringify(pair));

      const pos = machine.location;
      const spawn = spawnedParents.get(machine.id) || {};
      if (pair.parent1) {
        if (spawn.parent1) spawn.parent1.kill();
        spawn.parent1 = summonParentPokemon(pair.species1, { x: pos.x + 2, y: pos.y, z: pos.z });
      }
      if (pair.parent2) {
        if (spawn.parent2) spawn.parent2.kill();
        spawn.parent2 = summonParentPokemon(pair.species2, { x: pos.x - 2, y: pos.y, z: pos.z });
      }
      spawnedParents.set(machine.id, spawn);
    }

    player.sendMessage(`§aReturned Pokémon. You can deposit a new one to keep breeding!`);
  });
}

function killParent(machine: Entity, which: "parent1" | "parent2") {
  const spawn = spawnedParents.get(machine.id);
  if (!spawn || !spawn[which]) return;
  spawn[which].kill();
  spawn[which] = null;
}

// === Pick parents ===
export function openBreedingMenu(player: Player, machine: Entity) {
  const raw = machine.getDynamicProperty("pair") as string;
  const pair = raw ? JSON.parse(raw) : null;

  if (pair && pair.owner && pair.owner !== player.name) {
    player.sendMessage(`§cThis breeding machine is owned by ${pair.owner}.`);
    return;
  }

  const slotsArray = Object.entries(selected[player.name] ?? {}).filter(
    ([_, p]) => !!p
  );

  if (slotsArray.length < 1) {
    player.sendMessage("§cYou need Pokémon in your party.");
    return;
  }

  const form = new ActionForm();
  form.setTitle("Breeding Machine");
  form.setBody(
    pair ? "Select a Pokémon to deposit:" : "Select first Pokémon to deposit."
  );

  slotsArray.forEach(([slot, p]) => {
    const [_, name, data] = p;
    const lvl = data.level ?? 1;
    form.addButton(`Slot ${Number(slot) + 1}: ${name} Lv.${lvl}`);
  });

  form.send(player, (res) => {
    if (res.canceled) return;

    const slot1 = Number(slotsArray[res.selection][0]);

    if (pair) {
      if (!pair.parent1) startBreeding(player, machine, slot1, undefined);
      else if (!pair.parent2) startBreeding(player, machine, undefined, slot1);
      else player.sendMessage(`§cBoth slots are full.`);
    } else {
      const form2 = new ActionForm();
      form2.setTitle("Breeding Machine");
      form2.setBody(`Select second Pokémon:`);

      slotsArray.forEach(([slot, p]) => {
        const [_, name, data] = p;
        const lvl = data.level ?? 1;
        const disabled = Number(slot) === slot1 ? " (Selected)" : "";
        form2.addButton(
          `Slot ${Number(slot) + 1}: ${name} Lv.${lvl}${disabled}`
        );
      });

      form2.send(player, (res2) => {
        if (res2.canceled) return;

        const slot2 = Number(slotsArray[res2.selection][0]);
        if (slot1 === slot2) {
          player.sendMessage("§cSelect two different Pokémon.");
          return;
        }
        startBreeding(player, machine, slot1, slot2);
      });
    }
  });
}

function canBreed(species1: string, species2: string): boolean {
  const groups1 = EggGroups[species1];
  const groups2 = EggGroups[species2];

  if (!groups1 || !groups2) {
    //console.warn(`❗ canBreed: Missing groups!`);
    //console.warn(`Species1: ${species1} -> Groups: ${groups1}`);
    //console.warn(`Species2: ${species2} -> Groups: ${groups2}`);
    return false;
  }

  if (groups1.includes("Undiscovered") || groups2.includes("Undiscovered")) {
    //console.warn(`❗ One or both parents are Undiscovered.`);
    return false;
  }

  if (species1 === "Ditto" || species2 === "Ditto") {
    return true;
  }

  const overlap = groups1.some(g => groups2.includes(g));
  //console.warn(`canBreed: ${species1} [${groups1}] × ${species2} [${groups2}] => Overlap: ${overlap}`);
  return overlap;
}

// === Start breeding ===
function startBreeding(player: Player, machine: Entity, slot1: number, slot2: number) {
  const p1 = selected[player.name][slot1];
  const p2 = selected[player.name][slot2];
  const species1 = getSpeciesName(p1);
  const species2 = getSpeciesName(p2);

  // gender gating BEFORE deletion
  const g1 = getGender(p1?.[2]);
  const g2 = getGender(p2?.[2]);

  // same/invalid genders (non-Ditto) -> void & return
  if (!(isDitto(species1) || isDitto(species2))) {
    const oneMF = (g1 === "Male" && g2 === "Female") || (g1 === "Female" && g2 === "Male");
    if (!oneMF) {
      player.sendMessage(`§cThese Pokémon can't breed: invalid gender pairing (${g1} × ${g2}).`);
      return;
    }
  }

  // Ditto rule: if non-Ditto is Male of a species with 0% females -> block
  if (isDitto(species1) || isDitto(species2)) {
    const nonDittoSpecies = isDitto(species1) ? species2 : species1;
    const nonDittoGender = isDitto(species1) ? g2 : g1;
    if (nonDittoGender === "Male" && !speciesHasAnyFemales(nonDittoSpecies)) {
      player.sendMessage(`§cBreeding blocked: Ditto cannot become a female ${nonDittoSpecies}.`);
      return;
    }
  }

  if (!canBreed(species1, species2)) {
    player.sendMessage(`§cThese Pokémon can't breed!`);
    return;
  }

  // only delete after all checks pass
  deletePokemon(player, species1, p1[0]);
  deletePokemon(player, species2, p2[0]);

  [slot1, slot2].sort().reverse().forEach(slot => {
    for (let i = slot; i < 5; i++) {
      if (selected[player.name][i + 1]) {
        selected[player.name][i] = selected[player.name][i + 1];
      } else {
        delete selected[player.name][i];
      }
    }
    delete selected[player.name][5];
  });
  updateSidebar(player, 0);

  if (!p1[2].Nature) {
    const defaultIndex = pokemoneNatures.values.findIndex(n => n[2] === "Hardy");
    p1[2].Nature = ["Hardy", defaultIndex];
  }
  if (!p2[2].Nature) {
    const defaultIndex = pokemoneNatures.values.findIndex(n => n[2] === "Hardy");
    p2[2].Nature = ["Hardy", defaultIndex];
  }

  const raw = machine.getDynamicProperty("pair") as string;
  const pair = raw ? JSON.parse(raw) : {};

  pair.parent1 = pair.parent1 ?? clonePokemonData(p1[2]);
  pair.species1 = pair.parent1?.Species ?? pair.parent1?.species ?? species1;
  pair.gender1 = pair.gender1 ?? g1;

  pair.parent2 = pair.parent2 ?? clonePokemonData(p2[2]);
  pair.species2 = pair.parent2?.Species ?? pair.parent2?.species ?? species2;
  pair.gender2 = pair.gender2 ?? g2;

  pair.owner = player.name;
  if (!pair.startTick) pair.startTick = world.getAbsoluteTime();

  machine.setDynamicProperty("pair", JSON.stringify(pair));

  const pos = machine.location;
  const ent1 = pair.parent1 ? summonParentPokemon(species1, { x: pos.x + 2, y: pos.y, z: pos.z }) : null;
  const ent2 = pair.parent2 ? summonParentPokemon(species2, { x: pos.x - 2, y: pos.y, z: pos.z }) : null;

  spawnedParents.set(machine.id, { parent1: ent1, parent2: ent2 });

  player.sendMessage(`§aYour Pokémon are now breeding!`);
}

// === Summon & Despawn ===
function summonParentPokemon(species: string, pos: { x: number; y: number; z: number }): Entity {
  const entity = world.getDimension("overworld").spawnEntity(`pokeworld:${species.toLowerCase()}` as any, pos);
  return entity;
}
function despawnParents(machine: Entity) {
  const spawn = spawnedParents.get(machine.id);
  if (!spawn) return;
  [spawn.parent1, spawn.parent2].forEach((e) => {
    if (e) e.kill();
  });
  spawnedParents.delete(machine.id);
}

// === Return parents to team ===
function returnParentsToParty(player: Player, species: string, poke: any) {
  if (!species || species === "Unknown") {
  species = poke?.Species ?? poke?.species ?? poke?.name ?? null;
}

if (!species || !pokemonList.includes(species as PokemonName)) {
  player.sendMessage(`§cFailed to restore Pokémon: Missing species data.`);
  return;
}

  const safeSpecies = species as PokemonName;

  let slot = checkSidebarFree(player);
  if (slot === undefined) {
    player.sendMessage(`§cNo free slots! ${safeSpecies} sent to your PC instead.`);
    return;
  }

  const rID = ~~(Math.random() * 999999999);
  selected[player.name][slot] = [rID, safeSpecies, poke];
  writePokemon(player, safeSpecies, rID, poke);

  const suffix = slot > 0 ? slot + 1 : "";
  system.run(() => {
    player.runCommand(`scoreboard players set @s poke${suffix}rID ${rID}`);
    player.runCommand(`scoreboard players set @s poke${suffix}Id ${pokemonList.indexOf(safeSpecies)}`);
    player.runCommand(`scoreboard players set @s poke${suffix}Lvl ${poke.level ?? 1}`);
    player.runCommand(`scoreboard players set @s poke${suffix}Var ${poke.Variant ?? 0}`);
    player.runCommand(`scoreboard players set @s poke${suffix}HP ${poke.Current_Health ?? 0}`);
    player.runCommand(`scoreboard players set @s poke${suffix}HPmax ${poke.Base_Health ?? 0}`);
    player.runCommand(`scoreboard players set @s poke${suffix}Ball ${Object.keys(ballTags).indexOf(poke.pokeBall)}`);
  });

  updateSidebar(player, slot);
}

export function getSpeciesName(slot: any): string {
  if (!slot) return "Unknown";
  if (Array.isArray(slot)) {
    return slot[1] ?? "Unknown";
  }
  return slot.Species ?? slot.species ?? slot.name ?? "Unknown";
}

function createBreedingEgg(pair: any): ItemStack {
  // ——— Egg species: FEMALE parent (or non-Ditto if Ditto is involved)
  const s1 = pair.species1 ?? "Unknown";
  const s2 = pair.species2 ?? "Unknown";
  const g1: GenderStr = pair.gender1 ?? getGender(pair.parent1);
  const g2: GenderStr = pair.gender2 ?? getGender(pair.parent2);

  let speciesRaw: string;
  let variantSource: any;

  if (isDitto(s1) && !isDitto(s2)) {
    speciesRaw = s2;           // mother / non-Ditto
    variantSource = pair.parent2;
  } else if (!isDitto(s1) && isDitto(s2)) {
    speciesRaw = s1;
    variantSource = pair.parent1;
  } else {
    if (g1 === "Female") { speciesRaw = s1; variantSource = pair.parent1; }
    else { speciesRaw = s2; variantSource = pair.parent2; }
  }

  // Base species + variant mapping
  let baseVariant = variantSource?.Variant ?? 0;
  const species = getBaseSpecies(speciesRaw);
  if (VariantBaseMap[species]) {
    baseVariant = VariantBaseMap[species][baseVariant] ?? 0;
  } else {
    baseVariant = 0;
  }

  // Shiny chance
  const shinyVariants = [1, 3, 5, 7, 9];
  const p1IsShiny = shinyVariants.includes(pair.parent1?.Variant ?? -1);
  const p2IsShiny = shinyVariants.includes(pair.parent2?.Variant ?? -1);

  let shinyChance = 1 / 500;
  if (p1IsShiny && p2IsShiny) shinyChance = 1 / 250;
  else if (p1IsShiny || p2IsShiny) shinyChance = 1 / 125;

  const babyIsShiny = Math.random() < shinyChance;
  const finalVariant = babyIsShiny ? baseVariant + 1 : baseVariant;

  // Nature from parents
  const nature1 = pair.parent1?.Nature?.[0] ?? "";
  const nature2 = pair.parent2?.Nature?.[0] ?? "";
  let finalNature = "Hardy";
  if (nature1 && nature2) finalNature = Math.random() < 0.5 ? nature1 : nature2;
  else if (nature1) finalNature = nature1;
  else if (nature2) finalNature = nature2;

  // ——— NEW: roll baby gender WITH THE SAME LOGIC as calculatePokemon (using wild.ts)
  const babyGender = rollGenderLikeCalculatePokemon(species);

  const cycles = EggCycles[species] ?? 20;
  const steps = cycles * 256;

  const egg = new ItemStack("pokeworld:breeding_egg", 1);
  egg.setLore([
    `§2Place in Offhand & Walk to Hatch`,
    `§7Species: §f${species}`,
    `§7Variant: §f${finalVariant}`,
    `§7Parent1 IVs: §a${[
      pair.parent1.IV_health, pair.parent1.IV_attack, pair.parent1.IV_defense,
      pair.parent1.IV_special_attack, pair.parent1.IV_special_defense, pair.parent1.IV_speed
    ].join(", ")}`,
    `§7Parent2 IVs: §a${[
      pair.parent2.IV_health, pair.parent2.IV_attack, pair.parent2.IV_defense,
      pair.parent2.IV_special_attack, pair.parent2.IV_special_defense, pair.parent2.IV_speed
    ].join(", ")}`,
    `§7Nature: §d${finalNature}`,
    `§7Gender: §b${babyGender}`,
    `§7Steps: §6${steps}`
  ]);
  return egg;
}

function getBaseSpecies(species: string): string {
  return EvolutionBase[species] ?? species;
}

export function checkBreeding(machine: Entity) {
  const pair = JSON.parse((machine.getDynamicProperty("pair") as string) || "null");
  if (!pair) return;

  const elapsed = world.getAbsoluteTime() - pair.startTick;
  if (elapsed >= BREED_TIME_TICKS && !pair.eggReady) {
    // mark egg ready but do not deliver yet
    pair.eggReady = true;
    machine.setDynamicProperty("pair", JSON.stringify(pair));
  }
}

system.runInterval(() => {
  for (const player of world.getPlayers()) {
    checkPlayerEggSteps(player);
  }
}, 20 * 2);

// 🕒 Check all breeding machines every minute
system.runInterval(() => {
  const dimension = world.getDimension("overworld");
  for (const entity of dimension.getEntities({ type: "pokeworld:breeding_machine" })) {
    checkBreeding(entity);
  }
}, 20 * 60); // every 60 seconds

function checkPlayerEggSteps(player: Player) {
  const equippable = player.getComponent("equippable");
  if (!equippable) return;

  const offhand = equippable.getEquipment(EquipmentSlot.Offhand);
  if (!offhand || offhand.typeId !== "pokeworld:breeding_egg") return;

  const { requiredSteps } = parseEggLore(offhand);
  const obj = world.scoreboard.getObjective("egg_steps");
  if (!obj) return;

  const steps = obj.getScore(player.scoreboardIdentity);
  if (steps >= requiredSteps) {
    tryHatchEgg(player, offhand);
  }
}

// === Hatch ===
export function tryHatchEgg(player: Player, egg: ItemStack) {
  const { species, parent1IVs, parent2IVs, nature, requiredSteps, variant, gender } = parseEggLore(egg);

  if (!pokemonList.includes(species as PokemonName)) {
    player.sendMessage(`§cInvalid species: ${species}`);
    return;
  }

  const pokeName = species as PokemonName;

  const obj = world.scoreboard.getObjective("egg_steps");
  const steps = obj?.getScore(player.scoreboardIdentity) ?? 0;

  if (steps >= requiredSteps) {
    const IVs = parent1IVs.map((v, i) =>
      Math.random() < 0.5 ? v : parent2IVs[i]
    );
    finalizeToParty(player, pokeName, IVs, nature, variant, gender);

    player.runCommand(`scoreboard players set @s egg_steps 0`);

    const equippable = player.getComponent("equippable");
    if (equippable) {
      equippable.setEquipment(EquipmentSlot.Offhand, undefined);
    }

    // Calculate IV%
const ivPercent = getIVPercentFromIVArray(IVs);

player.sendMessage(
  `§a🐣 Your egg hatched into §e${pokeName}§a!\n§7IVs: §e${ivPercent}%%`
);
  } else {
    player.sendMessage(`§eKeep walking! ${requiredSteps - steps} steps left.`);
  }
}

function parseEggLore(egg: ItemStack) {
  const lore = egg.getLore();
  let species = "Unknown";
  let p1: number[] = [];
  let p2: number[] = [];
  let nature = "Hardy";
  let steps: number | null = null;
  let variant = 0;
  let gender: GenderStr = "Unknown";

  for (const rawLine of lore) {
    // Strip Minecraft color codes (e.g., §7, §a, §f)
    const line = rawLine.replace(/§[0-9a-fk-or]/gi, "").trim();

    if (line.startsWith("Species:")) species = line.split(":")[1].trim();
    if (line.startsWith("Variant:")) variant = parseInt(line.split(":")[1]);
    if (line.startsWith("Parent1 IVs:")) p1 = line.split(":")[1].split(",").map(v => parseInt(v.trim()));
    if (line.startsWith("Parent2 IVs:")) p2 = line.split(":")[1].split(",").map(v => parseInt(v.trim()));
    if (line.startsWith("Nature:")) nature = line.split(":")[1].trim();
    if (line.startsWith("Gender:")) gender = line.split(":")[1].trim() as GenderStr;
    if (line.startsWith("Steps:")) steps = parseInt(line.split(":")[1]);
  }

  if (steps === null || isNaN(steps)) {
    throw new Error(`❗ Invalid egg lore: Steps not found or invalid!`);
  }

  return {
    species,
    parent1IVs: p1,
    parent2IVs: p2,
    nature,
    variant,
    gender,
    requiredSteps: steps,
  };
}

function finalizeToParty(
  player: Player,
  species: PokemonName,
  IVs: number[],
  nature: string,
  variant: number,
  genderFromEgg: GenderStr
) {
  const rID = ~~(Math.random() * 999999999);
  const calc = calculatePokemon(species, variant, "pokeball");

  // ✅ DEFAULT: not in PC
  calc.Box = -1;
  calc.Slot = -1;

  // nature
  let natureIndex = pokemoneNatures.values.findIndex((n) => n[2] === nature);
  if (natureIndex === -1) {
    natureIndex = pokemoneNatures.values.findIndex((n) => n[2] === "Hardy");
  }
  calc.Nature = [nature, natureIndex];
  calc.Variant = variant;

  // gender
  const gIdx = genderIndexFromString(genderFromEgg);
  calc.Gender = [genderFromEgg, gIdx];

  // IVs
  calc.IV_health = IVs[0];
  calc.IV_attack = IVs[1];
  calc.IV_defense = IVs[2];
  calc.IV_special_attack = IVs[3];
  calc.IV_special_defense = IVs[4];
  calc.IV_speed = IVs[5];

  // stats
  calc.Base_Health = ~~calculateHealth(pokemonText(species), calc.level, calc.IV_health, calc.EV_health);
  calc.Base_attack = ~~calculateNatureStat(pokemonText(species), natureIndex, calc.level, "Base_Atk", calc.IV_attack, calc.EV_attack);
  calc.Base_defense = ~~calculateNatureStat(pokemonText(species), natureIndex, calc.level, "Base_Def", calc.IV_defense, calc.EV_defense);
  calc.Base_special_attack = ~~calculateNatureStat(pokemonText(species), natureIndex, calc.level, "Base_Sp_Atk", calc.IV_special_attack, calc.EV_special_attack);
  calc.Base_special_defense = ~~calculateNatureStat(pokemonText(species), natureIndex, calc.level, "Base_Sp_Def", calc.IV_special_defense, calc.EV_special_defense);
  calc.Base_speed = ~~calculateNatureStat(pokemonText(species), natureIndex, calc.level, "Base_Spd", calc.IV_speed, calc.EV_speed);
  calc.Current_Health = calc.Base_Health;

  writePokemon(player, species, rID, calc);

  let slot = checkSidebarFree(player);

  // ===============================
  // PARTY FULL → SEND TO PC
  // ===============================
  if (slot === undefined) {
    const { box, slot: pcSlot } = findNextFreePCSlotForPlayer(player);
    calc.Box = box;
    calc.Slot = pcSlot;

    // ✅ overwrite with correct PC location
    writePokemon(player, species, rID, calc);

    player.sendMessage("§a✚ Pokémon sent to your PC.");
    return;
  }

  // ===============================
  // PARTY
  // ===============================
  const suffix = slot > 0 ? slot + 1 : "";
  if (!selected[player.name]) selected[player.name] = {};
  selected[player.name][slot] = [rID, species, calc];

  system.run(() => {
    player.runCommand(`scoreboard players set @s poke${suffix}rID ${rID}`);
    player.runCommand(`scoreboard players set @s poke${suffix}Id ${pokemonList.indexOf(species)}`);
    player.runCommand(`scoreboard players set @s poke${suffix}Ball ${Object.keys(ballTags).indexOf(calc.pokeBall)}`);
    player.runCommand(`scoreboard players set @s poke${suffix}Lvl ${calc.level}`);
    player.runCommand(`scoreboard players set @s poke${suffix}Var ${calc.Variant}`);
    player.runCommand(`scoreboard players set @s poke${suffix}HP ${calc.Current_Health}`);
    player.runCommand(`scoreboard players set @s poke${suffix}HPmax ${calc.Base_Health}`);
  });

  updateSidebar(player, slot);
  player.sendMessage("§a✚ Pokémon added to your party.");
}