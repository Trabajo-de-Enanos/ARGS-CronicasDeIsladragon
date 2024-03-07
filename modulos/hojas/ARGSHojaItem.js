/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */

export default class ARGSHojaItem extends ItemSheet {
	constructor(...args) {
		super(...args);}
	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
		  classes: ["ARGS", "sheet", "equipo"],
		  width: 600,
		  height: 400,
		  tabs: [{ navSelector: ".sheet-navigation", contentSelector: ".sheet-body", initial: "descripcion" }],
		  dragDrop: [
			{dragSelector: "[data-effect-id]", dropSelector: ".effects-list"}
		  ]
		});
	  }
	
	 /** @override */
	 get template() {
		const path = "systems/ARGS/templates/hojas";
		// Return a single sheet for all item types.
		// return `${path}/item-sheet.html`;
	
		// Alternatively, you could use the following return statement to do a
		// unique item sheet by type, like `weapon-sheet.html`.
		console.log("intenta abrir partial",this.item.type);
		return `${path}/${this.item.type}-hoja.hbs`; //
	  }
	
	//get template() {
	//	return 'systems/ARGS/templates/hojas/armas-hoja.hbs';
	//}


	
	 /** @override */
	async getData(options) {
		
		const data = await super.getData(options); //await super.getData(options);
		data.config = CONFIG.ARGS;
		// Retrieve base data structure.
		const context = await super.getData(options); //await super.getData(options); 
		
		// Use a safe clone of the item data for further operations.

		context.config = CONFIG.ARGS;
		const itemData = context.item;
		
		// Retrieve the roll data for TinyMCE editors.
		context.rollData = {};
		let items = this.object?.parent ?? null;
		if (items) {
		  context.rollData = items.getRollData();
		}
		
		console.log("A VER EL CHAT DATA 2",context.rollData,"YYYY");
		// Add the actor's data to context.data for easier access, as well as flags.
		context.system = itemData.system;
		context.flags = itemData.flags;
		// Item rendering data
		foundry.utils.mergeObject(context, {
			//rollData: this.item.getRollData(),
			esFisico: itemData.system.hasOwnProperty("cantidad")
		});

		
		  const item = context.item;
		  const source = item.toObject();

		  
		context.effects= item.getEmbeddedCollection("ActiveEffect").contents;
		
		  if (["especie"].includes(item.type)) {
			await this.getSelectorEspecieConfigs(context);
		}

		
		if (["clases"].includes(item.type)) {			
			await this.getSelectorClaseConfigs(context);
		}
		  

		

		//if (item.type === "habilidades"  ) {
		//	context.predefinedEffects = await this._getPredefinedEffectsList();
		//	context.effects = item.effects;
		//}  	

		context.descriptionHTML = await TextEditor.enrichHTML(
			context.system.description.value,
			{
				secrets: context.item.isOwner,
				rollData: context.rollData,
				async: true,
				relativeTo: this.item,
			}
		);

		return context;
    
	  }
	
	  /* -------------------------------------------- */

	  async getSelectorClaseConfigs(context) {
		//Habilidades
		const habilidadesClase = await ARGS.compendiums.habilidades();
		
		const [habilidadesSelec, habilidadesDisp] =
			await ARGS.utils.getDedupedSelectedItems(
				habilidadesClase,
				this.item.system.habilidades ?? []
			);
		
		context.habilidadesConfig = {
			itemsDisponibles: habilidadesDisp,
			choicesKey: "habilidades",
			isItem: true,
			label: game.i18n.localize("ARGS.infotexto.habilidadlabel"),
			name: "system.habilidades",
			prompt: game.i18n.localize("ARGS.infotexto.elegirhabilidad"),
			itemsSelectos: habilidadesSelec,
		};
		//Items
		const inventarioClase = await ARGS.compendiums.items();
		
		const [inventarioSelec, inventarioDisp] =
			await ARGS.utils.getDedupedSelectedItems(
				inventarioClase,
				this.item.system.inventario ?? []
			);
		
		context.inventarioConfig = {
			itemsDisponibles: inventarioDisp,
			choicesKey: "inventario",
			isItem: true,
			label: game.i18n.localize("ARGS.infotexto.inventariolabel"),
			name: "system.inventario",
			prompt: game.i18n.localize("ARGS.infotexto.elegirinventario"),
			itemsSelectos: inventarioSelec,
		};


	}

	//Items
	
	async getSelectorEspecieConfigs(context) {

		const lenguajescomp = await ARGS.compendiums.lenguajes();
		const [lenguajesSelec, lenguajesDisp] =
			await ARGS.utils.getDedupedSelectedItems(
				lenguajescomp,
				this.item.system.lenguajesesp ?? []
			);

		context.lenguajeFijoConfig = {
			itemsDisponibles: lenguajesDisp,
			choicesKey: "lenguajesesp",
			isItem: true ,
			label: game.i18n.localize("ARGS.infotexto.lenguajelabel"),
			name: "system.lenguajesesp",
			prompt: game.i18n.localize("ARGS.infotexto.elegirlenguaje"),
			itemsSelectos: lenguajesSelec,			
		};	
	}
 /* -------------------------------------------- */
	/*  Event Handling                              */
	/* -------------------------------------------- */
	_deleteChoiceItem(event) {
		if (!this.isEditable) return;

		event.preventDefault();
		event.stopPropagation();

		const deleteUuid = $(event.currentTarget).data("uuid");
		const choicesKey = $(event.currentTarget).data("choices-key");

		const currentChoices = this.item.system[choicesKey] ?? [];

		const newChoices = [];
		for (const itemUuid of currentChoices) {
			if (itemUuid === deleteUuid) continue;
			newChoices.push(itemUuid);
		}

		const dataKey = `system.${choicesKey}`;
		this.item.update({[dataKey]: newChoices});
	}

	/** @inheritdoc */
	async _onChangeInput(event) {
		// Modify the effect when field is modified
		if (event.target?.className === "effect-change-value") {
			return await this._onEffectChangeValue(event);
		}

		// Create effects when added through the predefined effects input
		if (event.target?.name === "system.predefinedEffects") {
			const key = event.target.value;
			const jsonData = await this._getPredefinedEffectsData();
			let effectData = jsonData[key];

			if (!effectData) return console.error(`No effect found (${key})`);

			await this._createPredefinedEffect(key, effectData);
		}

		// If the change value is the duration field(s)
		const durationTarget = [
			"system.duration.type",
			"system.duration.value",
		].includes(event.target?.name);

		const durationClassName =
			event.target?.parentElement.className === "effect-duration";

		if (durationTarget && durationClassName) {
			await this._onUpdateDurationEffect();
		}

		const choicesKey = $(event.currentTarget).data("choices-key");
		const isItem = $(event.currentTarget).data("is-item") === "true";

		// We only have to do something special if we're handling a multi-choice
		// datalist
		//
		
		if (event.target.list && choicesKey) {
			return await this._onChangeChoiceList(event, choicesKey, isItem);
		}

		await super._onChangeInput(event);
	}

	async _onChangeChoiceList(event, choicesKey, isItem) {
		const options = event.target.list.options;
		const value = event.target.value;
		
		let uuid = null;
		for (const option of options) {
			if (option.value === value) {
				uuid = option.getAttribute("data-uuid");
				break;
			}
		}

		if (uuid === null) return;

		const splitKey = choicesKey.split(".");
		
		let currentChoices;
		if (splitKey.length === 1) {
			currentChoices = this.item.system[choicesKey] ?? [];
			
		}
		else if (splitKey.length === 2) {
			const choiceObject = this.item.system[splitKey[0]] ?? {};
			currentChoices = choiceObject[splitKey[1]] ?? [];
			
		}
		else {
			console.log("TODO THROW ERROR?");
			// TODO throw error?
		}
		
		if (currentChoices.includes(uuid)) return; // No duplicates
		
		currentChoices.push(uuid);

		const choiceItems = [];
		for (const itemUuid of currentChoices) {
			if (isItem) {
				choiceItems.push(await fromUuid(itemUuid));
			}
			else {
				choiceItems.push(itemUuid);
			}
		}

		if (isItem) {
			choiceItems.sort((a, b) => a.name.localeCompare(b.name));
		}
		else {
			choiceItems.sort((a, b) => a.localeCompare(b));
		}

		const sortedChoiceUuids = isItem
			? choiceItems.map(item => item.uuid)
			: choiceItems;
		
		
		return this.item.update({[event.target.name]: sortedChoiceUuids});
		
	}


	_onSubmit(event) {
		if (!this.isEditable) return;

		switch (this.item.type) {
			case "especie": {
				const updateData = this._getSubmitData();
				
				delete updateData["system.lenguajesesp"];
				//delete updateData["system.talents"];
				
				this.item.update(updateData);
				break;
			}
			case "clases": {
				const updateData = this._getSubmitData();

				delete updateData["system.inventario"];
				delete updateData["system.habilidades"];
				
				
				this.item.update(updateData);
				break;
			}
			case "Spell": {
				const updateData = this._getSubmitData();

				delete updateData["system.class"];

				this.item.update(updateData);
				break;
			}
			default:
				super._onSubmit(event);
		}
	}
  /* -------------------------------------------- */
	  /** @override */
	  activateListeners(html) {
		super.activateListeners(html);
	
	
		// Everything below here is only needed if the sheet is editable
		if (!this.isEditable) {
		html.find(".damage-control").click(this._onDamageControl.bind(this)) ;
		//html.find(".effect-control[data-action=delete]").click(
		//	event => this._onEffectDelete(event)
		//);
		
		}
		html.find(".effect-control").click(this._onEffectControl.bind(this));	
		html.find(".delete-choice").click(
			event => this._deleteChoiceItem(event),			
		);
		return;
			
		

		/* -------------------------------------------- */

  
		// Roll handlers, click handlers, etc. would go here.
	  }

		 
		
  /**
   * Add or remove a damage part from the damage formula.
   * @param {Event} event             The original click event.
   * @returns {Promise<Item5e>|null}  Item with updates applied.
   * @private
   */
  async _onDamageControl(event) {
    event.preventDefault();
    const a = event.currentTarget;

    // Add new damage component
    if ( a.classList.contains("add-damage") ) {
      await this._onSubmit(event);  // Submit any unsaved changes
	  
      const damage = this.item.system.damage;
      return this.item.update({"system.damage.parts": damage.parts.concat([["", ""]])});
    }

    // Remove a damage component
    if ( a.classList.contains("delete-damage") ) {
      await this._onSubmit(event);  // Submit any unsaved changes
      const li = a.closest(".damage-part");
      const damage = foundry.utils.deepClone(this.item.system.damage);
      damage.parts.splice(Number(li.dataset.damagePart), 1);
      return this.item.update({"system.damage.parts": damage.parts});
    }
  	}

	_onEffectControl(event) {
		event.preventDefault();
		const owner = this.item;
		const a = event.currentTarget;
		const tr= a.closest("li");
		const effect = tr.dataset.effectId ? owner.effects.get(tr.dataset.effectId) : null;
		console.log("EFECTOS BOTONES",a,"tr",tr,"effect",effect);
		switch (a.dataset.action ) {
		case "create":
			return owner.createEmbeddedDocuments("ActiveEffect",[{
				label: "Nuevo Efecto",
				icon: "icons/svg/aura.svg",
				origin: owner.uuid,
				disabled: true
			}]);
		case "edit":
			return effect.sheet.render(true);
		case "delete":
			return effect.delete();
		}
	 }

  /* -------------------------------------------- */
  /*  Form Submission                             */
  /* -------------------------------------------- */

  

  /* -------------------------------------------- */
  /* -------------------------------------------- */
		
	
	
}

