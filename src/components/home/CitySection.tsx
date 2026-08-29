'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';

const popularCities = [
  { name: 'Mumbai', code: 'MUM', desc: 'Dockland warehouses & coastal techno', count: 4, img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=600&auto=format&fit=crop' },
  { name: 'Bengaluru', code: 'BLR', desc: 'Spatial sound labs & modular synthesis', count: 2, img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=600&auto=format&fit=crop' },
  { name: 'Delhi', code: 'DEL', desc: 'Brutalist courtyards & heavy bass', count: 1, img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=600&auto=format&fit=crop' },
  { name: 'Goa', code: 'GOA', desc: 'Clifftop open airs & multi-day gatherings', count: 1, img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop' },
  { name: 'Pune', code: 'PNE', desc: 'Industrial lots & fast acid BPMs', count: 1, img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=600&auto=format&fit=crop' },
];

export function CitySection() {
  return (
    <section aria-labelledby="city-heading" className="bg-background py-24 md:py-32">
      <div className="mx-auto w-full max-w-[95vw] px-4 md:px-8">
        <SectionHeading
          id="city-heading"
          kicker="SCENE RADARS"
          title="DISCOVER BY"
          accentTitle="CITY"
          actionHref="/events"
          actionLabel="MAP ALL CITIES"
        />

        {/* Hairline-connected tall cards — poster stack */}
        <div className="mt-12 grid grid-cols-1 gap-px border-2 border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
          {popularCities.map(city => (
            <Link
              key={city.code}
              href={`/events?city=${encodeURIComponent(city.name)}`}
              className="group relative flex aspect-[3/4] flex-col justify-between overflow-hidden bg-card p-6 transition-colors duration-300 hover:bg-accent"
            >
              <img
                src={city.img}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-30 grayscale transition-all duration-300 group-hover:opacity-20 group-hover:grayscale-0"
                aria-hidden="true"
              />

              <div className="relative z-10 flex items-start justify-between font-mono text-xs uppercase tracking-widest">
                <span className="text-3xl font-bold tracking-tighter text-muted-foreground transition-colors group-hover:text-black/60 md:text-4xl">
                  {city.code}
                </span>
                <span className="flex items-center gap-1 border border-border bg-background/80 px-2 py-1 text-[10px] font-bold text-accent transition-colors group-hover:border-black/30 group-hover:bg-black/80 md:hidden lg:flex">
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  {city.count}
                </span>
              </div>

              <div className="relative z-10">
                <h3 className="text-3xl font-bold uppercase leading-[0.85] tracking-tighter text-foreground transition-colors group-hover:text-black md:text-4xl">
                  {city.name}
                </h3>
                <p className="mt-3 text-sm leading-tight text-muted-foreground transition-colors group-hover:text-black/70">
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
