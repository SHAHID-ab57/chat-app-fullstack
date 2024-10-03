const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require("dotenv").config();

const connectDB = require("./Config/connectDB");
const router = require("./Config/routes/index");
const { app, httpServer } = require("./Config/Socket/socket");

// Middleware setup
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());  // Replaces body-parser for JSON
app.use(cookieParser());  // Parse cookies

// Routes
app.get('/', (req, res) => {
  res.json({
    name: 'John Doe',
    age: 30,
    city: 'New York',
  });
});

app.use('/api', router);

// Connect to database and start the server
const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to the database:', err);
  });
