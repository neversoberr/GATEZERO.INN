'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleBanner } from '@/components/layout/RoleBanner';
import { LoginModal } from '@/components/auth/LoginModal';
import { Event, TicketTier } from '@/types';
import { CITIES, CATEGORIES } from '@/lib/data/initial-data';
import { ToastProvider, useToast } from '@/context/ToastContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { 
  Plus, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Calendar, 
  MapPin, 
  Upload, 
  ShieldCheck, 
  Lock,
  Layers
} from 'lucide-react';

function CreateEventWizard() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Basics
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('underground');
  const [subcategory, setSubcategory] = useState('Industrial Techno');
  const [tags, setTags] = useState('Techno, Warehouse, Funktion-One');

  // Step 2: Date & Location
  const [city, setCity] = useState('Mumbai');
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [startDate, setStartDate] = useState('2026-09-26T21:00');
  const [doorsOpenTime, setDoorsOpenTime] = useState('21:00 IST');
  const [ageRestriction, setAgeRestriction] = useState<'18+' | '21+' | 'All Ages'>('21+');
  const [isSecretLocation, setIsSecretLocation] = useState(false);
  const [secretInstructions, setSecretInstructions] = useState('');

  // Step 3: Media
  const [posterUrl, setPosterUrl] = useState('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop');

  // Step 4: Ticket Tiers
  const [tiers, setTiers] = useState<TicketTier[]>([
    {
      id: `tier_${Date.now()}_1`,
      eventId: '',
      name: 'Phase 1 Access Pass',
      type: 'phase_1',
      price: 1499,
      totalQuantity: 200,
      soldQuantity: 0,
      reservedQuantity: 0,
      description: 'General admission entry with full warehouse floor access.',
      perks: ['Full all-night access'],
      minPerOrder: 1,
      maxPerOrder: 4,
      salesStartDate: '2026-08-01T00:00:00Z',
      salesEndDate: '2026-09-26T21:00:00Z',
      entryValidity: 'Entry before 00:30 midnight',
      refundEligibility: 'refundable_48h'
    },
    {
      id: `tier_${Date.now()}_2`,
      eventId: '',
      name: 'VIP Backstage Deck',
      type: 'vip',
      price: 2999,
      totalQuantity: 50,
      soldQuantity: 0,
      reservedQuantity: 0,
      description: 'Elevated platform, express bar & luxury amenities.',
      perks: ['Elevated viewing platform', 'Express VIP bar'],
      minPerOrder: 1,
      maxPerOrder: 2,
      salesStartDate: '2026-08-01T00:00:00Z',
      salesEndDate: '2026-09-26T21:00:00Z',
      entryValidity: 'All night',
      refundEligibility: 'refundable_48h'
    }
  ]);

  // Step 5: Policies
  const [dressCode, setDressCode] = useState('All-black, industrial or utilitarian attire.');
  const [phonePolicy, setPhonePolicy] = useState('No camera flash. Stickers applied at entry.');
  const [refundPolicyText, setRefundPolicyText] = useState('Refundable up to 48 hours prior to showtime.');

  const handleAddTier = () => {
    const newTier: TicketTier = {
      id: `tier_${Date.now()}_${tiers.length + 1}`,
      eventId: '',
      name: `Tier ${tiers.length + 1}`,
      type: 'general',
      price: 1999,
      totalQuantity: 100,
      soldQuantity: 0,
      reservedQuantity: 0,
      description: 'Access pass tier.',
      perks: ['Standard event entry'],
      minPerOrder: 1,
      maxPerOrder: 4,
      salesStartDate: '2026-08-01T00:00:00Z',
      salesEndDate: '2026-09-26T21:00:00Z',
      entryValidity: 'All night',
      refundEligibility: 'refundable_48h'
    };
    setTiers([...tiers, newTier]);
  };

  const handleRemoveTier = (idx: number) => {
    if (tiers.length <= 1) return;
    setTiers(tiers.filter((_, i) => i !== idx));
  };

  const handleTierUpdate = (index: number, key: keyof TicketTier, val: any) => {
    const copy = [...tiers];
    copy[index] = { ...copy[index], [key]: val };
    setTiers(copy);
  };

  const handlePublish = async () => {
    if (!title || !venueName) {
      toast.error('INCOMPLETE FIELDS', 'Title and venue are required.');
      return;
    }

    setIsSubmitting(true);
    const eventId = `ev_${Date.now()}`;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const code = `GZ-${city.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newEvent: Event = {
      id: eventId,
      code,
      slug,
      title,
      tagline: tagline || title,
      description: description || 'Experience curated by Gate Zero verified host.',
      category: category as any,
      subcategory,
      tags: tags.split(',').map(t => t.trim()),
      format: isSecretLocation ? 'secret_location' : 'warehouse',
      status: 'published',
      isFeatured: false,
      isTrending: true,
      isSellingFast: false,
      isVerifiedOrganizer: true,
      accentColor: '#D4F00D',
      posterUrl,
      coverBannerUrl: posterUrl,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(new Date(startDate).getTime() + 8 * 3600000).toISOString(),
      doorsOpenTime,
      timezone: 'IST (UTC+05:30)',
      city,
      venueName,
      venueAddress: venueAddress || venueName + ', ' + city,
      coordinates: { lat: 18.9744, lng: 72.8488 },
      secretLocationInstructions: isSecretLocation ? secretInstructions : undefined,
      ageRestriction,
      dressCode,
      phonePolicy,
      refundPolicyText,
      organizerId: 'org_subkulture',
      organizerName: 'SubKulture India',
      organizerLogo: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=300&auto=format&fit=crop',
      organizerSlug: 'subkulture-india',
      lineup: [
        { id: 'art_new_1', name: 'HEADLINER [TBA]', role: 'Live Set', setTime: '00:00 - 03:00' }
      ],
      schedule: [
        { time: '21:00', title: 'Doors Open // Soundcheck' }
      ],
      faqs: [
        { question: 'What is the entry cutoff time?', answer: 'Doors close 2 hours before event ends.' }
      ],
      viewsCount: 120,
      savedCount: 14,
      totalCapacity: tiers.reduce((s, t) => s + t.totalQuantity, 0),
      totalTicketsSold: 0,
      minPrice: Math.min(...tiers.map(t => t.price)),
      maxPrice: Math.max(...tiers.map(t => t.price)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const finalTiers = tiers.map(t => ({ ...t, eventId }));

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: newEvent, tiers: finalTiers })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('EVENT PUBLISHED TO THE GRID', `${newEvent.title} is now discoverable.`);
        router.push(`/events/${newEvent.slug}`);
      } else {
        toast.error('CREATION FAILED', data.error);
      }
    } catch (e: any) {
      toast.error('ERROR', e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-mono selection:bg-accent selection:text-black">
      <RoleBanner />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Wizard Header */}
        <div className="pb-6 border-b border-border/50 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-accent font-bold">
              BUILDER PROTOCOL // STEP {step} OF 5
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground mt-1">
              CREATE NEW EVENT
            </h1>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {[1, 2, 3, 4, 5].map(s => (
              <div
                key={s}
                className={`w-7 h-7 flex items-center justify-center border font-bold ${
                  step === s
                    ? 'border-accent bg-accent text-black'
                    : step > s
                    ? 'border-foreground bg-foreground/20 text-foreground'
                    : 'border-border text-muted-foreground'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: BASICS */}
        {step === 1 && (
          <div className="py-8 space-y-6">
            <div>
              <label className="block text-[11px] uppercase font-bold text-foreground/70 mb-1">
                EVENT TITLE *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. MONOLITH: Raw Industrial Assembly"
                className="w-full bg-card border border-border p-3 text-sm text-foreground font-bold focus:border-accent focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-foreground/70 mb-1">
                  CATEGORY *
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-card border border-border p-3 text-xs text-foreground uppercase focus:border-accent"
                >
                  {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-foreground/70 mb-1">
                  SUB-GENRE / ATMOSPHERE
                </label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={e => setSubcategory(e.target.value)}
                  placeholder="e.g. Dark Techno & Ambient"
                  className="w-full bg-card border border-border p-3 text-xs text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-foreground/70 mb-1">
                SHORT MANIFESTO (TAGLINE)
              </label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder="e.g. 10 hours of modular live synthesis inside a disused hangar"
                className="w-full bg-card border border-border p-3 text-xs text-foreground"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-foreground/70 mb-1">
                FULL DESCRIPTION & PROGRAM DETAILS
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Full program notes, artist backgrounds, sound specifications..."
                className="w-full bg-card border border-border p-3 text-xs text-foreground focus:border-accent"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!title}
                className="px-6 py-3 bg-accent text-black font-black uppercase text-xs flex items-center gap-2 hover:bg-accent-hover disabled:opacity-40"
              >
                <span>NEXT: DATE & VENUE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DATE & LOCATION */}
        {step === 2 && (
          <div className="py-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-foreground/70 mb-1">
                  CITY HUB *
                </label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full bg-card border border-border p-3 text-xs text-foreground uppercase focus:border-accent"
                >
                  {CITIES.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.name}>{c.name.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-foreground/70 mb-1">
                  START DATE & TIME *
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full bg-card border border-border p-3 text-xs text-foreground focus:border-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-foreground/70 mb-1">
                  VENUE NAME *
                </label>
                <input
                  type="text"
                  value={venueName}
                  onChange={e => setVenueName(e.target.value)}
                  placeholder="e.g. The Forging Shed / Secret Docklands"
                  className="w-full bg-card border border-border p-3 text-xs text-foreground focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-foreground/70 mb-1">
                  VENUE FULL ADDRESS
                </label>
                <input
                  type="text"
                  value={venueAddress}
                  onChange={e => setVenueAddress(e.target.value)}
                  placeholder="e.g. Reay Road East, Mumbai 400010"
                  className="w-full bg-card border border-border p-3 text-xs text-foreground"
                />
              </div>
            </div>

            {/* Secret Location Toggle */}
            <div className="p-4 bg-card border border-border/50 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-foreground">
                <input
                  type="checkbox"
                  checked={isSecretLocation}
                  onChange={e => setIsSecretLocation(e.target.checked)}
                  className="accent-accent"
                />
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-accent" />
                  SECRET VENUE / COORDINATES SENT VIA SMS PRIOR TO EVENT
                </span>
              </label>

              {isSecretLocation && (
                <input
                  type="text"
                  value={secretInstructions}
                  onChange={e => setSecretInstructions(e.target.value)}
                  placeholder="Secret access pin or gate meeting coordinates..."
                  className="w-full bg-black border border-border p-2.5 text-xs text-foreground"
                />
              )}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-black border border-border text-xs font-bold uppercase text-foreground"
              >
                ← BACK
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!venueName}
                className="px-6 py-3 bg-accent text-black font-black uppercase text-xs flex items-center gap-2 hover:bg-accent-hover disabled:opacity-40"
              >
                <span>NEXT: POSTER & ARTWORK</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CREATIVE ASSETS */}
        {step === 3 && (
          <div className="py-8 space-y-6">
            <div>
              <label className="block text-[11px] uppercase font-bold text-foreground/70 mb-1">
                POSTER IMAGE URL
              </label>
              <input
                type="url"
                value={posterUrl}
                onChange={e => setPosterUrl(e.target.value)}
                className="w-full bg-card border border-border p-3 text-xs text-foreground focus:border-accent"
              />
            </div>

            {/* Poster Presets */}
            <div>
              <div className="text-[10px] text-muted-foreground uppercase mb-2">QUICK POSTER PRESETS:</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?q=80&w=800&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop'
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPosterUrl(preset)}
                    className="relative aspect-video bg-black border border-border overflow-hidden hover:border-accent"
                  >
                    <img src={preset} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Live Preview */}
            <div className="p-4 bg-card border border-border/50 flex items-center gap-4">
              <img src={posterUrl} alt="Live poster preview" className="w-20 h-24 object-cover border border-border" />
              <div>
                <div className="text-sm font-black uppercase text-foreground">{title || 'UNTITLED EVENT'}</div>
                <div className="text-xs text-accent">{city} • {venueName || 'VENUE'}</div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-black border border-border text-xs font-bold uppercase text-foreground"
              >
                ← BACK
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-3 bg-accent text-black font-black uppercase text-xs flex items-center gap-2 hover:bg-accent-hover"
              >
                <span>NEXT: CONFIGURE TIERS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: TICKET TIERS */}
        {step === 4 && (
          <div className="py-8 space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-border/50">
              <span className="text-xs font-black uppercase text-foreground">ACCESS PASS TIERS</span>
              <button
                type="button"
                onClick={handleAddTier}
                className="px-3 py-1.5 bg-accent text-black font-bold uppercase text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD PASS TIER</span>
              </button>
            </div>

            <div className="space-y-4">
              {tiers.map((t, idx) => (
                <div key={t.id} className="p-4 bg-card border border-border space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-accent">TIER #{idx + 1}</span>
                    {tiers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTier(idx)}
                        className="text-muted-foreground hover:text-danger"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase text-muted-foreground mb-1">TIER NAME</label>
                      <input
                        type="text"
                        value={t.name}
                        onChange={e => handleTierUpdate(idx, 'name', e.target.value)}
                        className="w-full bg-black border border-border p-2 text-xs text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-muted-foreground mb-1">PRICE (INR ₹)</label>
                      <input
                        type="number"
                        value={t.price}
                        onChange={e => handleTierUpdate(idx, 'price', Number(e.target.value))}
                        className="w-full bg-black border border-border p-2 text-xs text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-muted-foreground mb-1">TOTAL QUANTITY</label>
                      <input
                        type="number"
                        value={t.totalQuantity}
                        onChange={e => handleTierUpdate(idx, 'totalQuantity', Number(e.target.value))}
                        className="w-full bg-black border border-border p-2 text-xs text-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-muted-foreground mb-1">PERKS / ENTRY DETAILS</label>
                    <input
                      type="text"
                      value={t.description}
                      onChange={e => handleTierUpdate(idx, 'description', e.target.value)}
                      className="w-full bg-black border border-border p-2 text-xs text-foreground"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 bg-black border border-border text-xs font-bold uppercase text-foreground"
              >
                ← BACK
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="px-6 py-3 bg-accent text-black font-black uppercase text-xs flex items-center gap-2 hover:bg-accent-hover"
              >
                <span>NEXT: POLICIES & PUBLISH</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: POLICIES & SUBMISSION */}
        {step === 5 && (
          <div className="py-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-foreground/70 mb-1">
                  AGE RESTRICTION *
                </label>
                <select
                  value={ageRestriction}
                  onChange={e => setAgeRestriction(e.target.value as any)}
                  className="w-full bg-card border border-border p-3 text-xs text-foreground uppercase focus:border-accent"
                >
                  <option value="21+">21+ ONLY</option>
                  <option value="18+">18+ ONLY</option>
                  <option value="All Ages">ALL AGES</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-foreground/70 mb-1">
                  CAMERA & PHONE POLICY
                </label>
                <input
                  type="text"
                  value={phonePolicy}
                  onChange={e => setPhonePolicy(e.target.value)}
                  className="w-full bg-card border border-border p-3 text-xs text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-foreground/70 mb-1">
                DRESS CODE
              </label>
              <input
                type="text"
                value={dressCode}
                onChange={e => setDressCode(e.target.value)}
                className="w-full bg-card border border-border p-3 text-xs text-foreground"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-foreground/70 mb-1">
                REFUND & CANCELLATION POLICY
              </label>
              <input
                type="text"
                value={refundPolicyText}
                onChange={e => setRefundPolicyText(e.target.value)}
                className="w-full bg-card border border-border p-3 text-xs text-foreground"
              />
            </div>

            <div className="p-6 bg-card border-2 border-accent space-y-2">
              <div className="text-xs font-black uppercase text-accent flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                GATE ZERO VERIFICATION CHECKLIST
              </div>
              <p className="text-xs text-foreground/70 font-sans">
                By publishing, this experience will immediately be activated on the national Gate Zero event radar and eligible for UPI/Razorpay ticket sales.
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-4 py-2 bg-black border border-border text-xs font-bold uppercase text-foreground"
              >
                ← BACK
              </button>

              <button
                type="button"
                onClick={handlePublish}
                disabled={isSubmitting}
                className="px-8 py-4 bg-accent text-black font-black uppercase text-sm flex items-center gap-2 hover:bg-accent-hover transition-transform active:scale-95 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'ENCRYPTING & PUBLISHING...' : 'PUBLISH EVENT TO GRID ↗'}</span>
              </button>
            </div>
          </div>
        )}

      </main>

      <Footer />
      <LoginModal />
    </div>
  );
}

export default function NewEventPage() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CreateEventWizard />
      </AuthProvider>
    </ToastProvider>
  );
}
