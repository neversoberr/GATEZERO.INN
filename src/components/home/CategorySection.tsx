'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/data/initial-data';
import { 
  Radio, 
  Music, 
  Tent, 
  Moon, 
  Mic, 
  Palette, 
  Cpu, 
  Globe, 
  Lock, 
  ArrowUpRight, 
  Sparkles 
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Radio,
  Music,
  Tent,
  Moon,
  Mic,
  Palette,
  Cpu,
  Globe,
  Lock,
  Sparkles
};

export function CategorySection() {
  return (
    <section className="py-16 bg-[#080907] border-y border-white/10 text-[#F1F1EB] font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="pb-8 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#C8FF16] font-bold">
              TAXONOMY MATRIX
            </div>
            <h2 className="text-3xl font-black uppercase text-white mt-1">
              BROWSE BY FREQUENCY
            </h2>
          </div>
          <div className="text-xs text-white/50">
            SELECTED GENRES, ROOMS & FORMATS
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-8">
          {CATEGORIES.filter(c => c.id !== 'all').map(cat => {
            const IconComponent = iconMap[cat.icon] || Sparkles;
            return (
              <Link
                key={cat.id}
                href={`/events?category=${cat.slug}`}
                className="group p-4 sm:p-5 bg-[#0e100c] border border-white/10 hover:border-[#C8FF16] transition-all flex flex-col justify-between aspect-square relative overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-black border border-white/10 text-[#C8FF16] group-hover:bg-[#C8FF16] group-hover:text-black transition-colors">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-[#C8FF16] transition-colors" />
                </div>

                <div>
                  <div className="text-xs sm:text-sm font-black uppercase tracking-tight text-white group-hover:text-[#C8FF16] transition-colors leading-tight">
                    {cat.name}
                  </div>
                  <div className="text-[10px] text-white/40 uppercase mt-1">
                    ACCESS GATE
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
