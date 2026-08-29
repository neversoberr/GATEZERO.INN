'use client';

import React, { useState } from 'react';
import { Event } from '@/types';
import { EventCard } from '@/components/events/EventCard';
import { QuickViewModal } from '@/components/events/QuickViewModal';
import { SectionHeading } from '@/components/ui/SectionHeading';

interface TrendingSectionProps {
  events: Event[];
}

export function TrendingSection({ events }: TrendingSectionProps) {
  const [quickViewEvent, setQuickViewEvent] = useState<Event | null>(null);

  return (
    <section aria-labelledby="trending-heading" className="bg-background py-24 md:py-32">
      <div className="mx-auto w-full max-w-[95vw] px-4 md:px-8">
        <SectionHeading
          id="trending-heading"
          kicker="HIGH VELOCITY RADAR"
          title="TRENDING"
          accentTitle="TRANSMISSIONS"
          actionHref="/events"
          actionLabel="VIEW ALL ACTIVE GATES"
        />

        {/* gap-px over a border-colored canvas = hairline connected card system */}
        <div className="mt-12 grid grid-cols-1 gap-px border-2 border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {events.slice(0, 4).map(ev => (
            <EventCard key={ev.id} event={ev} onQuickView={e => setQuickViewEvent(e)} />
          ))}
        </div>
      </div>

      <QuickViewModal event={quickViewEvent} onClose={() => setQuickViewEvent(null)} />
    </section>
  );
}
