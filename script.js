// --- Setup ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d"); // ctx is our "paintbrush" for drawing on the canvas

const box = 20; // size of each grid square (snake moves in steps of 20px)
const gridSize = canvas.width / box; // how many squares fit across (400 / 20 = 20)

// The snake is an array of {x, y} positions, in grid units (not pixels).
// It starts as a single segment in the middle of the board.
let snake = [{ x: 10, y: 10 }];

// Direction the snake is moving. dx/dy are added to the head each tick.
let dx = 0;
let dy = 0;

// Food starts at a random grid position.
let food = randomFoodPosition();

let score = 0;
let gameOver = false;

// --- Handle keyboard input ---
document.addEventListener("keydown", (e) => {
  // Prevent the snake from reversing directly into itself.
  if (e.key === "ArrowUp" && dy !== 1) { dx = 0; dy = -1; }
  else if (e.key === "ArrowDown" && dy !== -1) { dx = 0; dy = 1; }
  else if (e.key === "ArrowLeft" && dx !== 1) { dx = -1; dy = 0; }
  else if (e.key === "ArrowRight" && dx !== -1) { dx = 1; dy = 0; }
});

// --- Game loop ---
// setInterval calls `tick` repeatedly, like a heartbeat for the game.
const game = setInterval(tick, 150);

function tick() {
  if (gameOver) return;

  update();
  draw();
}

function update() {
  // Don't move until the player presses a direction key.
  if (dx === 0 && dy === 0) return;

  // New head position = old head + direction.
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Check wall collision.
  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
    return endGame();
  }

  // Check self collision (does the new head hit any existing body segment?).
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    return endGame();
  }

  snake.unshift(head); // add new head to the front

  if (head.x === food.x && head.y === food.y) {
    // Ate the food: grow (don't remove tail), update score, place new food.
    score++;
    document.getElementById("score").textContent = score;
    food = randomFoodPosition();
  } else {
    snake.pop(); // remove tail so the snake doesn't grow every step
  }
}

function draw() {
  // Clear the whole canvas before redrawing each frame.
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the snake, one square per segment.
  ctx.fillStyle = "limegreen";
  snake.forEach(segment => {
    ctx.fillRect(segment.x * box, segment.y * box, box - 1, box - 1);
  });

  // Draw the food.
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * box, food.y * box, box - 1, box - 1);
}

function randomFoodPosition() {
  return {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize)
  };
}

function endGame() {
  gameOver = true;
  clearInterval(game);
  document.getElementById("message").textContent =
    `Game over! Final score: ${score}. Refresh the page to play again.`;
}
