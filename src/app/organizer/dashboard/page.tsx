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
  INITIAL_PROMO_CODES, 
  INITIAL_PROMOTERS,
  INITIAL_SETTLEMENTS
} from '@/lib/data/initial-data';
import { downloadCsv, formatInr } from '@/lib/exports';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
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
    fetch('/api/events?status=all')
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

    fetch('/api/promo')
      .then(res => res.json())
      .then(data => { if (data.success && data.promoCodes) setPromoCodes(data.promoCodes); })
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

  const handleToggleEventStatus = async (eventId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'published' ? 'paused' : 'published';
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: nextStatus as any } : e));
    try {
      await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
    } catch {
      // local update still applied
    }
    toast.info('EVENT STATUS UPDATED', `Sales status set to ${nextStatus.toUpperCase()}`);
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
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
    try {
      const res = await fetch('/api/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(codeObj)
      });
      const data = await res.json();
      if (data.success && data.promo) {
        setPromoCodes([data.promo, ...promoCodes]);
      } else {
        setPromoCodes([codeObj, ...promoCodes]);
      }
    } catch {
      setPromoCodes([codeObj, ...promoCodes]);
    }
    setIsPromoModalOpen(false);
    setNewPromoCode('');
    toast.success('PROMO CODE CREATED', `${codeObj.code} (${codeObj.discountValue}% OFF) is now live.`);
  };

  const handleExportCSV = () => {
    downloadCsv(
      `gatezero-attendees-${Date.now()}.csv`,
      ['Ticket Code', 'Name', 'Email', 'Phone', 'Tier', 'Event', 'Checked In', 'Gate'],
      filteredAttendees.map(att => [
        att.ticketCode,
        att.fullName,
        att.email,
        att.phone,
        att.tierName,
        att.order.eventTitle,
        att.isCheckedIn ? 'YES' : 'NO',
        att.gateAssigned || 'GATE 01'
      ])
    );
    toast.success('ATTENDEE CSV EXPORTED', `${filteredAttendees.length} rows downloaded.`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F1F1EB] flex flex-col font-mono selection:bg-[#C8FF16] selection:text-black">
      <RoleBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Top Control Header */}
        <div className="pb-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-[#C8FF16] animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-[#C8FF16] font-bold">
                GATE ZERO / CONTROL CONSOLE
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
              GOOD EVENING, SUBKULTURE.
            </h1>
            <p className="text-xs text-white/50 font-sans mt-0.5">
              Verified Host • Mumbai HQ • 4 Active Transmissions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/organizer/events/new"
              className="px-4 py-2.5 bg-[#C8FF16] hover:bg-[#b8ea14] text-black font-black uppercase text-xs flex items-center gap-1.5 transition-transform active:scale-95 shadow-xl"
            >
              <PlusCircle className="w-4 h-4" />
              <span>CREATE NEW EVENT ↗</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Nav Tabs */}
        <div className="flex overflow-x-auto border-b border-white/10 mt-4 gap-2 text-xs">
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
        <div className="py-8">
          
          {/* 1. OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Metric KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-[#0e100c] border border-white/10 space-y-1">
                  <div className="text-[10px] text-white/50 uppercase">GROSS TICKET GMV</div>
                  <div className="text-2xl font-black text-white">
                    ₹{totalGross.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-[#C8FF16] flex items-center gap-1">
                    ↑ 24.8% vs last cycle
                  </div>
                </div>

                <div className="p-5 bg-[#0e100c] border border-white/10 space-y-1">
                  <div className="text-[10px] text-white/50 uppercase">NET ORGANIZER PAYOUT</div>
                  <div className="text-2xl font-black text-[#C8FF16]">
                    ₹{netRevenue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-white/40">After 5% fee & GST</div>
                </div>

                <div className="p-5 bg-[#0e100c] border border-white/10 space-y-1">
                  <div className="text-[10px] text-white/50 uppercase">PASSES ISSUED</div>
                  <div className="text-2xl font-black text-white">
                    {totalPassesSold.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-white/40">82.4% avg door capacity</div>
                </div>

                <div className="p-5 bg-[#0e100c] border border-[#C8FF16]/30 bg-[#12160e] space-y-1">
                  <div className="text-[10px] text-[#C8FF16] uppercase font-bold">NEXT SETTLEMENT</div>
                  <div className="text-2xl font-black text-white">
                    ₹{nextSettlement.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-white/60">Scheduled 08.09.26</div>
                </div>
              </div>

              {/* Analytical Visuals Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Sales Velocity Chart */}
                <div className="lg:col-span-8 bg-[#0e100c] border border-white/10 p-6 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-white/10 text-xs">
                    <div className="font-black uppercase text-white">
                      HOURLY PASS SALES VELOCITY
                    </div>
                    <div className="text-[10px] text-white/40 uppercase">
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
                            bar.label === 'TODAY' ? 'bg-[#C8FF16]' : 'bg-white/20'
                          }`}
                        />
                        <span className="text-[9px] text-white/50 group-hover:text-white uppercase font-bold">
                          {bar.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tier & Traffic Breakdown */}
                <div className="lg:col-span-4 bg-[#0e100c] border border-white/10 p-6 space-y-4">
                  <div className="pb-3 border-b border-white/10 text-xs font-black uppercase text-white">
                    PASS DEMAND BY TIER
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between text-white/70 mb-1">
                        <span>Phase 1 & Early Bird</span>
                        <span className="font-bold text-[#C8FF16]">100% SOLD</span>
                      </div>
                      <div className="w-full h-2 bg-black border border-white/10 overflow-hidden">
                        <div className="w-full h-full bg-[#C8FF16]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-white/70 mb-1">
                        <span>Phase 2 Current Tier</span>
                        <span className="font-bold text-white">86% ALLOCATED</span>
                      </div>
                      <div className="w-full h-2 bg-black border border-white/10 overflow-hidden">
                        <div className="w-[86%] h-full bg-white" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-white/70 mb-1">
                        <span>VIP / Backstage Deck</span>
                        <span className="font-bold text-white">54% ALLOCATED</span>
                      </div>
                      <div className="w-full h-2 bg-black border border-white/10 overflow-hidden">
                        <div className="w-[54%] h-full bg-[#7C46FF]" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 text-[10px] text-white/40 space-y-1">
                    <div>REFERRAL TRAFFIC: 42% INSTAGRAM • 38% GATE ZERO RADAR • 20% PROMOTERS</div>
                  </div>
                </div>

              </div>

              {/* Quick Actions Table */}
              <div className="bg-[#0e100c] border border-white/10 p-6 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-xs font-black uppercase text-white">ACTIVE PRODUCTIONS</span>
                  <Link href="/organizer/events/new" className="text-xs text-[#C8FF16] font-bold hover:underline">
                    + NEW EVENT
                  </Link>
                </div>

                <div className="space-y-3">
                  {myEvents.map(ev => (
                    <div key={ev.id} className="p-4 bg-black/60 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-black text-white">{ev.title}</span>
                          <span className="text-[#C8FF16]">[{ev.code}]</span>
                          <span className="px-1.5 py-0.2 bg-black border border-white/20 text-[9px] uppercase">
                            {ev.status}
                          </span>
                        </div>
                        <div className="text-xs text-white/50 font-sans mt-0.5">
                          {ev.venueName} • {ev.city} • {ev.totalTicketsSold}/{ev.totalCapacity} Sold
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <Link
                          href={`/events/${ev.slug}`}
                          className="p-2 bg-[#171914] hover:bg-white hover:text-black border border-white/20"
                          title="View Live Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleToggleEventStatus(ev.id, ev.status)}
                          className="px-3 py-1.5 bg-[#171914] hover:bg-white hover:text-black border border-white/20 uppercase font-bold text-[11px]"
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
                <div className="text-xs text-white/60 font-bold uppercase">
                  MANAGE {myEvents.length} EVENT PRODUCTIONS
                </div>
                <Link
                  href="/organizer/events/new"
                  className="px-4 py-2 bg-[#C8FF16] text-black font-black uppercase text-xs flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>ADD EVENT</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myEvents.map(ev => (
                  <div key={ev.id} className="p-6 bg-[#0e100c] border border-white/10 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-[#C8FF16] uppercase font-bold">{ev.code}</span>
                        <h3 className="text-lg font-black uppercase text-white mt-0.5">{ev.title}</h3>
                        <p className="text-xs text-white/60 font-sans">{ev.venueName}, {ev.city}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-black border border-white/20 text-[10px] text-white uppercase font-bold">
                        {ev.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs py-2 border-y border-white/10">
                      <div>
                        <div className="text-[9px] text-white/40 uppercase">SOLD</div>
                        <div className="font-bold text-white">{ev.totalTicketsSold}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-white/40 uppercase">CAPACITY</div>
                        <div className="font-bold text-white">{ev.totalCapacity}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-white/40 uppercase">VIEWS</div>
                        <div className="font-bold text-[#C8FF16]">{ev.viewsCount}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <Link
                        href={`/events/${ev.slug}`}
                        className="flex-1 py-2 bg-black border border-white/20 text-center uppercase font-bold text-white hover:bg-white hover:text-black"
                      >
                        VIEW PUBLIC PASS ↗
                      </Link>
                      <button
                        onClick={() => handleToggleEventStatus(ev.id, ev.status)}
                        className="px-3 py-2 bg-[#171914] hover:bg-white hover:text-black border border-white/20 uppercase font-bold"
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
                      className="w-full bg-black border border-white/20 px-3 py-2 pl-9 text-xs text-white"
                    />
                    <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
                  </div>

                  <select
                    value={selectedEventId}
                    onChange={e => setSelectedEventId(e.target.value)}
                    className="bg-black border border-white/20 px-3 py-2 text-xs text-white uppercase"
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
                    className="px-3 py-2 bg-[#171914] hover:bg-white hover:text-black border border-white/20 text-xs font-bold uppercase flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>BROADCAST EMAIL</span>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="px-3 py-2 bg-[#C8FF16] text-black font-black uppercase text-xs flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>EXPORT CSV</span>
                  </button>
                </div>
              </div>

              {/* Attendees Table */}
              <div className="bg-[#0e100c] border border-white/10 overflow-x-auto">
                <table className="w-full text-left text-xs text-white">
                  <thead className="bg-black text-[10px] uppercase text-white/50 border-b border-white/10">
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
                      <tr key={att.id} className="hover:bg-white/5">
                        <td className="p-4 font-mono font-bold text-[#C8FF16]">{att.ticketCode}</td>
                        <td className="p-4">
                          <div className="font-bold">{att.fullName}</div>
                          <div className="text-[10px] text-white/40">{att.email}</div>
                        </td>
                        <td className="p-4 text-white/80">{att.tierName}</td>
                        <td className="p-4 font-sans max-w-xs truncate">{att.order.eventTitle}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-[9px] font-black uppercase ${
                            att.isCheckedIn ? 'bg-[#C8FF16] text-black' : 'bg-black text-white/60 border border-white/20'
                          }`}>
                            {att.isCheckedIn ? 'CHECKED IN' : 'NOT ENTERED'}
                          </span>
                        </td>
                        <td className="p-4 text-white/60">{att.gateAssigned || 'GATE 01'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-[#0e100c] border border-white/10 overflow-x-auto">
              <table className="w-full text-left text-xs text-white">
                <thead className="bg-black text-[10px] uppercase text-white/50 border-b border-white/10">
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
                    <tr key={ord.id} className="hover:bg-white/5">
                      <td className="p-4 font-bold text-[#C8FF16]">{ord.orderNumber}</td>
                      <td className="p-4 font-bold">{ord.customerName}</td>
                      <td className="p-4 font-sans">{ord.eventTitle}</td>
                      <td className="p-4">{ord.attendees.length}</td>
                      <td className="p-4 font-bold">₹{ord.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="p-4">{ord.paymentMethod}</td>
                      <td className="p-4 text-white/60">{new Date(ord.createdAt).toLocaleDateString('en-GB')}</td>
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
                <div className="text-xs text-white/60 font-bold uppercase">
                  ACTIVE PROMOTERS & TRACKING CAMPAIGNS
                </div>
                <button
                  onClick={() => setIsPromoModalOpen(true)}
                  className="px-4 py-2 bg-[#C8FF16] text-black font-black uppercase text-xs flex items-center gap-1.5"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>CREATE PROMO CODE</span>
                </button>
              </div>

              {/* Promoters List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {promoters.map(prom => (
                  <div key={prom.id} className="p-6 bg-[#0e100c] border border-white/10 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-base font-black uppercase text-white">{prom.name}</div>
                        <div className="text-xs text-[#C8FF16]">PROMO CODE: {prom.code}</div>
                      </div>
                      <span className="px-2 py-0.5 bg-black border border-white/20 text-xs text-white font-bold">
                        {prom.commissionRate}% COMMISSION
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-xs">
                      <div>
                        <div className="text-[9px] text-white/40 uppercase">CLICKS</div>
                        <div className="font-bold text-white">{prom.totalClicks}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-white/40 uppercase">PASSES SOLD</div>
                        <div className="font-bold text-white">{prom.totalSalesCount}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-white/40 uppercase">EARNED</div>
                        <div className="font-bold text-[#C8FF16]">₹{prom.totalCommissionEarned.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#0e100c] border border-white/10 overflow-x-auto">
                <table className="w-full text-left text-xs text-white">
                  <thead className="bg-black text-[10px] uppercase text-white/50 border-b border-white/10">
                    <tr>
                      <th className="p-4">Code</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Value</th>
                      <th className="p-4">Used</th>
                      <th className="p-4">Limit</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {promoCodes.map(promo => (
                      <tr key={promo.id} className="hover:bg-white/5">
                        <td className="p-4 font-black text-[#C8FF16]">{promo.code}</td>
                        <td className="p-4 uppercase">{promo.discountType}</td>
                        <td className="p-4">{promo.discountType === 'percentage' ? `${promo.discountValue}%` : formatInr(promo.discountValue)}</td>
                        <td className="p-4">{promo.usedCount}</td>
                        <td className="p-4">{promo.totalLimit}</td>
                        <td className="p-4">{promo.isActive ? 'LIVE' : 'OFF'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. FINANCE & SETTLEMENTS */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              <div className="p-6 bg-[#0e100c] border border-white/10 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-xs font-black uppercase text-white">SETTLEMENT BANK ACCOUNT</span>
                  <span className="text-xs text-[#C8FF16] font-bold">✓ KYC VERIFIED</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="text-[10px] text-white/40 uppercase">ENTITY NAME</div>
                    <div className="text-white font-bold">SUBKULTURE EXPERIENCES LLP</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40 uppercase">BANK & ACCOUNT</div>
                    <div className="text-white font-bold">HDFC BANK ••••••81920</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40 uppercase">GSTIN / PAN</div>
                    <div className="text-white font-bold">27AABCS1429M1ZB</div>
                  </div>
                </div>
              </div>

              {/* Settlement History */}
              <div className="bg-[#0e100c] border border-white/10 overflow-x-auto">
                <table className="w-full text-left text-xs text-white">
                  <thead className="bg-black text-[10px] uppercase text-white/50 border-b border-white/10">
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
                      <tr key={set.id} className="hover:bg-white/5">
                        <td className="p-4 font-bold text-[#C8FF16]">{set.invoiceNumber}</td>
                        <td className="p-4 font-sans font-bold">{set.eventTitle}</td>
                        <td className="p-4">₹{set.grossSales.toLocaleString('en-IN')}</td>
                        <td className="p-4 text-white/60">₹{(set.platformCommission + set.paymentGatewaysFee).toLocaleString('en-IN')}</td>
                        <td className="p-4 font-black text-white">₹{set.netPayoutAmount.toLocaleString('en-IN')}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-[9px] uppercase font-bold ${
                            set.status === 'settled' ? 'bg-[#C8FF16] text-black' : 'bg-[#FF6B00]/20 text-[#FF6B00]'
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
              <div className="p-6 bg-[#0e100c] border border-white/10 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-xs font-black uppercase text-white">DOOR BOUNCER ACCESS KEYS</span>
                  <Link
                    href="/checkin"
                    className="px-3 py-1.5 bg-[#C8FF16] text-black text-xs font-bold uppercase flex items-center gap-1"
                  >
                    <ScanLine className="w-3.5 h-3.5" />
                    <span>LAUNCH DOOR TERMINAL ↗</span>
                  </Link>
                </div>
                <p className="text-xs text-white/60 font-sans">
                  Provide this access code to your security team at the venue entrance. Door staff can scan QR codes in real-time or offline.
                </p>

                <div className="p-4 bg-black border border-white/20 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-white/40 uppercase">ACTIVE EVENT SCAN KEY</div>
                    <div className="text-lg font-bold text-[#C8FF16]">GZ-STAFF-REAY-8920</div>
                  </div>
                  <button
                    onClick={() => toast.success('KEY COPIED', 'Staff access pin copied.')}
                    className="px-3 py-2 bg-[#171914] text-white text-xs uppercase font-bold"
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
          <div className="relative w-full max-w-md bg-[#0e100c] border border-[#C8FF16] p-6 text-white space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-[#C8FF16]">CREATE CAMPAIGN PROMO CODE</span>
              <button onClick={() => setIsPromoModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleCreatePromo} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase text-white/60 mb-1">PROMO CODE STRING</label>
                <input
                  type="text"
                  value={newPromoCode}
                  onChange={e => setNewPromoCode(e.target.value)}
                  placeholder="e.g. MONSOON20"
                  className="w-full bg-black border border-white/20 p-2 text-xs text-white uppercase focus:border-[#C8FF16]"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-white/60 mb-1">DISCOUNT PERCENTAGE (%)</label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={newPromoDiscount}
                  onChange={e => setNewPromoDiscount(Number(e.target.value))}
                  className="w-full bg-black border border-white/20 p-2 text-xs text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#C8FF16] text-black font-black uppercase text-xs"
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
          <div className="relative w-full max-w-md bg-[#0e100c] border border-white/20 p-6 text-white space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-xs font-bold uppercase text-[#C8FF16]">BROADCAST TO CONFIRMED ATTENDEES</span>
              <button onClick={() => setBroadcastModalOpen(false)}>✕</button>
            </div>
            <form
              onSubmit={async e => {
                e.preventDefault();
                const eventId = selectedEventId === 'all' ? myEvents[0]?.id : selectedEventId;
                if (eventId) {
                  await fetch('/api/broadcasts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      eventId,
                      title: 'ORGANIZER DISPATCH',
                      body: broadcastMsg
                    })
                  }).catch(() => {});
                }
                toast.success('BROADCAST DISPATCHED', 'SMS and email queued to pass holders.');
                setBroadcastModalOpen(false);
                setBroadcastMsg('');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[10px] uppercase text-white/60 mb-1">DISPATCH MESSAGE (WEATHER / SET TIME / VENUE ADVICE)</label>
                <textarea
                  rows={4}
                  value={broadcastMsg}
                  onChange={e => setBroadcastMsg(e.target.value)}
                  placeholder="Gate 01 opens at 21:00 sharp. Please bring original ID..."
                  className="w-full bg-black border border-white/20 p-2.5 text-xs text-white focus:outline-none focus:border-[#C8FF16]"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#C8FF16] text-black font-black uppercase text-xs"
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
        <Suspense fallback={<div className="min-h-screen bg-black text-white p-12 font-mono">LOADING CONTROL...</div>}>
          <OrganizerDashboardContent />
        </Suspense>
  );
}
