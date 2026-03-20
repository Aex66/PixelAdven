import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { openHowToPlayMain } from "./howToPlayMain";

/**
 * Opens the Battling Pokémon tutorial page.
 */
export function openBattling(player: Player) {
  const title = "§c⚔️ Battle Pokémon";
  const body = [
    "§l# Battle Pokémon§r",
    "Battling is the core of Pokémon Adventures — this guide explains how to engage wild Pokémon in combat and how battle rules work.\n",
    "§b1.§r To start a battle with a wild Pokémon, walk up to it and §ehit it with the Dex item§r.",
    "§b2.§r When the battle begins, that Pokémon’s stats are generated dynamically.",
    "§b3.§r Wild Pokémon levels are within a §e±5 level range§r of your highest-leveled team member (but never below level 5).",
    "§b4.§r If you §crun from a battle§r, the Pokémon will §cdespawn immediately§r.",
    "§b5.§r You §ccannot catch§r wild Pokémon without first entering battle — §ePoké Balls only work in active battles§r.",
    "§b6.§r You can escape from a battle by walking §e6 blocks§r away from the battle location.\n",
    "§7⚠️ Tip: Always ensure your team is healed before initiating battles — tougher areas scale up with your team’s levels.§r"
  ].join("\n\n");

  const form = new ActionFormData()
    .title(title)
    .body(body)
    .button("🏠 Return to Main Menu");

  form.show(player).then((response) => {
    if (response.canceled) return;
    openHowToPlayMain(player);
  });
}
