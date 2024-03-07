export default class UtilsARGS {
	
	static async getDedupedSelectedItems(allItems, items) {
		const unselectedItems = [];
		const selectedItems = [];
		
		allItems.forEach(item => {
			if (!items.includes(item.uuid)) {
				unselectedItems.push(item);
			}
		});

		for (const itemUuid of items) {
			selectedItems.push(await fromUuid(itemUuid));
		}
		
		selectedItems.sort((a, b) => a.name.localeCompare(b.name));
		
		return [selectedItems, unselectedItems];
	}

}
