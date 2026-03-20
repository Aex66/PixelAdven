import { longHand, shortHand } from "./@types/types";
import { listStorage, readPokemon, translateData, writePokemon } from "./main";
import { Player as IPlayer, Player } from "@minecraft/server";

/* ============================================================
   CONFIG
============================================================ */

const BOX_SIZE = 54;
export const PC_REPAIRED_TAG = "pc_repaired_v3";

/* ============================================================
   SIZE ROLL (Weighted – Matches Your Entity Logic)
============================================================ */

function rollSize(): number {
    const sizes = [
        { value: 1, weight: 1 },
        { value: 2, weight: 0.3 },
        { value: 3, weight: 0.8 },
        { value: 4, weight: 20 },
        { value: 5, weight: 120 },
        { value: 6, weight: 20 },
        { value: 7, weight: 0.8 },
        { value: 8, weight: 0.3 },
        { value: 9, weight: 1 },
    ];

    const totalWeight = sizes.reduce((sum, s) => sum + s.weight, 0);
    let roll = Math.random() * totalWeight;

    for (const size of sizes) {
        roll -= size.weight;
        if (roll <= 0) return size.value;
    }

    return 5;
}

/* ============================================================
   BASIC MIGRATION (Box + Slot + Size if missing)
============================================================ */

export function migratePCIfNeeded(player: IPlayer) {
    const speciesList = listStorage(player);

    let index = 0;
    let migrated = false;

    for (const species of speciesList) {
        const mons = readPokemon(player, species, true);

        for (const [rID, short] of Object.entries(mons)) {
            const long = translateData(short, "long-hand") as longHand;

            let changed = false;

            // Fix Box / Slot (force 1-based boxes)
            if (
                typeof long.Box !== "number" ||
                typeof long.Slot !== "number" ||
                long.Box < 1 ||
                long.Slot < 0
            ) {
                long.Box = Math.floor(index / BOX_SIZE) + 1;
                long.Slot = index % BOX_SIZE;
                changed = true;
            }

            // Fix Size
            if (typeof long.Size !== "number" || long.Size <= 0) {
                long.Size = rollSize();
                changed = true;
            }

            if (changed) {
                writePokemon(player, species, Number(rID), long);
                migrated = true;
            }

            index++;
        }
    }

    if (migrated) {
        player.sendMessage("§a✔ PC migration complete (Box/Slot/Size repaired)");
    }
}

/* ============================================================
   FIND NEXT FREE SLOT (GLOBAL PC)
============================================================ */

export function findNextFreePCSlot(
    results: [string, { [rID: string]: shortHand }][]
): { box: number; slot: number } {

    const occupied = new Set<string>();

    for (const [, mons] of results) {
        for (const info of Object.values(mons)) {
            const box =
                typeof (info as any).Box === "number"
                    ? (info as any).Box
                    : (info as any).Bx;

            const slot =
                typeof (info as any).Slot === "number"
                    ? (info as any).Slot
                    : (info as any).St;

            if (typeof box === "number" && typeof slot === "number") {
                occupied.add(`${box}:${slot}`);
            }
        }
    }

    let i = 0;
    while (occupied.has(`${Math.floor(i / BOX_SIZE) + 1}:${i % BOX_SIZE}`)) {
        i++;
    }

    return {
        box: Math.floor(i / BOX_SIZE) + 1,
        slot: i % BOX_SIZE
    };
}

/* ============================================================
   FIND NEXT FREE SLOT (PLAYER WRAPPER)
============================================================ */

export function findNextFreePCSlotForPlayer(player: IPlayer) {
    const pcData = listStorage(player).map(mon => [
        mon,
        readPokemon(player, mon, true)
    ]) as unknown as [string, { [rID: string]: shortHand }][];
    
    return findNextFreePCSlot(pcData);
}

/* ============================================================
   FORCE REPAIR (ONLY FIX INVALID ONES)
============================================================ */

export function forceRepairAllPCPokemon(player: Player) {
    const speciesList = listStorage(player);

    let index = 0;
    let fixed = 0;

    for (const species of speciesList) {
        const mons = readPokemon(player, species, true);

        for (const [rID, short] of Object.entries(mons)) {
            const long = translateData(short, "long-hand") as longHand;

            let changed = false;

            if (
                typeof long.Box !== "number" ||
                typeof long.Slot !== "number" ||
                long.Box < 1 ||
                long.Slot < 0
            ) {
                long.Box = Math.floor(index / BOX_SIZE) + 1;
                long.Slot = index % BOX_SIZE;
                changed = true;
            }

            if (typeof long.Size !== "number" || long.Size <= 0) {
                long.Size = rollSize();
                changed = true;
            }

            if (changed) {
                writePokemon(player, species, Number(rID), long);
                fixed++;
            }

            index++;
        }
    }

    player.sendMessage(`§a✔ PC FORCE-REPAIRED (${fixed} Pokémon updated)`);
}

/* ============================================================
   HARD REPAIR (REASSIGN EVERYTHING CLEANLY ONCE)
============================================================ */

export function HARD_REPAIR_PC_ONCE(player: Player) {

    if (player.hasTag(PC_REPAIRED_TAG)) return;

    const speciesList = listStorage(player);
    let index = 0;
    let fixed = 0;

    for (const species of speciesList) {
        const mons = readPokemon(player, species, true);

        for (const [rIDStr, short] of Object.entries(mons)) {
            const rID = Number(rIDStr);
            const long = translateData(short, "long-hand") as longHand;

            long.Box  = Math.floor(index / BOX_SIZE) + 1;
            long.Slot = index % BOX_SIZE;

            if (typeof long.Size !== "number" || long.Size <= 0) {
                long.Size = rollSize();
            }

            writePokemon(player, species, rID, long);

            index++;
            fixed++;
        }
    }

    player.addTag(PC_REPAIRED_TAG);

    player.sendMessage(`§a✔ PC HARD REPAIR COMPLETE (${fixed} Pokémon rebuilt)`);
}
