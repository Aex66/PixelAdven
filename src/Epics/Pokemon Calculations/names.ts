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
import { world, system, Entity } from "@minecraft/server";
import { pokemonText } from "../../Papers/Paragraphs/ExtrasParagraphs.js";
import { pokemonGrowth } from "../../Letters/pokemon/growth.js";
import wildPokemon from "../../Letters/pokemon/wild.js";
import { StatusEffects } from "../../Letters/pokemon/moves.js";

/**
 * Get the score of a target on an objective
 * @param {string} objective Objective to get a score from
 * @param {Entity|string} target The entity, player, or fake player to get the score of
 * @example getScore('Money', entity) //Returns the value of the scoreboard "Money"
 */
// ✅ SAFE SCOREBOARD ACCESS
function getScore(objective: string, target: Entity): number {
    const obj = world.scoreboard.getObjective(objective);
    if (!obj) return 0;

    try {
        return obj.getScore(target) ?? 0;
    } catch {
        return 0;
    }
}

const statusEffects = {
    [StatusEffects.BadlyPoisoned]: "",
    [StatusEffects.Poisoned]: "",
    [StatusEffects.Confused]: "",
    [StatusEffects.Paralyzed]: "",
    [StatusEffects.Burned]: "",
    [StatusEffects.Flinched]: "Flinched",
    [StatusEffects.Frozen]: "",
    [StatusEffects.Sleep]: ""
};
const healthGlyphs = Array.from({ length: 101 }, (_, i) => {
    if (i === 100) return ""; // U+E564
    if (i === 99) return ""; // U+E563
    if (i === 98) return ""; // U+E562
    if (i === 97) return ""; // U+E561
    if (i === 96) return ""; // U+E560
    if (i === 95) return ""; // U+E55F
    if (i === 94) return ""; // U+E55E
    if (i === 93) return ""; // U+E55D
    if (i === 92) return ""; // U+E55C
    if (i === 91) return ""; // U+E55B
    if (i === 90) return ""; // U+E55A
    if (i === 89) return ""; // U+E559
    if (i === 88) return ""; // U+E558
    if (i === 87) return ""; // U+E557
    if (i === 86) return ""; // U+E556
    if (i === 85) return ""; // U+E555
    if (i === 84) return ""; // U+E554
    if (i === 83) return ""; // U+E553
    if (i === 82) return ""; // U+E552
    if (i === 81) return ""; // U+E551
    if (i === 80) return ""; // U+E550
    if (i === 79) return ""; // U+E54F
    if (i === 78) return ""; // U+E54E
    if (i === 77) return ""; // U+E54D
    if (i === 76) return ""; // U+E54C
    if (i === 75) return ""; // U+E54B
    if (i === 74) return ""; // U+E54A
    if (i === 73) return ""; // U+E549
    if (i === 72) return ""; // U+E548
    if (i === 71) return ""; // U+E547
    if (i === 70) return ""; // U+E546
    if (i === 69) return ""; // U+E545
    if (i === 68) return ""; // U+E544
    if (i === 67) return ""; // U+E543
    if (i === 66) return ""; // U+E542
    if (i === 65) return ""; // U+E541
    if (i === 64) return ""; // U+E540
    if (i === 63) return ""; // U+E53F
    if (i === 62) return ""; // U+E53E
    if (i === 61) return ""; // U+E53D
    if (i === 60) return ""; // U+E53C
    if (i === 59) return ""; // U+E53B
    if (i === 58) return ""; // U+E53A
    if (i === 57) return ""; // U+E539
    if (i === 56) return ""; // U+E538
    if (i === 55) return ""; // U+E537
    if (i === 54) return ""; // U+E536
    if (i === 53) return ""; // U+E535
    if (i === 52) return ""; // U+E534
    if (i === 51) return ""; // U+E533
    if (i === 50) return ""; // U+E532
    if (i === 49) return ""; // U+E531
    if (i === 48) return ""; // U+E530
    if (i === 47) return ""; // U+E52F
    if (i === 46) return ""; // U+E52E
    if (i === 45) return ""; // U+E52D
    if (i === 44) return ""; // U+E52C
    if (i === 43) return ""; // U+E52B
    if (i === 42) return ""; // U+E52A
    if (i === 41) return ""; // U+E529
    if (i === 40) return ""; // U+E528
    if (i === 39) return ""; // U+E527
    if (i === 38) return ""; // U+E526
    if (i === 37) return ""; // U+E525
    if (i === 36) return ""; // U+E524
    if (i === 35) return ""; // U+E523
    if (i === 34) return ""; // U+E522
    if (i === 33) return ""; // U+E521
    if (i === 32) return ""; // U+E520
    if (i === 31) return ""; // U+E51F
    if (i === 30) return ""; // U+E51E
    if (i === 29) return ""; // U+E51D
    if (i === 28) return ""; // U+E51C
    if (i === 27) return ""; // U+E51B
    if (i === 26) return ""; // U+E51A
    if (i === 25) return ""; // U+E519
    if (i === 24) return ""; // U+E518
    if (i === 23) return ""; // U+E517
    if (i === 22) return ""; // U+E516
    if (i === 21) return ""; // U+E515
    if (i === 20) return ""; // U+E514
    if (i === 19) return ""; // U+E513
    if (i === 18) return ""; // U+E512
    if (i === 17) return ""; // U+E511
    if (i === 16) return ""; // U+E510
    if (i === 15) return ""; // U+E50F
    if (i === 14) return ""; // U+E50E
    if (i === 13) return ""; // U+E50D
    if (i === 12) return ""; // U+E50C
    if (i === 11) return ""; // U+E50B
    if (i === 10) return ""; // U+E50A
    if (i === 9) return ""; // U+E509
    if (i === 8) return ""; // U+E508
    if (i === 7) return ""; // U+E507
    if (i === 6) return ""; // U+E506
    if (i === 5) return ""; // U+E505
    if (i === 4) return ""; // U+E504
    if (i === 3) return ""; // U+E503
    if (i === 2) return ""; // U+E502
    if (i === 1) return ""; // U+E501
    return "";              // U+E500 — 0%
});


const expGlyphs = Array.from({ length: 101 }, (_, i) => {
    if (i === 100) return ""; // Max EXP glyph (same as Full Health glyph)
    if (i >= 90) return "";  // 90-99%
    if (i >= 80) return "";  // 80-89%
    if (i >= 70) return "";  // 70-79%
    if (i >= 60) return "";  // 60-69%
    if (i >= 50) return "";  // 50-59%
    if (i >= 40) return "";  // 40-49%
    if (i >= 30) return "";  // 30-39%
    if (i >= 20) return "";  // 20-29%
    if (i >= 10) return "";  // 10-19%
    return "";               // 0-9%
});

let showScores = true;
system.runInterval(() => {
    Array.from(world.getDimension("minecraft:overworld").getEntities()).forEach((entity) => {
        if (
            entity.typeId === "minecraft:player" ||
            entity.hasTag("npc_trainer") ||
            entity.typeId === "rot:hologram" ||
            !entity.hasTag("battle")
        ) return;

        system.run(() => {
            try {
                // ⛔ HARD ENTITY GUARD
                if (!entity || !entity.isValid) return;

                const wildName = pokemonText(entity.typeId);
                const level = getScore("Lvl", entity);
                const Ex = getScore("Ex", entity);

                const growth = wildPokemon[wildName]?.Growth;
                const nextLevel =
                    entity.hasTag("summoned") && growth
                        ? pokemonGrowth[growth]?.[level]
                        : undefined;

                if (typeof nextLevel === "number" && Ex > nextLevel) return;

                let entityName = "";
                const nicknameTag = entity.getTags().find(t => t.startsWith("NN:"));

                const variant = getScore("Variant", entity);
                const shinyGlyph =
                    variant === 1 || variant === 3 || variant === 5 || variant === 7 || variant === 9
                        ? " "
                        : "";

                if (nicknameTag) {
                    entityName = ` ${nicknameTag.slice(3)}`;
                } else {
                    const match = entity.typeId.match(/:([\s\S]*)$/);
                    if (!match) return;

                    entityName = match[1]
                        .replace(/[\W_]/g, " ")
                        .split(" ")
                        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ");

                    if (entityName.includes("Wild")) {
                        entityName = entityName.replace("Wild", "");
                    } else {
                        entityName = ` ${entityName}`;
                    }
                }

                const isWild = entityName.startsWith("");
                const shinyPrefix = isWild ? shinyGlyph : "";

                const levelInfo = `§g Lvl: ${level}`;

                const expPercent =
                    typeof nextLevel === "number" && nextLevel > 0
                        ? Math.floor((Ex / nextLevel) * 100)
                        : 0;

                const expGlyph = expGlyphs[Math.min(expPercent, 100)];
                const expInfo = nextLevel ? `\n§g ${expGlyph}` : "";

                const hpLow = getScore("HP_Low", entity);
                const hpBase = getScore("HP_Base", entity);
                const hpPercent = hpBase > 0 ? Math.floor((hpLow / hpBase) * 100) : 0;
                const healthGlyph = healthGlyphs[Math.min(hpPercent, 100)];

                const scores = `\n${healthGlyph}\n`;

                const condition = getScore("condition", entity);
                const status =
                    condition > 0
                        ? statusEffects[condition as keyof typeof statusEffects] ?? ""
                        : "";

                entity.nameTag =
                    `${shinyPrefix}§a${levelInfo}${entityName}${status}` +
                    `${showScores ? scores : ""}` +
                    `${expInfo}`;
            } catch {
                /* swallow */
            }
        });
    });
}, 20);