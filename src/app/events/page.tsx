'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleBanner } from '@/components/layout/RoleBanner';
import { LoginModal } from '@/components/auth/LoginModal';
import { EventFilters, FilterState } from '@/components/events/EventFilters';
import { EventCard } from '@/components/events/EventCard';
import { QuickViewModal } from '@/components/events/QuickViewModal';
import { InteractiveMap } from '@/components/events/InteractiveMap';
import { Event } from '@/types';
import { INITIAL_EVENTS } from '@/lib/data/initial-data';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { Compass, Sparkles, FilterX } from 'lucide-react';

function EventsContent() {
  const searchParams = useSearchParams();

  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [quickViewEvent, setQuickViewEvent] = useState<Event | null>(null);

  const initialCity = searchParams.get('city') || 'all';
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('query') || '';
  const initialSort = searchParams.get('sort') || 'featured';

  const [filters, setFilters] = useState<FilterState>({
    query: initialQuery,
    city: initialCity,
    category: initialCategory,
    format: 'all',
    age: 'all',
    maxPrice: 10000,
    verifiedOnly: false,
    availableOnly: false,
    sort: initialSort,
    viewMode: 'grid'
  });

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.events) {
          setEvents(data.events);
        }
      })
      .catch(() => {});
  }, []);

  // Filter and Sort logic
  const filteredEvents = useMemo(() => {
    let list = [...events];

    if (filters.city && filters.city !== 'all') {
      list = list.filter(e => e.city.toLowerCase() === filters.city.toLowerCase());
    }

    if (filters.category && filters.category !== 'all') {
      list = list.filter(e => e.category === filters.category);
    }

    if (filters.format && filters.format !== 'all') {
      list = list.filter(e => e.format === filters.format);
    }

    if (filters.age && filters.age !== 'all') {
      list = list.filter(e => e.ageRestriction === filters.age);
    }

    if (filters.verifiedOnly) {
      list = list.filter(e => e.isVerifiedOrganizer);
    }

    if (filters.availableOnly) {
      list = list.filter(e => e.totalTicketsSold < e.totalCapacity);
    }

    if (filters.maxPrice < 10000) {
      list = list.filter(e => e.minPrice <= filters.maxPrice);
    }

    if (filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      list = list.filter(
        e =>
          e.title.toLowerCase().includes(q) ||
          e.tagline.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q) ||
          e.venueName.toLowerCase().includes(q) ||
          e.organizerName.toLowerCase().includes(q) ||
          e.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort
    if (filters.sort === 'price_asc') {
      list.sort((a, b) => a.minPrice - b.minPrice);
    } else if (filters.sort === 'price_desc') {
      list.sort((a, b) => b.minPrice - a.minPrice);
    } else if (filters.sort === 'popularity') {
      list.sort((a, b) => b.viewsCount - a.viewsCount);
    } else if (filters.sort === 'date_asc') {
      list.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    } else {
      list.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });
    }

    return list;
  }, [events, filters]);

  const handleResetFilters = () => {
    setFilters({
      query: '',
      city: 'all',
      category: 'all',
      format: 'all',
      age: 'all',
      maxPrice: 10000,
      verifiedOnly: false,
      availableOnly: false,
      sort: 'featured',
      viewMode: 'grid'
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <RoleBanner />
      <Navbar />

      <main className="flex-1 w-full max-w-[95vw] mx-auto px-4 py-16 md:px-8 md:py-24">
        
        {/* Page Header — display type over a massive muted numeral */}
        <div className="relative mb-10 border-b-2 border-border pb-10 overflow-hidden">
          <div
            className="absolute -right-4 -top-10 select-none text-[24vw] font-bold leading-[0.8] tracking-tighter text-muted md:text-[16vw]"
            aria-hidden="true"
          >
            {String(filteredEvents.length).padStart(2, '0')}
          </div>
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
              <span className="inline-block h-2 w-2 bg-accent" aria-hidden="true" />
              <Compass className="h-3.5 w-3.5" aria-hidden="true" />
              DISCOVERY PROTOCOL // ALL GATES
            </div>
            <h1 className="text-[clamp(3rem,9vw,8rem)] font-bold uppercase leading-[0.85] tracking-tighter text-foreground">
              FIND YOUR NEXT <span className="text-accent">ROOM.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-tight tracking-tight text-muted-foreground md:text-xl">
              Live cultural access across Mumbai, Bengaluru, Delhi, Goa, and Pune. Filter by city, sound profile, and venue atmosphere.
            </p>
          </div>
        </div>

        {/* Industrial Filter Toolbar */}
        <EventFilters
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          totalResults={filteredEvents.length}
        />

        {/* Dynamic View Area */}
        <div className="mt-8">
          {filters.viewMode === 'map' ? (
            <InteractiveMap events={filteredEvents} />
          ) : filteredEvents.length > 0 ? (
            <div
              className={`grid gap-px border-2 border-border bg-border ${
                filters.viewMode === 'list'
                  ? 'grid-cols-1 md:grid-cols-2'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              }`}
            >
              {filteredEvents.map(ev => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  onQuickView={e => setQuickViewEvent(e)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="relative overflow-hidden border-2 border-border bg-card px-8 py-20 text-center">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 select-none text-[10rem] font-bold leading-[0.8] tracking-tighter text-muted"
                aria-hidden="true"
              >
                00
              </div>
              <div className="relative z-10 space-y-4 pt-24 font-mono">
                <h3 className="text-2xl font-bold uppercase tracking-tighter text-foreground md:text-4xl">
                  NOTHING THROUGH THIS GATE.
                </h3>
                <p className="mx-auto max-w-md text-sm text-muted-foreground">
                  No active events match your current coordinates and filters. Adjust your city or price range to scan again.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-2 inline-flex h-14 items-center gap-2 bg-accent px-8 text-xs font-bold uppercase tracking-tighter text-accent-foreground transition-all hover:scale-105 active:scale-95"
                >
                  <FilterX className="h-4 w-4" aria-hidden="true" />
                  <span>RESET ALL FILTERS</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </main>

      <Footer />
      <LoginModal />

      {/* Quick View Modal */}
      <QuickViewModal
        event={quickViewEvent}
        onClose={() => setQuickViewEvent(null)}
      />
    </div>
  );
}

export default function EventsPage() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Suspense fallback={<div className="min-h-screen bg-background p-12 font-mono text-foreground">LOADING RADAR...</div>}>
          <EventsContent />
        </Suspense>
      </AuthProvider>
    </ToastProvider>
  );
}
