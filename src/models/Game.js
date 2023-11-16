const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  playerX: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  playerO: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  board: { type: Array, default: [], required: true },
  turn: { type: String, enum: ['X', 'O'], default: 'X' },
  winner: { type: String, enum: ['X', 'O', 'draw', null], default: null },
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
