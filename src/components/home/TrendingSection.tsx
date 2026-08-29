'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Event } from '@/types';
import { EventCard } from '@/components/events/EventCard';
import { QuickViewModal } from '@/components/events/QuickViewModal';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';

interface TrendingSectionProps {
  events: Event[];
}

export function TrendingSection({ events }: TrendingSectionProps) {
  const [quickViewEvent, setQuickViewEvent] = useState<Event | null>(null);

  return (
    <section className="py-16 sm:py-20 bg-[#050505] text-[#F1F1EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-white/10 font-mono">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#C8FF16] font-bold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-[#C8FF16]" />
              HIGH VELOCITY RADAR
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
              TRENDING TRANSMISSIONS
            </h2>
          </div>

          <Link
            href="/events"
            className="text-xs font-bold uppercase text-[#C8FF16] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>VIEW ALL ACTIVE GATES</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-Column Brutalist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {events.slice(0, 4).map(ev => (
            <EventCard
              key={ev.id}
              event={ev}
              onQuickView={e => setQuickViewEvent(e)}
            />
          ))}
        </div>

      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        event={quickViewEvent}
        onClose={() => setQuickViewEvent(null)}
      />
    </section>
  );
}
