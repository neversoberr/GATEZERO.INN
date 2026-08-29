'use client';

import React from 'react';
import Link from 'next/link';
import { CITIES } from '@/lib/data/initial-data';
import { MapPin, ArrowRight } from 'lucide-react';

export function CitySection() {
  const popularCities = [
    { name: 'Mumbai', code: 'MUM', desc: 'Dockland Warehouses & Coastal Techno', count: 4, img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=600&auto=format&fit=crop' },
    { name: 'Bengaluru', code: 'BLR', desc: 'Spatial Sound Labs & Modular Synthesis', count: 2, img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=600&auto=format&fit=crop' },
    { name: 'Delhi', code: 'DEL', desc: 'Brutalist Courtyards & Heavy Bass', count: 1, img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=600&auto=format&fit=crop' },
    { name: 'Goa', code: 'GOA', desc: 'Clifftop Open Airs & Multi-day Gathering', count: 1, img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop' },
    { name: 'Pune', code: 'PNE', desc: 'Industrial Lots & Fast Acid BPMs', count: 1, img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=600&auto=format&fit=crop' },
  ];

  return (
    <section className="py-16 bg-[#050505] text-[#F1F1EB] font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="pb-8 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#C8FF16] font-bold">
              SCENE RADARS
            </div>
            <h2 className="text-3xl font-black uppercase text-white mt-1">
              DISCOVER BY CITY
            </h2>
          </div>
          <Link
            href="/events"
            className="text-xs font-bold uppercase text-white/60 hover:text-white flex items-center gap-1"
          >
            <span>MAP ALL CITIES</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C8FF16]" />
          </Link>
        </div>

        {/* Cities 5-Card Banner Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
          {popularCities.map(city => (
            <Link
              key={city.code}
              href={`/events?city=${encodeURIComponent(city.name)}`}
              className="group relative aspect-[3/4] bg-[#0e100c] border border-white/10 hover:border-[#C8FF16] transition-all overflow-hidden flex flex-col justify-between p-5"
            >
              <img
                src={city.img}
                alt={city.name}
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30 pointer-events-none" />

              {/* Top Code Badge */}
              <div className="relative z-10 flex justify-between items-center">
                <span className="px-2 py-0.5 bg-black/80 border border-white/20 text-[#C8FF16] font-bold text-xs uppercase">
                  [{city.code}]
                </span>
                <span className="text-[10px] text-white/60 uppercase">
                  {city.count} ACTIVE GATES
                </span>
              </div>

              {/* Bottom Details */}
              <div className="relative z-10 space-y-1">
                <h3 className="text-2xl font-black uppercase text-white group-hover:text-[#C8FF16] transition-colors">
                  {city.name}
                </h3>
                <p className="text-[11px] text-white/70 font-sans leading-tight">
                  {city.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
