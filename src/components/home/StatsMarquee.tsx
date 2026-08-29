'use client';

import React from 'react';
import { Marquee } from '@/components/motion/Marquee';

const STATS: { value: string; label: string; accent?: boolean }[] = [
  { value: '42+', label: 'CITIES ON RADAR' },
  { value: '128K', label: 'HEADS MOVED', accent: true },
  { value: '₹0', label: 'HIDDEN FEES' },
  { value: '60S', label: 'QR DELIVERY', accent: true },
  { value: '100%', label: 'VERIFIED HOSTS' },
  { value: '₹68L', label: 'GMV SETTLED', accent: true },
  { value: '4.9', label: 'ORGANIZER RATING' },
];

function StatItem({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-4 px-8 md:gap-6 md:px-12">
      <span
        className={`text-5xl font-bold uppercase leading-none tracking-tighter md:text-7xl ${
          accent ? 'text-accent' : 'text-foreground'
        }`}
      >
        {value}
      </span>
      <span className="max-w-[12ch] font-mono text-xs uppercase leading-tight tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="ml-8 text-4xl text-accent md:ml-12 md:text-6xl" aria-hidden="true">
        ✦
      </span>
    </div>
  );
}

/** High-energy stats ticker — full bleed, fast (speed 80), never stops. */
export function StatsMarquee() {
  return (
    <section
      aria-label="Platform statistics"
      className="overflow-hidden border-b-2 border-border bg-background py-10 md:py-14"
    >
      <Marquee speed={80}>
        {STATS.map(s => (
          <StatItem key={s.label} {...s} />
        ))}
      </Marquee>
    </section>
  );
}
