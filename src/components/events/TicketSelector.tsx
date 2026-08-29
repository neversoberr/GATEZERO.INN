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
    <div className="bg-card border border-border/50 p-5 sm:p-6 font-mono text-foreground space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-accent font-bold">
            ACCESS PROTOCOL // TIER SELECTION
          </div>
          <h3 className="text-lg font-black uppercase text-foreground mt-0.5">
            CHOOSE YOUR ACCESS PASS
          </h3>
        </div>
        <div className="text-right">
          <div className="text-[9px] uppercase text-muted-foreground">GATE CAPACITY</div>
          <div className="text-xs font-bold text-accent">
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
                  ? 'border-accent bg-card'
                  : isSoldOut
                  ? 'border-border/30 bg-black/40 opacity-60'
                  : 'border-border/50 bg-card hover:border-border'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                
                {/* Left: Tier info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-black uppercase text-foreground tracking-tight">
                      {tier.name}
                    </span>
                    {isSecret && (
                      <span className="px-1.5 py-0.2 bg-accent text-foreground text-[9px] uppercase font-bold">
                        SECRET TIER
                      </span>
                    )}
                    {isSoldOut ? (
                      <span className="px-1.5 py-0.2 bg-danger/20 text-danger text-[9px] uppercase font-bold border border-danger/40">
                        SOLD OUT
                      </span>
                    ) : remaining < 30 ? (
                      <span className="px-1.5 py-0.2 bg-danger/20 text-danger text-[9px] uppercase font-bold border border-danger/40 flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5 fill-danger" />
                        {remaining} LEFT
                      </span>
                    ) : null}
                  </div>

                  <p className="text-xs text-foreground/70 font-sans leading-relaxed">
                    {tier.description}
                  </p>

                  {/* Perks badges */}
                  {tier.perks && tier.perks.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tier.perks.map((perk, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] text-muted-foreground bg-black/50 px-2 py-0.5 border border-border/30"
                        >
                          ✓ {perk}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-[10px] text-muted-foreground pt-1">
                    VALIDITY: {tier.entryValidity} • MAX {tier.maxPerOrder} PER ORDER
                  </div>
                </div>

                {/* Right: Price & Quantity selector */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <div className="text-lg font-black text-accent">
                      ₹{tier.price.toLocaleString('en-IN')}
                    </div>
                    {tier.originalPrice && tier.originalPrice > tier.price && (
                      <div className="text-[10px] text-muted-foreground line-through">
                        ₹{tier.originalPrice.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>

                  {!isSoldOut ? (
                    <div className="flex items-center border border-border bg-black">
                      <button
                        onClick={() => handleQuantityChange(tier.id, -1, tier.maxPerOrder)}
                        disabled={qty <= 0}
                        className="p-1.5 sm:p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-foreground">
                        {qty}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(tier.id, 1, Math.min(tier.maxPerOrder, remaining))}
                        disabled={qty >= Math.min(tier.maxPerOrder, remaining)}
                        className="p-1.5 sm:p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-[10px] text-muted-foreground uppercase font-bold py-1">
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
      <div className="pt-2 border-t border-border/50">
        <form onSubmit={handleUnlockSecret} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ENTER VIP PASSCODE (e.g. VIPACCESS)"
              value={secretCodeInput}
              onChange={e => setSecretCodeInput(e.target.value)}
              className="w-full bg-black/60 border border-border px-3 py-2 pl-8 text-xs text-foreground placeholder:text-muted-foreground uppercase focus:outline-none focus:border-accent"
            />
            <Lock className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-card hover:bg-accent hover:text-black border border-border text-xs font-bold uppercase transition-colors"
          >
            UNLOCK
          </button>
        </form>
      </div>

      {/* Live Order Summary & Checkout CTA */}
      <div className="p-4 bg-black/80 border border-border/50 space-y-2 text-xs">
        <div className="flex justify-between text-muted-foreground">
          <span>SELECTED PASSES ({totalTicketsSelected}):</span>
          <span className="text-foreground font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        {totalTicketsSelected > 0 && (
          <>
            <div className="flex justify-between text-muted-foreground text-[11px]">
              <span>PLATFORM SECURITY FEE:</span>
              <span>₹{platformFee}</span>
            </div>
            <div className="flex justify-between text-muted-foreground text-[11px]">
              <span>GST TAX (18%):</span>
              <span>₹{gstAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t border-border/50 pt-2 flex justify-between items-baseline text-sm font-black">
              <span className="text-foreground">TOTAL ESTIMATE:</span>
              <span className="text-base text-accent">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </>
        )}

        <button
          onClick={handleProceed}
          disabled={totalTicketsSelected === 0}
          className="w-full mt-4 py-3.5 bg-accent hover:bg-accent-hover text-black font-black uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none"
        >
          <span>PROCEED TO ENCRYPTED CHECKOUT</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center text-[10px] text-muted-foreground pt-1">
          UPI • RAZORPAY • STRIPE • INSTANT DIGITAL QR PASS
        </div>
      </div>

    </div>
  );
}
