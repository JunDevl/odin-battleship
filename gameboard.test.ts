import { Gameboard, Player } from "./src/logic";

const testP1 = new Player();
const testP2 = new Player();
const testGameboard = new Gameboard(testP1, testP2);

it("has ships", () => {
  expect(testGameboard.shipCoordinates.size).toBeGreaterThan(0);
})

it("can change state based on a new attack being made", () => {
  const mock = jest.fn(() => testGameboard.recieveAttack([0, 0]));

  //expect(mock).
}) 