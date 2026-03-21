// @ts-nocheck
import { ChatSendBeforeEvent, system, world } from "@minecraft/server";

world.beforeEvents.chatSend.subscribe(data => {
    if (data.message.startsWith(`!test`)) handleTest(data);
})
function handleTest(eventData: ChatSendBeforeEvent) {

}

