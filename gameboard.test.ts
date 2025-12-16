import { Gameboard, Player } from "./src/logic";

const testP1 = new Player("person");
const testP2 = new Player("npc");

const testGameboard = new Gameboard(testP1, testP2, "pve");

it("has ships", () => {
  //testGameboard.putShip(1, 0, 0, 3, 0);
  //expect(testGameboard.shipCoordinates.size).toBeGreaterThan(0);
})

it("can change state based on a new attack being made", () => {
  
}) 