
import ARGSHojaActor from "./ARGSHojaActor.mjs";

export default class ARGSHojaMonstruo extends ARGSHojaActor {
	
	static get defaultOptions(){
		return foundry.utils.mergeObject(super.defaultOptions,{
			template: `systems/ARGS/templates/hojas/monstruo-hoja.hbs`,
			classes: ["ARGS","sheet","monstruo"],
			tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "info" }]
		});

	}
	
 
	 /** @override */
	 get template() {
    if (this.object.type === "animales"){
      return `systems/ARGS/templates/hojas/animales-hoja.hbs`;      
    }
    else {
		return `systems/ARGS/templates/hojas/monstruo-hoja.hbs`;
    }
	  }


      async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);
    
        // Some sensible token defaults for Actors
        const prototypeToken = {
          actorLink: false,
          sight: {
            enabled: false,
          },
        };
        if (data.type !== "aventurero") {
          const size = CONFIG.ARGS.tamanioToken[this.system.tamanio || "Mediano"];
          
        if ( !foundry.utils.hasProperty(data, "prototypeToken.width") ) prototypeToken.width = size;
        if ( !foundry.utils.hasProperty(data, "prototypeToken.height") ) prototypeToken.height = size;
        }
    
        
    
        this.updateSource({prototypeToken});
      }

 

      getData() {
        // Retrieve the data structure from the base sheet. You can inspect or log
        // the context variable to see the structure, but some key properties for
        // sheets are the actor object, the data object, whether or not it's
        // editable, the items array, and the effects array.
      
    
      //context.config = CONFIG.ARGS;
        // Use a safe clone of the actor data for further operations.
    const actorData = this.actor.toObject(false);
    const source = this.actor.toObject();
      
    const data = super.getData();
      
    //const context = super.getData();
      
 
    
    const context = {
        actor: actorData,
        config: CONFIG.ARGS,
        cssClass: this.actor.isOwner ? "editable" : "locked",
        editable: this.isEditable,
        isNpc: this.actor.type === "npc",
        isMonstruo: this.actor.type === "monstruo",        
        isAnimal: this.actor.type === "animales",
        isPlayer: this.actor.type === "aventurero",
        items: actorData.items,
        owner: this.actor.isOwner,
        rollData: this.actor.getRollData.bind(this.actor),
        source: source.system,
        system: actorData.system,
    };
    
    context.config = CONFIG.ARGS;

    context.descriptionHTML = TextEditor.enrichHTML(
        context.system.description.value,
        {
            secrets: this.actor.isOwner,
            rollData: context.rollData,
            async: false,
            relativeTo: this.actor,
        }
    );    

    context.especial1HTML = TextEditor.enrichHTML(
        context.system.especial1,
        {
            secrets: this.actor.isOwner,
            rollData: context.rollData,
            async: false,
            relativeTo: this.actor,
        }
    );
    context.especial2HTML = TextEditor.enrichHTML(
        context.system.especial2,
        {
            secrets: this.actor.isOwner,
            rollData: context.rollData,
            async: false,
            relativeTo: this.actor,
        }
    );

    context.especial1 = TextEditor.enrichHTML(
      context.system.especial1,
      {
          secrets: this.actor.isOwner,
          rollData: context.rollData,
          async: false,
          relativeTo: this.actor,
      }
  );

    
       // Add the actor's data to context.data for easier access, as well as flags.
       context.system = actorData.system;
       context.flags = actorData.flags;
   
       this._prepareItems(context);
       this._prepareCharacterData(context);

	return context;
    }//fin getData


    _prepareCharacterData(context) {
        // Handle ability scores.
        let nivel = context.system.nivel;
        

        if (this.actor.type !== "animales") {
        this.actor.update({"system.puntosvida.max" : context.system.stats[nivel].puntosvida.max});
        this.actor.update({"system.ataque" : context.system.stats[nivel].ataque});
        this.actor.update({"system.danio" : context.system.stats[nivel].danio});
        this.actor.update({"system.cantdado" : context.system.stats[nivel].cantdado});
        this.actor.update({"system.critumbral" : context.system.stats[nivel].critumbral});
        this.actor.update({"system.bonifdefensiva" : context.system.stats[nivel].bonifdefensiva});
        this.actor.update({"system.puntosMagia" : context.system.stats[nivel].puntosMagia});
        this.actor.update({"system.pericias" : context.system.stats[nivel].pericias});
        this.actor.update({"system.resistenciaMagia" : context.system.stats[nivel].resistenciaMagia});
          if (this.actor.system.nivel === "menor"){
            this.actor.update({"system.calculados.conjurar.value" : 5});            
          }
          else  if (this.actor.system.nivel === "normal"){
            this.actor.update({"system.calculados.conjurar.value" : 8});            
          } 
          else  if (this.actor.system.nivel === "fuerte"){
            this.actor.update({"system.calculados.conjurar.value" : 12});            
          } 
          else  if (this.actor.system.nivel === "excepcional"){
            this.actor.update({"system.calculados.conjurar.value" : 15});            
          } 
          else  if (this.actor.system.nivel === "legendario"){
            this.actor.update({"system.calculados.conjurar.value" : 18});            
          } 




      }
       //const actorSize = context.system.tamanio || "mediano";
        //const tokenSize = CONFIG.ARGS.tamanioToken[actorSize];
        
        //token.document.update({width: tokenSize, height: tokenSize});

        const prototypeToken = {
            actorLink: false,
            sight: {
              enabled: false,
            },
          };
         
        
            const size = CONFIG.ARGS.tamanioToken[context.system.tamanio || "Mediano"];
         ;
          if ( !foundry.utils.hasProperty(context, "prototypeToken.width") ) prototypeToken.width = size;
          if ( !foundry.utils.hasProperty(context, "prototypeToken.height") ) prototypeToken.height = size;
          this.actor.updateSource({prototypeToken});

    }
    _prepareItems(context) {
        // Initialize containers.
        const actor = this.actor;
        const systemData = actor.system;
    
    }//fin inventario

    async _onDropItem(event, data) {
		//if (await this._effectDropNotAllowed(data)) return false;    
    const item = await fromUuid(data.uuid);
    //const itemid = data.uuid;
    
    return super._onDropItem(event, data); // toti revisar para items raros.
    
	}
    
  activateListeners(html) {

    super.activateListeners(html);
    html.find(".pericia-npc-check").click(this._enTiradaPericiaNPC.bind(this));    
    html.find(".resmag-check").click(this._enTiradaResMagNpc.bind(this));
    html.find(".ataque-monstruonpc").click(this._enAtaqueNPC.bind(this));
    html.find(".defensa-monstruo").click(this._enDefensaNPC.bind(this));
    html.find(".hechizos-rapidos").click(this._enLanzarConjuro.bind(this));
    html.find(".item-namecenter .nombreconjuro").click(event => this._enHechizoDescripcion(event));
      // Imagen Items
      html.find(".item-image").click(
        event => this._enItemChatClick(event)
      );
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));      
      item.delete();
      li.slideUp(200, () => this.render(false));
    });
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");      
      const item = this.actor.items.get(li.data("itemId"));
      
      item.sheet.render(true);
    });

     // Drag events for macros.
     if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

    async _enTiradaResMagNpc(event){
      event.preventDefault();
      const resmag = this.actor.system.resistenciaMagia;
      
      //return this.actor.tirarPericia(skill, {event: event});
      const data = {
        actor: this.actor,
        resmag: resmag,
        esRM: 1
        
      }
      this.actor.tirarRM(data);    
    }

  async _enTiradaPericiaNPC(event) {
    event.preventDefault();
        
    const skill = event.currentTarget.closest("[data-key]").dataset.key;
    const grupo = event.currentTarget.closest("[data-cat]");    
    var catpericia = grupo.getAttribute('data-cat');
  
    //return this.actor.tirarPericia(skill, {event: event});
    const data = {
      actor: this.actor,
      categoria: catpericia,
      pericia: skill
    }
    this.actor.tirarPericia(data);
   
  }

  async _enAtaqueNPC(event){
    event.preventDefault();
		const actorId = $(event.currentTarget).data("actor-id");
    const data = {
      actor: this.actor,
      rollType: 'ataquemonstruo',      
    }
		//const item = this.actor.getEmbeddedDocument("Item", itemId);
    this.tirarAtaqueNPC(data);
  }

  async _enDefensaNPC(event){
    event.preventDefault();
		const actorId = $(event.currentTarget).data("actor-id");
    const data = {
      actor: this.actor,
      rollType: 'ataquemonstruo',
      esDefensa: true,      
    }
    const options = {
      
    }
    options.title = data.actor.name + " " + game.i18n.localize("ARGS.npcmonstruo.defiende");
		//const item = this.actor.getEmbeddedDocument("Item", itemId);
    await this.tirarAtaqueNPC(data,options);

   // data.BOBD = data.rolls.main.roll._total + data.actor.system.bonifdefensiva;   
  }

  async tirarAtaqueNPC(data, options={}) {

    options.speaker = ChatMessage.getSpeaker({ actor: this });
    if (!options.title){
    options.title = data.actor.name + " " + game.i18n.localize("ARGS.npcmonstruo.ataca");
    }
		
		const parts = ["@BO"]; //["@abilityBonus", "@talentBonus"];
    data.BO = data.actor.system.ataque;
		data.damageParts = [];
		// Boninficacion ofensiva Monstruo
    
    
    
    parts.push("@dados");
		data.dados = data.actor.system.cantdado + data.actor.system.danio + "x>=" + data.actor.system.critumbral;
    

    options.dialogTemplate =  "systems/ARGS/templates/partials/dialogo-roll.hbs";
    options.chatCardTemplate = "systems/ARGS/templates/partials/chat/item-card.hbs";
    await CONFIG.DadosARGS.RollDialog(parts, data, options);
	}

  async _enLanzarConjuro(event) {
   
		event.preventDefault();
		const itemId = $(event.currentTarget).data("item-id");
    
		this.actor.lanzarHechizo(itemId);
	}

  async _enHechizoDescripcion(event){
    event.preventDefault();
    const li = $(event.currentTarget).parents(".item");
    const item = this.actor.items.get(li.data("item-id"));
    context.rollData = {};
		let items = this.object?.parent ?? null;
		if (items) {
		  context.rollData = items.getRollData();
		}   

    const chatData = await item.getChatData({secrets: this.actor.isOwner,rollData: this.actor.getRollData.bind(this.actor), //context.data
      async: false,
      relativeTo: this.item});
      // Toggle summary
      if ( li.hasClass("expanded") ) {
        const summary = li.children(".item-summary");
        summary.slideUp(200, () => summary.remove());
        this._expanded.delete(item.id);
      } else {
        const summary = $(await renderTemplate("systems/ARGS/templates/partials/items-descripcionhechizo.hbs", chatData));
        li.append(summary.hide());
        summary.slideDown(200);
        this._expanded.add(item.id);
      }
      li.toggleClass("expanded");

  }
  async _enItemChatClick(event) {
		event.preventDefault();
		const itemId = $(event.currentTarget).data("item-id");
		const item = this.actor.getEmbeddedDocument("Item", itemId);
   
    item.mostrarTarjeta();
	}
}// fin clase monstruo