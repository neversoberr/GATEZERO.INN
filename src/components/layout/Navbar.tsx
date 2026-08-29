'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CITIES } from '@/lib/data/initial-data';
import { 
  Search, 
  MapPin, 
  Ticket, 
  PlusCircle, 
  Menu, 
  X, 
  ChevronDown, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  ShieldAlert, 
  ScanLine, 
  Share2, 
  Bookmark, 
  Building2, 
  FileText,
  Bell
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, isAuthenticated, openLoginModal, logout } = useAuth();
  
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [passCount, setPassCount] = useState(0);
  const [unreadAlerts, setUnreadAlerts] = useState(0);

  useEffect(() => {
    if (!user?.id) {
      setPassCount(0);
      setUnreadAlerts(0);
      return;
    }
    fetch(`/api/orders?userId=${encodeURIComponent(user.id)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.orders) {
          const upcoming = data.orders.filter((o: any) => o.paymentStatus !== 'refunded').reduce((sum: number, o: any) => sum + (o.attendees?.length || 0), 0);
          setPassCount(upcoming);
        }
      })
      .catch(() => {});
    fetch(`/api/notifications?userId=${encodeURIComponent(user.id)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setUnreadAlerts(data.unread || 0);
      })
      .catch(() => {});
  }, [user?.id]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/events?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/events');
    }
  };

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    setIsCityDropdownOpen(false);
    if (cityName === 'All Cities') {
      router.push('/events');
    } else {
      router.push(`/events?city=${encodeURIComponent(cityName)}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-white/10 text-[#F1F1EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-[#C8FF16] text-black font-black font-mono text-sm flex items-center justify-center tracking-tighter group-hover:scale-105 transition-transform">
                GZ
              </div>
              <div className="flex flex-col">
                <span className="font-black tracking-tight text-lg leading-none text-white group-hover:text-[#C8FF16] transition-colors">
                  GATE ZERO
                </span>
                <span className="text-[8px] font-mono tracking-widest text-white/50 uppercase leading-none mt-0.5">
                  CULTURAL ACCESS // IN
                </span>
              </div>
            </Link>

            {/* City Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#121410] border border-white/10 hover:border-[#C8FF16]/50 text-xs font-mono uppercase tracking-wider text-white/80 hover:text-white transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#C8FF16]" />
                <span>{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-white/40" />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute left-0 mt-1 w-48 bg-[#0e100c] border border-white/20 shadow-2xl py-1 z-50 text-xs font-mono">
                  {CITIES.map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleCitySelect(c.name)}
                      className="w-full px-3 py-2 text-left hover:bg-[#C8FF16] hover:text-black flex items-center justify-between transition-colors uppercase"
                    >
                      <span>{c.name}</span>
                      <span className="text-[10px] opacity-60">[{c.code}]</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-white/70">
            <Link 
              href="/events" 
              className={`hover:text-[#C8FF16] transition-colors ${pathname === '/events' ? 'text-[#C8FF16] font-bold' : ''}`}
            >
              Discover
            </Link>
            <Link 
              href="/events?view=categories" 
              className="hover:text-[#C8FF16] transition-colors"
            >
              Categories
            </Link>
            <Link 
              href="/organizers" 
              className="hover:text-[#C8FF16] transition-colors"
            >
              Organizers
            </Link>
            <Link 
              href="/organizer/onboarding" 
              className="hover:text-[#C8FF16] transition-colors"
            >
              For Organizers
            </Link>
          </nav>

          {/* Search Bar & Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex relative items-center">
              <input
                type="text"
                placeholder="Search event, artist, venue..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-48 xl:w-64 bg-[#121410] border border-white/10 px-3 py-1.5 pl-8 text-xs font-mono text-white placeholder:text-white/40 focus:outline-none focus:border-[#C8FF16] transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 pointer-events-none" />
            </form>

            {/* My Tickets Wallet */}
            <Link
              href="/tickets"
              className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-mono uppercase tracking-wider transition-colors ${
                pathname === '/tickets'
                  ? 'border-[#C8FF16] bg-[#C8FF16]/10 text-[#C8FF16]'
                  : 'border-white/10 hover:border-white/30 text-white/90 bg-[#121410]'
              }`}
            >
              <Ticket className="w-3.5 h-3.5 text-[#C8FF16]" />
              <span className="hidden sm:inline">Passes</span>
              <span className="bg-[#C8FF16] text-black px-1.5 py-0.2 text-[10px] font-black">
                {passCount}
              </span>
            </Link>

            {isAuthenticated && (
              <Link
                href="/tickets?tab=alerts"
                className="relative hidden sm:flex items-center justify-center w-9 h-9 border border-white/10 bg-[#121410] hover:border-[#C8FF16]"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-[#C8FF16]" />
                {unreadAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#FF314A] text-white text-[9px] font-black flex items-center justify-center">
                    {unreadAlerts}
                  </span>
                )}
              </Link>
            )}

            {/* List Event Button (Signal Lime) */}
            <Link
              href="/organizer/events/new"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#C8FF16] hover:bg-[#b8ea14] text-black font-mono font-black text-xs uppercase tracking-wider transition-transform active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>List Event</span>
            </Link>

            {/* User Profile / Login */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#171914] border border-white/20 hover:border-[#C8FF16] text-xs font-mono text-white"
                >
                  <div className="w-5 h-5 bg-[#C8FF16]/20 border border-[#C8FF16] text-[#C8FF16] text-[10px] flex items-center justify-center font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[70px] truncate hidden md:inline">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-white/40" />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-1 w-56 bg-[#0e100c] border border-white/20 shadow-2xl py-1 z-50 text-xs font-mono">
                    <div className="px-3 py-2 border-b border-white/10">
                      <div className="font-bold text-white truncate">{user.name}</div>
                      <div className="text-[10px] text-white/50 truncate">{user.email}</div>
                      <div className="mt-1 px-1.5 py-0.5 bg-[#C8FF16]/20 text-[#C8FF16] text-[9px] uppercase font-bold inline-block">
                        ROLE: {role}
                      </div>
                    </div>

                    <Link
                      href="/tickets"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2 text-white/80 hover:text-white"
                    >
                      <Ticket className="w-3.5 h-3.5 text-[#C8FF16]" />
                      My Access Passes & Invoices
                    </Link>

                    <Link
                      href="/tickets?tab=saved"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2 text-white/80 hover:text-white"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-white/50" />
                      Saved Experiences
                    </Link>

                    <div className="border-t border-white/10 my-1"></div>

                    {/* Dashboard routes based on role */}
                    <Link
                      href="/organizer/dashboard"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2 text-white/80 hover:text-white"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-[#C8FF16]" />
                      Organizer Control
                    </Link>

                    <Link
                      href="/promoter"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2 text-white/80 hover:text-white"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                      Promoter Portal
                    </Link>

                    <Link
                      href="/checkin"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2 text-white/80 hover:text-white"
                    >
                      <ScanLine className="w-3.5 h-3.5 text-[#C8FF16]" />
                      Door Check-in App
                    </Link>

                    <Link
                      href="/admin"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2 text-white/80 hover:text-white"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-[#FF314A]" />
                      Super Admin Centre
                    </Link>

                    <div className="border-t border-white/10 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-[#FF314A]/20 text-[#FF314A] flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openLoginModal()}
                className="px-3 py-1.5 bg-[#171914] hover:bg-white hover:text-black border border-white/20 text-xs font-mono uppercase tracking-wider transition-colors"
              >
                Enter Gate
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 text-white/70 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#0c0e0a] border-b border-white/10 px-4 py-4 space-y-4 font-mono text-xs">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search event, artist, venue..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#121410] border border-white/10 px-3 py-2.5 pl-9 text-xs text-white"
              />
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-3" />
            </form>

            <div className="grid grid-cols-2 gap-2">
              {CITIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    handleCitySelect(c.name);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`p-2 border text-left flex items-center justify-between ${
                    selectedCity === c.name ? 'border-[#C8FF16] text-[#C8FF16]' : 'border-white/10 text-white/70'
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="text-[10px] opacity-50">[{c.code}]</span>
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <Link 
                href="/events" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-white hover:text-[#C8FF16]"
              >
                • DISCOVER ALL EVENTS
              </Link>
              <Link 
                href="/tickets" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-white hover:text-[#C8FF16]"
              >
                • MY DIGITAL PASSES & WALLET
              </Link>
              <Link 
                href="/organizer/dashboard" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-white hover:text-[#C8FF16]"
              >
                • ORGANIZER CONTROL PANEL
              </Link>
              <Link 
                href="/checkin" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-white hover:text-[#C8FF16]"
              >
                • DOOR CHECK-IN TERMINAL
              </Link>
              <Link 
                href="/promoter" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-white hover:text-[#C8FF16]"
              >
                • PROMOTER & AFFILIATE HUB
              </Link>
              <Link 
                href="/admin" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-white hover:text-[#C8FF16]"
              >
                • SUPER ADMIN DASHBOARD
              </Link>
              <Link 
                href="/organizer/events/new" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2.5 bg-[#C8FF16] text-black text-center font-bold uppercase mt-2"
              >
                + LIST AN EVENT
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom App Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080907]/95 backdrop-blur-lg border-t border-white/10 grid grid-cols-5 py-2 font-mono text-[10px] text-center text-white/60">
        <Link href="/" className={`flex flex-col items-center gap-1 ${pathname === '/' ? 'text-[#C8FF16]' : ''}`}>
          <div className="w-4 h-4 flex items-center justify-center font-bold">GZ</div>
          <span>HOME</span>
        </Link>
        <Link href="/events" className={`flex flex-col items-center gap-1 ${pathname.startsWith('/events') ? 'text-[#C8FF16]' : ''}`}>
          <Search className="w-4 h-4" />
          <span>EXPLORE</span>
        </Link>
        <Link href="/tickets?tab=saved" className={`flex flex-col items-center gap-1 ${pathname.includes('saved') ? 'text-[#C8FF16]' : ''}`}>
          <Bookmark className="w-4 h-4" />
          <span>SAVED</span>
        </Link>
        <Link href="/tickets" className={`flex flex-col items-center gap-1 ${pathname === '/tickets' ? 'text-[#C8FF16]' : ''}`}>
          <Ticket className="w-4 h-4" />
          <span>PASSES</span>
        </Link>
        <Link href="/organizer/dashboard" className={`flex flex-col items-center gap-1 ${pathname.startsWith('/organizer') ? 'text-[#C8FF16]' : ''}`}>
          <Building2 className="w-4 h-4" />
          <span>CONTROL</span>
        </Link>
      </div>
    </>
  );
}
