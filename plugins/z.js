import pkg from 'canvas';
const { createCanvas } = pkg;

const games = {};

/**
 * Generates an image of the game board.
 * @param {Object} game - The game state object.
 * @returns {Buffer} - The image buffer representing the game board.
 */
function generateBoardImage(game) {
  const cellSize = 60; // Size of each cell
  const spacing = 5;   // Space between cells
  const padding = 20;  // Padding around the board
  const size = game.size; // Board size (e.g., 5x5)
  const canvasWidth = size * cellSize + (size - 1) * spacing + padding * 2;
  const canvasHeight = canvasWidth; // Square board
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  // Fill background with dark color
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Set font for cell markers
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Loop through each cell to draw the grid
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = padding + x * (cellSize + spacing);
      const py = padding + y * (cellSize + spacing);

      // Draw cell rectangle
      ctx.fillStyle = '#2a2a2a';
      ctx.fillRect(px, py, cellSize, cellSize);

      // Get the cell status
      const status = game.board[y][x];

      // Draw markers based on status
      if (status === 'miss') {
        ctx.fillStyle = 'white';
        ctx.fillText('•', px + cellSize / 2, py + cellSize / 2);
      }
      if (status === 'hit') {
        ctx.fillStyle = 'red';
        ctx.fillText('X', px + cellSize / 2, py + cellSize / 2);
      }
    }
  }

  return canvas.toBuffer();
}

/**
 * Creates a new game with a random ship placement.
 * @param {string} chat - The chat identifier.
 */
function createGame(chat) {
  const size = 5; // Board size (5x5)
  const ships = 3; // Number of ships
  const board = Array(size).fill(null).map(() => Array(size).fill(''));

  // Randomly place ships
  let placed = 0;
  while (placed < ships) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    if (!board[y][x]) {
      board[y][x] = 'ship';
      placed++;
    }
  }

  // Store game state
  games[chat] = { size, shipsLeft: ships, board };
}

/**
 * Main handler for game commands and moves.
 * @param {Object} m - Message object.
 * @param {Object} params - Additional parameters including connection, command, and text.
 */
async function handler(m, { conn, command, text }) {
  const chat = m.chat;

  if (command === 'battaglianavale') {
    // Start a new game
    createGame(chat);
    const img = generateBoardImage(games[chat]);
    await conn.sendMessage(chat, { image: img, caption: 'Battaglia Navale started! Reply with coordinates like A1.' });
    return;
  }

  // If no game exists in this chat, do nothing
  if (!games[chat]) return;

  // Process user input
  const input = text.trim().toUpperCase();
  if (!/^[A-E][1-5]$/.test(input)) return; // Validate input

  const x = input.charCodeAt(0) - 65; // Convert letter to index (A=0)
  const y = parseInt(input[1]) - 1;   // Convert number to index

  const game = games[chat];

  // Check if cell was already targeted
  if (game.board[y][x] === 'hit' || game.board[y][x] === 'miss') {
    await conn.sendMessage(chat, { text: 'You already fired at this location.' });
    return;
  }

  // Process shot
  if (game.board[y][x] === 'ship') {
    game.board[y][x] = 'hit';
    game.shipsLeft--;
  } else {
    game.board[y][x] = 'miss';
  }

  // Generate updated board image
  const img = generateBoardImage(game);
  let caption = `Ships remaining: ${game.shipsLeft}`;

  // Check for victory
  if (game.shipsLeft === 0) {
    caption = 'You won!';
    delete games[chat]; // End game
  }

  // Send updated game board
  await conn.sendMessage(chat, { image: img, caption });
}

handler.command = ['battaglia'];
export default handler;
      
