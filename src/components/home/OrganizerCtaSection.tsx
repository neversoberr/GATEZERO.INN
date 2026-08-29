'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Building2, BarChart3, ScanLine } from 'lucide-react';

export function OrganizerCtaSection() {
  return (
    <section className="py-20 bg-[#080907] border-t border-white/10 text-[#F1F1EB] font-mono relative overflow-hidden">
      
      {/* Background accents */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-[#C8FF16]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-8 sm:p-12 bg-[#0e100c] border-2 border-[#C8FF16]/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black border border-[#C8FF16]/40 text-xs text-[#C8FF16] uppercase font-bold">
              <Zap className="w-3.5 h-3.5 fill-[#C8FF16]" />
              ORGANIZER GROWTH PLATFORM
            </div>

            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              HOST YOUR NEXT <br />
              EXPERIENCE ON GATE ZERO.
            </h2>

            <p className="text-sm text-white/70 font-sans max-w-xl leading-relaxed">
              Launch multi-phase ticket tiers, track promoter commissions in real-time, execute fast door scanning with our bouncer terminal, and receive direct INR payouts with full GST invoices.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-white/80">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#C8FF16]" />
                <span>Live Sales Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <ScanLine className="w-4 h-4 text-[#C8FF16]" />
                <span>Offline Door Scanner</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <Building2 className="w-4 h-4 text-[#C8FF16]" />
                <span>Direct Bank Payouts</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <Link
              href="/organizer/events/new"
              className="py-4 px-6 bg-[#C8FF16] hover:bg-[#b8ea14] text-black text-center font-black uppercase text-sm flex items-center justify-center gap-2 shadow-xl transition-transform active:scale-95"
            >
              <span>CREATE AN EVENT ↗</span>
            </Link>

            <Link
              href="/organizer/onboarding"
              className="py-3 px-6 bg-black hover:bg-white hover:text-black border border-white/20 text-white text-center font-bold uppercase text-xs transition-colors"
            >
              APPLY FOR ORGANIZER BADGE
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
