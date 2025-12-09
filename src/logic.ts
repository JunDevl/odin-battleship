const maxBoardSize = 10;

type StringCoordinate = `${number}:${number}`

export class Ship {
  readonly owner: Player;

  readonly coordinates: [number, number][] = [];
  #hitCoordinates: [number, number][] = [];

  readonly state: 'active' | 'sunk';

  constructor(owner: Player, ...coordinates: [number, number, number, number]) {
    const [startX, startY] = [coordinates[0], coordinates[1]];
    const [endX, endY] = [coordinates[2], coordinates[3]];

    if (startX - endX !== 0 && startY - endY !== 0) throw new Error("Only horizontal and vertical ships are allowed");

    if (startX < 0 || endX < 0 || startY < 0 || endY < 0) throw new Error("Negative coordinates are invalid");

    const limit = maxBoardSize - 1;

    if (startX > limit || endX > limit || startY > limit || endY > limit) throw new Error("Cooridnate can't exceed the size of the board");

    const forEachCoordinates = (start: number, end: number, orientation: "horizontal" | "vertical") => {
      for (let i = start; i <= end; end - start >= 0 ? i++ : i--) {
        if (orientation === "horizontal") {
          this.coordinates.push([i, startY]);
          continue;
        }
        this.coordinates.push([startX, i]);
      }
    }
    
    if (endX - startX !== 0) {
      forEachCoordinates(startX, endX, "horizontal");
    }
    
    if (endY - startY !== 0) {
      forEachCoordinates(startY, endY, "vertical");
    }

    if (this.coordinates.length < 2) throw new Error("A ship can't have a length of less than two");

    if (this.coordinates.length > 4) throw new Error("A ship can't have a length of more than four");
    
    this.owner = owner;
    this.state = 'active';
  }

  //hit(coordinates()) 
}

export class Gameboard {
  shipCoordinates: Map<StringCoordinate, Ship> = new Map();

  constructor(player1: Player, player2: Player) {
    const randShip = new Ship(player1, 0, 0, 2, 0);
    const randShip2 = new Ship(player2, 3, 3, 3, 6);

    for (let coordinate of randShip.coordinates) {
      const [x, y] = coordinate;
      this.shipCoordinates.set(`${x}:${y}`, randShip);
    }

    for (let coordinate of randShip2.coordinates) {
      const [x, y] = coordinate;
      this.shipCoordinates.set(`${x}:${y}`, randShip2);
    }
  }

  recieveAttack(coordinate: [number, number]) {
    const [x, y] = coordinate
    const hitShip = this.shipCoordinates.get(`${x}:${y}`);

    if (!hitShip) return;

    //hitShip.hit();
  }
}

export class Player {
  //ownedShips: Map<StringCoordinate, Ship>;
  //missedShots: Set<StringCoordinate>;
  //sunkShips: number;

  constructor() {

  }
}