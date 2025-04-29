const mapping = require('../data/outcomeMapping.json');

function generateWheel(activities) {
  const sections = {
    Bliss: [],
    Passion: [],
    Career: [],
    Charity: [],
    Volunteer: []
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
    if (match) {
      sections[match.mainCategory].push(name);
      sectionsData.push({
        activity: name,
        mainCategory: match.mainCategory,
        subCategory: match.subCategory,
        details1: match.details1,
        details2: match.details2
      });
    } else {
      sectionsData.push({
        activity: name,
        mainCategory: 'Uncategorized',
        subCategory: '',
        details1: '',
        details2: ''
      });
    }
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

    const isMatch = Object.keys(requiredYes).every(k => requiredYes[k] === yesMap[k]);
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
