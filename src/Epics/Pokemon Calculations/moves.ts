import { Entity, system } from "@minecraft/server";
import { Pokemon } from "../../Letters/pokemon/@types/types.js";
import { pokemonText } from "../../Papers/Paragraphs/ExtrasParagraphs.js";
import pokemonMoves from "../../Letters/pokemon/moves.js";
import wildPokemon from "../../Letters/pokemon/wild.js";

const keys = Object.keys(pokemonMoves);

export function getMoves(
  pokemonData: [move1: number, move2: number, move3: number, move4: number]
): [name: string, index: number, moves: Pokemon.Move][] {
  const moves: [name: string, index: number, moves: Pokemon.Move][] = [];

  if (pokemonData[0] !== -1)
    moves.push([keys[pokemonData[0]], pokemonData[0], JSON.parse(JSON.stringify(pokemonMoves[keys[pokemonData[0]]]))]);
  if (pokemonData[1] !== -1)
    moves.push([keys[pokemonData[1]], pokemonData[1], JSON.parse(JSON.stringify(pokemonMoves[keys[pokemonData[1]]]))]);
  if (pokemonData[2] !== -1)
    moves.push([keys[pokemonData[2]], pokemonData[2], JSON.parse(JSON.stringify(pokemonMoves[keys[pokemonData[2]]]))]);
  if (pokemonData[3] !== -1)
    moves.push([keys[pokemonData[3]], pokemonData[3], JSON.parse(JSON.stringify(pokemonMoves[keys[pokemonData[3]]]))]);

  return moves;
}

export function getHighestMoves(
  name: string,
  level: number,
  variant: number,
  entity?: Entity
): [name: string, index: number, moves: Pokemon.Move][] {
  const tempMoves = wildPokemon[pokemonText(name)]?.Moves;
  if (!tempMoves) return [];

  const tempKeys = Object.keys(tempMoves);
  if (!tempKeys.length) return [];

  const variantKey =
    tempKeys.find(key => key.includes(variant.toString())) ?? tempKeys[0];

  const levelMoves = [tempMoves[variantKey]].flat();
  if (!levelMoves.length) return [];

  const availableMoves: [string, number][] = levelMoves.filter(
    ([moveName, moveLevel]) => pokemonMoves[moveName] && moveLevel <= level
  );
  if (!availableMoves.length) return [];

  availableMoves.sort((a, b) => b[1] - a[1]);

  let damagingMoves = availableMoves.filter(
    ([name]) => pokemonMoves[name]?.moveType === 0
  );
  let otherMoves = availableMoves.filter(
    ([name]) => pokemonMoves[name]?.moveType !== 0
  );

  if (damagingMoves.length === 0) {
    damagingMoves = availableMoves;
    otherMoves = [];
  }

  const selected = new Set<string>();
  const moves: [string, number, Pokemon.Move][] = [];
  const limit = Math.min(4, availableMoves.length);

  const tryAdd = (pool: [string, number][]) => {
    for (const [name] of pool) {
      if (selected.size >= limit) break;
      if (selected.has(name)) continue;
      selected.add(name);
      const moveData = JSON.parse(JSON.stringify(pokemonMoves[name]));
      moves.push([name, moveData.id, moveData]);
    }
  };

  tryAdd(damagingMoves);
  tryAdd(otherMoves);
  tryAdd(damagingMoves);

  const finalMoves = moves.slice(0, limit);

  if (entity) {
    system.run(() => {
      finalMoves.forEach((move, i) => {
        entity.runCommand(`scoreboard players set @s move${i + 1} ${move[1]}`);
        if (move[2]) {
          entity.runCommand(`scoreboard players set @s move${i + 1}pp ${move[2].pp ?? 1}`);
        } else {
          entity.runCommand(`scoreboard players reset @s move${i + 1}pp`);
        }
      });
    });
  }

  return finalMoves;
}

export function getAllAvailableMoves(
  name: string,
  level: number,
  variant: number
): [string, number, Pokemon.Move][] {
  const wildKey = `pokeworld:wild_${name.toLowerCase()}`;
  const tempMoves = wildPokemon[wildKey]?.Moves;
  if (!tempMoves) return [];

  let variantKey: string | undefined;
  for (const key of Object.keys(tempMoves)) {
    const parts = key.split("-").map(Number);
    if (parts.length === 1 && parts[0] === variant) {
      variantKey = key;
      break;
    }
    if (parts.length === 2) {
      const [min, max] = parts;
      if (variant >= min && variant <= max) {
        variantKey = key;
        break;
      }
    }
  }

  if (!variantKey) {
    variantKey = Object.keys(tempMoves)[0];
  }

  const levelMoves = tempMoves[variantKey] ?? [];
  if (!Array.isArray(levelMoves) || !levelMoves.length) return [];

  const moveKeys = Object.keys(pokemonMoves);
  return levelMoves
    .filter(m => Array.isArray(m) && m[1] <= level)
    .map(m => {
      const moveName = m[0];
      const moveIndex = moveKeys.indexOf(moveName);
      const moveData = pokemonMoves[moveName];
      return [moveName, moveIndex, JSON.parse(JSON.stringify(moveData ?? {}))];
    });
}

export function getRandomMoves(
  pokeId: string,
  pokeLevel: number,
  variant: number,
  entity?: Entity
): [name: string, index: number, moves: Pokemon.Move][] {
  const moves: [string, number, Pokemon.Move][] = [];

  const tempMoves = wildPokemon[pokemonText(pokeId)]?.Moves;
  if (!tempMoves) return [];

  const tempKeys = Object.keys(tempMoves);
  if (!tempKeys.length) return [];

  const variantKey =
    tempKeys.find(key => key.includes(variant.toString())) ?? tempKeys[0];

  const levelMoves = [tempMoves[variantKey]].flat();
  if (!levelMoves.length) return [];

  const availableMoves: [string, number][] = levelMoves.filter(
    ([name, level]) => pokemonMoves[name] && pokeLevel >= level
  );
  if (!availableMoves.length) return [];

  availableMoves.sort((a, b) => b[1] - a[1]);

  let damagingMoves = availableMoves.filter(
    ([name]) => pokemonMoves[name]?.moveType === 0
  );
  let otherMoves = availableMoves.filter(
    ([name]) => pokemonMoves[name]?.moveType !== 0
  );

  if (damagingMoves.length === 0) {
    damagingMoves = availableMoves;
    otherMoves = [];
  }

  const selected = new Set<string>();
  const limit = Math.min(4, availableMoves.length);

  const tryAdd = (pool: [string, number][]) => {
    for (const [name] of pool) {
      if (selected.size >= limit) break;
      if (selected.has(name)) continue;
      selected.add(name);
      const moveData = JSON.parse(JSON.stringify(pokemonMoves[name]));
      moves.push([name, moveData.id, moveData]);
    }
  };

  tryAdd(damagingMoves);
  tryAdd(otherMoves);
  tryAdd(damagingMoves);

  const finalMoves = moves.slice(0, limit);

  if (entity) {
    system.run(() => {
      finalMoves.forEach((move, i) => {
        entity.runCommand(`scoreboard players set @s move${i + 1} ${move[1]}`);
        if (move[2]) {
          entity.runCommand(`scoreboard players set @s move${i + 1}pp ${move[2].pp ?? 1}`);
        } else {
          entity.runCommand(`scoreboard players reset @s move${i + 1}pp`);
        }
      });
    });
  }

  return finalMoves;
}
