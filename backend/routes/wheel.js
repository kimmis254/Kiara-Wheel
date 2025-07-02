const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const WheelResult = require('../models/WheelResult');
const { generateWheel } = require('../services/wheelService');

router.post('/generate', async (req, res) => {
  try {
    const { name, age, gender, activities } = req.body;

    if (!name || !age || !gender || !Array.isArray(activities) || activities.length === 0) {
      return res.status(400).json({ error: 'Missing required fields or activities' });
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
          error: 'Each activity must have a valid name and 1–10 scores for love, well, pay, and world.'
        });
      }
    }

    const session = await Session.create({ name, age, gender, activities });

    const wheelData = generateWheel(activities);
    if (!wheelData || !wheelData.sectionsData) {
      return res.status(500).json({ error: 'Wheel generation failed' });
    }

    const enrichedActivities = wheelData.sectionsData
      .filter(a => !!a.outcomeCategory) // only valid outcomes
      .map((a, i) => ({
        name: a.name,
        love: a.love,
        well: a.well,
        pay: a.pay,
        world: a.world,
        outcomeCategory: a.outcomeCategory,
        outcomeSubCategory: a.outcomeSubCategory,
        extra: a.extra,
        details1: a.details1,
        details2: a.details2
      }));

    if (enrichedActivities.length === 0) {
      return res.status(400).json({ error: 'No valid outcome matches found for provided activities.' });
    }

    await WheelResult.create({
      sessionId: session._id,
      activities: enrichedActivities
    });

    return res.json({
      message: 'Wheel generated successfully',
      sessionId: session._id,
      result: {
        categories: wheelData.sections,
        distribution: wheelData.sectionPercentages
      }
    });

  } catch (err) {
    console.error('🔥 Error in /api/wheel/generate:', err);
    return res.status(500).json({ error: 'Server error while generating wheel' });
  }
});

module.exports = router;
