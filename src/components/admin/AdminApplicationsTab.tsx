import React, { useState } from 'react';
import {
  FileCheck,
  Search,
  User,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Briefcase,
  Mail,
  Sparkles,
  Award
} from 'lucide-react';

interface CandidateApplication {
  id: string;
  name: string;
  email: string;
  role?: string;
  appliedJobTitle?: string;
  company?: string;
  status: string;
  matchScore?: number;
  appliedDate?: string;
  skills?: string[];
}

interface AdminApplicationsTabProps {
  applications: CandidateApplication[];
  isLoading: boolean;
  onUpdateStatus: (applicationId: string, newStatus: string) => Promise<void>;
  actionLoadingId: string | null;
}

export const AdminApplicationsTab: React.FC<AdminApplicationsTabProps> = ({
  applications,
  isLoading,
  onUpdateStatus,
  actionLoadingId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredApplications = applications.filter(app => {
    if (filterStatus !== 'all' && (app.status || 'applied') !== filterStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = (app.name || '').toLowerCase().includes(q);
      const matchEmail = (app.email || '').toLowerCase().includes(q);
      const matchJob = (app.appliedJobTitle || '').toLowerCase().includes(q);
      const matchCompany = (app.company || '').toLowerCase().includes(q);
      return matchName || matchEmail || matchJob || matchCompany;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-900 border border-stone-800 overflow-x-auto">
          {['all', 'applied', 'under_review', 'shortlisted', 'selected', 'rejected'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize shrink-0 transition-all ${
                filterStatus === s
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search candidate, job, company..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="p-12 text-center text-stone-400 text-xs font-mono">
          Loading application pipeline...
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-stone-800 bg-stone-900/40 space-y-2">
          <FileCheck className="w-8 h-8 text-stone-600 mx-auto" />
          <p className="text-sm font-semibold text-stone-300">No applications found.</p>
          <p className="text-xs text-stone-500">
            Candidate submissions for WorkNext recruiter jobs will populate here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApplications.map(app => {
            const status = app.status || 'applied';
            const isActing = actionLoadingId === app.id;

            return (
              <div
                key={app.id}
                className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800/80 hover:border-stone-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-bold font-display text-white">
                      {app.name}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                        status === 'selected'
                          ? 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                          : status === 'shortlisted'
                          ? 'bg-teal-950 border border-teal-700 text-teal-300'
                          : status === 'rejected'
                          ? 'bg-rose-950 border border-rose-800 text-rose-300'
                          : status === 'under_review'
                          ? 'bg-amber-950 border border-amber-800 text-amber-300'
                          : 'bg-stone-800 border border-stone-700 text-stone-300'
                      }`}
                    >
                      {status.replace('_', ' ')}
                    </span>
                    {app.matchScore && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-800/60">
                        <Sparkles className="w-3 h-3" />
                        Match: {app.matchScore}%
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-stone-400 flex-wrap">
                    <span className="font-medium text-stone-200 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-teal-400" />
                      Applied: {app.appliedJobTitle || 'Open Position'}
                    </span>
                    {app.company && (
                      <span className="flex items-center gap-1 text-stone-400">
                        <Building2 className="w-3.5 h-3.5 text-stone-500" />
                        {app.company}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-stone-400 font-mono text-[11px]">
                      <Mail className="w-3.5 h-3.5 text-stone-500" />
                      {app.email}
                    </span>
                    <span className="flex items-center gap-1 text-stone-500 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      Date: {app.appliedDate || 'Recent'}
                    </span>
                  </div>

                  {app.skills && app.skills.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                      {app.skills.slice(0, 5).map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 text-[10px] font-mono"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                  <select
                    value={status}
                    onChange={e => onUpdateStatus(app.id, e.target.value)}
                    disabled={isActing}
                    className="px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="applied">Applied</option>
                    <option value="under_review">Under Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="selected">Selected</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
