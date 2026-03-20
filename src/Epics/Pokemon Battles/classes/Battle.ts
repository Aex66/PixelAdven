import { Player, system, world } from "@minecraft/server";
import { PlayerBattler, NpcBattler, WildBattler } from "./Battler";
import { distance, getScore, randomNumber, setScore } from "../utils";
import { StatusEffects, } from "../../../Letters/pokemon/moves";
import { grammarText, pokemonText, } from "../../../Papers/Paragraphs/ExtrasParagraphs";
import wildPokemon from "../../../Letters/pokemon/wild";
import { Pokemon as IPokemon } from "./Pokemon";
import { LANG } from "../lang";
import { Move } from "./Move";
import { LeechSeed } from "./TrapEffects/LeechSeed";
import { MultiBindingEffect } from "./TrapEffects/MultiBindingEffect";
import { Nightmare } from "./TrapEffects/Nightmare";
import { SappySeed } from "./TrapEffects/SappySeeds";
import { StealthRock } from "./TrapEffects/StealthRocks";
import { TrapEffect } from "./TrapEffect";
import { spawnPokemon } from "../../Pokemon Calculations/spawn";
import { selected } from "../../Main/Forms/PC/main";
import { _catch, safeRemove } from "../../Pokemon Calculations/catch";
import { writePokemon } from "../../Pokemon Database/main";
import { deployed } from "../../Pokemon Calculations/main";
import { WildTrainerData } from "../../../Letters/pokemon/TrainerClasses";
import { metricNumbers } from "../../../Papers/Paragraphs/ConvertersParagraphs";
import { checkExperienceForTeam } from "../../Pokemon Calculations/levelingTeam";
import { applyHealingItem } from "../forms/pokedex/itemEffects";
import { runArticunoDropLogic } from "../../Main Quests/Legendary Quests/articunoQuest";
import { runMoltresDropLogic } from "../../Main Quests/Legendary Quests/moltresQuest";
import { runZapdosDropLogic } from "../../Main Quests/Legendary Quests/zapdosQuest";
import { runMewtwoDropLogic } from "../../Main Quests/Legendary Quests/mewtwoQuest";
import { runRaikouDropLogic } from "../../Main Quests/Legendary Quests/raikouQuest";
import { runEnteiDropLogic } from "../../Main Quests/Legendary Quests/entaiQuest";
import { runSuicuneDropLogic } from "../../Main Quests/Legendary Quests/suicuneQuests";
import { activeOutbreaks, endOutbreak, spawnOutbreakEntity } from "../../Outbreaks/outbreakManager";
import { GymNpcBattler } from "./TeamGymBattler";
import { notifyNearbyGym } from "../../TeamGyms/gymClaim";
import { ActionFormData } from "@minecraft/server-ui";
export const battles: Map<string, Battle> = new Map();

function showXpResults(player: Player, lines: string[]) {
  if (!lines.length) return;

  const form = new ActionFormData()
    .title("§l§aBattle Results")
    .body(lines.join("\n"))
    .button("§aOK");

  system.run(() => {
    form.show(player).catch(() => { });
  });
}

function readEV(entity: any, key: string): number {
  const v = getScore(entity, key);
  if (v < 0) {
    setScore(entity, key, 0); // 🔒 force-correct scoreboard
    return 0;
  }
  return v;
}

// --- Used-slot tracking helper (call from your spawn UI) ---
export function markUsedSlot(battler: PlayerBattler, slotIndex: number) {
  (battler as any).usedTeamSlots ??= new Set<number>();
  (battler as any).usedTeamSlots.add(Number(slotIndex));
}

const trapEffects: TrapEffect[] = [
  new LeechSeed(),
  new MultiBindingEffect(),
  new Nightmare(),
  new SappySeed(),
  new StealthRock(),
];

export class Battle {
  /**
   * The current turn
   */
  turn: number;
  /**
   * The player that started the battle.
   */
  player: PlayerBattler;
  /**
   * The opponent that is fighting the player.
   */
  opponent: PlayerBattler | WildBattler | NpcBattler;
  /**
   * Specifies if this battle has ended.
   */
  ended: boolean;
  /**
   * The type of battle
   */
  type: "wild" | "pvp" | "trainer";
  /**
   * Specifies if the battle has started yet.
   */
  started: boolean;
  /**
   * The ID assigned to this battle
   */
  id: number;
  /**
   * The winner of this battle
   */
  winner?: PlayerBattler | WildBattler | NpcBattler;

  constructor(
    player: PlayerBattler,
    opponent: PlayerBattler | WildBattler | NpcBattler
  ) {
    this.player = player;
    this.opponent = opponent;
    this.started = false;
    this.ended = false;
    this.turn = 0;
    this.id = randomNumber(10000, 99999);
    setScore(player.entity, "bid", this.id);
    setScore(opponent.entity, "bid", this.id);

    /**
     * Set of battler variables
     */
    player.battle = this;
    opponent.battle = this;
    player.opponent = opponent;
    opponent.opponent = player;

    battles.set(this.player.entity.id, this);

    if (this.opponent instanceof PlayerBattler) {
      battles.set(this.opponent.entity.id, this);
      this.opponent.entity.sendMessage(
        `§eDeploy a pokemon to start the battle!`
      );
    }

    this.player.entity.sendMessage(`§eDeploy a pokemon to start the battle!`);

    switch (true) {
      case this.opponent instanceof PlayerBattler:
        this.type = "pvp";
        break;
      case this.opponent instanceof NpcBattler:
        {
          this.type = "trainer";
          this.opponent.createTeam(selected[player.entity.name]);
        }
        break;
      case this.opponent instanceof WildBattler:
        this.type = "wild";
        break;
    }

    // 🆕 Initialize used-slot tracking for players
    (this.player as any).usedTeamSlots = new Set<number>();
    if (this.opponent instanceof PlayerBattler) {
      (this.opponent as any).usedTeamSlots = new Set<number>();
    }
  }

  prepareBattlers() {
    for (const battler of [this.player, this.opponent]) {
      setScore(battler.entity, "SafeGuard", 0);
    }
  }

  playBattleTheme() {
    for (const battler of [this.player, this.opponent]) {
      if (battler instanceof PlayerBattler) {
        battler.entity.playSound(`underground.battle_theme`);
      }
    }

    const timeout = system.runTimeout(() => {
      if (this.ended) return system.clearRun(timeout);
      this.playBattleTheme();
    }, 1825);
  }

  getActionPriorityForBattler(
    battler: PlayerBattler | NpcBattler | WildBattler
  ): number {
    const action = battler.getAction();
    if (!action) return 0;
    switch (action.type) {
      case "switch":
        return 6;
      case "item":
        return 5;
      case "run":
        return 4;
      case "move":
        return action.data?.priority ?? 0;
      default:
        return 0;
    }
  }

  async executeTurn() {
    this.turn += 1;

    this.message(`§e<turn ${this.turn}>`);

    const battlers = [this.player, this.opponent];

    const order = [...battlers].sort((a, b) => {
      const aPriority = this.getActionPriorityForBattler(a);
      const bPriority = this.getActionPriorityForBattler(b);

      if (aPriority === bPriority) {
        let aSpeed = a.pokemon.getSpeed() ?? 0;
        let bSpeed = b.pokemon.getSpeed() ?? 0;

        if (aSpeed === bSpeed) return Math.random() < 0.5 ? -1 : 1;

        return bSpeed - aSpeed;
      }

      return bPriority - aPriority;
    });

    let first = true;
    for (const battler of order) {
      const opponent = battler.opponent;
      const action = battler.action;

      if (!action) continue;

      switch (action.type) {
        case "move":
          const move = Move.create(action.data.move);
          await move.use(battler, opponent, this, first);
          break;
        case "item":
          this.handleItem(battler as PlayerBattler | NpcBattler, action.data);
          break;
        case "run":
          this.handleRun(battler);
          break;
        default:
          break;
      }

      if ((first && opponent.pokemon.dead) || this.ended) break;

      if (first === true) first = false;
    }

    this.onTurnEnd();
  }

  private getEndOfTurnOrder(p1: IPokemon, p2: IPokemon): IPokemon[] {
    if (p1.getSpeed() > p2.getSpeed()) return [p1, p2];
    if (p2.getSpeed() > p1.getSpeed()) return [p2, p1];

    //Same speed
    return Math.random() < 0.5 ? [p1, p2] : [p2, p1];
  }

  private processTrapEffects(poke1: IPokemon, poke2: IPokemon) {
    const turnOrder = this.getEndOfTurnOrder(poke1, poke2);

    for (const effect of trapEffects) {
      for (const actor of turnOrder) {
        const target = actor === poke1 ? poke2 : poke1;
        if (target.getHealth() > 0) {
          effect.applyEffect(actor, target, this);
        }
      }
    }
  }

  onDefeatTrainer(player: PlayerBattler) {
    // ==================================
    // 🏟️ GYM TRAINER (NO PAYOUT / NO FUNCTION)
    // ==================================
    if (this.opponent instanceof GymNpcBattler) {
      player.entity.sendMessage(`§aYou defeated the Gym!`);
      this.opponent.isDefeated = true;
      return;
    }

    // ==================================
    // 🧑 NORMAL TRAINER (UNCHANGED)
    // ==================================
    const trainer = WildTrainerData[(this.opponent as NpcBattler).trainerType];

    let payout =
      trainer.rate *
      (this.opponent as NpcBattler).pokemonsUsed *
      (1 + (this.opponent as NpcBattler).highestLevelPokemon / 10);

    const double =
      player.entity.runCommand(
        `testfor @s[hasitem={location=slot.inventory,item=pokeworld:alpha_coin}]`
      ).successCount > 0;

    if (double) payout *= 2;

    setScore(player.entity, "Money", payout, 1);

    player.entity.sendMessage(
      `§aYou received $${metricNumbers(payout)} for Winning!!!`
    );

    player.entity.runCommand(`function ${trainer.function}`);
    (this.opponent as NpcBattler).say("lose");
  }

  onTurnEnd() {
    this.player.setAction();
    this.opponent.setAction();

    this.processTrapEffects(this.player.pokemon, this.opponent.pokemon);
    this.processTrapEffects(this.opponent.pokemon, this.player.pokemon);

    if (this.opponent instanceof GymNpcBattler && this.opponent.pokemon.dead) {
      // Gym battler handles its own progression
      this.opponent.onPokemonDefeated();

      // If gym still has defenders, continue battle
      if (!this.opponent.isDefeated) {
        return;
      }

      // Otherwise gym is fully defeated
      this.onDefeatTrainer(this.player);
      return this.end();
    }

    if (this.opponent instanceof NpcBattler && this.opponent.pokemon.dead) {
      const team = this.opponent.team ?? {};
      if (Object.keys(team).length === 0) {
        this.onDefeatTrainer(this.player);
        return this.end();
      }

      this.opponent.deployRandom();
    }

    this.loop((battler) => {
      const pokemon = battler.pokemon;
      const pokemonEntity = pokemon.entity;

      if (getScore(pokemonEntity, "battle:laserfocus") > 0) {
        setScore(this.player.entity, "battle:laserfocus", 1, 2);
      }

      if (getScore(battler.entity, "battle:safeguard_turns") > 0)
        setScore(battler.entity, "battle:safeguard", 1, 2);
      if (getScore(pokemonEntity, "battle:bind_effect_turns") > 0)
        setScore(pokemonEntity, "battle:bind_effect_turns", 1, 2);
      if (getScore(pokemonEntity, "battle:double_speed_turns") > 0)
        setScore(pokemonEntity, "battle:double_speed_turns", 1, 2);
      if (battler?.disabledMove && battler?.disabledMoveTurns > 0) {
        if (battler.disabledMoveTurns === 1) {
          battler.disabledMove = undefined;
          battler.disabledMoveTurns = 0;
          return;
        }

        battler.disabledMoveTurns -= 1;
      }
    });
  }

  loop(call: (battler: PlayerBattler | NpcBattler | WildBattler) => void) {
    if (this.ended) return;

    for (const battler of [this.player, this.opponent]) {
      call(battler);
    }
  }

  message(text: string) {
    this.loop((battler) => {
      if (battler instanceof PlayerBattler) {
        battler.entity.sendMessage(`§e[Battle] §r${text}`);
      }
    });
  }

  /**
   * Get the xp gained after defeating a pokemon
   * @param faintedPokemon
   * @param winnerPokemon
   * @returns
   */
  getExp(
    faintedPokemon: {
      id: string;
      level: number;
      type: "Wild" | "Trainer";
    },
    winnerPokemon: {
      traded: boolean;
      luckyEgg: boolean;
    }
  ) {
    const pokemon = wildPokemon[faintedPokemon.id];
    const { Base_Exp } = pokemon;
    const multiplier = winnerPokemon.luckyEgg ? 1.5 : 1.0;
    const typeValue = faintedPokemon.type === "Trainer" ? 1.5 : 1.0;
    const trainerMultiplier = winnerPokemon.traded ? 1.5 : 1.0;

    const expFormula = ~~(
      ((Base_Exp * faintedPokemon.level) / 5) *
      multiplier *
      typeValue *
      trainerMultiplier
    );

    return expFormula;
  }

  /**
   * Handles the actions when a battler is defeated.
   * @param battler
   */
  defeated(loser: NpcBattler | WildBattler | PlayerBattler) {
    const pokeEntity = loser.pokemon?.entity;

    if (pokeEntity && pokeEntity.isValid) {
      pokeEntity.addTag("defeated");
    }

    if (loser instanceof PlayerBattler) {
      const playerEntity = loser.entity;
      if (playerEntity && playerEntity.isValid) {
        playerEntity.addTag("next");
      }
    } else if (loser instanceof WildBattler) {
      this.end();
    }
  }

  /**
   * Execute on a player who defeated a pokemon from their oppponent's team or the wild pokemon if it's a wild battle
   * @param winner
   */
  onPlayerDefeatOpponent(winner: PlayerBattler) {
    const opponent = winner.opponent;
    const player = winner.entity;
    const team = selected[player.name];
    const outIndex = Number(deployed[player.name]?.[1]);
    const defeatedId = opponent.pokemon.entity?.typeId;

    if (outIndex === undefined || !team[outIndex]) {
      player.sendMessage(
        "§cDeployed Pokémon is not valid. Aborting XP calculation."
      );
      return;
    }

    player.sendMessage(
      `§aYou defeated ${grammarText(opponent.pokemon.entity.typeId)}!`
    );
    // 💧 Suicune Quest drop logic
    if (
      (defeatedId === "pokeworld:wild_slowpoke" ||
        defeatedId === "pokeworld:wild_shellder" ||
        defeatedId === "pokeworld:wild_poliwhirl" ||
        defeatedId === "pokeworld:wild_vaporeon" ||
        defeatedId === "pokeworld:wild_lanturn" ||
        defeatedId === "pokeworld:wild_milotic") &&
      player instanceof Player
    ) {
      system.run(() => runSuicuneDropLogic(player, defeatedId));
    }

    // 🔥 Entei Quest drop logic
    if (
      (defeatedId === "pokeworld:wild_slugma" ||
        defeatedId === "pokeworld:wild_camerupt" ||
        defeatedId === "pokeworld:wild_magcargo" ||
        defeatedId === "pokeworld:wild_arcanine" ||
        defeatedId === "pokeworld:wild_houndoom" ||
        defeatedId === "pokeworld:wild_flareon") &&
      player instanceof Player
    ) {
      system.run(() => runEnteiDropLogic(player, defeatedId));
    }

    // ⚡ Raikou Quest drop logic
    if (
      (defeatedId === "pokeworld:wild_rhyhorn" ||
        defeatedId === "pokeworld:wild_bonsly" ||
        defeatedId === "pokeworld:wild_geodude" ||
        defeatedId === "pokeworld:wild_jolteon" ||
        defeatedId === "pokeworld:wild_mareep" ||
        defeatedId === "pokeworld:wild_rotom") &&
      player instanceof Player
    ) {
      system.run(() => runRaikouDropLogic(player, defeatedId));
    }

    // ⚡ Zapdos Quest drop logic
    if (
      (defeatedId === "pokeworld:wild_electabuzz" ||
        defeatedId === "pokeworld:wild_luxray" ||
        defeatedId === "pokeworld:wild_electrike") &&
      player instanceof Player
    ) {
      system.run(() => runZapdosDropLogic(player, defeatedId));
    }

    if (
      (defeatedId === "pokeworld:wild_magmar" ||
        defeatedId === "pokeworld:wild_slugma" ||
        defeatedId === "pokeworld:wild_numel") &&
      player instanceof Player
    ) {
      system.run(() => runMoltresDropLogic(player, defeatedId));
    }
    // ❄️ Cryogonal Quest Item Drop
    if (
      (defeatedId === "pokeworld:wild_piloswine" ||
        defeatedId === "pokeworld:wild_snorunt" ||
        defeatedId === "pokeworld:wild_sneasel") &&
      player instanceof Player
    ) {
      system.run(() => runArticunoDropLogic(player, defeatedId));
    }
    if (
      (defeatedId === "pokeworld:wild_magneton" ||
        defeatedId === "pokeworld:wild_porygon" ||
        defeatedId === "pokeworld:wild_beldum") &&
      player instanceof Player
    ) {
      system.run(() => runMewtwoDropLogic(player, defeatedId));
    }
    const expEarned = this.getExp(
      {
        id: pokemonText(opponent.pokemon.entity.typeId),
        level: getScore(opponent.pokemon.entity, "Lvl"),
        type: opponent.pokemon.entity.hasTag("wild") ? "Wild" : "Trainer",
      },
      {
        traded: Boolean(getScore(winner.pokemon.entity, "Traded")),
        luckyEgg: winner.pokemon.entity.hasTag("LuckyEgg"),
      }
    );

    // ✅ EV Distribution (HARD SAFE)
    const faintedSpecies = pokemonText(opponent.pokemon.entity.typeId);
    const evSource = wildPokemon[faintedSpecies];

    if (Array.isArray(evSource?.Base_EV)) {
      const evKeys = [
        "EV_HP",
        "EV_Spd",
        "EV_Atk",
        "EV_Def",
        "EV_Sp_Atk",
        "EV_Sp_Def",
      ];

      let totalEVs = 0;
      const currentEVs: Record<string, number> = {};

      // 🔒 HARD CLAMP: EVs can NEVER be -1
      for (const key of evKeys) {
        const val = readEV(winner.pokemon.entity, key);
        currentEVs[key] = val;
        totalEVs += val;
      }

      for (const [evType, evAmount] of evSource.Base_EV as [string, number][]) {
        if (!(evType in currentEVs)) continue;

        const currentStat = currentEVs[evType];
        const remainingForStat = 252 - currentStat;
        const remainingForTotal = 510 - totalEVs;

        const canAdd = Math.min(evAmount, remainingForStat, remainingForTotal);

        if (canAdd > 0) {
          const newValue = currentStat + canAdd;
          setScore(winner.pokemon.entity, evType, newValue);
          currentEVs[evType] = newValue;
          totalEVs += canAdd;
        }
      }
    }

    // ✅ EXP Distribution (xpAll restricts to only mons actually sent out)
    const activeMon = team[outIndex];
    const activeGain = expEarned;

    // 🚫 If player has xpDBL (XP Disable), block all XP gain
    if (player.hasTag("xpDBL")) {
      player.sendMessage(
        "§cYour Pokémon did not gain any experience (XP Disabled)."
      );
    } else {

      // ======================================================
      // ⭐ ACTIVE MON: FULL EXP + FULL FRIENDSHIP (SCOREBOARD)
      // ======================================================
      // Friendship gain for active mon → SCOREBOARD
      const activeFriendGain = 3; // tweakable
      const xpMessages: string[] = [];
      winner.pokemon.entity.runCommand(
        `scoreboard players add @s friendShipLevel ${activeFriendGain}`
      );
      winner.pokemon.entity.runCommand(
        `scoreboard players add @s Ex ${activeGain}`
      );
      xpMessages.push(`§a${grammarText(activeMon[1])} gained §e${activeGain} XP`);
      // xpAll means only "used" mons get bench EXP
      const hasXpAll = player.hasTag("xpAll");
      const usedSlots: Set<number> = (winner as any).usedTeamSlots ?? new Set();
      usedSlots.add(outIndex);

      for (let i = 0; i < 6; i++) {
        if (!team[i] || i === outIndex) continue;

        if (hasXpAll && !usedSlots.has(i)) continue;

        const mon = team[i];
        const health = mon[2].Current_Health ?? 0;
        if (health <= 0) continue;

        // ============================
        // ⭐ BENCHED MON: HALF EXP
        // ============================
        const xp = Math.floor(expEarned * 0.5);
        mon[2].Experience = (mon[2].Experience ?? 0) + xp;
        xpMessages.push(`§7${grammarText(mon[1])} gained §e${xp} XP`);

        // ======================================================
        // ⭐ BENCHED MON: HALF FRIENDSHIP (LONGHAND, NOT SCOREBOARD)
        // ======================================================
        const benchFriendGain = 1; // tweakable
        mon[2].friendShipLevel = Math.min(
          255,
          (mon[2].friendShipLevel ?? 0) + benchFriendGain
        );

        // Save Pokémon
        writePokemon(player, mon[1], mon[0], mon[2]);
      }
      showXpResults(player, xpMessages);
      player.playSound("random.levelup");
      winner.pokemon.entity.dimension.spawnParticle(
        "minecraft:totem_particle",
        winner.pokemon.entity.location
      );

      // 🧬 Outbreak defeat tracking (debug for replacement logic)
      {
        const entity = opponent.pokemon.entity;
        const tags = entity.getTags();
        const outbreakIdTag = tags.find(t => t.startsWith("outbreak_id:"));
        if (!outbreakIdTag) {
          return;
        }

        const outbreakId = Number(outbreakIdTag.split(":")[1]);
        const speciesName = grammarText(entity.typeId);

        system.runTimeout(() => {
          const outbreak = activeOutbreaks.find(o => o.id === outbreakId);
          if (!outbreak) {
            return;
          }

          const progressKey = `outbreak_${player.name}_${outbreakId}`;
          const oldValue = Number(world.getDynamicProperty(progressKey)) || 0;
          const newValue = oldValue + 1;
          world.setDynamicProperty(progressKey, newValue);

          player.sendMessage(`§e[Outbreak] §f${speciesName} defeated! §7(${newValue}/20)`);

          if (newValue >= 20) {
            player.sendMessage("§a✅ The outbreak has been cleared!");
            world.sendMessage(`§b${player.name}§f has cleared the outbreak of §e${speciesName}§f!`);
            endOutbreak(outbreak, "cleared");
            return;
          }

          outbreak.active--;
          if (outbreak.remaining > 0) {
            outbreak.remaining--;
            outbreak.active++;
            spawnOutbreakEntity(outbreak);
          } else if (outbreak.active <= 0) {
            endOutbreak(outbreak, "cleared");
          };
        }, 10);
      }
    }
  }
  /**
   * Execute on a player who won a full battle
   * @param winner
   */
  onBattleWin(winner: PlayerBattler) {
    winner.entity.sendMessage(`§aYou won this battle!`);
  }

  onPlayerAction(player: PlayerBattler) {
    const opponent =
      player.entity.id === this.player.entity.id ? this.opponent : this.player;
    if (opponent instanceof PlayerBattler && !opponent.getAction()) {
      return;
    }

    function AISelection(AIbattler: WildBattler | NpcBattler): {
      type: "move" | "item";
      data: any;
    } {
      if (AIbattler instanceof NpcBattler) {
        const currentHealth = AIbattler.pokemon.getHealth();
        const maxHealth = AIbattler.pokemon.getMaxHealth();

        // Use healing if below 90% HP
        if (currentHealth <= 0.3 * maxHealth) {
          const random = randomNumber(1, 100);
          if (random <= 10) {
            return {
              type: "item",
              data: { type: "healing" }, // 👈 now valid for handleItem
            };
          }
        }
      }

      const disabled = AIbattler.disabledMove;
      const moves = AIbattler.pokemon.getMoves();

      if (disabled) {
        let move;
        do {
          move = moves[randomNumber(0, moves.length - 1)];
        } while (move[2].id === disabled);

        return {
          type: "move",
          data: {
            move: move?.[2],
            priority:
              typeof move?.[2]?.priority === "number"
                ? move?.[2]?.priority
                : (move?.[2]?.priority ? 1 : 0),
          },
        };
      }

      const chosen = moves[randomNumber(0, moves.length - 1)]?.[2];

      return {
        type: "move",
        data: {
          move: chosen,
          priority:
            typeof chosen?.priority === "number"
              ? chosen.priority
              : (chosen?.priority ? 1 : 0),
        },
      };
    }

    if (opponent instanceof WildBattler || opponent instanceof NpcBattler) {
      const result = AISelection(opponent);
      if (result) {
        opponent.setAction(result);
      }
    }

    this.continue();
  }

  catchingCamera(player: Player) {
    const cmd = `/execute at @e[tag=defender,scores={bid=${this.id}}] positioned ^0 ^2 ^-2 run camera @s set minecraft:free ease 1.0 cubic pos ^ ^ ^1 facing ^ ^-0.5 ^1`;
    player.runCommand(cmd);
  }

  camera(player: PlayerBattler) {
    const cmd = `/execute at @e[tag=attacker,scores={bid=${this.id}}] rotated ~ 0 positioned ^-4^6^-4 run camera @s set minecraft:free ease 0.1 linear pos ~~~ facing @e[tag=defender,scores={bid=${this.id}}]`;
    player.entity.runCommand(cmd);
  }

  attack(
    pokemon: IPokemon,
    damage: number,
    battler: PlayerBattler | NpcBattler | WildBattler
  ) {
    const died = pokemon.damage(damage);

    // 🔥 OHKO cleanup:
    // If the damage is absurdly high (OHKO moves), do not show damage message.
    if (damage >= 1000) {
      return; // no message shown
    }

    // Normal damage message
    this.message(`${grammarText(pokemon.entity.typeId)} took ${damage} damage!`);

    if (died) {
      if (battler.opponent instanceof PlayerBattler)
        this.onPlayerDefeatOpponent(battler.opponent);

      this.defeated(battler);
    }
  }

  /**
   * Applies status effects to the specified battler based on its current condition
   * @param battler
   */
  processBeforeEffects(battler: PlayerBattler | NpcBattler | WildBattler) {
    const pokemon = battler.pokemon.entity;
    const condition = getScore(pokemon, "condition");
    if (condition < 1) return;
    if (
      condition === StatusEffects.Poisoned ||
      condition === StatusEffects.Burned
    )
      return;

    switch (condition) {
      case StatusEffects.Paralyzed:
        {
          const random = randomNumber(1, 100);
          if (random < 25) {
            setScore(pokemon, "skipTurn", 1);
            this.message(
              `§d${grammarText(
                pokemon.typeId
              )}§r is fully paralyzed! It can't move`
            );
            this.message(LANG["move.missed"](grammarText(pokemon.typeId)));
          }
        }
        break;
      case StatusEffects.Frozen:
        {
          const random = randomNumber(1, 100);
          if (random >= 80) {
            setScore(pokemon, "condition", 0);
            this.message(
              `§d${grammarText(pokemon.typeId)}§r is no longer frozen!`
            );
          } else {
            this.message(
              `§d${grammarText(pokemon.typeId)}§r frozen solid! it can't move!`
            );
            this.message(LANG["move.missed"](grammarText(pokemon.typeId)));
            setScore(pokemon, "skipTurn", 1);
          }
        }
        break;
      case StatusEffects.Confused:
        {
          const random = randomNumber(1, 100);
          if (random >= 50) {
            setScore(pokemon, "condition", 0);
            this.message(
              `§d${grammarText(pokemon.typeId)}§r is no longer confused!`
            );
          } else {
            const random2 = randomNumber(1, 100);
            if (random2 >= 50) {
              const maxHp = getScore(pokemon, "HP_Base");
              this.attack(battler.pokemon, ~~(maxHp / 3), battler);
              this.message(
                `§d${grammarText(
                  pokemon.typeId
                )}§r hurt itself in its confusion!`
              );
            }
          }
        }
        break;
      case StatusEffects.Flinched:
        {
          setScore(pokemon, "condition", 0);
          setScore(pokemon, "skipTurn", 1);
          this.message(
            `§d${grammarText(pokemon.typeId)}§r flinched and couldn't move!`
          );

          if (getScore(pokemon, "ability") === 242) {
            this.message(
              `§d${grammarText(
                pokemon.typeId
              )}'s§r Speed was boosted due to its Ability §9Steadfast§r!`
            );
          }
        }
        break;
      case StatusEffects.Sleep:
        {
          const sleepTurnsLeft = getScore(pokemon, "sleepTurns");
          if (sleepTurnsLeft === 0) {
            setScore(pokemon, "condition", 0);
            setScore(pokemon, "sleepTurns", 0);
            this.message(`§d${grammarText(pokemon.typeId)}§r woke up!`);
          } else {
            setScore(pokemon, "sleepTurns", sleepTurnsLeft - 1);
            setScore(pokemon, "skipTurn", 1);
            this.message(`§d${grammarText(pokemon.typeId)}§r is Fast Asleep`);
          }
        }
        break;
    }
  }

  /**
   * Applies status effects to the specified battler based on its current condition
   * @param battler
   */
  processAfterEffects(battler: PlayerBattler | NpcBattler | WildBattler) {
    const pokemon = battler.pokemon.entity;
    const condition = getScore(pokemon, "condition");
    if (condition < 1) return;

    switch (condition) {
      case StatusEffects.Poisoned:
        {
          const maxHp = getScore(pokemon, "HP_Base");
          this.attack(battler.pokemon, ~~(maxHp / 8), battler);
          this.message(`§d${grammarText(pokemon.typeId)}§r poisoned!`);
          this.message(`§d${grammarText(pokemon.typeId)}§r hurt by poison!`);
        }
        break;

      case StatusEffects.Burned:
        {
          const maxHp = getScore(pokemon, "HP_Base");
          this.attack(battler.pokemon, ~~(maxHp / 8), battler);
          this.message(`§d${grammarText(pokemon.typeId)}§r burned!`);
          this.message(`§d${grammarText(pokemon.typeId)}§r hurt by its burn!`);
        }
        break;

      case StatusEffects.BadlyPoisoned:
        {
          const maxHp = getScore(pokemon, "HP_Base");
          const toxicTurns = getScore(pokemon, "toxicCounter");
          const newToxicTurns = toxicTurns + 1;

          setScore(pokemon, "toxicCounter", newToxicTurns);

          const damageFraction = Math.min(newToxicTurns, 15) / 16;
          const damage = Math.floor(maxHp * damageFraction);

          this.attack(battler.pokemon, damage, battler);
          this.message(`§d${grammarText(pokemon.typeId)}§r badly poisoned!`);
          this.message(
            `§d${grammarText(pokemon.typeId)}§r hurt by toxic poison!`
          );
        }
        break;
    }
  }

  async handleRun(battler: PlayerBattler | NpcBattler | WildBattler) {
    const result =
      (battler.pokemon.getSpeed() * 32) / battler.opponent.pokemon.getSpeed() +
      30 * battler.runAttempts;

    if (result < 255) {
      battler.runAttempts += 1;
      return this.message(
        `§d${battler.friendlyName} §cattempted to run but failed!`
      );
    }

    this.end();
    this.message(`§d${battler.friendlyName} §cChickened out!!!!`);
  }

  handleItem(
    battler: PlayerBattler | NpcBattler,
    data: { type: "pokeball" | "healing" }
  ) {
    switch (data.type) {
      case "pokeball": {
        _catch(battler.opponent.pokemon.entity, this).then((catchResult) => {
          if (["NO_PLAYER", "POKEMON_CAUGHT"].includes(catchResult)) {
            this.end();
          }
        });
        break;
      }
      case "healing":
        if (battler instanceof NpcBattler) {
          const result = applyHealingItem(
            "full_restore",
            battler.pokemon.getHealth(),
            battler.pokemon.getMaxHealth(),
            battler.pokemon.getStatusEffect()
          );
          if (typeof result === "string") return;

          if (typeof result === "number") {
            battler.pokemon.setHealth(result);
          } else {
            battler.pokemon.setHealth(result.hp);
            setScore(battler.pokemon.entity, "condition", result.condition);
          }

          this.message(`§d${battler.friendlyName} used Full Restore!`);
        }
        break;
    }
  }

  /**
   * This function should be called when the main player (or the two players if it's a pvp) has/have selected an action so the battle can continue.
   */
  continue() {
    if (this.ended) return;

    if (!this.player.action || !this.opponent.action) return;

    this.executeTurn();
  }

  start() {
    this.started = true;
    for (const battler of [this.player, this.opponent]) {
      if (battler instanceof PlayerBattler) {
        battler.canSelectAction = true;
      }
    }

    const checkForConditions = system.runInterval(() => {
      if (this.ended) {
        return system.clearRun(checkForConditions);
      }

      if (!this.player.entity?.isValid || !this.opponent.entity?.isValid) {
        system.clearRun(checkForConditions);
        this.end(); // Always end battle if one entity vanishes
        return;
      }

      if (this.type === "pvp") {
        if (
          !(this.opponent.entity as Player).hasTag("battle") ||
          getScore(this.player.entity, "bid") !==
          getScore(this.opponent.entity, "bid")
        ) {
          system.clearRun(checkForConditions);
          this.end();
          return;
        }
      }

      if (
        distance(this.player.entity.location, this.opponent.entity.location) > 12
      ) {
        // 🧬 Handle runaway / distance despawn for outbreak Pokémon
        const entity = this.opponent.pokemon?.entity;
        if (entity && entity.isValid && entity.hasTag("outbreak")) {
          const tags = entity.getTags();
          const outbreakIdTag = tags.find(t => t.startsWith("outbreak_id:"));
          if (outbreakIdTag) {
            const outbreakId = Number(outbreakIdTag.split(":")[1]);
            const outbreak = activeOutbreaks.find(o => o.id === outbreakId);
            if (outbreak) {
              const speciesName = grammarText(entity.typeId);

              // Count this as one encounter "fled" or lost
              const progressKey = `outbreak_${this.player.entity.name}_${outbreakId}`;
              const oldValue = Number(world.getDynamicProperty(progressKey)) || 0;
              const newValue = oldValue + 1;
              world.setDynamicProperty(progressKey, newValue);

              this.player.entity.sendMessage(
                `§e[Outbreak] §f${speciesName} fled! §7(${newValue}/20)`
              );

              // Replace the one that fled
              outbreak.active--;
              if (outbreak.remaining > 0) {
                outbreak.remaining--;
                outbreak.active++;
                spawnOutbreakEntity(outbreak);
              } else if (outbreak.active <= 0) {
                endOutbreak(outbreak, "cleared");
              }
            }
          }
        }

        system.clearRun(checkForConditions);
        this.end();
        return;
      }
    });

    this.playBattleTheme();
  }

  end() {
    this.ended = true;

    if (this?.winner && this.winner instanceof PlayerBattler) {
      this.onBattleWin(this.winner);
    }

    this.message(`§eThe battle ended.`);

    for (const battler of [this.player, this.opponent]) {
      if (battler instanceof PlayerBattler) {
        battles.delete(battler.entity.id);
        battler.entity.runCommand(`stopsound @s`);
        battler.entity.runCommand(`camera @s clear`);
        battler.entity.runCommand(`tag @s remove battle`);

        if (deployed?.[battler.entity.name]) {
          const slot = deployed[battler.entity.name][1];
          const member = selected[battler.entity.name][slot];

          // ==================================
          // 🧬 SAVE EVs (ENTITY → LONGHAND)
          // ==================================
          const entity = battler.pokemon.entity;
          const data = member[2];

          data.EV_health = readEV(entity, "EV_HP");
          data.EV_attack = readEV(entity, "EV_Atk");
          data.EV_defense = readEV(entity, "EV_Def");
          data.EV_special_attack = readEV(entity, "EV_Sp_Atk");
          data.EV_special_defense = readEV(entity, "EV_Sp_Def");
          data.EV_speed = readEV(entity, "EV_Spd");

          // Persist Pokémon data BEFORE despawn
          writePokemon(battler.entity, member[1], member[0], data);

          // Respawn Pokémon from saved data
          spawnPokemon(battler.entity, member, slot, true);

          // ⏱️ Delay XP check to allow data sync after respawn
          system.runTimeout(() => {
            checkExperienceForTeam(battler.entity);
          }, 60);
        }

        // 🧹 Clear tracked "used" slots after the battle
        (battler as any).usedTeamSlots = undefined;
      }

      if (battler instanceof WildBattler) {
        safeRemove(battler.entity);
      }

      if (battler instanceof NpcBattler) {
        // Always remove the NPC's Pokémon entity
        safeRemove(battler.pokemon?.entity);

        // 🏟️ Gym defender notify (unchanged behavior)
        if (
          battler.entity?.isValid &&
          (
            battler.entity.typeId === "pokeworld:valor_team" ||
            battler.entity.typeId === "pokeworld:mystic_team" ||
            battler.entity.typeId === "pokeworld:instinct_team"
          )
        ) {
          notifyNearbyGym(battler.entity);
        }

        if (battler.entity?.isValid) {
          battler.entity.removeTag("battle");

          // ✅ Gym entities stay, others despawn
          if (!battler.entity.hasTag("Gym")) {
            safeRemove(battler.entity);
          }
        }
      }
    }
  }
}
