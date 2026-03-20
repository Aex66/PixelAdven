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
    name: 'Reward',
    description: 'Hello Trainer!! What would you like to buy today?',
    objective: 'Casino',
    tag: 'rewards',
    entity: 'pokeworld:casino_reward_machine',
    from: 'Rewards',
}, {});

const ExchangeCoins = shop.addCategory('Exchange Coins', 'This is where you can exchange your Casino Coins for the new Currency.', 'textures/items/casino_coin_hundred.png');
ExchangeCoins.addItem('X1 Casino Coins', { id: 'pokeworld:casino_coin', icon: 'textures/items/casino_coin.png', cmd: 'tag @s remove rewards', sell: 1 });
ExchangeCoins.addItem('X10 Casino Coins', { id: 'pokeworld:casino_coin_ten', icon: 'textures/items/casino_coin_ten.png', cmd: 'tag @s remove rewards', sell: 10 });
ExchangeCoins.addItem('X100 Casino Coins', { id: 'pokeworld:casino_coin_hundred', icon: 'textures/items/casino_coin_hundred.png', cmd: 'tag @s remove rewards', sell: 100 });

const BuyPokemon = shop.addCategory('   Buy Pokemon', 'This is where you buy a variety of Pokemon', 'textures/items/ball/poke.png');
BuyPokemon.addItem('Abra', { id: 'pokeworld:abra_ball', icon: 'textures/items/item_sprites/abra.png', cmd: 'tag @s remove rewards', buy: 180 });
BuyPokemon.addItem('Clefairy', { id: 'pokeworld:clefairy_ball', icon: 'textures/items/item_sprites/clefairy.png', cmd: 'tag @s remove rewards', buy: 500 });
BuyPokemon.addItem('Vulpix', { id: 'pokeworld:vulpix_ball', icon: 'textures/items/item_sprites/vulpix.png', cmd: 'tag @s remove rewards', buy: 2500 });
BuyPokemon.addItem('Pinsir', { id: 'pokeworld:pinsir_ball', icon: 'textures/items/item_sprites/pinsir.png', cmd: 'tag @s remove rewards', buy: 2500 });
BuyPokemon.addItem('Mr. Mine', { id: 'pokeworld:mrmime_ball', icon: 'textures/items/item_sprites/mrmime.png', cmd: 'tag @s remove rewards', buy: 3350 });
BuyPokemon.addItem('Dratini', { id: 'pokeworld:dratini_ball', icon: 'textures/items/item_sprites/dratini.png', cmd: 'tag @s remove rewards', buy: 4600 });
BuyPokemon.addItem('Scyther', { id: 'pokeworld:scyther_ball', icon: 'textures/items/item_sprites/scyther.png', cmd: 'tag @s remove rewards', buy: 5500 });
BuyPokemon.addItem('Eevee', { id: 'pokeworld:eevee_ball', icon: 'textures/items/item_sprites/eevee.png', cmd: 'tag @s remove rewards', buy: 6600 });
BuyPokemon.addItem('Porygon', { id: 'pokeworld:porygon_ball', icon: 'textures/items/item_sprites/porygon.png', cmd: 'tag @s remove rewards', buy: 9999 });
BuyPokemon.addItem('Shiny Porygon', { id: 'pokeworld:shiny_porygon_ball', icon: 'textures/items/item_sprites_shiny/porygon.png', cmd: 'tag @s remove rewards', buy: 20000 });