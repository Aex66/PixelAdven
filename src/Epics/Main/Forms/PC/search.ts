/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
Aex66 (Developer)
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--
__________ ___________________
\______   \\\_____  \__    ___/
 |       _/ /   |   \|    |
 |    |   \/    |    \    |
 |____|_  /\_______  /____|
        \/         \/
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--
© Copyright 2023 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Website: https://www.rotmc.ml
Thank you!
*/
import { Player as IPlayer } from "@minecraft/server";
import { readPokemon, listStorage, translateData, writePokemon } from "../../../Pokemon Database/main.js";
import type { longHand, shortHand } from '../../../Pokemon Database/@types/types.js';
import { ActionForm, ModalForm } from "../../../../Papers/FormPaper.js";
import pokemonList from "../../../../Letters/pokemon/list.js";
import { pokemonGrowth } from "../../../../Letters/pokemon/growth.js";
import wildPokemon from "../../../../Letters/pokemon/wild.js";
import { pokemonText } from "../../../../Papers/Paragraphs/ExtrasParagraphs.js";
import pokemonMoves from "../../../../Letters/pokemon/moves.js";
import TypeList from "../../../../Letters/pokemon/TypeList.js";
import { confirmForm } from "../../../../Papers/Paragraphs/ExtrasParagraphs.js";
import { deletePokemon } from "../../../Pokemon Database/main.js";
import { selected } from "./main.js";
import { currentPCPage, view } from "./view.js";
import pokemonNatures from '../../../../Letters/pokemon/natures';
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import AbilityList from "../../../../Letters/pokemon/Abilities.js";
import GenderIndex from "../../../../Letters/pokemon/Gender.js";
import ItemsList from "../../../../Letters/pokemon/Items.js";
import SizeList from "../../../../Letters/pokemon/SizeList.js";

export const pokeBallGlyphs: {
    [key: string]: string
} = {
    pokeball: '',
    greatball: '',
    ultraball: '',
    masterball: '',
    safari: '',
    netball: '',
    diveball: '',
    nestball: '',
    repeatball: '',
    timerball: '',
    luxuryball: '',
    premierball: '',
    healball: '',
    duskball: '',
    quickball: '',
    cherishball: '',
    friendball: '',
    moonball: '',
    dreamball: '',
    levelball: '',
    fastball: '',
    heavyball: '',
    loveball: '',
    lureball: '',
    beastball: '',
    parkball: ''
};

export const variant = [
    'textures/items/item_base_UI',
    "textures/items/item_bases_UI",
    "textures/items/item_alolan_UI",
    "textures/items/item_alolans_UI",
    "textures/items/item_galar_UI",
    "textures/items/item_galars_UI",
    "textures/items/item_hisuian_UI",
    "textures/items/item_hisuians_UI",
    "textures/items/item_paldean_UI",
    "textures/items/item_padeans_UI"
];

export const getIVPercent = (p: any) => {
    const IVhp = p.IV_health ?? p.IVhp;
    const IVatk = p.IV_attack ?? p.IVatk;
    const IVdef = p.IV_defense ?? p.IVdef;
    const IVspa = p.IV_special_attack ?? p.IVspa;
    const IVspd = p.IV_special_defense ?? p.IVspd;
    const IVsp = p.IV_speed ?? p.IVsp;
    const totalIV = IVhp + IVatk + IVdef + IVspa + IVspd + IVsp;
    return Math.floor((totalIV / 186) * 100);
};

const getLabelPrefix = (variantValue: number): string => {
    return [1, 3, 5, 7, 9].includes(variantValue) ? '§b' : '';
};

type data = {
    name: string,
    rID: string,
    data: longHand
};

// ============================================================
// BOX / SLOT MODE
// ============================================================

const BOX_SIZE = 54;

export function getFirstFreeSlotInBox(
    results: [name: string, data: { [rID: string]: shortHand }][],
    targetBox: number,
    player: IPlayer
): number | undefined {

    const teamRIDSet = new Set<string>();
    for (let i = 0; i < 6; i++) {
        const slot = selected[player.name]?.[i];
        if (slot) teamRIDSet.add(String(slot[0]));
    }

    const occupied = new Set<number>();

    for (const [, mons] of results) {
        for (const [rID, info] of Object.entries(mons)) {

            // 🔥 IGNORE TEAM POKÉMON
            if (teamRIDSet.has(rID)) continue;

            const { box, slot } = getBoxSlot(info);

            if (
                box === targetBox &&
                typeof slot === "number" &&
                slot >= 0 &&
                slot < BOX_SIZE
            ) {
                occupied.add(slot);
            }
        }
    }

    for (let s = 0; s < BOX_SIZE; s++) {
        if (!occupied.has(s)) return s;
    }

    return undefined;
}

function asNumber(v: any): number | undefined {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim().length) {
        const n = Number(v);
        if (Number.isFinite(n)) return n;
    }
    return undefined;
}



async function chooseTargetBox(player: IPlayer): Promise<number | undefined> {
    const modal = new ModalFormData();
    modal.title("Move Pokémon");
    modal.textField("Move to Box #", "Example: 1");

    const res = await modal.show(player);
    if (res.canceled) return;

    const raw = res.formValues?.[0];
    const box = Number(raw);

    if (!Number.isInteger(box) || box < 1) {
        player.sendMessage("§cInvalid box number.");
        return;
    }

    return box;
}


export function debugPC(
    player: IPlayer,
    results: [string, { [rID: string]: shortHand }][]
) {
    let count = 0;

    for (const [species, mons] of results) {
        for (const [rID, mon] of Object.entries(mons)) {
            const box =
                (mon as any).Box ??
                (mon as any).Bx ??
                (mon as any).box ??
                (mon as any).bx;

            const slot =
                (mon as any).Slot ??
                (mon as any).St ??
                (mon as any).slot ??
                (mon as any).st;

            console.warn(
                `[PC DEBUG] ${player.name} → ${species} (${rID}) | box=${box} slot=${slot}`
            );

            count++;
        }
    }

    console.warn(`[PC DEBUG] ${player.name} total Pokémon: ${count}`);
}

function getBoxSlot(info: any): { box?: number; slot?: number } {
    // supports longhand + shorthand + lowercase
    const box =
        asNumber(info?.Box) ??
        asNumber(info?.Bx) ??
        asNumber(info?.box) ??
        asNumber(info?.bx);

    const slot =
        asNumber(info?.Slot) ??
        asNumber(info?.St) ??
        asNumber(info?.slot) ??
        asNumber(info?.st);

    return { box, slot };
}

function detectBoxBase(results: [string, { [rID: string]: any }][]): 0 | 1 {
    // If ANY pokemon has box=0 -> 0-based.
    // Else if we see box=1 as smallest -> 1-based.
    let saw0 = false;
    let min: number | undefined;

    for (const [, mons] of results) {
        for (const info of Object.values(mons)) {
            const { box } = getBoxSlot(info);
            if (box === undefined) continue;
            if (box === 0) saw0 = true;
            if (min === undefined || box < min) min = box;
        }
    }

    if (saw0) return 0;
    if (min === 1) return 1;
    // default to 0-based if unclear (safer)
    return 0;
}



type PCEntry = {
    species: string,
    rID: string,
    info: shortHand
};

type PCSlot = PCEntry | null;

// Global sort mode toggle
const sortModes = ['None', 'Name', ' Lvl', ' IV%', ' Lvl', ' IV%'];

let currentSortMode = 0;

function nextSortMode(): void {
    currentSortMode = (currentSortMode + 1) % sortModes.length;
}

export async function release(player: IPlayer): Promise<void> {
    const form = new ActionFormData();
    form.title("Release Pokémon");
    form.body("Choose how you'd like to release Pokémon.");
    form.button("§aRelease One Pokémon");
    form.button("§cRelease Multiple Pokémon");

    const res = await form.show(player);
    if (res.canceled) return;

    // === SINGLE RELEASE ===
    if (res.selection === 0) {
        const chosen = await filter(player, true);
        if (!chosen) return;

        const wildName = pokemonText(chosen.name);
        const nextLevel = pokemonGrowth[wildPokemon[wildName].Growth][chosen.data.level];

        const confirm = await confirmForm(
            player,
            "§4§lRelease Pokémon?",
            `Are you sure you want to release ${chosen.name}?\nLvl: ${chosen.data.level}${nextLevel ? ` (${chosen.data.Experience ?? 0}/${nextLevel})` : ''}\nGrowth: ${wildPokemon[wildName].Growth}\nNature: ${chosen.data.Nature?.[0] ?? 'Unknown'}\nCaught With: ${chosen.data.pokeBall}\nTerra Type: ${chosen.data.Terra?.[0] ?? 'None'}\nDynamax Lvl: ${chosen.data.DMax}/10\nTraded: ${chosen.data.Traded}\nBase:${chosen.data.Base_Health}/${chosen.data.Base_attack}/${chosen.data.Base_defense}/${chosen.data.Base_special_attack}/${chosen.data.Base_special_defense}/${chosen.data.Base_speed}\nIV's:${chosen.data.IV_health}/${chosen.data.IV_attack}/${chosen.data.IV_defense}/${chosen.data.IV_special_attack}/${chosen.data.IV_special_defense}/${chosen.data.IV_speed}\nEV's:${chosen.data.EV_health}/${chosen.data.EV_attack}/${chosen.data.EV_defense}/${chosen.data.EV_special_attack}/${chosen.data.EV_special_defense}/${chosen.data.EV_speed}`,
            "§aYes",
            "§cNo"
        );

        if (!confirm) return;

        deletePokemon(player, chosen.name, Number(chosen.rID));
        player.sendMessage(`§cYou have released ${chosen.name}`);

        const updated = listStorage(player)
            .map(mon => [mon, readPokemon(player, mon, false)]) as unknown as [string, { [rID: string]: shortHand }][];
        await showResults(player, "PC", updated, false);
    }

    // === MULTI RELEASE ===
    if (res.selection === 1) {
        const pcData = listStorage(player)
            .map(mon => [mon, readPokemon(player, mon, false)]) as unknown as [string, { [rID: string]: shortHand }][];
        const shinyVariants = [1, 3, 5, 7, 9];

        const flat: { label: string, name: string, rID: string }[] = [];
        for (const [species, mons] of pcData) {
            for (const [rID, mon] of Object.entries(mons)) {
                const variant = (mon as any).Vr ?? 0;
                if (shinyVariants.includes(variant)) continue;

                const lv = (mon as any).level ?? (mon as any).lv ?? 0;
                const iv = getIVPercent(mon);
                const label = `${species} Lv.${lv} ${iv}%`;
                flat.push({ label, name: species, rID });
            }
        }

        if (!flat.length) {
            player.sendMessage("§eNo non-shiny Pokémon available to release.");
            return;
        }

        const options = ["§7None", ...flat.map(p => p.label)];
        const dropdownForm = new ModalFormData();
        dropdownForm.title("Multi-Release");

        for (let i = 0; i < 8; i++) {
            dropdownForm.dropdown(`Slot ${i + 1}`, options); // ✅ compatible
        }

        const response = await dropdownForm.show(player);
        if (response.canceled) return;

        const values = response.formValues ?? [];

        const selected = values
            .map((index) => {
                if (typeof index !== "number") return undefined;
                return flat[index - 1];
            })
            .filter(Boolean) as { label: string; name: string; rID: string }[];

        if (!selected.length) {
            player.sendMessage("§cNo Pokémon selected.");
            return;
        }

        const confirm = await confirmForm(
            player,
            `§4§lRelease ${selected.length} Pokémon?`,
            selected.map(p => `• ${p.label}`).join("\n"),
            "§aYes",
            "§cNo"
        );

        if (!confirm) return;

        for (const { name, rID } of selected) {
            deletePokemon(player, name, Number(rID));
        }

        player.sendMessage(`§cReleased ${selected.length} Pokémon.`);
    }
}

export async function filter(player: IPlayer, returnPokemon: boolean): Promise<data | undefined> {
    const modal = new ModalForm();
    modal.setTitle("Filter Pokémon");
    modal.addInput("Search by name (optional)", "e.g. Pikachu", "");
    modal.addDropdown("Filter by Generation", ["Any", "Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar", "Paldea"], 0);
    modal.addInput("Level Range (e.g. 1-100)", "min-max", "1-100");
    modal.addInput("IV% Range (e.g. 50-100)", "min-max", "1-100");
    modal.addToggle("Only show shiny Pokémon");
    modal.addToggle("Only show tradeable Pokémon");
    modal.addDropdown("Filter by Nature", ["Any", ...pokemonNatures.values.map(n => n[2])], 0);
    modal.addDropdown("Filter by Type", ["Any", ...TypeList], 0);

    // 🔥 NEW — Scale filter
    modal.addDropdown("Filter by Scale", ["Any", ...SizeList], 0);

    return await new Promise<data | undefined>((resolve) => {
        modal.send(player, async (res) => {
            if (res.canceled) return resolve(undefined);

            const formValues = res.formValues ?? [];

            const nameQuery = formValues[0] as string;
            const genIndex = Number(formValues[1] ?? 0);
            const lvlRange = (formValues[2] as string) ?? "1-100";
            const ivRange = (formValues[3] as string) ?? "1-100";
            const shinyOnly = Boolean(formValues[4]);
            const tradeOnly = Boolean(formValues[5]);
            const natureIndex = Number(formValues[6] ?? 0);
            const typeIndex = Number(formValues[7] ?? 0);
            const scaleIndex = Number(formValues[8] ?? 0);

            // ✅ FIXED CAST (no 'unknown as' error)
            const allMon = (
                listStorage(player).map(mon => [
                    mon,
                    readPokemon(player, mon, false)
                ])
            ) as unknown as [string, { [rID: string]: shortHand }][];

            const [lvlMin, lvlMax] = lvlRange
                .split("-")
                .map(v => Math.max(1, Math.min(100, Number(v.trim()) || 1)));

            const [ivMin, ivMax] = ivRange
                .split("-")
                .map(v => Math.max(1, Math.min(100, Number(v.trim()) || 1)));

            const selectedNature =
                natureIndex > 0 ? pokemonNatures.values[natureIndex - 1]?.[2] : undefined;

            const selectedTypeName =
                typeIndex > 0 ? TypeList[typeIndex - 1] : null;

            // 🔥 NEW — selected scale value (Size scores start at 1)
            const selectedScale =
                scaleIndex > 0 ? scaleIndex - 1 : undefined;

            const selectedGen = genIndex - 1;

            const shinyVariants = [1, 3, 5, 7, 9];

            const generationRanges: [number, number][] = [
                [1, 151],
                [152, 251],
                [252, 386],
                [387, 494],
                [494, 650],
                [650, 722],
                [722, 810],
                [810, 906],
                [906, 1026]
            ];

            const filtered: [string, { [rID: string]: shortHand }][] = [];

            for (const [species, mons] of allMon) {

                if (
                    nameQuery &&
                    typeof nameQuery === "string" &&
                    !species.toLowerCase().includes(nameQuery.toLowerCase())
                ) continue;

                const indexInList = pokemonList.findIndex(p => p === species);

                if (genIndex > 0) {
                    const [start, end] = generationRanges[selectedGen];
                    if (indexInList < start || indexInList >= end) continue;
                }

                const match: { [rID: string]: shortHand } = {};

                for (const [rID, mon] of Object.entries(mons)) {
                    const data = mon as any;

                    const lvl = data.level ?? data.lv ?? 0;
                    const iv = getIVPercent(data);
                    const isShiny = shinyVariants.includes(data.Variant ?? data.Vr ?? 0);
                    const traded = data.Traded ?? data.traded ?? false;

                    const longData = translateData(data, "long-hand");
                    const nature = longData?.Nature?.[0];
                    const variant = data.Variant ?? data.Vr ?? 0;

                    // 🔥 SCALE READ (supports legacy fields)
                    const sizeValue =
                        data.Size ??
                        data.size ??
                        data.Sz ??
                        longData?.Size ??
                        0;

                    const wildKey = Object.keys(wildPokemon)
                        .find(k => k.toLowerCase().endsWith(`_${species.toLowerCase()}`));

                    let wildEntry = wildKey
                        ? (wildPokemon as any)[wildKey]
                        : undefined;

                    if (!wildEntry) {
                        const fallbackKey = Object.keys(wildPokemon)
                            .find(k => k.toLowerCase().includes(species.toLowerCase()));
                        wildEntry = fallbackKey
                            ? (wildPokemon as any)[fallbackKey]
                            : undefined;
                    }

                    let type1 = -1;
                    let type2 = -1;

                    if (wildEntry) {
                        switch (variant) {
                            case 0:
                            case 1:
                                type1 = wildEntry.Type_1;
                                type2 = wildEntry.Type_2;
                                break;
                            case 2:
                            case 3:
                                type1 = wildEntry.Type_3;
                                type2 = wildEntry.Type_4;
                                break;
                            case 4:
                            case 5:
                                type1 = wildEntry.Type_5;
                                type2 = wildEntry.Type_6;
                                break;
                            case 6:
                            case 7:
                                type1 = wildEntry.Type_7;
                                type2 = wildEntry.Type_8;
                                break;
                        }
                    }

                    // ===== FILTER CHECKS =====
                    if (lvl < lvlMin || lvl > lvlMax) continue;
                    if (iv < ivMin || iv > ivMax) continue;
                    if (shinyOnly && !isShiny) continue;
                    if (tradeOnly && !traded) continue;

                    if (
                        natureIndex > 0 &&
                        nature?.toLowerCase() !== selectedNature?.toLowerCase()
                    ) continue;

                    const type1Name = TypeList[type1] ?? '';
                    const type2Name = TypeList[type2] ?? '';

                    if (
                        selectedTypeName &&
                        selectedTypeName.toLowerCase() !== type1Name.toLowerCase() &&
                        selectedTypeName.toLowerCase() !== type2Name.toLowerCase()
                    ) continue;

                    // 🔥 SCALE FILTER
                    if (
                        selectedScale !== undefined &&
                        Number(sizeValue) !== selectedScale
                    ) continue;

                    match[rID] = mon;
                }

                if (Object.keys(match).length > 0) {
                    filtered.push([species, match]);
                }
            }

            const result = await showResults(
                player,
                "Filtered Pokémon",
                filtered,
                returnPokemon
            );

            resolve(result);
        });
    });
}


export async function showResults(
    player: IPlayer,
    query: string,
    results: [name: string, data: { [rID: string]: shortHand }][],
    carry: boolean,
    selectedEntryBody?: string,
    selectedRID?: string,
    defaultPage = 0
): Promise<data | undefined> {

    // 🔥 ADD THIS LINE (nothing else)
    currentPCPage[player.name] = defaultPage;

    const teamRIDSet = new Set<string>();
    for (let i = 0; i < 6; i++) {
        const slot = selected[player.name]?.[i];
        if (slot) teamRIDSet.add(String(slot[0]));
    }

    // ============================================================
    // SLOT LOCKED BOX VIEW (Option A: Box + Slot)
    // page == Box index
    // ============================================================

    const page = defaultPage;

    // 🔥 auto-detect whether Box is 0-based or 1-based in stored data
    const targetBox = page + 1;

    const slots: PCSlot[] = new Array(BOX_SIZE).fill(null);

    for (const [species, data] of results) {
        for (const [rID, info] of Object.entries(data)) {
            if (teamRIDSet.has(rID)) continue;

            const { box, slot } = getBoxSlot(info);

            if (box === undefined || slot === undefined) continue;
            if (box !== targetBox) continue;
            if (slot < 0 || slot >= BOX_SIZE) continue;

            slots[slot] = { species, rID, info };
        }
    }

    // ============================================================
    // SORT WITHIN BOX ONLY, WITHOUT FILLING EMPTY SLOTS
    // Sorting permutes ONLY occupied slots
    // ============================================================

    if (currentSortMode !== 0) {
        const occupied = slots.filter(Boolean) as PCEntry[];

        occupied.sort((a, b) => {
            const lvA = (a.info.level ?? a.info.lv ?? 0);
            const lvB = (b.info.level ?? b.info.lv ?? 0);
            const ivA = getIVPercent(a.info);
            const ivB = getIVPercent(b.info);

            if (currentSortMode === 1) { // Name A-Z
                return a.species.localeCompare(b.species);
            } else if (currentSortMode === 2) { // Highest Level
                return lvB - lvA;
            } else if (currentSortMode === 3) { // Highest IV%
                return ivB - ivA;
            } else if (currentSortMode === 4) { // Lowest Level
                return lvA - lvB;
            } else if (currentSortMode === 5) { // Lowest IV%
                return ivA - ivB;
            }
            return 0;
        });

        let i = 0;
        for (let s = 0; s < slots.length; s++) {
            if (slots[s]) {
                slots[s] = occupied[i++] ?? null;
            }
        }
    }

    return await showPage(player, slots, query, results, carry, selectedEntryBody, selectedRID, page);
}

async function showPage(
    player: IPlayer,
    slots: PCSlot[],
    query: string,
    results: [name: string, data: { [rID: string]: shortHand }][],
    carry: boolean,
    selectedEntryBody?: string,
    selectedRID?: string,
    page: number = 0
): Promise<data | undefined> {

    const form = new ActionForm();
    form.setTitle(`§1§1§r§aYour PC §8[Sort: ${sortModes[currentSortMode]}]`);
    form.setBody(selectedEntryBody ?? '');

    // ============================================================
    // Render EXACTLY 54 fixed slots (empty stays empty)
    // ============================================================

    for (const entry of slots) {
        if (!entry) {
            form.addButton("");
            continue;
        }

        const iconIndex = Math.max(0, Math.min(
            variant.length - 1,
            (entry.info as any).Vr ?? (entry.info as any).Variant ?? 0
        ));
        const iconPath = `${variant[iconIndex]}/${entry.species.charAt(0).toUpperCase() + entry.species.slice(1)}`;

        const variantValue = (entry.info as any).Variant ?? (entry.info as any).Vr ?? 0;
        const prefix = getLabelPrefix(variantValue);
        const level = (entry.info as any).level ?? (entry.info as any).lv ?? 0;
        const ivPercent = getIVPercent(entry.info);

        const speciesName =
            entry.species.charAt(0).toUpperCase() + entry.species.slice(1);

        const nickname =
            (entry.info as any).NN && typeof (entry.info as any).NN === "string" && (entry.info as any).NN.trim().length > 0
                ? (entry.info as any).NN.trim()
                : null;

        const displayName = nickname
            ? `${speciesName}/${nickname}`
            : speciesName;

        form.addButton(`${prefix}${displayName} Lv.${level} ${ivPercent}%`, iconPath);
    }

    form.addButton("", "textures/items/left_arrow.png"); // 54
    form.addButton(""); // 55
    form.addButton("", "textures/blocks/chest.png"); // 56
    form.addButton("", "textures/items/search.png"); // 57
    form.addButton("", "textures/items/config.png"); // 58
    form.addButton(`§a${page + 1}`); // page label
    form.addButton("", "textures/items/release.png"); // 60
    form.addButton(""); // 61
    form.addButton("", "textures/items/right_arrow.png"); // 62

    // 🔹 Team slots
    for (let i = 0; i < 6; i++) {
        const member = selected[player.name]?.[i];
        if (member) {
            const [rID, name, data] = member;
            const iconPath = `${variant[data.Variant]}/${name.charAt(0).toUpperCase() + name.slice(1)}`;
            const variantValue = (data as any).Variant ?? (data as any).Vr ?? 0;
            const prefix = getLabelPrefix(variantValue);

            const speciesName = name.charAt(0).toUpperCase() + name.slice(1);

            const nickname =
                (data as any).Nickname && typeof (data as any).Nickname === "string" && (data as any).Nickname.trim().length > 0
                    ? (data as any).Nickname.trim()
                    : null;

            const displayName = nickname
                ? `${speciesName}/${nickname}`
                : speciesName;

            form.addButton(`${prefix}${displayName} Lv.${data.level} ${getIVPercent(data)}%`, iconPath);
        } else {
            form.addButton("");
        }
    }

    let selection: number | undefined;
    await form.send(player, async (res) => {
        if (res.canceled) return;
        selection = res.selection;
    });

    if (selection === undefined) return;

    if (selection >= 63 && selection <= 68) {
        view(player, selection - 63);
        return;
    }

    // left arrow
    if (selection === 54 && page > 0) {
        return await showResults(player, query, results, carry, selectedEntryBody, selectedRID, page - 1);
    }

    // right arrow (no length check; box count is your job elsewhere)
    if (selection === 62) {
        return await showResults(player, query, results, carry, selectedEntryBody, selectedRID, page + 1);
    }

    // 🔍 Search
    if (selection === 57) return await filter(player, carry);

    // 📦 MOVE BETWEEN BOXES (button 56)
    if (selection === 56) {
        await movePokemonMenu(player, results, page);
        return;
    }
    if (selection === 58) {
        nextSortMode();
        return await showResults(player, query, results, carry, selectedEntryBody, selectedRID, page);
    }
    // 🔢 Jump to box (page label button)
    if (selection === 59) {
        await jumpToBoxMenu(player, results, carry, query);
        return;
    }
    if (selection === 60) {
        await release(player);
        return;
    }


    async function jumpToBoxMenu(
        player: IPlayer,
        results: [name: string, data: { [rID: string]: shortHand }][],
        carry: boolean,
        query: string
    ) {
        const modal = new ModalFormData();
        modal.title("Go to Box");
        modal.textField("Enter Box Number", "Example: 1");

        const res = await modal.show(player);
        if (res.canceled) return;

        const raw = res.formValues?.[0];
        const boxNumber = Number(raw);

        if (!Number.isInteger(boxNumber) || boxNumber < 1) {
            player.sendMessage("§cInvalid box number.");
            return;
        }

        // Convert UI box → internal page index
        const targetPage = boxNumber - 1;

        await showResults(
            player,
            query,
            results,
            carry,
            undefined,
            undefined,
            targetPage
        );
    }

    // ============================================================
    // MOVE SYSTEM (Button 56)
    // ============================================================

    async function chooseTargetBox(player: IPlayer): Promise<number | undefined> {
        const modal = new ModalFormData();
        modal.title("Move Pokémon");
        modal.textField("Move to Box #", "Example: 2");

        const res = await modal.show(player);
        if (res.canceled) return;

        const raw = res.formValues?.[0];
        const box = Number(raw);

        if (!Number.isInteger(box) || box < 1) {
            player.sendMessage("§cInvalid box number.");
            return;
        }

        return box;
    }

    async function movePokemonMenu(
        player: IPlayer,
        results: [name: string, data: { [rID: string]: shortHand }][],
        currentPage: number
    ): Promise<void> {
        // Pick pokemon using your existing "preview -> confirm" behavior (carry=true)
        const picked = await showResults(player, "Select Pokémon to Move", results, true, undefined, undefined, currentPage);
        if (!picked) return;

        const targetBox = await chooseTargetBox(player);
        if (!targetBox) return;

        // Find first free slot in that target box
        const slot = getFirstFreeSlotInBox(results, targetBox, player);
        if (slot === undefined) {
            player.sendMessage(`§cBox ${targetBox} is full.`);
            return;
        }

        // Write LONGHAND so it actually persists
        const long = picked.data as longHand;
        long.Box = targetBox; // 1-based
        long.Slot = slot;     // 0..53

        writePokemon(player, picked.name, Number(picked.rID), long);

        player.sendMessage(`§aMoved ${picked.name} to Box ${targetBox}, Slot ${slot + 1}.`);

        // Refresh & open the target page so you SEE it immediately
        const refreshed = listStorage(player)
            .map(mon => [mon, readPokemon(player, mon, false)]) as unknown as [string, { [rID: string]: shortHand }][];
        await showResults(player, "PC", refreshed, false, undefined, undefined, targetBox - 1);
    }

    // ============================================================
    // Slot selection maps directly to slot index
    // ============================================================

    const chosen = slots[selection];
    if (!chosen) return;

    if (chosen.rID === selectedRID && carry) {
        return {
            name: chosen.species,
            rID: chosen.rID,
            data: translateData(chosen.info, 'long-hand')
        };
    }

    const choosen = {
        name: chosen.species,
        rID: chosen.rID,
        data: translateData(chosen.info, 'long-hand')
    };

    if (!choosen.data.Base_attack || !choosen.data.Nature) {
        const all = readPokemon(player, choosen.name, false);
        const fixed = (all as any)[choosen.rID];
        choosen.data = translateData(fixed, "long-hand");
    }

    const wildName = pokemonText(choosen.name);
    const nextLevel = pokemonGrowth[wildPokemon[wildName].Growth][choosen.data.level];

    const moveMap = new Map<number, string>();
    for (const [name, data] of Object.entries(pokemonMoves)) {
        moveMap.set(Number((data as any).id), name);
    }

    const moveIndices = [choosen.data.Move1, choosen.data.Move2, choosen.data.Move3, choosen.data.Move4];
    const movePPs = [choosen.data.Move1_PP, choosen.data.Move2_PP, choosen.data.Move3_PP, choosen.data.Move4_PP];
    const keys = Object.keys(pokemonMoves);
    const moveDisplay = moveIndices.map((index, i) => {
        if (index === -1) return null;
        const moveName = keys[index];
        const move = (pokemonMoves as any)[moveName];
        const pp = movePPs[i];
        return move ? `- ${move.name} - PP: ${pp}` : `- Unknown (${index}) - PP: ${pp}`;
    }).filter(Boolean).join("\n");

    const previewBody =
        `Lvl: ${choosen.data.level} ${choosen.data.Nickname || choosen.name}§r ${pokeBallGlyphs[choosen.data.pokeBall] ?? ''}` +
        `\nGrowth: ${wildPokemon[wildName].Growth}` +
        `\nSize: ${SizeList[choosen.data.Size ?? 0] ?? 'Unknown'}` +
        `\nExp: ${nextLevel ? ` (${choosen.data.Experience ?? 0}/${nextLevel})` : ''}` +
        `\nNature: ${choosen.data.Nature?.[0] ?? 'Unknown'}` +
        `\nGender: ${GenderIndex[choosen.data.Gender?.[1] ?? 0] ?? 'Unknown'}` +
        `\nAbility: ${AbilityList[choosen.data.Ability?.[1] ?? 0] ?? 'Unknown'}` +
        `\nTerra: ${TypeList[choosen.data.Terra?.[1] ?? 0] ?? 'Unknown'}` +
        `\nDmax Lvl: ${choosen.data.DMax}/10` +
        `\nTraded: ${choosen.data.Traded}` +
        `\nHeld Item: ${ItemsList[choosen.data.heldItem] ?? "None"}` +
        `\n----------------------` +
        `\nBase Stats:\n${choosen.data.Base_Health}/${choosen.data.Base_attack}/${choosen.data.Base_defense}/${choosen.data.Base_special_attack}/${choosen.data.Base_special_defense}/${choosen.data.Base_speed}` +
        `\nIV's: ${choosen.data.IV_health}/${choosen.data.IV_attack}/${choosen.data.IV_defense}/${choosen.data.IV_special_attack}/${choosen.data.IV_special_defense}/${choosen.data.IV_speed}` +
        `\nEV's: ${choosen.data.EV_health}/${choosen.data.EV_attack}/${choosen.data.EV_defense}/${choosen.data.EV_special_attack}/${choosen.data.EV_special_defense}/${choosen.data.EV_speed}` +
        `\n----------------------` +
        `\nMoves:\n${moveDisplay}`;

    return await showResults(player, query, results, carry, previewBody, chosen.rID, page);
}
