import "./Epics/Misc/radarCommand.js";
import { world } from "@minecraft/server"

world.afterEvents.worldLoad.subscribe(() => {
    import("./main.js");
  })
