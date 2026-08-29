import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface SectionHeadingProps {
  /** Mono kicker line above the heading (rendered uppercase) */
  kicker: string;
  /** The massive display heading (rendered uppercase, fluid scale) */
  title: string;
  /** Accent-highlighted trailing word inside the heading, e.g. "NEXT." */
  accentTitle?: string;
  actionHref?: string;
  actionLabel?: string;
  /** Accessible id for the section (aria-labelledby) */
  id?: string;
}

/**
 * Standard kinetic section lockup: mono kicker → clamp-scaled display
 * heading → optional action link. Keeps heading scale consistent
 * across every section of the app.
 */
export function SectionHeading({
  kicker,
  title,
  accentTitle,
  actionHref,
  actionLabel,
  id,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-6 border-b-2 border-border pb-8 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <div className="mb-4 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
          <span className="inline-block h-2 w-2 bg-accent" aria-hidden="true" />
          {kicker}
        </div>
        <h2
          id={id}
          className="text-[clamp(2.5rem,7vw,5.5rem)] font-bold uppercase leading-[0.85] tracking-tighter text-foreground"
        >
          {title}
          {accentTitle && (
            <span className="text-accent"> {accentTitle}</span>
          )}
        </h2>
      </div>

      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="group flex shrink-0 items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent md:pb-2"
        >
          <span className="border-b-2 border-border pb-1 transition-colors group-hover:border-accent">
            {actionLabel}
          </span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
