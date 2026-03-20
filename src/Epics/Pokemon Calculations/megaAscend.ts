import { world, Entity, system } from "@minecraft/server";

/* ===========================================================
   SCRIPT EVENT
   Run when Pokémon is summoned:
   scriptevent pokeworld:check_mega
=========================================================== */

const SCRIPT_EVENT_ID = "pokeworld:check_mega";

/* ===========================================================
   SCOREBOARD HELPER
=========================================================== */

function getScore(entity: Entity, objective: string): number {
    try {
        const obj = world.scoreboard.getObjective(objective);
        if (!obj) return 0;

        const id = entity.scoreboardIdentity;
        if (!id) return 0;

        return obj.getScore(id) ?? 0;
    } catch {
        return 0;
    }
}

/* ===========================================================
   MEGA DATA (STONE BASED)
=========================================================== */

const MEGA_DATA: Record<string, number[]> = {

    // Dual Megas
    "pokeworld:charizard": [47, 48],
    "pokeworld:mewtwo": [421, 422],

    // Single Megas
    "pokeworld:abomasnow": [392],
    "pokeworld:absol": [393],
    "pokeworld:aerodactyl": [394],
    "pokeworld:alakazam": [395],
    "pokeworld:aggron": [395],
    "pokeworld:altaria": [396],
    "pokeworld:ampharos": [397],
    "pokeworld:audino": [398],
    "pokeworld:banette": [399],
    "pokeworld:beedrill": [400],
    "pokeworld:blastoise": [401],
    "pokeworld:camerupt": [402],
    "pokeworld:diancie": [403],
    "pokeworld:gallade": [404],
    "pokeworld:garchomp": [405],
    "pokeworld:gardevoir": [406],
    "pokeworld:gengar": [407],
    "pokeworld:glalie": [408],
    "pokeworld:gyarados": [409],
    "pokeworld:heracross": [410],
    "pokeworld:houndoom": [411],
    "pokeworld:kangaskhan": [412],
    "pokeworld:latias": [413],
    "pokeworld:latios": [414],
    "pokeworld:lopunny": [415],
    "pokeworld:lucario": [416],
    "pokeworld:manectric": [417],
    "pokeworld:mawile": [418],
    "pokeworld:medicham": [419],
    "pokeworld:metagross": [420],
    "pokeworld:pidgeot": [423],
    "pokeworld:pinsir": [424],
    "pokeworld:sableye": [425],
    "pokeworld:salamence": [426],
    "pokeworld:sceptile": [427],
    "pokeworld:sharpedo": [428],
    "pokeworld:slowbro": [429],
    "pokeworld:steelix": [430],
    "pokeworld:swampert": [431],
    "pokeworld:tyranitar": [432],
    "pokeworld:venusaur": [433],
};

/* ===========================================================
   SPECIAL CHECK — MEGA RAYQUAZA
=========================================================== */

function canMegaRay(entity: Entity): boolean {
    const DRAGON_ASCENT = 185;

    const move1 = getScore(entity, "move1");
    const move2 = getScore(entity, "move2");
    const move3 = getScore(entity, "move3");
    const move4 = getScore(entity, "move4");

    return (
        move1 === DRAGON_ASCENT ||
        move2 === DRAGON_ASCENT ||
        move3 === DRAGON_ASCENT ||
        move4 === DRAGON_ASCENT
    );
}

/* ===========================================================
   MEGA CHECK LOGIC
=========================================================== */

function handleMegaCheck(entity: Entity) {
    if (!entity?.isValid) return;

    const variant = getScore(entity, "Variant");

    // only base variants allowed
    if (variant !== 0 && variant !== 1) {
        entity.removeTag("mega");
        entity.removeTag("megas");
        return;
    }

    // always clear first
    entity.removeTag("mega");
    entity.removeTag("megas");

    /* =========================
       🐉 MEGA RAYQUAZA LOGIC
    ========================= */

    if (entity.typeId === "pokeworld:rayquaza") {
        if (canMegaRay(entity)) {
            entity.addTag("mega");
        }
        return;
    }

    /* =========================
       NORMAL STONE MEGAS
    ========================= */

    const stones = MEGA_DATA[entity.typeId];
    if (!stones) return;

    const heldItem = getScore(entity, "heldItem");

    // first mega
    if (heldItem === stones[0]) {
        entity.addTag("mega");
        return;
    }

    // second mega (X/Y)
    if (stones.length > 1 && heldItem === stones[1]) {
        entity.addTag("megas");
    }
}

/* ===========================================================
   SCRIPT EVENT LISTENER
=========================================================== */

system.afterEvents.scriptEventReceive.subscribe((ev) => {
    if (ev.id !== SCRIPT_EVENT_ID) return;

    const entity = ev.sourceEntity;
    if (!entity || !entity.isValid) return;

    // delay so scoreboards exist after summon
    system.runTimeout(() => {
        handleMegaCheck(entity);
    }, 1);
});
