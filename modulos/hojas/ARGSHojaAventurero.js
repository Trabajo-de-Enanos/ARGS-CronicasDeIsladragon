
import ARGSHojaActor from "./ARGSHojaActor.mjs";

export default class ARGSHojaAventurero extends ARGSHojaActor {
	
	static get defaultOptions(){
		return foundry.utils.mergeObject(super.defaultOptions,{
			template: `systems/ARGS/templates/hojas/aventurero-hoja.hbs`,
			classes: ["ARGS","sheet","aventurero"],
			tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "caracteristicas" }]
		});

	}
	
	 /** @override */
	 get template() {
		return `systems/ARGS/templates/hojas/${this.actor.type}-hoja.hbs`;
	  }







	_onDropCatalogoItem(item) {    
    
		switch (item.type) {
			case "especie":
			  return this.actor.addEspecie(item);
			case "habilidades":        
				return this.actor.addHabilidad(item);        
			case "clases":        
				return this.actor.addClase(item);			
		}    
	}

  _onItemCatalogoSelect(item) {        
    
		switch (item.type) {
			case "especie":
			  return this.actor.addEspecie(item);
			case "clases":        
				return this.actor.addClase(item);			
		}    
	}

  _sortAllItems(context) {
		// Pre-sort all items so that when they are filtered into their relevant
		// categories they are already sorted alphabetically (case-sensitive)
    return (context.items ?? []).sort((a, b) => a.name.localeCompare(b.name));
    
	}

	/** @override */
	getData() {
	// Retrieve the data structure from the base sheet. You can inspect or log
	// the context variable to see the structure, but some key properties for
	// sheets are the actor object, the data object, whether or not it's
	// editable, the items array, and the effects array.
  

  //context.config = CONFIG.ARGS;
	// Use a safe clone of the actor data for further operations.
	const actorData = this.actor.toObject(false);
  



	const data = super.getData();
  this.actor._populateCatalogoItems();
  	const context = super.getData();
  context.catalogoSelectors =  this.getCatalogoSelectors();
  context.habilidadesAprendidas= this.actor.habilidadItems();
  context.aventureroClase = this.actor.catalogoItems.clase?.name;
  
  itemContext: {};
	// Add the actor's data to context.data for easier access, as well as flags.
	context.system = actorData.system;
  context.flags = actorData.flags;

  
	// Prepare character data and items.
	if (actorData.type == 'aventurero') {
	  this._prepareItems(context);
	  this._prepareCharacterData(context);

    context.expandedData = {};
    for ( const id of this._expanded ) {
      const item = this.actor.items.get(id);
      if ( item ) context.expandedData[id] = item.getChatData({secrets: this.actor.isOwner,rollData: context.rollData,
        async: true,
        relativeTo: this.item});
    }
	}
  
	// Prepare NPC data and items.
	if (actorData.type == 'npc') {
	  this._prepareItems(context);
	}
  

	// Add roll data for TinyMCE editors.
	//context.rollData = context.actor.getRollData();
  
	// Prepare active effects
	//context.effects = prepareActiveEffectCategories(this.actor.effects);
  context.effects = this.actor.effects;

  
	return context;
  }

 
  
  async _onItemQuantityDecrement(event) {
		event.preventDefault();

		const itemId = $(event.currentTarget).data("item-id");
		const item = this.actor.getEmbeddedDocument("Item", itemId);

		if (item.system.cantidad > 0) {
			this.actor.updateEmbeddedDocuments("Item", [
				{
					_id: itemId,
					"system.cantidad": item.system.cantidad - 1,
				},
			]);
		}
	}
  async _onItemQuantityIncrement(event) {
		event.preventDefault();

		const itemId = $(event.currentTarget).data("item-id");
		const item = this.actor.getEmbeddedDocument("Item", itemId);

		if (item.system.cantidad ) {
			this.actor.updateEmbeddedDocuments("Item", [
				{
					_id: itemId,
					"system.cantidad": item.system.cantidad + 1,
				},
			]);
		}
	}


  _prepareCharacterData(context) {
    // Handle ability scores.
   // for (let [k, v] of Object.entries(context.system.caracteristicas)) {
   //   v.label = game.i18n.localize(CONFIG.ARGS.caracteristicas[k]) ?? k;
   // }
    // pericias combate
   // for (let [k, v] of Object.entries(context.system.pericias.combate)) {
   //   v.label = game.i18n.localize(CONFIG.ARGS.periciascombate[k]) ?? k;
   // }  
   
   if ( context.system.especie !== "" && context.system.especieflag === false) { //Entro con flag false desde el selector.
    const especie = context.system.especie;    
    const item = fromUuidSync(especie);    
    context.system.especieflag = true; //Cambio Flag para que no entre en esta logica de insertar.
    this.actor.update({ "system.especieflag" : true });
    
    return this._onItemCatalogoSelect(item); // desde select
  }
  else if (context.system.especie === null && context.system.especieflag === false ){
    
    const especieIds = this.actor.itemTypes.especie.map(i => i.id);
    
    if (especieIds !== null) {
    return this.actor.EspecieDelete();
    }
   }   
  
  if ( context.system.clase !== "" && context.system.claseflag === false ) {
    const clase = context.system.clase;
    const itemclase = fromUuidSync(clase);    
    context.system.claseflag = true; //Cambio Flag para que no entre en esta logica de insertar.
    this.actor.update({ "system.claseflag" : true });//Cambio Flag para que no entre en esta logica de insertar.
    
    return this._onItemCatalogoSelect(itemclase); // desde select
  }
  else if (context.system.clase === null && context.system.claseflag === false ){
    const claseIds = this.itemTypes.clases.map(i => i.id);
    
    if (claseIds !== null) {
   return this.actor.ClaseDelete();
    }
  }        
  
}




/* -------------------------------------------- */

  //"armas","armaduras","equipaje","equipamiento","consumibles","hechizo","clases"
  _prepareItems(context) {
    // Initialize containers.
    const actor = this.actor;
    const systemData = actor.system;

    const gear = [];
    const mont = [];
    const clase = [];
    const lenguajes = [];
    const especie = [];
    const features = [];
    const spells = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: []
    };
      
    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      // Append to spells.
      if (i.type === 'hechizo') {
        if (i.system.nivelhechizo != undefined) {
          spells[i.system.nivelhechizo].push(i);
        }
      }
     // Monturas.
     else if (i.type === 'monturas') {
      mont.push(i);
      }
      // Clase
      else if (i.type === 'clases') {
        clase.push(i);
        }
         // Clase
      else if (i.type === 'lenguajes') {
        lenguajes.push(i);
        }
      // Especie
      else if (i.type === 'especie') {
        especie.push(i);
        }
      // Append to gear.
      else if (i.type !== 'clases'   ) {
        gear.push(i);
      } //&& i.type === 'armaduras' && i.type === 'equipamiento' && i.type === 'equipaje'  && i.type === 'consumibles'
      
    }
        // Assign and return
        
        context.gear = gear;        
        context.clase = clase;
        context.especie = especie;
        context.features = features;        
        context.features = lenguajes;
        context.mont = mont;
        context.spells = spells;

        // Categorize items as inventory, spellbook, features, and classes
    const inventory = {};
    for ( const type of ["armas","armaduras","equipaje","equipamiento","consumibles","monturas"] ) {
      inventory[type] = {label: "LABEL TOTI", itemsDLR: [], dataset: {type}};
    }
  
    // Partition items by category
    let {items, hechizo, clases } = context.items.reduce((obj, item) => {
      const {cantidad, usos} = item.system;
      // Item details
      const ctx = context.items[item.id] ??= {};
     
     ctx.isStack = Number.isNumeric(cantidad) && (cantidad !== 1);
    // Prepare data needed to display expanded sections
      //ctx.isExpanded = this._expanded.has(item.id);
      // Item cambiar estado equipado 
      this._prepareItemToggleState(item, ctx);
      
     

      // Classify items into types
      if ( item.type === "hechizo" ) obj.hechizos.push(item);
      //else if ( item.type === "feat" ) obj.feats.push(item);
      //else if ( item.type === "habilidades" ) obj.habilidades.push(item);
      else if ( item.type === "clases" ) obj.clases.push(item);
      else if ( item.type === "especie" ) obj.especie.push(item);
      else if ( item.type === "lenguajes" ) obj.lenguajes.push(item);
      //else if ( item.type === "subclases" ) obj.subclases.push(item);
      else if ( Object.keys(inventory).includes(item.type) ) obj.items.push(item);
      return obj;
    }, { items: [], hechizos: [], clases: [], especie: [], lenguajes: [] });

     // Organize items
     for ( let i of items ) {
      const ctx = context.items[i.id] ??= {};
      ctx.totalPeso = (i.system.cantidad * i.system.peso).toNearest(0.1);
      inventory[i.type].itemsDLR.push(i);
      
    }
      
    // Assign and return
    context.inventoryFilters = true;
    context.inventory = Object.values(inventory);
    context.lenguajes = Object.values(lenguajes);

    

    
    // Manejo peso items / defensa
    let slotCount = 0;
    let slotCountMount = 0;
    let slotCountInv = 0;
    let TotalDefensa = 0;
    let TotalCatArmadura = 0;
    let almacenaje = 10;
    let almacenajeTot = 0;
    let almacenajeTotMount = 0;
    context.almacenajeTotalMount=0;
    context.almacenajeTotal = 10; //Inventario Gratis.
    let costolengtotal= 0;
    let costoFinal= 0;
    let claseESP = "";

    const myMapHabilidades = new Map()
    for (let [key, habilidad] of Object.entries(context.system.habilidades)) {            
      
      const hab = fromUuidSync(habilidad);
      myMapHabilidades.set(key,habilidad);
   } 
   
    const myMapLenguajes = new Map()
    for (let [key, lenguaje] of Object.entries(lenguajes)) {            
     myMapLenguajes.set(key,lenguaje);
   } 
    
    for (const i of this._sortAllItems(context)) {
      
      // Enrich HTML description		
		i.itemsHTML = TextEditor.enrichHTML(
			i.system.description.value,
			{				
        rollData: context.rollData,
				async: false,
				relativeTo: this.actor,
			}
		);
     
      if ( i.type === "clases") {
        // Asigna valores de clase a la hoja;      
   

        context.system.calculados.catarmadura.final = context.system.calculados.catarmadura.valor + i.system.especiales.bonifCatArm; // Bono Categoria Armadura // 
        context.system.calculados.BD.final = context.system.calculados.OA.final + i.system.especiales.bonifBD; // Bono BD  ok // 
     
        context.system.calculados.puntosvida.max = context.system.calculados.puntosvida.max + i.system.especiales.bonifPV.max; // mal
     
        this.actor.system.calculados.puntosmagia.max = (context.system.caracteristicas.cultura.finalss + context.system.caracteristicas.intuicion.finalss 
          + context.system.caracteristicas.carisma.finalss + context.system.calculados.devocion + context.system.calculados.puntosmagia.extra + context.system.calculados.puntosmagia.bonoEf) + i.system.especiales.bonifPM; // mal
        context.system.calculados.puntosmagia.max =  (context.system.caracteristicas.cultura.finalss + context.system.caracteristicas.intuicion.finalss 
          + context.system.caracteristicas.carisma.finalss + context.system.calculados.devocion + context.system.calculados.puntosmagia.extra + context.system.calculados.puntosmagia.bonoEf)+ i.system.especiales.bonifPM; // mal
        context.system.calculados.resistenciamagia.final = context.system.calculados.resistenciamagia.valor + i.system.especiales.bonifRM;  //mal
        
        this.actor.system.calculados.resistenciamagia.final = context.system.calculados.resistenciamagia.final;
       // context.system.calculados.conjurar.value = context.system.calculados.conjurar.value + i.system.especiales.bonifconjurar;
        context.system.calculados.conjurar.bonoclase=i.system.especiales.bonifconjurar;
        context.system.habilidades = i.system.habilidades;
        context.system.inventario = i.system.inventario;
       
        
      }
      if ( i.type === "especie") {
        claseESP = i.name;
      //this.actor.LenguajeAgregar(i);

      }

      if (i.type === "lenguajes") {
        
        let nameLeng = i.name;
          if (claseESP.match(/^.*Imperi$/) || claseESP.match(/^.*Emperador$/)) 
              { 
                  if (nameLeng === "Imperial" || nameLeng === "Elfico" || nameLeng === "Enano" || nameLeng === "Pieles Verdes" ){
                    i.system.costo = i.system.costo; //se mantiene el costo de lenguaje dentro del imperio
                  }
                  if (nameLeng === "Draconico" || nameLeng === "Lengua Negra" || nameLeng === "Lenguaje Antiguo Perdido"){
                    i.system.costo = i.system.costo; //se mantiene el costo de lenguaje
                  }                 
                  else {
                    i.system.costo = i.system.costo * 2;
                  }
              }
          else {
            
                if (nameLeng === "Imperial"  ){
                  i.system.costo = i.system.costo * 2;
                }
                if (nameLeng === "Draconico" || nameLeng === "Lengua Negra" || nameLeng === "Lenguaje Antiguo Perdido"){
                  i.system.costo = i.system.costo; //se mantiene el costo de lenguaje
                }
               else {
                  i.system.costo = i.system.costo; //se mantiene el costo de lenguaje
                }
            
          }
       // i.system.nivel = i.system.nivel ?? 1;      
       myMapLenguajes.forEach((value, key) => {
        if(i._id === value._id) {
        i.system.nivel =  context.system.lenguajes[key].nivel;
        }        
      });
        const valorLeng = myMapLenguajes.get(i) || 0;  // key es el id, lenguaje es el item.
        
        i.system.costoFinal = (i.system.costo * (i.system.nivel ?? 1) ) - (i.system.natal ?? 0);
        
        
        const costoleng = i.system.costoFinal;
				let totalcosto = costoleng;
        costolengtotal += totalcosto;
        context.system.calculados.totalCostoLeng = costolengtotal;
      }
			if ( (i.type === "equipaje" && i.system.enmontura === false ) ||  (i.type === "equipamiento" && i.system.tipoEquipamiento === "indumentaria")  ) {
        const capacidad = i.system.capacidad.value ?? 0;
        let almacenamientoitem = capacidad;
        
        i.almacenaje = almacenamientoitem;
        almacenajeTot += i.almacenaje;
        context.almacenajeTotal = almacenajeTot + context.system.calculados.cargaalmacenaje.gratis;
        context.system.calculados.cargaalmacenaje.max =context.almacenajeTotal ;
       
       
      }
      else if (i.type === "equipaje" && i.system.enmontura === true ){
        const capacidad = i.system.capacidad.value ?? 0;
        let almacenamientoitem = capacidad;
        
        i.almacenajeMt = almacenamientoitem;
        almacenajeTotMount += i.almacenajeMt;
        context.almacenajeTotalMount = almacenajeTotMount;
        context.system.calculados.cargaalmacenajeMt.max = context.almacenajeTotalMount ;  // ok
        
      };
     
      if (i.system.equipado === true && ( i.type !== "equipaje" || i.type !== "monturas") && i.system.enmontura === false) {
				i.showCantidad = i.system.cantidad > 1 ? true : false;

       
        
        if(context.system.caracteristicas.intuicion.final === 7 && i.type === "armas" && i.system.atacaCon === "blancascortas"){
        
         // context.system.calculados.BD = context.TotalDefensaItems + context.system.calculados.OA  + 1;
         i.system.defensa=1;
        }
       
        if(context.system.caracteristicas.intuicion.final > 7 && i.type === "armas" && i.system.atacaCon === "blancascortas"){
          //context.system.calculados.BD = context.TotalDefensaItems + context.system.calculados.OA  + 2;
          i.system.defensa=2;
        }
				// We calculate how many slots are used by this item, taking
				// into account the quantity and any free items.
				//

				const peso = i.system.peso;
				const equipado = i.system.equipado;
				const quantity = i.system.cantidad;
				const slotsUsed = context.system.calculados.cargainventario.value;

				let totalSlotsUsed = quantity  * peso;
        //totalSlotsUsed -= freeCarry * slotsUsed;
				i.slotsUsed = totalSlotsUsed;

				slotCount += i.slotsUsed;
				context.slotsUsed = slotCount ;        
        context.system.calculados.cargainventario.value = context.slotsUsed;
                
        const defensa = i.system.defensa ?? 0;
        let totalDefItem = defensa * quantity;
        i.totalDef = totalDefItem;
        TotalDefensa += i.totalDef;
        context.TotalDefensaItems = TotalDefensa;
        //ca bono superstat blancas cortas.
       
        context.system.calculados.totaldefensa = context.TotalDefensaItems;
        context.system.calculados.BD.final= context.TotalDefensaItems + context.system.calculados.OA.final + context.system.calculados.BD.bonoEf;
        this.actor.system.calculados.BD.final= context.TotalDefensaItems + context.system.calculados.OA.final + context.system.calculados.BD.bonoEf;
        systemData.calculados.BD.final= context.TotalDefensaItems + context.system.calculados.OA.final + context.system.calculados.BD.bonoEf;

        const catarmadura = i.system.categoria ?? 0;
        let totalCatArmItem = catarmadura * quantity;
        i.totalCatArm = totalCatArmItem;
        TotalCatArmadura += i.totalCatArm;
        context.TotalCategoriaArmaduraItems = TotalCatArmadura;



        if(context.TotalCategoriaArmaduraItems>context.system.calculados.catarmadura.final) {
          ui.notifications.error("Categoria de Armadura Superada.");
        }
       
        
     

			}      
			else if (i.system.equipado === false && ( i.type !== "equipaje" && i.type !== "monturas") && i.system.enmontura === false) {
        const peso = i.system.peso;
				const equipado = i.system.equipado;
				const quantity = i.system.cantidad;
				const slotsUsed = context.system.calculados.cargainventario.value;

				let totalSlotsUsed = quantity  * peso;
        //totalSlotsUsed -=  slotsUsed;

				i.slotsUsed = totalSlotsUsed;
        
				slotCount += i.slotsUsed;
				slotCountInv += i.slotsUsed;
				context.slotsUsed = slotCount ;    
				context.slotsUsedInv = slotCountInv ;     
        
        // Si se pasa de la carga da una advertencia
        
        
        context.system.calculados.cargainventario.value = context.slotsUsed;
        context.system.calculados.cargaalmacenaje.value = context.slotsUsedInv;
        
       

      }
      else if (i.system.enmontura === true) {
        const peso = i.system.peso;
				const quantity = i.system.cantidad;
				
				let totalSlotsUsed = quantity  * peso;
        i.slotsUsedMt = totalSlotsUsed;
        
				//slotCount += i.slotsUsedMt;
				slotCountMount += i.slotsUsedMt;
				//context.slotsUsed = slotCount ;    
				context.slotUsedMount = slotCountMount ;     
        
        context.system.calculados.cargaalmacenajeMt.value = context.slotUsedMount; // En contexto para visualizar en .hbs
      
        systemData.calculados.cargaalmacenajeMt.value = context.slotUsedMount; // guarda en data que despues puede traer el dataroll
        
         
      }
       // Montura carga doble si no hay jinete.
       if (i.type === "monturas" && i.system.montar === false) {
        const carga = i.system.carga.max;
        let cargatemp = carga * 2;
        i.cargaMaxTemp = cargatemp;
        //i.system.carga.max = i.system.carga.max * 2;
      }
      else if (i.type === "monturas" && i.system.montar === true) {
       const carga = i.system.carga.max;
       i.cargaMaxTemp = carga;
      }

      //ANTORCHAS
      if(i.system.equipado ===true && i.type === "equipamiento" && i.system.tipoEquipamiento === "luminarias" && i.system.usos.value > 0) {
          
          const token = canvas.tokens.controlled[0];
          if(token){
          token.document.update({
          light: {
          bright: 1,
          dim: 3,
          color: '#ffa200',
          alpha: 0.1,
          animation: {
          type: 'torch'
           }
          }
          });      
         }            
        }
        if (i.system.equipado !==true && i.type === "equipamiento" && i.system.tipoEquipamiento === "luminarias" && i.system.usos.value > 0) {
          const token = canvas.tokens.controlled[0];            
          if(token){
          token.document.update({
          light: {
          bright: 0,
          dim: 0,
          color: '#ffa200',
          alpha: 0.1,
          animation: {
          type: 'torch'
           }
          }
          });
        }
        }
      


		} // termina loop por items
    const actorData = this.actor.toObject(false);
    
     if (context.system.calculados.cargaalmacenaje.value > context.system.calculados.cargaalmacenaje.max) ChatMessage.create ({
        
        user: game.user.id,
         whisper: [game.user.id],
         speaker:  ChatMessage.getSpeaker({actor: this.actor, token: this.token, user: this.user}),
         //speaker: ChatMessage.getSpeaker({ actor: this.Actor}),
        flavor: "Estoy excedido de peso!!"
       

      }
      // ui.notifications.warn(
       //game.i18n.localize("Espacio de almacenaje en bolsas excedido. Comprar Almacenaje")
      );
      
  }
  
 
    // Emulate a itom drop as it was on the sheet, when dropped on the canvas
	async emulateItemDrop(data) {
		return this._onDropItem({}, data);
	}
  
  async _onDropItem(event, data) {
		//if (await this._effectDropNotAllowed(data)) return false;    
    const item = await fromUuid(data.uuid);
    //const itemid = data.uuid;
    
    const catalogoItems = [
			"especie",
			"habilidades",
			"clases",
		];
    //const lenguajeItems = [ "lenguajes"];
    if (catalogoItems.includes(item.type)) {            
			return this._onDropCatalogoItem(item);
		}
    //if (lenguajeItems.includes(item.type)){
    //  return this.actor.LenguajeAgregar(item);
    //}
    else {    
		return super._onDropItem(event, data); // toti revisar para items raros.
    }
	}


  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {

  
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");      
      const item = this.actor.items.get(li.data("itemId"));
      
      item.sheet.render(true);
    });
    html.find('.infotexto1-control').click(ev => {
      let hiddenElements = $(ev.currentTarget).parent().children('.infotexto1-control').find( ":hidden" ).not( "script" );
      if (hiddenElements.length > 0) {
        $(ev.currentTarget).parent().children('.infotexto1-control').show();
      } else {
        $(ev.currentTarget).parent().children('.infotexto1-control').hide();
      }
    });
    html.find('.infotexto2-control').click(ev => {
      let hiddenElements = $(ev.currentTarget).parent().children('.infotexto2-control').find( ":hidden" ).not( "script" );
      if (hiddenElements.length > 0) {
        $(ev.currentTarget).parent().children('.infotexto2-control').show();
      } else {
        $(ev.currentTarget).parent().children('.infotexto2-control').hide();
      }
    });

    html.find(".agregar-hechizos").click(this._enAgregarHechizos.bind(this));

    html.find('.inline-edit').change(this._enEdicionItem.bind(this));
    html.find(".carchange-cultura").change(this._enEdicionCultura.bind(this));
    //html.find(".carchange-cultura").change(this._enEdicionCultura.bind(this));
    html.find('.ptos-mgc').on("click contextmenu", this._enCambioPuntosMAgia.bind(this));
		// Estado equipado 
    html.find(".item-toggle").click(this._onToggleItem.bind(this));
    // Mover a Montura el item:
    html.find(".item-mounttoggle").click(this._onToggleMntItem.bind(this));
    // Subirse a la montura:
    html.find(".item-ride").click(this._onToggleRide.bind(this));
    //preparar hechizo:
    html.find(".item-toggle").click(this._onSpellPrepItem.bind(this));
    // Conjuro descripcion desplegable
    html.find(".item-namecenter .nombreconjuro").click(event => this._enHechizoDescripcion(event));
    // Tiradas Pericias
    html.find(".pericia-check").click(this._enTiradaPericia.bind(this));
    // Armas Rapidas
    html.find(".armas-rapidas").click(this._enArmasRapidas.bind(this));
    html.find(".armas-rapidas-ambi").click(this._enArmasAmbidiestro.bind(this));
    // Armas Rapidas
    html.find(".defensa-rapida").click(this._enDefensaRapida.bind(this));    
    // Magia desde descripcion desplegada.
    html.find(".hechizos-rapidos").click(this._enLanzarConjuro.bind(this));
    //html.find("[data-action='lanzar-hechizo']").click(event => this._enLanzarConjuro(event));
    // Resistencia Magica
    html.find(".resmag-check").click(this._enTiradaResMag.bind(this));
    //Tiradas Montura
    html.find(".mont-instinto").click(this._enMonturaInstinto.bind(this));
    html.find(".mont-ataque").click(this._enMonturaAtaque.bind(this));
    html.find(".mont-destreza").click(this._enMonturaDestreza.bind(this));

    html.find(".tirar-stats").click(this._enTirarStats.bind(this));

 
    // Imagen Items
    html.find(".item-image").click(
			event => this._enItemChatClick(event)
		);
    html.find(".mount-image").click(
			event => this._enItemChatClick(event)
		);

    
    const actorData = this;
    const systemData = actorData.system;
    // count checkboxes de Religion
    //for ( const checkbox of html[0].querySelectorAll("input[id='fuegorel']") ) {
      //if ( checkbox.checked ) 
   //   systemData.religiones.relfuego.value = 1;
      //this._onToggleCategory(checkbox);
    //}
  
       // Hook up -/+ buttons to adjust the current value in the form
   
  
  
   
    

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

       // Leveleo
       html.find(".levelbutton").click(event => {
        const button = event.currentTarget;
        const current = button.parentElement.querySelector(".carlevel");
        let carac = current.dataset.label;
        current.value = eval(current.value) + 1 ;
        //current.level=true;
        this.actor.update({[ `system.caracteristicas.${carac}.value`] : current.value  });
        //this.actor.system.caracteristicas[carac].value = 999;s
        
        //cls = this.itemTypes.class.find(c => c.system.caracteristicas.fuerza);
        //const max = button.parentElement.querySelector(".max");
        //const direction = button.classList.contains("increment") ? 1 : -1;
       
        //current.value = Math.clamped(parseInt(current.value) + direction, 0, parseInt(max.value));
      });
    //  html.find("button.levelconfirm").click(this._onLevelConfirm.bind(this));
    
  
  

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));      
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
   // html.find(".effect-control").click(ev => _onEffectControl(ev, this.actor));

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

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

  /**
   * Handle toggling the state of an Owned Item within the Actor.
   * @param {Event} event        The triggering click event.
   * @returns {Promise<Item5e>}  Item with the updates applied.
   * @private
   */
  async _enArmasRapidas(event) {
    event.preventDefault();
		const itemId = $(event.currentTarget).data("item-id");
		const item = this.actor.getEmbeddedDocument("Item", itemId);
    this.actor.tirarAtaque(itemId);
  }
  async _enArmasAmbidiestro(event) {
    event.preventDefault();
		const itemId = $(event.currentTarget).data("item-id");
		const item = this.actor.getEmbeddedDocument("Item", itemId);
    let opcion="ambidiestro";
    this.actor.tirarAtaque(itemId,opcion);
  }

  async _enDefensaRapida(event){
    event.preventDefault();
		const itemId = $(event.currentTarget).data("item-id");
		const item = this.actor.getEmbeddedDocument("Item", itemId);
    let opcion="defensa";
    this.actor.tirarAtaque(itemId,opcion);

  }

  async _enHechizosRapidos(event) {
    event.preventDefault();
		const itemId = $(event.currentTarget).data("item-id");
		const item = this.actor.getEmbeddedDocument("Item", itemId);
    this.actor.tirarAtaque(itemId);
  }

  async _enItemChatClick(event) {
		event.preventDefault();
		const itemId = $(event.currentTarget).data("item-id");
		const item = this.actor.getEmbeddedDocument("Item", itemId);  
   
    item.mostrarTarjeta();
	}

  async _enMonturaAtaque(event){
    event.preventDefault();
    const itemId = $(event.currentTarget).data("item-id");
		const actorId = $(event.currentTarget).data("actor-id");
		const actor = game.actors.get(actorId);	
		this.actor.tirarAtaqueMontura(itemId);
  }

  async _enMonturaInstinto(event){
    event.preventDefault();
    const itemId = $(event.currentTarget).data("item-id");
		const actorId = $(event.currentTarget).data("actor-id");
		const actor = game.actors.get(actorId);	
		this.actor.tirarInstintoMontura(itemId);
  }
  async _enMonturaDestreza(event){
    event.preventDefault();
    const itemId = $(event.currentTarget).data("item-id");
		const actorId = $(event.currentTarget).data("actor-id");
		const actor = game.actors.get(actorId);	
		this.actor.tirarDestrezaMontura(itemId);
  }

  //Resistencia Magica
  async _enTiradaResMag(event){
    event.preventDefault();
    const resmag = this.actor.system.calculados.resistenciamagia.final;
    
    //return this.actor.tirarPericia(skill, {event: event});
    const data = {
      actor: this.actor,
      resmag: resmag,
      esRM: 1
      
    }
    this.actor.tirarRM(data);  

  }
 
  // BORRAR?
  async _enTiradaPericia(event) {
    event.preventDefault();
    
    const skill = event.currentTarget.closest("[data-key]").dataset.key;
    const grupo = event.currentTarget.closest("[data-cat]");    
    var catpericia = grupo.getAttribute('data-cat');
  
    //return this.actor.tirarPericia(skill, {event: event});
    const data = {
      actor: this.actor,
      categoria: catpericia,
      pericia: skill,
    }
    this.actor.tirarPericia(data);
    
   
  }

  _onToggleItem(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    
    const item = this.actor.items.get(itemId);
    const attr = item.type === "hechizo" ? "system.preparado" : "system.equipado";
    return item.update({[attr]: !foundry.utils.getProperty(item, attr)});
  }

  _onSpellPrepItem(event){
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);
  }

  _onToggleMntItem(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    
    const item = this.actor.items.get(itemId);
    const attr = item.type === "spell" ? "system.preparation.prepared" : "system.enmontura";
    return item.update({[attr]: !foundry.utils.getProperty(item, attr)});
  }

  _onToggleRide(event){
   event.preventDefault();
   const itemId = event.currentTarget.closest(".item").dataset.itemId;
   const item = this.actor.items.get(itemId);
    const attr = item.type === "spell" ? "system.preparation.prepared" : "system.montar";
    return item.update({[attr]: !foundry.utils.getProperty(item, attr)});
  }

  _enEdicionItem(event) {
    event.preventDefault();
    let element = event.currentTarget;
    let itemId = element.closest('.item').dataset.itemId;
    let item = this.actor.items.get(itemId);
    let field = element.dataset.field;

    return item.update({ [field]: element.value });
  }

  _enEdicionCultura(event) {
    const actorData = this.actor;
    event.preventDefault();
    const Numero= Number(event.target.value);
    if (actorData.system.caracteristicas.cultura.final > 7){
      if (actorData.system.dadosespeciales.puntosLogicad41 === false) {
        actorData.system.dadosespeciales.puntosLogicad41 =true
        this.actor.update({ "system.dadosespeciales.puntosLogicad41" : true  });
      }
     // else if (this.actor.system.dadosespeciales.puntosLogicad42 === false ){this.actor.system.dadosespeciales.puntosLogicad42=true;}
      else { ui.notifications.warn(game.i18n.localize("Espacios de Dado de Logica Ocupados"))}
    }
    
  }

  _enCambioPuntosMAgia(event){
    event.preventDefault();
    const actorData = this.actor;
    const systemData = actorData.system;
    let currentCount = systemData.calculados.puntosmagia.value;
    let newCount;

    if (event.type == "click") {
      newCount = Math.min(currentCount + 1, this.actor.system.calculados.puntosmagia.max);
      systemData.calculados.puntosmagia.value = newCount;
     
    } else {
      // contextmenu
      newCount = Math.max(currentCount - 1, 0);
      systemData.calculados.puntosmagia.value = newCount;
    }
          
    return this.actor.update({ "system.calculados.puntosmagia.value" : newCount });
    
    
    }

    async _enAgregarHechizos(event){   
      //this.actor.update({"system.elgiohechizos": true});

      for (const item of this.actor.items) {
        if (item.type === "clases") {

         for (let [keyc, escuela] of Object.entries(item.system.escuelas)) {
            
            if (escuela.length !== 0 ){
                const esccomp = escuela.split('.');
                const esc = esccomp[esccomp.length - 1].trim();
                
                let spellPack = game.packs.get("ARGS." + esc ); //ok          
                let spellIndex = await spellPack.getIndex();
                let toAdd = [];
                
                for (let idx of spellIndex) {
                  
                  let _temp = await spellPack.getDocument(idx._id);
                  
                  if ( esc === _temp.system.escuela && _temp.system.dios === "none"){
                    await this.actor.createEmbeddedDocuments('Item', [_temp.toObject()]);} //paladin, monje, druida y mago de sangre. Propia escuela sin dios.

                  if (this.actor.system.religiones.relfuego.check === true && _temp.system.dios  === 'fuego') {
                  await this.actor.createEmbeddedDocuments('Item', [_temp.toObject()]);}
                  if (this.actor.system.religiones.relagua.check === true && _temp.system.dios  === 'agua') {
                    await this.actor.createEmbeddedDocuments('Item', [_temp.toObject()]);}
                  if (this.actor.system.religiones.reltierra.check === true && _temp.system.dios  === 'tierra') {
                    await this.actor.createEmbeddedDocuments('Item', [_temp.toObject()]);}
                  if (this.actor.system.religiones.relmetal.check === true && _temp.system.dios  === 'metal') {
                    await this.actor.createEmbeddedDocuments('Item', [_temp.toObject()]);}
                  if (this.actor.system.religiones.relnaturaleza.check === true && _temp.system.dios  === 'naturaleza') {
                    await this.actor.createEmbeddedDocuments('Item', [_temp.toObject()]);}
                  if (this.actor.system.religiones.relaire.check === true && _temp.system.dios  === 'aire') {
                    await this.actor.createEmbeddedDocuments('Item', [_temp.toObject()]);}
                  if (this.actor.system.religiones.relarkana.check === true && _temp.system.dios  === 'arkana') {
                    await this.actor.createEmbeddedDocuments('Item', [_temp.toObject()]);}
                                      
             }
            } // fin escuela insert.
          } // fin loop escuelas.

          
        
          if (item.system.escuelas.segunda !== null){}
          if (item.system.escuelas.tercera !== null){}
          if (item.system.escuelas.cuarta !== null){}
        } // if clases.     
      } //for items actor.
      

      
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
 
	async _enLanzarConjuro(event) {
   
		event.preventDefault();
		const itemId = $(event.currentTarget).data("item-id");
    
		this.actor.lanzarHechizo(itemId);
	}

  async _enTirarStats(event) {
    event.preventDefault();
    const data = {
      actor: this.actor,
      categoria: "statsini",
      pericia: "statsini",
    }
    this.actor.tirarStats(data);
  }

  getCatalogoSelectors() {
    const system = this.actor.system;

    const data = {
      especie: {
        name: "especie",
        label: game.i18n.localize("ARGS.infotexto.especielabel"),
        tooltip: game.i18n.localize("ARGS.infotexto.especietooltip"),
        item: fromUuidSync(system.especie) ?? "",
      },
      /*habilidades: {
        name: "habilidades",
        label: game.i18n.localize("ARGS.infotexto.habilidadlabel"),
        tooltip: game.i18n.localize("ARGS.infotexto.habilidadtooltip"),
        item: fromUuid(system.habilidades) ?? null,
      },*/
      clases: {
        name: "clases",
        label: game.i18n.localize("ARGS.infotexto.claselabel"),
        tooltip: game.i18n.localize("ARGS.infotexto.clasetooltip"),
        item: fromUuidSync(system.clase) ?? "",
        
      },			
      
    };
    return data;
  }  
  /* -------------------------------------------- */

    _prepareItemToggleState(item, context) {      
        const isActive = !!item.system.equipado;
        
        context.toggleClass = isActive ? "active" : "";
        context.toggleTitle = game.i18n.localize(isActive ? "ARGS.items.equipado" : "ARGS.items.noequipado");
        context.canToggle = "Equipado" in item.system;
       
    }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    // Finally, create the item!
    return await Item.create(itemData, {parent: this.actor});
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
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

    /**
 * Override getRollData() that's supplied to rolls.
 */

  

}
	

