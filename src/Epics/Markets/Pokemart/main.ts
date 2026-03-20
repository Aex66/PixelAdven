import { Player, world } from "@minecraft/server";
import { ModalForm, ActionForm } from "../../../Papers/FormPaper";
import { Backpack } from "../../Misc/backbag";
import { itemPrices } from "./itemPrices";
import { backpackConfig } from "../../../Letters/pokemon/backpackConfig";

world.afterEvents.entityHitEntity.subscribe(({ damagingEntity, hitEntity }) => {
  if (
    hitEntity?.typeId !== "pokeworld:general_shopkeeper" ||
    !(damagingEntity instanceof Player)
  )
    return;
  openShop(damagingEntity);
});

function openShop(player: Player) {
  const form = new ActionForm();
  form.setTitle(" General Shop");
  form.setBody("Would you like to buy or sell?");
  form.addButton("§aBuy Items");
  form.addButton("§cSell Items");

  form.send(player, async (res) => {
    if (res.canceled) return;
    const mode = res.selection === 0 ? "buy" : "sell";
    openCategoryMenu(player, mode);
  });
}

function openCategoryMenu(player: Player, mode: "buy" | "sell") {
  const form = new ActionForm();
  form.setTitle(`${mode === "buy" ? "Buy" : "Sell"} Categories`);
  const categories = Object.keys(backpackConfig);
  for (const category of categories) form.addButton(category);
  form.addButton("§7⬅ Back"); // Add manual back button
  form.send(player, (res) => {
    if (res.canceled || res.selection === categories.length) {
      openShop(player); // 🔁 Return to Buy/Sell menu
      return;
    }
    const category = categories[res.selection];
    openItemMenu(player, category, mode);
  });
}

function openItemMenu(player: Player, category: string, mode: "buy" | "sell") {
  const form = new ActionForm();
  form.setTitle(`${mode === "buy" ? "§9§9§rBuy" : "§9§9§rSell"}: ${category}`);
  const backpack = new Backpack(player);
  const items = backpackConfig[category].filter((item) => {
    const price = itemPrices[item.id]?.[mode];
    const count = backpack.getItemCount(category, item.id);
    if (mode === "buy") return typeof price === "number" && price > 0;
    return typeof price === "number" && price > 0 && count > 0;
  });

  if (items.length === 0) {
    player.sendMessage(`§cNo items in ${category} are available to ${mode}.`);
    openCategoryMenu(player, mode);
    return;
  }

  for (const item of items) {
    const price = itemPrices[item.id]?.[mode] ?? 0;
    const count = backpack.getItemCount(category, item.id);
    const label =
      `${item.displayName} - $${price}` +
      (mode === "sell" ? ` | You: ${count}` : "");
    form.addButton(label, item.texturePath);
  }

  form.addButton("Back", "textures/ui/seventh/undo.png");

  form.send(player, (res) => {
    if (res.canceled || res.selection === items.length) {
      openCategoryMenu(player, mode);
      return;
    }

    const item = items[res.selection];
    const price = itemPrices[item.id]?.[mode] ?? 0;
    const count = backpack.getItemCount(category, item.id);
    const modal = new ModalForm();
    modal.setTitle(`${mode === "buy" ? "Buy" : "Sell"} ${item.displayName}`);
    const maxAmount = mode === "buy" ? 64 : count;
    modal.addSlider(`Amount`, 1, maxAmount, 1, 1);
    modal.send(player, (modalRes) => {
      if (modalRes.canceled) {
        openItemMenu(player, category, mode);
        return;
      }

      const qty = modalRes.formValues[0];
      const totalCost = qty * price;
      const money = world.scoreboard.getObjective("Money");
      const score = money?.getScore(player) ?? 0;

      if (mode === "buy") {
        if (score < totalCost) {
          player.sendMessage(
            `§cYou don't have enough money! You need $${totalCost}, but only have $${score}.`
          );
          return;
        }
        money.setScore(player, score - totalCost);
        backpack.addItem(category, item.id, qty);
        player.sendMessage(
          `§aPurchased ${qty}x ${item.displayName} for $${totalCost}`
        );

        // 📌 Story Quest Hook
        const stage = Number(
          player.getDynamicProperty("quest_chapter1_stage") ?? 0
        );
        if (stage === 3) {
          player.setDynamicProperty("quest_chapter1_stage", 4);
          player.sendMessage(
            "§dStory Quest Updated: You bought something from the PokéMart!"
          );
          player.sendMessage(
            "§bNext: (Open Quest menu to claim reward and Complete Chapter 1)."
          );
        }
      } else if (mode === "sell") {
        if (count < qty) {
          player.sendMessage(
            `§cYou don't have enough ${item.displayName} to sell!`
          );
          return;
        }
        backpack.removeItem(category, item.id, qty);
        money.setScore(player, score + totalCost);
        player.sendMessage(
          `§aSold ${qty}x ${item.displayName} for $${totalCost}`
        );
      }

      backpack.save();
    });
  });
}
