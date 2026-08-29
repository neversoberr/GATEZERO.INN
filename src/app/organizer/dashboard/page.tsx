'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleBanner } from '@/components/layout/RoleBanner';
import { LoginModal } from '@/components/auth/LoginModal';
import { Event, Order, OrganizerCompany, TicketTier, PromoCode, PromoterProfile } from '@/types';
import { 
  INITIAL_EVENTS, 
  INITIAL_ORDERS, 
  INITIAL_ORGANIZERS, 
  INITIAL_PROMO_CODES, 
  INITIAL_PROMOTERS,
  INITIAL_SETTLEMENTS
} from '@/lib/data/initial-data';
import { ToastProvider, useToast } from '@/context/ToastContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Receipt, 
  Share2, 
  Tag, 
  ScanLine, 
  Building2, 
  DollarSign, 
  PlusCircle, 
  ArrowUpRight, 
  Download, 
  Eye, 
  Pause, 
  Play, 
  Trash2, 
  Copy, 
  Search, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Mail 
} from 'lucide-react';

function OrganizerDashboardContent() {
  const { user } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'attendees' | 'orders' | 'promoters' | 'finance' | 'staff'>('overview');
  
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [promoters, setPromoters] = useState<PromoterProfile[]>(INITIAL_PROMOTERS);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(INITIAL_PROMO_CODES);
  const [settlements, setSettlements] = useState(INITIAL_SETTLEMENTS);

  // Search in attendees
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string>('all');

  // New Promo Modal
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState(10);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState('');

  // Fetch live state
  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => { if (data.success) setEvents(data.events); })
      .catch(() => {});

    fetch('/api/orders')
      .then(res => res.json())
      .then(data => { if (data.success) setOrders(data.orders); })
      .catch(() => {});

    fetch('/api/promoters')
      .then(res => res.json())
      .then(data => { if (data.success) setPromoters(data.promoters); })
      .catch(() => {});
  }, []);

  // Filter SubKulture / active organizer events
  const myEvents = events.filter(e => e.organizerId === 'org_subkulture' || e.organizerId === user?.organizerCompanyId);
  const myOrders = orders.filter(o => myEvents.some(e => e.id === o.eventId));

  // Compute metrics
  const totalGross = myOrders.reduce((sum, o) => sum + o.totalAmount, 0) + 3840000;
  const netRevenue = Math.round(totalGross * 0.93);
  const totalPassesSold = myEvents.reduce((sum, e) => sum + e.totalTicketsSold, 0) + 940;
  const nextSettlement = 1490317;

  // Flattened Attendees
  const allAttendees = myOrders.flatMap(o => 
    o.attendees.map(a => ({ ...a, order: o }))
  );

  const filteredAttendees = allAttendees.filter(a => {
    const matchesEvent = selectedEventId === 'all' || a.order.eventId === selectedEventId;
    const q = attendeeSearch.toLowerCase();
    const matchesSearch = !q || a.fullName.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.ticketCode.toLowerCase().includes(q);
    return matchesEvent && matchesSearch;
  });

  const handleToggleEventStatus = (eventId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'published' ? 'paused' : 'published';
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: nextStatus as any } : e));
    toast.info('EVENT STATUS UPDATED', `Sales status set to ${nextStatus.toUpperCase()}`);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode) return;
    const codeObj: PromoCode = {
      id: `promo_${Date.now()}`,
      code: newPromoCode.trim().toUpperCase(),
      discountType: 'percentage',
      discountValue: Number(newPromoDiscount),
      totalLimit: 100,
      usedCount: 0,
      expiryDate: '2026-12-31T23:59:59Z',
      isActive: true
    };
    setPromoCodes([codeObj, ...promoCodes]);
    setIsPromoModalOpen(false);
    setNewPromoCode('');
    toast.success('PROMO CODE CREATED', `${codeObj.code} (${codeObj.discountValue}% OFF) is now live.`);
  };

  const handleExportCSV = () => {
    toast.success('ATTENDEE CSV EXPORTED', 'Encrypted spreadsheet downloaded for door staff & marketing.');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-mono selection:bg-accent selection:text-black">
      <RoleBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Top Control Header */}
        <div className="pb-6 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-accent animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-accent font-bold">
                GATE ZERO / CONTROL CONSOLE
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground mt-1">
              GOOD EVENING, SUBKULTURE.
            </h1>
            <p className="text-xs text-muted-foreground font-sans mt-0.5">
              Verified Host • Mumbai HQ • 4 Active Transmissions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/organizer/events/new"
              className="px-4 py-2.5 bg-accent hover:bg-accent-hover text-black font-black uppercase text-xs flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>CREATE NEW EVENT ↗</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Nav Tabs */}
        <div className="flex overflow-x-auto border-b border-border/50 mt-4 gap-2 text-xs">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'events', label: `My Events (${myEvents.length})`, icon: Calendar },
            { id: 'attendees', label: 'Audience & Broadcast', icon: Users },
            { id: 'orders', label: 'Transactions', icon: Receipt },
            { id: 'promoters', label: 'Affiliates & Promos', icon: Share2 },
            { id: 'finance', label: 'Finance & Settlements', icon: DollarSign },
            { id: 'staff', label: 'Door Staff & Gates', icon: ScanLine },
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
        <div className="py-8">
          
          {/* 1. OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Metric KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-card border border-border/50 space-y-1">
                  <div className="text-[10px] text-muted-foreground uppercase">GROSS TICKET GMV</div>
                  <div className="text-2xl font-black text-foreground">
                    ₹{totalGross.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-accent flex items-center gap-1">
                    ↑ 24.8% vs last cycle
                  </div>
                </div>

                <div className="p-5 bg-card border border-border/50 space-y-1">
                  <div className="text-[10px] text-muted-foreground uppercase">NET ORGANIZER PAYOUT</div>
                  <div className="text-2xl font-black text-accent">
                    ₹{netRevenue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-muted-foreground">After 5% fee & GST</div>
                </div>

                <div className="p-5 bg-card border border-border/50 space-y-1">
                  <div className="text-[10px] text-muted-foreground uppercase">PASSES ISSUED</div>
                  <div className="text-2xl font-black text-foreground">
                    {totalPassesSold.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-muted-foreground">82.4% avg door capacity</div>
                </div>

                <div className="p-5 bg-card border border-accent/30 bg-card space-y-1">
                  <div className="text-[10px] text-accent uppercase font-bold">NEXT SETTLEMENT</div>
                  <div className="text-2xl font-black text-foreground">
                    ₹{nextSettlement.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Scheduled 08.09.26</div>
                </div>
              </div>

              {/* Analytical Visuals Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Sales Velocity Chart */}
                <div className="lg:col-span-8 bg-card border border-border/50 p-6 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-border/50 text-xs">
                    <div className="font-black uppercase text-foreground">
                      HOURLY PASS SALES VELOCITY
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase">
                      PEAK CONVERSION: 23:00 - 02:00
                    </div>
                  </div>

                  {/* Simulated Brutalist Bar Chart */}
                  <div className="h-48 flex items-end justify-between gap-2 pt-4 px-2">
                    {[
                      { label: 'MON', val: 35 },
                      { label: 'TUE', val: 55 },
                      { label: 'WED', val: 40 },
                      { label: 'THU', val: 78 },
                      { label: 'FRI', val: 95 },
                      { label: 'SAT', val: 100 },
                      { label: 'SUN', val: 65 },
                      { label: 'TODAY', val: 85 }
                    ].map((bar, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <div
                          style={{ height: `${bar.val}%` }}
                          className={`w-full transition-all group-hover:brightness-125 ${
                            bar.label === 'TODAY' ? 'bg-accent' : 'bg-foreground/20'
                          }`}
                        />
                        <span className="text-[9px] text-muted-foreground group-hover:text-foreground uppercase font-bold">
                          {bar.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tier & Traffic Breakdown */}
                <div className="lg:col-span-4 bg-card border border-border/50 p-6 space-y-4">
                  <div className="pb-3 border-b border-border/50 text-xs font-black uppercase text-foreground">
                    PASS DEMAND BY TIER
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between text-foreground/70 mb-1">
                        <span>Phase 1 & Early Bird</span>
                        <span className="font-bold text-accent">100% SOLD</span>
                      </div>
                      <div className="w-full h-2 bg-black border border-border/50 overflow-hidden">
                        <div className="w-full h-full bg-accent" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-foreground/70 mb-1">
                        <span>Phase 2 Current Tier</span>
                        <span className="font-bold text-foreground">86% ALLOCATED</span>
                      </div>
                      <div className="w-full h-2 bg-black border border-border/50 overflow-hidden">
                        <div className="w-[86%] h-full bg-foreground" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-foreground/70 mb-1">
                        <span>VIP / Backstage Deck</span>
                        <span className="font-bold text-foreground">54% ALLOCATED</span>
                      </div>
                      <div className="w-full h-2 bg-black border border-border/50 overflow-hidden">
                        <div className="w-[54%] h-full bg-accent" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50 text-[10px] text-muted-foreground space-y-1">
                    <div>REFERRAL TRAFFIC: 42% INSTAGRAM • 38% GATE ZERO RADAR • 20% PROMOTERS</div>
                  </div>
                </div>

              </div>

              {/* Quick Actions Table */}
              <div className="bg-card border border-border/50 p-6 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <span className="text-xs font-black uppercase text-foreground">ACTIVE PRODUCTIONS</span>
                  <Link href="/organizer/events/new" className="text-xs text-accent font-bold hover:underline">
                    + NEW EVENT
                  </Link>
                </div>

                <div className="space-y-3">
                  {myEvents.map(ev => (
                    <div key={ev.id} className="p-4 bg-black/60 border border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-black text-foreground">{ev.title}</span>
                          <span className="text-accent">[{ev.code}]</span>
                          <span className="px-1.5 py-0.2 bg-black border border-border text-[9px] uppercase">
                            {ev.status}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground font-sans mt-0.5">
                          {ev.venueName} • {ev.city} • {ev.totalTicketsSold}/{ev.totalCapacity} Sold
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <Link
                          href={`/events/${ev.slug}`}
                          className="p-2 bg-card hover:bg-foreground hover:text-black border border-border"
                          title="View Live Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleToggleEventStatus(ev.id, ev.status)}
                          className="px-3 py-1.5 bg-card hover:bg-foreground hover:text-black border border-border uppercase font-bold text-[11px]"
                        >
                          {ev.status === 'published' ? 'Pause Sales' : 'Resume Sales'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 2. MY EVENTS */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground font-bold uppercase">
                  MANAGE {myEvents.length} EVENT PRODUCTIONS
                </div>
                <Link
                  href="/organizer/events/new"
                  className="px-4 py-2 bg-accent text-black font-black uppercase text-xs flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>ADD EVENT</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myEvents.map(ev => (
                  <div key={ev.id} className="p-6 bg-card border border-border/50 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-accent uppercase font-bold">{ev.code}</span>
                        <h3 className="text-lg font-black uppercase text-foreground mt-0.5">{ev.title}</h3>
                        <p className="text-xs text-muted-foreground font-sans">{ev.venueName}, {ev.city}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-black border border-border text-[10px] text-foreground uppercase font-bold">
                        {ev.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs py-2 border-y border-border/50">
                      <div>
                        <div className="text-[9px] text-muted-foreground uppercase">SOLD</div>
                        <div className="font-bold text-foreground">{ev.totalTicketsSold}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-muted-foreground uppercase">CAPACITY</div>
                        <div className="font-bold text-foreground">{ev.totalCapacity}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-muted-foreground uppercase">VIEWS</div>
                        <div className="font-bold text-accent">{ev.viewsCount}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <Link
                        href={`/events/${ev.slug}`}
                        className="flex-1 py-2 bg-black border border-border text-center uppercase font-bold text-foreground hover:bg-foreground hover:text-black"
                      >
                        VIEW PUBLIC PASS ↗
                      </Link>
                      <button
                        onClick={() => handleToggleEventStatus(ev.id, ev.status)}
                        className="px-3 py-2 bg-card hover:bg-foreground hover:text-black border border-border uppercase font-bold"
                      >
                        {ev.status === 'published' ? 'PAUSE' : 'RESUME'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. AUDIENCE & ATTENDEES */}
          {activeTab === 'attendees' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search attendee name, email, or pass code..."
                      value={attendeeSearch}
                      onChange={e => setAttendeeSearch(e.target.value)}
                      className="w-full bg-black border border-border px-3 py-2 pl-9 text-xs text-foreground"
                    />
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  </div>

                  <select
                    value={selectedEventId}
                    onChange={e => setSelectedEventId(e.target.value)}
                    className="bg-black border border-border px-3 py-2 text-xs text-foreground uppercase"
                  >
                    <option value="all">ALL EVENTS</option>
                    {myEvents.map(e => (
                      <option key={e.id} value={e.id}>{e.title}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBroadcastModalOpen(true)}
                    className="px-3 py-2 bg-card hover:bg-foreground hover:text-black border border-border text-xs font-bold uppercase flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>BROADCAST EMAIL</span>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="px-3 py-2 bg-accent text-black font-black uppercase text-xs flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>EXPORT CSV</span>
                  </button>
                </div>
              </div>

              {/* Attendees Table */}
              <div className="bg-card border border-border/50 overflow-x-auto">
                <table className="w-full text-left text-xs text-foreground">
                  <thead className="bg-black text-[10px] uppercase text-muted-foreground border-b border-border/50">
                    <tr>
                      <th className="p-4">TICKET CODE</th>
                      <th className="p-4">ATTENDEE NAME</th>
                      <th className="p-4">TIER</th>
                      <th className="p-4">EVENT</th>
                      <th className="p-4">DOOR STATUS</th>
                      <th className="p-4">GATE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredAttendees.map(att => (
                      <tr key={att.id} className="hover:bg-foreground/5">
                        <td className="p-4 font-mono font-bold text-accent">{att.ticketCode}</td>
                        <td className="p-4">
                          <div className="font-bold">{att.fullName}</div>
                          <div className="text-[10px] text-muted-foreground">{att.email}</div>
                        </td>
                        <td className="p-4 text-foreground/80">{att.tierName}</td>
                        <td className="p-4 font-sans max-w-xs truncate">{att.order.eventTitle}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-[9px] font-black uppercase ${
                            att.isCheckedIn ? 'bg-accent text-black' : 'bg-black text-muted-foreground border border-border'
                          }`}>
                            {att.isCheckedIn ? 'CHECKED IN' : 'NOT ENTERED'}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground">{att.gateAssigned || 'GATE 01'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-card border border-border/50 overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground">
                <thead className="bg-black text-[10px] uppercase text-muted-foreground border-b border-border/50">
                  <tr>
                    <th className="p-4">ORDER ID</th>
                    <th className="p-4">CUSTOMER</th>
                    <th className="p-4">EVENT</th>
                    <th className="p-4">PASSES</th>
                    <th className="p-4">NET AMOUNT</th>
                    <th className="p-4">PAY METHOD</th>
                    <th className="p-4">DATE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {myOrders.map(ord => (
                    <tr key={ord.id} className="hover:bg-foreground/5">
                      <td className="p-4 font-bold text-accent">{ord.orderNumber}</td>
                      <td className="p-4 font-bold">{ord.customerName}</td>
                      <td className="p-4 font-sans">{ord.eventTitle}</td>
                      <td className="p-4">{ord.attendees.length}</td>
                      <td className="p-4 font-bold">₹{ord.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="p-4">{ord.paymentMethod}</td>
                      <td className="p-4 text-muted-foreground">{new Date(ord.createdAt).toLocaleDateString('en-GB')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 5. PROMOTERS & AFFILIATES */}
          {activeTab === 'promoters' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground font-bold uppercase">
                  ACTIVE PROMOTERS & TRACKING CAMPAIGNS
                </div>
                <button
                  onClick={() => setIsPromoModalOpen(true)}
                  className="px-4 py-2 bg-accent text-black font-black uppercase text-xs flex items-center gap-1.5"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>CREATE PROMO CODE</span>
                </button>
              </div>

              {/* Promoters List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {promoters.map(prom => (
                  <div key={prom.id} className="p-6 bg-card border border-border/50 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-base font-black uppercase text-foreground">{prom.name}</div>
                        <div className="text-xs text-accent">PROMO CODE: {prom.code}</div>
                      </div>
                      <span className="px-2 py-0.5 bg-black border border-border text-xs text-foreground font-bold">
                        {prom.commissionRate}% COMMISSION
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50 text-xs">
                      <div>
                        <div className="text-[9px] text-muted-foreground uppercase">CLICKS</div>
                        <div className="font-bold text-foreground">{prom.totalClicks}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-muted-foreground uppercase">PASSES SOLD</div>
                        <div className="font-bold text-foreground">{prom.totalSalesCount}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-muted-foreground uppercase">EARNED</div>
                        <div className="font-bold text-accent">₹{prom.totalCommissionEarned.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. FINANCE & SETTLEMENTS */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              <div className="p-6 bg-card border border-border/50 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <span className="text-xs font-black uppercase text-foreground">SETTLEMENT BANK ACCOUNT</span>
                  <span className="text-xs text-accent font-bold">✓ KYC VERIFIED</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase">ENTITY NAME</div>
                    <div className="text-foreground font-bold">SUBKULTURE EXPERIENCES LLP</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase">BANK & ACCOUNT</div>
                    <div className="text-foreground font-bold">HDFC BANK ••••••81920</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase">GSTIN / PAN</div>
                    <div className="text-foreground font-bold">27AABCS1429M1ZB</div>
                  </div>
                </div>
              </div>

              {/* Settlement History */}
              <div className="bg-card border border-border/50 overflow-x-auto">
                <table className="w-full text-left text-xs text-foreground">
                  <thead className="bg-black text-[10px] uppercase text-muted-foreground border-b border-border/50">
                    <tr>
                      <th className="p-4">INVOICE</th>
                      <th className="p-4">EVENT</th>
                      <th className="p-4">GROSS SALES</th>
                      <th className="p-4">FEE & TAX</th>
                      <th className="p-4">NET PAYOUT</th>
                      <th className="p-4">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {settlements.map(set => (
                      <tr key={set.id} className="hover:bg-foreground/5">
                        <td className="p-4 font-bold text-accent">{set.invoiceNumber}</td>
                        <td className="p-4 font-sans font-bold">{set.eventTitle}</td>
                        <td className="p-4">₹{set.grossSales.toLocaleString('en-IN')}</td>
                        <td className="p-4 text-muted-foreground">₹{(set.platformCommission + set.paymentGatewaysFee).toLocaleString('en-IN')}</td>
                        <td className="p-4 font-black text-foreground">₹{set.netPayoutAmount.toLocaleString('en-IN')}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-[9px] uppercase font-bold ${
                            set.status === 'settled' ? 'bg-accent text-black' : 'bg-danger/20 text-danger'
                          }`}>
                            {set.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. STAFF & SCANNING */}
          {activeTab === 'staff' && (
            <div className="space-y-6">
              <div className="p-6 bg-card border border-border/50 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <span className="text-xs font-black uppercase text-foreground">DOOR BOUNCER ACCESS KEYS</span>
                  <Link
                    href="/checkin"
                    className="px-3 py-1.5 bg-accent text-black text-xs font-bold uppercase flex items-center gap-1"
                  >
                    <ScanLine className="w-3.5 h-3.5" />
                    <span>LAUNCH DOOR TERMINAL ↗</span>
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground font-sans">
                  Provide this access code to your security team at the venue entrance. Door staff can scan QR codes in real-time or offline.
                </p>

                <div className="p-4 bg-black border border-border flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase">ACTIVE EVENT SCAN KEY</div>
                    <div className="text-lg font-bold text-accent">GZ-STAFF-REAY-8920</div>
                  </div>
                  <button
                    onClick={() => toast.success('KEY COPIED', 'Staff access pin copied.')}
                    className="px-3 py-2 bg-card text-foreground text-xs uppercase font-bold"
                  >
                    COPY KEY
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </main>

      <Footer />
      <LoginModal />

      {/* CREATE PROMO MODAL */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
          <div className="relative w-full max-w-md bg-card border border-accent p-6 text-foreground space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-border/50">
              <span className="text-xs font-bold text-accent">CREATE CAMPAIGN PROMO CODE</span>
              <button onClick={() => setIsPromoModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleCreatePromo} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase text-muted-foreground mb-1">PROMO CODE STRING</label>
                <input
                  type="text"
                  value={newPromoCode}
                  onChange={e => setNewPromoCode(e.target.value)}
                  placeholder="e.g. MONSOON20"
                  className="w-full bg-black border border-border p-2 text-xs text-foreground uppercase focus:border-accent"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-muted-foreground mb-1">DISCOUNT PERCENTAGE (%)</label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={newPromoDiscount}
                  onChange={e => setNewPromoDiscount(Number(e.target.value))}
                  className="w-full bg-black border border-border p-2 text-xs text-foreground"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-accent text-black font-black uppercase text-xs"
              >
                PUBLISH PROMO CODE ↗
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BROADCAST MODAL */}
      {broadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
          <div className="relative w-full max-w-md bg-card border border-border p-6 text-foreground space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-border/50">
              <span className="text-xs font-bold uppercase text-accent">BROADCAST TO CONFIRMED ATTENDEES</span>
              <button onClick={() => setBroadcastModalOpen(false)}>✕</button>
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                toast.success('BROADCAST DISPATCHED', 'SMS and Email sent to all pass holders.');
                setBroadcastModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[10px] uppercase text-muted-foreground mb-1">DISPATCH MESSAGE (WEATHER / SET TIME / VENUE ADVICE)</label>
                <textarea
                  rows={4}
                  value={broadcastMsg}
                  onChange={e => setBroadcastMsg(e.target.value)}
                  placeholder="Gate 01 opens at 21:00 sharp. Please bring original ID..."
                  className="w-full bg-black border border-border p-2.5 text-xs text-foreground focus:outline-none focus:border-accent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-accent text-black font-black uppercase text-xs"
              >
                DISPATCH TO ALL ↗
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function OrganizerDashboardPage() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Suspense fallback={<div className="min-h-screen bg-black text-foreground p-12 font-mono">LOADING CONTROL...</div>}>
          <OrganizerDashboardContent />
        </Suspense>
      </AuthProvider>
    </ToastProvider>
  );
}
