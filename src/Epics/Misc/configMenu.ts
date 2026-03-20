import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { stats } from "../Main/Forms/stats";
import { PlayerType } from "../../Papers/@types/PlayerTypes";
import { openHowToPlayMain } from "../howToPlay/howToPlayMain";
import { openMenu } from "./menu";
import { openRanksMenu } from "./ranksMenu";
import { openXPReclaimMenu } from "./playerRank";
// Helper: get XP status label
function xpStatus(player: Player): string {
  if (player.hasTag("xpDBL")) return "§cAll XP Disabled";
  if (player.hasTag("xpAll")) return "§eTeam XP Disabled";
  return "§aTeam XP Enabled";
}

/**
 * Opens the Config menu.
 */
export function openConfigMenu(player: Player) {
  const sbEnabled = player.hasTag("sbOff");

  const form = new ActionFormData()
    .title("§7§rConfig")
    .body("Configure your preferences or view information menus:")
    .button(`Sidebar Toggle\n§7Status: ${sbEnabled ? "§cDisabled" : "§aEnabled"}`, "textures/items/sidebar.png")
    .button(`XP Mode\n§7Status: ${xpStatus(player)}`, "textures/items/xp_all.png")
    .button("Stats", "textures/items/stat_icon.png")
    .button("📘 How To Play", "textures/items/htp_icon.png")
    .button("Rank Titles", "textures/items/ranks.png")
    .button("⬆ Update Player Rank", "textures/items/emerald.png")
    .button("Back", "textures/items/left_arrow.png");

  form.show(player).then((res) => {
    if (res.canceled) return;

    switch (res.selection) {
      case 0: { // Sidebar toggle
        if (player.hasTag("sbOff")) {
          player.removeTag("sbOff");
          player.sendMessage("§eSidebar Toggle: §aEnabled");
        } else {
          player.addTag("sbOff");
          player.sendMessage("§eSidebar Toggle: §cDisabled");
        }
        openConfigMenu(player);
        break;
      }

      case 1: { // XP Mode toggle
        if (player.hasTag("xpAll")) {
          player.removeTag("xpAll");
          player.addTag("xpDBL");
          player.sendMessage("§eXP Mode: §cAll XP Disabled");
        } else if (player.hasTag("xpDBL")) {
          player.removeTag("xpDBL");
          player.sendMessage("§eXP Mode: §aTeam XP Enabled");
        } else {
          player.addTag("xpAll");
          player.sendMessage("§eXP Mode: §eTeam XP Disabled");
        }
        openConfigMenu(player);
        break;
      }

      case 2: { // Stats
        stats(player as unknown as PlayerType);
        break;
      }

      case 3: { // How To Play
        openHowToPlayMain(player);
        break;
      }

      case 4: { // Rank Titles
        openRanksMenu(player);
        break;
      }

      case 5: { // ✅ Update Player Rank (XP reclaim / sync)
        openXPReclaimMenu(player);
        break;
      }

      case 6: { // Back
        openMenu(player);
        break;
      }
    }
  });
}
