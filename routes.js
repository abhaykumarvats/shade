// Require passport for authentication
const passport = require('passport');

// Require bcrypt for password hashing
const bcrypt = require('bcryptjs');

// Require path for path joining
const path = require('path');

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

  // GET requests handler, for /
  app.route('/').get((req, res) => {
    // Redirect to /login
    res.redirect('/login');
  });

  /**
   * TODO: Implement below two handlers
   */
  // GET requests handler, for /home
  app.route('/home').get((req, res) => {
    // Check if user is logged in
    if (req.isAuthenticated())
      // TODO: User is logged in, render home page
      res.send('Home page. <a href="/logout">Log Out.</a><br>' + req.user);
    // User is not logged in, render login form with alert
    else
      res.render('form', {
        type: 'login',
        alertMessage: 'Log in to Continue',
        alertType: 'danger'
      });
  });

  // GET requests handler, for /profile
  app.route('/profile').get((req, res) => {
    // Check if user is logged in
    if (req.isAuthenticated())
      res.render('profile', {
        name: req.user.name,
        username: req.user.username,
        consent: req.user.consent,
        joined: new Date(req.user.joined)
          .toDateString()
          .split(' ')
          .slice(1, 4)
          .join(' ')
      });
    // User is not logged in, render login form with alert
    else
      res.render('form', {
        type: 'login',
        alertMessage: 'Log in to Continue',
        alertType: 'danger'
      });
  });

  // GET and POST requests handler, for /login
  app
    .route('/login')
    .get((req, res) => {
      // Check if user is logged in
      if (req.isAuthenticated())
        // User is logged in, redirect to /home
        res.redirect('/home');
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
            // Successful login, redirect to /profile
            else res.redirect('/profile');
          });
      })(req, res, next);
    });

  // GET and POST requests handler, for /register
  app
    .route('/register')
    .get((req, res) => {
      // Check if user is logged in
      if (req.isAuthenticated())
        // User is logged in, redirect to /home
        res.redirect('/home');
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
            alertMessage: 'User Already Exists',
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

  // GET requests handler, for /check/:username
  app.route('/check/:username').get((req, res) => {
    // Check if user exists
    User.countDocuments({ username: req.params.username }, (err, count) => {
      // If error
      if (err) {
        console.error(err);
        res.send('Error');
      }
      // If user exists
      else if (count) res.json({ available: false });
      // User doesn't exist
      else res.json({ available: true });
    });
  });

  // GET requests handler, for /logout
  app.route('/logout').get((req, res) => {
    // Log user out
    req.logout();

    // Redirect to login page
    res.redirect('/login');
  });

  // 404 handler
  app.use((req, res) => {
    // Send 404.html
    res.sendFile(path.join(__dirname, 'views/404.html'));
  });
};
