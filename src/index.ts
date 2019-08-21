import "./index.scss";
import {
  init,
  GameLoop,
  Sprite,
  initKeys,
  bindKeys
} from "kontra/src/kontra.js";

function resizeGame(): void {
  const gameArea = document.getElementById("gameArea") as HTMLDivElement;
  const widthToHeight = 16 / 9;
  let newWidth = window.innerWidth;
  let newHeight = window.innerHeight;
  const newWidthToHeight = newWidth / newHeight;

  if (newWidthToHeight > widthToHeight) {
    newWidth = newHeight * widthToHeight;
    gameArea.style.height = newHeight + "px";
    gameArea.style.width = newWidth + "px";
  } else {
    newHeight = newWidth / widthToHeight;
    gameArea.style.width = newWidth + "px";
    gameArea.style.height = newHeight + "px";
  }

  gameArea.style.marginTop = -newHeight / 2 + "px";
  gameArea.style.marginLeft = -newWidth / 2 + "px";

  const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  gameCanvas.width = newWidth;
  gameCanvas.height = newHeight;
}

window.addEventListener("load", resizeGame, false);
window.addEventListener("resize", resizeGame, false);
window.addEventListener("orientationchange", resizeGame, false);

const { canvas } = init("gameCanvas");

initKeys();
const arrows = [37, 38, 39, 40];
canvas.addEventListener(
  "keydown",
  function(e) {
    if (arrows.indexOf(e.which) !== -1) {
      e.preventDefault();
    }
  },
  true
);
const grid = 15;
const numRows = canvas.height / grid;
const numCols = canvas.width / grid;
const snake = Sprite();
const apple = Sprite();

// keep track of which cells of the game are open so the apple doesn't spawn on
// top of the snake
const freeCells = [];
for (let row = 0; row < numRows; row++) {
  for (let col = 0; col < numCols; col++) {
    freeCells.push(row * numCols + col);
  }
}

/**
 * Get a random integer between min (inclusive) and max (exclusive)
 * @see https://stackoverflow.com/a/1527820/2124254
 */
function getRandomInt(min, max): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Get a random open cell for the apple
 */
function getApplePos(): { x: number; y: number } {
  const cell = getRandomInt(0, freeCells.length - 1);
  return {
    x: (cell % numCols) * grid,
    y: ((cell / numCols) | 0) * grid
  };
}

/**
 * Reset the snake and apple position
 */
function reset(): void {
  snake.init({
    x: 10 * grid,
    y: 5 * grid,
    dx: grid,
    color: "green",
    cells: [],
    maxCells: 4,
    update: function() {
      snake.advance();

      // wrap snake position on edge of screen
      if (this.x < 0) {
        this.x = canvas.width - grid;
      } else if (this.x >= canvas.width) {
        this.x = 0;
      }
      if (this.y < 0) {
        this.y = canvas.height - grid;
      } else if (this.y >= canvas.height) {
        this.y = 0;
      }

      // keep track of where snake has been. front of the array is always the head
      this.cells.unshift({ x: this.x, y: this.y });
      const cellIndex = freeCells.indexOf(
        (this.y / grid) * numCols + this.x / grid
      );
      freeCells.splice(cellIndex, 1);

      // remove cells as we move away from them
      if (this.cells.length > this.maxCells) {
        const cell = this.cells.pop();
        freeCells.push((cell.y / grid) * numCols + cell.x / grid);
      }

      // check for collision with apple or body
      this.cells.forEach(
        function(cell, index): void {
          // snake ate apple, only the front of the snake can eat an apple
          if (index === 0 && cell.x === apple.x && cell.y === apple.y) {
            this.maxCells++;
            const pos = getApplePos();
            apple.x = pos.x;
            apple.y = pos.y;
          }

          // check collision with all cells after this one (modified bubble sort)
          for (let i = index + 1; i < this.cells.length; i++) {
            // collision, reset game
            if (cell.x === this.cells[i].x && cell.y === this.cells[i].y) {
              reset();
            }
          }
        }.bind(this)
      );
    },
    render: function() {
      this.context.fillStyle = this.color;

      this.cells.forEach(
        function(cell): void {
          this.context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
        }.bind(this)
      );
    }
  });

  const pos = getApplePos();
  apple.init({
    x: pos.x,
    y: pos.y,
    color: "red",
    width: grid - 1,
    height: grid - 1
  });
}

// we don't want the controls to update at 15fps so we'll update the movement
// outside the game loop for more tight feeling controls
bindKeys("left", function() {
  // prevent snake from backtracking on itself
  if (snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
});
bindKeys("up", function() {
  if (snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
});
bindKeys("right", function() {
  if (snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
});
bindKeys("down", function() {
  if (snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

const loop = GameLoop({
  fps: 15, // snake plays great at 15fps
  update: function() {
    snake.update();
  },
  render: function() {
    apple.render();
    snake.render();
  }
});

reset();
loop.start();
