import { Player, world, system, Entity, Vector3, EntityEquippableComponent, EquipmentSlot } from "@minecraft/server";

// 🔥 Volcano Biome Pokémon Rarity Groups (Fire starters included)
const common = [
  'wild_charmander','wild_cyndaquil','wild_torchic','wild_chimchar',
  'wild_slugma','wild_numel','wild_growlithe','wild_vulpix',
  'wild_ponyta','wild_houndour','wild_geodude','wild_rhyhorn','wild_aron'
];

const uncommon = [
  'wild_charmeleon','wild_quilava','wild_combusken','wild_monferno',
  'wild_magmar','wild_camerupt','wild_magcargo','wild_lairon',
  'wild_graveler','wild_rapidash','wild_ninetales','wild_arcanine'
];

const rare = [
  'wild_typhlosion','wild_blaziken','wild_infernape','wild_charizard',
  'wild_camerupt','wild_magmar','wild_golem','wild_rhydon','wild_camerupt',
  'wild_torkoal','wild_aggron','wild_houndoom'
];

const veryRare = [
  'wild_magmortar','wild_rhyperior','wild_crobat','wild_aggron'
];

const ultraRare = [
  'wild_tyranitar','wild_charizard','wild_typhlosion',
  'wild_blaziken','wild_infernape'
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
        const inPlains = getScore(player, "Volcano");
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