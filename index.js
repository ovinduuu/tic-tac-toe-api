const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const playerRoutes = require('./src/routes/playerRoutes');
const gameRoutes = require('./src/routes/gameRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use('/players', playerRoutes);
app.use('/games', gameRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});