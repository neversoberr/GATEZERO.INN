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
        className="relative w-full max-w-2xl bg-[#0e100c] border border-[#C8FF16]/40 p-6 sm:p-8 shadow-2xl text-[#F1F1EB] max-h-[90vh] overflow-y-auto font-mono"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)' }}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#C8FF16] text-black font-bold text-xs uppercase">
              {event.code}
            </span>
            <span className="text-xs text-white/50 uppercase tracking-widest">
              QUICK SCAN PROTOCOL
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Poster */}
          <div className="md:col-span-5 relative aspect-[4/5] bg-black border border-white/10 overflow-hidden">
            <img
              src={event.posterUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-md p-2 border border-white/10 text-[10px]">
              <div className="text-white/50 uppercase">GATE CAPACITY</div>
              <div className="text-[#C8FF16] font-bold">
                {event.totalTicketsSold} / {event.totalCapacity} PASSES ISSUED
              </div>
            </div>
          </div>

          {/* Right Details */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs text-[#C8FF16] uppercase tracking-wider mb-1">
                {event.category.replace('_', ' ')} // {event.city}
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white leading-tight">
                {event.title}
              </h2>
              <p className="text-xs text-white/70 mt-2 font-sans leading-relaxed">
                {event.tagline}
              </p>
            </div>

            {/* Quick Meta */}
            <div className="space-y-2 py-3 border-y border-white/10 text-xs text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C8FF16]" />
                <span>{eventDate} • DOORS {event.doorsOpenTime}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C8FF16] shrink-0 mt-0.5" />
                <span className="font-sans text-xs">{event.venueAddress}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <ShieldCheck className="w-4 h-4 text-[#C8FF16]" />
                <span>CURATED BY {event.organizerName.toUpperCase()}</span>
              </div>
            </div>

            {/* Lineup Teaser */}
            {event.lineup && event.lineup.length > 0 && (
              <div>
                <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1.5">
                  FEATURED ARTISTS & ACTS:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {event.lineup.slice(0, 3).map(art => (
                    <span key={art.id} className="px-2 py-1 bg-[#171914] border border-white/10 text-[11px] text-white">
                      {art.name}
                    </span>
                  ))}
                  {event.lineup.length > 3 && (
                    <span className="px-2 py-1 bg-white/5 text-[11px] text-white/50">
                      +{event.lineup.length - 3} MORE
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Price & Action */}
            <div className="pt-3 flex items-center justify-between gap-4">
              <div>
                <span className="text-[9px] uppercase text-white/40 block">ENTRY TIER</span>
                <span className="text-xl font-black text-[#C8FF16]">
                  ₹{event.minPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <Link
                href={`/events/${event.slug}`}
                onClick={onClose}
                className="flex-1 py-3 bg-[#C8FF16] hover:bg-[#b8ea14] text-black font-black uppercase text-xs flex items-center justify-center gap-2 transition-transform active:scale-95"
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
