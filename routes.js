// Require passport for authentication
const passport = require('passport');

// Require bcrypt for password hashing
const bcrypt = require('bcryptjs');

// Require User model
const User = require('./schemas/User');

// Export routes module
module.exports = (app) => {
  // Function to validate registration inputs
  function validateInputs(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    // If username is invalid
    if (username.match(/[^a-z]/i) || username.length < 4)
      // Render register form with alert
      res.render('form', {
        type: 'register',
        alertMessage: 'Invalid Username',
        alertType: 'danger'
      });
    // If password is invalid
    else if (password.length < 6)
      // Render register form with alert
      res.render('form', {
        type: 'register',
        alertMessage: 'Invalid Password',
        alertType: 'danger'
      });
    // Continue with registration
    else return next();
  }

  // Function to check username existence
  function checkUsername(req, res, next) {
    // Check is username exists
    User.countDocuments({ username: req.params.username }, (err, count) => {
      // If error
      if (err) {
        // Log error
        console.error(err);

        // Render error view
        res.render('error', { errorMessage: 'An Error Occured' });
      }
      // Username doesn't exist, render error view
      else if (!count) res.render('error', { errorMessage: 'No Such User' });
      // Username exists
      else return next();
    });
  }

  // GET requests handler, for /
  app.route('/').get((req, res) => {
    // Check if user is logged in
    if (req.isAuthenticated())
      // User is logged in, render home page
      res.render('home', { username: req.user.username });
    // Redirect to /login
    else res.redirect('/login');
  });

  // GET and POST requests handler, for /login
  app
    .route('/login')
    .get((req, res) => {
      // Check if user is logged in
      if (req.isAuthenticated())
        // User is logged in, redirect to /
        res.redirect('/');
      // User is not logged in, render login form
      else res.render('form', { type: 'login', alertMessage: null });
    })
    .post((req, res, next) => {
      // Authenticate user with LocalStrategy
      passport.authenticate('local', (err, user, message) => {
        // If error
        if (err) {
          // Log error
          console.error(err);

          // Render login form with alert
          res.render('form', {
            type: 'login',
            alertMessage: 'An Error Occured',
            alertType: 'danger'
          });
        }
        // If user not found, render login form with alert
        else if (!user)
          res.render('form', {
            type: 'login',
            alertMessage: message,
            alertType: 'danger'
          });
        // User found, try to log in
        else
          req.login(user, (err) => {
            // If error
            if (err) {
              // Log error
              console.error(err);

              // Render login form with alert
              res.render('form', {
                type: 'login',
                alertMessage: 'An Error Occured',
                alertType: 'danger'
              });
            }
            // Successful login, redirect to /
            else res.redirect('/');
          });
      })(req, res, next);
    });

  // GET and POST requests handler, for /register
  app
    .route('/register')
    .get((req, res) => {
      // Check if user is logged in
      if (req.isAuthenticated())
        // User is logged in, redirect to /
        res.redirect('/');
      // User is not logged in, render register form
      else res.render('form', { type: 'register', alertMessage: null });
    })
    .post(validateInputs, (req, res) => {
      // Find if user is already registered
      User.findOne({ username: req.body.username }, (err, user) => {
        // If error
        if (err) {
          // Log error
          console.error(err);

          // Render register form with alert
          res.render('form', {
            type: 'register',
            alertMessage: 'An Error Occured',
            alertType: 'danger'
          });
        }
        // If user is already registered, render register form with alert
        else if (user)
          res.render('form', {
            type: 'register',
            alertMessage: 'User Already Registered',
            alertType: 'danger'
          });
        // Else, proceed with registration
        else {
          // Convert password into its hash
          const hashedPassword = bcrypt.hashSync(req.body.password, 8);

          // Prepare user object
          const user = {
            username: req.body.username,
            password: hashedPassword,
            consent: req.body.consent ? true : false
          };

          // Save new user into database
          User.create(user, (err, user) => {
            // If error
            if (err) {
              // Log error
              console.error(err);

              // Render register form with alert
              res.render('form', {
                type: 'register',
                alertMessage: 'An Error Occured',
                alertType: 'danger'
              });
            }
            // Registration successful, render login form with alert
            else
              res.render('form', {
                type: 'login',
                alertMessage: 'Registration Successful',
                alertType: 'success'
              });
          });
        }
      });
    });

  // GET requests handler, for /logout
  app.route('/logout').get((req, res) => {
    // Log user out
    req.logout();

    // Redirect to login page
    res.redirect('/login');
  });

  // GET requests handler, for /:username
  app.route('/:username').get(checkUsername, (req, res) => {
    const paramUsername = req.params.username;

    // If user is logged in
    if (req.isAuthenticated()) {
      const loggedUsername = req.user.username;

      // If user is accesssing own profile
      if (paramUsername === loggedUsername) {
        // Render user's own profile
        res.render('profile', { type: 'own', username: loggedUsername });
      }
      // User is accessing other's profile
      else {
        // Check if user is in connections
        User.findOne(
          { username: paramUsername },
          'connections',
          (err, user) => {
            // If error
            if (err) {
              // Log error
              console.error(err);

              // Render error view
              res.render('error', { errorMessage: 'An Error Occured' });
            } else {
              const connections = user.connections;

              // User is in in conenctions
              if (
                connections.friends.includes(loggedUsername) ||
                connections.family.includes(loggedUsername) ||
                connections.acquaintances.includes(loggedUsername)
              )
                // Render user specific profile
                res.render('profile', {
                  type: 'other',
                  username: paramUsername
                });
              // User is not in connections, render public profile
              else
                res.render('profile', {
                  type: 'public',
                  username: paramUsername
                });
            }
          }
        );
      }
    }
    // User is not logged in, render public profile
    else {
      res.render('profile', { type: 'public', username: paramUsername });
    }
  });

  // GET requests handler, for /check/:username
  app.route('/check/:username').get((req, res) => {
    // Check if user is already registered
    User.countDocuments({ username: req.params.username }, (err, count) => {
      // If error
      if (err) {
        console.error(err);
        res.render('error', { errorMessage: 'An Error Occured' });
      }
      // If user is already registered
      else if (count) res.json({ available: false });
      // User isn't registered
      else res.json({ available: true });
    });
  });

  // Error handler
  app.use((req, res) => {
    // Render error view
    res.render('error', { errorMessage: 'Not Found' });
  });
};
