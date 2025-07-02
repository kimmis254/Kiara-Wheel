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

  activities.forEach((activity, idx) => {
    const { name, love, well, pay, world } = activity;

    if ([love, well, pay, world].some(val => typeof val !== 'number')) {
      console.error(`❌ Invalid scores in activity index ${idx}:`, activity);
      return;
    }

    const yesMap = {
      love: love >= 5,
      well: well >= 5,
      pay: pay >= 5,
      world: world >= 5
    };

    const match = findOutcome(yesMap);

    if (!match?.mainCategory) {
      console.warn(`⚠️ No outcome match for activity: "${name}" with yesMap:`, yesMap);
      return;

    }

    const result = {
      name,
      love,
      well,
      pay,
      world,
      outcomeCategory: match.mainCategory,
      outcomeSubCategory: match.subCategory || '',
      extra: match.Extra || '',
      details1: match.Details1 || '',
      details2: match.Details2 || ''
    };

    sectionsData.push(result);

    if (!sections[match.mainCategory]) {
      console.warn(`⚠️ Unknown category "${match.mainCategory}" in mapping. Creating new section bucket.`);
      sections[match.mainCategory] = [];
    }

    sections[match.mainCategory].push(result);
  });

  const total = sectionsData.length || 1;
  const sectionPercentages = {};
  Object.keys(sections).forEach(key => {
    sectionPercentages[key] = Math.round((sections[key].length / total) * 100);
  });

  if (sectionsData.length === 0) {
    console.error('❌ No valid outcome matches found for provided activities.');
  }

  return { sections, sectionPercentages, sectionsData };
}


function findOutcome(yesMap) {
  for (const row of mapping) {
    if (!row.IntersectingCircles) continue;

    const circles = row.IntersectingCircles.split(',').map(label => label.trim());

    const expected = {
      love: circles.includes('What you love'),
      well: circles.includes('What you do well'),
      pay: circles.includes('What the world will pay for'),
      world: circles.includes('What the world needs')
    };

    const isMatch = Object.keys(expected).every(key => expected[key] === yesMap[key]);
    if (isMatch) {
      return {
        mainCategory: row.OutcomeMainCategory,
        subCategory: row.OutcomeSubCategory,
        Extra: row.Extra || '',
        Details1: row.Details1 || '',
        Details2: row.Details2 || ''
      };
    }
  }

  return null;
}

module.exports = { generateWheel };
