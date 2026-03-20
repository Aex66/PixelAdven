// Epics/Misc/commands.bootstrap.js  (NEW)
import { system } from "@minecraft/server";

system.beforeEvents.startup.subscribe(async ({ customCommandRegistry }) => {
  // Load the heavy command module only when startup fires (privilege-safe)
  const mod = await import("./radarCommand.js");
  // Call its exported function to register commands
  mod.registerCommands(customCommandRegistry);
});
