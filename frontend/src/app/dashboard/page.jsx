'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, UserCheck, AlertCircle, PlusCircle, CheckCircle2, 
  MapPin, Send, MessageSquare, AlertTriangle, Printer, DownloadCloud, Leaf, Trash2, ShieldCheck, Flame, BookOpen
} from 'lucide-react';

// Import Shared Components
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import AIClassifier from '../../components/AIClassifier';
import MapView from '../../components/MapView';

const BACKEND_URL = 'http://localhost:5000/api';

export default function DashboardPortal() {
  const [currentRole, setCurrentRole] = useState('admin');
  const [activeView, setActiveView] = useState('dashboard');
  
  // Incidents and Audits states fetched from Localhost API
  const [incidents, setIncidents] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [analyticsMetrics, setAnalyticsMetrics] = useState(null);
  const [rescueCenters, setRescueCenters] = useState([
    { id: 'rc_001', name: 'Pacific Coast Wildlife Hospital', type: 'Veterinary Hospital', lat: 34.0259, lng: -118.4912, contact: '+1 (555) 234-5678', address: '1220 Ocean Blvd, Santa Monica, CA', activeCases: 14 },
    { id: 'rc_002', name: 'Highland Raptor Sanctuary', type: 'Specialized Center', lat: 34.1808, lng: -118.3090, contact: '+1 (555) 876-5432', address: '2900 Foothill Way, Burbank, CA', activeCases: 7 }
  ]);
  
  // Active User session profile state
  const [activeUser, setActiveUser] = useState({
    name: 'Dr. Sarah Connor',
    role: 'admin',
    email: 'admin@wildlife.org'
  });

  // Report Form States
  const [repAnimalType, setRepAnimalType] = useState('Bird of Prey');
  const [repSpecies, setRepSpecies] = useState('Golden Eagle');
  const [repCategory, setRepCategory] = useState('Injured / Cannot Fly');
  const [repSeverity, setRepSeverity] = useState('High');
  const [repLat, setRepLat] = useState(34.0522);
  const [repLng, setRepLng] = useState(-118.2437);
  const [repDesc, setRepDesc] = useState('');
  const [repName, setRepName] = useState('Alex Mercer');
  const [repPhone, setRepPhone] = useState('+1 (555) 012-3456');

  // AI Assistant Chatbot States
  const [chatMessages, setChatMessages] = useState([
    { sender: 'AI', text: 'Hello! I am your automated Wildlife Rescue Specialist. How can I assist you with safety protocols or first aid guides today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Sighting Forum Post States
  const [forumInput, setForumInput] = useState('');
  const [forumPosts, setForumPosts] = useState([
    { name: 'Ranger Dave', text: 'Avian vector monitors report zero active bird pathogens in Burbank this week.', time: '2 hours ago' }
  ]);

  // Selected incident tracker state
  const [trackerIncidentId, setTrackerIncidentId] = useState('inc_001');

  // Fetch data from backend on startup
  useEffect(() => {
    fetchIncidents();
    fetchAnalytics();
  }, []);

  const fetchIncidents = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/incidents`);
      const data = await res.json();
      setIncidents(data);
      if (data.length > 0) {
        setTrackerIncidentId(data[0].id);
      }
    } catch (err) {
      console.log('Failed to fetch from backend. Activating fallback local storage mock.');
      // Fallback local storage logic
      const saved = localStorage.getItem('wildlife_fallback_incidents');
      if (saved) {
        setIncidents(JSON.parse(saved));
      } else {
        const fallbacks = [
          { id: 'inc_001', animalType: 'Bird of Prey', species: 'Golden Eagle', category: 'Injured / Cannot Fly', description: 'Wing injury near northern trail.', lat: 34.0522, lng: -118.2437, severity: 'High', status: 'In Progress', assignedTeam: 'Alpha Raptor Unit', timestamp: new Date().toISOString() },
          { id: 'inc_002', animalType: 'Reptile', species: 'Reticulated Python', category: 'Urban Conflict', description: 'Snake spotted near residential park.', lat: 34.0928, lng: -118.3287, severity: 'Critical', status: 'Assigned', assignedTeam: 'Emerald Serpent Unit', timestamp: new Date().toISOString() }
        ];
        setIncidents(fallbacks);
        localStorage.setItem('wildlife_fallback_incidents', JSON.stringify(fallbacks));
      }
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/analytics/metrics`);
      const data = await res.json();
      setAnalyticsMetrics(data);
    } catch (err) {
      console.log('Analytics backend loading offline.');
    }
  };

  const handleRoleChange = (role) => {
    setCurrentRole(role);
    const userNames = {
      admin: { name: 'Dr. Sarah Connor', email: 'admin@wildlife.org' },
      responder: { name: 'Marcus Vance', email: 'responder@wildlife.org' },
      citizen: { name: 'Alex Mercer', email: 'citizen@example.com' }
    };
    const profile = userNames[role] || { name: 'Alex Mercer', email: 'citizen@example.com' };
    setActiveUser({ ...profile, role });

    // Append logs
    const newLog = {
      id: 'aud_' + Date.now(),
      timestamp: new Date().toISOString(),
      user: profile.email,
      action: 'Session Role Change',
      details: `User simulated credentials mapped to role ${role.toUpperCase()}`
    };
    setAuditLogs(prev => [newLog, ...prev]);

    if (role === 'citizen') setActiveView('dashboard');
    else if (role === 'responder') setActiveView('operations');
    else if (role === 'admin') setActiveView('admin');
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const newIncData = {
      animalType: repAnimalType,
      species: repSpecies,
      category: repCategory,
      description: repDesc,
      lat: parseFloat(repLat),
      lng: parseFloat(repLng),
      severity: repSeverity,
      reporterName: repName,
      reporterPhone: repPhone
    };

    try {
      const res = await fetch(`${BACKEND_URL}/incidents/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIncData)
      });
      const result = await res.json();
      alert(`Emergency incident dispatched to Localhost server! ID: ${result.id}`);
      fetchIncidents();
    } catch (err) {
      console.log('Backend offline. Saving to local storage fallback.');
      const localInc = { ...newIncData, id: 'inc_' + Math.floor(100 + Math.random() * 900), status: 'Reported', assignedTeam: 'Unassigned', timestamp: new Date().toISOString() };
      const updated = [localInc, ...incidents];
      setIncidents(updated);
      localStorage.setItem('wildlife_fallback_incidents', JSON.stringify(updated));
      alert(`Emergency incident saved locally (Fallback mode). ID: ${localInc.id}`);
    }

    setRepDesc('');
    setActiveView('tracker');
  };

  const handleDispatchTeam = async (incId, teamName) => {
    try {
      await fetch(`${BACKEND_URL}/incidents/update/${incId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Assigned', assignedTeam: teamName })
      });
      alert(`Response team ${teamName} assigned successfully via server!`);
      fetchIncidents();
    } catch (err) {
      console.log('Backend offline. Updating local storage fallback.');
      const updated = incidents.map(i => i.id === incId ? { ...i, status: 'Assigned', assignedTeam: teamName } : i);
      setIncidents(updated);
      localStorage.setItem('wildlife_fallback_incidents', JSON.stringify(updated));
      alert('Local storage incident squad reassigned.');
    }
  };

  const handleResolveIncident = async (incId) => {
    try {
      await fetch(`${BACKEND_URL}/incidents/update/${incId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Resolved' })
      });
      alert(`Incident ${incId} marked resolved on server.`);
      fetchIncidents();
    } catch (err) {
      console.log('Backend offline. Resolving local storage.');
      const updated = incidents.map(i => i.id === incId ? { ...i, status: 'Resolved' } : i);
      setIncidents(updated);
      localStorage.setItem('wildlife_fallback_incidents', JSON.stringify(updated));
      alert('Local incident resolved.');
    }
  };

  const handleInjectAIDiagnostics = (aiResult) => {
    setRepSpecies(aiResult.name);
    setRepAnimalType(aiResult.name.includes('Eagle') ? 'Bird of Prey' : aiResult.name.includes('Bear') ? 'Large Mammal' : 'Reptile');
    setRepSeverity(aiResult.risk === 'High' ? 'Critical' : 'High');
    setActiveView('report');
    alert('AI Diagnostics loaded into form.');
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'User', text: chatInput };
    let replyText = 'Secure coordinate channels are active. Keep a 10-ft parameter clearance and keep safe distances. What specific species distress are you witnessing?';
    
    const query = chatInput.toLowerCase();
    if (query.includes('hawk') || query.includes('eagle') || query.includes('bird')) {
      replyText = '<strong>AVIAN PERIMETER PROCEDURE:</strong> Cover the bird gently with a dark heavy blanket to neutralize panic. talons are strong, avoid contact. Do not force water down the beak.';
    } else if (query.includes('bear') || query.includes('mountain lion')) {
      replyText = '<strong>LARGE CARNIVORE INTELLIGENCE:</strong> Stay completely indoors. Close all ground level gates. Stand tall and produce deep vocal warnings. Do not trigger running chase reflexes.';
    } else if (query.includes('snake') || query.includes('python')) {
      replyText = '<strong>REPTILE HAZARD MITIGATION:</strong> Do not confront. Track target movement towards structural crevices from safe yards. Most bites occur when trying to trap manually.';
    }

    setChatMessages(prev => [...prev, userMsg, { sender: 'AI', text: replyText }]);
    setChatInput('');
  };

  const handleForumSubmit = (e) => {
    e.preventDefault();
    if (!forumInput.trim()) return;

    setForumPosts(prev => [{ name: activeUser.name, text: forumInput, time: 'Just now' }, ...prev]);
    setForumInput('');
  };

  return (
    <div className="flex-grow flex flex-col">
      <Navbar 
        currentRole={currentRole} 
        onRoleChange={handleRoleChange} 
        onNavigate={setActiveView}
        activeUser={activeUser}
      />

      <div className="flex-grow flex flex-col lg:flex-row relative">
        <Sidebar 
          currentRole={currentRole} 
          activeView={activeView} 
          onNavigate={setActiveView}
        />

        <main className="flex-grow p-4 lg:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
          {/* ================= CITIZEN VIEWPORT PAGES ================= */}
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-black text-white">Welcome Sighting Volunteer, <span className="text-emerald-400">{activeUser.name}</span></h1>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 col-span-2">
                  <h3 className="font-extrabold text-white text-base">Emergency Incident Sighting Actions</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <button onClick={() => { setRepAnimalType('Bird of Prey'); setRepSpecies('Hawk Sighting'); setActiveView('report'); }} className="p-3 bg-white/5 border border-white/10 hover:border-emerald-400/30 rounded-xl text-center space-y-2 transition-all">
                      <span className="text-emerald-400 text-xs font-bold block">Hawk Rescue</span>
                    </button>
                    <button onClick={() => { setRepAnimalType('Reptile'); setRepSpecies('Python'); setRepSeverity('Critical'); setActiveView('report'); }} className="p-3 bg-white/5 border border-white/10 hover:border-emerald-400/30 rounded-xl text-center space-y-2 transition-all">
                      <span className="text-red-400 text-xs font-bold block">Python sighting</span>
                    </button>
                    <button onClick={() => { setRepAnimalType('Large Mammal'); setRepSpecies('Bear'); setActiveView('report'); }} className="p-3 bg-white/5 border border-white/10 hover:border-emerald-400/30 rounded-xl text-center space-y-2 transition-all">
                      <span className="text-yellow-400 text-xs font-bold block">Bear near cabins</span>
                    </button>
                    <button onClick={() => { setRepAnimalType('Marine Mammal'); setRepSpecies('Sea Lion'); setActiveView('report'); }} className="p-3 bg-white/5 border border-white/10 hover:border-emerald-400/30 rounded-xl text-center space-y-2 transition-all">
                      <span className="text-sky-400 text-xs font-bold block">Marine Stranding</span>
                    </button>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
                  <h3 className="font-bold text-white text-sm">System Alerts Ticker</h3>
                  <div className="p-2.5 bg-red-950/20 border border-red-500/20 rounded-xl space-y-1">
                    <div className="text-xs font-extrabold text-red-400">Severe Wildfire Perimeters</div>
                    <p className="text-[10px] text-gray-300 leading-normal">High animal displacements into foothill suburban borders expected.</p>
                  </div>
                </div>
              </div>

              {/* Incidents Table list */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <h3 className="font-extrabold text-white text-lg">My Emergency Incident Listings</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 text-xs uppercase font-bold">
                        <th className="pb-3">Incident ID</th>
                        <th className="pb-3">Species Sighting</th>
                        <th className="pb-3">Severity</th>
                        <th className="pb-3">Assigned Responders</th>
                        <th className="pb-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {incidents.map(inc => (
                        <tr key={inc.id} className="hover:bg-white/5 transition-all cursor-pointer" onClick={() => { setTrackerIncidentId(inc.id); setActiveView('tracker'); }}>
                          <td className="py-3 font-mono text-emerald-400 font-bold">{inc.id}</td>
                          <td className="py-3 font-medium text-white">{inc.species}</td>
                          <td className="py-3 text-red-400">{inc.severity}</td>
                          <td className="py-3 text-gray-400">{inc.assignedTeam}</td>
                          <td className="py-3 text-right text-emerald-400 uppercase font-bold">{inc.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= EMERGENCY REPORTING FORM ================= */}
          {activeView === 'report' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-black text-white">Emergency Sighting Transmit Form</h1>
              <div className="grid lg:grid-cols-3 gap-8">
                <form onSubmit={handleReportSubmit} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 col-span-2">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Animal Category</label>
                      <select value={repAnimalType} onChange={e => setRepAnimalType(e.target.value)} className="w-full bg-navy border border-white/10 rounded-xl px-3 py-2 text-xs text-white">
                        <option value="Bird of Prey">Bird of Prey (Hawk, Eagle)</option>
                        <option value="Reptile">Reptile (Snake, Python)</option>
                        <option value="Large Mammal">Large Mammal (Bear, Deer)</option>
                        <option value="Marine Mammal">Marine Mammal (Sea Lion, Turtle)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Species Sighting</label>
                      <input type="text" value={repSpecies} onChange={e => setRepSpecies(e.target.value)} className="w-full bg-navy border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Emergency Issue Type</label>
                      <select value={repCategory} onChange={e => setRepCategory(e.target.value)} className="w-full bg-navy border border-white/10 rounded-xl px-3 py-2 text-xs text-white">
                        <option value="Injured / Cannot Fly">Injured / Disabled</option>
                        <option value="Entanglement">Net Entanglement</option>
                        <option value="Urban Conflict">Urban Encroachment</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Severity Sighting</label>
                      <select value={repSeverity} onChange={e => setRepSeverity(e.target.value)} className="w-full bg-navy border border-white/10 rounded-xl px-3 py-2 text-xs text-white">
                        <option value="Medium">Medium (Stable)</option>
                        <option value="High">High (Distressed)</option>
                        <option value="Critical">Critical (Immediate Hazard)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="number" step="any" value={repLat} onChange={e => setRepLat(e.target.value)} className="w-full bg-navy border border-white/10 rounded-xl p-2 text-xs text-white" placeholder="Latitude" />
                    <input type="number" step="any" value={repLng} onChange={e => setRepLng(e.target.value)} className="w-full bg-navy border border-white/10 rounded-xl p-2 text-xs text-white" placeholder="Longitude" />
                  </div>

                  <textarea value={repDesc} onChange={e => setRepDesc(e.target.value)} placeholder="Explain injuries or perimeter conditions..." required rows="3" className="w-full bg-navy border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
                  
                  <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md">
                    <Send className="w-4 h-4" /> TRANSMIT TELEMETRY INCIDENT SIGNAL
                  </button>
                </form>

                {/* Map picker panel */}
                <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
                  <h3 className="font-extrabold text-white text-base mb-2">Location Coordinate Selection</h3>
                  <MapView selectable center={[repLat, repLng]} onSelectCoords={(lat, lng) => { setRepLat(lat.toFixed(4)); setRepLng(lng.toFixed(4)); }} />
                </div>
              </div>
            </div>
          )}

          {/* ================= AI IDENTIFIER ================= */}
          {activeView === 'identify' && (
            <AIClassifier onInjectReport={handleInjectAIDiagnostics} />
          )}

          {/* ================= RESCUE OPERATIONS ================= */}
          {activeView === 'operations' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-black text-white">Active Operational Mission Control</h1>
              <div className="grid md:grid-cols-3 gap-6">
                {incidents.filter(i => i.status !== 'Resolved').map(inc => (
                  <div key={inc.id} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono text-emerald-400 font-bold">{inc.id}</span>
                      <span className="text-red-400">{inc.severity}</span>
                    </div>
                    <h3 className="font-extrabold text-white text-base">{inc.species}</h3>
                    <p className="text-xs text-gray-400">{inc.description}</p>
                    
                    <div className="pt-2 border-t border-white/5 text-xs text-gray-300">
                      <div>Assigned Squad: <strong>{inc.assignedTeam}</strong></div>
                      <div>Mission Status: <strong className="text-yellow-400">{inc.status}</strong></div>
                    </div>

                    <div className="flex gap-2">
                      <select onChange={(e) => handleDispatchTeam(inc.id, e.target.value)} className="bg-navy border border-white/10 rounded-lg p-1.5 text-[11px] text-white flex-grow">
                        <option value="">Assign Squad</option>
                        <option value="Alpha Raptor Unit">Alpha Raptor Unit</option>
                        <option value="Emerald Serpent Unit">Emerald Serpent Unit</option>
                      </select>
                      <button onClick={() => handleResolveIncident(inc.id)} className="px-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-[10px] font-bold text-white uppercase">Resolve</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= REAL-TIME MONITORING MAPS ================= */}
          {activeView === 'monitoring' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-black text-white">Active Spotter Telemetry Stream</h1>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="glass-panel p-6 rounded-3xl border border-white/10 col-span-2 space-y-3">
                  <h3 className="font-bold text-white text-base">Hotspot Collision Map</h3>
                  <MapView height="420px" markers={incidents.map(i => ({ lat: i.lat, lng: i.lng, color: i.status === 'Resolved' ? '#10b981' : '#ef4444', popup: i.species }))} />
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3 max-h-[480px] overflow-y-auto">
                  <h3 className="font-bold text-white text-base">Active Log Updates</h3>
                  <div className="space-y-2">
                    {incidents.map(inc => (
                      <div key={inc.id} className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <strong className="text-white">{inc.species}</strong>
                          <span className="text-emerald-400 font-mono">{inc.id}</span>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-normal">{inc.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= SHELTER LOCATOR ================= */}
          {activeView === 'locator' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-black text-white">Clinical Shelter Locator</h1>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="space-y-3 max-h-[480px] overflow-y-auto">
                  {rescueCenters.map(rc => (
                    <div key={rc.id} className="glass-panel p-4 rounded-xl border border-white/10 space-y-1 hover:border-emerald-400/30 transition-all cursor-pointer">
                      <h4 className="font-extrabold text-white text-sm">{rc.name}</h4>
                      <p className="text-xs text-gray-400"><MapPin className="inline w-3.5 h-3.5 text-emerald-400 mr-1" /> {rc.address}</p>
                      <div className="text-xs text-emerald-400 font-bold pt-1.5 border-t border-white/5 mt-2">Call Center: {rc.contact}</div>
                    </div>
                  ))}
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-white/10 col-span-2 space-y-3">
                  <h3 className="font-bold text-white text-base">Ranger Station Overlay Map</h3>
                  <MapView height="420px" markers={rescueCenters.map(r => ({ lat: r.lat, lng: r.lng, color: '#38bdf8', popup: r.name }))} />
                </div>
              </div>
            </div>
          )}

          {/* ================= AI CHAT ASSISTANT ================= */}
          {activeView === 'assistant' && (
            <div className="max-w-2xl mx-auto glass-panel border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[520px]">
              <div className="bg-forest/20 border-b border-white/10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-forest border border-emerald-400/40 flex items-center justify-center text-white font-bold">AI</div>
                  <div>
                    <h3 className="font-bold text-white leading-none">First Aid Diagnostics Bot</h3>
                    <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-bold">Safety advisor</span>
                  </div>
                </div>
              </div>

              <div className="flex-grow p-4 overflow-y-auto space-y-3">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 max-w-[80%] ${msg.sender === 'User' ? 'ml-auto justify-end' : ''}`}>
                    <div className={`rounded-xl p-3.5 text-xs ${msg.sender === 'User' ? 'bg-forest/20 border border-emerald-400/20 text-gray-200' : 'bg-white/5 border border-white/5 text-gray-300 leading-normal'}`} dangerouslySetInnerHTML={{ __html: msg.text }} />
                  </div>
                ))}
              </div>

              <form onSubmit={handleChatSubmit} className="border-t border-white/10 p-3 bg-navy-dark/60 flex gap-2">
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} className="flex-grow bg-navy border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none" placeholder="Ask about snake warnings, bear safety or hawk wing injuries..." />
                <button type="submit" className="px-4 bg-forest hover:bg-emerald-600 rounded-xl text-white font-bold text-xs">Send</button>
              </form>
            </div>
          )}

          {/* ================= VOLUNTEER FORUMS & CAMPAIGNS ================= */}
          {activeView === 'community' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-black text-white">Volunteer Community Portal</h1>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="glass-panel p-6 rounded-3xl border border-white/10 col-span-2 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-white text-base">Active Volunteer Sweeps</h3>
                    <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <strong className="text-white block">Angeles Forest Refuse Clearings</strong>
                        <span className="text-[10px] text-emerald-400">Targeting trash files that trap coyotes and deer</span>
                      </div>
                      <button onClick={() => alert('Successfully registered for sweep.')} className="px-3.5 py-1.5 bg-forest hover:bg-emerald-600 rounded-lg text-[10px] font-bold text-white transition-colors">Register</button>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <h3 className="font-bold text-white text-xs">Volunteer Bulletin Feed</h3>
                    <div className="space-y-2 max-h-[220px] overflow-y-auto">
                      {forumPosts.map((post, idx) => (
                        <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs">
                          <div className="flex justify-between items-center text-[10px] mb-1">
                            <span className="font-bold text-emerald-400">{post.name}</span>
                            <span className="text-gray-500 font-mono">{post.time}</span>
                          </div>
                          <p className="text-gray-300 leading-normal">{post.text}</p>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleForumSubmit} className="flex gap-2">
                      <input type="text" value={forumInput} onChange={e => setForumInput(e.target.value)} placeholder="Write updates on local trails..." className="flex-grow bg-navy border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
                      <button type="submit" className="px-4 bg-forest hover:bg-emerald-600 rounded-xl text-xs font-bold text-white">Post</button>
                    </form>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                  <h3 className="font-bold text-white text-sm">Enroll in Incident Training</h3>
                  <p className="text-xs text-gray-400 leading-normal">Register to secure authorized biological responder credentials and obtain rapid alerts during local translocations.</p>
                  <form onSubmit={e => { e.preventDefault(); alert('Training modules enabled on profile.'); }} className="space-y-3">
                    <select className="w-full bg-navy border border-white/10 rounded-xl p-2 text-xs text-white">
                      <option value="avian">Avian Raptor Handling</option>
                      <option value="herpetology">Herpetology Containment</option>
                    </select>
                    <button type="submit" className="w-full py-2.5 bg-forest hover:bg-emerald-600 rounded-xl text-xs font-bold text-white">Register for class</button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ================= EXECUTIVE ADMIN INTERFACE ================= */}
          {activeView === 'admin' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-black text-white">Ranger Dispatch Control</h1>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="glass-panel p-6 rounded-3xl border border-white/10 col-span-2 space-y-4">
                  <h3 className="font-bold text-white text-base">Active Command Incidents Queue</h3>
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto">
                    {incidents.map(inc => (
                      <div key={inc.id} className="p-3.5 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <strong className="text-white block font-display">{inc.species}</strong>
                          <span className="text-[10px] text-red-400 font-bold uppercase">{inc.severity} Severity</span>
                        </div>
                        <select 
                          value={inc.status} 
                          onChange={(e) => {
                            handleDispatchTeam(inc.id, inc.assignedTeam || 'Unassigned');
                          }}
                          className="bg-navy border border-white/10 rounded-lg p-1.5 text-xs text-white focus:outline-none"
                        >
                          <option value="Reported">Reported</option>
                          <option value="Assigned">Assigned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3 max-h-[480px] overflow-y-auto">
                  <h3 className="font-bold text-white text-base flex items-center gap-1.5 text-emerald-400"><ShieldCheck className="w-5 h-5" /> Operational Audit Logs</h3>
                  <div className="space-y-2">
                    {auditLogs.map(log => (
                      <div key={log.id} className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-[11px] font-mono leading-tight space-y-1">
                        <div className="flex justify-between items-center text-emerald-400">
                          <strong>{log.action}</strong>
                          <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-gray-300">{log.details}</p>
                        <div className="text-[9px] text-gray-500">Operator: {log.user}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= INCIDENT TRACKER ================= */}
          {activeView === 'tracker' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-black text-white">Active Sighting Tracker</h1>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-base mb-1">Logged Cases</h3>
                  {incidents.map(inc => (
                    <div key={inc.id} onClick={() => setTrackerIncidentId(inc.id)} className={`p-3 rounded-xl border border-white/10 cursor-pointer transition-all ${trackerIncidentId === inc.id ? 'bg-forest/20 border-emerald-400' : 'bg-white/5 hover:bg-white/10'}`}>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="font-mono text-emerald-400 font-bold">{inc.id}</span>
                        <span className="text-gray-400">{inc.severity}</span>
                      </div>
                      <h4 className="font-bold text-white text-xs">{inc.species}</h4>
                      <div className="text-[10px] text-emerald-400 font-bold pt-1.5 border-t border-white/5 mt-2">Sighting Status: {inc.status}</div>
                    </div>
                  ))}
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-white/10 col-span-2 space-y-6">
                  {(() => {
                    const activeInc = incidents.find(i => i.id === trackerIncidentId);
                    if (!activeInc) return <div className="text-center py-20 text-gray-500">No active cases selected.</div>;
                    
                    return (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                          <div>
                            <span className="font-mono text-emerald-400 font-bold text-xs">{activeInc.id}</span>
                            <h2 className="text-xl font-extrabold text-white mt-1">{activeInc.species}</h2>
                          </div>
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded-lg text-xs uppercase">{activeInc.status}</span>
                        </div>

                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-xs space-y-2 text-gray-300">
                          <div><strong>Incident description:</strong> {activeInc.description}</div>
                          <div><strong>Assigned Team:</strong> {activeInc.assignedTeam}</div>
                          <div><strong>Coordinates:</strong> [{activeInc.lat.toFixed(4)}, {activeInc.lng.toFixed(4)}]</div>
                        </div>

                        {/* Tracker Timeline Mock */}
                        <div className="space-y-3 pt-3">
                          <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Action Progress Logs</h4>
                          <div className="space-y-4 pl-4 border-l border-white/10">
                            <div className="relative text-xs">
                              <span className="absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full bg-emerald-400" />
                              <strong className="text-white block font-bold">Incident Logged</strong>
                              <span className="text-[10px] text-gray-500">Report details securely logged inside Firebase systems.</span>
                            </div>
                            {activeInc.status !== 'Reported' && (
                              <div className="relative text-xs">
                                <span className="absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                <strong className="text-white block font-bold">Responder Dispatched</strong>
                                <span className="text-[10px] text-gray-500">Squad units en-route to map point target coordinates.</span>
                              </div>
                            )}
                            {activeInc.status === 'Resolved' && (
                              <div className="relative text-xs">
                                <span className="absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                <strong className="text-white block font-bold">Case Resolved</strong>
                                <span className="text-[10px] text-gray-500">Animal securely relocated to wildlife zone coordinates.</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* ================= PRINT AND CSV REPORT EXPORTS ================= */}
          {activeView === 'reports-export' && (
            <div className="max-w-2xl mx-auto glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Ranger Summary Report Export</h2>
                  <p className="text-xs text-gray-400">Export active telemetry load densities and case metrics.</p>
                </div>
              </div>

              <div className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-3 text-xs">
                  <span className="font-bold text-white">Central Operations Center Sighting History</span>
                  <span className="text-emerald-400 font-mono">Date: 2026-05-31</span>
                </div>
                
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {incidents.map(inc => (
                    <div key={inc.id} className="flex justify-between text-xs py-1.5 border-b border-white/5 text-gray-300">
                      <span>[{inc.id}] {inc.species}</span>
                      <span className="text-gray-500 font-mono">Status: {inc.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => window.print()} className="flex-grow py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md">
                  <Printer className="w-4 h-4" /> Print Summary Report PDF
                </button>
                <a 
                  href={`${BACKEND_URL}/analytics/export-csv`}
                  className="flex-grow py-3 bg-navy border border-emerald-400/30 hover:bg-forest/20 text-emerald-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 text-center"
                >
                  <DownloadCloud className="w-4 h-4" /> Export Sighting CSV
                </a>
              </div>
            </div>
          )}

          {/* ================= TAXONOMY SPECIES DATABASE ================= */}
          {activeView === 'database' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-black text-white">Fauna Sighting Taxonomy Catalog</h1>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Golden Eagle', scientific: 'Aquila chrysaetos', status: 'Least Concern', danger: 'Medium', habitat: 'High Mountains / Cliffs', bio: 'Apex avian predator with a 7ft wingspan.', img: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Reticulated Python', scientific: 'Malayopython reticulatus', status: 'Least Concern', danger: 'Severe', habitat: 'Foothills Scrublands', bio: 'Non-venomous constrictor snake with immense power.', img: 'https://images.unsplash.com/photo-1531386151447-fd762e7a3ae8?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Green Sea Turtle', scientific: 'Chelonia mydas', status: 'Endangered', danger: 'Low', habitat: 'Shoreline Reefs', bio: 'Herbivorous ocean turtle vulnerable to netting.', img: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=400&q=80' }
                ].map((sp, idx) => (
                  <div key={idx} className="glass-panel overflow-hidden rounded-2xl border border-white/10 flex flex-col justify-between">
                    <img src={sp.img} className="w-full h-40 object-cover" />
                    <div className="p-4 space-y-2.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="italic text-emerald-400 font-mono">{sp.scientific}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">{sp.status}</span>
                      </div>
                      <h3 className="font-extrabold text-white text-base">{sp.name}</h3>
                      <p className="text-xs text-gray-400 leading-normal">{sp.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= FIRST AID MANUALS ================= */}
          {activeView === 'safety' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-black text-white">First Aid Guides</h1>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Avian Wing Trauma Guides', subtitle: 'Birds of Prey', body: 'Throw a heavy jacket gently over the hawk. Talons contain massive grasp force. Confine in dark plastic boxes, do not force food.' },
                  { title: 'Snake Buffer Clearance', subtitle: 'Reptiles', body: 'Maintain a strict 15-foot buffer zone. Track which brush or pile the snake escapes under. Do not attempt trapping.' },
                  { title: 'Bear Intrusion Defenses', subtitle: 'Mammals', body: 'Stay indoors, lock lower level screen doors. Make vocal noises to scare. Ensure bear has free escape routes.' }
                ].map((gf, idx) => (
                  <div key={idx} className="glass-card p-5 rounded-2xl space-y-3 cursor-pointer" onClick={() => { setActiveView('assistant'); setChatMessages(prev => [...prev, { sender: 'User', text: `First aid guide for ${gf.title}` }]); }}>
                    <div className="flex justify-between items-start text-[10px]">
                      <span className="px-2.5 py-0.5 rounded-full bg-forest/15 text-emerald-400 font-bold uppercase tracking-wider">GUIDE</span>
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h3 className="font-extrabold text-white text-base leading-snug">{gf.title}</h3>
                    <div className="text-[10px] text-gray-400 font-bold">{gf.subtitle}</div>
                    <p className="text-xs text-gray-400 leading-relaxed">{gf.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
