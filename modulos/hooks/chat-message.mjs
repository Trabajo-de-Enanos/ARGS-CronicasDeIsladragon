// chat messages //

//import * as onRenderChatMessage from "../chat_hooks.mjs";

//import { onRenderChatMessage } from "./modulos/apps/chat_hooks.mjs";

//export const ChatMessageHooks = "PUTA LA WEA";
//export const onRenderChatMessage = "AAASDF";
export const ChatMessageHooks = {
	attach: () => {	
		Hooks.on("renderChatMessage", (app, html, data) => onRenderChatMessage(app, html, data));       
	},
};



async function chatCardButtonAction(app, html, data) {
	

	const botonLanzarHechizo = html.find("button[data-action=lanzar-hechizo]");
	botonLanzarHechizo.on("click", ev => {
		ev.preventDefault();
		const itemId = $(ev.currentTarget).data("item-id");
		const actorId = $(ev.currentTarget).data("actor-id");
		const actor = game.actors.get(actorId);		
		actor.lanzarHechizo(itemId);
	});

	const botonTirarAtaque = html.find("button[data-action=tirar-ataque]");
	botonTirarAtaque.on("click", ev => {
		ev.preventDefault();
		const itemId = $(ev.currentTarget).data("item-id");
		const actorId = $(ev.currentTarget).data("actor-id");
		const actor = game.actors.get(actorId);
		actor.tirarAtaque(itemId);	
	});

	const botonTirarDefensa = html.find("button[data-action=tirar-defensa]");
	botonTirarDefensa.on("click", ev => {
		ev.preventDefault();
		const itemId = $(ev.currentTarget).data("item-id");
		const actorId = $(ev.currentTarget).data("actor-id");
		const actor = game.actors.get(actorId);
		let opcion="defensa";
		actor.tirarAtaque(itemId,opcion);	
		
	});

	const botonTirarAmbi = html.find("button[data-action=tirar-ambidiestro]");
	botonTirarAmbi.on("click", ev => {
		ev.preventDefault();
		const itemId = $(ev.currentTarget).data("item-id");
		const actorId = $(ev.currentTarget).data("actor-id");
		const actor = game.actors.get(actorId);
		let opcion="ambidiestro";
		actor.tirarAtaque(itemId,opcion);	
		
	});

	const monturaAtaque = html.find('.mont_ataque');
	monturaAtaque.on("click", ev => {
		ev.preventDefault();
		const itemId = $(ev.currentTarget).data("item-id");
		const actorId = $(ev.currentTarget).data("actor-id");
		const actor = game.actors.get(actorId);	
		actor.tirarAtaqueMontura(itemId); //falta instinto
	});
	const monturaInst = html.find('.mont_instinto');
	monturaInst.on("click", ev => {
		ev.preventDefault();
		const itemId = $(ev.currentTarget).data("item-id");
		const actorId = $(ev.currentTarget).data("actor-id");
		const actor = game.actors.get(actorId);	
		actor.tirarInstintoMontura(itemId); //falta instinto
	});
	


}





export function onRenderChatMessage(app, html, data) {
	chatCardButtonAction(app, html, data);
	//const blind = chatCardBlind(app, html, data);
//	if (!blind) highlightSuccessFailure(app, html, data);
}