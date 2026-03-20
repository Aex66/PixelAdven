/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
Aex66 (Developer)
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
__________ ___________________
\______   \\_____  \__    ___/
 |       _/ /   |   \|    |
 |    |   \/    |    \    |
 |____|_  /\_______  /____|
        \/         \/
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
© Copyright 2023 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Website: https://www.rotmc.ml
Thank you!
*/
import { Player, system, world } from "@minecraft/server";
import { ActionForm, ModalForm } from "../../../Papers/FormPaper.js";
import { longHand } from "../../Pokemon Database/@types/types.js";
import { selected } from "../../Main/Forms/PC/main.js";
import { check, checkReturn, evolve } from "./evolve.js";
import quick from "../../../quick.js";
import { Backpack } from "../../Misc/backbag.js";
import { updateSidebar } from "../../Pokemon Calculations/updateTeam";
import './commands.js';
import { getAllAvailableMoves } from "../moves.js";
import { writePokemon } from "../../Pokemon Database/main.js";
import pokemonMoves from "../../../Letters/pokemon/moves.js";
import { Pokemon } from "../../../Letters/pokemon/@types/types.js";
import { spawnPokemon } from "../spawn.js";
import { openMenu } from "../../Misc/menu.js";
import wildPokemon from "../../../Letters/pokemon/wild.js";
import pokemonList from "../../../Letters/pokemon/list.js";
import { UI_VARIANTS } from "../../../constants.js";
import { getScore } from "../../Pokemon Battles/utils.js";
import { deployed, math } from "../main.js";
import { ModalFormData } from "@minecraft/server-ui";
import { containsProfanity } from "./filters/profanity.js";
import ItemsList from "../../../Letters/pokemon/Items.js";
import AbilityList from "../../../Letters/pokemon/Abilities.js";
import GenderIndex from "../../../Letters/pokemon/Gender.js";
import TypeList from "../../../Letters/pokemon/TypeList.js";
import { pokemonGrowth } from "../../../Letters/pokemon/growth.js";
import { pokemonText } from "../../../Papers/Paragraphs/ExtrasParagraphs.js";
import { pokeBallGlyphs } from "../../Main/Forms/PC/search.js";
import { recalculatePartyStats } from "../levelingTeam.js";
import { backpackConfig } from "../../../Letters/pokemon/backpackConfig.js";
import SizeList from "../../../Letters/pokemon/SizeList.js";



type uiVars = keyof typeof quick.epics["Pokemon Database"]['$uiVars'];

export function teamUI(player: Player) {
  const form = new ActionForm(),
    values = Array(6).fill([]) as [number, string, longHand][],
    checks = [] as ([index: number, check: checkReturn, [number, string, longHand]] | [])[];

  for (let i = 0; i < 6; i++) {
    if (!selected[player.name].hasOwnProperty(`${i}`)) continue;
    values[i] = selected[player.name][i];
  }

  form.setTitle('§7§7§rYour team');

  // Track how many buttons we add
  let buttonCount = 0;

  for (let i = 0; i < 6; i++) {

    // Empty slot
    if (!values[i] || !values[i][1] || values[i][1].length < 1) {
      form.addButton(`Slot ${i + 1}\nN/A`);
      checks.push([]);
      buttonCount++;
      continue;
    }

    const evolves = check(player, i, "UI");
    checks.push([i, evolves, values[i]]);

    const iconPath =
      `${UI_VARIANTS[getScore(player, `poke${i > 0 ? i + 1 : ''}Var`)]}/` +
      `${pokemonList[getScore(player, `poke${i > 0 ? i + 1 : ''}Id`)]}`;

    const mon = values[i][2];
    const species = values[i][1];

    const displayName =
      (mon.Nickname && mon.Nickname.trim().length > 0)
        ? mon.Nickname
        : species;

    // PC-style lookup for EXP-to-next
    const wildName = pokemonText(species);
    const growthType = wildPokemon[wildName]?.Growth;
    const nextLevel =
      growthType !== undefined
        ? pokemonGrowth[growthType]?.[mon.level] ?? 0
        : 0;

    const moveDisplay = [
      mon.Move1 !== -1 ? Object.keys(pokemonMoves)[mon.Move1] : "None",
      mon.Move2 !== -1 ? Object.keys(pokemonMoves)[mon.Move2] : "None",
      mon.Move3 !== -1 ? Object.keys(pokemonMoves)[mon.Move3] : "None",
      mon.Move4 !== -1 ? Object.keys(pokemonMoves)[mon.Move4] : "None",
    ].join(", ");

    const genderDisplay = GenderIndex[mon.Gender?.[1] ?? 0] ?? "Unknown";

    const preview =
      `Lvl: ${mon.level} ${displayName}§r ${pokeBallGlyphs[mon.pokeBall] ?? ''}` +
      `\nGrowth: ${growthType ?? "N/A"}` +
      `\nSize: ${SizeList[mon.Size ?? 0] ?? 'Unknown'}` +
      `\nExp: ${nextLevel
        ? ` (${mon.Experience ?? 0}/${nextLevel})`
        : ` ${mon.Experience ?? 0}`
      }` +
      `\nNature: ${mon.Nature?.[0] ?? 'Unknown'}` +
      `\nGender: ${genderDisplay}` +
      `\nAbility: ${AbilityList[mon.Ability?.[1] ?? 0] ?? 'Unknown'}` +
      `\nTerra: ${TypeList[mon.Terra?.[1] ?? 0] ?? 'Unknown'}` +
      `\nDmax Lvl: ${mon.DMax}/10` +
      `\nTraded: ${mon.Traded}` +
      `\nFriendship: ${mon.friendShipLevel}` +
      `\nHeld Item: ${ItemsList[mon.heldItem] ?? "None"}` +
      `\n----------------------` +
      `\nBase Stats:\n${mon.Base_Health}/${mon.Base_attack}/${mon.Base_defense}/${mon.Base_special_attack}/${mon.Base_special_defense}/${mon.Base_speed}` +
      `\nIV's: ${mon.IV_health}/${mon.IV_attack}/${mon.IV_defense}/${mon.IV_special_attack}/${mon.IV_special_defense}/${mon.IV_speed}` +
      `\nEV's: ${mon.EV_health}/${mon.EV_attack}/${mon.EV_defense}/${mon.EV_special_attack}/${mon.EV_special_defense}/${mon.EV_speed}` +
      `\n----------------------` +
      `\nMoves:\n${moveDisplay}` +
      `${Array.isArray(evolves) && evolves.length >= 4
        ? evolves[3] ? ' §a(!)' : ' §c(!)'
        : ''
      }`;

    form.addButton(preview, iconPath);
    buttonCount++;
  }

  // Add Back button
  form.addButton('§8Back', 'textures/items/left_arrow.png');
  const backIndex = buttonCount;

  form.send(player, (res) => {
    if (res.canceled || res.selection === backIndex) {
      openMenu(player);
      return;
    }

    if (!checks[res.selection]?.length) {
      teamUI(player);
      return;
    }

    pokeUi(player, res.selection, checks);
  });
}


function pokeUi(
  player: Player,
  selection: number,
  checks: (
    | [index: number, check: checkReturn, [id: number, name: string, longHand: longHand]]
    | []
  )[]
) {
  const form = new ActionForm();
  form.setTitle(`§7§7§r${checks[selection][2][1]}`);

  form.addButton('Moves', 'textures/items/moves.png');
  form.addButton('Evolve', 'textures/items/evolve.png');

  const summonLabel = deployed.hasOwnProperty(player.name) ? 'Return' : 'Summon';
  form.addButton(summonLabel, 'textures/items/summon.png');

  form.addButton('Heal', 'textures/ui/bag/healing');
  form.addButton('Nickname', 'textures/items/nickname.png');
  form.addButton('Held Item', 'textures/items/held_item.png');

  // Add TM button only if player has Heart Scale
  const hasTm = hasItem('pokeworld:heart_scale', player);
  if (hasTm) {
    form.addButton('TM Moves', 'textures/items/tm_learn.png');
  }

  // ✅ Always add Back button last
  form.addButton('§8Back', 'textures/items/left_arrow.png');

  // Dynamically calculate which index is "Back"
  const backIndex = hasTm ? 7 : 6;

  form.send(player, (res) => {
    // ✅ Handle cancel or Back
    if (res.canceled || res.selection === backIndex) {
      teamUI(player);
      return;
    }

    // --- Regular selection logic ---
    if (res.selection === 0) {
      moveUI(player, checks[selection][2]);
    } else if (res.selection === 1) {
      const evolves = checks[selection][1];
      if (!Array.isArray(evolves) || evolves.length === 0) {
        player.sendMessage(`§cThis Pokémon can't evolve! Reopening menu...`);
        system.runTimeout(() => pokeUi(player, selection, checks), 40);
        return;
      }
      evolveUI(player, checks[selection][0], evolves, checks[selection][2]);
    } else if (res.selection === 2) {

      // 🚫 Block summoning in parkour
      if (player.hasTag("parkour") && !deployed.hasOwnProperty(player.name)) {
        player.sendMessage("§cYou need to leave the Parkour area to summon your Pokémon.");
        return;
      }

      const isDeployed = deployed.hasOwnProperty(player.name);

      // 🟢 SUMMON
      if (!isDeployed) {
        player.addTag("summoned");
      }
      // 🔴 RETURN
      else {
        player.removeTag("summoned");
      }

      spawnPokemon(
        player,
        checks[selection][2],
        checks[selection][0],
        false,
        () => { }
      );
    } else if (res.selection === 3) {
      healUI(player, checks[selection][2]);
    } else if (res.selection === 4) {
      nicknameUI(player, checks[selection][2]);

    } else if (res.selection === 5) {
      // ⭐ NEW: Held Item Menu
      heldItemUI(player, checks[selection][2]);

    } else if (hasTm && res.selection === 6) {
      tmUI(player, checks[selection][2]);
    }
  });
}

function nicknameUI(player: Player, data: [id: number, name: string, longHand: longHand]) {
  const [dex, monName, mon] = data;

  // ❌ Prevent nickname changes for traded Pokémon
  if (mon.Traded) {
    player.sendMessage(`§cYou cannot rename traded Pokémon!`);
    pokeUi(player, findSelectedIndex(player, data), rebuildChecks(player));
    return;
  }

  const form = new ModalFormData();
  form.title(`Nickname ${monName}`);
  form.textField("Enter a new nickname:", mon.Nickname ?? "Leave empty to reset");

  // ✅ Add a Back button (ModalFormData doesn't have buttons, so we simulate)
  // If the player leaves the input empty and cancels, it counts as Back.

  form.show(player).then((res) => {
    if (res.canceled) {
      // ✅ Go back to Pokémon menu
      pokeUi(player, findSelectedIndex(player, data), rebuildChecks(player));
      return;
    }

    const input = (res.formValues[0] as string || "").trim();

    // ✅ Back shortcut — if input typed as 'back', return
    if (input.toLowerCase() === "back") {
      pokeUi(player, findSelectedIndex(player, data), rebuildChecks(player));
      return;
    }

    // ✅ Length restriction
    if (input.length > 16) {
      player.sendMessage("§cNicknames can be at most 16 characters long!");
      return nicknameUI(player, data);
    }

    // ✅ Profanity + character filter
    const validChars = /^[a-zA-Z0-9\s\-'._]*$/;
    if (containsProfanity(input) || !validChars.test(input)) {
      player.sendMessage("§cThat nickname is not allowed!");
      return nicknameUI(player, data);
    }

    // ✅ Empty = reset nickname
    if (input.length === 0) {
      delete mon.Nickname;
      player.sendMessage(`§e${monName}'s nickname was reset.`);
    } else {
      mon.Nickname = input;
      player.sendMessage(`§a${monName} is now nicknamed §f${input}`);
    }

    // ✅ Save + refresh + go back
    writePokemon(player, monName, dex, mon);
    updateSidebar(player);
    pokeUi(player, findSelectedIndex(player, data), rebuildChecks(player));
  });
}


/* =========================
   HEALING + PP RESTORATION
   ========================= */

type HealItemEffect = (mon: longHand, player?: Player, monName?: string, dex?: number) =>
  { hpHealed?: number; statusCleared?: boolean; fullyHealed?: boolean; ppRestored?: boolean; evReduced?: boolean; };

function applyHeal(mon: longHand, amount: number): number {
  const before = Number(mon.Current_Health ?? 0);
  const base = Number(mon.Base_Health ?? 0) || 0;
  const after = Math.min(base, before + Math.max(0, amount));
  mon.Current_Health = after;
  return Math.max(0, after - before);
}

function healToFull(mon: longHand): number {
  const before = Number(mon.Current_Health ?? 0);
  const base = Number(mon.Base_Health ?? 0) || 0;
  mon.Current_Health = base;
  return Math.max(0, base - before);
}

function clearStatus(mon: longHand): boolean {
  const hadStatus = Number(mon.condition ?? 0) !== 0;
  mon.condition = 0 as any;
  return hadStatus;
}

type EVKey =
  | "EV_health"
  | "EV_attack"
  | "EV_defense"
  | "EV_special_attack"
  | "EV_special_defense"
  | "EV_speed";

function reduceEV(mon: longHand, key: EVKey, amount = 10): boolean {
  const current = mon[key];
  if (current <= 0) return false;
  mon[key] = Math.max(0, current - amount);
  return true;
}

type MoveKey = "Move1" | "Move2" | "Move3" | "Move4";
type PpKey = "Move1_PP" | "Move2_PP" | "Move3_PP" | "Move4_PP";

function restorePP(mon: longHand, moveSlot: number, amount: number): boolean {
  const moveProp = `Move${moveSlot}` as MoveKey;
  const ppProp = `Move${moveSlot}_PP` as PpKey;

  const id = mon[moveProp];
  if (id === -1) return false;

  const moveName = Object.keys(pokemonMoves)[id];
  const maxPP = Number(pokemonMoves[moveName]?.pp ?? 10);
  const currentPP = Number(mon[ppProp]) || 0;

  if (currentPP >= maxPP) return false;

  mon[ppProp] = Math.min(maxPP, currentPP + amount);
  return true;
}

function restoreAllPP(mon: longHand, amount?: number): boolean {
  let changed = false;
  const moveProps: MoveKey[] = ["Move1", "Move2", "Move3", "Move4"];
  const ppProps: PpKey[] = ["Move1_PP", "Move2_PP", "Move3_PP", "Move4_PP"];

  for (let i = 0; i < 4; i++) {
    const id = mon[moveProps[i]];
    if (id === -1) continue;

    const moveName = Object.keys(pokemonMoves)[id];
    const maxPP = Number(pokemonMoves[moveName]?.pp ?? 10);
    const currentPP = Number(mon[ppProps[i]]) || 0;

    if (currentPP < maxPP) {
      mon[ppProps[i]] = amount ? Math.min(maxPP, currentPP + amount) : maxPP;
      changed = true;
    }
  }
  return changed;
}

/* === Item Effects === */
const HEAL_ITEM_EFFECTS: Record<string, HealItemEffect> = {
  // Healing
  "pokeworld:potion": (m) => ({ hpHealed: applyHeal(m, 20) }),
  "pokeworld:super_potion": (m) => ({ hpHealed: applyHeal(m, 50) }),
  "pokeworld:hyper_potion": (m) => ({ hpHealed: applyHeal(m, 200) }),
  "pokeworld:max_potion": (m) => ({ hpHealed: healToFull(m), fullyHealed: true }),
  "pokeworld:full_restore": (m) => ({ hpHealed: healToFull(m), statusCleared: clearStatus(m), fullyHealed: true }),

  // Revives
  "pokeworld:revive": (m) => ({ hpHealed: applyHeal(m, Math.floor((m.Base_Health ?? 0) / 2)) }),
  "pokeworld:max_revive": (m) => ({ hpHealed: healToFull(m), fullyHealed: true }),

  // Status
  "pokeworld:full_heal": (m) => ({ statusCleared: clearStatus(m) }),
  "pokeworld:antidote": (m) => ({ statusCleared: clearStatus(m) }),
  "pokeworld:paralyze_heal": (m) => ({ statusCleared: clearStatus(m) }),
  "pokeworld:burn_heal": (m) => ({ statusCleared: clearStatus(m) }),
  "pokeworld:ice_heal": (m) => ({ statusCleared: clearStatus(m) }),
  "pokeworld:awakening": (m) => ({ statusCleared: clearStatus(m) }),

  // PP Restoring (prompt handled separately in healUI)
  "pokeworld:ether": () => ({ ppRestored: true }),
  "pokeworld:max_ether": () => ({ ppRestored: true }),
  "pokeworld:leppa_berry": () => ({ ppRestored: true }),
  "pokeworld:elixir": (m) => ({ ppRestored: restoreAllPP(m, 10) }),
  "pokeworld:max_elixir": (m) => ({ ppRestored: restoreAllPP(m) }),

  // Berries
  "pokeworld:oran_berry": (m) => ({ hpHealed: applyHeal(m, 10) }),
  "pokeworld:sitrus_berry": (m) => {
    const base = Number(m.Base_Health ?? 0) || 0;
    return { hpHealed: applyHeal(m, Math.floor(base * 0.25)) };
  },
  "pokeworld:lum_berry": (m) => ({ statusCleared: clearStatus(m) }),
  "pokeworld:pecha_berry": (m) => ({ statusCleared: clearStatus(m) }),
  "pokeworld:cheri_berry": (m) => ({ statusCleared: clearStatus(m) }),
  "pokeworld:aspear_berry": (m) => ({ statusCleared: clearStatus(m) }),
  "pokeworld:chesto_berry": (m) => ({ statusCleared: clearStatus(m) }),
  "pokeworld:rawst_berry": (m) => ({ statusCleared: clearStatus(m) }),
  /* =========================
   EV REDUCING BERRIES
   ========================= */

  "pokeworld:pomeg_berry": (m) => ({ evReduced: reduceEV(m, "EV_health") }),
  "pokeworld:kelpsy_berry": (m) => ({ evReduced: reduceEV(m, "EV_attack") }),
  "pokeworld:qualot_berry": (m) => ({ evReduced: reduceEV(m, "EV_defense") }),
  "pokeworld:hondew_berry": (m) => ({ evReduced: reduceEV(m, "EV_special_attack") }),
  "pokeworld:grepa_berry": (m) => ({ evReduced: reduceEV(m, "EV_special_defense") }),
  "pokeworld:tamato_berry": (m) => ({ evReduced: reduceEV(m, "EV_speed") })
};

/* === Heal UI === */
function healUI(player: Player, data: [id: number, name: string, longHand: longHand]) {
  const [dex, monName, mon] = data;
  const backpack = new Backpack(player);
  backpack.update();

  const fainted = Number(mon.Current_Health ?? 0) <= 0;
  const items = getAvailableHealingItems(backpack, mon);

  const form = new ActionForm();
  form.setTitle(`§7§7§rHeal ${monName}`);

  if (items.length === 0) {
    if (fainted) {
      form.setBody(`§c${monName} has fainted!\n§7You must use a Revive or Max Revive.`);
    } else {
      form.setBody("§7You have no usable healing items or berries in your Backpack.");
    }
    form.addButton("§8Back");
  } else {
    if (fainted) {
      form.setBody(`§c${monName} has fainted!\n§7Choose a Revive item to restore it.`);
    } else {
      form.setBody(`§7Choose an item to use on §f${monName}`);
    }

    for (const itm of items) {
      if (itm.icon) form.addButton(`${itm.name} §8(x${itm.count})`, itm.icon);
      else form.addButton(`${itm.name} §8(x${itm.count})`);
    }
    form.addButton("§8Back", "textures/items/left_arrow.png"); // ✅ Added back button
  }

  form.send(player, (res) => {
    if (res.canceled) {
      // ✅ If closed, return to Pokémon menu
      pokeUi(player, findSelectedIndex(player, data), rebuildChecks(player));
      return;
    }

    // ✅ If last button (Back) pressed
    if (res.selection === items.length) {
      pokeUi(player, findSelectedIndex(player, data), rebuildChecks(player));
      return;
    }

    const chosen = items[res.selection];

    // PP restoration items handled separately
    if (["pokeworld:ether", "pokeworld:max_ether", "pokeworld:leppa_berry"].includes(chosen.id)) {
      ppRestorePrompt(player, mon, monName, dex, chosen.id);
      return;
    }

    const effect = HEAL_ITEM_EFFECTS[chosen.id];
    if (!effect) {
      healUI(player, data);
      return;
    }

    const beforeHP = Number(mon.Current_Health ?? 0);
    const beforeCond = Number(mon.condition ?? 0);
    const result = effect(mon, player, monName, dex) || {};

    const healed = result.fullyHealed
      ? (Number(mon.Base_Health ?? 0) - beforeHP)
      : (result.hpHealed ?? 0);
    const statusCleared = !!result.statusCleared && beforeCond !== 0;

    if (
      healed <= 0 &&
      !statusCleared &&
      !result.ppRestored &&
      !result.evReduced
    ) {
      player.sendMessage("§7Nothing happened.");
      healUI(player, data);
      return;
    }

    // ✅ EV berry feedback
    if (result.evReduced) {
      const species = pokemonText(monName);

      recalculatePartyStats(mon, species);

      player.sendMessage(`§a${monName}'s EVs were reduced!`);
    }

    // Consume item
    let used = false;
    for (const category of ["Healing", "Berries"] as const) {
      const cat = backpack.getCategory(category as any);
      if (cat && cat[chosen.id] > 0) {
        backpack.removeItem(category as any, chosen.id, 1);
        backpack.save();
        used = true;
        break;
      }
    }
    if (!used) {
      healUI(player, data);
      return;
    }

    writePokemon(player, monName, dex, mon);
    updateSidebar(player);

    if (statusCleared && healed > 0) {
      player.sendMessage(`§a${monName} recovered §f${healed} HP §aand is cured of status!`);
    } else if (statusCleared) {
      player.sendMessage(`§a${monName} is cured of status!`);
    } else if (healed > 0) {
      player.sendMessage(`§a${monName} recovered §f${healed} HP!`);
    } else if (result.ppRestored) {
      player.sendMessage(`§a${monName}'s move PP was restored!`);
    }

    system.runTimeout(() => healUI(player, [dex, monName, mon]), 10);
  });
}

/* === PP Restore Prompt === */
function ppRestorePrompt(player: Player, mon: longHand, monName: string, dex: number, itemId: string) {
  const form = new ModalForm();
  form.setTitle("Choose a move to restore PP");

  const moves: string[] = [];
  for (let i = 1; i <= 4; i++) {
    const id = mon[`Move${i}` as keyof longHand] as number;
    if (id === -1) {
      moves.push("Empty");
      continue;
    }
    const moveName = Object.keys(pokemonMoves)[id];
    const maxPP = Number(pokemonMoves[moveName]?.pp ?? 10);
    const currentPP = Number(mon[`Move${i}_PP` as keyof longHand]) || maxPP;
    moves.push(`${moveName} (${currentPP}/${maxPP})`);
  }

  form.addDropdown("Move", moves, 0);

  form.send(player, (res) => {
    if (res.canceled) {
      // ✅ Return to Heal UI if closed
      healUI(player, [dex, monName, mon]);
      return;
    }

    const choice = res.formValues[0];
    if (choice == null) {
      healUI(player, [dex, monName, mon]);
      return;
    }

    let restored = false;
    if (itemId === "pokeworld:ether") restored = restorePP(mon, choice + 1, 10);
    if (itemId === "pokeworld:max_ether") restored = restorePP(mon, choice + 1, 999);
    if (itemId === "pokeworld:leppa_berry") restored = restorePP(mon, choice + 1, 10);

    if (!restored) {
      player.sendMessage("§7Nothing happened.");
      healUI(player, [dex, monName, mon]);
      return;
    }

    // Consume item
    const backpack = new Backpack(player);
    for (const category of ["Healing", "Berries"] as const) {
      const cat = backpack.getCategory(category as any);
      if (cat && cat[itemId] > 0) {
        backpack.removeItem(category as any, itemId, 1);
        backpack.save();
        break;
      }
    }

    writePokemon(player, monName, dex, mon);
    updateSidebar(player);
    player.sendMessage(`§a${monName}'s ${moves[choice].split(" ")[0]} PP was restored!`);

    system.runTimeout(() => healUI(player, [dex, monName, mon]), 10);
  });
}

/* === Helpers === */
function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

function getAvailableHealingItems(backpack: Backpack, mon: longHand): { id: string; name: string; count: number; icon?: string }[] {
  const fainted = (Number(mon.Current_Health ?? 0) <= 0);
  const out: { id: string; name: string; count: number; icon?: string }[] = [];

  for (const category of ["Healing", "Berries"] as const) {
    const cat = backpack.getCategory(category as any);
    if (!cat) continue;

    const cfgList = (backpackConfig as any)?.[category] as { id: string; displayName: string; texturePath?: string }[] | undefined;

    for (const itemID of Object.keys(cat)) {
      const count = cat[itemID] ?? 0;
      if (count <= 0) continue;
      if (!(itemID in HEAL_ITEM_EFFECTS)) continue;
      if (fainted && !(itemID.includes("revive"))) continue;

      const match = cfgList?.find(i => i.id === itemID);
      const display = match?.displayName ?? capitalizeWords(itemID.split(":")[1].replace(/_/g, " "));
      const icon = match?.texturePath;
      out.push({ id: itemID, name: display, count, icon });
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

function findSelectedIndex(player: Player, data: [id: number, name: string, longHand: longHand]): number {
  for (let i = 0; i < 6; i++) {
    const slot = selected[player.name]?.[i];
    if (slot && slot[0] === data[0] && slot[1] === data[1]) return i;
  }
  return 0;
}

function rebuildChecks(player: Player) {
  const checks = [] as ([index: number, check: checkReturn, [number, string, longHand]] | [])[];
  for (let i = 0; i < 6; i++) {
    const val = selected[player.name]?.[i];
    if (!val) { checks.push([]); continue; }
    checks.push([i, check(player, i, "UI"), val]);
  }
  return checks;
}

/* =========================
   HELD ITEM EQUIP UI
   ========================= */

function heldItemUI(player: Player, pokemonData: [number, string, longHand]) {
  const [dex, monName, mon] = pokemonData;

  const inventory = player.getComponent("minecraft:inventory")?.container;
  if (!inventory) {
    player.sendMessage("§cUnable to access your inventory.");
    pokeUi(player, findSelectedIndex(player, pokemonData), rebuildChecks(player));
    return;
  }

  // Build list of held items the player physically has
  const available: {
    index: number;          // numeric ItemID
    name: string;           // raw ItemsList string
    mcItemId: string;       // pokeworld:<item>
    display: string;
  }[] = [];

  for (let i = 1; i < ItemsList.length; i++) {
    const rawName = ItemsList[i];
    if (!rawName || rawName === "EMPTY") continue;

    const mcItemId = "pokeworld:" + rawName.toLowerCase();

    // Does player have this item?
    let found = false;
    for (let slot = 0; slot < inventory.size; slot++) {
      const stack = inventory.getItem(slot);
      if (stack && stack.typeId === mcItemId) {
        found = true;
        break;
      }
    }

    if (found) {
      available.push({
        index: i,
        name: rawName,
        mcItemId,
        display: rawName.replace(/_/g, " ")
      });
    }
  }

  // Build UI
  const form = new ActionForm();
  form.setTitle(`§eHeld Item: ${monName}`);

  if (available.length === 0) {
    form.setBody("§7You do not have any held items in your inventory.");
    form.addButton("§8Back");
  } else {
    form.setBody("§7Choose an item to give to this Pokémon.");

    available.forEach(item => {
      form.addButton(item.display);
    });

    form.addButton("§8Back", "textures/items/left_arrow.png");
  }

  form.send(player, (res) => {
    if (res.canceled || res.selection === available.length) {
      pokeUi(player, findSelectedIndex(player, pokemonData), rebuildChecks(player));
      return;
    }

    const chosen = available[res.selection];
    if (!chosen) {
      pokeUi(player, findSelectedIndex(player, pokemonData), rebuildChecks(player));
      return;
    }

    /* =========================
       REMOVE ITEM FROM INVENTORY
       ========================= */
    for (let i = 0; i < inventory.size; i++) {
      const stack = inventory.getItem(i);
      if (!stack || stack.typeId !== chosen.mcItemId) continue;

      if (stack.amount === 1) {
        inventory.setItem(i, undefined); // remove stack entirely
      } else {
        stack.amount = stack.amount - 1; // safe: still ≥ 1
        inventory.setItem(i, stack);
      }
      break;
    }

    /* =========================
       RETURN PREVIOUS HELD ITEM
       ========================= */
    if (mon.heldItem && mon.heldItem !== 0) {
      const prevName = ItemsList[mon.heldItem];
      if (prevName && prevName !== "EMPTY") {
        const prevMC = "pokeworld:" + prevName.toLowerCase();
        player.runCommand(`give @s ${prevMC}`);
      }
    }

    /* =========================
       SET NEW HELD ITEM
       ========================= */
    mon.heldItem = chosen.index;

    writePokemon(player, monName, dex, mon);

    player.sendMessage(`§a${monName} is now holding §e${chosen.display}§a!`);

    pokeUi(player, findSelectedIndex(player, pokemonData), rebuildChecks(player));
  });
}

/* =========================
   TM UI (with Back + Cancel)
   ========================= */
function tmUI(player: Player, data: [id: number, name: string, longHand: longHand]) {
  const form = new ModalForm();
  form.setTitle(`Teach TMs to ${data[1]}`);

  const wildKey = `pokeworld:wild_${data[1].toLowerCase()}`;
  const wildData = wildPokemon[wildKey];
  const tempMoves = wildData?.tm_moves;

  if (!tempMoves) {
    player.sendMessage(`§cThis Pokémon has no TM moves available.`);
    return;
  }

  // 🔑 Proper range matching (0-1, 2-3, or single numbers)
  let variantKey: string | undefined;
  for (const key of Object.keys(tempMoves)) {
    const parts = key.split("-").map(Number);
    if (parts.length === 1 && parts[0] === data[2].Variant) {
      variantKey = key;
      break;
    }
    if (parts.length === 2) {
      const [min, max] = parts;
      if (data[2].Variant >= min && data[2].Variant <= max) {
        variantKey = key;
        break;
      }
    }
  }

  if (!variantKey) {
    //console.warn(`[TM Moves] No variant key matched for ${wildKey} (variant=${data[2].Variant}), using fallback`);
    variantKey = Object.keys(tempMoves)[0];
  }

  const TmMoves = tempMoves[variantKey] ?? [];
  if (!TmMoves.length) {
    player.sendMessage(`§cThis Pokémon has no TM moves available for variant ${data[2].Variant}.`);
    return;
  }

  const keys = Object.keys(pokemonMoves);
  const options = ["(Keep current)", ...TmMoves];
  const currentIndices = [data[2].Move1, data[2].Move2, data[2].Move3, data[2].Move4];
  const currentMoveNames = currentIndices.map(index => findMoveFromIndex(index)?.[0] ?? "None");

  for (let i = 0; i < 4; i++) {
    form.addDropdown(`Slot ${i + 1}: ${currentMoveNames[i]}`, options, 0);
  }

  // ✅ Add Back button
  form.addDropdown("Back (cancel changes)", ["No", "Yes"], 0);

  form.send(player, (res) => {
    if (res.canceled) {
      // ✅ Return to previous menu
      pokeUi(player, findSelectedIndex(player, data), rebuildChecks(player));
      return;
    }

    const wantsBack = res.formValues[4] === 1;
    if (wantsBack) {
      pokeUi(player, findSelectedIndex(player, data), rebuildChecks(player));
      return;
    }

    const inventory = player.getComponent("minecraft:inventory")?.container;
    if (!inventory) {
      player.sendMessage("§cCould not access player inventory.");
      return;
    }

    const plannedChanges: {
      slot: number;
      moveProp: keyof longHand;
      ppProp: keyof longHand;
      newMoveIndex: number;
      newMoveName: string;
      oldMoveName: string;
      newPP: number;
    }[] = [];

    for (let i = 0; i < 4; i++) {
      const selected = res.formValues[i];
      if (selected === 0) continue;

      const selectedName = TmMoves[selected - 1];
      const selectedIndex = keys.indexOf(selectedName);
      const moveProp = `Move${i + 1}` as keyof longHand;
      const ppProp = `Move${i + 1}_PP` as keyof longHand;

      const currentMoveIndex = data[2][moveProp] as number;
      if (currentMoveIndex === selectedIndex) continue;

      const oldMoveData = findMoveFromIndex(currentMoveIndex);
      const newMaxPP = Number(pokemonMoves[selectedName]?.pp ?? 10);

      plannedChanges.push({
        slot: i + 1,
        moveProp,
        ppProp,
        newMoveIndex: selectedIndex,
        newMoveName: selectedName,
        oldMoveName: oldMoveData?.[0] ?? "None",
        newPP: newMaxPP,
      });
    }

    if (plannedChanges.length === 0) {
      player.sendMessage("§eNo moves were changed.");
      pokeUi(player, findSelectedIndex(player, data), rebuildChecks(player));
      return;
    }

    // 🔑 Heart Scale payment system (unchanged)
    let coinCount = 0;
    const coinSlots: number[] = [];
    for (let i = 0; i < inventory.size; i++) {
      const item = inventory.getItem(i);
      if (item?.typeId === "pokeworld:heart_scale") {
        coinCount += item.amount;
        coinSlots.push(i);
      }
    }

    if (coinCount < plannedChanges.length) {
      player.sendMessage(`§cYou need ${plannedChanges.length} Heart Scale(s), but only have ${coinCount}.`);
      pokeUi(player, findSelectedIndex(player, data), rebuildChecks(player));
      return;
    }

    let coinsToRemove = plannedChanges.length;
    for (const slot of coinSlots) {
      if (coinsToRemove <= 0) break;
      const item = inventory.getItem(slot);
      if (!item) continue;

      if (item.amount <= coinsToRemove) {
        coinsToRemove -= item.amount;
        inventory.setItem(slot, undefined);
      } else {
        item.amount -= coinsToRemove;
        inventory.setItem(slot, item);
        coinsToRemove = 0;
      }
    }

    if (coinsToRemove > 0) {
      player.sendMessage("§cAn error occurred while removing Heart Scales.");
      pokeUi(player, findSelectedIndex(player, data), rebuildChecks(player));
      return;
    }

    // Apply TM changes
    const newData: [id: number, name: string, longHand: longHand] = [...data];
    for (const change of plannedChanges) {
      (newData[2] as any)[change.moveProp] = change.newMoveIndex;
      (newData[2] as any)[change.ppProp] = change.newPP;
    }

    writePokemon(player, newData[1], newData[0], newData[2]);

    player.sendMessage(`§6Updated TM Moves for ${data[1]}:`);
    for (const change of plannedChanges) {
      player.sendMessage(`§a + Slot ${change.slot}: §f${change.newMoveName}\n§c - Replaced: §f${change.oldMoveName}`);
    }

    pokeUi(player, findSelectedIndex(player, data), rebuildChecks(player)); // ✅ Return after update
  });
}


export function findMoveFromIndex(moveIndex: number): [string, number, Pokemon.Move | undefined] {
  if (moveIndex === -1) return ['', -1, undefined];
  const keys = Object.keys(pokemonMoves);
  return [keys[moveIndex], moveIndex, pokemonMoves[keys[moveIndex]]];
}

function moveUI(player: Player, data: [id: number, name: string, longHand: longHand]) {
  const form = new ModalForm();
  form.setTitle(`Pokemon: ${data[1]}`);

  const keys = Object.keys(pokemonMoves);
  const availableMoves = getAllAvailableMoves(data[1], data[2].level, data[2].Variant);

  if (!availableMoves || availableMoves.length === 0) {
    player.sendMessage(`§cNo moves available for ${data[1]} (variant ${data[2].Variant})`);
    return;
  }

  // TM-style options
  const options = ["(Keep current)", ...availableMoves.map(m => m[0])];

  const currentMoveIndices = [
    data[2].Move1,
    data[2].Move2,
    data[2].Move3,
    data[2].Move4,
  ];

  const currentMoveNames = currentMoveIndices.map(
    idx => findMoveFromIndex(idx)?.[0] ?? "None"
  );

  // Build dropdowns
  for (let i = 0; i < 4; i++) {
    form.addDropdown(
      `Slot ${i + 1}: ${currentMoveNames[i]}`,
      options,
      0
    );
  }

  // Back option
  form.addDropdown("Back (cancel changes)", ["No", "Yes"], 0);

  form.send(player, (res) => {
    if (res.canceled) {
      pokeUi(player, findSelectedIndex(player, data), rebuildChecks(player));
      return;
    }

    const wantsBack = res.formValues[4] === 1;
    if (wantsBack) {
      pokeUi(player, findSelectedIndex(player, data), rebuildChecks(player));
      return;
    }

    const selectedMoves = res.formValues.slice(0, 4);

    // ============================
    // ✅ Duplicate prevention (ID-based)
    // ============================
    const chosenMoveIds: number[] = [];

    for (let i = 0; i < 4; i++) {
      const selected = selectedMoves[i];
      if (selected === 0) continue; // Keep current

      const moveName = options[selected];
      const moveId = keys.indexOf(moveName);
      if (moveId === -1) continue;

      if (chosenMoveIds.includes(moveId)) {
        const firstSlot = chosenMoveIds.indexOf(moveId) + 1;

        player.sendMessage(
          `§cYou can't have 2 of the same moves.\n` +
          `§cMove: ${moveName}\n` +
          `§cSlot: ${firstSlot} & ${i + 1}\n\n` +
          `§6Opening Form Again In 3s`
        );

        system.runTimeout(() => moveUI(player, data), 60);
        return;
      }

      chosenMoveIds.push(moveId);
    }

    // ============================
    // Apply changes
    // ============================
    const newData: [id: number, name: string, longHand: longHand] = [...data];

    for (let i = 0; i < 4; i++) {
      const selected = selectedMoves[i];
      if (selected === 0) continue; // Keep current

      const moveProp = `Move${i + 1}` as keyof longHand;
      const ppProp = `Move${i + 1}_PP` as keyof longHand;

      const oldMove = findMoveFromIndex(data[2][moveProp] as number);
      const oldMax = Number(oldMove?.[2]?.pp ?? 10);
      const oldCurrent = Number(data[2][ppProp]) || oldMax;
      const ratio = Math.max(0, Math.min(1, oldCurrent / oldMax));

      const newMoveName = options[selected];
      const newMoveIndex = keys.indexOf(newMoveName);
      const newMax = Number(pokemonMoves[newMoveName]?.pp ?? 10);
      const newCurrent = Math.floor(newMax * ratio);

      (newData[2] as any)[moveProp] = newMoveIndex;
      (newData[2] as any)[ppProp] = newCurrent;
    }

    writePokemon(player, newData[1], newData[0], newData[2]);

    player.sendMessage(
      `§6Updated Moves For ${newData[1]}\n` +
      `§eMove 1:§f ${keys[newData[2].Move1] ?? "None"}\n` +
      `§eMove 2:§f ${keys[newData[2].Move2] ?? "None"}\n` +
      `§eMove 3:§f ${keys[newData[2].Move3] ?? "None"}\n` +
      `§eMove 4:§f ${keys[newData[2].Move4] ?? "None"}\n`
    );

    pokeUi(player, findSelectedIndex(player, data), rebuildChecks(player));
  });
}
function hasItem(itemId: string, player: Player): boolean {
  let inventory = player.getComponent('inventory').container
  let hasItem = false
  for (let i = 0; i < inventory.size; i++) {
    let slot = inventory.getSlot(i)
    let itemStack = slot.getItem()
    if (!itemStack) continue;
    if (itemStack.typeId == itemId) {
      hasItem = true
      break;
    }
  }
  return hasItem
}

/* =========================
   EVOLVE UI (with Back + Cancel)
   ========================= */
function evolveUI(
  player: Player,
  index: number,
  data: checkReturn,
  pokemon: [id: number, name: string, longHand: longHand]
) {
  const form = new ActionForm();
  form.setTitle(`§a§l${pokemon[1]}`);

  form.setBody(
    Object.entries(data[2])
      .map(([key, value]) => {
        const [met, required, current] = value;
        return `§l§f[${met ? "§a✓" : "§c×"}§f] ${key[0].toUpperCase() + key.slice(1)} ` +
          `(${met ? "§a" : "§c"}${current}§e / §a${required}§f)`;
      })
      .join("\n")
  );

  if (data[3]) form.addButton("§aEvolve", "textures/items/evolve.png");
  form.addButton("§8Back", "textures/items/left_arrow.png"); // ✅ Back button

  form.send(player, (res) => {
    if (res.canceled) {
      // ✅ Return on cancel
      teamUI(player);
      return;
    }

    // ✅ Back button pressed or no evolve ready
    if ((!data[3] && res.selection === 0) || res.selection === 1) {
      teamUI(player);
      return;
    }

    // ✅ Trigger evolution if requirements met
    if (data[3] && res.selection === 0) {
      evolve(player, index, "UI");
    } else {
      teamUI(player);
    }
  });
}


