const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
    required: false
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
    maxlength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', reviewSchema);
