// Require mongoose
const mongoose = require('mongoose');

// Connect mongoose to database
mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useCreateIndex: true
});

// Create postSchema from mongoose.Schema
const postSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  postedOn: {
    type: Date,
    default: Date.now
  },
  meantFor: {
    type: [String],
    required: true
  },
  seenBy: [String]
});

// Convert postSchema into Post model, and export
module.exports = mongoose.model('Post', postSchema);
