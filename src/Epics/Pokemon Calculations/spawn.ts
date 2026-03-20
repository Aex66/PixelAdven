/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
Aex66 (Developer)
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
__________ ___________________
\______   \\_____  \__    ___/
 |       _/ /   |   \|    |
 |    |   \/    |    \    |
 |____|_  /\_______  /____|
        \/         \/
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
© Copyright 2023 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Website: https://www.rotmc.ml
Thank you!
*/
import { world, system, Player, Entity } from "@minecraft/server";
import { ID, grammarText } from "../../Papers/Paragraphs/ExtrasParagraphs.js";
import type { longHand, pokeballs } from '../Pokemon Database/@types/types.js';
import { writePokemon } from "../Pokemon Database/main.js";
import { selected } from "../Main/Forms/PC/main.js";
import { checkExperience } from "./leveling.js";
import { deployed } from "./main.js";
import { StatusEffectsValues } from "../../Letters/pokemon/moves.js";
import { ballTags } from "./catch.js";
import { battles } from "../Pokemon Battles/classes/Battle.js";
system.runInterval(() => {
    const overworld = world.getDimension('minecraft:overworld');

    for (const entity of overworld.getEntities({ tags: ['summoned'] })) {
        const tags = entity.getTags();
        const o = tags.find(t => t.startsWith('o:'))?.slice(2);
        const rID = Number(tags.find(t => t.startsWith('s:'))?.slice(2));
        const instanceID = tags.find(t => t.startsWith('in:'))?.slice(3);
        const player = world.getAllPlayers().find(p => p.name === o);

        if (!instanceID) continue;
        if (!player || instanceID !== deployed[player.name]?.[2] || rID !== deployed[player.name][0] || selected[player.name]?.[deployed[player.name][1]]?.[0] !== deployed[player.name][0]) {
            entity.remove();
            continue;
        }

        const health = world.scoreboard.getObjective('HP_Low')?.getScore(entity) ?? 0;
        if (health > 0) {
            checkExperience(player, entity, Number(deployed[player.name][1]));
            continue;
        }

        player.sendMessage(`§c${grammarText(selected[player.name][deployed[player.name][1]][1])} has fainted!`);
        spawnPokemon(player, selected[player.name][deployed[player.name][1]], deployed[player.name][1], true);

        const hpKeys = ["pokeHP", "poke2HP", "poke3HP", "poke4HP", "poke5HP", "poke6HP"];
        const allDead = hpKeys.every(key => {
            const score = world.scoreboard.getObjective(key)?.getScore(player) ?? 0;
            return score <= 0;
        });

        if (allDead) {
            player.sendMessage("§4All your Pokémon have fainted! The battle is over.");
            if (player.hasTag('next')) player.removeTag('next')

            const battle = battles.get(player.id);
            if (battle) battle.end();
        }
    }
}, 20);

/**
 * Spawn a pokemon
 * @param {Player} player The player to spawn the pokemon for
 * @param {[id: number, name: string, data: any]} member Pokemon data
 * @param {number} index Index in the data array
 * @param {boolean} force Force kill any pokemon the player has deployed 
 * @param {Battle} battleInstance Optional battle instance for defeated trigger
 * @returns 
 */
export async function spawnPokemon(player: Player, member: [id: number, name: string, data: longHand], index?: number, despawn?: boolean, onSpawn?: (entity: Entity) => void) {
    if (!despawn && (member[2]?.Current_Health ?? member[2].Base_Health) < 1) {
        player.sendMessage(`You cannot summon ${member[1]} because it's health is 0!`)
        return false
    }

    if (deployed.hasOwnProperty(player.name)) {
        Array.from(player.dimension.getEntities({ tags: [`s:${deployed[player.name][0]}`] })).forEach(entity => {
            const level = world.scoreboard.getObjective('Lvl')?.getScore(entity) ?? 1,
                Experience = world.scoreboard.getObjective('Ex')?.getScore(entity) ?? 0,
                Base_Health = world.scoreboard.getObjective('HP_Base')?.getScore(entity) ?? 0,
                Current_Health = world.scoreboard.getObjective('HP_Low')?.getScore(entity) ?? Base_Health,
                Base_attack = world.scoreboard.getObjective('Atk_Base')?.getScore(entity) ?? 0,
                Base_defense = world.scoreboard.getObjective('Def_Base')?.getScore(entity) ?? 0,
                Base_speed = world.scoreboard.getObjective('Spd_Base')?.getScore(entity) ?? 0,
                Base_special_attack = world.scoreboard.getObjective('Sp_Atk_Base')?.getScore(entity) ?? 0,
                Base_special_defense = world.scoreboard.getObjective('Sp_Def_Base')?.getScore(entity) ?? 0,
                IV_health = world.scoreboard.getObjective('IV_HP')?.getScore(entity) ?? 0,
                IV_speed = world.scoreboard.getObjective('IV_Spd')?.getScore(entity) ?? 0,
                IV_attack = world.scoreboard.getObjective('IV_Atk')?.getScore(entity) ?? 0,
                IV_defense = world.scoreboard.getObjective('IV_Def')?.getScore(entity) ?? 0,
                IV_special_attack = world.scoreboard.getObjective('IV_Sp_Atk')?.getScore(entity) ?? 0,
                IV_special_defense = world.scoreboard.getObjective('IV_Sp_Def')?.getScore(entity) ?? 0,
                EV_health = world.scoreboard.getObjective('EV_HP')?.getScore(entity) ?? 0,
                EV_speed = world.scoreboard.getObjective('EV_Spd')?.getScore(entity) ?? 0,
                EV_attack = world.scoreboard.getObjective('EV_Atk')?.getScore(entity) ?? 0,
                EV_defense = world.scoreboard.getObjective('EV_Def')?.getScore(entity) ?? 0,
                EV_special_attack = world.scoreboard.getObjective('EV_Sp_Atk')?.getScore(entity) ?? 0,
                EV_special_defense = world.scoreboard.getObjective('EV_Sp_Def')?.getScore(entity) ?? 0,
                DMax = world.scoreboard.getObjective('DMax')?.getScore(entity) ?? 0,
                Nature = world.scoreboard.getObjective('nature')?.getScore(entity) ?? 0,
                Terra = world.scoreboard.getObjective('terra')?.getScore(entity) ?? 0,
                Gender = world.scoreboard.getObjective('Gender')?.getScore(entity) ?? 0,
                Size = world.scoreboard.getObjective('Size')?.getScore(entity) ?? 0,
                Move1 = world.scoreboard.getObjective('move1')?.getScore(entity) ?? 0,
                Move1_PP = world.scoreboard.getObjective('move1pp')?.getScore(entity) ?? 0,
                Move2 = world.scoreboard.getObjective('move2')?.getScore(entity) ?? 0,
                Move2_PP = world.scoreboard.getObjective('move2pp')?.getScore(entity) ?? 0,
                Move3 = world.scoreboard.getObjective('move3')?.getScore(entity) ?? 0,
                Move3_PP = world.scoreboard.getObjective('move3pp')?.getScore(entity) ?? 0,
                Move4 = world.scoreboard.getObjective('move4')?.getScore(entity) ?? 0,
                Move4_PP = world.scoreboard.getObjective('move4pp')?.getScore(entity) ?? 0,
                Traded = world.scoreboard.getObjective('Traded')?.getScore(entity) ?? 0,
                Evolution_index = world.scoreboard.getObjective('Evolution_index')?.getScore(entity) ?? 0,
                heldItem = world.scoreboard.getObjective('heldItem')?.getScore(entity) ?? 0,
                pokeBallID = world.scoreboard.getObjective('pokeBall')?.getScore(entity) ?? 0,
                friendShipLevel = world.scoreboard.getObjective('friendShipLevel')?.getScore(entity) ?? 0,
                Variant = world.scoreboard.getObjective('Variant')?.getScore(entity) ?? 0,
                condition = (world.scoreboard.getObjective('condition')?.getScore(entity) ?? 0) as (0 | StatusEffectsValues)

            const pokeBall = Object.keys(ballTags)[pokeBallID] as pokeballs;
            player.runCommand(`scoreboard players set @s poke${Number(deployed[player.name][1]) > 0 ? Number(deployed[player.name][1]) + 1 : ''}HP ${Current_Health}`);
            player.runCommand(`scoreboard players set @s poke${Number(deployed[player.name][1]) > 0 ? Number(deployed[player.name][1]) + 1 : ''}Lvl ${level}`);
            player.runCommand(`scoreboard players set @s poke${Number(deployed[player.name][1]) > 0 ? Number(deployed[player.name][1]) + 1 : ''}HPmax ${Base_Health}`);
            player.runCommand(`scoreboard players set @s poke${Number(deployed[player.name][1]) > 0 ? Number(deployed[player.name][1]) + 1 : ''}Ball ${Object.keys(ballTags).indexOf(pokeBall)}`);

            const existing = selected[player.name][deployed[player.name][1]][2];
            writePokemon(player, entity.typeId, Number(deployed[player.name][0]), {
                level, Experience, Base_Health, Current_Health, Base_attack, Base_defense,
                Base_special_attack, Base_special_defense, Base_speed, condition,
                Move1, Move2, Move3, Move4, Move1_PP, Move2_PP, Move3_PP, Move4_PP, Size,
                IV_health, IV_speed, IV_attack, IV_defense, IV_special_attack, IV_special_defense,
                EV_health, EV_speed, EV_attack, EV_defense, EV_special_attack, EV_special_defense,
                Nature: ['', Nature], DMax, Variant, Nickname: '', Traded: Traded == 1, Evolution_index,
                heldItem, friendShipLevel, pokeBall, Terra: ['', Terra],
                Gender: ['', Gender],
                // 🔒 PRESERVE PC LOCATION
                Ability: existing.Ability,
                Box: existing.Box,
                Slot: existing.Slot
            });

            selected[player.name][deployed[player.name][1]][2].level = level;
            selected[player.name][deployed[player.name][1]][2].Experience = Experience;
            selected[player.name][deployed[player.name][1]][2].Base_Health = Base_Health;
            selected[player.name][deployed[player.name][1]][2].Current_Health = Current_Health;
            selected[player.name][deployed[player.name][1]][2].Base_attack = Base_attack;
            selected[player.name][deployed[player.name][1]][2].Base_defense = Base_defense;
            selected[player.name][deployed[player.name][1]][2].Base_special_attack = Base_special_attack;
            selected[player.name][deployed[player.name][1]][2].Base_special_defense = Base_special_defense;
            selected[player.name][deployed[player.name][1]][2].Base_speed = Base_speed;
            selected[player.name][deployed[player.name][1]][2].Move1_PP = Move1_PP
            selected[player.name][deployed[player.name][1]][2].Move2_PP = Move2_PP
            selected[player.name][deployed[player.name][1]][2].Move3_PP = Move3_PP
            selected[player.name][deployed[player.name][1]][2].Move4_PP = Move4_PP
            selected[player.name][deployed[player.name][1]][2].condition = condition
            entity.remove();
        });
        if (member[0] === deployed[player.name][0]) return delete deployed[player.name];
        delete deployed[player.name];
    }
    if (despawn) return;


    // Play Poké Ball animation immediately
    player.runCommand(`summon pokeworld:${member[2].pokeBall}_catch ^ ^1 ^2 facing ^ ^1 ^3 pokeworld:spawn_ball`);

    system.runTimeout(() => {
        // ⛔ HARD GUARDS
        if (index === undefined) return;
        if (!onSpawn) return;

        const sub = world.afterEvents.entitySpawn.subscribe(({ entity }) => {
            if (entity.typeId !== `pokeworld:${member[1].toLowerCase()}`) return;

            world.afterEvents.entitySpawn.unsubscribe(sub);

            system.run(() => {

                // HARD VALIDATION
                if (!entity || !entity.isValid || !player || !member || index === undefined) {
                    if (entity?.isValid) entity.remove();
                    return;
                }

                try {

                    // mark temporary spawn state
                    entity.addTag("spawn_pending");

                    entity.runCommand(`scoreboard players set @s "Lvl" ${member[2].level}`);
                    entity.runCommand(`scoreboard players set @s "Ex" ${member[2].Experience ?? 0}`);
                    entity.runCommand(`scoreboard players set @s "HP_Base" ${member[2].Base_Health}`);
                    entity.runCommand(`scoreboard players set @s "HP_Low" ${member[2].Current_Health ?? member[2].Base_Health}`);

                    entity.runCommand(`scoreboard players set @s "Atk_Base" ${member[2].Base_attack}`);
                    entity.runCommand(`scoreboard players set @s "Def_Base" ${member[2].Base_defense}`);
                    entity.runCommand(`scoreboard players set @s "Spd_Base" ${member[2].Base_speed}`);
                    entity.runCommand(`scoreboard players set @s "Sp_Atk_Base" ${member[2].Base_special_attack}`);
                    entity.runCommand(`scoreboard players set @s "Sp_Def_Base" ${member[2].Base_special_defense}`);

                    entity.runCommand(`scoreboard players set @s "IV_HP" ${member[2].IV_health}`);
                    entity.runCommand(`scoreboard players set @s "IV_Spd" ${member[2].IV_speed}`);
                    entity.runCommand(`scoreboard players set @s "IV_Atk" ${member[2].IV_attack}`);
                    entity.runCommand(`scoreboard players set @s "IV_Def" ${member[2].IV_defense}`);
                    entity.runCommand(`scoreboard players set @s "IV_Sp_Atk" ${member[2].IV_special_attack}`);
                    entity.runCommand(`scoreboard players set @s "IV_Sp_Def" ${member[2].IV_special_defense}`);

                    entity.runCommand(`scoreboard players set @s "EV_HP" ${member[2].EV_health}`);
                    entity.runCommand(`scoreboard players set @s "EV_Spd" ${member[2].EV_speed}`);
                    entity.runCommand(`scoreboard players set @s "EV_Atk" ${member[2].EV_attack}`);
                    entity.runCommand(`scoreboard players set @s "EV_Def" ${member[2].EV_defense ?? 0}`);
                    entity.runCommand(`scoreboard players set @s "EV_Sp_Atk" ${member[2].EV_special_attack}`);
                    entity.runCommand(`scoreboard players set @s "EV_Sp_Def" ${member[2].EV_special_defense}`);

                    entity.runCommand(`scoreboard players set @s "DMax" ${member[2].DMax}`);
                    entity.runCommand(`scoreboard players set @s "nature" ${member[2].Nature[1]}`);
                    entity.runCommand(`scoreboard players set @s "Size" ${member[2].Size ?? 0}`);
                    entity.runCommand(`scoreboard players set @s "terra" ${member[2].Terra[1]}`);
                    entity.runCommand(`scoreboard players set @s "ability" ${member[2].Ability?.[1] ?? 0}`);

                    entity.runCommand(`scoreboard players set @s "Variant" ${member[2].Variant}`);
                    entity.runCommand(`scoreboard players set @s "Gender" ${member[2].Gender[1]}`);
                    entity.runCommand(`scoreboard players set @s "Traded" ${member[2].Traded ? 1 : 0}`);
                    entity.runCommand(`scoreboard players set @s "Evolution_index" ${member[2].Evolution_index}`);
                    entity.runCommand(`scoreboard players set @s "heldItem" ${member[2].heldItem}`);
                    entity.runCommand(`scoreboard players set @s "friendShipLevel" ${member[2].friendShipLevel ?? 0}`);
                    entity.runCommand(`scoreboard players set @s "pokeBall" ${Object.keys(ballTags).indexOf(member[2].pokeBall)}`);

                    entity.runCommand(`scoreboard players set @s "move1" ${member[2].Move1}`);
                    entity.runCommand(`scoreboard players set @s "move2" ${member[2].Move2}`);
                    entity.runCommand(`scoreboard players set @s "move3" ${member[2].Move3}`);
                    entity.runCommand(`scoreboard players set @s "move4" ${member[2].Move4}`);

                    entity.runCommand(`scoreboard players set @s "move1pp" ${member[2].Move1_PP}`);
                    entity.runCommand(`scoreboard players set @s "move2pp" ${member[2].Move2_PP}`);
                    entity.runCommand(`scoreboard players set @s "move3pp" ${member[2].Move3_PP}`);
                    entity.runCommand(`scoreboard players set @s "move4pp" ${member[2].Move4_PP}`);

                    entity.runCommand(`scriptevent pokeworld:type_change`);

                    const id = ID();

                    // Bind pokemon to player
                    system.runTimeout(() => {
                        if (!entity.isValid) return;

                        const tame = entity.getComponent("minecraft:tameable");
                        if (tame) tame.tame(player);
                    }, 1);

                    entity.addTag(`s:${member[0]}`);
                    entity.addTag(`o:${player.name}`);
                    entity.addTag(`in:${id}`);
                    entity.addTag(`summoned`);
                    entity.addTag(`pokemon`);

                    if (member[2].Nickname?.length) {
                        entity.addTag(`NN:${member[2].Nickname}`);
                    }

                    // SUCCESS → finalize deployment
                    entity.removeTag("spawn_pending");

                    deployed[player.name] = [member[0], index, id];

                    player.sendMessage(`${grammarText(entity.typeId)} has been summoned!`);

                    onSpawn(entity);

                } catch (err) {

                    // ANY ERROR → remove entity immediately
                    console.warn("Pokemon spawn failed:", err);

                    if (entity?.isValid) {
                        entity.remove();
                    }

                }

            });
        });

        player.runCommand(
            `summon pokeworld:${member[1].toLowerCase()} ^ ^1 ^2 facing ^ ^1 ^3 pokeworld:variant_${member[2].Variant}`
        );
    }, 20);

};
