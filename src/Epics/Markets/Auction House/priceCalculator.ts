import { getIVPercent } from "../../Main/Forms/PC/search";
import { pokemonBasePrices } from "./pokemonBasePrices";

// Tunable multipliers
const IV_WEIGHT = 350;          // $ per IV%
const LEVEL_WEIGHT = 300;       // $ per level
const SHINY_MULTIPLIER = 3.5;

export function calculatePokemonPrice(pokemon: any): number {
  const basePrice = pokemonBasePrices[pokemon.name] ?? 5000;

  // Resolve longHand if needed
  const longHand = pokemon.longHand ?? pokemon;

  const IVs = getIVPercent(longHand);
  const Level = longHand.level ?? longHand.Level ?? 1;

  const shinyVariant = longHand.Variant ?? longHand.Vr ?? 0;
  const isShiny = [1, 3, 5, 7, 9].includes(shinyVariant);

  let price = basePrice + (IVs * IV_WEIGHT) + (Level * LEVEL_WEIGHT);

  if (isShiny) price *= SHINY_MULTIPLIER;

  return Math.max(50, Math.round(price));
}

