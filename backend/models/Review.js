// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userEmail: { // Assuming you might want to store the email associated with the review
    type: String,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
    required: false // Make this true if email is mandatory for reviews
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  message: {
    type: String,
    trim: true,
    maxlength: 1000 // Limit review message length
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', reviewSchema);
