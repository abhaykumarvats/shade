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

        // Create and save user object into database
        User.create(user, (err, userRecord) => {
            // Send error as response, if any, and return
            if (err.errmsg.includes('duplicate key error')) {
                res.send('Username not available.');
                return;
            }

            // Log returned user record
            console.log(userRecord);

            // Redirect to /login page
            res.redirect('/login');
        });
    });

// GET and POST requests handler for /login
app.route('/login')
    .get((req, res) => {
        // Send login.html
        res.sendFile(path.join(__dirname, 'public/login.html'));
    })
    .post((req, res) => {
        // Prepare user object
        const user = {
            username: req.body.username,
            password: req.body.password
        };

        // Try to find user
        User.findOne(user, 'username consent', (err, userRecord) => {
            // Log error, if any
            if (err) console.error(err);

            // Send response as json, if found
            userRecord ? res.json(userRecord) : res.send('No such user.');
        });
    });

// Start server and listen for requests
app.listen(PORT, () => console.log('Listening on port', PORT));
