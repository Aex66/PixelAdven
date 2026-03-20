import { world, system, Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

import pokemonList from "../../Letters/pokemon/list";
import pokemoneNatures from "../../Letters/pokemon/natures";
import TypeList from "../../Letters/pokemon/TypeList";
import AbilityList from "../../Letters/pokemon/Abilities";
import GenderIndex from "../../Letters/pokemon/Gender";
import wildPokemon from "../../Letters/pokemon/wild";

import { selected } from "../Main/Forms/PC/main";
import { writePokemon, readPokemon } from "../Pokemon Database/main";
import { calculateHealth, calculateNatureStat } from "../Pokemon Calculations/functions";
import { pokemonText } from "../../Papers/Paragraphs/ExtrasParagraphs";
import { updateSidebar } from "../Pokemon Calculations/updateTeam";
import { ballTags } from "../Pokemon Calculations/catch";
import Commands from "../../Papers/CommandPaper/CommandPaper";
import SizeList from "../../Letters/pokemon/SizeList";

const cmd = Commands.create({
    name: "pokeedit",
    description: "Admin Pokémon editor",
    admin: true,
    category: "Admin",
});

cmd.callback((admin: Player) => {
    admin.sendMessage("§eClose chat — editor opens in §63 seconds§e...");
    system.runTimeout(() => openAdminPlayerSelect(admin), 60);
});

function openAdminPlayerSelect(admin: Player) {
    const players = world.getAllPlayers();
    const form = new ModalFormData().title("Select Player");
    const names = players.map(p => p.name);

    // @ts-ignore
    form.dropdown("Select Player", names, { defaultValue: 0 });

    form.show(admin).then(res => {
        if (res.canceled) return;
        const idx = Number(res.formValues[0]);
        openTeamSlotSelect(admin, players[idx]);
    });
}

function openTeamSlotSelect(admin: Player, target: Player) {
    const form = new ModalFormData().title(`Editing Team — ${target.name}`);
    const slotNames: string[] = [];

    for (let i = 0; i < 6; i++) {
        const slot = selected[target.name]?.[i];
        if (!slot) slotNames.push(`Slot ${i + 1}: (Empty)`);
        else slotNames.push(`Slot ${i + 1}: ${slot[1]} (Lv ${slot[2].level})`);
    }

    // @ts-ignore
    form.dropdown("Select Pokémon Slot", slotNames, { defaultValue: 0 });

    form.show(admin).then(res => {
        if (res.canceled) return;
        loadPokemonForEditing(admin, target, Number(res.formValues[0]));
    });
}

function loadPokemonForEditing(admin: Player, target: Player, slot: number) {
    const slotData = selected[target.name]?.[slot];
    if (!slotData) return admin.sendMessage("§cEmpty slot.");

    const [rID, species] = slotData;
    const raw = readPokemon(target, species.replace(/\s/g, "_"), true);
    const mon = raw[rID];

    if (!mon) return admin.sendMessage("§cFailed to load Pokémon data.");

    openEditForm(admin, target, slot, species, rID, mon);
}

function openEditForm(admin: Player, target: Player, slot: number, species: string, rID: number, mon: any) {
    const speciesId = `pokeworld:wild_${species.toLowerCase()}`;
    const wildData = wildPokemon[speciesId];

    const natureList = pokemoneNatures.values.map(v => v[2]);
    const terraList = [...TypeList];
    let abilityOpts: string[] = [];
    const rawAbilities = wildData?.Abilities;

    if (rawAbilities && typeof rawAbilities === "object" && !Array.isArray(rawAbilities)) {
        const set = new Set<string>();
        for (const group of Object.values(rawAbilities)) {
            for (const a of group) if (typeof a === "string") set.add(a);
        }
        abilityOpts = [...set];
    } else if (Array.isArray(rawAbilities)) {
        abilityOpts = rawAbilities.filter(a => typeof a === "string");
    }

    if (abilityOpts.length === 0) abilityOpts = ["None"];

    let genderOpts: string[] = ["Genderless"];
    const genderData = wildData?.Gender;

    const sizeValue =
    typeof mon.Size === "number"
        ? mon.Size
        : mon.Size?.[1] ?? 0;

    if (Array.isArray(genderData)) {
        const names = [...new Set(genderData.map(v => v[1]))];
        if (names.includes("Male") || names.includes("Female")) {
            genderOpts = [];
            if (names.includes("Male")) genderOpts.push("Male");
            if (names.includes("Female")) genderOpts.push("Female");
        } else if (names.includes("Genderless")) {
            genderOpts = ["Genderless"];
        }
    }

    const form = new ModalFormData().title(`Editing ${species}`);

    // @ts-ignore
    form.slider("Level", 1, 100, { step: 1, defaultValue: mon.level ?? 1 });
    // @ts-ignore
    form.slider("Variant", 0, 8, { step: 1, defaultValue: mon.Variant ?? 0 });
    // @ts-ignore
    form.slider("Size", 0, 9, { step: 1, defaultValue: sizeValue});
    // @ts-ignore
    form.dropdown("Nature", natureList, { defaultValue: mon.Nature?.[1] ?? 0 });
    // @ts-ignore
    form.dropdown("Terra", terraList, { defaultValue: mon.Terra?.[1] ?? 0 });
    // @ts-ignore
    form.dropdown("Ability", abilityOpts, { defaultValue: mon.Ability?.[1] ?? 0 });
    // @ts-ignore
    form.dropdown("Gender", genderOpts, { defaultValue: mon.Gender?.[1] ?? 0 });

    // @ts-ignore
    form.slider("IV HP", 0, 31, { step: 1, defaultValue: mon.IV_health ?? 0 });
    // @ts-ignore
    form.slider("IV Attack", 0, 31, { step: 1, defaultValue: mon.IV_attack ?? 0 });
    // @ts-ignore
    form.slider("IV Defense", 0, 31, { step: 1, defaultValue: mon.IV_defense ?? 0 });
    // @ts-ignore
    form.slider("IV SpAtk", 0, 31, { step: 1, defaultValue: mon.IV_special_attack ?? 0 });
    // @ts-ignore
    form.slider("IV SpDef", 0, 31, { step: 1, defaultValue: mon.IV_special_defense ?? 0 });
    // @ts-ignore
    form.slider("IV Speed", 0, 31, { step: 1, defaultValue: mon.IV_speed ?? 0 });

    // @ts-ignore
    form.slider("EV HP", 0, 255, { step: 1, defaultValue: mon.EV_health ?? 0 });
    // @ts-ignore
    form.slider("EV Attack", 0, 255, { step: 1, defaultValue: mon.EV_attack ?? 0 });
    // @ts-ignore
    form.slider("EV Defense", 0, 255, { step: 1, defaultValue: mon.EV_defense ?? 0 });
    // @ts-ignore
    form.slider("EV SpAtk", 0, 255, { step: 1, defaultValue: mon.EV_special_attack ?? 0 });
    // @ts-ignore
    form.slider("EV SpDef", 0, 255, { step: 1, defaultValue: mon.EV_special_defense ?? 0 });
    // @ts-ignore
    form.slider("EV Speed", 0, 255, { step: 1, defaultValue: mon.EV_speed ?? 0 });

    form.textField("Nickname", mon.Nickname ?? "");

    // @ts-ignore
    form.slider("DMax Level", 0, 10, { step: 1, defaultValue: mon.DMax ?? 0 });
    // @ts-ignore
    form.slider("Experience", 0, 1000000, { step: 10, defaultValue: mon.Experience ?? 0 });
    // @ts-ignore
    form.slider("Friendship", 0, 255, { step: 1, defaultValue: mon.friendShipLevel ?? 0 });

    form.show(admin).then(res => {
        if (res.canceled) return;

        const v = res.formValues;
        const evTotal =
            Number(v[13]) + Number(v[14]) + Number(v[15]) +
            Number(v[16]) + Number(v[17]) + Number(v[18]);

        if (evTotal > 510) {
            admin.sendMessage(`§cEV total ${evTotal} exceeds 510.`);
            return;
        }

        saveChanges(admin, target, slot, species, rID, mon, v, {
            natureList,
            terraList,
            abilityOpts,
            genderOpts
        });
    });
}

function saveChanges(
    admin: Player,
    target: Player,
    slot: number,
    species: string,
    rID: number,
    mon: any,
    v: any[],
    opts: {
        natureList: string[],
        terraList: string[],
        abilityOpts: string[],
        genderOpts: string[]
    }
) {
    const [lvl, variant, natureIdx, size, terraIdx, abilityIdx, genderIdx] = v;

    const selectedAbilityName =
        opts.abilityOpts[abilityIdx] as (typeof AbilityList)[number];
    const trueAbilityIndex = AbilityList.indexOf(selectedAbilityName);

    const selectedGenderName =
        opts.genderOpts[genderIdx] as (typeof GenderIndex)[number];
    const trueGenderIndex = GenderIndex.indexOf(selectedGenderName);

    mon.level = lvl;
    mon.Variant = variant;
    mon.Nature = ["", natureIdx];
    mon.Terra = ["", terraIdx];
    mon.Size = size;
    mon.Ability = ["", trueAbilityIndex];
    mon.Gender = ["", trueGenderIndex];

    mon.IV_health = Number(v[7]);
    mon.IV_attack = Number(v[8]);
    mon.IV_defense = Number(v[9]);
    mon.IV_special_attack = Number(v[10]);
    mon.IV_special_defense = Number(v[11]);
    mon.IV_speed = Number(v[12]);

    mon.EV_health = Number(v[13]);
    mon.EV_attack = Number(v[14]);
    mon.EV_defense = Number(v[15]);
    mon.EV_special_attack = Number(v[16]);
    mon.EV_special_defense = Number(v[17]);
    mon.EV_speed = Number(v[18]);

    mon.Nickname = String(v[19]);

    mon.DMax = Number(v[20]);
    mon.Experience = Number(v[21]);
    mon.friendShipLevel = Number(v[22]);

    const base = pokemonText(species);

    mon.Base_Health = ~~calculateHealth(base, mon.level, mon.IV_health, mon.EV_health);
    mon.Current_Health = mon.Base_Health;

    mon.Base_attack = ~~calculateNatureStat(base, natureIdx, mon.level, "Base_Atk", mon.IV_attack, mon.EV_attack);
    mon.Base_defense = ~~calculateNatureStat(base, natureIdx, mon.level, "Base_Def", mon.IV_defense, mon.EV_defense);
    mon.Base_special_attack = ~~calculateNatureStat(base, natureIdx, mon.level, "Base_Sp_Atk", mon.IV_special_attack, mon.EV_special_attack);
    mon.Base_special_defense = ~~calculateNatureStat(base, natureIdx, mon.level, "Base_Sp_Def", mon.IV_special_defense, mon.EV_special_defense);
    mon.Base_speed = ~~calculateNatureStat(base, natureIdx, mon.level, "Base_Spd", mon.IV_speed, mon.EV_speed);

    writePokemon(target, species, rID, mon);

    const suffix = slot > 0 ? slot + 1 : "";

    target.runCommand(`scoreboard players set @s poke${suffix}rID ${rID}`);
    target.runCommand(`scoreboard players set @s poke${suffix}Id ${pokemonList.indexOf(species as any)}`);
    target.runCommand(`scoreboard players set @s poke${suffix}Ball ${Object.keys(ballTags).indexOf(mon.pokeBall)}`);
    target.runCommand(`scoreboard players set @s poke${suffix}Lvl ${mon.level}`);
    target.runCommand(`scoreboard players set @s poke${suffix}Var ${mon.Variant}`);
    target.runCommand(`scoreboard players set @s poke${suffix}HP ${mon.Current_Health}`);
    target.runCommand(`scoreboard players set @s poke${suffix}HPmax ${mon.Base_Health}`);

    selected[target.name][slot] = [rID, species, mon];
    updateSidebar(target);

    admin.sendMessage(`§aSaved changes to ${species}.`);
}
