'use client';

import React from 'react';
import Link from 'next/link';
import { Event } from '@/types';
import { useAuth } from '@/context/AuthContext';
import {
  Bookmark,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  Zap,
  Eye,
  Share2
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface EventCardProps {
  event: Event;
  onQuickView?: (event: Event) => void;
}

export function EventCard({ event, onQuickView }: EventCardProps) {
  const { isEventSaved, toggleSaveEvent } = useAuth();
  const saved = isEventSaved(event.id);
  const toast = useToast();

  const eventDateObj = new Date(event.startDate);
  const dayNum = String(eventDateObj.getDate()).padStart(2, '0');
  const monthStr = eventDateObj
    .toLocaleDateString('en-GB', { month: 'short' })
    .toUpperCase();
  const yearStr = eventDateObj.getFullYear();
  const formattedTime = event.doorsOpenTime;

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/events/${event.slug}`);
      toast.success('LINK COPIED', `Pass URL copied for ${event.title}`);
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveEvent(event.id);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(event);
    }
  };

  return (
    <article className="group relative flex flex-col overflow-hidden border-2 border-border bg-background transition-colors duration-300 hover:border-accent hover:bg-accent">
      {/* Poster */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <img
          src={event.posterUrl}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover grayscale-[40%] transition-all duration-300 group-hover:grayscale-0"
        />

        {/* Badges */}
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2 font-mono text-[10px] uppercase tracking-widest">
          <span className="border border-border bg-background/90 px-2 py-1 font-bold text-foreground transition-colors group-hover:border-black/40 group-hover:bg-black/80 group-hover:text-accent">
            {event.code}
          </span>
          <div className="flex items-center gap-1.5">
            {event.isSellingFast && (
              <span className="flex items-center gap-1 bg-danger px-2 py-1 font-bold text-white">
                <Zap className="h-2.5 w-2.5 fill-white" aria-hidden="true" />
                SELLING FAST
              </span>
            )}
            {event.isFeatured && (
              <span className="bg-foreground px-2 py-1 font-bold text-accent-foreground">
                FEATURED
              </span>
            )}
          </div>
        </div>

        {/* Category & city chips */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-widest">
          <span className="border border-border bg-background/90 px-2 py-1 font-bold text-accent transition-colors group-hover:border-black/40 group-hover:bg-black/80">
            {event.category.replace('_', ' ')}
          </span>
          <span className="flex items-center gap-1 border border-border bg-background/90 px-2 py-1 font-bold text-foreground transition-colors group-hover:border-black/40 group-hover:bg-black/80 group-hover:text-black">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {event.city}
          </span>
        </div>

        {/* Quick view / share overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/70 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={handleQuickViewClick}
            className="flex h-11 items-center gap-1.5 bg-foreground px-4 font-mono text-xs font-bold uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent"
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Quick view</span>
          </button>
          <button
            onClick={handleShare}
            className="flex h-11 w-11 items-center justify-center border-2 border-foreground/40 text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-accent-foreground"
            title="Share event link"
            aria-label={`Share ${event.title}`}
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          {/* Massive date lockup — number as graphic */}
          <div className="mb-4 flex items-end gap-3 border-b-2 border-border pb-4 transition-colors group-hover:border-black/30">
            <span className="text-5xl font-bold leading-[0.8] tracking-tighter text-foreground transition-colors group-hover:text-black md:text-6xl">
              {dayNum}
            </span>
            <div className="pb-1 font-mono text-xs uppercase leading-tight tracking-widest text-muted-foreground transition-colors group-hover:text-black/70">
              <div className="font-bold">{monthStr} {yearStr}</div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {formattedTime}
              </div>
            </div>
          </div>

          <Link href={`/events/${event.slug}`} className="block">
            <h3 className="line-clamp-2 text-xl font-bold uppercase leading-[0.9] tracking-tighter text-foreground transition-colors group-hover:text-black md:text-2xl lg:text-3xl">
              {event.title}
            </h3>
          </Link>

          <p className="mt-2 line-clamp-1 text-sm text-muted-foreground transition-colors group-hover:text-black/70">
            {event.venueName}
          </p>

          <div className="mt-3 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-black/70">
            <span className="truncate">BY {event.organizerName}</span>
            {event.isVerifiedOrganizer && (
              <span title="Verified Organizer">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-accent transition-colors group-hover:text-black" aria-hidden="true" />
              </span>
            )}
          </div>
        </div>

        {/* Price + actions */}
        <div className="mt-6 flex items-end justify-between gap-3 pt-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-black/60">
              ENTRY FROM
            </div>
            <div className="text-2xl font-bold tracking-tighter text-accent transition-colors group-hover:text-black md:text-3xl">
              ₹{event.minPrice.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`flex h-12 w-12 items-center justify-center border-2 transition-colors ${
                saved
                  ? 'border-accent bg-accent text-accent-foreground group-hover:border-black group-hover:bg-black group-hover:text-accent'
                  : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground group-hover:border-black/40 group-hover:text-black'
              }`}
              title={saved ? 'Saved in Passes' : 'Save Event'}
              aria-label={saved ? `Remove ${event.title} from saved` : `Save ${event.title}`}
              aria-pressed={saved}
            >
              <Bookmark className="h-4 w-4" aria-hidden="true" />
            </button>

            <Link
              href={`/events/${event.slug}`}
              className="flex h-12 items-center gap-1 bg-accent px-5 text-xs font-bold uppercase tracking-tighter text-accent-foreground transition-colors group-hover:bg-black group-hover:text-accent"
            >
              <span>GET PASS</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
