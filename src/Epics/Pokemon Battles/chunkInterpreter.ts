import type { BattleSession } from './classes/Battle.js';
import { Battler } from './classes/Battlers/Battler.js';
import { parseProtocolLine } from './protocol.js';
import { ShowdownInterpreter } from './showdownInterpreter.js';

/**
 * One BattleStream chunk (first line = type). See `showdown-instructions.mdc`.
 */
export function interpret(session: BattleSession, chunk: string): void {
    const lines = chunk.split('\n').map(l => l.trimEnd());
    if (lines.length === 0 || !lines[0]?.trim()) return;
    console.warn(`Interpreting chunk: ${chunk}`)

    const first = lines[0]!.trim();
    // Some streams emit raw `|...` lines without a leading `update` / `sideupdate` / `end` header.
    if (first.startsWith('|')) {
        processUpdatePayload(session, lines);
        return;
    }

    const chunkType = first;

    switch (chunkType) {
        case 'update':
            processUpdatePayload(session, lines.slice(1));
            break;
        case 'sideupdate':
            const showdownId = lines[1]! as 'p1' | 'p2';
            if (!showdownId) return;
            const battler = session.battlers.get(showdownId);
            const line = lines[2];
            if (!line) return;

            if (!battler)
                throw new Error(
                `Couldn't find battler for showdown id: "${showdownId}"`
                );
            console.warn('Dispatched sideupdate line')
            dispatchSideupdateLine(session, battler, line);
            break;
        case 'end':
            if (lines.length >= 2) {
                const jsonLine = lines[1]!;
                ShowdownInterpreter.getEndHandler()?.handle(session, jsonLine);
            }
            break;
        default:
            // Unknown chunk type — ignore (per protocol doc).
            break;
    }
}

function dispatchSideupdateLine(session: BattleSession, battler: Battler, message: string): void {
    if (!message.startsWith('|')) return;
    const { cmd } = parseProtocolLine(message);
    ShowdownInterpreter.getSideupdateHandler(cmd)?.handle(session, battler, message);
}

function processUpdatePayload(session: BattleSession, payloadLines: string[]): void {
    for (let i = 0; i < payloadLines.length; i++) {
        const line = payloadLines[i]!;
        const trimmed = line.trim();
        if (!trimmed || trimmed === '|') continue;
        if (!trimmed.startsWith('|')) continue;

        const { cmd } = parseProtocolLine(trimmed);

        if (cmd === 'split') {
            const sideArg = parseProtocolLine(trimmed).args[0];
            const splitSideId = sideArg === 'p2' ? 'p2' : 'p1';
            const privateLine = payloadLines[i + 1];
            const publicLine  = payloadLines[i + 2];
            if (!privateLine?.trim().startsWith('|') || !publicLine?.trim().startsWith('|')) {
                console.warn('[Battle] Malformed |split| block (missing private/public lines)');
                i += 2;
                continue;
            }
            const privateTrim = privateLine.trim();
            const publicTrim  = publicLine.trim();
            const privateCmd  = parseProtocolLine(privateTrim).cmd;
            const lookahead   = payloadLines.slice(i + 3);

            const splitHandler = ShowdownInterpreter.getSplitHandler(privateCmd);
            if (splitHandler) {
                splitHandler.handle(session, splitSideId, publicTrim, privateTrim, lookahead);
            } else {
                // Default: same as a normal update line using the private line (owner’s exact values).
                ShowdownInterpreter.getUpdateHandler(privateCmd)?.handle(session, privateTrim, lookahead);
            }
            i += 2;
            continue;
        }

        const lookahead = payloadLines.slice(i + 1);
        ShowdownInterpreter.getUpdateHandler(cmd)?.handle(session, trimmed, lookahead);
    }
}
