import * as select from "../apps/selectorcompendios/_module.mjs";

export default class ARGSHojaActor extends ActorSheet {
	_expanded = new Set();
/** @inheritdoc */
    activateListeners(html) {
        html.find(".item-selector").click(
            event => this._onItemSelection(event)			
        );
    // Handle default listeners last so system listeners are triggered first
    super.activateListeners(html);
	html.find(".effect-control").click(this._onEffectControl.bind(this));	
    }


   // Emulate a itom drop as it was on the sheet, when dropped on the canvas
	async emulateItemDrop(data) {
		return this._onDropItem({}, data);
	}

	/** @override */
	getData(options) {
		const source = this.actor.toObject();
		const actorData = this.actor.toObject(false);
		//const contexto = super.getData();
		
		
		const context = {
			actor: actorData,
			config: CONFIG.ARGS,
			cssClass: this.actor.isOwner ? "editable" : "locked",
			editable: this.isEditable,
			isNpc: this.actor.type === "npc",
			isPlayer: this.actor.type === "aventurero",
			items: actorData.items,
			owner: this.actor.isOwner,
			rollData: this.actor.getRollData.bind(this.actor),
			source: source.system,
			system: actorData.system
			
		};
		context.config = CONFIG.ARGS;
		
		// Enrich HTML description		
		
		context.notesHTML = TextEditor.enrichHTML(
			context.system.notas,
			{
				secrets: this.actor.isOwner,
				rollData: context.rollData,
				async: false,
				relativeTo: this.actor,
			}
		);
		context.effects = this.actor.effects;
		//getEmbeddedCollection("ActiveEffect").contents
 
		return context;
	} 
    
    _onItemSelection(event) {
        event.preventDefault();
				
        const itemType = event.currentTarget.dataset.options;
        switch (itemType) {			
          case "especie":
            new select.SelectorEspecie(this.actor).render(true);			
            break;
          case "habilidades":
            new select.SelectorHabilidades(this.actor).render(true);			
            break;
          case "clases":
            new select.SelectorClases(this.actor).render(true);
            break;
        }
      }

	  async _onOpenItem(event) {
		event.preventDefault();

		const itemId = $(event.currentTarget).data("item-id");
		const item = this.actor.items.get(itemId);

		return item.sheet.render(true);
	}

	_onEffectControl(event) {
		event.preventDefault();
		const owner =  this.actor;
		const a = event.currentTarget;
		const tr= a.closest("li");
		const effect = tr.dataset.effectId ? owner.effects.get(tr.dataset.effectId) : null;
		
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
	_sortAllItems(context) {
		// Pre-sort all items so that when they are filtered into their relevant
		// categories they are already sorted alphabetically (case-sensitive)
		return (context.items ?? []).sort((a, b) => a.name.localeCompare(b.name));
	}
	
}