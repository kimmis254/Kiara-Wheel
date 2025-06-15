// models/WheelResult.js
const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Activity name is required'],
    trim: true
  },
  love: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  well: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  pay: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  world: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  outcomeCategory: {
    type: String,
    default: ''
  },
  outcomeSubCategory: {
    type: String,
    default: ''
  },
  extra: {
    type: String,
    default: ''
  },
  details1: {
    type: String,
    default: ''
  },
  details2: {
    type: String,
    default: ''
  }
});

const WheelResultSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  activities: {
    type: [ActivitySchema],
    validate: [arr => arr.length > 0, 'At least one rated activity is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WheelResult', WheelResultSchema);
