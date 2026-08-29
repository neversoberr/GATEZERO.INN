'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleBanner } from '@/components/layout/RoleBanner';
import { LoginModal } from '@/components/auth/LoginModal';
import { ToastProvider, useToast } from '@/context/ToastContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { 
  Building2, 
  ShieldCheck, 
  FileText, 
  CreditCard, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Upload 
} from 'lucide-react';

export default function OrganizerOnboardingPage() {
  return (
    <ToastProvider>
      <AuthProvider>
        <OnboardingContent />
      </AuthProvider>
    </ToastProvider>
  );
}

function OnboardingContent() {
  const router = useRouter();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [entityType, setEntityType] = useState<'company' | 'individual'>('company');
  const [companyName, setCompanyName] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [panNumber, setPanNumber] = useState('');
  const [gstin, setGstin] = useState('');
  
  // Bank details
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const res = await fetch('/api/organizers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: companyName,
          slug,
          tagline: `Cultural Collective from ${city}`,
          description: `${companyName} is an official Gate Zero verified host collective based in ${city}.`,
          logoUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=300&auto=format&fit=crop',
          coverUrl: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?q=80&w=1200&auto=format&fit=crop',
          city,
          country: 'India',
          email: 'contact@' + slug + '.in',
          phone: '+91 98000 11223',
          categories: ['underground', 'music', 'nightlife'],
          panNumber,
          gstin,
          bankDetails: {
            accountName: accountName || companyName,
            accountNumber,
            ifscCode,
            bankName
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success('KYC PROTOCOL SUBMITTED', `${companyName} application registered.`);
        router.push('/organizer/dashboard');
      }
    } catch (e: any) {
      toast.error('SUBMISSION FAILED', e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-mono selection:bg-accent selection:text-black">
      <RoleBanner />
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* Header */}
        <div className="pb-6 border-b border-border/50 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-accent font-bold">
              ORGANIZER ONBOARDING // KYC VERIFICATION
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground mt-1">
              HOST VERIFICATION
            </h1>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`w-7 h-7 flex items-center justify-center border font-bold ${
                  step === s
                    ? 'border-accent bg-accent text-black'
                    : step > s
                    ? 'border-foreground bg-foreground/20 text-foreground'
                    : 'border-border text-muted-foreground'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: ENTITY & BUSINESS */}
        {step === 1 && (
          <div className="py-8 space-y-6">
            <div>
              <label className="block text-[11px] uppercase font-bold text-foreground/70 mb-2">
                ORGANIZER ENTITY TYPE *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEntityType('company')}
                  className={`p-4 border text-left uppercase text-xs font-bold transition-all ${
                    entityType === 'company'
                      ? 'border-accent bg-card text-accent'
                      : 'border-border/50 bg-black text-foreground/70 hover:border-border'
                  }`}
                >
                  <Building2 className="w-5 h-5 mb-2" />
                  <div>REGISTERED COMPANY / LLP</div>
                  <div className="text-[10px] text-muted-foreground font-sans mt-0.5">GST Registered Entity</div>
                </button>

                <button
                  type="button"
                  onClick={() => setEntityType('individual')}
                  className={`p-4 border text-left uppercase text-xs font-bold transition-all ${
                    entityType === 'individual'
                      ? 'border-accent bg-card text-accent'
                      : 'border-border/50 bg-black text-foreground/70 hover:border-border'
                  }`}
                >
                  <FileText className="w-5 h-5 mb-2" />
                  <div>PROPRIETOR / CURATOR</div>
                  <div className="text-[10px] text-muted-foreground font-sans mt-0.5">PAN Verified Individual</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-foreground/70 mb-1">
                LEGAL ENTITY OR COLLECTIVE NAME *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="e.g. SubKulture Experiences LLP"
                className="w-full bg-card border border-border p-3 text-sm text-foreground font-bold focus:border-accent focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-foreground/70 mb-1">
                  BUSINESS PAN NUMBER *
                </label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={e => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. AABCS1429M"
                  maxLength={10}
                  className="w-full bg-card border border-border p-3 text-xs text-foreground uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-foreground/70 mb-1">
                  GSTIN (OPTIONAL FOR INDIVIDUALS)
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={e => setGstin(e.target.value.toUpperCase())}
                  placeholder="e.g. 27AABCS1429M1ZB"
                  maxLength={15}
                  className="w-full bg-card border border-border p-3 text-xs text-foreground uppercase"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!companyName || !panNumber}
                className="px-6 py-3 bg-accent text-black font-black uppercase text-xs flex items-center gap-2 hover:bg-accent-hover disabled:opacity-40"
              >
                <span>NEXT: BANK SETTLEMENT INFO</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: BANKING DETAILS */}
        {step === 2 && (
          <div className="py-8 space-y-6">
            <div>
              <label className="block text-[11px] uppercase font-bold text-foreground/70 mb-1">
                BANK ACCOUNT BENEFICIARY NAME *
              </label>
              <input
                type="text"
                value={accountName}
                onChange={e => setAccountName(e.target.value)}
                placeholder="Must match Legal PAN Entity Name"
                className="w-full bg-card border border-border p-3 text-sm text-foreground font-bold"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-foreground/70 mb-1">
                  BANK NAME *
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  placeholder="e.g. HDFC Bank"
                  className="w-full bg-card border border-border p-3 text-xs text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-foreground/70 mb-1">
                  IFSC CODE *
                </label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={e => setIfscCode(e.target.value.toUpperCase())}
                  placeholder="e.g. HDFC0000128"
                  maxLength={11}
                  className="w-full bg-card border border-border p-3 text-xs text-foreground uppercase"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-foreground/70 mb-1">
                BANK ACCOUNT NUMBER *
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                placeholder="e.g. 50200049281920"
                className="w-full bg-card border border-border p-3 text-xs text-foreground font-mono"
                required
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-black border border-border text-xs font-bold uppercase text-foreground"
              >
                ← BACK
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!accountNumber || !ifscCode}
                className="px-6 py-3 bg-accent text-black font-black uppercase text-xs flex items-center gap-2 hover:bg-accent-hover disabled:opacity-40"
              >
                <span>NEXT: REVIEW & SUBMIT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW & AGREEMENT */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="py-8 space-y-6">
            <div className="p-6 bg-card border border-border space-y-3 text-xs">
              <div className="text-foreground font-bold uppercase pb-2 border-b border-border/50">
                VERIFICATION MANIFEST
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-muted-foreground uppercase text-[10px]">HOST COLLECTIVE:</span>
                  <div className="text-foreground font-bold">{companyName}</div>
                </div>
                <div>
                  <span className="text-muted-foreground uppercase text-[10px]">PAN:</span>
                  <div className="text-foreground font-bold">{panNumber}</div>
                </div>
                <div>
                  <span className="text-muted-foreground uppercase text-[10px]">SETTLEMENT ROUTE:</span>
                  <div className="text-foreground font-bold">{bankName} ({ifscCode})</div>
                </div>
                <div>
                  <span className="text-muted-foreground uppercase text-[10px]">ACCOUNT:</span>
                  <div className="text-foreground font-bold">••••••{accountNumber.slice(-4) || '8192'}</div>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-accent mt-0.5" required />
              <span className="text-foreground/80 font-sans">
                I accept Gate Zero’s Organizer Partnership Agreement, certify that all listed events adhere to local sound and venue regulations, and acknowledge the 5% platform service fee.
              </span>
            </label>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-black border border-border text-xs font-bold uppercase text-foreground"
              >
                ← BACK
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-accent text-black font-black uppercase text-sm flex items-center gap-2 hover:bg-accent-hover disabled:opacity-40"
              >
                <span>{isSubmitting ? 'PROCESSING APPLICATION...' : 'SUBMIT KYC & LAUNCH CONTROL ↗'}</span>
              </button>
            </div>
          </form>
        )}

      </main>

      <Footer />
      <LoginModal />
    </div>
  );
}
