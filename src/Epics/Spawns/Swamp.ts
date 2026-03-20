import { Player, world, system, Entity, Vector3, EntityEquippableComponent, EquipmentSlot } from "@minecraft/server";

// 🐸 Swamp Biome Pokémon Rarity Groups (Ghost/Poison/Dark Themed)
const common = [
  'wild_poliwag','wild_wooper','wild_lotad','wild_shellos',
  'wild_ekans','wild_grimer','wild_koffing','wild_paras',
  'wild_venonat','wild_budew','wild_gulpin','wild_stunky',
  'wild_croagunk','wild_barboach','wild_psyduck',
  'wild_gastly','wild_shuppet','wild_duskull','wild_drifloon'
];

const uncommon = [
  'wild_poliwhirl','wild_lombre','wild_roselia','wild_quagsire',
  'wild_swalot','wild_skourpi','wild_weezing','wild_muk',
  'wild_parasect','wild_venomoth','wild_golduck','wild_slowpoke',
  'wild_slowbro','wild_slowking',
  'wild_haunter','wild_misdreavus','wild_banette','wild_dusclops'
];

const rare = [
  'wild_poliwrath','wild_politoed','wild_ludicolo','wild_roserade',
  'wild_toxicroak','wild_drapion','wild_vileplume','wild_victreebel',
  'wild_golduck','wild_slowbro','wild_slowking',
  'wild_gengar','wild_mismagius','wild_dusknoir','wild_drifblim','wild_sableye'
];

const veryRare = [
  'wild_drapion','wild_skuntank','wild_seviper','wild_gastrodon',
  'wild_carnivine','wild_toxicroak','wild_roserade',
  'wild_spiritomb','wild_froslass','wild_rotom'
];

const ultraRare = [
  'wild_carnivine','wild_roserade','wild_politoed',
  'wild_spiritomb','wild_rotom'
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
        const inPlains = getScore(player, "Swamp");
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