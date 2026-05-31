// Wildlife Emergency Assistant - Core Application Engine

// Global State
let currentView = 'landing';
let currentRole = 'admin';
let selectedReportImageFile = null;
let selectedAIImageFile = null;
let aiScanInterval = null;
let maps = {
  picker: null,
  pickerMarker: null,
  monitor: null,
  monitorMarkers: [],
  locator: null,
  locatorMarkers: []
};
let charts = {
  categories: null,
  success: null,
  geo: null
};

// Safety Guides Pre-loads
const safetyGuides = [
  { id: 'sg_01', type: 'bird', title: 'Avian Trauma Management', subtitle: 'Birds of Prey / Raptors', content: 'Gently drape a dark heavy towel over the raptor to restrict sight and neutralize claws. Place in a cardboard carrier container. Never secure beak with tape. Avoid water forced into the mouth.' },
  { id: 'sg_02', type: 'reptile', title: 'Venomous Snake Handling', subtitle: 'Serpent Perimeter Control', content: 'Keep a 15-foot safe parameter. Photograph from safe distance for ID verification. Do not attempt trapping. Keep pets and children indoors. Monitor snake movements until ranger squad arrives.' },
  { id: 'sg_03', type: 'mammal', title: 'Large Carnivore Intrusion', subtitle: 'Bears / Mountain Lions', content: 'Do not corner or run. Make loud vocal noises, expand arms to look large. Ensure escape path is clear. Secure refuse bins in locked garages. Keep pets confined to quarters.' },
  { id: 'sg_04', type: 'mammal', title: 'Deer Vehicle Collision Safety', subtitle: 'Highway Wildlife Hazards', content: 'Flicker warning lights immediately. Do not stand directly behind/in front of injured deer as hooves are dangerous. Call state forest command. Avoid moving animal unless traffic hazard demands it.' },
  { id: 'sg_05', type: 'marine', title: 'Marine Mammal Stranding Protocol', subtitle: 'Sea Lions / Seals', content: 'Do not push the mammal back in water. Keep crowd at least 50 yards away. Keep the animal moist by splashing saltwater (avoid the blowhole). Watch for aggressive seal defense bites.' }
];

// Species Database Pre-loads
const speciesCatalog = [
  { name: 'Golden Eagle', scientific: 'Aquila chrysaetos', status: 'Least Concern', danger: 'Medium', habitat: 'Montane Cliffs / Grasslands', bio: 'Regal avian predator with 7ft wingspan. Feeds on jackrabbits. Extremely sharp talons require leather arm guards.', image: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=400&q=80' },
  { name: 'Reticulated Python', scientific: 'Malayopython reticulatus', status: 'Least Concern', danger: 'Severe', habitat: 'Tropical Forests / Suburban fringe', bio: 'World\'s longest snake, utilizing constriction to capture prey. Alert responders immediately for urban sightings.', image: 'https://images.unsplash.com/photo-1531386151447-fd762e7a3ae8?auto=format&fit=crop&w=400&q=80' },
  { name: 'Green Sea Turtle', scientific: 'Chelonia mydas', status: 'Endangered', danger: 'Low', habitat: 'Subtropical coastal reefs', bio: 'Herbivorous marine reptile. Endangered due to plastic pollution and commercial net entanglement.', image: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=400&q=80' },
  { name: 'American Black Bear', scientific: 'Ursus americanus', status: 'Least Concern', danger: 'High', habitat: 'Temperate Forests', bio: 'Omnivorous mammal. Possesses extremely acute scent detection. Prone to urban garbage scavenging.', image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=400&q=80' }
];

// Community Board Mock Thread
let communityPosts = [
  { name: 'Ranger Dave', text: 'Avian flu monitors indicate low vector rates in Sector 4 this weekend. Safe for volunteers to operate.', time: '1 hour ago' },
  { name: 'Elena Rostova', text: 'Spotted a coyote pack near the Pasadena trail boundary. Keep domestic animals secured.', time: '3 hours ago' }
];

// Initialize on Load
window.addEventListener('DOMContentLoaded', () => {
  // Sync Role and UI
  const initialUser = window.db.data.currentUser;
  if (initialUser) {
    currentRole = initialUser.role;
    document.getElementById('role-selector').value = currentRole;
    updateUserProfileBadge(initialUser);
  }
  
  // Initialize Default Page Router
  navigateTo('landing');

  // Database Change Subscriptions
  window.db.subscribe((data) => {
    updateCitizenDashboard(data);
    updateOperationsDashboard(data);
    updateMonitoringCenter(data);
    updateAdminConsole(data);
    updateNotificationCenter(data);
    updateReportGenerator(data);
  });

  // Load Safety Guides Grid
  renderSafetyGuides();

  // Load Species Database Browser
  renderSpeciesDatabase();

  // Load Community Forum
  renderCommunityForum();

  // Render Lucide Icons
  lucide.createIcons();
});

// ================= NAVIGATION ROUTING SYSTEM =================
function navigateTo(pageId) {
  currentView = pageId;

  // Hide all sections
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.add('hidden');
  });

  // Display targeted section
  const targetView = document.getElementById(`page-${pageId}`);
  if (targetView) {
    targetView.classList.remove('hidden');
  }

  // Manage Sidebar and Navigation UI Elements
  const sidebar = document.getElementById('dashboard-sidebar');
  if (pageId === 'landing' || pageId === 'auth') {
    sidebar.classList.add('hidden');
  } else {
    sidebar.classList.remove('hidden');
    // Show role specific sidebar sections
    document.getElementById('citizen-sidebar-links').classList.add('hidden');
    document.getElementById('responder-sidebar-links').classList.add('hidden');
    document.getElementById('admin-sidebar-links').classList.add('hidden');

    if (currentRole === 'citizen') {
      document.getElementById('citizen-sidebar-links').classList.remove('hidden');
      document.getElementById('sidebar-title').innerText = "CITIZEN PORTAL";
    } else if (currentRole === 'responder') {
      document.getElementById('responder-sidebar-links').classList.remove('hidden');
      document.getElementById('sidebar-title').innerText = "RESPONDER HUB";
    } else if (currentRole === 'admin') {
      document.getElementById('admin-sidebar-links').classList.remove('hidden');
      document.getElementById('sidebar-title').innerText = "COMMAND CONSOLE";
    }
  }

  // Trigger Maps Re-renders if visible to prevent Leaflet container size bugs
  setTimeout(() => {
    if (pageId === 'report-system') {
      initReportPickerMap();
    } else if (pageId === 'monitoring-center') {
      initMonitoringMap();
    } else if (pageId === 'locator') {
      initLocatorMap();
    } else if (pageId === 'analytics-dashboard') {
      initAnalyticsCharts();
    }
  }, 100);

  // Sync Highlighted state on sidebars
  document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.classList.remove('bg-forest/20', 'border-l-4', 'border-emerald-400');
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}


// ================= FIREBASE & CUSTOM AUTHENTICATION HANDLERS =================
function switchAuthTab(tab) {
  const loginBtn = document.getElementById('tab-login-btn');
  const regBtn = document.getElementById('tab-register-btn');
  const loginForm = document.getElementById('auth-login-form');
  const regForm = document.getElementById('auth-register-form');
  const otpSection = document.getElementById('auth-otp-section');

  if (tab === 'login') {
    loginBtn.classList.add('border-b-2', 'border-emerald-400', 'text-white');
    loginBtn.classList.remove('text-gray-400');
    regBtn.classList.remove('border-b-2', 'border-emerald-400', 'text-white');
    regBtn.classList.add('text-gray-400');
    loginForm.classList.remove('hidden');
    regForm.classList.add('hidden');
    otpSection.classList.add('hidden');
  } else {
    regBtn.classList.add('border-b-2', 'border-emerald-400', 'text-white');
    regBtn.classList.remove('text-gray-400');
    loginBtn.classList.remove('border-b-2', 'border-emerald-400', 'text-white');
    loginBtn.classList.add('text-gray-400');
    regForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    otpSection.classList.add('hidden');
  }
}

let pendingAuthUser = null; // Store temp session details during OTP validation

async function handleLoginSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const simulatedRole = document.getElementById('login-role-sim').value;

  try {
    const userCredential = await window.firebaseAuth.login(email, password);
    const user = userCredential.user;
    
    // Simulating MFA prompt
    document.getElementById('auth-login-form').classList.add('hidden');
    document.getElementById('auth-otp-section').classList.remove('hidden');
    
    pendingAuthUser = {
      email: user.email,
      role: simulatedRole,
      name: email.split('@')[0]
    };
  } catch (error) {
    alert('Authentication Failed: ' + error.message);
  }
}

async function handleRegisterSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const phone = document.getElementById('reg-phone').value;
  const organization = document.getElementById('reg-org').value;
  const role = document.getElementById('reg-role').value;
  const password = prompt('Enter a secure password for your command credentials:');

  if (!password || password.length < 6) {
    alert('A password of at least 6 characters is required.');
    return;
  }

  try {
    const userCredential = await window.firebaseAuth.register(email, password);
    const user = userCredential.user;
    
    // Store in our database representation
    window.db.register(email, name, role, phone, organization);
    alert('Account created successfully! Proceeding to Sign In.');
    switchAuthTab('login');
  } catch (error) {
    alert('Registration Failed: ' + error.message);
  }
}

function verifyOTPCode() {
  const otpInput = document.getElementById('otp-input').value;
  if (otpInput === '778931') {
    alert('MFA Verification Complete. Loading command panel...');
    if (pendingAuthUser) {
      window.db.login(pendingAuthUser.email, 'password', pendingAuthUser.role);
      const user = window.db.data.currentUser;
      currentRole = user.role;
      document.getElementById('role-selector').value = currentRole;
      updateUserProfileBadge(user);
      
      if (currentRole === 'citizen') navigateTo('citizen-dashboard');
      else if (currentRole === 'responder') navigateTo('responder-dashboard');
      else if (currentRole === 'admin') navigateTo('admin-dashboard');
      
      pendingAuthUser = null;
    }
  } else {
    alert('Invalid OTP Verification code. Please retry.');
  }
}

function triggerForgotPassword() {
  const email = prompt('Enter command email for credential recovery:');
  if (email) {
    alert(`A password recovery instruction has been dispatched to ${email}.`);
  }
}

// Hook Firebase Auth state listener into dynamic user profiles
window.addEventListener('DOMContentLoaded', () => {
  if (window.firebaseAuth) {
    window.firebaseAuth.onStateChanged((user) => {
      if (user) {
        console.log('[FIREBASE] User signed in:', user.email);
      } else {
        console.log('[FIREBASE] No user active.');
      }
    });
  }
});

// Simulated Session Changes
function simulateRoleChange(role) {
  currentRole = role;
  window.db.login(`${role}@wildlife.org`, 'password', role);
  
  const user = window.db.data.currentUser;
  updateUserProfileBadge(user);
  
  // Re-route to standard landing page or specific dashboards
  if (role === 'citizen') {
    navigateTo('citizen-dashboard');
  } else if (role === 'responder') {
    navigateTo('responder-dashboard');
  } else if (role === 'admin') {
    navigateTo('admin-dashboard');
  }
}

function updateUserProfileBadge(user) {
  document.getElementById('user-name').innerText = user.name;
  document.getElementById('user-role-lbl').innerText = user.role.toUpperCase();
  
  // Initials
  const initials = user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
  document.getElementById('user-avatar').innerText = initials;
}

async function triggerLogout() {
  if (window.firebaseAuth) {
    try {
      await window.firebaseAuth.logout();
    } catch (e) {
      console.error(e);
    }
  }
  window.db.logout();
  alert('Secure session destroyed. Moving to Landing Page.');
  simulateRoleChange('citizen');
  navigateTo('landing');
}


// ================= DYNAMIC CITIZEN DASHBOARD =================
function updateCitizenDashboard(data) {
  // Update Header greeting details
  document.getElementById('citizen-dash-name').innerText = data.currentUser?.name || 'Guest User';

  // Populates recent reports
  const body = document.getElementById('citizen-recent-incidents-body');
  if (!body) return;
  body.innerHTML = '';

  // Get active user incidents
  const citizenIncidents = data.incidents;
  
  citizenIncidents.forEach(inc => {
    const timeStr = new Date(inc.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // Sev badges
    let sevBadge = `<span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">Medium</span>`;
    if (inc.severity === 'High') {
      sevBadge = `<span class="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 text-[10px] font-bold">High</span>`;
    } else if (inc.severity === 'Critical') {
      sevBadge = `<span class="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-bold">Critical</span>`;
    }

    // Status badges
    let statBadge = `<span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold">Reported</span>`;
    if (inc.status === 'Assigned') {
      statBadge = `<span class="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-bold">Assigned</span>`;
    } else if (inc.status === 'In Progress') {
      statBadge = `<span class="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 text-[10px] font-bold">Rescuing</span>`;
    } else if (inc.status === 'Resolved') {
      statBadge = `<span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Resolved</span>`;
    }

    const tr = document.createElement('tr');
    tr.className = "border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer";
    tr.onclick = () => {
      navigateTo('tracker');
      selectTrackerIncident(inc.id);
    };
    tr.innerHTML = `
      <td class="py-3 font-mono text-emerald-400 font-bold">${inc.id}</td>
      <td class="py-3 text-white font-medium">${inc.species || inc.animalType}</td>
      <td class="py-3">${sevBadge}</td>
      <td class="py-3 text-gray-400 text-xs">${inc.assignedTeam}</td>
      <td class="py-3">${statBadge}</td>
      <td class="py-3 text-right text-gray-500 text-xs">${timeStr}</td>
    `;
    body.appendChild(tr);
  });

  // Render sidebar warnings widget
  const warningWidget = document.getElementById('cit-dash-notifications');
  if (warningWidget) {
    warningWidget.innerHTML = '';
    data.threatMetrics.alertLogs.slice(0, 3).forEach(alertItem => {
      const div = document.createElement('div');
      div.className = "p-2.5 bg-white/5 border border-white/5 rounded-xl space-y-0.5";
      div.innerHTML = `
        <div class="text-xs font-bold text-white flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-red-400"></span> ${alertItem.title}
        </div>
        <p class="text-[10px] text-gray-400 leading-tight">${alertItem.details}</p>
      `;
      warningWidget.appendChild(div);
    });
  }
}

// Quick Launcher report templates
function triggerQuickReport(animal, species, severity) {
  navigateTo('report-system');
  document.getElementById('rep-animal-type').value = animal;
  document.getElementById('rep-species').value = species;
  document.getElementById('rep-severity').value = severity;
  
  // Set random coordinate offsets near downtown
  const offsetLat = 34.0522 + (Math.random() - 0.5) * 0.15;
  const offsetLng = -118.2437 + (Math.random() - 0.5) * 0.15;
  document.getElementById('rep-lat').value = offsetLat.toFixed(4);
  document.getElementById('rep-lng').value = offsetLng.toFixed(4);
}

// ================= EMERGENCY REPORTING SYSTEM =================
function initReportPickerMap() {
  if (maps.picker) return;

  maps.picker = L.map('report-picker-map').setView([34.0522, -118.2437], 11);
  
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(maps.picker);

  // Default Pin
  maps.pickerMarker = L.marker([34.0522, -118.2437], { draggable: true }).addTo(maps.picker);
  
  maps.pickerMarker.on('dragend', function (event) {
    const position = maps.pickerMarker.getLatLng();
    document.getElementById('rep-lat').value = position.lat.toFixed(4);
    document.getElementById('rep-lng').value = position.lng.toFixed(4);
  });

  maps.picker.on('click', function (e) {
    maps.pickerMarker.setLatLng(e.latlng);
    document.getElementById('rep-lat').value = e.latlng.lat.toFixed(4);
    document.getElementById('rep-lng').value = e.latlng.lng.toFixed(4);
  });
}

function simulateReportImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    selectedReportImageFile = file;
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('report-dropzone-prompt').classList.add('hidden');
      document.getElementById('report-dropzone-preview').classList.remove('hidden');
      document.getElementById('report-img-preview-tag').src = e.target.result;
      document.getElementById('report-img-filename').innerText = file.name;
    }
    reader.readAsDataURL(file);
  }
}

function removeReportImage() {
  selectedReportImageFile = null;
  document.getElementById('report-file-input').value = '';
  document.getElementById('report-dropzone-prompt').classList.remove('hidden');
  document.getElementById('report-dropzone-preview').classList.add('hidden');
}

function updateSpeciesPreselect(val) {
  const speciesInput = document.getElementById('rep-species');
  if (val === 'Bird of Prey') speciesInput.value = 'Golden Eagle';
  else if (val === 'Reptile') speciesInput.value = 'Reticulated Python';
  else if (val === 'Large Mammal') speciesInput.value = 'American Black Bear';
  else if (val === 'Marine Mammal') speciesInput.value = 'Green Sea Turtle';
  else speciesInput.value = 'Coyote';
}

function handleEmergencySubmit(event) {
  event.preventDefault();
  
  const reportData = {
    animalType: document.getElementById('rep-animal-type').value,
    species: document.getElementById('rep-species').value,
    category: document.getElementById('rep-category').value,
    severity: document.getElementById('rep-severity').value,
    lat: parseFloat(document.getElementById('rep-lat').value),
    lng: parseFloat(document.getElementById('rep-lng').value),
    description: document.getElementById('rep-desc').value,
    reporterName: document.getElementById('rep-name').value,
    reporterPhone: document.getElementById('rep-phone').value,
    imageUrl: selectedReportImageFile ? document.getElementById('report-img-preview-tag').src : null
  };

  const newInc = window.db.addIncident(reportData);
  
  // Show system broadcast ticker
  const broadcast = document.getElementById('live-broadcast-banner');
  broadcast.classList.remove('hidden');
  document.getElementById('broadcast-message').innerText = `CRITICAL TELEMETRY: New ${newInc.severity} Emergency Incident logged (Case: ${newInc.id}) at [${newInc.lat.toFixed(3)}, ${newInc.lng.toFixed(3)}]!`;

  alert(`Emergency transmitted successfully! Dispatch assigned case ID ${newInc.id}.`);
  
  // Reset Form
  document.getElementById('emergency-report-form').reset();
  removeReportImage();
  
  // Route back to tracking
  navigateTo('tracker');
}

// ================= AI ANIMAL IDENTIFICATION =================
function handleAIImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    selectedAIImageFile = file;
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('ai-upload-prompt').classList.add('hidden');
      document.getElementById('ai-canvas-container').classList.remove('hidden');
      
      const img = new Image();
      img.onload = function() {
        const canvas = document.getElementById('ai-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        document.getElementById('ai-scan-btn').removeAttribute('disabled');
      }
      img.src = e.target.result;
    }
    reader.readAsDataURL(file);
  }
}

function startAIScanningProcess() {
  document.getElementById('ai-loading-spinner').classList.remove('hidden');
  document.getElementById('ai-btn-text').innerText = 'Initializing CNN Feature Maps...';
  document.getElementById('ai-laser-line').classList.remove('hidden');
  document.getElementById('ai-scan-btn').setAttribute('disabled', 'true');

  let pct = 0;
  const timer = setInterval(() => {
    pct += 10;
    document.getElementById('ai-btn-text').innerText = `Running Bounding Vector Scan: ${pct}%`;
    if (pct >= 100) {
      clearInterval(timer);
      finishAIScanning();
    }
  }, 200);
}

function finishAIScanning() {
  document.getElementById('ai-loading-spinner').classList.add('hidden');
  document.getElementById('ai-btn-text').innerText = 'Diagnostics Compiled';
  document.getElementById('ai-laser-line').classList.add('hidden');
  document.getElementById('ai-placeholder-msg').classList.add('hidden');
  document.getElementById('ai-results-panel').classList.remove('hidden');

  // Pick a pre-loaded catalog match based on upload/randomizer
  const catalogItem = speciesCatalog[Math.floor(Math.random() * speciesCatalog.length)];
  
  document.getElementById('ai-res-species').innerText = catalogItem.name;
  document.getElementById('ai-res-sciname').innerText = catalogItem.scientific;
  
  const randomConfidence = (92 + Math.random() * 7).toFixed(1);
  document.getElementById('ai-res-conf').innerText = `${randomConfidence}%`;
  document.getElementById('ai-res-conf-bar').style.width = `${randomConfidence}%`;
  
  document.getElementById('ai-res-risk').innerText = catalogItem.danger;
  
  // Custom Risk Badging classes
  const riskLbl = document.getElementById('ai-res-risk');
  riskLbl.className = "px-2.5 py-0.5 rounded-full text-white font-black text-[9px] uppercase tracking-wider glow-red";
  if (catalogItem.danger === 'Low') {
    riskLbl.className = "px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[9px] uppercase tracking-wider";
  } else if (catalogItem.danger === 'Medium') {
    riskLbl.className = "px-2.5 py-0.5 rounded-full bg-yellow-600 text-white font-black text-[9px] uppercase tracking-wider";
  } else {
    riskLbl.className = "px-2.5 py-0.5 rounded-full bg-red-600 text-white font-black text-[9px] uppercase tracking-wider glow-red";
  }

  document.getElementById('ai-res-iucn').innerText = catalogItem.status;
  document.getElementById('ai-res-habitat').innerText = catalogItem.habitat;
  document.getElementById('ai-res-bio').innerText = catalogItem.bio;

  // Set safety parameters dynamically
  if (catalogItem.danger === 'Severe' || catalogItem.danger === 'High') {
    document.getElementById('ai-res-safety').innerText = `CRITICAL ALERT: Animal is highly dangerous. Keep a strictly enforced 25-ft safety cordon. Do not attempt capturing manually under any circumstances. Relay coordinates to Ranger Dispatch immediately.`;
  } else {
    document.getElementById('ai-res-safety').innerText = `SAFE LEVEL: Non-lethal species. If found injured, gently confine to a ventilated box or throw a towel over to prevent visual panic. Avoid handling beak or face vectors.`;
  }

  // Paint Bounding Box onto Canvas
  const canvas = document.getElementById('ai-canvas');
  const ctx = canvas.getContext('2d');
  
  // Bounding box dimensions
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 6;
  
  const boxWidth = canvas.width * 0.5;
  const boxHeight = canvas.height * 0.5;
  const boxX = (canvas.width - boxWidth) / 2;
  const boxY = (canvas.height - boxHeight) / 2;

  ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
  
  // Add tag tag badge inside box
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 24px Outfit, sans-serif';
  ctx.fillText(`${catalogItem.name} (${randomConfidence}%)`, boxX + 10, boxY + 30);
}

function transferAIToReportForm() {
  const species = document.getElementById('ai-res-species').innerText;
  const risk = document.getElementById('ai-res-risk').innerText;
  
  navigateTo('report-system');
  document.getElementById('rep-species').value = species;
  
  if (species.includes('Eagle') || species.includes('Hawk')) {
    document.getElementById('rep-animal-type').value = 'Bird of Prey';
  } else if (species.includes('Bear')) {
    document.getElementById('rep-animal-type').value = 'Large Mammal';
  } else if (species.includes('Python') || species.includes('Snake')) {
    document.getElementById('rep-animal-type').value = 'Reptile';
  } else if (species.includes('Turtle')) {
    document.getElementById('rep-animal-type').value = 'Marine Mammal';
  }

  if (risk === 'Severe' || risk === 'High') {
    document.getElementById('rep-severity').value = 'Critical';
  } else {
    document.getElementById('rep-severity').value = 'High';
  }
}

// ================= ACTIVE RESCUE OPERATIONS =================
function updateOperationsDashboard(data) {
  const board = document.getElementById('ops-mission-board');
  if (!board) return;
  board.innerHTML = '';

  const activeMissions = data.incidents.filter(i => i.status !== 'Resolved');

  if (activeMissions.length === 0) {
    board.innerHTML = `
      <div class="col-span-3 text-center py-20 text-gray-500">
        <i data-lucide="shield-check" class="w-12 h-12 mx-auto mb-2 text-emerald-400/70"></i>
        All dispatch incidents fully resolved. Operational grid reports perfect safety clearance.
      </div>
    `;
    lucide.createIcons();
    return;
  }

  activeMissions.forEach(inc => {
    const dateStr = new Date(inc.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
    
    // Status indicators
    let statusClass = "text-yellow-400";
    if (inc.status === 'In Progress') statusClass = "text-orange-400";
    
    // Updates timeline rows
    let timelineHTML = '';
    inc.updates.slice(-2).forEach(upd => {
      timelineHTML += `
        <div class="text-[10px] text-gray-400 flex justify-between gap-2 border-l border-white/10 pl-2 ml-1">
          <span>• ${upd.note}</span>
          <span class="text-gray-500 shrink-0 font-mono">${new Date(upd.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
        </div>
      `;
    });

    // Select dispatch team option matching
    let dispatchSelect = '';
    if (currentRole === 'admin' || currentRole === 'responder') {
      dispatchSelect = `
        <div class="pt-3 border-t border-white/5 flex gap-2">
          <select onchange="dispatchTeamToIncident('${inc.id}', this.value)" class="flex-grow bg-navy border border-white/10 rounded-lg p-1.5 text-[11px] text-white">
            <option value="">-- Reassign Team --</option>
            ${data.rescueTeams.map(t => `<option value="${t.name}" ${inc.assignedTeam === t.name ? 'selected' : ''}>${t.name}</option>`).join('')}
          </select>
          <button onclick="resolveRescueIncident('${inc.id}')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold uppercase transition-all shrink-0">Resolve</button>
        </div>
      `;
    }

    const div = document.createElement('div');
    div.className = "glass-panel p-5 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between";
    div.innerHTML = `
      <div class="space-y-2">
        <div class="flex justify-between items-start">
          <span class="text-xs text-emerald-400 font-mono font-bold">${inc.id}</span>
          <span class="text-[10px] text-gray-500 font-mono">${dateStr}</span>
        </div>
        <h4 class="font-extrabold text-white text-base leading-snug">${inc.species || inc.animalType}</h4>
        <div class="text-xs text-gray-400 flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-emerald-400"></i> [${inc.lat.toFixed(3)}, ${inc.lng.toFixed(3)}]</div>
        
        <div class="p-2.5 bg-white/5 rounded-xl border border-white/5 text-[11px] text-gray-300">
          <strong>Problem:</strong> ${inc.description}
        </div>
        
        <div class="flex items-center justify-between text-xs pt-1">
          <span class="text-gray-400">Response Team:</span>
          <strong class="text-white flex items-center gap-1"><i data-lucide="truck" class="w-3.5 h-3.5 text-sky-400"></i> ${inc.assignedTeam}</strong>
        </div>

        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-400">Mission Status:</span>
          <strong class="${statusClass} flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-current animate-pulse"></span> ${inc.status}
          </strong>
        </div>

        <div class="space-y-1 pt-1.5">
          <div class="text-[10px] uppercase font-bold tracking-widest text-gray-500">Live Field Updates</div>
          ${timelineHTML}
        </div>
      </div>
      ${dispatchSelect}
    `;
    board.appendChild(div);
  });
  lucide.createIcons();
}

function dispatchTeamToIncident(id, teamName) {
  if (!teamName) return;
  window.db.updateIncidentStatus(id, 'Assigned', `Dispatched unit ${teamName} to emergency coordinate targets.`, teamName);
  alert(`Incident assigned successfully! Response units notified.`);
}

function resolveRescueIncident(id) {
  const note = prompt("Enter rescue resolution outcome report notes:", "Animal secured, treated with anti-bacterial gel, and safely translocated to natural reserve.");
  if (note === null) return;
  window.db.updateIncidentStatus(id, 'Resolved', `RESOLVED: ${note}`);
  alert(`Incident Case ${id} officially closed and logged in history database.`);
}

// ================= REAL-TIME MONITORING CENTER =================
function initMonitoringMap() {
  if (maps.monitor) return;

  maps.monitor = L.map('monitoring-main-map').setView([34.0522, -118.2437], 10);
  
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(maps.monitor);

  plotMonitoringMarkers();
}

function plotMonitoringMarkers() {
  if (!maps.monitor) return;

  // Clear old markers
  maps.monitorMarkers.forEach(m => maps.monitor.removeLayer(m));
  maps.monitorMarkers = [];

  const data = window.db.data;
  data.incidents.forEach(inc => {
    let pinColor = '#10b981'; // Green (Resolved)
    if (inc.status === 'Reported') pinColor = '#38bdf8'; // Sky (reported)
    if (inc.status === 'Assigned') pinColor = '#f59e0b'; // Amber (assigned)
    if (inc.status === 'In Progress') pinColor = '#ef4444'; // Red (in action)

    const circleMarker = L.circleMarker([inc.lat, inc.lng], {
      radius: inc.severity === 'Critical' ? 12 : 8,
      fillColor: pinColor,
      color: '#fff',
      weight: 1.5,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(maps.monitor);

    circleMarker.bindPopup(`
      <div class="space-y-1 text-xs">
        <div class="font-bold text-white font-display">${inc.species || inc.animalType}</div>
        <div class="text-[10px] text-emerald-400 font-bold">${inc.status} (${inc.severity})</div>
        <p class="text-[10px] text-gray-300 leading-tight">${inc.description.substring(0, 70)}...</p>
      </div>
    `);

    maps.monitorMarkers.push(circleMarker);
  });
}

function updateMonitoringCenter(data) {
  // Update numbers
  const critical = data.incidents.filter(i => i.severity === 'Critical' && i.status !== 'Resolved').length;
  const active = data.incidents.filter(i => i.status !== 'Resolved').length;
  const resolved = data.incidents.filter(i => i.status === 'Resolved').length;

  const critEl = document.getElementById('monitor-critical-cnt');
  if (critEl) critEl.innerText = critical;
  const dispEl = document.getElementById('monitor-dispatched-cnt');
  if (dispEl) dispEl.innerText = active;
  const resEl = document.getElementById('monitor-resolved-cnt');
  if (resEl) resEl.innerText = resolved;

  // Update lists
  const feed = document.getElementById('monitor-feed-list');
  if (!feed) return;
  feed.innerHTML = '';

  data.incidents.slice(0, 10).forEach(inc => {
    const timeStr = new Date(inc.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    let borderClass = "border-sky-500/20";
    if (inc.severity === 'Critical') borderClass = "border-red-500/40 bg-red-950/10";
    
    const div = document.createElement('div');
    div.className = `p-3 bg-white/5 border ${borderClass} rounded-xl space-y-1 cursor-pointer hover:bg-white/10 transition-all`;
    div.onclick = () => {
      navigateTo('tracker');
      selectTrackerIncident(inc.id);
    };
    div.innerHTML = `
      <div class="flex justify-between items-start">
        <span class="text-xs font-bold text-white">${inc.species || inc.animalType}</span>
        <span class="text-[9px] text-gray-500 font-mono">${timeStr}</span>
      </div>
      <p class="text-[11px] text-gray-400 leading-normal line-clamp-2">${inc.description}</p>
      <div class="flex justify-between items-center text-[10px] pt-1">
        <span class="text-emerald-400 font-mono font-bold">${inc.id}</span>
        <span class="text-gray-400 font-bold uppercase">${inc.status}</span>
      </div>
    `;
    feed.appendChild(div);
  });

  // Re-plot map markers
  plotMonitoringMarkers();
}

// ================= RESCUE CENTER LOCATOR =================
function initLocatorMap() {
  if (maps.locator) return;

  maps.locator = L.map('locator-main-map').setView([34.0522, -118.2437], 10);
  
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(maps.locator);

  plotLocatorMarkers();
  renderLocatorCenterList(window.db.data.rescueCenters);
}

function plotLocatorMarkers() {
  if (!maps.locator) return;

  maps.locatorMarkers.forEach(m => maps.locator.removeLayer(m));
  maps.locatorMarkers = [];

  const centers = window.db.data.rescueCenters;
  centers.forEach(c => {
    const marker = L.marker([c.lat, c.lng]).addTo(maps.locator);
    marker.bindPopup(`
      <div class="space-y-1 text-xs">
        <div class="font-bold text-white">${c.name}</div>
        <div class="text-[10px] text-emerald-400 font-bold">${c.type}</div>
        <div class="text-[10px] text-gray-300">Call: ${c.contact}</div>
      </div>
    `);
    maps.locatorMarkers.push(marker);
  });
}

function renderLocatorCenterList(centers) {
  const container = document.getElementById('locator-centers-list');
  if (!container) return;
  container.innerHTML = '';

  if (centers.length === 0) {
    container.innerHTML = `<div class="text-center py-10 text-gray-500 text-xs">No matching centers located nearby.</div>`;
    return;
  }

  centers.forEach(c => {
    const card = document.createElement('div');
    card.className = "p-3.5 bg-white/5 border border-white/5 hover:border-emerald-400/30 rounded-xl space-y-2 cursor-pointer transition-all";
    card.onclick = () => {
      maps.locator.flyTo([c.lat, c.lng], 13);
    };
    card.innerHTML = `
      <div class="space-y-0.5">
        <div class="text-xs text-emerald-400 font-bold uppercase tracking-wider">${c.type}</div>
        <h4 class="font-extrabold text-white text-sm leading-snug">${c.name}</h4>
      </div>
      <p class="text-[11px] text-gray-400 leading-normal"><i data-lucide="map-pin" class="inline w-3 h-3 text-emerald-400 mr-1"></i> ${c.address}</p>
      <div class="flex justify-between items-center text-xs pt-1.5 border-t border-white/5">
        <a href="tel:${c.contact}" onclick="event.stopPropagation();" class="text-emerald-400 font-bold hover:underline flex items-center gap-1"><i data-lucide="phone" class="w-3 h-3"></i> Call Support</a>
        <span class="text-[10px] text-gray-500 font-bold">Active Cases: ${c.activeCases}</span>
      </div>
    `;
    container.appendChild(card);
  });
  lucide.createIcons();
}

function filterLocatorCenters(query) {
  const centers = window.db.data.rescueCenters;
  const filtered = centers.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.type.toLowerCase().includes(query.toLowerCase()) || 
    c.address.toLowerCase().includes(query.toLowerCase())
  );
  renderLocatorCenterList(filtered);
}

// ================= AI BOT CHATBOT ASSISTANT =================
function clearAIChat() {
  const pane = document.getElementById('chat-messages-pane');
  pane.innerHTML = `
    <div class="flex gap-3 max-w-[80%]">
      <div class="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-bold text-emerald-400 text-xs shrink-0">
        AI
      </div>
      <div class="bg-white/5 border border-white/5 rounded-2xl p-4 text-sm text-gray-300 leading-relaxed space-y-2">
        <p>Hello! I am the automated Wildlife Emergency Specialist. I can immediately generate first aid procedures, analyze safety parameters, or provide species education.</p>
        <div class="text-xs font-bold text-emerald-400 pt-1">Try asking me about:</div>
        <div class="flex flex-wrap gap-2 text-xs">
          <button onclick="sendQuickChatPrompt('How to handle an injured hawk safely?')" class="px-2.5 py-1 bg-white/5 hover:bg-emerald-500/20 border border-white/10 rounded-lg text-emerald-400 transition-colors">Hawk Wing Injury</button>
          <button onclick="sendQuickChatPrompt('What should I do if a bear is in my garage?')" class="px-2.5 py-1 bg-white/5 hover:bg-emerald-500/20 border border-white/10 rounded-lg text-emerald-400 transition-colors">Bear in Residential</button>
          <button onclick="sendQuickChatPrompt('Green Sea turtle netting entanglement first aid')" class="px-2.5 py-1 bg-white/5 hover:bg-emerald-500/20 border border-white/10 rounded-lg text-emerald-400 transition-colors">Turtle Netting First Aid</button>
        </div>
      </div>
    </div>
  `;
}

function sendQuickChatPrompt(promptText) {
  document.getElementById('chat-user-input').value = promptText;
}

function handleChatSubmit(event) {
  event.preventDefault();
  const inputEl = document.getElementById('chat-user-input');
  const query = inputEl.value.trim();
  if (!query) return;

  // Render User Message
  appendChatMessage('User', query, 'usr');
  inputEl.value = '';

  // Processing AI Response
  setTimeout(() => {
    let aiResponse = "I have scanned our wildlife diagnostic manuals. For general incidents, please secure a 10-ft parameter, block pets/children, and avoid touching the animal. What specific category or species have you sighted?";
    
    const lowercase = query.toLowerCase();
    if (lowercase.includes('hawk') || lowercase.includes('eagle') || lowercase.includes('bird')) {
      aiResponse = `<strong>AVIAN DISTRESS PROTOCOL:</strong><br>
        1. <strong>Do Not Move Unnecessarily:</strong> Throw a large thick jacket or blanket completely over the raptor to neutralize visual panic.<br>
        2. <strong>Secure Talons:</strong> Keep arms and face clear. Talons possess high pressure grip vectors.<br>
        3. <strong>Enclosure:</strong> Place gently in a cardboard box or plastic animal crate. Keep in warm, dark, silent surroundings.<br>
        4. <strong>No Force Feeding:</strong> Avoid shoving water or food down the beak which easily floods air passages. Call our raptor specialist at +1 (555) 876-5432.`;
    } else if (lowercase.includes('bear') || lowercase.includes('mountain lion') || lowercase.includes('predator')) {
      aiResponse = `<strong>LARGE CARNIVORE INCIDENT ALERT:</strong><br>
        1. <strong>Keep Distance:</strong> Stay completely indoors. Close all ground level screen windows and security doors.<br>
        2. <strong>Create Escape Path:</strong> Ensure the bear is not trapped without routes. Remove garbage triggers.<br>
        3. <strong>Vocal Alarms:</strong> If encountered, stand tall, raise hands, make loud guttural sounds. Do not run, which triggers chasing behaviors.<br>
        4. <strong>Dispatch:</strong> Ranger units have been notified. Keep tracking telemetry active.`;
    } else if (lowercase.includes('snake') || lowercase.includes('python') || lowercase.includes('reptile')) {
      aiResponse = `<strong>SNAKE PERIMETER MITIGATION:</strong><br>
        1. <strong>Distance:</strong> Keep at least a 15-foot buffer zone. Most strikes happen when people try to kill or capture the snake.<br>
        2. <strong>Track:</strong> Monitor which shrub or pile the snake slithers under from a safe height. This helps responders retrieve it quickly.<br>
        3. <strong>Identify:</strong> Note tail markings or color gradients. Do not handle even if dead as bite vectors can trigger post-mortem muscle reactions.`;
    } else if (lowercase.includes('turtle') || lowercase.includes('marine') || lowercase.includes('sea lion')) {
      aiResponse = `<strong>MARINE ENCOUNTERS STRANDING MANUAL:</strong><br>
        1. <strong>Keep Wet:</strong> Splash ocean water gently over sea turtle shells or skin (avoid nostrils). Do not try dragging them back into heavy surf.<br>
        2. <strong>Debris Removal:</strong> If entangled in nylon commercial nets, do not cut tight knots unless you have specialized sheers. It can worsen vascular damage. Wait for marine specialists.`;
    }

    appendChatMessage('AI Assistant', aiResponse, 'ai');
  }, 600);
}

function appendChatMessage(sender, text, type) {
  const pane = document.getElementById('chat-messages-pane');
  const div = document.createElement('div');
  
  if (type === 'usr') {
    div.className = "flex gap-3 max-w-[80%] ml-auto justify-end";
    div.innerHTML = `
      <div class="bg-forest/20 border border-emerald-400/20 rounded-2xl p-4 text-sm text-gray-200">
        ${text}
      </div>
      <div class="w-8 h-8 rounded-lg bg-forest border border-emerald-400 flex items-center justify-center font-bold text-white text-xs shrink-0">
        ME
      </div>
    `;
  } else {
    div.className = "flex gap-3 max-w-[80%]";
    div.innerHTML = `
      <div class="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-bold text-emerald-400 text-xs shrink-0">
        AI
      </div>
      <div class="bg-white/5 border border-white/5 rounded-2xl p-4 text-sm text-gray-300 leading-relaxed space-y-2">
        <p>${text}</p>
      </div>
    `;
  }

  pane.appendChild(div);
  pane.scrollTo({ top: pane.scrollHeight, behavior: 'smooth' });
}

// ================= SAFETY GUIDES RENDER =================
function renderSafetyGuides() {
  const grid = document.getElementById('safety-guides-grid');
  if (!grid) return;
  grid.innerHTML = '';

  safetyGuides.forEach(sg => {
    const card = document.createElement('div');
    card.className = "glass-card p-6 rounded-2xl space-y-3 cursor-pointer safety-guide-card";
    card.dataset.type = sg.type;
    card.onclick = () => {
      navigateTo('ai-assistant');
      sendQuickChatPrompt(`First aid manual for ${sg.title} (${sg.subtitle})`);
    };
    card.innerHTML = `
      <div class="flex justify-between items-start">
        <span class="text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-forest/15 px-2.5 py-0.5 rounded-full">${sg.type.toUpperCase()}</span>
        <i data-lucide="first-aid" class="w-4 h-4 text-emerald-400"></i>
      </div>
      <h3 class="font-extrabold text-white text-lg">${sg.title}</h3>
      <div class="text-xs text-gray-400 font-semibold">${sg.subtitle}</div>
      <p class="text-xs text-gray-400 leading-relaxed line-clamp-3">${sg.content}</p>
    `;
    grid.appendChild(card);
  });
  lucide.createIcons();
}

function filterSafetyCards(type) {
  document.querySelectorAll('.safety-guide-card').forEach(card => {
    if (type === 'all' || card.dataset.type === type) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });

  // Highlight active tab button
  document.querySelectorAll('.safety-tab-btn').forEach(btn => {
    btn.classList.replace('bg-emerald-600', 'bg-white/5');
    btn.classList.add('text-gray-300');
  });
  event.target.classList.replace('bg-white/5', 'bg-emerald-600');
  event.target.classList.remove('text-gray-300');
}

// ================= WILDLIFE INCIDENT TRACKER =================
function selectTrackerIncident(id) {
  const inc = window.db.data.incidents.find(i => i.id === id);
  if (!inc) return;

  const panel = document.getElementById('tracker-detail-panel');
  if (!panel) return;

  // Timeline list HTML
  let timelineItems = '';
  inc.updates.forEach((u, index) => {
    const dateStr = new Date(u.time).toLocaleString();
    const isActive = index === inc.updates.length - 1;
    const dotColor = isActive ? 'bg-emerald-400 glow-green scale-110' : 'bg-gray-600';
    
    timelineItems += `
      <div class="flex gap-4 relative">
        ${index < inc.updates.length - 1 ? '<div class="absolute left-2.5 top-5 bottom-0 w-0.5 bg-white/10"></div>' : ''}
        <div class="w-5 h-5 rounded-full ${dotColor} z-10 shrink-0 flex items-center justify-center">
          <i data-lucide="check" class="w-3 h-3 text-navy-dark ${isActive ? '' : 'hidden'}"></i>
        </div>
        <div class="space-y-1 flex-grow pb-4">
          <div class="flex justify-between items-center text-xs">
            <span class="font-bold text-white">${u.status}</span>
            <span class="text-gray-500 font-mono">${dateStr}</span>
          </div>
          <p class="text-[11px] text-gray-400 leading-relaxed">${u.note}</p>
        </div>
      </div>
    `;
  });

  panel.innerHTML = `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-white/10 pb-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs">${inc.id}</span>
            <span class="px-2.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 font-bold text-xs">${inc.severity} Severity</span>
          </div>
          <h2 class="text-xl font-extrabold text-white">${inc.species || inc.animalType}</h2>
          <div class="text-xs text-gray-400">Transmitting to Rescue Dispatch • ${inc.assignedTeam}</div>
        </div>
        <div class="p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-right">
          <span class="text-gray-400 block mb-0.5">Overall Resolution Status</span>
          <strong class="text-emerald-400 uppercase tracking-widest text-sm flex items-center justify-end gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span> ${inc.status}</strong>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <h3 class="font-extrabold text-white text-sm uppercase tracking-wider">Telemetry Bounding Profile</h3>
          ${inc.imageUrl ? `<img src="${inc.imageUrl}" class="w-full h-44 object-cover rounded-xl border border-white/10">` : `<div class="w-full h-44 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-xs text-gray-500">No Image Evidence Uploaded</div>`}
          
          <div class="p-4 bg-white/5 rounded-xl border border-white/5 text-xs space-y-2">
            <div><strong class="text-gray-400">Reporter:</strong> <span class="text-white font-medium">${inc.reporterName}</span></div>
            <div><strong class="text-gray-400">Contact:</strong> <span class="text-white font-medium">${inc.reporterPhone}</span></div>
            <div><strong class="text-gray-400">Description:</strong> <span class="text-white leading-normal block pt-1 text-gray-300">${inc.description}</span></div>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="font-extrabold text-white text-sm uppercase tracking-wider">Rescue Response Timeline</h3>
          <div class="space-y-3">
            ${timelineItems}
          </div>
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}

function updateNotificationCenter(data) {
  const container = document.getElementById('notifications-center-body');
  if (!container) return;
  container.innerHTML = '';

  data.threatMetrics.alertLogs.forEach(alert => {
    const dateStr = new Date(alert.timestamp).toLocaleString();
    const div = document.createElement('div');
    div.className = "p-4 bg-white/5 border border-white/5 hover:border-red-400/20 rounded-2xl flex gap-4 items-start transition-all";
    div.innerHTML = `
      <div class="w-9 h-9 rounded-xl bg-red-500/10 border border-red-400/40 text-red-400 flex items-center justify-center shrink-0">
        <i data-lucide="shield-alert" class="w-5 h-5"></i>
      </div>
      <div class="space-y-1 flex-grow">
        <div class="flex justify-between items-center text-xs">
          <h4 class="font-bold text-white text-sm">${alert.title}</h4>
          <span class="text-gray-500 font-mono">${dateStr}</span>
        </div>
        <p class="text-xs text-gray-400 leading-normal">${alert.details}</p>
        <span class="inline-block text-[10px] text-red-400 uppercase font-bold tracking-widest pt-1">${alert.category}</span>
      </div>
    `;
    container.appendChild(div);
  });
  lucide.createIcons();
}

function clearAllNotifications() {
  window.db.data.threatMetrics.alertLogs = [];
  window.db.save();
  alert('Alert broadcasts successfully cleared.');
}

// ================= SPECIES TAXONOMY DATABASE =================
function renderSpeciesDatabase() {
  const grid = document.getElementById('species-db-grid');
  if (!grid) return;
  grid.innerHTML = '';

  speciesCatalog.forEach(c => {
    const isEndangered = c.status === 'Endangered';
    const statusColor = isEndangered ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white';
    
    const card = document.createElement('div');
    card.className = "glass-panel overflow-hidden rounded-2xl border border-white/10 flex flex-col justify-between";
    card.innerHTML = `
      <img src="${c.image}" class="w-full h-44 object-cover">
      <div class="p-5 space-y-3 flex-grow flex flex-col justify-between">
        <div class="space-y-1">
          <div class="flex justify-between items-center">
            <span class="text-[9px] font-mono italic text-emerald-400">${c.scientific}</span>
            <span class="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${statusColor}">${c.status}</span>
          </div>
          <h3 class="font-extrabold text-white text-base">${c.name}</h3>
          <p class="text-xs text-gray-400 leading-relaxed">${c.bio}</p>
        </div>
        
        <div class="pt-3 border-t border-white/5 flex justify-between text-xs text-gray-400">
          <div><strong class="text-white">Habitat:</strong> ${c.habitat}</div>
          <div><strong class="text-white">Risk:</strong> ${c.danger}</div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterSpeciesDatabase(query) {
  const grid = document.getElementById('species-db-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const filtered = speciesCatalog.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.scientific.toLowerCase().includes(query.toLowerCase()) || 
    c.habitat.toLowerCase().includes(query.toLowerCase())
  );

  filtered.forEach(c => {
    const isEndangered = c.status === 'Endangered';
    const statusColor = isEndangered ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white';
    
    const card = document.createElement('div');
    card.className = "glass-panel overflow-hidden rounded-2xl border border-white/10 flex flex-col justify-between";
    card.innerHTML = `
      <img src="${c.image}" class="w-full h-44 object-cover">
      <div class="p-5 space-y-3 flex-grow flex flex-col justify-between">
        <div class="space-y-1">
          <div class="flex justify-between items-center">
            <span class="text-[9px] font-mono italic text-emerald-400">${c.scientific}</span>
            <span class="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${statusColor}">${c.status}</span>
          </div>
          <h3 class="font-extrabold text-white text-base">${c.name}</h3>
          <p class="text-xs text-gray-400 leading-relaxed">${c.bio}</p>
        </div>
        <div class="pt-3 border-t border-white/5 flex justify-between text-xs text-gray-400">
          <div><strong class="text-white">Habitat:</strong> ${c.habitat}</div>
          <div><strong class="text-white">Risk:</strong> ${c.danger}</div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ================= VOLUNTEER COMMUNITY FORUMS =================
function renderCommunityForum() {
  const container = document.getElementById('community-posts-list');
  if (!container) return;
  container.innerHTML = '';

  communityPosts.forEach(post => {
    const div = document.createElement('div');
    div.className = "p-3 bg-white/5 border border-white/5 rounded-xl space-y-1";
    div.innerHTML = `
      <div class="flex justify-between items-center text-[10px]">
        <strong class="text-emerald-400">${post.name}</strong>
        <span class="text-gray-500 font-mono">${post.time}</span>
      </div>
      <p class="text-xs text-gray-300 leading-normal">${post.text}</p>
    `;
    container.appendChild(div);
  });
}

function handleCommunityPostSubmit(event) {
  event.preventDefault();
  const input = document.getElementById('community-post-input');
  const text = input.value.trim();
  if (!text) return;

  const name = window.db.data.currentUser?.name || "Active Watcher";
  communityPosts.unshift({ name, text, time: 'Just now' });
  input.value = '';
  renderCommunityForum();
}

// ================= EXECUTIVE ADMIN PANEL =================
function updateAdminConsole(data) {
  // Update Audits
  const auditsList = document.getElementById('admin-audit-logs-list');
  if (auditsList) {
    auditsList.innerHTML = '';
    data.auditLogs.slice(0, 8).forEach(audit => {
      const timeStr = new Date(audit.timestamp).toLocaleTimeString();
      const div = document.createElement('div');
      div.className = "p-3 bg-white/5 border border-white/5 rounded-xl space-y-1 text-xs";
      div.innerHTML = `
        <div class="flex justify-between items-center font-mono text-[10px]">
          <span class="text-emerald-400 font-bold">${audit.action}</span>
          <span class="text-gray-500">${timeStr}</span>
        </div>
        <p class="text-gray-300 leading-tight text-[11px]">${audit.details}</p>
        <div class="flex justify-between text-[10px] text-gray-500 font-mono pt-1">
          <span>User: ${audit.user}</span>
          <span>IP: ${audit.ipAddress}</span>
        </div>
      `;
      auditsList.appendChild(div);
    });
  }

  // Update administrative incidents overview lists
  const adminInc = document.getElementById('admin-incidents-list');
  if (adminInc) {
    adminInc.innerHTML = '';
    
    if (data.incidents.length === 0) {
      adminInc.innerHTML = `<div class="text-center py-10 text-gray-500 text-xs">No logged incidents found.</div>`;
      return;
    }

    data.incidents.forEach(inc => {
      const div = document.createElement('div');
      div.className = "p-3.5 bg-white/5 border border-white/5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs";
      div.innerHTML = `
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="font-mono text-emerald-400 font-bold">${inc.id}</span>
            <span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${inc.severity === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}">${inc.severity}</span>
          </div>
          <h4 class="font-extrabold text-white text-sm leading-snug">${inc.species || inc.animalType}</h4>
          <p class="text-[11px] text-gray-400 line-clamp-1">${inc.description}</p>
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto self-stretch md:self-auto justify-end">
          <select onchange="updateIncidentAdminOverride('${inc.id}', this.value)" class="bg-navy border border-white/10 rounded-lg p-2 text-xs text-white">
            <option value="Reported" ${inc.status === 'Reported' ? 'selected' : ''}>Reported</option>
            <option value="Assigned" ${inc.status === 'Assigned' ? 'selected' : ''}>Assigned</option>
            <option value="In Progress" ${inc.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Resolved" ${inc.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
          </select>
          <button onclick="deleteIncidentAdminOverride('${inc.id}')" class="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors" title="Expunge incident record">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      `;
      adminInc.appendChild(div);
    });
    lucide.createIcons();
  }

  // Populate dynamic analytics charts if currently in view
  if (currentView === 'analytics-dashboard') {
    initAnalyticsCharts();
  }

  // Populate threat heatmaps
  const threatList = document.getElementById('threat-high-risk-list');
  if (threatList) {
    threatList.innerHTML = '';
    data.threatMetrics.highRiskZones.forEach(zone => {
      let colorClass = "bg-yellow-500";
      if (zone.color === 'red') colorClass = "bg-red-500 glow-red";
      if (zone.color === 'orange') colorClass = "bg-orange-500";

      const div = document.createElement('div');
      div.className = "p-3.5 bg-white/5 border border-white/5 rounded-2xl space-y-2";
      div.innerHTML = `
        <div class="flex justify-between items-center text-xs">
          <span class="font-bold text-white">${zone.name}</span>
          <span class="font-mono text-emerald-400 font-bold">Threat Index: ${zone.score}/100</span>
        </div>
        <div class="w-full bg-navy rounded-full h-2 overflow-hidden">
          <div class="${colorClass} h-2 rounded-full" style="width: ${zone.score}%"></div>
        </div>
        <p class="text-[11px] text-gray-400 leading-normal font-medium">${zone.prediction}</p>
      `;
      threatList.appendChild(div);
    });
  }

  // Populate threat center telemetry stream
  const threatWarnings = document.getElementById('threat-warning-list');
  if (threatWarnings) {
    threatWarnings.innerHTML = '';
    data.threatMetrics.alertLogs.forEach(al => {
      const div = document.createElement('div');
      div.className = "p-3 bg-red-950/15 border border-red-500/20 rounded-xl space-y-1 text-xs";
      div.innerHTML = `
        <div class="font-bold text-red-400 flex items-center gap-1.5"><i data-lucide="alert-circle" class="w-4 h-4"></i> ${al.title}</div>
        <p class="text-[11px] text-gray-300 leading-relaxed">${al.details}</p>
      `;
      threatWarnings.appendChild(div);
    });
    lucide.createIcons();
  }
}

function updateIncidentAdminOverride(id, status) {
  window.db.updateIncidentStatus(id, status, `ADMIN OVERRIDE: Modified status index directly via console interface.`);
  alert(`Incident status updated.`);
}

function deleteIncidentAdminOverride(id) {
  if (!confirm("Are you sure you want to permanently erase this emergency record? This operation is logged in security audits.")) return;
  const index = window.db.data.incidents.findIndex(i => i.id === id);
  if (index !== -1) {
    window.db.data.incidents.splice(index, 1);
    window.db.addAuditLog(window.db.data.currentUser.email, 'EXPUNGE RECORD', `Incident case ${id} removed permanently.`);
    window.db.save();
    alert('Incident successfully expunged.');
  }
}

function resetDatabaseState() {
  if (!confirm("Caution: This will restore default database states, wiping all volunteers, submissions, and status logs.")) return;
  window.db.resetDatabase();
  alert('Simulation restored successfully.');
}

// ================= ANALYTICS CHARTS SYSTEM =================
function initAnalyticsCharts() {
  const data = window.db.data;
  
  // Incident statistics compiled
  const birds = data.incidents.filter(i => i.animalType === 'Bird of Prey').length;
  const reptiles = data.incidents.filter(i => i.animalType === 'Reptile').length;
  const largeMammals = data.incidents.filter(i => i.animalType === 'Large Mammal').length;
  const marine = data.incidents.filter(i => i.animalType === 'Marine Mammal').length;
  
  // Total counts
  const total = data.incidents.length;
  const resolved = data.incidents.filter(i => i.status === 'Resolved').length;
  const active = total - resolved;

  document.getElementById('stats-total-incidents').innerText = total;
  document.getElementById('stats-successful-rescues').innerText = resolved;
  document.getElementById('stats-active-ops').innerText = active;

  // Chart 1: Categories
  const ctxCat = document.getElementById('chart-inc-categories');
  if (ctxCat) {
    if (charts.categories) charts.categories.destroy();
    charts.categories = new Chart(ctxCat, {
      type: 'doughnut',
      data: {
        labels: ['Raptors', 'Reptiles', 'Mammals', 'Marine'],
        datasets: [{
          data: [birds, reptiles, largeMammals, marine],
          backgroundColor: ['#10b981', '#ef4444', '#f59e0b', '#38bdf8'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#9ca3af', font: { family: 'Outfit' } }
          }
        }
      }
    });
  }

  // Chart 2: Success Rates Month Over Month
  const ctxSuc = document.getElementById('chart-success-trend');
  if (ctxSuc) {
    if (charts.success) charts.success.destroy();
    charts.success = new Chart(ctxSuc, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Rescue Case Resolutions',
          data: [82, 88, 91, 93, resolved],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#9ca3af', font: { family: 'Outfit' } } }
        },
        scales: {
          x: { ticks: { color: '#6b7280' } },
          y: { ticks: { color: '#6b7280' } }
        }
      }
    });
  }

  // Chart 3: Geographic Distribution
  const ctxGeo = document.getElementById('chart-geo-distribution');
  if (ctxGeo) {
    if (charts.geo) charts.geo.destroy();
    charts.geo = new Chart(ctxGeo, {
      type: 'bar',
      data: {
        labels: ['Angeles Sector', 'Burbank Foothills', 'Malibu Coastal', 'Santa Monica'],
        datasets: [{
          label: 'Incident Load Density',
          data: [14, 8, 5, 12],
          backgroundColor: '#38bdf8'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#9ca3af', font: { family: 'Outfit' } } }
        },
        scales: {
          x: { ticks: { color: '#6b7280' } },
          y: { ticks: { color: '#6b7280' } }
        }
      }
    });
  }
}

// ================= REPORT GENERATION =================
function updateReportGenerator(data) {
  // Update Printable card figures
  const total = data.incidents.length;
  const critical = data.incidents.filter(i => i.severity === 'Critical' || i.severity === 'High').length;
  const resolved = data.incidents.filter(i => i.status === 'Resolved').length;
  const rate = total > 0 ? Math.round((resolved / total) * 100) : 100;

  const totalEl = document.getElementById('rep-gen-total');
  if (totalEl) totalEl.innerText = total;
  const critEl = document.getElementById('rep-gen-critical');
  if (critEl) critEl.innerText = critical;
  const rateEl = document.getElementById('rep-gen-rate');
  if (rateEl) rateEl.innerText = `${rate}%`;

  const tsEl = document.getElementById('rep-gen-timestamp');
  if (tsEl) tsEl.innerText = `Report compiled: ${new Date().toLocaleString()}`;

  // Update lists
  const container = document.getElementById('rep-gen-list');
  if (!container) return;
  container.innerHTML = '';

  data.incidents.forEach(inc => {
    const timeStr = new Date(inc.timestamp).toLocaleDateString();
    const div = document.createElement('div');
    div.className = "py-2 border-b border-white/5 flex justify-between items-center text-xs text-gray-300";
    div.innerHTML = `
      <div>
        <span class="font-mono text-emerald-400 font-bold">${inc.id}</span> - 
        <strong class="text-white">${inc.species || inc.animalType}</strong> (${inc.severity})
      </div>
      <div class="text-right text-[10px] text-gray-500 font-mono">
        Status: ${inc.status} • ${timeStr}
      </div>
    `;
    container.appendChild(div);
  });

  // Track inventory list inside incident tracker page
  const trackerInventory = document.getElementById('tracker-inventory-list');
  if (trackerInventory) {
    trackerInventory.innerHTML = '';
    data.incidents.forEach(inc => {
      const activeClass = "bg-white/5 hover:bg-white/10";
      
      const div = document.createElement('div');
      div.className = `p-3 rounded-xl border border-white/5 cursor-pointer transition-all ${activeClass}`;
      div.onclick = () => selectTrackerIncident(inc.id);
      div.innerHTML = `
        <div class="flex justify-between items-center text-xs mb-1">
          <span class="font-mono text-emerald-400 font-bold">${inc.id}</span>
          <span class="px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase ${inc.severity === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/15 text-emerald-400'}">${inc.severity}</span>
        </div>
        <h4 class="font-bold text-white text-xs leading-snug line-clamp-1">${inc.species || inc.animalType}</h4>
        <div class="flex justify-between items-center text-[10px] text-gray-500 pt-1 border-t border-white/5 mt-1.5">
          <span>Status: ${inc.status}</span>
          <span>${new Date(inc.timestamp).toLocaleDateString([], {month:'short', day:'numeric'})}</span>
        </div>
      `;
      trackerInventory.appendChild(div);
    });

    // Auto-select first incident to populate details
    if (data.incidents.length > 0) {
      selectTrackerIncident(data.incidents[0].id);
    }
  }
}

function simulateCSVExport() {
  const data = window.db.data.incidents;
  let csvContent = "data:text/csv;charset=utf-8,Incident ID,Animal Type,Species,Severity,Status,Latitude,Longitude,Date\n";
  
  data.forEach(inc => {
    csvContent += `"${inc.id}","${inc.animalType}","${inc.species || ''}","${inc.severity}","${inc.status}",${inc.lat},${inc.lng},"${new Date(inc.timestamp).toLocaleDateString()}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `wildlife_emergency_incidents_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
