import { ScriptEventSource, system, world, Player, EquipmentSlot } from "@minecraft/server";
import { randomNumber } from "./utils";
import { grammarText } from "../../Papers/Paragraphs/ExtrasParagraphs";
import "./command";
import { Battle, battles } from "./classes/Battle";
import { NpcBattler, PlayerBattler, WildBattler } from "./classes/Battler";
import quick from "../../quick";
import { pokedex } from "./forms/pokedex/main";
import { Pokemon } from "./classes/Pokemon";
import { math } from "../Pokemon Calculations/main";
import { GymNpcBattler } from "./classes/TeamGymBattler";
import { getPlayerTeam } from "../TeamGyms/playerTeams";

system.afterEvents.scriptEventReceive.subscribe(({ id, sourceType, sourceEntity }) => {
  if (sourceType !== ScriptEventSource.Entity) return;
  switch (id) {
    case "pokeworld:setup":
      sourceEntity.runCommand("function scsetup");
      break;
    case "pokeworld:initialize_user":
      if (sourceEntity.hasTag("underground_setup")) return;
      sourceEntity.addTag("underground_setup");
      sourceEntity.setDynamicProperty("trainerId", randomNumber(1000000, 9999999));
      break;
    case "pokeworld:force_end_battle":
      const battle = battles.get(sourceEntity.id);
      if (battle) battle.end();
      break;
  }
}, { namespaces: ["pokeworld"] });

world.afterEvents.entityHitEntity.subscribe(({ damagingEntity: hitter, hitEntity: victim }) => {
    if (!(hitter instanceof Player)) return;
  const hand = hitter.getComponent("equippable").getEquipment(EquipmentSlot.Mainhand);
  if (!hand || hand.typeId !== "pokeworld:pokedex") return;

  // 🚫 HARD BATTLE BLOCK: Pokémon already summoned
  if (hitter.hasTag("summoned")) {
    hitter.sendMessage("§cYou must recall your Pokémon before starting a battle.");
    return;
  }

  // =========================
  // TEAM GYM BATTLES
  // =========================
  if (
    victim.typeId === "pokeworld:valor_team" ||
    victim.typeId === "pokeworld:mystic_team" ||
    victim.typeId === "pokeworld:instinct_team"
  ) {
    if (victim.hasTag("battle")) return hitter.sendMessage("§cThis gym is currently in a battle!");

    const playerTeam = getPlayerTeam(hitter);
    const gymTeamTag = victim.getTags().find(t => t.startsWith("GymTeam:"));
    const gymTeam = gymTeamTag?.split(":")[1];

    if (playerTeam && gymTeam === playerTeam) {
      hitter.sendMessage("§aThis is your team's gym.");
      return;
    }

    const hpKeys = ["pokeHP","poke2HP","poke3HP","poke4HP","poke5HP","poke6HP"];
    if (hpKeys.every(k => (world.scoreboard.getObjective(k)?.getScore(hitter) ?? 0) <= 0))
      return hitter.sendMessage("§cYou don't have any Pokemon left to fight!");

    hitter.sendMessage("§eThe gym challenges you!");
    victim.dimension.spawnParticle("minecraft:basic_flame_particle", victim.getHeadLocation());
    victim.teleport(hitter.location);
    const d = hitter.getViewDirection();
    hitter.applyKnockback({ x: d.x * -2, z: d.z * -2 }, 0.5);

    const player = new PlayerBattler(hitter);
    const trainer = new GymNpcBattler(victim);
    const battle = new Battle(player, trainer);

    trainer.deployRandom();
    hitter.addTag("next");
    hitter.addTag("battle");
    hitter.runCommand("title @s actionbar 0");
    victim.addTag("battle");
    victim.addEffect("slowness", 999999, { amplifier: 255, showParticles: false });
    battle.start();
    return;
  }

  // =========================
  // WILD BATTLES
  // =========================
  if (!victim.typeId.startsWith("pokeworld:wild_") && !victim.hasTag("npc_trainer")) return;

  if (victim.typeId.startsWith("pokeworld:wild")) {
    if (victim.typeId.includes("ditto")) return hitter.sendMessage("§cOops you can't currently fight ditto!");
    if (victim.hasTag("battle")) return hitter.sendMessage("§cThis Pokemon is currently in a battle!");

    const hpKeys = ["pokeHP","poke2HP","poke3HP","poke4HP","poke5HP","poke6HP"];
    if (hpKeys.every(k => (world.scoreboard.getObjective(k)?.getScore(hitter) ?? 0) <= 0))
      return hitter.sendMessage("§cYou don't have any Pokemon left to fight!");

    victim.addTag(`ODW:${hitter.nameTag}`);
    victim.runCommand("scriptevent pokeworld:type_change");
    math(victim, hitter);
    hitter.sendMessage(`§e${grammarText(victim.typeId)} accepts to fight you!`);
    victim.dimension.spawnParticle("minecraft:basic_flame_particle", victim.getHeadLocation());
    victim.teleport(hitter.location);
    const d = hitter.getViewDirection();
    hitter.applyKnockback({ x: d.x * -2, z: d.z * -2 }, 0.5);

    const player = new PlayerBattler(hitter);
    const wild = new WildBattler(victim);
    wild.pokemon = new Pokemon(victim, wild);
    const battle = new Battle(player, wild);

    hitter.addTag("next");
    hitter.addTag("battle");
    hitter.runCommand("title @s actionbar 0");
    victim.addTag("battle");
    victim.addEffect("slowness", 999999, { amplifier: 255, showParticles: false });
    battle.start();
    return;
  }

  // =========================
  // NPC TRAINERS
  // =========================
  if (!victim.hasTag("npc_trainer") || victim.hasTag("battle")) return;

  const victimTrainerTag = victim.getTags().find(t => t.startsWith("TrainerType:"));
  if (!victimTrainerTag) return;

  const dataRaw = world.getDynamicProperty(`trainer_data.${hitter.name}`) as string ?? '{"trainerTypes":[]}';
  const data = (() => { try { return JSON.parse(dataRaw); } catch { return { trainerTypes: [] }; } })();
  if (data.trainerTypes.includes(victimTrainerTag))
    return hitter.sendMessage("§cYou have already defeated this opponent!");

  const hpKeys = ["pokeHP","poke2HP","poke3HP","poke4HP","poke5HP","poke6HP"];
  if (hpKeys.every(k => (world.scoreboard.getObjective(k)?.getScore(hitter) ?? 0) <= 0))
    return hitter.sendMessage("§cYou don't have any Pokemon left to fight!");

  const trainer = new NpcBattler(victim);
  hitter.sendMessage(`§e${trainer.name} Trainer accepts to fight you!`);
  victim.dimension.spawnParticle("minecraft:basic_flame_particle", victim.getHeadLocation());
  victim.teleport(hitter.location);
  const d = hitter.getViewDirection();
  hitter.applyKnockback({ x: d.x * -2, z: d.z * -2 }, 0.5);

  const player = new PlayerBattler(hitter);
  const battle = new Battle(player, trainer);
  trainer.deployRandom();

  hitter.addTag("next");
  hitter.addTag("battle");
  hitter.runCommand("title @s actionbar 0");
  victim.addTag("battle");
  victim.addEffect("slowness", 999999, { amplifier: 255, showParticles: false });
  trainer.say("opening");
  battle.start();
});

world.afterEvents.itemUse.subscribe(use => {
  if (use.itemStack.typeId !== quick.menuItem) return;
  const player = use.source;
  if (!(player instanceof Player)) return;
  if (!battles.has(player.id)) return;
  const battle = battles.get(player.id);
  const battler = [battle.player, battle.opponent].find(b => b.entity.id === player.id);
  pokedex(battler as PlayerBattler);
});
