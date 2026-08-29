'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleBanner } from '@/components/layout/RoleBanner';
import { LoginModal } from '@/components/auth/LoginModal';


export default function PrivacyPage() {
  return (
        <div className="min-h-screen bg-[#050505] text-[#F1F1EB] flex flex-col font-mono selection:bg-[#C8FF16] selection:text-black">
          <RoleBanner />
          <Navbar />

          <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
            <div className="pb-6 border-b border-white/10">
              <div className="text-[10px] uppercase tracking-widest text-[#C8FF16] font-bold">
                DATA INTEGRITY // PRIVACY PROTOCOL
              </div>
              <h1 className="text-3xl sm:text-5xl font-black uppercase text-white mt-1">
                PRIVACY POLICY
              </h1>
              <p className="text-xs text-white/50 font-sans mt-1">
                Encrypted User Storage • Digital Personal Data Protection Act 2023 Compliant
              </p>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-white/80 font-sans leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-base font-mono font-black uppercase text-white">1. COLLECTED TELEMETRY</h2>
                <p>
                  We collect your verified mobile number, name, email address, and transaction metadata strictly to issue cryptographic access passes and dispatch emergency venue communications.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-mono font-black uppercase text-white">2. PAYMENT DATA SECURITY</h2>
                <p>
                  Gate Zero never stores raw debit/credit card numbers or UPI PINs. All payment transactions are handled through certified PCI-DSS Level 1 payment processors (Razorpay and Stripe).
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-mono font-black uppercase text-white">3. NO THIRD-PARTY DATA BROKERAGE</h2>
                <p>
                  We do not sell, rent, or monetize attendee data to advertising networks. Your contact information is accessible only to the specific organizer whose experience you purchase passes for.
                </p>
              </section>
            </div>
          </main>

          <Footer />
          <LoginModal />
        </div>
  );
}
