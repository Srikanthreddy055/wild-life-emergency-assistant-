'use client';

import React, { useState } from 'react';
import { Lock, ShieldCheck, Unlock, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const [authMode, setAuthMode] = useState('login'); // login | register | otp | forgot
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [simRole, setSimRole] = useState('admin');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthMode('otp');
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    alert('Account created. Verifying phone number via OTP.');
    setAuthMode('otp');
  };

  const verifyOTP = () => {
    if (otp === '778931') {
      alert('Authentication verified successfully! Moving to Dashboard.');
      window.location.href = `/dashboard?role=${simRole}`;
    } else {
      alert('Invalid OTP token. Please enter 778931.');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4">
      <div className="glass-panel p-8 rounded-3xl border border-white/10 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-forest/20 border border-emerald-400/40 mx-auto flex items-center justify-center text-emerald-400">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-white">Security Command Gateway</h2>
          <p className="text-xs text-gray-400">Access Wildlife Operations Portals</p>
        </div>

        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1 font-semibold">Username / Email</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-navy border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white" 
                placeholder="ranger@wildlife-agency.org" 
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 font-semibold">Security Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-navy border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white" 
                placeholder="••••••••" 
              />
            </div>

            <div className="p-3 bg-forest/10 border border-emerald-400/20 rounded-xl space-y-1.5 text-xs">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> MFA Simulator Settings
              </div>
              <p className="text-[10px] text-gray-400">Choose the role you want to authenticate with:</p>
              <select 
                value={simRole} 
                onChange={e => setSimRole(e.target.value)}
                className="w-full bg-navy border border-white/10 rounded-lg p-1.5 text-xs text-white"
              >
                <option value="admin">Science Chief / Executive Admin</option>
                <option value="responder">Field Rescue Specialist</option>
                <option value="citizen">Local Alert Citizen / Volunteer</option>
              </select>
            </div>

            <button type="submit" className="w-full py-3 bg-forest hover:bg-emerald-600 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-md">
              <Unlock className="w-4 h-4" /> Verify Credentials
            </button>
            
            <div className="text-center pt-2 text-xs text-gray-400">
              New watcher? <button type="button" onClick={() => setAuthMode('register')} className="text-emerald-400 hover:underline">Register account</button>
            </div>
          </form>
        )}

        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1 font-semibold">Full Profile Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-navy border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white" 
                placeholder="Marcus Vance" 
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 font-semibold">Secure Mobile Phone</label>
              <input 
                type="text" 
                required 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-navy border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white" 
                placeholder="+1 (555) 012-3456" 
              />
            </div>
            <button type="submit" className="w-full py-3 bg-forest hover:bg-emerald-600 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-md">
              <UserPlus className="w-4 h-4" /> Create Sighting Account
            </button>
            <div className="text-center pt-2 text-xs text-gray-400">
              Already registered? <button type="button" onClick={() => setAuthMode('login')} className="text-emerald-400 hover:underline">Sign In</button>
            </div>
          </form>
        )}

        {authMode === 'otp' && (
          <div className="space-y-4 text-center">
            <p className="text-xs text-gray-400">We have sent a security OTP code to your device. Enter simulator key <strong className="text-white">778931</strong> to log in.</p>
            <input 
              type="text" 
              value={otp}
              onChange={e => setOtp(e.target.value)}
              maxLength={6}
              className="w-full text-center tracking-widest font-mono text-xl bg-navy border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-forest" 
              placeholder="000000" 
            />
            <button onClick={verifyOTP} className="w-full py-3 bg-forest hover:bg-emerald-600 rounded-xl font-bold text-xs text-white">
              Verify Token
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
