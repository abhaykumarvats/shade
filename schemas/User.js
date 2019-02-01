// Require mongoose
const mongoose = require('mongoose');

// Connect mongoose to database
mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useCreateIndex: true
});

// Create userSchema from mongoose.Schema
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

// Convert userSchema into User model and export
module.exports = mongoose.model('User', userSchema);
