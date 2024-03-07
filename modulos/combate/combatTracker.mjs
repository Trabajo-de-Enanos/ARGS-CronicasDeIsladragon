export default class ARGSCombatTracker extends CombatTracker {
    
    get template(){
        return "systems/ARGS/templates/apps/combat-tracker.hbs"
    }

 /** @inheritdoc */
  async getData(options={}) {
    let context = await super.getData(options);

    // Get the combat encounters possible for the viewed Scene
    const combat = this.viewed;
    const hasCombat = combat !== null;
    const combats = this.combats;
    const currentIdx = combats.findIndex(c => c === combat);
    const previousId = currentIdx > 0 ? combats[currentIdx-1].id : null;
    const nextId = currentIdx < combats.length - 1 ? combats[currentIdx+1].id : null;
    const settings = game.settings.get("core", Combat.CONFIG_SETTING);

    // Prepare rendering data
    context = foundry.utils.mergeObject(context, {
      combats: combats,
      currentIndex: currentIdx + 1,
      combatCount: combats.length,
      hasCombat: hasCombat,
      combat,
      turns: [],
      previousId,
      nextId,
      started: this.started,
      control: false,
      settings,
      linked: combat?.scene !== null,
      labels: {}
    });
    context.labels.scope = game.i18n.localize(`COMBAT.${context.linked ? "Linked" : "Unlinked"}`);
    if ( !hasCombat ) return context;
	
    // Format information about each combatant in the encounter
    let hasDecimals = false;
    const turns = [];
    for ( let [i, combatant] of combat.turns.entries() ) {
      if ( !combatant.visible ) continue;

      // Prepare turn data
      const resource = combatant.permission >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER ? combatant.resource : null;
      const turn = {
        id: combatant.id,
        name: combatant.name,
        img: await this._getCombatantThumbnail(combatant),
        active: i === combat.turn,
        owner: combatant.isOwner,
        defeated: combatant.isDefeated,
        hidden: combatant.hidden,
        TOTITO: "TEST TOTITO",
        initiative: combatant.initiative,
        hasRolled: combatant.initiative !== null,
        hasResource: resource !== null,
        resource: resource,
        defensa: combatant.flags.ARGS.defensa ?? 0,
        canPing: (combatant.sceneId === canvas.scene?.id) && game.user.hasPermission("PING_CANVAS")
      };
      if ( (turn.initiative !== null) && !Number.isInteger(turn.initiative) ) hasDecimals = true;
      turn.css = [
        turn.active ? "active" : "",
        turn.hidden ? "hidden" : "",
        turn.defeated ? "defeated" : ""
      ].join(" ").trim();

      // Actor and Token status effects
      turn.effects = new Set();
      if ( combatant.token ) {
        combatant.token.effects.forEach(e => turn.effects.add(e));
        if ( combatant.token.overlayEffect ) turn.effects.add(combatant.token.overlayEffect);
      }
      if ( combatant.actor ) {
        for ( const effect of combatant.actor.temporaryEffects ) {
          console.log("EFECTO EN TRACKER",effect);
          if ( effect.statuses.has(CONFIG.specialStatusEffects.DEFEATED) ) turn.defeated = true;
          else if ( effect.icon ) turn.effects.add(effect.icon);
        }
      }
      turns.push(turn);
      console.log("TOTI COMBAT TRACKER", context,"turno",turn,"combatant",combatant,"ERROR",combatant.flags.ARGS.defensa);
    }
    

    // Format initiative numeric precision
    const precision = CONFIG.Combat.initiative.decimals;
    turns.forEach(t => {
      if ( t.initiative !== null ) t.initiative = t.initiative.toFixed(hasDecimals ? precision : 0);
    });

    // Merge update data for rendering
    return foundry.utils.mergeObject(context, {
      round: combat.round,
      turn: combat.turn,
      turns: turns,
      control: combat.combatant?.players?.includes(game.user)
    });
  }
    
  activateListeners(html) {
    super.activateListeners(html);
    const tracker = html.find("#combat-tracker");
    const combatants = tracker.find(".combatant");
	
    // Combatant BD
    html.find(".combatant-BD").click(ev => this._onCombatantBD(ev));

    
  }

  async _onCombatantBD(event) {
    event.preventDefault();
    event.stopPropagation();
    const btn = event.currentTarget;
    const li = btn.closest(".combatant");
    const combat = this.viewed;
    const c = combat.combatants.get(li.dataset.combatantId);

    // Switch control action
    switch (btn.dataset.control) {

      // Toggle combatant visibility
      case "toggleBD":
        console.log("TOGGLE BDF",this);
        }

      //////////////////////
      let numbers = [1, 2, 3, 4, 1, 2, 3, 4, 4, 4, 1, 2];

let combinedArray1 = [];
let combinedArray2 = [];
let remainingFours = [];

      let countOfFours = 0;

      for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] === 4) {
          countOfFours++;
      
          if (countOfFours === 2) {
            combinedArray1.push(5);
          } else if (countOfFours === 3) {
            combinedArray1.pop(); // Remove one 5
            combinedArray2.push(6);
          }
        } else {
          remainingFours.push(...Array(countOfFours).fill(4)); // Push remaining 4s
          countOfFours = 0; // Reset the count when a non-4 is encountered
          remainingFours.push(numbers[i]);
        }
      }
      
      console.log("Combined 2 4s into 5s:", combinedArray1.concat(remainingFours));
      console.log("Combined 3 4s into 6s:", combinedArray2.concat(remainingFours));
      console.log("Remaining 4s:", remainingFours);

      //////////////////////
    }   

    
}