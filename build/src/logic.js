"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = exports.Gameboard = exports.Ship = void 0;
const maxBoardSize = 10;
class Ship {
    owner;
    coordinates = new Map();
    hitCoordinates = new Map();
    state;
    constructor(owner, startX, startY, endX, endY) {
        if (startX - endX !== 0 && startY - endY !== 0)
            throw new Error("Only horizontal and vertical ships are allowed");
        if (startX < 0 || endX < 0 || startY < 0 || endY < 0)
            throw new Error("Negative coordinates are invalid");
        const limit = maxBoardSize - 1;
        if (startX > limit || endX > limit || startY > limit || endY > limit)
            throw new Error("Cooridnate can't exceed the size of the board");
        const forEachCoordinates = (start, end, orientation) => {
            for (let i = start; i <= end; end - start >= 0 ? i++ : i--) {
                if (orientation === "horizontal") {
                    this.coordinates.set(`${i}:${startY}`, [i, startY]);
                    continue;
                }
                this.coordinates.set(`${startX}:${i}`, [startX, i]);
            }
        };
        if (endX - startX !== 0) {
            forEachCoordinates(startX, endX, "horizontal");
        }
        if (endY - startY !== 0) {
            forEachCoordinates(startY, endY, "vertical");
        }
        if (this.coordinates.size < 2)
            throw new Error("A ship can't have a length of less than two");
        if (this.coordinates.size > 5)
            throw new Error("A ship can't have a length of more than five");
        this.owner = owner;
        this.state = 'active';
    }
    hitSelf(x, y) {
        if (this.state === "sunk")
            throw new Error("Can't hit a ship that has already sunken");
        this.hitCoordinates.set(`${x}:${y}`, [x, y]);
        this.state = this.hitCoordinates.size === this.coordinates.size ? "sunk" : "active";
    }
}
exports.Ship = Ship;
class Gameboard {
    player1;
    player2;
    style;
    gamemode = "ship placement";
    currentPlayerTurn;
    shipCoordinates = new Map();
    winner = null;
    constructor(player1, player2, style) {
        this.player1 = player1;
        this.player2 = player2;
        this.style = style;
        this.currentPlayerTurn = player1;
    }
    changeTurn() {
        const MAXIMUM_SHIPS_ALLOWED_PER_PLAYER = 5;
        if (this.gamemode === "ship placement") {
            const uniqueOwnedShips = new Set([...this.currentPlayerTurn.ownedShips.values()]);
            if (uniqueOwnedShips.size < MAXIMUM_SHIPS_ALLOWED_PER_PLAYER)
                return;
            const ALLOWED_SHIPS_LENGTH = [2, 3, 3, 4, 5];
            uniqueOwnedShips.forEach(ship => {
                const index = ALLOWED_SHIPS_LENGTH.indexOf(ship.coordinates.size);
                ALLOWED_SHIPS_LENGTH.splice(index, 1);
            });
            if (ALLOWED_SHIPS_LENGTH.length > 0)
                throw new Error(`Count of lengths don't match the constraint of every kind of ship that a player can own in this game`);
            if (this.currentPlayerTurn === this.player2 || this.player2.type === "npc")
                this.gamemode = "bombing";
            if (this.player2.type === "person")
                this.currentPlayerTurn = this.player1 && this.player2;
            return;
        }
        const nextPlayer = this.currentPlayerTurn === this.player1 ? this.player2 : this.player1;
        if (nextPlayer.sunkShips.size === MAXIMUM_SHIPS_ALLOWED_PER_PLAYER) {
            this.winner = this.currentPlayerTurn;
            return;
        }
        this.currentPlayerTurn = nextPlayer;
    }
}
exports.Gameboard = Gameboard;
class Player {
    name;
    type;
    ownedShips = new Map();
    sunkShips = new Set();
    missedShots = new Set();
    constructor(type, name) {
        this.type = type;
        if (type === "npc") {
            this.name = name ?? "randomBotName";
            return;
        }
        this.name = name ?? "unnamed";
    }
    putShip(startX, startY, endX, endY) {
        const newShip = new Ship(this, startX, startY, endX, endY);
        newShip.coordinates.forEach(coordinate => {
            const [x, y] = coordinate;
            if (this.ownedShips.has(`${x}:${y}`))
                throw new Error("Owned ships cannot overlap");
            this.ownedShips.set(`${x}:${y}`, newShip);
        });
    }
    recieveAttack(x, y) {
        const targetShip = this.ownedShips.get(`${x}:${y}`);
        if (!targetShip)
            return !!targetShip;
        this.sunkShips.add(targetShip);
        targetShip.hitSelf(x, y);
        return !!targetShip;
    }
}
exports.Player = Player;
//# sourceMappingURL=logic.js.map