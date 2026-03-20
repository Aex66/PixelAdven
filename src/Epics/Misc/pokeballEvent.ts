import { world, Player, Entity, ItemStack } from "@minecraft/server";

const ENTITY_ID = "pokeworld:pokeball_event";
const STAFF_TAG = "Staff";

const POOL_PROPERTY = "pokeworld:reward_pool";
const LOCK_PROPERTY = "pokeworld:locked";

type RewardPool = Record<string, number>;

/* ===================================================== */
/* Pool Helpers */
/* ===================================================== */

function getPool(entity: Entity): RewardPool {
    try {
        const raw = entity.getDynamicProperty(POOL_PROPERTY);
        if (!raw) return {};
        return JSON.parse(raw as string);
    } catch {
        return {};
    }
}

function savePool(entity: Entity, pool: RewardPool) {
    entity.setDynamicProperty(POOL_PROPERTY, JSON.stringify(pool));
}

function isLocked(entity: Entity): boolean {
    return Boolean(entity.getDynamicProperty(LOCK_PROPERTY));
}

function lockEvent(entity: Entity) {
    entity.setDynamicProperty(LOCK_PROPERTY, true);
}

/* ===================================================== */
/* Add Items */
/* ===================================================== */

function addItem(entity: Entity, item: ItemStack) {

    const pool = getPool(entity);

    const id = item.typeId;
    const amount = item.amount;

    if (!pool[id]) pool[id] = 0;

    pool[id] += amount;

    savePool(entity, pool);
}

/* ===================================================== */
/* Give Rewards */
/* ===================================================== */

function formatItemName(id: string): string {

    const clean = id
        .replace(/^minecraft:/, "")
        .replace(/^pokeworld:/, "");

    return clean
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function giveRewards(player: Player, entity: Entity) {

    const pool = getPool(entity);

    const inventory = player.getComponent("minecraft:inventory")?.container;
    if (!inventory) return;

    const rewards: string[] = [];

    for (const id in pool) {

        const amount = pool[id];

        const stack = new ItemStack(id, amount);

        inventory.addItem(stack);

        rewards.push(`§e${amount}x §b${formatItemName(id)}`);
    }

    if (rewards.length > 0) {
        player.sendMessage(`§6You received: §r${rewards.join("§7, ")}`);
    }
}

/* ===================================================== */
/* Hit Detection */
/* ===================================================== */

world.afterEvents.entityHitEntity.subscribe((event) => {

    const target = event.hitEntity;
    const source = event.damagingEntity;

    if (!(source instanceof Player)) return;
    if (!target) return;
    if (target.typeId !== ENTITY_ID) return;

    const player = source;
    const isStaff = player.hasTag(STAFF_TAG);
    const sneaking = player.isSneaking;

    const inventory = player.getComponent("minecraft:inventory")?.container;
    if (!inventory) return;

    const slot = player.selectedSlotIndex;
    const item = inventory.getItem(slot);

    const locked = isLocked(target);

    /* ================================================= */
    /* STAFF LOCK EVENT */
    /* ================================================= */

    if (isStaff && sneaking && !locked) {

        lockEvent(target);

        player.sendMessage("§cPokéball Event locked. Players may now claim it.");
        return;
    }

    /* ================================================= */
    /* STAFF ADD ITEMS (ONLY BEFORE LOCK) */
    /* ================================================= */

    if (isStaff && !locked) {

        if (!item) {
            player.sendMessage("§7Hold an item to add to the event.");
            return;
        }

        addItem(target, item);

        inventory.setItem(slot, undefined);

        player.sendMessage(`§aAdded ${item.amount} ${item.typeId} to the reward pool.`);
        return;
    }

    /* ================================================= */
    /* CLAIM (ONLY AFTER LOCK) */
    /* ================================================= */

    if (!locked) {
        player.sendMessage("§7This event isn't ready yet.");
        return;
    }

    giveRewards(player, target);

    player.sendMessage("§6You claimed the Pokéball Event reward!");

    target.kill();

});