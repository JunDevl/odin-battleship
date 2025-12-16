const maxBoardSize = 10;

type StringCoordinate = `${number}:${number}`

export class Ship {
  readonly owner: Player;

  coordinates: Map<StringCoordinate, [number, number]> = new Map();
  hitCoordinates: Map<StringCoordinate, [number, number]> = new Map();

  state: 'active' | 'sunk';

  constructor(owner: Player, startX: number, startY: number, endX: number, endY: number) {
    if (startX - endX !== 0 && startY - endY !== 0) throw new Error("Only horizontal and vertical ships are allowed");

    if (startX < 0 || endX < 0 || startY < 0 || endY < 0) throw new Error("Negative coordinates are invalid");

    const limit = maxBoardSize - 1;

    if (startX > limit || endX > limit || startY > limit || endY > limit) throw new Error("Cooridnate can't exceed the size of the board");

    const forEachCoordinates = (start: number, end: number, orientation: "horizontal" | "vertical") => {
      for (let i = start; i <= end; end - start >= 0 ? i++ : i--) {
        if (orientation === "horizontal") {
          this.coordinates.set(`${i}:${startY}`, [i, startY]);
          continue;
        }
        this.coordinates.set(`${startX}:${i}`, [startX, i]);
      }
    }
    
    if (endX - startX !== 0) {
      forEachCoordinates(startX, endX, "horizontal");
    }
    
    if (endY - startY !== 0) {
      forEachCoordinates(startY, endY, "vertical");
    }

    if (this.coordinates.size < 2) throw new Error("A ship can't have a length of less than two");

    if (this.coordinates.size > 4) throw new Error("A ship can't have a length of more than four");
    
    this.owner = owner;
    this.state = 'active';
  }

  hitSelf(x: number, y: number) {
    if (this.state === "sunk") throw new Error("Can't hit a ship that has already sunken");

    this.hitCoordinates.set(`${x}:${y}`, [x, y]);

    this.state = this.hitCoordinates.size === this.coordinates.size ? "sunk" : "active";
  }
}


type GameboardStyle = "pvp" | "pve";
type Gamemode = "ship placement" | "bombing";
export class Gameboard {
  player1: Player;
  player2: Player;

  style: GameboardStyle;

  gamemode: Gamemode = "ship placement";
  currentPlayerTurn: Player;

  shipCoordinates: Map<StringCoordinate, Ship> = new Map();
  winner: Player | null = null;

  constructor(player1: Player, player2: Player, style: GameboardStyle) {
    this.player1 = player1;
    this.player2 = player2;

    this.style = style;

    this.currentPlayerTurn = player1;
  }

  changeTurn() {
    if (this.gamemode === "ship placement") {
      if (this.currentPlayerTurn.ownedShips.size < 5) return;
    
      const allowedShipsLength = [2, 3, 3, 4, 5];

      const ownedShips = Object.values(this.currentPlayerTurn.ownedShips);

      ownedShips.forEach((ship) => {
        allowedShipsLength.splice(ship.length, 1);
      })

      if (allowedShipsLength.length > 0)
        throw new Error(`${
          ownedShips.reduce((prev, next) => <unknown>`${prev.coordinates.size}, ${next.coordinates.size}` as Ship)
        } aren't valid lengths of every ship that a player can own`);
    
      this.currentPlayerTurn = this.player1 && this.player2;

      if (this.currentPlayerTurn === this.player2) this.gamemode = "bombing";

      return;
    }

    this.currentPlayerTurn = this.player1 && this.player2;
  }
}

type PlayerKind = "npc" | "person"
export class Player {
  name: string;

  type: PlayerKind

  ownedShips: Map<StringCoordinate, Ship> = new Map();
  sunkShips: Set<Ship> = new Set();

  missedShots: Set<StringCoordinate> = new Set();

  constructor(type: PlayerKind, name?: string) {
    this.type = type;

    if (type === "npc") {
      // do some stuff to generate random ships
      this.name = name ?? "randomBotName";
    }

    this.name = name ?? "unnamed";
  }

  putShip(ownerPlayerNumber: 1 | 2, startX: number, startY: number, endX: number, endY: number) {    
    const newShip = new Ship(this, startX, startY, endX, endY);

    for (let coordinate of Object.values(newShip.coordinates)) {
      const [x, y] = coordinate;
      if (this.ownedShips.has(`${x}:${y}`)) throw new Error("Owned ships cannot overlap");
      this.ownedShips.set(`${x}:${y}`, newShip);
    }
  }

  recieveAttack(x: number, y: number) {
    const hitShip = this.ownedShips.get(`${x}:${y}`);

    if (!hitShip) return hitShip;

    hitShip.hitSelf(x, y);

    return !hitShip;
  }
}