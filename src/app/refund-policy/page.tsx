'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleBanner } from '@/components/layout/RoleBanner';
import { LoginModal } from '@/components/auth/LoginModal';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';

export default function RefundPolicyPage() {
  return (
    <ToastProvider>
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col font-mono selection:bg-accent selection:text-black">
          <RoleBanner />
          <Navbar />

          <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
            <div className="pb-6 border-b border-border/50">
              <div className="text-[10px] uppercase tracking-widest text-accent font-bold">
                FINANCIAL MATRIX // REFUND POLICY
              </div>
              <h1 className="text-3xl sm:text-5xl font-black uppercase text-foreground mt-1">
                REFUND & CANCELLATION MATRIX
              </h1>
              <p className="text-xs text-muted-foreground font-sans mt-1">
                Transparent rules for attendee cancellations and organizer rescheduling.
              </p>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-foreground/80 font-sans leading-relaxed">
              <div className="p-6 bg-card border border-border space-y-3 font-mono text-xs">
                <div className="text-accent font-bold uppercase">STANDARD REFUND ELIGIBILITY WINDOWS:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-black border border-border/50">
                    <div className="text-foreground font-bold">72+ HOURS BEFORE</div>
                    <div className="text-accent mt-1">100% Refundable</div>
                  </div>
                  <div className="p-3 bg-black border border-border/50">
                    <div className="text-foreground font-bold">24-72 HOURS</div>
                    <div className="text-foreground/70 mt-1">Tier-Specific Terms</div>
                  </div>
                  <div className="p-3 bg-black border border-border/50">
                    <div className="text-foreground font-bold">&lt; 24 HOURS / SHOWTIME</div>
                    <div className="text-danger mt-1">Non-Refundable (Transferrable)</div>
                  </div>
                </div>
              </div>

              <section className="space-y-2">
                <h2 className="text-base font-mono font-black uppercase text-foreground">1. EVENT RESCHEDULING OR CANCELLATION</h2>
                <p>
                  If an organizer cancels an event or reschedules the date/city, all ticket holders are automatically offered a 100% full refund directly to their source UPI/Bank account within 5-7 business days.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-mono font-black uppercase text-foreground">2. HOW TO REQUEST A REFUND</h2>
                <p>
                  Navigate to your <strong className="text-foreground font-mono">My Passes</strong> wallet, locate your order, and click <strong className="text-accent font-mono">Refund</strong>. Our automated system checks organizer policy and submits the claim instantly.
                </p>
              </section>
            </div>
          </main>

          <Footer />
          <LoginModal />
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}
