import { Gameboard, Player } from "./src/logic";

const testP1 = new Player("person", "roronoa");
const testP2 = new Player("person", "zoro");

testP1.putShip(3, 3, 3, 7);
testP1.putShip(0, 2, 0, 5);
testP1.putShip(1, 0, 3, 0);
testP1.putShip(5, 3, 7, 3);

const testGameboard = new Gameboard(testP1, testP2, "pvp");

it("is able to change turns between players", () => {
  expect(testGameboard.gamemode).toBe("ship placement");
  expect(testGameboard.currentPlayerTurn).toBe(testP1);

  testP1.putShip(6, 8, 6, 9);

  testGameboard.changeTurn();

  expect(testGameboard.gamemode).toBe("ship placement");
  expect(testGameboard.currentPlayerTurn).toBe(testP2);
})

it("is able to change gamemode based on the defined criteria", () => {
  const bot = new Player("npc", "kuma");

  const testpveGameboard = new Gameboard(testP1, bot, "pve");

  testpveGameboard.changeTurn();

  expect(testpveGameboard.gamemode).toBe("bombing");

  testP2.putShip(3, 3, 3, 7);
  testP2.putShip(0, 2, 0, 5);
  testP2.putShip(1, 0, 3, 0);
  testP2.putShip(5, 3, 7, 3);
  testP2.putShip(6, 8, 6, 9);

  testGameboard.changeTurn();

  expect(testGameboard.gamemode).toBe("bombing");
})

it("can change state based on a new attack being made", () => {
  const test = testP1.recieveAttack(0, 4);
  expect(test).toBe(true);

  expect(testP1.ownedShips.get("0:4")?.hitCoordinates.size).toBeGreaterThan(0);
})

it("can set a winner", () => {
  testP1.recieveAttack(3, 3);
  testP1.recieveAttack(0, 2);
  testP1.recieveAttack(1, 0);
  testP1.recieveAttack(5, 3);
  testP1.recieveAttack(6, 8);

  const uniqueShips = new Set([...testP1.ownedShips.values()]);

  expect(testP1.sunkShips.size).toBe(uniqueShips.size);

  console.log(testGameboard.gamemode, testGameboard.currentPlayerTurn);

  testGameboard.changeTurn();

  expect(testGameboard.winner).toBeTruthy();
}) 