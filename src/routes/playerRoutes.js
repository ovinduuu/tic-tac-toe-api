const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

// Player registration route
router.post('/register', playerController.registerPlayer);

module.exports = router;