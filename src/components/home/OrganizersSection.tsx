'use client';

import React from 'react';
import Link from 'next/link';
import { OrganizerCompany } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Users, Star, ArrowRight } from 'lucide-react';

interface OrganizersSectionProps {
  organizers: OrganizerCompany[];
}

export function OrganizersSection({ organizers }: OrganizersSectionProps) {
  const { isOrganizerFollowed, toggleFollowOrganizer } = useAuth();

  return (
    <section className="py-16 bg-[#080907] border-t border-white/10 text-[#F1F1EB] font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="pb-8 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#C8FF16] font-bold">
              CURATORS & COLLECTIVES
            </div>
            <h2 className="text-3xl font-black uppercase text-white mt-1">
              FEATURED ORGANIZERS
            </h2>
          </div>
          <Link
            href="/organizer/onboarding"
            className="text-xs font-bold uppercase text-[#C8FF16] hover:underline flex items-center gap-1"
          >
            <span>JOIN AS VERIFIED ORGANIZER</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Organizers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {organizers.slice(0, 3).map(org => {
            const followed = isOrganizerFollowed(org.id);

            return (
              <div
                key={org.id}
                className="bg-[#0e100c] border border-white/10 hover:border-[#C8FF16] transition-all p-6 flex flex-col justify-between space-y-6"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)'
                }}
              >
                <div>
                  {/* Top: Logo & Verification */}
                  <div className="flex items-start justify-between gap-4">
                    <img
                      src={org.logoUrl}
                      alt={org.name}
                      className="w-14 h-14 object-cover border border-white/20 bg-black"
                    />
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-black border border-white/10 text-[10px] text-[#C8FF16] uppercase">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      VERIFIED
                    </div>
                  </div>

                  {/* Name & Tagline */}
                  <div className="mt-4 space-y-1">
                    <Link
                      href={`/organizer/${org.slug}`}
                      className="text-lg font-black uppercase text-white hover:text-[#C8FF16] transition-colors block leading-snug"
                    >
                      {org.name}
                    </Link>
                    <p className="text-xs text-[#C8FF16] uppercase">
                      {org.city} // {org.categories.join(' • ')}
                    </p>
                    <p className="text-xs text-white/60 font-sans mt-2 line-clamp-2 leading-relaxed">
                      {org.description}
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10 text-[11px]">
                    <div className="p-2 bg-black/50 border border-white/5">
                      <div className="text-white/40 text-[9px] uppercase">FOLLOWERS</div>
                      <div className="text-white font-bold">{org.followersCount.toLocaleString()}</div>
                    </div>
                    <div className="p-2 bg-black/50 border border-white/5">
                      <div className="text-white/40 text-[9px] uppercase">RATING</div>
                      <div className="text-[#C8FF16] font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#C8FF16]" />
                        {org.rating} / 5.0
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => toggleFollowOrganizer(org.id)}
                    className={`flex-1 py-2.5 text-xs font-bold uppercase transition-colors ${
                      followed
                        ? 'bg-[#C8FF16] text-black font-black'
                        : 'bg-black text-white border border-white/20 hover:border-white'
                    }`}
                  >
                    {followed ? '✓ FOLLOWING' : '+ FOLLOW'}
                  </button>

                  <Link
                    href={`/organizer/${org.slug}`}
                    className="px-3 py-2.5 bg-[#171914] hover:bg-white hover:text-black border border-white/20 text-xs font-bold uppercase transition-colors"
                  >
                    VIEW PROFILE ↗
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
