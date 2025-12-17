//import "./style.css"
import { Gameboard, Player } from "./logic";

const testP1 = new Player("person");
const testP2 = new Player("npc");

const board = new Gameboard(testP1, testP2, "pvp");

testP1.putShip(3, 3, 3, 7);
testP1.putShip(0, 2, 0, 5);
testP1.putShip(1, 0, 3, 0);
testP1.putShip(5, 3, 7, 3);
testP1.putShip(6, 8, 6, 9);

const bot = new Player("npc", "kuma");

const testpveGameboard = new Gameboard(testP1, bot, "pve");

testpveGameboard.changeTurn();

console.log(testpveGameboard.gamemode);

//const test = testP1.recieveAttack(0, 4);