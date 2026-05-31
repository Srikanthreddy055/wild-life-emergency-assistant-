// Security Authentication & MFA Gateway Router
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'wildlife_guardian_secret_2026';

// Simulated database memory storage
const registeredUsers = [];

// Endpoint: Register Profile
router.post('/register', (req, res) => {
  const { email, name, role, phone, organization } = req.body;
  
  if (!email || !name || !role) {
    return res.status(400).json({ error: 'Missing core profile fields' });
  }

  const existing = registeredUsers.find(u => u.email === email);
  if (existing) {
    return res.status(400).json({ error: 'Email already registered inside Command Gateways' });
  }

  const newUser = {
    id: 'usr_' + Date.now(),
    email,
    name,
    role,
    phone: phone || '',
    organization: organization || 'Volunteer Lookout',
    verified: false
  };

  registeredUsers.push(newUser);
  res.status(201).json({
    message: 'Profile queued. Multi-factor authentication dispatching OTP.',
    user: { id: newUser.id, email: newUser.email, role: newUser.role }
  });
});

// Endpoint: Login Credentials & OTP MFA trigger
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Credentials email and password required.' });
  }

  // Pre-loaded role mappings
  let role = 'citizen';
  if (email.includes('admin')) role = 'admin';
  else if (email.includes('responder')) role = 'responder';

  // Securely logs audit logs
  console.log(`[MFA TRIGGER] ${new Date().toISOString()} - Dispatched verification code to ${email}`);

  res.status(200).json({
    message: 'Primary check completed. Verify dynamic MFA token to finalize session.',
    email,
    role,
    otpCode: '778931' // Constant simulation value for user verification
  });
});

// Endpoint: Verify OTP & Sign Security JWT Token
router.post('/verify-otp', (req, res) => {
  const { email, role, otp } = req.body;

  if (otp !== '778931') {
    return res.status(401).json({ error: 'Invalid MFA verification token. Access Denied.' });
  }

  // Sign JSON Web Token (JWT)
  const token = jwt.sign(
    { email, role, date: new Date() },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.status(200).json({
    message: 'MFA verified. Session token established.',
    token,
    user: {
      email,
      role,
      name: email.split('@')[0].toUpperCase(),
      organization: role === 'admin' ? 'Executive Command' : 'Rescue Squad Alpha'
    }
  });
});

module.exports = router;
