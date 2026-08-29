'use client';

import React, { useState } from 'react';
import { Event, TicketTier } from '@/types';
import { 
  Plus, 
  Minus, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface TicketSelectorProps {
  event: Event;
  tiers: TicketTier[];
  onProceedToCheckout: (selectedQuantities: Record<string, number>, unlockedSecrets: string[]) => void;
}

export function TicketSelector({ event, tiers, onProceedToCheckout }: TicketSelectorProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [secretCodeInput, setSecretCodeInput] = useState('');
  const [unlockedTierIds, setUnlockedTierIds] = useState<string[]>([]);
  const toast = useToast();

  const handleQuantityChange = (tierId: string, delta: number, max: number) => {
    const current = quantities[tierId] || 0;
    const next = Math.max(0, Math.min(max, current + delta));
    setQuantities(prev => ({
      ...prev,
      [tierId]: next
    }));
  };

  const handleUnlockSecret = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretCodeInput) return;

    const code = secretCodeInput.trim().toUpperCase();
    const matchingTier = tiers.find(t => t.isSecret && t.accessCode?.toUpperCase() === code);

    if (matchingTier) {
      if (!unlockedTierIds.includes(matchingTier.id)) {
        setUnlockedTierIds(prev => [...prev, matchingTier.id]);
        toast.success('SECRET PASS UNLOCKED', `${matchingTier.name} is now accessible.`);
      } else {
        toast.info('ALREADY UNLOCKED', 'This tier is already in your selection grid.');
      }
      setSecretCodeInput('');
    } else {
      toast.error('ACCESS CODE INVALID', 'Check your passcode or VIP invitation link.');
    }
  };

  // Calculations
  const totalTicketsSelected = Object.entries(quantities).reduce((sum, [_, qty]) => sum + qty, 0);
  
  const subtotal = Object.entries(quantities).reduce((sum, [tierId, qty]) => {
    const tier = tiers.find(t => t.id === tierId);
    return sum + (tier ? tier.price * qty : 0);
  }, 0);

  const platformFee = totalTicketsSelected > 0 ? 49 : 0;
  const gstAmount = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + platformFee + gstAmount;

  const handleProceed = () => {
    if (totalTicketsSelected === 0) {
      toast.warning('SELECT TICKETS', 'Choose at least 1 pass to continue to checkout.');
      return;
    }
    onProceedToCheckout(quantities, unlockedTierIds);
  };

  return (
    <div className="bg-[#0d0f0c] border border-white/10 p-5 sm:p-6 font-mono text-[#F1F1EB] space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[#C8FF16] font-bold">
            ACCESS PROTOCOL // TIER SELECTION
          </div>
          <h3 className="text-lg font-black uppercase text-white mt-0.5">
            CHOOSE YOUR ACCESS PASS
          </h3>
        </div>
        <div className="text-right">
          <div className="text-[9px] uppercase text-white/40">GATE CAPACITY</div>
          <div className="text-xs font-bold text-[#C8FF16]">
            {event.totalCapacity - event.totalTicketsSold} PASSES REMAINING
          </div>
        </div>
      </div>

      {/* Ticket Tiers List */}
      <div className="space-y-4">
        {tiers.map(tier => {
          const isSecret = tier.isSecret;
          const isUnlocked = unlockedTierIds.includes(tier.id);
          const isSoldOut = tier.soldQuantity >= tier.totalQuantity;
          const remaining = tier.totalQuantity - tier.soldQuantity;
          const qty = quantities[tier.id] || 0;

          if (isSecret && !isUnlocked) {
            return null; // Hidden until unlocked
          }

          return (
            <div
              key={tier.id}
              className={`p-4 border transition-all ${
                qty > 0
                  ? 'border-[#C8FF16] bg-[#141810]'
                  : isSoldOut
                  ? 'border-white/5 bg-black/40 opacity-60'
                  : 'border-white/10 bg-[#121410] hover:border-white/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                
                {/* Left: Tier info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-black uppercase text-white tracking-tight">
                      {tier.name}
                    </span>
                    {isSecret && (
                      <span className="px-1.5 py-0.2 bg-[#7C46FF] text-white text-[9px] uppercase font-bold">
                        SECRET TIER
                      </span>
                    )}
                    {isSoldOut ? (
                      <span className="px-1.5 py-0.2 bg-[#FF314A]/20 text-[#FF314A] text-[9px] uppercase font-bold border border-[#FF314A]/40">
                        SOLD OUT
                      </span>
                    ) : remaining < 30 ? (
                      <span className="px-1.5 py-0.2 bg-[#FF6B00]/20 text-[#FF6B00] text-[9px] uppercase font-bold border border-[#FF6B00]/40 flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5 fill-[#FF6B00]" />
                        {remaining} LEFT
                      </span>
                    ) : null}
                  </div>

                  <p className="text-xs text-white/70 font-sans leading-relaxed">
                    {tier.description}
                  </p>

                  {/* Perks badges */}
                  {tier.perks && tier.perks.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tier.perks.map((perk, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] text-white/50 bg-black/50 px-2 py-0.5 border border-white/5"
                        >
                          ✓ {perk}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-[10px] text-white/40 pt-1">
                    VALIDITY: {tier.entryValidity} • MAX {tier.maxPerOrder} PER ORDER
                  </div>
                </div>

                {/* Right: Price & Quantity selector */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <div className="text-lg font-black text-[#C8FF16]">
                      ₹{tier.price.toLocaleString('en-IN')}
                    </div>
                    {tier.originalPrice && tier.originalPrice > tier.price && (
                      <div className="text-[10px] text-white/40 line-through">
                        ₹{tier.originalPrice.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>

                  {!isSoldOut ? (
                    <div className="flex items-center border border-white/20 bg-black">
                      <button
                        onClick={() => handleQuantityChange(tier.id, -1, tier.maxPerOrder)}
                        disabled={qty <= 0}
                        className="p-1.5 sm:p-2 text-white/60 hover:text-white disabled:opacity-30 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-white">
                        {qty}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(tier.id, 1, Math.min(tier.maxPerOrder, remaining))}
                        disabled={qty >= Math.min(tier.maxPerOrder, remaining)}
                        className="p-1.5 sm:p-2 text-white/60 hover:text-white disabled:opacity-30 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-[10px] text-white/40 uppercase font-bold py-1">
                      UNAVAILABLE
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Secret Passcode Unlock Input */}
      <div className="pt-2 border-t border-white/10">
        <form onSubmit={handleUnlockSecret} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ENTER VIP PASSCODE (e.g. VIPACCESS)"
              value={secretCodeInput}
              onChange={e => setSecretCodeInput(e.target.value)}
              className="w-full bg-black/60 border border-white/20 px-3 py-2 pl-8 text-xs text-white placeholder:text-white/40 uppercase focus:outline-none focus:border-[#C8FF16]"
            />
            <Lock className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-2.5" />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-[#171914] hover:bg-[#C8FF16] hover:text-black border border-white/20 text-xs font-bold uppercase transition-colors"
          >
            UNLOCK
          </button>
        </form>
      </div>

      {/* Live Order Summary & Checkout CTA */}
      <div className="p-4 bg-black/80 border border-white/10 space-y-2 text-xs">
        <div className="flex justify-between text-white/60">
          <span>SELECTED PASSES ({totalTicketsSelected}):</span>
          <span className="text-white font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        {totalTicketsSelected > 0 && (
          <>
            <div className="flex justify-between text-white/50 text-[11px]">
              <span>PLATFORM SECURITY FEE:</span>
              <span>₹{platformFee}</span>
            </div>
            <div className="flex justify-between text-white/50 text-[11px]">
              <span>GST TAX (18%):</span>
              <span>₹{gstAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t border-white/10 pt-2 flex justify-between items-baseline text-sm font-black">
              <span className="text-white">TOTAL ESTIMATE:</span>
              <span className="text-base text-[#C8FF16]">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </>
        )}

        <button
          onClick={handleProceed}
          disabled={totalTicketsSelected === 0}
          className="w-full mt-4 py-3.5 bg-[#C8FF16] hover:bg-[#b8ea14] text-black font-black uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none"
        >
          <span>PROCEED TO ENCRYPTED CHECKOUT</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center text-[10px] text-white/40 pt-1">
          UPI • RAZORPAY • STRIPE • INSTANT DIGITAL QR PASS
        </div>
      </div>

    </div>
  );
}
