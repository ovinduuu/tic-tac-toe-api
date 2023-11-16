const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passcode: { type: String, required: true },
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;