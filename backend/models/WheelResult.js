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
    min: 0,
    max: 10,
    default: 0
  },
  well: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  pay: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  world: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  outcomeCategory: {
    type: String,
    default: ''
  },
  outcomeSubCategory: {
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
