'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleBanner } from '@/components/layout/RoleBanner';
import { LoginModal } from '@/components/auth/LoginModal';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
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
  return <OnboardingContent />;
}

function OnboardingContent() {
  const router = useRouter();
  const toast = useToast();
  const { user, updateProfile, openLoginModal } = useAuth();

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
      if (!user) {
        openLoginModal();
        setIsSubmitting(false);
        return;
      }
      const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const res = await fetch('/api/organizers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
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
        if (data.organizer?.id) {
          await updateProfile({ role: 'organizer', organizerCompanyId: data.organizer.id });
        }
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
    <div className="min-h-screen bg-[#050505] text-[#F1F1EB] flex flex-col font-mono selection:bg-[#C8FF16] selection:text-black">
      <RoleBanner />
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* Header */}
        <div className="pb-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#C8FF16] font-bold">
              ORGANIZER ONBOARDING // KYC VERIFICATION
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
              HOST VERIFICATION
            </h1>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-white/50">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`w-7 h-7 flex items-center justify-center border font-bold ${
                  step === s
                    ? 'border-[#C8FF16] bg-[#C8FF16] text-black'
                    : step > s
                    ? 'border-white bg-white/20 text-white'
                    : 'border-white/20 text-white/40'
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
              <label className="block text-[11px] uppercase font-bold text-white/70 mb-2">
                ORGANIZER ENTITY TYPE *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEntityType('company')}
                  className={`p-4 border text-left uppercase text-xs font-bold transition-all ${
                    entityType === 'company'
                      ? 'border-[#C8FF16] bg-[#141810] text-[#C8FF16]'
                      : 'border-white/10 bg-black text-white/70 hover:border-white/30'
                  }`}
                >
                  <Building2 className="w-5 h-5 mb-2" />
                  <div>REGISTERED COMPANY / LLP</div>
                  <div className="text-[10px] text-white/40 font-sans mt-0.5">GST Registered Entity</div>
                </button>

                <button
                  type="button"
                  onClick={() => setEntityType('individual')}
                  className={`p-4 border text-left uppercase text-xs font-bold transition-all ${
                    entityType === 'individual'
                      ? 'border-[#C8FF16] bg-[#141810] text-[#C8FF16]'
                      : 'border-white/10 bg-black text-white/70 hover:border-white/30'
                  }`}
                >
                  <FileText className="w-5 h-5 mb-2" />
                  <div>PROPRIETOR / CURATOR</div>
                  <div className="text-[10px] text-white/40 font-sans mt-0.5">PAN Verified Individual</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-white/70 mb-1">
                LEGAL ENTITY OR COLLECTIVE NAME *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="e.g. SubKulture Experiences LLP"
                className="w-full bg-[#0e100c] border border-white/20 p-3 text-sm text-white font-bold focus:border-[#C8FF16] focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-white/70 mb-1">
                  BUSINESS PAN NUMBER *
                </label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={e => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. AABCS1429M"
                  maxLength={10}
                  className="w-full bg-[#0e100c] border border-white/20 p-3 text-xs text-white uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-white/70 mb-1">
                  GSTIN (OPTIONAL FOR INDIVIDUALS)
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={e => setGstin(e.target.value.toUpperCase())}
                  placeholder="e.g. 27AABCS1429M1ZB"
                  maxLength={15}
                  className="w-full bg-[#0e100c] border border-white/20 p-3 text-xs text-white uppercase"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!companyName || !panNumber}
                className="px-6 py-3 bg-[#C8FF16] text-black font-black uppercase text-xs flex items-center gap-2 hover:bg-[#b8ea14] disabled:opacity-40"
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
              <label className="block text-[11px] uppercase font-bold text-white/70 mb-1">
                BANK ACCOUNT BENEFICIARY NAME *
              </label>
              <input
                type="text"
                value={accountName}
                onChange={e => setAccountName(e.target.value)}
                placeholder="Must match Legal PAN Entity Name"
                className="w-full bg-[#0e100c] border border-white/20 p-3 text-sm text-white font-bold"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-white/70 mb-1">
                  BANK NAME *
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  placeholder="e.g. HDFC Bank"
                  className="w-full bg-[#0e100c] border border-white/20 p-3 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-white/70 mb-1">
                  IFSC CODE *
                </label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={e => setIfscCode(e.target.value.toUpperCase())}
                  placeholder="e.g. HDFC0000128"
                  maxLength={11}
                  className="w-full bg-[#0e100c] border border-white/20 p-3 text-xs text-white uppercase"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-white/70 mb-1">
                BANK ACCOUNT NUMBER *
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                placeholder="e.g. 50200049281920"
                className="w-full bg-[#0e100c] border border-white/20 p-3 text-xs text-white font-mono"
                required
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-black border border-white/20 text-xs font-bold uppercase text-white"
              >
                ← BACK
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!accountNumber || !ifscCode}
                className="px-6 py-3 bg-[#C8FF16] text-black font-black uppercase text-xs flex items-center gap-2 hover:bg-[#b8ea14] disabled:opacity-40"
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
            <div className="p-6 bg-[#0e100c] border border-white/20 space-y-3 text-xs">
              <div className="text-white font-bold uppercase pb-2 border-b border-white/10">
                VERIFICATION MANIFEST
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-white/40 uppercase text-[10px]">HOST COLLECTIVE:</span>
                  <div className="text-white font-bold">{companyName}</div>
                </div>
                <div>
                  <span className="text-white/40 uppercase text-[10px]">PAN:</span>
                  <div className="text-white font-bold">{panNumber}</div>
                </div>
                <div>
                  <span className="text-white/40 uppercase text-[10px]">SETTLEMENT ROUTE:</span>
                  <div className="text-white font-bold">{bankName} ({ifscCode})</div>
                </div>
                <div>
                  <span className="text-white/40 uppercase text-[10px]">ACCOUNT:</span>
                  <div className="text-white font-bold">••••••{accountNumber.slice(-4) || '8192'}</div>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-[#C8FF16] mt-0.5" required />
              <span className="text-white/80 font-sans">
                I accept Gate Zero’s Organizer Partnership Agreement, certify that all listed events adhere to local sound and venue regulations, and acknowledge the 5% platform service fee.
              </span>
            </label>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-black border border-white/20 text-xs font-bold uppercase text-white"
              >
                ← BACK
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-[#C8FF16] text-black font-black uppercase text-sm flex items-center gap-2 hover:bg-[#b8ea14] shadow-xl disabled:opacity-40"
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
