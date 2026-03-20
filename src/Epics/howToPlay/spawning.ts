import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { openHowToPlayMain } from "./howToPlayMain";

/**
 * Opens the Spawning Guide (2 pages).
 */
export function openSpawning(player: Player, page: number = 0) {
  const pages: { title: string; body: string }[] = [
    {
      title: "§a🌿 Spawning Overview (1/2)",
      body: [
        "§l# Spawning§r",
        "There are several ways Pokémon can appear throughout the world of §bPixelmon Adventures§r.\n",
        "Each system provides a different way to encounter and catch Pokémon.\n",
        "§bSpawning Types:§r",
        "- §eNatural Spawning§r: Pokémon appear automatically in the environment.",
        "- §eStep Spawning§r: Pokémon appear based on your location and how far you’ve walked.",
        "- §eFishing§r: Water-type Pokémon can be caught using Fishing Rods with tier-based chances.\n",
        "Each method offers its own rewards and gameplay style. Try them all to fill out your Pokédex!"
      ].join("\n\n")
    },
    {
      title: "§a🌎 Spawning Details (2/2)",
      body: [
        "§bNatural Spawning§r",
        "Pokémon spawn naturally throughout the world with varying rarity and time-based chances.",
        "For detailed spawn information, use the §e/pokeinfo§r command available in the §bPixelmon Adventures Discord§r. It shows biome-specific Pokémon and spawn conditions.\n",
        "§bStep Spawning§r",
        "Pokémon spawn dynamically based on your biome and the number of steps you take.",
        "Every §e100 real steps§r you walk triggers a chance for a Pokémon to appear nearby.",
        "(This value may increase in future updates.)",
        "Check the §aStep Spawning§r section for more detailed information on how this system works.\n",
        "§bFishing Spawning§r",
        "By using Fishing Rods, you can reel in water-type Pokémon.",
        "Each rod tier has its own Pokémon pool and proficiency system that improves as you fish more.",
        "Higher proficiency unlocks advanced rods and increases your shiny encounter rate!"
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
      if (response.selection === index++) return openSpawning(player, page - 1);
    }
    if (page < pages.length - 1) {
      if (response.selection === index++) return openSpawning(player, page + 1);
    }
    openHowToPlayMain(player);
  });
}
