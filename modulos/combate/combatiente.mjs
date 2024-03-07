//import { ARGS } from "../config.js";

export default class ARGSCombatiente extends Combatant {
    _onCreate(data,options,userID){
        super._onCreate(data,options,userID);
        const IdActor = this.actorId;
        const actorData = game.actors.get(IdActor);
        console.log("VER QUE TENGO",this);
        console.log("VER QUE TENGO 222222222",IdActor,actorData);
        if(actorData.type === "aventurero"){
        this.setFlag("ARGS","defensa",actorData.system.calculados.BD.final);
        }
        else if (actorData.type === "npc" || actorData.type === "animales" || actorData.type === "monstruo"){
        this.setFlag("ARGS","defensa",actorData.system.bonifdefensiva);  
        }
    }
}