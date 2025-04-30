// services/wheelService.js
const mapping = require('../data/outcomeMapping.json');

function generateWheel(activities) {
  const sections = {
    Bliss: [],
    Passion: [],
    Career: [],
    Charity: [],
    Volunteer: [],
    Ikigai: [] // optional fallback category for discovery
  };

  const sectionsData = [];

  activities.forEach(activity => {
    const { name, love, well, pay, world } = activity;
    const yesMap = {
      love: love >= 5,
      well: well >= 5,
      pay: pay >= 5,
      world: world >= 5
    };

    const match = findOutcome(yesMap);

    const category = match?.mainCategory || 'Ikigai'; // fallback
    const activityResult = {
      activity: name,
      mainCategory: category,
      subCategory: match?.subCategory || 'Self Discovery',
      details1: match?.details1 || 'You are still discovering yourself.',
      details2: match?.details2 || 'Every step is progress.'
    };

    sectionsData.push(activityResult);
    if (sections[category]) sections[category].push(activityResult);
  });

  const total = activities.length || 1;
  const sectionPercentages = {};
  for (const key in sections) {
    sectionPercentages[key] = Math.round((sections[key].length / total) * 100);
  }

  return { sections, sectionPercentages, sectionsData };
}

function findOutcome(yesMap) {
  for (const row of mapping) {
    const circles = row.IntersectingCircles.split(',').map(c => c.trim());

    const requiredYes = {
      love: circles.includes('What you Love'),
      well: circles.includes('What you do Well'),
      pay: circles.includes('Will the world pay for it'),
      world: circles.includes('What the world needs')
    };

    const isMatch = Object.keys(requiredYes).every(key => requiredYes[key] === yesMap[key]);

    if (isMatch) {
      return {
        mainCategory: row.OutcomeMainCategory,
        subCategory: row.OutcomeSubCategory,
        details1: row.Details1,
        details2: row.Details2
      };
    }
  }

  return null;
}

module.exports = { generateWheel };
