import { world, Player, EquipmentSlot } from "@minecraft/server";

world.afterEvents.entityHitEntity.subscribe(({ damagingEntity: hitter, hitEntity: victim }) => {

    // Ensure hitter is a player
    if (!(hitter instanceof Player)) return;

    // ❌ Already mega evolved (prevents spam)
    if (victim.hasTag("mega_used")) return;

    /* =====================================
       NEW: Transform check
       If Transform = 1 → block mega evolve
    ===================================== */
    const transform =
        world.scoreboard.getObjective("Transform")?.getScore(victim) ?? 0;

    if (transform === 1) return;

    // Offhand check
    const offhand = hitter
        .getComponent("equippable")
        ?.getEquipment(EquipmentSlot.Offhand);

    if (
        !offhand ||
        ![
            "pokeworld:mega_bracelet",
            "pokeworld:mega_chain",
            "pokeworld:mega_belt",
        ].includes(offhand.typeId)
    ) {
        return;
    }

    // Owner + mega tag check
    const playerNameTag = `o:${hitter.name}`;
    if (
        !victim.hasTag(playerNameTag) ||
        !(victim.hasTag("mega") || victim.hasTag("megas"))
    ) {
        return;
    }

    // Variant score
    const variant =
        world.scoreboard.getObjective("Variant")?.getScore(victim) ?? 0;

    /* =====================================
       MEGA EVOLUTION TRIGGER
    ===================================== */

    if (victim.hasTag("mega")) {

        if (variant === 0) {
            hitter.runCommand(
                `event entity @e[tag="o:${hitter.name}",scores={Variant=0},tag=mega] pokeworld:mega_one`
            );
        }
        else if (variant === 1) {
            hitter.runCommand(
                `event entity @e[tag="o:${hitter.name}",scores={Variant=1},tag=mega] pokeworld:mega_ones`
            );
        }

        // 🔒 prevent re-trigger
        victim.addTag("mega_used");
    }

    else if (victim.hasTag("megas")) {

        if (variant === 0) {
            hitter.runCommand(
                `event entity @e[tag="o:${hitter.name}",scores={Variant=0},tag=megas] pokeworld:mega_two`
            );
        }
        else if (variant === 1) {
            hitter.runCommand(
                `event entity @e[tag="o:${hitter.name}",scores={Variant=1},tag=megas] pokeworld:mega_twos`
            );
        }

        // 🔒 prevent re-trigger
        victim.addTag("mega_used");
    }
});
