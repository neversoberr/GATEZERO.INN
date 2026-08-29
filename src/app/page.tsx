'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleBanner } from '@/components/layout/RoleBanner';
import { LoginModal } from '@/components/auth/LoginModal';
import { HeroSection } from '@/components/home/HeroSection';
import { StatsMarquee } from '@/components/home/StatsMarquee';
import { TrendingSection } from '@/components/home/TrendingSection';
import { CategorySection } from '@/components/home/CategorySection';
import { CitySection } from '@/components/home/CitySection';
import { OrganizersSection } from '@/components/home/OrganizersSection';
import { TrustSection } from '@/components/home/TrustSection';
import { OrganizerCtaSection } from '@/components/home/OrganizerCtaSection';
import { Event, OrganizerCompany } from '@/types';
import { INITIAL_EVENTS, INITIAL_ORGANIZERS } from '@/lib/data/initial-data';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [organizers, setOrganizers] = useState<OrganizerCompany[]>(INITIAL_ORGANIZERS);

  useEffect(() => {
    // Fetch live state from API
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.events) {
          setEvents(data.events);
        }
      })
      .catch(() => {});

    fetch('/api/organizers')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.organizers) {
          setOrganizers(data.organizers);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <ToastProvider>
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-accent selection:text-black">
          {/* Demo Role Switcher Bar */}
          <RoleBanner />

          {/* Global Header */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-1">
            <HeroSection />
            <StatsMarquee />
            <TrendingSection events={events} />
            <CategorySection />
            <CitySection />
            <OrganizersSection organizers={organizers} />
            <TrustSection />
            <OrganizerCtaSection />
          </main>

          {/* Footer */}
          <Footer />

          {/* Modal */}
          <LoginModal />
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}
