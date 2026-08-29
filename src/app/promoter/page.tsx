'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleBanner } from '@/components/layout/RoleBanner';
import { LoginModal } from '@/components/auth/LoginModal';
import { PromoterProfile, Event } from '@/types';
import { INITIAL_PROMOTERS, INITIAL_EVENTS } from '@/lib/data/initial-data';
import { ToastProvider, useToast } from '@/context/ToastContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { 
  Share2, 
  Copy, 
  DollarSign, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  Tag 
} from 'lucide-react';

export default function PromoterPage() {
  return (
    <ToastProvider>
      <AuthProvider>
        <PromoterPortalContent />
      </AuthProvider>
    </ToastProvider>
  );
}

function PromoterPortalContent() {
  const { user } = useAuth();
  const toast = useToast();

  const [promoter, setPromoter] = useState<PromoterProfile>(INITIAL_PROMOTERS[0]);
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [selectedEventSlug, setSelectedEventSlug] = useState('steelworks-after-dark');
  const [isPayoutRequested, setIsPayoutRequested] = useState(false);

  useEffect(() => {
    fetch('/api/promoters?code=PRIYA10')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.promoter) {
          setPromoter(data.promoter);
        }
      })
      .catch(() => {});
  }, []);

  const generatedLink = typeof window !== 'undefined'
    ? `${window.location.origin}/events/${selectedEventSlug}?ref=${promoter.code}`
    : `https://gatezero.in/events/${selectedEventSlug}?ref=${promoter.code}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(generatedLink);
      toast.success('TRACKING LINK COPIED', `Promoter link copied with tag ${promoter.code}`);
    }
  };

  const handleRequestPayout = () => {
    setIsPayoutRequested(true);
    toast.success('PAYOUT REQUEST DISPATCHED', `Request for ₹${promoter.pendingPayout.toLocaleString('en-IN')} submitted to Gate Zero Finance.`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F1F1EB] flex flex-col font-mono selection:bg-[#C8FF16] selection:text-black">
      <RoleBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Header */}
        <div className="pb-8 border-b border-white/10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#C8FF16] font-bold flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              AFFILIATE & PROMOTER NETWORK
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-1">
              PROMOTER HUB // {promoter.name.toUpperCase()}
            </h1>
            <p className="text-xs text-white/60 font-sans mt-1">
              Active Promo Code: <strong className="text-[#C8FF16]">{promoter.code}</strong> • Base Commission: <strong>{promoter.commissionRate}%</strong>
            </p>
          </div>

          <button
            onClick={handleRequestPayout}
            disabled={isPayoutRequested || promoter.pendingPayout <= 0}
            className="px-6 py-3 bg-[#C8FF16] hover:bg-[#b8ea14] text-black font-black uppercase text-xs flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-40"
          >
            <DollarSign className="w-4 h-4" />
            <span>{isPayoutRequested ? 'PAYOUT UNDER REVIEW' : `REQUEST PAYOUT (₹${promoter.pendingPayout.toLocaleString('en-IN')})`}</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-[#0e100c] border border-white/10 space-y-1">
            <div className="text-[10px] text-white/40 uppercase">CAMPAIGN CLICKS</div>
            <div className="text-3xl font-black text-white">{promoter.totalClicks.toLocaleString()}</div>
            <div className="text-[10px] text-[#C8FF16]">10.0% Conversion Rate</div>
          </div>

          <div className="p-6 bg-[#0e100c] border border-white/10 space-y-1">
            <div className="text-[10px] text-white/40 uppercase">PASSES ATTRIBUTED</div>
            <div className="text-3xl font-black text-white">{promoter.totalSalesCount}</div>
            <div className="text-[10px] text-white/60">Across 3 Active Events</div>
          </div>

          <div className="p-6 bg-[#0e100c] border border-white/10 space-y-1">
            <div className="text-[10px] text-white/40 uppercase">TOTAL EARNED COMMISSION</div>
            <div className="text-3xl font-black text-[#C8FF16]">
              ₹{promoter.totalCommissionEarned.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-white/40">Gross Sales: ₹{promoter.totalGrossSales.toLocaleString('en-IN')}</div>
          </div>

          <div className="p-6 bg-[#0e100c] border border-[#C8FF16]/30 bg-[#12160e] space-y-1">
            <div className="text-[10px] text-[#C8FF16] uppercase font-bold">READY FOR SETTLEMENT</div>
            <div className="text-3xl font-black text-white">
              ₹{promoter.pendingPayout.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-white/60">Already Paid: ₹{promoter.paidPayout.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Unique Tracking Link Generator */}
        <div className="p-6 sm:p-8 bg-[#0e100c] border border-white/20 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-white/10 text-xs font-black uppercase text-white">
            <span>GENERATE EVENT TRACKING LINK</span>
            <span className="text-[#C8FF16]">DYNAMIC UTM ATTACHMENT</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase text-white/50 mb-1">SELECT EXPERIENCE</label>
              <select
                value={selectedEventSlug}
                onChange={e => setSelectedEventSlug(e.target.value)}
                className="w-full bg-black border border-white/20 p-2.5 text-xs text-white uppercase focus:border-[#C8FF16]"
              >
                {events.map(ev => (
                  <option key={ev.id} value={ev.slug}>
                    {ev.city}: {ev.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] uppercase text-white/50 mb-1">YOUR UNIQUE PROMOTER LINK</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className="flex-1 bg-black border border-white/20 px-3 py-2 text-xs text-[#C8FF16] font-bold"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-[#C8FF16] hover:bg-[#b8ea14] text-black font-black uppercase text-xs flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Breakdown Table */}
        <div className="bg-[#0e100c] border border-white/10 p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-white/10 text-xs font-black uppercase text-white">
            <span>PERFORMANCE BY EVENT</span>
            <span className="text-[10px] text-white/40">REALTIME TRACKING LOGS</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white">
              <thead className="bg-black text-[10px] uppercase text-white/50 border-b border-white/10">
                <tr>
                  <th className="p-4">EVENT</th>
                  <th className="p-4">CLICKS</th>
                  <th className="p-4">PASSES SOLD</th>
                  <th className="p-4">GROSS SALES</th>
                  <th className="p-4">COMMISSION (10%)</th>
                  <th className="p-4">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { title: 'Steelworks: After Dark (Mumbai)', clicks: 820, sold: 92, gross: 248400, earned: 24840, status: 'Active' },
                  { title: 'KHAOS Delhi: Brutalist Bass', clicks: 360, sold: 34, gross: 81600, earned: 8160, status: 'Active' },
                  { title: 'OFF/GRID Goa: 3-Day Festival', clicks: 240, sold: 16, gross: 54000, earned: 5400, status: 'Active' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5">
                    <td className="p-4 font-bold font-sans">{row.title}</td>
                    <td className="p-4">{row.clicks}</td>
                    <td className="p-4 font-bold">{row.sold}</td>
                    <td className="p-4">₹{row.gross.toLocaleString('en-IN')}</td>
                    <td className="p-4 font-black text-[#C8FF16]">₹{row.earned.toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-[#C8FF16]/20 text-[#C8FF16] text-[10px] uppercase font-bold">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      <Footer />
      <LoginModal />
    </div>
  );
}
