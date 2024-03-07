//import { CanvasHooks } from "./hooks/canvas.mjs";

import { ChatMessageHooks } from "./chat-message.mjs";  // ok
//import { DropLightsourceHooks } from "./hooks/drop-lightsource-on-scene.mjs";
//import { EffectHooks } from "./hooks/effects.mjs";
//import { EffectPanelHooks } from "./hooks/effect-panel.mjs";
//import { NPCHooks } from "./hooks/npc.mjs";



export const HooksImmediate = {
	attach: () => {
		const listeners = [
			ChatMessageHooks,
		];
		
		for (const listener of listeners) {
			
			listener.attach();
		}
	},
};


