import { Player, Entity, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { GymTeam } from "./gymTypes";
import { clearPlayerTeam } from "./playerTeams";

const SPAWN_KEY = "pokeworld:teamSpawns";
const PLAYER_TEAM_KEY = "pokeworld:player_team";

type TeamSpawn = {
  x: number;
  y: number;
  z: number;
  dimension: string;
};

export function openGymAdminUI(player: Player, gym: Entity) {
  // 🔒 HARD PERMISSION CHECK
  if (!player.hasTag("Admin") && !player.hasTag("Owner")) {
    player.sendMessage("§cYou do not have permission to manage gyms.");
    return;
  }

  new ActionFormData()
    .title("§lGym Admin Menu")
    .body(
      "Set battle positions for each Pokémon GO team.\n" +
      "Stand where the team battle NPC should spawn.\n\n" +
      "§c⚠️ Admin-only destructive actions available."
    )
    .button("§cSet Team Valor Position")
    .button("§9Set Team Mystic Position")
    .button("§eSet Team Instinct Position")
    .button("§7View Current Positions")
    .button("👤 Remove Player From Team")
    .button("§4⚠️ RESET ALL GYM DATA")
    .show(player)
    .then(res => {
      if (res.canceled) return;

      // 👀 VIEW POSITIONS
      if (res.selection === 3) {
        openViewPositionsUI(player, gym);
        return;
      }

      // 👤 REMOVE PLAYER FROM TEAM
      if (res.selection === 4) {
        openRemovePlayerFromTeamUI(player);
        return;
      }

      // 🔥 NUKE ALL DATA
      if (res.selection === 5) {
        openConfirmGymResetUI(player, gym);
        return;
      }

      const team: GymTeam =
        res.selection === 0 ? "Valor" :
        res.selection === 1 ? "Mystic" :
        "Instinct";

      let spawns: Partial<Record<GymTeam, TeamSpawn>> = {};

      const raw = gym.getDynamicProperty(SPAWN_KEY);
      if (typeof raw === "string") {
        try {
          spawns = JSON.parse(raw);
        } catch {}
      }

      spawns[team] = {
        x: Math.floor(player.location.x) + 0.5,
        y: Math.floor(player.location.y),
        z: Math.floor(player.location.z) + 0.5,
        dimension: player.dimension.id,
      };

      gym.setDynamicProperty(SPAWN_KEY, JSON.stringify(spawns));
      player.sendMessage(`§a${team} battle position saved.`);
    });
}

// ======================================================
// REMOVE PLAYER FROM TEAM
// ======================================================

function openRemovePlayerFromTeamUI(admin: Player) {
  const players = world.getPlayers();

  if (!players.length) {
    admin.sendMessage("§cNo online players found.");
    return;
  }

  const form = new ActionFormData()
    .title("👤 Remove Player From Team")
    .body("Select an online player to remove from their team:");

  players.forEach(p => form.button(p.name));

  form.show(admin).then(res => {
    if (res.canceled) return;

    const target = players[res.selection];
    if (!target) return;

    forceRemovePlayerFromTeam(admin, target);
  });
}

function forceRemovePlayerFromTeam(admin: Player, target: Player) {
  target.removeTag("Team:Valor");
  target.removeTag("Team:Mystic");
  target.removeTag("Team:Instinct");

  clearPlayerTeam(target);

  target.sendMessage(
    "§cYour team affiliation has been reset by an admin.\n" +
    "§7You may now choose a new team."
  );

  admin.sendMessage(`§a✔ ${target.name} has been removed from their team.`);
}

// ======================================================
// VIEW CURRENT TEAM POSITIONS
// ======================================================

function openViewPositionsUI(player: Player, gym: Entity) {
  let spawns: Partial<Record<GymTeam, TeamSpawn>> = {};

  const raw = gym.getDynamicProperty(SPAWN_KEY);
  if (typeof raw === "string") {
    try {
      spawns = JSON.parse(raw);
    } catch {}
  }

  const lines: string[] = [];

  for (const team of ["Valor", "Mystic", "Instinct"] as GymTeam[]) {
    const pos = spawns[team];
    if (!pos) {
      lines.push(`§7${team}: §cNot Set`);
    } else {
      lines.push(
        `§f${team}: §a${pos.dimension}\n` +
        `§7X:${pos.x.toFixed(1)} Y:${pos.y.toFixed(1)} Z:${pos.z.toFixed(1)}`
      );
    }
  }

  new ActionFormData()
    .title("§lGym Battle Positions")
    .body(lines.join("\n\n"))
    .button("Close")
    .show(player);
}

// ======================================================
// CONFIRM FULL RESET
// ======================================================

function openConfirmGymResetUI(player: Player, gym: Entity) {
  new ActionFormData()
    .title("§4⚠️ CONFIRM GYM RESET")
    .body(
      "§cTHIS WILL PERMANENTLY DELETE:\n\n" +
      "• Gym ownership\n" +
      "• All defenders\n" +
      "• Gym HP\n" +
      "• Team battle spawns\n\n" +
      "§4THIS CANNOT BE UNDONE.\n\n" +
      "Are you absolutely sure?"
    )
    .button("§4YES — RESET EVERYTHING")
    .button("§7Cancel")
    .show(player)
    .then(res => {
      if (res.canceled || res.selection !== 0) {
        player.sendMessage("§7Gym reset canceled.");
        return;
      }

      wipeAllGymData(player, gym);
    });
}

function wipeAllGymData(player: Player, gym: Entity) {
  try {
    gym.runCommand(`event entity @s pokeworld:claimed_reset`);
  } catch {}

  gym.setDynamicProperty("pokeworld:gym_data", undefined);
  gym.setDynamicProperty("pokeworld:teamSpawns", undefined);

  const gymTag = `Gym:${gym.id}`;
  const hpObj = world.scoreboard.getObjective("gym_hp");

  for (const dim of [
    world.getDimension("overworld"),
    world.getDimension("nether"),
    world.getDimension("the_end"),
  ]) {
    for (const ent of dim.getEntities({ tags: [gymTag] })) {
      ent.setDynamicProperty("pokeworld:gym_defenders", undefined);
      if (hpObj && ent.scoreboardIdentity) {
        hpObj.setScore(ent.scoreboardIdentity, 0);
      }
      ent.kill();
    }
  }

  player.sendMessage("§a✔ Gym fully reset (ownership, defenders, HP, entities).");
}
