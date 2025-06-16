// routes/session.js
const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

// POST /api/session — Save user details and rated activities
router.post('/', async (req, res) => {
  const { name, age, gender, activities } = req.body;

  if (!name || !age || !gender || !Array.isArray(activities) || activities.length === 0) {
    return res.status(400).json({ error: 'All fields and at least one rated activity are required.' });
  }

  for (const a of activities) {
    const { name: actName, love, well, pay, world } = a;

    if (
      !actName || typeof actName !== 'string' || actName.trim() === '' ||
      !Number.isInteger(love) || love < 1 || love > 10 ||
      !Number.isInteger(well) || well < 1 || well > 10 ||
      !Number.isInteger(pay) || pay < 1 || pay > 10 ||
      !Number.isInteger(world) || world < 1 || world > 10
    ) {
      return res.status(400).json({
        error: 'Each activity must have a valid name and 1–10 ratings for love, well, pay, and world.'
      });
    }
  }

  try {
    const session = await Session.create({ name, age, gender, activities });
    return res.json({ sessionId: session._id });
  } catch (err) {
    console.error('❌ Failed to save session:', err);
    return res.status(500).json({ error: 'Server failed to save session.' });
  }
});

// GET /api/session/:id — Fetch session by ID
router.get('/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).lean();
    if (!session) return res.status(404).json({ error: 'Session not found' });
    return res.json(session);
  } catch (err) {
    console.error('❌ Failed to retrieve session:', err);
    return res.status(500).json({ error: 'Server failed to fetch session.' });
  }
});

module.exports = router;
