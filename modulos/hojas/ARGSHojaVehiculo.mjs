
import ARGSHojaActor from "./ARGSHojaActor.mjs";

export default class ARGSHojaVehiculo extends ARGSHojaActor {
	
	static get defaultOptions(){
		return foundry.utils.mergeObject(super.defaultOptions,{
			template: `systems/ARGS/templates/hojas/vehiculo-hoja.hbs`,
			classes: ["ARGS","sheet","vehiculo"],
			tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "info" }]
		});

	}
	
  static get newCargo() {
    return {name: "", cantidad: 1};
  }
  static get newEquip() {
    return {name: "", descripcion: "",efectos: "", valor: 0};
  }

 
	 /** @override */
	 get template() {   
		return `systems/ARGS/templates/hojas/vehiculo-hoja.hbs`;   
	  }


      async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);
    
        // Some sensible token defaults for Actors
        const prototypeToken = {
          actorLink: true,
          sight: {
            enabled: false,
          },
        };
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
        isVehiculo: this.actor.type === "vehiculo",
        //items: actorData.items,
        items: Array.from(this.actor.items),
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

    let tripTotal = 0;
    let pasajTotal = 0;
    let pplTotal = 0;
    // Conteo Tripulacion y Pasajeros
    for ( const entrada of  context.cargo[0].items) {
      let tripulantes = entrada.cantidad;
      tripTotal += tripulantes;
      //alltrip = tripTotal;
      }
    for ( const entrada of  context.cargo[1].items) {
      let pasajeros = entrada.cantidad;
      pasajTotal += pasajeros;
      //alltrip = tripTotal;
      }
      pplTotal = tripTotal + pasajTotal;
    context.tripTotal = tripTotal ;
    context.pasajTotal = pasajTotal;
    context.pplTotal = pplTotal;
    

    //CONFIG VEHICULOS 
    let tipoVehiculo = context.actor.system.tipo+context.actor.system.tamanio;
    const configV = context.config.configVehiculos[tipoVehiculo || "aguaPequenio"];
    

    // valores para los place holder text del hbs.
    context.pht_pv = configV.pht_pv; //salud vehiculo
    context.pht_bod = configV.pht_bod; //bodega
    context.pht_mov = configV.pht_mov; //movimiento
    context.pht_trip = configV.pht_trip; //trip minima
    context.pht_pas = configV.pht_pas; //pasajeros max
    context.ve_label = configV.label;

    // doble tripulacion para doble velocidad.
    
      if(context.actor.system.dobletrip === true){        
        context.actor.system.velocidadFinal = context.actor.system.velocidad * 2;
       
      }
      else if (context.actor.system.dobletrip === false){
        context.actor.system.velocidadFinal = context.actor.system.velocidad;
        
      }

    if(context.actor.system.tipo === "tierra"){
     context.isVeTierra=true;
    }
    else{
      context.isVeTierra=false;
    }
  

    }
    
    _prepareItems(context) {
        // Initialize containers.
        const actor = this.actor;
        const systemData = actor.system;
    
        const cargoColumns = [{
          label: game.i18n.localize("ARGS.items.cantidad"),
          css: "item-qty",
          property: "cantidad",
          editable: "Number"
        }]; 

        const equipmentColumns = [{
          label: game.i18n.localize("ARGS.tab.descripcion"),
          css: "item-descr",
          property: "descripcion",
          editable: "Text"
        }, {
          label: game.i18n.localize("ARGS.tab.efectos"),
          css: "item-efect",
          property: "efectos",
          editable: "Text"
        }, {
          label: game.i18n.localize("ARGS.especies.periciasextravalor"),
          css: "item-val",
          property: "valor",
          editable: "Number"
        }];
    
        const features = {
       
          equipment: {
            label: game.i18n.localize("ARGS.vehiculos.mejoras"),  
            items: context.actor.system.mejoras,          
            css: "cargo-row mejoras",   
            editableName: true,         
            dataset: {type: "mejoras"},
            columns: equipmentColumns
          }
        };
        
        context.items.forEach(item => {
          //const {uses, recharge} = item.system;
          //const ctx = context.itemContext[item.id] ??= {};
          //ctx.canToggle = false;
          //ctx.isExpanded = this._expanded.has(item.id);
          //ctx.hasUses = uses && (uses.max > 0);
          //ctx.isOnCooldown = recharge && !!recharge.value && (recharge.charged === false);
          //ctx.isDepleted = item.isOnCooldown && (uses.per && (uses.value > 0));
        });

        const cargo = {
          crew: {
            label: game.i18n.localize("ARGS.vehiculos.tripulacion"),
            items: context.actor.system.tripulacion.crew,
            css: "cargo-row crew",
            editableName: true,
            dataset: {type: "crew"},
            columns: cargoColumns
          },
          passengers: {
            label: game.i18n.localize("ARGS.vehiculos.pasajeros"),
            items: context.actor.system.pasajeros.passengers,
            css: "cargo-row passengers",
            editableName: true,
            dataset: {type: "passengers"},
            columns: cargoColumns
          },
          cargo: {
            label: game.i18n.localize("ARGS.vehiculos.bodega"),
            items: [],
            dataset: {type: "equipamiento"},
            columns: [{
              label: game.i18n.localize("ARGS.items.cantidad"),
              css: "item-cant",
              property: "system.cantidad",
              editable: "Number"
            }, {
              label: game.i18n.localize("ARGS.items.precio"),
              css: "item-precio",
              property: "system.precio.value",
              editable: "Number"
            }, {
              label: game.i18n.localize("ARGS.items.peso"),
              css: "item-peso",
              property: "system.peso",
              editable: "Number"
            }]
          }
        };

         // Classify items owned by the vehicle and compute total cargo weight
    let totalWeight = 0;
    let totalGold = 0;
    for ( const item of context.items ) {
      
     //const ctx = context.itemContext[item.id] ??= {};
     // this._prepareCrewedItem(item, ctx);
     item.system.isCargo = true;
      // Handle cargo explicitly
      //const isCargo = item.flags.ARGS?.vehicleCargo === true;
      const isCargo = item.system.isCargo === true;
      
      if ( isCargo ) {
        totalWeight += (item.system.peso || 0) * item.system.cantidad;
        totalGold += (item.system.cantidad || 0 ) * item.system.precio.value;
        context.totalWeight = totalWeight;
        context.totalGold = totalGold;
        cargo.cargo.items.push(item);
        
        
        continue;
      }
      

      //Revisa valores Municiones
      if(item.type === "consumible" && item.system.tipoConsumible === "municiones"){
          if(item.name==="Balas Cañon") {

          }
          if(item.name==="Balas Cañon") {
            
          }
          if(item.name==="Balas Cañon") {
            
          }
      }

      // Handle non-cargo item types
      switch ( item.type ) {
       // case "armas":
         // features.weapons.items.push(item);
         // break;
        //case "equipment":
          //features.equipment.items.push(item);
          //break;
        case "habilidades":
          const act = item.system.activation;
          if ( !act.type || (act.type === "none") ) features.passive.items.push(item);
         //else if (act.type === "reaction") features.reactions.items.push(item);
          else features.actions.items.push(item);
          break;
        default:
          totalWeight += (item.system.peso || 0) * item.system.cantidad;
          cargo.cargo.items.push(item);
      }
    }

  


    // Update the rendering context data
    
    context.features = Object.values(features);
    context.cargo = Object.values(cargo);
   // context.encumbrance = this._computeEncumbrance(totalWeight, context);



    }//fin inventario

    async _onDropItem(event, data) {
		//if (await this._effectDropNotAllowed(data)) return false;    
    const item = await fromUuid(data.uuid);
    //const itemid = data.uuid;
    
    const toCreate = [];
    
      const result = await this._onDropSingleItem(item);
      
      if ( result ) toCreate.push(result);
    
     
    // Create the owned items as normal
    if (toCreate[0].type === "armas" && toCreate[0].system.atacaCon === "artilleria") {
      
      toCreate[0].update({"system.carga1": false});
      toCreate[0].update({"system.carga2": false});
      toCreate[0].update({"system.carga3": false});
      toCreate[0].update({"system.carga4": false});
    }
    return this.actor.createEmbeddedDocuments("Item", toCreate);    
	}
    
  activateListeners(html) {

    super.activateListeners(html);
    //html.find(".pericia-npc-check").click(this._enTiradaPericiaNPC.bind(this));
    //html.find(".ataque-monstruonpc").click(this._enAtaqueNPC.bind(this));
    //html.find(".defensa-monstruo").click(this._enDefensaNPC.bind(this));

    html.find(".item:not(.cargo-row) input[data-property]")
      .click(evt => evt.target.select())
      .change(this._onEditInSheet.bind(this));

    html.find(".cargo-row input")
      .click(evt => evt.target.select())
      .change(this._onCargoRowChange.bind(this));

    html.find(".item:not(.cargo-row) .item-qty input")
      .click(evt => evt.target.select())
      .change(this._onQtyChange.bind(this));

      html.find(".item-create").click(this._onItemCreate.bind(this));
   //   html.find(".item-delete").click(this._onItemDelete.bind(this));
    // View Item Sheets
    html.find(".item-edit").click(this._onItemEdit.bind(this));
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));    
      const row = ev.currentTarget.closest(".item");
      if (row.classList.contains("cargo-row")) {
        const idx = Number(row.dataset.itemIndex);
        //const type = row.classList.contains("crew") ? "crew" : "passengers";
        let type;
        if (row.classList.contains("crew")) {
          type = "crew";
        } else if (row.classList.contains("passengers")) {
          type = "passengers";
        } else if (row.classList.contains("mejoras")) {
          type = "mejoras";
        } else {
          // Default case if none of the specified classes are found
          type = "unknown";
        }

       

        if (type==="crew"){
          
        const cargo = foundry.utils.deepClone(this.actor.system.tripulacion[type]).filter((_, i) => i !== idx);
        return this.actor.update({[`system.tripulacion.${type}`]: cargo});
        }
        if (type === "passengers"){
          const cargo = foundry.utils.deepClone(this.actor.system.pasajeros[type]).filter((_, i) => i !== idx);
          return this.actor.update({[`system.pasajeros.${type}`]: cargo});
          }
        if (type === "mejoras"){          
          const cargo = foundry.utils.deepClone(this.actor.system[type]).filter((_, i) => i !== idx);
          return this.actor.update({[`system.${type}`]: cargo});
          }  
      }  
      else {
      item.delete();
      li.slideUp(200, () => this.render(false));
      }
      });
      //Armas con tripulacion asignada.
      html.find(".item-trip").click(this._onToggleTrip.bind(this));
      html.find(".item-notrip").click(this._onToggleNoTrip.bind(this));
      //Ataques
      html.find(".ataque-cannon").click(this._enAtaqueBarco.bind(this));      
      html.find('.rollable').click(this._onRoll.bind(this));
  }
  
   async _onDropSingleItem(itemData) {
    const cargoTypes = ["armas","armaduras","equipaje","equipamiento","consumibles","monturas"];
    const isCargo = cargoTypes.includes(itemData.type); // && (this._tabs[0].active === "cargo"); //remover parte tab?
    //foundry.utils.setProperty(itemData, "flags.ARGS.vehicleCargo", isCargo);
    
    itemData.update({"system.isCargo" : isCargo});
    return itemData;
  }

  _onCargoRowChange(event) {
    event.preventDefault();
    const target = event.currentTarget;
    const row = target.closest(".item");
    const idx = Number(row.dataset.itemIndex);
    let property;
    //const property = row.classList.contains("crew") ? "crew" : "passengers";
    if (row.classList.contains("crew")) {
      property = "crew";
    } else if (row.classList.contains("passengers")) {
      property = "passengers";
    } else if (row.classList.contains("mejoras")) {
      property = "mejoras";
    } else {
      // Default case if none of the specified classes are found
      property = "unknown";
    }
    
    
    let cargo;
    // Get the cargo entry
    if(property === "crew"){
    cargo = foundry.utils.deepClone(this.actor.system.tripulacion[property]);
    
    }
    if (property === "passengers"){
    cargo = foundry.utils.deepClone(this.actor.system.pasajeros[property]);
    }
    if (property === "mejoras"){
      cargo = foundry.utils.deepClone(this.actor.system[property]);
      }
    //const cargo = foundry.utils.deepClone(this.actor.system.pasajeros[property]); ok
   
    const entry = cargo[idx];
    if ( !entry ) return null;

    // Update the cargo value
    const key = target.dataset.property ?? "name";
    const type = target.dataset.dtype;
    let value = target.value;
    if (type === "Number") value = Number(value);
    entry[key] = value;

    // Perform the Actor update
    if(property === "crew"){
      return this.actor.update({[`system.tripulacion.${property}`]: cargo});
      }
      else if (property === "passengers"){
        return this.actor.update({[`system.pasajeros.${property}`]: cargo});
      }
      else if (property === "mejoras"){
        return this.actor.update({[`system.${property}`]: cargo});
      }
    
  }

  _onEditInSheet(event) {
    event.preventDefault();
    const itemID = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemID);
    const property = event.currentTarget.dataset.property;
    const type = event.currentTarget.dataset.dtype;
    let value = event.currentTarget.value;
    let element = event.currenTarget;
    if (type === "Boolean"){
        if ( event.currentTarget.checked) {
         
          value = true;
        }
        else {
          value = false;
        }
      }
    if (type === "Number"){
      value = parseInt(value);
    }
    
    //switch (type) {
    //  case "Number": value = parseInt(value); break;
    //  case "Boolean": value = value === "true"; break;
   // }
    
   //value = !item[property];
    return item.update({[`${property}`]: value});
  }

  _onItemCreate(event) {
    event.preventDefault();
    // Handle creating a new crew or passenger row.
    const target = event.currentTarget;
    const type = target.dataset.type;
    if (type === "crew" ) {
      const cargo = foundry.utils.deepClone(this.actor.system.tripulacion[type]);
    
      //cargo.push(newCargo);
      cargo.push(this.constructor.newCargo);
      
      return this.actor.update({[`system.tripulacion.${type}`]: cargo});
    }
    if ( type === "passengers") {
      const cargo = foundry.utils.deepClone(this.actor.system.pasajeros[type]);
     //cargo.push(newCargo);
     // cargo.items.push(newCargo);
      cargo.push(this.constructor.newCargo);
      
      return this.actor.update({[`system.pasajeros.${type}`]: cargo});
    }
    if (type === "mejoras" ) {
      const mejora = foundry.utils.deepClone(this.actor.system[type]);
      //cargo.push(newCargo);
      mejora.push(this.constructor.newEquip);
      
      return this.actor.update({[`system.${type}`]: mejora});
    }
    const itemData = {
      name: game.i18n.format("ARGS.items.nuevo", {type: game.i18n.localize( "ITEM.TypeEquipamiento")}),
      type: type,
      system: foundry.utils.expandObject({ ...target.dataset })
    };
    return this.actor.createEmbeddedDocuments("Item", [itemData]);
    //return super._onItemCreate(event);
  }
  _onItemDelete(event) {
    event.preventDefault();
    // Handle deleting a crew or passenger row.
    const row = event.currentTarget.closest(".item");
    if (row.classList.contains("cargo-row")) {
      const idx = Number(row.dataset.itemIndex);
      let type;
      // const type = row.classList.contains("crew") ? "crew" : "passengers";
      if (row.classList.contains("crew")) {
        type = "crew";
      } else if (row.classList.contains("passengers")) {
        type = "passengers";
      } else if (row.classList.contains("mejoras")) {
        type = "mejoras";
      } else {
        // Default case if none of the specified classes are found
        type = "unknown";
      }

      if (type === "crew" || type === "passengers") {
      const cargo = foundry.utils.deepClone(this.actor.system.cargo[type]).filter((_, i) => i !== idx);
      return this.actor.update({[`system.cargo.${type}`]: cargo});
      }
      if (type === "mejoras") {
        const cargo = foundry.utils.deepClone(this.actor.system[type]).filter((_, i) => i !== idx);
        return this.actor.update({[`system.${type}`]: cargo});
        }

    }
    return super._onItemDelete(event);

    
  }
  _onQtyChange(event) {
    event.preventDefault();
    const itemID = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemID);
    let qty = parseInt(event.currentTarget.value);
    if ( Number.isNaN(qty) ) qty = 0;
    return item.update({"system.cantidad": qty});
  }
  _onItemEdit(event) {
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    return item.sheet.render(true);
  }
  
  //tripulacion asignada a arma
  _onToggleTrip(event){
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);
     const attr = item.type === "spell" ? "system.preparation.prepared" : "system.tripulado";
     return item.update({"system.tripulado": true});
   }
   _onToggleNoTrip(event){
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);
     const attr = "system.tripulado";
     return item.update({"system.tripulado": false});
   }
   //ataues   
   async _enAtaqueBarco(event){
    event.preventDefault();
    const itemId = $(event.currentTarget).data("item-id");
		const item = this.actor.getEmbeddedDocument("Item", itemId);
    this.actor.tirarAtaqueVehiculo(itemId);
  }
  
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
       
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      let label = dataset.label ? `[pericias] ${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());      

      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
  }

   
}// fin clase monstruo