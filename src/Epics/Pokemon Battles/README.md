# Pokemon Battle System

A complete turn-based Pokemon battle engine for Minecraft Bedrock addons, powered by **Pokemon Showdown** (`@pkmn/sim`).

Showdown is the single source of truth for all battle mechanics (damage, type effectiveness, abilities, status, weather, etc.). This addon only **interprets** the output and maps it to in-game visuals.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         Battle.ts                                │
│  - Creates BattleStream                                          │
│  - Reads Showdown protocol (omniscient stream)                   │
│  - Dispatches events to Battlers                                 │
│  - Manages log queue, camera, particles, HP/status/PP sync       │
└────────────┬────────────────────────┬───────────────────────┬────┘
             │                        │                       │
   ┌─────────▼─────────┐  ┌──────────▼──────────┐  ┌────────▼────────┐
   │  PlayerBattler    │  │  WildBattler        │  │  TrainerBattler │
   │  (Player UI/forms)│  │  (RandomPlayerAI)   │  │  (AI selectable)│
   └─────────┬─────────┘  └─────────────────────┘  └─────────────────┘
             │
   ┌─────────▼────────────────┐
   │  PlayerBattleHandler     │
   │  (extends RandomPlayerAI)│
   │  - Main menu, Moves,     │
   │    Bag, Switch, Target   │
   │  - Singles & Doubles UI  │
   └──────────────────────────┘
```

### File overview

| File | Purpose |
|------|---------|
| `Battle.ts` | Core controller — stream loop, protocol interpreter, camera, particles, log queue |
| `Battlers/Battler.ts` | Abstract base class for all participants |
| `Battlers/PlayerBattler.ts` | Player participant — spawns entities, handles post-battle processing |
| `Battlers/WildBattler.ts` | Wild Pokemon participant — uses RandomPlayerAI, despawns on end |
| `Battlers/TrainerBattler.ts` | Trainer / Gym Leader — configurable AI difficulty, optional despawn |
| `PlayerBattleHandler.ts` | Player's Showdown-facing AI — renders all Minecraft UI forms |
| `StrongHeuristicsAI.ts` | Smarter AI than RandomPlayerAI (configurable difficulty 1–5) |
| `formats.ts` | Format definitions: singles (`gen9customgame`) and doubles (`gen9doublesubers`) |
| `teamPacker.ts` | Converts addon's `longHand` Pokemon data to Showdown's `PokemonSet` |
| `battleItems.ts` | Derives battle-usable items from `backpackConfig` + `Backpack` |
| `postBattle.ts` | Post-battle: state sync, EXP/EV distribution, level-up, summary screen |
| `simulator.d.ts` | Type declarations for the bundled Showdown simulator |
| `_simulator_entry.ts` | esbuild entry point — re-exports `@pkmn/sim` |
| `utils.ts` | `getScore` / `setScore` scoreboard helpers |

---

## Battle Types

| Type | Format | Launched via |
|------|--------|-------------|
| **Wild** | Singles | `Battle.startWild(player, wildEntity, team)` |
| **Trainer** | Doubles (default) | `Battle.startTrainer(player, trainerEntity, team, difficulty?, gameType?)` |
| **Gym Leader** | Doubles (default) | `Battle.startGymLeader(player, gymEntity, team, difficulty?, gameType?)` |
| **PvP** | Doubles (default) | `Battle.startPvP(p1, p2, team1, team2, gameType?)` |

All non-wild battles default to **doubles** but accept an optional `gameType` parameter (`'singles'` | `'doubles'`).

---

## Battle Flow

### 1. Initiation
1. A factory method is called (e.g. `Battle.startWild`)
2. Battler instances are created
3. Teams are packed via `packLongHandToSet()`
4. A `BattleStream` is opened; `>start`, `>player p1`, `>player p2` are written
5. Each battler's `start()` is called — wires up PlayerBattleHandler or AI
6. Battle theme music starts for all player battlers

### 2. Turn Loop
1. Showdown sends `|request|` to each side (via `sideupdate`)
2. Player battlers wait for camera animations to finish, then show UI
3. AI battlers respond after a brief delay
4. Showdown resolves the turn and emits protocol messages
5. The stream loop in `Battle.ts`:
   - Updates the turn counter on `|turn|`
   - Delegates `|switch|` / `|drag|` to `battler.onSwitch()`
   - Syncs entity HP on `|-damage|`, `|-heal|`, `|-sethp|`
   - Syncs entity condition on `|-status|`, `|-curestatus|`, `|-start|confusion`, etc.
   - Tracks participation (who used `|move|`) and PP decrements
   - Records `|faint|` events for EXP distribution
   - Plays camera animations and particles on `|move|`
   - Formats all messages to the log queue (displayed at 1/second)
   - Ends the battle on `|win|` or `|tie|`

### 3. Battle End
1. `session.end()` builds a `BattleResult` (faint entries, trainer reward)
2. Each battler's `onEnd(winner, result)` is called:
   - **PlayerBattler**: stops music, removes entities, syncs state, distributes EXP/EVs, runs level-ups, shows summary
   - **WildBattler**: removes battle tags, despawns the wild entity
   - **TrainerBattler**: removes tags, optionally despawns the NPC

---

## Doubles

In doubles battles, each side sends **two** Pokemon at once (slots `a` and `b`).

### Protocol differences
- `|request|` has `active: [{...}, {...}]` instead of one entry
- The player must send a comma-separated action: `move 1 2, switch 3`
- Moves may need a target number: `1`/`2` = foe slots, `-1`/`-2` = ally slots
- `forceSwitch` can be `[true, false]` or `[true, true]`

### Player UI
1. The player picks an action for **each** active slot sequentially
2. Move selection includes a **target picker** when the move needs one
3. Bag items consume the entire turn (remaining slots auto-pass)
4. Switch menu excludes slots already chosen this turn
5. Force switch tracks exclusions to prevent duplicate replacements

---

## Post-Battle Processing

### State Sync (`syncPokemonState`)
After every battle, the last `|request|` payload is used to write back:
- **HP** and **status** for all party members (active and benched)
- **PP** for active Pokemon from `|request|`, benched PP from live `|move|` tracking

### EXP Distribution (`distributeExpAndEv`)
- Triggered only for the **winning** side
- Uses `Base_Exp` and `Base_EV` from `wild.ts` species data
- Split among all Pokemon that used a `|move|` against the fainted opponent
- Formula: `floor(baseExp × faintedLevel / 5 / numParticipants)`
- EVs respect the 252-per-stat and 510-total caps

### Level-Up (`runLevelUpChecks`)
Delegates to the existing `checkExperienceForTeam()` which handles:
- Stat recalculation, HP gain, move learning (with UI), friendship, scoreboard sync

### Trainer Rewards
- Reads `reward_money` from the trainer entity's dynamic property
- Fallback: `80 + 20 × highestTrainerLevel`
- Added to the player's `coins` scoreboard objective

### Summary Screen
An `ActionFormData` displayed 2 seconds after battle end:
- Win / Lose / Tie outcome
- Per-Pokemon EXP gained and level-ups
- Trainer reward amount (if applicable)

---

## Catch System (Wild Battles)

Integrated with the existing `Pokemon Calculations/catch.ts`:
1. Player selects a Poke Ball from the Bag menu
2. Ball tag is applied to the wild entity
3. `_catch()` runs the full catch sequence (animation, calculation, party/PC)
4. On capture: `>forcetie` ends the Showdown battle
5. On break-free: `>used-ball` consumes the turn

---

## Bag Items in Battle

Items are sourced from the `Backpack` class (reads player dynamic properties).
`battleItems.ts` auto-derives battle-usable items from `backpackConfig`:
- **Pokeballs** — wild battles only, triggers catch sequence
- **Healing** — targets the active Pokemon via `bag-item <id> <1-based-index>`
- **Berries** — same as healing
- **Revives** — targets a fainted party member via `bag-item <id> <1-based-index>`

---

## Camera & Particles

On every `|move|` event:
- A camera animation is played for all player battlers (positions behind attacker, faces defender)
- Multiple moves in a single turn are chained sequentially (40 ticks apart)
- Attack-type particles spawn on the target entity when the camera completes
- The battle UI is held until all animations finish

---

## Build & Development

```bash
# Build everything (TypeScript → scripts/, then bundle simulator)
npm run build

# Watch mode (tsc + esbuild watching simultaneously)
npm run watch

# Bundle only the Showdown simulator
npm run build:battle
```

The Showdown simulator is bundled via esbuild from `_simulator_entry.ts` into `scripts/Epics/Pokemon Battles/simulator.js`.

### Local Showdown Development
To modify `@pkmn/sim` (e.g. adding custom commands like `used-ball`, `bag-item`):
1. Clone the `pkmn/ps` monorepo alongside this project as `underground-SHOWDOWN`
2. Set `"@pkmn/sim": "file:../underground-SHOWDOWN/sim"` in `package.json`
3. Run `tsc --watch` in `underground-SHOWDOWN/sim` to compile changes live
4. The addon's `npm run watch` picks up the rebuilt `.mjs` files automatically
