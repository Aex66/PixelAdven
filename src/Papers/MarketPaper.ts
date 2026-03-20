/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
Aex66 (Developer)
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
__________ ___________________
\______   \\_____  \__    ___/
 |       _/ /   |   \|    |
 |    |   \/    |    \    |
 |____|_  /\_______  /____|
        \/         \/
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
© Copyright 2023 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Website: https://www.rotmc.ml
Thank you!
*/
import { world, ItemStack, system, Player as IPlayer, Container } from "@minecraft/server";
import { metricNumbers } from "./Paragraphs/ConvertersParagraphs.js";
import { ActionForm, MessageForm, ModalForm } from "./FormPaper.js";
import { confirmForm } from "./Paragraphs/ExtrasParagraphs.js";
import { PlayerType } from "./@types/PlayerTypes.js";
import Player from "./PlayerPaper.js";
import { getScore } from "../Epics/Pokemon Battles/utils.js";

const objectives = {
  "pokeworld:pokeball": "pokeball",
  "pokeworld:greatball": "greatball",
  "pokeworld:ultraball": "ultraball",
  "pokeworld:potion": "potion",
  "pokeworld:super_potion": "super_potion",
  "pokeworld:hyper_potion": "hyper_potion",
  "pokeworld:max_potion": "max_potion",
  "pokeworld:max_revive": "max_revive",
} as const;

class MarketPaper {
  config: MarketTypes["config"];
  categories: MarketTypes["categories"];
  categoryKeys: string[];

  constructor(config: MarketTypes["config"], categories: MarketTypes["categories"]) {
    this.config = config;
    this.categories = categories;
    this.categoryKeys = Object.keys(categories);

    // If they want to use entities, add an event listener
    if (config.entity)
      world.afterEvents.entityHitEntity.subscribe((data) => {
        if (data.hitEntity?.typeId !== config.entity || !(data.damagingEntity instanceof IPlayer)) return;
        try {
          this.openForm(Player.playerType(data.damagingEntity, { from: config.from, sound: false }));
        } catch (e) {
          //console.warn(e + e.stack);
        }
      });

    // If they want to use tags, add an event listener
    if (config.tag)
      system.runInterval(
        () =>
          world
            .getAllPlayers()
            .forEach((player) => player.hasTag(config.tag as string) && this.openForm(Player.playerType(player, { from: config.from, sound: false }))),
        40
      );
  }

  addCategory(name: string, description: string, icon: string): MarketCategory {
    if (name in this.categories) throw new Error(`Category ${name} already exists!`);
    this.categoryKeys.push(name);
    return new MarketCategory(name, description, icon, this);
  }

  openForm(player: PlayerType): void {
    // tag is optional, guard it
    if (this.config.tag) player.removeTag(this.config.tag);

    const form = new ActionForm();
    form.setTitle(this.config.name);
    form.setBody(this.config.description);
    this.categoryKeys.forEach((c) => form.addButton(`§a§l${c}`, this.categories[c]?.icon ?? "textures/blocks/bedrock.png"));
    form.addButton("§c§lClose");
    form.send(player, (res) => {
      if (res.canceled || res.selection === undefined || res.selection === this.categoryKeys.length) return player.send("Goodbye!");
      const idx = res.selection;
      this.openCategory(player, this.categoryKeys[idx]);
    });
  }

  openCategory(player: PlayerType, key: string): void {
    const items = Object.keys(this.categories[key].items),
      form = new ActionForm();
    form.setTitle(`§d§l${key} Category`);
    form.setBody(this.categories[key].description);
    items.forEach((i) => {
      const item = this.categories[key].items[i],
        both = Boolean(item.buy && item.sell) ? "§r | " : "";
      form.addButton(
        `§a§l${i}§r\n${item.buy ? `§aBuy: ${metricNumbers(item.buy)}` : ""}${both}${item.sell ? `§cSell: ${metricNumbers(item.sell)}` : ""}`,
        item.icon
      );
    });
    form.addButton("§c§lBack", "textures/ui/seventh/undo.png");
    form.send(player, async (res) => {
      if (res.canceled || res.selection === undefined || res.selection === items.length) return this.openForm(player);

      const pickedName = items[res.selection];
      const item = this.categories[key].items[pickedName];
      const money = player.getScore(this.config.objective);

      const invComp = player.getComponent("minecraft:inventory");
      if (!invComp) return player.error("Inventory unavailable.");

      const inventory = invComp.container;
      const held = inventory.getItem(player.selectedSlotIndex);

      if ((item.buy ? item.buy > money : true) && (item.sell ? held?.typeId !== item.id : true))
        return (await confirmForm(
          player,
          "Uh oh...",
          `If you're trying to sell a item, make sure it's in you hand. If your trying to buy a item, make sure you have enough money.`,
          "§eTry again",
          "§cClose"
        ))
          ? this.openForm(player)
          : player.send("Goodbye!");

      return this.openItem(player, key, pickedName, item);
    });
  }

  async openItem(player: PlayerType, key: string, name: string, item: MarketTypes["item"]): Promise<void> {
    let bs = item.buy ? true : false;

    const invComp = player.getComponent("minecraft:inventory");
    if (!invComp) return player.error("Inventory unavailable.");

    const inventory = invComp.container;
    const money = player.getScore(this.config.objective);

    if (Boolean(item.buy && item.sell) && (item.buy ? item.buy <= money : false)) {
      const what = new MessageForm();
      what.setTitle(`§a§l${name}`);
      what.setBody("Would you like to buy or sell this item?");
      what.setButton1("Buy");
      what.setButton2("Sell");
      await what.send(player, (res) => (bs = Boolean(res.selection)));
    } else if (item.buy && item.sell && item.buy > money) bs = false;

    // Once items are buy-only in this branch; ensure buy exists before using.
    if (bs && item?.once) {
      const invComp2 = player.getComponent("minecraft:inventory");
      if (!invComp2) return player.error("Inventory unavailable.");
      this.sell(player, item, name, 1, invComp2.container);
      return (await confirmForm(player, "§a§lNice!", "Everything was succesful!", "§aOpen Builder", "§cClose")) ? this.openForm(player) : player.send("Goodbye!");
    }

    const isObjectiveBased = Object.prototype.hasOwnProperty.call(objectives, item.id);
    const objective = isObjectiveBased ? objectives[item.id as keyof typeof objectives] : undefined;

    if (isObjectiveBased && objective && player.getScore(objective) <= 0) return player.error(`You don't have any of this item!`);

    if (!isObjectiveBased && !bs) {
      const held = inventory.getItem(player.selectedSlotIndex);
      if (!held || held.typeId !== item.id) return player.error("You need to have the item you want to sell in you hand");
    }

    let max = 1;

    if (bs) {
      if (item.once) {
        max = 1;
      } else {
        // buy must exist to compute max
        if (item.buy === undefined || item.buy <= 0) return player.error("This item cannot be bought.");
        max = parseInt(`${money / item.buy}`);
      }
    } else {
      if (isObjectiveBased) {
        if (!objective) return player.error("Objective mapping missing for this item.");
        max = player.getScore(objective);
      } else {
        const held = inventory.getItem(player.selectedSlotIndex);
        if (!held) return player.error("You need to have the item you want to sell in you hand");
        max = held.amount;
      }
    }

    if (max > 64) max = 64;
    if (max < 1) max = 1;

    const form = new ModalForm();
    form.setTitle(`§${bs ? "sBuy" : "cSell"} ${name}`);
    form.addSlider(`Enter the amount you want to ${bs ? "buy" : "sell"}.`, 1, max, 1, 1);
    form.send(player, async (res) => {
      if (res.canceled) return this.openCategory(player, key);

      const amt = Number(res.formValues?.[0] ?? 1);

      if (bs) {
        this.sell(player, item, name, amt, inventory);
      } else {
        if (item.sell === undefined) return player.error("This item cannot be sold.");

        if (isObjectiveBased) {
          if (!objective) return player.error("Objective mapping missing for this item.");
          player.setScore(objective, player.getScore(objective) - amt);
        } else {
          player.runCommand(`clear @s ${item.id} 0 ${amt}`);
        }
        player.runCommand(`scoreboard players add @s "${this.config.objective}" ${item.sell * amt}`);
      }

      (await confirmForm(player, "§a§lNice!", "Everything was succesful!", "§aOpen Builder", "§cClose")) ? this.openForm(player) : player.send("Goodbye!");
    });
  }

  sell(player: PlayerType, item: MarketTypes["item"], name: string, amount: number, inventory: Container): void {
    if (item.buy === undefined) return player.error("This item cannot be bought.");
    player.runCommand(`scoreboard players remove @s "${this.config.objective}" ${item.buy * amount}`);

    const isObjectiveBased = Object.prototype.hasOwnProperty.call(objectives, item.id);
    if (isObjectiveBased) {
      const objective = objectives[item.id as keyof typeof objectives];
      // Keep original behavior: setScore to amount (do not subtract) to avoid changing logic.
      player.setScore(objective, amount);
      player.runCommand(item?.cmd?.length ? item.cmd : "help");
      return;
    }

    Array(amount)
      .fill(amount)
      .forEach(() => {
        const items = new ItemStack(item.id);
        items.nameTag = name;
        inventory.addItem(items);
        player.runCommand(item?.cmd?.length ? item.cmd : "help");
      });
  }
}

export default MarketPaper;

class MarketCategory {
  category: MarketTypes["categories"][0];
  itemNames: string[];
  icon: string;

  constructor(name: string, description: string, icon: string, handler: MarketPaper) {
    handler.categories[name] = { description, icon, items: {} };
    this.category = handler.categories[name];

    this.itemNames = [];
    this.icon = icon;
  }

  addItem(name: string, data: MarketTypes["item"]): this {
    if (this.itemNames.includes(name)) throw new Error(`Item ${name} already exists!`);
    this.category.items[name] = data;
    this.itemNames.push(name);
    return this;
  }

  removeItem(name: string): this {
    if (!this.itemNames.includes(name)) throw new Error(`Item ${name} doesn't exist!`);
    delete this.category.items[name];
    this.itemNames.splice(this.itemNames.indexOf(name), 1);
    return this;
  }
}
