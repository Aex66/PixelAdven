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
import { Entity, Player, system, world } from "@minecraft/server";
import { writePokemon } from "../Pokemon Database/main.js";
import wildPokemon from "../../Letters/pokemon/wild.js";
import { checkSidebarFree } from "./calculations.js";
import { selected } from "../Main/Forms/PC/main.js";
import pokemonList from "../../Letters/pokemon/list.js";
import { grammarText } from "../../Papers/Paragraphs/ExtrasParagraphs";
import { longHand, pokeballs } from "../Pokemon Database/@types/types.js";
import { ActionFormData } from "@minecraft/server-ui";
import { Battle } from "../Pokemon Battles/classes/Battle.js";
import TypeList from "../../Letters/pokemon/TypeList.js";
import { activeOutbreaks, endOutbreak, handleOutbreakProgress, spawnOutbreakEntity } from "../Outbreaks/outbreakManager.js";
import { findNextFreePCSlotForPlayer } from "../Pokemon Database/PcControls.js";

export function safeRemove(entity: Entity) {
    try {
        if (entity?.isValid) {
            entity.remove();
        }
    } catch { }
}

const statusTags = {
    asleep: 2,
    frozen: 2,
    paralyzed: 1.5,
    poisoned: 1.5,
    healthy: 1
};

export const ballTags: Record<string, {
    multiplier: number;
    conditionalMultiplier?: (entity: Entity, tags: string[], battle?: Battle, turn?: number) => number;
}> = {

    empty: { multiplier: 1 },
    pokeball: { multiplier: 1.5 },
    greatball: { multiplier: 2 },
    ultraball: { multiplier: 2.5 },
    masterball: { multiplier: 255 },
    safariball: { multiplier: 1.5 },
    fastball: {
        multiplier: 1.5,
        conditionalMultiplier: (entity) => {
            const speed = world.scoreboard.getObjective("Spd_Base")?.getScore(entity) ?? 0;
            return speed > 100 ? 4.5 : 1.5;
        }
    },
    levelball: { multiplier: 1 },
    lureball: {
        multiplier: 1.5,
        conditionalMultiplier: (entity) => {
            const tags = entity.getTags();
            return tags.includes("fished") ? 4.5 : 1.5;
        }
    },
    heavyball: {
        multiplier: 1,
        conditionalMultiplier: (entity) => {
            const weight = world.scoreboard.getObjective("weight")?.getScore(entity) ?? 0;
            if (weight < 100) return 0.56;
            if (weight <= 200) return 1.0;
            if (weight <= 300) return 1.44;
            return 1.67;
        }
    },
    loveball: { multiplier: 1.5 },
    friendball: { multiplier: 1.5 },
    moonball: {
        multiplier: 1.5,
        conditionalMultiplier: (entity) => {
            const tags = entity.getTags();
            return tags.includes("moonstone") ? 4.5 : 1.5;
        }
    },
    sportball: { multiplier: 1.5 },
    netball: {
        multiplier: 1.5,
        conditionalMultiplier: (entity) => {
            const type1 = world.scoreboard.getObjective("type1")?.getScore(entity) ?? 0;
            const type2 = world.scoreboard.getObjective("type2")?.getScore(entity) ?? 0;
            return (type1 === 2 || type2 === 2 || type1 === 12 || type2 === 12) ? 4 : 1.5;
        }
    },
    diveball: {
        multiplier: 1.5,
        conditionalMultiplier: (entity) => {
            const block = entity.dimension.getBlock(entity.location);
            const inWater = block?.typeId === "minecraft:water";
            const type1 = world.scoreboard.getObjective("type1")?.getScore(entity) ?? 0;
            const type2 = world.scoreboard.getObjective("type2")?.getScore(entity) ?? 0;
            return (inWater && (type1 === 2 || type2 === 2)) ? 4 : 1.5;
        }
    },
    nestball: {
        multiplier: 1.5,
        conditionalMultiplier: (entity) => {
            const lvl = world.scoreboard.getObjective("Lvl")?.getScore(entity) ?? 0;
            return lvl >= 1 && lvl <= 29 ? ((41 - lvl) / 10) : 1.5;
        }
    },
    repeatball: { multiplier: 1.5 },
    timerball: {
        multiplier: 1.5,
        conditionalMultiplier: (_entity, _tags, battle) => {
            const multiplier = 1 + (battle!.turn * 1229) / 4096;
            return Math.min(multiplier, 4.5);
        }
    },
    luxuryball: { multiplier: 1.5 },
    premierball: { multiplier: 1.5 },
    duskball: {
        multiplier: 1.5,
        conditionalMultiplier: (entity) => {
            const tags = entity.getTags();
            const time = world.getTimeOfDay();
            const isCave = tags.includes("Cave");
            return (time > 13000 || isCave) ? 3.5 : 1.5;
        }
    },
    healball: { multiplier: 1.5 },
    quickball: {
        multiplier: 1.5,
        conditionalMultiplier: (_entity, _tags, battle) => {
            return battle!.turn === 1 ? 5.5 : 1.5;
        }
    },
    cherishball: { multiplier: 1.5 },
    parkball: { multiplier: 255 },
    dreamball: {
        multiplier: 1.5,
        conditionalMultiplier: (entity) => {
            const tags = entity.getTags();
            return tags.includes("asleep") ? 4.5 : 1.5;
        }
    },
    beastball: { multiplier: 1 },
    arkadiaball: {
        multiplier: 1.0,
        conditionalMultiplier: (entity) => {
            const type1 = world.scoreboard.getObjective("type1")?.getScore(entity) ?? 0;
            const type2 = world.scoreboard.getObjective("type2")?.getScore(entity) ?? 0;
            return (type1 === 17 || type2 === 17) ? 2.5 : 1.0;
        }
    }
}

function catchEffects(entity: Entity, pokeball: string | undefined) {
    entity.runCommand("effect @s invisibility 9999 1 true");
    entity.runCommand("inputpermission set @s movement disabled");
    if (pokeball) entity.triggerEvent(`pokeworld:${pokeball}`);
}

export async function _catch(entity: Entity, battle: Battle): Promise<"NO_PLAYER" | "POKEMON_BROKEFREE" | "POKEMON_CAUGHT"> {
    const turn = battle.turn;
    const tags = entity.getTags();
    const hasHealBall = tags.includes("healball");

    const HpHigh = world.scoreboard.getObjective("HP_High")?.getScore(entity);
    const HpLow = world.scoreboard.getObjective("HP_Low")?.getScore(entity);
    const HpBase = world.scoreboard.getObjective("HP_Base")?.getScore(entity);

    const mon = wildPokemon[entity.typeId];
    const ODW = tags.find((tag) => tag.startsWith("ODW:"))?.slice(4);
    const player = world.getAllPlayers().find((p) => p.name === ODW);
    if (!player) {
        entity.remove();
        return "NO_PLAYER";
    }

    const status = statusTags[tags.find((tag) => statusTags.hasOwnProperty(tag)) as keyof typeof statusTags];
    const ballTag = tags.find((tag) => ballTags.hasOwnProperty(tag)) as keyof typeof ballTags;
    const ballData = ballTags[ballTag];
    const ball = typeof ballData.conditionalMultiplier === "function"
        ? ballData.conditionalMultiplier(entity, tags, battle, turn)
        : ballData.multiplier;

    const currentHP = hasHealBall ? HpBase ?? 0 : HpLow ?? 0;
    const ballName = tags.find((tag) => ballTags.hasOwnProperty(tag));

    // Fire ball animation up front
    catchEffects(entity, ballName);

    // Step 1: Calculate a
    let a = Math.floor(
        ((((3 * (HpHigh ?? 1)) - (2 * currentHP)) * (mon.Catch_Rate ?? 1) * ball) / (3 * (HpHigh ?? 1))) * status);

    // ✅ Global 1.5× catch boost
    a = Math.floor(a * 1.5);

    // Clamp exactly like vanilla safety
    a = Math.min(255, Math.max(1, a));


    // Step 2: Auto-catch if a >= 255
    if (a >= 255) {
        finalizeCatch(entity, player, tags, currentHP, HpBase);
        return "POKEMON_CAUGHT";
    }

    // Step 3: Calculate b
    const b = Math.floor(1048560 / Math.sqrt(Math.sqrt(16711680 / a)));

    // Step 4: Shake sequence
    return new Promise((resolve) => {
        let shakes = 0;

        const doShake = () => {
            // 🛑 Entity may have been removed between shakes
            if (!entity || !entity.isValid) return;

            shakes++;

            const roll = Math.floor(Math.random() * 65536);

            if (roll >= b) {
                player.sendMessage("The Pokémon broke free!");

                if (entity.isValid) {
                    entity.runCommand("effect @s clear");
                    entity.runCommand("event entity @s pokeworld:ball_reset");
                    entity.addEffect("slowness", 999999, { amplifier: 255, showParticles: false });
                    for (const tag of Object.keys(ballTags)) entity.removeTag(tag);
                }

                resolve("POKEMON_BROKEFREE");
                return;
            }

            if (shakes < 4) {
                system.runTimeout(doShake, 13);
            } else {
                if (entity.isValid) {
                    finalizeCatch(entity, player, tags, currentHP, HpBase);
                    resolve("POKEMON_CAUGHT");
                }
            }
        };

        doShake();
    });
}

function addTypeScores(entity: Entity, player: Player) {
    const type1 = world.scoreboard.getObjective("type1")?.getScore(entity) ?? 0;
    const type2 = world.scoreboard.getObjective("type2")?.getScore(entity) ?? 0;

    // type1
    if (type1 > 0 && TypeList[type1]) {
        player.runCommand(`scoreboard players add @s ${TypeList[type1].toLowerCase()} 1`);
    }

    // type2 (only if it’s not None and not the same as type1)
    if (type2 > 0 && type2 !== type1 && TypeList[type2]) {
        player.runCommand(`scoreboard players add @s ${TypeList[type2].toLowerCase()} 1`);
    }
}

function finalizeCatch(entity: Entity, player: Player, tags: string[], currentHP: number, HpBase: number | undefined) {
    const ballName = tags.find((tag) => ballTags.hasOwnProperty(tag));
    const variant = entity.getComponent("minecraft:mark_variant")?.value ?? 0;
    const calculations: longHand = {
        level: world.scoreboard.getObjective("Lvl")?.getScore(entity) ?? 0,
        Experience: 0,
        Move1_PP: world.scoreboard.getObjective("move1pp")?.getScore(entity) ?? 0,
        Move2_PP: world.scoreboard.getObjective("move2pp")?.getScore(entity) ?? 0,
        Move3_PP: world.scoreboard.getObjective("move3pp")?.getScore(entity) ?? 0,
        Move4_PP: world.scoreboard.getObjective("move4pp")?.getScore(entity) ?? 0,
        Move1: world.scoreboard.getObjective("move1")?.getScore(entity) ?? 0,
        Move2: world.scoreboard.getObjective("move2")?.getScore(entity) ?? 0,
        Move3: world.scoreboard.getObjective("move3")?.getScore(entity) ?? 0,
        Move4: world.scoreboard.getObjective("move4")?.getScore(entity) ?? 0,
        Base_Health: HpBase ?? 0,
        Current_Health: currentHP,
        Base_speed: world.scoreboard.getObjective("Spd_Base")?.getScore(entity) ?? 0,
        Base_attack: world.scoreboard.getObjective("Atk_Base")?.getScore(entity) ?? 0,
        Base_defense: world.scoreboard.getObjective("Def_Base")?.getScore(entity) ?? 0,
        Base_special_attack: world.scoreboard.getObjective("Sp_Atk_Base")?.getScore(entity) ?? 0,
        Base_special_defense: world.scoreboard.getObjective("Sp_Def_Base")?.getScore(entity) ?? 0,
        IV_health: world.scoreboard.getObjective("IV_HP")?.getScore(entity) ?? 0,
        IV_speed: world.scoreboard.getObjective("IV_Spd")?.getScore(entity) ?? 0,
        IV_attack: world.scoreboard.getObjective("IV_Atk")?.getScore(entity) ?? 0,
        IV_defense: world.scoreboard.getObjective("IV_Def")?.getScore(entity) ?? 0,
        IV_special_attack: world.scoreboard.getObjective("IV_Sp_Atk")?.getScore(entity) ?? 0,
        IV_special_defense: world.scoreboard.getObjective("IV_Sp_Def")?.getScore(entity) ?? 0,
        EV_health: world.scoreboard.getObjective("EV_HP")?.getScore(entity) ?? 0,
        EV_speed: world.scoreboard.getObjective("EV_Spd")?.getScore(entity) ?? 0,
        EV_attack: world.scoreboard.getObjective("EV_Atk")?.getScore(entity) ?? 0,
        EV_defense: world.scoreboard.getObjective("EV_Def")?.getScore(entity) ?? 0,
        EV_special_attack: world.scoreboard.getObjective("EV_Sp_Atk")?.getScore(entity) ?? 0,
        EV_special_defense: world.scoreboard.getObjective("EV_Sp_Def")?.getScore(entity) ?? 0,
        Nature: ["", world.scoreboard.getObjective("nature")?.getScore(entity) ?? 0],
        DMax: world.scoreboard.getObjective("DMax")?.getScore(entity) ?? 0,
        Ability: ["", world.scoreboard.getObjective("ability")?.getScore(entity) ?? 0],
        Size: world.scoreboard.getObjective("Size")?.getScore(entity) ?? 0,
        Variant: variant,
        Evolution_index: 0,
        Traded: false,
        heldItem: 0,
        friendShipLevel: 0,
        pokeBall: ballName as pokeballs,
        Terra: ["", world.scoreboard.getObjective("terra")?.getScore(entity) ?? 0],
        Gender: ["", world.scoreboard.getObjective("Gender")?.getScore(entity) ?? 0],
        Nickname: "",
        Box: -1,
        Slot: -1
    };

    const rID = ~~(Math.random() * 999999999);
    const pokeName = (grammarText(entity.typeId) as string).replace("Wild ", "");
    const freeSlot = checkSidebarFree(player);

    // ==================================================
    // PARTY FULL → ASK PLAYER
    // ==================================================
    if (freeSlot === undefined) {
        const form = new ActionFormData();
        form.title("§cParty Full!");
        form.body("Your team is full! What would you like to do?");
        form.button("§aSend to PC");
        form.button("§bAdd to Party");

        form.show(player).then((choice) => {
            // ➡ SEND TO PC
            if (choice.canceled || choice.selection === 0) {
                const { box, slot } = findNextFreePCSlotForPlayer(player);
                calculations.Box = box;
                calculations.Slot = slot;

                
                writePokemon(player, pokeName, rID, calculations);

                player.sendMessage("§a✔ §7Pokemon Sent To Your PC");
                player.runCommand(`scoreboard players add @s pcatch 1`);
                player.runCommand(`scoreboard players add @s eventpcatch 1`);
                safeRemove(entity);
                return;
            }

            // ➡ REPLACE PARTY SLOT
            const slotForm = new ActionFormData();
            slotForm.title("§eChoose a slot to replace");

            for (let i = 0; i < 6; i++) {
                const teamMon = selected[player.name]?.[i];
                slotForm.button(teamMon ? `Slot ${i + 1}: ${teamMon[1]}` : `Slot ${i + 1}: (empty)`);
            }

            slotForm.show(player).then((slotChoice) => {
                if (slotChoice.canceled) {
                    const { box, slot } = findNextFreePCSlotForPlayer(player);
                    calculations.Box = box;
                    calculations.Slot = slot;

                    
                    writePokemon(player, pokeName, rID, calculations);

                    player.sendMessage("§a✔ §7Pokemon Sent To Your PC");
                    player.runCommand(`scoreboard players add @s pcatch 1`);
                    player.runCommand(`scoreboard players add @s eventpcatch 1`);
                } else {
                    const slot = slotChoice.selection;
                    if (slot === undefined) return;

                    if (!selected.hasOwnProperty(player.name)) selected[player.name] = {};
                    selected[player.name][slot] = [Number(rID), pokeName, calculations];

                    system.run(() => {
                        player.runCommand(`scoreboard players set @s poke${slot > 0 ? slot + 1 : ""}rID ${rID}`);
                        player.runCommand(`scoreboard players set @s poke${slot > 0 ? slot + 1 : ""}Id ${pokemonList.indexOf(pokeName as any)}`);
                        player.runCommand(`scoreboard players set @s poke${slot > 0 ? slot + 1 : ""}Ball ${Object.keys(ballTags).indexOf(ballName!)}`);
                        player.runCommand(`scoreboard players set @s poke${slot > 0 ? slot + 1 : ""}Lvl ${calculations.level}`);
                        player.runCommand(`scoreboard players set @s poke${slot > 0 ? slot + 1 : ""}Var ${calculations.Variant}`);
                        player.runCommand(`scoreboard players set @s poke${slot > 0 ? slot + 1 : ""}HP ${currentHP}`);
                        player.runCommand(`scoreboard players set @s poke${slot > 0 ? slot + 1 : ""}HPmax ${calculations.Base_Health}`);
                        player.runCommand(`scoreboard players add @s pcatch 1`);
                        player.runCommand(`scoreboard players add @s eventpcatch 1`);
                    });

                    player.sendMessage(`§a✔ §7Pokemon Added To Your Party (Slot ${slot + 1})`);
                }

                entity.remove();
            });
        });
    }

    // ==================================================
    // FREE PARTY SLOT → ADD TO PARTY
    // ==================================================
    else {
        player.sendMessage("§a✔ §7Pokemon Added To Your Party");

        if (!selected.hasOwnProperty(player.name)) selected[player.name] = {};
        selected[player.name][freeSlot] = [Number(rID), pokeName, calculations];

        system.run(() => {
            player.runCommand(`scoreboard players set @s poke${freeSlot > 0 ? freeSlot + 1 : ""}rID ${rID}`);
            player.runCommand(`scoreboard players set @s poke${freeSlot > 0 ? freeSlot + 1 : ""}Id ${pokemonList.indexOf(pokeName as any)}`);
            player.runCommand(`scoreboard players set @s poke${freeSlot > 0 ? freeSlot + 1 : ""}Ball ${Object.keys(ballTags).indexOf(ballName!)}`);
            player.runCommand(`scoreboard players set @s poke${freeSlot > 0 ? freeSlot + 1 : ""}Lvl ${calculations.level}`);
            player.runCommand(`scoreboard players set @s poke${freeSlot > 0 ? freeSlot + 1 : ""}Var ${calculations.Variant}`);
            player.runCommand(`scoreboard players set @s poke${freeSlot > 0 ? freeSlot + 1 : ""}HP ${currentHP}`);
            player.runCommand(`scoreboard players set @s poke${freeSlot > 0 ? freeSlot + 1 : ""}HPmax ${calculations.Base_Health}`);
            player.runCommand(`scoreboard players add @s pcatch 1`);
            player.runCommand(`scoreboard players add @s eventpcatch 1`);
        });
    }
    // 🧬 Outbreak Catch Tracking
    const outbreakIdTag = entity.getTags().find(t => t.startsWith("outbreak_id:"));
    if (outbreakIdTag) {
        const speciesName = grammarText(entity.typeId);
        handleOutbreakProgress(player, outbreakIdTag, speciesName);

        // 🐾 Replacement spawn logic
        const outbreakId = Number(outbreakIdTag.split(":")[1]);
        const outbreak = activeOutbreaks.find(o => o.id === outbreakId);
        if (outbreak) {
            outbreak.active--;
            if (outbreak.remaining > 0) {
                outbreak.remaining--;
                outbreak.active++;
                system.runTimeout(() => spawnOutbreakEntity(outbreak), 20);
            } else if (outbreak.active <= 0) {
                endOutbreak(outbreak, "cleared");
            }
        }
    }

    if (entity.hasTag("outbreak")) {
        const tags = entity.getTags();
        const outbreakTag = tags.find(t => t.startsWith("outbreak:"));
        const outbreakId = tags.find(t => t.startsWith("outbreak_id:")) ?? "outbreak_id:unknown";
        const progressKey = `${player.name}_${outbreakId}`;
        const currentProgress = Number(world.getDynamicProperty(progressKey) ?? 0) + 1;
        world.setDynamicProperty(progressKey, currentProgress);

        player.sendMessage(`§e[Outbreak] ${grammarText(entity.typeId)} caught! (${currentProgress}/20)`);

        if (currentProgress >= 20) {
            player.sendMessage("§a✅ The outbreak has been cleared!");
            world.sendMessage(`§b${player.name} successfully ended the outbreak!`);
        }
    }

    const chapter2Stage = player.getDynamicProperty("quest_chapter2_stage") ?? 0;
    const totalCaught = world.scoreboard.getObjective("pcatch")?.getScore(player) ?? 0;
    if (chapter2Stage === 1 && totalCaught >= 1) {
        player.setDynamicProperty("quest_chapter2_stage", 2);
        player.sendMessage("§a✔ You’ve caught your first Pokémon! Check your Story Quest menu to complete Chapter 2.");
    }
    addTypeScores(entity, player);
    player.sendMessage("Pokemon Caught");
    entity.remove();
    return "POKEMON_CAUGHT";
}