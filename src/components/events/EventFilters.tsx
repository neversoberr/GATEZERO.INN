'use client';

import React from 'react';
import { CITIES, CATEGORIES } from '@/lib/data/initial-data';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Grid3X3, 
  List, 
  Map, 
  ShieldCheck, 
  ChevronDown 
} from 'lucide-react';

export interface FilterState {
  query: string;
  city: string;
  category: string;
  format: string;
  age: string;
  maxPrice: number;
  verifiedOnly: boolean;
  availableOnly: boolean;
  sort: string;
  viewMode: 'grid' | 'list' | 'map';
}

interface EventFiltersProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

export function EventFilters({
  filters,
  onChange,
  onReset,
  totalResults
}: EventFiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false);

  const handleUpdate = (key: keyof FilterState, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const activeFilterCount = [
    filters.city !== 'all' ? filters.city : null,
    filters.category !== 'all' ? filters.category : null,
    filters.format !== 'all' ? filters.format : null,
    filters.age !== 'all' ? filters.age : null,
    filters.verifiedOnly ? 'Verified Only' : null,
    filters.availableOnly ? 'Available Only' : null,
    filters.maxPrice < 10000 ? `Max ₹${filters.maxPrice}` : null,
    filters.query ? `"${filters.query}"` : null
  ].filter(Boolean);

  return (
    <div className="space-y-4 font-mono text-xs text-[#F1F1EB]">
      {/* Primary Industrial Search & Toolbar */}
      <div className="bg-[#0e100c] border border-white/10 p-3 sm:p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search experiences, artists, venues, organizers..."
            value={filters.query}
            onChange={e => handleUpdate('query', e.target.value)}
            className="w-full bg-black/60 border border-white/20 px-3 py-2.5 pl-9 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#C8FF16] transition-colors"
          />
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-3 pointer-events-none" />
          {filters.query && (
            <button
              onClick={() => handleUpdate('query', '')}
              className="absolute right-3 top-2.5 text-white/40 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* City Filter */}
        <div className="flex items-center gap-2">
          <select
            value={filters.city}
            onChange={e => handleUpdate('city', e.target.value)}
            className="bg-black/60 border border-white/20 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8FF16] uppercase cursor-pointer"
          >
            {CITIES.map(c => (
              <option key={c.id} value={c.name === 'All Cities' ? 'all' : c.name}>
                CITY: {c.name.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={e => handleUpdate('category', e.target.value)}
            className="bg-black/60 border border-white/20 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8FF16] uppercase cursor-pointer"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.slug}>
                CATEGORY: {cat.name.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Sort selector */}
          <select
            value={filters.sort}
            onChange={e => handleUpdate('sort', e.target.value)}
            className="bg-black/60 border border-white/20 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8FF16] uppercase cursor-pointer hidden lg:block"
          >
            <option value="featured">SORT: FEATURED</option>
            <option value="date_asc">SORT: DATE (SOONEST)</option>
            <option value="popularity">SORT: POPULARITY</option>
            <option value="price_asc">SORT: PRICE (LOW-HIGH)</option>
            <option value="price_desc">SORT: PRICE (HIGH-LOW)</option>
          </select>

          {/* Toggle Advanced Filters */}
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className={`px-3 py-2.5 border uppercase flex items-center gap-1.5 transition-colors ${
              isAdvancedOpen || activeFilterCount.length > 0
                ? 'bg-[#C8FF16] text-black border-[#C8FF16] font-bold'
                : 'bg-black/60 text-white/80 border-white/20 hover:border-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">FILTERS</span>
            {activeFilterCount.length > 0 && (
              <span className="px-1.5 py-0.2 bg-black text-[#C8FF16] text-[10px] font-black">
                {activeFilterCount.length}
              </span>
            )}
          </button>

          {/* View Mode Switcher */}
          <div className="flex border border-white/20 bg-black/60 p-0.5">
            <button
              onClick={() => handleUpdate('viewMode', 'grid')}
              className={`p-2 transition-colors ${
                filters.viewMode === 'grid' ? 'bg-[#C8FF16] text-black font-bold' : 'text-white/60 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleUpdate('viewMode', 'list')}
              className={`p-2 transition-colors ${
                filters.viewMode === 'list' ? 'bg-[#C8FF16] text-black font-bold' : 'text-white/60 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleUpdate('viewMode', 'map')}
              className={`p-2 transition-colors ${
                filters.viewMode === 'map' ? 'bg-[#C8FF16] text-black font-bold' : 'text-white/60 hover:text-white'
              }`}
              title="Radar Map View"
            >
              <Map className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filter Drawer */}
      {isAdvancedOpen && (
        <div className="bg-[#121410] border border-white/10 p-4 sm:p-5 space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Format filter */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1.5">
                VENUE FORMAT
              </label>
              <select
                value={filters.format}
                onChange={e => handleUpdate('format', e.target.value)}
                className="w-full bg-black border border-white/20 p-2 text-xs text-white focus:outline-none focus:border-[#C8FF16] uppercase"
              >
                <option value="all">ALL FORMATS</option>
                <option value="warehouse">WAREHOUSE</option>
                <option value="outdoor">OUTDOOR / FESTIVAL</option>
                <option value="rooftop">ROOFTOP</option>
                <option value="physical">PHYSICAL VENUE</option>
                <option value="secret_location">SECRET LOCATION</option>
              </select>
            </div>

            {/* Age filter */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1.5">
                AGE RESTRICTION
              </label>
              <select
                value={filters.age}
                onChange={e => handleUpdate('age', e.target.value)}
                className="w-full bg-black border border-white/20 p-2 text-xs text-white focus:outline-none focus:border-[#C8FF16] uppercase"
              >
                <option value="all">ANY AGE</option>
                <option value="21+">21+ ONLY</option>
                <option value="18+">18+ ONLY</option>
                <option value="All Ages">ALL AGES</option>
              </select>
            </div>

            {/* Price Max slider */}
            <div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/50 mb-1.5">
                <span>MAX PRICE</span>
                <span className="text-[#C8FF16] font-bold">
                  {filters.maxPrice >= 10000 ? 'NO LIMIT' : `₹${filters.maxPrice.toLocaleString('en-IN')}`}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="500"
                value={filters.maxPrice}
                onChange={e => handleUpdate('maxPrice', Number(e.target.value))}
                className="w-full accent-[#C8FF16] bg-black cursor-pointer"
              />
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80 hover:text-white">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={e => handleUpdate('verifiedOnly', e.target.checked)}
                  className="accent-[#C8FF16]"
                />
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C8FF16]" />
                  VERIFIED ORGANIZERS ONLY
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80 hover:text-white">
                <input
                  type="checkbox"
                  checked={filters.availableOnly}
                  onChange={e => handleUpdate('availableOnly', e.target.checked)}
                  className="accent-[#C8FF16]"
                />
                <span>AVAILABLE TICKETS ONLY</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Chips Bar & Results Counter */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/60">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-white/40 uppercase">COORDINATES:</span>
          <span className="text-white font-bold uppercase">{filters.city}</span>
          <span>•</span>
          <span className="text-[#C8FF16] font-bold">{totalResults} EXPERIENCES FOUND</span>

          {activeFilterCount.length > 0 && (
            <button
              onClick={onReset}
              className="ml-2 px-2 py-0.5 bg-[#FF314A]/10 text-[#FF314A] hover:bg-[#FF314A] hover:text-black border border-[#FF314A]/30 uppercase transition-colors"
            >
              CLEAR ALL FILTERS ✕
            </button>
          )}
        </div>

        <div className="text-[10px] text-white/40 uppercase hidden sm:block">
          GATE ZERO DISCOVERY ENGINE v2.6
        </div>
      </div>
    </div>
  );
}
