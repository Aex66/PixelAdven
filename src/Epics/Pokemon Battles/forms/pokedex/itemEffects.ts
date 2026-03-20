// itemEffects.ts

import { StatusEffectsValues } from "../../../../Letters/pokemon/moves";

export function applyHealingItem(
  effectType: string,
  currentHP: number,
  baseHP: number,
  condition?: 0 | StatusEffectsValues
): 
  | number 
  | { hp: number; condition: 0 | StatusEffectsValues; friend: number }
  | string 
{
  let friend = 0;

  switch (effectType) {
    case "potion":
      if (currentHP <= 0) return "It had no effect!";
      friend = 1;
      return { hp: Math.min(currentHP + 20, baseHP), condition, friend };

    case "super_potion":
      if (currentHP <= 0) return "It had no effect!";
      friend = 1;
      return { hp: Math.min(currentHP + 60, baseHP), condition, friend };

    case "hyper_potion":
      if (currentHP <= 0) return "It had no effect!";
      friend = 1;
      return { hp: Math.min(currentHP + 120, baseHP), condition, friend };

    case "max_potion":
      if (currentHP <= 0) return "It had no effect!";
      friend = 1;
      return { hp: baseHP, condition, friend };

    case "full_restore":
      if (currentHP <= 0) return "It had no effect!";
      friend = 1;
      return { hp: baseHP, condition: 0, friend };

    case "revive":
      friend = 1;
      return { hp: currentHP <= 0 ? Math.floor(baseHP / 2) : currentHP, condition, friend };

    case "max_revive":
      friend = 1;
      return { hp: currentHP <= 0 ? baseHP : currentHP, condition, friend };

    // Status items
    case "antidote":
    case "awakening":
    case "burn_heal":
    case "paralyze_heal":
    case "ice_heal":
    case "full_heal":
      friend = 1;
      return { hp: currentHP, condition: 0, friend };

    default:
      return { hp: currentHP, condition: condition ?? 0, friend: 0 };
  }
}

export function applyBerryItem(
  effectType: string,
  currentHP: number,
  baseHP: number,
  condition: 0 | StatusEffectsValues
): 
  | { hp: number; condition: 0 | StatusEffectsValues; friend: number }
  | string 
{
  let friend = 1; // HP berries also give +1

  switch (effectType) {
    case "oran_berry":
      if (currentHP <= 0) return "It had no effect!";
      return { hp: Math.min(currentHP + 10, baseHP), condition, friend };

    case "sitrus_berry":
      if (currentHP <= 0) return "It had no effect!";
      return { hp: Math.min(currentHP + Math.floor(baseHP / 4), baseHP), condition, friend };

    // Status berries
    case "cheri_berry":
    case "chesto_berry":
    case "pecha_berry":
    case "rawst_berry":
    case "aspear_berry":
      if (currentHP <= 0) return "It had no effect!";
      return { hp: currentHP, condition: 0, friend };

    default:
      return { hp: currentHP, condition, friend: 0 };
  }
}
