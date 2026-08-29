'use client';

import React from 'react';
import Link from 'next/link';
import { OrganizerCompany } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Marquee } from '@/components/motion/Marquee';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ShieldCheck, Star } from 'lucide-react';

interface OrganizersSectionProps {
  organizers: OrganizerCompany[];
}

/* Slow reading-rhythm marquee — organizer voices, speed 40 */
const VOICES = [
  {
    quote: 'Gate Zero moved our warehouse nights from WhatsApp chaos to sold-out phases in a single season.',
    author: 'SUBKULTURE INDIA',
    detail: 'MUMBAI // 12 EVENTS',
  },
  {
    quote: 'Settlements hit our account before we have even cleared the room. The door scanner never queues.',
    author: 'FREQUENCY COLLECTIVE',
    detail: 'BENGALURU // 8 EVENTS',
  },
  {
    quote: 'The tiered pass system finally lets us reward the heads who show up earliest.',
    author: 'OFF/GRID FESTIVAL',
    detail: 'GOA // 3-DAY FESTIVAL',
  },
  {
    quote: 'Promoter codes and affiliate tracking are built in — our street team gets paid automatically.',
    author: 'KHAOS COLLECTIVE',
    detail: 'DELHI NCR // 15 EVENTS',
  },
];

export function OrganizersSection({ organizers }: OrganizersSectionProps) {
  const { isOrganizerFollowed, toggleFollowOrganizer } = useAuth();

  return (
    <section
      aria-labelledby="organizers-heading"
      className="border-t-2 border-border bg-card py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-[95vw] px-4 md:px-8">
        <SectionHeading
          id="organizers-heading"
          kicker="CURATORS & COLLECTIVES"
          title="FEATURED"
          accentTitle="ORGANIZERS"
          actionHref="/organizer/onboarding"
          actionLabel="JOIN AS VERIFIED ORGANIZER"
        />

        {/* gap-px connected organizer cards */}
        <div className="mt-12 grid grid-cols-1 gap-px border-2 border-border bg-border md:grid-cols-3">
          {organizers.slice(0, 3).map(org => {
            const followed = isOrganizerFollowed(org.id);

            return (
              <article
                key={org.id}
                className="group flex flex-col justify-between gap-8 bg-background p-8 transition-colors duration-300 hover:bg-accent"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <img
                      src={org.logoUrl}
                      alt={org.name}
                      loading="lazy"
                      className="h-16 w-16 border-2 border-border bg-muted object-cover transition-colors group-hover:border-black/30"
                    />
                    <div className="flex items-center gap-1.5 border-2 border-border bg-card px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-accent transition-colors group-hover:border-black/30 group-hover:bg-black/80">
                      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      VERIFIED
                    </div>
                  </div>

                  <Link href={`/organizer/${org.slug}`} className="mt-6 block">
                    <h3 className="text-2xl font-bold uppercase leading-[0.9] tracking-tighter text-foreground transition-colors group-hover:text-black md:text-3xl lg:text-4xl">
                      {org.name}
                    </h3>
                  </Link>
                  <p className="mt-2 font-mono text-xs uppercase tracking-wider text-accent transition-colors group-hover:text-black">
                    {org.city} {'//'} {org.categories.join(' • ')}
                  </p>
                  <p className="mt-4 line-clamp-2 text-base leading-tight text-muted-foreground transition-colors group-hover:text-black/70">
                    {org.description}
                  </p>
                </div>

                <div>
                  <div className="grid grid-cols-2 gap-px border-2 border-border bg-border transition-colors group-hover:border-black/30">
                    <div className="bg-background p-4 font-mono transition-colors group-hover:bg-accent">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-black/60">
                        FOLLOWERS
                      </div>
                      <div className="mt-1 text-xl font-bold tracking-tighter text-foreground transition-colors group-hover:text-black">
                        {org.followersCount.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-background p-4 font-mono transition-colors group-hover:bg-accent">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-black/60">
                        RATING
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-xl font-bold tracking-tighter text-accent transition-colors group-hover:text-black">
                        <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                        {org.rating}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-stretch gap-2">
                    <button
                      onClick={() => toggleFollowOrganizer(org.id)}
                      className={`h-12 flex-1 text-xs font-bold uppercase tracking-tighter transition-colors ${
                        followed
                          ? 'bg-foreground text-accent-foreground group-hover:bg-black group-hover:text-accent'
                          : 'border-2 border-border text-foreground hover:border-foreground group-hover:border-black/40 group-hover:text-black'
                      }`}
                    >
                      {followed ? '✓ FOLLOWING' : '+ FOLLOW'}
                    </button>

                    <Link
                      href={`/organizer/${org.slug}`}
                      className="flex h-12 items-center border-2 border-border px-4 font-mono text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:border-foreground group-hover:border-black/40 group-hover:text-black"
                    >
                      PROFILE ↗
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Voices marquee — slow rhythm (speed 40), full bleed */}
      <div className="mt-24 overflow-hidden border-t-2 border-border" aria-label="What organizers say">
        <Marquee speed={40} className="py-10">
          {VOICES.map(v => (
            <figure
              key={v.author}
              className="mx-6 flex w-[22rem] flex-col justify-between gap-6 border-2 border-border bg-background p-8 md:w-[26rem]"
            >
              <blockquote className="text-lg leading-tight tracking-tight text-foreground md:text-xl">
                &ldquo;{v.quote}&rdquo;
              </blockquote>
              <figcaption className="font-mono text-xs uppercase tracking-widest">
                <span className="font-bold text-accent">{v.author}</span>
                <span className="text-muted-foreground"> — {v.detail}</span>
              </figcaption>
            </figure>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
