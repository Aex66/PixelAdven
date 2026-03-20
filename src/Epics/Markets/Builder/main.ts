/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
Aex66 (Developer)
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
__________ ___________________
\______   \\_____  \__    ___/
 |       _/ /   |   \|    |
 |    |   \/    |    \    |
 |____|_  /\_______  /____|
        \/         \/
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
© Copyright 2023 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Website: https://www.rotmc.ml
Thank you!
*/
import ShopPaper from "../../../Papers/MarketPaper.js";

const shop = new ShopPaper({
    name: '§9§9§rBuilder',
    description: 'Hello Trainer!! What would you like to buy today?',
    objective: 'Money',
    tag: 'builder',
    entity: 'pokeworld:construction_worker',
    from: 'Builder',
}, {});

const dyeTex = (c: string) => c === 'light_gray' ? 'silver' : c;

/* ===================== STONE ===================== */

const stone = shop.addCategory('§9§9§rStone & Masonry', 'Basic stone blocks.', 'textures/blocks/stonebrick.png');
stone.addItem('Stone', { id: 'minecraft:stone', icon: 'textures/blocks/stone.png', cmd: 'tag @s remove shop', buy: 25, sell: 5 });
stone.addItem('Cobblestone', { id: 'minecraft:cobblestone', icon: 'textures/blocks/cobblestone.png', cmd: 'tag @s remove shop', buy: 20, sell: 5 });
stone.addItem('Stone Bricks', { id: 'minecraft:stone_bricks', icon: 'textures/blocks/stonebrick.png', cmd: 'tag @s remove shop', buy: 30, sell: 10 });
stone.addItem('Bricks', { id: 'minecraft:bricks', icon: 'textures/blocks/brick.png', cmd: 'tag @s remove shop', buy: 35, sell: 10 });
stone.addItem('Deepslate', { id: 'minecraft:deepslate', icon: 'textures/blocks/deepslate.png', cmd: 'tag @s remove shop', buy: 30, sell: 10 });
stone.addItem('Andesite', { id: 'minecraft:andesite', icon: 'textures/blocks/stone_andesite.png', cmd: 'tag @s remove shop', buy: 25, sell: 5 });
stone.addItem('Diorite', { id: 'minecraft:diorite', icon: 'textures/blocks/stone_diorite.png', cmd: 'tag @s remove shop', buy: 25, sell: 5 });
stone.addItem('Granite', { id: 'minecraft:granite', icon: 'textures/blocks/stone_granite.png', cmd: 'tag @s remove shop', buy: 25, sell: 5 });
stone.addItem('Polished Andesite', { id: 'minecraft:polished_andesite', icon: 'textures/blocks/stone_andesite_smooth.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
stone.addItem('Polished Diorite', { id: 'minecraft:polished_diorite', icon: 'textures/blocks/stone_diorite_smooth.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
stone.addItem('Polished Granite', { id: 'minecraft:polished_granite', icon: 'textures/blocks/stone_granite_smooth.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
stone.addItem('Smooth Stone', { id: 'minecraft:smooth_stone', icon: 'textures/blocks/smooth_stone.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
stone.addItem('Chiseled Stone Bricks', { id: 'minecraft:chiseled_stone_bricks', icon: 'textures/blocks/stonebrick_carved.png', cmd: 'tag @s remove shop', buy: 35, sell: 10 });

/* ===================== CONCRETE ===================== */

const concrete = shop.addCategory(
    '§9§9§rConcrete',
    'Concrete blocks in all colors.',
    'textures/blocks/concrete_white.png'
);

concrete.addItem('White Concrete', { id: 'minecraft:white_concrete', icon: 'textures/blocks/concrete_white.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
concrete.addItem('Orange Concrete', { id: 'minecraft:orange_concrete', icon: 'textures/blocks/concrete_orange.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
concrete.addItem('Magenta Concrete', { id: 'minecraft:magenta_concrete', icon: 'textures/blocks/concrete_magenta.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
concrete.addItem('Light Blue Concrete', { id: 'minecraft:light_blue_concrete', icon: 'textures/blocks/concrete_light_blue.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
concrete.addItem('Yellow Concrete', { id: 'minecraft:yellow_concrete', icon: 'textures/blocks/concrete_yellow.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
concrete.addItem('Lime Concrete', { id: 'minecraft:lime_concrete', icon: 'textures/blocks/concrete_lime.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
concrete.addItem('Gray Concrete', { id: 'minecraft:gray_concrete', icon: 'textures/blocks/concrete_gray.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
concrete.addItem('Light Gray Concrete', { id: 'minecraft:light_gray_concrete', icon: 'textures/blocks/concrete_silver.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
concrete.addItem('Cyan Concrete', { id: 'minecraft:cyan_concrete', icon: 'textures/blocks/concrete_cyan.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
concrete.addItem('Purple Concrete', { id: 'minecraft:purple_concrete', icon: 'textures/blocks/concrete_purple.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
concrete.addItem('Blue Concrete', { id: 'minecraft:blue_concrete', icon: 'textures/blocks/concrete_blue.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
concrete.addItem('Brown Concrete', { id: 'minecraft:brown_concrete', icon: 'textures/blocks/concrete_brown.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
concrete.addItem('Green Concrete', { id: 'minecraft:green_concrete', icon: 'textures/blocks/concrete_green.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
concrete.addItem('Red Concrete', { id: 'minecraft:red_concrete', icon: 'textures/blocks/concrete_red.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
concrete.addItem('Black Concrete', { id: 'minecraft:black_concrete', icon: 'textures/blocks/concrete_black.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
concrete.addItem('Pink Concrete', { id: 'minecraft:pink_concrete', icon: 'textures/blocks/concrete_new_pink.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });

/* ===================== QUARTZ & PURPUR ===================== */

const quartz = shop.addCategory(
    '§9§9§rQuartz & Purpur',
    'High-tier decorative stone blocks.',
    'textures/blocks/quartz_block_side.png'
);

quartz.addItem('Quartz Block', { id: 'minecraft:quartz_block', icon: 'textures/blocks/quartz_block_side.png', cmd: 'tag @s remove shop', buy: 60, sell: 15 });
quartz.addItem('Chiseled Quartz', { id: 'minecraft:chiseled_quartz_block', icon: 'textures/blocks/quartz_block_chiseled.png', cmd: 'tag @s remove shop', buy: 65, sell: 18 });
quartz.addItem('Quartz Pillar', { id: 'minecraft:quartz_pillar', icon: 'textures/blocks/quartz_block_lines.png', cmd: 'tag @s remove shop', buy: 65, sell: 18 });
quartz.addItem('Smooth Quartz', { id: 'minecraft:smooth_quartz', icon: 'textures/blocks/quartz_block_bottom.png', cmd: 'tag @s remove shop', buy: 70, sell: 20 });
quartz.addItem('Purpur Block', { id: 'minecraft:purpur_block', icon: 'textures/blocks/purpur_block.png', cmd: 'tag @s remove shop', buy: 55, sell: 15 });
quartz.addItem('Purpur Pillar', { id: 'minecraft:purpur_pillar', icon: 'textures/blocks/purpur_pillar.png', cmd: 'tag @s remove shop', buy: 60, sell: 18 });

/* ===================== NETHER STONE ===================== */

const nether = shop.addCategory(
    '§9§9§rNether Stone',
    'Nether-based building materials.',
    'textures/blocks/blackstone.png'
);

nether.addItem('Netherrack', { id: 'minecraft:netherrack', icon: 'textures/blocks/netherrack.png', cmd: 'tag @s remove shop', buy: 10, sell: 2 });
nether.addItem('Nether Bricks', { id: 'minecraft:nether_bricks', icon: 'textures/blocks/nether_brick.png', cmd: 'tag @s remove shop', buy: 35, sell: 10 });
nether.addItem('Blackstone', { id: 'minecraft:blackstone', icon: 'textures/blocks/blackstone.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
nether.addItem('Polished Blackstone', { id: 'minecraft:polished_blackstone', icon: 'textures/blocks/polished_blackstone.png', cmd: 'tag @s remove shop', buy: 40, sell: 12 });
nether.addItem('Polished Blackstone Bricks', { id: 'minecraft:polished_blackstone_bricks', icon: 'textures/blocks/polished_blackstone_bricks.png', cmd: 'tag @s remove shop', buy: 45, sell: 15 });
nether.addItem('Basalt', { id: 'minecraft:basalt', icon: 'textures/blocks/basalt_side.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
nether.addItem('Smooth Basalt', { id: 'minecraft:smooth_basalt', icon: 'textures/blocks/smooth_basalt.png', cmd: 'tag @s remove shop', buy: 35, sell: 10 });

/* ===================== PRISMARINE ===================== */

const prismarine = shop.addCategory(
    '§9§9§rPrismarine',
    'Ocean monument building blocks.',
    'textures/blocks/prismarine_rough.png'
);

prismarine.addItem('Prismarine', { id: 'minecraft:prismarine', icon: 'textures/blocks/prismarine_rough.png', cmd: 'tag @s remove shop', buy: 45, sell: 12 });
prismarine.addItem('Prismarine Bricks', { id: 'minecraft:prismarine_bricks', icon: 'textures/blocks/prismarine_bricks.png', cmd: 'tag @s remove shop', buy: 50, sell: 15 });
prismarine.addItem('Dark Prismarine', { id: 'minecraft:dark_prismarine', icon: 'textures/blocks/prismarine_dark.png', cmd: 'tag @s remove shop', buy: 55, sell: 18 });

/* ===================== END STONE ===================== */

const end = shop.addCategory(
    '§9§9§rEnd Stone',
    'End-themed building materials.',
    'textures/blocks/end_stone.png'
);

end.addItem('End Stone', { id: 'minecraft:end_stone', icon: 'textures/blocks/end_stone.png', cmd: 'tag @s remove shop', buy: 35, sell: 10 });
end.addItem('End Stone Bricks', { id: 'minecraft:end_stone_bricks', icon: 'textures/blocks/end_bricks.png', cmd: 'tag @s remove shop', buy: 45, sell: 15 });

/* ===================== TERRACOTTA ===================== */

const terracotta = shop.addCategory(
    '§9§9§rTerracotta',
    'Terracotta blocks in all colors.',
    'textures/blocks/hardened_clay.png'
);

terracotta.addItem('Terracotta', { id: 'minecraft:terracotta', icon: 'textures/blocks/hardened_clay.png', cmd: 'tag @s remove shop', buy: 25, sell: 6 });
terracotta.addItem('White Terracotta', { id: 'minecraft:white_terracotta', icon: 'textures/blocks/hardened_clay_stained_white.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
terracotta.addItem('Orange Terracotta', { id: 'minecraft:orange_terracotta', icon: 'textures/blocks/hardened_clay_stained_orange.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
terracotta.addItem('Magenta Terracotta', { id: 'minecraft:magenta_terracotta', icon: 'textures/blocks/hardened_clay_stained_magenta.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
terracotta.addItem('Light Blue Terracotta', { id: 'minecraft:light_blue_terracotta', icon: 'textures/blocks/hardened_clay_stained_light_blue.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
terracotta.addItem('Yellow Terracotta', { id: 'minecraft:yellow_terracotta', icon: 'textures/blocks/hardened_clay_stained_yellow.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
terracotta.addItem('Lime Terracotta', { id: 'minecraft:lime_terracotta', icon: 'textures/blocks/hardened_clay_stained_lime.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
terracotta.addItem('Pink Terracotta', { id: 'minecraft:pink_terracotta', icon: 'textures/blocks/hardened_clay_stained_pink.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
terracotta.addItem('Gray Terracotta', { id: 'minecraft:gray_terracotta', icon: 'textures/blocks/hardened_clay_stained_gray.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
terracotta.addItem('Light Gray Terracotta', { id: 'minecraft:light_gray_terracotta', icon: 'textures/blocks/hardened_clay_stained_silver.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
terracotta.addItem('Cyan Terracotta', { id: 'minecraft:cyan_terracotta', icon: 'textures/blocks/hardened_clay_stained_cyan.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
terracotta.addItem('Purple Terracotta', { id: 'minecraft:purple_terracotta', icon: 'textures/blocks/hardened_clay_stained_purple.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
terracotta.addItem('Blue Terracotta', { id: 'minecraft:blue_terracotta', icon: 'textures/blocks/hardened_clay_stained_blue.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
terracotta.addItem('Brown Terracotta', { id: 'minecraft:brown_terracotta', icon: 'textures/blocks/hardened_clay_stained_brown.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
terracotta.addItem('Green Terracotta', { id: 'minecraft:green_terracotta', icon: 'textures/blocks/hardened_clay_stained_green.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
terracotta.addItem('Red Terracotta', { id: 'minecraft:red_terracotta', icon: 'textures/blocks/hardened_clay_stained_red.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
terracotta.addItem('Black Terracotta', { id: 'minecraft:black_terracotta', icon: 'textures/blocks/hardened_clay_stained_black.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });

/* ===================== GLAZED TERRACOTTA ===================== */

const glazed = shop.addCategory(
    '§9§9§rGlazed Terracotta',
    'Patterned decorative terracotta blocks.',
    'textures/blocks/glazed_terracotta_white.png'
);

glazed.addItem('White Glazed Terracotta', { id: 'minecraft:white_glazed_terracotta', icon: 'textures/blocks/glazed_terracotta_white.png', cmd: 'tag @s remove shop', buy: 45, sell: 12 });
glazed.addItem('Orange Glazed Terracotta', { id: 'minecraft:orange_glazed_terracotta', icon: 'textures/blocks/glazed_terracotta_orange.png', cmd: 'tag @s remove shop', buy: 45, sell: 12 });
glazed.addItem('Magenta Glazed Terracotta', { id: 'minecraft:magenta_glazed_terracotta', icon: 'textures/blocks/glazed_terracotta_magenta.png', cmd: 'tag @s remove shop', buy: 45, sell: 12 });
glazed.addItem('Light Blue Glazed Terracotta', { id: 'minecraft:light_blue_glazed_terracotta', icon: 'textures/blocks/glazed_terracotta_light_blue.png', cmd: 'tag @s remove shop', buy: 45, sell: 12 });
glazed.addItem('Yellow Glazed Terracotta', { id: 'minecraft:yellow_glazed_terracotta', icon: 'textures/blocks/glazed_terracotta_yellow.png', cmd: 'tag @s remove shop', buy: 45, sell: 12 });
glazed.addItem('Lime Glazed Terracotta', { id: 'minecraft:lime_glazed_terracotta', icon: 'textures/blocks/glazed_terracotta_lime.png', cmd: 'tag @s remove shop', buy: 45, sell: 12 });
glazed.addItem('Pink Glazed Terracotta', { id: 'minecraft:pink_glazed_terracotta', icon: 'textures/blocks/glazed_terracotta_pink.png', cmd: 'tag @s remove shop', buy: 45, sell: 12 });
glazed.addItem('Gray Glazed Terracotta', { id: 'minecraft:gray_glazed_terracotta', icon: 'textures/blocks/glazed_terracotta_gray.png', cmd: 'tag @s remove shop', buy: 45, sell: 12 });
glazed.addItem('Light Gray Glazed Terracotta', { id: 'minecraft:light_gray_glazed_terracotta', icon: 'textures/blocks/glazed_terracotta_silver.png', cmd: 'tag @s remove shop', buy: 45, sell: 12 });
glazed.addItem('Cyan Glazed Terracotta', { id: 'minecraft:cyan_glazed_terracotta', icon: 'textures/blocks/glazed_terracotta_cyan.png', cmd: 'tag @s remove shop', buy: 45, sell: 12 });
glazed.addItem('Purple Glazed Terracotta', { id: 'minecraft:purple_glazed_terracotta', icon: 'textures/blocks/glazed_terracotta_purple.png', cmd: 'tag @s remove shop', buy: 45, sell: 12 });
glazed.addItem('Blue Glazed Terracotta', { id: 'minecraft:blue_glazed_terracotta', icon: 'textures/blocks/glazed_terracotta_blue.png', cmd: 'tag @s remove shop', buy: 45, sell: 12 });
glazed.addItem('Brown Glazed Terracotta', { id: 'minecraft:brown_glazed_terracotta', icon: 'textures/blocks/glazed_terracotta_brown.png', cmd: 'tag @s remove shop', buy: 45, sell: 12 });
glazed.addItem('Green Glazed Terracotta', { id: 'minecraft:green_glazed_terracotta', icon: 'textures/blocks/glazed_terracotta_green.png', cmd: 'tag @s remove shop', buy: 45, sell: 12 });
glazed.addItem('Red Glazed Terracotta', { id: 'minecraft:red_glazed_terracotta', icon: 'textures/blocks/glazed_terracotta_red.png', cmd: 'tag @s remove shop', buy: 45, sell: 12 });
glazed.addItem('Black Glazed Terracotta', { id: 'minecraft:black_glazed_terracotta', icon: 'textures/blocks/glazed_terracotta_black.png', cmd: 'tag @s remove shop', buy: 45, sell: 12 });

/* ===================== WOOD ===================== */

const wood = shop.addCategory('§9§9§rWood Blocks', 'Logs and stems only.', 'textures/blocks/log_oak.png');
wood.addItem('Oak Log', { id: 'minecraft:oak_log', icon: 'textures/blocks/log_oak.png', cmd: 'tag @s remove shop', buy: 25, sell: 5 });
wood.addItem('Spruce Log', { id: 'minecraft:spruce_log', icon: 'textures/blocks/log_spruce.png', cmd: 'tag @s remove shop', buy: 25, sell: 5 });
wood.addItem('Birch Log', { id: 'minecraft:birch_log', icon: 'textures/blocks/log_birch.png', cmd: 'tag @s remove shop', buy: 25, sell: 5 });
wood.addItem('Jungle Log', { id: 'minecraft:jungle_log', icon: 'textures/blocks/log_jungle.png', cmd: 'tag @s remove shop', buy: 25, sell: 5 });
wood.addItem('Acacia Log', { id: 'minecraft:acacia_log', icon: 'textures/blocks/log_acacia.png', cmd: 'tag @s remove shop', buy: 25, sell: 5 });
wood.addItem('Dark Oak Log', { id: 'minecraft:dark_oak_log', icon: 'textures/blocks/log_big_oak.png', cmd: 'tag @s remove shop', buy: 25, sell: 5 });
wood.addItem('Mangrove Log', { id: 'minecraft:mangrove_log', icon: 'textures/blocks/mangrove_log_side.png', cmd: 'tag @s remove shop', buy: 25, sell: 5 });
wood.addItem('Crimson Stem', { id: 'minecraft:crimson_stem', icon: 'textures/blocks/crimson_stem_top.png', cmd: 'tag @s remove shop', buy: 30, sell: 6 });
wood.addItem('Warped Stem', { id: 'minecraft:warped_stem', icon: 'textures/blocks/warped_stem_top.png', cmd: 'tag @s remove shop', buy: 30, sell: 6 });
wood.addItem('Pale Oak Log', { id: 'pokeworld:pale_oak_log', icon: 'textures/blocks/pale_oak_log_side.png', cmd: 'tag @s remove shop', buy: 25, sell: 5 });

/* ===================== GLASS ===================== */

const glass = shop.addCategory('Glass', 'Glass blocks in all colors.', 'textures/blocks/glass_blue.png');
glass.addItem('Clear Glass', { id: 'minecraft:glass', icon: 'textures/blocks/glass.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
['white', 'orange', 'magenta', 'light_blue', 'yellow', 'lime', 'gray', 'light_gray', 'cyan', 'purple', 'blue', 'brown', 'green', 'red', 'black', 'pink']
    .forEach(c => glass.addItem(`${c.replace('_', ' ').toUpperCase()} Glass`, {
        id: `minecraft:${c}_stained_glass`,
        icon: `textures/blocks/glass_${dyeTex(c)}.png`,
        cmd: 'tag @s remove shop', buy: 35, sell: 10
    }));


/* ===================== WOOL ===================== */

const wool = shop.addCategory('§9§9§rWool', 'Wool blocks in all colors.', 'textures/blocks/wool_colored_white.png');

wool.addItem('White Wool', { id: 'minecraft:white_wool', icon: 'textures/blocks/wool_colored_white.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
wool.addItem('Orange Wool', { id: 'minecraft:orange_wool', icon: 'textures/blocks/wool_colored_orange.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
wool.addItem('Magenta Wool', { id: 'minecraft:magenta_wool', icon: 'textures/blocks/wool_colored_magenta.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
wool.addItem('Light Blue Wool', { id: 'minecraft:light_blue_wool', icon: 'textures/blocks/wool_colored_light_blue.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
wool.addItem('Yellow Wool', { id: 'minecraft:yellow_wool', icon: 'textures/blocks/wool_colored_yellow.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
wool.addItem('Lime Wool', { id: 'minecraft:lime_wool', icon: 'textures/blocks/wool_colored_lime.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
wool.addItem('Gray Wool', { id: 'minecraft:gray_wool', icon: 'textures/blocks/wool_colored_gray.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
wool.addItem('Light Gray Wool', { id: 'minecraft:light_gray_wool', icon: 'textures/blocks/wool_colored_silver.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
wool.addItem('Cyan Wool', { id: 'minecraft:cyan_wool', icon: 'textures/blocks/wool_colored_cyan.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
wool.addItem('Purple Wool', { id: 'minecraft:purple_wool', icon: 'textures/blocks/wool_colored_purple.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
wool.addItem('Blue Wool', { id: 'minecraft:blue_wool', icon: 'textures/blocks/wool_colored_blue.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
wool.addItem('Brown Wool', { id: 'minecraft:brown_wool', icon: 'textures/blocks/wool_colored_brown.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
wool.addItem('Green Wool', { id: 'minecraft:green_wool', icon: 'textures/blocks/wool_colored_green.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
wool.addItem('Red Wool', { id: 'minecraft:red_wool', icon: 'textures/blocks/wool_colored_red.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
wool.addItem('Black Wool', { id: 'minecraft:black_wool', icon: 'textures/blocks/wool_colored_black.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });
wool.addItem('Pink Wool', { id: 'minecraft:pink_wool', icon: 'textures/blocks/wool_colored_new_pink.png', cmd: 'tag @s remove shop', buy: 30, sell: 8 });

/* ===================== NATURE & TERRAIN ===================== */

const nature = shop.addCategory(
    '§9§9§rNature & Terrain',
    'Natural terrain and landscaping blocks.',
    'textures/blocks/grass_side_carried.png'
);

nature.addItem('Grass Block', { id: 'minecraft:grass_block', icon: 'textures/blocks/grass_side_carried.png', cmd: 'tag @s remove shop', buy: 20, sell: 5 });
nature.addItem('Dirt', { id: 'minecraft:dirt', icon: 'textures/blocks/dirt.png', cmd: 'tag @s remove shop', buy: 10, sell: 2 });
nature.addItem('Coarse Dirt', { id: 'minecraft:coarse_dirt', icon: 'textures/blocks/coarse_dirt.png', cmd: 'tag @s remove shop', buy: 12, sell: 3 });
nature.addItem('Podzol', { id: 'minecraft:podzol', icon: 'textures/blocks/dirt_podzol_side.png', cmd: 'tag @s remove shop', buy: 15, sell: 4 });
nature.addItem('Sand', { id: 'minecraft:sand', icon: 'textures/blocks/sand.png', cmd: 'tag @s remove shop', buy: 12, sell: 3 });
nature.addItem('Red Sand', { id: 'minecraft:red_sand', icon: 'textures/blocks/red_sand.png', cmd: 'tag @s remove shop', buy: 12, sell: 3 });
nature.addItem('Gravel', { id: 'minecraft:gravel', icon: 'textures/blocks/gravel.png', cmd: 'tag @s remove shop', buy: 12, sell: 3 });
nature.addItem('Clay Block', { id: 'minecraft:clay', icon: 'textures/blocks/clay.png', cmd: 'tag @s remove shop', buy: 25, sell: 5 });
nature.addItem('Moss Block', { id: 'minecraft:moss_block', icon: 'textures/blocks/moss_block.png', cmd: 'tag @s remove shop', buy: 25, sell: 6 });
nature.addItem('Sandstone', { id: 'minecraft:sandstone', icon: 'textures/blocks/sandstone_normal.png', cmd: 'tag @s remove shop', buy: 20, sell: 5 });
nature.addItem('Smooth Sandstone', { id: 'minecraft:smooth_sandstone', icon: 'textures/blocks/sandstone_smooth.png', cmd: 'tag @s remove shop', buy: 25, sell: 8 });
nature.addItem('Chiseled Sandstone', { id: 'minecraft:chiseled_sandstone', icon: 'textures/blocks/sandstone_carved.png', cmd: 'tag @s remove shop', buy: 30, sell: 10 });
nature.addItem('Red Sandstone', { id: 'minecraft:red_sandstone', icon: 'textures/blocks/red_sandstone_normal.png', cmd: 'tag @s remove shop', buy: 22, sell: 6 });
nature.addItem('Smooth Red Sandstone', { id: 'minecraft:smooth_red_sandstone', icon: 'textures/blocks/red_sandstone_smooth.png', cmd: 'tag @s remove shop', buy: 27, sell: 9 });
nature.addItem('Chiseled Red Sandstone', { id: 'minecraft:chiseled_red_sandstone', icon: 'textures/blocks/red_sandstone_carved.png', cmd: 'tag @s remove shop', buy: 32, sell: 11 });

/* ===================== CARPET ===================== */

const carpet = shop.addCategory(
    '§9§9§rCarpet',
    'Carpet blocks in all colors.',
    'textures/blocks/wool_colored_white.png'
);

carpet.addItem('White Carpet', { id: 'minecraft:white_carpet', icon: 'textures/blocks/wool_colored_white.png', cmd: 'tag @s remove shop', buy: 15, sell: 4 });
carpet.addItem('Orange Carpet', { id: 'minecraft:orange_carpet', icon: 'textures/blocks/wool_colored_orange.png', cmd: 'tag @s remove shop', buy: 15, sell: 4 });
carpet.addItem('Magenta Carpet', { id: 'minecraft:magenta_carpet', icon: 'textures/blocks/wool_colored_magenta.png', cmd: 'tag @s remove shop', buy: 15, sell: 4 });
carpet.addItem('Light Blue Carpet', { id: 'minecraft:light_blue_carpet', icon: 'textures/blocks/wool_colored_light_blue.png', cmd: 'tag @s remove shop', buy: 15, sell: 4 });
carpet.addItem('Yellow Carpet', { id: 'minecraft:yellow_carpet', icon: 'textures/blocks/wool_colored_yellow.png', cmd: 'tag @s remove shop', buy: 15, sell: 4 });
carpet.addItem('Lime Carpet', { id: 'minecraft:lime_carpet', icon: 'textures/blocks/wool_colored_lime.png', cmd: 'tag @s remove shop', buy: 15, sell: 4 });
carpet.addItem('Gray Carpet', { id: 'minecraft:gray_carpet', icon: 'textures/blocks/wool_colored_gray.png', cmd: 'tag @s remove shop', buy: 15, sell: 4 });
carpet.addItem('Light Gray Carpet', { id: 'minecraft:light_gray_carpet', icon: 'textures/blocks/wool_colored_silver.png', cmd: 'tag @s remove shop', buy: 15, sell: 4 });
carpet.addItem('Cyan Carpet', { id: 'minecraft:cyan_carpet', icon: 'textures/blocks/wool_colored_cyan.png', cmd: 'tag @s remove shop', buy: 15, sell: 4 });
carpet.addItem('Purple Carpet', { id: 'minecraft:purple_carpet', icon: 'textures/blocks/wool_colored_purple.png', cmd: 'tag @s remove shop', buy: 15, sell: 4 });
carpet.addItem('Blue Carpet', { id: 'minecraft:blue_carpet', icon: 'textures/blocks/wool_colored_blue.png', cmd: 'tag @s remove shop', buy: 15, sell: 4 });
carpet.addItem('Brown Carpet', { id: 'minecraft:brown_carpet', icon: 'textures/blocks/wool_colored_brown.png', cmd: 'tag @s remove shop', buy: 15, sell: 4 });
carpet.addItem('Green Carpet', { id: 'minecraft:green_carpet', icon: 'textures/blocks/wool_colored_green.png', cmd: 'tag @s remove shop', buy: 15, sell: 4 });
carpet.addItem('Red Carpet', { id: 'minecraft:red_carpet', icon: 'textures/blocks/wool_colored_red.png', cmd: 'tag @s remove shop', buy: 15, sell: 4 });
carpet.addItem('Black Carpet', { id: 'minecraft:black_carpet', icon: 'textures/blocks/wool_colored_black.png', cmd: 'tag @s remove shop', buy: 15, sell: 4 });
carpet.addItem('Pink Carpet', { id: 'minecraft:pink_carpet', icon: 'textures/blocks/wool_colored_new_pink.png', cmd: 'tag @s remove shop', buy: 15, sell: 4 });



/* ===================== LIGHTING ===================== */

const lighting = shop.addCategory('§9§9§rLighting', 'Lighting blocks.', 'textures/items/lantern.png');
lighting.addItem('Torch', { id: 'minecraft:torch', icon: 'textures/blocks/torch_on.png', cmd: 'tag @s remove shop', buy: 5, sell: 1 });
lighting.addItem('Lantern', { id: 'minecraft:lantern', icon: 'textures/items/lantern.png', cmd: 'tag @s remove shop', buy: 25, sell: 5 });
lighting.addItem('Glowstone', { id: 'minecraft:glowstone', icon: 'textures/blocks/glowstone.png', cmd: 'tag @s remove shop', buy: 40, sell: 10 });
lighting.addItem('Sea Lantern', { id: 'minecraft:sea_lantern', icon: 'textures/blocks/sea_lantern.png', cmd: 'tag @s remove shop', buy: 50, sell: 15 });

/* ===================== TOOLS ===================== */

const tools = shop.addCategory('§9§9§rTools', 'Basic builder tools.', 'textures/items/iron_axe.png');
tools.addItem('Iron Pickaxe', { id: 'minecraft:iron_pickaxe', icon: 'textures/items/iron_pickaxe.png', cmd: 'tag @s remove shop', buy: 150, sell: 40 });
tools.addItem('Iron Axe', { id: 'minecraft:iron_axe', icon: 'textures/items/iron_axe.png', cmd: 'tag @s remove shop', buy: 120, sell: 35 });
tools.addItem('Iron Shovel', { id: 'minecraft:iron_shovel', icon: 'textures/items/iron_shovel.png', cmd: 'tag @s remove shop', buy: 100, sell: 30 });

/* ===================== CRAFTING MATERIALS (MOB DROPS) ===================== */
const craftingMats = shop.addCategory('§6§lCrafting Materials', 'Mob-drop items required for crafting.', 'textures/items/leather.png');
craftingMats.addItem('Leather', { id: 'minecraft:leather', icon: 'textures/items/leather.png', cmd: 'tag @s remove shop', buy: 80, sell: 15 });
craftingMats.addItem('String', { id: 'minecraft:string', icon: 'textures/items/string.png', cmd: 'tag @s remove shop', buy: 60, sell: 10 });
craftingMats.addItem('Feather', { id: 'minecraft:feather', icon: 'textures/items/feather.png', cmd: 'tag @s remove shop', buy: 50, sell: 8 });
craftingMats.addItem('Ink Sac', { id: 'minecraft:ink_sac', icon: 'textures/items/ink_sac.png', cmd: 'tag @s remove shop', buy: 70, sell: 12 });
craftingMats.addItem('Bone', { id: 'minecraft:bone', icon: 'textures/items/bone.png', cmd: 'tag @s remove shop', buy: 65, sell: 10 });
craftingMats.addItem('Rabbit Hide', { id: 'minecraft:rabbit_hide', icon: 'textures/items/rabbit_hide.png', cmd: 'tag @s remove shop', buy: 90, sell: 15 });
craftingMats.addItem('Slimeball', { id: 'minecraft:slime_ball', icon: 'textures/items/slimeball.png', cmd: 'tag @s remove shop', buy: 120, sell: 25 });
craftingMats.addItem('Honeycomb', { id: 'minecraft:honeycomb', icon: 'textures/items/honeycomb.png', cmd: 'tag @s remove shop', buy: 75, sell: 12 });
craftingMats.addItem('Phantom Membrane', { id: 'minecraft:phantom_membrane', icon: 'textures/items/phantom_membrane.png', cmd: 'tag @s remove shop', buy: 150, sell: 30 });
craftingMats.addItem('Blaze Rod', { id: 'minecraft:blaze_rod', icon: 'textures/items/blaze_rod.png', cmd: 'tag @s remove shop', buy: 200, sell: 40 });
craftingMats.addItem('Gunpowder', { id: 'minecraft:gunpowder', icon: 'textures/items/gunpowder.png', cmd: 'tag @s remove shop', buy: 140, sell: 25 });
craftingMats.addItem('Glow Ink Sac', { id: 'minecraft:glow_ink_sac', icon: 'textures/items/glow_ink_sac.png', cmd: 'tag @s remove shop', buy: 100, sell: 18 });
