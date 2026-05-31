'use client';

import React from 'react';
import { ShieldAlert, Zap, Compass, Flame, Leaf, Waves, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="space-y-16 py-8 px-4 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Dynamic Header */}
      <header className="flex justify-between items-center border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-forest rounded-xl p-2 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">WILDLIFE EMERGENCY</span>
            <div className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold">Assistant Core Portal</div>
          </div>
        </div>
        <Link 
          href="/dashboard" 
          className="px-5 py-2.5 bg-forest hover:bg-emerald-600 rounded-xl font-bold text-xs text-white transition-all shadow-md"
        >
          LAUNCH CORE GATEWAYS
        </Link>
      </header>

      {/* Hero Banner Section */}
      <section className="text-center py-16 lg:py-24 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-navy via-navy-dark to-forest-dark/30 px-6">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest/20 border border-emerald-400/40 text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> AI-Powered Species Dispatch
          </div>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-none text-white">
            Protecting Wildlife Through <br/>
            <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
              Smart Emergency Response
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-base lg:text-lg">
            An enterprise-grade platform mapping active dispatch operations, automated species identifiers, predictive threat heatmaps, and veterinary locators.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link 
              href="/dashboard?view=report" 
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-bold transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              REPORT WILDLIFE EMERGENCY
            </Link>
            <Link 
              href="/dashboard?view=identify" 
              className="px-8 py-3.5 bg-navy border border-white/10 hover:border-white/20 rounded-xl text-gray-200 font-bold transition-all flex items-center gap-2"
            >
              RUN AI IDENTIFICATION
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics dashboard */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-2xl text-center space-y-1.5">
          <div className="text-emerald-400 text-3xl font-extrabold">24</div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Field Missions</div>
        </div>
        <div className="glass-card p-6 rounded-2xl text-center space-y-1.5">
          <div className="text-sky-400 text-3xl font-extrabold">1,482</div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Relocations</div>
        </div>
        <div className="glass-card p-6 rounded-2xl text-center space-y-1.5">
          <div className="text-emerald-400 text-3xl font-extrabold">14m</div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Avg Response Time</div>
        </div>
        <div className="glass-card p-6 rounded-2xl text-center space-y-1.5">
          <div className="text-sky-400 text-3xl font-extrabold">94.8%</div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">CNN Classifier Accuracy</div>
        </div>
      </section>

      {/* Feature suite */}
      <section className="space-y-8">
        <h2 className="text-2xl lg:text-3xl font-extrabold text-white text-center">Comprehensive Intelligence Suite</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Interactive Sighting ID</h3>
            <p className="text-gray-400 text-xs leading-relaxed">Leverage convolutional neural networks to identify fauna species, verify perimeter parameters, and access vector guides.</p>
          </div>
          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Dynamic Center Locator</h3>
            <p className="text-gray-400 text-xs leading-relaxed">Pinpoint local veterinary clinics, rescue groups, and ranger stations through map telemetry integration.</p>
          </div>
          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-400/30 flex items-center justify-center text-red-400">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Conflict Threat Modeler</h3>
            <p className="text-gray-400 text-xs leading-relaxed">Assess wildlife displacements through heatmaps tracking wildfire vectors and urban border encroachment.</p>
          </div>
        </div>
      </section>

      {/* Success Chronicled */}
      <section className="space-y-6">
        <h2 className="text-2xl lg:text-3xl font-extrabold text-white">Relocation Chronicles</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-panel overflow-hidden rounded-2xl border border-white/10 flex flex-col md:flex-row">
            <img src="https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?auto=format&fit=crop&w=350&q=80" alt="Leopard" className="w-full md:w-44 h-48 md:h-auto object-cover" />
            <div className="p-6 space-y-2 flex-grow">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Fauna Relocation</span>
              <h4 class="text-base font-extrabold text-white">Leopard Spotted on Pasadena Margins</h4>
              <p className="text-gray-400 text-xs leading-relaxed">Spotted in residential backyards. Neighbors ran AI image classifications to verify genus. Rangers successfully secured and translocated the cat in under 90 minutes.</p>
            </div>
          </div>
          <div className="glass-panel overflow-hidden rounded-2xl border border-white/10 flex flex-col md:flex-row">
            <img src="https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=350&q=80" alt="Turtle" className="w-full md:w-44 h-48 md:h-auto object-cover" />
            <div className="p-6 space-y-2 flex-grow">
              <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">Marine Conservation</span>
              <h4 class="text-base font-extrabold text-white">Sea Turtle Netting Removal</h4>
              <p className="text-gray-400 text-xs leading-relaxed">A coastal beach walker transmitted a turtle entanglement coordinate pin. Rescue specialists quickly untangled net lines and returned the marine life to sea.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer contacts */}
      <section className="glass-panel p-8 rounded-3xl border border-white/10 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-extrabold text-white">Join our Frontline Guardians</h2>
          <p className="text-gray-400 text-xs leading-relaxed">Support wildlife safety by sharing your animal care experience, biology degree, or volunteer time. Register to join regional first aid response alerts.</p>
          <div className="flex flex-col gap-2.5 text-xs text-gray-300">
            <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-emerald-400" /> Command Hub: +1 (800) 555-WILD</div>
            <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-emerald-400" /> operations@wildlife-emergency.org</div>
            <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-emerald-400" /> Angeles Forest HQ, Sector 5</div>
          </div>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
          <h3 className="font-bold text-white text-sm">Send Volunteer Sighting Inquiry</h3>
          <form onSubmit={(e) => { e.preventDefault(); alert('Inquiry logged successfully.'); e.target.reset(); }} className="space-y-3">
            <input type="text" placeholder="Full Name" required className="w-full bg-navy border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-white" />
            <input type="email" placeholder="Email Address" required className="w-full bg-navy border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-white" />
            <textarea placeholder="Message details..." required rows="3" className="w-full bg-navy border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-white" />
            <button type="submit" className="w-full py-2.5 bg-forest hover:bg-emerald-600 rounded-xl text-xs font-bold transition-all text-white">Send Sighting Query</button>
          </form>
        </div>
      </section>

      <footer className="border-t border-white/10 pt-6 text-center text-[11px] text-gray-500">
        © 2026 Wildlife Emergency Assistant Platform. All Rights Reserved. Cybersecurity encryption signed.
      </footer>
    </div>
  );
}
