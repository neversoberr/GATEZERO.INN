'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { ArrowRight, ShieldCheck, Terminal } from 'lucide-react';
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
          second: '2-digit',
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
    toast.success('ENCRYPTED DISPATCH SUBSCRIBED', `${email} added to the private drop radar.`);
    setEmail('');
  };

  const columnHeading = 'font-mono text-xs font-bold uppercase tracking-widest text-black';
  const columnLink =
    'text-sm text-black/70 transition-colors hover:text-black hover:underline';

  return (
    /* Acid flip — the full-bleed accent footer is a system signature */
    <footer className="relative mt-0 overflow-hidden bg-accent text-accent-foreground">
      <div className="mx-auto w-full max-w-[95vw] px-4 py-16 md:px-8 md:py-24">
        {/* Massive wordmark — the footer is a poster */}
        <div className="border-b-2 border-black/20 pb-8">
          <div
            className="select-none text-[clamp(4rem,15vw,13rem)] font-bold uppercase leading-[0.8] tracking-tighter text-black"
            aria-hidden="true"
          >
            GATEZERO
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest text-black/70">
            <span className="flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
              TIME: {currentTime || '21:00:00 IST'}
            </span>
            <span aria-hidden="true">•</span>
            <span>LAT 18.9744° N / LNG 72.8488° E</span>
            <span aria-hidden="true">•</span>
            <span className="font-bold text-black">SYS_STATUS: ALL GATES OPEN</span>
          </div>
        </div>

        {/* Newsletter */}
        <div className="grid grid-cols-1 gap-10 border-b-2 border-black/20 py-12 lg:grid-cols-2">
          <div className="max-w-xl">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-black">
              JOIN THE PRIVATE DISPATCH
            </div>
            <p className="mt-4 text-lg leading-tight tracking-tight text-black/80 md:text-xl">
              Receive unreleased ticket links, secret warehouse coordinates,
              and early-access phase notifications.
            </p>
          </div>

          <form onSubmit={handleNewsletter} className="flex flex-col justify-end gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label
                htmlFor="footer-email"
                className="mb-2 block font-mono text-xs uppercase tracking-widest text-black/70"
              >
                YOUR.EMAIL@DOMAIN.COM
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="YOUR.EMAIL@DOMAIN.COM"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border-b-2 border-black/40 bg-transparent px-0 py-3 text-lg font-semibold uppercase tracking-tight text-black placeholder:text-black/30 focus:border-black focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="flex h-[58px] shrink-0 items-center gap-2 bg-black px-8 text-sm font-bold uppercase tracking-tighter text-accent transition-all hover:scale-105 active:scale-95"
            >
              <span>Connect</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-10 border-b-2 border-black/20 py-12 md:grid-cols-4 lg:grid-cols-5">
          <div className="space-y-3">
            <div className={columnHeading}>{ '// CITIES' }</div>
            <ul className="space-y-2">
              {CITIES.filter(c => c.id !== 'all').map(c => (
                <li key={c.id}>
                  <Link
                    href={`/events?city=${encodeURIComponent(c.name)}`}
                    className={`flex items-center justify-between ${columnLink}`}
                  >
                    <span>{c.name}</span>
                    <span className="font-mono text-[10px] text-black/50">[{c.count}]</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <div className={columnHeading}>{ '// CATEGORIES' }</div>
            <ul className="space-y-2">
              {CATEGORIES.slice(1, 8).map(cat => (
                <li key={cat.id}>
                  <Link href={`/events?category=${cat.slug}`} className={columnLink}>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <div className={columnHeading}>{ '// ORGANIZERS' }</div>
            <ul className="space-y-2">
              <li><Link href="/organizer/events/new" className={columnLink}>List Your Event</Link></li>
              <li><Link href="/organizer/dashboard" className={columnLink}>Organizer Control Panel</Link></li>
              <li><Link href="/organizer/onboarding" className={columnLink}>KYC &amp; Verification</Link></li>
              <li><Link href="/promoter" className={columnLink}>Affiliate &amp; Promoters</Link></li>
              <li><Link href="/checkin" className={columnLink}>Door Scanner Terminal</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className={columnHeading}>{ '// ACCESS HUBS' }</div>
            <ul className="space-y-2">
              <li><Link href="/tickets" className={columnLink}>Digital Pass Wallet</Link></li>
              <li><Link href="/admin" className={columnLink}>Admin Command Centre</Link></li>
              <li><Link href="/terms" className={columnLink}>Terms of Access</Link></li>
              <li><Link href="/refund-policy" className={columnLink}>Refund Matrix</Link></li>
              <li><Link href="/privacy" className={columnLink}>Privacy &amp; Cryptography</Link></li>
            </ul>
          </div>

          <div className="col-span-2 space-y-3 border-2 border-black/40 p-6 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-widest text-black">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              TRUST &amp; SAFETY
            </div>
            <p className="text-sm leading-tight text-black/80">
              100% verified organizers. Encrypted dynamic QR codes prevent
              scalping and duplication. Instant INR UPI &amp; Razorpay settlements.
            </p>
            <div className="font-mono text-[10px] font-bold text-black">
              INR • UPI • RAZORPAY • STRIPE
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 font-mono text-[11px] uppercase tracking-wider text-black/60 sm:flex-row">
          <div>© 2026 GATE ZERO CULTURAL ACCESS SYSTEMS (INDIA). ALL RIGHTS RESERVED.</div>
          <div className="flex items-center gap-4">
            <span className="text-black/80">GATEZERO.IN</span>
            <span aria-hidden="true">•</span>
            <span className="cursor-pointer transition-colors hover:text-black">API v2.6.0</span>
            <span aria-hidden="true">•</span>
            <span className="font-bold text-black">PULSE: NORMAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
