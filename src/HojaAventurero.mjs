import ActorSheetSD from "./ActorSheetSD.mjs";

export default class PlayerSheetSD extends ActorSheetSD {

	

	/** @inheritdoc */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["ARGS", "sheet", "aventurero"],
			width: 560,
			height: 560,
			resizable: true,
			tabs: [
				{
					navSelector: ".aventurero-navigation",
					contentSelector: ".aventurero-body",
					initial: "tab-caracteristicas",
				},
			],
			dragDrop: [{
				dragSelector: ".item[draggable=true]",
			}],
		});
	}

	/** @inheritdoc */
	get template() {
		return "systems/ARGS/templates/actors/player.hbs";
	}

	/** @inheritdoc */
	activateListeners(html) {
		html.find(".item-image").click(
			event => this._onItemChatClick(event)
		);

		html.find(".item-quantity-decrement").click(
			event => this._onItemQuantityDecrement(event)
		);

		html.find(".item-quantity-increment").click(
			event => this._onItemQuantityIncrement(event)
		);

		html.find(".item-toggle-equipped").click(
			event => this._onToggleEquipped(event)
		);

		html.find(".item-toggle-light").click(
			event => this._onToggleLightSource(event)
		);

		html.find(".language-list.languages").click(
			event => this._onKnownLanguages(event)
		);

		html.find(".open-gem-bag").click(
			event => this._onOpenGemBag(event)
		);

		html.find(".sell-treasure").click(
			event => this._onSellTreasure(event)
		);

		html.find(".toggle-spell-lost").click(
			event => this._onToggleSpellLost(event)
		);

		html.find("[data-action='use-potion']").click(
			event => this._onUsePotion(event)
		);

		html.find("[data-action='learn-spell']").click(
			event => this._onLearnSpell(event)
		);

		// Handle default listeners last so system listeners are triggered first
		super.activateListeners(html);
	}



	async _prepareItems(context) {
		const gems = [];

		const inventory = {
			armor: {
				label: game.i18n.localize("ARGS.inventory.section.armor"),
				type: "Armor",
				items: [],
			},
			weapon: {
				label: game.i18n.localize("ARGS.inventory.section.weapon"),
				type: "Weapon",
				items: [],
			},
			basic: {
				label: game.i18n.localize("ARGS.inventory.section.basic"),
				type: "Basic",
				items: [],
			},
			potion: {
				label: game.i18n.localize("ARGS.inventory.section.potions"),
				type: "Potion",
				items: [],
			},
			scroll: {
				label: game.i18n.localize("ARGS.inventory.section.scrolls"),
				type: "Scroll",
				items: [],
			},
			wand: {
				label: game.i18n.localize("ARGS.inventory.section.wands"),
				type: "Wand",
				items: [],
			},
			treasure: {
				label: game.i18n.localize("ARGS.inventory.section.treasure"),
				items: [],
			},
		};

		const spells = {};

		const talents = {
			ancestry: {
				label: game.i18n.localize("ARGS.talent.class.ancestry"),
				items: [],
			},
			class: {
				label: game.i18n.localize("ARGS.talent.class.class"),
				items: [],
			},
			level: {
				label: game.i18n.localize("ARGS.talent.class.level"),
				items: [],
			},
		};

		const effects = {
			effect: {
				label: game.i18n.localize("ARGS.item.effect.category.effect"),
				items: [],
			},
			condition: {
				label: game.i18n.localize("ARGS.item.effect.category.condition"),
				items: [],
			},
		};

		const attacks = {melee: [], ranged: []};

		let slotCount = 0;

		for (const i of this._sortAllItems(context)) {
			if (i.system.isPhysical && i.type !== "Gem") {
				i.showQuantity = i.system.slots.per_slot > 1 ? true : false;

				// We calculate how many slots are used by this item, taking
				// into account the quantity and any free items.
				//
				const freeCarry = i.system.slots.free_carry;
				const perSlot = i.system.slots.per_slot;
				const quantity = i.system.quantity;
				const slotsUsed = i.system.slots.slots_used;

				let totalSlotsUsed = Math.ceil(quantity / perSlot) * slotsUsed;
				totalSlotsUsed -= freeCarry * slotsUsed;

				i.slotsUsed = totalSlotsUsed;

				slotCount += i.slotsUsed;

				const section = i.system.treasure
					? "treasure"
					: i.type.toLowerCase();

				inventory[section].items.push(i);

				if (i.type === "Basic" && i.system.light.isSource) {
					i.isLightSource = true;
					i.lightSourceActive = i.system.light.active;
					i.lightSourceUsed = i.system.light.hasBeenUsed;

					const timeRemaining = Math.ceil(
						i.system.light.remainingSecs / 60
					);

					if (i.system.light.remainingSecs < 60) {
						i.lightSourceTimeRemaining = game.i18n.localize(
							"ARGS.inventory.item.light_seconds_remaining"
						);
					}
					else {
						i.lightSourceTimeRemaining = game.i18n.format(
							"ARGS.inventory.item.light_remaining",
							{ timeRemaining }
						);
					}
				}

				if (i.type === "Weapon" && i.system.equipped) {
					const weaponAttacks = await this.actor.buildWeaponDisplays(i._id);
					attacks.melee.push(...weaponAttacks.melee);
					attacks.ranged.push(...weaponAttacks.ranged);
				}
			}
			else if (i.type === "Gem") {
				gems.push(i);
			}
			else if (i.type === "Spell") {
				const spellTier = i.system.tier;
				spells[spellTier] ||= [];
				spells[spellTier].push(i);
			}
			else if (i.type === "Talent") {
				const talentClass = i.system.talentClass;
				talents[talentClass].items.push(i);
			}
			else if (i.type === "Effect") {
				const category = i.system.category;
				effects[category].items.push(i);
			}
		}

		// Work out how many slots all these coins are taking up...
		const coins = this.actor.system.coins;
		const totalCoins = coins.gp + coins.sp + coins.cp;

		let coinSlots = 0;
		const freeCoins = ARGS.defaults.FREE_COIN_CARRY;
		if (totalCoins > freeCoins) {
			coinSlots = Math.ceil((totalCoins - freeCoins) / freeCoins);
		}

		// Now do the same for gems...
		let gemSlots = 0;
		let totalGems = gems.length;

		if (totalGems > 0) {
			gemSlots = Math.ceil(totalGems / CONFIG.ARGS.INVENTORY.GEMS_PER_SLOT);
		}

		context.attacks = attacks;
		context.coins = {totalCoins, coinSlots};
		context.gems = {items: gems, totalGems, gemSlots};
		context.inventory = inventory;
		context.slotsUsed = slotCount + coinSlots + gemSlots;
		context.spells = spells;

		// Sort these by level for display...
		talents.level.items = talents.level.items.sort(
			(a, b) => a.system.level - b.system.level
		);
		context.talents = talents;
		context.effects = effects;
	}

 	async _updateObject(event, formData) {
		const hpValues = this.object.system.attributes.hp;

		// Modify the underlying base hp value if the max is changed manually
		if (formData["system.attributes.hp.max"] !== hpValues.max) {
			formData["system.attributes.hp.base"] =
				formData["system.attributes.hp.max"] - hpValues.bonus;
		}

		const abilities = this.object.system.abilities;

		// Modify the underlying base ability value if it is changed manually
		for (const ability of CONFIG.ARGS.ABILITY_KEYS) {
			const key = `system.abilities.${ability}.base`;

			if (formData[key] !== abilities[ability].base) {
				formData[key] = formData[key] - abilities[ability].bonus;
			}
		}

		super._updateObject(event, formData);
	}
}
