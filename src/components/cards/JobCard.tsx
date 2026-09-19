import React from 'react';
import { motion } from 'motion/react';
import { Job } from '../../types';
import { Button } from '../ui/Button';
import { MapPin, DollarSign, Sparkles, Bookmark, BookmarkCheck, Users, Clock, CheckCircle2, ExternalLink, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface JobCardProps {
  job: Job;
  onSelect?: (job: Job) => void;
  compact?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelect, compact = false }) => {
  const { savedJobIds, appliedJobIds, toggleSaveJob, applyForJob } = useApp();

  const isSaved = savedJobIds.includes(job.id);
  const isApplied = appliedJobIds.includes(job.id);

  const formatSalary = (min: number, max: number, period: string) => {
    if (!min && !max) {
      return 'Salary disclosed upon application';
    }
    if (period === 'hour') {
      return `$${min}-$${max}/hr`;
    }
    if (min >= 100000 && max >= 100000) {
      return `₹${(min / 100000).toFixed(1)}L - ₹${(max / 100000).toFixed(1)}L/yr`;
    }
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k/yr`;
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="h-full w-full p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs hover:shadow-md transition-all relative flex flex-col justify-between group overflow-hidden"
    >
      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-11 h-11 rounded-xl object-cover border border-stone-200 dark:border-stone-800 bg-stone-50 shrink-0 group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/50 flex items-center justify-center font-bold text-sm text-[#0F766E] dark:text-teal-400 shrink-0 group-hover:scale-105 transition-transform font-display">
                {job.company ? job.company.charAt(0).toUpperCase() : 'J'}
              </div>
            )}
            <div>
              <h3
                onClick={() => onSelect && onSelect(job)}
                className="font-bold text-stone-900 dark:text-white text-base group-hover:text-[#0F766E] dark:group-hover:text-teal-400 transition-colors cursor-pointer line-clamp-1 font-display"
              >
                {job.title}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium font-sans">{job.company}</p>
            </div>
          </div>

          <button
            onClick={() => toggleSaveJob(job.id)}
            aria-label={isSaved ? 'Remove saved job' : 'Save job'}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isSaved
                ? 'bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 border border-teal-200 dark:border-teal-800'
                : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* AI Match Badge & Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {job.source === 'worknext' || (!job.source?.includes('adzuna') && !job.id.startsWith('adzuna_')) ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800/60 font-sans">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              WorkNext Recruiter
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-300/80 dark:border-sky-800/60 font-sans">
              <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              Adzuna
            </span>
          )}

          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/40 font-sans">
            <Sparkles className="w-3.5 h-3.5" />
            {job.matchScore}% Match
          </span>

          <span className="text-xs font-sans font-medium px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700">
            {job.type}
          </span>

          {job.urgent && (
            <span className="text-xs font-sans font-bold px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              Urgent
            </span>
          )}
        </div>

        {/* Details Row */}
        <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-300 mb-4 bg-stone-50 dark:bg-stone-900 p-3 rounded-xl border border-stone-200/80 dark:border-stone-800 font-sans">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="truncate">{job.location} {job.isRemote ? '(Remote)' : ''}</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-[#0F766E] dark:text-teal-400">
            <DollarSign className="w-3.5 h-3.5 shrink-0" />
            <span>{formatSalary(job.salaryMin, job.salaryMax, job.salaryPeriod)}</span>
          </div>
        </div>

        {!compact && (
          <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 mb-4 font-sans font-normal">
            {job.description}
          </p>
        )}

        {/* Skills preview */}
        {!compact && job.requirements.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 font-sans">
            {job.requirements.slice(0, 3).map((req, i) => (
              <span key={i} className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                {req}
              </span>
            ))}
            {job.requirements.length > 3 && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md text-stone-400 bg-stone-100 dark:bg-stone-800">
                +{job.requirements.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="pt-4 mt-auto border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] text-stone-400 font-sans min-w-0">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{job.postedDate}</span>
          <span>•</span>
          <Users className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{job.applicantsCount} applicants</span>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {onSelect && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelect(job)}
              className="h-9 px-3 text-xs whitespace-nowrap shrink-0"
            >
              Details
            </Button>
          )}

          {isApplied ? (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="text-[#0F766E] border-teal-200 bg-teal-50 flex items-center justify-center min-w-[104px] h-9 px-3.5 text-xs whitespace-nowrap shrink-0"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 shrink-0" /> Applied
            </Button>
          ) : job.applyUrl ? (
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                applyForJob(job.id, job);
              }}
              className="inline-flex shrink-0"
            >
              <Button
                variant="primary"
                size="sm"
                className="bg-[#0F766E] hover:bg-[#0D655E] flex items-center justify-center gap-1.5 min-w-[104px] h-9 px-3.5 text-xs whitespace-nowrap shrink-0"
              >
                Apply Now <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </Button>
            </a>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => applyForJob(job.id, job)}
              className="bg-[#0F766E] hover:bg-[#0D655E] flex items-center justify-center min-w-[104px] h-9 px-3.5 text-xs whitespace-nowrap shrink-0"
            >
              Apply Now
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
