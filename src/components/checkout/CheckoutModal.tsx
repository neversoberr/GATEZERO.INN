'use client';

import React, { useState, useEffect } from 'react';
import { Event, TicketTier, Order, OrderItem, AttendeeDetail } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { 
  X, 
  ShieldCheck, 
  ArrowRight, 
  CreditCard, 
  Smartphone, 
  Building, 
  Tag, 
  Check, 
  Download, 
  Calendar as CalendarIcon, 
  QrCode as QrIcon, 
  ArrowLeft,
  Lock
} from 'lucide-react';
import Link from 'next/link';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  tiers: TicketTier[];
  selectedQuantities: Record<string, number>;
  onOrderCreated?: (order: Order) => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  event,
  tiers,
  selectedQuantities,
  onOrderCreated
}: CheckoutModalProps) {
  const { user } = useAuth();
  const toast = useToast();

  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');
  const [attendees, setAttendees] = useState<
    { fullName: string; email: string; phone: string; tierId: string; tierName: string; price: number }[]
  >([]);
  
  // Custom question answers
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({
    emergencyContact: '+91 98200 11223',
    ageConfirmed: 'true'
  });

  // Promo code
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountAmount: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'Razorpay'>('UPI');
  const [upiId, setUpiId] = useState('alex@okaxis');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('892');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Success result
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [qrDataUrls, setQrDataUrls] = useState<string[]>([]);

  // Initialize attendees on open
  useEffect(() => {
    if (isOpen) {
      const list: { fullName: string; email: string; phone: string; tierId: string; tierName: string; price: number }[] = [];
      Object.entries(selectedQuantities).forEach(([tierId, qty]) => {
        const tier = tiers.find(t => t.id === tierId);
        if (tier) {
          for (let i = 0; i < qty; i++) {
            list.push({
              fullName: i === 0 && user ? user.name : `Attendee ${list.length + 1}`,
              email: i === 0 && user ? user.email : (user ? `attendee${list.length + 1}@example.com` : ''),
              phone: i === 0 && user ? user.phone : '+91 98000 00000',
              tierId: tier.id,
              tierName: tier.name,
              price: tier.price
            });
          }
        }
      });
      setAttendees(list);
      setStep('details');
      setAppliedPromo(null);
      setPromoInput('');
    }
  }, [isOpen, selectedQuantities, tiers, user]);

  if (!isOpen) return null;

  // Pricing math
  const subtotal = attendees.reduce((sum, a) => sum + a.price, 0);
  const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const platformFee = attendees.length > 0 ? 49 : 0;
  const gstAmount = Math.round(taxableAmount * 0.18);
  const finalTotal = taxableAmount + platformFee + gstAmount;

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (!promoInput.trim()) return;

    try {
      const res = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoInput.trim(),
          eventId: event.id,
          subtotal
        })
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedPromo({
          code: promoInput.trim().toUpperCase(),
          discountAmount: data.discountAmount
        });
        toast.success('PROMO CODE APPLIED', data.message);
      } else {
        setPromoError(data.message || 'INVALID CODE');
        toast.error('INVALID PROMO CODE', data.message);
      }
    } catch (err: any) {
      setPromoError('Failed to validate code');
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate attendee inputs
    for (const att of attendees) {
      if (!att.fullName || !att.email) {
        toast.error('MISSING DETAILS', 'Please fill name and email for all pass holders.');
        return;
      }
    }
    setStep('payment');
  };

  const handleExecutePayment = async () => {
    if (!termsAccepted) {
      toast.warning('ACCEPT TERMS', 'Please accept the Gate Zero entry policy to proceed.');
      return;
    }

    setStep('processing');

    // Simulate cryptographic processing time
    setTimeout(async () => {
      const orderNumber = `GZ-ORD-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      
      const orderItems: OrderItem[] = [];
      const tierCounts: Record<string, { tier: TicketTier; qty: number }> = {};

      attendees.forEach(a => {
        const tier = tiers.find(t => t.id === a.tierId);
        if (tier) {
          if (!tierCounts[a.tierId]) {
            tierCounts[a.tierId] = { tier, qty: 0 };
          }
          tierCounts[a.tierId].qty += 1;
        }
      });

      Object.values(tierCounts).forEach(({ tier, qty }) => {
        orderItems.push({
          ticketTierId: tier.id,
          tierName: tier.name,
          pricePerUnit: tier.price,
          quantity: qty,
          subtotal: tier.price * qty
        });
      });

      const finalAttendees: AttendeeDetail[] = attendees.map((att, idx) => {
        const ticketCode = `GZ-TCK-${Math.floor(100000 + Math.random() * 900000)}`;
        return {
          id: `att_${Date.now()}_${idx}`,
          ticketCode,
          tierName: att.tierName,
          fullName: att.fullName,
          email: att.email,
          phone: att.phone,
          customAnswers,
          isCheckedIn: false,
          gateAssigned: 'GATE 01 - MAIN ENTRANCE',
          qrPayload: `GZ::${event.id}::${att.tierName}::${ticketCode}::${att.email}`,
          securityHash: Math.random().toString(36).substring(2, 18)
        };
      });

      const newOrder: Order = {
        id: `ord_${Date.now()}`,
        orderNumber,
        userId: user?.id || 'user_guest',
        customerName: attendees[0].fullName,
        customerEmail: attendees[0].email,
        customerPhone: attendees[0].phone,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.startDate,
        eventVenue: event.venueName + ', ' + event.city,
        eventCity: event.city,
        eventPosterUrl: event.posterUrl,
        items: orderItems,
        attendees: finalAttendees,
        subtotal,
        discountAmount,
        promoCodeApplied: appliedPromo?.code,
        platformFee,
        gstAmount,
        totalAmount: finalTotal,
        currency: 'INR',
        paymentStatus: 'paid',
        paymentMethod,
        paymentGatewayRef: `pay_sandbox_${Math.random().toString(36).substring(2, 10)}`,
        paidAt: new Date().toISOString(),
        refundStatus: 'none',
        createdAt: new Date().toISOString()
      };

      try {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOrder)
        });
      } catch (e) {}

      // Generate real QR code images
      const qrCodes: string[] = [];
      for (const att of finalAttendees) {
        try {
          const url = await QRCode.toDataURL(att.qrPayload, {
            width: 320,
            margin: 1,
            color: {
              dark: '#09090B',
              light: '#D4F00D'
            }
          });
          qrCodes.push(url);
        } catch (e) {
          qrCodes.push('');
        }
      }

      setQrDataUrls(qrCodes);
      setCompletedOrder(newOrder);
      setStep('success');

      if (onOrderCreated) {
        onOrderCreated(newOrder);
      }

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4F00D', '#FFFFFF', '#D4F00D', '#FF314A']
        });
      } catch (e) {}

      toast.success('ACCESS GRANTED', `Order ${orderNumber} confirmed.`);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-lg animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-foreground text-background overflow-hidden font-mono max-h-[95vh] flex flex-col"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)' }}
      >
        
        {/* Top brutalist bar */}
        <div className="bg-black text-foreground px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-accent" />
            <span className="font-bold text-xs uppercase tracking-widest text-accent">
              GATE ZERO // SECURE CHECKOUT PROTOCOL
            </span>
          </div>
          {step !== 'processing' && (
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scrollable Main Area */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1 space-y-6">
          
          {/* STEP 1: ATTENDEE DETAILS */}
          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              
              {/* Event Header Summary */}
              <div className="border-b-2 border-black pb-4">
                <span className="text-[10px] uppercase tracking-widest text-black/60 font-bold block">
                  EXPERIENCE REGISTRATION
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black mt-1">
                  {event.title}
                </h2>
                <p className="text-xs text-black/70 font-sans mt-0.5">
                  {event.venueName} • {event.city} • {new Date(event.startDate).toLocaleDateString('en-GB')}
                </p>
              </div>

              {/* Attendee Info Inputs */}
              <div className="space-y-4">
                <div className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                  <span>PASS HOLDER INFORMATION ({attendees.length} PASSES)</span>
                </div>

                {attendees.map((att, idx) => (
                  <div key={idx} className="p-4 bg-foreground border border-black/20 space-y-3">
                    <div className="flex justify-between items-center text-[11px] font-bold pb-2 border-b border-black/10">
                      <span className="text-black">PASS #{idx + 1} — {att.tierName.toUpperCase()}</span>
                      <span className="text-black/60">₹{att.price.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-black/70 mb-1">
                          FULL LEGAL NAME *
                        </label>
                        <input
                          type="text"
                          value={att.fullName}
                          onChange={e => {
                            const copy = [...attendees];
                            copy[idx].fullName = e.target.value;
                            setAttendees(copy);
                          }}
                          placeholder="e.g. Alex Chen"
                          className="w-full bg-foreground border border-black/30 px-3 py-2 text-xs font-bold focus:outline-none focus:border-black"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-black/70 mb-1">
                          EMAIL ADDRESS (FOR PASS DISPATCH) *
                        </label>
                        <input
                          type="email"
                          value={att.email}
                          onChange={e => {
                            const copy = [...attendees];
                            copy[idx].email = e.target.value;
                            setAttendees(copy);
                          }}
                          placeholder="alex@gatezero.in"
                          className="w-full bg-foreground border border-black/30 px-3 py-2 text-xs font-bold focus:outline-none focus:border-black"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-black/70 mb-1">
                        MOBILE NUMBER (+91)
                      </label>
                      <input
                        type="tel"
                        value={att.phone}
                        onChange={e => {
                          const copy = [...attendees];
                          copy[idx].phone = e.target.value;
                          setAttendees(copy);
                        }}
                        placeholder="+91 98201 44520"
                        className="w-full bg-foreground border border-black/30 px-3 py-2 text-xs font-bold focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Organizer Questions */}
              <div className="p-4 bg-foreground border border-black/20 space-y-3">
                <div className="text-[11px] font-black uppercase text-black">
                  ORGANIZER COMPLIANCE QUESTIONS
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-black/70 mb-1">
                    EMERGENCY CONTACT NUMBER *
                  </label>
                  <input
                    type="text"
                    value={customAnswers.emergencyContact || ''}
                    onChange={e => setCustomAnswers({ ...customAnswers, emergencyContact: e.target.value })}
                    className="w-full bg-foreground border border-black/30 px-3 py-2 text-xs font-bold"
                    required
                  />
                </div>
                <label className="flex items-center gap-2 text-xs cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={customAnswers.ageConfirmed === 'true'}
                    onChange={e => setCustomAnswers({ ...customAnswers, ageConfirmed: e.target.checked ? 'true' : 'false' })}
                    className="accent-black"
                    required
                  />
                  <span className="font-bold">I confirm all attendees meet the {event.ageRestriction} entry criteria.</span>
                </label>
              </div>

              {/* Promo Code section */}
              <div className="p-4 bg-foreground border border-black/20 space-y-2">
                <div className="text-[10px] uppercase font-bold text-black/60">
                  HAVE AN ACCESS PROMO CODE?
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ENTER CODE (e.g. GATEZERO10)"
                    value={promoInput}
                    onChange={e => setPromoInput(e.target.value)}
                    className="flex-1 bg-foreground border border-black/30 px-3 py-2 text-xs font-bold uppercase focus:outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-black text-foreground hover:bg-black/80 font-bold uppercase text-xs"
                  >
                    APPLY
                  </button>
                </div>
                {appliedPromo && (
                  <div className="text-xs text-green-700 font-bold flex items-center gap-1 mt-1">
                    <Check className="w-3.5 h-3.5" />
                    APPLIED: {appliedPromo.code} (-₹{appliedPromo.discountAmount.toFixed(0)})
                  </div>
                )}
                {promoError && (
                  <div className="text-xs text-red-600 font-bold mt-1">
                    {promoError}
                  </div>
                )}
              </div>

              {/* Action */}
              <button
                type="submit"
                className="w-full py-4 bg-black hover:bg-neutral-900 text-accent font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
              >
                <span>CONTINUE TO PAYMENT (₹{finalTotal.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4 text-accent" />
              </button>
            </form>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="flex items-center gap-1 text-xs font-bold text-black/60 hover:text-black uppercase"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> BACK TO DETAILS
                </button>
                <span className="text-xs font-black uppercase text-black">
                  STEP 2 OF 2: SETTLEMENT
                </span>
              </div>

              {/* Payment Methods Selection */}
              <div className="space-y-3">
                <div className="text-xs font-black uppercase tracking-wider">
                  SELECT PAYMENT ROUTE
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 border text-center transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-black bg-black text-accent font-black'
                        : 'border-black/20 bg-foreground text-black hover:border-black'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs uppercase">UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Card')}
                    className={`p-3 border text-center transition-all ${
                      paymentMethod === 'Card'
                        ? 'border-black bg-black text-accent font-black'
                        : 'border-black/20 bg-foreground text-black hover:border-black'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs uppercase">CARDS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NetBanking')}
                    className={`p-3 border text-center transition-all ${
                      paymentMethod === 'NetBanking'
                        ? 'border-black bg-black text-accent font-black'
                        : 'border-black/20 bg-foreground text-black hover:border-black'
                    }`}
                  >
                    <Building className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs uppercase">NET BANKING</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Razorpay')}
                    className={`p-3 border text-center transition-all ${
                      paymentMethod === 'Razorpay'
                        ? 'border-black bg-black text-accent font-black'
                        : 'border-black/20 bg-foreground text-black hover:border-black'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs uppercase">RAZORPAY</span>
                  </button>
                </div>

                {/* UPI Sub-form */}
                {paymentMethod === 'UPI' && (
                  <div className="p-4 bg-foreground border border-black/20 space-y-3">
                    <div className="text-xs font-bold uppercase text-black">
                      INSTANT UPI VPA ID
                    </div>
                    <input
                      type="text"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      placeholder="mobile@upi or user@okhdfcbank"
                      className="w-full bg-foreground border border-black/30 px-3 py-2 text-xs font-bold"
                    />
                    <p className="text-[10px] text-black/50">
                      Supports Google Pay, PhonePe, Paytm, CRED & BHIM. Instant authorization.
                    </p>
                  </div>
                )}

                {/* Card Sub-form */}
                {paymentMethod === 'Card' && (
                  <div className="p-4 bg-foreground border border-black/20 space-y-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-black/70 mb-1">
                        CARD NUMBER (TEST SANDBOX)
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        className="w-full bg-foreground border border-black/30 px-3 py-2 text-xs font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-black/70 mb-1">
                          EXPIRY
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          className="w-full bg-foreground border border-black/30 px-3 py-2 text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-black/70 mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={e => setCardCvv(e.target.value)}
                          className="w-full bg-foreground border border-black/30 px-3 py-2 text-xs font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* NetBanking Sub-form */}
                {paymentMethod === 'NetBanking' && (
                  <div className="p-4 bg-foreground border border-black/20 space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-black/70">
                      CHOOSE INDIAN BANK
                    </label>
                    <select
                      value={selectedBank}
                      onChange={e => setSelectedBank(e.target.value)}
                      className="w-full bg-foreground border border-black/30 px-3 py-2 text-xs font-bold uppercase"
                    >
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>State Bank of India</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Order Breakdown */}
              <div className="p-4 bg-foreground border border-black/20 space-y-2 text-xs">
                <div className="flex justify-between font-bold">
                  <span>PASSES SUBTOTAL ({attendees.length}):</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-700 font-bold">
                    <span>PROMO DISCOUNT ({appliedPromo?.code}):</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-black/60 text-[11px]">
                  <span>PLATFORM SECURITY FEE:</span>
                  <span>₹{platformFee}</span>
                </div>
                <div className="flex justify-between text-black/60 text-[11px]">
                  <span>GST (18% TAX):</span>
                  <span>₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t-2 border-black pt-2 flex justify-between items-baseline text-sm font-black">
                  <span>FINAL AUTHORIZATION:</span>
                  <span className="text-base text-black">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  className="accent-black mt-0.5"
                />
                <span className="text-black/80">
                  I accept Gate Zero’s Entry Agreement, strictly acknowledge the venue age limit and non-resale cryptographic pass terms.
                </span>
              </label>

              {/* Submit Payment */}
              <button
                type="button"
                onClick={handleExecutePayment}
                disabled={!termsAccepted}
                className="w-full py-4 bg-black hover:bg-neutral-900 text-accent font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.99] disabled:opacity-40"
              >
                <Lock className="w-4 h-4 text-accent" />
                <span>AUTHORIZE PAYMENT (₹{finalTotal.toLocaleString('en-IN')})</span>
              </button>
            </div>
          )}

          {/* STEP 3: PROCESSING */}
          {step === 'processing' && (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 border-4 border-black border-t-accent rounded-full animate-spin mx-auto" />
              <div className="text-sm font-black uppercase tracking-widest text-black">
                ENCRYPTING PASS KEYS...
              </div>
              <p className="text-xs text-black/60 font-mono max-w-sm mx-auto">
                Validating INR settlement via sandbox gateway and minting dynamic QR tickets.
              </p>
            </div>
          )}

          {/* STEP 4: ORDER SUCCESS */}
          {step === 'success' && completedOrder && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              
              {/* Giant Access Header */}
              <div className="bg-black text-accent p-6 text-center space-y-1">
                <div className="text-xs uppercase tracking-widest font-mono text-muted-foreground">
                  ACCESS STATUS // CONFIRMED
                </div>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter">
                  YOU’RE THROUGH.
                </h2>
                <div className="text-xs font-mono text-foreground/80 pt-1">
                  ORDER: {completedOrder.orderNumber}
                </div>
              </div>

              {/* Pass Visual Card */}
              <div className="space-y-4">
                {completedOrder.attendees.map((att, idx) => (
                  <div
                    key={att.id}
                    className="p-5 bg-foreground border-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    <div className="space-y-1 text-left w-full sm:w-auto">
                      <div className="text-[10px] uppercase tracking-widest text-black/50 font-bold">
                        PASS #{idx + 1} // {att.tierName.toUpperCase()}
                      </div>
                      <div className="text-base font-black text-black">
                        {att.fullName}
                      </div>
                      <div className="text-xs text-black/70">
                        {event.venueName} • {event.city}
                      </div>
                      <div className="text-[11px] font-bold text-black/80 pt-1">
                        CODE: {att.ticketCode}
                      </div>
                    </div>

                    {/* QR Code */}
                    {qrDataUrls[idx] && (
                      <div className="p-2 bg-black shrink-0 border border-black">
                        <img
                          src={qrDataUrls[idx]}
                          alt="Dynamic Gate Zero Pass QR"
                          className="w-24 h-24 sm:w-28 sm:h-28"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Link
                  href="/tickets"
                  onClick={onClose}
                  className="py-3 bg-black hover:bg-neutral-800 text-foreground font-black uppercase text-xs text-center flex items-center justify-center gap-2"
                >
                  <QrIcon className="w-4 h-4 text-accent" />
                  <span>VIEW IN MY PASS WALLET</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    toast.success('PASS DOWNLOADED', 'Digital passcard saved to your device.');
                  }}
                  className="py-3 bg-foreground hover:bg-foreground border-2 border-black text-black font-black uppercase text-xs flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD PASS (PDF)</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
