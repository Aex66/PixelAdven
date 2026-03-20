export const itemPrices: Record<string, { buy: number; sell: number }> = {
  // ======================
  // Poké Balls (Buyable)
  // ======================
  "pokeworld:pokeball": { buy: 200, sell: 100 },
  "pokeworld:greatball": { buy: 600, sell: 300 },
  "pokeworld:ultraball": { buy: 1200, sell: 600 },

  "pokeworld:healball": { buy: 300, sell: 150 },
  "pokeworld:luxuryball": { buy: 1000, sell: 500 },
  "pokeworld:netball": { buy: 1000, sell: 500 },
  "pokeworld:nestball": { buy: 1000, sell: 500 },
  "pokeworld:diveball": { buy: 1000, sell: 500 },
  "pokeworld:duskball": { buy: 1000, sell: 500 },
  "pokeworld:quickball": { buy: 1000, sell: 500 },
  "pokeworld:repeatball": { buy: 1000, sell: 500 },
  "pokeworld:timerball": { buy: 1000, sell: 500 },

  // ======================
  // Poké Balls (NOT buyable)
  // ======================
  "pokeworld:premierball": { buy: 0, sell: 100 },
  "pokeworld:friendball": { buy: 0, sell: 150 },
  "pokeworld:heavyball": { buy: 0, sell: 150 },
  "pokeworld:levelball": { buy: 0, sell: 150 },
  "pokeworld:loveball": { buy: 0, sell: 150 },
  "pokeworld:lureball": { buy: 0, sell: 150 },
  "pokeworld:moonball": { buy: 0, sell: 150 },
  "pokeworld:sportball": { buy: 0, sell: 150 },
  "pokeworld:beastball": { buy: 0, sell: 500 },
  "pokeworld:dreamball": { buy: 0, sell: 150 },
  "pokeworld:fastball": { buy: 0, sell: 150 },
  "pokeworld:arkadiaball": { buy: 0, sell: 300 },

  "pokeworld:masterball": { buy: 0, sell: 0 },
  "pokeworld:cherishball": { buy: 0, sell: 0 },
  "pokeworld:safariball": { buy: 0, sell: 0 },

  // ======================
  // Healing Items (Buyable)
  // ======================
  "pokeworld:potion": { buy: 200, sell: 100 },
  "pokeworld:super_potion": { buy: 700, sell: 350 },
  "pokeworld:hyper_potion": { buy: 1200, sell: 600 },
  "pokeworld:max_potion": { buy: 2500, sell: 1250 },

  "pokeworld:antidote": { buy: 100, sell: 50 },
  "pokeworld:awakening": { buy: 250, sell: 125 },
  "pokeworld:burn_heal": { buy: 250, sell: 125 },
  "pokeworld:ice_heal": { buy: 250, sell: 125 },
  "pokeworld:paralyze_heal": { buy: 200, sell: 100 },
  "pokeworld:full_heal": { buy: 400, sell: 200 },

  "pokeworld:revive": { buy: 1500, sell: 750 },
  "pokeworld:max_revive": { buy: 4000, sell: 2000 },
  "pokeworld:full_restore": { buy: 3000, sell: 1500 },

  "pokeworld:fresh_water": { buy: 200, sell: 100 },
  "pokeworld:lemonade": { buy: 350, sell: 175 },
  "pokeworld:moomoo_milk": { buy: 500, sell: 250 },

  // ======================
  // NOT buyable (Game-accurate)
  // ======================
  "pokeworld:energy_powder": { buy: 0, sell: 250 },
  "pokeworld:energy_root": { buy: 0, sell: 400 },
  "pokeworld:heal_powder": { buy: 0, sell: 225 },

  "pokeworld:ether": { buy: 0, sell: 600 },
  "pokeworld:elixir": { buy: 0, sell: 1500 },
  "pokeworld:max_ether": { buy: 0, sell: 1000 },
  "pokeworld:max_elixir": { buy: 0, sell: 2250 },

  "pokeworld:rage_candy_bar": { buy: 0, sell: 150 },
  "pokeworld:sacred_ash": { buy: 0, sell: 100 },

  // ======================
  // Berries (NOT sold in Poké Marts)
  // ======================
  "pokeworld:oran_berry": { buy: 0, sell: 40 },
  "pokeworld:sitrus_berry": { buy: 0, sell: 150 },
  "pokeworld:cheri_berry": { buy: 0, sell: 40 },
  "pokeworld:chesto_berry": { buy: 0, sell: 40 },
  "pokeworld:pecha_berry": { buy: 0, sell: 40 },
  "pokeworld:rawst_berry": { buy: 0, sell: 40 },
  "pokeworld:aspear_berry": { buy: 0, sell: 40 },
  "pokeworld:persim_berry": { buy: 0, sell: 40 },
  "pokeworld:lum_berry": { buy: 0, sell: 75 },
  "pokeworld:leppa_berry": { buy: 0, sell: 75 },

  // ======================
  // Battle Items (Buyable in games)
  // ======================
  "pokeworld:x_attack": { buy: 500, sell: 250 },
  "pokeworld:x_defense": { buy: 550, sell: 275 },
  "pokeworld:x_speed": { buy: 350, sell: 175 },
  "pokeworld:x_accuracy": { buy: 950, sell: 475 },
  "pokeworld:x_spatk": { buy: 350, sell: 175 },
  "pokeworld:x_spdef": { buy: 350, sell: 175 },
  "pokeworld:dire_hit": { buy: 650, sell: 325 },
  "pokeworld:guard_spec": { buy: 700, sell: 350 },
  "pokeworld:ability_capsule": { buy: 0, sell: 5000 },

  // ======================
  // Generic / Valuable
  // ======================
  "pokeworld:rare_candy": { buy: 0, sell: 2500 },

  "pokeworld:blue_shard": { buy: 0, sell: 200 },
  "pokeworld:red_shard": { buy: 0, sell: 200 },
  "pokeworld:yellow_shard": { buy: 0, sell: 200 },
  "pokeworld:green_shard": { buy: 0, sell: 200 },

  "pokeworld:rare_bone": { buy: 0, sell: 1500 },
  "pokeworld:heart_scale": { buy: 0, sell: 1000 },

  "pokeworld:shiny_charm": { buy: 0, sell: 0 },

  // ======================
  // Evolution Stones (Buyable in games)
  // ======================
  "pokeworld:fire_stone": { buy: 2100, sell: 1050 },
  "pokeworld:water_stone": { buy: 2100, sell: 1050 },
  "pokeworld:thunder_stone": { buy: 2100, sell: 1050 },
  "pokeworld:leaf_stone": { buy: 2100, sell: 1050 },
  "pokeworld:moon_stone": { buy: 2100, sell: 1050 },
  "pokeworld:sun_stone": { buy: 3000, sell: 1500 },
  "pokeworld:shiny_stone": { buy: 3000, sell: 1500 },
  "pokeworld:dusk_stone": { buy: 3000, sell: 1500 },
  "pokeworld:dawn_stone": { buy: 3000, sell: 1500 },
  "pokeworld:ice_stone": { buy: 3000, sell: 1500 },
  "pokeworld:oval_stone": { buy: 2100, sell: 1050 },

  // ======================
  // Held / Evolution Items (NOT buyable)
  // ======================
  "pokeworld:metal_coat": { buy: 0, sell: 2000 },
  "pokeworld:dragon_scale": { buy: 0, sell: 2000 },
  "pokeworld:up_grade": { buy: 0, sell: 2000 },
  "pokeworld:dubious_disc": { buy: 0, sell: 2000 },
  "pokeworld:protector": { buy: 0, sell: 2000 },
  "pokeworld:electirizer": { buy: 0, sell: 2000 },
  "pokeworld:magmarizer": { buy: 0, sell: 2000 },
  "pokeworld:prism_scale": { buy: 0, sell: 2000 },
  "pokeworld:reaper_cloth": { buy: 0, sell: 2000 },
  "pokeworld:razor_claw": { buy: 0, sell: 2000 },
  "pokeworld:razor_fang": { buy: 0, sell: 2000 },
  "pokeworld:deep_sea_scale": { buy: 0, sell: 2000 },
  "pokeworld:deep_sea_tooth": { buy: 0, sell: 2000 },
  "pokeworld:black_augurite": { buy: 0, sell: 2500 }
};
