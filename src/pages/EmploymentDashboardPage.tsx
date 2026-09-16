import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useApp } from '../context/AppContext';
import { BarChart3, Zap, Globe2 } from 'lucide-react';

export const EmploymentDashboardPage: React.FC = () => {
  const { jobs } = useApp();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Title */}
        <div>
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/50 text-xs font-semibold text-[#0F766E] dark:text-teal-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] dark:bg-teal-400" />
            Labor & Skill Analytics
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-white mt-2 font-display">
            Employment & Market Insights
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 font-sans">
            Real-time economic indicators, top demanded skill matrices, and regional wage forecasts.
          </p>
        </div>

        {/* Region Banner */}
        <div className="p-4 sm:p-5 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs flex items-center justify-between text-xs text-stone-900 dark:text-white font-sans">
          <div className="flex items-center gap-2.5">
            <Globe2 className="w-4 h-4 text-[#0F766E] dark:text-teal-400" />
            <span className="text-stone-500 font-medium">Active Region:</span>
            <span className="font-bold text-stone-900 dark:text-white font-display">All India / Pan-National</span>
          </div>
          <span className="text-stone-400 text-xs font-sans">Live Aggregation</span>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-2">
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider font-sans">Unemployment Rate</p>
            <p className="text-3xl font-extrabold text-stone-900 dark:text-white font-display">--</p>
            <p className="text-[11px] font-sans text-stone-500 dark:text-stone-400">Awaiting census telemetry</p>
          </div>

          <div className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-2">
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider font-sans">Underemployment Index</p>
            <p className="text-3xl font-extrabold text-[#0F766E] dark:text-teal-400 font-display">--</p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sans font-normal">Calculated upon user onboarding</p>
          </div>

          <div className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-2">
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider font-sans">Active Verified Listings</p>
            <p className="text-3xl font-extrabold text-stone-900 dark:text-white font-display">{jobs.length}</p>
            <p className="text-[11px] font-sans text-[#0F766E] dark:text-teal-400 font-bold">Verified employer postings</p>
          </div>

          <div className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-2">
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider font-sans">Avg Wage Growth</p>
            <p className="text-3xl font-extrabold text-[#0F766E] dark:text-teal-400 font-display">--</p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sans font-normal">Wage index tracking</p>
          </div>
        </div>

        {/* Demand Skills Table */}
        <div className="p-8 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2.5 font-display">
            <Zap className="w-5 h-5 text-amber-500" /> Top In-Demand Regional Competencies
          </h2>

          <div className="p-8 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800 text-center space-y-3 bg-stone-50/50 dark:bg-stone-900/40">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-white font-display">No Market Skill Aggregates Yet</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto font-sans">
              As employers post job vacancies and define prerequisite skills, real-time demand frequency charts will be computed and displayed here.
            </p>
          </div>
        </div>

        {/* Hiring Trends Visual Bar Matrix */}
        <div className="p-8 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2.5 font-display">
            <BarChart3 className="w-5 h-5 text-[#0F766E] dark:text-teal-400" /> Monthly Job Openings vs Placements
          </h2>

          <div className="p-8 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800 text-center space-y-3 bg-stone-50/50 dark:bg-stone-900/40">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-white font-display">No Historical Placement Telemetry</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto font-sans">
              Monthly placement metrics will track verified candidate hiring once applications are reviewed and processed by employers.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
