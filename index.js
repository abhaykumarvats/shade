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

// Require path for path joining
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

// Function to serialise user
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Function to deserialise user
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Implement a passport LocalStrategy
passport.use(
  new LocalStrategy((username, password, done) => {
    // Try to find user in database
    User.findOne({ username: username }, (err, user) => {
      // Error in retrieving user
      if (err) return done(err);

      // Incorrect username
      if (!user) return done(null, false, { message: 'Incorrect username.' });

      // Incorrect password
      if (!bcrypt.compareSync(password, user.password))
        return done(null, false, { message: 'Incorrect password.' });

      // Correct username and password
      return done(null, user);
    });
  })
);

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
  .post(
    // Authenticate user with local strategy
    passport.authenticate('local', {
      successRedirect: '/profile',
      failureRedirect: '/login',
      failureFlash: true
    })
  );

// Start server and listen for requests
app.listen(PORT, () => console.log('Listening on port', PORT));
