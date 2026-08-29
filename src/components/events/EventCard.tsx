'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Event } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { 
  Bookmark, 
  MapPin, 
  Calendar, 
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
  const [isHovered, setIsHovered] = useState(false);

  const eventDateObj = new Date(event.startDate);
  const formattedDate = eventDateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();

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
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-[#0e100c] border border-white/10 hover:border-[#C8FF16] transition-all duration-300 flex flex-col justify-between overflow-hidden"
      style={{
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)'
      }}
    >
      {/* Top Media & Poster */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/80">
        <img
          src={event.posterUrl}
          alt={event.title}
          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
        />

        {/* Poster Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e100c] via-black/20 to-black/60 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 font-mono text-[10px]">
          <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md border border-white/20 text-white uppercase tracking-wider font-bold">
            {event.code}
          </span>

          <div className="flex items-center gap-1.5">
            {event.isSellingFast && (
              <span className="px-2 py-0.5 bg-[#FF6B00] text-black uppercase tracking-wider font-black flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 fill-black" />
                SELLING FAST
              </span>
            )}
            {event.isFeatured && (
              <span className="px-2 py-0.5 bg-[#C8FF16] text-black uppercase tracking-wider font-black">
                FEATURED
              </span>
            )}
          </div>
        </div>

        {/* Category & City Strip */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-white/90">
          <span className="px-2 py-0.5 bg-black/70 border border-white/10 uppercase tracking-widest text-[#C8FF16]">
            {event.category.replace('_', ' ')}
          </span>
          <span className="flex items-center gap-1 bg-black/70 px-2 py-0.5 border border-white/10 uppercase font-bold text-white">
            <MapPin className="w-3 h-3 text-[#C8FF16]" />
            {event.city}
          </span>
        </div>

        {/* Quick View & Share Float on Hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
          <button
            onClick={handleQuickViewClick}
            className="px-3 py-2 bg-white hover:bg-[#C8FF16] text-black font-mono font-bold text-xs uppercase flex items-center gap-1.5 shadow-xl transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-black/80 hover:bg-white/20 border border-white/30 text-white transition-colors"
            title="Share event link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between font-mono">
        <div>
          {/* Date & Time */}
          <div className="flex items-center justify-between text-[11px] text-white/60 mb-2 pb-2 border-b border-white/10">
            <span className="flex items-center gap-1.5 text-white/90 font-bold">
              <Calendar className="w-3.5 h-3.5 text-[#C8FF16]" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1 text-white/60">
              <Clock className="w-3 h-3" />
              {formattedTime}
            </span>
          </div>

          {/* Title */}
          <Link href={`/events/${event.slug}`} className="block group-hover:text-[#C8FF16] transition-colors">
            <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white line-clamp-1 leading-snug">
              {event.title}
            </h3>
          </Link>

          {/* Venue & Organizer */}
          <p className="text-xs text-white/60 line-clamp-1 mt-1 font-sans">
            {event.venueName}
          </p>

          <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-white/50">
            <span className="truncate">BY {event.organizerName.toUpperCase()}</span>
            {event.isVerifiedOrganizer && (
              <span title="Verified Organizer">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C8FF16] shrink-0" />
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          <div>
            <div className="text-[9px] uppercase tracking-widest text-white/40">ENTRY FROM</div>
            <div className="text-base font-black text-[#C8FF16]">
              ₹{event.minPrice.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleSave}
              className={`p-2 border transition-colors ${
                saved
                  ? 'border-[#C8FF16] bg-[#C8FF16] text-black'
                  : 'border-white/10 bg-[#141612] text-white/60 hover:text-white hover:border-white/40'
              }`}
              title={saved ? 'Saved in Passes' : 'Save Event'}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <Link
              href={`/events/${event.slug}`}
              className="px-3.5 py-2 bg-[#C8FF16] hover:bg-[#b8ea14] text-black font-black uppercase text-xs flex items-center gap-1 transition-transform active:scale-95"
            >
              <span>GET PASS</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
