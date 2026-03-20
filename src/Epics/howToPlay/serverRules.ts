import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { openHowToPlayMain } from "./howToPlayMain";

/**
 * Opens the Server Rules menu with multiple pages.
 */
export function openServerRules(player: Player, page: number = 0) {
  const pages: { title: string; body: string }[] = [
    {
      title: "§e📜 Server Rules (1/3)",
      body: [
        "§lPlease adhere to the following rules while playing.§r",
        "These rules are subject to change at any time.\n",
        "§b1. No Duplicating§r",
        "- §cPunishment:§r Permanent Ban\n",
        "§b2. No Griefing§r",
        "- §eDefinition:§r Intentionally disrupting another player's experience using unintended mechanics.",
        "- §cPunishment:§r Permanent Ban\n",
        "§b3. No Spamming Chats§r",
        "- §cPunishment:§r",
        "  • 1st Offense: 1 Day Mute",
        "  • 2nd Offense: 1 Week Mute",
        "  • 3rd Offense: Permanent Ban\n",
        "§b4. No Harassment§r",
        "- §cPunishment:§r Permanent Ban\n",
        "§b5. No Trolling§r",
        "- §cPunishment:§r Permanent Ban"
      ].join("\n\n")
    },
    {
      title: "§e📜 Server Rules (2/3)",
      body: [
        "§b6. No Hack Clients§r",
        "- Includes receiving hacked items and not reporting it.",
        "- §cPunishment:§r Permanent Ban\n",
        "§b7. No Exploits§r",
        "- Use common sense.",
        "- §cPunishment:§r Permanent Ban\n",
        "§b8. No Scamming Players§r",
        "- §cPunishment:§r",
        "  • 1st Offense: Warning",
        "  • 2nd Offense: 3 Day Ban",
        "  • 3rd Offense: Permanent Ban\n",
        "§b9. No Asking for Items from Staff§r",
        "- §cPunishment:§r",
        "  • 1st Offense: 1 Day Mute",
        "  • 2nd Offense: 1 Week Mute",
        "  • 3rd Offense: Permanent Ban\n",
        "§b10. No Improper Use of 'Support' Bot§r",
        "- §cPunishment:§r",
        "  • 1st Offense: Warning",
        "  • 2nd Offense: 3 Day Ban",
        "  • 3rd Offense: Permanent Ban"
      ].join("\n\n")
    },
    {
      title: "§e📜 Server Rules (3/3)",
      body: [
        "§b11. No Acting or Playing Dumb§r",
        "- Staff time is valuable. Don’t cause unnecessary disruptions.\n",
        "§b12. Respect All Team Members§r",
        "- Staff are players too with real-world responsibilities.\n",
        "§b13. Staff Have the Final Say§r",
        "- Arguing with staff or attempting to overrule their judgment is not allowed.\n",
        "§b14. No Split-Screen Accounts§r",
        "- §cPunishment:§r Permanent Ban\n",
        "§b15. No Invisible Skins§r",
        "- §cPunishment:§r",
        "  • 1st Offense: Warning",
        "  • 2nd Offense: 3 Day Ban",
        "  • 3rd Offense: Permanent Ban\n",
        "§6⚠️ Please follow all rules to keep Pixelmon Adventures fun and fair for everyone!§r"
      ].join("\n\n")
    }
  ];

  const form = new ActionFormData()
    .title(pages[page].title)
    .body(pages[page].body);

  // Navigation buttons
  if (page > 0) form.button("⬅️ Back");
  if (page < pages.length - 1) form.button("➡️ Next Page");
  form.button("🏠 Return to Main Menu");

  form.show(player).then((response) => {
    if (response.canceled) return;
    let index = 0;

    if (page > 0) {
      if (response.selection === index++) return openServerRules(player, page - 1);
    }
    if (page < pages.length - 1) {
      if (response.selection === index++) return openServerRules(player, page + 1);
    }
    openHowToPlayMain(player);
  });
}
