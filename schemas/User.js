const mongoose = require('mongoose');
mongoose.connect(
    process.env.DATABASE_URI,
    { useNewUrlParser: true }
);

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    consent: Boolean
});

module.exports = mongoose.model('User', userSchema);
