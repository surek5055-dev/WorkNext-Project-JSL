import React, { useState } from 'react';
import { RecruiterAccount } from '../../types';
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  Search,
  ExternalLink,
  Mail,
  Calendar,
  Check,
  X,
  RotateCcw,
  Briefcase,
  Globe
} from 'lucide-react';

interface AdminRecruitersTabProps {
  recruiters: RecruiterAccount[];
  isLoading: boolean;
  onUpdateStatus: (recruiterId: string, status: 'approved' | 'rejected' | 'pending' | 'suspended', name: string) => Promise<void>;
  actionLoadingId: string | null;
}

export const AdminRecruitersTab: React.FC<AdminRecruitersTabProps> = ({
  recruiters,
  isLoading,
  onUpdateStatus,
  actionLoadingId
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'suspended'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecruiters = recruiters.filter(r => {
    if (filterStatus !== 'all' && (r.status || 'pending') !== filterStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchCompany = (r.company || '').toLowerCase().includes(q);
      const matchName = (r.name || '').toLowerCase().includes(q);
      const matchEmail = (r.email || '').toLowerCase().includes(q);
      return matchCompany || matchName || matchEmail;
    }
    return true;
  });

  const counts = {
    all: recruiters.length,
    pending: recruiters.filter(r => (r.status || 'pending') === 'pending').length,
    approved: recruiters.filter(r => r.status === 'approved').length,
    rejected: recruiters.filter(r => r.status === 'rejected').length,
    suspended: recruiters.filter(r => r.status === 'suspended').length,
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Buttons & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-900 border border-stone-800 overflow-x-auto">
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              filterStatus === 'pending'
                ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80 shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review</span>
            <span className="px-1.5 py-0.2 rounded-md bg-stone-800 text-[10px] font-mono">
              {counts.pending}
            </span>
          </button>

          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              filterStatus === 'approved'
                ? 'bg-teal-950/80 text-teal-300 border border-teal-800/80 shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved Employers</span>
            <span className="px-1.5 py-0.2 rounded-md bg-stone-800 text-[10px] font-mono">
              {counts.approved}
            </span>
          </button>

          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              filterStatus === 'rejected'
                ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80 shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected</span>
            <span className="px-1.5 py-0.2 rounded-md bg-stone-800 text-[10px] font-mono">
              {counts.rejected}
            </span>
          </button>

          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              filterStatus === 'all'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <span>All Recruiters</span>
            <span className="px-1.5 py-0.2 rounded-md bg-stone-800 text-[10px] font-mono">
              {counts.all}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search company, name, email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Recruiter List */}
      {isLoading ? (
        <div className="p-12 text-center text-stone-400 text-xs font-mono">
          Loading recruiter database...
        </div>
      ) : filteredRecruiters.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-stone-800 bg-stone-900/40 space-y-2">
          <Building2 className="w-8 h-8 text-stone-600 mx-auto" />
          <p className="text-sm font-semibold text-stone-300">
            No recruiter accounts found in this view.
          </p>
          <p className="text-xs text-stone-500">
            {filterStatus === 'pending'
              ? 'All recruiter registrations have been processed.'
              : 'Try selecting a different status filter or clearing your search query.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecruiters.map(r => {
            const status = r.status || 'pending';
            const isActing = actionLoadingId === r.id;

            return (
              <div
                key={r.id}
                className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800/80 hover:border-stone-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-bold font-display text-white">
                      {r.company || r.name || 'Recruiter Partner'}
                    </h3>

                    {/* Status Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 ${
                        status === 'approved'
                          ? 'bg-teal-950 border border-teal-700 text-teal-300'
                          : status === 'rejected'
                          ? 'bg-rose-950 border border-rose-800 text-rose-300'
                          : status === 'suspended'
                          ? 'bg-stone-800 border border-stone-700 text-stone-300'
                          : 'bg-amber-950 border border-amber-700 text-amber-300 animate-pulse'
                      }`}
                    >
                      {status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                      {status === 'rejected' && <XCircle className="w-3 h-3" />}
                      {status === 'pending' && <Clock className="w-3 h-3" />}
                      {status === 'suspended' && <Ban className="w-3 h-3" />}
                      {status}
                    </span>

                    <span className="text-[11px] font-mono text-stone-500">
                      ID: {r.id.substring(0, 14)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-stone-400 flex-wrap">
                    <span className="font-medium text-stone-200">
                      Contact: {r.name}
                    </span>
                    <span className="flex items-center gap-1 text-stone-400 font-mono text-[11px]">
                      <Mail className="w-3.5 h-3.5 text-stone-500" />
                      {r.email}
                    </span>
                    {r.companyWebsite && (
                      <a
                        href={r.companyWebsite.startsWith('http') ? r.companyWebsite : `https://${r.companyWebsite}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-teal-400 hover:underline text-[11px]"
                      >
                        <Globe className="w-3 h-3" />
                        {r.companyWebsite}
                      </a>
                    )}
                    <span className="flex items-center gap-1 text-stone-500 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      Registered: {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-1 text-xs text-stone-400">
                    <span className="inline-flex items-center gap-1 bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-800 font-mono text-[11px]">
                      <Briefcase className="w-3 h-3 text-teal-400" />
                      Posted Jobs: <strong className="text-white ml-1">{r.jobsCount || 0}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1 bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-800 font-mono text-[11px]">
                      Total Candidates: <strong className="text-white ml-1">{r.applicantsCount || 0}</strong>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                  {status !== 'approved' && (
                    <button
                      onClick={() => onUpdateStatus(r.id, 'approved', r.company || r.name)}
                      disabled={isActing}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                      title="Verify and approve recruiter to post live jobs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Employer</span>
                    </button>
                  )}

                  {status !== 'rejected' && (
                    <button
                      onClick={() => onUpdateStatus(r.id, 'rejected', r.company || r.name)}
                      disabled={isActing}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 text-rose-300 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                      title="Reject recruiter verification"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}

                  {status === 'approved' && (
                    <button
                      onClick={() => onUpdateStatus(r.id, 'suspended', r.company || r.name)}
                      disabled={isActing}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-400 hover:text-stone-200 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                      title="Suspend recruiter account"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Suspend</span>
                    </button>
                  )}

                  {status !== 'pending' && (
                    <button
                      onClick={() => onUpdateStatus(r.id, 'pending', r.company || r.name)}
                      disabled={isActing}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-400 hover:text-stone-200 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                      title="Reset to pending review"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
