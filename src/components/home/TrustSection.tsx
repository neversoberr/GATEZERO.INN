'use client';

import React from 'react';
import { ShieldCheck, QrCode, CreditCard, RotateCcw } from 'lucide-react';

export function TrustSection() {
  const pillars = [
    {
      icon: QrCode,
      title: 'INSTANT DIGITAL PASSES',
      desc: 'High-contrast dynamic QR passes generated on order completion. Fast door entry with offline cryptographic verification.'
    },
    {
      icon: ShieldCheck,
      title: 'VERIFIED CULTURAL HOSTS',
      desc: 'All organizers undergo strict PAN, GSTIN, and venue permit KYC validation before listing events on the Gate Zero network.'
    },
    {
      icon: CreditCard,
      title: 'INR SETTLEMENTS & UPI',
      desc: 'Supports UPI, Net Banking, Indian Cards, Apple Pay, and international Stripe routing with 0 hidden markups.'
    },
    {
      icon: RotateCcw,
      title: 'TRANSPARENT REFUNDS',
      desc: 'Straightforward refund matrices and 1-click ticket transfer inside your pass wallet. No unauthorized secondary scalping.'
    }
  ];

  return (
    <section className="py-16 bg-[#050505] text-[#F1F1EB] font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="pb-8 border-b border-white/10">
          <div className="text-[10px] uppercase tracking-widest text-[#C8FF16] font-bold">
            INFRASTRUCTURE PROTOCOL
          </div>
          <h2 className="text-3xl font-black uppercase text-white mt-1">
            BUILT FOR THE SCENE
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-[#0e100c] border border-white/10 hover:border-white/30 transition-colors space-y-3"
              >
                <div className="p-3 bg-black border border-white/10 text-[#C8FF16] w-fit">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black uppercase text-white tracking-tight">
                  {p.title}
                </h3>
                <p className="text-xs text-white/60 font-sans leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
