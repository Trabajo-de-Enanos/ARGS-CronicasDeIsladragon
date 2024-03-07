import CompendiumItemSelector from "../selectorcompendios.mjs";

export default class SelectorEspecie extends CompendiumItemSelector {

	closeOnSelection = true;

	maxChoices = 1;

	get prompt() {
		return game.i18n.localize("ARGS.infotexto.seleccionarespecie");
	}

	get title() {
		return game.i18n.localize("ARGS.infotexto.elegirespecie");
	}

	async getAvailableItems() {
		return await ARGS.compendiums.especies();
	}

	async getUuids() {
		console.log("intenta grabar uuid de especie",this.object?.system?.especie,"this",this);
		const uuid = this.object?.system?.especie;

		return uuid !== "" ? [uuid] : [];
	}

	
	
	async saveUuids(uuids) {
		const uuid = uuids[0] ?? "";
		
		//especievieja.delete();
		return this.object.update({
			"system.especie": uuid,
			"system.especieflag": false, 
		});
	

	}

	
}
