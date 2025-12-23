import "./style.css";
import { Gameboard, Player } from "./logic";

const MAXIMUM_SHIP_COORDINATE = 10;

const player1 = new Player("person", prompt("What's the name of the first player?"));
const player2 = new Player("npc");

const gameboard = new Gameboard(player1, player2, "pve");

const gameboardGrid = document.querySelector("ul.grid") as HTMLDivElement;
const shipSelect = document.querySelector("select#ships") as HTMLSelectElement;

const highlightedColor = "yellow";
const placedShipColor = "blue";
let highlightedCells: HTMLLIElement[] = [];

let currentShipLength = 0;

type Degree = number;
let rotation: Degree = 270;

generateGrid();

shipSelect.addEventListener("input", (e) => {
  const target = e.target as HTMLSelectElement;
  currentShipLength = Number(target.value);
})

gameboardGrid.addEventListener("mouseover", (e) => {
  const target = e.target as HTMLLIElement;

  if (target.className !== "cell" || currentShipLength === 0) return;

  highlightedCells.forEach(cell => {
    if (!cellIsShip(cell)) cell.style.backgroundColor = "rgb(195, 255, 255)";
  });

  if (shipSelect.selectedIndex !== 0) changeHighlightOrientation(target);

  highlightedCells.forEach(cell => {
    if (!cellIsShip(cell)) cell.style.backgroundColor = highlightedColor;
  });

})
 
gameboardGrid.addEventListener("mouseleave", (e) => {
  highlightedCells.forEach(cell => {
    if (!cellIsShip(cell)) cell.style.backgroundColor = "rgb(195, 255, 255)";
  });
  highlightedCells = [];
})

gameboardGrid.addEventListener("wheel", (e) => {
  e.preventDefault();

  const target = e.target as HTMLLIElement;

  if (e.deltaY < 0) {
    rotation = rotation + 90 === 360 ? 0 : rotation + 90;
  } 
  else {
    rotation = rotation - 90 < 0 ? 270 : rotation - 90;
  }

  highlightedCells.forEach(cell => {
    if (!cellIsShip(cell)) cell.style.backgroundColor = "rgb(195, 255, 255)";
  });

  if (shipSelect.selectedIndex !== 0) changeHighlightOrientation(highlightedCells[0]);

  highlightedCells.forEach(cell => {
    if (!cellIsShip(cell)) cell.style.backgroundColor = highlightedColor;
  });
})

document.addEventListener("keydown", (e) => {
  console.log(e.key);

  if (e.key !== "r") return;

  const target = e.target as HTMLLIElement;

  rotation = rotation + 90 === 360 ? 0 : rotation + 90;

  highlightedCells.forEach(cell => {
    if (!cellIsShip(cell)) cell.style.backgroundColor = "rgb(195, 255, 255)";
  });

  if (shipSelect.selectedIndex !== 0) changeHighlightOrientation(highlightedCells[0]);

  highlightedCells.forEach(cell => {
    if (!cellIsShip(cell)) cell.style.backgroundColor = highlightedColor;
  });
})

gameboardGrid.addEventListener("click", (e) => {
  if (gameboard.gamemode === "ship placement" && shipSelect.selectedIndex !== 0) {
    const start = rotation === 0 || rotation === 270 ? highlightedCells[0] : highlightedCells[highlightedCells.length - 1];
    const end = rotation === 0 || rotation === 270 ? highlightedCells[highlightedCells.length - 1] : highlightedCells[0];

    const [startX, startY] = [Number(start.getAttribute("x")) - 1, Number(start.getAttribute("y")) - 1];
    const [endX, endY] = [Number(end.getAttribute("x")) - 1, Number(end.getAttribute("y")) - 1];

    const shipExists = () => {
      try {
        gameboard.currentPlayerTurn.putShip(startX, startY, endX, endY);
      } catch (error) {
        return true;
      }
      return false;
    };

    if (shipExists()) return;
    
    for (let cell of highlightedCells)
      cell.style.background = placedShipColor;

    const selectedOption = document.querySelector(`select#ships > option[value="${shipSelect.value}"]`);
    shipSelect.removeChild(selectedOption!);

    shipSelect.selectedIndex = 0;
    highlightedCells = [];

    gameboard.changeTurn();
    return;
  }
})

function generateGrid() {
  for (let row = 1; row <= MAXIMUM_SHIP_COORDINATE; row++) {
    for (let column = 1; column <= MAXIMUM_SHIP_COORDINATE; column++) {
      const cell = document.createElement("li");
      cell.id = `${column}:${row}`;
      cell.setAttribute("x", column.toString());
      cell.setAttribute("y", row.toString());
      cell.className = "cell";

      gameboardGrid.appendChild(cell);
    }
  }
}

function iterateShipHighlight(indexMutation: "increment" | "decrement", orientation: "horizontal" | "vertical", originElement: HTMLLIElement) {
  const [originX, originY] = [Number(originElement.getAttribute("x")), 
                              Number(originElement.getAttribute("y"))] as [number, number];

  if (indexMutation === "increment") {
    if ((orientation === "horizontal" && originX + currentShipLength > MAXIMUM_SHIP_COORDINATE + 1) ||
        (orientation === "vertical" && originY + currentShipLength > MAXIMUM_SHIP_COORDINATE + 1))
      return;
  } 

  if (indexMutation === "decrement") {
    if ((orientation === "horizontal" && originX - currentShipLength < 0) ||
        (orientation === "vertical" && originY - currentShipLength < 0))
      return;
  }

  highlightedCells = [];

  for (let i = 0; indexMutation === "increment" ? i < currentShipLength : i > -currentShipLength; indexMutation === "increment" ? i++ : i--) {
    const selector = orientation === "horizontal" ? `li[id="${originX + i}:${originY}"]` : `li[id="${originX}:${originY + i}"]`;
    const nextElement: HTMLLIElement | null = document.querySelector(selector);

    if (nextElement) highlightedCells.push(nextElement);
  }
}

function changeHighlightOrientation(originElement: HTMLLIElement) {
  switch (rotation) {
    case 0:
      iterateShipHighlight("increment", "horizontal", originElement);
      break;
    case 90:
      iterateShipHighlight("decrement", "vertical", originElement);
      break;
    case 180:
      iterateShipHighlight("decrement", "horizontal", originElement);
      break;
    case 270:
      iterateShipHighlight("increment", "vertical", originElement);
      break;
  }
}

function cellIsShip(cell: HTMLLIElement) {return cell.style.backgroundColor === placedShipColor}