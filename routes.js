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
  // GET requests handler, for /
  app.route('/').get((req, res) => {
    // Redirect to /home
    res.redirect('/home');
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
    // User is not logged in, redirect to /login
    else res.redirect('/login');
  });

  // GET requests handler, for /profile
  app.route('/profile').get((req, res) => {
    // Check if user is logged in
    if (req.isAuthenticated())
      // TODO: User is logged in, render profile page
      res.send('Profile page. <a href="/logout">Log Out.</a><br>' + req.user);
    // User is not logged in, redirect to /login
    else res.redirect('/login');
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
      else res.render('form', { type: 'login' });
    })
    .post(
      // Authenticate user with local strategy
      passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/login'
      })
    );

  // GET and POST requests handler, for /register
  app
    .route('/register')
    .get((req, res) => {
      // Check if user is logged in
      if (req.isAuthenticated())
        // User is logged in, redirect to /home
        res.redirect('/home');
      // User is not logged in, render register form
      else res.render('form', { type: 'register' });
    })
    .post(
      (req, res, next) => {
        // Find if user is already registered
        User.findOne({ username: req.body.username }, (err, user) => {
          // If error, pass it to next middleware
          if (err) next(err);
          // If user is already registered
          else if (user) res.redirect('/login');
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
              // If error, redirect to register page
              if (err) res.redirect('/register');
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
