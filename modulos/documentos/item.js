import ARGSHojaActor from "../hojas/ARGSHojaActor.mjs";
//import ARGSHojaAventurero from "../hojas/ARGSHojaAventurero.mjs";
/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class ARGSItem extends Item {
    /**
     * Augment the basic Item data model with additional dynamic data.
     */
    prepareData() {
      // As with the actor class, items are documents that can have their data
      // preparation methods overridden (such as prepareBaseData()).
      super.prepareData();
    }
  

    

    async getChatData(htmlOptions={}) {
      const description = await this.getEnrichedDescription();
      const itemsa = this.toObject();
     
      const actorData = this.actor.toObject(false);
      //const data = this.toObject().system;
      const data = {
        actor: this.actor,
        actorargs: actorData,        
        description,
        item: this.toObject(),
        
        //itemProperties: await this.propertyItems(),
      };
      
     // data.item.system.description.value = await TextEditor.enrichHTML(data.description.value, {
      
     // Rich text description OLD
     // data.description.value = await TextEditor.enrichHTML(data.description.value, {
      //  async: true,
      //  relativeTo: this,
      //  rollData: this.getRollData(),
      //  ...htmlOptions
      //});
  
      // Type specific properties
      data.properties = [
        ...this.system.chatProperties ?? [],
        ...this.system.equippableItemChatProperties ?? [],
        ...this.system.activatedEffectChatProperties ?? []
      ].filter(p => p);

      
      return data;
    }
    async mostrarTarjeta(options={}) {
      // Render the chat card template
      const token = this.actor.token;
      const templateData = await this.getChatData();
      const template = this.getItemTemplate("systems/ARGS/templates/partials/chat/item");
      
      const html = await renderTemplate(template, templateData);
  
      const chatData = {
        user: game.user.id,
        type: CONST.CHAT_MESSAGE_TYPES.OTHER,
        content: html,
        flavor: this.system.chatFlavor || this.name,
        speaker: ChatMessage.getSpeaker({actor: this.actor, token}),
        flags: { "core.canPopout": true },
      };
  
      // const context = {
      //   actor: actorData,
      //   config: CONFIG.ARGS,
      //   cssClass: this.actor.isOwner ? "editable" : "locked",
      //   editable: this.isEditable,
      //   isNpc: this.actor.type === "npc",
      //   isPlayer: this.actor.type === "aventurero",
      //   items: actorData.items,
      //   owner: this.actor.isOwner,
      //   rollData: this.actor.getRollData.bind(this.actor),
      //   source: source.system,
      //   system: actorData.system,
      // };
      // context.config = CONFIG.ARGS;
      
      ChatMessage.applyRollMode(chatData, options.rollMode ?? game.settings.get("core", "rollMode"));
      
      const card = (options.createMessage !== false)
        ? await ChatMessage.create(chatData) : chatData;
  
      return card;
    }

    async getEnrichedDescription() {
      return await TextEditor.enrichHTML(
        this.system.description.value,
        {
          rollData: this.actor.getRollData.bind(this.actor),
          async: true,
        }
      );
    }

    getItemTemplate(basePath) {
      switch (this.type) {
        case "armaduras":
          return `${basePath}/armaduras.hbs`;
        case "armas":
          return `${basePath}/armas.hbs`;
        case "consumibles":
          return `${basePath}/consumibles.hbs`;
        case "equipaje":
          return `${basePath}/equipaje.hbs`;
        case "equipamiento":
          return `${basePath}/equipamiento.hbs`;
        //case "habilidades":
        //  return `${basePath}/habilidades.hbs`;
        case "hechizo":
          return `${basePath}/hechizo.hbs`;
       // case "lenguajes":
       //   return `${basePath}/lenguajes.hbs`;
        case "monturas":
          return `${basePath}/monturas.hbs`;
        default:
          return `${basePath}/default.hbs`;
      }
    }
    /**
     * Prepare a data object which is passed to any Roll formulas which are created related to this Item
     * @private
     */
     getRollData() {
      // If present, return the actor's roll data.
      if ( !this.actor ) return null;
      const rollData = this.actor.getRollData();
      // Grab the item's system data as well.
      rollData.item = foundry.utils.deepClone(this.system);
  
      return rollData;
    }
  
    async tirarItem(parts, data, options={}) {
      options.dialogTemplate =  "systems/ARGS/templates/partials/dialogo-roll.hbs";
      options.chatCardTemplate = "systems/ARGS/templates/partials/chat/item-card.hbs";
      await CONFIG.DadosARGS.RollDialog(parts, data, options);
    }
    
    async tirarHechizo(parts, data, options={}) {
      options.dialogTemplate = "systems/ARGS/templates/partials/dialogo-roll.hbs";
      options.chatCardTemplate = "systems/ARGS/templates/partials/chat/item-card.hbs";
      const roll = await CONFIG.DadosARGS.RollDialog(parts, data, options);
      // if (roll) {
  
      //   if (this.type === "Scroll") {
      //     data.actor.deleteEmbeddedDocuments("Item", [this._id]);
      //   }
      //   else if (this.type === "Wand") {
      //     if (roll.rolls.main.critical === "failure") {
      //       data.actor.deleteEmbeddedDocuments("Item", [this._id]);
      //     }
      //   }
      // }
  
      return roll;
    }

    /**
     * Handle clickable rolls.
     * @param {Event} event   The originating click event
     * @private
     */
    async roll() {
      const item = this;
  
      // Initialize chat data.
      const speaker = ChatMessage.getSpeaker({ actor: this.actor });
      const rollMode = game.settings.get('core', 'rollMode');
      const label = `[${item.type}] ${item.name}`;
  
      // If there's no roll data, send a chat message.
      if (!this.system.formula) {
        ChatMessage.create({
          speaker: speaker,
          rollMode: rollMode,
          flavor: label,
          content: item.system.description ?? ''
        });
      }
      // Otherwise, create a roll and send a chat message from it.
      else {
        // Retrieve roll data.
        const rollData = this.getRollData();
  
        // Invoke the roll and submit it to chat.
        const roll = new Roll(rollData.item.formula, rollData); 
        // If you need to store the value first, uncomment the next line.
        // let result = await roll.roll({async: true});
        roll.toMessage({
          speaker: speaker,
          rollMode: rollMode,
          flavor: label,
        });
        return roll;
      }
    }
  }
  