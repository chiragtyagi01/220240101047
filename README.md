URL Shortener Microservice & Frontend
This repository contains the full-stack implementation of a URL shortener application, developed as part of a technical evaluation. The project consists of a backend microservice built with Node.js and Express, a responsive frontend application built with React, and a reusable logging middleware.

Features
URL Shortening: Convert long URLs into unique, short links.

Custom Shortcodes: Users can suggest their own custom short names for links.

Link Expiration: Set an optional validity period (in minutes) for each link, defaulting to 30 minutes.

Click Analytics: Track the total number of clicks for each shortened link.

Click History: View detailed click data, including timestamps and IP addresses.

Responsive Frontend: A clean user interface for shortening URLs (up to 5 concurrently) and viewing statistics.

Centralized Logging: All significant events on both the backend and frontend are captured and sent to a dedicated logging service.

Tech Stack
Backend: Node.js, Express.js, MongoDB (with Mongoose)

Frontend: React.js

Styling: Vanilla CSS

Utilities: Axios, CORS, Dotenv

Project Structure
The repository is organized into three main directories:

/
├── Backend/                   # Contains the Node.js/Express microservice
├── Frontend Test Submission/  # Contains the React.js client application
└── Logging Middleware/        # Contains the reusable logging utility

Setup and Installation
Follow these steps to get the application running locally.

Prerequisites
Node.js (v16 or later)

npm

MongoDB (either a local instance or a connection URI from MongoDB Atlas)

1. Clone the Repository
git clone <your-repository-url>
cd <your-repository-folder>

2. Set Up the Logging Middleware
The logging utility has its own dependency that needs to be installed.

cd "Logging Middleware"
npm install
cd ..

3. Set Up the Backend
Navigate to the Backend Directory:

cd Backend

Install Dependencies:

npm install

Create an Environment File:
Create a file named .env in the Backend directory and populate it with your specific configuration. Use the .env.example structure below.

.env.example

# Server Port
PORT=3000

# MongoDB Connection URI
MONGO_URI=mongodb://localhost:27017/url-shortener

# Application Base URL (for constructing short links)
BASE_URL=http://localhost:3000

# Credentials for the External Logging Service
LOGGING_CLIENT_ID=<Your_Client_ID>
LOGGING_CLIENT_SECRET=<Your_Client_Secret>

Start the Backend Server:

node server.js

The server should now be running on http://localhost:3000.

4. Set Up the Frontend
Open a new terminal window.

Navigate to the Frontend Directory:

cd "Frontend Test Submission"

Install Dependencies:

npm install

Start the React Application:

npm start

The frontend will open in your browser at http://localhost:5173.

API Endpoints
The backend microservice exposes the following endpoints:

POST /shorturls
Creates a new shortened URL.

Request Body:

{
    "url": "[https://your-long-url.com/path](https://your-long-url.com/path)",
    "validity": 60, // Optional, in minutes
    "shortcode": "custom-code" // Optional
}

Success Response (201 Created):

{
    "shortLink": "http://localhost:3001/custom-code",
    "expiry": "2025-09-19T20:30:00.000Z"
}

GET /shorturls
Retrieves a list of all shortened URLs for the statistics page.

Success Response (200 OK): An array of URL objects.

GET /shorturls/:shortcode
Retrieves detailed statistics for a specific short link.

Success Response (200 OK): A single URL object with its full click history.

GET /:shortcode
Redirects the user to the original long URL. This is the main functionality of the short link.
