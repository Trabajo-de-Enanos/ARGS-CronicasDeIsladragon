// console.log("ENTRO EN CHAT_HOOKS");


// export async function welcomeMessage() {
// 	if (!game.user.getFlag("ARGS", "welcomeMessageShown")) {
// 		const template = "systems/shadowdark/templates/chat/welcome-message.hbs";
// 		const chatCardData = {
// 			//logo: "systems/shadowdark/assets/logo/arcane-library-logo.webp",
// 			title: game.i18n.localize("Bienvenidos a Isladagon!"),
// 		};

// 		const content = await renderTemplate(template, chatCardData);
// 		const card = {
// 			content,
// 			user: game.user.id,
// 			whisper: [game.user.id],
// 			flags: { core: { canPopout: true } },
// 			speaker: { alias: "Advanced Roleplaying Game System for Foundry VTT" },
// 		};
// 		await ChatMessage.create(card);

// 		game.user.setFlag("ARGS", "welcomeMessageShown", true);
// 	}

	
// }

// async function _getChatCardActor(card) {
// 	// synthetic actor from token
// 	if ( card.dataset.tokenId ) {
// 		const token = await fromUuid(card.dataset.tokenId);
// 		if ( !token ) return null;
// 		return token.actor;
// 	}

// 	// Otherwise, get the actor
// 	const actorId = card.dataset.actorId;
// 	return game.actors.get(actorId) || null;
// }

/////////////////////////////////
// esto lo pase a hooks.mjs
//////////////////////////////////

// async function chatCardButtonAction(app, html, data) {
	

// 	const botonLanzarHechizo = html.find("button[data-action=lanzar-hechizo]");
// 	botonLanzarHechizo.on("click", ev => {
// 		ev.preventDefault();
// 		const itemId = $(ev.currentTarget).data("item-id");
// 		const actorId = $(ev.currentTarget).data("actor-id");
// 		const actor = game.actors.get(actorId);
		
// 		console.log("EN LANZAR HECHIZO chat",ev);
// 		actor.lanzarHechizo(itemId);
// 	});

// 	const botonTirarAtaque = html.find("button[data-action=tirar-ataque]");
// 	botonTirarAtaque.on("click", ev => {
// 		ev.preventDefault();
// 		const itemId = $(ev.currentTarget).data("item-id");
// 		const actorId = $(ev.currentTarget).data("actor-id");
// 		const actor = game.actors.get(actorId);

// 		actor.tirarAtaque(itemId);
// 	});
// }


// export function onRenderChatMessage(app, html, data) {
// 	chatCardButtonAction(app, html, data);
// 	//const blind = chatCardBlind(app, html, data);
// //	if (!blind) highlightSuccessFailure(app, html, data);
// }
