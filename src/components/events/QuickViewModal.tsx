'use client';

import React from 'react';
import Link from 'next/link';
import { Event } from '@/types';
import { X, Calendar, MapPin, ShieldCheck, ArrowRight, Clock, Users } from 'lucide-react';

interface QuickViewModalProps {
  event: Event | null;
  onClose: () => void;
}

export function QuickViewModal({ event, onClose }: QuickViewModalProps) {
  if (!event) return null;

  const eventDate = new Date(event.startDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-card border border-accent/40 p-6 sm:p-8 text-foreground max-h-[90vh] overflow-y-auto font-mono"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)' }}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-border/50">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-accent text-black font-bold text-xs uppercase">
              {event.code}
            </span>
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              QUICK SCAN PROTOCOL
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Poster */}
          <div className="md:col-span-5 relative aspect-[4/5] bg-black border border-border/50 overflow-hidden">
            <img
              src={event.posterUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-md p-2 border border-border/50 text-[10px]">
              <div className="text-muted-foreground uppercase">GATE CAPACITY</div>
              <div className="text-accent font-bold">
                {event.totalTicketsSold} / {event.totalCapacity} PASSES ISSUED
              </div>
            </div>
          </div>

          {/* Right Details */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs text-accent uppercase tracking-wider mb-1">
                {event.category.replace('_', ' ')} // {event.city}
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground leading-tight">
                {event.title}
              </h2>
              <p className="text-xs text-foreground/70 mt-2 font-sans leading-relaxed">
                {event.tagline}
              </p>
            </div>

            {/* Quick Meta */}
            <div className="space-y-2 py-3 border-y border-border/50 text-xs text-foreground/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                <span>{eventDate} • DOORS {event.doorsOpenTime}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="font-sans text-xs">{event.venueAddress}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span>CURATED BY {event.organizerName.toUpperCase()}</span>
              </div>
            </div>

            {/* Lineup Teaser */}
            {event.lineup && event.lineup.length > 0 && (
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5">
                  FEATURED ARTISTS & ACTS:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {event.lineup.slice(0, 3).map(art => (
                    <span key={art.id} className="px-2 py-1 bg-card border border-border/50 text-[11px] text-foreground">
                      {art.name}
                    </span>
                  ))}
                  {event.lineup.length > 3 && (
                    <span className="px-2 py-1 bg-foreground/5 text-[11px] text-muted-foreground">
                      +{event.lineup.length - 3} MORE
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Price & Action */}
            <div className="pt-3 flex items-center justify-between gap-4">
              <div>
                <span className="text-[9px] uppercase text-muted-foreground block">ENTRY TIER</span>
                <span className="text-xl font-black text-accent">
                  ₹{event.minPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <Link
                href={`/events/${event.slug}`}
                onClick={onClose}
                className="flex-1 py-3 bg-accent hover:bg-accent-hover text-black font-black uppercase text-xs flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <span>ENTER EVENT GATE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
