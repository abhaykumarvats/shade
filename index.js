// Require and instantiate express
const express = require('express');
const app = express();

// Require User schema
const User = require('./schemas/User');

// Require path for path-joining
const path = require('path');

// Retrieve port number from environment, or use 3000
const PORT = process.env.PORT || 3000;

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

// GET and POST requests handler for /signup
app.route('/signup')
    .get((req, res) => {
        // Send signup.html
        res.sendFile(path.join(__dirname, 'public/signup.html'));
    })
    .post((req, res) => {
        // Prepare user object
        const user = {
            username: req.body.username,
            password: req.body.password,
            consent: req.body.consent ? true : false
        };

        console.log('Consent:', req.body.consent);

        // Create and save user object into database
        User.create(user, (err, userRecord) => {
            // Log error, if any
            if (err) console.error(err);

            // Log returned user record
            console.log(userRecord);

            // Redirect to /login page
            res.redirect('/login');
        });
    });

// GET requests handler for /login
app.get('/login', (req, res) => {
    // Send login.html
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

// Start server and listen for requests
app.listen(PORT, () => console.log('Listening on port', PORT));
