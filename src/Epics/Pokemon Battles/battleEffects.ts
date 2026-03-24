/**
 * Battle VFX queue, entity sync, and contact melee — used by protocol handlers.
 */
import { Entity, system } from '@minecraft/server';
import { Dex } from './simulator.js';
import { setScore } from './utils.js';
import pokemonMoves from '../../Letters/pokemon/moves.js';
import TypeList from '../../Letters/pokemon/TypeList.js';
import { Battler, SlotKey } from './classes/Battlers/Battler.js';
import type { BattleSession } from './classes/Battle.js';
import { parseProtocolLine, parsePokemonIdent, slotKeyFromShowdownPosition } from './protocol.js';

const ATTACK_PARTICLES: Record<string, string> = {
    None: '', Fire: 'pokeworld:fire_attack', Water: 'pokeworld:water_attack',
    Normal: '', Electric: 'pokeworld:electric_attack', Grass: 'pokeworld:grass_attack',
    Ground: 'pokeworld:ground_attack', Rock: 'pokeworld:rock_attack',
    Ice: 'pokeworld:ice_attack', Fighting: 'pokeworld:fighting_attack',
    Poison: 'pokeworld:poison_attack', Ghost: 'pokeworld:ghost_attack',
    Psychic: 'pokeworld:psychic_attack', Dragon: 'pokeworld:dragon_attack',
    Fairy: 'pokeworld:fairy_attack', Steel: 'pokeworld:steel_attack',
    Dark: 'pokeworld:dark_attack', Bug: 'pokeworld:bug_attack',
    Flying: 'pokeworld:flying_attack',
};

const MOVE_TYPE_MAP = new Map<string, number>(
    Object.entries(pokemonMoves as Record<string, { type: number }>)
        .map(([name, data]) => [name.toLowerCase(), data.type])
);

const MOVE_NAME_TO_INDEX = new Map<string, number>(
    Object.keys(pokemonMoves as Record<string, unknown>).map((name, i) => [name.toLowerCase(), i])
);

const MOVE_SLOTS  = ['Move1',    'Move2',    'Move3',    'Move4'   ] as const;
const MOVE_PP_SLOTS = ['Move1_PP', 'Move2_PP', 'Move3_PP', 'Move4_PP'] as const;

const CONTACT_LUNGE_IMPULSE       = 0.26;
const CONTACT_LUNGE_STEP_DELAY    = 1;
const CONTACT_LUNGE_FORWARD_STEPS = 3;
const CONTACT_LUNGE_HIT_PAUSE_TICKS = 2;
const CONTACT_LUNGE_RETURN_STEPS  = 4;
const CONTACT_MELEE_HIT_STANDOFF = 0.48;

const ATTACK_PARTICLE_DELAY_TICKS       = 10;
const ATTACK_PARTICLE_EXTRA_BUFFER_TICKS = 2;
const MOVE_LOG_HOLD_TICKS = 40;
const FORM_HOLD_EXTRA_TICKS = 20;

export function computeContactMeleeDurationTicks(): number {
    const forwardEndTick =
        (CONTACT_LUNGE_FORWARD_STEPS - 1) * CONTACT_LUNGE_STEP_DELAY + CONTACT_LUNGE_HIT_PAUSE_TICKS;
    const lastReturnTick =
        forwardEndTick + (CONTACT_LUNGE_RETURN_STEPS - 1) * CONTACT_LUNGE_STEP_DELAY;
    return lastReturnTick + 1;
}

function computeMoveVfxDurationTicks(isContactMove: boolean, hasParticle: boolean): number {
    if (isContactMove && hasParticle) {
        return Math.max(
            ATTACK_PARTICLE_DELAY_TICKS + ATTACK_PARTICLE_EXTRA_BUFFER_TICKS,
            computeContactMeleeDurationTicks()
        );
    }
    if (isContactMove) return computeContactMeleeDurationTicks();
    if (hasParticle) return ATTACK_PARTICLE_DELAY_TICKS + ATTACK_PARTICLE_EXTRA_BUFFER_TICKS;
    return 0;
}

export interface MoveVfxJob {
    durationTicks: number;
    run: () => void;
    gen: number;
}

export function resetMoveVfxSessionState(session: BattleSession): void {
    session.moveVfxGen++;
    session.moveVfxQueue.length = 0;
    session.processingMoveVfx = false;
    session.pendingMoveVfxTotalTicks = 0;
}

export function enqueueMoveVfx(session: BattleSession, job: Omit<MoveVfxJob, 'gen'>): void {
    if (session.ended) return;
    session.pendingMoveVfxTotalTicks += job.durationTicks;
    session.moveVfxQueue.push({ ...job, gen: session.moveVfxGen });
    if (!session.processingMoveVfx) processNextMoveVfx(session);
}

export function processNextMoveVfx(session: BattleSession): void {
    if (session.ended) {
        session.processingMoveVfx = false;
        session.moveVfxQueue.length = 0;
        return;
    }
    if (session.moveVfxQueue.length === 0) {
        session.processingMoveVfx = false;
        return;
    }
    session.processingMoveVfx = true;
    const job = session.moveVfxQueue.shift()!;
    job.run();
    system.runTimeout(() => {
        if (session.ended) return;
        if (job.gen !== session.moveVfxGen) {
            processNextMoveVfx(session);
            return;
        }
        session.pendingMoveVfxTotalTicks -= job.durationTicks;
        processNextMoveVfx(session);
    }, job.durationTicks);
}

export function getActiveEntity(battlers: Map<'p1' | 'p2', Battler>, identStr: string): Entity | null {
    const match = identStr.match(/^(p[12])([ab])/);
    if (!match) return null;
    return battlers.get(match[1] as 'p1' | 'p2')?.activePokemon.get(match[2] as SlotKey) ?? null;
}

function snapAttackerToMeleeContact(attacker: Entity, target: Entity): void {
    if (!attacker.isValid || !target.isValid) return;
    const ax = attacker.location.x;
    const az = attacker.location.z;
    const tx = target.location.x;
    const tz = target.location.z;
    let dx = tx - ax;
    let dz = tz - az;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < 0.08) return;
    dx /= dist;
    dz /= dist;
    const s = CONTACT_MELEE_HIT_STANDOFF;
    if (dist <= s + 0.06) return;
    const nx = tx - dx * s;
    const nz = tz - dz * s;
    const ny = attacker.location.y;
    try {
        attacker.teleport({ x: nx, y: ny, z: nz }, { keepVelocity: false });
    } catch { /* ignore */ }
}

export function scheduleContactMeleeLunge(
    attacker: Entity,
    target: Entity,
    session: BattleSession,
    onComplete?: () => void
): void {
    if (!attacker.isValid || !target.isValid) {
        onComplete?.();
        return;
    }
    if (attacker.id === target.id) {
        onComplete?.();
        return;
    }

    const start = { x: attacker.location.x, y: attacker.location.y, z: attacker.location.z };
    const tx = target.location.x;
    const tz = target.location.z;
    let dx = tx - start.x;
    let dz = tz - start.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < 0.12) {
        onComplete?.();
        return;
    }
    dx /= dist;
    dz /= dist;

    const impulse = CONTACT_LUNGE_IMPULSE;

    for (let i = 0; i < CONTACT_LUNGE_FORWARD_STEPS; i++) {
        const tick = i * CONTACT_LUNGE_STEP_DELAY;
        system.runTimeout(() => {
            if (session.ended || !attacker.isValid) return;
            try {
                attacker.applyImpulse({ x: dx * impulse, y: 0, z: dz * impulse });
            } catch { /* ignore */ }
        }, tick);
    }

    const lastForwardTick = (CONTACT_LUNGE_FORWARD_STEPS - 1) * CONTACT_LUNGE_STEP_DELAY;
    system.runTimeout(() => {
        if (session.ended || !attacker.isValid || !target.isValid) return;
        snapAttackerToMeleeContact(attacker, target);
    }, lastForwardTick + 1);

    const forwardEndTick =
        (CONTACT_LUNGE_FORWARD_STEPS - 1) * CONTACT_LUNGE_STEP_DELAY + CONTACT_LUNGE_HIT_PAUSE_TICKS;

    for (let j = 0; j < CONTACT_LUNGE_RETURN_STEPS; j++) {
        const tick = forwardEndTick + j * CONTACT_LUNGE_STEP_DELAY;
        system.runTimeout(() => {
            if (session.ended || !attacker.isValid) return;
            const loc = attacker.location;
            let rx = start.x - loc.x;
            let rz = start.z - loc.z;
            const rd = Math.sqrt(rx * rx + rz * rz);
            if (rd < 0.08) return;
            rx /= rd;
            rz /= rd;
            try {
                attacker.applyImpulse({ x: rx * impulse * 0.92, y: 0, z: rz * impulse * 0.92 });
            } catch { /* ignore */ }
        }, tick);
    }

    const lastReturnTick =
        forwardEndTick + (CONTACT_LUNGE_RETURN_STEPS - 1) * CONTACT_LUNGE_STEP_DELAY;
    system.runTimeout(() => {
        if (session.ended) return;
        onComplete?.();
    }, lastReturnTick);
}

export const SHOWDOWN_STATUS_MAP: Record<string, number> = {
    psn: 1, brn: 2, par: 3, slp: 4, frz: 5, tox: 8,
};

export function syncEntityCondition(entity: Entity | null, conditionId: number): void {
    if (!entity) return;
    try { if (entity.isValid) setScore(entity, 'condition', conditionId); } catch { /* gone */ }
}

export function syncEntityHP(entity: Entity | null, hpStr: string): void {
    if (!entity) return;
    try {
        if (!entity.isValid) return;
        const match = hpStr.match(/^(\d+)(?:\/(\d+))?/);
        if (match) {
            setScore(entity, 'HP_Low', parseInt(match[1], 10));
            if (match[2]) {
                const maxHp = parseInt(match[2], 10);
                setScore(entity, 'HP_High', maxHp);
            }
        }
    } catch { /* gone */ }
}

/** Maps Showdown `-damage` / `-heal` / `-sethp` lines onto the active Minecraft entity. */
export function syncHpFromShowdown(session: BattleSession, message: string): void {
    const { args } = parseProtocolLine(message);
    syncEntityHP(
        getActiveEntity(session.battlers, args[0] ?? ''),
        args[1] ?? ''
    );
}

/** Applies |move| participation, PP, VFX queue, and form hold. */
export function applyMoveInstruction(session: BattleSession, message: string): void {
    const { args } = parseProtocolLine(message);
    const attackerIdent = args[0] ?? '';
    const moveName      = args[1] ?? '';
    const targetIdent   = args[2] ?? '';

    const sideMatch = attackerIdent.match(/^(p[12])/);
    if (sideMatch) {
        const attackerSide = sideMatch[1] as 'p1' | 'p2';
        const pokeName     = attackerIdent.split(': ')[1] ?? '';
        const battler      = session.battlers.get(attackerSide);
        const parsedAtt    = parsePokemonIdent(attackerIdent);
        let teamEntry: [number, string, any] | undefined;
        if (parsedAtt && parsedAtt.playerShowdownId === attackerSide && battler) {
            const teamIdx = battler.deployedIndices.get(
                slotKeyFromShowdownPosition(parsedAtt.position)
            );
            if (teamIdx !== undefined) {
                const pp = battler.party[teamIdx];
                if (pp) pp.participated = true;
                teamEntry = battler.team[teamIdx];
            }
        }
        if (!teamEntry && battler && pokeName) {
            teamEntry = battler.team.find(([, sp]) => sp === pokeName);
        }
        if (teamEntry && moveName) {
            const mon     = teamEntry[2] as any;
            const moveIdx = MOVE_NAME_TO_INDEX.get(moveName.toLowerCase()) ?? -1;
            if (moveIdx >= 0) {
                for (let m = 0; m < 4; m++) {
                    if (mon[MOVE_SLOTS[m]] === moveIdx) {
                        mon[MOVE_PP_SLOTS[m]] = Math.max(0, (mon[MOVE_PP_SLOTS[m]] ?? 0) - 1);
                        break;
                    }
                }
            }
        }
    }

    let durationTicks = MOVE_LOG_HOLD_TICKS;
    let run: () => void = () => {};

    if (moveName && targetIdent && !targetIdent.startsWith('[')) {
        const isContactMove = Boolean(Dex.moves.get(moveName)?.flags?.contact);
        const typeNum  = MOVE_TYPE_MAP.get(moveName.toLowerCase()) ?? 0;
        const typeName = (TypeList[typeNum] as string | undefined) ?? 'None';
        const particle = ATTACK_PARTICLES[typeName] ?? '';
        const hasParticle = Boolean(particle);
        const vfxDur = computeMoveVfxDurationTicks(isContactMove, hasParticle);
        if (vfxDur > 0) {
            durationTicks = vfxDur;
            const attackerIdentForVfx = attackerIdent;
            const targetIdentForVfx   = targetIdent;
            run = () => {
                if (particle) {
                    const entitySnap = getActiveEntity(session.battlers, targetIdentForVfx);
                    if (entitySnap) {
                        system.runTimeout(() => {
                            try {
                                if (entitySnap.isValid)
                                    entitySnap.dimension.spawnParticle(
                                        particle,
                                        entitySnap.location
                                    );
                            } catch { /* ignore */ }
                        }, ATTACK_PARTICLE_DELAY_TICKS);
                    }
                }
                if (isContactMove) {
                    const attackerEntity = getActiveEntity(
                        session.battlers,
                        attackerIdentForVfx
                    );
                    const targetEntity = getActiveEntity(
                        session.battlers,
                        targetIdentForVfx
                    );
                    if (attackerEntity && targetEntity)
                        scheduleContactMeleeLunge(
                            attackerEntity,
                            targetEntity,
                            session
                        );
                }
            };
        }
    }

    enqueueMoveVfx(session, { durationTicks, run });

    const holdTicks =
        session.pendingMoveVfxTotalTicks + FORM_HOLD_EXTRA_TICKS;
    for (const battler of session.battlers.values()) {
        battler.setFormHold(holdTicks);
    }
}
