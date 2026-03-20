import { Entity } from "@minecraft/server";
import { getScore, setScore } from "./utils";
import { grammarText } from "../../Papers/Paragraphs/ExtrasParagraphs";

const events: Record<string, ((data: any) => void)[]> = {};

export namespace Events {
    /**
     * Subscribes a callback function to a specific event.
     * @param event The event name (e.g., 'itemUse').
     * @param callback The function to be called when the event is triggered.
     */
    export function subscribe(event: string, callback: (data: any) => void): void {
        if (!events[event]) {
            events[event] = [];
        }
        events[event].push(callback);
    }

    /**
     * Triggers a specific event and calls all subscribed listeners.
     * @param event The event name to trigger (e.g., 'itemUse').
     * @param data Data to pass to the listeners.
     */
    export function emit(event: string, data: any): void {
        const listeners = events[event];
        if (listeners) {
            listeners.forEach(callback => callback(data));
        }
    }
}

interface BattleHurtEvent {
    victim: Entity;
    damage: number;
    attacker: Entity;
}

Events.subscribe('battleHurt', (event: BattleHurtEvent) => {
    const poke = event.victim

    const hp = getScore(poke, 'HP_Low')
    if (event.damage >= hp) 
        return setScore(poke, 'HP_Low', 0)

    setScore(poke, 'HP_Low', hp - event.damage)
    if (event.damage !== 1000567)
        event.attacker.runCommand(`tellraw @a[r=20,tag=!hide_battle_logs,tag=battle,scores={bid=${getScore(event.attacker, 'bid')}}] {"rawtext":[{"text":"${grammarText(poke.typeId)} took ${event.damage} damage!"}]}`);
})