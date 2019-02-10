// Require and instantiate express
const express = require('express');
const app = express();

// Require path for path joining
const path = require('path');

// Retrieve port number from environment, or use 3000
const port = process.env.PORT || 3000;

// Require passport module for authentication
const passport = require('./passport/passport');

// Require routes modules for route handling
const loginRoutes = require('./routes/login-routes');
const profileRoutes = require('./routes/profile-routes');
const helperRoutes = require('./routes/helper-routes');

// Serve static files from /public directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Parse body of all incoming requests
app.use(express.urlencoded({ extended: false }));

// Set ejs as view engine
app.set('view engine', 'ejs');

// Instantiate modules
passport(app);
loginRoutes(app);
profileRoutes(app);
helperRoutes(app);

// Start server and listen for requests
app.listen(port, () => console.log('Listening on port', port));
