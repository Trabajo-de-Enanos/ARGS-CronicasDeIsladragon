import { ARGS } from "./modulos/config.js";

import CompendiumsARGS from "./modulos/apps/compendiumsARGS.mjs";
//import ARGSHojaArmas from "./modulos/hojas/ARGSHojaArmas.js";
import ARGSHojaItem from "./modulos/hojas/ARGSHojaItem.js";
import ARGSHojaActor from "./modulos/hojas/ARGSHojaActor.mjs";
import ARGSHojaAventurero from "./modulos/hojas/ARGSHojaAventurero.js";
import ARGSHojaMonstruo from "./modulos/hojas/ARGSHojaMonstruo.mjs";
import ARGSHojaVehiculo from "./modulos/hojas/ARGSHojaVehiculo.mjs";
import { ARGSActor } from "./modulos/documentos/actor.js";
import { ARGSItem } from "./modulos/documentos/item.js";
import UtilsARGS from "./modulos/apps/utilsARGS.mjs";
import ARGSCombate from "./modulos/combate/combate.mjs";
import ARGSCombatiente from "./modulos/combate/combatiente.mjs";
import ARGSCombatTracker from "./modulos/combate/combatTracker.mjs";
import * as chat from "./modulos/apps/_chatmodule.mjs";
import * as dice from "./modulos/dados/_modulo.mjs";

//import ChatMessageHooks from "systems/ARGS/modulos/hooks/chat-messages.mjs";
 import { HooksImmediate } from "./modulos/hooks/hooks.mjs"; //ok

//ChatMessageHooks.attach();


// ASCII Artwork
ARGS.ASCII = `
d8888 8888888b.   .d8888b.   .d8888b.  
d88888 888   Y88b d88P  Y88b d88P  Y88b 
d88P888 888    888 888    888 Y88b.      
d88P 888 888   d88P 888         "Y888b.   
d88P  888 8888888P"  888  88888     "Y88b. 
d88P   888 888 T88b   888    888       "888 
d8888888888 888  T88b  Y88b  d88P Y88b  d88P 
d88P     888 888   T88b  "Y8888P88  "Y8888P"  
										
										
										`;

globalThis.ARGS = {
  compendiums: CompendiumsARGS,
  dice,
  config: ARGS,
  utils: UtilsARGS,
};                    
async function preloadHandlebarsTemplates(){
	const templatePaths=[
		"systems/ARGS/templates/partials/aventurero-stat-block.hbs","systems/ARGS/templates/partials/armas-tarjeta.hbs",

		// Actor Sheet Partials
		"systems/ARGS/templates/partials/aventurero-caracteristicas.hbs",
		"systems/ARGS/templates/partials/aventurero-inventario.hbs",
		"systems/ARGS/templates/partials/aventurero-habilidades.hbs",
		"systems/ARGS/templates/partials/aventurero-grimorio.hbs",
		"systems/ARGS/templates/partials/aventurero-biografia.hbs",
		"systems/ARGS/templates/partials/levelup-card.hbs",
    "systems/ARGS/templates/partials/montura-inv.hbs",
    "systems/ARGS/templates/partials/aventurero-lenguajes.hbs",

    // Item Sheet Partials
    "systems/ARGS/templates/partials/items-descripcion.hbs",
    "systems/ARGS/templates/partials/items-descripcionhechizo.hbs",
    

    // Otros Partials
    "systems/ARGS/templates/partials/selector-items.hbs",
    "systems/ARGS/templates/apps/selector-compendios.hbs",
    "systems/ARGS/templates/partials/selector-opciones.hbs",
    "systems/ARGS/templates/hojas/vehiculo-cargo.hbs",
    "systems/ARGS/templates/partials/npc-conjuros.hbs",
    "systems/ARGS/templates/partials/hechizos-lista.hbs",    
    "systems/ARGS/templates/partials/efectos.hbs"

    
	];
	return loadTemplates(templatePaths);
};



Hooks.once("init",function(){
	console.log(`ARGS | Entrando a Isladragon - ${ARGS.ASCII}`);
  globalThis.ARGS = game.ARGS = Object.assign(
		game.system,
		globalThis.ARGS
	);

	CONFIG.ARGS = ARGS;
	CONFIG.DadosARGS = dice.DadosARGS;
  CONFIG.Combat.documentClass = ARGSCombate;
  CONFIG.ui.combat = ARGSCombatTracker;
  CONFIG.Combatant.documentClass = ARGSCombatiente;

	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("ARGS", ARGSHojaItem, {makeDefault: true});
	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("ARGS", ARGSHojaAventurero, {types: ["aventurero"],makeDefault: true});
  Actors.registerSheet("ARGS", ARGSHojaMonstruo, {types: ["monstruo","npc","animales"],makeDefault: true});
  Actors.registerSheet("ARGS", ARGSHojaVehiculo, {types: ["vehiculo"],makeDefault: true});
  
  
	preloadHandlebarsTemplates();
	Handlebars.registerHelper('loud', function (aString) {
		return aString.toUpperCase()
	});

  

	Handlebars.registerHelper("times", function(n, content){
		let result = "";
		for (let i = 0; i < n; ++i) {
      content.data.index = i + 1;
			result += content.fn(i);
		}
		return result;
	});

  Handlebars.registerHelper('selectValue', function (lenguajes, id, options) {
    const selectedValue = lenguajes && lenguajes[id] ? lenguajes[id].nivel : '';
    
    return options.fn(this).replace(new RegExp('value="' + selectedValue + '"'), '$& selected="selected"');
    
});
  
});
// Define custom Document classes
CONFIG.Actor.documentClass = ARGSActor;
CONFIG.Item.documentClass = ARGSItem;

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here are a few useful examples:
Handlebars.registerHelper('concat', function() {
  var outStr = '';
  for (var arg in arguments) {
    if (typeof arguments[arg] != 'object') {
      outStr += arguments[arg];
    }
  }
  return outStr;
});

Handlebars.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function() {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  // First, determine if this is a valid owned item.
  if (data.type !== "Item") return;
  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn("You can only create macro buttons for owned Items");
  }
  // If it is, retrieve it based on the uuid.
  const item = await Item.fromDropData(data);

  // Create the macro command using the uuid.
  const command = `game.ARGS.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "ARGS.itemMacro": true }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
  // Reconstruct the drop data so that we can load the item.
  const dropData = {
    type: 'Item',
    uuid: itemUuid
  };
  // Load the item from the uuid.
  Item.fromDropData(dropData).then(item => {
    // Determine if the item loaded and if it's an owned item.
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      return ui.notifications.warn(`Could not find item ${itemName}. You may need to delete and recreate this macro.`);
    }

    // Trigger the item roll
    item.roll();
  });      
}

// A hook event that fires when the game is fully ready.
//
Hooks.on("ready", async () => {
	// Check to see if any data migrations need to be run, and then run them
	//await performDataMigration();
	
	//chat.chat.welcomeMessage();

	
});



HooksImmediate.attach();