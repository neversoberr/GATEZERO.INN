'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/data/initial-data';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Kinetic index list: type is the interface. Each category is a
 * full-width row — massive uppercase name, mono index number,
 * hover floods acid and slides the title.
 */
export function CategorySection() {
  const categories = CATEGORIES.filter(c => c.id !== 'all');

  return (
    <section
      aria-labelledby="category-heading"
      className="border-y-2 border-border bg-card py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-[95vw] px-4 md:px-8">
        <SectionHeading
          id="category-heading"
          kicker="TAXONOMY MATRIX"
          title="BROWSE BY"
          accentTitle="FREQUENCY"
          actionHref="/events"
          actionLabel="ALL CATEGORIES"
        />

        <ul className="mt-4 border-t-2 border-border">
          {categories.map((cat, i) => (
            <li key={cat.id} className="border-b-2 border-border">
              <Link
                href={`/events?category=${cat.slug}`}
                className="group flex items-center gap-5 py-5 transition-colors duration-300 hover:bg-accent md:gap-8 md:py-6"
              >
                <span className="w-10 shrink-0 font-mono text-xs font-bold tracking-widest text-accent transition-colors group-hover:text-black md:text-sm">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span className="min-w-0 flex-1 text-2xl font-bold uppercase leading-none tracking-tighter text-foreground transition-all duration-300 group-hover:translate-x-4 group-hover:text-black md:text-5xl lg:text-6xl">
                  {cat.name}
                </span>

                <span className="hidden shrink-0 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-black/70 sm:block">
                  ACCESS GATE
                </span>
                <span
                  className="shrink-0 text-3xl leading-none text-muted-foreground transition-all duration-300 group-hover:translate-x-2 group-hover:text-black md:text-5xl"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
