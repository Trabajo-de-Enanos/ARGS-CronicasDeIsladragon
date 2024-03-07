export const ARGS = {};




ARGS.CAPACIDAD_APRENDER = {
	1: { cant: 15},
	2: { cant: 10},
	3: { cant: 8},
	4: { cant: 5},
	5: { cant: 4}
	
  }; 
  ARGS.DEVOCION = {
	1: { devpoints: 4, ptosmagiaex:4},
	2: { devpoints: 2, ptosmagiaex:2},
	3: { devpoints: 0, ptosmagiaex:0}
  }; 

  /* -------------------------------------------- */
/** Tamaño Tokens */
ARGS.tamanioToken = {
	Diminuto: 0.5,
	Pequeño: 1,
	Mediano: 1,
	Grande: 2,
	Enorme: 3,
	Gigantezco: 4
  };

ARGS.nivelBestiario = {
	menor: "ARGS.npcmonstruo.nivel.menor",
	normal: "ARGS.npcmonstruo.nivel.normal", 
	fuerte: "ARGS.npcmonstruo.nivel.fuerte",
	excepcional: "ARGS.npcmonstruo.nivel.excepcional",
	legendario: "ARGS.npcmonstruo.nivel.legendario",
}

/* --------------------- */
ARGS.tipoVehic = {
	tierra: "ARGS.vehiculos.tierra",
	aire: "ARGS.vehiculos.aire",
	agua: "ARGS.vehiculos.agua",
  };
ARGS.tamanioVehic = {
	Pequenio: "ARGS.vehiculos.pequenio",
	Mediano: "ARGS.vehiculos.mediano",
	Grande: "ARGS.vehiculos.grande",
  };
ARGS.configVehiculos={
	tierraPequenio: {label: "ARGS.vehiculos.tierrapeq", pht_pv: 175, pht_bod: 500, pht_trip:1 ,pht_pas:2 ,pht_mov:4 },
	tierraMediano: {label: "ARGS.vehiculos.tierramed", pht_pv: 350, pht_bod: 1000, pht_trip:1 ,pht_pas:4 ,pht_mov:4 },
	tierraGrande: {label: "ARGS.vehiculos.tierragran", pht_pv: 525, pht_bod: 1500, pht_trip:2 ,pht_pas:8 ,pht_mov:4 },
	airePequenio: {label: "ARGS.vehiculos.airepeq", pht_pv: 1500, pht_bod: 1500, pht_trip: 2,pht_pas: 8,pht_mov:2 },
	aireMediano: {label: "ARGS.vehiculos.airemed", pht_pv: 4000, pht_bod: 3500, pht_trip: 4,pht_pas: 16,pht_mov:4},
	aireGrande: {label: "ARGS.vehiculos.airegran", pht_pv: 8000, pht_bod: 5000, pht_trip: 9,pht_pas: 40,pht_mov:8 },
	aguaPequenio: {label: "ARGS.vehiculos.aguapeq", pht_pv: 1500, pht_bod: 1500, pht_trip:2 ,pht_pas:8 ,pht_mov:2 },
	aguaMediano: {label: "ARGS.vehiculos.aguamed", pht_pv: 4000, pht_bod: 3500, pht_trip:4 ,pht_pas: 16,pht_mov:4 },
	aguaGrande: {label: "ARGS.vehiculos.aguagran", pht_pv: 8000, pht_bod: 5000, pht_trip:9 ,pht_pas: 40,pht_mov:8 }	
}

/**
 * Compendium packs used for localized items.
 * @enum {string}
 */
ARGS.sourcePacks = {
	HABILIDADES: "ARGS.habilidades"
  };
  
  /* -------------------------------------------- */

/*
ARGS.caracteristicas = {
	"destreza": "ARGS.caracteristicas.destreza",
	"fuerza": "ARGS.caracteristicas.fuerza",
	"intuicion": "ARGS.caracteristicas.intuicion",
	"carisma":"ARGS.caracteristicas.carisma",
	"habilidad": "ARGS.caracteristicas.habilidad",
	"constitucion": "ARGS.caracteristicas.constitucion",
	"cultura": "ARGS.caracteristicas.cultura",
	"movimiento":"ARGS.caracteristicas.movimiento"
};
*/
ARGS.clases= {
	nada: "",
	guerrero: "ARGS.clases.guerrero",
	luchador: "ARGS.clases.luchador",
	guardian: "ARGS.clases.guardian",
	bribon: "ARGS.clases.bribon",
	explorador: "ARGS.clases.explorador",
	adiestrador: "ARGS.clases.adiestrador",
	comerciante: "ARGS.clases.comerciante",
	navegante: "ARGS.clases.navegante",
	mosquetero: "ARGS.clases.mosquetero",
	aprendizconjurador: "ARGS.clases.aprendizconjurador",
	mago: "ARGS.clases.mago",
	hechicero: "ARGS.clases.hechicero",
	sacerdote: "ARGS.clases.sacerdote",
	brujo: "ARGS.clases.brujo",
	paladin: "ARGS.clases.paladin",
	druida: "ARGS.clases.druida",
	monjeguerrero: "ARGS.clases.monjeguerrero",
	magosangre: "ARGS.clases.magosangre",
	artesanoarmero: "ARGS.clases.artesanoarmero",
	artesanococinero: "ARGS.clases.artesanococinero",
	artesanoartista: "ARGS.clases.artesanoartista",
	eruditomedico: "ARGS.clases.eruditomedico",
	eruditodiplomatico: "ARGS.clases.eruditodiplomatico",
	eruditoalquimista: "ARGS.clases.eruditoalquimista",
	ingenieronaval: "ARGS.clases.ingenieronaval",
	ingenieromilitar: "ARGS.clases.ingenieromilitar",
	ingenieroarquitecto: "ARGS.clases.ingenieroarquitecto"
	}
ARGS.periciascombate={
	"nada":"",
	"adosmanos": "ARGS.pericias.combate.adosmanos",
	"armaslargas": "ARGS.pericias.combate.armaslargas",
	"blancascortas": "ARGS.pericias.combate.blancascortas",
	"espadas": "ARGS.pericias.combate.espadas",
	"hachasymazas": "ARGS.pericias.combate.hachasymazas",
	"proyectiles": "ARGS.pericias.combate.proyectiles",
	"pelea":"ARGS.pericias.combate.pelea"	
},
ARGS.tiposAtaque = {
	nada:"",
	adosmanos: "ARGS.ataque.adosmanos",
	armaslargas: "ARGS.ataque.armaslargas",
	blancascortas: "ARGS.ataque.blancascortas",
	espadas: "ARGS.ataque.espadas",
	hachasymazas: "ARGS.ataque.hachasymazas",
	proyectiles: "ARGS.ataque.proyectiles",
	artilleria: "ARGS.ataque.artilleria",
	pelea:"ARGS.ataque.pelea"	
},
ARGS.tipoCalidad = {
	inferior: "ARGS.calidad.inferior",
	normal: "ARGS.calidad.normal",
	superior: "ARGS.calidad.superior"
},
ARGS.tipoHabilidad = {
	Pasiva: "ARGS.habilidades.Pasiva",
	Combate: "ARGS.habilidades.Combate",
	Campamento: "ARGS.habilidades.Campamento",
	Otros: "ARGS.habilidades.Otros"
}
ARGS.stats = { 
	armaslargas:"Armas Largas"
},
ARGS.armas = {
	espada:"Espada"
},
ARGS.dadodenominacion = {/* ["d2","d4", "d6", "d8", "d10", "d12","d16","d20"],*/
	d2: "d2",
	d3: "d3",
	d4: "d4",
	d5: "d5",
	d6: "d6",
	d8: "d8",
	d10: "d10",
	d12: "d12",
	d16: "d16",
	d20: "d20",
	d100: "d100"
},

ARGS.nivelhechizo = {
	1: "1",
	2: "2",
	3: "3",
	4: "4",
	5: "5",
	6: "6",
	7: "7",
	8: "8",
	9: "9",	
},
ARGS.tiposConsumibles = {
	nada:"",
	alimentos: "ARGS.consumible.alimentos",
	tabacos: "ARGS.consumible.tabacos",
	hierbascurativas: "ARGS.consumible.hierbascurativas",
	antidotos: "ARGS.consumible.antidotos",
	hierbassensoriales: "ARGS.consumible.hierbassensoriales",
	pociones: "ARGS.consumible.pociones",
	venenos:"ARGS.consumible.venenos"	,
	municiones:"ARGS.consumible.municiones",
	otros: "ARGS.consumible.otros"
},
ARGS.tiposInvCentro = { 
	armas : "ARGS.inventarioCentro.armas",
	armaduras : "ARGS.inventarioCentro.armaduras",
	equipaje : "ARGS.inventarioCentro.equipaje",
	equipamiento : "ARGS.inventarioCentro.equipamiento",
	consumibles : "ARGS.inventarioCentro.consumibles"
},
ARGS.tiposEquipamiento = {
	nada:"",
	indumentaria: "ARGS.equipamiento.indumentaria",
	herramientas: "ARGS.equipamiento.herramientas",
	almacenamiento: "ARGS.equipamiento.almacenamiento",
	luminarias: "ARGS.equipamiento.luminarias",
	varios: "ARGS.equipamiento.varios"
},
ARGS.estadoconsumible = {
	nada: "",
	preparado:"ARGS.consumible.preparado",
	sinpreparar:"ARGS.consumible.sinpreparar"
},
ARGS.caracteristicas = {
	destreza: "ARGS.caracteristicas.destreza",
	fuerza: "ARGS.caracteristicas.fuerza",
	intuicion: "ARGS.caracteristicas.intuicion",
	carisma:"ARGS.caracteristicas.carisma",
	habilidad: "ARGS.caracteristicas.habilidad",
	constitucion: "ARGS.caracteristicas.constitucion",
	cultura: "ARGS.caracteristicas.cultura",
	movimiento:"ARGS.caracteristicas.movimiento"
},
ARGS.escuelas = {
	none: "",
	llamamiento: "ARGS.magia.escuelas.llamamiento",
	canalizacion: "ARGS.magia.escuelas.canalizacion",
	enmascaramiento: "ARGS.magia.escuelas.enmascaramiento",
	alteracion: "ARGS.magia.escuelas.alteracion",
	revelacion: "ARGS.magia.escuelas.revelacion",
	enlace: "ARGS.magia.escuelas.enlace",
	resguardo: "ARGS.magia.escuelas.resguardo",
	paladin: "ARGS.magia.escuelas.paladin",
	monjeguerrero: "ARGS.magia.escuelas.monjeguerrero",
	magosangre: "ARGS.magia.escuelas.magosangre",
	druida: "ARGS.magia.escuelas.druida",
}

ARGS.lengnivel = {
	1: "ARGS.lenguajes.nivel1",
	2: "ARGS.lenguajes.nivel2",
	3: "ARGS.lenguajes.nivel3",
}

ARGS.varios = {
	dadosuerted2: "Dado Suerte d2",
	dadosuerted4: "Dado Suerte d4",
	dadosuerted6: "Dado Suerte d6"
},
ARGS.pericias = {
		combate: {
		adosmanos:"ARGS.pericias.combate.adosmanos",
		armaslargas:"",
		blancascortas:"",
		espadas:"",
		hachasymazas:"",
		proyectiles:"",
		pelea:""
		},
	movimiento:"",
	atraparylanzar:"",
	correr:"",
	montar:"",
	nadar:"",
	saltar:"",
	sigiloyesconderse:"",
	trepar:"",
	estaticas:"",
	conexionanimal:"",
	dispositivomanual:"",
	manufactura:"",
	nudosysogas:"",
	prestidigitacion:"",
	interaccion:"",
	persuadir:"",
	encontrartrampas:"",
	supervivencia:"",
	seduccion:"",
	conocimiento:"",
	conocnaturaleza:"",
	conocisladragon:"",
	cocinaherboristeria:"",
	primerosauxilios:"",
	extras:"",
	periciaextra1:"",
	periciaextra2:"",
	periciaextra3:"",
	combinadas:"",
	percepcion:"",
	reflejos:"",
	resistencia:""
			
},
ARGS.actorSizes = {
	dim: "ARGS.SizeDiminuto",
	peq: "ARGS.SizePequeño",
	med: "ARGS.SizeMediano",
	gran: "ARGS.SizeGrande",
	enor: "ARGS.SizeEnorme",
	gig: "ARGS.SizeGigantezco"
  },
  
  ARGS.tokenSizes = {
	dim: 0.5,
	pequ: 1,
	med: 1,
	gran: 2,
	enor: 3,
	gig: 4
  }

ARGS.religionspell = {
	none: "",
	fuego:"ARGS.hechizos.fuego",
	agua:"ARGS.hechizos.agua",
	tierra:"ARGS.hechizos.tierra",
	metal:"ARGS.hechizos.metal",
	naturaleza:"ARGS.hechizos.naturaleza",
	aire:"ARGS.hechizos.aire",
	arkana:"ARGS.hechizos.arkana",
	
	
}

ARGS.monedas = {
	MO: {
	  label: "ARGS.monedas.monedasMO",
	  abreviacion: "ARGS.monedas.monedasabreMO",
	  conversion: 1
	},
	MP: {
	  label: "ARGS.monedas.monedasMP",
	  abreviacion: "ARGS.monedas.monedasabreMP",
	  conversion: 10
	},
	MB: {
	  label: "ARGS.monedas.monedasMB",
	  abreviacion: "ARGS.monedas.monedasabreMB",
	  conversion: 100
	},
	JY: {
	  label: "ARGS.monedas.monedasJY",
	  abreviacion: "ARGS.monedas.monedasabreJY",
	  conversion: 1
	}
  };
  //preLocalize("monedas", { keys: ["label", "abreviacion"] });

