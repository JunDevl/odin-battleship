"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logic_1 = require("./logic");
const testP1 = new logic_1.Player("person");
const testP2 = new logic_1.Player("npc");
const board = new logic_1.Gameboard(testP1, testP2, "pvp");
testP1.putShip(3, 3, 3, 7);
testP1.putShip(0, 2, 0, 5);
testP1.putShip(1, 0, 3, 0);
testP1.putShip(5, 3, 7, 3);
testP1.putShip(6, 8, 6, 9);
const bot = new logic_1.Player("npc", "kuma");
const testpveGameboard = new logic_1.Gameboard(testP1, bot, "pve");
testpveGameboard.changeTurn();
console.log(testpveGameboard.gamemode);
//# sourceMappingURL=index.js.map