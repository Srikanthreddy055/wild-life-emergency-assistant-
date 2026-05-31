// Emergency Dispatch Incident Operations Router
const express = require('express');
const router = express.Router();

// Mock active incident inventory
let incidents = [
  {
    id: 'inc_001',
    animalType: 'Bird of Prey',
    species: 'Golden Eagle',
    category: 'Injured / Cannot Fly',
    description: 'Found with wing injury near North hiking trail.',
    lat: 34.0522,
    lng: -118.2437,
    severity: 'High',
    status: 'In Progress',
    assignedTeam: 'Alpha Raptor Unit',
    timestamp: new Date().toISOString()
  }
];

// Endpoint: Fetch active inventory
router.get('/', (req, res) => {
  res.status(200).json(incidents);
});

// Endpoint: Create Emergency Report
router.post('/report', (req, res) => {
  const { animalType, species, category, description, lat, lng, severity, reporterName, reporterPhone, imageUrl } = req.body;

  const newInc = {
    id: 'inc_' + Math.floor(100 + Math.random() * 900),
    animalType: animalType || 'Unidentified',
    species: species || 'Pending verification',
    category: category || 'General distress',
    description: description || '',
    lat: parseFloat(lat) || 34.0522,
    lng: parseFloat(lng) || -118.2437,
    severity: severity || 'Medium',
    status: 'Reported',
    assignedTeam: 'Unassigned',
    reporterName: reporterName || 'Citizen Sentinel',
    reporterPhone: reporterPhone || '',
    imageUrl: imageUrl || '',
    timestamp: new Date().toISOString()
  };

  incidents.unshift(newInc);
  console.log(`[DISPATCH SYSTEM] Registered active case ${newInc.id} (${newInc.severity})`);
  res.status(201).json(newInc);
});

// Endpoint: Assign squad team / update status
router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { status, assignedTeam, note } = req.body;

  const incident = incidents.find(i => i.id === id);
  if (!incident) {
    return res.status(404).json({ error: 'Incident case not found' });
  }

  if (status) incident.status = status;
  if (assignedTeam) incident.assignedTeam = assignedTeam;

  console.log(`[DISPATCH UPDATE] Incident ${id} modified status to: ${status} assigned to ${assignedTeam}`);
  res.status(200).json({ message: 'Incident updated successfully', incident });
});

// Endpoint: Delete/Expunge Incident Record
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = incidents.findIndex(i => i.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Incident case not found' });
  }

  incidents.splice(index, 1);
  console.log(`[SECURITY EXPUNGE] Expunged case records for ${id}`);
  res.status(200).json({ message: 'Incident record expunged from primary registries.' });
});

module.exports = router;
