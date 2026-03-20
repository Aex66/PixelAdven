import { Entity, world } from "@minecraft/server";

export class underground {
    static levelUp(entity: Entity) {
        world.scoreboard.getObjective('Lvl').addScore(entity, 1)
    }

    static experience(entity: Entity, exp: number) {
        world.scoreboard.getObjective('Ex').addScore(entity, exp)
    }
}