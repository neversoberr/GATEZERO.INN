'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleBanner } from '@/components/layout/RoleBanner';
import { LoginModal } from '@/components/auth/LoginModal';
import { OrganizerCompany } from '@/types';
import { INITIAL_ORGANIZERS } from '@/lib/data/initial-data';
import { ShieldCheck, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function OrganizersPage() {
  const { isOrganizerFollowed, toggleFollowOrganizer } = useAuth();
  const [organizers, setOrganizers] = useState<OrganizerCompany[]>(INITIAL_ORGANIZERS);

  useEffect(() => {
    fetch('/api/organizers')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.organizers) setOrganizers(data.organizers);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F1F1EB] flex flex-col font-mono">
      <RoleBanner />
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="pb-8 mb-8 border-b border-white/10">
          <div className="text-[10px] uppercase tracking-widest text-[#C8FF16] font-bold">HOST NETWORK</div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mt-1">VERIFIED ORGANIZERS</h1>
          <p className="text-xs text-white/60 font-sans mt-2 max-w-2xl">Collectives, warehouses, and independents shipping culture across India.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizers.map(org => (
            <div key={org.id} className="bg-[#0e100c] border border-white/10 p-6 space-y-4">
              <div className="flex items-center gap-4">
                <img src={org.logoUrl} alt={org.name} className="w-16 h-16 object-cover border border-white/20" />
                <div>
                  <Link href={`/organizer/${org.slug}`} className="text-lg font-black uppercase text-white hover:text-[#C8FF16] flex items-center gap-1">
                    {org.name}
                    {org.isVerified && <ShieldCheck className="w-4 h-4 text-[#C8FF16]" />}
                  </Link>
                  <div className="text-xs text-[#C8FF16]">{org.city} • {org.kycStatus}</div>
                </div>
              </div>
              <p className="text-xs text-white/70 font-sans line-clamp-3">{org.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-white/60"><Star className="w-3.5 h-3.5 text-[#C8FF16]" /> {org.rating} • {org.followersCount.toLocaleString()} following</span>
                <button
                  onClick={() => toggleFollowOrganizer(org.id)}
                  className={`px-3 py-1.5 uppercase font-bold ${isOrganizerFollowed(org.id) ? 'bg-[#C8FF16] text-black' : 'border border-white/20'}`}
                >
                  {isOrganizerFollowed(org.id) ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
      <LoginModal />
    </div>
  );
}
