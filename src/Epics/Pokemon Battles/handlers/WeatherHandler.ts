import type { IHandler } from './IHandler.js';
import type { BattleSession } from '../classes/Battle.js';
import { parseProtocolLine } from '../protocol.js';

const WEATHER_LABEL: Record<string, string> = {
    RainDance:   '§9Rain§r',
    PrimordialSea: '§9Heavy rain§r',
    SunnyDay:    '§6Harsh sunlight§r',
    DesolateLand: '§6Harsh sunlight§r',
    Sandstorm:   '§8Sandstorm§r',
    Snow:        '§fSnow§r',
    hail:        '§bHail§r',
};

export class WeatherHandler implements IHandler {
    handle(session: BattleSession, message: string): void {
        const { args } = parseProtocolLine(message);
        const id = args[0] ?? '';
        if (!id || id === 'none') {
            session.addLog({ text: '§7The weather cleared.§r' });
            return;
        }
        const label = WEATHER_LABEL[id] ?? id;
        session.addLog({ text: `§7Weather: ${label}§r` });
    }
}
