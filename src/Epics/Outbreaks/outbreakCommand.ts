import { Player, system, world } from "@minecraft/server";
import Commands from "../../Papers/CommandPaper/CommandPaper";
import { ActionFormData } from "@minecraft/server-ui";
import { outbreakZones, OutbreakSpeciesFamily } from "./outbreakData";
import { activeOutbreaks } from "./outbreakManager";

// 🧬 Helper – evolution roll
function rollEvolutionStage(family: OutbreakSpeciesFamily): string {
  const [baseWeight, midWeight = 0, finalWeight = 0] = family.weights ?? [100, 0, 0];
  const total = baseWeight + midWeight + finalWeight;
  const roll = Math.random() * total;
  if (roll < baseWeight) return family.base;
  if (roll < baseWeight + midWeight && family.middle) return family.middle;
  return family.final ?? family.base;
}

// 📜 Create Command
const cmd = Commands.create({
  name: "outbreak",
  description: "Open the Outbreak Control Menu",
  admin: true,
  category: "Events",
});

cmd.callback((player: Player) => {
  if (!player.hasTag("Owner") && !player.hasTag("Admin")) {
    player.sendMessage("§cYou do not have permission to use this command.");
    return;
  }

  player.sendMessage("§7Opening outbreak menu...");
  system.runTimeout(() => {
    const mainMenu = new ActionFormData()
      .title("§6📍 Outbreak Control")
      .body("Choose an outbreak option:")
      .button("§aTrigger Random Outbreak")
      .button("§bTrigger Specific Zone")
      .button("§cCancel");

    mainMenu.show(player).then((selection) => {
      if (selection.canceled || selection.selection === 2) return;

      // === RANDOM OUTBREAK ===
      if (selection.selection === 0) {
        const zone = outbreakZones[Math.floor(Math.random() * outbreakZones.length)];
        const family = zone.families[Math.floor(Math.random() * zone.families.length)];
        const species = rollEvolutionStage(family);
        const id = Math.floor(Math.random() * 999999);

        const outbreak = {
          id,
          species,
          location: zone,
          remaining: 20,
          active: 0,
          spawned: 0, // ✅ required for new logic
          timer: 20 * 60 * 20, // 20 min
          idleTimer: 20 * 60 * 30, // 30 min unvisited timeout
        };

        activeOutbreaks.push(outbreak);
        world.setDynamicProperty(`outbreak_active_${id}`, JSON.stringify(outbreak));

        world.sendMessage(
          `§6[Outbreak] §fA mass outbreak of §e${species.replace("pokeworld:wild_", "")}§f has been reported in §b${zone.name}§f §7(${zone.x}, ${zone.y}, ${zone.z})§f!`
        );

        player.sendMessage("§a✅ Random outbreak triggered successfully!");
        return;
      }

      // === SPECIFIC ZONE ===
      if (selection.selection === 1) {
        const zoneMenu = new ActionFormData()
          .title("§b🌍 Choose a Zone")
          .body("Select a zone to start an outbreak in:");

        for (const zone of outbreakZones) zoneMenu.button(zone.name);

        zoneMenu.show(player).then((zoneSel) => {
          if (zoneSel.canceled) return;
          const zone = outbreakZones[zoneSel.selection];
          if (!zone) return;

          const speciesMenu = new ActionFormData()
            .title(`§b${zone.name}`)
            .body("Select a Pokémon family:");

          for (const family of zone.families) {
            const baseName = family.base.replace("pokeworld:wild_", "");
            const display = family.final ? `${baseName} (${baseName} Line)` : baseName;
            speciesMenu.button(display);
          }

          speciesMenu.show(player).then((specSel) => {
            if (specSel.canceled) return;
            const family = zone.families[specSel.selection];
            const species = rollEvolutionStage(family);
            const id = Math.floor(Math.random() * 999999);

            const outbreak = {
              id,
              species,
              location: zone,
              remaining: 20,
              active: 0,
              spawned: 0, // ✅ added
              timer: 20 * 60 * 20, // 20 minutes
              idleTimer: 20 * 60 * 30, // 30 minutes unvisited timeout
            };

            activeOutbreaks.push(outbreak);
            world.setDynamicProperty(`outbreak_active_${id}`, JSON.stringify(outbreak));

            world.sendMessage(
              `§6[Outbreak] §fA mass outbreak of §e${species.replace("pokeworld:wild_", "")}§f has been reported in §b${zone.name}§f §7(${zone.x}, ${zone.y}, ${zone.z})§f!`
            );

            player.sendMessage(`§a✅ Outbreak started in §b${zone.name}§a!`);
          });
        });
      }
    });
  }, 60); // 2-second delay to let chat close
});
