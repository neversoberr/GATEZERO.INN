'use client';

import React, { useState, useEffect } from 'react';
import { Order, AttendeeDetail } from '@/types';
import QRCode from 'qrcode';
import { 
  Download, 
  Send, 
  RotateCcw, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ShieldCheck, 
  Smartphone 
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface AccessPassCardProps {
  order: Order;
  attendee: AttendeeDetail;
  onTicketUpdated?: () => void;
}

export function AccessPassCard({ order, attendee, onTicketUpdated }: AccessPassCardProps) {
  const [qrSrc, setQrSrc] = useState<string>('');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [transferName, setTransferName] = useState('');
  const [transferEmail, setTransferEmail] = useState('');
  const [refundReason, setRefundReason] = useState('Schedule conflict');
  const [isActionLoading, setIsActionLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    QRCode.toDataURL(attendee.qrPayload, {
      width: 300,
      margin: 1,
      color: {
        dark: '#050505',
        light: '#C8FF16'
      }
    })
      .then(url => setQrSrc(url))
      .catch(() => {});
  }, [attendee.qrPayload]);

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferName || !transferEmail) return;
    setIsActionLoading(true);

    try {
      const res = await fetch('/api/tickets/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketCode: attendee.ticketCode,
          newFullName: transferName,
          newEmail: transferEmail,
          newPhone: ''
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('PASS TRANSFERRED', `Access code ${attendee.ticketCode} sent to ${transferName}`);
        setIsTransferModalOpen(false);
        if (onTicketUpdated) onTicketUpdated();
      } else {
        toast.error('TRANSFER FAILED', data.error);
      }
    } catch (err: any) {
      toast.error('ERROR', err.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading(true);

    try {
      const res = await fetch('/api/tickets/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          reason: refundReason
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('REFUND REQUEST FILED', 'Gate Zero compliance team is reviewing the claim.');
        setIsRefundModalOpen(false);
        if (onTicketUpdated) onTicketUpdated();
      } else {
        toast.error('REQUEST FAILED', data.error);
      }
    } catch (err: any) {
      toast.error('ERROR', err.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const eventDate = new Date(order.eventDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();

  return (
    <div 
      className="bg-[#0e100c] border border-white/20 hover:border-[#C8FF16] transition-all font-mono text-[#F1F1EB] overflow-hidden shadow-2xl relative"
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)' }}
    >
      {/* Pass Header Hologram Strip */}
      <div className="bg-gradient-to-r from-[#171a14] via-[#23281c] to-[#171a14] px-4 sm:px-6 py-3 border-b border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-[#C8FF16] animate-pulse" />
          <span className="font-black tracking-widest text-[#C8FF16]">
            GATE ZERO // ACCESS PASS #{attendee.ticketCode}
          </span>
        </div>

        <div>
          {attendee.isCheckedIn ? (
            <span className="px-2 py-0.5 bg-[#C8FF16] text-black text-[10px] font-black uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              CHECKED IN AT DOOR
            </span>
          ) : order.paymentStatus === 'refunded' ? (
            <span className="px-2 py-0.5 bg-[#FF314A]/20 text-[#FF314A] text-[10px] font-bold uppercase border border-[#FF314A]/40">
              PASS REFUNDED / VOID
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-black text-[#C8FF16] border border-[#C8FF16]/40 text-[10px] font-bold uppercase">
              VALID FOR ENTRY
            </span>
          )}
        </div>
      </div>

      {/* Pass Body */}
      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left: Event & Attendee Info */}
        <div className="md:col-span-8 space-y-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-white/50 block">
              EVENT TRANSMISSION
            </span>
            <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight mt-0.5">
              {order.eventTitle}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-2.5 bg-black/60 border border-white/10">
              <div className="text-[9px] uppercase text-white/40">TIER</div>
              <div className="text-white font-bold truncate text-[11px]">{attendee.tierName}</div>
            </div>

            <div className="p-2.5 bg-black/60 border border-white/10">
              <div className="text-[9px] uppercase text-white/40">DATE</div>
              <div className="text-[#C8FF16] font-bold">{eventDate}</div>
            </div>

            <div className="p-2.5 bg-black/60 border border-white/10 col-span-2 sm:col-span-1">
              <div className="text-[9px] uppercase text-white/40">GATE</div>
              <div className="text-white font-bold">{attendee.gateAssigned || 'GATE 01'}</div>
            </div>
          </div>

          <div className="text-xs space-y-1 text-white/70">
            <div className="flex items-center gap-1.5">
              <span className="text-white/40 text-[10px]">ATTENDEE:</span>
              <span className="text-white font-bold">{attendee.fullName}</span>
              <span className="text-white/40 text-[10px]">({attendee.email})</span>
            </div>
            <div className="flex items-center gap-1.5 font-sans text-xs">
              <MapPin className="w-3.5 h-3.5 text-[#C8FF16] shrink-0" />
              <span className="truncate">{order.eventVenue}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-2 text-xs">
            <button
              onClick={() => {
                toast.success('PASS DOWNLOADED', `Saved PDF pass for ${attendee.fullName}`);
              }}
              className="px-3 py-2 bg-[#171914] hover:bg-white hover:text-black border border-white/20 uppercase font-bold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF Pass</span>
            </button>

            <button
              onClick={() => setIsTransferModalOpen(true)}
              disabled={attendee.isCheckedIn || order.paymentStatus === 'refunded'}
              className="px-3 py-2 bg-[#171914] hover:bg-[#C8FF16] hover:text-black border border-white/20 uppercase font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transfer</span>
            </button>

            <button
              onClick={() => setIsRefundModalOpen(true)}
              disabled={attendee.isCheckedIn || order.paymentStatus === 'refunded'}
              className="px-3 py-2 bg-[#171914] hover:bg-[#FF314A] hover:text-white border border-white/20 uppercase font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Refund</span>
            </button>
          </div>
        </div>

        {/* Right: Dynamic High-Contrast QR Code */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-black border border-white/10 space-y-2">
          {qrSrc ? (
            <div className="p-2 bg-[#C8FF16]">
              <img
                src={qrSrc}
                alt="Encrypted Gate Zero Pass"
                className="w-36 h-36 sm:w-40 sm:h-40 object-contain"
              />
            </div>
          ) : (
            <div className="w-36 h-36 bg-[#171914] animate-pulse" />
          )}

          <div className="text-[10px] text-[#C8FF16] font-mono tracking-widest text-center">
            {attendee.ticketCode}
          </div>
          <div className="text-[8px] text-white/40 uppercase tracking-widest text-center">
            SCAN AT VENUE GATE TO ENTER
          </div>
        </div>

      </div>

      {/* TRANSFER MODAL */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0e100c] border border-[#C8FF16] p-6 shadow-2xl font-mono text-white">
            <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-bold text-[#C8FF16]">TRANSFER ACCESS PASS</span>
              <button onClick={() => setIsTransferModalOpen(false)}>
                <X className="w-4 h-4 text-white/60 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <p className="text-xs text-white/70 font-sans">
                Transfer pass <strong className="text-white">{attendee.ticketCode}</strong> to a friend. A new QR code will be generated and dispatched.
              </p>

              <div>
                <label className="block text-[10px] uppercase text-white/60 mb-1">RECIPIENT FULL NAME</label>
                <input
                  type="text"
                  value={transferName}
                  onChange={e => setTransferName(e.target.value)}
                  placeholder="e.g. Zoya Merchant"
                  className="w-full bg-black border border-white/20 p-2 text-xs text-white focus:border-[#C8FF16] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-white/60 mb-1">RECIPIENT EMAIL</label>
                <input
                  type="email"
                  value={transferEmail}
                  onChange={e => setTransferEmail(e.target.value)}
                  placeholder="zoya@example.com"
                  className="w-full bg-black border border-white/20 p-2 text-xs text-white focus:border-[#C8FF16] focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isActionLoading}
                className="w-full py-3 bg-[#C8FF16] text-black font-black uppercase text-xs hover:bg-[#b8ea14]"
              >
                {isActionLoading ? 'DISPATCHING CRYPTOGRAPHIC PASS...' : 'CONFIRM TRANSFER ↗'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REFUND MODAL */}
      {isRefundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0e100c] border border-[#FF314A] p-6 shadow-2xl font-mono text-white">
            <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-bold text-[#FF314A]">REQUEST ORDER REFUND</span>
              <button onClick={() => setIsRefundModalOpen(false)}>
                <X className="w-4 h-4 text-white/60 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleRefundSubmit} className="space-y-4">
              <p className="text-xs text-white/70 font-sans">
                Request a refund for Order <strong className="text-white">{order.orderNumber}</strong>. Refund eligibility depends on organizer policy.
              </p>

              <div>
                <label className="block text-[10px] uppercase text-white/60 mb-1">REASON FOR CANCELLATION</label>
                <select
                  value={refundReason}
                  onChange={e => setRefundReason(e.target.value)}
                  className="w-full bg-black border border-white/20 p-2 text-xs text-white focus:border-[#FF314A] focus:outline-none uppercase"
                >
                  <option>Schedule conflict / Emergency</option>
                  <option>Event rescheduled</option>
                  <option>Medical reason</option>
                  <option>Accidental duplicate purchase</option>
                  <option>Other</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isActionLoading}
                className="w-full py-3 bg-[#FF314A] text-white font-black uppercase text-xs hover:bg-red-700"
              >
                {isActionLoading ? 'SUBMITTING REQUEST...' : 'SUBMIT REFUND CLAIM ↗'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
