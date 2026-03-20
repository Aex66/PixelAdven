import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

// === Imports for individual sections ===
// (We’ll create these in later steps)
import { openServerRules } from "./serverRules";
import { openTeamMenu } from "./teamMenu";
import { openSpawning } from "./spawning";
import { openBattling } from "./battlingPokemon";
import { openCrates } from "./crates";
import { openGettingStarted } from "./gettingStarted";
import { openMachines } from "./machines";
import { openStepSpawn } from "./stepSpawn";

/**
 * Opens the main "How to Play" menu.
 * This serves as the hub for all tutorial categories.
 */
export function openHowToPlayMain(player: Player) {
  const form = new ActionFormData()
    .title("§d📘 How to Play")
    .body("Welcome to §bPixelmon Adventures§r!\n\nChoose a category to learn more about server features and mechanics.");

  form.button("§aGetting Started");
  form.button("§eServer Rules");
  form.button("§bTeam Menu");
  form.button("§dTrading");
  form.button("§9Spawning");
  form.button("§cBattling Pokémon");
  form.button("§6Step Spawn System");
  form.button("§5Crates");

  form.show(player).then((response) => {
    if (response.canceled) return;

    switch (response.selection) {
      case 0:
        openGettingStarted(player);
        break;
      case 1:
        openServerRules(player);
        break;
      case 2:
        openTeamMenu(player);
        break;
      case 3:
        openMachines(player);
        break;
      case 4:
        openSpawning(player);
        break;
      case 5:
        openBattling(player);
        break;
      case 6:
        openStepSpawn(player);
        break;
      case 7:
        openCrates(player);
        break;
    }
  });
}
