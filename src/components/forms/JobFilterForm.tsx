import React from 'react';
import { Search, MapPin, X, Sparkles, Globe } from 'lucide-react';
import { Button } from '../ui/Button';

interface JobFilterFormProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  locationFilter: string;
  onLocationChange: (loc: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedExp: string;
  onExpChange: (exp: string) => void;
  isRemoteOnly: boolean;
  onRemoteToggle: (remote: boolean) => void;
  minMatchScore: number;
  onMatchScoreChange: (score: number) => void;
  sourceFilter: 'all' | 'worknext' | 'adzuna';
  onSourceFilterChange: (source: 'all' | 'worknext' | 'adzuna') => void;
  counts?: {
    all: number;
    worknext: number;
    adzuna: number;
  };
  onReset: () => void;
}

export const JobFilterForm: React.FC<JobFilterFormProps> = ({
  searchQuery,
  onSearchChange,
  locationFilter,
  onLocationChange,
  selectedType,
  onTypeChange,
  selectedExp,
  onExpChange,
  isRemoteOnly,
  onRemoteToggle,
  minMatchScore,
  onMatchScoreChange,
  sourceFilter,
  onSourceFilterChange,
  counts,
  onReset
}) => {
  return (
    <div className="bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 rounded-[20px] p-6 shadow-xs space-y-4 text-stone-900 dark:text-white">
      {/* Top Search Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Keywords */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search titles or skills (React, AI, Python)..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#0F766E] transition-colors font-sans"
          />
        </div>

        {/* Location */}
        <div className="md:col-span-4 relative">
          <MapPin className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="City, State or ZIP..."
            value={locationFilter}
            onChange={e => onLocationChange(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#0F766E] transition-colors font-sans"
          />
        </div>

        {/* Type selector */}
        <div className="md:col-span-3">
          <select
            value={selectedType}
            onChange={e => onTypeChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E] font-medium transition-colors font-sans"
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>

      {/* Source Filter: All | WorkNext Recruiter | Adzuna */}
      <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-sans">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Job Source:</span>
          <div className="inline-flex p-1 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={() => onSourceFilterChange('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                sourceFilter === 'all'
                  ? 'bg-white dark:bg-[#252525] text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              All {counts ? `(${counts.all})` : ''}
            </button>
            <button
              type="button"
              onClick={() => onSourceFilterChange('worknext')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                sourceFilter === 'worknext'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              WorkNext Recruiter {counts ? `(${counts.worknext})` : ''}
            </button>
            <button
              type="button"
              onClick={() => onSourceFilterChange('adzuna')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                sourceFilter === 'adzuna'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-sky-600 dark:hover:text-sky-400'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Adzuna {counts ? `(${counts.adzuna})` : ''}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Remote toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-stone-700 dark:text-stone-300 font-medium">
            <input
              type="checkbox"
              checked={isRemoteOnly}
              onChange={e => onRemoteToggle(e.target.checked)}
              className="w-4 h-4 rounded text-[#0F766E] focus:ring-[#0F766E] border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
            />
            <span>Remote Only</span>
          </label>
        </div>
      </div>

      {/* Secondary Filter Row */}
      <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
        <div className="flex flex-wrap items-center gap-6">
          {/* Experience level */}
          <div className="flex items-center gap-2">
            <span className="text-stone-500 dark:text-stone-400">Level:</span>
            <select
              value={selectedExp}
              onChange={e => onExpChange(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs text-stone-800 dark:text-stone-200 focus:outline-none font-sans"
            >
              <option value="">All Levels</option>
              <option value="Entry-Level">Entry-Level</option>
              <option value="Mid-Level">Mid-Level</option>
              <option value="Senior">Senior</option>
              <option value="Executive">Executive</option>
            </select>
          </div>

          {/* AI Match Slider */}
          <div className="flex items-center gap-2">
            <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#0F766E] dark:text-teal-400" /> Min Match:
            </span>
            <input
              type="range"
              min="0"
              max="95"
              step="5"
              value={minMatchScore}
              onChange={e => onMatchScoreChange(Number(e.target.value))}
              className="w-28 accent-[#0F766E] cursor-pointer"
            />
            <span className="font-bold text-[#0F766E] dark:text-teal-400">{minMatchScore}%+</span>
          </div>
        </div>

        <Button variant="ghost" size="sm" icon={<X className="w-3.5 h-3.5" />} onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
};
