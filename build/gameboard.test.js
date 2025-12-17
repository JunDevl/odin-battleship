"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logic_1 = require("./src/logic");
const testP1 = new logic_1.Player("person", "roronoa");
const testP2 = new logic_1.Player("person", "zoro");
testP1.putShip(3, 3, 3, 7);
testP1.putShip(0, 2, 0, 5);
testP1.putShip(1, 0, 3, 0);
testP1.putShip(5, 3, 7, 3);
const testGameboard = new logic_1.Gameboard(testP1, testP2, "pvp");
it("is able to change turns between players", () => {
    expect(testGameboard.gamemode).toBe("ship placement");
    expect(testGameboard.currentPlayerTurn).toBe(testP1);
    testP1.putShip(6, 8, 6, 9);
    testGameboard.changeTurn();
    expect(testGameboard.gamemode).toBe("ship placement");
    expect(testGameboard.currentPlayerTurn).toBe(testP2);
});
it("is able to change gamemode based on the defined criteria", () => {
    const bot = new logic_1.Player("npc", "kuma");
    const testpveGameboard = new logic_1.Gameboard(testP1, bot, "pve");
    testpveGameboard.changeTurn();
    expect(testpveGameboard.gamemode).toBe("bombing");
    testP2.putShip(3, 3, 3, 7);
    testP2.putShip(0, 2, 0, 5);
    testP2.putShip(1, 0, 3, 0);
    testP2.putShip(5, 3, 7, 3);
    testP2.putShip(6, 8, 6, 9);
    testGameboard.changeTurn();
    expect(testGameboard.gamemode).toBe("bombing");
});
it("can change state based on a new attack being made", () => {
    const test = testP1.recieveAttack(0, 4);
    expect(test).toBe(true);
    expect(testP1.ownedShips.get("0:4")?.hitCoordinates.size).toBeGreaterThan(0);
});
it("can set a winner", () => {
});
//# sourceMappingURL=gameboard.test.js.map