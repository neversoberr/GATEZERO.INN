'use client';

import React from 'react';
import { ShieldCheck, QrCode, CreditCard, RotateCcw } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';

const pillars = [
  {
    icon: QrCode,
    num: '01',
    title: 'INSTANT DIGITAL PASSES',
    desc: 'High-contrast dynamic QR passes generated on order completion. Fast door entry with offline cryptographic verification.',
  },
  {
    icon: ShieldCheck,
    num: '02',
    title: 'VERIFIED CULTURAL HOSTS',
    desc: 'All organizers undergo strict PAN, GSTIN, and venue permit KYC validation before listing events on the Gate Zero network.',
  },
  {
    icon: CreditCard,
    num: '03',
    title: 'INR SETTLEMENTS & UPI',
    desc: 'Supports UPI, Net Banking, Indian Cards, Apple Pay, and international Stripe routing with 0 hidden markups.',
  },
  {
    icon: RotateCcw,
    num: '04',
    title: 'TRANSPARENT REFUNDS',
    desc: 'Straightforward refund matrices and 1-click ticket transfer inside your pass wallet. No unauthorized secondary scalping.',
  },
];

/**
 * Sticky scroll stack: each card pins at top and the next slides over
 * it — physical overlap instead of animation. Falls back to a plain
 * stack on small screens.
 */
export function TrustSection() {
  return (
    <section aria-labelledby="trust-heading" className="bg-background py-24 md:py-32">
      <div className="mx-auto w-full max-w-[95vw] px-4 md:px-8">
        <SectionHeading
          id="trust-heading"
          kicker="INFRASTRUCTURE PROTOCOL"
          title="BUILT FOR"
          accentTitle="THE SCENE"
        />

        <div className="mt-12 flex flex-col gap-8 md:gap-0">
          {pillars.map(p => {
            const Icon = p.icon;
            return (
              <div key={p.num} className="md:flex md:min-h-[70vh] md:items-start">
                <article className="group sticky top-24 w-full border-2 border-border bg-background p-8 transition-colors duration-300 hover:border-accent hover:bg-accent md:top-32 md:p-12">
                  {/* Massive decorative numeral — text as graphic shape */}
                  <div
                    className="pointer-events-none select-none text-[6rem] font-bold leading-[0.8] tracking-tighter text-muted transition-colors group-hover:text-black/20 md:text-[8rem]"
                    aria-hidden="true"
                  >
                    {p.num}
                  </div>

                  <div className="mt-8 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center border-2 border-border bg-card text-accent transition-colors group-hover:border-black/30 group-hover:bg-black group-hover:text-accent">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-bold uppercase leading-[0.9] tracking-tighter text-foreground transition-colors group-hover:text-black md:text-3xl lg:text-4xl">
                      {p.title}
                    </h3>
                  </div>

                  <p className="mt-6 max-w-2xl text-lg leading-tight tracking-tight text-muted-foreground transition-colors group-hover:text-black/80 md:text-xl">
                    {p.desc}
                  </p>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
