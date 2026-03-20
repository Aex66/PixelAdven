import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { openHowToPlayMain } from "./howToPlayMain";

/**
 * Opens the Team Menu explanation page.
 */
export function openTeamMenu(player: Player) {
  const title = "§b👥 Team Menu";
  const body = [
    "§l# Team Menu§r",
    "In this menu, you can manage and interact with your Pokémon team in several ways:\n",
    "§b1. Summon Pokémon§r",
    "- Bring your Pokémon into the world to level them up using Rare Candies.",
    "- (Riding will be available in a future update.)\n",
    "§b2. Teach Level-Up Moves§r",
    "- Teach your Pokémon moves they could have learned naturally as they level up.\n",
    "§b3. Teach TM Moves§r",
    "- Use §dHeart Scales§r to teach TM-compatible moves to your Pokémon.\n",
    "§b4. Evolve Pokémon§r",
    "- Perform standard, stone, or trade-based evolutions.",
    "- For §eStone Evolutions§r, the corresponding evolution stone must be in your inventory.",
    "- For §eTrade§r or §eTrade + Item Evolutions§r, these will automatically evolve in a future update.\n",
    "§7⚠️ Note: For options 2–4, your Pokémon must be §orecalled§r before performing these actions.§r"
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
