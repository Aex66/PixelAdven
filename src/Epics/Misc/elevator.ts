import { world, system, Entity } from "@minecraft/server";

const BLOCKS_TO_TRAVEL = 20;
const SPEED = 1;
const TICKS = 20;
const STEP = SPEED / TICKS;

// ------------------------------------------------------
// ✅ Load persistent JSON state from entity
// ------------------------------------------------------
function loadState(e: Entity) {
    const raw = e.getDynamicProperty("elevator:state") as string;

    if (!raw) {
        const defaultState = {
            startY: e.location.y,
            direction: "idle",
            moving: false
        };
        e.setDynamicProperty("elevator:state", JSON.stringify(defaultState));
        return defaultState;
    }

    try {
        return JSON.parse(raw);
    } catch {
        // corrupted → reset
        const fallback = {
            startY: e.location.y,
            direction: "idle",
            moving: false
        };
        e.setDynamicProperty("elevator:state", JSON.stringify(fallback));
        return fallback;
    }
}

// ------------------------------------------------------
// ✅ Save state
// ------------------------------------------------------
function saveState(e: Entity, state: any) {
    e.setDynamicProperty("elevator:state", JSON.stringify(state));
}

// ------------------------------------------------------
// ✅ Initialize elevator on spawn
// ------------------------------------------------------
world.afterEvents.entitySpawn.subscribe(ev => {
    if (ev.entity.typeId !== "pokeworld:elevator") return;

    const defaultState = {
        startY: ev.entity.location.y,
        direction: "idle",
        moving: false
    };
    saveState(ev.entity, defaultState);
});

// ------------------------------------------------------
// ✅ Main movement update loop
// ------------------------------------------------------
system.runInterval(() => {
    const dim = world.getDimension("overworld");
    const elevators = dim.getEntities({ type: "pokeworld:elevator" });

    for (const elevator of elevators) {

        let state = loadState(elevator);

        // ✅ Start moving up
        if (elevator.hasTag("mode_moving_up")) {
            if (!state.moving) {
                state.moving = true;
                state.direction = "up";
                state.startY = elevator.location.y;
                saveState(elevator, state);
            }
        }

        // ✅ Start moving down
        if (elevator.hasTag("mode_moving_down")) {
            if (!state.moving) {
                state.moving = true;
                state.direction = "down";
                state.startY = elevator.location.y;
                saveState(elevator, state);
            }
        }

        // ✅ Not moving?
        if (!state.moving) continue;

        const pos = elevator.location;
        let newY = pos.y;

        if (state.direction === "up") newY += STEP;
        if (state.direction === "down") newY -= STEP;

        // ✅ Move elevator
        elevator.teleport({ x: pos.x, y: newY, z: pos.z }, { keepVelocity: false });

        const traveled = Math.abs(newY - state.startY);
        if (traveled >= BLOCKS_TO_TRAVEL) {
            stopElevator(elevator, state);
        }
    }
});

// ------------------------------------------------------
// ✅ Stop elevator — no rider handling at all
// ------------------------------------------------------
function stopElevator(elevator: Entity, state: any) {

    state.moving = false;
    const currentY = elevator.location.y;

    elevator.removeTag("mode_moving_up");
    elevator.removeTag("mode_moving_down");

    // ✅ Determine next direction tag
    if (currentY > state.startY) {
        elevator.addTag("mode_down_next");
    } else {
        elevator.addTag("mode_up_next");
    }

    state.direction = "idle";
    saveState(elevator, state);
}
