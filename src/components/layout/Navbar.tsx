'use client';

import React, { useState } from 'react';
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
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  ScanLine,
  Share2,
  Bookmark,
  Building2,
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

  const navLinkClasses = (active: boolean) =>
    `font-mono text-xs uppercase tracking-widest transition-colors hover:text-accent ${
      active ? 'font-bold text-accent' : 'text-muted-foreground'
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b-2 border-border bg-background/95 text-foreground backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[95vw] items-center justify-between gap-4 px-4 md:px-8">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center bg-accent font-mono text-sm font-bold tracking-tighter text-accent-foreground transition-transform group-hover:scale-105">
                GZ
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none tracking-tighter text-foreground transition-colors group-hover:text-accent">
                  GATE ZERO
                </span>
                <span className="mt-0.5 font-mono text-[8px] uppercase leading-none tracking-widest text-muted-foreground">
                  CULTURAL ACCESS // IN
                </span>
              </div>
            </Link>

            {/* City selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                aria-expanded={isCityDropdownOpen}
                className="flex items-center gap-1.5 border-2 border-border bg-card px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                <span>{selectedCity}</span>
                <ChevronDown className="h-3 w-3" aria-hidden="true" />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute left-0 z-50 mt-1 w-48 border-2 border-border bg-background py-1 font-mono text-xs">
                  {CITIES.map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleCitySelect(c.name)}
                      className="flex w-full items-center justify-between px-3 py-2 text-left uppercase text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <span>{c.name}</span>
                      <span className="text-[10px] opacity-60">[{c.code}]</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
            <Link href="/events" className={navLinkClasses(pathname === '/events')}>
              Discover
            </Link>
            <Link href="/events?view=categories" className={navLinkClasses(false)}>
              Categories
            </Link>
            <Link href="/organizer/subkulture-india" className={navLinkClasses(false)}>
              Organizers
            </Link>
            <Link href="/organizer/onboarding" className={navLinkClasses(false)}>
              For Organizers
            </Link>
          </nav>

          {/* Search & actions */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative hidden items-center sm:flex" role="search">
              <input
                type="text"
                placeholder="SEARCH EVENT, ARTIST, VENUE..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Search events"
                className="w-48 border-b-2 border-border bg-transparent px-1 py-1.5 font-mono text-xs uppercase tracking-wider text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none xl:w-64"
              />
              <Search className="pointer-events-none absolute right-1 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            </form>

            {/* Passes wallet */}
            <Link
              href="/tickets"
              className={`flex items-center gap-1.5 border-2 px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                pathname === '/tickets'
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border text-foreground hover:border-foreground'
              }`}
            >
              <Ticket className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              <span className="hidden sm:inline">Passes</span>
              <span className="bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">
                {user?.id === 'user_alex' ? '3' : '0'}
              </span>
            </Link>

            {/* Primary: list event */}
            <Link
              href="/organizer/events/new"
              className="hidden items-center gap-1.5 bg-accent px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-accent-foreground transition-all hover:scale-105 hover:bg-accent-hover active:scale-95 sm:flex"
            >
              <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>List Event</span>
            </Link>

            {/* Profile / login */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  aria-expanded={isProfileMenuOpen}
                  className="flex items-center gap-1.5 border-2 border-border bg-card px-2.5 py-1.5 font-mono text-xs text-foreground transition-colors hover:border-foreground"
                >
                  <div className="flex h-5 w-5 items-center justify-center border border-accent bg-accent/20 text-[10px] font-bold text-accent">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden max-w-[70px] truncate md:inline">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 z-50 mt-1 w-56 border-2 border-border bg-background py-1 font-mono text-xs">
                    <div className="border-b-2 border-border px-3 py-2">
                      <div className="truncate font-bold text-foreground">{user.name}</div>
                      <div className="truncate text-[10px] text-muted-foreground">{user.email}</div>
                      <div className="mt-1 inline-block bg-accent/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-accent">
                        ROLE: {role}
                      </div>
                    </div>

                    <Link
                      href="/tickets"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Ticket className="h-3.5 w-3.5" aria-hidden="true" />
                      My Access Passes &amp; Invoices
                    </Link>

                    <Link
                      href="/tickets?tab=saved"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
                      Saved Experiences
                    </Link>

                    <div className="my-1 border-t-2 border-border" />

                    <Link
                      href="/organizer/dashboard"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                      Organizer Control
                    </Link>

                    <Link
                      href="/promoter"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Share2 className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                      Promoter Portal
                    </Link>

                    <Link
                      href="/checkin"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <ScanLine className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                      Door Check-in App
                    </Link>

                    <Link
                      href="/admin"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <ShieldAlert className="h-3.5 w-3.5 text-danger" aria-hidden="true" />
                      Super Admin Centre
                    </Link>

                    <div className="my-1 border-t-2 border-border" />

                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-danger transition-colors hover:bg-danger hover:text-white"
                    >
                      <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openLoginModal()}
                className="border-2 border-border bg-card px-3 py-2 font-mono text-xs uppercase tracking-wider text-foreground transition-colors hover:bg-foreground hover:text-accent-foreground"
              >
                Enter Gate
              </button>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {isMobileMenuOpen && (
          <div className="border-t-2 border-border bg-card px-4 py-4 font-mono text-xs lg:hidden">
            <form onSubmit={handleSearchSubmit} className="relative" role="search">
              <input
                type="text"
                placeholder="SEARCH EVENT, ARTIST, VENUE..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Search events"
                className="w-full border-b-2 border-border bg-transparent px-1 py-2.5 uppercase tracking-wider text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
              <Search className="absolute right-1 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </form>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {CITIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    handleCitySelect(c.name);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between border-2 p-2 text-left uppercase transition-colors ${
                    selectedCity === c.name
                      ? 'border-accent text-accent'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="text-[10px] opacity-50">[{c.code}]</span>
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-1 border-t-2 border-border pt-4">
              {[
                { href: '/events', label: '• DISCOVER ALL EVENTS' },
                { href: '/tickets', label: '• MY DIGITAL PASSES & WALLET' },
                { href: '/organizer/dashboard', label: '• ORGANIZER CONTROL PANEL' },
                { href: '/checkin', label: '• DOOR CHECK-IN TERMINAL' },
                { href: '/promoter', label: '• PROMOTER & AFFILIATE HUB' },
                { href: '/admin', label: '• SUPER ADMIN DASHBOARD' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 text-sm font-bold uppercase tracking-wider text-foreground transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/organizer/events/new"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-2 flex h-14 items-center justify-center bg-accent text-sm font-bold uppercase tracking-tighter text-accent-foreground transition-transform active:scale-95"
              >
                + LIST AN EVENT
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Mobile sticky bottom app bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t-2 border-border bg-background/95 py-2 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur-lg sm:hidden"
        aria-label="Mobile"
      >
        <Link href="/" className={`flex flex-col items-center gap-1 py-1 ${pathname === '/' ? 'text-accent' : ''}`}>
          <div className="flex h-4 w-4 items-center justify-center font-bold">GZ</div>
          <span>Home</span>
        </Link>
        <Link href="/events" className={`flex flex-col items-center gap-1 py-1 ${pathname.startsWith('/events') ? 'text-accent' : ''}`}>
          <Search className="h-4 w-4" aria-hidden="true" />
          <span>Explore</span>
        </Link>
        <Link href="/tickets?tab=saved" className={`flex flex-col items-center gap-1 py-1 ${pathname.includes('saved') ? 'text-accent' : ''}`}>
          <Bookmark className="h-4 w-4" aria-hidden="true" />
          <span>Saved</span>
        </Link>
        <Link href="/tickets" className={`flex flex-col items-center gap-1 py-1 ${pathname === '/tickets' ? 'text-accent' : ''}`}>
          <Ticket className="h-4 w-4" aria-hidden="true" />
          <span>Passes</span>
        </Link>
        <Link href="/organizer/dashboard" className={`flex flex-col items-center gap-1 py-1 ${pathname.startsWith('/organizer') ? 'text-accent' : ''}`}>
          <Building2 className="h-4 w-4" aria-hidden="true" />
          <span>Control</span>
        </Link>
      </nav>
    </>
  );
}
