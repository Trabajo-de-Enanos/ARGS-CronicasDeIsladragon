export default class ARGSCombate extends Combat {
    async nextRound() {
           
        this.combatants.forEach(c => c.setFlag("ARGS", "defensa", 0));
        let targets = Array.from(game.user.targets);
        console.log("JAVA COMBATE",targets);
        await this.resetAll();
        
        var playerDropdown = "";
        var userArray = Array.from(game.users);
        var actorArray = Array.from(game.actors);
        for (let i = 0; i < userArray.length; i++) {
        //playerDropdown += "<option value='" + userArray[i]._id + "'>" + userArray[i].name + "</option>";
        let UserId = userArray[i]._id;
        // Get all actors owned by the target user
        console.log("USER ID",UserId);
        for (let i = 0; i < actorArray.length; i++) {    

            let actorOwners = actorArray[i].ownership;
            
            let actorOwnersArray = Array.from(actorArray[i].ownership);

            // Check if userId is among the owners of the current actor
            if (actorOwners && actorOwners[UserId] === 3 ) {
                console.log("Este USER es dueño de este Actor",UserId,"Actor",actorArray[i].name);
            }   
            console.log("ActorOwner",actorOwners,"en array",actorOwners[UserId],"Actor Owners Array",actorOwnersArray);
        }; // loop Actores
    } // loop Usuarios
        
  
        const characterTokens = game.users.players.reduce((tokens, u) => {
        let token = u.character ? u.character.getActiveTokens()[0] : null;
        if (token) {
            tokens.push(token);
        };
       
        return tokens;
    }, []);      
     console.log("TOKENS ACTIUVOS CHAR AAAA",characterTokens);

        console.log("ARRAY DE USUARIOS QUE TIIENE",userArray);

        return this.update({ round: this.round + 1, turn: 0 });
      }
    
    
}