import { Player, world } from "@minecraft/server";
import { ModalForm, ActionForm } from "../../../Papers/FormPaper";

const ITEM_ID = "pokeworld:apricorn_seed";
const PRICE = 1000;

world.afterEvents.entityHitEntity.subscribe(({ damagingEntity, hitEntity }) => {
  if (
    !(damagingEntity instanceof Player) ||
    hitEntity?.typeId !== "pokeworld:gardener"
  ) return;

  openGardenerIntro(damagingEntity);
});

/* ===============================
   Intro Menu (Kurt-style)
================================ */
function openGardenerIntro(player: Player) {
  const form = new ActionForm();
  form.setTitle("§aGardener");

  form.setBody(
    "Hm? You’ve got a good eye.\n\n" +
    "These Apricorns aren’t just plants — they’re the heart of every Poké Ball.\n" +
    "Treat them right, and they’ll reward you."
  );

  form.addButton("§aBuy Apricorn Seeds");
  form.addButton("§bℹ How Apricorns Work");
  form.addButton("§7Leave");

  form.send(player, (res) => {
    if (res.canceled) return;

    switch (res.selection) {
      case 0:
        openGardenerShop(player);
        break;
      case 1:
        openApricornInfo(player);
        break;
      default:
        return;
    }
  });
}

/* ===============================
   Info Menu
================================ */
function openApricornInfo(player: Player) {
  const form = new ActionForm();
  form.setTitle("§bApricorn Guide");

  form.setBody(
    "🌱 §ePlanting\n" +
    "- Apricorn Seeds must be planted on §6tilled ground§e.\n" +
    "- When harvested, there is a §cbreak chance§e.\n\n" +

    "🎲 §eGrowth\n" +
    "- The Apricorn type is §6random§e when it grows.\n\n" +

    "🔥 §eProcessing\n" +
    "- Apricorns must be §6cooked§e before use.\n\n" +

    "⚙ §ePoké Ball Crafting\n" +
    "- Combine cooked Apricorns with:\n" +
    "  • Other Apricorns\n" +
    "  • A §7Stone Button§e\n" +
    "  • §7Iron Bases§e (made from Iron Ingots)\n\n" +
    "Master the process, and you’ll never run out of Poké Balls."
  );

  form.addButton("§aBack");

  form.send(player, () => {
    openGardenerIntro(player);
  });
}

/* ===============================
   Buy Menu
================================ */
function openGardenerShop(player: Player) {
  const form = new ModalForm();
  form.setTitle("§aGardener");

  form.addSlider(
    "Apricorn Seeds (§6$1000§r each)",
    1,
    64,
    1,
    1
  );

  form.send(player, (res) => {
    if (res.canceled) return;

    const amount = res.formValues[0] as number;
    const totalCost = amount * PRICE;

    const moneyObj = world.scoreboard.getObjective("Money");
    if (!moneyObj) {
      player.sendMessage("§cMoney scoreboard not found.");
      return;
    }

    const balance = moneyObj.getScore(player) ?? 0;

    if (balance < totalCost) {
      player.sendMessage(
        `§cYou need $${totalCost} but only have $${balance}.`
      );
      return;
    }

    moneyObj.setScore(player, balance - totalCost);
    player.runCommand(`give @s ${ITEM_ID} ${amount}`);

    player.sendMessage(
      `§aPurchased ${amount} Apricorn Seed(s) for §6$${totalCost}`
    );
  });
}
