import { TrapEffect } from "../TrapEffect";
import { getScore } from "../../utils";
import TypeList from "../../../../Letters/pokemon/TypeList";
import { Pokemon } from "../Pokemon";
import { Battle } from "../Battle";

export class StealthRock extends TrapEffect {
  readonly name = "Stealth Rock";

  applyEffect(attacker: Pokemon, target: Pokemon, battle: Battle) {
    if (!this.isActiveOn(target)) return;

    const type1 = TypeList[getScore(target.entity, 'type1')];
    const effectiveness = this.getEffectiveness(type1);
    const damage = this.calculateDamage(target, effectiveness);

    battle.attack(target, damage, target.owner);
    battle.message(`§d${target.entity.typeId}§f was hurt by Stealth Rock!`);
  }

  private getEffectiveness(type: string): number {
    switch (type) {
      case "Rock":
        return 1;
      case "Fighting":
        return 0.25;
      case "Fire":
      case "Flying":
        return 0.5;
      default:
        return 1;
    }
  }

  private calculateDamage(target: Pokemon, effectiveness: number): number {
    const baseDamage = getScore(target.entity, 'HP_Base') / 8;
    return baseDamage * effectiveness;
  }
}
