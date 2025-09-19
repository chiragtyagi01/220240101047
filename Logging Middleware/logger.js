// This file defines the reusable logging functions.
// It uses the CommonJS module system ('require' and 'module.exports') to be
// compatible with a standard Node.js backend environment.

const axios = require('axios'); // We use axios to make HTTP requests.

// The static API endpoint provided in the documentation.
const LOGGING_API_URL = 'http://20.244.56.144/evaluation-service/logs';

// This is a private variable within this module. It will store the
// authorization token once it's provided by the application.
let authToken = null;

/**
 * Stores the authorization token required for making authenticated API calls.
 * This function MUST be called once successfully before any calls to Log().
 * @param {string} token - The Bearer token obtained from the authentication server.
 */
function setAuthToken(token) {
  if (!token) {
    console.error("Logger Setup Error: The auth token provided was null or empty.");
    return;
  }
  authToken = token;
}

/**
 * Asynchronously sends a log entry to the central logging service.
 * @param {('backend'|'frontend')} stack - The part of the application sending the log.
 * @param {('debug'|'info'|'warn'|'error'|'fatal')} level - The severity level of the log.
 * @param {string} package_ - The specific module or component where the log originates.
 * @param {string} message - The descriptive log message.
 */
async function Log(stack, level, package_, message) {
  // Failsafe: If the token was never set, we cannot proceed.
  if (!authToken) {
    console.error("Logger Runtime Error: Auth token has not been set. Cannot send log. Please call setAuthToken() first.");
    return;
  }

  // Construct the request body in the format required by the API.
  const logData = {
    stack,
    level,
    package: package_, // 'package' is a reserved keyword, but it's fine as an object key.
    message,
  };

  try {
    // Make the authenticated POST request to the logging server.
    await axios.post(LOGGING_API_URL, logData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });
  } catch (error) {
    // If the logging service itself fails, we must output the error
    // and the original log message to the console to avoid losing information.
    console.error(
      `CRITICAL: The attempt to send a log to the server failed.`,
      {
        // Details about why the API call failed (e.g., status code, error message from server)
        errorDetails: error.response ? JSON.stringify(error.response.data) : error.message,
        // The original log message we were trying to send
        originalLogMessage: logData
      }
    );
  }
}

// Export the functions to make them available for other files to import.
module.exports = {
  setAuthToken,
  Log,
};

