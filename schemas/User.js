const mongoose = require('mongoose');
mongoose.connect(
    process.env.DATABASE_URI,
    { useNewUrlParser: true }
);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    consent: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);
