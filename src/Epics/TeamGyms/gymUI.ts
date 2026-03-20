import { Player, Entity, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { GymPokemonSlot, GymTeam } from "./gymTypes";
import { getGymData } from "./gymStorage";
import { addPokemonToGym } from "./gymPokemon";
import { selected } from "../Main/Forms/PC/main";
import { deletePokemon, writePokemon } from "../Pokemon Database/main";
import { updateSidebar } from "../Pokemon Calculations/updateTeam";
import { setPlayerTeam } from "./playerTeams";
import pokemonList from "../../Letters/pokemon/list";
import { ballTags } from "../Pokemon Calculations/catch";
import { findNextFreePCSlotForPlayer } from "../Pokemon Database/PcControls";

const GYM_RECLAIM_KEY = "pokeworld:gym_reclaim_pool";

const GYM_REWARD_KEY = "pokeworld:gym_reward_ts";
const GYM_REWARD_PER_MON = 100;
const GYM_REWARD_COOLDOWN = 20 * 60 * 60 * 24; // 24h in ticks

const DEFENDERS_KEY = "pokeworld:gym_defenders";
const GYM_HP_OBJ = "gym_hp";
const MONEY_OBJ = "Money";

const MAX_SLOTS = 6;
const HP_PER_DEFENDER = 1000;
const MONEY_COST = 1000;
const HP_RESTORE = 250;

// ======================================================
// HELPERS
// ======================================================

function countPlayerDefenders(player: Player): number {
  let count = 0;

  for (const dim of [
    world.getDimension("overworld"),
    world.getDimension("nether"),
    world.getDimension("the_end"),
  ]) {
    for (const ent of dim.getEntities()) {
      const raw = ent.getDynamicProperty(DEFENDERS_KEY);
      if (typeof raw !== "string") continue;

      try {
        const parsed = JSON.parse(raw) as {
          slots?: Partial<Record<number, GymPokemonSlot>>;
        };

        const slots = parsed.slots;
        if (!slots) continue;

        for (const slot of Object.values(slots)) {
          if (!slot) continue;
          if (slot.ownerId === player.id) {
            count++;
          }
        }
      } catch { }
    }
  }

  return count;
}


type GymReclaimPool = {
  byOwner: Record<string, GymPokemonSlot[]>;
};

function getReclaimPool(gym: Entity): GymReclaimPool {
  const raw = gym.getDynamicProperty(GYM_RECLAIM_KEY);
  if (typeof raw !== "string") return { byOwner: {} };

  try {
    return JSON.parse(raw) as GymReclaimPool;
  } catch {
    return { byOwner: {} };
  }
}

export function playerHasReclaimablePokemon(gym: Entity, player: Player): boolean {
  const pool = getReclaimPool(gym);
  return Array.isArray(pool.byOwner[player.id]) && pool.byOwner[player.id].length > 0;
}

function canClaimGymReward(player: Player): { ok: boolean; remaining: number } {
  const last = player.getDynamicProperty(GYM_REWARD_KEY) as number | undefined;
  if (!last) return { ok: true, remaining: 0 };

  const now = world.getAbsoluteTime();
  const diff = now - last;

  if (diff >= GYM_REWARD_COOLDOWN) {
    return { ok: true, remaining: 0 };
  }

  return {
    ok: false,
    remaining: GYM_REWARD_COOLDOWN - diff,
  };
}

function claimGymReward(player: Player) {
  const defenders = countPlayerDefenders(player);

  if (defenders <= 0) {
    player.sendMessage("§cYou have no Pokémon defending any gyms.");
    return;
  }

  const check = canClaimGymReward(player);
  if (!check.ok) {
    player.sendMessage(
      `§eYou can claim gym rewards again in §6${formatTime(check.remaining)}`
    );
    return;
  }

  const reward = defenders * GYM_REWARD_PER_MON;
  const money = getScoreFromPlayer(player, MONEY_OBJ);

  setScoreForPlayer(player, MONEY_OBJ, money + reward);
  player.setDynamicProperty(GYM_REWARD_KEY, world.getAbsoluteTime());

  player.sendMessage(
    `§aYou collected §6$${reward}§a from §b${defenders}§a gym defenders!`
  );
}

function formatTime(ticks: number): string {
  const seconds = Math.ceil(ticks / 20);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

function getTeamEntity(gym: Entity, team: GymTeam): Entity | null {
  const tags = [`Gym:${gym.id}`, `GymTeam:${team}`];
  for (const dim of [
    world.getDimension("overworld"),
    world.getDimension("nether"),
    world.getDimension("the_end"),
  ]) {
    const found = dim.getEntities({ tags });
    if (found[0]) return found[0];
  }
  return null;
}

function getDefenders(teamEntity: Entity): { slots: Partial<Record<number, any>> } {
  const raw = teamEntity.getDynamicProperty(DEFENDERS_KEY);
  if (!raw || typeof raw !== "string") return { slots: {} };
  try {
    const parsed = JSON.parse(raw);
    return {
      slots:
        typeof parsed?.slots === "object" && parsed.slots !== null
          ? parsed.slots
          : {},
    };
  } catch {
    return { slots: {} };
  }
}

function getObj(name: string) {
  return world.scoreboard.getObjective(name);
}

function getScoreFromEntity(entity: Entity, objName: string) {
  const obj = getObj(objName);
  if (!obj || !entity.scoreboardIdentity) return 0;
  return obj.getScore(entity.scoreboardIdentity) ?? 0;
}

function setScoreForEntity(entity: Entity, objName: string, value: number) {
  const obj = getObj(objName);
  if (!obj || !entity.scoreboardIdentity) return;
  obj.setScore(entity.scoreboardIdentity, value);
}

function getScoreFromPlayer(player: Player, objName: string) {
  const obj = getObj(objName);
  if (!obj || !player.scoreboardIdentity) return 0;
  return obj.getScore(player.scoreboardIdentity) ?? 0;
}

function setScoreForPlayer(player: Player, objName: string, value: number) {
  const obj = getObj(objName);
  if (!obj || !player.scoreboardIdentity) return;
  obj.setScore(player.scoreboardIdentity, value);
}

function getGymHPInfo(teamEntity: Entity) {
  const defenders = getDefenders(teamEntity);
  const count = Object.keys(defenders.slots).length;
  const maxHP = count * HP_PER_DEFENDER;
  const curHP = getScoreFromEntity(teamEntity, GYM_HP_OBJ);
  return { curHP, maxHP, count };
}

// ======================================================
// GYM HP RESTORE
// ======================================================

function tryRestoreGymHP(player: Player, teamEntity: Entity) {
  const { curHP, maxHP } = getGymHPInfo(teamEntity);

  if (maxHP <= 0) return player.sendMessage("§cThis gym has no defenders.");
  if (curHP >= maxHP) return player.sendMessage("§eGym HP already full.");

  const money = getScoreFromPlayer(player, MONEY_OBJ);
  if (money < MONEY_COST) {
    player.sendMessage(`§cYou need $${MONEY_COST}.`);
    return;
  }

  setScoreForPlayer(player, MONEY_OBJ, money - MONEY_COST);
  setScoreForEntity(
    teamEntity,
    GYM_HP_OBJ,
    Math.min(curHP + HP_RESTORE, maxHP)
  );

  player.sendMessage("§aGym HP restored.");
}

// ======================================================
// TEAM SELECT
// ======================================================

export function openTeamSelectUI(player: Player, gym: Entity) {
  const data = getGymData(gym);

  new ActionFormData()
    .title("§lChoose Your Team")
    .body(
      data.team
        ? `§7This gym is controlled by §f${data.team}§7.\n§7You can still choose a team to join.`
        : "§7Choose a team to join. Then hit the gym again to claim it."
    )
    .button("§cTeam Valor")
    .button("§9Team Mystic")
    .button("§eTeam Instinct")
    .show(player)
    .then(res => {
      if (res.canceled || typeof res.selection !== "number") return;

      const team: GymTeam =
        res.selection === 0 ? "Valor" :
        res.selection === 1 ? "Mystic" :
        "Instinct";

      setPlayerTeam(player, team);
      player.sendMessage(`§aYou joined §f${team}§a!`);
    });
}

// ======================================================
// MAIN GYM UI
// ======================================================

export function openGymMainUI(player: Player, gym: Entity) {
  const data = getGymData(gym);
  if (!data.team) return;

  const teamEntity = getTeamEntity(gym, data.team);
  if (!teamEntity) return;

  const { curHP, maxHP, count } = getGymHPInfo(teamEntity);

  new ActionFormData()
    .title("§lGym Control")
    .body(`Team: ${data.team}\nDefenders: ${count}/${MAX_SLOTS}\nHP: ${curHP}/${maxHP}`)
    .button("➕ Add Pokémon")
    .button("➖ Remove Pokémon")
    .button("💰 Restore HP")
    .button("🏆 Collect Gym Rewards")
    .button("📋 View Defenders")
    .show(player)
    .then(res => {
      if (res.canceled || typeof res.selection !== "number") return;

      if (res.selection === 0) openAddPokemonFromPartyUI(player, gym, teamEntity);
      if (res.selection === 1) openRemovePokemonUI(player, gym, teamEntity);
      if (res.selection === 2) {
        tryRestoreGymHP(player, teamEntity);
        system.runTimeout(() => openGymMainUI(player, gym), 2);
      }
      if (res.selection === 3) {
        claimGymReward(player);
        system.runTimeout(() => openGymMainUI(player, gym), 2);
      }
      if (res.selection === 4) openViewDefendersUI(player, teamEntity);
    });
}

// ======================================================
// ADD DEFENDER (FIXED)
// ======================================================

function openAddPokemonFromPartyUI(player: Player, gym: Entity, teamEntity: Entity) {
  const defenders = getDefenders(teamEntity);
  if (Object.keys(defenders.slots).length >= MAX_SLOTS) return;

  const partyEntries = Object.entries(selected[player.name] ?? {}).filter(
    ([_, p]) => Array.isArray(p) && p.length === 3
  );

  if (!partyEntries.length) return;

  const form = new ActionFormData().title("Choose Pokémon");
  partyEntries.forEach(([i, p]) =>
    form.button(`Slot ${Number(i) + 1}: ${p[1]}`)
  );

  form.show(player).then(res => {
    if (res.canceled || typeof res.selection !== "number") return;

    const entry = partyEntries[res.selection];
    if (!entry) return;

    const [slotStr, [rID, species, data]] = entry;
    const slot = Number(slotStr);

    let gymSlot: number | null = null;
    for (let i = 0; i < MAX_SLOTS; i++) {
      if (!defenders.slots[i]) { gymSlot = i; break; }
    }
    if (gymSlot === null) return;

    addPokemonToGym(teamEntity, player, gymSlot, species, rID, data);

    // 🔥 ADD GYM HP FOR NEW DEFENDER
    const curHP = getScoreFromEntity(teamEntity, GYM_HP_OBJ);
    const defendersNow = getDefenders(teamEntity);
    const maxHP = Object.keys(defendersNow.slots).length * HP_PER_DEFENDER;

    setScoreForEntity(
      teamEntity,
      GYM_HP_OBJ,
      Math.min(curHP + HP_PER_DEFENDER, maxHP)
    );

    // 🔥 DELETE FIRST (authoritative)
    deletePokemon(player, species, rID);

    // ✅ SHIFT PARTY EXACTLY LIKE BREEDING (NO HOLES)
    for (let i = slot; i < 5; i++) {
      if (selected[player.name][i + 1]) {
        selected[player.name][i] = selected[player.name][i + 1];
      } else {
        delete selected[player.name][i];
      }
    }
    delete selected[player.name][5];

    // ✅ UPDATE SIDEBAR ONCE, AFTER SHIFT
    updateSidebar(player, 0);
    system.runTimeout(() => openGymMainUI(player, gym), 2);
  });
}



// ======================================================
// REMOVE DEFENDER
// ======================================================

function openRemovePokemonUI(player: Player, gym: Entity, teamEntity: Entity) {
  const defenders = getDefenders(teamEntity);
  const entries = Object.entries(defenders.slots);

  if (entries.length === 0) {
    player.sendMessage("§cThis gym has no defenders.");
    return;
  }

  const form = new ActionFormData().title("§lRemove Defender");

  entries.forEach(([_, mon]: any) => {
    form.button(`${mon.species} §7(${mon.ownerName})`);
  });

  form.show(player).then(res => {
    if (res.canceled || typeof res.selection !== "number") return;

    const entry = entries[res.selection];
    if (!entry) return;

    const [slotKey, mon]: any = entry;

    if (mon.ownerId !== player.id) {
      player.sendMessage("§cYou do not own this Pokémon.");
      return;
    }

    // ✅ Ensure party exists
    if (!selected[player.name]) selected[player.name] = {};
    const party = selected[player.name];

    let slot: number | undefined;
    for (let i = 0; i < 6; i++) {
      if (!party[i]) {
        slot = i;
        break;
      }
    }

    // ✅ Always restore to DB
    if (slot !== undefined) {

  writePokemon(player, mon.species, mon.rID, mon.data);

  party[slot] = [mon.rID, mon.species, mon.data];

      const suffix = slot > 0 ? slot + 1 : "";
      system.run(() => {
        player.runCommand(`scoreboard players set @s poke${suffix}rID ${mon.rID}`);
        player.runCommand(`scoreboard players set @s poke${suffix}Id ${pokemonList.indexOf(mon.species)}`);
        player.runCommand(`scoreboard players set @s poke${suffix}Lvl ${mon.data.level ?? 1}`);
        player.runCommand(`scoreboard players set @s poke${suffix}Var ${mon.data.Variant ?? 0}`);
        player.runCommand(`scoreboard players set @s poke${suffix}HP ${mon.data.Current_Health ?? 0}`);
        player.runCommand(`scoreboard players set @s poke${suffix}HPmax ${mon.data.Base_Health ?? 0}`);
        player.runCommand(
          `scoreboard players set @s poke${suffix}Ball ${Object.keys(ballTags).indexOf(mon.data.pokeBall)}`
        );
      });

      updateSidebar(player, slot);
    } else {
  const { box, slot: pcSlot } = findNextFreePCSlotForPlayer(player);

  mon.data.Box = box;
  mon.data.Slot = pcSlot;

  writePokemon(player, mon.species, mon.rID, mon.data);

  player.sendMessage("§eParty full — Pokémon sent to PC.");
}

    // ✅ Remove from gym
    delete defenders.slots[Number(slotKey)];
    teamEntity.setDynamicProperty(DEFENDERS_KEY, JSON.stringify(defenders));

    // ✅ Clamp gym HP
    const after = getGymHPInfo(teamEntity);
    const cur = getScoreFromEntity(teamEntity, GYM_HP_OBJ);
    if (cur > after.maxHP) {
      setScoreForEntity(teamEntity, GYM_HP_OBJ, after.maxHP);
    }

    player.sendMessage(`§a${mon.species} has been returned to you.`);
    system.runTimeout(() => openGymMainUI(player, gym), 2);
  });
}

// ======================================================
// VIEW DEFENDERS
// ======================================================

function openViewDefendersUI(player: Player, teamEntity: Entity) {
  const defenders = getDefenders(teamEntity);
  const body =
    Object.entries(defenders.slots)
      .map(([i, m]: any) => `Slot ${+i + 1}: ${m.species}`)
      .join("\n") || "No defenders";

  new ActionFormData().title("Gym Defenders").body(body).button("Close").show(player);
}

// ======================================================
// RECLAIM DEFENDERS (FROM TAKEOVER POOL)
// ======================================================

export function openGymReclaimUI(player: Player, gym: Entity) {
  const pool = getReclaimPool(gym);
  const mons = pool.byOwner[player.id];

  if (!mons || mons.length === 0) {
    player.sendMessage("§7You have no Pokémon to reclaim here.");
    return;
  }

  const form = new ActionFormData()
    .title("§lReclaim Pokémon")
    .body("These Pokémon were removed when the gym changed ownership.");

  mons.forEach((mon: any) => {
    form.button(`${mon.species}`);
  });

  form.button("§cReclaim All");

  form.show(player).then(res => {
    if (res.canceled || typeof res.selection !== "number") return;

    // ✅ Reclaim All
    if (res.selection === mons.length) {
      for (const mon of mons) {
        reclaimOne(player, mon);
      }
      pool.byOwner[player.id] = [];
    } else {
      const mon = mons[res.selection];
      if (!mon) return;

      reclaimOne(player, mon);
      mons.splice(res.selection, 1);
    }

    gym.setDynamicProperty(GYM_RECLAIM_KEY, JSON.stringify(pool));
    player.sendMessage("§aPokémon reclaimed.");
  });
}

function reclaimOne(player: Player, mon: any) {
  // ✅ Ensure party exists
  if (!selected[player.name]) selected[player.name] = {};
  const party = selected[player.name];

  let slot: number | undefined;
  for (let i = 0; i < 6; i++) {
    if (!party[i]) {
      slot = i;
      break;
    }
  }

  // ✅ Always restore to DB
  if (slot !== undefined) {

  writePokemon(player, mon.species, mon.rID, mon.data);

  party[slot] = [mon.rID, mon.species, mon.data];

    const suffix = slot > 0 ? slot + 1 : "";
    system.run(() => {
      player.runCommand(`scoreboard players set @s poke${suffix}rID ${mon.rID}`);
      player.runCommand(`scoreboard players set @s poke${suffix}Id ${pokemonList.indexOf(mon.species)}`);
      player.runCommand(`scoreboard players set @s poke${suffix}Lvl ${mon.data.level ?? 1}`);
      player.runCommand(`scoreboard players set @s poke${suffix}Var ${mon.data.Variant ?? 0}`);
      player.runCommand(`scoreboard players set @s poke${suffix}HP ${mon.data.Current_Health ?? 0}`);
      player.runCommand(`scoreboard players set @s poke${suffix}HPmax ${mon.data.Base_Health ?? 0}`);
      player.runCommand(
        `scoreboard players set @s poke${suffix}Ball ${Object.keys(ballTags).indexOf(mon.data.pokeBall)}`
      );
    });

    updateSidebar(player, slot);
  } else {

  const { box, slot: pcSlot } = findNextFreePCSlotForPlayer(player);

  mon.data.Box = box;
  mon.data.Slot = pcSlot;

  writePokemon(player, mon.species, mon.rID, mon.data);

  player.sendMessage("§eParty full — Pokémon sent to PC.");
}
}



