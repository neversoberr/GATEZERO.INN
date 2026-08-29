'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Search, ArrowRight, Activity } from 'lucide-react';
import { CITIES, CATEGORIES } from '@/lib/data/initial-data';

export function HeroSection() {
  const router = useRouter();
  const [what, setWhat] = useState('');
  const [city, setCity] = useState('all');
  const [category, setCategory] = useState('all');

  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  /* Scroll-triggered hero parallax: scale 1 → 1.2, fade out — the
     "zoom into the poster" effect. Disabled for reduced motion. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const motionStyle = prefersReducedMotion
    ? undefined
    : { scale, opacity };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (what.trim()) params.set('query', what.trim());
    if (city !== 'all') params.set('city', city);
    if (category !== 'all') params.set('category', category);

    router.push(`/events?${params.toString()}`);
  };

  const inputClasses =
    'w-full border-b-2 border-border bg-transparent px-0 py-3 text-lg font-semibold uppercase tracking-tight text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none transition-colors';

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative flex min-h-[88vh] flex-col justify-center overflow-hidden border-b-2 border-border bg-background py-24 md:py-32"
    >
      {/* Structural grid + massive background numeral — depth via color, not shadow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60" aria-hidden="true" />
      <div
        className="absolute -right-10 top-16 hidden select-none text-[34vw] font-bold leading-none tracking-tighter text-muted md:block"
        aria-hidden="true"
      >
        00
      </div>

      <motion.div style={motionStyle} className="relative z-10 w-full max-w-[95vw] px-4 md:px-8">
        {/* Signal status kicker */}
        <div className="mb-8 inline-flex items-center gap-3 border-2 border-border bg-card px-4 py-2 font-mono text-xs uppercase tracking-widest">
          <span className="h-2 w-2 animate-pulse-slow bg-accent" aria-hidden="true" />
          <span className="font-bold text-accent">RADAR: LIVE ACCESS NETWORK</span>
          <span className="text-muted-foreground" aria-hidden="true">|</span>
          <span className="text-muted-foreground">42+ TRANSMISSIONS ACROSS INDIA</span>
        </div>

        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          {/* Left: the headline is the hero */}
          <div className="lg:col-span-7">
            <h1
              id="hero-heading"
              className="text-[clamp(3.5rem,11vw,11rem)] font-bold uppercase leading-[0.85] tracking-tighter text-foreground"
            >
              ENTER
              <br />
              WHAT&rsquo;S
              <br />
              <span className="text-accent">NEXT.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-tight tracking-tight text-muted-foreground md:text-xl lg:text-2xl">
              Find the rooms, sounds, and ideas worth leaving home for.
              Direct access passes for underground electronic music, warehouse
              gatherings, and independent culture.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/events"
                className="flex h-14 items-center gap-2 bg-accent px-8 text-sm font-bold uppercase tracking-tighter text-accent-foreground transition-all hover:scale-105 active:scale-95"
              >
                <span>Explore all gates</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              <Link
                href="/organizer/events/new"
                className="flex h-14 items-center border-2 border-border px-8 text-sm font-bold uppercase tracking-tighter text-foreground transition-colors hover:bg-foreground hover:text-accent-foreground"
              >
                + List an experience
              </Link>
            </div>
          </div>

          {/* Right: featured dispatch — floods acid on hover */}
          <div className="lg:col-span-5">
            <Link
              href="/events/steelworks-after-dark"
              className="group block border-2 border-border bg-card p-8 transition-colors duration-300 hover:border-accent hover:bg-accent"
            >
              <div className="flex items-center justify-between border-b-2 border-border pb-4 font-mono text-xs uppercase tracking-widest transition-colors group-hover:border-black/30">
                <span className="text-muted-foreground group-hover:text-black/70">
                  SIGNAL GATE // GZ-MUM-001
                </span>
                <span className="flex items-center gap-1.5 font-bold text-accent group-hover:text-black">
                  <Activity className="h-3.5 w-3.5" aria-hidden="true" />
                  LIVE NOW
                </span>
              </div>

              <div className="mt-6 space-y-2">
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground group-hover:text-black/70">
                  FEATURED DISPATCH
                </div>
                <div className="text-2xl font-bold uppercase leading-none tracking-tighter text-foreground group-hover:text-black md:text-3xl">
                  Steelworks:
                  <br />
                  After Dark
                </div>
                <p className="text-sm text-muted-foreground group-hover:text-black/80">
                  Raw industrial techno inside a disused mill • Reay Road, Mumbai
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-px border-2 border-border bg-border transition-colors group-hover:border-black/30 font-mono text-xs">
                <div className="bg-card p-4 transition-colors group-hover:bg-accent">
                  <div className="text-muted-foreground group-hover:text-black/60">DOORS OPEN</div>
                  <div className="mt-1 font-bold text-foreground group-hover:text-black">21:00 IST</div>
                </div>
                <div className="bg-card p-4 transition-colors group-hover:bg-accent">
                  <div className="text-muted-foreground group-hover:text-black/60">CAPACITY HASH</div>
                  <div className="mt-1 font-bold text-accent group-hover:text-black">84% BOOKED</div>
                </div>
              </div>

              <div className="mt-6 flex h-14 items-center justify-center gap-2 bg-accent text-sm font-bold uppercase tracking-tighter text-accent-foreground transition-colors group-hover:bg-black group-hover:text-accent">
                DIRECT PASS ACCESS ↗
              </div>
            </Link>
          </div>
        </div>

        {/* Discovery console — oversized underline inputs */}
        <form
          onSubmit={handleSearch}
          className="mt-16 border-2 border-border bg-background p-6 md:p-8"
          aria-label="Search events"
        >
          <div className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <Search className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            EXPERIENCE DISCOVERY CONSOLE // PARAMETERS
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
            <div>
              <label
                htmlFor="hero-what"
                className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground"
              >
                What (event / artist / venue)
              </label>
              <input
                id="hero-what"
                type="text"
                placeholder="e.g. TECHNO, KASST, WAREHOUSE"
                value={what}
                onChange={e => setWhat(e.target.value)}
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor="hero-city"
                className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground"
              >
                Where (city)
              </label>
              <select
                id="hero-city"
                value={city}
                onChange={e => setCity(e.target.value)}
                className={`${inputClasses} cursor-pointer`}
              >
                {CITIES.map(c => (
                  <option key={c.id} value={c.name === 'All Cities' ? 'all' : c.name}>
                    {c.name.toUpperCase()} {c.code !== 'ALL' ? `[${c.code}]` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="hero-category"
                className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground"
              >
                Category
              </label>
              <select
                id="hero-category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className={`${inputClasses} cursor-pointer`}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="flex h-[58px] w-full items-center justify-center gap-2 bg-accent px-8 text-sm font-bold uppercase tracking-tighter text-accent-foreground transition-all hover:scale-105 hover:bg-accent-hover active:scale-95 sm:w-auto"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                <span>Explore gate ↗</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
