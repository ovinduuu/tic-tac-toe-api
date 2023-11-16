const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Start a new game route
router.post('/start/:username', gameController.startNewGame);

// Reset an ongoing game route
router.post('/reset/:gameId', gameController.resetGame);

// Play a turn route
router.post('/play', gameController.playTurn);

module.exports = router;