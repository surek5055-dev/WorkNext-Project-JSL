import React, { useState } from 'react';
import { Job } from '../../types';
import {
  Briefcase,
  Search,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  Trash2,
  Users,
  MapPin,
  Sparkles
} from 'lucide-react';

interface AdminJobsTabProps {
  jobs: Job[];
  isLoading: boolean;
  onToggleStatus: (jobId: string, currentStatus: string, title: string) => Promise<void>;
  onDeleteJob: (jobId: string, title: string) => Promise<void>;
  actionLoadingId: string | null;
}

export const AdminJobsTab: React.FC<AdminJobsTabProps> = ({
  jobs,
  isLoading,
  onToggleStatus,
  onDeleteJob,
  actionLoadingId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'closed'>('all');

  const filteredJobs = jobs.filter(j => {
    const status = j.status || 'active';
    if (filterStatus !== 'all' && status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = (j.title || '').toLowerCase().includes(q);
      const matchCompany = (j.company || '').toLowerCase().includes(q);
      const matchRecruiter = (j.recruiterEmail || '').toLowerCase().includes(q);
      return matchTitle || matchCompany || matchRecruiter;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-900 border border-stone-800">
          {(['all', 'active', 'closed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                filterStatus === status
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {status === 'all' ? 'All Jobs' : status}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search job title, company, or recruiter..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Jobs List */}
      {isLoading ? (
        <div className="p-12 text-center text-stone-400 text-xs font-mono">
          Loading job openings...
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-stone-800 bg-stone-900/40 space-y-2">
          <Briefcase className="w-8 h-8 text-stone-600 mx-auto" />
          <p className="text-sm font-semibold text-stone-300">No job openings found.</p>
          <p className="text-xs text-stone-500">
            Postings by verified recruiters will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map(job => {
            const status = job.status || 'active';
            const isActing = actionLoadingId === job.id;

            return (
              <div
                key={job.id}
                className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800/80 hover:border-stone-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-bold font-display text-white">
                      {job.title}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 ${
                        status === 'active'
                          ? 'bg-teal-950 border border-teal-700 text-teal-300'
                          : 'bg-stone-800 border border-stone-700 text-stone-400'
                      }`}
                    >
                      {status === 'active' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {status}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">
                      ID: {job.id.substring(0, 14)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-stone-400 flex-wrap">
                    <span className="font-medium text-stone-200 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-teal-400" />
                      {job.company}
                    </span>
                    {job.location && (
                      <span className="flex items-center gap-1 text-stone-400">
                        <MapPin className="w-3.5 h-3.5 text-stone-500" />
                        {job.location}
                      </span>
                    )}
                    {job.recruiterEmail && (
                      <span className="text-stone-400 font-mono text-[11px]">
                        Recruiter: {job.recruiterEmail}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-stone-500 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      Posted: {job.postedDate || 'Recent'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-1 text-xs text-stone-400">
                    <span className="inline-flex items-center gap-1 bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-800 font-mono text-[11px]">
                      <Users className="w-3 h-3 text-teal-400" />
                      Applicants: <strong className="text-white ml-1">{job.applicantsCount || 0}</strong>
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Type: {job.type} • Experience: {job.experienceLevel || 'Mid-Level'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                  <button
                    onClick={() => onToggleStatus(job.id, status, job.title)}
                    disabled={isActing}
                    className="px-3.5 py-1.5 rounded-xl border border-stone-700 bg-stone-800 hover:bg-stone-750 text-stone-300 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {status === 'active' ? 'Mark Closed' : 'Reactivate'}
                  </button>
                  <button
                    onClick={() => onDeleteJob(job.id, job.title)}
                    disabled={isActing}
                    className="p-2 rounded-xl border border-rose-900/60 bg-rose-950/40 hover:bg-rose-900 text-rose-300 transition-colors cursor-pointer disabled:opacity-50"
                    title="Delete opening permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
