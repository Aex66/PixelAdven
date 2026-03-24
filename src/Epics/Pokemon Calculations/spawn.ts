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
import { MOVE_KEYS, StatusEffectsValues } from "../../Letters/pokemon/moves.js";
import pokemoneNatures from "../../Letters/pokemon/natures.js";
import AbilityList from "../../Letters/pokemon/Abilities.js";
import { ballTags } from "./catch.js";
system.runInterval(() => {
    const overworld = world.getDimension('minecraft:overworld');
  
    for (const entity of overworld.getEntities({ tags: ['summoned'] })) {
      const tags = entity.getTags();
      const ownerTag = tags.find(t => t.startsWith('o:'));
      if (!ownerTag) continue;
  
      const playerName = ownerTag.slice(2);
      const player = world.getAllPlayers().find(p => p.name === playerName);
      if (!player) {
        entity.remove();
        continue;
      }
  
      const pokemonId = Number(tags.find(t => t.startsWith('s:'))?.slice(2));
      const instanceId = tags.find(t => t.startsWith('in:'))?.slice(3);
      if (!instanceId) {
        entity.remove();
        continue;
      }
  
      const playerDeployed = deployed[player.name];
      if (!playerDeployed || !Array.isArray(playerDeployed)) {
        entity.remove();
        continue;
      }
  
      // Find which slot this entity belongs to
      let slotIndex = -1;
      let foundEntry = null;
      for (let i = 0; i < playerDeployed.length; i++) {
        const entry = playerDeployed[i];
        if (entry && entry[2] === instanceId && entry[0] === pokemonId) {
          slotIndex = i;
          foundEntry = entry;
          break;
        }
      }
  
      if (slotIndex === -1 || !foundEntry) {
        entity.remove();
        continue;
      }
  
      // Verify the party data still matches
      const partySlot = selected[player.name]?.[slotIndex];
      if (!partySlot || partySlot[0] !== pokemonId) {
        entity.remove();
        continue;
      }
  
      const health = world.scoreboard.getObjective('HP_Low')?.getScore(entity) ?? 0;
      if (health > 0) {
        checkExperience(player, entity, slotIndex);
        continue;
      }
  
      // Pokémon fainted – despawn it
      // player.sendMessage(`§c${grammarText(partySlot[1])} has fainted!`);
      spawnPokemon(player, partySlot, slotIndex, true);
    }
  }, 20);

export function getScore(entity: Entity, objective: string): number | undefined {
    try {
        const obj = world.scoreboard.getObjective(objective);
        if (!obj) return undefined;
        const identity = entity.scoreboardIdentity;
        if (!identity) return undefined;
        return obj.getScore(identity);
    } catch {
        return undefined;
    }
}

/**
 * Spawn a pokemon
 * @param {Player} player The player to spawn the pokemon for
 * @param {[id: number, name: string, data: any]} member Pokemon data
 * @param {number} index Index in the data array
 * @param {boolean} force Force kill any pokemon the player has deployed 
 * @param {Battle} battleInstance Optional battle instance for defeated trigger
 * @returns 
 */
/** Read all battle-relevant stats from a wild Pokemon entity's scoreboard */
export function collectEntityStats(entity: Entity): any {
    const get = (id: string) => getScore(entity, id);

    const resolveMoveId = (id: number | undefined): string => {
        if (id == null || id <= 0) return '';
        return MOVE_KEYS[id] ?? '';
    };

    const natureIdx  = get('nature')  ?? 0;
    const abilityIdx = get('ability') ?? 0;
    const genderIdx  = get('Gender')  ?? 0;
    const GENDERS    = ['', 'M', 'F'] as const;

    return {
        level:                get('Lvl'),
        Experience:           get('Ex'),
        Base_Health:          get('HP_Base'),
        Current_Health:       get('HP_Low') ?? get('HP_Base'),
        Base_attack:          get('Atk_Base'),
        Base_defense:         get('Def_Base'),
        Base_speed:           get('Spd_Base'),
        Base_special_attack:  get('Sp_Atk_Base'),
        Base_special_defense: get('Sp_Def_Base'),
        IV_health:            get('IV_HP'),
        IV_attack:            get('IV_Atk'),
        IV_defense:           get('IV_Def'),
        IV_special_attack:    get('IV_Sp_Atk'),
        IV_special_defense:   get('IV_Sp_Def'),
        IV_speed:             get('IV_Spd'),
        EV_health:            get('EV_HP'),
        EV_attack:            get('EV_Atk'),
        EV_defense:           get('EV_Def'),
        EV_special_attack:    get('EV_Sp_Atk'),
        EV_special_defense:   get('EV_Sp_Def'),
        EV_speed:             get('EV_Spd'),
        DMax:                 get('DMax'),
        Terra:                get('terra'),
        Nature:               (pokemoneNatures.values[natureIdx]?.[2] as string) ?? 'Serious',
        Ability:              AbilityList[abilityIdx] ?? '',
        Variant:              get('Variant'),
        Gender:               GENDERS[genderIdx] ?? '',
        Traded:               get('Traded') === 1,
        Evolution_index:      get('Evolution_index'),
        heldItem:             get('heldItem'),
        friendShipLevel:      get('friendShipLevel'),
        pokeBall:             get('pokeBall'),
        condition:            get('condition'),
        Move1:                resolveMoveId(get('move1')),
        Move2:                resolveMoveId(get('move2')),
        Move3:                resolveMoveId(get('move3')),
        Move4:                resolveMoveId(get('move4')),
        Move1_PP:             get('move1pp'),
        Move2_PP:             get('move2pp'),
        Move3_PP:             get('move3pp'),
        Move4_PP:             get('move4pp'),
    };
}

const MAX_SLOTS = 6;

export async function spawnPokemon(
  summoner: Entity,
  member: [id: number, name: string, data: longHand],
  index?: number,
  despawn?: boolean,
  onSpawn?: (entity: Entity) => void
) {
  const isPlayer = summoner instanceof Player;
  const player = isPlayer ? (summoner as Player) : null;

  if (!despawn && (member[2]?.Current_Health ?? member[2].Base_Health) < 1) {
    if (player) player.sendMessage(`You cannot summon ${member[1]} because its health is 0!`);
    return false;
  }

  // --- Recall logic (players only, for a specific slot) -----------------
  if (player && index !== undefined) {
    // Ensure player's deployment array exists
    if (!deployed[player.name] || !Array.isArray(deployed[player.name])) {
      deployed[player.name] = new Array(MAX_SLOTS).fill(null);
    }

    const existingDeployment = deployed[player.name][index];
    if (existingDeployment) {
      const [existingId, existingSlot, instanceId] = existingDeployment;
      // Find the exact entity by its instance ID
      const entities = player.dimension.getEntities({ tags: [`in:${instanceId}`] });
      if (entities.length) {
        const entity = entities[0];
        // Retrieve all stats from scoreboard (as in original code)
        const level = world.scoreboard.getObjective('Lvl')?.getScore(entity) ?? 1;
        const Experience = world.scoreboard.getObjective('Ex')?.getScore(entity) ?? 0;
        const Base_Health = world.scoreboard.getObjective('HP_Base')?.getScore(entity) ?? 0;
        const Current_Health = world.scoreboard.getObjective('HP_Low')?.getScore(entity) ?? Base_Health;
        const Base_attack = world.scoreboard.getObjective('Atk_Base')?.getScore(entity) ?? 0;
        const Base_defense = world.scoreboard.getObjective('Def_Base')?.getScore(entity) ?? 0;
        const Base_speed = world.scoreboard.getObjective('Spd_Base')?.getScore(entity) ?? 0;
        const Base_special_attack = world.scoreboard.getObjective('Sp_Atk_Base')?.getScore(entity) ?? 0;
        const Base_special_defense = world.scoreboard.getObjective('Sp_Def_Base')?.getScore(entity) ?? 0;
        const IV_health = world.scoreboard.getObjective('IV_HP')?.getScore(entity) ?? 0;
        const IV_speed = world.scoreboard.getObjective('IV_Spd')?.getScore(entity) ?? 0;
        const IV_attack = world.scoreboard.getObjective('IV_Atk')?.getScore(entity) ?? 0;
        const IV_defense = world.scoreboard.getObjective('IV_Def')?.getScore(entity) ?? 0;
        const IV_special_attack = world.scoreboard.getObjective('IV_Sp_Atk')?.getScore(entity) ?? 0;
        const IV_special_defense = world.scoreboard.getObjective('IV_Sp_Def')?.getScore(entity) ?? 0;
        const EV_health = world.scoreboard.getObjective('EV_HP')?.getScore(entity) ?? 0;
        const EV_speed = world.scoreboard.getObjective('EV_Spd')?.getScore(entity) ?? 0;
        const EV_attack = world.scoreboard.getObjective('EV_Atk')?.getScore(entity) ?? 0;
        const EV_defense = world.scoreboard.getObjective('EV_Def')?.getScore(entity) ?? 0;
        const EV_special_attack = world.scoreboard.getObjective('EV_Sp_Atk')?.getScore(entity) ?? 0;
        const EV_special_defense = world.scoreboard.getObjective('EV_Sp_Def')?.getScore(entity) ?? 0;
        const DMax = world.scoreboard.getObjective('DMax')?.getScore(entity) ?? 0;
        const Nature = world.scoreboard.getObjective('nature')?.getScore(entity) ?? 0;
        const Terra = world.scoreboard.getObjective('terra')?.getScore(entity) ?? 0;
        const Gender = world.scoreboard.getObjective('Gender')?.getScore(entity) ?? 0;
        const Size = world.scoreboard.getObjective('Size')?.getScore(entity) ?? 0;
        const Move1 = world.scoreboard.getObjective('move1')?.getScore(entity) ?? 0;
        const Move1_PP = world.scoreboard.getObjective('move1pp')?.getScore(entity) ?? 0;
        const Move2 = world.scoreboard.getObjective('move2')?.getScore(entity) ?? 0;
        const Move2_PP = world.scoreboard.getObjective('move2pp')?.getScore(entity) ?? 0;
        const Move3 = world.scoreboard.getObjective('move3')?.getScore(entity) ?? 0;
        const Move3_PP = world.scoreboard.getObjective('move3pp')?.getScore(entity) ?? 0;
        const Move4 = world.scoreboard.getObjective('move4')?.getScore(entity) ?? 0;
        const Move4_PP = world.scoreboard.getObjective('move4pp')?.getScore(entity) ?? 0;
        const Traded = world.scoreboard.getObjective('Traded')?.getScore(entity) ?? 0;
        const Evolution_index = world.scoreboard.getObjective('Evolution_index')?.getScore(entity) ?? 0;
        const heldItem = world.scoreboard.getObjective('heldItem')?.getScore(entity) ?? 0;
        const pokeBallID = world.scoreboard.getObjective('pokeBall')?.getScore(entity) ?? 0;
        const friendShipLevel = world.scoreboard.getObjective('friendShipLevel')?.getScore(entity) ?? 0;
        const Variant = world.scoreboard.getObjective('Variant')?.getScore(entity) ?? 0;
        const condition = (world.scoreboard.getObjective('condition')?.getScore(entity) ?? 0) as (0 | StatusEffectsValues);

        const pokeBall = Object.keys(ballTags)[pokeBallID] as pokeballs;
        const slotNumber = existingSlot + 1; // 1‑based for objective names

        // Save stats to the correct slot
        player.runCommand(`scoreboard players set @s poke${slotNumber}HP ${Current_Health}`);
        player.runCommand(`scoreboard players set @s poke${slotNumber}Lvl ${level}`);
        player.runCommand(`scoreboard players set @s poke${slotNumber}HPmax ${Base_Health}`);
        player.runCommand(`scoreboard players set @s poke${slotNumber}Ball ${Object.keys(ballTags).indexOf(pokeBall)}`);

        // Retrieve existing party data for this slot (preserve PC location, ability, etc.)
        const existing = selected[player.name][existingSlot][2];
        writePokemon(player, entity.typeId, existingId, {
          level, Experience, Base_Health, Current_Health, Base_attack, Base_defense,
          Base_special_attack, Base_special_defense, Base_speed, condition,
          Move1, Move2, Move3, Move4, Move1_PP, Move2_PP, Move3_PP, Move4_PP, Size,
          IV_health, IV_speed, IV_attack, IV_defense, IV_special_attack, IV_special_defense,
          EV_health, EV_speed, EV_attack, EV_defense, EV_special_attack, EV_special_defense,
          Nature: ['', Nature], DMax, Variant, Nickname: '', Traded: Traded == 1, Evolution_index,
          heldItem, friendShipLevel, pokeBall, Terra: ['', Terra],
          Gender: ['', Gender],
          Ability: existing.Ability,
          Box: existing.Box,
          Slot: existing.Slot
        });

        // Update the in‑memory party data
        selected[player.name][existingSlot][2].level = level;
        selected[player.name][existingSlot][2].Experience = Experience;
        selected[player.name][existingSlot][2].Base_Health = Base_Health;
        selected[player.name][existingSlot][2].Current_Health = Current_Health;
        selected[player.name][existingSlot][2].Base_attack = Base_attack;
        selected[player.name][existingSlot][2].Base_defense = Base_defense;
        selected[player.name][existingSlot][2].Base_special_attack = Base_special_attack;
        selected[player.name][existingSlot][2].Base_special_defense = Base_special_defense;
        selected[player.name][existingSlot][2].Base_speed = Base_speed;
        selected[player.name][existingSlot][2].Move1_PP = Move1_PP;
        selected[player.name][existingSlot][2].Move2_PP = Move2_PP;
        selected[player.name][existingSlot][2].Move3_PP = Move3_PP;
        selected[player.name][existingSlot][2].Move4_PP = Move4_PP;
        selected[player.name][existingSlot][2].condition = condition;

        entity.remove();
      }

      // Clear the slot
      deployed[player.name][index] = null;

      // If the new Pokémon is the same species, stop here (no spawn)
      if (member[0] === existingId) {
        return;
      }
    }
  }

  if (despawn) return;

  const summonerName = player?.name ?? summoner.typeId;

  // Play Poké Ball animation (players only)
  if (player) {
    player.runCommand(`summon pokeworld:${member[2].pokeBall}_catch ^ ^1 ^2 facing ^ ^1 ^3 pokeworld:spawn_ball`);
  }

  system.runTimeout(() => {
    // ⛔ HARD GUARDS
    if (index === undefined) return;
    if (!onSpawn) return;

    const sub = world.afterEvents.entitySpawn.subscribe(({ entity }) => {
      if (entity.typeId !== `pokeworld:${member[1].toLowerCase()}`) return;

      world.afterEvents.entitySpawn.unsubscribe(sub);

      system.run(() => {
        // HARD VALIDATION
        if (!entity || !entity.isValid || !summoner || !member || index === undefined) {
          if (entity?.isValid) entity.remove();
          return;
        }

        try {
          // mark temporary spawn state
          entity.addTag("spawn_pending");

          // Apply all scoreboard stats (as in original code) ...
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

          entity.addTag(`s:${member[0]}`);
          entity.addTag(`o:${summonerName}`);
          entity.addTag(`in:${id}`);
          entity.addTag(`pokemon`);

          // Player‑specific: tame, deploy tracking, summoned tag, sidebar, message
          if (player) {
            entity.addTag(`summoned`);

            system.runTimeout(() => {
              if (!entity.isValid) return;
              const tame = entity.getComponent("minecraft:tameable");
              if (tame) tame.tame(player);
            }, 1);

            // Ensure deployment array exists
            if (!deployed[player.name] || !Array.isArray(deployed[player.name])) {
              deployed[player.name] = new Array(MAX_SLOTS).fill(null);
            }
            deployed[player.name][index] = [member[0], index, id];

            player.sendMessage(`${grammarText(entity.typeId)} has been summoned!`);
          }

          if (member[2].Nickname?.length) {
            entity.addTag(`NN:${member[2].Nickname}`);
          }

          // SUCCESS → finalize
          entity.removeTag("spawn_pending");
          onSpawn(entity);
        } catch (err) {
          console.warn("Pokemon spawn failed:", err);
          if (entity?.isValid) entity.remove();
        }
      });
    });

    summoner.runCommand(
      `summon pokeworld:${member[1].toLowerCase()} ^ ^1 ^2 facing ^ ^1 ^3 pokeworld:variant_${member[2].Variant}`
    );
  }, player ? 20 : 5);
}