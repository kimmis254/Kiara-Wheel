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
    default: '',
    trim: true
  },
  outcomeSubCategory: {
    type: String,
    default: '',
    trim: true
  },
  extra: {
    type: String,
    default: '',
    trim: true
  },
  details1: {
    type: String,
    default: '',
    trim: true
  },
  details2: {
    type: String,
    default: '',
    trim: true
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
    validate: {
      validator: arr => Array.isArray(arr) && arr.length > 0,
      message: 'At least one rated activity is required'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WheelResult', WheelResultSchema);
