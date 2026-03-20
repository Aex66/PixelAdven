import { Player, system, world } from "@minecraft/server";
import { writePokemon } from "../Pokemon Database/main";
import { ActionForm } from "../../Papers/FormPaper";
import pokemonList from "../../Letters/pokemon/list";
import { selected } from "../Main/Forms/PC/main";
import { PokemonName, calculatePokemon, checkSidebarFree } from "./calculations";
import { ballTags } from "./catch";
import { Backpack} from "../Misc/backbag";
import { backpackConfig } from "../../Letters/pokemon/backpackConfig";
interface pokeData {
    [region: string]: { type: string, imagePath: string }[]
}

let pokemonData: pokeData = {
    Kanto: [
        {
            type: "Charmander",
            imagePath: "textures/items/item_base_UI/Charmander.png", //Change this to the actual path to the charmander image
        },
        {
            type: "Bulbasaur",
            imagePath: "textures/items/item_base_UI/Bulbasaur.png", //Change this to the actual path to the charmander image
        },
        {
            type: "Squirtle",
            imagePath: "textures/items/item_base_UI/Squirtle.png", //Change this to the actual path to the charmander image
        }
    ],
    Johto: [
        {
            type: "Chikorita",
            imagePath: "textures/items/item_base_UI/Chikorita.png", //Change this to the actual path to the charmander image
        },
        {
            type: "Cyndaquil",
            imagePath: "textures/items/item_base_UI/Cyndaquil.png", //Change this to the actual path to the charmander image
        },
        {
            type: "Totodile",
            imagePath: "textures/items/item_base_UI/Totodile.png", //Change this to the actual path to the charmander image
        },
    ],
    Hoenn: [
        {
            type: "Treecko",
            imagePath: "textures/items/item_base_UI/Treecko.png", //Change this to the actual path to the charmander image
        },
        {
            type: "Torchic",
            imagePath: "textures/items/item_base_UI/Torchic.png", //Change this to the actual path to the charmander image
        },
        {
            type: "Mudkip",
            imagePath: "textures/items/item_base_UI/Mudkip.png", //Change this to the actual path to the charmander image
        },
    ],
    Sinnoh: [
        {
            type: "Turtwig",
            imagePath: "textures/items/item_base_UI/Turtwig.png", //Change this to the actual path to the charmander image
        },
        {
            type: "Chimchar",
            imagePath: "textures/items/item_base_UI/Chimchar.png", //Change this to the actual path to the charmander image
        },
        {
            type: "Piplup",
            imagePath: "textures/items/item_base_UI/Piplup.png", //Change this to the actual path to the charmander image
        },
    ],
    Unova: [
        {
            type: "Snivy",
            imagePath: "textures/items/item_base_UI/Snivy.png", //Change this to the actual path to the charmander image
        },
        {
            type: "Tepig",
            imagePath: "textures/items/item_base_UI/Tepig.png", //Change this to the actual path to the charmander image
        },
        {
            type: "Oshawott",
            imagePath: "textures/items/item_base_UI/Oshawott.png", //Change this to the actual path to the charmander image
        },
    ],
    Kalos: [
        {
            type: "Chespin",
            imagePath: "textures/items/item_base_UI/Chespin.png", //Change this to the actual path to the charmander image
        },
        {
            type: "Fennekin",
            imagePath: "textures/items/item_base_UI/Fennekin.png", //Change this to the actual path to the charmander image
        },
        {
            type: "Froakie",
            imagePath: "textures/items/item_base_UI/Froakie.png", //Change this to the actual path to the charmander image
        },
    ],
    Alola: [
        {
            type: "Rowlet",
            imagePath: "textures/items/item_base_UI/Rowlet.png", //Change this to the actual path to the charmander image
        },
        {
            type: "Litten",
            imagePath: "textures/items/item_base_UI/Litten.png", //Change this to the actual path to the charmander image
        },
        {
            type: "Popplio",
            imagePath: "textures/items/item_base_UI/Popplio.png", //Change this to the actual path to the charmander image
        },
    ],
    Galar: [
        {
            type: "Grookey",
            imagePath: "textures/items/item_base_UI/Grookey.png", //Change this to the actual path to the charmander image
        },
        {
            type: "Scorbunny",
            imagePath: "textures/items/item_base_UI/Scorbunny.png", //Change this to the actual path to the charmander image
        },
        {
            type: "Sobble",
            imagePath: "textures/items/item_base_UI/Sobble.png", //Change this to the actual path to the charmander image
        },
    ],
    Paldea: [
        {
            type: "Sprigatito",
            imagePath: "textures/items/item_base_UI/Sprigatito.png", //Change this to the actual path to the charmander image
        },
        {
            type: "Fuecoco",
            imagePath: "textures/items/item_base_UI/Fuecoco.png", //Change this to the actual path to the charmander image
        },
        {
            type: "Quaxly",
            imagePath: "textures/items/item_base_UI/Quaxly.png", //Change this to the actual path to the charmander image
        },
    ]
}




world.afterEvents.entityHitEntity.subscribe(async (eventData) => {
    const { damagingEntity, hitEntity } = eventData;

    // Ensure the damager is a player
    if (!(damagingEntity instanceof Player)) return;

    // Ensure the target is the professor
    if (hitEntity?.typeId !== "pokeworld:professor") return;

    // Check if the player has already claimed their starter
    if (damagingEntity.hasTag("ClaimedStarter")) {
        damagingEntity.sendMessage("You Have Already Claimed Your Starter");
        return;
    }

    // Open the starter menu
    openFormP1(damagingEntity);
    //console.error(`Free Slot: ${checkSidebarFree(damagingEntity)}`);
});

function openFormP1(player: Player) {
    let form = new ActionForm();
    form.setTitle("Choose Region");
    Object.keys(pokemonData).forEach(regionName => form.addButton(regionName));
    form.send(player, (response) => {
        if (response.canceled || response.selection === undefined) return;

        let selectedRegion = Object.keys(pokemonData)[response.selection];
        openFormP2(player, selectedRegion);
    });
}

function openFormP2(player: Player, region: string) {
    //console.warn(`Opening starters for region: ${region}`);
    const form = new ActionForm();
    form.setTitle("§8§8§rChoose A Starter");

    const starters = pokemonData[region]?.filter(mon => mon.imagePath?.trim()) ?? [];

    starters.forEach(mon => {
        form.addButton(mon.type, mon.imagePath);
    });
    form.addButton('Back', 'textures/ui/seventh/undo.png');

    form.send(player, (response) => {
        if (response.canceled || response.selection === undefined) return;

        if (response.selection === starters.length) {
            openFormP1(player);
            return;
        }

        const selectedMon = starters[response.selection];
        openStarterConfirmation(player, selectedMon.type);
    });
}

function openStarterConfirmation(player: Player, pokemonId: string) {
    const confirmForm = new ActionForm();
    confirmForm.setTitle(`Confirm Choice`);
    confirmForm.setBody(`Are you sure you want to choose §e${pokemonId}§r as your starter?`);
    confirmForm.addButton("Yes");
    confirmForm.addButton("No");

    confirmForm.send(player, (response) => {
        if (response.canceled || response.selection === undefined) return;

        if (response.selection === 0) {
            if (!pokemonList.includes(pokemonId as PokemonName)) {
                player.sendMessage(`§cError: Unknown Pokémon "${pokemonId}"`);
                return;
            }

            const variant = 0;
            const calculations = calculatePokemon(pokemonId as PokemonName, variant, "pokeball");
            const rID = ~~(Math.random() * 999999999);

            writePokemon(player, pokemonId as PokemonName, rID, calculations);

            const freeSlot = checkSidebarFree(player);
            const slot = freeSlot === undefined || freeSlot === -1 ? undefined : freeSlot;

            player.sendMessage(`§a✚ §7You Have Received A "${pokemonId}"`);
            if (slot === undefined) {
                player.sendMessage(`§a✚ §7Pokemon Sent To Your PC`);
            } else {
                player.sendMessage(`§a✚ §7Pokemon Added To Your Party`);
            }

            if (!selected.hasOwnProperty(player.name)) selected[player.name] = {};

            if (slot !== undefined) {
                selected[player.name][slot] = [Number(rID), pokemonId, calculations];

                system.run(() => {
                    const suffix = slot > 0 ? slot + 1 : '';
                    player.runCommand(`scoreboard players set @s poke${suffix}rID ${rID}`);
                    player.runCommand(`scoreboard players set @s poke${suffix}Id ${pokemonList.indexOf(pokemonId as PokemonName)}`);
                    player.runCommand(`scoreboard players set @s poke${suffix}Ball ${Object.keys(ballTags).indexOf(calculations.pokeBall)}`);
                    player.runCommand(`scoreboard players set @s poke${suffix}Lvl ${calculations.level}`);
                    player.runCommand(`scoreboard players set @s poke${suffix}Var ${calculations.Variant}`);
                    player.runCommand(`scoreboard players set @s poke${suffix}HP ${calculations.Current_Health ?? 0}`);
                    player.runCommand(`scoreboard players set @s poke${suffix}HPmax ${calculations.Base_Health}`);
                });
            }

            player.addTag("ClaimedStarter");
            player.setDynamicProperty("quest_chapter1_stage", 1);
            player.sendMessage("§dCongrats you claimed your Starter !! Please open the quest book to claim a reward!!!");
            player.runCommand(`scoreboard players set @s Money 10000`);

            const backpack = new Backpack(player);
            const totals = new Map<string, number>();

            const starterLoot: [string, number][] = [
                ["pokeworld:pokeball", 20],
                ["pokeworld:greatball", 20],
            ];

            for (const [item, count] of starterLoot) {
                let category: string | null = null;

                for (const cat of Object.keys(backpackConfig)) {
                    if (backpackConfig[cat].some(i => i.id === item)) {
                        category = cat;
                        break;
                    }
                }

                if (category) {
                    backpack.addItem(category, item, count);
                } else {
                    player.runCommand(`give @s ${item} ${count}`);
                }

                totals.set(item, (totals.get(item) ?? 0) + count);
            }

            backpack.save();

            const lines = [...totals.entries()]
                .map(([id, qty]) => {
                    let name = id.replace("pokeworld:", "");
                    for (const category of Object.values(backpackConfig)) {
                        const item = category.find(i => i.id === id);
                        if (item) {
                            name = item.displayName;
                            break;
                        }
                    }
                    return `§7• §f${name} §7x§f${qty}`;
                })
                .join("\n");

            player.sendMessage(`§aStarter Rewards:\n${lines}`);
            player.runCommand(`give @s pokeworld:bike`);
            player.runCommand(`scoreboard players add @s pcatch 1`);
        } else {
            openFormP1(player);
        }
    });
}
