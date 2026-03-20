import { Battle } from "./Battle"
import { StatusEffects, StatusEffectsValues } from "../../../Letters/pokemon/moves"
import { grammarText } from "../../../Papers/Paragraphs/ExtrasParagraphs"
import { getScore } from "../utils"
import { Pokemon } from "./Pokemon"

export function beforeStatusEffect(pokemon: Pokemon, battle: Battle, effect: StatusEffectsValues) {
    const battler = battle.player.pokemon === pokemon ? battle.player : battle.opponent;
    const opponent = battler === battle.player ? battle.opponent : battle.player;

    const defenderAbility = getScore(pokemon.entity, 'ability');
    const attackerAbility = getScore(opponent.entity, 'ability');

    const defenderType1 = getScore(pokemon.entity, 'type1');
    const defenderType2 = getScore(pokemon.entity, 'type2');

    const moldBreakerActive = attackerAbility === 144;

    // Type-based immunities
    if (effect === StatusEffects.Paralyzed && (defenderType1 === 9 || defenderType2 === 9)) {
        return {
            status: 0,
            message: `§d${grammarText(pokemon.entity.typeId)}§r is an Electric-type and cannot be Paralyzed!`
        };
    }

    if (effect === StatusEffects.Poisoned && (defenderType1 === 8 || defenderType2 === 8 || defenderType1 === 17 || defenderType2 === 17)) {
        return {
            status: 0,
            message: `§d${grammarText(pokemon.entity.typeId)}§r is Poison or Steel-type and cannot be Poisoned!`
        };
    }

    if (effect === StatusEffects.Frozen && (defenderType1 === 6 || defenderType2 === 6)) {
        return {
            status: 0,
            message: `§d${grammarText(pokemon.entity.typeId)}§r is a Fire-type and cannot be Frozen!`
        };
    }

    if (effect === StatusEffects.Flinched && defenderAbility === 112) {
        if (moldBreakerActive) {
            return {
                status: 1,
                message: `§d${grammarText(pokemon.entity.typeId)}'s§r Inner Focus was ignored by the opponent's ability!`
            };
        }
        return {
            status: 0,
            message: `§d${grammarText(pokemon.entity.typeId)}'s§r Inner Focus Ability prevented the Flinch!`
        };
    }

    if (effect === StatusEffects.Confused && defenderAbility === 162) {
        if (moldBreakerActive) {
            return {
                status: 1,
                message: `§d${grammarText(pokemon.entity.typeId)}'s§r Own Tempo was ignored by the opponent's ability!`
            };
        }
        return {
            status: 0,
            message: `§d${grammarText(pokemon.entity.typeId)}'s§r Own Tempo Ability Prevented Confusion!`
        };
    }

    if (effect === StatusEffects.Sleep && (defenderAbility === 113 || defenderAbility === 290)) {
        const abilityName = defenderAbility === 113 ? "Insomnia" : "Vital Spirit";
        if (moldBreakerActive) {
            return {
                status: 1,
                message: `§d${grammarText(pokemon.entity.typeId)}'s§r ${abilityName} was ignored by the opponent's ability!`
            };
        }
        return {
            status: 0,
            message: `§d${grammarText(pokemon.entity.typeId)}'s§r ${abilityName} Ability Prevented Sleeping!`
        };
    }

    if (effect === StatusEffects.Burned && defenderAbility === 296) {
        if (moldBreakerActive) {
            return {
                status: 1,
                message: `§d${grammarText(pokemon.entity.typeId)}'s§r Water Veil was ignored by the opponent's ability!`
            };
        }
        return {
            status: 0,
            message: `§d${grammarText(pokemon.entity.typeId)}'s§r Water Veil Ability Prevented The Burn!`
        };
    }

    if (effect === StatusEffects.Poisoned && defenderAbility === 113) {
        if (moldBreakerActive) {
            return {
                status: 1,
                message: `§d${grammarText(pokemon.entity.typeId)}'s§r Immunity was ignored by the opponent's ability!`
            };
        }
        return {
            status: 0,
            message: `§d${grammarText(pokemon.entity.typeId)}'s§r Immunity Ability Prevented Poisoning!`
        };
    }

    if (effect === StatusEffects.Frozen && defenderAbility === 134) {
        if (moldBreakerActive) {
            return {
                status: 1,
                message: `§d${grammarText(pokemon.entity.typeId)}'s§r Magma Armor was ignored by the opponent's ability!`
            };
        }
        return {
            status: 0,
            message: `§d${grammarText(pokemon.entity.typeId)}'s§r Magma Armor Ability Prevented Freeze!`
        };
    }

    // 🎯 Shed Skin (30% chance to cure major status after it’s applied)
    const shedSkinStatuses: StatusEffectsValues[] = [
        StatusEffects.Paralyzed,
        StatusEffects.Burned,
        StatusEffects.Poisoned,
        StatusEffects.Sleep,
        StatusEffects.Frozen,
        StatusEffects.BadlyPoisoned
    ];

    if (shedSkinStatuses.includes(effect) && defenderAbility === 219) {
        const roll = Math.random();
        if (roll <= 0.3) {
            return {
                status: 0,
                message: `§d${grammarText(pokemon.entity.typeId)}'s§r Shed Skin Ability Cured the Status!`
            };
        }
    }

    return {
        status: 1
    };
}
