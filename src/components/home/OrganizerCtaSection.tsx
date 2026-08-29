'use client';

import React from 'react';
import Link from 'next/link';
import { BarChart3, ScanLine, Building2 } from 'lucide-react';

const capabilities = [
  { icon: BarChart3, label: 'LIVE SALES ANALYTICS' },
  { icon: ScanLine, label: 'OFFLINE DOOR SCANNER' },
  { icon: Building2, label: 'DIRECT BANK PAYOUTS' },
];

export function OrganizerCtaSection() {
  return (
    <section
      aria-labelledby="organizer-cta-heading"
      className="relative overflow-hidden border-t-2 border-border bg-card py-24 md:py-32"
    >
      {/* Massive background numeral — depth via muted color */}
      <div
        className="absolute -left-6 bottom-0 select-none text-[26vw] font-bold leading-[0.8] tracking-tighter text-muted max-md:hidden"
        aria-hidden="true"
      >
        GZ
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[95vw] px-4 md:px-8">
        <div className="mb-8 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
          <span className="inline-block h-2 w-2 bg-accent" aria-hidden="true" />
          ORGANIZER GROWTH PLATFORM
        </div>

        <h2
          id="organizer-cta-heading"
          className="max-w-5xl text-[clamp(2.75rem,9vw,8rem)] font-bold uppercase leading-[0.85] tracking-tighter text-foreground"
        >
          HOST YOUR NEXT <span className="text-accent">EXPERIENCE</span> ON GATE ZERO.
        </h2>

        <p className="mt-8 max-w-2xl text-lg leading-tight tracking-tight text-muted-foreground md:text-xl lg:text-2xl">
          Launch multi-phase ticket tiers, track promoter commissions in
          real-time, execute fast door scanning with our bouncer terminal,
          and receive direct INR payouts with full GST invoices.
        </p>

        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
          {capabilities.map(c => (
            <li
              key={c.label}
              className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >
              <c.icon className="h-4 w-4 text-accent" aria-hidden="true" />
              {c.label}
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col flex-wrap gap-4 sm:flex-row">
          <Link
            href="/organizer/events/new"
            className="flex h-20 items-center justify-center gap-2 bg-accent px-12 text-base font-bold uppercase tracking-tighter text-accent-foreground transition-all hover:scale-105 hover:bg-accent-hover active:scale-95 md:text-lg"
          >
            <span>CREATE AN EVENT ↗</span>
          </Link>

          <Link
            href="/organizer/onboarding"
            className="flex h-20 items-center justify-center border-2 border-border px-12 text-sm font-bold uppercase tracking-tighter text-foreground transition-colors hover:bg-foreground hover:text-accent-foreground md:text-base"
          >
            APPLY FOR ORGANIZER BADGE
          </Link>
        </div>
      </div>
    </section>
  );
}
