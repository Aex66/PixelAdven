import  {world, Player, EquipmentSlot, system} from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

// === Placeholder: Replace or link to your actual implementation
function grammarText(typeId: string): string {
    return typeId.replace("pixelmon:", "").replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// === External menu (Create)
import { openCreateMenu } from "../Pokemon Calculations/pokeCreate"; // Adjust path if needed
import { teamUI } from "../Pokemon Calculations/evolving/main";
import { openFlyMenu } from "./Warps";
import { openBattleMenu } from "../Pokemon Battles/command";
import { openQuestMenu } from "../Main Quests/questMain";
import { openConfigMenu } from "./configMenu";
import { BATTLES } from "../Pokemon Battles/classes/Battle";

export function showBiome(player: Player) {
    // Same biome list used by the /biome command
    const biomes = ["Main", "Mountain", "Forest", "Volcano", "Ocean", "Cave", "Safari", "Swamp", "Jungle", "Frozen"];

    // Find the biome where the player's score = 1
    const foundBiome = biomes.find(biome =>
        world.scoreboard.getObjective(biome)?.getScore(player.scoreboardIdentity) === 1
    );

    if (foundBiome) {
        player.sendMessage(
            `§e---------------------------\n§aYou are currently in the §b"${foundBiome}" §aBiome\n§e---------------------------`
        );
    } else {
        player.sendMessage(
            `§c---------------------------\n§4Could not detect your biome.\n§c---------------------------`
        );
    }
}

// === Radar logic
function euclideanDistance3D(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    return Math.floor(Math.sqrt(dx * dx + dy * dy + dz * dz));
}

function showRadar(player: Player) {
    const foundEntities = player.dimension.getEntities({
        location: player.location,
        maxDistance: 50,
        minDistance: 1,
        tags: ["wild"]
    });

    const { x, y, z } = player.location;
    let message = `      §eWild Pokémon Nearby\n§7---------------------------`;

    for (const entity of foundEntities) {
        const entityX = Math.floor(entity.location.x);
        const entityY = Math.floor(entity.location.y);
        const entityZ = Math.floor(entity.location.z);
        const distance = euclideanDistance3D(x, y, z, entityX, entityY, entityZ);
        message += `\n§b${grammarText(entity.typeId)}§r: §a${distance} blocks§r at §7(${entityX}, ${entityY}, ${entityZ})`;
    }

    if (!foundEntities.length) {
        message += `\n§cNo wild Pokémon detected nearby.`;
    }

    player.sendMessage(message);
}

export function openMenu(player: Player) {
    const form = new ActionFormData()
        .title("§7§7§rMain Menu")
        .body(`§fHello, §b${player.name}`)
        .button("§d§b§rBag","textures/items/bag.png")
        .button("§d§b§rTeam","textures/items/team.png") 
        .button("§d§b§rRadar","textures/items/radar.png") 
        .button("§d§b§rBiome","textures/items/biome.png") 
        .button("§d§b§rGift","textures/items/gift.png") 
        .button("§d§b§rVS","textures/items/vs.png") 
        .button("§d§b§rWarps","textures/items/warp.png")
        .button("§d§b§rQuests","textures/items/quest.png")
        .button("§d§b§rConfig","textures/items/config.png");

    const isOwner = player.hasTag("Owner");
    if (isOwner) form.button("§l➕ Create", "textures/items/create.png");

    // ✅ Add explicit Close Menu button for mobile players
    form.button("§8Close Menu", "textures/items/left_arrow.png");

    form.show(player).then(result => {
        if (result.canceled) return;

        const index = result.selection;
        const options = [
            "Bag", "Team", "Radar", "Biome", "Gift",
            "VS", "Warps", "Quests", "Config"
        ];
        if (isOwner) options.push("Create");
        options.push("Close"); // ✅ matches the last button index

        const selected = options[index];

        switch (selected) {
            case "Bag":
                player.runCommand("scriptevent pokeworld:openBackpack");
                break;
            case "Team":
                teamUI(player);
                break;
            case "Radar":
                showRadar(player);
                break;
            case "Biome":
                showBiome(player);
                break;
            case "Gift":
                player.runCommand("scriptevent gift:open");
                break;
            case "VS":
                openBattleMenu(player);
                break;
            case "Warps":
                openFlyMenu(player);
                break;
            case "Quests":
                openQuestMenu(player);
                break;
            case "Config":
                openConfigMenu(player);
                break;
            case "Create":
                openCreateMenu(player);
                break;
            case "Close":
                player.sendMessage("§7Menu closed.");
                break; // ✅ Clean exit, does nothing
            default:
                player.sendMessage(`You selected: ${selected}`);
                break;
        }
    });
}



// === Trigger menu on book use
world.afterEvents.itemUse.subscribe(event => {
    const player = event.source;
    if (!(player instanceof Player)) return;

    const equipment = player.getComponent("equippable");
    const handItem = equipment?.getEquipment(EquipmentSlot.Mainhand);

    if (handItem?.typeId === "pokeworld:pokedex" && !Array.from(BATTLES.values()).some(battle => battle.entityInBattle(player)) && !player.hasTag("on_plot")) {
        openMenu(player);
    }
});
