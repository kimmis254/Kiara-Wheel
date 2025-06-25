const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true // Remove whitespace from both ends
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true, // Store emails in lowercase
    match: [/.+@.+\..+/, 'Please enter a valid email address'] // Basic email regex validation
  },
  subject: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contact', contactSchema);
