import { Entity, Vector3 } from "@minecraft/server";
import { longHand } from "../../Pokemon Database/@types/types";
import { NpcBattler } from "./Battler";
import { Pokemon } from "./Pokemon";
import { setScore } from "../utils";
import { ballTags } from "../../Pokemon Calculations/catch";

// Stored on the TEAM ENTITY (pokeworld:valor_team, etc)
const DEFENDERS_KEY = "pokeworld:gym_defenders";

type GymPokemonSlot = {
  ownerId: string;
  ownerName: string;
  species: string;
  rID: number;
  data: longHand;
};

type GymDefenders = {
  slots: {
    0?: GymPokemonSlot;
    1?: GymPokemonSlot;
    2?: GymPokemonSlot;
    3?: GymPokemonSlot;
    4?: GymPokemonSlot;
    5?: GymPokemonSlot;
  };
};



// ======================================================
// GYM NPC BATTLER — USES EXISTING TRAINER BATTLE PIPELINE
// ======================================================

export class GymNpcBattler extends NpcBattler {
  private defenders: GymPokemonSlot[] = [];

  constructor(teamEntity: Entity) {
    super(teamEntity);

    this.friendlyName = teamEntity.typeId
      .replace("pokeworld:", "")
      .replace("_team", "")
      .toUpperCase();

    this.loadDefenders(teamEntity);

    // REQUIRED so Battle.onDefeatTrainer() does not NaN
    this.highestLevelPokemon =
      this.defenders.length > 0
        ? Math.max(...this.defenders.map(d => d.data.level))
        : 1;
  }

  // ======================================================
  // HANDLE GYM POKÉMON DEFEAT (CRITICAL FIX)
  // ======================================================
  onPokemonDefeated() {
    // Remove current Pokémon entity
    if (this.pokemon?.entity?.isValid) {
      this.pokemon.entity.remove();
    }

    this.pokemon = undefined as any;

    // Deploy next defender if available
    if (this.defenders.length > 0) {
      const next = this.defenders.shift()!;
      this.deployGymPokemon(next);
      return;
    }

    // No defenders left → gym loses
    this.isDefeated = true;
  }

  // ======================================================
  // LOAD DEFENDERS (INSTEAD OF createTeam)
  // ======================================================

  private loadDefenders(teamEntity: Entity) {
    const raw = teamEntity.getDynamicProperty(DEFENDERS_KEY);
    if (!raw || typeof raw !== "string") {
      this.defenders = [];
      return;
    }

    try {
      const parsed = JSON.parse(raw) as GymDefenders;

      // slot order 0 -> 1 -> 2 (stable)
      this.defenders = Object.entries(parsed.slots)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([, slot]) => slot!)
        .filter(Boolean);
    } catch {
      this.defenders = [];
    }
  }
  // ======================================================
  // 🚫 OVERRIDE — BLOCK TRAINER TEAM GENERATION
  // ======================================================
  createTeam(): void {
    // Gym battles do NOT use WildTrainerData
    // Pokémon come exclusively from gym_defenders
    return;
  }

  // ======================================================
  // OVERRIDE — MUST RETURN STRING (matches base)
  // ======================================================

  deployRandom(): string {
    if (this.defenders.length === 0) {
      this.isDefeated = true;
      return "";
    }

    const next = this.defenders.shift()!;
    return this.deployGymPokemon(next);
  }

  // ======================================================
  // SPAWN + APPLY DATA (MATCHES NpcBattler.deployRandom)
  // ======================================================

  private deployGymPokemon(slot: GymPokemonSlot): string {
    if (this.pokemon) {
      this.pokemon.entity.remove();
      // @ts-ignore
      this.pokemon = undefined;
    }

    const name = slot.species;
    const data = slot.data;

    const entity = this.spawnPokemonLikeTrainer(this.entity, name);

    // IMPORTANT: keep EXACT objective names & quoting like your existing trainer battles
    entity.runCommand(`scoreboard players set @s "Lvl" ${data.level}`);
    entity.runCommand(`scoreboard players set @s "Ex" ${data.Experience ?? 0}`);
    entity.runCommand(`scoreboard players set @s "HP_Base" ${data.Base_Health}`);
    entity.runCommand(
      `scoreboard players set @s "HP_Low" ${data?.Current_Health ?? data.Base_Health}`
    );
    entity.runCommand(`scoreboard players set @s "Atk_Base" ${data.Base_attack}`);
    entity.runCommand(`scoreboard players set @s "Def_Base" ${data.Base_defense}`);
    entity.runCommand(`scoreboard players set @s "Spd_Base" ${data.Base_speed}`);
    entity.runCommand(
      `scoreboard players set @s "Sp_Atk_Base" ${data.Base_special_attack}`
    );
    entity.runCommand(
      `scoreboard players set @s "Sp_Def_Base" ${data.Base_special_defense}`
    );

    entity.runCommand(`scoreboard players set @s "IV_HP" ${data.IV_health}`);
    entity.runCommand(`scoreboard players set @s "IV_Spd" ${data.IV_speed}`);
    entity.runCommand(`scoreboard players set @s "IV_Atk" ${data.IV_attack}`);
    entity.runCommand(`scoreboard players set @s "IV_Def" ${data.IV_defense}`);
    entity.runCommand(`scoreboard players set @s "IV_Sp_Atk" ${data.IV_special_attack}`);
    entity.runCommand(`scoreboard players set @s "IV_Sp_Def" ${data.IV_special_defense}`);

    entity.runCommand(`scoreboard players set @s "EV_HP" ${data.EV_health}`);
    entity.runCommand(`scoreboard players set @s "EV_Spd" ${data.EV_speed}`);
    entity.runCommand(`scoreboard players set @s "EV_Atk" ${data.EV_attack}`);
    entity.runCommand(`scoreboard players set @s "EV_Def" ${data?.EV_defense ?? 0}`);
    entity.runCommand(`scoreboard players set @s "EV_Sp_Atk" ${data.EV_special_attack}`);
    entity.runCommand(`scoreboard players set @s "EV_Sp_Def" ${data.EV_special_defense}`);

    entity.runCommand(`scoreboard players set @s "DMax" ${data.DMax}`);
    entity.runCommand(`scoreboard players set @s "nature" ${data.Nature?.[1] ?? 0}`);
    entity.runCommand(`scoreboard players set @s "terra" ${data.Terra?.[1] ?? 0}`);
    entity.runCommand(`scoreboard players set @s "ability" ${data.Ability?.[1] ?? 0}`);
    entity.runCommand(`scoreboard players set @s "Gender" ${data.Gender?.[1] ?? 0}`);

    // temp stats (your engine expects these)
    entity.runCommand(`scoreboard players set @s "Atk_Temp" ${data.Base_attack}`);
    entity.runCommand(`scoreboard players set @s "Def_Temp" ${data.Base_defense}`);
    entity.runCommand(`scoreboard players set @s "Spd_Temp" ${data.Base_speed}`);
    entity.runCommand(`scoreboard players set @s "Sp_Atk_Temp" ${data.Base_special_attack}`);
    entity.runCommand(`scoreboard players set @s "Sp_Def_Temp" ${data.Base_special_defense}`);

    entity.runCommand(`scoreboard players set @s "Variant" ${data.Variant ?? 0}`);
    entity.runCommand(`scoreboard players set @s "Traded" ${data.Traded ? 1 : 0}`);
    entity.runCommand(`scoreboard players set @s "Evolution_index" ${data.Evolution_index ?? 0}`);
    entity.runCommand(`scoreboard players set @s "friendShipLevel" ${data.friendShipLevel ?? 0}`);
    entity.runCommand(
      `scoreboard players set @s "pokeBall" ${Object.keys(ballTags).indexOf(data.pokeBall)}`
    );
    entity.runCommand(`scoreboard players set @s condition ${data?.condition ?? 0}`);

    entity.runCommand(`scoreboard players set @s "move1" ${data.Move1 ?? -1}`);
    entity.runCommand(`scoreboard players set @s "move2" ${data.Move2 ?? -1}`);
    entity.runCommand(`scoreboard players set @s "move3" ${data.Move3 ?? -1}`);
    entity.runCommand(`scoreboard players set @s "move4" ${data.Move4 ?? -1}`);

    // MUST match normal flow
    entity.runCommand(`scriptevent pokeworld:type_change`);

    entity.addEffect("slowness", 999999, { amplifier: 255, showParticles: false });
    entity.addTag("battle");

    // 🔥 THIS IS THE KEY LINK YOUR ENGINE NEEDS
    setScore(entity, "bid", this.battle.id);

    this.pokemon = new Pokemon(entity, this);
    this.battle.message(`§e${this.friendlyName} chooses ${name}!`);

    return name;
  }

  // ======================================================
  // SPAWN POSITION: COPY YOUR TRAINER SPAWN STYLE
  // ======================================================

  private spawnPokemonLikeTrainer(trainer: Entity, name: string): Entity {
    const dimension = trainer.dimension;
    const trainerLoc = trainer.location;
    const viewDir = trainer.getViewDirection();

    const up = { x: 0, y: 1, z: 0 };
    const rightDir = this.crossProduct(viewDir, up);

    const spawnOffset = this.addVectors(
      this.addVectors(this.scaleVector(viewDir, 0), this.scaleVector(up, 1)),
      this.scaleVector(rightDir, 2)
    );
    const spawnPos = this.addVectors(trainerLoc, spawnOffset);

    const facingOffset = this.addVectors(
      this.addVectors(this.scaleVector(viewDir, 0), this.scaleVector(up, 1)),
      this.scaleVector(rightDir, 3)
    );
    const facingPos = this.addVectors(trainerLoc, facingOffset);

    // @ts-ignore — custom entity identifiers
    const entity = dimension.spawnEntity(
      `pokeworld:${name.toLowerCase()}` as any,
      trainerLoc as any
    );

    entity.teleport(
      { x: spawnPos.x, y: spawnPos.y, z: spawnPos.z },
      { facingLocation: facingPos }
    );

    return entity;
  }

  private addVectors(a: Vector3, b: Vector3): Vector3 {
    return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
  }

  private scaleVector(v: Vector3, scale: number): Vector3 {
    return { x: v.x * scale, y: v.y * scale, z: v.z * scale };
  }

  private crossProduct(a: Vector3, b: Vector3): Vector3 {
    return {
      x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z,
      z: a.x * b.y - a.y * b.x,
    };
  }
}

