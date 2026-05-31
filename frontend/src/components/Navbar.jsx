'use client';

import React from 'react';
import { ShieldAlert, LogOut } from 'lucide-react';

export default function Navbar({ currentRole, onRoleChange, onNavigate, activeUser }) {
  const initials = activeUser?.name ? activeUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'SC';

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b border-white/10 px-4 lg:px-8 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
        <div className="bg-forest rounded-xl p-2 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="font-extrabold text-lg lg:text-xl tracking-tight bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">WILDLIFE RESCUE</span>
          <div className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold">Emergency Assistant</div>
        </div>
      </div>

      {/* Navigation Options (Desktop) */}
      <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-300">
        <button onClick={() => onNavigate('landing')} className="hover:text-emerald-400 transition-colors">Home</button>
        <button onClick={() => onNavigate('report')} className="hover:text-emerald-400 transition-colors">Report Emergency</button>
        <button onClick={() => onNavigate('identify')} className="hover:text-emerald-400 transition-colors">AI Identifier</button>
        <button onClick={() => onNavigate('locator')} className="hover:text-emerald-400 transition-colors">Find Help</button>
        <button onClick={() => onNavigate('database')} className="hover:text-emerald-400 transition-colors">Species DB</button>
        <button onClick={() => onNavigate('safety')} className="hover:text-emerald-400 transition-colors">First Aid</button>
      </div>

      {/* Role Simulator Selection */}
      <div className="flex items-center gap-4">
        <div className="relative text-left">
          <label className="block text-[8px] text-gray-400 uppercase tracking-widest font-bold mb-0.5 text-right">Role Simulator</label>
          <select 
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="bg-navy/80 border border-white/10 rounded-lg text-xs py-1 px-2.5 text-emerald-400 font-bold focus:outline-none focus:ring-1 focus:ring-forest cursor-pointer"
          >
            <option value="citizen">Citizen (Alex)</option>
            <option value="responder">Field Responder (Marcus)</option>
            <option value="admin">Administrator (Dr. Sarah)</option>
          </select>
        </div>

        {/* Dynamic User Profile Indicator */}
        <div className="flex items-center gap-2 pl-3 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-bold text-emerald-400 text-xs">
            {initials}
          </div>
          <div className="hidden md:block leading-none text-left">
            <div className="text-xs font-semibold text-white">{activeUser?.name || 'Dr. Sarah Connor'}</div>
            <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider">{currentRole}</span>
          </div>
        </div>

        <button 
          onClick={() => { alert('Session destroyed.'); onRoleChange('citizen'); onNavigate('landing'); }} 
          className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-all"
          title="Logout Gateways"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
