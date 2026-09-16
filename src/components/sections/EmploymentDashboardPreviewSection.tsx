import React from 'react';
import { motion } from 'motion/react';
import { Activity, ArrowRight, BarChart2, Briefcase, IndianRupee, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';

export const EmploymentDashboardPreviewSection: React.FC = () => {
  const { jobs } = useApp();

  const totalOpenings = jobs.length;
  const avgSalary = totalOpenings > 0
    ? Math.round(jobs.reduce((acc, j) => acc + (j.salaryMin + j.salaryMax) / 2, 0) / totalOpenings)
    : 0;

  // Extract real skills from jobs
  const skillCountMap: Record<string, number> = {};
  jobs.forEach(j => {
    j.requirements.forEach(req => {
      skillCountMap[req] = (skillCountMap[req] || 0) + 1;
    });
  });
  const topInDemandSkills = Object.entries(skillCountMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <section className="py-24 bg-white/60 dark:bg-[#16181A]/60 border-t border-stone-200/80 dark:border-stone-800/80 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/50 text-xs font-semibold text-[#0F766E] dark:text-teal-400">
              <Activity className="w-3.5 h-3.5" />
              Workforce Intelligence
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-white tracking-tight font-display">
              Regional Wage & Market Analytics
            </h2>
            <p className="text-base text-stone-600 dark:text-stone-300 font-sans">
              Real-time analytics computed directly from active postings published across India's emerging workforce corridors.
            </p>
          </div>

          <Link to="/insights">
            <Button variant="outline" icon={<ArrowRight className="w-4 h-4" />}>
              Open Full Analytics
            </Button>
          </Link>
        </div>

        {/* Dashboard Visual Container */}
        <div className="rounded-[28px] bg-white dark:bg-[#1A1D20] border border-stone-200/90 dark:border-stone-800 shadow-2xl p-6 sm:p-9 space-y-8 card-hover-lift">
          
          {totalOpenings === 0 ? (
            <div className="p-12 text-center space-y-4 max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 flex items-center justify-center mx-auto">
                <BarChart2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white font-display">No Market Data Available Yet</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                  Wage benchmarks, hiring velocity indices, and in-demand skill curves will calculate automatically as employers and recruiters publish verified postings.
                </p>
              </div>
              <div className="pt-2">
                <Link to="/recruiter">
                  <Button variant="primary" size="sm" className="bg-[#0F766E] hover:bg-[#0D655E]">
                    Post a Job Opening
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Top Metric Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-stone-100 dark:border-stone-800">
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800 space-y-1">
                  <span className="text-[10px] font-mono text-stone-400 font-bold uppercase">Active Verified Openings</span>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-display">{totalOpenings}</p>
                  <p className="text-xs text-stone-500 font-sans">Current regional roles</p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800 space-y-1">
                  <span className="text-[10px] font-mono text-stone-400 font-bold uppercase">Average Compensation</span>
                  <p className="text-2xl font-black text-[#0F766E] dark:text-teal-400 font-display">₹{avgSalary.toLocaleString()} / yr</p>
                  <p className="text-xs text-stone-500 font-sans">Computed across active listings</p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800 space-y-1">
                  <span className="text-[10px] font-mono text-stone-400 font-bold uppercase">Primary Coverage</span>
                  <p className="text-lg font-bold text-stone-900 dark:text-white font-display truncate">India Wide</p>
                  <p className="text-xs text-stone-500 font-sans">Live Employer Postings</p>
                </div>
              </div>

              {/* Core Analytics Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans text-xs">
                
                {/* Left: Top In-Demand Skills */}
                <div className="lg:col-span-12 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 dark:text-white text-sm font-display">
                      Most In-Demand Skills in Active Jobs
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">Live Demand</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {topInDemandSkills.map(([skill, count], idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-950 text-[#0F766E] dark:text-teal-400 flex items-center justify-center font-mono font-bold text-[10px]">
                            0{idx + 1}
                          </span>
                          <span className="font-semibold text-stone-800 dark:text-stone-200">{skill}</span>
                        </div>
                        <span className="text-[11px] font-mono text-[#0F766E] dark:text-teal-400 font-bold">
                          {count} roles
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </>
          )}

          {/* Bottom Bar */}
          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-stone-500">
            <span className="font-mono">Live Workforce Analytics • WorkNext Platform</span>
            <Link to="/insights" className="text-[#0F766E] dark:text-teal-400 font-bold hover:underline">
              Analyze Regional Insights →
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};
