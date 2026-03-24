import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';
import { applyMoveInstruction } from '../battleEffects.js';
import { parseProtocolLine, cleanIdent, parsePokemonIdent } from '../protocol.js';

export class MoveHandler implements IHandler {
    handle(session: BattleSession, message: string): void {
        const { args } = parseProtocolLine(message);
        const attackerIdent = args[0] ?? '';
        const attacker = parsePokemonIdent(attackerIdent);
        const targetIdent = args[2] ?? '';
        const target = parsePokemonIdent(targetIdent);
        const move   = args[1] ?? '?';
        const targetText = target ? ` on §e${target.name}§r` : '';
        session.addLog({ text: `§e${attacker.name}§r used §b${move}§r${targetText}!` }, () => {
            applyMoveInstruction(session, message);
        });
    }
}
