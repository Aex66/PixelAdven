import { Pokemon } from "../../../Letters/pokemon/@types/types";
import { Pokemon as IPokemon, StatName } from "../classes/Pokemon";
import { Battle } from "../classes/Battle"
import { NpcBattler, PlayerBattler, WildBattler } from "../classes/Battler";
import { calculateAttackDamage, getMoveByID, getScore, getType1, getType2, randomNumber, setScore } from "../utils";
import { Entity, system } from "@minecraft/server";
import { LANG } from "../lang";
import { grammarText } from "../../../Papers/Paragraphs/ExtrasParagraphs";
import TypeList from "../../../Letters/pokemon/TypeList";
import { MoveDamageType, StatusEffects, StatusMoveTarget } from "../../../Letters/pokemon/moves";
import { ATTACK_PARTICLES } from "../../../constants";
import { beforeStatusEffect } from "./Status";

function camera(player: PlayerBattler) {
    const cmd = `/execute at @e[tag=attacker,scores={bid=${player.battle.id}}] rotated ~ 0 positioned ^-4^6^-4 run camera @s set minecraft:free ease 0.1 linear pos ~~~ facing @e[tag=defender,scores={bid=${player.battle.id}}]`;
    player.entity.runCommand(cmd)
}

function safeAddTag(entity: Entity | undefined, tag: string) {
    try {
        if (entity?.isValid) {
            entity.addTag(tag);
        }
    } catch { }
}

function safeRemoveTag(entity: Entity | undefined, tag: string) {
    try {
        if (entity?.isValid && entity.hasTag(tag)) {
            entity.removeTag(tag);
        }
    } catch { }
}
//Helpers
function OneHitKO(
    attacker: NpcBattler | WildBattler | PlayerBattler,
    target: NpcBattler | WildBattler | PlayerBattler,
    battle: Battle,
    move: Pokemon.Move,
) {
    const type1 = getType1(target.pokemon.entity, move);
    const type2 = getType2(target.pokemon.entity, move);

    if (type1 === 0 || type2 === 0) {
        battle.message(LANG['move.missed'](grammarText(attacker.pokemon.entity.typeId)));
    } else {
        battle.message(LANG['move.one.hit.ko']());
        battle.attack(target.pokemon, 1000567, target); // Instant KO
    }
}

function applyRecoil(percent: number) {
    return (
        attacker: NpcBattler | WildBattler | PlayerBattler,
        target: NpcBattler | WildBattler | PlayerBattler,
        battle: Battle,
        move: Pokemon.Move
    ) => {
        const result = calculateAttackDamage(attacker.pokemon, target.pokemon, move, getType1(target.pokemon.entity, move), getType2(target.pokemon.entity, move));
        battle.attack(target.pokemon, result.damage, target);

        if (getScore(attacker.pokemon.entity, 'ability') !== 201) {
            const recoil = Math.floor(result.damage * percent);
            const currentHP = getScore(attacker.pokemon.entity, 'HP_Low');
            setScore(attacker.pokemon.entity, 'HP_Low', Math.max(currentHP - recoil, 0));
            battle.message(`§d${grammarText(attacker.pokemon.entity.typeId)}§r took recoil damage!`);
        } else {
            battle.message(`§d${grammarText(attacker.pokemon.entity.typeId)}'s§r ability prevented recoil damage!`);
        }
    };
}

function applyFixedRecoil(percent: number) {
    return (
        attacker: NpcBattler | WildBattler | PlayerBattler,
        _: NpcBattler | WildBattler | PlayerBattler,
        battle: Battle,
        __: Pokemon.Move
    ) => {
        if (getScore(attacker.pokemon.entity, 'ability') !== 201) {
            const maxHP = getScore(attacker.pokemon.entity, 'HP_Base');
            const recoil = Math.floor(maxHP * percent);
            const currentHP = getScore(attacker.pokemon.entity, 'HP_Low');
            setScore(attacker.pokemon.entity, 'HP_Low', Math.max(currentHP - recoil, 0));
            battle.message(`§d${grammarText(attacker.pokemon.entity.typeId)}§r was hurt by the recoil!`);
        } else {
            battle.message(`§d${grammarText(attacker.pokemon.entity.typeId)}'s§r ability prevented recoil damage!`);
        }
    };
}

function EscapeMove(
    attacker: NpcBattler | WildBattler | PlayerBattler,
    target: NpcBattler | WildBattler | PlayerBattler,
    battle: Battle,
) {
    battle.message(
        `§d${grammarText(attacker.pokemon.entity.typeId)}§r escaped from the battle!`
    )
    battle.end()
}
function drainAndHeal(percent: number) {
    return (
        attacker: NpcBattler | WildBattler | PlayerBattler,
        target: NpcBattler | WildBattler | PlayerBattler,
        battle: Battle,
        move: Pokemon.Move
    ) => {
        const result = calculateAttackDamage(attacker.pokemon, target.pokemon, move, getType1(target.pokemon.entity, move), getType2(target.pokemon.entity, move));
        battle.attack(target.pokemon, result.damage, target);
        attacker.pokemon.heal(result.damage * percent);
        battle.message(`§d${grammarText(target.pokemon.entity.typeId)}§r had its energy drained!`);
        battle.message(`§d${grammarText(attacker.pokemon.entity.typeId)}§r had its HP restored!`);
    };
}

function applyBindingEffect(
    _: NpcBattler | WildBattler | PlayerBattler,
    target: NpcBattler | WildBattler | PlayerBattler,
    __: Battle,
    move: Pokemon.Move
) {
    const bindEffects = ['Wrap', 'Whirlpool', 'Bind', 'Fire Spin', 'Sand Tomb', 'Infestation', 'Clamp'];
    const tags = target.pokemon.entity.getTags();
    if (bindEffects.some(effect => tags.includes(`TrapEffect:${effect}`))) return;

    target.pokemon.entity.addTag(`TrapEffect:${move.name}`);
    setScore(target.pokemon.entity, 'bindEffectTurns', randomNumber(4, 5));
}

const specialMoveHandlers: Record<number, (
    attacker: NpcBattler | WildBattler | PlayerBattler,
    target: NpcBattler | WildBattler | PlayerBattler,
    battle: Battle,
    move: Pokemon.Move,
    isFirstTurn: boolean
) => void> = {
    //Dream Eater: Only usable on sleeping opponent
    199: (attacker, target, battle, move) => {
        if (!target.pokemon.isAsleep()) {
            battle.message(LANG['move.missed'](move.name));
            return;
        }
        Move.execute(attacker, target, battle, move);
    },

    //Snore: Only usable if asleep
    720: (attacker, target, battle, move) => {
        if (!attacker.pokemon.isAsleep()) {
            battle.message(LANG['move.missed'](move.name));
            return;
        }
        Move.execute(attacker, target, battle, move);
    },

    // Recoil Moves
    85: applyRecoil(0.33), // Brave Bird
    177: applyRecoil(0.33), // Double-Edge
    181: applyRecoil(0.33), // Double Shock
    264: applyRecoil(0.33), // Flare Blitz
    336: applyRecoil(0.50), // Head Smash
    753: applyFixedRecoil(0.5),  // Steel Beam – 50% of max HP
    773: applyRecoil(0.25), // Submission
    802: applyRecoil(0.25), // Take Down
    868: applyRecoil(0.33), // Volt Tackle
    877: applyRecoil(0.33), // Wave Crash
    891: applyRecoil(0.33), // Wood Hammer
    671: applyFixedRecoil(100.0), // Self Destruct
    230: applyFixedRecoil(100.0), // Explosion

    325: OneHitKO,

    258: OneHitKO,

    358: OneHitKO,

    //Whirlwind: Escape from the battle
    880: EscapeMove,
    //Teleport: Escape from the battle
    812: EscapeMove,
    //Roar: Escape from the battle
    631: EscapeMove,
    //Recover: Restores 50% of the user's max HP
    617: (attacker, target, battle, move) => {
        const max = getScore(attacker.pokemon.entity, 'HP_Base')
        attacker.pokemon.heal(max * 0.5)
        battle.message(
            `§d${grammarText(attacker.pokemon.entity.typeId)}§r had its HP restored!`
        )
    },
    //Rest: Puts the pokemon to sleep for 2 turns but restores it's HP
    623: (attacker, target, battle, move) => {
        setScore(attacker.pokemon.entity, 'condition', StatusEffects.Sleep)
        setScore(attacker.pokemon.entity, 'sleepTurns', 2)
        attacker.pokemon.heal(getScore(attacker.pokemon.entity, 'HP_Base'))
        battle.message(
            `§d${grammarText(attacker.pokemon.entity.typeId)}§r had its HP restored!`
        )
    },
    //Mimic: Copies the last move used by the defender excluding the moves: 
    490: (attacker, target, battle, move) => {
        const lastMoveUsed = getScore(target.entity, 'lastu')
        if (![112, 487, 696, 769, 490, 496].includes(lastMoveUsed) && lastMoveUsed && lastMoveUsed !== 0) {
            const data = getMoveByID(lastMoveUsed)
            Move.execute(attacker, target, battle, data)
        } else {
            battle.message(`Mimic failed`)
        }
    },
    //Mirror Move: User performs the opponent's last move.
    496: (attacker, target, battle, _, first) => {
        if (first) return battle.message(`Mirror Move failed`)

        const lastMoveUsed = getScore(target.entity, 'lastu')
        if (![112, 487, 696, 769, 490, 496].includes(lastMoveUsed) && lastMoveUsed && lastMoveUsed !== 0) {
            const data = getMoveByID(lastMoveUsed)
            Move.execute(attacker, target, battle, data)
        } else {
            battle.message(`Mirror Move failed`)
        }
    },
    //Belly Drum: Attack stat stage becomes +6 but reduced 50% of HP
    57: (attacker, _, battle) => {
        const hp = getScore(attacker.pokemon.entity, 'HP_Low');
        battle.attack(attacker.pokemon, hp * 0.5, attacker);
        attacker.pokemon.modifyStat('Attack', 6);
    },
    //Leech Seed: Plants a seed on the opponent that makes them lose 1/8 MAX HP and give it to the seeder
    418: (_, target) => {
        target.pokemon.entity.addTag('TrapEffect:Leech Seed');
    },
    //Sappy Seed: Targets loses 1/8 MAX HP per turn
    656: (_, target) => {
        target.pokemon.entity.addTag('TrapEffect:Sappy Seed');
    },
    //HP Drain moves
    198: drainAndHeal(0.75), // Absorb
    2: drainAndHeal(0.5),    // Drain Punch
    197: drainAndHeal(0.5),  // Draining Kiss
    303: drainAndHeal(0.5),  // Giga Drain
    359: drainAndHeal(0.5),  // Horn Leech
    417: drainAndHeal(0.5),  // Leech Life
    475: drainAndHeal(0.5),  // Mega Drain
    530: drainAndHeal(0.5),  // Oblivion Wing
    543: drainAndHeal(0.5),  // Parabolic Charge

    //Rapid Spin: Removes all binding effects from the user
    613: (attacker, _, battle) => {
        const effectsToRemove = [
            'Leech Seed', 'Stealth Rock', 'Clamp', 'Wrap', 'Magma Storm',
            'Sticky Webs', 'Fire Spin', 'Sand Tomb', 'Toxic Spikes',
            'Infestation', 'Spikes', 'Whirlpool'
        ];
        effectsToRemove.forEach(effect => attacker.pokemon.removeTrapEffect(effect));
        battle.message(`§d${grammarText(attacker.pokemon.entity.typeId)}§r spun rapidly and got rid of hazards!`);
    },
    //False Swipe: Sets the opponent to 1 HP, if opponent immune it doesnt work.
    240: (_, target, battle, move) => {
        const type1 = getType1(target.pokemon.entity, move);
        const type2 = getType2(target.pokemon.entity, move);
        if (type1 * type2 !== 0) {
            target.pokemon.setHealth(1);
            battle.message(`§d${grammarText(target.pokemon.entity.typeId)}§r is at 1 HP!`);
        }
    },
    //Lunar Blessing: Removes all Status effects and restores 25% of Max HP
    433: (attacker) => {
        setScore(attacker.pokemon.entity, 'condition', 0);
        attacker.pokemon.heal(getScore(attacker.pokemon.entity, 'HP_Base') * 0.25);
    },
    //Nightmare: Target Pokémon loses 1/4 Max HP per turn while asleep
    525: (_, target) => {
        target.pokemon.entity.addTag('TrapEffect:Nightmare');
    },
    //Pain Split: Adds Both Active Pokémon's Current HP then divides it by 2 and each gets their current HP to that value
    542: (attacker, target, battle) => {
        const hp1 = getScore(attacker.pokemon.entity, 'HP_Low');
        const hp2 = getScore(target.pokemon.entity, 'HP_Low');
        const result = ~~((hp1 + hp2) / 2);
        attacker.pokemon.setHealth(result);
        target.pokemon.setHealth(result);
        battle.message(`The battlers shared their pain!`);
    },
    //Psych Up: Copies Opponents Stat stages
    586: (attacker, target, battle) => {
        const stats = ['Attack', 'SpecialAttack', 'Defense', 'SpecialDefense', 'Speed', 'Accuracy', 'Evasion'] as const;
        for (const stat of stats) {
            attacker.pokemon.modifyStat(stat, target.pokemon.getStat(stat));
        }
        battle.message(`§d${grammarText(attacker.pokemon.entity.typeId)}§r copied ${grammarText(target.pokemon.entity.typeId)}'s stat changes!`);
    },
    //Refresh: Cures paralysis, poison and burn
    621: (attacker, _, battle) => {
        const condition = getScore(attacker.pokemon.entity, 'condition');
        if (condition === StatusEffects.Paralyzed || condition === StatusEffects.Burned || condition === StatusEffects.Poisoned) {
            setScore(attacker.pokemon.entity, 'condition', 0);
            battle.message(`§d${grammarText(attacker.pokemon.entity.typeId)}§r healed its status!!`);
        }
    },
    //Safeguard: Status effects cannot be applied to users team for 5 turns
    650: (attacker) => {
        setScore(attacker.entity, 'battle:safeguard', 5);
    },
    //Reflect: Status effects cannot be applied to users team for 5 turns
    619: (attacker) => {
        setScore(attacker.entity, 'battle:reflect', 5);
    },//LightScreen: Status effects cannot be applied to users team for 5 turns
    424: (attacker) => {
        setScore(attacker.entity, 'battle:lightscreen', 5);
    },
    //Binding moves
    894: applyBindingEffect,
    879: applyBindingEffect,
    60: applyBindingEffect,
    255: applyBindingEffect,
    653: applyBindingEffect,
    389: applyBindingEffect,
    118: applyBindingEffect,
    //Tailwind: Doubles the speed of all Pokémon in the user's party for 4 turns.
    801: (attacker, opponent) => {
        setScore(attacker.entity, 'battle:double_speed_turns', 4);
        if (attacker instanceof PlayerBattler) {
            attacker.entity.sendMessage(`§dA tailwind blew from behind your team!`)
        }

        if (opponent instanceof PlayerBattler) {
            opponent.entity.sendMessage(`§dA tailwind blew from behind the opposing team!`)
        }
    },
    //Disable: Disables opponent's last move for 1-8 turns
    170: (attacker, opponent, battle) => {
        const lastMove = getScore(opponent.entity, 'lastu')
        if (!lastMove || lastMove <= 0)
            return battle.message(`Disable failed`)

        opponent.disabledMove = lastMove
        const random = randomNumber(1, 8)
        opponent.disabledMoveTurns = random

        battle.message(`§d${grammarText(opponent.pokemon.entity.typeId)}'s §a${getMoveByID(lastMove).name} §rwas disabled!`)
    },
    //Laser Focus: Guarantees that the pokemon's next move will be a critic
    408: (attacker) => {
        setScore(attacker.pokemon.entity, 'battle:laserfocus', 2)
    }
};
export class Move {
    status: {
        critical: boolean;
    }

    constructor(public data: Pokemon.Move) {
        this.status = {
            critical: false
        }
    }

    static create(data: Pokemon.Move) {
        return new Move(data)
    }

    static async execute(attacker: NpcBattler | WildBattler | PlayerBattler, target: NpcBattler | WildBattler | PlayerBattler, battle: Battle, data: Pokemon.Move, isFirstTurn = true, onExecute?: (damage?: number) => void,) {
        const move = new Move(data)
        switch (data.moveType) {
            case MoveDamageType.FORMULA:
                move.handleFormulaType(attacker, target, battle);
                break;
            case MoveDamageType.STATUS:
                move.handleStatusType(attacker, target, battle, isFirstTurn);
                break;

            case MoveDamageType.STATS:
                move.handleStatType(attacker, target, battle);
                break;
        }

        if (data?.after_effects && !target.pokemon?.dead)
            move.handleAfterEffects(attacker, target, battle, isFirstTurn)
    }

    private isSpecialCase(id: number) {
        return id in specialMoveHandlers
    }

    handleAfterEffects(attacker: NpcBattler | WildBattler | PlayerBattler, target: NpcBattler | WildBattler | PlayerBattler, battle: Battle, isFirstTurn = true) {
        const effects = this.data.after_effects;
        if (effects?.status_effect) {
            const status = effects.status_effect
            const effectsList = status.effects;
            const random = randomNumber(1, 100);
            if (random <= status.chance) {
                for (let effect of effectsList) {
                    const targetType = status.target;
                    const entityToAffect = (targetType === StatusMoveTarget.Opponent) ? target.pokemon : attacker.pokemon

                    if (effect === StatusEffects.Flinched && entityToAffect.id !== attacker.pokemon.id && !isFirstTurn) {
                        continue;
                    }

                    const before = beforeStatusEffect(entityToAffect, battle, effect)
                    if (before.status === 0) {
                        if (before?.message) {
                            battle.message(before.message)
                        }
                        continue;
                    }

                    entityToAffect.applyStatus(effect, battle)
                };
            }
        }

        if (effects?.stat_change) {
            const statChange = effects.stat_change
            const targetType = statChange.target
            const random = randomNumber(1, 100);
            if (random <= statChange.chance) { //@ts-ignore
                statChange.stats.forEach(stat => {
                    const statName = stat[0]

                    const pokemon = targetType === StatusMoveTarget.Opponent ? target.pokemon : attacker.pokemon

                    let currentStat = pokemon.getStat(statName as StatName)

                    const statStages = stat[1];
                    const pokemonName = grammarText(pokemon.entity.typeId);

                    let message = '';

                    if (statStages > 0) {
                        if (currentStat < 6) {
                            const statIncrease = Math.min(6 - currentStat, statStages);
                            //@ts-ignore
                            const newStage = currentStat += statIncrease;
                            pokemon.modifyStat(statName as StatName, newStage)

                            if (statIncrease === 1) {
                                message = `${pokemonName}'s ${statName} rose!`;
                            } else if (statIncrease === 2) {
                                message = `${pokemonName}'s ${statName} rose sharply!`;
                            } else if (statIncrease >= 3) {
                                message = `${pokemonName}'s ${statName} rose drastically!`;
                            }

                            battle.message(message)
                            pokemon.entity.dimension.spawnParticle(`pokeworld:stats_up`, pokemon.entity.location);
                        } else {
                            battle.message(`${pokemonName}'s ${statName} can't go any higher!`)
                        }
                    }

                    else if (statStages < 0) {
                        if (currentStat > -6) {
                            const statDecrease = Math.max(-6 - currentStat, statStages);
                            //@ts-ignore
                            const newStage = currentStat += statDecrease;
                            pokemon.modifyStat(statName as StatName, newStage)

                            if (statDecrease === -1) {
                                message = `${pokemonName}'s ${statName} fell!`;
                            } else if (statDecrease === -2) {
                                message = `${pokemonName}'s ${statName} was sharply lowered!`;
                            } else if (statDecrease <= -3) {
                                message = `${pokemonName}'s ${statName} severely fell!`;
                            }

                            battle.message(message)
                            pokemon.entity.dimension.spawnParticle(`pokeworld:stats_down`, pokemon.entity.location);
                        } else {
                            battle.message(`${pokemonName}'s ${statName} can't go any lower!`)
                        }
                    }
                });
            }
        }
    }

    async use(
        attacker: NpcBattler | WildBattler | PlayerBattler,
        target: NpcBattler | WildBattler | PlayerBattler,
        battle: Battle,
        isFirstTurn = true
    ) {
        const attackerPokemon = attacker.pokemon;
        const targetPokemon = target.pokemon;

        const move = this.data;
        const moveID = move.id;

        const attackerEntity = attackerPokemon.entity;
        const targetEntity = targetPokemon.entity;

        battle.processBeforeEffects(attacker)

        const skip = getScore(attacker.pokemon.entity, 'skipTurn') === 1

        if (skip) {
            setScore(attacker.pokemon.entity, 'skipTurn', 0)
            return;
        }

        safeAddTag(attackerPokemon.entity, 'attacker');
        safeAddTag(targetPokemon.entity, 'defender');

        // Camera animation
        for (const battler of [attacker, target]) {
            if (battler instanceof PlayerBattler) {
                camera(battler);
                system.runTimeout(() => battler.entity.camera.clear(), 40)
            }
        }

        setScore(attacker.entity, 'lastu', moveID);

        await system.waitTicks(40);

        const particle = ATTACK_PARTICLES[TypeList[move.type]];

        // Check accuracy
        if (!this.checkAccuracy(attackerPokemon, targetPokemon)) {
            battle.message(LANG['move.missed'](grammarText(attackerEntity.typeId)));
            this.cleanupTags(attackerEntity, targetEntity);
            return;
        }

        if (attackerEntity && attackerEntity.isValid)
            battle.message(LANG['move.used'](grammarText(attackerEntity.typeId), move.name));

        if (particle && targetEntity && targetEntity.isValid)
            targetEntity.dimension.spawnParticle(particle, targetEntity.location);

        // Special case handler
        if (this.isSpecialCase(moveID)) {
            const handler = specialMoveHandlers[moveID];
            handler?.(attacker, target, battle, move, isFirstTurn);
        } else {
            Move.execute(attacker, target, battle, move, isFirstTurn);
        }

        this.cleanupTags(attackerPokemon.entity, targetPokemon.entity);
    }


    private cleanupTags(attacker: Entity, target: Entity) {
        try {
            attacker.removeTag('attacker');
            target.removeTag('defender');
        } catch { }
    }

    private handleFormulaType(
        attacker: NpcBattler | WildBattler | PlayerBattler,
        target: NpcBattler | WildBattler | PlayerBattler,
        battle: Battle
    ) {
        const attackerPokemon = attacker.pokemon;
        const targetPokemon = target.pokemon;

        // Identify the player attacker (if player)
        let attackerPlayer: any = null;

        if (attacker instanceof PlayerBattler) {
            attackerPlayer = attacker.entity;
        }

        const sendToPlayer = (msg: string) => {
            if (attackerPlayer) attackerPlayer.sendMessage(msg);
        };

        // Bonus power for moves like Flail or Brine
        const bonus = (this.data.id === 226 || this.data.id === 875)
            ? (150 * getScore(attackerPokemon.entity, 'HP_Low') / getScore(attackerPokemon.entity, 'HP_Base'))
            : undefined;

        const type1 = getType1(targetPokemon.entity, this.data);
        const type2 = getType2(targetPokemon.entity, this.data);

        const result = calculateAttackDamage(
            attackerPokemon,
            targetPokemon,
            this.data,
            type1,
            type2,
            bonus
        );

        this.status.critical = result.critical;

        // Apply damage
        battle.attack(targetPokemon, result.damage, target);

        // -------- EFFECTIVENESS & CRIT MESSAGES --------
        const defenderName = grammarText(targetPokemon.entity.typeId);
        const effectiveness = type1 * type2;

        // Critical hit
        if (result.critical) {
            sendToPlayer(LANG["move.critical"]());
        }

        // Effectiveness
        if (effectiveness === 0) {
            sendToPlayer(LANG["move.doesnt_affect"](defenderName));
        }
        else if (effectiveness >= 2) {
            sendToPlayer(LANG["move.super_effective"]());
        }
        else if (effectiveness === 0.5 || effectiveness === 0.25) {
            sendToPlayer(LANG["move.not_effective"]());
        }
        // Neutral = no message

        // Drain moves (Giga Drain, Drain Punch)
        if (this.data?.drain) {
            attackerPokemon.heal(result.damage * this.data.drain);
        }
    }

    private handleStatType(attacker: NpcBattler | WildBattler | PlayerBattler, target: NpcBattler | WildBattler | PlayerBattler, battle: Battle) {
        if (!this.data?.effects?.stat_change) return;

        for (const stat of this.data.effects.stat_change.stats) {
            const targetType = this.data.target

            const statName = stat[0]

            const pokemon = targetType === StatusMoveTarget.Opponent ? target.pokemon : attacker.pokemon

            //@ts-ignore
            let currentStat = pokemon.getStat(statName)

            const statStages = stat[1];
            const pokemonName = grammarText(pokemon.entity.typeId);

            let message = '';

            if (statStages > 0) {
                if (currentStat < 6) {
                    const statIncrease = Math.min(6 - currentStat, statStages);
                    //@ts-ignore
                    const newStage = currentStat += statIncrease;
                    pokemon.modifyStat(statName as StatName, newStage)

                    if (statIncrease === 1) {
                        message = `${pokemonName}'s ${statName} rose!`;
                    } else if (statIncrease === 2) {
                        message = `${pokemonName}'s ${statName} rose sharply!`;
                    } else if (statIncrease >= 3) {
                        message = `${pokemonName}'s ${statName} rose drastically!`;
                    }

                    battle.message(message)
                    pokemon.entity.dimension.spawnParticle(`pokeworld:stats_up`, pokemon.entity.location);
                } else {
                    battle.message(`${pokemonName}'s ${statName} can't go any higher!`)
                }
            }

            else if (statStages < 0) {
                if (currentStat > -6) {
                    const statDecrease = Math.max(-6 - currentStat, statStages);
                    //@ts-ignore
                    const newStage = currentStat += statDecrease;
                    pokemon.modifyStat(statName as StatName, newStage)

                    if (statDecrease === -1) {
                        message = `${pokemonName}'s ${statName} fell!`;
                    } else if (statDecrease === -2) {
                        message = `${pokemonName}'s ${statName} was sharply lowered!`;
                    } else if (statDecrease <= -3) {
                        message = `${pokemonName}'s ${statName} severely fell!`;
                    }

                    battle.message(message)
                    pokemon.entity.dimension.spawnParticle(`pokeworld:stats_down`, pokemon.entity.location);
                } else {
                    battle.message(`${pokemonName}'s ${statName} can't go any lower!`)
                }
            }
        }
    }

    private handleStatusType(attacker: NpcBattler | WildBattler | PlayerBattler, target: NpcBattler | WildBattler | PlayerBattler, battle: Battle, isFirstTurn = true) {
        const effects = this.data?.effects?.status_effect?.effects;
        if (!effects?.length) return;

        const random = randomNumber(1, 100);

        if (random <= this.data.effects.status_effect.chance) {
            for (const effect of effects) {
                const targetType = this.data.effects.status_effect.target;

                const entityToAffect = (targetType === StatusMoveTarget.Opponent)
                    ? target.pokemon
                    : attacker.pokemon;

                const targetBattler = (targetType === StatusMoveTarget.Opponent)
                    ? target
                    : attacker;


                const ability = getScore(attacker.pokemon.entity, 'ability');
                const safeguardActive = getScore(targetBattler.entity, 'battle:safeguard') > 0;

                // Safeguard protection check (unless attacker has Infiltrator)
                if (safeguardActive && ability !== 110) {
                    battle.message(`§d${grammarText(entityToAffect.entity.typeId)}§r is protected by Safeguard!`);
                    return;
                }

                // Flinch exception check
                if (
                    effect === StatusEffects.Flinched &&
                    entityToAffect.id !== attacker.pokemon.id &&
                    !isFirstTurn
                ) {
                    continue;
                }

                entityToAffect.applyStatus(effect, battle);
            }
        }
    }

    private checkAccuracy(attackerPokemon: IPokemon, targetPokemon: IPokemon) {
        const random = randomNumber(1, 100);
        const ability = getScore(attackerPokemon.entity, 'ability');

        // Start with base move accuracy
        let baseAccuracy = this.data.accuracy;

        // Apply Compound Eyes (boost base accuracy by 30%)
        if (ability === 34) {
            baseAccuracy *= 1.3;
        }

        // Apply Hustle (reduce base accuracy by 20% for physical moves)
        if (ability === 100 && this.data.category === 'Physical') {
            baseAccuracy *= 0.8;
        }

        // Final accuracy with accuracy/evasion stages
        const accuracy = baseAccuracy * ((attackerPokemon.getAccuracy() ?? 1) / (targetPokemon.getEvasion() ?? 1));

        return random <= accuracy;
    }
}