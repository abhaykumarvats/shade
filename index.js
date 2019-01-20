const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(port, () => console.log('Listening on port', port));
