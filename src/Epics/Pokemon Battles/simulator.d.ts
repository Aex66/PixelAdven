/**
 * Type declarations for the esbuild-bundled Showdown simulator.
 * The actual bundle entry is _simulator_entry.ts, built by esbuild into simulator.js.
 * TypeScript resolves imports of simulator.js to this file — never to the bundle source.
 */
export { BattleStreams, RandomPlayerAI, Teams, Dex, toID } from '@pkmn/sim';
