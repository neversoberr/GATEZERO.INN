'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleBanner } from '@/components/layout/RoleBanner';
import { LoginModal } from '@/components/auth/LoginModal';
import { EventCard } from '@/components/events/EventCard';
import { OrganizerCompany, Event } from '@/types';
import { INITIAL_ORGANIZERS, INITIAL_EVENTS } from '@/lib/data/initial-data';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldCheck, 
  Users, 
  Star, 
  Globe, 
  Camera, 
  Mail, 
  MapPin, 
  Calendar, 
  Share2 
} from 'lucide-react';

export default function OrganizerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  return <OrganizerContent slug={slug} />;
}

function OrganizerContent({ slug }: { slug: string }) {
  const { isOrganizerFollowed, toggleFollowOrganizer } = useAuth();
  const toast = useToast();

  const [organizer, setOrganizer] = useState<OrganizerCompany | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const found = INITIAL_ORGANIZERS.find(o => o.slug === slug || o.id === slug) || INITIAL_ORGANIZERS[0];
    const orgEvents = INITIAL_EVENTS.filter(e => e.organizerId === found.id);
    setOrganizer(found);
    setEvents(orgEvents);

    fetch(`/api/organizers/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.organizer) {
          setOrganizer(data.organizer);
          if (data.events) setEvents(data.events);
        }
      })
      .catch(() => {});
  }, [slug]);

  if (!organizer) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
        SEARCHING ORGANIZER RECORD...
      </div>
    );
  }

  const followed = isOrganizerFollowed(organizer.id);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F1F1EB] flex flex-col font-mono selection:bg-[#C8FF16] selection:text-black">
      <RoleBanner />
      <Navbar />

      <main className="flex-1">
        
        {/* Cover Banner */}
        <div className="relative h-64 sm:h-80 bg-black border-b border-white/10 overflow-hidden">
          <img
            src={organizer.coverUrl}
            alt={organizer.name}
            className="w-full h-full object-cover grayscale-[30%] opacity-40 scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40 pointer-events-none" />
        </div>

        {/* Profile Card Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20 z-10">
          <div className="bg-[#0e100c] border border-white/20 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 shadow-2xl">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              <img
                src={organizer.logoUrl}
                alt={organizer.name}
                className="w-24 h-24 sm:w-28 sm:h-28 object-cover border-2 border-white/30 bg-black shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
                    {organizer.name}
                  </h1>
                  {organizer.isVerified && (
                    <span title="Verified Cultural Collective">
                      <ShieldCheck className="w-5 h-5 text-[#C8FF16]" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#C8FF16] uppercase font-bold">
                  {organizer.city}, {organizer.country} // {organizer.categories.join(' • ')}
                </p>
                <p className="text-xs text-white/70 font-sans max-w-xl pt-1">
                  {organizer.tagline}
                </p>
              </div>
            </div>

            {/* Actions & Metrics */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <div className="flex gap-4 text-center text-xs p-3 bg-black/60 border border-white/10">
                <div>
                  <div className="text-[9px] text-white/40 uppercase">FOLLOWERS</div>
                  <div className="text-base font-black text-white">{organizer.followersCount.toLocaleString()}</div>
                </div>
                <div className="border-l border-white/10 pl-4">
                  <div className="text-[9px] text-white/40 uppercase">RATING</div>
                  <div className="text-base font-black text-[#C8FF16] flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#C8FF16]" />
                    {organizer.rating}
                  </div>
                </div>
                <div className="border-l border-white/10 pl-4">
                  <div className="text-[9px] text-white/40 uppercase">EVENTS</div>
                  <div className="text-base font-black text-white">{organizer.totalEventsHosted}</div>
                </div>
              </div>

              <button
                onClick={() => toggleFollowOrganizer(organizer.id)}
                className={`px-6 py-3.5 text-xs font-bold uppercase transition-colors ${
                  followed
                    ? 'bg-[#C8FF16] text-black font-black'
                    : 'bg-white text-black font-bold hover:bg-[#C8FF16]'
                }`}
              >
                {followed ? '✓ FOLLOWING' : '+ FOLLOW HOST'}
              </button>
            </div>

          </div>
        </div>

        {/* Bio & Links Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              <div className="text-[10px] uppercase tracking-widest text-[#C8FF16] font-bold">
                COLLECTIVE MANIFESTO
              </div>
              <p className="text-sm sm:text-base text-white/80 font-sans leading-relaxed">
                {organizer.description}
              </p>
            </div>

            <div className="lg:col-span-4 p-6 bg-[#0e100c] border border-white/10 space-y-3 text-xs">
              <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                COMMUNICATION RELAYS
              </div>
              {organizer.website && (
                <div className="flex items-center gap-2 text-white/70 hover:text-white">
                  <Globe className="w-4 h-4 text-[#C8FF16]" />
                  <a href={organizer.website} target="_blank" rel="noreferrer" className="truncate">{organizer.website}</a>
                </div>
              )}
              {organizer.instagram && (
                <div className="flex items-center gap-2 text-white/70 hover:text-white">
                  <Camera className="w-4 h-4 text-[#C8FF16]" />
                  <span>{organizer.instagram}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-white/70">
                <Mail className="w-4 h-4 text-[#C8FF16]" />
                <span>{organizer.email}</span>
              </div>
            </div>
          </div>

          {/* Active Events */}
          <div className="space-y-6">
            <div className="pb-4 border-b border-white/10 flex justify-between items-end">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[#C8FF16] font-bold">
                  ACTIVE EXPERIENCES ({events.length})
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mt-0.5">
                  UPCOMING TRANSMISSIONS
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(ev => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          </div>

        </div>

      </main>

      <Footer />
      <LoginModal />
    </div>
  );
}
