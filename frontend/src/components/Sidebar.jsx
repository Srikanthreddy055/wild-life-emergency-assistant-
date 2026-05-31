'use client';

import React from 'react';
import { 
  LayoutDashboard, AlertTriangle, Map, MessageSquare, Users, 
  Activity, Truck, Radio, Shield, Radar, BarChart3, Flame, FileText, ShieldCheck
} from 'lucide-react';

export default function Sidebar({ currentRole, activeView, onNavigate }) {
  const getNavItems = () => {
    switch (currentRole) {
      case 'citizen':
        return [
          { id: 'dashboard', label: 'Citizen Dashboard', icon: LayoutDashboard, color: 'text-emerald-400' },
          { id: 'report', label: 'Report Emergency', icon: AlertTriangle, color: 'text-emerald-400' },
          { id: 'tracker', label: 'Track My Incidents', icon: Map, color: 'text-emerald-400' },
          { id: 'assistant', label: 'AI Chatbot Help', icon: MessageSquare, color: 'text-emerald-400' },
          { id: 'community', label: 'Volunteer Center', icon: Users, color: 'text-emerald-400' }
        ];
      case 'responder':
        return [
          { id: 'operations', label: 'Active Missions', icon: Truck, color: 'text-sky-400' },
          { id: 'monitoring', label: 'Telemetry Stream', icon: Radio, color: 'text-sky-400' },
          { id: 'tracker', label: 'Incident Timelines', icon: Activity, color: 'text-sky-400' }
        ];
      case 'admin':
        return [
          { id: 'admin', label: 'Executive Panel', icon: Shield, color: 'text-emerald-400' },
          { id: 'monitoring', label: 'Operations Center', icon: Radar, color: 'text-emerald-400' },
          { id: 'analytics', label: 'Wildlife Analytics', icon: BarChart3, color: 'text-emerald-400' },
          { id: 'threats', label: 'Threat Intelligence', icon: Flame, color: 'text-red-400' },
          { id: 'reports-export', label: 'Export Summaries', icon: FileText, color: 'text-emerald-400' }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-full lg:w-64 glass-panel border-r border-white/10 p-4 shrink-0 flex flex-col gap-2">
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">
        {currentRole.toUpperCase()} CHANNELS
      </div>

      <div className="flex flex-col gap-1.5">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                isActive 
                  ? 'bg-forest/20 border-l-4 border-emerald-400 text-white' 
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${item.color}`} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="rounded-xl bg-forest/10 border border-forest/20 p-3.5 text-xs">
          <div className="flex items-center gap-2 font-bold text-emerald-400 mb-1">
            <ShieldCheck className="w-4 h-4" /> Cybersecurity Active
          </div>
          <p className="text-gray-400 leading-relaxed text-[10px]">Session keys securely signed via client-side local authentication keys.</p>
        </div>
      </div>
    </aside>
  );
}
