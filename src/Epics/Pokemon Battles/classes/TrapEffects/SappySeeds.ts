import { TrapEffect } from "../TrapEffect";
import { getScore } from "../../utils";
import { grammarText } from "../../../../Papers/Paragraphs/ExtrasParagraphs";
import { Battle } from "../Battle";
import { Pokemon } from "../Pokemon";

export class SappySeed extends TrapEffect {
  readonly name = "Sappy Seed";

  applyEffect(attacker: Pokemon, target: Pokemon, battle: Battle) {
    if (!this.isActiveOn(target)) return;

    const base = getScore(target.entity, 'HP_Base');
    const damage = ~~(base / 8);

    battle.attack(target, damage, target.owner);
    attacker.heal(damage);

    battle.message(`§d${grammarText(target.entity.typeId)}§f had its energy drained by Sappy Seeds!`);
  }
}
