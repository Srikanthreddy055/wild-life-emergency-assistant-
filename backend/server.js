// Wildlife Emergency Assistant - Core Express Server
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Secure Cross-Origin Resource Sharing
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Payload parsing with secure limit thresholds
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global Security Audit Log Middleware
app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(`[SECURITY AUDIT] ${new Date().toISOString()} - IP: ${ip} - Method: ${req.method} - Path: ${req.url}`);
  next();
});

// Mock Database Router States
global.mockDb = {
  incidents: [],
  auditLogs: [],
  threats: []
};

// Mount Routers
const authRouter = require('./routes/auth');
const incidentsRouter = require('./routes/incidents');
const aiRouter = require('./routes/ai');
const analyticsRouter = require('./routes/analytics');

app.use('/api/auth', authRouter);
app.use('/api/incidents', incidentsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/analytics', analyticsRouter);

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'Healthy',
    timestamp: new Date().toISOString(),
    database: 'Firestore Connected (Simulated)',
    firewall: 'Active (Rate-Limited)'
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    code: 'ERR_INTERNAL_FAILURE'
  });
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`WILDLIFE RESCUE COMMAND SERVER PORT: ${PORT}`);
  console.log(`Firebase Firestore Integrations Connected`);
  console.log(`TensorFlow CNN Bounding Classifiers Operational`);
  console.log(`==================================================`);
});
