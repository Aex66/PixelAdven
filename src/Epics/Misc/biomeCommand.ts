import { world } from "@minecraft/server";
import Commands from "../../Papers/CommandPaper/CommandPaper";
const cmd = Commands.create({
    name: 'biome',
    description: 'This command tells you what biome your in',
    admin: true,
    category: "Misc"
});
cmd.callback((player) => {
    let biomes = ["Main", "Mountain", "Forest", "Volcano", "Ocean", "Cave", "Safari", "Swamp", "Jungle", "Frozen"]
    let foundBiome = biomes.find(i => world.scoreboard.getObjective(i)?.getScore(player) === 1);
    if (foundBiome) player.sendMessage(`---------------------------\n Your In The "${foundBiome}" Biome \n---------------------------`)
    else player.sendMessage(`---------------------------\n Could not locate your biome \n---------------------------`)
})