'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleBanner } from '@/components/layout/RoleBanner';
import { LoginModal } from '@/components/auth/LoginModal';
import { AccessPassCard } from '@/components/tickets/AccessPassCard';
import { EventCard } from '@/components/events/EventCard';
import { Order, Event, OrganizerCompany } from '@/types';
import { INITIAL_ORDERS, INITIAL_EVENTS, INITIAL_ORGANIZERS } from '@/lib/data/initial-data';
import { ToastProvider, useToast } from '@/context/ToastContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { 
  Ticket, 
  Bookmark, 
  History, 
  Receipt, 
  ShieldCheck, 
  Users, 
  Download, 
  ExternalLink,
  ArrowRight,
  Lock,
  Smartphone,
  User,
  Settings
} from 'lucide-react';

function TicketsContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as any) || 'upcoming';

  const { user, role, switchRole } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'saved' | 'following' | 'invoices' | 'profile'>(
    initialTab
  );

  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [allEvents, setAllEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [organizers, setOrganizers] = useState<OrganizerCompany[]>(INITIAL_ORGANIZERS);

  // Sync state
  const refreshOrders = () => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    refreshOrders();
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.events) {
          setAllEvents(data.events);
        }
      })
      .catch(() => {});
  }, []);

  // Filter passes
  const userOrders = orders.filter(o => o.userId === user?.id || o.customerEmail === user?.email);
  const upcomingOrders = userOrders.filter(o => new Date(o.eventDate) >= new Date() && o.paymentStatus !== 'refunded');
  const pastOrders = userOrders.filter(o => new Date(o.eventDate) < new Date() || o.paymentStatus === 'refunded');

  const savedEvents = allEvents.filter(e => user?.savedEventIds?.includes(e.id));
  const followedOrganizers = organizers.filter(o => user?.followedOrganizerIds?.includes(o.id));

  return (
    <div className="min-h-screen bg-[#050505] text-[#F1F1EB] flex flex-col font-mono selection:bg-[#C8FF16] selection:text-black">
      <RoleBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Header */}
        <div className="pb-8 border-b border-white/10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#C8FF16] font-bold">
              DIGITAL WALLET & IDENTITY
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-1">
              MY GATE PASSES
            </h1>
            <p className="text-xs text-white/60 font-sans mt-1">
              Authenticated user: <strong className="text-white">{user?.name}</strong> ({user?.email})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/events"
              className="px-4 py-2 bg-[#C8FF16] text-black font-black uppercase text-xs flex items-center gap-1.5"
            >
              <span>EXPLORE GATES</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-white/10 mt-6 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-3 px-3 uppercase font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'upcoming'
                ? 'border-[#C8FF16] text-[#C8FF16]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>UPCOMING PASSES ({upcomingOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('past')}
            className={`pb-3 px-3 uppercase font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'past'
                ? 'border-[#C8FF16] text-[#C8FF16]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>PAST ARCHIVE ({pastOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 px-3 uppercase font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'saved'
                ? 'border-[#C8FF16] text-[#C8FF16]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>SAVED EXPERIENCES ({savedEvents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('following')}
            className={`pb-3 px-3 uppercase font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'following'
                ? 'border-[#C8FF16] text-[#C8FF16]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>FOLLOWED HOSTS ({followedOrganizers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`pb-3 px-3 uppercase font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'invoices'
                ? 'border-[#C8FF16] text-[#C8FF16]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>INVOICES & TAX</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-3 uppercase font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'profile'
                ? 'border-[#C8FF16] text-[#C8FF16]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>PROFILE & 2FA</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="py-8">
          
          {/* 1. UPCOMING PASSES */}
          {activeTab === 'upcoming' && (
            <div className="space-y-6">
              {upcomingOrders.length > 0 ? (
                upcomingOrders.map(order => (
                  <div key={order.id} className="space-y-4">
                    {order.attendees.map(attendee => (
                      <AccessPassCard
                        key={attendee.id}
                        order={order}
                        attendee={attendee}
                        onTicketUpdated={refreshOrders}
                      />
                    ))}
                  </div>
                ))
              ) : (
                <div className="py-16 text-center bg-[#0d0f0c] border border-white/10 p-8 space-y-4">
                  <div className="w-12 h-12 border border-[#C8FF16] text-[#C8FF16] flex items-center justify-center mx-auto text-xl font-bold">
                    00
                  </div>
                  <h3 className="text-xl font-black uppercase text-white">NO UPCOMING ACCESS PASSES</h3>
                  <p className="text-xs text-white/60 font-sans max-w-sm mx-auto">
                    You have no active event tickets in your wallet. Explore the discovery radar to claim your next pass.
                  </p>
                  <Link
                    href="/events"
                    className="px-6 py-2.5 bg-[#C8FF16] text-black font-black uppercase text-xs inline-flex items-center gap-2"
                  >
                    <span>BROWSE EVENTS ↗</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* 2. PAST ARCHIVE */}
          {activeTab === 'past' && (
            <div className="space-y-6">
              {pastOrders.length > 0 ? (
                pastOrders.map(order => (
                  <div key={order.id} className="space-y-4 opacity-75 hover:opacity-100 transition-opacity">
                    {order.attendees.map(attendee => (
                      <AccessPassCard
                        key={attendee.id}
                        order={order}
                        attendee={attendee}
                        onTicketUpdated={refreshOrders}
                      />
                    ))}
                  </div>
                ))
              ) : (
                <div className="py-16 text-center bg-[#0d0f0c] border border-white/10 p-8 text-white/50">
                  NO PAST ATTENDANCE LOGS FOUND
                </div>
              )}
            </div>
          )}

          {/* 3. SAVED EXPERIENCES */}
          {activeTab === 'saved' && (
            <div>
              {savedEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedEvents.map(ev => (
                    <EventCard key={ev.id} event={ev} />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center bg-[#0d0f0c] border border-white/10 p-8 space-y-4">
                  <Bookmark className="w-8 h-8 text-[#C8FF16] mx-auto" />
                  <h3 className="text-lg font-black uppercase text-white">NO SAVED EVENTS</h3>
                  <p className="text-xs text-white/60 font-sans max-w-sm mx-auto">
                    Click the bookmark icon on any event card to save it for easy access later.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 4. FOLLOWED ORGANIZERS */}
          {activeTab === 'following' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {followedOrganizers.length > 0 ? (
                followedOrganizers.map(org => (
                  <div key={org.id} className="p-6 bg-[#0e100c] border border-white/10 space-y-4">
                    <div className="flex items-center gap-4">
                      <img src={org.logoUrl} alt={org.name} className="w-14 h-14 object-cover border border-white/20" />
                      <div>
                        <Link href={`/organizer/${org.slug}`} className="text-base font-black uppercase text-white hover:text-[#C8FF16]">
                          {org.name}
                        </Link>
                        <div className="text-xs text-[#C8FF16]">{org.city}</div>
                      </div>
                    </div>
                    <p className="text-xs text-white/60 font-sans line-clamp-2">{org.description}</p>
                    <Link
                      href={`/organizer/${org.slug}`}
                      className="block w-full py-2 bg-black border border-white/20 text-center text-xs font-bold uppercase text-white hover:bg-white hover:text-black"
                    >
                      VIEW UPCOMING DROPS ↗
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-16 text-center bg-[#0d0f0c] border border-white/10 text-white/50">
                  YOU ARE NOT FOLLOWING ANY ORGANIZER COLLECTIVES YET
                </div>
              )}
            </div>
          )}

          {/* 5. INVOICES & GST RECEIPTS */}
          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <div className="bg-[#0e100c] border border-white/10 overflow-x-auto">
                <table className="w-full text-left text-xs text-white">
                  <thead className="bg-black text-[10px] uppercase text-white/50 border-b border-white/10">
                    <tr>
                      <th className="p-4">ORDER NUMBER</th>
                      <th className="p-4">EVENT</th>
                      <th className="p-4">DATE</th>
                      <th className="p-4">TOTAL (INR)</th>
                      <th className="p-4">TAX INVOICE</th>
                      <th className="p-4">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {userOrders.map(ord => (
                      <tr key={ord.id} className="hover:bg-white/5">
                        <td className="p-4 font-bold text-[#C8FF16]">{ord.orderNumber}</td>
                        <td className="p-4 font-sans font-bold">{ord.eventTitle}</td>
                        <td className="p-4 text-white/60">{new Date(ord.createdAt).toLocaleDateString('en-GB')}</td>
                        <td className="p-4 font-bold">₹{ord.totalAmount.toLocaleString('en-IN')}</td>
                        <td className="p-4">
                          <button
                            onClick={() => {
                              toast.success('GST TAX INVOICE GENERATED', `Invoice downloaded for ${ord.orderNumber}`);
                            }}
                            className="px-2.5 py-1 bg-[#171914] hover:bg-[#C8FF16] hover:text-black border border-white/20 text-[10px] uppercase font-bold flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>PDF RECEIPT</span>
                          </button>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-[10px] uppercase font-bold ${
                            ord.paymentStatus === 'paid' ? 'bg-[#C8FF16]/20 text-[#C8FF16]' : 'bg-[#FF314A]/20 text-[#FF314A]'
                          }`}>
                            {ord.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. PROFILE & SECURITY */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl bg-[#0e100c] border border-white/10 p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-black uppercase text-white">ACCOUNT CREDENTIALS</h3>
                <p className="text-xs text-white/60 font-sans mt-1">
                  Manage your verified phone number, notification preferences, and two-factor authentication.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] uppercase text-white/50 mb-1">FULL NAME</label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="w-full bg-black border border-white/20 p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-white/50 mb-1">REGISTERED EMAIL</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full bg-black border border-white/20 p-2.5 text-white"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-white/50 mb-1">VERIFIED PHONE (+91)</label>
                  <input
                    type="tel"
                    defaultValue={user?.phone}
                    className="w-full bg-black border border-white/20 p-2.5 text-white"
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">TWO-FACTOR AUTHENTICATION (2FA)</div>
                    <div className="text-[11px] text-white/50 font-sans">Requires OTP for high-value purchases and pass transfers.</div>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-[#C8FF16] w-4 h-4" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => toast.success('CREDENTIALS UPDATED', 'Profile preferences synchronized.')}
                className="w-full py-3 bg-[#C8FF16] text-black font-black uppercase text-xs hover:bg-[#b8ea14]"
              >
                SAVE PREFERENCES ↗
              </button>
            </div>
          )}

        </div>

      </main>

      <Footer />
      <LoginModal />
    </div>
  );
}

export default function TicketsPage() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Suspense fallback={<div className="min-h-screen bg-black text-white p-12 font-mono">LOADING WALLET...</div>}>
          <TicketsContent />
        </Suspense>
      </AuthProvider>
    </ToastProvider>
  );
}
