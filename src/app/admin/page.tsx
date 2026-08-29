'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleBanner } from '@/components/layout/RoleBanner';
import { LoginModal } from '@/components/auth/LoginModal';
import { Event, OrganizerCompany, Order, SettlementRecord, AdminAuditLog, PlatformStats, User } from '@/types';
import { 
  INITIAL_EVENTS, 
  INITIAL_ORGANIZERS, 
  INITIAL_ORDERS, 
  INITIAL_SETTLEMENTS, 
  INITIAL_AUDIT_LOGS,
  INITIAL_USERS
} from '@/lib/data/initial-data';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldAlert, 
  ShieldCheck, 
  DollarSign, 
  Calendar, 
  Building2, 
  Users, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  Lock, 
  Sparkles,
  Terminal,
  Activity
} from 'lucide-react';

export default function AdminPage() {
  return <AdminCommandCenterContent />;
}

function CommandCenterContent() {
  const { user } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'kpis' | 'events' | 'kyc' | 'settlements' | 'refunds' | 'users' | 'audit' | 'reports'>('kpis');
  const [reports, setReports] = useState<any>(null);
  
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [organizers, setOrganizers] = useState<OrganizerCompany[]>(INITIAL_ORGANIZERS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [settlements, setSettlements] = useState<SettlementRecord[]>(INITIAL_SETTLEMENTS);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [usersList, setUsersList] = useState<User[]>(INITIAL_USERS);

  const fetchAdminData = () => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (data.events) setEvents(data.events);
          if (data.organizers) setOrganizers(data.organizers);
          if (data.settlements) setSettlements(data.settlements);
          if (data.auditLogs) setAuditLogs(data.auditLogs);
          if (data.orders) setOrders(data.orders);
          if (data.reports) setReports(data.reports);
          if (data.users) setUsersList(data.users);
          if (data.stats) {
            // keep live stats available via reports/stats payload
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Compute Platform KPIs
  const totalGMV = 6842000;
  const platformRevenue = 342100;
  const pendingApprovalsCount = events.filter(e => e.status === 'under_review').length;
  const pendingKycCount = organizers.filter(o => o.kycStatus === 'pending' || o.kycStatus === 'in_review').length;
  const pendingRefunds = orders.filter(o => o.refundStatus === 'pending');

  const handleToggleFeature = async (eventId: string, current: boolean) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, isFeatured: !current } : e));
    await fetch('/api/admin/moderate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, featured: !current })
    }).catch(() => {});
    toast.info('FEATURED STATUS UPDATED', `Event billboard priority adjusted.`);
  };

  const handleApproveEvent = async (eventId: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'published' } : e));
    await fetch('/api/admin/moderate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, action: 'approve' })
    }).catch(() => {});
    toast.success('EVENT APPROVED', 'Listing is now active across all Gate Zero radars.');
  };

  const handleApproveKyc = async (orgId: string) => {
    setOrganizers(prev => prev.map(o => o.id === orgId ? { ...o, isVerified: true, kycStatus: 'verified' } : o));
    await fetch('/api/admin/kyc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organizerId: orgId, approved: true })
    }).catch(() => {});
    toast.success('KYC APPROVED', 'Organizer verified badge and payout gateway unlocked.');
  };

  const handleReleaseSettlement = async (settlementId: string) => {
    try {
      const res = await fetch('/api/admin/settlements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settlementId, bankReference: `UTR${Date.now()}` })
      });
      const data = await res.json();
      if (data.success) {
        setSettlements(prev => prev.map(s => s.id === settlementId ? { ...s, status: 'settled', settledAt: new Date().toISOString() } : s));
        toast.success('SETTLEMENT RELEASED', `Payout marked settled via Indian Banking RTGS.`);
      }
    } catch (e: any) {
      toast.error('SETTLEMENT ERROR', e.message);
    }
  };

  const handleProcessRefund = async (orderId: string, approve: boolean) => {
    try {
      const res = await fetch('/api/admin/refunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, approved: approve })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, refundStatus: approve ? 'approved' : 'rejected', paymentStatus: approve ? 'refunded' : o.paymentStatus } : o));
        toast.success(approve ? 'REFUND APPROVED' : 'REFUND REJECTED', data.message);
      }
    } catch (e: any) {
      toast.error('ERROR', e.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F1F1EB] flex flex-col font-mono selection:bg-[#C8FF16] selection:text-black">
      <RoleBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Admin Header */}
        <div className="pb-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#FF314A]" />
              <span className="text-[10px] uppercase tracking-widest text-[#FF314A] font-bold">
                GATE ZERO CORE PLATFORM // CHIEF CONTROLLER
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
              SYSTEM COMMAND CENTER
            </h1>
            <p className="text-xs text-white/50 font-sans mt-0.5">
              Superadmin: <strong className="text-white">{user?.name || 'Dev Malik'}</strong> • Multi-City Cultural Ticketing Exchange
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 bg-black border border-[#C8FF16] text-[#C8FF16] font-bold">
              SYS_INTEGRITY: 100%
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex overflow-x-auto border-b border-white/10 gap-2 text-xs">
          {[
            { id: 'kpis', label: 'Platform KPIs', icon: Activity },
            { id: 'events', label: `Event Approvals (${events.length})`, icon: Calendar },
            { id: 'kyc', label: `Organizer KYC (${organizers.length})`, icon: Building2 },
            { id: 'settlements', label: `Payouts & Settlements (${settlements.length})`, icon: DollarSign },
            { id: 'refunds', label: `Disputes & Refunds (${pendingRefunds.length})`, icon: RotateCcw },
            { id: 'users', label: 'User Roles', icon: Users },
            { id: 'reports', label: 'Reports', icon: Sparkles },
            { id: 'audit', label: 'Audit Log Stream', icon: Terminal },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-3 uppercase font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-[#C8FF16] text-[#C8FF16]'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}
        <div className="py-6">
          
          {/* 1. KPIS */}
          {activeTab === 'kpis' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 bg-[#0e100c] border border-white/10 space-y-1">
                  <div className="text-[10px] text-white/40 uppercase">PLATFORM GMV (ALL CITIES)</div>
                  <div className="text-3xl font-black text-white">₹{totalGMV.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-[#C8FF16]">↑ 31.4% Monthly Velocity</div>
                </div>

                <div className="p-6 bg-[#0e100c] border border-white/10 space-y-1">
                  <div className="text-[10px] text-white/40 uppercase">GATE ZERO NET REVENUE</div>
                  <div className="text-3xl font-black text-[#C8FF16]">₹{platformRevenue.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-white/60">5% Platform Fee + ₹49 pass charge</div>
                </div>

                <div className="p-6 bg-[#0e100c] border border-white/10 space-y-1">
                  <div className="text-[10px] text-white/40 uppercase">ACTIVE RADAR PRODUCTIONS</div>
                  <div className="text-3xl font-black text-white">{events.length}</div>
                  <div className="text-[10px] text-white/60">Mumbai, BLR, Delhi, Goa, Pune</div>
                </div>

                <div className="p-6 bg-[#0e100c] border border-white/10 space-y-1">
                  <div className="text-[10px] text-white/40 uppercase">REGISTERED ATTENDEES</div>
                  <div className="text-3xl font-black text-white">4,820</div>
                  <div className="text-[10px] text-white/60">0.02% Dispute Rate</div>
                </div>
              </div>

              {/* City Breakdown Grid */}
              <div className="p-6 bg-[#0e100c] border border-white/10 space-y-4">
                <div className="text-xs font-black uppercase text-white pb-3 border-b border-white/10">
                  METROPOLITAN MARKET SHARE (INR)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-xs">
                  <div className="p-3 bg-black/60 border border-white/10">
                    <div className="text-[10px] text-[#C8FF16]">MUMBAI [MUM]</div>
                    <div className="text-base font-bold text-white mt-1">₹34.8L</div>
                    <div className="text-[9px] text-white/40">51% Volume</div>
                  </div>
                  <div className="p-3 bg-black/60 border border-white/10">
                    <div className="text-[10px] text-[#C8FF16]">BENGALURU [BLR]</div>
                    <div className="text-base font-bold text-white mt-1">₹18.2L</div>
                    <div className="text-[9px] text-white/40">26% Volume</div>
                  </div>
                  <div className="p-3 bg-black/60 border border-white/10">
                    <div className="text-[10px] text-[#C8FF16]">GOA [GOA]</div>
                    <div className="text-base font-bold text-white mt-1">₹8.9L</div>
                    <div className="text-[9px] text-white/40">13% Volume</div>
                  </div>
                  <div className="p-3 bg-black/60 border border-white/10">
                    <div className="text-[10px] text-[#C8FF16]">DELHI NCR [DEL]</div>
                    <div className="text-base font-bold text-white mt-1">₹4.5L</div>
                    <div className="text-[9px] text-white/40">7% Volume</div>
                  </div>
                  <div className="p-3 bg-black/60 border border-white/10">
                    <div className="text-[10px] text-[#C8FF16]">PUNE [PNE]</div>
                    <div className="text-base font-bold text-white mt-1">₹2.0L</div>
                    <div className="text-[9px] text-white/40">3% Volume</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. EVENTS MODERATION */}
          {activeTab === 'events' && (
            <div className="bg-[#0e100c] border border-white/10 overflow-x-auto">
              <table className="w-full text-left text-xs text-white">
                <thead className="bg-black text-[10px] uppercase text-white/50 border-b border-white/10">
                  <tr>
                    <th className="p-4">CODE</th>
                    <th className="p-4">TITLE</th>
                    <th className="p-4">CITY & VENUE</th>
                    <th className="p-4">ORGANIZER</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {events.map(ev => (
                    <tr key={ev.id} className="hover:bg-white/5">
                      <td className="p-4 font-bold text-[#C8FF16]">{ev.code}</td>
                      <td className="p-4 font-bold">{ev.title}</td>
                      <td className="p-4 text-white/60">{ev.city} • {ev.venueName}</td>
                      <td className="p-4">{ev.organizerName}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-black border border-white/20 text-[10px] uppercase font-bold">
                          {ev.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {ev.status === 'under_review' && (
                            <button
                              onClick={() => handleApproveEvent(ev.id)}
                              className="px-2 py-1 bg-[#C8FF16] text-black text-[10px] uppercase font-black"
                            >
                              APPROVE
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleFeature(ev.id, !!ev.isFeatured)}
                            className={`px-2 py-1 border text-[10px] uppercase font-bold ${
                              ev.isFeatured ? 'bg-[#C8FF16] text-black border-[#C8FF16]' : 'bg-[#171914] text-white/60 border-white/20'
                            }`}
                          >
                            {ev.isFeatured ? 'FEATURED' : 'FEATURE'}
                          </button>
                          <Link
                            href={`/events/${ev.slug}`}
                            className="p-1 text-white/60 hover:text-white"
                            title="Inspect"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 3. ORGANIZER KYC */}
          {activeTab === 'kyc' && (
            <div className="space-y-4">
              {organizers.map(org => (
                <div key={org.id} className="p-6 bg-[#0e100c] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={org.logoUrl} alt={org.name} className="w-16 h-16 object-cover border border-white/20" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black uppercase text-white">{org.name}</h3>
                        <span className="px-2 py-0.5 bg-[#C8FF16]/20 text-[#C8FF16] text-[10px] uppercase font-bold">
                          {org.kycStatus.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 font-sans mt-0.5">
                        GSTIN: {org.gstin || '27AABCS1429M1ZB'} • PAN: {org.panNumber || 'AABCS1429M'}
                      </p>
                      <div className="text-[11px] text-white/40 mt-1">
                        Bank: {org.bankDetails?.bankName || 'HDFC Bank, Fort Branch Mumbai'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!org.isVerified && (
                      <button
                        onClick={() => handleApproveKyc(org.id)}
                        className="px-4 py-2 bg-[#C8FF16] text-black font-black uppercase text-xs"
                      >
                        APPROVE KYC BADGE
                      </button>
                    )}
                    <Link
                      href={`/organizer/${org.slug}`}
                      className="px-3 py-2 bg-black border border-white/20 text-xs font-bold uppercase text-white hover:bg-white hover:text-black"
                    >
                      VIEW PROFILE ↗
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. SETTLEMENTS */}
          {activeTab === 'settlements' && (
            <div className="bg-[#0e100c] border border-white/10 overflow-x-auto">
              <table className="w-full text-left text-xs text-white">
                <thead className="bg-black text-[10px] uppercase text-white/50 border-b border-white/10">
                  <tr>
                    <th className="p-4">INVOICE</th>
                    <th className="p-4">HOST ENTITY</th>
                    <th className="p-4">EVENT</th>
                    <th className="p-4">GROSS SALES</th>
                    <th className="p-4">NET SETTLEMENT</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {settlements.map(set => (
                    <tr key={set.id} className="hover:bg-white/5">
                      <td className="p-4 font-bold text-[#C8FF16]">{set.invoiceNumber}</td>
                      <td className="p-4 font-bold">{set.organizerName}</td>
                      <td className="p-4 font-sans">{set.eventTitle}</td>
                      <td className="p-4">₹{set.grossSales.toLocaleString('en-IN')}</td>
                      <td className="p-4 font-black text-white">₹{set.netPayoutAmount.toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[9px] uppercase font-bold ${
                          set.status === 'settled' ? 'bg-[#C8FF16] text-black' : 'bg-[#FF6B00]/20 text-[#FF6B00]'
                        }`}>
                          {set.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {set.status !== 'settled' && (
                          <button
                            onClick={() => handleReleaseSettlement(set.id)}
                            className="px-3 py-1.5 bg-[#C8FF16] hover:bg-[#b8ea14] text-black font-black uppercase text-[10px]"
                          >
                            RELEASE PAYOUT
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 5. REFUNDS */}
          {activeTab === 'refunds' && (
            <div className="space-y-4">
              {pendingRefunds.length > 0 ? (
                pendingRefunds.map(ord => (
                  <div key={ord.id} className="p-6 bg-[#0e100c] border border-[#FF6B00] space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-black uppercase text-white">{ord.customerName}</div>
                        <div className="text-xs text-white/60">ORDER: {ord.orderNumber} • ₹{ord.totalAmount.toLocaleString('en-IN')}</div>
                        <p className="text-xs text-[#FF6B00] font-sans mt-2">
                          Reason: {ord.refundReason || 'Customer requested refund'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleProcessRefund(ord.id, true)}
                          className="px-4 py-2 bg-[#C8FF16] text-black font-black uppercase text-xs"
                        >
                          APPROVE & RELEASE INVENTORY
                        </button>
                        <button
                          onClick={() => handleProcessRefund(ord.id, false)}
                          className="px-4 py-2 bg-[#FF314A] text-white font-bold uppercase text-xs"
                        >
                          REJECT CLAIM
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center bg-[#0d0f0c] border border-white/10 text-white/50">
                  NO PENDING REFUND CLAIMS ON PROTOCOL
                </div>
              )}
            </div>
          )}

          {/* 6. USERS */}
          {activeTab === 'users' && (
            <div className="bg-[#0e100c] border border-white/10 overflow-x-auto">
              <table className="w-full text-left text-xs text-white">
                <thead className="bg-black text-[10px] uppercase text-white/50 border-b border-white/10">
                  <tr>
                    <th className="p-4">USER NAME</th>
                    <th className="p-4">EMAIL</th>
                    <th className="p-4">PHONE</th>
                    <th className="p-4">ROLE</th>
                    <th className="p-4">CITY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {usersList.map(u => (
                    <tr key={u.id} className="hover:bg-white/5">
                      <td className="p-4 font-bold">{u.name}</td>
                      <td className="p-4 font-mono text-white/70">{u.email}</td>
                      <td className="p-4">{u.phone}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-[#C8FF16]/20 text-[#C8FF16] font-bold text-[10px] uppercase">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-white/60">{u.city}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-[#0e100c] border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase">Paid orders</div>
                  <div className="text-2xl font-black text-white">{reports?.paidOrderCount ?? orders.filter(o => o.paymentStatus === 'paid').length}</div>
                </div>
                <div className="p-5 bg-[#0e100c] border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase">Refund rate</div>
                  <div className="text-2xl font-black text-[#FF6B00]">{reports?.refundRate ?? 0}%</div>
                </div>
                <div className="p-5 bg-[#0e100c] border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase">Pending KYC / listings</div>
                  <div className="text-2xl font-black text-[#C8FF16]">{reports?.pendingKyc ?? pendingKycCount} / {reports?.pendingApprovals ?? pendingApprovalsCount}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-6 bg-[#0e100c] border border-white/10 space-y-3">
                  <div className="text-xs font-black uppercase text-white pb-2 border-b border-white/10">GMV by city</div>
                  {Object.entries((reports?.gmvByCity || {}) as Record<string, number>).map(([city, value]) => (
                    <div key={city} className="flex justify-between text-xs">
                      <span className="text-white/60 uppercase">{city}</span>
                      <span className="font-bold text-white">₹{Number(value).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  {!reports?.gmvByCity && <div className="text-xs text-white/40">Loading live report…</div>}
                </div>
                <div className="p-6 bg-[#0e100c] border border-white/10 space-y-3">
                  <div className="text-xs font-black uppercase text-white pb-2 border-b border-white/10">Top events by passes</div>
                  {(reports?.topEvents || events.slice(0, 5)).map((ev: any) => (
                    <div key={ev.id} className="flex justify-between text-xs">
                      <span className="text-white font-bold truncate pr-4">{ev.title}</span>
                      <span className="text-[#C8FF16]">{ev.ticketsSold ?? ev.totalTicketsSold}/{ev.capacity ?? ev.totalCapacity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 7. AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="bg-[#0e100c] border border-white/10 p-6 space-y-3 font-mono text-xs">
              <div className="text-white font-bold uppercase pb-3 border-b border-white/10">
                PLATFORM CRYPTOGRAPHIC AUDIT STREAM
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-3 bg-black/60 border border-white/10 flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="text-[#C8FF16] font-bold uppercase">[{log.action}]</div>
                      <div className="text-white/80 font-sans">{log.details}</div>
                      <div className="text-[10px] text-white/40">
                        ADMIN: {log.adminEmail} • IP: {log.ipAddress}
                      </div>
                    </div>
                    <div className="text-[10px] text-white/40 shrink-0">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </main>

      <Footer />
      <LoginModal />
    </div>
  );
}

function AdminCommandCenterContent() {
  return <CommandCenterContent />;
}
