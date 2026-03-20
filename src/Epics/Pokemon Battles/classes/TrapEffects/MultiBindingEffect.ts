// trapEffects/MultiBindingEffect.ts
import { TrapEffect } from "../TrapEffect";
import { getScore } from "../../utils";
import { Battle } from "../Battle";
import { NpcBattler, PlayerBattler, WildBattler } from "../Battler";
import { Pokemon } from "../Pokemon";

export class MultiBindingEffect extends TrapEffect {
  readonly name = "MultiBinding";

  private readonly effects = [
    "Wrap",
    "Whirlpool",
    "Bind",
    "Fire Spin",
    "Sand Tomb",
    "Infestation",
    "Clamp",
  ];

  applyEffect(
    attacker: Pokemon,
    target: Pokemon,
    battle: Battle
  ) {
    const tags = target.entity.getTags();

    const active = this.effects.find(effect =>
      tags.includes(`TrapEffect:${effect}`)
    );
    if (!active) return;

    const turns = getScore(target.entity, "bindingEffectTurns");
    if (turns === 0) {
      target.entity.removeTag(`TrapEffect:${active}`);
      return;
    }

    const baseHP = getScore(target.entity, "HP_Base");
    const damage = ~~(baseHP / 8);

    battle.attack(target, damage, target.owner);
  }

  override isActiveOn(target: Pokemon): boolean {
    const tags = target.entity.getTags();
    return this.effects.some(effect => tags.includes(`TrapEffect:${effect}`));
  }
}
