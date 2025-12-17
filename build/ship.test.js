"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logic_1 = require("./src/logic");
const testPlayer = new logic_1.Player("person");
const testShip = new logic_1.Ship(testPlayer, 0, 0, 0, 1);
it("can't have ships that are either too short or too long (length wise)", () => {
    expect(testShip.coordinates.size).toBeGreaterThan(1);
    expect(() => new logic_1.Ship(testPlayer, 1, 1, 1, 1)).toThrow("two");
    expect(() => new logic_1.Ship(testPlayer, 2, 2, 2, 8)).toThrow("five");
});
it("can't have diagonal ships", () => {
    expect(() => new logic_1.Ship(testPlayer, 0, 0, 2, 2)).toThrow("Only horizontal and vertical");
    expect(() => new logic_1.Ship(testPlayer, 4, 3, 7, 6)).toThrow("Only horizontal and vertical");
});
it('has coordinates that work as expected', () => {
    expect(testShip.coordinates).toBeDefined();
    expect(testShip.coordinates).toStrictEqual(new Map([[`0:0`, [0, 0]], [`0:1`, [0, 1]]]));
    expect(() => new logic_1.Ship(testPlayer, 1, 1, 3, 3)).toThrow("horizontal");
});
//# sourceMappingURL=ship.test.js.map