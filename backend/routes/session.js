// routes/session.js
const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

// POST /api/session — Save user details and activities
router.post('/', async (req, res) => {
  const { name, age, gender, activities } = req.body;

  if (!name || !age || !gender || !Array.isArray(activities) || activities.length === 0) {
    return res.status(400).json({ error: 'All fields are required including at least one activity.' });
  }

  // Validate activity objects
  for (let a of activities) {
    if (!a.name || typeof a.name !== 'string' || a.name.trim() === '') {
      return res.status(400).json({ error: 'Each activity must have a valid name.' });
    }
  }

  try {
    const session = await Session.create({ name, age, gender, activities });
    res.json({ sessionId: session._id });
  } catch (err) {
    console.error('❌ Failed to save session:', err);
    res.status(500).json({ error: 'Server failed to save session.' });
  }
});

// GET /api/session/:id — Fetch session by ID
router.get('/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    console.error('❌ Failed to retrieve session:', err);
    res.status(500).json({ error: 'Server failed to fetch session.' });
  }
});

module.exports = router;
