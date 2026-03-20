import { world, Player, system } from "@minecraft/server";
import { openGymAdminUI } from "./gymAdminUI";
import { openGymMainUI, openTeamSelectUI, openGymReclaimUI, playerHasReclaimablePokemon } from "./gymUI";
import { getGymData, saveGymData } from "./gymStorage";
import { getPlayerTeam } from "./playerTeams";
import { claimGym } from "./gymClaim";

const GYM_ENTITY = "pokeworld:player_team_gym";

function isValidTeam(team: unknown): team is string {
  return team === "Valor" || team === "Mystic" || team === "Instinct";
}

world.afterEvents.entityHitEntity.subscribe(ev => {
  const player = ev.damagingEntity;
  const gym = ev.hitEntity;

  if (!(player instanceof Player)) return;
  if (!gym || gym.typeId !== GYM_ENTITY) return;

  // ======================================================
  // 🛠️ ADMIN / OWNER MENU
  // ======================================================
  if (
    player.isSneaking &&
    (player.hasTag("Admin") || player.hasTag("Owner"))
  ) {
    openGymAdminUI(player, gym);
    return;
  }

  const data = getGymData(gym);
  const playerTeam = getPlayerTeam(player);

  // ======================================================
  // 🟨 NO TEAM → OPEN TEAM SELECT
  // ======================================================
  if (!isValidTeam(playerTeam)) {
    openTeamSelectUI(player, gym);

    system.runTimeout(() => {
      const updatedTeam = getPlayerTeam(player);
      const updatedData = getGymData(gym);

      if (!isValidTeam(updatedTeam)) return;
      if (updatedData.team) return;

      updatedData.team = updatedTeam;
      saveGymData(gym, updatedData);

      claimGym(gym, updatedTeam);

      player.sendMessage(`§aYou claimed this gym for Team ${updatedTeam}!`);
      openGymMainUI(player, gym);
    }, 1);

    return;
  }

  // ======================================================
  // 🟥 UNCLAIMED → CLAIM GYM
  // ======================================================
  if (!data.team) {
    data.team = playerTeam;
    saveGymData(gym, data);

    claimGym(gym, playerTeam);

    player.sendMessage(`§aYou claimed this gym for Team ${playerTeam}!`);
    openGymMainUI(player, gym);
    return;
  }

  // ======================================================
  // 🟦 SAME TEAM → MANAGEMENT
  // ======================================================
  if (data.team === playerTeam) {
    openGymMainUI(player, gym);
    return;
  }

  // ======================================================
  // 🟥 ENEMY TEAM
  // ======================================================
  if (playerHasReclaimablePokemon(gym, player)) {
    openGymReclaimUI(player, gym);
    return;
  }

  player.sendMessage("§cThis gym is controlled by another team.");
});
