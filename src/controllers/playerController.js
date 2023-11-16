const Player = require('../models/Player');

// Player registration function
const registerPlayer = async (req, res) => {
  try {
    const { username, passcode } = req.body;

    // Validate input
    if (!username || !passcode) {
      return res.status(400).json({ error: 'Username and passcode are required' });
    }

    // Check if the username already exists
    const existingPlayer = await Player.findOne({ username });
    if (existingPlayer) {
      return res.status(409).json({ error: 'Username already exists. Please choose a different username.' });
    }

    // Create a new player
    const newPlayer = new Player({ username, passcode });
    await newPlayer.save();

    return res.status(201).json({ message: 'Player registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  registerPlayer,
};
