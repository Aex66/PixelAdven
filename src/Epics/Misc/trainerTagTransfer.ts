import { Player, system, world } from "@minecraft/server";
import Commands from "../../Papers/CommandPaper/CommandPaper";
import { ActionFormData } from "@minecraft/server-ui";

// 🧩 Data helpers
interface TrainerData {
  trainerTypes: string[];
}

function getTrainerData(player: Player): TrainerData {
  const raw = world.getDynamicProperty(`trainer_data.${player.name}`);
  if (typeof raw !== "string") return { trainerTypes: [] };
  try {
    const data = JSON.parse(raw);
    if (Array.isArray(data.trainerTypes)) return data as TrainerData;
  } catch {}
  return { trainerTypes: [] };
}

function saveTrainerData(player: Player, data: TrainerData): void {
  world.setDynamicProperty(`trainer_data.${player.name}`, JSON.stringify(data));
}

// =========================================================
// ✅ ADMIN MENU LOGIC
// =========================================================

// Step 2 Menu as a function
function openTrainerDataMenu(admin: Player, target: Player) {
  const data = getTrainerData(target);
  const menu = new ActionFormData()
    .title(`§d${target.name}'s Trainer Data`)
    .body("Select a stored Trainer Type to remove:");

  // 🔴 Delete All button (first)
  menu.button("§4Remove ALL Trainer Types");

  // Individual removal buttons
  for (const t of data.trainerTypes) {
    menu.button(`§c${t}`);
  }

  // Navigation Footer
  menu.button("§7⬅ Back");
  menu.button("§8Close");

  menu.show(admin).then((res) => {
    if (res.canceled) return;

    const index = res.selection;
    const totalTypes = data.trainerTypes.length;

    if (index === 0) {
      confirmDeleteAll(admin, target);
      return;
    }

    if (index >= 1 && index <= totalTypes) {
      const tagToRemove = data.trainerTypes[index - 1];
      confirmSingleDelete(admin, target, tagToRemove);
      return;
    }

    if (index === totalTypes + 1) {
      selectPlayerMenu(admin);
      return;
    }

    if (index === totalTypes + 2) return;
  });
}

// Confirm Remove One
function confirmSingleDelete(admin: Player, target: Player, tag: string) {
  const confirm = new ActionFormData()
    .title("§cConfirm Removal")
    .body(`Remove §e${tag}§c from §b${target.name}§c's data?`)
    .button("§aYes, remove it")
    .button("§cCancel");

  confirm.show(admin).then((res) => {
    if (res.canceled || res.selection === 1) {
      openTrainerDataMenu(admin, target);
      return;
    }

    const stored = getTrainerData(target);
    const idx = stored.trainerTypes.indexOf(tag);
    if (idx !== -1) stored.trainerTypes.splice(idx, 1);
    saveTrainerData(target, stored);

    admin.sendMessage(`§aSuccessfully removed §b${tag}§a.`);
    target.sendMessage(`§cAdmin removed your trainer type: §e${tag}`);
    
    system.runTimeout(() => openTrainerDataMenu(admin, target), 2);
  });
}

// Confirm Delete All
function confirmDeleteAll(admin: Player, target: Player) {
  const confirm = new ActionFormData()
    .title("§cRemove ALL Trainer Types")
    .body(`Remove ALL stored TrainerType progress for §b${target.name}§c?`)
    .button("§4YES, delete everything")
    .button("§cCancel");

  confirm.show(admin).then((res) => {
    if (res.canceled || res.selection === 1) {
      openTrainerDataMenu(admin, target);
      return;
    }

    saveTrainerData(target, { trainerTypes: [] });
    admin.sendMessage(`§cAll Trainer Types removed from §e${target.name}.`);
    target.sendMessage("§cAll stored TrainerType progress has been reset.");

    system.runTimeout(() => openTrainerDataMenu(admin, target), 2);
  });
}

// Step 1 Menu as a function
function selectPlayerMenu(admin: Player) {
  const onlinePlayers = world.getAllPlayers();
  const menu = new ActionFormData()
    .title("§bTrainer Data Manager")
    .body("Select a player to manage:");
  
  for (const p of onlinePlayers) {
    menu.button(`§e${p.name}`);
  }

  menu.button("§8Close");

  menu.show(admin).then((res) => {
    if (res.canceled || res.selection === onlinePlayers.length) return;
    const target = onlinePlayers[res.selection];
    if (!target) return;
    openTrainerDataMenu(admin, target);
  });
}

// =========================================================
// ✅ COMMAND ENTRY POINT
// =========================================================
const cmd = Commands.create({
  name: "trainerdata",
  description: "View or modify trainer tag data for players",
  admin: true,
  category: "Admin",
});

cmd.callback((player: Player) => {
  if (!player.hasTag("Admin") && !player.hasTag("Owner")) {
    player.sendMessage("§cYou do not have permission.");
    return;
  }

  system.runTimeout(() => selectPlayerMenu(player), 60);
});

// =========================================================
// ✅ PERIODIC SYNC FOR TRAINER TAGS + AUTO-RUN CH5 SCRIPT EVENTS
// =========================================================
system.runInterval(() => {
  for (const player of world.getAllPlayers()) {
    const stored = getTrainerData(player);
    let modified = false;

    // =========================================================
    // 🔄 Auto-migrate old short format → full "TrainerType:*"
    // =========================================================
    const migrated: string[] = [];
    for (const t of stored.trainerTypes) {
      if (!t.startsWith("TrainerType:")) {
        const full = `TrainerType:${t}`;
        if (!migrated.includes(full)) migrated.push(full);
        modified = true;
      } else {
        if (!migrated.includes(t)) migrated.push(t);
      }
    }
    stored.trainerTypes = migrated;

    // =========================================================
    // 🔄 Capture new TrainerType:* tags & remove from player
    // =========================================================
    for (const tag of player.getTags()) {
      if (tag.startsWith("TrainerType:")) {
        if (!stored.trainerTypes.includes(tag)) {
          stored.trainerTypes.push(tag);
          modified = true;
        }
        player.removeTag(tag);
      }
    }

    // =========================================================
    // 🔥 AUTO-RUN MISSING SCRIPT EVENTS FOR CHAPTER 5 GYMS
    // =========================================================

    // Load memory of gym events already fired
    let fired: string[] = [];
    try {
      fired = JSON.parse(player.getDynamicProperty("quest_chapter5_fired") as string ?? "[]");
    } catch {
      fired = [];
    }

    // Map trainer tags → gym script events
    const gymMap: Record<string, string> = {
      "TrainerType:RockGymTeam": "rock",
      "TrainerType:DarkGymTeam": "dark",
      "TrainerType:DragonGymTeam": "dragon",
      "TrainerType:IceGymTeam": "ice",
      "TrainerType:GrassGymTeam": "grass",
      "TrainerType:WaterGymTeam": "water",
      "TrainerType:FlyingGymTeam": "flying",
      "TrainerType:FireGymTeam": "fire"
    };

    // Check all stored trainer types
    for (const tag of stored.trainerTypes) {
      const gym = gymMap[tag];
      if (!gym) continue; // not a gym trainer type

      // Only fire once per gym
      if (!fired.includes(gym)) {
        // Trigger the correct script event
        player.runCommand(`scriptevent pokeworld:quest_chapter5_${gym}`);

        // Mark as fired
        fired.push(gym);
      }
    }

    // Save updated fired memory
    player.setDynamicProperty("quest_chapter5_fired", JSON.stringify(fired));

    // =========================================================
    // 💾 Save trainer data if modified
    // =========================================================
    if (modified) saveTrainerData(player, stored);
  }
}, 200); // ≈ every 10 seconds