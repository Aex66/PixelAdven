
import { EnchantmentType, ItemStack, EnchantmentTypes, ItemTypes, ItemEnchantableComponent } from "@minecraft/server";
import quick from "../../quick.js";

export const getItemData = (item: ItemStack): ItemData => {
    if (!item?.typeId) return;
    const itemData: ItemData = {
        id: item.typeId,
        lore: item.getLore(),
        nameTag: item.nameTag,
        amount: item.amount,
        enchantments: [],
    }
    if (!item.hasComponent("enchantments")) return itemData
    const enchants = (item.getComponent('minecraft:enchantable') as ItemEnchantableComponent);
    for (let k of quick.enchantmentList) {
        const type = EnchantmentTypes.get(k);
        if (!type || !enchants.hasEnchantment(k)) continue;
        const enchant = enchants.getEnchantment(type as EnchantmentType);
        itemData.enchantments.push({
            id: enchant.type.toString(),
            level: enchant.level,
        });
    }
    return itemData;
}

/**
   * This function allows you to create a new itemStack instance with the data saved with the getItemData function.
   * @param {ItemData} itemData - The data saved to create a new item
   * @returns {itemStack}
*/
export const newItem = (itemData: ItemData, optionalAmount?: number): ItemStack => {
    const item = new ItemStack(
        ItemTypes.get(itemData.id),
        optionalAmount ?? itemData.amount
    );
    const enchComp = item.getComponent('minecraft:enchantable') as ItemEnchantableComponent,
        enchants = enchComp?.getEnchantments();
    if (enchants) {
        for (let enchant of itemData.enchantments) {
            const key = enchant.id
                .replace("minecraft:", "")
                .replace(/_(.)/g, (match) => match[1].toUpperCase());
            enchComp.addEnchantment({ type: new EnchantmentType(key), level: enchant.level });
        }
    }
    return item;
}