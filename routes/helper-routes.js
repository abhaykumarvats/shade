// Require User model
const User = require('../schemas/User');

// Export helper-routes module
module.exports = (app) => {
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
