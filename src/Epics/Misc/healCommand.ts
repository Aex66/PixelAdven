import { Player, world } from "@minecraft/server";
import { selected } from "../Main/Forms/PC/main";
import { writePokemon } from "../Pokemon Database/main";
import { updateSidebar } from "../Pokemon Calculations/updateTeam";
import pokemonMoves from "../../Letters/pokemon/moves";
import { ActionFormData } from "@minecraft/server-ui";
import Commands from "../../Papers/CommandPaper/CommandPaper";

function getPP(moveID: number): number | null {
    if (typeof moveID !== "number" || moveID < 0) {
        return null;
    }
    const move = Object.values(pokemonMoves).find(m => m.id === moveID);
    if (!move) {return null;}
    if (typeof move.pp !== "number") {return null;}
    if (move.pp <= 0) {return null;}
    return move.pp;
}
world.afterEvents.entityHitEntity.subscribe(data => {
  if (!(data.damagingEntity instanceof Player)) return;
  if (data.hitEntity.typeId === "pokeworld:nurse_nico") {
    handleNurseNico(data.damagingEntity);
  }
});
function handleNurseNico(player: Player) {
  const stage = Number(player.getDynamicProperty("quest_chapter1_stage") ?? 0);
  if (stage === 2) {
    const form = new ActionFormData()
      .title("§dNurse Nico")
      .body("§fWelcome, young Trainer!\nYour journey is just beginning. I’ll be here whenever you and your Pokémon need healing.")
      .button("§aThank you!");
      form.show(player).then(res => {
      if (res.canceled) return;
      player.setDynamicProperty("quest_chapter1_stage", 3);
      player.sendMessage("§dQuest updated: Nurse Nico will now heal your Pokémon!");
    });
    return;
  }
  heal(player);
}
function heal(player: Player) {
    for (let i = 0; i < 6; i++) {
        if (!selected.hasOwnProperty(player.name)) selected[player.name] = {};
        if (!selected[player.name].hasOwnProperty(i.toString())) continue;
        if (!selected[player.name][i]?.[1]?.length) continue;
        const pokemon = selected[player.name][i][2];
        pokemon.Current_Health = pokemon.Base_Health;
        pokemon.condition = 0;
        const moveIDs = [pokemon[`Move1`],pokemon[`Move2`],pokemon[`Move3`],pokemon[`Move4`]];

        for (let j = 0; j < 4; j++) {
            const moveKey = `Move${j + 1}`;
            const ppKey = `Move${j + 1}_PP`;
            const moveID = (pokemon as any)[moveKey];

            const pp = getPP(moveID);
            if (pp !== null) {
                (pokemon as any)[ppKey] = pp;
            }

            writePokemon(player, selected[player.name][i][1], selected[player.name][i][0], pokemon);
        }
    }
    updateSidebar(player);
    player.sendMessage("§dNurse Nico§f: Your Pokémon have been fully restored! We hope to see you again!");
}

// ===============================================
// ✅ /heal COMMAND (5 MIN COOLDOWN)
// ===============================================
const cmd = Commands.create({
    name: "heal",
    description: "Heals your Pokémon (5 minute cooldown)",
    admin: false,
    category: "Utility",
});

const HEAL_COOLDOWN_SECONDS = 60 * 5; // 5 minutes
const HEAL_COOLDOWN_KEY = "cmd_heal_last_used"; // dynamic property key

cmd.callback(async (player: Player) => {
    const now = Math.floor(Date.now() / 1000);
    const lastUsed = Number(player.getDynamicProperty(HEAL_COOLDOWN_KEY) ?? 0);
    const elapsed = now - lastUsed;
    const remaining = HEAL_COOLDOWN_SECONDS - elapsed;
    if (remaining > 0) {
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        return player.sendMessage(
            `§cYou must wait §e${mins}m ${secs}s §cbefore using §d/heal§c again.`
        );
    }
    heal(player);
    player.setDynamicProperty(HEAL_COOLDOWN_KEY, now);
    player.sendMessage("§dYour Pokémon have been fully restored! §7(§e/heal cooldown: 5m§7)");
});