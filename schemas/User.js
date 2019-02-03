// Require mongoose
const mongoose = require('mongoose');

// Connect mongoose to database
mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useCreateIndex: true
});

// Create userSchema from mongoose.Schema
const userSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    lowercase: true,
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
  },
  joined: {
    type: Date,
    default: Date.now
  },
  connections: {
    friends: [String],
    family: [String],
    acquaintances: [String],
    pending: [String]
  },
  notifs: [
    {
      notifType: String,
      notifContent: String
    }
  ]
});

// Convert userSchema into User model, and export
module.exports = mongoose.model('User', userSchema);
