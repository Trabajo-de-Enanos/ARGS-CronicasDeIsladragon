import CompendiumItemSelector from "../selectorcompendios.mjs";

export default class SelectorHabilidades extends CompendiumItemSelector {

	//closeOnSelection = false;

	//maxChoices = 5;

	get prompt() {
		return game.i18n.localize("ARGS.infotexto.seleccionarhabilidad");
	}

	get title() {
		return game.i18n.localize("ARGS.infotexto.elegirhabilidad");
	}

	async decorateName(item) {
		// Decorate rare languages so they're easy to spot in the selector
		return item.name;
	}

	async getAvailableItems() {
		return await ARGS.compendiums.habilidades();
		
	}

	async getUuids() {
		console.log("agarra habilidades uuids");
		return this.object?.system?.habilidades ?? [];
		//console.log("agarra habilidades uuids",uuid);
		//return uuid !== "" ? [uuid] : [];
	}

	async saveUuids(uuids) {
		//const uuid = uuids[0] ?? "";
		console.log("save habilidades uuids",uuids);
		return this.object.update({
			"system.habilidades": uuids,
		});
	}
}
