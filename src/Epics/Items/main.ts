import { world } from "@minecraft/server";

//This is for the Rare Candy
world.afterEvents.itemUse.subscribe((data) => {
    if (data.itemStack.typeId == "pokeworld:rare_candy") {
        data.source.runCommand(`tag @e[tag="o:${data.source.name}"] add levelup`);
        data.source.runCommand('clear @s pokeworld:rare_candy 0 1');
    }
});


//This is for the Flash HM
world.afterEvents.itemUse.subscribe((data) => {
    if (data.itemStack.typeId == "pokeworld:hm_05") {
        data.source.runCommand('effect @s night_vision 600 1 true');
    }
});

//This is for the Flash HM
world.afterEvents.itemUse.subscribe((data) => {
    if (data.itemStack.typeId == "pokeworld:bike") {
        data.source.runCommand('execute as @s[tag=!bike] run summon pokeworld:bike');
        data.source.runCommand('tag @s add bike');
    }
});


//This is for the Tera Orb
world.afterEvents.itemUse.subscribe((data) => {
    if (data.itemStack.typeId == "pokeworld:teraorb") {
        data.source.runCommand(`event entity @e[tag="o:${data.source.name}",scores={Transform=0},tag=!mega_used] pokeworld:tera`);
    }
});

//This is for the Tera Orb
world.afterEvents.itemUse.subscribe((data) => {
    if (data.itemStack.typeId == "pokeworld:info") {
        data.source.runCommand('tp @s -17 162 56');
    }
});

//This is for the Surf HM
world.afterEvents.itemUse.subscribe((data) => {
    if (data.itemStack.typeId == "pokeworld:pokeworld:hm_03") {
        data.source.runCommand('summon pokeworld:surf_lapras ~~~"');
        data.source.runCommand('clear @s pokeworld:hm_03 0 1');
    }
});

//This is for the Staff HM
world.afterEvents.itemUse.subscribe((data) => {
    if (data.itemStack.typeId == "pokeworld:hm_staff") {
        data.source.runCommand('teleport @s[tag=Staff] -1272 18 1234');
        data.source.runCommand('tag @s[tag=!Staff] add Staff_Ban');
    }
});

const itemCommands = {
    "pokeworld:flame_orb": [
        'tellraw @s {"rawtext":[{"text":"§e[Total Souls Absorbed]: §r"},{"selector": "@s"},{"text":" You Captured The Essence Of "},{"score":{"name":"*","objective":"shrine"}},{"text":" Pokemon "}]}',
        'clear @s[tag=!mocquest,scores={shrine=150..}] pokeworld:flame_orb',
        'tag @s[tag=!mocquest,scores={shrine=150..}] add flame_charged',
        'give @s[tag=!mocquest,scores={shrine=150..}] pokeworld:flame_orb_charged 1 0 {"minecraft:item_lock":{"mode":"lock_in_inventory"}}',
        'tellraw @s[tag=mocquest] {"rawtext":[{"text":"!!! You Cannot Obtain This Pokemon Again!!!"}]}',
        'tellraw @s[tag=!mocquest,scores={shrine=0..150}] {"rawtext":[{"text":"!!! Not Enough Of A Charge Detected!!!"}]}',
        'tellraw @s[tag=!mocquest,scores={shrine=150..}] {"rawtext":[{"text":"!!! A Powerful Presence Is Felt Within The Orb!!!"}]}',
        'scoreboard players remove @s[tag=!mocquest,scores={shrine=150..}] shrine 150'
    ],
    "pokeworld:lightning_orb": [
        'tellraw @s {"rawtext":[{"text":"§e[Total Souls Absorbed]: §r"},{"selector": "@s"},{"text":" You Captured The Essence Of "},{"score":{"name":"*","objective":"shrine"}},{"text":" Pokemon "}]}',
        'clear @s[tag=!mocquest,scores={shrine=150..}] pokeworld:lightning_orb',
        'tag @s[tag=!mocquest,scores={shrine=150..}] add lightning_charged',
        'give @s[tag=!mocquest,scores={shrine=150..}] pokeworld:lightning_orb_charged 1 0 {"minecraft:item_lock":{"mode":"lock_in_inventory"}}',
        'tellraw @s[tag=mocquest] {"rawtext":[{"text":"!!! You Cannot Obtain This Pokemon Again!!!"}]}',
        'tellraw @s[tag=!mocquest,scores={shrine=0..150}] {"rawtext":[{"text":"!!! Not Enough Of A Charge Detected!!!"}]}',
        'tellraw @s[tag=!mocquest,scores={shrine=150..}] {"rawtext":[{"text":"!!! A Powerful Presence Is Felt Within The Orb!!!"}]}',
        'scoreboard players remove @s[tag=!mocquest,scores={shrine=150..}] shrine 150'
    ],
    "pokeworld:ice_orb": [
        'tellraw @s {"rawtext":[{"text":"§e[Total Souls Absorbed]: §r"},{"selector": "@s"},{"text":" You Captured The Essence Of "},{"score":{"name":"*","objective":"shrine"}},{"text":" Pokemon "}]}',
        'clear @s[tag=!mocquest,scores={shrine=150..}] pokeworld:ice_orb',
        'tag @s[tag=!mocquest,scores={shrine=150..}] add ice_charged',
        'tag @s[tag=!mocquest,scores={shrine=150..}] add ice_charged',
        'give @s[tag=!mocquest,scores={shrine=150..}] pokeworld:ice_orb_charged 1 0 {"minecraft:item_lock":{"mode":"lock_in_inventory"}}',
        'tellraw @s[tag=mocquest] {"rawtext":[{"text":"!!! You Cannot Obtain This Pokemon Again!!!"}]}',
        'tellraw @s[tag=!mocquest,scores={shrine=0..150}] {"rawtext":[{"text":"!!! Not Enough Of A Charge Detected!!!"}]}',
        'tellraw @s[tag=!mocquest,scores={shrine=150..}] {"rawtext":[{"text":"!!! A Powerful Presence Is Felt Within The Orb!!!"}]}',
        'scoreboard players remove @s[tag=!mocquest,scores={shrine=150..}] shrine 150'
    ],
    "pokeworld:acacia_crate": [
        'give @s acacia_stairs 64',
        'give @s fence 64 4',
        'give @s log2 64 0',
        'give @s planks 64 4',
        'give @s wooden_slab 64 4',
        'give @s acacia_door 16',
        'give @s acacia_fence_gate 16',
        'clear @s pokeworld:acacia_crate 0 1'
    ],
    "pokeworld:birch_crate": [
        'give @s birch_stairs 64',
        'give @s fence 64 2',
        'give @s log2 64 0',
        'give @s planks 64 2',
        'give @s wooden_slab 64 2',
        'give @s birch_door 16',
        'give @s birch_fence_gate 16',
        'clear @s pokeworld:birch_crate 0 1'
    ],
    "pokeworld:dark_oak_crate": [
        'give @s dark_oak_stairs 64',
        'give @s fence 64 5',
        'give @s log2 64 0',
        'give @s planks 64 5',
        'give @s wooden_slab 64 5',
        'give @s dark_oak_door 16',
        'give @s dark_oak_fence_gate 16',
        'clear @s pokeworld:dark_oak_crate 0 1'
    ],
    "pokeworld:jungle_crate": [
        'give @s jungle_button 64',
        'give @s jungle_stairs 64',
        'give @s fence 64 3',
        'give @s log2 64 0',
        'give @s planks 64 3',
        'give @s wooden_slab 64 3',
        'give @s jungle_door 16',
        'give @s jungle_fence_gate 16',
        'clear @s pokeworld:jungle_crate 0 1'
    ],
    "pokeworld:mangrove_crate": [
        'give @s mangrove_button 64',
        'give @s mangrove_stairs 64',
        'give @s mangrove_fence 64',
        'give @s mangrove_log 64',
        'give @s mangrove_planks 64',
        'give @s mangrove_slab 64',
        'give @s mangrove_door 16',
        'give @s mangrove_fence_gate 16',
        'clear @s pokeworld:mangrove_crate 0 1'
    ],
    "pokeworld:oak_crate": [
        'give @s oak_button 64',
        'give @s oak_stairs 64',
        'give @s oak_fence 64',
        'give @s oak_log 64',
        'give @s oak_planks 64',
        'give @s oak_slab 64',
        'give @s oak_door 16',
        'give @s oak_fence_gate 16',
        'clear @s pokeworld:oak_crate 0 1'
    ],
    "pokeworld:pale_oak_crate": [
        'give @s pale_oak_button 64',
        'give @s pale_oak_stairs 64',
        'give @s pale_oak_fence 64',
        'give @s pale_oak_log 64',
        'give @s pale_oak_planks 64',
        'give @s pale_oak_slab 64',
        'give @s pale_oak_door 16',
        'give @s pale_oak_fence_gate 16',
        'clear @s pokeworld:pale_oak_crate 0 1'
    ],
    "pokeworld:spruce_crate": [
        'give @s spruce_button 64',
        'give @s spruce_stairs 64',
        'give @s spruce_fence 64',
        'give @s spruce_log 64',
        'give @s spruce_planks 64',
        'give @s spruce_slab 64',
        'give @s spruce_door 16',
        'give @s spruce_fence_gate 16',
        'clear @s pokeworld:spruce_crate 0 1'
    ],
    "pokeworld:crimson_crate": [
        'give @s crimson_button 64',
        'give @s crimson_stairs 64',
        'give @s crimson_fence 64',
        'give @s crimson_stem 64',
        'give @s crimson_planks 64',
        'give @s crimson_slab 64',
        'give @s crimson_door 16',
        'give @s crimson_fence_gate 16',
        'clear @s pokeworld:crimson_crate 0 1'
    ],
    "pokeworld:warped_crate": [
        'give @s warped_button 64',
        'give @s warped_stairs 64',
        'give @s warped_fence 64',
        'give @s warped_stem 64',
        'give @s warped_planks 64',
        'give @s warped_slab 64',
        'give @s warped_door 16',
        'give @s warped_fence_gate 16',
        'clear @s pokeworld:warped_crate 0 1'
    ],
    "pokeworld:concrete_crate": [
        'give @s concrete 64 0',
        'give @s concrete 64 1',
        'give @s concrete 64 2',
        'give @s concrete 64 3',
        'give @s concrete 64 4',
        'give @s concrete 64 5',
        'give @s concrete 64 6',
        'give @s concrete 64 7',
        'give @s concrete 64 8',
        'give @s concrete 64 9',
        'give @s concrete 64 10',
        'give @s concrete 64 11',
        'give @s concrete 64 12',
        'give @s concrete 64 13',
        'give @s concrete 64 14',
        'give @s concrete 64 15',
        'clear @s pokeworld:concrete_crate 0 1'
    ],
    "pokeworld:glass_crate": [
        'give @s stained_glass 64 0',
        'give @s stained_glass 64 1',
        'give @s stained_glass 64 2',
        'give @s stained_glass 64 3',
        'give @s stained_glass 64 4',
        'give @s stained_glass 64 5',
        'give @s stained_glass 64 6',
        'give @s stained_glass 64 7',
        'give @s stained_glass 64 8',
        'give @s stained_glass 64 9',
        'give @s stained_glass 64 10',
        'give @s stained_glass 64 11',
        'give @s stained_glass 64 12',
        'give @s stained_glass 64 13',
        'give @s stained_glass 64 14',
        'give @s stained_glass 64 15',
        'clear @s pokeworld:glass_crate 0 1'
    ],
    "pokeworld:glass_pane_crate": [
        'give @s stained_glass_pane 64 0',
        'give @s stained_glass_pane 64 1',
        'give @s stained_glass_pane 64 2',
        'give @s stained_glass_pane 64 3',
        'give @s stained_glass_pane 64 4',
        'give @s stained_glass_pane 64 5',
        'give @s stained_glass_pane 64 6',
        'give @s stained_glass_pane 64 7',
        'give @s stained_glass_pane 64 8',
        'give @s stained_glass_pane 64 9',
        'give @s stained_glass_pane 64 10',
        'give @s stained_glass_pane 64 11',
        'give @s stained_glass_pane 64 12',
        'give @s stained_glass_pane 64 13',
        'give @s stained_glass_pane 64 14',
        'give @s stained_glass_pane 64 15',
        'clear @s pokeworld:glass_pane_crate 0 1'
    ],
    "pokeworld:nature_crate": [
        'give @s grass 256 0',
        'give @s grass_path 64 0',
        'give @s dirt 256 0',
        'give @s cobblestone 256 0',
        'give @s stone 256 0',
        'clear @s pokeworld:nature_crate 0 1'
    ],
    "pokeworld:quartz_crate": [
        'give @s quartz_block 64 0',
        'give @s quartz_block 64 1',
        'give @s quartz_block 64 2',
        'give @s quartz_block 64 3',
        'give @s quartz_bricks 64 0',
        'give @s quartz_bricks 64 0',
        'give @s smooth_quartz_stairs 64 0',
        'clear @s pokeworld:quartz_crate 0 1'
    ],
    "pokeworld:stone_slab_four_crate": [
        'give @s stone_slab4 64 0',
        'give @s stone_slab4 64 1',
        'give @s stone_slab4 64 2',
        'give @s stone_slab4 64 3',
        'give @s stone_slab4 64 4',
        'give @s stone_slab4 64 5',
        'give @s stone_slab4 64 6',
        'clear @s pokeworld:stone_slab_four_crate 0 1'
    ],
    "pokeworld:stone_slab_one_crate": [
        'give @s stone_slab 64 0',
        'give @s stone_slab 64 1',
        'give @s stone_slab 64 2',
        'give @s stone_slab 64 3',
        'give @s stone_slab 64 4',
        'give @s stone_slab 64 5',
        'give @s stone_slab 64 6',
        'clear @s pokeworld:stone_slab_four_crate 0 1'
    ],
    "pokeworld:stone_slab_two_crate": [
        'give @s stone_slab2 64 0',
        'give @s stone_slab2 64 1',
        'give @s stone_slab2 64 2',
        'give @s stone_slab2 64 3',
        'give @s stone_slab2 64 4',
        'give @s stone_slab2 64 5',
        'give @s stone_slab2 64 6',
        'clear @s pokeworld:stone_slab_four_crate 0 1'
    ],
    "pokeworld:stone_slab_three_crate": [
        'give @s stone_slab3 64 0',
        'give @s stone_slab3 64 1',
        'give @s stone_slab3 64 2',
        'give @s stone_slab3 64 3',
        'give @s stone_slab3 64 4',
        'give @s stone_slab3 64 5',
        'give @s stone_slab3 64 6',
        'clear @s pokeworld:stone_slab_four_crate 0 1'
    ],
    "pokeworld:stonebrick_crate": [
        'give @s stone_bricks 64 0',
        'give @s stone_bricks 64 1',
        'give @s stone_bricks 64 2',
        'give @s stone_bricks 64 3',
        'clear @s pokeworld:stonebrick_crate 0 1'
    ],
    "pokeworld:lighting_crate": [
        'give @s torch 64 0',
        'give @s lantern 64 0',
        'give @s soul_lantern 64 0',
        'give @s glowstone 64 0',
        'give @s sealantern 64 0',
        'clear @s pokeworld:stonebrick_crate 0 1'
    ],
    "pokeworld:tool_crate": [
        'give @s iron_axe 3 0',
        'give @s iron_pickaxe 3 0',
        'give @s iron_shovel 3 0',
        'give @s chest 64',
        'give @s scaffolding 128',
        'clear @s pokeworld:tool_crate 0 1'
    ],
    "pokeworld:bonus_crate": [
        'give @s pokeworld:ten_kilo_egg 1 0',
        'give @s pokeworld:ultraball 16 0',
        'give @s pokeworld:greatball_ticket 5 0',
        'scoreboard players add @s Money 10000',
        'scoreboard players add @s mastercrate 1',
        'give @s pokeworld:masterball_ticket 1 0 {"minecraft:item_lock":{"mode":"lock_in_inventory"}}',
        'xp 10l @s',
        'clear @s pokeworld:bonus_crate 0 1'
    ],
    "pokeworld:egg_crate": [
        'give @s pokeworld:two_kilo_egg 2 0',
        'give @s pokeworld:five_kilo_egg 2 0',
        'give @s pokeworld:seven_kilo_egg 2 0',
        'give @s pokeworld:ten_kilo_egg 2 0',
        'give @s pokeworld:shiny_egg 1 0',
        'clear @s pokeworld:egg_crate 0 1'
    ],
    "pokeworld:event_crate": [
        'give @s pokeworld:egg_crate 1 0 {"minecraft:item_lock":{"mode":"lock_in_inventory"}}',
        'give @s pokeworld:berry_crate 1 0 {"minecraft:item_lock":{"mode":"lock_in_inventory"}}',
        'give @s pokeworld:potion_kit 1 0 {"minecraft:item_lock":{"mode":"lock_in_inventory"}}',
        'give @s pokeworld:ticket_crate 1 0 {"minecraft:item_lock":{"mode":"lock_in_inventory"}}',
        'give @s pokeworld:ultraball 32 0 {"minecraft:item_lock":{"mode":"lock_in_inventory"}}',
        'scoreboard players add @s Money 10000',
        'xp 10l @s',
        'clear @s pokeworld:event_crate 0 1'
    ],
    "pokeworld:potion_kit": [
        'give @s pokeworld:potion 5 0',
        'give @s pokeworld:super_potion 5 0',
        'give @s pokeworld:hyper_potion 5 0',
        'give @s pokeworld:max_potion 5 0',
        'clear @s pokeworld:potion_kit 0 1'
    ],
    "pokeworld:ticket_crate": [
        'give @s pokeworld:pokeball_ticket 5 0',
        'give @s pokeworld:greatball_ticket 5 0',
        'scoreboard players add @s ultracrate 3',
        'give @s pokeworld:ultraball_ticket 3 0 {"minecraft:item_lock":{"mode":"lock_in_inventory"}}',
        'scoreboard players add @s mastercrate 1',
        'give @s pokeworld:masterball_ticket 1 0 {"minecraft:item_lock":{"mode":"lock_in_inventory"}}',
        'clear @s pokeworld:ticket_crate 0 1'
    ]
}

world.afterEvents.itemUse.subscribe((data) => {
    if (!itemCommands.hasOwnProperty(data.itemStack.typeId)) return;

    const commands = itemCommands[data.itemStack.typeId as keyof typeof itemCommands]
    commands.forEach(command => {
        try {
            data.source.runCommand(command)
        } catch {}
    })
});