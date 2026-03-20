export const LANG = {
    "move.missed": (name: string) => `§d${name}'s move missed!`,
    "move.one.hit.ko": () => `§r It was a 1 Hit K/O!!!`,
    "move.doesnt_affect": (name: string) => `§cIt doesnt affect ${name}...`,
    "move.not_effective": () => `§4It's not very effective...`,
    "move.super_effective": () => `§aIt's super effective!`,
    "move.critical": () => `§aA critical hit!`,
    "move.used": (name: string, move: string) => `§d${name}§r used §c${move}§r!`
}