import { Player, world, system, Entity, Vector3, EntityEquippableComponent, EquipmentSlot } from "@minecraft/server";

// 🌊 Ocean Biome Pokémon Rarity Groups
const common = [
  'wild_magikarp','wild_tentacool','wild_wingull','wild_staryu','wild_horsea',
  'wild_chinchou','wild_remoraid','wild_krabby','wild_goldeen','wild_shellder',
  'wild_wailmer','wild_corphish','wild_carvanha','wild_buizel','wild_finneon',
  'wild_luvdisc','wild_shellos','wild_mantyke','wild_psyduck','wild_slowpoke',
  'wild_seel','wild_poliwag','wild_lotad','wild_wooper','wild_barboach','wild_spheal',
  'wild_squirtle','wild_totodile','wild_mudkip','wild_piplup','wild_azurill'
];

const uncommon = [
  'wild_pelipper','wild_poliwhirl','wild_slowbro','wild_slowking',
  'wild_wartortle','wild_croconaw','wild_marshtomp','wild_prinplup',
  'wild_lombre','wild_qwilfish','wild_corsola','wild_clamperl',
  'wild_marill','wild_dewgong','wild_cloyster','wild_lombre','wild_lombre',
  'wild_seadra'
];

const rare = [
  'wild_tentacruel','wild_kingler','wild_seaking','wild_lanturn',
  'wild_crawdaunt','wild_sharpedo','wild_floatzel','wild_lumineon',
  'wild_whiscash','wild_octillery','wild_starmie','wild_golduck',
  'wild_wailord','wild_lapras','wild_quagsire','wild_azumarill',
  'wild_ludicolo','wild_walrein','wild_mantine'
];

const veryRare = [
  'wild_blastoise','wild_feraligatr','wild_swampert','wild_empoleon',
  'wild_vaporeon','wild_gyrados','wild_relicanth','wild_huntail',
  'wild_gorebyss','wild_kingdra','wild_milotic'
];

const ultraRare = [
  'wild_feebas','wild_dragonair','wild_dragonite'
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
        const inPlains = getScore(player, "Ocean");
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