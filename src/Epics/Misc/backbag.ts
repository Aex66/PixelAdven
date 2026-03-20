import { EntityInventoryComponent, Player, system, world } from "@minecraft/server"
import { ActionForm, ModalForm } from "../../Papers/FormPaper"
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { openMenu } from "./menu";
import Commands from "../../Papers/CommandPaper/CommandPaper";
import { backpackConfig, CATEGORY_ICONS, CategoryName } from "../../Letters/pokemon/backpackConfig";

system.afterEvents.scriptEventReceive.subscribe((event) => {
  const player = event.sourceEntity;
  if (!player || !(player instanceof Player)) return;

  switch (event.id) {
    case "pokeworld:openBackpack":
      const backpack = new Backpack(player);
      showBackpack(backpack);
      backpack.takeItems();
      break;
    case "pokeworld:clearBackpack":
      new Backpack(player).clear();
      break;
    case "pokeworld:e":
      const form = new ActionFormData();
      form.title("e");
      form.button("button");
      form.show(player as any);
      break;
  }
});

interface BackpackContent {
  [category: keyof typeof backpackConfig]: {
    [itemID: string]: number;
  };
}

export class Backpack {
  public owner: Player;
  public contents: BackpackContent;

  constructor(player: Player) {
    this.owner = player;
    this.contents = {} as BackpackContent;
    this.update();
  }

  takeItems() {
    const inventory = this.owner.getComponent(EntityInventoryComponent.componentId)!.container;
    for (const category of Object.keys(this.contents)) {
      for (const itemID of Object.keys(this.contents[category])) {
        for (let i = 0; i < inventory.size; i++) {
          const item = inventory.getItem(i);
          if (item && item.typeId == itemID) {
            this.contents[category][itemID] += item.amount;
            inventory.setItem(i);
          }
        }
      }
    }
    this.save();
  }

  update() {
    const data = this.owner.getDynamicProperty("Backpack") as string | undefined;
    let updatedContent: BackpackContent = {} as BackpackContent;

    for (const category of Object.keys(backpackConfig)) {
      updatedContent[category] = {};

      const savedCategory = data ? (JSON.parse(data) as BackpackContent)[category] : undefined;

      for (const { id } of backpackConfig[category]) {
        const savedAmount = savedCategory?.[id] ?? 0;
        updatedContent[category][id] = savedAmount;
      }
    }

    this.contents = updatedContent;
    this.save();
  }

  save() {
    this.owner.setDynamicProperty("Backpack", JSON.stringify(this.contents));
  }

  clear() {
    for (const category of Object.keys(backpackConfig)) {
      if (!this.contents[category]) this.contents[category] = {};
      for (const { id } of backpackConfig[category]) {
        this.contents[category][id] = 0;
      }
    }
    this.save();
  }

  addItem(category: string, itemID: string, amount: number) {
    this.contents[category][itemID] += amount;
    return this.contents[category][itemID];
  }

  removeItem(category: string, itemID: string, amount: number) {
    this.contents[category][itemID] -= amount;
    return this.contents[category][itemID];
  }

  setItem(category: string, itemID: string, amount: number) {
    this.contents[category][itemID] = amount;
  }

  getItemCount(category: string, itemID: string) {
    return this.contents[category][itemID];
  }

  getCategory(category: string) {
    return this.contents[category];
  }

  getContent() {
    return this.contents;
  }
}

// === UI Functions ===

export function showBackpack(backpack: Backpack, delay: number = 10) {
  const categories = Object.keys(backpack.contents) as string[];

  system.runTimeout(() => {
    const form = new ActionForm();
    form.setTitle("§7§7§rBackpack");

    // Track button count
    let buttonCount = 0;

    // Add each category button
    for (const category of categories) {
      const icon = CATEGORY_ICONS[category as CategoryName] ?? "textures/ui/seventh/folder";
      form.addButton(category, icon);
      buttonCount++;
    }

    // ✅ Add Back button for mobile users
    form.addButton("§8Back", "textures/items/left_arrow.png");
    const backIndex = buttonCount; // last button index

    form.send(backpack.owner, (res) => {
      if (res.canceled || res.selection === backIndex) {
        // ✅ Go back to the main menu when canceled or pressing Back
        openMenu(backpack.owner);
        return;
      }

      const selectedCategory = categories[res.selection];
      if (!selectedCategory) {
        backpack.owner.sendMessage("§cInvalid Category Selection.");
        return;
      }

      showForm(backpack, selectedCategory);
    });
  }, delay);
}

export function showForm(backpack: Backpack, category: string) {
  const categories = Object.keys(backpack.contents);
  const items = Object.entries(backpack.contents[category]);

  const form = new ActionForm();
  form.setTitle(`§7§7§r${category}`);

  const availableItems = items.filter(i => i[1] > 0).map(i => i[0]);

  // ✅ 1) Item buttons FIRST
  if (availableItems.length < 1) {
    form.addButton(`You Have No Items In This Category`);
  } else {
    for (const itemID of availableItems) {
      const itemData = backpackConfig[category].find(i => i.id === itemID)!;
      const amount = backpack.getItemCount(category, itemID);
      const label = `Have: ${amount} ${itemData.displayName}`;
      form.addButton(label, itemData.texturePath);
    }
  }

  // ✅ 2) Only ONE Back button now (no previous/next)
  form.addButton("Back", "textures/items/left_arrow.png");

  // ✅ 3) Callback with corrected indexes
  form.send(backpack.owner, (res) => {
    if (res.canceled) {
      showBackpack(backpack);
      return;
    }

    // When there are no items:
    // indexes: 0 = "no items" placeholder, 1 = back
    if (availableItems.length < 1) {
      if (res.selection === 1 || res.selection === 0) {
        showBackpack(backpack);
      }
      return;
    }

    // When there ARE items:
    // 0..N-1 = items, N = back
    const backIndex = availableItems.length;

    if (res.selection === backIndex) {
      showBackpack(backpack); // ✅ go back one page to category list
      return;
    }

    // Otherwise it's an item (0..N-1)
    if (res.selection >= 0 && res.selection < availableItems.length) {
      openItemMenu(backpack, category, availableItems[res.selection]);
    }
  });
}

export function openItemMenu(backpack: Backpack, category: string, itemID: string) {
  const itemAmount = backpack.getItemCount(category, itemID);
  const itemData = backpackConfig[category].find(i => i.id == itemID)!;

  const form = new ModalForm();
  form.setTitle(`Select An Amount`);
  form.addSlider(
    `How Many ${itemData.displayName}'s Do You Want To Remove?\n\nWithdraw Amount`,
    0,
    itemAmount,
    1,
    Math.floor(itemAmount / 2)
  );

  form.send(backpack.owner, (res) => {
    if (res.canceled) return;
    const amount = res.formValues[0] as number;
    if (amount < 1) return;

    backpack.owner.runCommand(`give @s ${itemID} ${amount}`);
    backpack.setItem(category, itemID, itemAmount - amount);
    backpack.save();
  });
}

export function getNextString(list: string[], currentString: string) {
  const index = list.indexOf(currentString);
  if (index === -1) return null;
  return list[(index + 1) % list.length];
}

export function getPreviousString(list: string[], currentString: string) {
  const index = list.indexOf(currentString);
  if (index === -1) return null;
  return list[(index - 1 + list.length) % list.length];
}

// === Scoreboard Sync ===
export const allBagItems: { id: string; category: string }[] =
  Object.keys(backpackConfig).flatMap(category =>
    backpackConfig[category].map(i => ({ id: i.id, category }))
  );

export function updateScore(player: Player) {
  const backpack = new Backpack(player);
  for (const item of allBagItems) {
    const id = item.id.split(":")[1];
    let objective = world.scoreboard.getObjective(id);
    if (!objective) objective = world.scoreboard.addObjective(id);

    const itemAmount = backpack.getItemCount(item.category, item.id);
    objective.setScore(player, itemAmount);
  }
}

export function updateBackpack(player: Player) {
  const backpack = new Backpack(player);
  for (const item of allBagItems) {
    const id = item.id.split(":")[1];
    let objective = world.scoreboard.getObjective(id);
    if (!objective) objective = world.scoreboard.addObjective(id);
    const itemAmount = objective.getScore(player) ?? 0;
    backpack.setItem(item.category, item.id, itemAmount);
  }
}

function hasPerm(p: Player, tags: string[]) {
    return tags.some(t => p.hasTag(t));
}

const wipeBagCmd = Commands.create({
    name: "wipebag",
    description: "Wipe a player's backpack",
    admin: true,
    category: "Moderation",
});

wipeBagCmd.callback(async (player: Player) => {
    if (!hasPerm(player, ["Admin", "Owner"])) {
        return player.sendMessage("§cYou do not have permission.");
    }

    const players = Array.from(world.getPlayers());
    if (players.length === 0) {
        player.sendMessage("§cNo players online.");
        return;
    }

    const names = players.map(p => p.name);

    const selectForm = new ModalFormData();
    selectForm.title("§cWipe Backpack");
    selectForm.dropdown("Select a player", names, {
    defaultValueIndex: 0
});

    const res = await selectForm.show(player);
    if (res.canceled) return;

    const target = players[res.formValues[0] as number];
    if (!target) {
        player.sendMessage("§cInvalid player.");
        return;
    }

    confirmWipe(player, target);
});

async function confirmWipe(staff: Player, target: Player) {
    const form = new ActionFormData();
    form.title("§4CONFIRM BACKPACK WIPE");
    form.body(
        `§cYou are about to wipe:\n\n` +
        `§e${target.name}\n\n` +
        `§4THIS CANNOT BE UNDONE`
    );

    form.button("§cYES — WIPE");
    form.button("§7Cancel");

    const res = await form.show(staff);
    if (res.canceled || res.selection === 1) return;

    const backpack = new Backpack(target);
    backpack.clear();

    target.sendMessage("§cYour Backpack has been wiped by an administrator.");
    staff.sendMessage(`§a✔ Backpack wiped for §e${target.name}`);
}

