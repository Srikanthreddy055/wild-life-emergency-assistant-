// Executive Business Intelligence Operations Router
const express = require('express');
const router = express.Router();

// Endpoint: Fetch system dashboard metrics
router.get('/metrics', (req, res) => {
  res.status(200).json({
    totalIncidents: 352,
    successfulRescues: 324,
    activeMissions: 14,
    globalSuccessRate: '92.04%',
    speciesDistribution: {
      raptors: 42,
      reptiles: 29,
      mammals: 57,
      marine: 18
    },
    regionalLoads: {
      angeles: 14,
      burbank: 8,
      malibu: 5,
      santaMonica: 12
    }
  });
});

// Endpoint: Export CSV report payload
router.get('/export-csv', (req, res) => {
  const mockCSV = `Incident ID,Species,Severity,Status,Date
inc_001,Golden Eagle,High,In Progress,2026-05-31
inc_002,Reticulated Python,Critical,Assigned,2026-05-31
inc_003,Green Sea Turtle,High,Resolved,2026-05-30
inc_004,American Black Bear,Medium,Reported,2026-05-31`;

  res.header('Content-Type', 'text/csv');
  res.attachment(`wildlife_emergency_report_export_${Date.now()}.csv`);
  res.status(200).send(mockCSV);
});

module.exports = router;
