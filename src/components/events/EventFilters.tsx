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

const selectClasses =
  'border-b-2 border-border bg-transparent px-1 py-2.5 font-mono text-xs uppercase tracking-wider text-foreground focus:border-accent focus:outline-none cursor-pointer transition-colors';

export function EventFilters({
  filters,
  onChange,
  onReset,
  totalResults,
}: EventFiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false);

  const handleUpdate = (key: keyof FilterState, value: string | number | boolean) => {
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
    filters.query ? `"${filters.query}"` : null,
  ].filter(Boolean);

  return (
    <div className="space-y-6 font-mono text-xs text-foreground">
      {/* Primary toolbar — underline inputs, sharp panels */}
      <div className="flex flex-col items-stretch justify-between gap-4 border-2 border-border bg-card p-4 md:flex-row md:items-center sm:p-5">
        {/* Search — oversized underline field */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="SEARCH EXPERIENCES, ARTISTS, VENUES..."
            aria-label="Search experiences"
            value={filters.query}
            onChange={e => handleUpdate('query', e.target.value)}
            className="w-full border-b-2 border-border bg-transparent py-3 pl-8 pr-9 text-sm font-semibold uppercase tracking-tight text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-accent focus:outline-none"
          />
          <Search className="pointer-events-none absolute left-0 top-3.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          {filters.query && (
            <button
              onClick={() => handleUpdate('query', '')}
              className="absolute right-0 top-3.5 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* City / category / sort / advanced / view */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filters.city}
            onChange={e => handleUpdate('city', e.target.value)}
            aria-label="Filter by city"
            className={selectClasses}
          >
            {CITIES.map(c => (
              <option key={c.id} value={c.name === 'All Cities' ? 'all' : c.name}>
                CITY: {c.name.toUpperCase()}
              </option>
            ))}
          </select>

          <select
            value={filters.category}
            onChange={e => handleUpdate('category', e.target.value)}
            aria-label="Filter by category"
            className={selectClasses}
          >
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.slug}>
                CATEGORY: {cat.name.toUpperCase()}
              </option>
            ))}
          </select>

          <select
            value={filters.sort}
            onChange={e => handleUpdate('sort', e.target.value)}
            aria-label="Sort results"
            className={`${selectClasses} hidden lg:block`}
          >
            <option value="featured">SORT: FEATURED</option>
            <option value="date_asc">SORT: DATE (SOONEST)</option>
            <option value="popularity">SORT: POPULARITY</option>
            <option value="price_asc">SORT: PRICE (LOW-HIGH)</option>
            <option value="price_desc">SORT: PRICE (HIGH-LOW)</option>
          </select>

          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            aria-expanded={isAdvancedOpen}
            className={`flex items-center gap-1.5 border-2 px-3 py-2.5 uppercase tracking-wider transition-colors ${
              isAdvancedOpen || activeFilterCount.length > 0
                ? 'border-accent bg-accent font-bold text-accent-foreground'
                : 'border-border bg-transparent text-muted-foreground hover:border-foreground hover:text-foreground'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount.length > 0 && (
              <span className="bg-black px-1.5 py-0.5 text-[10px] font-bold text-accent">
                {activeFilterCount.length}
              </span>
            )}
          </button>

          {/* View switcher */}
          <div className="flex border-2 border-border p-0.5" role="group" aria-label="View mode">
            {(
              [
                { mode: 'grid', Icon: Grid3X3, label: 'Grid view' },
                { mode: 'list', Icon: List, label: 'List view' },
                { mode: 'map', Icon: Map, label: 'Radar map view' },
              ] as const
            ).map(({ mode, Icon, label }) => (
              <button
                key={mode}
                onClick={() => handleUpdate('viewMode', mode)}
                className={`p-2 transition-colors ${
                  filters.viewMode === mode
                    ? 'bg-accent font-bold text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title={label}
                aria-label={label}
                aria-pressed={filters.viewMode === mode}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced filter drawer */}
      {isAdvancedOpen && (
        <div className="space-y-4 border-2 border-border bg-card p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label
                htmlFor="filter-format"
                className="mb-2 block text-[10px] uppercase tracking-widest text-muted-foreground"
              >
                VENUE FORMAT
              </label>
              <select
                id="filter-format"
                value={filters.format}
                onChange={e => handleUpdate('format', e.target.value)}
                className="w-full border-b-2 border-border bg-transparent py-2 text-xs uppercase tracking-wider text-foreground focus:border-accent focus:outline-none"
              >
                <option value="all">ALL FORMATS</option>
                <option value="warehouse">WAREHOUSE</option>
                <option value="outdoor">OUTDOOR / FESTIVAL</option>
                <option value="rooftop">ROOFTOP</option>
                <option value="physical">PHYSICAL VENUE</option>
                <option value="secret_location">SECRET LOCATION</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="filter-age"
                className="mb-2 block text-[10px] uppercase tracking-widest text-muted-foreground"
              >
                AGE RESTRICTION
              </label>
              <select
                id="filter-age"
                value={filters.age}
                onChange={e => handleUpdate('age', e.target.value)}
                className="w-full border-b-2 border-border bg-transparent py-2 text-xs uppercase tracking-wider text-foreground focus:border-accent focus:outline-none"
              >
                <option value="all">ANY AGE</option>
                <option value="21+">21+ ONLY</option>
                <option value="18+">18+ ONLY</option>
                <option value="All Ages">ALL AGES</option>
              </select>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>MAX PRICE</span>
                <span className="font-bold text-accent">
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
                aria-label="Maximum price"
                className="mt-3 w-full cursor-pointer accent-accent"
              />
            </div>

            <div className="space-y-3 pt-1">
              <label className="flex cursor-pointer items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={e => handleUpdate('verifiedOnly', e.target.checked)}
                  className="h-4 w-4 accent-accent"
                />
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  VERIFIED ORGANIZERS ONLY
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground">
                <input
                  type="checkbox"
                  checked={filters.availableOnly}
                  onChange={e => handleUpdate('availableOnly', e.target.checked)}
                  className="h-4 w-4 accent-accent"
                />
                <span>AVAILABLE TICKETS ONLY</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Results strip — the count is the graphic */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-border pb-4 text-[11px] uppercase tracking-wider text-muted-foreground">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-baseline gap-2">
            <span className="text-3xl font-bold leading-none tracking-tighter text-accent md:text-4xl">
              {String(totalResults).padStart(2, '0')}
            </span>
            <span className="font-bold">EXPERIENCES FOUND</span>
          </span>
          <span aria-hidden="true">•</span>
          <span>
            COORDINATES: <span className="font-bold text-foreground">{filters.city}</span>
          </span>

          {activeFilterCount.length > 0 && (
            <button
              onClick={onReset}
              className="border-2 border-danger/40 bg-danger/10 px-2 py-1 uppercase text-danger transition-colors hover:bg-danger hover:text-white"
            >
              CLEAR ALL FILTERS ✕
            </button>
          )}
        </div>

        <div className="hidden text-[10px] uppercase sm:block">
          GATE ZERO DISCOVERY ENGINE v2.6
        </div>
      </div>
    </div>
  );
}
