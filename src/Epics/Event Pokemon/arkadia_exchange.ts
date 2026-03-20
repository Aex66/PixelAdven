import { world, Player, system } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";

// Helper: get scoreboard score
function getScore(player: Player, objective: string): number {
    try {
        return world.scoreboard.getObjective(objective)?.getScore(player.scoreboardIdentity) ?? 0;
    } catch {
        return 0;
    }
}

// Helper: give items
function addItem(player: Player, item: string, amount: number) {
    player.runCommand(`give @s ${item} ${amount}`);
}

// Helper: remove Arkadia tokens
function removeTokens(player: Player, objective: string, amount: number) {
    player.runCommand(`scoreboard players remove @s ${objective} ${amount}`);
}

// ===============================
// MAIN MENU
// ===============================
export function openArkadiaExchange(player: Player) {
    const claimed = (player.getDynamicProperty("arkadia_cubchoo_claimed") as boolean) ?? false;
    const tokens = getScore(player, "arkadia_tokens");
    const form = new ActionFormData()
        .title("§b§lArkadia Exchange")
        .body(
            `§7Spend Arkadia Tokens for exclusive rewards.\n\n` +
            `§fYour Arkadia Tokens: §e${tokens}`
        )
        .button("§aBuy Arkadia Balls\n§5Cost: 100 tokens each")
        .button("§6Buy Arkadia Crates\n§5Cost: 500 tokens each")
        .button(
            claimed
                ? "§8Cubchoo Already Claimed"
                : "§bReceive Cubchoo 'motivation'\n§5(One-time reward)"
        )
        .button("§dArkadia Quiz"); // NEW BUTTON

    form.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === undefined) return;

        switch (response.selection) {
            case 0:
                buyArkadiaBalls(player);
                break;
            case 1:
                buyArkadiaCrates(player);
                break;
            case 2:
                if (claimed) {
                    player.sendMessage("§cYou have already claimed Cubchoo 'motivation'.");
                } else {
                    confirmCubchoo(player);
                }
                break;
            case 3:
                openArkadiaQuiz(player);
                break;
        }
    });
}


function openArkadiaQuiz(player: Player) {
    const form = new ModalFormData()
        .title("§dArkadia Quiz")
        .textField(
            "Who is the NPC in the Arkadia Spawn that gives out the Bread?",
            ""
        );

    form.show(player).then(response => {
        if (response.canceled) return;

        const answer = (response.formValues?.[0] as string)?.trim().toLowerCase();

        if (answer === "jorvik") {
            player.sendMessage("§aCorrect! The NPC is §eJorvik§a.");
        } else {
            player.sendMessage("§cIncorrect answer. Try again!");
        }

        system.run(() => openArkadiaExchange(player));
    });
}

// ===============================
// BUY ARKADIA BALLS
// ===============================
function buyArkadiaBalls(player: Player) {
    const form = new ModalFormData()
        .title("§aBuy Arkadia Balls")
        .slider("Select quantity", 1, 64, {
            defaultValue: 1,
            valueStep: 1,
        });

    form.show(player).then((response) => {
        if (response.canceled) return;

        const amount = response.formValues?.[0] as number;
        if (!amount || amount <= 0) return;

        const cost = amount * 100;
        const tokens = getScore(player, "arkadia_tokens");

        if (tokens < cost) {
            player.sendMessage(
                `§cYou need §e${cost}§c Arkadia Tokens but only have §e${tokens}§c.`
            );
            return;
        }

        removeTokens(player, "arkadia_tokens", cost);
        addItem(player, "pokeworld:arkadiaball", amount);
        player.sendMessage(`§aPurchased §e${amount}§a Arkadia Balls!`);
    });
}

// ===============================
// BUY ARKADIA CRATES
// ===============================
function buyArkadiaCrates(player: Player) {
    const form = new ModalFormData()
        .title("§6Buy Arkadia Crates")
        .slider("Select quantity", 1, 64, {
            defaultValue: 1,
            valueStep: 1,
        });

    form.show(player).then((response) => {
        if (response.canceled) return;

        const amount = response.formValues?.[0] as number;
        if (!amount || amount <= 0) return;

        const cost = amount * 500;
        const tokens = getScore(player, "arkadia_tokens");

        if (tokens < cost) {
            player.sendMessage(
                `§cYou need §e${cost}§c Arkadia Tokens but only have §e${tokens}§c.`
            );
            return;
        }

        removeTokens(player, "arkadia_tokens", cost);
        addItem(player, "pokeworld:arkadia_crate", amount);
        player.sendMessage(`§aPurchased §e${amount}§a Arkadia Crates!`);
    });
}

// ===============================
// CUBCHOO CONFIRM (YES/NO)
// ===============================
function confirmCubchoo(player: Player) {
    const claimed = (player.getDynamicProperty("arkadia_cubchoo_claimed") as boolean) ?? false;

    if (claimed) {
        player.sendMessage("§cYou have already claimed Cubchoo 'motivation'.");
        return;
    }

    const cost = 2500;
    const tokens = getScore(player, "arkadia_tokens");

    const form = new ActionFormData()
        .title("§bReceive Cubchoo?")
        .body(
            `Do you want to claim Cubchoo with the nickname 'motivation'?\n\n§7Cost: §e${cost} Arkadia Tokens\n§7This reward can only be claimed once.`
        )
        .button("§aYes, claim Cubchoo")
        .button("§cNo, go back");

    form.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === undefined) return;

        switch (response.selection) {
            case 0: { // YES
                const recheck = (player.getDynamicProperty(
                    "arkadia_cubchoo_claimed"
                ) as boolean) ?? false;

                if (recheck) {
                    player.sendMessage("§cYou have already claimed Cubchoo 'motivation'.");
                    return;
                }

                if (tokens < cost) {
                    player.sendMessage(
                        `§cYou need §e${cost}§c Arkadia Tokens to claim Cubchoo but only have §e${tokens}§c.`
                    );
                    return;
                }

                removeTokens(player, "arkadia_tokens", cost);
                player.runCommand(`scriptevent pokeworld:give_motivation_cubchoo`);
                player.setDynamicProperty("arkadia_cubchoo_claimed", true);
                player.sendMessage(`§bCubchoo 'motivation' has been added to your Pokémon!`);
                break;
            }

            case 1: // NO
                system.run(() => openArkadiaExchange(player));
                break;
        }
    });
}

// ===============================
// NPC INTERACTION: HIT ENTITY
// ===============================
world.afterEvents.entityHitEntity.subscribe((ev) => {
    const { damagingEntity, hitEntity } = ev;

    if (!(damagingEntity instanceof Player)) return;
    if (!hitEntity) return;

    if (hitEntity.typeId === "pokeworld:arkadia_exchange") {
        system.run(() => openArkadiaExchange(damagingEntity));
    }
});

// ========== ARKADIA CRATE OPENING ==========
world.afterEvents.itemUse.subscribe(ev => {
    const player = ev.source;
    const item = ev.itemStack;

    if (!player || item.typeId !== "pokeworld:arkadia_crate") return;

    // REMOVE 1 CRATE
    player.runCommand(`clear @s pokeworld:arkadia_crate 0 1`);

    // REROLL SYSTEM
    function rollReward() {
        const roll = Math.floor(Math.random() * 100);

        // =============================
        // COMMON — 55% (0–54)
        // =============================
        if (roll < 55) {
            const commonRoll = Math.floor(Math.random() * 5);

            switch (commonRoll) {
                case 0:
                    return { item: "pokeworld:arkadiaball", amount: 10, msg: "You received §a10 Arkadia Balls§f!" };
                case 1:
                    return { item: "pokeworld:potion", amount: 10, msg: "You received §a10 Potions§f!" };
                case 2:
                    return { item: "pokeworld:super_potion", amount: 5, msg: "You received §a5 Super Potions§f!" };
                case 3:
                    return { item: "pokeworld:pokeball", amount: 10, msg: "You received §a10 Poké Balls§f!" };
                case 4:
                    return { item: "pokeworld:greatball", amount: 5, msg: "You received §a5 Great Balls§f!" };
            }
        }

        // =============================
        // UNCOMMON — 25% (55–79)
        // =============================
        if (roll < 80) {
            const uncommonRoll = Math.floor(Math.random() * 2);

            switch (uncommonRoll) {
                case 0:
                    return { item: "pokeworld:ultraball", amount: 5, msg: "You received §b5 Ultra Balls§f!" };

                case 1:
                    // Check if player already has Arkadia Rank
                    const currentScore = world.scoreboard
                        .getObjective("arkadia")
                        ?.getScore(player.scoreboardIdentity);

                    if (currentScore === 1) {
                        // Already unlocked → Force reroll
                        return rollReward();
                    }

                    // Grant the rank tag
                    player.runCommand(`scoreboard players set @s arkadia 1`);
                    return { item: null, amount: 0, msg: "You received the §dArkadia Rank Tag§f!" };
            }
        }

        // =============================
        // RARE — 20% (80–99)
        // =============================
        const rareList = [
            "pokeworld:arkadia_helm",
            "pokeworld:typed_plushie",
            "pokeworld:foxmink_plushie",
            "pokeworld:gladliator_plushie",
            "pokeworld:legendira_plushie",
            "pokeworld:paradox_plushie",
            "pokeworld:zamorr_plushie",
            "pokeworld:kody_plushie"
        ];

        const rarePick = rareList[Math.floor(Math.random() * rareList.length)];
        const rareName = rarePick.replace("pokeworld:", "").replace("_", " ");

        return { item: rarePick, amount: 1, msg: `You received §6${rareName}§f!` };
    }

    // FINAL REWARD
    const reward = rollReward();

    if (reward.item) {
        player.runCommand(`give @s ${reward.item} ${reward.amount}`);
    }

    player.sendMessage(`§bArkadia Crate Reward: §f${reward.msg}`);
});
