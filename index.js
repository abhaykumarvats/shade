// Require and instantiate express
const express = require('express');
const app = express();

// Require path for path joining
const path = require('path');

// Retrieve port number from environment, or use 3000
const PORT = process.env.PORT || 3000;

// Require passport module for authentication
const passport = require('./passport');

// Require routes module for route handling
const routes = require('./routes');

// Serve static files from /public directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse body of incoming requests
app.use(express.urlencoded({ extended: false }));

// Instantiate passport and routes modules
passport(app);
routes(app);

// Start server and listen for requests
app.listen(PORT, () => console.log('Listening on port', PORT));
