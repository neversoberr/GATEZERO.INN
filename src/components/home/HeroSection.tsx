'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Radio, 
  ShieldCheck, 
  Zap, 
  Flame, 
  Terminal,
  Activity
} from 'lucide-react';
import { CITIES, CATEGORIES } from '@/lib/data/initial-data';

export function HeroSection() {
  const router = useRouter();
  const [what, setWhat] = useState('');
  const [city, setCity] = useState('all');
  const [category, setCategory] = useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (what.trim()) params.set('query', what.trim());
    if (city !== 'all') params.set('city', city);
    if (category !== 'all') params.set('category', category);

    router.push(`/events?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center pt-8 pb-16 bg-[#050505] overflow-hidden border-b border-white/10">
      
      {/* Brutalist Grid Background & Outlined 00 Graphic */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute -right-16 top-1/4 text-[32vw] font-black text-stroke-white select-none pointer-events-none leading-none tracking-tighter opacity-20 hidden md:block">
        00
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Top Signal Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#121410] border border-[#C8FF16]/40 text-xs font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-[#C8FF16] animate-ping" />
          <span className="text-[#C8FF16] font-bold uppercase tracking-widest text-[11px]">
            RADAR: LIVE ACCESS NETWORK
          </span>
          <span className="text-white/40">|</span>
          <span className="text-white/70 text-[11px]">42+ UNDERGROUND TRANSMISSIONS ACROSS INDIA</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Editorial Statement */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-white">
              ENTER <br />
              WHAT’S <br />
              <span className="text-[#C8FF16]">NEXT.</span>
            </h1>

            <p className="text-base sm:text-xl text-white/70 max-w-xl font-sans font-normal leading-relaxed">
              Find the rooms, sounds, and ideas worth leaving home for. Direct access passes for underground electronic music, warehouse gatherings, and independent culture.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-xs">
              <Link
                href="/events"
                className="px-6 py-3.5 bg-[#C8FF16] hover:bg-[#b8ea14] text-black font-black uppercase tracking-wider flex items-center gap-2 transition-transform active:scale-95 shadow-xl"
              >
                <span>EXPLORE ALL GATES</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/organizer/events/new"
                className="px-6 py-3.5 bg-[#171914] hover:bg-white hover:text-black border border-white/20 text-white font-bold uppercase tracking-wider transition-colors"
              >
                + LIST AN EXPERIENCE
              </Link>
            </div>
          </div>

          {/* Right Column: Floating Tactical Access Card HUD */}
          <div className="lg:col-span-5 relative">
            <div 
              className="bg-[#0d0f0c] border border-white/20 p-6 sm:p-7 shadow-2xl relative font-mono text-white space-y-5"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)'
              }}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#C8FF16]" />
                  <span className="text-white/60 uppercase">SIGNAL GATE // GZ-MUM</span>
                </div>
                <div className="text-[#C8FF16] font-bold text-[11px] flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" />
                  LIVE NOW
                </div>
              </div>

              {/* Card Main Signal */}
              <div className="space-y-1">
                <div className="text-[10px] text-white/40 uppercase tracking-widest">
                  FEATURED DISPATCH
                </div>
                <div className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight leading-snug">
                  Steelworks: After Dark
                </div>
                <div className="text-xs text-[#C8FF16] font-sans">
                  Raw Industrial Techno inside a Disused Mill • Reay Road, Mumbai
                </div>
              </div>

              {/* Fast Stats Matrix */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                <div className="p-2.5 bg-black/60 border border-white/10">
                  <div className="text-white/40 text-[9px] uppercase">DOORS OPEN</div>
                  <div className="text-white font-bold mt-0.5">21:00 IST</div>
                </div>
                <div className="p-2.5 bg-black/60 border border-white/10">
                  <div className="text-white/40 text-[9px] uppercase">CAPACITY HASH</div>
                  <div className="text-[#C8FF16] font-bold mt-0.5">84% BOOKED</div>
                </div>
              </div>

              <Link
                href="/events/steelworks-after-dark"
                className="block w-full py-3 bg-[#C8FF16] hover:bg-[#b8ea14] text-black text-center font-black uppercase text-xs tracking-wider transition-transform active:scale-[0.99]"
              >
                DIRECT PASS ACCESS ↗
              </Link>
            </div>
          </div>

        </div>

        {/* Industrial Control Console Search Interface */}
        <div className="mt-14 bg-[#0e100c] border border-white/20 p-4 sm:p-5 font-mono shadow-2xl">
          <div className="text-[10px] uppercase tracking-widest text-white/50 mb-3 flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#C8FF16]" />
            EXPERIENCE DISCOVERY CONSOLE // PARAMETERS
          </div>

          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* What */}
            <div>
              <label className="block text-[10px] text-white/40 uppercase mb-1">
                WHAT (EVENT / ARTIST / VENUE)
              </label>
              <input
                type="text"
                placeholder="e.g. Techno, KASST, Warehouse"
                value={what}
                onChange={e => setWhat(e.target.value)}
                className="w-full bg-black border border-white/20 p-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8FF16]"
              />
            </div>

            {/* Where / City */}
            <div>
              <label className="block text-[10px] text-white/40 uppercase mb-1">
                WHERE (CITY)
              </label>
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full bg-black border border-white/20 p-2.5 text-white focus:outline-none focus:border-[#C8FF16] uppercase cursor-pointer"
              >
                {CITIES.map(c => (
                  <option key={c.id} value={c.name === 'All Cities' ? 'all' : c.name}>
                    {c.name.toUpperCase()} {c.code !== 'ALL' ? `[${c.code}]` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[10px] text-white/40 uppercase mb-1">
                CATEGORY
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-black border border-white/20 p-2.5 text-white focus:outline-none focus:border-[#C8FF16] uppercase cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Explore Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-[#C8FF16] hover:bg-[#b8ea14] text-black font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98] h-[39px]"
              >
                <Search className="w-4 h-4" />
                <span>EXPLORE GATE ↗</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}
