// Require and instantiate express
const express = require('express');
const app = express();

// Require path for path-joining
const path = require('path');

// Retrieve port number from environment, or use 3000
const port = process.env.PORT || 3000;

// Set view engine as pug
app.set('view engine', 'pug');

// Serve static files from /public directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse body of incoming requests
app.use(express.urlencoded({ extended: false }));

// GET requests handler for / route
app.get('/', (req, res) => {
    // Redirect all the to /signup
    res.redirect('/signup');
});
});

// Start server and listen for requests
app.listen(port, () => console.log('Listening on port', port));
