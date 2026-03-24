/**
 * Arena positioning and camera utilities for battle entity placement.
 *
 * Computes world-space positions for Pokemon slots based on the midpoint
 * between the two battler controllers (player / wild entity / trainer NPC).
 */
import { Entity, Player, system } from '@minecraft/server';
import { GameType } from './formats.js';

// ─── Vector helpers ─────────────────────────────────────────────────────────────

interface Vec3 { x: number; y: number; z: number }

export function findCenter(vectors: Vec3[]): Vec3 {
    if (vectors.length === 0) return { x: 0, y: 0, z: 0 };
    if (vectors.length === 1) return vectors[0]!;
    let sx = 0, sy = 0, sz = 0;
    for (const v of vectors) { sx += v.x; sy += v.y; sz += v.z; }
    const n = vectors.length;
    return { x: sx / n, y: sy / n, z: sz / n };
}

function subtract(a: Vec3, b: Vec3): Vec3 {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function add(a: Vec3, b: Vec3): Vec3 {
    return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

function scale(v: Vec3, s: number): Vec3 {
    return { x: v.x * s, y: v.y * s, z: v.z * s };
}

function normalizeXZ(v: Vec3): Vec3 {
    const len = Math.sqrt(v.x * v.x + v.z * v.z);
    if (len < 0.001) return { x: 0, y: 0, z: 1 };
    return { x: v.x / len, y: 0, z: v.z / len };
}

function perpendicularXZ(v: Vec3): Vec3 {
    return { x: -v.z, y: 0, z: v.x };
}

function getRotationY(from: Vec3, to: Vec3): number {
    const dx = to.x - from.x;
    const dz = to.z - from.z;
    return (Math.atan2(dz, dx) * 180) / Math.PI;
}

// ─── Slot position data ─────────────────────────────────────────────────────────

export interface SlotPosition {
    pos: Vec3;
    facingPos: Vec3;
}

export interface ArenaLayout {
    center: Vec3;
    slots: {
        p1a: SlotPosition;
        p1b: SlotPosition;
        p2a: SlotPosition;
        p2b: SlotPosition;
    };
}

// ─── Position computation ───────────────────────────────────────────────────────

/**
 * Computes arena positions from the midpoint of two controller locations.
 *
 * SINGLES (3 blocks apart):
 *   p1a ←1.5→ center ←1.5→ p2a     (facing each other)
 *
 * DOUBLES (2 blocks ally spacing, 3 blocks between sides):
 *   p1a ── 2 ── p1b
 *    |              |
 *    3              3
 *    |              |
 *   p2b ── 2 ── p2a
 *   p1a faces p2b, p1b faces p2a  (mirror)
 */
export function computeArenaPositions(
    p1Loc: Vec3,
    p2Loc: Vec3,
    gameType: GameType
): ArenaLayout {
    const center = findCenter([p1Loc, p2Loc]);

    // Forward axis: from p1 toward p2 (XZ only)
    const forward = normalizeXZ(subtract(p2Loc, p1Loc));
    // Lateral axis: perpendicular to forward in the XZ plane
    const lateral = perpendicularXZ(forward);

    if (gameType === 'singles') {
        const p1aPos = add(center, scale(forward, -1.5));
        const p2aPos = add(center, scale(forward,  1.5));
        return {
            center,
            slots: {
                p1a: { pos: p1aPos, facingPos: p2aPos },
                p1b: { pos: p1aPos, facingPos: p2aPos },
                p2a: { pos: p2aPos, facingPos: p1aPos },
                p2b: { pos: p2aPos, facingPos: p1aPos },
            },
        };
    }

    // Doubles layout
    const halfAlly = 1;    // 2 blocks total between allies → 1 each side
    const halfGap  = 1.5;  // 3 blocks between sides → 1.5 from center

    const p1aPos = add(add(center, scale(forward, -halfGap)), scale(lateral, -halfAlly));
    const p1bPos = add(add(center, scale(forward, -halfGap)), scale(lateral,  halfAlly));
    const p2aPos = add(add(center, scale(forward,  halfGap)), scale(lateral,  halfAlly));
    const p2bPos = add(add(center, scale(forward,  halfGap)), scale(lateral, -halfAlly));

    return {
        center,
        slots: {
            p1a: { pos: p1aPos, facingPos: p2bPos },
            p1b: { pos: p1bPos, facingPos: p2aPos },
            p2a: { pos: p2aPos, facingPos: p1bPos },
            p2b: { pos: p2bPos, facingPos: p1aPos },
        },
    };
}

// ─── Camera ─────────────────────────────────────────────────────────────────────

/**
 * Battle camera: static elevated side view, looking at the arena center.
 * Kept for the whole fight until {@link Player.camera.clear} on battle end.
 */
export function playBattleCamera(
    player: Player,
    center: Vec3,
    forward: Vec3
): void {
    if (!player?.isValid) return;
    const lat    = perpendicularXZ(forward);
    const camPos = add(add(center, scale(lat, 10)), { x: 0, y: 6, z: 0 });
    try {
        player.runCommand(
            `camera @s set minecraft:free ease 0.3 linear pos ${camPos.x.toFixed(2)} ${camPos.y.toFixed(2)} ${camPos.z.toFixed(2)} facing ${center.x.toFixed(2)} ${center.y.toFixed(2)} ${center.z.toFixed(2)}`
        );
    } catch { /* camera error */ }
}

/**
 * Overhead intro camera pan — plays once at battle start to hide entity placement.
 * Elevated position 8 blocks above and 6 out to the side, looking down at center.
 * After `durationTicks`, transitions to {@link playBattleCamera} (no clear).
 */
export function playIntroCameraAnimation(
    player: Player,
    center: Vec3,
    forward: Vec3,
    durationTicks = 60
): void {
    if (!player?.isValid) return;
    const lat  = perpendicularXZ(forward);
    const camPos = add(add(center, scale(lat, 8)), { x: 0, y: 8, z: 0 });
    try {
        player.runCommand(
            `camera @s set minecraft:free ease 0.5 linear pos ${camPos.x.toFixed(2)} ${camPos.y.toFixed(2)} ${camPos.z.toFixed(2)} facing ${center.x.toFixed(2)} ${center.y.toFixed(2)} ${center.z.toFixed(2)}`
        );
        system.runTimeout(() => {
            try { playBattleCamera(player, center, forward); } catch { /* gone */ }
        }, durationTicks);
    } catch { /* camera error */ }
}

/**
 * Teleports an entity to a slot position, facing its target position.
 */
export function teleportToSlot(entity: Entity, slot: SlotPosition): void {
    if (!entity?.isValid) return;
    try {
        entity.runCommand(
            `tp @s ${slot.pos.x.toFixed(2)} ${slot.pos.y.toFixed(2)} ${slot.pos.z.toFixed(2)} facing ${slot.facingPos.x.toFixed(2)} ${slot.facingPos.y.toFixed(2)} ${slot.facingPos.z.toFixed(2)}`
        );
    } catch { /* entity gone */ }
}
