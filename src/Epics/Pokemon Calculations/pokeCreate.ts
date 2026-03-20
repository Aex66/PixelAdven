import { Player, system, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import pokemonList from "../../Letters/pokemon/list";
import pokemoneNatures from "../../Letters/pokemon/natures";
import TypeList from "../../Letters/pokemon/TypeList";
import { pokemonText, sleep } from "../../Papers/Paragraphs/ExtrasParagraphs";
import { longHand } from "../Pokemon Database/@types/types";
import wildPokemon from "../../Letters/pokemon/wild";
import { calculateHealth, calculateNatureStat } from "./functions";
import { writePokemon } from "../Pokemon Database/main";
import { selected } from "../Main/Forms/PC/main";
import { PokemonName, checkSidebarFree } from "./calculations";
import { getRandomMoves } from "./moves";
import { ballTags } from "./catch";
import { openMenu } from "../Misc/menu";
import AbilityList from "../../Letters/pokemon/Abilities";
import GenderIndex from "../../Letters/pokemon/Gender";
import { findNextFreePCSlotForPlayer } from "../Pokemon Database/PcControls";

// EV Slider Update

export async function openCreateMenu(
  player: Player,
  PokemonName?: string,
  pokeLevel?: number,
  variant?: number,
  nature?: number,
  terra?: number,
  ability?: number,
  IV_HP?: number,
  IV_Atk?: number,
  IV_Def?: number,
  IV_Sp_Atk?: number,
  IV_Sp_Def?: number,
  IV_Spd?: number,
  EV_HP?: number,
  EV_Atk?: number,
  EV_Def?: number,
  EV_Sp_Atk?: number,
  EV_Sp_Def?: number,
  EV_Spd?: number
) {
  if (!PokemonName) {
    const nameForm = new ModalFormData()
      .title("Pokemon Creator")
      .textField("Enter Pokémon Name", "Charmander");

    const nameResponse = await nameForm.show(player as any);
    if (nameResponse.canceled) {
      openMenu(player);
      return;
    }

    const inputName = String(nameResponse.formValues?.[0] ?? "").trim();
    if (!inputName) {
      player.sendMessage("§cYou must enter a Pokémon name.");
      await sleep(20);
      return openCreateMenu(player);
    }

    return openCreateMenu(player, inputName);
  }

  const form = new ModalFormData();
  form.title(`Create ${PokemonName}`);

  let natures: string[] = [];
  let terras: string[] = [];

  // Prepare Nature and Terra options
  pokemoneNatures.values.forEach((i) => natures.push(i[2]));
  TypeList.forEach((i) => terras.push(i));

  // ✅ Filter ability list based on the current Pokémon
  const wildId = `pokeworld:wild_${PokemonName.toLowerCase()}`;
  const abilityData = wildPokemon[wildId]?.Abilities;
  let abilityOptions: string[] = [];

  if (abilityData && typeof abilityData === "object" && !Array.isArray(abilityData)) {
    const abilityMap = abilityData as Record<string, (string | null)[]>;
    const uniqueAbilities = new Set<string>();
    for (const group of Object.values(abilityMap)) {
      for (const ability of group) {
        if (typeof ability === "string") uniqueAbilities.add(ability);
      }
    }
    abilityOptions = [...uniqueAbilities];
  } else if (Array.isArray(abilityData)) {
    abilityOptions = abilityData.filter((a): a is string => typeof a === "string");
  }

  // ✅ Build Gender dropdown options
  const genderData = wildPokemon[wildId]?.Gender as [number, string][] | undefined;
  let genderOptions: string[] = ["Genderless"]; // default
  if (Array.isArray(genderData) && genderData.length > 0) {
    const names = [...new Set(genderData.map(([, g]) => g))];
    // Ensure consistent order Male/Female if both present
    if (names.includes("Male") || names.includes("Female")) {
      genderOptions = [];
      if (names.includes("Male")) genderOptions.push("Male");
      if (names.includes("Female")) genderOptions.push("Female");
      if (names.includes("Genderless") && genderOptions.length === 0) genderOptions = ["Genderless"];
    } else if (names.includes("Genderless")) {
      genderOptions = ["Genderless"];
    }
  }

  //@ts-ignore
  form.slider("Level", 5, 100, { step: 1, defaultValue: pokeLevel ?? 5 }); //@ts-ignore
  form.slider("Variant", 0, 8, { step: 1, defaultValue: variant ?? 0 }); //@ts-ignore
  form.dropdown("Nature", natures, { defaultValue: nature ?? 0 }); //@ts-ignore
  form.dropdown("Terra", terras, { defaultValue: terra ?? 0 }); //@ts-ignore
  form.dropdown("Ability", abilityOptions.length > 0 ? abilityOptions : ["None"], { defaultValue: ability ?? 0 }); //@ts-ignore
  form.dropdown("Gender", genderOptions, { defaultValue: 0 }); //@ts-ignore  <-- NEW (index 5)

  form.slider("IV Health", pokemoneNatures.constants.IV_HP[0], pokemoneNatures.constants.IV_HP[1], { step: 1, defaultValue: IV_HP ?? 0 }); //@ts-ignore
  form.slider("IV Attack", pokemoneNatures.constants.IV_Atk[0], pokemoneNatures.constants.IV_Atk[1], { step: 1, defaultValue: IV_Atk ?? 0 }); //@ts-ignore
  form.slider("IV Defense", pokemoneNatures.constants.IV_Def[0], pokemoneNatures.constants.IV_Def[1], { step: 1, defaultValue: IV_Def ?? 0 }); //@ts-ignore
  form.slider("IV Special Attack", pokemoneNatures.constants.IV_Sp_Atk[0], pokemoneNatures.constants.IV_Sp_Atk[1], { step: 1, defaultValue: IV_Sp_Atk ?? 0 }); //@ts-ignore
  form.slider("IV Special Defense", pokemoneNatures.constants.IV_Sp_Def[0], pokemoneNatures.constants.IV_Sp_Def[1], { step: 1, defaultValue: IV_Sp_Def ?? 0 }); //@ts-ignore
  form.slider("IV Speed", pokemoneNatures.constants.IV_Spd[0], pokemoneNatures.constants.IV_Spd[1], { step: 1, defaultValue: IV_Spd ?? 0 }); //@ts-ignore

  form.slider("EV Health", 0, 255, { step: 1, defaultValue: EV_HP ?? 0 }); //@ts-ignore
  form.slider("EV Attack", 0, 255, { step: 1, defaultValue: EV_Atk ?? 0 }); //@ts-ignore
  form.slider("EV Defense", 0, 255, { step: 1, defaultValue: EV_Def ?? 0 }); //@ts-ignore
  form.slider("EV Special Attack", 0, 255, { step: 1, defaultValue: EV_Sp_Atk ?? 0 }); //@ts-ignore
  form.slider("EV Special Defense", 0, 255, { step: 1, defaultValue: EV_Sp_Def ?? 0 }); //@ts-ignore
  form.slider("EV Speed", 0, 255, { step: 1, defaultValue: EV_Spd ?? 0 });

  const response = await form.show(player as any);
  if (response.canceled) {
    openMenu(player);
    return;
  }

  // After adding Gender dropdown, total fields = 18 (0..17)
  const dataValues = response.formValues ?? new Array<18>();

  // New index map after adding Gender at 5:
  // 0: Level, 1: Variant, 2: Nature, 3: Terra, 4: Ability, 5: Gender
  // 6..11: IVs, 12..17: EVs

  const evTotal =
    Number(dataValues[12]) + Number(dataValues[13]) + Number(dataValues[14]) +
    Number(dataValues[15]) + Number(dataValues[16]) + Number(dataValues[17]);

  if (evTotal > 510) {
    player.sendMessage(`§cYour total EVs are §4${evTotal}§c. Please reduce them to 510 or less.`);
    await sleep(40);
    return openCreateMenu(player, PokemonName, ...dataValues as any);
  }

  let pokeList = [...pokemonList];
  pokeList.shift();

  if (pokeList.map((i) => i.toLocaleLowerCase()).includes(PokemonName.toLocaleLowerCase())) {
    let foundPokemon = pokeList.find((i) => i.toLocaleLowerCase() === PokemonName.toLocaleLowerCase())!;
    const selectedAbilityName = abilityOptions[dataValues[4] as number] as (typeof AbilityList)[number];
    const selectedVariant = dataValues[1] as number;

    // Validate ability against variant
    const rawAbilities = wildPokemon[`pokeworld:wild_${foundPokemon.toLowerCase()}`]?.Abilities;
    let validAbilities: (string | null)[] = [null, null, null];

    if (rawAbilities && typeof rawAbilities === "object" && !Array.isArray(rawAbilities)) {
      const abilityMap = rawAbilities as Record<string, (string | null)[]>;
      for (const key of Object.keys(abilityMap)) {
        if (key === "default") continue;
        const [startStr, endStr] = key.split("-");
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        if (selectedVariant >= start && selectedVariant <= end) {
          validAbilities = abilityMap[key];
          break;
        }
      }
      if (validAbilities.every((a) => a === null)) {
        validAbilities = abilityMap["default"] ?? [null, null, null];
      }
    } else if (Array.isArray(rawAbilities)) {
      validAbilities = rawAbilities;
    }

    if (!validAbilities.includes(selectedAbilityName)) {
      player.sendMessage(`§cThe selected ability "${selectedAbilityName}" is not valid for variant ${selectedVariant}.`);
      await sleep(40);
      return openCreateMenu(player, PokemonName, ...dataValues as any);
    }

    // ✅ Gender selection mapping
    const genderIndexRaw = GenderIndex.indexOf(genderOptions[dataValues[5] as number] as any);
    const genderIndex = genderIndexRaw >= 0 ? genderIndexRaw : 0;

    // ✅ Moves must use the chosen Variant (was using Nature by mistake)
    const moves = getRandomMoves(`pokeworld:wild_${foundPokemon.toLowerCase()}`, 5, selectedVariant);

    const baseStats = [
      "Base_Atk",
      "Base_Def",
      "Base_Sp_Atk",
      "Base_Sp_Def",
      "Base_Spd",
    ] as const;

    const natureIdx = (dataValues[2] as number) ?? 0;
    const terraIdx = dataValues[3] as number;
    const abilityIdx = AbilityList.indexOf(selectedAbilityName);
    const level = dataValues[0] as number;

    function getNatureStat(stat: typeof baseStats[number], iv: number, ev: number) {
      return ~~calculateNatureStat(pokemonText(foundPokemon), natureIdx, level, stat as any, iv, ev);
    }

    const health = ~~calculateHealth(
      pokemonText(foundPokemon),
      dataValues[0] as number,
      dataValues[6] as number,   // IV HP
      dataValues[12] as number   // EV HP
    );
    const longHandData: longHand = {
      Move1: moves[0] ? (moves[0][1] ? moves[0][1] : -1) : -1,
      Move2: moves[1] ? (moves[1][1] ? moves[1][1] : -1) : -1,
      Move3: moves[2] ? (moves[2][1] ? moves[2][1] : -1) : -1,
      Move4: moves[3] ? (moves[3][1] ? moves[3][1] : -1) : -1,
      level: level,
      Nature: ["", natureIdx],
      Terra: ["", terraIdx],
      Ability: ["", abilityIdx],
      Gender: ["", genderIndex], // ✅ save gender name + index
      IV_health: dataValues[6] as number,
      IV_attack: dataValues[7] as number,
      IV_defense: dataValues[8] as number,
      IV_special_attack: dataValues[9] as number,
      IV_special_defense: dataValues[10] as number,
      IV_speed: dataValues[11] as number,
      EV_health: dataValues[12] as number,
      EV_attack: dataValues[13] as number,
      EV_defense: dataValues[14] as number,
      EV_special_attack: dataValues[15] as number,
      EV_special_defense: dataValues[16] as number,
      EV_speed: dataValues[17] as number,
      Base_Health: health,
      Base_attack: getNatureStat(baseStats[0], dataValues[7] as number, dataValues[13] as number),
      Base_defense: getNatureStat(baseStats[1], dataValues[8] as number, dataValues[14] as number),
      Base_special_attack: getNatureStat(baseStats[2], dataValues[9] as number, dataValues[15] as number),
      Base_special_defense: getNatureStat(baseStats[3], dataValues[10] as number, dataValues[16] as number),
      Base_speed: getNatureStat(baseStats[4], dataValues[11] as number, dataValues[17] as number),
      Current_Health: health,
      DMax: ~~(
        Math.random() *
        ((wildPokemon[wildId]?.DMax?.[1] ?? 1) - (wildPokemon[wildId]?.DMax?.[0] ?? 0))
      ) + (wildPokemon[wildId]?.DMax?.[0] ?? 0),
      Evolution_index: 0,
      Traded: false,
      Experience: 0,
      Variant: selectedVariant,
      Move1_PP: moves[0] ? (moves[0][2]?.pp ?? 0) : 0,
      Move2_PP: moves[1] ? (moves[1][2]?.pp ?? 0) : 0,
      Move3_PP: moves[2] ? (moves[2][2]?.pp ?? 0) : 0,
      Move4_PP: moves[3] ? (moves[3][2]?.pp ?? 0) : 0,
      heldItem: 0,
      friendShipLevel: 0,
      pokeBall: "pokeball",
      Nickname: "",
      Size: 5,
      Box: -1,
      Slot: -1,
    };

    showPokemonSummary(player, foundPokemon, longHandData);
    selectPlayer(player, foundPokemon, longHandData);
  } else {
    player.sendMessage(
      `§cPokemon "${PokemonName}" is not a valid pokemon. Make sure its spelt correctly.\nOpening Form In 3 seconds`
    );
    await sleep(40);
    openCreateMenu(player, ...dataValues as any);
  }
}

function showPokemonSummary(player: Player, name: string, data: longHand) {
  const form = new ActionFormData();

  form.title(`Pokémon Created`);
  form.body(
    `§a${name} §7(Lv. ${data.level})

§7Nature: §f${pokemoneNatures.values[data.Nature[1]]?.[2] ?? "Unknown"}
§7Ability: §f${AbilityList[data.Ability[1]] ?? "Unknown"}
§7Gender: §f${GenderIndex[data.Gender[1]] ?? "Unknown"}
§7Variant: §f${data.Variant}

§aStats
§7HP §f${data.Base_Health}
§7Atk §f${data.Base_attack}  §7Def §f${data.Base_defense}
§7SpA §f${data.Base_special_attack}  §7SpD §f${data.Base_special_defense}
§7Spe §f${data.Base_speed}

§aIVs
§7HP ${data.IV_health} | Atk ${data.IV_attack} | Def ${data.IV_defense}
§7SpA ${data.IV_special_attack} | SpD ${data.IV_special_defense} | Spe ${data.IV_speed}

§aEVs
§7HP ${data.EV_health} | Atk ${data.EV_attack} | Def ${data.EV_defense}
§7SpA ${data.EV_special_attack} | SpD ${data.EV_special_defense} | Spe ${data.EV_speed}`
  );

  form.button("§a✔ Confirm");
  form.show(player);
}

async function selectPlayer(player: Player, pokeID: string, longHand: longHand) {
  const form = new ModalFormData();
  form.title("Send To Who");

  const allPlayers = world.getAllPlayers();
  const playerList = allPlayers.map(p => p.name); // ✅ use string[]

  const defaultIndex = playerList.indexOf(player.name);//@ts-ignore
  form.dropdown("Select A Player's Pc", playerList, { defaultValue: defaultIndex >= 0 ? defaultIndex : 0, });

  const response = await form.show(player);
  if (response.canceled) {
    player.sendMessage("§cPokemon Creation Canceled");
    return;
  }

  const values = response.formValues;
  if (!values || values[0] === undefined) return;
  const selectedIndex = values[0] as number;
  const selectedName = playerList[selectedIndex]; // ✅ direct access from string[]
  const foundPlayer = allPlayers.find(p => p.name === selectedName);

  if (foundPlayer) {
    sendPokemonToPC(player, foundPlayer, pokeID, longHand);
  } else {
    player.sendMessage(`§cPlayer "${selectedName}" doesn't exist.\nOpening form again in 3 seconds.`);
    await sleep(40);
    selectPlayer(player, pokeID, longHand);
  }
}

function sendPokemonToPC(sender: Player, pcPlayer: Player, pokeID: string, longHand: longHand) {
  const rID = ~~(Math.random() * 999999999);

  // Check for free party slot FIRST
  const freeSlot = checkSidebarFree(pcPlayer);

  // 🟢 PARTY → no Box / Slot
  if (freeSlot) {
    writePokemon(pcPlayer, pokeID, rID, longHand);

    if (!selected.hasOwnProperty(pcPlayer.name)) selected[pcPlayer.name] = {};
    selected[pcPlayer.name][freeSlot] = [Number(rID), pokeID, longHand];

    system.run(() => {
      pcPlayer.runCommand(`scoreboard players set @s poke${freeSlot > 0 ? freeSlot + 1 : ''}rID ${rID}`);
      pcPlayer.runCommand(`scoreboard players set @s poke${freeSlot > 0 ? freeSlot + 1 : ''}Id ${pokemonList.indexOf(pokeID as PokemonName)}`);
      pcPlayer.runCommand(`scoreboard players set @s poke${freeSlot > 0 ? freeSlot + 1 : ''}Ball ${Object.keys(ballTags).indexOf(longHand.pokeBall)}`);
      pcPlayer.runCommand(`scoreboard players set @s poke${freeSlot > 0 ? freeSlot + 1 : ''}Lvl ${longHand.level}`);
      pcPlayer.runCommand(`scoreboard players set @s poke${freeSlot > 0 ? freeSlot + 1 : ''}Var ${longHand.Variant}`);
      pcPlayer.runCommand(`scoreboard players set @s poke${freeSlot > 0 ? freeSlot + 1 : ''}HP ${longHand.Current_Health ?? 0}`);
      pcPlayer.runCommand(`scoreboard players set @s poke${freeSlot > 0 ? freeSlot + 1 : ''}HPmax ${longHand.Base_Health}`);
    });

    pcPlayer.sendMessage(`§a✚ §7Pokemon Added To Your Party`);
    if (pcPlayer.name !== sender.name) {
      sender.sendMessage(`§6✔§7 Sent "${pokeID}" to ${pcPlayer.name}`);
    }
    return;
  }

  // 🔵 PC → assign Box / Slot ONLY here
  const { box, slot } = findNextFreePCSlotForPlayer(pcPlayer);
  longHand.Box = box;
  longHand.Slot = slot;

  writePokemon(pcPlayer, pokeID, rID, longHand);

  pcPlayer.sendMessage(`§a✚ §7Pokemon Sent To Your PC`);
  if (pcPlayer.name !== sender.name) {
    sender.sendMessage(`§6✔§7 Sent "${pokeID}" to ${pcPlayer.name}'s PC`);
  }
}
