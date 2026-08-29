'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleBanner } from '@/components/layout/RoleBanner';
import { LoginModal } from '@/components/auth/LoginModal';


export default function TermsPage() {
  return (
        <div className="min-h-screen bg-[#050505] text-[#F1F1EB] flex flex-col font-mono selection:bg-[#C8FF16] selection:text-black">
          <RoleBanner />
          <Navbar />

          <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
            <div className="pb-6 border-b border-white/10">
              <div className="text-[10px] uppercase tracking-widest text-[#C8FF16] font-bold">
                LEGAL PROTOCOL // TERMS OF ACCESS
              </div>
              <h1 className="text-3xl sm:text-5xl font-black uppercase text-white mt-1">
                TERMS & CONDITIONS
              </h1>
              <p className="text-xs text-white/50 font-sans mt-1">
                Effective Date: August 29, 2026 • Gate Zero Technologies India Pvt. Ltd.
              </p>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-white/80 font-sans leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-base font-mono font-black uppercase text-white">1. THE ACCESS ENGINE</h2>
                <p>
                  GATE ZERO is a cultural access platform connecting verified organizers, underground event producers, and attendees across India. All passes minted on this network contain encrypted dynamic QR codes cryptographically signed to prevent duplicate entry or unauthorized third-party scalping.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-mono font-black uppercase text-white">2. ADMISSION & IDENTIFICATION</h2>
                <p>
                  Every attendee must present an original government-issued photo identification (Aadhaar Card, Passport, or Driving License) matching the name on their digital pass. Organizers reserve full rights of admission in accordance with venue age policies (18+ or 21+).
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-mono font-black uppercase text-white">3. TICKET TRANSFERS & SAFETY</h2>
                <p>
                  Passes can only be transferred using the official 1-click Transfer Protocol inside the Gate Zero wallet. Secondary black-market trading, forged physical passes, or screenshot duplication will result in immediate revocation of gate access without refund.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-mono font-black uppercase text-white">4. NO-HARASSMENT & SAFE SPACE CODE</h2>
                <p>
                  Gate Zero enforces a zero-tolerance policy towards harassment, discrimination, non-consensual photography, or violence at all affiliated venues. Breaches will result in permanent ejection and blacklisting across all future events.
                </p>
              </section>
            </div>
          </main>

          <Footer />
          <LoginModal />
        </div>
  );
}
