'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, ShieldCheck, Smartphone, Mail, KeyRound, UserCheck, UserPlus } from 'lucide-react';
import { UserRole } from '@/types';

export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, switchRole, loginWithCredentials, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('email');
  const [inputValue, setInputValue] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupCity, setSignupCity] = useState('Mumbai');

  if (!isLoginModalOpen) return null;

  const reset = () => {
    setOtpSent(false);
    setInputValue('');
    setOtpCode('');
    setFullName('');
    setSignupEmail('');
    setSignupPhone('');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
    }, 500);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;
    setIsLoading(true);
    await loginWithCredentials(inputValue, otpCode);
    setIsLoading(false);
    reset();
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signup({
      name: fullName,
      email: signupEmail,
      phone: signupPhone ? `+91 ${signupPhone}` : '+91 98000 00000',
      city: signupCity
    });
    setIsLoading(false);
    reset();
  };

  const handleQuickRole = (role: UserRole) => {
    switchRole(role);
    closeLoginModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className="relative w-full max-w-md bg-[#0e0f0c] border border-[#C8FF16]/40 p-6 sm:p-8 shadow-2xl text-[#F1F1EB]"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)' }}
      >
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#C8FF16] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#C8FF16]">
              GATE ZERO // ACCESS TERMINAL
            </span>
          </div>
          <button
            onClick={() => {
              closeLoginModal();
              reset();
            }}
            className="text-white/50 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-5">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            {mode === 'signup' ? 'CREATE IDENTITY' : 'ENTER THE GATE'}
          </h2>
          <p className="text-xs text-white/60 font-mono mt-1">
            {mode === 'signup' ? 'NAME, EMAIL AND OTP-READY MOBILE' : 'VERIFIED INDIAN MOBILE OR EMAIL CREDENTIALS'}
          </p>
        </div>

        <div className="flex border border-white/10 bg-black/40 p-1 mb-5">
          <button
            type="button"
            onClick={() => { setMode('login'); reset(); }}
            className={`flex-1 py-1.5 text-xs font-mono uppercase flex items-center justify-center gap-1.5 ${
              mode === 'login' ? 'bg-[#C8FF16] text-black font-bold' : 'text-white/60 hover:text-white'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); reset(); }}
            className={`flex-1 py-1.5 text-xs font-mono uppercase flex items-center justify-center gap-1.5 ${
              mode === 'signup' ? 'bg-[#C8FF16] text-black font-bold' : 'text-white/60 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Sign up
          </button>
        </div>

        <div className="mb-6 p-3 bg-black/60 border border-white/10">
          <div className="text-[10px] font-mono uppercase tracking-widest text-white/50 mb-2 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-[#C8FF16]" />
            ONE-CLICK ROLE DEMO LOGIN:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs font-mono">
            <button onClick={() => handleQuickRole('customer')} className="px-2 py-1.5 bg-[#171914] hover:bg-[#C8FF16] hover:text-black border border-white/10 text-left">• Attendee</button>
            <button onClick={() => handleQuickRole('organizer')} className="px-2 py-1.5 bg-[#171914] hover:bg-[#C8FF16] hover:text-black border border-white/10 text-left">• Organizer</button>
            <button onClick={() => handleQuickRole('promoter')} className="px-2 py-1.5 bg-[#171914] hover:bg-[#C8FF16] hover:text-black border border-white/10 text-left">• Promoter</button>
            <button onClick={() => handleQuickRole('door_staff')} className="px-2 py-1.5 bg-[#171914] hover:bg-[#C8FF16] hover:text-black border border-white/10 text-left">• Door Staff</button>
            <button onClick={() => handleQuickRole('super_admin')} className="px-2 py-1.5 bg-[#171914] hover:bg-[#C8FF16] hover:text-black border border-white/10 text-left col-span-2 sm:col-span-1">• Super Admin</button>
          </div>
        </div>

        {mode === 'signup' ? (
          <form onSubmit={handleSignup} className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Alex Chen"
                className="w-full bg-black/60 border border-white/20 px-3 py-2.5 text-white font-mono text-sm focus:border-[#C8FF16] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">Email</label>
              <input
                type="email"
                value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
                placeholder="you@gatezero.in"
                className="w-full bg-black/60 border border-white/20 px-3 py-2.5 text-white font-mono text-sm focus:border-[#C8FF16] focus:outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">Mobile</label>
                <input
                  type="tel"
                  value={signupPhone}
                  onChange={e => setSignupPhone(e.target.value)}
                  placeholder="98201 44520"
                  className="w-full bg-black/60 border border-white/20 px-3 py-2.5 text-white font-mono text-sm focus:border-[#C8FF16] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">City</label>
                <select
                  value={signupCity}
                  onChange={e => setSignupCity(e.target.value)}
                  className="w-full bg-black/60 border border-white/20 px-3 py-2.5 text-white font-mono text-sm uppercase"
                >
                  <option>Mumbai</option>
                  <option>Bengaluru</option>
                  <option>Delhi</option>
                  <option>Goa</option>
                  <option>Pune</option>
                  <option>Hyderabad</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading || !fullName || !signupEmail}
              className="w-full py-3 bg-[#C8FF16] hover:bg-[#b8ea14] text-black font-black uppercase tracking-wider text-sm disabled:opacity-50"
            >
              {isLoading ? 'ENCRYPTING IDENTITY...' : 'CREATE ACCOUNT ↗'}
            </button>
          </form>
        ) : !otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="flex border border-white/10 bg-black/40 p-1">
              <button
                type="button"
                onClick={() => { setAuthMethod('phone'); setInputValue(''); }}
                className={`flex-1 py-1.5 text-xs font-mono uppercase flex items-center justify-center gap-1.5 ${
                  authMethod === 'phone' ? 'bg-[#C8FF16] text-black font-bold' : 'text-white/60 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile OTP
              </button>
              <button
                type="button"
                onClick={() => { setAuthMethod('email'); setInputValue(''); }}
                className={`flex-1 py-1.5 text-xs font-mono uppercase flex items-center justify-center gap-1.5 ${
                  authMethod === 'email' ? 'bg-[#C8FF16] text-black font-bold' : 'text-white/60 hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" /> Email
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                {authMethod === 'phone' ? 'INDIAN MOBILE (+91)' : 'ACCOUNT EMAIL'}
              </label>
              <div className="relative">
                {authMethod === 'phone' && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-[#C8FF16]">+91</span>
                )}
                <input
                  type={authMethod === 'phone' ? 'tel' : 'email'}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder={authMethod === 'phone' ? '98201 44520' : 'alex.chen@gatezero.in'}
                  className={`w-full bg-black/60 border border-white/20 px-3 py-2.5 text-white font-mono text-sm focus:border-[#C8FF16] focus:outline-none ${
                    authMethod === 'phone' ? 'pl-12' : ''
                  }`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputValue}
              className="w-full py-3 bg-[#C8FF16] hover:bg-[#b8ea14] text-black font-black uppercase tracking-wider text-sm disabled:opacity-50"
            >
              {isLoading ? 'DISPATCHING ACCESS OTP...' : 'REQUEST ACCESS PASS ↗'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  ENTER 6-DIGIT OTP CODE
                </label>
                <button type="button" onClick={() => setOtpSent(false)} className="text-[10px] font-mono text-[#C8FF16] hover:underline">
                  CHANGE
                </button>
              </div>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={e => setOtpCode(e.target.value)}
                placeholder="1 2 3 4 5 6"
                className="w-full bg-black/60 border border-[#C8FF16] px-3 py-3 text-center text-xl font-mono tracking-widest text-[#C8FF16] focus:outline-none"
                autoFocus
                required
              />
              <p className="text-[11px] font-mono text-white/40 mt-1.5 text-center">
                Demo code: enter any 4+ digits (e.g. 123456)
              </p>
            </div>
            <button
              type="submit"
              disabled={isLoading || otpCode.length < 4}
              className="w-full py-3 bg-[#C8FF16] hover:bg-[#b8ea14] text-black font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              {isLoading ? 'AUTHENTICATING HASH...' : 'VERIFY & ENTER GATE'}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/40">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C8FF16]" /> 256-BIT ENCRYPTED
          </span>
          <span>GATE ZERO v2.6.0</span>
        </div>
      </div>
    </div>
  );
}
