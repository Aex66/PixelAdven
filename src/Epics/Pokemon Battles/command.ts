/**
 * Battle commands and menu entry points.
 */
import { Player as IPlayer } from '@minecraft/server';
import { Battle } from './classes/Battle.js';

export function openBattleMenu(player: IPlayer): void {
    player.sendMessage('§eBattle menu - use wild encounters to start battles!');
}
