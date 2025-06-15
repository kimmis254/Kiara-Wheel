const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const WheelResult = require('../models/WheelResult');
const { generateWheel } = require('../services/wheelService');

// POST /api/wheel/generate — handles session + wheel logic together
router.post('/generate', async (req, res) => {
  try {
    const { name, age, gender, activities } = req.body;

    if (!name || !age || !gender || !Array.isArray(activities) || activities.length === 0) {
      return res.status(400).json({ error: 'Missing required fields or activities' });
    }

    for (const a of activities) {
      const { name, love, well, pay, world } = a;
      if (
        !name || typeof name !== 'string' || name.trim() === '' ||
        !Number.isInteger(love) || love < 1 || love > 10 ||
        !Number.isInteger(well) || well < 1 || well > 10 ||
        !Number.isInteger(pay) || pay < 1 || pay > 10 ||
        !Number.isInteger(world) || world < 1 || world > 10
      ) {
        return res.status(400).json({ error: 'Each activity must have a valid name and 1–10 scores for love, well, pay, and world.' });
      }
    }

    // Create session
    const session = await Session.create({ name, age, gender, activities });

    // Generate outcomes
    const result = generateWheel(activities);
    if (!result || !result.sectionsData || result.sectionsData.length !== activities.length) {
      return res.status(500).json({ error: 'Wheel generation failed or data mismatch' });
    }

    // Merge outcomes into activities
    const enrichedActivities = activities.map((a, i) => ({
      ...a,
      outcomeCategory: result.sectionsData[i].outcomeCategory,
      outcomeSubCategory: result.sectionsData[i].outcomeSubCategory,
      extra: result.sectionsData[i].extra,
      details1: result.sectionsData[i].details1,
      details2: result.sectionsData[i].details2
    }));

    await WheelResult.create({
      sessionId: session._id,
      activities: enrichedActivities
    });

    res.json({
      message: 'Wheel generated successfully',
      sessionId: session._id,
      result
    });

  } catch (err) {
    console.error('🔥 Error in /api/wheel/generate:', err);
    res.status(500).json({ error: 'Server error while generating wheel' });
  }
});

module.exports = router;
