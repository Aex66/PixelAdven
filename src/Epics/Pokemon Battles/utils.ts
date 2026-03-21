/**
 * Battle utility functions - scoreboard, entity helpers.
 */
import { Entity, world } from '@minecraft/server';

export function getScore(entity: Entity, objective: string): number | undefined {
    try {
        const obj = world.scoreboard.getObjective(objective);
        if (!obj) return undefined;
        const identity = entity.scoreboardIdentity;
        if (!identity) return undefined;
        return obj.getScore(identity);
    } catch {
        return undefined;
    }
}

export function setScore(entity: Entity, objective: string, value: number): boolean {
    try {
        let obj = world.scoreboard.getObjective(objective);
        if (!obj) obj = world.scoreboard.addObjective(objective, objective);
        obj.setScore(entity.scoreboardIdentity ?? entity, value);
        return true;
    } catch {
        return false;
    }
}
