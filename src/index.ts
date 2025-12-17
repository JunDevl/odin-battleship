import "./style.css";

const gameboardGrid = document.querySelector("ul.grid") as HTMLDivElement;

generateGrid();

gameboardGrid.addEventListener("mouseover", (e) => {
  const element = e.target as HTMLElement;

  if (element.className === "cell") {
    element.style.backgroundColor = "yellow";
  }
})

gameboardGrid.addEventListener("mouseout", (e) => {
  const element = e.target as HTMLElement;

  if (element.className === "cell") {
    element.style.backgroundColor = "rgb(195, 255, 255)"
  }
})

function generateGrid() {
  for (let row = 1; row <= 10; row++) {
    for (let column = 1; column <= 10; column++) {
      const cell = document.createElement("li");
      cell.id = `${column}:${row}`;
      cell.className = "cell";

      gameboardGrid.appendChild(cell);
    }
  }
}