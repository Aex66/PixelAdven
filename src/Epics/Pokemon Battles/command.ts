import { system, world, Player } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { distance } from "./utils";
import { PlayerBattler } from "./classes/Battler";
import { Battle } from "./classes/Battle";

const requests: { from: string, to: string, expires: number }[] = [];

export function openBattleMenu(player: Player) {
    const form = new ActionFormData()
        .title("§aBattle Menu")
        .button("§bSend Battle Request")
        .button(player.hasTag("PvpNull") ? "§cDisable Pvp Requests" : "§aEnable Pvp Requests")
        .show(player).then(res => {
            if (res.canceled) return;

            if (res.selection === 0) return openTargetSelection(player);

            if (res.selection === 1) {
                if (player.hasTag("PvpNull")) {
                    player.removeTag("PvpNull");
                    player.sendMessage("§aPvp disabled. You can now be challenged.");
                } else {
                    player.addTag("PvpNull");
                    player.sendMessage("§cPvp enabled. You are now hidden from challenges.");
                }
            }
        });
}

function openTargetSelection(player: Player) {
    const hpKeys = ["pokeHP", "poke2HP", "poke3HP", "poke4HP", "poke5HP", "poke6HP"];
    const allDead = hpKeys.every(key => {
        const score = world.scoreboard.getObjective(key)?.getScore(player) ?? 0;
        return score <= 0;
    });

    if (allDead) {
        return player.sendMessage(`§cYou don't have any Pokemon left to fight!`);
    }

    const nearbyPlayers = world.getPlayers().filter(p => p.id !== player.id && !p.hasTag("PvpNull") && distance(player.location, p.location) <= 10);

    if (!nearbyPlayers.length) return player.sendMessage("§cNo eligible players nearby.");

    const names = nearbyPlayers.map(p => p.name);
    const modal = new ModalFormData()
        .title("§aSelect a Player");

    modal.dropdown("Challenge", names);

    modal.show(player).then(res => {
        const index = res.formValues?.[0];
        if (res.canceled || typeof index !== "number" || index < 0 || index >= names.length) return;

        const selectedName = names[index];
        const target = world.getPlayers().find(p => p.name === selectedName);

        if (!target) return player.sendMessage("§cPlayer not found.");

        if (target.hasTag("battle")) return player.sendMessage(`§c${target.name} is currently battling!`);

        const existing = requests.find(req => req.from === player.id && req.to === target.id);
        if (existing) return player.sendMessage("§cWait before sending another battle request!");

        requests.push({ from: player.id, to: target.id, expires: Date.now() + 30000 });

        player.sendMessage(`§aYou sent a battle request to §d${target.name}`);
        openAcceptDenyPrompt(target, player);
    });
}

function openAcceptDenyPrompt(target: Player, sender: Player) {
    const form = new ActionFormData()
        .title("§dBattle Request")
        .body(`§d${sender.name} §ahas challenged you to a battle!`)
        .button("§aAccept")
        .button("§cDeny");

    form.show(target).then(res => {
        if (res.canceled) return;

        const index = requests.findIndex(r => r.from === sender.id && r.to === target.id);
        if (index === -1) return target.sendMessage("§cNo active request found.");

        requests.splice(index, 1);

        if (res.selection === 0) {
            const hpKeys = ["pokeHP", "poke2HP", "poke3HP", "poke4HP", "poke5HP", "poke6HP"];
            const allDead = hpKeys.every(key => {
                const score = world.scoreboard.getObjective(key)?.getScore(target) ?? 0;
                return score <= 0;
            });

            if (allDead) {
                return target.sendMessage(`§cYou don't have any Pokemon left to fight!`);
            }

            sender.sendMessage(`§aBattle request accepted! You're now battling §d${target.name}`);
            target.sendMessage(`§aBattle request accepted! You're now battling §d${sender.name}`);

            const battler1 = new PlayerBattler(sender);
            const battler2 = new PlayerBattler(target);
            const battle = new Battle(battler1, battler2);

            sender.addTag("battle");
            target.addTag("battle");
            sender.runCommand("title @s actionbar 0");
            target.runCommand("title @s actionbar 0");
            sender.addTag("next");
            target.addTag("next");

            battle.start();
        } else {
            target.sendMessage("§cYou declined the battle request.");
            sender.sendMessage(`§c${target.name} declined your battle request.`);
        }
    });
}

system.runInterval(() => {
    const now = Date.now();
    for (let i = requests.length - 1; i >= 0; i--) {
        if (now >= requests[i].expires) {
            requests.splice(i, 1);
        }
    }
}, 5);