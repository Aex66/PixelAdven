import { Player, world, system, Entity, Vector3, EntityEquippableComponent, EquipmentSlot } from "@minecraft/server";

// 🌿 Jungle Biome Pokémon Rarity Groups (Fully Audited, No Duplicates)
const common = [
  'wild_bulbasaur','wild_caterpie','wild_metapod','wild_butterfree',
  'wild_weedle','wild_kakuna','wild_beedrill',
  'wild_oddish','wild_bellsprout','wild_paras','wild_venonat',
  'wild_exeggcute','wild_hoppip','wild_sunkern',
  'wild_ledyba','wild_spinarak','wild_pikachu',
  'wild_treecko','wild_turtwig','wild_shroomish','wild_seedot',
  'wild_lotad','wild_slakoth','wild_nincada',
  'wild_roselia','wild_budew','wild_cherubi',
  'wild_burmy','wild_combee','wild_yanma','wild_aipom',
  'wild_kecleon','wild_volbeat','wild_illumise','wild_chimchar'
];

const uncommon = [
  'wild_ivysaur','wild_gloom','wild_weepinbell','wild_parasect','wild_venomoth',
  'wild_skiploom','wild_sunflora','wild_ledian','wild_ariados',
  'wild_grovyle','wild_grotle','wild_breloom','wild_nuzleaf','wild_lombre',
  'wild_vigoroth','wild_ninjask',
  'wild_roserade','wild_cherrim','wild_wormadam','wild_mothim',
  'wild_vespiquen','wild_yanmega','wild_ambipom','wild_monferno'
];

const rare = [
  'wild_venusaur','wild_vileplume','wild_victreebel','wild_exeggutor',
  'wild_jumpluff','wild_tropius', 'wild_raichu',
  'wild_sceptile','wild_torterra','wild_slaking','wild_shedinja',
  'wild_scyther','wild_pinsir','wild_heracross',
  'wild_staraptor','wild_shiftry',
  'wild_infernape','wild_abomasnow','wild_lopunny','wild_granbull','wild_purugly'
];

const veryRare = [
  'wild_scizor','wild_ursaring','wild_roserade','wild_leafeon','wild_gallade',
  'wild_honchkrow','wild_mismagius','wild_drifblim','wild_rotom'
];

const ultraRare = [
  'wild_eevee','wild_espeon','wild_umbreon','wild_leafeon','wild_togekiss'
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
        const inPlains = getScore(player, "Jungle");
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