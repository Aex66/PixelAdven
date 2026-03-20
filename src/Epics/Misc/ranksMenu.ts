import { Player, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { typeQuests } from "../Main Quests/Side Quests/type_catch";
import PlayerScore from "../../Papers/PlayerPaper"
import { openConfigMenu } from "./configMenu";

// =========================================================
// 🔹 DEFINE GLYPHS FOR EACH TYPE (Stage 3 / 6 / 10)
// =========================================================
const glyphRanks: Record<string, { stage3: string; stage6: string; stage10: string }> = {
  Normal: { stage3: "", stage6: "", stage10: "" },
  Fire: { stage3: "", stage6: "", stage10: "" },
  Water: { stage3: "", stage6: "", stage10: "" },
  Electric: { stage3: "", stage6: "", stage10: "" },
  Grass: { stage3: "", stage6: "", stage10: "" },
  Ice: { stage3: "", stage6: "", stage10: "" },
  Fighting: { stage3: "", stage6: "", stage10: "" },
  Poison: { stage3: "", stage6: "", stage10: "" },
  Ground: { stage3: "", stage6: "", stage10: "" },
  Flying: { stage3: "", stage6: "", stage10: "" },
  Psychic: { stage3: "", stage6: "", stage10: "" },
  Bug: { stage3: "", stage6: "", stage10: "" },
  Rock: { stage3: "", stage6: "", stage10: "" },
  Ghost: { stage3: "", stage6: "", stage10: "" },
  Dragon: { stage3: "", stage6: "", stage10: "" },
  Dark: { stage3: "", stage6: "", stage10: "" },
  Steel: { stage3: "", stage6: "", stage10: "" },
  Fairy: { stage3: "", stage6: "", stage10: "" },
};

// =========================================================
// 🔹 DEFINE EVENT TAGS
// =========================================================
interface EventTag {
  name: string;
  scoreboard: string;
  glyph: string;
  value: number;
}

const eventTags: EventTag[] = [
  { name: "Arkadia Partner", scoreboard: "arkadia", glyph: "", value: 1 },
  { name: "Youtuber", scoreboard: "youtube", glyph: "", value: 1 }
];

// =========================================================
// 🔹 DEFINE TEAM TAGS (Moderator / Staff / Admin / Owner)
// =========================================================
interface TeamTag {
  name: string;
  scoreboard: string;
  glyph: string;
  value: number;
}

const teamTags: TeamTag[] = [
  { name: "Moderator", scoreboard: "mod", glyph: "", value: 1 },
  { name: "Staff", scoreboard: "staff", glyph: "", value: 1 },
  { name: "Admin", scoreboard: "admin", glyph: "", value: 1 },
  { name: "Owner", scoreboard: "owner", glyph: "", value: 1 }
];


// =========================================================
// 🏅 MAIN RANKS MENU
// =========================================================
export function openRanksMenu(player: Player) {
  const form = new ActionFormData()
    .title("§7§7§rRanks Menu")
    .body("Select a rank category:");

  form.button("§e🔥 Type Titles", "textures/items/type_tags.png");
  form.button("§d⭐ Special Tags", "textures/items/special.png");

  // ✅ Only show Team Tags if they have PaTeam
  if (player.hasTag("PaTeam")) {
    form.button("§b👥 Team Tags", "textures/items/team.png");
  }

  form.button("Back", "textures/items/left_arrow.png");
  form.button("§cClose");

  form.show(player).then((res) => {
    if (res.canceled) return;

    const offset = player.hasTag("PaTeam") ? 1 : 0;

    switch (res.selection) {
      case 0:
        openTypeCategoryMenu(player);
        break;
      case 1:
        openEventTagMenu(player);
        break;
      case 2:
        if (offset === 1) {
          openTeamTagMenu(player);
          break;
        }
        openConfigMenu(player);
        break;
      case 3:
        if (offset === 1) {
          openConfigMenu(player);
          break;
        }
        break;
      default:
        break;
    }
  });
}

// =========================================================
// 🔸 TYPE CATEGORY MENU (lists all 18 types)
// =========================================================
function openTypeCategoryMenu(player: Player) {
  const form = new ActionFormData()
    .title("§6Type Rank Titles")
    .body("Select a Pokémon Type:");

  for (const type of typeQuests) {
    form.button(`§e${type.name}`, type.icon);
  }

  form.button("§c⬅ Back to Ranks Menu");

  form.show(player).then((res) => {
    if (res.canceled) return;

    if (res.selection === typeQuests.length) {
      openRanksMenu(player);
      return;
    }

    const selectedType = typeQuests[res.selection];
    if (!selectedType) return;
    openTypeRankMenu(player, selectedType);
  });
}

// =========================================================
// 🔹 TYPE-SPECIFIC TITLE MENU
// =========================================================
function openTypeRankMenu(player: Player, type: any) {
  const form = new ActionFormData()
    .title(`§6${type.name} Titles`)
    .body("Select a Title to apply to yourself:");

  const glyph = glyphRanks[type.name];
  const progress = Number(PlayerScore.getScore(player, type.score) ?? 0);
  const availableRanks: { label: string; tag: string }[] = [];

  const ranks = [
    { level: 3, threshold: type.thresholds[3], glyph: glyph.stage3 },
    { level: 6, threshold: type.thresholds[6], glyph: glyph.stage6 },
    { level: 10, threshold: type.thresholds[10], glyph: glyph.stage10 },
  ];

  for (const rank of ranks) {
    if (progress >= rank.threshold) {
      const tag = `rank:${rank.glyph}`;
      availableRanks.push({ label: `§b${type.name} ${rank.glyph}`, tag });
      form.button(`§f${rank.glyph} §e${type.name} Rank §b${rank.level}`);
    }
  }

  if (availableRanks.length === 0) {
    form.body("§7You haven’t unlocked any titles for this type yet!");
  }

  form.button("§c⬅ Back to Type List");

  form.show(player).then((res) => {
    if (res.canceled) return;
    if (res.selection === availableRanks.length) {
      openTypeCategoryMenu(player);
      return;
    }

    const selected = availableRanks[res.selection];
    if (!selected) return;
    applyRankTag(player, selected.tag, type.name);
  });
}

// =========================================================
// 🟣 EVENT TAG MENU
// =========================================================
function openEventTagMenu(player: Player) {
  const form = new ActionFormData()
    .title("§d⭐ Event Titles")
    .body("Special event-based titles you’ve earned:");

  const availableTags: { label: string; tag: string }[] = [];

  for (const evt of eventTags) {
    const score = Number(PlayerScore.getScore(player, evt.scoreboard) ?? 0);
    if (score >= evt.value) {
      const tag = `rank:${evt.glyph}`;
      availableTags.push({ label: `§b${evt.name}`, tag });
      form.button(`§f${evt.glyph} §e${evt.name}`);
    }
  }

  if (availableTags.length === 0) {
    form.body("§7You haven’t unlocked any event titles yet!");
  }

  form.button("§c⬅ Back to Ranks Menu");

  form.show(player).then((res) => {
    if (res.canceled) return;
    if (res.selection === availableTags.length) {
      openRanksMenu(player);
      return;
    }

    const selected = availableTags[res.selection];
    if (!selected) return;
    applyRankTag(player, selected.tag, selected.label.replace("§b", ""));
  });
}

// =========================================================
// 👥 TEAM TAG MENU (Moderator, Staff, Admin, Owner)
// =========================================================
function openTeamTagMenu(player: Player) {
  const form = new ActionFormData()
    .title("§b👥 Team Titles")
    .body("Titles available to server team members:");

  const availableTags: { label: string; tag: string }[] = [];

  for (const team of teamTags) {
    const score = Number(PlayerScore.getScore(player, team.scoreboard) ?? 0);
    if (score >= team.value) {
      const tag = `rank:${team.glyph}`;
      availableTags.push({ label: `§b${team.name}`, tag });
      form.button(`§f${team.glyph} §e${team.name}`);
    }
  }

  if (availableTags.length === 0) {
    form.body("§7You do not have any team titles unlocked.");
  }

  form.button("§c⬅ Back to Ranks Menu");

  form.show(player).then((res) => {
    if (res.canceled) return;
    if (res.selection === availableTags.length) {
      openRanksMenu(player);
      return;
    }

    const selected = availableTags[res.selection];
    if (!selected) return;
    applyRankTag(player, selected.tag, selected.label.replace("§b", ""));
  });
}

// =========================================================
// 🔹 APPLY RANK TAG (remove old first, then add new)
// =========================================================
function applyRankTag(player: Player, newTag: string, titleName: string) {
  const tags = player.getTags();
  for (const tag of tags) {
    if (tag.startsWith("rank:")) {
      player.runCommand(`tag @s remove "${tag}"`);
    }
  }

  player.runCommand(`tag @s add "${newTag}"`);
  player.sendMessage(`§aYou equipped the §e${titleName}§a title ${newTag.split(":")[1]}!`);
}

