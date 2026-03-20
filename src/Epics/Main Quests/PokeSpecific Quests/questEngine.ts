import { Player as IPlayer } from "@minecraft/server";
import { listStorage, readPokemon } from "../../Pokemon Database/main.js";
import type { shortHand } from "../../Pokemon Database/@types/types.js";
import { selected } from "../../Main/Forms/PC/main.js";

// ============================================================
// TYPES
// ============================================================

export type Requirement =
    | { type: "own_species"; species: string }
    | { type: "own_species_iv"; species: string; minIV: number }
    | { type: "own_species_shiny"; species: string }
    | { type: "own_species_traded"; species: string }
    | { type: "own_species_level"; species: string; minLevel: number }
    | { type: "own_any_from_list"; speciesList: string[] }
    | { type: "unique_species_count"; amount: number }
    | { type: "shiny_count"; amount: number };

export type Quest = {
    id: string;
    displayName: string;
    category: string;
    icon: string;
    repeatable?: boolean;
    requirements: Requirement[];
    reward: (player: IPlayer) => void;
};

// ============================================================
// UTILITY
// ============================================================

function getAllPokemon(player: IPlayer): {
    species: string;
    data: any;
}[] {

    const results: {
        species: string;
        data: any;
    }[] = [];

    const speciesList = listStorage(player);

    // PC Storage
    for (const species of speciesList) {

        const mons = readPokemon(player, species, false) as unknown as {
            [rID: string]: shortHand;
        };

        for (const mon of Object.values(mons)) {
            results.push({
                species: species.toLowerCase(),
                data: mon
            });
        }
    }

    // Team
    for (let i = 0; i < 6; i++) {
        const slot = selected[player.name]?.[i];
        if (slot) {
            const [, species, data] = slot;
            results.push({
                species: species.toLowerCase(),
                data
            });
        }
    }

    return results;
}

function getUniqueSpeciesCount(player: IPlayer): number {
    const all = getAllPokemon(player);

    const unique = new Set(
        all.map(p => p.species.toLowerCase())
    );

    return unique.size;
}

function getShinyCount(player: IPlayer): number {
    const all = getAllPokemon(player);
    const shinyVariants = [1, 3, 5, 7, 9];

    return all.filter(p =>
        shinyVariants.includes(p.data.Variant ?? p.data.Vr ?? 0)
    ).length;
}

function getIVPercent(mon: any): number {
    const total =
        (mon.IV_health ?? 0) +
        (mon.IV_attack ?? 0) +
        (mon.IV_defense ?? 0) +
        (mon.IV_special_attack ?? 0) +
        (mon.IV_special_defense ?? 0) +
        (mon.IV_speed ?? 0);

    return Math.floor((total / 186) * 100);
}

// ============================================================
// REQUIREMENT EVALUATOR
// ============================================================

function evaluateRequirement(
    player: IPlayer,
    requirement: Requirement
): boolean {

    const all = getAllPokemon(player);
    const shinyVariants = [1, 3, 5, 7, 9];

    switch (requirement.type) {

        case "own_species":
            return all.some(p =>
                p.species === requirement.species.toLowerCase()
            );

        case "own_species_iv":
            return all.some(p =>
                p.species === requirement.species.toLowerCase() &&
                getIVPercent(p.data) >= requirement.minIV
            );

        case "own_species_shiny":
            return all.some(p =>
                p.species === requirement.species.toLowerCase() &&
                shinyVariants.includes(p.data.Variant ?? p.data.Vr ?? 0)
            );

        case "own_species_traded":
            return all.some(p =>
                p.species === requirement.species.toLowerCase() &&
                (p.data.Traded ?? false) === true
            );

        case "own_species_level":
            return all.some(p =>
                p.species === requirement.species.toLowerCase() &&
                (p.data.level ?? p.data.lv ?? 0) >= requirement.minLevel
            );

        case "own_any_from_list":
            return requirement.speciesList.every(req =>
                all.some(p => p.species === req.toLowerCase())
            );

        case "unique_species_count":
            return getUniqueSpeciesCount(player) >= requirement.amount;
        
        case "shiny_count":
            return getShinyCount(player) >= requirement.amount;    

        default:
            return false;
    }
}

// ============================================================
// QUEST LOGIC
// ============================================================

function getQuestPropertyKey(quest: Quest): string {
    return `quest_${quest.id}_claimed`;
}

export function isQuestComplete(player: IPlayer, quest: Quest): boolean {
    return quest.requirements.every(req =>
        evaluateRequirement(player, req)
    );
}

export function hasClaimed(player: IPlayer, quest: Quest): boolean {
    return Boolean(player.getDynamicProperty(getQuestPropertyKey(quest)));
}

export function markClaimed(player: IPlayer, quest: Quest): void {
    player.setDynamicProperty(getQuestPropertyKey(quest), true);
}

export function attemptClaim(player: IPlayer, quest: Quest): boolean {

    if (!isQuestComplete(player, quest)) {
        player.sendMessage("§cQuest requirements not met.");
        return false;
    }

    if (!quest.repeatable && hasClaimed(player, quest)) {
        player.sendMessage("§eYou have already claimed this reward.");
        return false;
    }

    if (!quest.repeatable) {
        markClaimed(player, quest);
    }

    try {
        quest.reward(player);
    } catch (error) {
        console.warn(`[Quest Engine] Reward error in quest: ${quest.id}`);
    }

    player.sendMessage(`§aQuest Complete: §2${quest.displayName}`);

    return true;
}

// ============================================================
// PROGRESS INFO
// ============================================================

export function getQuestProgress(player: IPlayer, quest: Quest) {

    const results = quest.requirements.map(req => ({
        requirement: req,
        complete: evaluateRequirement(player, req)
    }));

    const total = results.length;
    const completed = results.filter(r => r.complete).length;

    return {
        completed,
        total,
        percent: total === 0 ? 0 : Math.floor((completed / total) * 100),
        complete: completed === total,
        claimed: hasClaimed(player, quest),
        breakdown: results
    };
}

export function getRequirementBreakdown(player: IPlayer, quest: Quest) {

    return quest.requirements.map(req => {

        const met = evaluateRequirement(player, req);
        let label = "";

        switch (req.type) {

            case "own_species":
                label = req.species;
                break;

            case "own_species_level":
                label = `${req.species} (Lvl ${req.minLevel}+)`;
                break;

            case "own_species_iv":
                label = `${req.species} (${req.minIV}% IV+)`;
                break;

            case "own_species_shiny":
                label = `Shiny ${req.species}`;
                break;

            case "own_species_traded":
                label = `Traded ${req.species}`;
                break;

            case "own_any_from_list":
                label = req.speciesList.join(", ");
                break;

            case "unique_species_count": {
                const current = getUniqueSpeciesCount(player);
                label = `Own ${req.amount} Unique Species (§a${current}§f/${req.amount})`;
                break;
            }

            case "shiny_count": {
                const current = getShinyCount(player);
                label = `Own ${req.amount} Shiny Pokémon (§b${current}§f/${req.amount})`;
                break;
            }

            default:
                label = "Unknown Requirement";
                break;
        }

        return {
            label,
            met
        };
    });
}