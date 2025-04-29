// routes/wheel.js
const express = require('express');
const router = express.Router();
const Session = require('../models/Session'); // ✅ MISSING import fixed
const WheelResult = require('../models/WheelResult');
const { generateWheel } = require('../services/wheelService');

// POST /api/wheel/generate
router.post('/generate', async (req, res) => {
  try {
    const { sessionId, activities } = req.body;

    if (!sessionId || !Array.isArray(activities) || activities.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid sessionId/activities' });
    }

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const result = generateWheel(activities);
    if (!result || !result.sectionsData || result.sectionsData.length !== activities.length) {
      return res.status(500).json({ error: 'Wheel generation failed or data mismatch' });
    }

    const enrichedActivities = activities.map((a, i) => ({
      ...a,
      outcomeCategory: result.sectionsData[i].mainCategory,
      outcomeSubCategory: result.sectionsData[i].subCategory,
      details1: result.sectionsData[i].details1,
      details2: result.sectionsData[i].details2
    }));

    const saved = await WheelResult.create({
      sessionId,
      name: session.name,
      age: session.age,
      gender: session.gender,
      activities: enrichedActivities
    });

    res.json({ message: 'Wheel generated successfully', result });
  } catch (err) {
    console.error('🔥 Error in /api/wheel/generate:', err);
    res.status(500).json({ error: 'Server error while generating wheel' });
  }
});

module.exports = router;
