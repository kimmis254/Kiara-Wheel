const express = require('express');
const router = express.Router();
const Review = require('../models/Review'); // Ensure this path is correct

router.post('/', async (req, res) => {
  const { userEmail, rating, message } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
  }

  try {
    const newReview = new Review({
      userEmail,
      rating,
      message
    });
    await newReview.save();


    res.status(200).json({ message: 'Review submitted successfully!', review: newReview });
  } catch (error) {
    console.error('Error saving review:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error. Could not submit review.' });
  }
});

module.exports = router;
