
import { world, system } from '@minecraft/server';
import Player from '../../../Papers/PlayerPaper.js';

function getPokemonImage(index: number, variant: number): string {
    let suffix = "I";
    if (variant == 1)
        suffix = "P";
    if (variant == 2)
        suffix = "O";
    if (variant == 3)
        suffix = "N";
    if (!index || index == 0)
        suffix = "o";
    let final = suffix + index;
    let length = final.length;
    for (let i = 4; i > length; i--)
        final += " ";
    if (final.length > 4)
        final = "O   ";
    return final;
}

function getPokemonStats(health: number, maxHealth: number, level: number): string {
    let string = "§8LvL:" + (level ?? 0) + "\nHP:" + (health ?? 0) + "/" + (maxHealth ?? 0);
    let length = string.length;
    for (let i = 21; i > length; i--)
        string += " ";
    return string;
}

system.runInterval(() => sidebar(), 20);

export function sidebar() {
    world.getAllPlayers().forEach(player => {
        // Hide sidebar if in battle or tags set
        if (player.hasTag("battle") || player.hasTag("sbOff") || player.hasTag("sbd")) {
            player.onScreenDisplay.setActionBar("0"); // clear sidebar text
            return;
        }

        let text = "";
        for (let i = 0; i < 6; i++) {
            const pokeVar = Player.getScore(player, `poke${i > 0 ? i + 1 : ''}Var`) ?? 0,
                pokeId = Player.getScore(player, `poke${i > 0 ? i + 1 : ''}Id`) ?? 0,
                level = Player.getScore(player, `poke${i > 0 ? i + 1 : ''}Lvl`) ?? 0,
                health = Player.getScore(player, `poke${i > 0 ? i + 1 : ''}HP`) ?? 0,
                maxHealth = Player.getScore(player, `poke${i > 0 ? i + 1 : ''}HPmax`) ?? 0;

            const pokeImage = getPokemonImage(pokeId, pokeVar),
                pokeText = getPokemonStats(health, maxHealth, level),
                pokeball = [" ", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B"][Player.getScore(player, `poke${i > 0 ? i + 1 : ''}Ball`) ?? 0];

            text += pokeImage + pokeText + pokeball;
        }
        player.onScreenDisplay.setActionBar(text);
    });
}