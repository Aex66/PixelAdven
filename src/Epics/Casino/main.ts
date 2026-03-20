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

import { Entity, Player as IPlayer, Player, system, world } from "@minecraft/server";
import { ModalForm } from "../../Papers/FormPaper.js";
import { ActionFormData } from "@minecraft/server-ui";
import PlayerPaper from "../../Papers/PlayerPaper.js";
import pokemonList from "../../Letters/pokemon/list";
import { writePokemon } from "../Pokemon Database/main";
import { selected } from "../Main/Forms/PC/main";
import { calculatePokemon, checkSidebarFree, PokemonName } from "../Pokemon Calculations/calculations";
import { longHand } from "../Pokemon Database/@types/types";
import { ballTags } from "../Pokemon Calculations/catch";

// =====================================================
// SETTINGS
// =====================================================

const CASINO_ENTITY = "pokeworld:slot_machine";
const CASINO_SCOREBOARD = "Casino";
const BET_RANGE: [number, number] = [1, 20];
const WIN_SOUND = "random.hit";
const LOSE_SOUND = "random.toobad";

const COIN_EXCHANGE_ENTITY = "pokeworld:coin_exchange";
const MONEY_SCOREBOARD = "Money";
const COIN_RATE = 20;

const CASINO_REWARD_ENTITY = "pokeworld:casino_reward_machine";
const casinoRewards: { name: PokemonName; price: number }[] = [
  { name: "Dratini", price: 6000 },
  { name: "Larvitar", price: 5500 },
  { name: "Beldum", price: 7000 },
  { name: "Gible", price: 6500 },
  { name: "Eevee", price: 4000 }
];

// =====================================================
// EVENT HANDLER
// =====================================================

world.afterEvents.entityHitEntity.subscribe(res => {
  const { damagingEntity, hitEntity } = res;
  if (!(damagingEntity instanceof IPlayer)) return;
  if (!hitEntity) return;

  if (hitEntity.typeId === CASINO_ENTITY) {
    casino(damagingEntity, hitEntity);
  }

  if (hitEntity.typeId === COIN_EXCHANGE_ENTITY) {
    coinExchange(damagingEntity);
  }

  if (hitEntity.typeId === CASINO_REWARD_ENTITY) {
    openCasinoRewardUI(damagingEntity);
  }
});

// =====================================================
// 🎰 Casino Slot Machine
// =====================================================

function casino(player: IPlayer, machine: Entity) {
  const money = PlayerPaper.getScore(player, CASINO_SCOREBOARD) ?? 0;

  // FIX: Prevent false negatives (NaN, null)
  if (money <= 0 || isNaN(money)) {
    return player.sendMessage("§cYou dont have any casino coins to bet!");
  }

  const form = new ModalForm();
  form.setTitle(`§bYou have §a${money} coins`);
  form.addSlider("§bAmount to bet: §a$", BET_RANGE[0], BET_RANGE[1], 1);

  form.send(player, res => {
    if (res.canceled) return;

    const bet = res.formValues[0];

    if (bet > money) {
      return player.sendMessage("§cYou dont have enough coins!");
    }

    // Subtract bet immediately
    const balanceAfterBet = money - bet;
    PlayerPaper.setScore(player, CASINO_SCOREBOARD, balanceAfterBet);

    // Determine outcome
const roll = ~~(Math.random() * 100);
let winnings = 0;
let isWin = false;

if (roll <= 3)       { winnings = bet * 10; isWin = true; }
else if (roll <= 7)  { winnings = bet * 7;  isWin = true; }
else if (roll <= 10) { winnings = bet * 4;  isWin = true; }
else if (roll <= 30) { winnings = bet * 2; isWin = true; }

const anim = isWin ? "model.win_spin" : "model.lose_spin";

// Correct animation
machine.runCommand(`playanimation @s animation.${anim}`);

// Suspense message only (no sound yet)
player.sendMessage("§eSpinning...");

// Delay 4.5s before reveal
system.runTimeout(() => {

  if (isWin) {
    const finalBalance = balanceAfterBet + winnings;
    PlayerPaper.setScore(player, CASINO_SCOREBOARD, finalBalance);

    // ▶ SOUND MOVED HERE
    player.playSound(WIN_SOUND);

    player.sendMessage(`§a💰 You won §e${winnings} §acoins!`);
  } else {
    // ▶ SOUND MOVED HERE
    player.playSound(LOSE_SOUND);

    player.sendMessage(`§c❌ You lost ${bet} coins...`);
  }

}, 90); // 4.5 seconds
  });
}

// =====================================================
// 💱 Coin Exchange Machine
// =====================================================

function coinExchange(player: IPlayer) {
  const money = PlayerPaper.getScore(player, MONEY_SCOREBOARD) ?? 0;

  if (money < COIN_RATE) {
    return player.sendMessage(`§cYou need at least $${COIN_RATE} to buy 1 casino coin!`);
  }

  const maxCoins = Math.floor(money / COIN_RATE);
  const currentCoins = PlayerPaper.getScore(player, CASINO_SCOREBOARD) ?? 0;

  const form = new ModalForm();
  form.setTitle("§6Coin Exchange");
  form.addSlider(
    `§bYou have §a$${money}\n§bCasino Coins: §a${currentCoins}\n\n§e1 Coin = $${COIN_RATE}\n\nSelect coins to buy:`,
    1, maxCoins, 1
  );

  form.send(player, res => {
    if (res.canceled) return;

    const coinsToBuy = res.formValues[0];
    const cost = coinsToBuy * COIN_RATE;

    if (cost > money) {
      return player.sendMessage("§cYou don't have enough money!");
    }

    PlayerPaper.setScore(player, MONEY_SCOREBOARD, money - cost);
    PlayerPaper.setScore(player, CASINO_SCOREBOARD, currentCoins + coinsToBuy);

    player.sendMessage(`§aExchanged $${cost} for §e${coinsToBuy} casino coin(s)!`);
  });
}

// =====================================================
// 🎁 Reward Machine
// =====================================================

function openCasinoRewardUI(player: Player) {
  const coins = PlayerPaper.getScore(player, CASINO_SCOREBOARD) ?? 0;

  const form = new ActionFormData()
    .title("🎁 Casino Rewards")
    .body(`§bYour Coins: §a${coins}\n§7Choose a Pokémon to redeem:`);

  casinoRewards.forEach(r => {
    form.button(`${r.name} - §e${r.price} coins`);
  });

  form.show(player).then(res => {
    if (res.canceled) return;

    const choice = casinoRewards[res.selection];
    if (!choice) return;

    if (coins < choice.price) {
      player.sendMessage("§cYou don't have enough Casino coins!");
      return;
    }

    PlayerPaper.setScore(player, CASINO_SCOREBOARD, coins - choice.price);

    const variant = 0;
    const calc = calculatePokemon(choice.name, variant, "pokeball");
    const rID = ~~(Math.random() * 999999999);

    writePokemon(player, choice.name, rID, calc);
    finalizeToParty(player, rID, choice.name, calc);

    player.sendMessage(`§a✅ You exchanged ${choice.price} coins for a ${choice.name}!`);
  });
}

// =====================================================
// Finalize Pokémon to party/PC
// =====================================================

function finalizeToParty(player: Player, rID: number, name: PokemonName, calc: longHand) {
  const freeSlot = checkSidebarFree(player);

  if (freeSlot === undefined) {
    player.sendMessage(`§a✚ §7Pokemon Sent To Your PC`);
    return;
  }

  if (!selected.hasOwnProperty(player.name)) selected[player.name] = {};
  selected[player.name][freeSlot] = [Number(rID), name, calc];

  const suffix = freeSlot > 0 ? freeSlot + 1 : "";

  system.run(() => {
    player.runCommand(`scoreboard players set @s poke${suffix}rID ${rID}`);
    player.runCommand(`scoreboard players set @s poke${suffix}Id ${pokemonList.indexOf(name)}`);
    player.runCommand(`scoreboard players set @s poke${suffix}Ball ${Object.keys(ballTags).indexOf(calc.pokeBall)}`);
    player.runCommand(`scoreboard players set @s poke${suffix}Lvl ${calc.level}`);
    player.runCommand(`scoreboard players set @s poke${suffix}Var ${calc.Variant}`);
    player.runCommand(`scoreboard players set @s poke${suffix}HP ${calc.Current_Health ?? 0}`);
    player.runCommand(`scoreboard players set @s poke${suffix}HPmax ${calc.Base_Health}`);
  });

  player.sendMessage(`§a✚ §7Pokemon Added To Your Party`);
}
