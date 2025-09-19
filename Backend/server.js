require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const { initializeLogger } = require('./utils/logger');

// Import BOTH router files. This is the key to organizing the routes.
const apiRoutes = require('./routes/api');
const redirectRoutes = require('./routes/redirect');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // To parse JSON request bodies from clients like Postman

// --- Database Connection ---
// The connection options are no longer needed for recent versions of the driver.
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Successfully connected to MongoDB.");
    // Initialize the logger only after the database connection is successful.
    initializeLogger();
})
.catch(err => {
    console.error("Database connection error. Server is shutting down.", err);
    // If we can't connect to the DB, the app is useless. It's better to stop it.
    process.exit(1);
});


// --- Route Handling ---
// This is the simple, standard, and correct way to handle routing in Express.

// 1. All routes defined in 'apiRoutes' (e.g., POST /, GET /:shortcode)
//    will now be automatically prefixed with /shorturls.
//    - POST /              -> POST /shorturls
//    - GET /:shortcode     -> GET /shorturls/:shortcode
app.use('/shorturls', apiRoutes);

// 2. All routes defined in 'redirectRoutes' (e.g., GET /:shortcode)
//    will be handled at the root level.
//    - GET /:shortcode     -> GET /react-docs
app.use('/', redirectRoutes);


// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

