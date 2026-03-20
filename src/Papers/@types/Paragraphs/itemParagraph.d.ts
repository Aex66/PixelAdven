

interface EnchantmentData {
    id: string;
    level: number
}
interface ItemData {
    id: string;
    amount: number;
    nameTag: string;
    lore: string[];
    enchantments?: EnchantmentData[]
}