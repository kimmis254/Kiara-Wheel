const express = require('express');
const router = express.Router();
const WheelResult = require('../models/WheelResult');
const Session = require('../models/Session');

router.get('/:sessionId', async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    const [result, session] = await Promise.all([
      WheelResult.findOne({ sessionId }).lean(),
      Session.findById(sessionId).lean()
    ]);

    if (!result) {
      return res.status(404).json({ error: 'Wheel result not found' });
    }

    const activities = result.activities || [];
    const categories = {};
    const distribution = {};

    for (const act of activities) {
      const cat = act.outcomeCategory?.trim() || 'Uncategorized';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(act);
    }

    const totalActivities = activities.length || 1;
    for (const cat of Object.keys(categories)) {
      distribution[cat] = Math.round((categories[cat].length / totalActivities) * 100);
    }

    res.json({
      name: session?.name || 'User',
      age: session?.age || '',
      gender: session?.gender || '',
      categories,
      distribution
    });

  } catch (err) {
    console.error('❌ Error fetching results:', err);
    res.status(500).json({ error: 'Server error while fetching results' });
  }
});

module.exports = router;
