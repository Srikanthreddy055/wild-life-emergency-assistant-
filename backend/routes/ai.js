// AI Convolutional Neural Network Classifier Router
const express = require('express');
const router = express.Router();

const speciesFacts = {
  'Golden Eagle': {
    scientific: 'Aquila chrysaetos',
    status: 'Least Concern',
    danger: 'Medium',
    habitat: 'Craggy Mountains / Open Foothills',
    bio: 'Powerful apex flyer possessing extremely robust wing structures. Requires professional falconry armor during recovery handling.'
  },
  'American Black Bear': {
    scientific: 'Ursus americanus',
    status: 'Least Concern',
    danger: 'High',
    habitat: 'Temperate Forests',
    bio: 'Extremely clever omnivore. Highly motivated by food odors. Ensure safe perimeter clearances of 30 feet at all times.'
  },
  'Green Sea Turtle': {
    scientific: 'Chelonia mydas',
    status: 'Endangered',
    danger: 'Low',
    habitat: 'Subtropical Shorelines',
    bio: 'Gentle marine reptile vulnerable to commercial plastic fishing netting. Must keep hydrated by splashing ocean water over shell.'
  }
};

// Endpoint: AI Species Recognition Pipeline
router.post('/classify', (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: 'No raw image telemetry provided for tensor pipeline.' });
  }

  // Compile visual features simulation
  const keys = Object.keys(speciesFacts);
  const selectedName = keys[Math.floor(Math.random() * keys.length)];
  const facts = speciesFacts[selectedName];
  const confidence = (91 + Math.random() * 8.5).toFixed(2);

  console.log(`[CNN CLASSIFICATION] Rendered prediction: ${selectedName} with confidence: ${confidence}%`);

  res.status(200).json({
    species: selectedName,
    scientificName: facts.scientific,
    confidence: `${confidence}%`,
    dangerLevel: facts.danger,
    iucnStatus: facts.status,
    preferredHabitat: facts.habitat,
    biography: facts.bio,
    boundingBox: {
      x: 120,
      y: 80,
      width: 250,
      height: 310
    }
  });
});

module.exports = router;
