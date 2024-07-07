// Import required packages
const express = require('express');
require('dotenv').config(); // Load environment variables

// Create an Express app instance
const app = express();

// Middleware to parse URL-encoded data and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Replaces body-parser

// Connect to MongoDB
const connectToMongoDB = require('./models/dbConfigure');
connectToMongoDB();

// Router linking
const userRouter = require('./routes/users');
const postRouter = require('./routes/posts');
app.use('/users', userRouter);
app.use('/posts', postRouter);

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3000; // Default port if not specified in env
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
