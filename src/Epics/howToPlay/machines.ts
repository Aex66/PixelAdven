import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { openHowToPlayMain } from "./howToPlayMain";

/**
 * Opens the Trading, Incubator, and Fossil Machine tutorial.
 */
export function openMachines(player: Player, page: number = 0) {
  const pages: { title: string; body: string }[] = [
    {
      title: "§d💱 Trading Pokémon (1/3)",
      body: [
        "§l# Trading Pokémon§r",
        "Trading is done through the §bTrade Machine§r found on the §elowest level§r of any Pokémon Center.\n",
        "§bHow to Use:§r",
        "1. Hit the Trade Machine to open its menu.",
        "2. You can view current trade offers, create new trade requests, or deny requests from other players.",
        "3. Both players must be online for a trade to complete.",
        "4. If either player logs off, the trade request will §cautomatically be deleted.§r",
        "\n§7⚠️ Tip: Trades are only processed while both participants are active on the server.§r"
      ].join("\n\n")
    },
    {
      title: "§e🥚 Egg Incubators (2/3)",
      body: [
        "§l# Egg Incubators§r",
        "Use an §bEgg Incubator§r to hatch eggs without walking.\n",
        "§bHow to Use:§r",
        "1. Hit the incubator block to open its menu.",
        "2. You can place up to §a3 eggs§r inside per machine.",
        "3. Only §e2k§r, §e5k§r, §e7k§r, and §e10k§r eggs are compatible.\n",
        "§bHatch Times:§r",
        "- 2k Egg → 2 minutes",
        "- 5k Egg → 4.2 minutes",
        "- 7k Egg → 5.8 minutes",
        "- 10k Egg → 8.3 minutes\n",
        "§bExtra Details:§r",
        "- Once ready, eggs must be claimed within §e30 minutes§r or they become claimable by anyone.",
        "- Each egg has a §c10% chance to fail§r during incubation.",
        "§7⚠️ Tip: Eggs obtained from breeding can only hatch through walking.§r"
      ].join("\n\n")
    },
    {
      title: "§3🦴 Fossil Machines (3/3)",
      body: [
        "§l# Fossil Machines§r",
        "Use the §bFossil Machine§r to revive ancient Pokémon from fossils.\n",
        "§bHow to Use:§r",
        "1. Hit the machine to open its interface.",
        "2. Choose one of the three fossil grades: §elow§r, §emid§r, or §ehigh§r.\n",
        "§bFossil Grades:§r",
        "- Low Tier → §e5 minutes§r (50% success rate)",
        "- Mid Tier → §e7.5 minutes§r (75% success rate)",
        "- High Tier → §e10 minutes§r (95% success rate)\n",
        "§bAdditional Info:§r",
        "- If a fossil is not claimed within §e30 minutes§r after completion, it becomes claimable by anyone.",
        "- Failed fossils are lost permanently, so choose wisely!"
      ].join("\n\n")
    }
  ];

  const form = new ActionFormData()
    .title(pages[page].title)
    .body(pages[page].body);

  // Navigation buttons
  if (page > 0) form.button("⬅️ Back");
  if (page < pages.length - 1) form.button("➡️ Next Page");
  form.button("🏠 Return to Main Menu");

  form.show(player).then((response) => {
    if (response.canceled) return;
    let index = 0;

    if (page > 0) {
      if (response.selection === index++) return openMachines(player, page - 1);
    }
    if (page < pages.length - 1) {
      if (response.selection === index++) return openMachines(player, page + 1);
    }
    openHowToPlayMain(player);
  });
}
