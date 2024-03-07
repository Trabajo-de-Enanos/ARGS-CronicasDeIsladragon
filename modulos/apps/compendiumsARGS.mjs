export default class CompendiumsARGS {

	static async _compendiumDocuments(type, subtype=null) {
		let docs = [];

		// Iterate through the Packs, adding them to the list
		for (let pack of game.packs) {
			if (pack.metadata.type !== type) continue;

			let ids;

			if (subtype !== null) {
				ids = pack.index.filter(d => d.type === subtype).map(d => d._id);
			}
			else {
				ids = pack.index.map(d => d._id);
			}

			for (const id of ids) {
				const doc = await pack.getDocument(id);

				if (doc) docs.push(doc);
			}
		}

		// Dedupe and sort the list alphabetically
		docs = Array.from(new Set(docs)).sort((a, b) => a.name.localeCompare(b.name));

		const collection = new Collection();

		for (let d of docs) {
			collection.set(d.id, d);
		}

		return collection;
	}

	static async _documents(type, subtype, sources=[]) {
		const noSources = sources.length === 0;

		const documents = await CompendiumsARGS._compendiumDocuments(type, subtype);

		if (noSources) {
			return documents;
		}
		else {
			const filteredDocuments = documents.filter(
				document => {
					const source = document.system.source.title;

					return source === "" || sources.includes(source);
				}
			);

			// re-create the collection from the filtered Items
			const filteredCollection = new Collection();
			for (let d of filteredDocuments) {
				filteredCollection.set(d.id, d);
			}

			return filteredCollection;
		}
	}

	static async especies(sources=[]) {
		return CompendiumsARGS._documents("Item", "especie", sources);
	}

	static async armas(sources=[]) {
		return CompendiumsARGS._documents("Item", "armas", sources);
	}

	static async items(sources=[]) {
		
		return CompendiumsARGS._documents("Item", "equipamiento", sources);
	}
	
	static async habilidades(sources=[]) {		
		return CompendiumsARGS._documents("Item", "habilidades", sources);
	}
	
	static async clases(sources=[]) {
		return CompendiumsARGS._documents("Item", "clases", sources);
	}

	static async classTalents(sources=[]) {
		
		return CompendiumsARGS.talents("clase", sources);
	}

	static async claseTalentTables(sources=[]) {
		const documents =
			await CompendiumsARGS._documents("RollTable", null, sources);

		const filteredDocuments = documents.filter(
			document => document.name.match(/clases\s+habilidad/i)
		);

		// re-create the collection from the filtered Items
		const filteredCollection = new Collection();
		for (let d of filteredDocuments) {
			filteredCollection.set(d.id, d);
		}

		return filteredCollection;
	}

	static async lenguajes(sources=[]) {
		return CompendiumsARGS._documents("Item","lenguajes", sources);
	}

	
	static async effects(sources=[]) {
		return CompendiumsARGS._documents("Item", "Effect", sources);
	}

	
	

	static async rollTables(sources=[]) {
		return CompendiumsARGS._documents("RollTable", null, sources);
	}

	
	
	static async spells(sources=[]) {
		return CompendiumsARGS.talents(["Spell"], sources);
	}

	
	static async weapons(sources=[]) {
		return CompendiumsARGS._documents("Item", "Weapon", sources);
	}
}
