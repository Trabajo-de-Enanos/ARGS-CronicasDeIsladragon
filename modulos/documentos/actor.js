

/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class ARGSActor extends Actor {

    /** @override */
    prepareData() {
      // Prepare data for the actor. Calling the super version of this executes
      // the following, in order: data reset (to clear active effects),
      // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
      // prepareDerivedData().
      super.prepareData();
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
  
      if (data.type === "aventurero") {
        prototypeToken.sight.enabled = true;       
        prototypeToken.actorLink = true;
      }
      if (data.type === "monstruo") {
        
        const size = CONFIG.ARGS.tamanioToken[this.system.tamanio || "Mediano"];        
      
      if ( !foundry.utils.hasProperty(data, "prototypeToken.width") ) prototypeToken.width = size;
      if ( !foundry.utils.hasProperty(data, "prototypeToken.height") ) prototypeToken.height = size;
      }
      if (data.type === "npc") {
        const size = CONFIG.ARGS.tamanioToken[this.system.tamanio || "Mediano"];        
      if ( !foundry.utils.hasProperty(data, "prototypeToken.width") ) prototypeToken.width = size;
      if ( !foundry.utils.hasProperty(data, "prototypeToken.height") ) prototypeToken.height = size;
      }
  
      this.updateSource({prototypeToken});
    }
    
    async getEnrichedDescription() {
      return await TextEditor.enrichHTML(
        this.system.description.value,
        {
          rollData: context.rollData,
          async: true,
        }
      );
    }
	/* -------------------------------------------- */
	/*  Methods                                     */
	/* -------------------------------------------- */
  
	async addEspecie(item) {    

    const actorData = this;
    //const systemdata = actorData.system;
    //const itemsActor = actorData.items

    if ( actorData.system.especie !== null ){// &&  actorData.system.especieflag === false){
      await this.update({ "system.especieflag" : true }); // Para que no entre en funcion que llame a insertar en hoja aventurero.
      this.update({"system.especie": item.uuid}); // Ya lo seteo en select pero si es por drop que lo setee.
      
      //Borra especie si hay para no mezclar.         
      this.EspecieDelete();
      
     // inerta item especie nuevo.      
     await actorData.createEmbeddedDocuments('Item', [item.toObject()]);
     await this.LenguajeAgregar(item);
                
      
    }
    else if ( actorData.system.especie === ""){ //en caso de Drop char 0km
      await this.update({ "system.especieflag" : true });
      await this.update({"system.especie": item.uuid});
      actorData.createEmbeddedDocuments('Item', [item.toObject()]);
      
    }    
	}

	async addClase(item) {
    const actorData = this;
    const systemdata = actorData.system;
    const itemsActor = actorData.items
    
    if ( actorData.system.clase !== "" ){//  && actorData.system.claseflag === false) {
     await this.update({ "system.claseflag" : true });
      this.update({"system.clase": item.uuid});
      
    const itemIds = this.itemTypes.clases.map(i => i.id);
    this.deleteEmbeddedDocuments("Item", itemIds);   
    
   await actorData.createEmbeddedDocuments('Item', [item.toObject()]);
          
          if (item.name === "Adiestrador") {           
            this.update({ "system.esAdiestrador" : true });            
          }
          else {
            this.update({ "system.esAdiestrador" : false });            
          }    
    
   
    if(item.system.inventario !== ""){
      for (const idItemClase of item.system.inventario) { // buscar declaracion habilidadItems
        let itemClase= await fromUuid(idItemClase);                
        actorData.createEmbeddedDocuments('Item', [itemClase.toObject()]);
        
        }
      }
      if(item.system.habilidades !== ""){
        for (const idHabsClase of item.system.habilidades) { // buscar declaracion habilidadItems
          let habsClase= await fromUuid(idHabsClase);          
          actorData.createEmbeddedDocuments('Item', [habsClase.toObject()]);
          }
        }  
        // Agrega dados suerte y logica de clase.   
        await this.update({ "system.dadosespeciales.puntoSuerted22" : item.system.especiales.puntosuerted2  });
        await this.update({ "system.dadosespeciales.puntoSuerted42" : item.system.especiales.puntosuerted4  });
        await this.update({ "system.dadosespeciales.puntoSuerted62" : item.system.especiales.puntosuerted6  });  
    
    if (item.system.especiales.puntoslogicad41 === true) {
      if(actorData.system.dadosespeciales.puntosLogicad41 === false){
        await this.update({ "system.dadosespeciales.puntosLogicad41" : item.system.especiales.puntoslogicad41 });
      }
      else if (actorData.system.dadosespeciales.puntosLogicad42 === false) {
        await this.update({ "system.dadosespeciales.puntosLogicad42" : item.system.especiales.puntoslogicad41 });
      }
      else {
        ui.notifications.warn(game.i18n.localize("ARGS.infotexto.dadologicafull"))
      }
    }
    if (item.system.especiales.puntoslogicad42 === true) {
      if (actorData.system.dadosespeciales.puntosLogicad42 === false) {
        await this.update({ "system.dadosespeciales.puntosLogicad42" : item.system.especiales.puntoslogicad42 });
      }
      else {
        ui.notifications.warn(game.i18n.localize("ARGS.infotexto.dadologicafull"))
      }
      }
         
    }
    else if (actorData.system.clase === ""){ //en caso de Drop char 0km
      await this.update({ "system.claseflag" : true });
      await this.update({"system.clase": item.uuid});
      actorData.createEmbeddedDocuments('Item', [item.toObject()]);
      if(item.system.inventario !== ""){
        for (const idItemClase of item.system.inventario) { // buscar declaracion habilidadItems
          let itemClase= await fromUuid(idItemClase);          
          actorData.createEmbeddedDocuments('Item', [itemClase.toObject()]);
          }
        }
        
        if(item.system.habilidades !== ""){
          for (const idHabsClase of item.system.habilidades) { // buscar declaracion habilidadItems
            let habsClase= await fromUuid(idHabsClase);          
            actorData.createEmbeddedDocuments('Item', [habsClase.toObject()]);
            }
          }
          
       // Agrega dados suerte y logica de clase.   
     
    if (item.system.especiales.puntoslogicad41 === true) {
      if(actorData.system.dadosespeciales.puntosLogicad41 === false){
        await this.update({ "system.dadosespeciales.puntosLogicad41" : item.system.especiales.puntoslogicad41 });
      }
      else if (actorData.system.dadosespeciales.puntosLogicad42 === false) {
        await this.update({ "system.dadosespeciales.puntosLogicad42" : item.system.especiales.puntoslogicad41 });
      }
      else {
        ui.notifications.warn(game.i18n.localize("Espacio de Dado de Logica Ocupado"))
      }
    }
    if (item.system.especiales.puntoslogicad42 === true) {
      if (actorData.system.dadosespeciales.puntosLogicad42 === false) {
        await this.update({ "system.dadosespeciales.puntosLogicad42" : item.system.especiales.puntoslogicad42 });
      }
      else {
        ui.notifications.warn(game.i18n.localize("Espacio de Dado de Logica Ocupado"))
      }
      }
   }
    
    
    else if (actorData.system.clase === "" & actorData.system.claseflag === false){ //en caso de Drop char 0km
      const itemIds = this.itemTypes.clases.map(i => i.id);   
    this.deleteEmbeddedDocuments("Item", itemIds);   
    }
	}
  

  async ClaseDelete(){
    const itemIds = this.itemTypes.clases.map(i => i.id);
    this.deleteEmbeddedDocuments("Item", itemIds);   
  }

  async EspecieDelete(){    
    const itemIds =  this.itemTypes.especie.map(i => i.id);          
    this.deleteEmbeddedDocuments("Item", itemIds);
    //const lengIds = await this.itemTypes.lenguajes.map(i => i.id);
    //this.deleteEmbeddedDocuments("Item", lengIds);      
  }
 
  async LenguajeAgregar(item){     
  const lenguajesIds = this.itemTypes.lenguajes.map(i => i.id);
    await this.deleteEmbeddedDocuments("Item", lenguajesIds);   
      for (const idLeng of item.system.lenguajesesp) { // buscar declaracion habilidadItems
        let itemLeng= await fromUuid(idLeng);
        await this.createEmbeddedDocuments('Item', [itemLeng.toObject()]); 
        this._updateLangCost();      
      }   
             
  }

  async _updateLangCost(){
    const itemIds = await this.itemTypes.lenguajes.map(i => i.id); 
    for (const idLenginv of itemIds){
    const item = await this.getEmbeddedDocument("Item", idLenginv);

    const dataUpdate = {
      _id : idLenginv,
      // "system.costo": 0,
      "system.natal": 1,
      "system.nivel": 1,
    }
    
    this.updateEmbeddedDocuments("Item",[dataUpdate]);  
    }
  }

  async addHabilidad(item) {
    
    let habilidadEncontrada = false;
    for (const habilidad of await this.habilidadItems()) {      
			if (habilidad.uuid === item.uuid) {        
				habilidadEncontrada = true;
				break;
			}
		}

		if (!habilidadEncontrada) {
			const currentHabilidades = this.system.habilidades;
			currentHabilidades.push(item.uuid);
			this.update({"system.habilidades": currentHabilidades});
      let habDrop= await fromUuid(item.uuid); 
      this.createEmbeddedDocuments('Item', [habDrop.toObject()]);
		}
    

    //const currentHabilidades = this.system.habilidades;
    //currentHabilidades.push(item.uuid)
		//this.update({"system.habilidades": currentHabilidades});
	}
  async habilidadItems() {
		const habilidadItems = [];

		for (const uuid of this.system.habilidades ?? []) {
			habilidadItems.push(await fromUuid(uuid));           
		}

    for (const idHabsClase of this.system.habilidades) { // buscar declaracion habilidadItems
      let habsClase= await fromUuid(idHabsClase);          
    //  this.createEmbeddedDocuments('Item', [habsClase.toObject()]);
      }
		return habilidadItems.sort((a, b) => a.name.localeCompare(b.name));
	}
	
    /** @override */
    prepareBaseData() {
      // Data modifications in this step occur before processing embedded
      // documents or derived data.
      
    }
  
    /**
     * @override
     * Augment the basic actor data with additional dynamic data. Typically,
     * you'll want to handle most of your calculated/derived data in this step.
     * Data calculated in this step should generally not exist in template.json
     * (such as ability modifiers rather than ability scores) and should be
     * available both inside and outside of character sheets (such as if an actor
     * is queried and has a roll executed directly from it).
     */
    prepareDerivedData() {
      const actorData = this;
      const systemData = actorData.system;
      const flags = actorData.flags.ARGS || {};
  
      // Make separate methods for each Actor type (character, npc, etc.) to keep
      // things organized.
      this._prepareAventureroData(actorData);
      this._prepareNpcData(actorData);
      //this._prepareMonstruoData(actorData);
      //this._prepareVehiculoData(actorData);
      //this._prepareMonturasData(actorData);
      
      
    }

    
/**
 * Prepare Character type specific data
 */
_prepareAventureroData(actorData) {
    if (actorData.type !== 'aventurero') return;
  
    // Make modifications to data here. For example:
    const systemData = actorData.system;
    const itemsActor = actorData.items;   // items
       //DATOS CLASE y ESPECIE.
       const myMapClase = new Map(); //bonos items pericias Clase
       const myMapClaseIni = new Map(); //puntos categorias pericias iniciales de Clase
       const myMapEspecie = new Map(); //bonos pericias Especie
       const myMapEspecieStats = new Map(); //bonos a caracteristicas Especie.
    let FlagPericia1 = 0; //Flag Pericias especiales de Clases.
    let FlagPericia2 = 0; //Flag Pericias especiales de Clases.
    let bonusPEx1 = 0; // Bono Pericias especiales de Clases.
    let bonusPEx2 = 0; // Bono Pericias especiales de Clases.
    let conjhab1="";
    let conjhab2="";
    let periciaLvl=0;
    let peleaPericias = [] ;
    systemData.esConjurador = false; //

    //ITERA ITEMS PARA VER CLASE y ESPECIE:
    for (const i of itemsActor){          
          if (i.type === 'clases') {
            for (let [keyc, catpericia] of Object.entries(i.system.periciasentrena)) {
              let categoperent = keyc; //combate movimiento etc              
              //const Clase = i.
              for (let [key, periciaent] of Object.entries(eval(`i.system.periciasentrena.${categoperent}`))) {
                
                myMapClase.set(key,periciaent);
              }               
            } // fin pericias entrenamiento
            for (let [keyc, catpericiaini] of Object.entries(i.system.periciasinicial)) {
               myMapClaseIni.set(keyc,catpericiaini);               
            }
            
            if(i.system.conjurador === true ){
              systemData.esConjurador = true;              
              conjhab1 = i.system.stats.primaria;
              conjhab2 = i.system.stats.secundaria;
              systemData.calculados.bonoclase=i.system.especiales.bonifconjurar;
              systemData.CPrimeraEscuela=i.system.escuelas.primera;
              systemData.CSegundaEscuela=i.system.escuelas.segunda;
              systemData.CTerceraEscuela=i.system.escuelas.tercera;
              systemData.CCuartaEscuela=i.system.escuelas.cuarta;
            }
            else {
              systemData.esConjurador = false;
              conjhab1 ="";
              conjhab2 ="";
            }
            

            // Pericias Expertos
            
            if (i.system.especiales.especial1.name !== ""){              
              FlagPericia1=1;              
              systemData.pericias.clase.periciaclase1.nombre = i.system.especiales.especial1.name;
              systemData.pericias.clase.periciaclase1.bonopericia = i.system.especiales.especial1.value;
              systemData.pericias.clase.periciaclase1.pericia = i.system.especiales.especial1.pericia;               
            }

            if (i.system.especiales.especial2.name !== ""){
              FlagPericia2=1;               
                systemData.pericias.clase.periciaclase2.nombre =  i.system.especiales.especial2.name;
                systemData.pericias.clase.periciaclase2.bonopericia = i.system.especiales.especial2.value;
                systemData.pericias.clase.periciaclase2.pericia = i.system.especiales.especial2.pericia;                                   
            }           
          }
          if (i.type === 'especie') {
            
            for (let [keyc, catpericia] of Object.entries(i.system.periciasadol)) {
              let categoperent = keyc; //combate movimiento etc              
              //const Clase = i.
              
              for (let [key, periciaent] of Object.entries(eval(`i.system.periciasadol.${categoperent}`))) {
                
                myMapEspecie.set(key,periciaent);
              }  // fin pericias adolescencia
            }
            
            // bonos a Caracteristicas.
            for (let [key,caract] of Object.entries(i.system.caracteristicas)) {
               let caracteristica = key;
               myMapEspecieStats.set(key,caract);
            }

            if (i.system.especie.periciasextra.periciaextra1.nombre !== null) {                    
              systemData.pericias.especie.periciaespecie1.nombre = i.system.especie.periciasextra.periciaextra1.nombre;
              systemData.pericias.especie.periciaespecie1.bonopericia = i.system.especie.periciasextra.periciaextra1.valor;
              systemData.pericias.especie.periciaespecie1.pericia = i.system.especie.periciasextra.periciaextra1.habilidad;              
            }
            if (i.system.especie.periciasextra.periciaextra2.nombre !== null) { 
              systemData.pericias.especie.periciaespecie2.nombre = i.system.especie.periciasextra.periciaextra2.nombre;
              systemData.pericias.especie.periciaespecie2.bonopericia = i.system.especie.periciasextra.periciaextra2.valor;
              systemData.pericias.especie.periciaespecie2.pericia = i.system.especie.periciasextra.periciaextra2.habilidad;             
            }  
            if (i.system.especie.periciasextra.periciaextra3.nombre !== null) { 
              systemData.pericias.especie.periciaespecie3.nombre = i.system.especie.periciasextra.periciaextra3.nombre;
              systemData.pericias.especie.periciaespecie3.bonopericia = i.system.especie.periciasextra.periciaextra3.valor;
              systemData.pericias.especie.periciaespecie3.pericia = i.system.especie.periciasextra.periciaextra3.habilidad;
            }
          } // fin especie
        }        
      
            // Caracteristicas y bonos especie.
            for (let [keyc, caract] of Object.entries(systemData.caracteristicas)) {
              const EspBonoCar = myMapEspecieStats.get(keyc) || 0;                           
              caract.final = caract.value + EspBonoCar;
              caract.bono = EspBonoCar; //asigna el valor de bono especie a variable de aventurero.        
            }

            let BonoSSConOA = 0; //Constitucion OA
            let BonoSSConCA = 0; //Constitucion Cat Armadura
            let bonoSSConRM = 0; // Constitucion Resistencia Magica
            let BonoSSIntOA = 0;  // Intuicion OA
            let BonoSSCulOA = 0;  // Cultura OA
            let BonoSSFueBO = 0; // Fuerza golpe
            let BonoSSCarOA = 0; // Carisma OA
            let BonoSSCarRM = 0; // Carisma Resistencia Magica
            let BonoSSDesMV = 1; // Destreza mov
           
            // Caracteristicas Stats superiores:
            actorData.system.caracteristicas.destreza.finalss = actorData.system.caracteristicas.destreza.final;
            actorData.system.caracteristicas.habilidad.finalss = actorData.system.caracteristicas.habilidad.final;
            actorData.system.caracteristicas.fuerza.finalss = actorData.system.caracteristicas.fuerza.final;
            actorData.system.caracteristicas.constitucion.finalss = actorData.system.caracteristicas.constitucion.final;
            actorData.system.caracteristicas.intuicion.finalss = actorData.system.caracteristicas.intuicion.final;
            actorData.system.caracteristicas.cultura.finalss = actorData.system.caracteristicas.cultura.final;
            actorData.system.caracteristicas.carisma.finalss = actorData.system.caracteristicas.carisma.final;

            if(actorData.system.caracteristicas.destreza.final === 6) { actorData.system.caracteristicas.destreza.finalss = 7;}            
            if(actorData.system.caracteristicas.destreza.final === 7) { actorData.system.caracteristicas.destreza.finalss = 9;BonoSSDesMV=2;}
            if(actorData.system.caracteristicas.destreza.final >= 8) { actorData.system.caracteristicas.destreza.finalss = 11;BonoSSDesMV=3;}

            if(actorData.system.caracteristicas.habilidad.final === 6) { actorData.system.caracteristicas.habilidad.finalss = 7}            
            if(actorData.system.caracteristicas.habilidad.final === 7) { actorData.system.caracteristicas.habilidad.finalss = 9}
            if(actorData.system.caracteristicas.habilidad.final >= 8) { actorData.system.caracteristicas.habilidad.finalss = 11}

            if(actorData.system.caracteristicas.fuerza.final === 6) { BonoSSFueBO = 2}            
            if(actorData.system.caracteristicas.fuerza.final === 7) { BonoSSFueBO = 4}
            if(actorData.system.caracteristicas.fuerza.final >= 8) { BonoSSFueBO = 4}
            
            if(actorData.system.caracteristicas.constitucion.final === 6) {BonoSSConOA = 2;bonoSSConRM=1;}            
            if(actorData.system.caracteristicas.constitucion.final === 7) {BonoSSConOA = 4; BonoSSConCA=1;bonoSSConRM=2;}
            if(actorData.system.caracteristicas.constitucion.final >= 8) {BonoSSConOA = 6; BonoSSConCA=2;bonoSSConRM=4;}

            if(actorData.system.caracteristicas.intuicion.final === 6) { actorData.system.caracteristicas.intuicion.finalss = 7;BonoSSIntOA = 1;}            
            if(actorData.system.caracteristicas.intuicion.final === 7) { actorData.system.caracteristicas.intuicion.finalss = 9;BonoSSIntOA = 2;}
            if(actorData.system.caracteristicas.intuicion.final >= 8) { actorData.system.caracteristicas.intuicion.finalss = 12;BonoSSIntOA =3;}

            if(actorData.system.caracteristicas.cultura.final === 6) { actorData.system.caracteristicas.cultura.finalss = 7;BonoSSCulOA=1;}            
            if(actorData.system.caracteristicas.cultura.final === 7) { actorData.system.caracteristicas.cultura.finalss = 9;BonoSSCulOA=2;}
           
            if(actorData.system.caracteristicas.cultura.final >= 8) {
                  BonoSSCulOA=3; 
                                               
                this._enAgregarDadoLogica();
            } //fin cultura 8
             
            if(actorData.system.caracteristicas.carisma.final === 6) { actorData.system.caracteristicas.carisma.finalss = 7;BonoSSCarOA = 1;BonoSSCarRM=1;}            
            if(actorData.system.caracteristicas.carisma.final === 7) { actorData.system.caracteristicas.carisma.finalss = 9;BonoSSCarOA = 2;BonoSSCarRM=2;}
            if(actorData.system.caracteristicas.carisma.final >= 8) {BonoSSCarOA = 3; BonoSSCarRM = 4;
            
              }
  
   
    if(systemData.esConjurador === true ){
      const primaria = `systemData.caracteristicas.${conjhab1}.finalss`;
      const secundaria = `systemData.caracteristicas.${conjhab2}.finalss`;                    
      systemData.calculados.conjurar.primaria = eval(`${primaria}`);
      systemData.calculados.conjurar.secundaria = eval(`${secundaria}`); 
      systemData.calculados.conjurar.value = systemData.calculados.conjurar.primaria  + systemData.calculados.conjurar.secundaria + systemData.calculados.bonoclase + systemData.calculados.conjurar.extra;   
      systemData.calculados.conjurar.penalizaRM = bonoSSConRM + BonoSSCarRM;
      
    } // fin es conjurador
    


   //Prepara almacenamiento gratis:
   systemData.calculados.cargaalmacenaje.max = systemData.calculados.cargaalmacenaje.gratis;
    // Loop through ability scores, and add their modifiers to our sheet output.
    //for (let [key, caracteristica] of Object.entries(systemData.caracteristicas)) {
      // Calculate the modifier using d20 rules.
   // caracteristica.mod = Math.floor((caracteristica.value - 10) / 2);
    //}
    // Toma los valores de las stats para luego hacer calculados:
    const destrezaval = actorData.system.caracteristicas.destreza.finalss;
    const constitucionval = actorData.system.caracteristicas.constitucion.finalss;
    const carismaval = actorData.system.caracteristicas.carisma.finalss;
    const fuerzaval = actorData.system.caracteristicas.fuerza.finalss;
    

    // Calcula Puntos de Vida Maximos (Con * 10)
    systemData.calculados.puntosvidamax = constitucionval * 10; 
		systemData.calculados.puntosvida.max = constitucionval * 10; 

    // Si la destreza es mayor a 3 su movimiento es igual a destreza sino queda minimo 3.
    if (actorData.system.caracteristicas.destreza.final > 3) {
    systemData.caracteristicas.movimiento.final = (destrezaval * BonoSSDesMV) ;
    systemData.caracteristicas.movimiento.value = (destrezaval * BonoSSDesMV);
     } else {
      systemData.caracteristicas.movimiento.final = 3;
      systemData.caracteristicas.movimiento.value = 3;
     }

    // Resistencia a la Magia:
    systemData.calculados.resistenciamagia.final = constitucionval + carismaval + bonoSSConRM + BonoSSCarRM + systemData.calculados.resistenciamagia.bonoEf; 
    systemData.calculados.resistenciamagia.valor = systemData.calculados.resistenciamagia.final;
    // Categoria de Armadura maxima:
    systemData.calculados.catarmadura.final = constitucionval + fuerzaval + BonoSSConCA + systemData.calculados.catarmadura.bonoEf;
    systemData.calculados.catarmadura.valor = systemData.calculados.catarmadura.final;  
    // Optimizacion Armadura:
    systemData.calculados.BO.bonus = BonoSSFueBO;
    systemData.calculados.BD.final = 0;
    systemData.calculados.OA.final = Math.round((destrezaval + fuerzaval) / 2) + BonoSSConOA + BonoSSIntOA + BonoSSCulOA + BonoSSCarOA + systemData.calculados.OA.bonoEf; 
    systemData.calculados.BD.final=  systemData.calculados.OA.final  ;
    
     // Total defensea items -- PARA HACER:
     systemData.calculados.totaldefensa = 0; 
     
     // prepara otros calculados
     systemData.ptosidioma = systemData.caracteristicas.cultura.final;
      // BD:
    //systemData.calculados.BD = actorData.system.calculados.OA + actorData.system.calculados.totaldefensa; 
     // Capacidad de Cargas
     systemData.calculados.cargainventario.max= (actorData.system.caracteristicas.fuerza.final*10) + systemData.calculados.cargaalmacenaje.gratis;
    
     let n=0;
    // devocion:
          //alert($('.checkbox_class_here :checked').size());
      for (let [key, creencia] of Object.entries(systemData.religiones)) {
        // calcular si estan chequeadas en el form
        if (!systemData.rel) {
          systemData.rel = {};
        }
        if(creencia.check===true) {
          creencia.value = 1;
          n=n+1;               
                   
          systemData.rel[n] = key.slice(3);          
         
        }else{creencia.value = 0;}
      }    
      systemData.rel1=systemData.rel[1];
      systemData.rel2=systemData.rel[2];
      systemData.rel3=systemData.rel[3];
      
      Object.entries(systemData.religiones).forEach((entry, index) => {
        const key = entry[0].slice(3);; // property key
        const creencia = entry[1]; // corresponding value 

      });
      
      //if(systemData.religiones.relfuego.check===true) {
        //systemData.religiones.relfuego.value = 1;      }
        systemData.calculados.devocion = 0;
        let devocion = (actorData.system.religiones.relfuego.value+actorData.system.religiones.relagua.value
          +actorData.system.religiones.reltierra.value+actorData.system.religiones.relmetal.value+actorData.system.religiones.relnaturaleza.value
          +actorData.system.religiones.relaire.value+actorData.system.religiones.relarkana.value);
        if(devocion>3) {
          return ui.notifications.error("Maximo 3 Religiones");
        }
       
        const [, bonosDevocion] = Object.entries(CONFIG.ARGS.DEVOCION)
        .reverse().find(([l]) => Number(l) <= devocion) ?? [];
        if ( bonosDevocion ) {
          systemData.calculados.devocion = bonosDevocion.devpoints;
          }

        //Puntos de Magia:
        systemData.calculados.puntosmagia.max = (actorData.system.caracteristicas.cultura.finalss + actorData.system.caracteristicas.intuicion.finalss 
            + actorData.system.caracteristicas.carisma.finalss + systemData.calculados.devocion + actorData.system.calculados.puntosmagia.extra + systemData.calculados.puntosmagia.bonoEf);
          
        //systemData.calculados.puntosmagia.value = systemData.calculados.puntosmagia.max;
          
           
       // Capacidad de Aprendizaje.
        let nivelInt = actorData.system.caracteristicas.intuicion.final;

        const [, aprenderConfig] = Object.entries(CONFIG.ARGS.CAPACIDAD_APRENDER)
         .reverse().find(([l]) => Number(l) <= nivelInt) ?? [];
        if ( aprenderConfig ) {
        systemData.calculados.capacidadaprendizaje.max = aprenderConfig.cant;
        }


        //let expe = actorData.system.calculados.xp.value;
        //if ( actorData.system.calculados.capacidadaprendizaje.max === actorData.system.calculados.capacidadaprendizaje.value  && actorData.system.caracteristicas.intuicion.value > 0 ) {
          //systemData.calculados.xp.value = JSON.parse(expe) + 1 ;
         // actorData.system.calculados.capacidadaprendizaje.value = 0;
        //}
        
       
        //PERICIAS INICIALES
        for (let [key, periciainicial] of Object.entries(systemData.periciasinicial)) { 
          let categoper = key;
          const ClaseIniciales = myMapClaseIni.get(categoper);
          
          periciainicial.value= ClaseIniciales;         

        } 
         // PERICIAS y Avance         
        for (let [keyc, catpericia] of Object.entries(systemData.pericias)) {
               
                let categoper = keyc; //combate movimiento etc
             //   let ClaseIniciales = myMapClaseIni.get(categoper);
               // systemData.periciasinicial.categoper = ClaseIniciales;
                
                for (let [key, pericia] of Object.entries(eval(`systemData.pericias.${categoper}`))) {                  
                  //chequeo avance                                     
                  const ClaseBono = myMapClase.get(key) || 0;
                  const EspecieBono = myMapEspecie.get(key) || 0;                  
                  
                  
                  if (categoper === 'combinadas') { 
                    // ver combinadas
                    const comb1 = `actorData.system.caracteristicas.${pericia.caracteristica1}.finalss` ;
                    const comb2 = `actorData.system.caracteristicas.${pericia.caracteristica2}.finalss` ;
                    let bonusc = Math.round((eval(`${comb1}`) + eval(`${comb2}`) ) / 2);
                    
                    if( !pericia.value && ClaseBono === 0  && EspecieBono === 0) {
                      
                      pericia.final = (-3) + bonusc ;
                      pericia.bonoclase = ClaseBono + EspecieBono;

                    }
                    else {                     
                      pericia.final = pericia.value + bonusc + ClaseBono + EspecieBono + pericia.bonoEf;
                      pericia.bonoclase = ClaseBono + EspecieBono + pericia.bonoEf;
                    };
                  } //fin combinadas
                  else if (categoper !== "extras" && categoper !== "combinadas" && categoper !== "especie" && categoper !== "clase")  {
                  const carac = `actorData.system.caracteristicas.${pericia.caracteristica}.finalss` ;

                  let bonusc = eval(`${carac}`) 
                  
                                 
                  if( !pericia.value && ClaseBono === 0 && EspecieBono === 0) {
                    pericia.final = (-3) + bonusc ;
                    pericia.bonoclase = ClaseBono + EspecieBono;
                    
                  }
                  else {
                    pericia.final = pericia.value + bonusc + ClaseBono + EspecieBono + pericia.bonoEf;
                    pericia.bonoclase = ClaseBono + EspecieBono + pericia.bonoEf;
                    
                      if(categoper==="combate"){
                       peleaPericias.push(pericia.final);
                       let sumaPericias = peleaPericias.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                       let PeleaFinal = Math.round(sumaPericias/peleaPericias.length);                       
                        
                        systemData.calculados.peleafinal = PeleaFinal;

                    
                       }   
                    }
                  } 

                  if (categoper === 'extras') {                                        
                    pericia.final = pericia.bonopericia + pericia.value;                   
                  }
                 
                  if (key === systemData.pericias.clase.periciaclase1.pericia){
                    bonusPEx1 = pericia.final;                    
                  }
                  if (key === systemData.pericias.clase.periciaclase2.pericia){
                    bonusPEx2 = pericia.final;
                  }

                  if (categoper === 'especie' && pericia.pericia !== "") {                                        
                    const carac = `actorData.system.caracteristicas.${pericia.pericia}.finalss` ;                    
                    let bonusc = eval(`${carac}`) 
                    if (pericia.nombre === "Navegar" && systemData.pericias.clase.periciaclase1.nombre === "Navegar" ) {
                      pericia.final = pericia.value + bonusPEx1 + ClaseBono + EspecieBono + pericia.bonopericia + systemData.pericias.clase.periciaclase1.bonopericia ;
                      pericia.bonoclase = ClaseBono + EspecieBono + bonusPEx1 + systemData.pericias.clase.periciaclase1.bonopericia ;                     
                    }
                    //if (pericia.nombre === "Navegar" && systemData.pericias.clase.periciaclase2.nombre === "Navegar" ) {
                      //pericia.final = pericia.value + bonusc + ClaseBono + EspecieBono + pericia.bonopericia + systemData.pericias.clase.periciaclase2.value   + systemData.pericias.clase.periciaclase2.bonopericia ;
                      //pericia.bonoclase = ClaseBono + EspecieBono + bonusc + systemData.pericias.clase.periciaclase2.value + systemData.pericias.clase.periciaclase2.bonopericia ;                     
                    //}
                    else {
                    pericia.final = pericia.value + bonusc + ClaseBono + EspecieBono + pericia.bonopericia + pericia.bonoEf ;
                    pericia.bonoclase = ClaseBono + EspecieBono + bonusc + pericia.bonoEf;
                    }                                 
                  }
                  if (categoper === 'clase'  && pericia.pericia !== "") { 
                    if (pericia.nombre === "Navegar" && systemData.pericias.especie.periciaespecie1.nombre === "Navegar" ) {
                     // pericia.final = pericia.value + bonusc + ClaseBono + EspecieBono + pericia.bonopericia + systemData.pericias.clase.periciaclase1.bonopericia ;
                     // pericia.bonoclase = ClaseBono + EspecieBono + bonusc + systemData.pericias.clase.periciaclase1.bonopericia ;                     
                     //ya esta hecho en especie
                   
                    }
                    
                    else {
                     
                      if (key === "periciaclase1"  ){
                        pericia.final = pericia.value + bonusPEx1  + ClaseBono + EspecieBono + pericia.bonopericia;
                        pericia.bonoclase = ClaseBono + EspecieBono + bonusPEx1 ;                    
                      }
                      if (key === "periciaclase2"  ){
                        pericia.final = pericia.value + bonusPEx2  + ClaseBono + EspecieBono + pericia.bonopericia;
                        pericia.bonoclase = ClaseBono + EspecieBono + bonusPEx2 ; 
                      } 
                    }                                                       

                  }
                 
                  if (pericia.avance === systemData.calculados.capacidadaprendizaje.max && actorData.system.caracteristicas.intuicion.final > 0 ) {
                   
                    let expe = actorData.system.calculados.xp.value;
                    
                    systemData.calculados.xp.value = JSON.parse(expe) + 1 ;
                    
                    //
                    pericia.avance = 0;
                    let periciaLvl = actorData.system.pericias[categoper][key].value + 1 ;
                    //pericia.value = pericia.value +1;  

                    this._subirPericia(categoper,key);
                  // this.update({[`system.pericias.${categoper}.${key}.value`] : Cambio});
                    
                  }
                  else{
                  
                  }
                  
                  
              } // fin loop pericias grupo
              
            } //fin loop pericias
            
            if ( (actorData.system.calculados.xp.value === actorData.system.calculados.xp.max) && actorData.system.caracteristicas.intuicion.value > 0 ) {
                  actorData.system.calculados.xp.leveleo=true;//cartel de leveleo.              
                  actorData.system.calculados.xp.value=0; //xp a 0       
    
                }
     
            for (let [key, caraclvl] of Object.entries(systemData.caracteristicas)) {
              // calcular si estan chequeadas en el form
             
              if(caraclvl.level===true) {
                //caraclvl.mod = 1;
             
                //agrega la hab aprendida el +1
                //caraclvl.value = caraclvl.value + caraclvl.mod;
                //caraclvl.mod = 0 ; 
                //caraclvl.level = false;  
             
                caraclvl.level = false;  
              }else{caraclvl.mod = 0;}
              caraclvl.mod = 0 ; 
              caraclvl.level = false;              
            }    
            // Avance Sistema Conjuracion
            if (actorData.system.calculados.conjurar.avance === systemData.calculados.capacidadaprendizaje.max && actorData.system.caracteristicas.intuicion.final > 0 ) {
                                 
              //reseteo avance conjurar
              this.system.calculados.conjurar.avance = 0;

              //let periciaLvl = actorData.system.pericias[categoper][key].value + 1 ;
              //pericia.value = pericia.value +1;  

              this._subirConjurar();
            }
    
          
  }
 
  
    /* --------------------------------------- */
	/*  Data Preparation Helpers               */
	/* --------------------------------------- */

	async _populateCatalogoItems() {
		this.catalogoItems = {};

		const catalogoItems = [ "clases","especie"]; //"habilidades"
		for (const itemName of catalogoItems) {
			const uuid = this.system[itemName] ?? "";      
			if (uuid !== "" ) {        
				this.catalogoItems[itemName] = await fromUuid(uuid);
			}
		}

    
	}
 
  async _subirPericia(categoper,key){
    let Cambio = this.system.pericias[categoper][key].value + 1;
   // return this.update({[`system.pericias.${categoper}.${key}.value`] : Cambio});    
    this.system.pericias[categoper][key].value += 1;
     // return;
  }
  async _subirConjurar(event){
    let Cambio = this.system.calculados.conjurar.value + 1;
   // return this.update({[`system.pericias.${categoper}.${key}.value`] : Cambio});    
    this.system.calculados.conjurar.extra += 1;
		this.system.calculados.puntosmagia.extra += 2;
     // return;
  }
  /**
 * Prepare NPC type specific data.
 */
_prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;
  
    // Make modifications to data here. For example:
    const systemData = actorData.system;
    systemData.xp = (systemData.cr * systemData.cr) * 100;
  }



  /**
 * Override getRollData() that's supplied to rolls.
 */
getRollData() {
    const data = super.getRollData();
  
    // Prepare character roll data.
    this._getAventureroRollData(data);
    this._getNPCRollData(data);
  
    return data;
  }
  
  /**
   * Prepare character roll data.
   */
  
  async lanzarHechizo(itemId) {
		const item = this.items.get(itemId);

		if (!item) {
			ui.notifications.warn(
				"Item no longer exists",
				{ permanent: false }
			);
			return;
		}				

		let rollType;		
			rollType = item.name.slugify();		

   
  

		const data = {
			rollType,
			item: item,
			actor: this,
			modifConjurar: item.system.modificadorconjuracion,
			conjurar: this.system.calculados.conjurar.value,
		};

		const parts = ["@modifConjurar", "@conjurar"];
    parts.unshift("1d20cs<=0");
		//data.dados = "1d20<=0"; esto va en DadosARGS.
		// TODO: push to parts & for set talentBonus as sum of talents affecting spell rolls

		return item.tirarHechizo(parts, data); //rollSpell
	}

  async tirarAtaque(itemId,opcion) {
		const item = this.items.get(itemId);
		const data = {
			item: item,
			rollType: item.name.slugify(), //ver de ponerle game.i18n.localize(concat.("ARGS.ataque.", " - ", item.system.atacaCon, item.name),
			actor: this,
		};
    if (opcion === "defensa"){
      data.esDefensa = true;
    }
    else if (opcion === "ambidiestro"){
      data.esAmbidiestro = true;
    }

    
		const parts = ["@magiaBonus", "@calidadBonus"]; //["@abilityBonus", "@talentBonus"];
		data.damageParts = [];
		// Bonus de Magia Item
    data.magiaBonus = item.system.bonificadorMagia;
    // BOnus de Calidad Item
    data.calidadBonus = item.system.bonificadorCalidad;
    //superstats
    parts.push("@BO_SuperStat");
    data.BO_SuperStat = data.actor.system.BO.bonus ?? 0;

    //Pericia usada para el arma
    parts.push("@periciaAtaque");
    if (data.esAmbidiestro ===true){ 
      data.periciaAtaque = 0;
    }
    else {
    data.periciaAtaque = eval("data.actor.system.pericias.combate." + data.item.system.atacaCon + ".final");
    }

    parts.push("@dados");
		data.dados = data.item.system.cantdado + data.item.system.danio + "x>=" + data.item.system.critumbral;

		return item.tirarItem(parts, data);
	}


  async tirarAtaqueVehiculo(itemId){
    const item = this.items.get(itemId);
		const data = {
			item: item,
			rollType: "ataquevehiculo", //ver de ponerle game.i18n.localize(concat.("ARGS.ataque.", " - ", item.system.atacaCon, item.name),
			actor: this,
      flagAtaque: 1,
		}; 
    const parts = ["@dados"];    
   
    data.dados = data.item.system.formula;
    return item.tirarItem(parts, data);
  }

  async tirarAtaqueMontura(itemId){
    const item = this.items.get(itemId);
		const data = {
			item: item,
			rollType: item.name.slugify() + game.i18n.localize("ARGS.monturas.ataque"), //ver de ponerle game.i18n.localize(concat.("ARGS.ataque.", " - ", item.system.atacaCon, item.name),
			actor: this,
      flagAtaque: 1,
		}; 
    const parts = ["@pericia","@dados"];    
    data.pericia = data.item.system.pericias.ataque.value;
    data.dados = data.item.system.cantdado + data.item.system.danio + "x>=" + data.item.system.critumbral;
    return item.tirarItem(parts, data);
  }

  async tirarInstintoMontura(itemId){
    const item = this.items.get(itemId);
		const data = {
			item: item,
			rollType: item.name.slugify()+ game.i18n.localize("ARGS.monturas.instinto"), //ver de ponerle game.i18n.localize(concat.("ARGS.ataque.", " - ", item.system.atacaCon, item.name),
			actor: this,
      flagInstinto:1,
		}; 
   const parts = ["@Instinto"];
   //data.roll= "1d10cs<="
   data.Instinto=item.system.pericias.instinto.value;  
    return item.tirarItem(parts, data);
  }
  async tirarDestrezaMontura(itemId){
    const item = this.items.get(itemId);
		const data = {
			item: item,
			rollType: item.name.slugify()+ game.i18n.localize("ARGS.monturas.destreza"), //ver de ponerle game.i18n.localize(concat.("ARGS.ataque.", " - ", item.system.atacaCon, item.name),
			actor: this,
      flagDestreza:1,
		}; 
   const parts = ["@Destreza"];
   //data.roll= "1d10cs<="
   data.Destreza=item.system.pericias.destreza.value;  
    return item.tirarItem(parts, data);
  }
  // Tiradas Resistencia Magica
  async tirarRM(data, options={}){
    data.rollType= 'pericia'; 
    options.speaker = ChatMessage.getSpeaker({ actor: this });
    options.title = game.i18n.localize("ARGS.varios.resistenciamagia");
    
    const parts = ["@periciaFinal"];
    data.periciaFinal = data.resmag;   

    options.dialogTemplate =  "systems/ARGS/templates/partials/magres-roll.hbs";
    options.chatCardTemplate = "systems/ARGS/templates/partials/chat/pericia-card.hbs";
    await CONFIG.DadosARGS.RollDialog(parts, data, options);
  }

  //Tirada Stats Inicial 
  async tirarStats(data,options={}){
    data.rollType= 'statsini'; 
    data.esStats=1;
    options.speaker = ChatMessage.getSpeaker({ actor: this });
    options.title = "Tirada Caracteristicas"; 
    options.dialogTemplate =  "systems/ARGS/templates/apps/stats-pj.hbs";
    options.chatCardTemplate = "systems/ARGS/templates/partials/chat/stats-roll.hbs";
    const parts = ["@statsd4"];
    data.statsd4 = "{10d4, 10d4, 10d4}kh";
    await CONFIG.DadosARGS.RollDialog(parts, data, options);
  }

  //Tiradas Pericias
  async tirarPericia(data, options={}) {
		//data (actor,categoria y pericia)
    data.rollType= 'pericia'; 
    data.esPericia=1;
    options.speaker = ChatMessage.getSpeaker({ actor: this });
    
    if(data.categoria ==="clase" ) {
      options.title = game.i18n.localize('ARGS.pericias.'+data.categoria+".nombre")+" - " + data.actor.system.pericias.clase[data.pericia].nombre;     
    }
    else if(data.categoria ==="especie" ) {
      options.title = game.i18n.localize('ARGS.pericias.'+data.categoria+".nombre")+" - " + data.actor.system.pericias.especie[data.pericia].nombre;     
    }    

    else if(data.categoria ==="extras" ) {
      options.title = game.i18n.localize('ARGS.pericias.'+data.categoria+".nombre")+" - " + data.actor.system.pericias.extras[data.pericia].nombre;     
    }
    else{
      options.title = game.i18n.localize('ARGS.pericias.'+data.categoria+".nombre")+" - " + game.i18n.localize('ARGS.pericias.'+data.categoria+"."+data.pericia );     
    }
    options.flavor=game.i18n.localize('ARGS.infotexto.checkpericia');//options.title;
		

    const parts = ["@periciaFinal"];
		// Valor final de la pericia.
    //data.periciaFinal = data.actor.system[data.pericia].final ;
    if (data.actor.type === "monstruo" || data.actor.type === "npc"){
      data.periciaFinal = data.actor.system.pericias;  
      options.title = game.i18n.localize('ARGS.npcmonstruo.pericias');
    }
    else if (data.actor.type === "animales" ){
      
      if(data.pericia === "pericia-inst" ){
      data.periciaFinal = data.actor.system.destreza;  
      options.title = game.i18n.localize('ARGS.npcmonstruo.pericias') + game.i18n.localize('ARGS.monturas.instinto') ;}
      if(data.pericia === "pericia-des" ){
        data.periciaFinal = data.actor.system.instinto;  
        options.title = game.i18n.localize('ARGS.npcmonstruo.pericias') + game.i18n.localize('ARGS.monturas.destreza');}
    }
    
    else {
    data.periciaFinal = data.actor.system.pericias[data.categoria][data.pericia].final ;
   
    }
    options.dialogTemplate =  "systems/ARGS/templates/partials/dialogo-roll.hbs";
    options.chatCardTemplate = "systems/ARGS/templates/partials/chat/pericia-card.hbs";
    await CONFIG.DadosARGS.RollDialog(parts, data, options);
    //return item.tirarPericia(parts, data);    
	}

   async _enAgregarDadoLogica(){
    if(this.system.dadoextracul === false ){
      if(this.system.dadosespeciales.puntosLogicad41 === false){
        await this.update({ "system.dadoextracul" : true });
        await   this.update({[`system.dadosespeciales.puntosLogicad41`] : true});
        
      }
      else if (this.system.dadosespeciales.puntosLogicad42 === false) {
        await this.update({ "system.dadoextracul" : true });
        await this.update({ "system.dadosespeciales.puntosLogicad42" : true });
       
      }
      else {        
        ui.notifications.warn(game.i18n.localize("ARGS.infotexto.dadologicafull"))
      }
    }
    else{}


    await this.update({ "system.dadoextracul" : true });
  }


  //
  _getAventureroRollData(data) {
    if (this.type !== 'aventurero') return;
    const actorData = this;
    
    if (data.pericias.combate) {
      for (let [k, v] of Object.entries(data.pericias.combate)) {
        data[k] = foundry.utils.deepClone(v);
     }
    }
    if (data.pericias.movimiento) {
      for (let [k, v] of Object.entries(data.pericias.movimiento)) {
        data[k] = foundry.utils.deepClone(v);
     }
    }
    if (data.pericias.estaticas) {
      for (let [k, v] of Object.entries(data.pericias.estaticas)) {
        data[k] = foundry.utils.deepClone(v);
     }
    }
    if (data.pericias.interaccion) {
      for (let [k, v] of Object.entries(data.pericias.interaccion)) {
        data[k] = foundry.utils.deepClone(v);
     }
    }
    if (data.pericias.conocimiento) {
      for (let [k, v] of Object.entries(data.pericias.conocimiento)) {
        data[k] = foundry.utils.deepClone(v);
     }
    }
    if (data.pericias.extras) {
      for (let [k, v] of Object.entries(data.pericias.extras)) {
        data[k] = foundry.utils.deepClone(v);
     }
    }
    if (data.pericias.combinadas) {
      for (let [k, v] of Object.entries(data.pericias.combinadas)) {
        data[k] = foundry.utils.deepClone(v);
     }
    }
    if (data.calculados) {
      for (let [k, v] of Object.entries(data.calculados)) {
        data[k] = foundry.utils.deepClone(v);
     }
    } 
     if (data.caracteristicas) {
      for (let [k, v] of Object.entries(data.caracteristicas)) {
        data[k] = foundry.utils.deepClone(v);
     }
    }
  
    // Add level for easier access, or fall back to 0.
   // if (data.attributes.level) {
     // data.lvl = data.attributes.level.value ?? 0;
   // }
  }

  /**
   * Prepare NPC roll data.
   */
  _getNPCRollData(data) {
    if (this.type !== 'npc') return;
  
    // Process additional NPC data here.
  }




  
} //FIN

 