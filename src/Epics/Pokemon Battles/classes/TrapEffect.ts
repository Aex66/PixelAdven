import { Battle } from "./Battle"
import { Pokemon } from "./Pokemon";

export abstract class TrapEffect {
  abstract readonly name: string;

  abstract applyEffect(
    attacker: Pokemon,
    target: Pokemon,
    battle: Battle
  ): void;

  isActiveOn(target: Pokemon): boolean {
    return target.entity.hasTag(`TrapEffect:${this.name}`);
  }
}
