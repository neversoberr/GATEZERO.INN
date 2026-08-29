'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Event } from '@/types';
import { MapPin, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface InteractiveMapProps {
  events: Event[];
}

export function InteractiveMap({ events }: InteractiveMapProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(events[0] || null);
  const [selectedCityPin, setSelectedCityPin] = useState<string>('all');

  // Normalized relative positions on the India tactical radar view
  const cityCoordinatesMap: Record<string, { top: string; left: string }> = {
    'Mumbai': { top: '56%', left: '32%' },
    'Bengaluru': { top: '74%', left: '44%' },
    'Delhi': { top: '30%', left: '40%' },
    'Goa': { top: '68%', left: '34%' },
    'Pune': { top: '60%', left: '36%' },
    'Hyderabad': { top: '62%', left: '48%' },
    'Kolkata': { top: '44%', left: '74%' },
    'Dubai': { top: '36%', left: '10%' }
  };

  return (
    <div className="bg-card border border-border/50 p-4 sm:p-6 font-mono relative overflow-hidden">
      {/* Radar HUD Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-border/50 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
          <span className="font-bold text-foreground uppercase tracking-wider">
            TACTICAL EVENT RADAR // SUB-CONTINENT GRID
          </span>
        </div>
        <div className="text-[11px] text-muted-foreground">
          PROJECTION: EPSG:4326 • ELEVATION MATRIX
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Map Area */}
        <div className="lg:col-span-8 relative aspect-[16/10] bg-card border border-border/50 overflow-hidden flex items-center justify-center">
          {/* Grid lines and radial sweep */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
          <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />
          
          {/* Concentric radar rings */}
          <div className="absolute w-[80%] aspect-square rounded-full border border-border/30 pointer-events-none" />
          <div className="absolute w-[50%] aspect-square rounded-full border border-border/50 pointer-events-none" />
          <div className="absolute w-[25%] aspect-square rounded-full border border-accent/20 pointer-events-none" />

          {/* India Silhouette Outline Label */}
          <div className="absolute top-4 left-4 text-[10px] text-muted-foreground uppercase tracking-widest pointer-events-none">
            INDIA REGION RADAR // COORDINATES ACTIVE
          </div>

          {/* Event Pins */}
          {events.map(ev => {
            const pos = cityCoordinatesMap[ev.city] || { top: '50%', left: '50%' };
            const isSelected = selectedEvent?.id === ev.id;

            return (
              <button
                key={ev.id}
                onClick={() => setSelectedEvent(ev)}
                style={{ top: pos.top, left: pos.left }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group z-20 flex items-center gap-1.5 focus:outline-none transition-transform ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
              >
                <div
                  className={`w-4 h-4 flex items-center justify-center border font-bold text-[9px] transition-colors ${
                    isSelected
                      ? 'bg-accent text-black border-accent'
                      : 'bg-black text-accent border-accent/60 group-hover:bg-accent group-hover:text-black'
                  }`}
                >
                  00
                </div>
                <span className="hidden md:inline-block px-1.5 py-0.5 bg-black/80 border border-border text-[10px] text-foreground whitespace-nowrap">
                  {ev.city}: {ev.code}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Event Card on the Right */}
        <div className="lg:col-span-4 bg-card border border-border/50 p-5 flex flex-col justify-between">
          {selectedEvent ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/50 text-[10px]">
                <span className="px-2 py-0.5 bg-accent text-black font-bold uppercase">
                  {selectedEvent.code}
                </span>
                <span className="text-muted-foreground uppercase">
                  {selectedEvent.city} // {selectedEvent.category}
                </span>
              </div>

              <div className="relative aspect-video w-full overflow-hidden bg-black border border-border/50">
                <img
                  src={selectedEvent.posterUrl}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-base font-black uppercase text-foreground tracking-tight">
                  {selectedEvent.title}
                </h3>
                <p className="text-xs text-muted-foreground font-sans mt-1 line-clamp-2">
                  {selectedEvent.venueAddress}
                </p>
              </div>

              <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                <div>
                  <div className="text-[9px] text-muted-foreground uppercase">ENTRY PASS</div>
                  <div className="text-base font-black text-accent">
                    ₹{selectedEvent.minPrice.toLocaleString('en-IN')}
                  </div>
                </div>

                <Link
                  href={`/events/${selectedEvent.slug}`}
                  className="px-4 py-2 bg-accent hover:bg-accent-hover text-black font-black uppercase text-xs flex items-center gap-1.5 transition-transform active:scale-95"
                >
                  <span>GET PASS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-center py-12">
              SELECT AN EVENT PIN ON RADAR
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
