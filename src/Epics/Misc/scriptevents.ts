import { ScriptEventSource, system, world } from "@minecraft/server";
import { getScore, setScore } from "../Pokemon Battles/utils";
import wildPokemon from "../../Letters/pokemon/wild";
import { pokemonText } from "../../Papers/Paragraphs/ExtrasParagraphs";

// First Script Event Handler
system.afterEvents.scriptEventReceive.subscribe(({ id, sourceType, sourceEntity: caller }) => {
    if (sourceType !== ScriptEventSource.Entity || !caller) return;  // Safeguard for invalid caller

    const tags = caller.getTags();
    const clicked = tags.some(tag => tag.startsWith('ODW:'));

    switch (id) {
        case 'pokeworld:pokeball': {
            if (clicked)
                caller.addTag('pokeball');
        }; break;
        case 'pokeworld:greatballl': {
            if (clicked)
                caller.addTag('greatball');
        }; break;
        case 'pokeworld:ultraball': {
            if (clicked)
                caller.addTag('ultraball');
        }; break;
        case 'pokeworld:masterball': {
            if (clicked)
                caller.addTag('masterball');
        }; break;
        case 'pokeworld:type_change': {
            const entityId = pokemonText(caller.typeId);
            if (!wildPokemon.hasOwnProperty(entityId)) return;

            const typings = wildPokemon[entityId];
            caller.runCommand(`scoreboard players set @s[scores={Variant=0..1}] type1 ${typings.Type_1}`);
            caller.runCommand(`scoreboard players set @s[scores={Variant=0..1}] type2 ${typings?.Type_2 ?? 0}`);
            caller.runCommand(`scoreboard players set @s[scores={Variant=2..3}] type1 ${typings?.Type_3 ?? 0}`);
            caller.runCommand(`scoreboard players set @s[scores={Variant=2..3}] type2 ${typings?.Type_4 ?? 0}`);
            caller.runCommand(`scoreboard players set @s[scores={Variant=4..5}] type1 ${typings?.Type_5 ?? 0}`);
            caller.runCommand(`scoreboard players set @s[scores={Variant=4..5}] type2 ${typings?.Type_6 ?? 0}`);
            caller.runCommand(`scoreboard players set @s[scores={Variant=6..7}] type1 ${typings?.Type_7 ?? 0}`);
            caller.runCommand(`scoreboard players set @s[scores={Variant=6..7}] type2 ${typings?.Type_8 ?? 0}`);
        }
    }
}, { namespaces: ['pokeworld'] });

// Second Script Event Handler
system.afterEvents.scriptEventReceive.subscribe(({ id, sourceType, sourceEntity: caller }) => {
    if (sourceType !== ScriptEventSource.Entity || !caller) return;  // Safeguard for invalid caller

    const tags = caller.getTags();
    const owner = tags.find(tag => tag.startsWith('o:'))?.slice(2);
    const player = world.getAllPlayers().find(player => player.name === owner);

    switch(id) {
        case 'pokeworld:potion': {
            if (player) {
                player.sendMessage(`${player.name} used a potion`);
                const hp = getScore(caller, 'HP_Low'), base = getScore(caller, 'HP_Base');
                if ((hp + 20) >= base) {
                    return setScore(caller, 'HP_Low', base);
                }
                setScore(caller, 'HP_Low', hp + 20);
            }
        }; break;
        case 'pokeworld:super_potion': {
            if (player) {
                player.sendMessage(`${player.name} used a super potion`);
                const hp = getScore(caller, 'HP_Low'), base = getScore(caller, 'HP_Base');
                if ((hp + 60) >= base) {
                    return setScore(caller, 'HP_Low', base);
                }
                setScore(caller, 'HP_Low', hp + 60);
            }
        }; break;
        case 'pokeworld:hyper_potion': {
            if (player) {
                player.sendMessage(`${player.name} used a hyper potion`);
                const hp = getScore(caller, 'HP_Low'), base = getScore(caller, 'HP_Base');
                if ((hp + 120) >= base) {
                    return setScore(caller, 'HP_Low', base);
                }
                setScore(caller, 'HP_Low', hp + 120);
            }
        }; break;
        case 'pokeworld:max_potion': {
            if (player) {
                player.sendMessage(`${player.name} used a mega potion`);
                const hp = getScore(caller, 'HP_Low'), base = getScore(caller, 'HP_Base');
                if ((hp + 250) >= base) {
                    return setScore(caller, 'HP_Low', base);
                }
                setScore(caller, 'HP_Low', hp + 250);
            }
        }; break;
        case 'pokeworld:max_revive': {
            if (player) {
                player.sendMessage(`${player.name} used a max revive`);
                const base = getScore(caller, 'HP_Base');
                setScore(caller, 'HP_Low', base);
            }
        }; break;
    }
}, { namespaces: ['pokeworld'] });
