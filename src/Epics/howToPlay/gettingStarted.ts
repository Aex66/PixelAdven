import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { openHowToPlayMain } from "./howToPlayMain";

/**
 * Opens the Getting Started tutorial for new players.
 * Includes multiple pages with navigation buttons.
 */
export function openGettingStarted(player: Player, page: number = 0) {
  const pages: { title: string; body: string }[] = [
    {
      title: "§a📖 Getting Started (1/3)",
      body: [
        "§lWelcome to Pixelmon Adventures!§r",
        "Follow the instructions below to begin your journey:\n",
        "§b# Getting Started§r",
        "1. Upon logging in, click the §eDex Item§r to open the menu.",
        "2. Click §6Quest Button → Main Quest → Start Quest§r.",
        "3. After starting the quest, head to the §bLab on the hill by the Windmill§r.",
        "4. Hit the Professor to claim a starter from §aGenerations 1–4§r only.",
        "5. Check your Main Quest progress after claiming your starter.",
        "6. Once you finish Chapter 1, you’re free to explore and play freely!"
      ].join("\n\n")
    },
    {
      title: "§a⚙️ Config & Bag (2/3)",
      body: [
        "§b# Config Options§r",
        "1. §eToggle Sidebar§r: Turns sidebar on/off (minimap overrides this).",
        "2. §eXP Config§r: Toggle between all Pokémon gaining XP, or only those who participate in battle.",
        "3. §eInfo Button§r: Displays your total Pokémon caught and your current money.\n",
        "§b# Bag System§r",
        "1. Click the §eDex Item§r → §aBag Button§r to store and manage battle items.",
        "   - Stored items are removed from your physical inventory.",
        "2. You must have items in your bag to sell them.",
        "3. Items bought from shops are automatically sent to the bag."
      ].join("\n\n")
    },
    {
      title: "§aℹ️ Info & PC (3/3)",
      body: [
        "§b# Info§r",
        "- Hit NPCs to interact with them.",
        "- Put Eggs in your §eOffhand§r to walk and hatch them.",
        "  Eggs from breeding machines can only hatch through walking.",
        "- Type §e!trivia§r in chat to disable trivia messages.",
        "- Type §e/pk:§r in chat to view available Pixelmon chat commands.\n",
        "§b# PC Storage§r",
        "- Click team slots first to add or remove Pokémon.",
        "- When adding Pokémon: click once to preview, click again to confirm.",
        "- Various §esort and filter§r options are available to organize your PC."
      ].join("\n\n")
    }
  ];

  const form = new ActionFormData().title(pages[page].title).body(pages[page].body);

  // Navigation Buttons
  if (page > 0) form.button("⬅️ Back");
  if (page < pages.length - 1) form.button("➡️ Next Page");
  form.button("🏠 Return to Main Menu");

  form.show(player).then((response) => {
    if (response.canceled) return;
    let index = 0;

    if (page > 0) {
      if (response.selection === index++) return openGettingStarted(player, page - 1);
    }
    if (page < pages.length - 1) {
      if (response.selection === index++) return openGettingStarted(player, page + 1);
    }
    openHowToPlayMain(player);
  });
}
