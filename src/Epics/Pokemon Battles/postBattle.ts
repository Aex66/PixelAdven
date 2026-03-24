/**
 * Post-battle processing — state sync, summary, trainer reward helpers.
 *
 * Called from PlayerBattler.onEnd after every battle.
 * Never imports from Battle.ts to avoid circular dependencies.
 */
import { Player as IPlayer, system } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
import { longHand } from '../Pokemon Database/@types/types.js';
import { writePokemon } from '../Pokemon Database/main.js';
import { checkExperienceForTeam } from '../Pokemon Calculations/levelingTeam.js';
import { StatusEffectsValues } from '../../Letters/pokemon/moves.js';

// ─── Shared types ──────────────────────────────────────────────────────────────

/**
 * Minimal shape of the Showdown |request| payload needed for state sync.
 * Full type lives in PlayerBattleHandler but we don't import it to avoid cycles.
 */
export interface SyncableRequest {
    side: {
        pokemon: Array<{
            ident:    string;  // "p1a: Pikachu"
            details:  string;  // "Pikachu, L25, M"
            condition: string; // "89/267 par" | "0 fnt"
            active:   boolean;
            moves:    string[];
        }>;
    };
    active?: Array<{
        moves: Array<{ move: string; id: string; pp?: number; maxpp?: number }>;
    }>;
}

/**
 * Data passed from Battle.ts to each battler's onEnd().
 */
export interface BattleResult {
    /** Money awarded to the player if they beat a trainer (0 if not applicable) */
    trainerReward: number;
}

/** Summary shown to the player after the battle ends. */
export interface BattleSummary {
    outcome:      'win' | 'lose' | 'tie';
    expGains:     Array<{ name: string; expGained: number; levelsGained: number }>;
    trainerReward: number;
}

// ─── Condition parsing ─────────────────────────────────────────────────────────

function parseCondition(condition: string): { current: number; max: number; status: string } {
    if (!condition || condition === '0 fnt') return { current: 0, max: 0, status: 'fnt' };
    const parts = condition.split(' ');
    const hp    = parts[0]?.split('/') ?? [];
    return {
        current: parseInt(hp[0] ?? '0', 10) || 0,
        max:     parseInt(hp[1] ?? '0', 10) || 0,
        status:  parts[1] ?? '',
    };
}

const SHOWDOWN_STATUS_TO_CONDITION: Record<string, 0 | StatusEffectsValues> = {
    par: 3, brn: 2, psn: 1, slp: 4, frz: 5, tox: 1,
};

// ─── 6a: Pokemon state sync ────────────────────────────────────────────────────

/**
 * Syncs Showdown's final battle state (HP, status, PP) back into the longHand
 * data objects and persists them via writePokemon.
 *
 * `team` is the battler's team array [id, species, data][].
 * team[i][2] IS the same object reference as selected[player.name][i][2],
 * so mutating it also updates `selected` in-place.
 *
 * The last |request| gives us HP/status for all party members and PP for the
 * active Pokemon.  HP/status for benched members comes from the request too
 * (which reflects state at the start of the final turn — off by at most one
 * round of damage, which is acceptable).
 */
export function syncPokemonState(
    player:  IPlayer,
    team:    [number, string, any][],
    lastReq: SyncableRequest | null
): void {
    if (!lastReq) return;

    const party        = lastReq.side.pokemon;
    const activeEntries = lastReq.active ?? [];

    // Map each active party member to its corresponding active[] entry.
    // In singles active[] has 1 entry, in doubles it has 2.
    let activeIdx = 0;

    for (let i = 0; i < Math.min(party.length, team.length); i++) {
        const slot      = party[i];
        const teamEntry = team[i];
        if (!slot || !teamEntry) continue;

        const mon:      longHand = teamEntry[2];
        const speciesId: string  = teamEntry[1];
        const pokeId:    number  = teamEntry[0];

        const { current, max, status } = parseCondition(slot.condition);

        mon.Current_Health = current;
        if (max > 0) mon.Base_Health = max;

        mon.condition = SHOWDOWN_STATUS_TO_CONDITION[status] ?? 0;

        // PP: overwrite from |request|.active for each active Pokemon
        if (slot.active && activeIdx < activeEntries.length) {
            const activeMoves = activeEntries[activeIdx]?.moves ?? [];
            activeIdx++;
            const ppSlots = ['Move1_PP', 'Move2_PP', 'Move3_PP', 'Move4_PP'] as const;
            for (let m = 0; m < Math.min(activeMoves.length, 4); m++) {
                const pp = activeMoves[m]?.pp;
                if (pp !== undefined) (mon as any)[ppSlots[m]] = pp;
            }
        }

        try { writePokemon(player, speciesId, pokeId, mon); } catch { /* DB error */ }
    }
}

// ─── 6b: Battle summary screen ────────────────────────────────────────────────

/**
 * Shows the post-battle summary form to the player.
 * Non-blocking: async but does not need to be awaited by the caller.
 */
export async function showBattleSummary(
    player:  IPlayer,
    summary: BattleSummary
): Promise<void> {
    if (!player?.isValid) return;

    const outcomeColor = summary.outcome === 'win' ? '§a' : summary.outcome === 'lose' ? '§c' : '§7';
    const outcomeText  = summary.outcome === 'win'  ? 'You won!'      :
                         summary.outcome === 'lose' ? 'You lost...'   : "It's a tie!";

    let body = `${outcomeColor}§l${outcomeText}§r`;

    if (summary.outcome === 'win' && summary.expGains.length > 0) {
        body += '\n\n§e§lEXP Earned:§r\n';
        for (const g of summary.expGains) {
            const levelTag = g.levelsGained > 0
                ? ` §a(Lv.Up ×${g.levelsGained})§r`
                : '';
            body += `  §b${g.name}§r  +${g.expGained} EXP${levelTag}\n`;
        }
    }

    if (summary.trainerReward > 0) {
        body += `\n§6+${summary.trainerReward} coins§r earned!`;
    }

    const form = new ActionFormData();
    form.title('§a§lBattle Summary§r');
    form.body(body.trim());
    form.button('§aContinue');

    // Wait a short moment so battle-end messages have been sent first
    await new Promise<void>(resolve => system.runTimeout(resolve, 40));

    try { await form.show(player as any); } catch { /* player gone */ }
}

// ─── 6c: Level-up ─────────────────────────────────────────────────────────────

/**
 * Runs post-EXP level-up checks for the given player.
 * Returns a map of team-slot-index → levels gained.
 *
 * This delegates entirely to the existing checkExperienceForTeam() which
 * already handles: stat recalculation, move learning, HP gain, scoreboard sync,
 * writePokemon, and player messages.
 */
export function runLevelUpChecks(
    player: IPlayer,
    team:   [number, string, any][]
): Map<number, number> {
    const levelsBefore = team.map(([, , data]) => (data as longHand).level ?? 1);

    checkExperienceForTeam(player);

    const levelsGained = new Map<number, number>();
    for (let i = 0; i < team.length; i++) {
        const after = (team[i][2] as longHand).level ?? 1;
        if (after > levelsBefore[i]) levelsGained.set(i, after - levelsBefore[i]);
    }
    return levelsGained;
}

// ─── 6e: Trainer reward ───────────────────────────────────────────────────────

/**
 * Reads the money reward from a trainer entity's dynamic property.
 * Falls back to a level-scaled default if not set.
 * Returns 0 for non-trainer battles.
 */
export function getTrainerReward(
    trainerEntity: { getDynamicProperty?: (key: string) => unknown } | null,
    trainerTeamHighestLevel: number
): number {
    if (!trainerEntity) return 0;
    try {
        const stored = trainerEntity.getDynamicProperty?.('reward_money');
        if (typeof stored === 'number' && stored > 0) return stored;
    } catch { /* ignore */ }
    // Default: 80 + 20 * highest level
    return 80 + 20 * Math.max(1, trainerTeamHighestLevel);
}
