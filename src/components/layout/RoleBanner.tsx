'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import Link from 'next/link';
import {
  Users,
  Building2,
  Share2,
  ScanLine,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Ticket,
} from 'lucide-react';

export function RoleBanner() {
  const { user, role, switchRole } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);

  const rolesList: {
    role: UserRole;
    label: string;
    name: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { role: 'customer', label: 'Attendee', name: 'Alex Chen', url: '/tickets', icon: Ticket },
    { role: 'organizer', label: 'Organizer', name: 'SubKulture (Karan)', url: '/organizer/dashboard', icon: Building2 },
    { role: 'promoter', label: 'Promoter', name: 'Priya Sharma', url: '/promoter', icon: Share2 },
    { role: 'door_staff', label: 'Door Staff', name: 'Rajesh (Reay Rd)', url: '/checkin', icon: ScanLine },
    { role: 'super_admin', label: 'Super Admin', name: 'Dev Malik', url: '/admin', icon: ShieldAlert },
  ];

  return (
    /* Full-bleed acid strip — loud by design: this is a demo control, not chrome */
    <div className="relative z-40 bg-accent font-mono text-accent-foreground">
      <div className="mx-auto flex w-full max-w-[95vw] flex-wrap items-center justify-between gap-2 px-4 py-1.5 md:px-8">
        {/* Active role */}
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest">
          <span className="font-bold text-black/60">ROLE PREVIEW:</span>
          <span className="bg-black px-2 py-0.5 font-bold text-accent">
            {role.replace('_', ' ')}
          </span>
          <span className="hidden max-w-[180px] truncate text-black/70 sm:inline">
            {user?.name || 'Guest'}
          </span>
        </div>

        {/* Switcher */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {rolesList.map(item => {
            const Icon = item.icon;
            const isActive = role === item.role;
            return (
              <div key={item.role} className="flex items-center">
                <button
                  onClick={() => switchRole(item.role)}
                  className={`flex items-center gap-1.5 border-2 px-2 py-1 text-[11px] uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'border-black bg-black font-bold text-accent'
                      : 'border-black/20 text-black/70 hover:border-black hover:text-black'
                  }`}
                  title={`Switch to ${item.label} (${item.name})`}
                  aria-pressed={isActive}
                >
                  <Icon className="h-3 w-3" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
                {isActive && (
                  <Link
                    href={item.url}
                    className="ml-1 border-2 border-black bg-black px-1.5 py-1 text-[10px] font-bold uppercase text-accent transition-colors hover:opacity-80"
                  >
                    GO ↗
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="hidden items-center gap-1 text-[11px] uppercase tracking-widest text-black/60 transition-colors hover:text-black lg:flex"
          aria-label={isExpanded ? 'Collapse banner' : 'Expand banner'}
        >
          ALL HUBS ACTIVE &amp; MOCKED
          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>
    </div>
  );
}
