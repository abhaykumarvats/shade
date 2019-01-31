// Require and instantiate express
const express = require('express');
const app = express();

// Require express-session and passport for authentication
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Require bcryptjs for password hashing
const bcrypt = require('bcryptjs');

// Require User schema
const User = require('./schemas/User');

// Require path for path-joining
const path = require('path');

// Retrieve port number from environment, or use 3000
const PORT = process.env.PORT || 3000;

// Serve static files from /public directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse body of incoming requests
app.use(express.urlencoded({ extended: false }));

// Initialise express- and passport session
app.use(session({ secret: process.env.SECRET }));
app.use(passport.initialize());
app.use(passport.session());

// GET requests handler, for / route
app.get('/', (req, res) => {
  // Send main.html
  res.sendFile(path.join(__dirname, 'public/main.html'));
});

// GET and POST requests handler, for /signup
app
  .route('/signup')
  .get((req, res) => {
    // Redirect to main page
    res.redirect('/');
  })
  .post((req, res) => {
    // Prepare user object
    const user = {
      username: req.body.username,
      password: req.body.password,
      consent: req.body.consent ? true : false
    };

    // Create and save user object into database
    User.create(user, (err, userRecord) => {
      // Log error, if any
      if (err) {
        res.redirect('/');
        return console.error(err);
      }

      // Log returned user record
      console.log(userRecord);

      // Redirect to / page
      res.redirect('/');
    });
  });

// GET and POST requests handler, for /login
app
  .route('/login')
  .get((req, res) => {
    // Redirect to main page
    res.redirect('/');
  })
  .post((req, res) => {
    // Prepare user object
    const user = {
      username: req.body.username,
      password: req.body.password
    };

    // Try to find user
    User.findOne(user, '-_id username consent', (err, userRecord) => {
      // Log error, if any
      if (err) {
        res.redirect('/');
        return console.error(err);
      }

      // Send response as json, if found
      userRecord ? res.json(userRecord) : res.send('<h1>No such user.</h1>');
    });
  });

// Start server and listen for requests
app.listen(PORT, () => console.log('Listening on port', PORT));
