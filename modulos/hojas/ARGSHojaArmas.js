export default class ARGSHojaArmas extends ItemSheet {
	get template() {
		return `systems/ARGS/templates/hojas/armas-hoja.hbs`;
	}
	
	getData() {
		const data = super.getData();
		
		data.config = CONFIG.ARGS;
		
		return data;
	}
}
