// routes/result.js
const express = require('express');
const router = express.Router();
const WheelResult = require('../models/WheelResult');
const Session = require('../models/Session');

router.get('/:sessionId', async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const result = await WheelResult.findOne({ sessionId }).lean();
    const session = await Session.findById(sessionId).lean();

    if (!result || !session) {
      return res.status(404).json({ error: 'Result or session not found' });
    }

    const categories = {};
    const distribution = {};
    const activities = result.activities || [];

    for (const act of activities) {
      const key = act.outcomeCategory || 'Uncategorized';
      if (!categories[key]) categories[key] = [];
      categories[key].push(act);
    }

    const total = activities.length;
    Object.keys(categories).forEach(cat => {
      distribution[cat] = Math.round((categories[cat].length / total) * 100);
    });

    res.json({
      name: session.name,
      age: session.age,
      gender: session.gender,
      categories,
      distribution
    });
  } catch (err) {
    console.error('❌ Error fetching results:', err);
    res.status(500).json({ error: 'Server error while fetching results' });
  }
});

module.exports = router;
