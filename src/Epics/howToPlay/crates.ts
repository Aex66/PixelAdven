import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { openHowToPlayMain } from "./howToPlayMain";

/**
 * Opens the Crate Rewards Guide (multi-page).
 */
export function openCrates(player: Player, page: number = 0) {
  const pages: { title: string; body: string }[] = [
    // Page 1 — Basics
    {
      title: "§6📦 Crate Rewards Guide (1/5)",
      body: [
        "§l# Crate Rewards Guide§r",
        "Each crate gives you multiple items when opened.",
        "Categories such as Balls, Berries, Healing, and more each have unique odds of being chosen, and a random item from that category is awarded.\n",
        "§bHow Chances Work§r",
        "- Each crate has §eweighted odds§r for its categories.",
        "- The higher the weight, the more likely that category will be chosen.\n",
        "§bLocation§r",
        "Crates are located on the §elowest level§r of the Spawn Pokémon Center.\n",
        "§bUsage§r",
        "- You can use multiple tickets at once on a single crate for multiple rolls.\n",
        "§7⚠️ Tip:§r Crates are a great way to earn rare items and materials quickly!"
      ].join("\n\n")
    },

    // Page 2 — Poké / Great Ball Crates
    {
      title: "§6🎲 Poké & Great Ball Crates (2/5)",
      body: [
        "§b🔴 Poké Ball Crate§r",
        "- Rolls per open: §e2–3 items§r\n",
        "§bCategory Odds:§r",
        "• Balls: 22.2%",
        "• Berries: 22.2%",
        "• Healing: 18.5%",
        "• Shards: 11.1%",
        "• Misc: 11.1%",
        "• Evo Stones: 3.7%",
        "• X Items: 3.7%",
        "• Rare Candy: 3.7%",
        "• Eggs: 3.7%",
        "• Trade Materials: 3.7%\n",
        "§b🔵 Great Ball Crate§r",
        "- Rolls per open: §e2–4 items§r\n",
        "§bCategory Odds:§r",
        "• Balls: 21.9%",
        "• Berries: 15.6%",
        "• Healing: 18.8%",
        "• Shards: 9.4%",
        "• Misc: 9.4%",
        "• Evo Stones: 6.3%",
        "• X Items: 6.3%",
        "• Rare Candy: 6.3%",
        "• Eggs: 6.3%",
        "• Trade Materials: 6.3%"
      ].join("\n\n")
    },

    // Page 3 — Ultra / Master / Legendary Crates
    {
      title: "§6💎 High-Tier Crates (3/5)",
      body: [
        "§b🟠 Ultra Ball Crate§r",
        "- Rolls per open: §e3–5 items§r\n",
        "§bCategory Odds:§r",
        "• Balls: 19.4%",
        "• Berries: 8.3%",
        "• Healing: 16.7%",
        "• Shards: 8.3%",
        "• Misc: 8.3%",
        "• Evo Stones: 8.3%",
        "• X Items: 8.3%",
        "• Rare Candy: 8.3%",
        "• Eggs: 5.6%",
        "• Ability Capsule: 2.8%",
        "• Trade Materials: 5.6%\n",
        "§b🟣 Master Ball Crate§r",
        "- Rolls per open: §e4–6 items§r\n",
        "§bCategory Odds:§r",
        "• Balls: 14.6%",
        "• Berries: 4.9%",
        "• Healing: 12.2%",
        "• Shards: 7.3%",
        "• Misc: 7.3%",
        "• Evo Stones: 9.8%",
        "• X Items: 7.3%",
        "• Rare Candy: 9.8%",
        "• Eggs: 7.3%",
        "• Mega Stones: 7.3%",
        "• Ability Capsule: 4.9%",
        "• Trade Materials: 7.3%\n",
        "§b🟡 Legendary Crate§r",
        "- Rolls per open: §e5–8 items§r\n",
        "§bCategory Odds:§r",
        "• Balls: 14.9%",
        "• Berries: 2.1%",
        "• Healing: 8.5%",
        "• Shards: 8.5%",
        "• Misc: 4.3%",
        "• Evo Stones: 10.6%",
        "• X Items: 8.5%",
        "• Rare Candy: 12.8%",
        "• Eggs: 8.5%",
        "• Mega Stones: 12.8%",
        "• Ability Capsule: 8.5%",
        "• Trade Materials: 8.5%"
      ].join("\n\n")
    },

    // Page 4 — Category Lists Part 1
    {
      title: "§6📂 Item Categories (4/5)",
      body: [
        "§bBalls§r",
        "Beast, Cherish, Dive, Dream, Dusk, Fast, Friend, Great, Heal, Heavy, Level, Love, Lure, Luxury, Moon, Net, Poké, Premier, Quick, Repeat, Safari, Sport, Timer, Ultra\n",
        "§bBerries§r",
        "Aspear, Cheri, Chesto, Leppa, Lum, Oran, Pecha, Persim, Rawst, Sitrus\n",
        "§bHealing Items§r",
        "Antidote, Burn Heal, Energy Powder, Full Heal, Full Restore, Heal Powder, Hyper Potion, Ice Heal, Max Potion, Max Revive, Paralyze Heal, Potion, Revive, Super Potion\n",
        "§bMisc Items§r",
        "Awakening, Dire Hit, Energy Root, Ether, Fresh Water, Guard Spec, Lemonade, Max Elixir, Max Ether, Moomoo Milk, Rage Candy Bar, Rare Bone, Sacred Ash, Shiny Charm"
      ].join("\n\n")
    },

    // Page 5 — Category Lists Part 2
    {
      title: "§6💠 Special Item Categories (5/5)",
      body: [
        "§bEvolution Stones§r",
        "Dawn, Dusk, Fire, Ice, Leaf, Moon, Oval, Sun, Thunder, Water\n",
        "§bMega Stones§r",
        "Aerodactylite, Alakazite, Beedrillite, Blastoisinite, Charizardite X, Charizardite Y, Gengarite, Gyaradosite, Kangaskhanite, Mewtwonite X, Mewtwonite Y, Pidgeotite, Pinsirite, Slowbronite, Venusaurite, Scizorite\n",
        "§bShards§r",
        "Blue, Green, Red, Yellow\n",
        "§bEggs§r",
        "2km, 5km, 7km, 10km\n",
        "§bX Items§r",
        "X2 Spawn, X Accuracy, X Attack, X Defense, X Sp. Atk, X Sp. Def, X Speed\n",
        "§bTrade Materials§r",
        "Heart Scale\n",
        "§bRare Candy§r",
        "Rare Candy\n",
        "§bAbility Item§r",
        "Ability Capsule"
      ].join("\n\n")
    }
  ];

  const form = new ActionFormData()
    .title(pages[page].title)
    .body(pages[page].body);

  // Navigation
  if (page > 0) form.button("⬅️ Back");
  if (page < pages.length - 1) form.button("➡️ Next Page");
  form.button("🏠 Return to Main Menu");

  form.show(player).then((response) => {
    if (response.canceled) return;
    let index = 0;

    if (page > 0) {
      if (response.selection === index++) return openCrates(player, page - 1);
    }
    if (page < pages.length - 1) {
      if (response.selection === index++) return openCrates(player, page + 1);
    }
    openHowToPlayMain(player);
  });
}
