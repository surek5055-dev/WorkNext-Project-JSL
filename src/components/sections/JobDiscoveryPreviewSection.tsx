import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, ArrowRight, Building2, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';

export const JobDiscoveryPreviewSection: React.FC = () => {
  const { jobs } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredJobs = selectedCategory === 'all'
    ? jobs
    : jobs.filter(j => j.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <section className="py-24 bg-[#FAF9F6] dark:bg-[#111315] border-t border-stone-200/80 dark:border-stone-800/80 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/50 text-xs font-semibold text-[#0F766E] dark:text-teal-400">
              <Search className="w-3.5 h-3.5" />
              Intelligent Matching
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-white tracking-tight font-display">
              Precision Local Job Discovery
            </h2>
            <p className="text-base text-stone-600 dark:text-stone-300 font-sans">
              Discover verified local openings with complete salary transparency and instant compatibility ratings.
            </p>
          </div>

          <Link to="/jobs">
            <Button variant="outline" icon={<ArrowRight className="w-4 h-4" />}>
              Explore All Jobs
            </Button>
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 font-sans text-xs">
          {[
            { id: 'all', label: 'All Openings' },
            { id: 'engineering', label: 'Engineering' },
            { id: 'frontend', label: 'Frontend & UI' },
            { id: 'ai', label: 'AI & Data' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedCategory(f.id)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                selectedCategory === f.id
                  ? 'bg-[#0F766E] text-white shadow-xs'
                  : 'bg-white dark:bg-[#1A1D20] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Job Cards or Clean Empty State */}
        {filteredJobs.length === 0 ? (
          <div className="p-12 rounded-[24px] bg-white dark:bg-[#1A1D20] border border-dashed border-stone-200 dark:border-stone-800 text-center space-y-4 max-w-2xl mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 flex items-center justify-center mx-auto">
              <Briefcase className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white font-display">No Job Postings Available Yet</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sans max-w-md mx-auto">
                Verified regional openings with transparent salary bands will appear here as employers post roles.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 font-sans">
              <Link to="/recruiter">
                <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />} className="bg-[#0F766E] hover:bg-[#0D655E]">
                  Post a Role in Recruiter Portal
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredJobs.map((job, idx) => (
              <motion.div
                key={job.id ? `${job.id}-${idx}` : `job-prev-${idx}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-[22px] bg-white dark:bg-[#1A1D20] border border-stone-200/90 dark:border-stone-800 shadow-lg flex flex-col justify-between space-y-5 card-hover-lift group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/80 text-[#0F766E] dark:text-teal-300 border border-teal-200/60 text-[11px] font-mono font-bold">
                      {job.type}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                      Verified Pay
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white font-display group-hover:text-[#0F766E] dark:group-hover:text-teal-400 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-sans mt-1">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{job.company}</span>
                      <span>•</span>
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{job.location}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900/80 border border-stone-200/60 dark:border-stone-800 text-xs font-bold text-stone-900 dark:text-white font-mono">
                    ₹{job.salaryMin.toLocaleString()} - ₹{job.salaryMax.toLocaleString()} / yr
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.requirements.map((tag, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[11px] font-sans">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400 font-mono">Verified Opening</span>
                  <Link to="/jobs">
                    <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                      View Position
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
