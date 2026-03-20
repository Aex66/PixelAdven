import { world, system, EquipmentSlot, Player, EntityEquippableComponent } from "@minecraft/server";

const ITEM_ID = "coptaine:minimap";
const TAG_ID = "sbd";
const TICK_INTERVAL = 5; // check every 5 ticks (~0.25s)

function hasMinimapEquipped(player: Player): boolean {
  const eq = player.getComponent("equippable") as EntityEquippableComponent | undefined;
  if (!eq) return false;

  const main = eq.getEquipment(EquipmentSlot.Mainhand);
  const off = eq.getEquipment(EquipmentSlot.Offhand);

  return (main?.typeId === ITEM_ID) || (off?.typeId === ITEM_ID);
}

system.runInterval(() => {
  for (const player of world.getPlayers()) {
    const shouldHave = hasMinimapEquipped(player);
    const hasTag = player.hasTag(TAG_ID);

    if (shouldHave && !hasTag) {
      player.addTag(TAG_ID);
    } else if (!shouldHave && hasTag) {
      player.removeTag(TAG_ID);
    }
  }
}, TICK_INTERVAL);