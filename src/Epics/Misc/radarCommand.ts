/*
  radarCommand.js — Bedrock 1.21.80 (Script API 2.0.0‑beta)
  -----------------------------------------------------------
  Adds /creator:* commands to open various Pokémon menus.
  Fixes privilege errors by deferring all privileged actions with system.run().
*/

import {
  system,
  Player,
  CustomCommandOrigin,
  CustomCommandStatus,
  CommandPermissionLevel,
  CustomCommandRegistry,
} from "@minecraft/server";
import { grammarText } from "../../Papers/Paragraphs/ExtrasParagraphs";
// Helper to check if a player is Admin/Owner
function isOperator(player: Player): boolean {
  return player.hasTag("Admin") || player.hasTag("Owner");
}

system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {

  // === /creator:radar (as you originally wrote it) ===
  const radarCommandDefinition = {
  name: "pk:radar",
  description: "Lists nearby wild Pokémon within range",
  permissionLevel: CommandPermissionLevel.Any,
  mandatoryParameters: [] as never[],
  optionalParameters: [] as never[],
};

  const executeRadar = (
  origin: CustomCommandOrigin,
  _parameters: {}
) => {
  const player = origin.sourceEntity;
  if (!(player instanceof Player)) {
    return {
      status: CustomCommandStatus.Failure,
      message: "§cError: Only players can use this command.",
    };
  }

  const effectiveRange = 50;
  const { x, y, z } = player.location;

  const foundEntities = player.dimension.getEntities({
    location: player.location,
    maxDistance: effectiveRange,
    minDistance: 1,
    tags: ["wild"],
  });

  if (foundEntities.length === 0) {
    player.sendMessage(`§a[Radar] §fNo wild Pokémon found within ${effectiveRange} blocks.`);
    return { status: CustomCommandStatus.Success };
  }

  let responseMessage = `      §aWild Pokémon Nearby§r\n--------------------------`;
  for (const entity of foundEntities) {
    const { x: ex, y: ey, z: ez } = entity.location;
    const blocksAway = Math.floor(Math.sqrt((x - ex) ** 2 + (y - ey) ** 2 + (z - ez) ** 2));
    const entityName = grammarText(entity.typeId);
    const coords = `(${Math.floor(ex)}, ${Math.floor(ey)}, ${Math.floor(ez)})`;
    responseMessage += `\n§f${entityName}: §e${blocksAway}m away §7at ${coords}`;
  }

  player.sendMessage(responseMessage);
  return { status: CustomCommandStatus.Success };
};

  customCommandRegistry.registerCommand(radarCommandDefinition, executeRadar);

  // === Helper for simple command registration ===
  function registerCommand(
    name: string,
    description: string,
    handler: (player: Player) => void,
    requireOP = false
  ) {
    customCommandRegistry.registerCommand(
      {
        name: `pk:${name}`,
        description,
        permissionLevel: CommandPermissionLevel.Any,
    mandatoryParameters: [] as never[],
    optionalParameters: [] as never[],
      },
      (origin: CustomCommandOrigin) => {
        const player = origin.sourceEntity;
        if (!(player instanceof Player)) {
          return {
            status: CustomCommandStatus.Failure,
            message: `§c[${name}] This command is for players only.`,
          };
        }

        if (requireOP && !isOperator(player)) {
          return {
            status: CustomCommandStatus.Failure,
            message: `§c[${name}] You do not have permission to use this command.`,
          };
        }

        system.run(() => {
          try {
            handler(player);
          } catch (err) {
            //console.warn(`[${name}] Error:`, err);
            player.sendMessage(`§c[${name}] Failed to open menu.`);
          }
        });

        return { status: CustomCommandStatus.Success };
      }
    );
  }

// === Register all commands (handlers lazy-import their modules) ===

  // Bag -> scriptevent (wrap in system.run to avoid privilege timing issues)
  registerCommand("bag", "Open your backpack", async (player) => {
    system.run(() => {
      player.runCommand("scriptevent pokeworld:openBackpack");
    });
  });

  // Team -> lazy import teamUI
  registerCommand("team", "View your Pokémon team", async (player) => {
    const { teamUI } = await import("../Pokemon Calculations/evolving/main.js");
    // teamUI may touch privileged APIs internally; let it handle its own system.run if needed.
    teamUI(player);
  });

  // Biome -> lazy import showBiome
  registerCommand("biome", "Show your current biome", async (player) => {
    const { showBiome } = await import("./menu.js");
    showBiome(player);
  });

  // Gift -> scriptevent
  registerCommand("gift", "Open daily gift menu", async (player) => {
    system.run(() => {
      player.runCommand("scriptevent gift:open");
    });
  });

  // VS -> lazy import openBattleMenu
  registerCommand("vs", "Open PvP menu", async (player) => {
    const { openBattleMenu } = await import("../Pokemon Battles/command.js");
    openBattleMenu(player);
  });

  // Warps -> lazy import openFlyMenu
  registerCommand("warps", "Open fast travel menu", async (player) => {
    const { openFlyMenu } = await import("./Warps.js");
    openFlyMenu(player);
  });

  // Quests -> lazy import openQuestMenu
  registerCommand("quests", "Open quest tracker", async (player) => {
    const { openQuestMenu } = await import("../Main Quests/questMain.js");
    openQuestMenu(player);
  });

  // Create (OP only) -> lazy import openCreateMenu
  registerCommand("createpk", "Open Pokémon creation menu", async (player) => {
    const { openCreateMenu } = await import("../Pokemon Calculations/pokeCreate.js");
    openCreateMenu(player);
  }, true);
});
export function registerCommands(customCommandRegistry: CustomCommandRegistry) {
    throw new Error("Function not implemented.");
}

