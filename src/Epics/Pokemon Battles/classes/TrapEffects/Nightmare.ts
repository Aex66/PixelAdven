import { TrapEffect } from "../TrapEffect";
import { getScore } from "../../utils";
import { Battle } from "../Battle";
import { Pokemon } from "../Pokemon";

export class Nightmare extends TrapEffect {
  readonly name = "Nightmare";

  applyEffect(attacker: Pokemon, target: Pokemon, battle: Battle) {
    if (!this.isActiveOn(target)) return;
    if (!target.isAsleep()) return;

    const base = getScore(target.entity, 'HP_Base');
    const damage = ~~(base / 4);

    battle.attack(target, damage, target.owner);
    battle.message(`§d${target.entity.typeId}§f is tormented by a nightmare!`);
  }
}