'use client';

import React from 'react';

interface MarqueeProps {
  /** Relative velocity. High-energy stats: 60–100. Reading content: 30–50. */
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  children: React.ReactNode;
}

/**
 * Infinite kinetic marquee — pure CSS translateX loop (GPU-composited,
 * linear timing, no gradient edges, never pauses).
 *
 * Implemented in CSS rather than react-fast-marquee because the library
 * (a) renders null on the server until mounted and (b) ignores
 * prefers-reduced-motion. This version SSRs its first paint and collapses
 * to a single static row under reduced motion. Content is rendered once
 * for assistive tech; duplicate copies are aria-hidden.
 */
export function Marquee({
  speed = 60,
  direction = 'left',
  className = '',
  children,
}: MarqueeProps) {
  /* duration scales inversely with speed, calibrated so the visible
     half-loop matches the px/s feel of the reference implementation */
  const duration = Math.max(12, Math.round(3200 / speed));

  const half = (hidden: boolean) => (
    <div className="marquee-half" data-marquee-copy={hidden ? 'clone' : 'original'} aria-hidden={hidden || undefined}>
      <div className="marquee-set">{children}</div>
      <div className="marquee-set" aria-hidden="true">
        {children}
      </div>
    </div>
  );

  return (
    <div className={`marquee-window overflow-hidden ${className}`}>
      <div
        className="marquee-track"
        style={{
          ['--marquee-duration' as string]: `${duration}s`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
        }}
      >
        {half(false)}
        {half(true)}
      </div>
    </div>
  );
}
