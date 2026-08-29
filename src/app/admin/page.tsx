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
import { ToastProvider, useToast } from '@/context/ToastContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
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
  return (
    <ToastProvider>
      <AuthProvider>
        <AdminCommandCenterContent />
      </AuthProvider>
    </ToastProvider>
  );
}

function CommandCenterContent() {
  const { user } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'kpis' | 'events' | 'kyc' | 'settlements' | 'refunds' | 'users' | 'audit'>('kpis');
  
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
    toast.info('FEATURED STATUS UPDATED', `Event billboard priority adjusted.`);
  };

  const handleApproveEvent = (eventId: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'published' } : e));
    toast.success('EVENT APPROVED', 'Listing is now active across all Gate Zero radars.');
  };

  const handleApproveKyc = (orgId: string) => {
    setOrganizers(prev => prev.map(o => o.id === orgId ? { ...o, isVerified: true, kycStatus: 'verified' } : o));
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
    <div className="min-h-screen bg-background text-foreground flex flex-col font-mono selection:bg-accent selection:text-black">
      <RoleBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Admin Header */}
        <div className="pb-6 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-danger" />
              <span className="text-[10px] uppercase tracking-widest text-danger font-bold">
                GATE ZERO CORE PLATFORM // CHIEF CONTROLLER
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground mt-1">
              SYSTEM COMMAND CENTER
            </h1>
            <p className="text-xs text-muted-foreground font-sans mt-0.5">
              Superadmin: <strong className="text-foreground">{user?.name || 'Dev Malik'}</strong> • Multi-City Cultural Ticketing Exchange
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 bg-black border border-accent text-accent font-bold">
              SYS_INTEGRITY: 100%
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex overflow-x-auto border-b border-border/50 gap-2 text-xs">
          {[
            { id: 'kpis', label: 'Platform KPIs', icon: Activity },
            { id: 'events', label: `Event Approvals (${events.length})`, icon: Calendar },
            { id: 'kyc', label: `Organizer KYC (${organizers.length})`, icon: Building2 },
            { id: 'settlements', label: `Payouts & Settlements (${settlements.length})`, icon: DollarSign },
            { id: 'refunds', label: `Disputes & Refunds (${pendingRefunds.length})`, icon: RotateCcw },
            { id: 'users', label: 'User Roles', icon: Users },
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
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
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
                <div className="p-6 bg-card border border-border/50 space-y-1">
                  <div className="text-[10px] text-muted-foreground uppercase">PLATFORM GMV (ALL CITIES)</div>
                  <div className="text-3xl font-black text-foreground">₹{totalGMV.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-accent">↑ 31.4% Monthly Velocity</div>
                </div>

                <div className="p-6 bg-card border border-border/50 space-y-1">
                  <div className="text-[10px] text-muted-foreground uppercase">GATE ZERO NET REVENUE</div>
                  <div className="text-3xl font-black text-accent">₹{platformRevenue.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-muted-foreground">5% Platform Fee + ₹49 pass charge</div>
                </div>

                <div className="p-6 bg-card border border-border/50 space-y-1">
                  <div className="text-[10px] text-muted-foreground uppercase">ACTIVE RADAR PRODUCTIONS</div>
                  <div className="text-3xl font-black text-foreground">{events.length}</div>
                  <div className="text-[10px] text-muted-foreground">Mumbai, BLR, Delhi, Goa, Pune</div>
                </div>

                <div className="p-6 bg-card border border-border/50 space-y-1">
                  <div className="text-[10px] text-muted-foreground uppercase">REGISTERED ATTENDEES</div>
                  <div className="text-3xl font-black text-foreground">4,820</div>
                  <div className="text-[10px] text-muted-foreground">0.02% Dispute Rate</div>
                </div>
              </div>

              {/* City Breakdown Grid */}
              <div className="p-6 bg-card border border-border/50 space-y-4">
                <div className="text-xs font-black uppercase text-foreground pb-3 border-b border-border/50">
                  METROPOLITAN MARKET SHARE (INR)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-xs">
                  <div className="p-3 bg-black/60 border border-border/50">
                    <div className="text-[10px] text-accent">MUMBAI [MUM]</div>
                    <div className="text-base font-bold text-foreground mt-1">₹34.8L</div>
                    <div className="text-[9px] text-muted-foreground">51% Volume</div>
                  </div>
                  <div className="p-3 bg-black/60 border border-border/50">
                    <div className="text-[10px] text-accent">BENGALURU [BLR]</div>
                    <div className="text-base font-bold text-foreground mt-1">₹18.2L</div>
                    <div className="text-[9px] text-muted-foreground">26% Volume</div>
                  </div>
                  <div className="p-3 bg-black/60 border border-border/50">
                    <div className="text-[10px] text-accent">GOA [GOA]</div>
                    <div className="text-base font-bold text-foreground mt-1">₹8.9L</div>
                    <div className="text-[9px] text-muted-foreground">13% Volume</div>
                  </div>
                  <div className="p-3 bg-black/60 border border-border/50">
                    <div className="text-[10px] text-accent">DELHI NCR [DEL]</div>
                    <div className="text-base font-bold text-foreground mt-1">₹4.5L</div>
                    <div className="text-[9px] text-muted-foreground">7% Volume</div>
                  </div>
                  <div className="p-3 bg-black/60 border border-border/50">
                    <div className="text-[10px] text-accent">PUNE [PNE]</div>
                    <div className="text-base font-bold text-foreground mt-1">₹2.0L</div>
                    <div className="text-[9px] text-muted-foreground">3% Volume</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. EVENTS MODERATION */}
          {activeTab === 'events' && (
            <div className="bg-card border border-border/50 overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground">
                <thead className="bg-black text-[10px] uppercase text-muted-foreground border-b border-border/50">
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
                    <tr key={ev.id} className="hover:bg-foreground/5">
                      <td className="p-4 font-bold text-accent">{ev.code}</td>
                      <td className="p-4 font-bold">{ev.title}</td>
                      <td className="p-4 text-muted-foreground">{ev.city} • {ev.venueName}</td>
                      <td className="p-4">{ev.organizerName}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-black border border-border text-[10px] uppercase font-bold">
                          {ev.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleFeature(ev.id, !!ev.isFeatured)}
                            className={`px-2 py-1 border text-[10px] uppercase font-bold ${
                              ev.isFeatured ? 'bg-accent text-black border-accent' : 'bg-card text-muted-foreground border-border'
                            }`}
                          >
                            {ev.isFeatured ? 'FEATURED' : 'FEATURE'}
                          </button>
                          <Link
                            href={`/events/${ev.slug}`}
                            className="p-1 text-muted-foreground hover:text-foreground"
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
                <div key={org.id} className="p-6 bg-card border border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={org.logoUrl} alt={org.name} className="w-16 h-16 object-cover border border-border" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black uppercase text-foreground">{org.name}</h3>
                        <span className="px-2 py-0.5 bg-accent/20 text-accent text-[10px] uppercase font-bold">
                          {org.kycStatus.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-sans mt-0.5">
                        GSTIN: {org.gstin || '27AABCS1429M1ZB'} • PAN: {org.panNumber || 'AABCS1429M'}
                      </p>
                      <div className="text-[11px] text-muted-foreground mt-1">
                        Bank: {org.bankDetails?.bankName || 'HDFC Bank, Fort Branch Mumbai'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!org.isVerified && (
                      <button
                        onClick={() => handleApproveKyc(org.id)}
                        className="px-4 py-2 bg-accent text-black font-black uppercase text-xs"
                      >
                        APPROVE KYC BADGE
                      </button>
                    )}
                    <Link
                      href={`/organizer/${org.slug}`}
                      className="px-3 py-2 bg-black border border-border text-xs font-bold uppercase text-foreground hover:bg-foreground hover:text-black"
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
            <div className="bg-card border border-border/50 overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground">
                <thead className="bg-black text-[10px] uppercase text-muted-foreground border-b border-border/50">
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
                    <tr key={set.id} className="hover:bg-foreground/5">
                      <td className="p-4 font-bold text-accent">{set.invoiceNumber}</td>
                      <td className="p-4 font-bold">{set.organizerName}</td>
                      <td className="p-4 font-sans">{set.eventTitle}</td>
                      <td className="p-4">₹{set.grossSales.toLocaleString('en-IN')}</td>
                      <td className="p-4 font-black text-foreground">₹{set.netPayoutAmount.toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[9px] uppercase font-bold ${
                          set.status === 'settled' ? 'bg-accent text-black' : 'bg-danger/20 text-danger'
                        }`}>
                          {set.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {set.status !== 'settled' && (
                          <button
                            onClick={() => handleReleaseSettlement(set.id)}
                            className="px-3 py-1.5 bg-accent hover:bg-accent-hover text-black font-black uppercase text-[10px]"
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
                  <div key={ord.id} className="p-6 bg-card border border-danger space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-black uppercase text-foreground">{ord.customerName}</div>
                        <div className="text-xs text-muted-foreground">ORDER: {ord.orderNumber} • ₹{ord.totalAmount.toLocaleString('en-IN')}</div>
                        <p className="text-xs text-danger font-sans mt-2">
                          Reason: {ord.refundReason || 'Customer requested refund'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleProcessRefund(ord.id, true)}
                          className="px-4 py-2 bg-accent text-black font-black uppercase text-xs"
                        >
                          APPROVE & RELEASE INVENTORY
                        </button>
                        <button
                          onClick={() => handleProcessRefund(ord.id, false)}
                          className="px-4 py-2 bg-danger text-foreground font-bold uppercase text-xs"
                        >
                          REJECT CLAIM
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center bg-card border border-border/50 text-muted-foreground">
                  NO PENDING REFUND CLAIMS ON PROTOCOL
                </div>
              )}
            </div>
          )}

          {/* 6. USERS */}
          {activeTab === 'users' && (
            <div className="bg-card border border-border/50 overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground">
                <thead className="bg-black text-[10px] uppercase text-muted-foreground border-b border-border/50">
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
                    <tr key={u.id} className="hover:bg-foreground/5">
                      <td className="p-4 font-bold">{u.name}</td>
                      <td className="p-4 font-mono text-foreground/70">{u.email}</td>
                      <td className="p-4">{u.phone}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-accent/20 text-accent font-bold text-[10px] uppercase">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{u.city}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 7. AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="bg-card border border-border/50 p-6 space-y-3 font-mono text-xs">
              <div className="text-foreground font-bold uppercase pb-3 border-b border-border/50">
                PLATFORM CRYPTOGRAPHIC AUDIT STREAM
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-3 bg-black/60 border border-border/50 flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="text-accent font-bold uppercase">[{log.action}]</div>
                      <div className="text-foreground/80 font-sans">{log.details}</div>
                      <div className="text-[10px] text-muted-foreground">
                        ADMIN: {log.adminEmail} • IP: {log.ipAddress}
                      </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground shrink-0">
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
