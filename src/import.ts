import "./Epics/Misc/radarCommand.js";
import { system } from "@minecraft/server"

system.run(() => {
  import("./main.js");
})

//hi