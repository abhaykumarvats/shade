const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URI);

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    shaded: Boolean
});

module.exports = mongoose.model('User', userSchema);
