'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleBanner } from '@/components/layout/RoleBanner';
import { LoginModal } from '@/components/auth/LoginModal';
import { TicketSelector } from '@/components/events/TicketSelector';
import { CheckoutModal } from '@/components/checkout/CheckoutModal';
import { EventCard } from '@/components/events/EventCard';
import { Event, TicketTier, OrganizerCompany } from '@/types';
import { INITIAL_EVENTS, INITIAL_TICKET_TIERS, INITIAL_ORGANIZERS } from '@/lib/data/initial-data';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Share2, 
  Bookmark, 
  Download, 
  AlertTriangle, 
  Mail, 
  ChevronDown, 
  Check, 
  Flame, 
  Lock, 
  Sparkles, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  return <EventDetailContent slug={slug} />;
}

function EventDetailContent({ slug }: { slug: string }) {
  const { user, isEventSaved, toggleSaveEvent, isOrganizerFollowed, toggleFollowOrganizer, openLoginModal } = useAuth();
  const toast = useToast();

  const [event, setEvent] = useState<Event | null>(null);
  const [tiers, setTiers] = useState<TicketTier[]>([]);
  const [organizer, setOrganizer] = useState<OrganizerCompany | null>(null);
  const [similarEvents, setSimilarEvents] = useState<Event[]>([]);

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  
  // Accordions & Modals
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [reportReason, setReportReason] = useState('Incorrect venue details');

  useEffect(() => {
    // Lookup in initial state or API
    const foundEvent = INITIAL_EVENTS.find(e => e.slug === slug || e.id === slug) || INITIAL_EVENTS[0];
    const foundTiers = INITIAL_TICKET_TIERS.filter(t => t.eventId === foundEvent.id);
    const foundOrg = INITIAL_ORGANIZERS.find(o => o.id === foundEvent.organizerId) || INITIAL_ORGANIZERS[0];
    const similar = INITIAL_EVENTS.filter(e => e.id !== foundEvent.id && (e.city === foundEvent.city || e.category === foundEvent.category)).slice(0, 3);

    setEvent(foundEvent);
    setTiers(foundTiers);
    setOrganizer(foundOrg);
    setSimilarEvents(similar);

    // Try API fetch for freshest persisted state
    fetch(`/api/events/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.event) {
          setEvent(data.event);
          if (data.tiers) setTiers(data.tiers);
          if (data.organizer) setOrganizer(data.organizer);
        }
      })
      .catch(() => {});

    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        sessionStorage.setItem('gz_ref', ref);
        fetch('/api/promoters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ click: true, code: ref })
        }).catch(() => {});
      }
    } catch {
      // ignore
    }
  }, [slug]);

  if (!event) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
        SEARCHING GATE COORDINATES...
      </div>
    );
  }

  const saved = isEventSaved(event.id);
  const followed = organizer ? isOrganizerFollowed(organizer.id) : false;

  const eventDateObj = new Date(event.startDate);
  const formattedFullDate = eventDateObj.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).toUpperCase();

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('ENCRYPTED LINK COPIED', 'Event URL copied to clipboard.');
    }
  };

  const handleAddCalendar = () => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`${event.tagline}\n\nVenue: ${event.venueName}, ${event.city}\nBooked via GATE ZERO (https://gatezero.in)`);
    const location = encodeURIComponent(`${event.venueAddress}`);
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleUrl, '_blank');
    toast.info('CALENDAR DISPATCH', 'Opening Google Calendar dispatch.');
  };

  const handleProceedToCheckout = (quantities: Record<string, number>) => {
    if (!user) {
      openLoginModal();
      toast.warning('IDENTITY REQUIRED', 'Sign in or create an account to mint passes.');
      return;
    }
    setSelectedQuantities(quantities);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F1F1EB] flex flex-col font-sans">
      <RoleBanner />
      <Navbar />

      <main className="flex-1">
        
        {/* Full-Width Editorial Hero Banner */}
        <section className="relative min-h-[55vh] lg:min-h-[65vh] bg-black flex flex-col justify-end overflow-hidden border-b border-white/10">
          <img
            src={event.coverBannerUrl || event.posterUrl}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover grayscale-[30%] opacity-40 scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/70 to-black/30 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 w-full font-mono">
            
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
              <span className="px-2.5 py-1 bg-[#C8FF16] text-black font-black uppercase tracking-wider">
                {event.code}
              </span>
              <span className="px-2.5 py-1 bg-black/80 border border-white/20 text-white uppercase tracking-widest">
                {event.category.replace('_', ' ')}
              </span>
              <span className="px-2.5 py-1 bg-black/80 border border-white/20 text-white uppercase flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C8FF16]" />
                {event.city}
              </span>
              {event.isSellingFast && (
                <span className="px-2.5 py-1 bg-[#FF6B00] text-black font-black uppercase flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-black" />
                  HIGH VELOCITY // SELLING FAST
                </span>
              )}
            </div>

            {/* Giant Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-tight max-w-4xl">
              {event.title}
            </h1>

            {/* Tagline */}
            <p className="text-base sm:text-xl text-white/80 font-sans mt-3 max-w-2xl leading-relaxed">
              {event.tagline}
            </p>

            {/* Hero Meta & Fast Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-white/10 text-xs">
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#C8FF16]" />
                  <span>{formattedFullDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C8FF16]" />
                  <span>DOORS {event.doorsOpenTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C8FF16]" />
                  <span>AGE {event.ageRestriction}</span>
                </div>
              </div>

              {/* Share & Save */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSaveEvent(event.id)}
                  className={`px-3 py-2 border text-xs font-bold uppercase flex items-center gap-1.5 transition-colors ${
                    saved
                      ? 'bg-[#C8FF16] text-black border-[#C8FF16]'
                      : 'bg-black/60 text-white border-white/20 hover:border-white'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{saved ? 'SAVED' : 'SAVE EVENT'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="px-3 py-2 bg-black/60 hover:bg-white hover:text-black border border-white/20 text-white text-xs font-bold uppercase flex items-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>SHARE</span>
                </button>

                <button
                  onClick={handleAddCalendar}
                  className="px-3 py-2 bg-black/60 hover:bg-white hover:text-black border border-white/20 text-white text-xs font-bold uppercase flex items-center gap-1.5 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>CALENDAR</span>
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* 2-Column Content Layout (Details on Left, Sticky Ticket Panel on Right) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT COLUMN: Deep Information */}
            <div className="lg:col-span-7 space-y-12">
              
              {/* Event Overview */}
              <section className="space-y-4 font-mono">
                <div className="text-[10px] uppercase tracking-widest text-[#C8FF16] font-bold">
                  // TRANSMISSION MANIFESTO
                </div>
                <h2 className="text-2xl font-black uppercase text-white tracking-tight">
                  ABOUT THIS EXPERIENCE
                </h2>
                <div className="text-sm sm:text-base text-white/80 font-sans leading-relaxed whitespace-pre-line">
                  {event.description}
                </div>

                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {event.tags.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-[#121410] border border-white/10 text-xs text-white/60">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </section>

              {/* Lineup & Artists Section */}
              {event.lineup && event.lineup.length > 0 && (
                <section className="space-y-4 font-mono">
                  <div className="text-[10px] uppercase tracking-widest text-[#C8FF16] font-bold">
                    // ARTIST ROSTER & SET TIMES
                  </div>
                  <h2 className="text-2xl font-black uppercase text-white tracking-tight">
                    PROGRAM LINEUP
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {event.lineup.map(art => (
                      <div
                        key={art.id}
                        className="p-4 bg-[#0e100c] border border-white/10 flex items-center gap-4 hover:border-white/30 transition-colors"
                      >
                        {art.imageUrl ? (
                          <img
                            src={art.imageUrl}
                            alt={art.name}
                            className="w-16 h-16 object-cover border border-white/20 shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-[#171914] border border-white/20 flex items-center justify-center font-bold text-[#C8FF16] shrink-0">
                            00
                          </div>
                        )}
                        <div className="space-y-0.5 min-w-0">
                          <h3 className="text-sm font-black uppercase text-white truncate">
                            {art.name}
                          </h3>
                          <div className="text-xs text-[#C8FF16] uppercase truncate">
                            {art.role}
                          </div>
                          {art.setTime && (
                            <div className="text-[11px] text-white/50 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {art.setTime}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Schedule Timeline */}
              {event.schedule && event.schedule.length > 0 && (
                <section className="space-y-4 font-mono">
                  <div className="text-[10px] uppercase tracking-widest text-[#C8FF16] font-bold">
                    // RUN OF SHOW
                  </div>
                  <h2 className="text-2xl font-black uppercase text-white tracking-tight">
                    SCHEDULE & TIMELINE
                  </h2>

                  <div className="border-l-2 border-[#C8FF16]/40 pl-4 sm:pl-6 space-y-6">
                    {event.schedule.map((item, idx) => (
                      <div key={idx} className="relative space-y-1">
                        <div className="absolute -left-[21px] sm:-left-[29px] top-1.5 w-3 h-3 rounded-full bg-black border-2 border-[#C8FF16]" />
                        <div className="text-xs font-bold text-[#C8FF16]">{item.time}</div>
                        <div className="text-sm font-black uppercase text-white">{item.title}</div>
                        {item.stage && (
                          <div className="text-[11px] text-white/50">STAGE: {item.stage}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Venue, Map & Secret Coordinates */}
              <section className="space-y-4 font-mono">
                <div className="text-[10px] uppercase tracking-widest text-[#C8FF16] font-bold">
                  // PHYSICAL ACCESS & LOCATION
                </div>
                <h2 className="text-2xl font-black uppercase text-white tracking-tight">
                  VENUE & DIRECTIONS
                </h2>

                <div className="p-6 bg-[#0e100c] border border-white/10 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black uppercase text-white">{event.venueName}</h3>
                      <p className="text-xs text-white/70 font-sans mt-1">{event.venueAddress}</p>
                    </div>
                    <a
                      href={`https://maps.google.com/?q=${event.coordinates.lat},${event.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-black border border-white/20 text-[#C8FF16] hover:bg-[#C8FF16] hover:text-black text-xs font-bold uppercase flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <span>MAPS ↗</span>
                    </a>
                  </div>

                  {event.secretLocationInstructions && (
                    <div className="p-3 bg-[#171914] border-l-2 border-[#C8FF16] text-xs text-white/80 font-sans">
                      <strong className="text-[#C8FF16] font-mono uppercase block mb-1">
                        SECRET LOCATION PROTOCOL:
                      </strong>
                      {event.secretLocationInstructions}
                    </div>
                  )}

                  {/* Dark Simulated Map Visual */}
                  <div className="relative aspect-[16/7] bg-[#050604] border border-white/10 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
                    <div className="text-center z-10 space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black border border-[#C8FF16] text-xs text-[#C8FF16] font-bold">
                        <MapPin className="w-3.5 h-3.5" />
                        LAT {event.coordinates.lat}° N / LNG {event.coordinates.lng}° E
                      </div>
                      <div className="text-[10px] text-white/40 uppercase">
                        GATE ACCESS CODES ACTIVE ON TICKET
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Rules, Policies & Safety */}
              <section className="space-y-4 font-mono">
                <div className="text-[10px] uppercase tracking-widest text-[#C8FF16] font-bold">
                  // RULES OF ENGAGEMENT
                </div>
                <h2 className="text-2xl font-black uppercase text-white tracking-tight">
                  ENTRY POLICIES & SAFETY
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {event.dressCode && (
                    <div className="p-4 bg-[#0e100c] border border-white/10 space-y-1">
                      <div className="text-[#C8FF16] font-bold uppercase">DRESS CODE</div>
                      <p className="text-white/70 font-sans leading-relaxed">{event.dressCode}</p>
                    </div>
                  )}

                  {event.phonePolicy && (
                    <div className="p-4 bg-[#0e100c] border border-white/10 space-y-1">
                      <div className="text-[#C8FF16] font-bold uppercase">CAMERA / PHONE POLICY</div>
                      <p className="text-white/70 font-sans leading-relaxed">{event.phonePolicy}</p>
                    </div>
                  )}
                </div>

                {event.entryRules && event.entryRules.length > 0 && (
                  <div className="p-4 bg-[#0e100c] border border-white/10 space-y-2">
                    <div className="text-[11px] font-black uppercase text-white">GATE CONTROL PROTOCOLS</div>
                    <ul className="space-y-1.5 text-xs text-white/70 font-sans list-disc list-inside">
                      {event.entryRules.map((r, idx) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>

              {/* FAQs Accordion */}
              {event.faqs && event.faqs.length > 0 && (
                <section className="space-y-4 font-mono">
                  <div className="text-[10px] uppercase tracking-widest text-[#C8FF16] font-bold">
                    // QUERIES
                  </div>
                  <h2 className="text-2xl font-black uppercase text-white tracking-tight">
                    FREQUENTLY ASKED QUESTIONS
                  </h2>

                  <div className="space-y-2">
                    {event.faqs.map((faq, idx) => (
                      <div key={idx} className="border border-white/10 bg-[#0e100c]">
                        <button
                          onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                          className="w-full p-4 text-left flex justify-between items-center text-xs sm:text-sm font-bold uppercase text-white hover:text-[#C8FF16] transition-colors"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${openFaqIndex === idx ? 'rotate-180 text-[#C8FF16]' : 'text-white/40'}`}
                          />
                        </button>
                        {openFaqIndex === idx && (
                          <div className="p-4 pt-0 text-xs text-white/70 font-sans leading-relaxed border-t border-white/5">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Organizer Card */}
              {organizer && (
                <section className="space-y-4 font-mono">
                  <div className="text-[10px] uppercase tracking-widest text-[#C8FF16] font-bold">
                    // HOST COLLECTIVE
                  </div>
                  <div className="p-6 bg-[#0e100c] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={organizer.logoUrl}
                        alt={organizer.name}
                        className="w-16 h-16 object-cover border border-white/20 bg-black shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/organizer/${organizer.slug}`}
                            className="text-base font-black uppercase text-white hover:text-[#C8FF16] transition-colors"
                          >
                            {organizer.name}
                          </Link>
                          {organizer.isVerified && (
                            <ShieldCheck className="w-4 h-4 text-[#C8FF16]" />
                          )}
                        </div>
                        <p className="text-xs text-white/60 font-sans line-clamp-1">{organizer.tagline}</p>
                        <div className="text-[11px] text-white/40">
                          {organizer.followersCount.toLocaleString()} FOLLOWERS • {organizer.totalEventsHosted} EVENTS HOSTED
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => toggleFollowOrganizer(organizer.id)}
                        className={`flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold uppercase transition-colors ${
                          followed
                            ? 'bg-[#C8FF16] text-black font-black'
                            : 'bg-black text-white border border-white/20 hover:border-white'
                        }`}
                      >
                        {followed ? '✓ FOLLOWING' : '+ FOLLOW'}
                      </button>

                      <button
                        onClick={() => setIsContactModalOpen(true)}
                        className="px-3 py-2.5 bg-[#171914] hover:bg-white hover:text-black border border-white/20 text-xs font-bold uppercase transition-colors"
                        title="Contact Host"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* Report event / Disclaimer */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-white/40">
                <span>GATE ZERO VERIFIED LISTING PROTOCOL</span>
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="hover:text-[#FF314A] flex items-center gap-1"
                >
                  <AlertTriangle className="w-3 h-3" />
                  REPORT THIS LISTING
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN: Sticky Ticket Configuration Panel */}
            <div className="lg:col-span-5 sticky top-20">
              <TicketSelector
                event={event}
                tiers={tiers}
                onProceedToCheckout={handleProceedToCheckout}
              />
            </div>

          </div>
        </div>

        {/* Similar Experiences */}
        {similarEvents.length > 0 && (
          <section className="py-16 bg-[#080907] border-t border-white/10 font-mono">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="pb-8 border-b border-white/10 flex justify-between items-end">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#C8FF16] font-bold">
                    // ADJACENT TRANSMISSIONS
                  </div>
                  <h2 className="text-3xl font-black uppercase text-white mt-1">
                    SIMILAR EXPERIENCES
                  </h2>
                </div>
                <Link href="/events" className="text-xs text-[#C8FF16] font-bold uppercase hover:underline">
                  ALL EVENTS ↗
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {similarEvents.map(ev => (
                  <EventCard key={ev.id} event={ev} />
                ))}
              </div>
            </div>
          </section>
        )}

      </main>

      <Footer />
      <LoginModal />

      {/* Checkout Drawer / Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        event={event}
        tiers={tiers}
        selectedQuantities={selectedQuantities}
        onOrderCreated={() => {
          // Re-fetch event state if needed
        }}
      />

      {/* CONTACT ORGANIZER MODAL */}
      {isContactModalOpen && organizer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
          <div className="relative w-full max-w-md bg-[#0e100c] border border-white/20 p-6 text-white">
            <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-bold uppercase text-[#C8FF16]">CONTACT {organizer.name}</span>
              <button onClick={() => setIsContactModalOpen(false)}>✕</button>
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                toast.success('MESSAGE DISPATCHED', 'Organizer will respond via your registered email.');
                setIsContactModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[10px] uppercase text-white/60 mb-1">YOUR MESSAGE</label>
                <textarea
                  rows={4}
                  value={contactMessage}
                  onChange={e => setContactMessage(e.target.value)}
                  placeholder="Questions about dress code, table bookings, VIP entry..."
                  className="w-full bg-black border border-white/20 p-3 text-xs text-white focus:outline-none focus:border-[#C8FF16]"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#C8FF16] text-black font-black uppercase text-xs"
              >
                SEND TRANSMISSION ↗
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REPORT LISTING MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
          <div className="relative w-full max-w-md bg-[#0e100c] border border-[#FF314A] p-6 text-white">
            <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-bold uppercase text-[#FF314A]">REPORT EVENT LISTING</span>
              <button onClick={() => setIsReportModalOpen(false)}>✕</button>
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                toast.success('REPORT RECEIVED', 'Gate Zero trust & compliance team is inspecting the listing.');
                setIsReportModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[10px] uppercase text-white/60 mb-1">REASON</label>
                <select
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  className="w-full bg-black border border-white/20 p-2 text-xs text-white uppercase"
                >
                  <option>Misleading lineup or artist claim</option>
                  <option>Incorrect venue location</option>
                  <option>Suspicious organizer activity</option>
                  <option>Unauthorized ticket scalping</option>
                  <option>Safety or permit violation</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#FF314A] text-white font-black uppercase text-xs"
              >
                SUBMIT REPORT ↗
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
