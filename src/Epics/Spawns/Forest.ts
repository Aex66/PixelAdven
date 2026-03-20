import { Player, world, system, Entity, Vector3, EntityEquippableComponent, EquipmentSlot } from "@minecraft/server";

// 🌲 Forest Biome Pokémon Rarity Groups (with full Grass starter lines)
const common = [
  'wild_bulbasaur','wild_ivysaur','wild_caterpie','wild_metapod','wild_butterfree','wild_pikachu',
  'wild_weedle','wild_kakuna','wild_beedrill','wild_pidgey','wild_pidgeotto','wild_rattata','wild_raticate',
  'wild_oddish','wild_gloom','wild_bellsprout','wild_weepinbell','wild_paras','wild_venonat',
  'wild_exeggcute','wild_hoothoot','wild_noctowl','wild_wurmple','wild_silcoon','wild_cascoon',
  'wild_beautifly','wild_dustox','wild_seedot','wild_shroomish','wild_taillow','wild_starly',
  'wild_bidoof','wild_bibarel','wild_budew','wild_cherubi','wild_kricketot','wild_sentret','wild_zigzagoon'
];

const uncommon = [
  'wild_venusaur','wild_pidgeot','wild_parasect','wild_venomoth','wild_exeggutor','wild_vileplume','wild_victreebel','wild_bellossom',
  'wild_skiploom','wild_jumpluff','wild_ledyba','wild_ledian','wild_spinarak','wild_ariados','wild_grovyle','wild_turtwig','wild_grotle',
  'wild_chikorita','wild_bayleef','wild_staravia','wild_roselia','wild_combee','wild_cherrim','wild_shiftry','wild_breloom',
  'wild_sunflora','wild_mime_jr','wild_mr_mime','wild_snubbull','wild_glameow','wild_pachirisu','wild_buneary','wild_burmy'
];

const rare = [
  'wild_torterra','wild_meganium','wild_sceptile','wild_scyther','wild_pinsir','wild_heracross','wild_roserade',
  'wild_staraptor','wild_ursaring','wild_ambipom','wild_forretress','wild_gardevoir','wild_tangela','wild_raichu',
  'wild_cherrim','wild_vespiquen','wild_mothim','wild_wormadam','wild_granbull','wild_purugly','wild_lopunny',
  'wild_absol','wild_murkrow','wild_honchkrow'
];

const veryRare = [
  'wild_scizor','wild_yanma','wild_yanmega','wild_leafeon','wild_gallade','wild_togetic','wild_togekiss',
  'wild_mismagius','wild_drifloon','wild_drifblim','wild_rotom','wild_tangrowth'
];

const ultraRare = [
  'wild_eevee','wild_espeon','wild_umbreon','wild_porygon','wild_porygon2','wild_porygonz','wild_snorlax',
  'wild_spiritomb'
];

function getScore(entity: Entity, objective: string): number {
    try {
        return world.scoreboard.getObjective(objective)?.getScore(entity) ?? 0;
    } catch {
        return 0;
    }
}

function setScore(entity: Entity, objective: string, value: number): void {
    const obj = world.scoreboard.getObjective(objective) ?? world.scoreboard.addObjective(objective, objective);
    obj.setScore(entity, value);
}

const SHINY_CHARM = "pokeworld:shiny_charm";

function formatPokemonName(id: string): string {
    return id
        .replace(/^wild_/, "")           // remove "wild_"
        .replace(/_/g, " ")              // just in case (future-proof)
        .replace(/\b\w/g, c => c.toUpperCase()); // capitalize
}

function spawnPokemon(player: Player, id: string): void {
    const eq = player.getComponent("equippable") as EntityEquippableComponent | undefined;
    const off = eq?.getEquipment(EquipmentSlot.Offhand);

    const displayName = formatPokemonName(id);

    if (off?.typeId === SHINY_CHARM) {
        player.runCommand(`summon pokeworld:${id} ~ ~1 ~ ~ ~ minecraft:sc_spawned`);
    } else {
        player.runCommand(`summon pokeworld:${id} ~ ~1 ~`);
    }

    player.runCommand("playsound random.wildencounter @s");
    player.sendMessage(`§eOh!!! A Wild §d${displayName} §eAppeared!!!`);
}

function pickRandom(list: string[]): string {
    return list[Math.floor(Math.random() * list.length)];
}

system.runInterval(() => {
    for (const player of world.getPlayers()) {
        const pokeSpawn = getScore(player, "Poke_Spawn");
        const inPlains = getScore(player, "Forest");
        if (pokeSpawn !== 150|| inPlains !== 1) continue;

        const roll = Math.floor(Math.random() * 210); // 0–209

        if (roll < 21) {
            // ✅ 10% Do Nothing (21/210)
        }
        else if (roll < 38) {
            // ✅ 8% Pokéball (17/210)
            player.dimension.spawnEntity("pokeworld:pokeball_items" as any, {
                x: player.location.x,
                y: player.location.y + 0.5,
                z: player.location.z
            });
            player.sendMessage("§bOh!!! You Found A Pokéball!!!");
        }
        else if (roll < 158) {
            // ✅ 57% Common (120/210)
            spawnPokemon(player, pickRandom(common));
        }
        else if (roll < 183) {
            // ✅ 12% Uncommon (25/210)
            spawnPokemon(player, pickRandom(uncommon));
        }
        else if (roll < 196) {
            // ✅ 6% Rare (13/210)
            spawnPokemon(player, pickRandom(rare));
        }
        else if (roll < 202) {
            // ✅ 3% Very Rare (6/210)
            spawnPokemon(player, pickRandom(veryRare));
        }
        else if (roll < 206) {
            // ✅ 2% Ultra Rare (4/210)
            spawnPokemon(player, pickRandom(ultraRare));
        }
        else {
            // === 2% TRAINER / GRUNT (4/210) ===
            const trainerRoll = Math.random();

            const entityId =
                trainerRoll < 0.75
                    ? "pokeworld:npc_trainer"
                    : "pokeworld:team_grunt";

            player.dimension.spawnEntity(entityId as any, {
                x: player.location.x + 1,
                y: player.location.y,
                z: player.location.z + 1
            });

            player.sendMessage("§eA Trainer Appeared!");
        }

        setScore(player, "Poke_Spawn", 0);
    }
}, 20);
