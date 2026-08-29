'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, ShieldCheck, ArrowRight, Smartphone, Mail, KeyRound, UserCheck } from 'lucide-react';
import { UserRole } from '@/types';

export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, switchRole, loginWithCredentials } = useAuth();
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [inputValue, setInputValue] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
    }, 600);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;
    setIsLoading(true);
    await loginWithCredentials(inputValue, otpCode);
    setIsLoading(false);
    setOtpSent(false);
    setInputValue('');
    setOtpCode('');
  };

  const handleQuickRole = (role: UserRole) => {
    switchRole(role);
    closeLoginModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-card border-2 border-border p-6 sm:p-8 text-foreground"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)' }}
      >
        {/* Top brutalist bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-accent animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              GATE ZERO // ACCESS TERMINAL
            </span>
          </div>
          <button 
            onClick={closeLoginModal}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
            ENTER THE GATE
          </h2>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            VERIFIED INDIAN MOBILE OR EMAIL CREDENTIALS
          </p>
        </div>

        {/* Quick Demo Switcher Tabs */}
        <div className="mb-6 p-3 bg-background/80 border-2 border-border">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-accent" />
            ONE-CLICK ROLE DEMO LOGIN:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs font-mono">
            <button
              onClick={() => handleQuickRole('customer')}
              className="px-2 py-1.5 bg-card hover:bg-accent hover:text-black border-2 border-border text-left transition-colors truncate"
            >
              • Attendee
            </button>
            <button
              onClick={() => handleQuickRole('organizer')}
              className="px-2 py-1.5 bg-card hover:bg-accent hover:text-black border-2 border-border text-left transition-colors truncate"
            >
              • Organizer
            </button>
            <button
              onClick={() => handleQuickRole('promoter')}
              className="px-2 py-1.5 bg-card hover:bg-accent hover:text-black border-2 border-border text-left transition-colors truncate"
            >
              • Promoter
            </button>
            <button
              onClick={() => handleQuickRole('door_staff')}
              className="px-2 py-1.5 bg-card hover:bg-accent hover:text-black border-2 border-border text-left transition-colors truncate"
            >
              • Door Staff
            </button>
            <button
              onClick={() => handleQuickRole('super_admin')}
              className="px-2 py-1.5 bg-card hover:bg-accent hover:text-black border-2 border-border text-left transition-colors truncate col-span-2 sm:col-span-1"
            >
              • Super Admin
            </button>
          </div>
        </div>

        {/* Auth form */}
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="flex border-2 border-border bg-muted/50 p-1">
              <button
                type="button"
                onClick={() => { setAuthMethod('phone'); setInputValue(''); }}
                className={`flex-1 py-1.5 text-xs font-mono uppercase flex items-center justify-center gap-1.5 transition-colors ${
                  authMethod === 'phone' ? 'bg-accent text-black font-bold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile OTP
              </button>
              <button
                type="button"
                onClick={() => { setAuthMethod('email'); setInputValue(''); }}
                className={`flex-1 py-1.5 text-xs font-mono uppercase flex items-center justify-center gap-1.5 transition-colors ${
                  authMethod === 'email' ? 'bg-accent text-black font-bold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Mail className="w-3.5 h-3.5" /> Email
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-foreground/70 mb-1.5">
                {authMethod === 'phone' ? 'INDIAN MOBILE (+91)' : 'ACCOUNT EMAIL'}
              </label>
              <div className="relative">
                {authMethod === 'phone' && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-accent">
                    +91
                  </span>
                )}
                <input
                  type={authMethod === 'phone' ? 'tel' : 'email'}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder={authMethod === 'phone' ? '98201 44520' : 'alex@gatezero.in'}
                  className={`w-full bg-background/80 border-2 border-border px-3 py-2.5 text-foreground font-mono text-sm focus:border-accent focus:outline-none transition-colors ${
                    authMethod === 'phone' ? 'pl-12' : ''
                  }`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputValue}
              className="w-full py-3 bg-accent hover:bg-accent-hover text-black font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? 'DISPATCHING ACCESS OTP...' : 'REQUEST ACCESS PASS ↗'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-foreground/70">
                  ENTER 6-DIGIT OTP CODE
                </label>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-[10px] font-mono text-accent hover:underline"
                >
                  CHANGE NUMBER
                </button>
              </div>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={e => setOtpCode(e.target.value)}
                placeholder="6 0 2 9 1 8"
                className="w-full bg-background/80 border-2 border-accent px-3 py-3 text-center text-xl font-mono tracking-widest text-accent focus:outline-none"
                autoFocus
                required
              />
              <p className="text-[11px] font-mono text-muted-foreground mt-1.5 text-center">
                Demo code: Enter any 6 digits (e.g. 123456)
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || otpCode.length < 4}
              className="w-full py-3 bg-accent hover:bg-accent-hover text-black font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.99] disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              {isLoading ? 'AUTHENTICATING HASH...' : 'VERIFY & ENTER GATE'}
            </button>
          </form>
        )}

        {/* Security badge */}
        <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" /> 256-BIT ENCRYPTED
          </span>
          <span>GATE ZERO v2.6.0</span>
        </div>
      </div>
    </div>
  );
}
