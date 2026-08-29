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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Page Header */}
        <div className="pb-8 mb-8 border-b border-border/50 font-mono">
          <div className="text-[10px] uppercase tracking-widest text-accent font-bold flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            DISCOVERY PROTOCOL // ALL GATES
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-foreground mt-1">
            FIND YOUR NEXT ROOM.
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans mt-2 max-w-2xl">
            Live cultural access across Mumbai, Bengaluru, Delhi, Goa, and Pune. Filter by city, sound profile, and venue atmosphere.
          </p>
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
              className={`grid gap-6 ${
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
            <div className="py-20 text-center bg-card border border-border/50 font-mono p-8 space-y-4">
              <div className="w-12 h-12 border border-accent text-accent flex items-center justify-center mx-auto text-xl font-bold">
                00
              </div>
              <h3 className="text-xl font-black uppercase text-foreground">
                NOTHING THROUGH THIS GATE.
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto font-sans">
                No active events match your current coordinates and filters. Adjust your city or price range to scan again.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-accent text-black font-black uppercase text-xs inline-flex items-center gap-2 mt-2"
              >
                <FilterX className="w-4 h-4" />
                <span>RESET ALL FILTERS</span>
              </button>
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
        <Suspense fallback={<div className="min-h-screen bg-black text-foreground p-12 font-mono">LOADING RADAR...</div>}>
          <EventsContent />
        </Suspense>
      </AuthProvider>
    </ToastProvider>
  );
}
