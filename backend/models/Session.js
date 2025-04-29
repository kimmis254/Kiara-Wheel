// models/Session.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Activity name is required'],
    trim: true
  }
});

const SessionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  age: {
    type: String,
    required: [true, 'Age is required'],
    enum: ['18-24', '25-34', '35-44', '45+']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female', 'other']
  },
  activities: {
    type: [activitySchema],
    validate: [arr => arr.length > 0, 'At least one activity is required']
  }
}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);
