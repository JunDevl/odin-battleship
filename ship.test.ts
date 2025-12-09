import { Ship, Player } from "./src/logic";

const testPlayer = new Player();
const testShip = new Ship(testPlayer, 0, 0, 0, 1);

it('has correct length', () => {
  expect(testShip.coordinates.length).toBeGreaterThan(1);
  
  expect(() => new Ship(testPlayer, 1, 1, 1, 1)).toThrow("two");
  expect(() => new Ship(testPlayer, 2, 2, 2, 8)).toThrow("four");
})

it('coordinates work', () => {
  expect(testShip.coordinates).toBeDefined();
  expect(testShip.coordinates).toEqual([[0, 0], [0, 1]]);

  expect(() => new Ship(testPlayer, 1, 1, 3, 3)).toThrow("horizontal");
})