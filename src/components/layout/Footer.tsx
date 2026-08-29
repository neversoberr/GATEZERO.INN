'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { ArrowRight, ShieldCheck, Terminal, Disc, Globe } from 'lucide-react';
import { CITIES, CATEGORIES } from '@/lib/data/initial-data';

export function Footer() {
  const [email, setEmail] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const toast = useToast();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('INVALID FREQUENCY', 'Enter a valid email address.');
      return;
    }
    toast.success('ENCRYPTED DISPATCH SUBSCRIBED', `${email} added to private drop radar.`);
    setEmail('');
  };

  return (
    <footer className="bg-[#050505] border-t border-white/10 text-[#F1F1EB] pt-16 pb-24 sm:pb-12 mt-20 relative overflow-hidden font-mono">
      {/* Background oversized 00 watermark */}
      <div className="absolute right-[-20px] bottom-[-20px] text-[20vw] font-black text-white/[0.02] select-none pointer-events-none leading-none tracking-tighter">
        00
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Section: Newsletter & Brand Signal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-white/10">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#C8FF16]" />
              <span className="text-sm font-black tracking-wider text-white">
                GATE ZERO // THE ACCESS ENGINE
              </span>
            </div>
            <p className="text-xs text-white/60 max-w-md leading-relaxed font-sans">
              India’s cultural access platform for underground electronic music, warehouse gatherings, experimental sound, and independent culture.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-white/50 pt-2">
              <span className="flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-[#C8FF16]" /> TIME: {currentTime || '21:00:00 IST'}
              </span>
              <span>•</span>
              <span>LAT 18.9744° N / LNG 72.8488° E</span>
              <span>•</span>
              <span className="text-[#C8FF16]">SYS_STATUS: ALL GATES OPEN</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="text-xs uppercase tracking-widest text-white/80 font-bold mb-2">
              JOIN THE PRIVATE DISPATCH
            </div>
            <p className="text-xs text-white/60 mb-4 font-sans">
              Receive unreleased ticket links, secret warehouse coordinates, and early-access phase notifications.
            </p>
            <form onSubmit={handleNewsletter} className="flex gap-2 max-w-md">
              <input
                type="email"
                placeholder="YOUR.EMAIL@DOMAIN.COM"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-[#121410] border border-white/20 px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8FF16]"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#C8FF16] hover:bg-[#b8ea14] text-black font-black uppercase text-xs flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <span>CONNECT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Middle Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12 border-b border-white/10 text-xs">
          
          {/* CITIES */}
          <div className="space-y-3">
            <div className="text-white font-bold uppercase tracking-widest text-[11px] text-[#C8FF16]">
              // CITIES
            </div>
            <ul className="space-y-1.5 text-white/60">
              {CITIES.filter(c => c.id !== 'all').map(c => (
                <li key={c.id}>
                  <Link 
                    href={`/events?city=${encodeURIComponent(c.name)}`}
                    className="hover:text-white hover:underline transition-colors flex items-center justify-between"
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] text-white/40">[{c.count}]</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CATEGORIES */}
          <div className="space-y-3">
            <div className="text-white font-bold uppercase tracking-widest text-[11px] text-[#C8FF16]">
              // CATEGORIES
            </div>
            <ul className="space-y-1.5 text-white/60">
              {CATEGORIES.slice(1, 8).map(cat => (
                <li key={cat.id}>
                  <Link 
                    href={`/events?category=${cat.slug}`}
                    className="hover:text-white hover:underline transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* FOR ORGANIZERS */}
          <div className="space-y-3">
            <div className="text-white font-bold uppercase tracking-widest text-[11px] text-[#C8FF16]">
              // ORGANIZERS
            </div>
            <ul className="space-y-1.5 text-white/60">
              <li>
                <Link href="/organizer/events/new" className="hover:text-white hover:underline">
                  List Your Event
                </Link>
              </li>
              <li>
                <Link href="/organizer/dashboard" className="hover:text-white hover:underline">
                  Organizer Control Panel
                </Link>
              </li>
              <li>
                <Link href="/organizer/onboarding" className="hover:text-white hover:underline">
                  KYC & Verification
                </Link>
              </li>
              <li>
                <Link href="/promoter" className="hover:text-white hover:underline">
                  Affiliate & Promoters
                </Link>
              </li>
              <li>
                <Link href="/checkin" className="hover:text-white hover:underline">
                  Door Scanner Terminal
                </Link>
              </li>
            </ul>
          </div>

          {/* PLATFORM & HUBS */}
          <div className="space-y-3">
            <div className="text-white font-bold uppercase tracking-widest text-[11px] text-[#C8FF16]">
              // ACCESS HUBS
            </div>
            <ul className="space-y-1.5 text-white/60">
              <li>
                <Link href="/tickets" className="hover:text-white hover:underline">
                  Digital Pass Wallet
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white hover:underline">
                  Admin Command Centre
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white hover:underline">
                  Terms of Access
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white hover:underline">
                  Refund Matrix
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white hover:underline">
                  Privacy & Cryptography
                </Link>
              </li>
            </ul>
          </div>

          {/* TRUST & COMPLIANCE */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-3 bg-[#0d0f0c] p-4 border border-white/10">
            <div className="text-white font-bold uppercase tracking-widest text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C8FF16]" />
              TRUST & SAFETY
            </div>
            <p className="text-[11px] text-white/60 leading-relaxed font-sans">
              100% verified organizers. Encrypted dynamic QR codes prevent scalping and duplication. Instant INR UPI & Razorpay settlements.
            </p>
            <div className="text-[10px] text-[#C8FF16] font-bold">
              INR • UPI • RAZORPAY • STRIPE
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
          <div>
            © 2026 GATE ZERO CULTURAL ACCESS SYSTEMS (INDIA). ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/60">GATEZERO.IN</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">API v2.6.0</span>
            <span>•</span>
            <span className="text-[#C8FF16]">PULSE: NORMAL</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
