import { Player } from "@minecraft/server";

/**
 * Call this once a Legendary Pokémon is successfully caught
 * regardless of which quest it came from.
 */
export function progressLegendaryCatch(player: Player, species: string) {
  // Track this specific legendary as caught
  player.setDynamicProperty(`legendary_${species}_caught`, true);

  // Only progress Chapter 6 if it's being tracked
  const chap6Stage = Number(player.getDynamicProperty("quest_chapter6_stage") ?? 0);

  if (chap6Stage === 1) {
    player.setDynamicProperty("quest_chapter6_stage", 2);
    player.sendMessage(`§d[Quest] Chapter 6 progressed: You caught your first Legendary Pokémon (${species})!`);
  }
}
