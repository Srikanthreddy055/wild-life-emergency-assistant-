// Wildlife Emergency Assistant - LocalStorage Simulated Database (Firebase Firestore Replica)
const DATABASE_KEY = 'wildlife_emergency_db_v1';

// Initial Seed Data
const initialDatabaseSeed = {
  users: [
    { id: 'usr_admin', email: 'admin@wildlife.org', name: 'Dr. Sarah Connor', role: 'admin', organization: 'Central Wildlife Command', phone: '+1 (555) 019-2834' },
    { id: 'usr_resp_1', email: 'responder1@wildlife.org', name: 'Marcus Vance', role: 'responder', organization: 'Raptor Response Unit', phone: '+1 (555) 014-9922' },
    { id: 'usr_resp_2', email: 'responder2@wildlife.org', name: 'Elena Rostova', role: 'responder', organization: 'Herpetology Rescue Team', phone: '+1 (555) 017-8833' },
    { id: 'usr_citizen', email: 'citizen@example.com', name: 'Alex Mercer', role: 'citizen', organization: 'Volunteer Lookout', phone: '+1 (555) 012-3456' }
  ],
  incidents: [
    {
      id: 'inc_001',
      animalType: 'Bird of Prey',
      species: 'Golden Eagle',
      category: 'Injured / Cannot Fly',
      description: 'Found with an apparent wing injury near the northern hiking trail. Unable to take off. Seems alert but highly stressed.',
      lat: 34.0522,
      lng: -118.2437,
      severity: 'High',
      status: 'In Progress',
      reporterName: 'Alex Mercer',
      reporterPhone: '+1 (555) 012-3456',
      assignedTeam: 'Alpha Raptor Unit',
      imageUrl: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=600&q=80',
      timestamp: '2026-05-31T09:12:00Z',
      updates: [
        { time: '2026-05-31T09:15:00Z', status: 'Reported', note: 'Emergency report successfully submitted and logged in Firebase.' },
        { time: '2026-05-31T09:40:00Z', status: 'Assigned', note: 'Dispatch dispatched Alpha Raptor Unit to coordinates.' },
        { time: '2026-05-31T10:15:00Z', status: 'In Progress', note: 'Responder Marcus Vance arrived on-site and secured the bird.' }
      ]
    },
    {
      id: 'inc_002',
      animalType: 'Reptile',
      species: 'Reticulated Python',
      category: 'Urban Conflict',
      description: 'Massive python spotted in a suburban backyard. Children and pets are inside, but community members are concerned.',
      lat: 34.0928,
      lng: -118.3287,
      severity: 'Critical',
      status: 'Assigned',
      reporterName: 'Jane Foster',
      reporterPhone: '+1 (555) 015-7788',
      assignedTeam: 'Emerald Serpent Unit',
      imageUrl: 'https://images.unsplash.com/photo-1531386151447-fd762e7a3ae8?auto=format&fit=crop&w=600&q=80',
      timestamp: '2026-05-31T11:45:00Z',
      updates: [
        { time: '2026-05-31T11:45:00Z', status: 'Reported', note: 'Emergency flagged as Critical Severity due to residential proximity.' },
        { time: '2026-05-31T11:58:00Z', status: 'Assigned', note: 'Specialist Elena Rostova dispatched with containment enclosure.' }
      ]
    },
    {
      id: 'inc_003',
      animalType: 'Marine Mammal',
      species: 'Green Sea Turtle',
      category: 'Entanglement',
      description: 'Juvenile sea turtle washed up with discarded commercial fishing net tightly wound around its left front flipper.',
      lat: 33.9416,
      lng: -118.4085,
      severity: 'High',
      status: 'Resolved',
      reporterName: 'Carlos Santillan',
      reporterPhone: '+1 (555) 011-2233',
      assignedTeam: 'Coastal Wildlife Rescue',
      imageUrl: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=600&q=80',
      timestamp: '2026-05-30T14:20:00Z',
      updates: [
        { time: '2026-05-30T14:20:00Z', status: 'Reported', note: 'Entangled animal report received.' },
        { time: '2026-05-30T15:00:00Z', status: 'In Progress', note: 'Marine unit successfully untangled the turtle on site.' },
        { time: '2026-05-30T16:30:00Z', status: 'Resolved', note: 'Turtle monitored for vitality, treated with antiseptic, and safely released into deeper water.' }
      ]
    },
    {
      id: 'inc_004',
      animalType: 'Large Mammal',
      species: 'Black Bear',
      category: 'Inundation / Nuisance',
      description: 'Bear scavenging in municipal refuse bins. Confirmed entering several open garages on Redwood Drive.',
      lat: 34.1425,
      lng: -118.1500,
      severity: 'Medium',
      status: 'Reported',
      reporterName: 'Douglas Pine',
      reporterPhone: '+1 (555) 018-4455',
      assignedTeam: 'Unassigned',
      imageUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80',
      timestamp: '2026-05-31T12:05:00Z',
      updates: [
        { time: '2026-05-31T12:05:00Z', status: 'Reported', note: 'Citizen alerted ranger dispatch. Tracking bear heading north towards national forest.' }
      ]
    }
  ],
  rescueCenters: [
    { id: 'rc_001', name: 'Pacific Coast Wildlife Hospital', type: 'Veterinary Hospital', lat: 34.0259, lng: -118.4912, contact: '+1 (555) 234-5678', address: '1220 Ocean Blvd, Santa Monica, CA', rating: '4.9', activeCases: 14 },
    { id: 'rc_002', name: 'Highland Raptor Sanctuary', type: 'Specialized Center', lat: 34.1808, lng: -118.3090, contact: '+1 (555) 876-5432', address: '2900 Foothill Way, Burbank, CA', rating: '4.8', activeCases: 7 },
    { id: 'rc_003', name: 'Southern Herpetological Rescue', type: 'Volunteer Center', lat: 33.9164, lng: -118.3526, contact: '+1 (555) 901-2345', address: '450 Eucalyptus St, Hawthorne, CA', rating: '4.7', activeCases: 5 },
    { id: 'rc_004', name: 'Los Angeles Forest Ranger HQ', type: 'Forest Department', lat: 34.2005, lng: -118.1750, contact: '+1 (555) 345-6789', address: 'Ranger Station Rd, Angeles National Forest', rating: '4.9', activeCases: 12 }
  ],
  rescueTeams: [
    { id: 'rt_001', name: 'Alpha Raptor Unit', members: 'Marcus Vance, Kelly Green', vehicle: 'Mobile Response Truck A', status: 'Active', activeMissions: 1 },
    { id: 'rt_002', name: 'Emerald Serpent Unit', members: 'Elena Rostova, Dr. Alan Grant', vehicle: 'Response SUV B', status: 'Active', activeMissions: 1 },
    { id: 'rt_003', name: 'Coastal Wildlife Rescue', members: 'Jack Marlin, Sally Tide', vehicle: 'Inflatable Zodiac 3 & Truck C', status: 'Standby', activeMissions: 0 },
    { id: 'rt_004', name: 'Forest Ranger Unit Blue', members: 'Chief Brody, Deputy Hill', vehicle: 'All-Terrain Defender', status: 'Standby', activeMissions: 0 }
  ],
  threatMetrics: {
    highRiskZones: [
      { id: 'zone_01', name: 'Angeles Forest Interface', score: 86, prediction: 'High probability of bear/coyote movement into suburbia.', color: 'red' },
      { id: 'zone_02', name: 'Malibu Coastal Creekway', score: 62, prediction: 'Medium hazard regarding sea lion entanglement risks.', color: 'yellow' },
      { id: 'zone_03', name: 'Burbank Foothills Crossing', score: 79, prediction: 'High risk of deer-vehicle collisions along local freeway corridors.', color: 'orange' }
    ],
    alertLogs: [
      { id: 'al_01', title: 'Severe Wildfire Vector Threat', category: 'Habitat Risk', timestamp: '2026-05-31T06:00:00Z', details: 'Fringe heat map registers high risk. Animal displacement expected towards Southern Foothills.' },
      { id: 'al_02', title: 'Avian Influenza Monitoring Warning', category: 'Pathogen Alert', timestamp: '2026-05-30T10:00:00Z', details: 'Confirmed wild duck pathogen vectors nearby. High safety alerts active for bird rescues.' }
    ]
  },
  auditLogs: [
    { id: 'aud_01', timestamp: '2026-05-31T08:00:00Z', user: 'admin@wildlife.org', action: 'MFA Success', ipAddress: '192.168.1.144', details: 'Dr. Sarah Connor authenticated successfully with Hardware Key.' },
    { id: 'aud_02', timestamp: '2026-05-31T09:15:00Z', user: 'system_bot', action: 'Intrusion Analysis', ipAddress: 'localhost', details: 'Firewall secure. Zero malicious file injection events detected during uploads.' }
  ],
  currentUser: { email: 'admin@wildlife.org', name: 'Dr. Sarah Connor', role: 'admin', token: 'mock_jwt_session_xxxx' }
};

// Database class
class SimulatedFirestore {
  constructor() {
    this.data = null;
    this.listeners = [];
    this.init();
  }

  init() {
    const saved = localStorage.getItem(DATABASE_KEY);
    if (saved) {
      try {
        this.data = JSON.parse(saved);
      } catch (e) {
        console.error('Database parse failure. Re-seeding storage.', e);
        this.data = JSON.parse(JSON.stringify(initialDatabaseSeed));
        this.save();
      }
    } else {
      this.data = JSON.parse(JSON.stringify(initialDatabaseSeed));
      this.save();
    }
  }

  save() {
    localStorage.setItem(DATABASE_KEY, JSON.stringify(this.data));
    this.notify();
  }

  notify() {
    this.listeners.forEach(callback => callback(this.data));
  }

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.data);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  // Authentication Mock
  login(email, password, role = 'admin') {
    const user = this.data.users.find(u => u.email === email && u.role === role) || 
                 this.data.users.find(u => u.role === role) || 
                 { id: 'usr_' + Date.now(), email, name: email.split('@')[0], role, organization: 'Affiliated Volunteer', phone: '+1 (555) 012-0000' };

    this.data.currentUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organization: user.organization,
      phone: user.phone,
      token: 'jwt_mock_' + Math.random().toString(36).substring(2)
    };
    
    this.addAuditLog(user.email, 'User Login (MFA Dynamic Bypass Code: 778931)', `Role ${user.role.toUpperCase()} logged in via secure workspace.`);
    this.save();
    return this.data.currentUser;
  }

  logout() {
    const email = this.data.currentUser ? this.data.currentUser.email : 'unknown';
    this.addAuditLog(email, 'User Logout', 'Session destroyed.');
    this.data.currentUser = null;
    this.save();
  }

  register(email, name, role, phone, org) {
    const newUser = {
      id: 'usr_' + Date.now(),
      email,
      name,
      role,
      phone,
      organization: org || 'Individual Volunteer'
    };
    this.data.users.push(newUser);
    this.addAuditLog(email, 'Registration Success', `New user registered as ${role}.`);
    this.save();
    return newUser;
  }

  // Incident Operations
  addIncident(report) {
    const newInc = {
      id: 'inc_' + Math.floor(100 + Math.random() * 900),
      animalType: report.animalType || 'Unidentified',
      species: report.species || 'Pending Identification',
      category: report.category || 'General Emergency',
      description: report.description || '',
      lat: parseFloat(report.lat) || 34.0522,
      lng: parseFloat(report.lng) || -118.2437,
      severity: report.severity || 'Medium',
      status: 'Reported',
      reporterName: report.reporterName || 'Anonymous Citizen',
      reporterPhone: report.reporterPhone || 'Not provided',
      assignedTeam: 'Unassigned',
      imageUrl: report.imageUrl || 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=80',
      timestamp: new Date().toISOString(),
      updates: [
        { time: new Date().toISOString(), status: 'Reported', note: 'Emergency report logged via Web Portal.' }
      ]
    };
    this.data.incidents.unshift(newInc);
    
    // Add threat assessment triggers
    if (newInc.severity === 'Critical') {
      this.data.threatMetrics.alertLogs.unshift({
        id: 'al_' + Date.now(),
        title: `CRITICAL: Active ${newInc.species || newInc.animalType} Conflict`,
        category: 'Critical Conflict',
        timestamp: new Date().toISOString(),
        details: `Incident ${newInc.id} flagged with highest response protocol in coordinates [${newInc.lat.toFixed(4)}, ${newInc.lng.toFixed(4)}].`
      });
    }

    this.addAuditLog(this.data.currentUser?.email || 'citizen_portal', 'Create Incident', `Incident ${newInc.id} created: ${newInc.species} (${newInc.severity})`);
    this.save();
    return newInc;
  }

  updateIncidentStatus(id, status, note, team = null) {
    const incident = this.data.incidents.find(i => i.id === id);
    if (incident) {
      incident.status = status;
      if (team) {
        incident.assignedTeam = team;
      }
      incident.updates.push({
        time: new Date().toISOString(),
        status,
        note
      });
      
      this.addAuditLog(this.data.currentUser?.email || 'system_operator', 'Update Incident', `Incident ${id} updated to ${status}. Notes: ${note}`);
      this.save();
    }
  }

  // Audit Logs helper
  addAuditLog(user, action, details) {
    this.data.auditLogs.unshift({
      id: 'aud_' + Date.now(),
      timestamp: new Date().toISOString(),
      user,
      action,
      ipAddress: '192.168.1.' + Math.floor(2 + Math.random() * 253),
      details
    });
  }

  // Reset database state helper
  resetDatabase() {
    this.data = JSON.parse(JSON.stringify(initialDatabaseSeed));
    this.save();
  }
}

// Instantiate and expose globally
const db = new SimulatedFirestore();
window.db = db;
console.log('Wildlife Emergency Assistant Firestore Simulation Initialized.');
