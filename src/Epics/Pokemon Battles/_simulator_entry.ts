/**
 * Showdown simulator bundle - imports @pkmn/sim for Bedrock compatibility.
 * This file is built with esbuild to create a self-contained bundle.
 */
import {
    BattleStreams,
    RandomPlayerAI,
    Teams,
    Dex,
    toID
} from '@pkmn/sim';

export { BattleStreams, RandomPlayerAI, Teams, Dex, toID };