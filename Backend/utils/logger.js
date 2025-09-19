const axios = require('axios');

// This path is now correct. It goes up two levels from the current file
// to the project root, then finds the "Logging Middleware" folder.
const { setAuthToken, Log } = require('../../Logging Middleware/logger.js');

const AUTH_API_URL = 'http://20.244.56.144/evaluation-service/auth';

/**
 * Initializes the logger by fetching an auth token and passing it to the middleware.
 */
const initializeLogger = async () => {
  try {
    // Ensure your .env file is correctly populated with these values
    const registrationData = {
      email: process.env.YOUR_EMAIL,
      name: process.env.YOUR_NAME,
      rollNo: process.env.YOUR_ROLL_NO,
      accessCode: process.env.YOUR_ACCESS_CODE,
      clientID: process.env.LOGGING_CLIENT_ID,
      clientSecret: process.env.LOGGING_CLIENT_SECRET,
    };

    console.log("Attempting to get auth token for logging service...");
    const response = await axios.post(AUTH_API_URL, registrationData);
    const authToken = response.data.access_token;

    if (authToken) {
      // Call the setAuthToken function imported from our middleware
      setAuthToken(authToken);
      console.log("Logger has been successfully initialized.");
      // Send the first log message to confirm it works
      Log("backend", "info", "config", "Logging service authenticated and ready.");
    } else {
      throw new Error("Auth token was not found in the response from the server.");
    }
  } catch (error) {
    const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error("CRITICAL FAILURE: Could not initialize the logger.", errorMessage);
    // If logging can't start, the application is in an unstable state.
    // For this test, we allow it to continue, but in production, you might exit.
  }
};

// Export the initializer function and the Log function for use throughout the backend
module.exports = { initializeLogger, Log };

