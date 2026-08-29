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
  ExternalLink 
} from 'lucide-react';

export function RoleBanner() {
  const { user, role, switchRole } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);

  const rolesList: { role: UserRole; label: string; name: string; url: string; icon: any }[] = [
    { role: 'customer', label: 'Attendee', name: 'Alex Chen', url: '/tickets', icon: Ticket },
    { role: 'organizer', label: 'Organizer', name: 'SubKulture (Karan)', url: '/organizer/dashboard', icon: Building2 },
    { role: 'promoter', label: 'Promoter', name: 'Priya Sharma', url: '/promoter', icon: Share2 },
    { role: 'door_staff', label: 'Door Staff', name: 'Rajesh (Reay Rd)', url: '/checkin', icon: ScanLine },
    { role: 'super_admin', label: 'Super Admin', name: 'Dev Malik', url: '/admin', icon: ShieldAlert },
  ];

  return (
    <div className="bg-[#0c0e0a] border-b border-[#C8FF16]/20 text-[#F1F1EB] text-xs font-mono relative z-40">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Active Role status */}
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#C8FF16] animate-ping" />
          <span className="text-white/60 uppercase tracking-widest text-[10px]">ROLE PREVIEW:</span>
          <span className="px-2 py-0.5 bg-[#C8FF16] text-black font-bold uppercase tracking-wider text-[11px]">
            {role.replace('_', ' ')}
          </span>
          <span className="text-white/40 hidden sm:inline">|</span>
          <span className="text-white/70 hidden sm:inline truncate max-w-[180px]">
            {user?.name || 'Guest'}
          </span>
        </div>

        {/* Center: Switch buttons */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {rolesList.map(item => {
            const Icon = item.icon;
            const isActive = role === item.role;
            return (
              <div key={item.role} className="flex items-center">
                <button
                  onClick={() => switchRole(item.role)}
                  className={`px-2 py-1 text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-white text-black font-bold border border-white'
                      : 'bg-black/40 text-white/70 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                  title={`Switch to ${item.label} (${item.name})`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{item.label}</span>
                </button>
                {isActive && (
                  <Link
                    href={item.url}
                    className="ml-1 px-1.5 py-1 bg-[#C8FF16]/20 hover:bg-[#C8FF16] text-[#C8FF16] hover:text-black border border-[#C8FF16]/40 text-[10px] uppercase font-bold flex items-center gap-0.5 transition-colors"
                  >
                    GO ↗
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Quick direct dashboard link */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] text-white/50">
          <span>ALL HUBS ACTIVE & MOCKED</span>
        </div>
      </div>
    </div>
  );
}
