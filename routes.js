// Require passport for authentication
const passport = require('passport');

// Require bcrypt for password hashing
const bcrypt = require('bcryptjs');

// Require models
const User = require('./schemas/User');
const Post = require('./schemas/Post');

// Export routes module
module.exports = (app) => {
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

  // Function to validate registration inputs
  function validateRegistrationInputs(req, res, next) {
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
    .post(validateRegistrationInputs, (req, res) => {
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
                alertMessage: 'Registration Successful!',
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

  // Function to check username existence
  function checkUsernameExistence(req, res, next) {
    // Check if username exists
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

  // GET requests handler, for /:username
  app.route('/:username').get(checkUsernameExistence, (req, res) => {
    const paramUsername = req.params.username;

    // If user is logged in
    if (req.isAuthenticated()) {
      const currentUsername = req.user.username;

      // If user is accesssing own profile
      if (paramUsername === currentUsername) {
        // Render user's own profile
        res.render('profile', { type: 'own', username: currentUsername });
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
                connections.friends.includes(currentUsername) ||
                connections.family.includes(currentUsername) ||
                connections.acquaintances.includes(currentUsername)
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

  // Function to validate post
  function validatePost(req, res, next) {
    const content = req.body.content;
    const audience = req.body.audience;

    // If content is empty or audience is not selected
    if (!content.length || audience === '0') {
      // Render error view
      res.render('error', { errorMessage: 'Invalid Post' });
    }
    // Proceed with posting
    else return next();
  }

  // POST requests handler, for /:username/post
  app.route('/:username/post').post(validatePost, (req, res) => {
    // If user is logged in
    if (req.isAuthenticated()) {
      const paramUsername = req.params.username;
      const currentUsername = req.user.username;

      // If requested username and current username are same
      if (paramUsername === currentUsername) {
        const content = req.body.content;
        const audience = req.body.audience;

        // If audience is set to 'public'
        if (audience === 'public') {
          // Prepare post object
          const post = {
            username: username,
            content: content,
            meantFor: ['public']
          };

          // Save post in database
          Post.create(post, (err, post) => {
            // If error
            if (err) {
              // Log error
              console.error(err);

              // Render error view
              res.render('error', { errorMessage: 'An Error Occured' });
            }
            // Post saved successfully, redirect to /username
            else res.redirect('/' + username);
          });
        } else {
          // TODO
        }
      }
      // Requested username and current username are not same
      else res.render('error', { errorMessage: 'Not Allowed' });
    }
    // User is not logged in
    else res.redirect('/login');
  });

  // GET requests handler, for /:username/about
  app.route('/:username/about').get((req, res) => {
    // If user is logged in
    if (req.isAuthenticated()) {
      // Retrieve username, consent, joined fields of requested user
      User.findOne(
        { username: req.params.username },
        '-_id consent joined',
        (err, user) => {
          // If error
          if (err) {
            // Log error
            console.error(err);

            // Render error view
            res.render('error', { errorMessage: 'An Error Occured' });
          } else {
            // Send user object as json
            res.json(user);
          }
        }
      );
    }
    // User is not logged in, redirect to /login
    else res.redirect('/login');
  });

  // Function to validate new fields
  function validateNewFields(req, res, next) {
    const field = req.params.field;

    // If username change is required
    if (field === 'username') {
      const username = req.body.new_username;

      // If username is invalid
      if (username.match(/[^a-z]/i) || username.length < 4)
        // Render error view
        res.render('error', { errorMessage: 'Invalid Username' });
      // Continue with username change
      else return next();
    }
    // If password change is required
    else if (field === 'password') {
      // If old password is invalid
      if (req.body.old_password.length < 6)
        // Render error view
        res.render('error', { errorMessage: 'Wrong Old Password' });
      // If new password is invalid
      else if (req.body.new_password.length < 6)
        // Render error view
        res.render('error', { errorMessage: 'Invalid New Password' });
      // Continue with password change
      else return next();
    }
  }

  // POST requests handler, for /:username/change/:field
  app.route('/:username/change/:field').post(validateNewFields, (req, res) => {
    // If user is logged in
    if (req.isAuthenticated()) {
      const paramUsername = req.params.username;
      const currentUsername = req.user.username;
      const field = req.params.field;

      // If requested user is same as current user
      if (paramUsername === currentUsername) {
        // If username change is required
        if (field === 'username') {
          const newUsername = req.body.new_username;
          const password = req.body.password;

          // Check new username existence
          User.countDocuments({ username: newUsername }, (err, count) => {
            // If error
            if (err) {
              // Log error
              console.error(err);

              // Render error view
              res.render('error', { errorMessage: 'An Error Occured' });
            }
            // If username is not available
            else if (count) {
              // Render error view
              res.render('error', { errorMessage: 'Username Not Available' });
            }
            // Check if entered password is correct
            else {
              User.findOne(
                { username: currentUsername },
                'password',
                (err, user) => {
                  // If error
                  if (err) {
                    // Log error
                    console.error(err);

                    // Render error view
                    res.render('error', { errorMessage: 'An Error Occured' });
                  }
                  // If entered password is not correct
                  else if (!bcrypt.compareSync(password, user.password))
                    // Render error view
                    res.render('error', {
                      errorMessage: 'Wrong Password Entered'
                    });
                  // Password is correct, change username
                  else {
                    User.updateOne(
                      { username: currentUsername },
                      { username: newUsername },
                      (err, raw) => {
                        // If error
                        if (err) {
                          // Log error
                          console.error(err);

                          // Render error view
                          res.render('error', {
                            errorMessage: 'An Error Occured'
                          });
                        }
                        // Username change successful
                        else {
                          // Log user out
                          req.logout();

                          // Render login form with alert
                          res.render('form', {
                            type: 'login',
                            alertMessage: 'Username Changed Successfully!',
                            alertType: 'success'
                          });
                        }
                      }
                    );
                  }
                }
              );
            }
          });
        }
        // If password change is required
        else if (field === 'password') {
          const oldPassword = req.body.old_password;
          const newPassword = req.body.new_password;

          // Retrieve saved password
          User.findOne(
            { username: currentUsername },
            'password',
            (err, user) => {
              // If error
              if (err) {
                // Log error
                console.error(err);

                // Render error view
                res.render('error', { errorMessage: 'An Error Occured' });
              }
              // If wrong password is entered
              else if (!bcrypt.compareSync(oldPassword, user.password))
                // Render error view
                res.render('error', { errorMessage: 'Wrong Old Password' });
              else {
                // Convert new password into its hash
                const hashedPassword = bcrypt.hashSync(newPassword, 8);
                // Change password
                User.updateOne(
                  { username: currentUsername },
                  { password: hashedPassword },
                  (err, raw) => {
                    // If error
                    if (err) {
                      // Log error
                      console.error(err);

                      // Render error view
                      res.render('error', { errorMessage: 'An Error Occured' });
                    }
                    // Password changed successfully
                    else {
                      // Log user out
                      req.logout();

                      // Render login form with alert
                      res.render('form', {
                        type: 'login',
                        alertMessage: 'Password Changed Successfully!',
                        alertType: 'success'
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
      // Requested user is not same as current user
      else res.render('error', { errorMessage: 'Not Allowed' });
    }
    // User is not logged in, redirect to /login
    else res.redirect('/login');
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
