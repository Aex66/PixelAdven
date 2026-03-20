
import { spawnPokemon } from "../../../Pokemon Calculations/spawn.js";
import { deployed } from "../../../Pokemon Calculations/main.js";
import { ActionForm } from "../../../../Papers/FormPaper.js";
import { selected } from "../../../Main/Forms/PC/main.js";
import { bagForm } from "./bag.js";
import pokemonList from "../../../../Letters/pokemon/list.js";
import { UI_VARIANTS } from "../../../../constants.js";
import { getMoves } from "../../../Pokemon Calculations/moves.js";
import { getScore, setScore } from "../../../Pokemon Battles/utils.js";
import Trainer from "../../../../Papers/TrainerPaper.js";
import { PlayerBattler } from "../../classes/Battler.js";
import { Pokemon } from "../../classes/Pokemon.js";
import { grammarText } from "../../../../Papers/Paragraphs/ExtrasParagraphs.js";
import { markUsedSlot } from "../../classes/Battle.js";

export function pokedex(battler: PlayerBattler) {
    const battle = battler.battle;
    if (battler.canSelectAction === false) return battler.entity.sendMessage(`§cYou can't currently use the pokedex`);

    const player = battler.entity;

    const form = new ActionForm();
    form.setTitle('§3§3§rMenu');
    form.addButton('Pokemon');
    form.addButton('Moves');
    form.addButton('Bag');
    form.addButton('Run');
    form.send(player, async res => {
        if (battler.entity.hasTag('next') && res.selection !== 0) return battler.entity.sendMessage(`§eDeploy a pokemon to ${battle.turn === 0 ? 'start' : 'continue'} the battle!`);

        switch (res.selection) {
            case 0: spawnPokemonForm(battler); break;
            case 1: moveForm(battler); break;
            case 2: bagForm(battler); break;
            case 3: {
                battler.setAction({ type: 'run', data: null });
            }
        }
    });
}

export function spawnPokemonForm(battler: PlayerBattler) {
  const player = battler.entity;
  const keys = Object.keys(selected[player.name]);
  if (!keys.length) return player.sendMessage('§cYou don\'t have any Pokemon in your team!');

  const form = new ActionForm();
  const buttonMap = {} as Record<string, number>;
  form.setTitle('Your team');

  keys.forEach((index: any, i) => {
    buttonMap[i] = index;
    const pokemon = selected[player.name][index];
    form.addButton(
      `Lvl.${pokemon[2].level} ${pokemon[1]}\n§a(Slot ${Number(index) + 1})${deployed[player.name]?.[0] === pokemon[0] ? ` §9(Deployed)` : ''}${pokemon[2].Current_Health > 0 ? '' : ' §c(Fainted)'}`,
      `${UI_VARIANTS[getScore(player, `poke${Number(index) > 0 ? Number(i) + 1 : ''}Var`)]}/${pokemonList[getScore(player, `poke${Number(index) > 0 ? Number(i) + 1 : ''}Id`)]}`
    );
  });

  form.send(player, async res => {
    if (res.canceled) return pokedex(battler);

    const teamIndex = buttonMap[res.selection as number];
    const member = selected[player.name][teamIndex];

    // ⛔ Block if trying to re-select currently deployed Pokémon (only for voluntary switches)
    if (deployed[player.name] && deployed[player.name][0] === member[0] && !player.hasTag('next')) {
      return player.sendMessage(`§cYou can't do this during a battle!`);
    }

    const currentIndex = deployed[player.name]?.[1];
    const currentMon = currentIndex !== undefined ? selected[player.name][currentIndex] : undefined;
    const currentHP = currentMon?.[2]?.Current_Health ?? 0;
    const isForcedSwitch = player.hasTag('next') || !battler.pokemon || currentHP <= 0;

    if (isForcedSwitch) {
      spawnPokemon(player, member, teamIndex, false, (entity) => {
        battler.pokemon = new Pokemon(entity, battler);
        setScore(entity, 'bid', battler.battle.id);
        entity.addTag('battle');
        // mark as used
        markUsedSlot(battler, Number(teamIndex));
        if (player.hasTag('next')) player.removeTag('next');
      });
      return;
    }

    // Voluntary switch — Arena Trap check
    const opponent = battler.opponent;
    if (battler.pokemon && opponent?.pokemon) {
      const opponentAbility = getScore(opponent.pokemon.entity, 'ability');
      if (opponentAbility === 9) {
        return player.sendMessage(`§cYou can't switch out! ${grammarText(battler.opponent.pokemon.entity.typeId)}'s Arena Trap prevents escaping!`);
      }
    }

    // Normal voluntary switch
    spawnPokemon(battler.entity, member, teamIndex, false, (entity) => {
      battler.pokemon = new Pokemon(entity, battler);
      setScore(entity, 'bid', battler.battle.id);
      entity.addTag('battle');
      battler.setAction({ type: 'switch', data: null });
      // mark as used
      markUsedSlot(battler, Number(teamIndex));
    });
  });
}

export function moveForm(battler: PlayerBattler) {
    const player = battler.entity;
    if (!player.hasTag('battle')) return player.sendMessage(`§cYou are not in a battle`);

    const out = selected[player.name]?.[deployed[player.name]?.[1]];
    if (!out?.length) return player.sendMessage('§cYou don\'t have any Pokémon deployed.');

    const pokemon = Trainer.getActivePokemon(player);
    const moves = getMoves([out[2].Move1, out[2].Move2, out[2].Move3, out[2].Move4]);

    const form = new ActionForm();
    form.setTitle('§2§2§rMoves');

    moves.forEach((move, i) => {
        const scoreProp = `move${i + 1}pp`;
        const pp = Math.max(getScore(pokemon, scoreProp), 0);
        const maxPP = move[2]?.pp ?? 0;
        const label = move[2]
            ? `${move[0].padEnd(20, '#')}${pp}/${maxPP}`
            : `— (No Move)`;
        form.addButton(label, move[2]?.image ?? "");
    });

    form.send(player, res => {
        if (res.canceled) return pokedex(battler);

        const move = moves[res.selection];
        const moveProp = `move${res.selection + 1}pp`;
        const pp = getScore(pokemon, moveProp);

        if (pp <= 0) {
            player.sendMessage('§cNo PP§r');
            return moveForm(battler);
        }

        const pressureActive = getScore(battler.opponent.pokemon.entity, 'ability') === 178;
        const ppCost = pressureActive ? 2 : 1;
        const newPP = Math.max(0, pp - ppCost);

        if (newPP >= 0) {
            setScore(pokemon, moveProp, newPP);
        } else {
            console.warn(`[PP ERROR] Tried to write negative PP (${newPP}) for ${move[0]}`);
        }

        // ✅ FIXED — Move priority now included!
        battler.setAction({
            type: "move",
            data: {
                move: move[2],
                priority:
                    typeof move[2]?.priority === "number"
                        ? move[2].priority
                        : (move[2]?.priority ? 1 : 0),
            }
        });

    }); // ← closes form.send callback properly

}