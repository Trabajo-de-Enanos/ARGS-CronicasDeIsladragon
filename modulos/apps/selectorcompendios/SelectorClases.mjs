import CompendiumItemSelector from "../selectorcompendios.mjs";

export default class SelectorClase extends CompendiumItemSelector {
	
	closeOnSelection = true;

	maxChoices = 1;
	
	get prompt() {		
		return game.i18n.localize("ARGS.infotexto.seleccionarclase");
	}

	get title() {
		return game.i18n.localize("ARGS.infotexto.elegirclase");
	}

	async getAvailableItems() {
		return await ARGS.compendiums.clases();
	}

	async getUuids() {
		const uuid = this.object?.system?.clase;

		return uuid !== "" ? [uuid] : [];
	}

	async saveUuids(uuids) {
		const uuid = uuids[0] ?? "";

		return this.object.update({
			"system.clase": uuid,			
			"system.claseflag": false,
		});
	}
}
