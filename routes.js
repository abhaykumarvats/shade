// Require User model
const User = require('./schemas/User');

// Require passport for authentication
const passport = require('passport');

// Require bcrypt for password hashing
const bcrypt = require('bcryptjs');

// Require path for path joining
const path = require('path');

// Export routes module
module.exports = (app) => {
  // Function to check if user is logged in
  function ensureAuthentication(req, res, next) {
    // Check if user is logged in
    if (req.isAuthenticated()) return next();

    // User is not logged in
    res.redirect('/login');
  }

  // GET requests handler, for / route
  app.route('/').get(ensureAuthentication, (req, res) => {
    // Redirect to home page
    res.redirect('/home');
  });

  /**
   * TODO: Implement below two handlers
   */
  app.route('/home').get(ensureAuthentication, (req, res) => {
    // TODO: Render home page
    res.send('Home page. <a href="/logout">Log Out</a>');
  });

  app.route('/profile').get(ensureAuthentication, (req, res) => {
    // TODO: Render profile page
    res.send('Profile page. <a href="/logout">Log Out</a>');
  });

  // GET and POST requests handler, for /register
  app
    .route('/register')
    .get((req, res) => {
      // Render register page
      res.render('login', { type: 'register' });
    })
    .post(
      (req, res, next) => {
        // Find if user is already registered
        User.findOne({ username: req.body.username }, (err, user) => {
          // If error, pass it to next middleware
          if (err) next(err);
          // If user is already registered
          else if (user) res.redirect('/');
          // Proceed with registration
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
              // If error, redirect to homepage
              if (err) res.redirect('/');
              // Else, pass new user object to next middleware
              else next(null, user);
            });
          }
        });
      },
      passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/register'
      })
    );

  // GET and POST requests handler, for /login
  app
    .route('/login')
    .get((req, res) => {
      // Render login page
      res.render('login', { type: 'login' });
    })
    .post(
      // Authenticate user with local strategy
      passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/login'
      })
    );

  // GET requests handler, for /logout
  app.route('/logout').get((req, res) => {
    // Log user out
    req.logout();

    // Redirect to homepage
    res.redirect('/login');
  });

  // 404 handler
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'views/404.html'));
  });
};
