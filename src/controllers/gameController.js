const Game = require('../models/Game');
const Player = require('../models/Player');

// Start a new game function
const startNewGame = async (req, res) => {
  try {
    const { username } = req.params;

    // Find the player by username
    const player = await Player.findOne({ username });

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Check if the player already has an ongoing game
    const existingGame = await Game.findOne({ $or: [{ playerX: player._id }, { playerO: player._id }, { winner: null }] });
    
    // If there's an existing game with only one player, assign the current player to that game
    if (existingGame && !existingGame.playerO) {
      existingGame.playerO = player._id;
      existingGame.turn = Math.random() < 0.5 ? 'X' : 'O';
      await existingGame.save();
      return res.status(200).json({ message: 'Joined an existing game', gameId: existingGame._id, firstTurn: existingGame.turn });
    }

    // Choose randomly who goes first (X or O)
    const firstTurn = Math.random() < 0.5 ? 'X' : 'O';

    // Create a new game with both players assigned
    const newGame = new Game({
      playerX: player._id,
      playerO: null, // If there's no other player, set playerO to null
      board: Array(9).fill(null),
      turn: firstTurn,
      winner: null,
    });
    await newGame.save();

    return res.status(201).json({ message: 'New game started', gameId: newGame._id, firstTurn });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Reset an ongoing game function
const resetGame = async (req, res) => {
  try {
    const { gameId } = req.params;

    // Find the game by ID
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Clear the game board and reset the turn
    game.board = Array(9).fill(null);
    game.turn = 'X';
    game.winner = null;
    await game.save();

    return res.status(200).json({ message: 'Game reset successfully', gameId: game._id, turn: game.turn });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Play a turn function
const playTurn = async (req, res) => {
  try {
    const { gameId, username, position } = req.body;

    // Find the game by ID
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Find the player by username
    const player = await Player.findOne({ username });
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    //check player symbol
    let symbol = "O";
    if (game.playerX.equals(player._id)) {
      symbol = "X";
    }

    // Validate the player's turn
    if (game.turn !== symbol) {
      return res.status(400).json({ error: 'It is not the turn of player'+symbol });
    }

    // Validate the position
    if (position < 0 || position >= 9 || game.board[position] !== null) {
      return res.status(400).json({ error: 'Invalid position' });
    }

    // Update the game board
    game.board[position] = symbol;

    // Check for a winner or a draw
    if (checkWinner(game.board)) {
      game.winner = symbol;
    } else if (game.board.every((cell) => cell !== null)) {
      game.winner = 'draw';
    }

    // Switch the turn to the other player
    game.turn = game.turn === 'X' ? 'O' : 'X';

    await game.save();

    return res.status(200).json({
      message: 'Turn played successfully',
      gameId: game._id,
      board: game.board,
      turn: game.turn,
      winner: game.winner,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to check for a winner
const checkWinner = (board) => {
  // Define winning combinations
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6],            // Diagonals
  ];

  // Check for a winner
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] === board[b] && board[a] === board[c] && board[b] === board[c] && board[a] !== null) {
      return true;
    }
  }

  return false;
};

module.exports = {
  startNewGame,
  resetGame,
  playTurn,
};
