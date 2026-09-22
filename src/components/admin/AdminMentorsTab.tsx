import React, { useState } from 'react';
import { Mentor } from '../../types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  Mail,
  Calendar,
  DollarSign,
  Search,
  Check,
  X,
  RotateCcw,
  RefreshCw,
  UserCheck
} from 'lucide-react';

interface AdminMentorsTabProps {
  mentors: Mentor[];
  isLoading: boolean;
  onUpdateStatus: (id: string, newStatus: 'approved' | 'rejected' | 'pending', mentorName: string) => Promise<void>;
  actionLoadingId: string | null;
  counts: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export const AdminMentorsTab: React.FC<AdminMentorsTabProps> = ({
  mentors,
  isLoading,
  onUpdateStatus,
  actionLoadingId,
  counts
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMentors = mentors.filter(mentor => {
    if (activeTab !== 'all') {
      const currentStatus = mentor.status || 'pending';
      if (currentStatus !== activeTab) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = mentor.name.toLowerCase().includes(q);
      const matchRole = mentor.role.toLowerCase().includes(q);
      const matchCompany = mentor.company?.toLowerCase().includes(q) || false;
      const matchEmail = mentor.userEmail?.toLowerCase().includes(q) || false;
      const matchSpecialty = mentor.specialties.some(s => s.toLowerCase().includes(q));
      return matchName || matchRole || matchCompany || matchEmail || matchSpecialty;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Mentor Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('pending')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-amber-950/40 border-amber-500/80 shadow-lg shadow-amber-950/20'
              : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-stone-400 uppercase tracking-wider">
              Pending Review
            </span>
            <span className="p-2 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/60">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-amber-300">
              {counts.pending}
            </span>
            <span className="text-xs text-stone-500 font-sans">awaiting action</span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('approved')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'approved'
              ? 'bg-teal-950/40 border-teal-500/80 shadow-lg shadow-teal-950/20'
              : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-stone-400 uppercase tracking-wider">
              Approved &amp; Live
            </span>
            <span className="p-2 rounded-xl bg-teal-950/80 text-teal-400 border border-teal-800/60">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-teal-300">
              {counts.approved}
            </span>
            <span className="text-xs text-stone-500 font-sans">in directory</span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('rejected')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'rejected'
              ? 'bg-rose-950/40 border-rose-500/80 shadow-lg shadow-rose-950/20'
              : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-stone-400 uppercase tracking-wider">
              Rejected
            </span>
            <span className="p-2 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-800/60">
              <XCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-rose-300">
              {counts.rejected}
            </span>
            <span className="text-xs text-stone-500 font-sans">denied</span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('all')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-stone-800/80 border-stone-600 shadow-lg'
              : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-stone-400 uppercase tracking-wider">
              Total Applications
            </span>
            <span className="p-2 rounded-xl bg-stone-800 text-stone-300 border border-stone-700">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-white">
              {counts.total}
            </span>
            <span className="text-xs text-stone-500 font-sans">all submissions</span>
          </div>
        </div>
      </div>

      {/* Controls Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-stone-900/90 border border-stone-800">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-950 border border-stone-800/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Pending Review ({counts.pending})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'approved'
                ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Approved ({counts.approved})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'rejected'
                ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/40'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Rejected ({counts.rejected})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'bg-stone-800 text-white font-semibold border border-stone-700'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            All ({counts.total})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, role, email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 placeholder-stone-500 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all"
          />
        </div>
      </div>

      {/* Mentors List */}
      {isLoading ? (
        <div className="p-16 rounded-3xl bg-stone-900/40 border border-stone-800/60 text-center">
          <RefreshCw className="w-8 h-8 text-teal-400 animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-400 font-mono">Loading mentor applications from database...</p>
        </div>
      ) : filteredMentors.length === 0 ? (
        <div className="p-16 rounded-3xl bg-stone-900/40 border border-stone-800/60 text-center">
          <div className="w-12 h-12 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-center mx-auto mb-3 text-stone-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No applications in this view</h3>
          <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No results matching "${searchQuery}". Try clearing search keywords.`
              : activeTab === 'pending'
              ? 'All mentor registrations have been reviewed. Outstanding pending queue is empty!'
              : `No mentor applications found with status "${activeTab}".`}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs text-stone-300 font-medium transition-colors cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMentors.map((mentor, mIdx) => {
            const status = mentor.status || 'pending';
            const isActionRunning = actionLoadingId === mentor.id;

            return (
              <div
                key={mentor.id ? `${mentor.id}-${mIdx}` : `mentor-${mIdx}`}
                className={`p-6 rounded-3xl border transition-all ${
                  status === 'pending'
                    ? 'bg-stone-900/90 border-amber-800/40 hover:border-amber-700/60'
                    : status === 'approved'
                    ? 'bg-stone-900/60 border-teal-900/40 hover:border-teal-800/60'
                    : 'bg-stone-900/40 border-stone-800/80 opacity-80'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex items-start gap-4">
                    {mentor.avatar ? (
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-stone-700 shrink-0 shadow-md"
                        onError={e => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-center text-lg font-bold text-teal-300 shrink-0 font-display">
                        {mentor.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-base font-bold font-display text-white">
                          {mentor.name}
                        </h2>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 ${
                            status === 'approved'
                              ? 'bg-teal-950 border border-teal-700 text-teal-300'
                              : status === 'rejected'
                              ? 'bg-rose-950 border border-rose-800 text-rose-300'
                              : 'bg-amber-950 border border-amber-700 text-amber-300 animate-pulse'
                          }`}
                        >
                          {status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                          {status === 'rejected' && <XCircle className="w-3 h-3" />}
                          {status === 'pending' && <Clock className="w-3 h-3" />}
                          {status}
                        </span>

                        <span className="text-[11px] font-mono text-stone-500">
                          ID: {mentor.id.substring(0, 16)}...
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-stone-400 flex-wrap">
                        <span className="font-medium text-stone-200 flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-teal-400" />
                          {mentor.role}
                          {mentor.company && ` @ ${mentor.company}`}
                        </span>

                        {mentor.userEmail && (
                          <span className="flex items-center gap-1 text-stone-400 font-mono text-[11px]">
                            <Mail className="w-3.5 h-3.5 text-stone-500" />
                            {mentor.userEmail}
                          </span>
                        )}

                        {mentor.createdAt && (
                          <span className="flex items-center gap-1 text-stone-500 text-[11px]">
                            <Calendar className="w-3 h-3" />
                            Registered: {new Date(mentor.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {mentor.bio && (
                        <p className="text-xs text-stone-300 mt-2 line-clamp-3 leading-relaxed bg-stone-950/60 p-3 rounded-xl border border-stone-800/80 font-sans">
                          {mentor.bio}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs pt-1 flex-wrap">
                        {mentor.hourlyRate && (
                          <span className="inline-flex items-center gap-1 text-stone-300 font-semibold">
                            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                            Rate: {mentor.hourlyRate}
                          </span>
                        )}

                        {mentor.availability && (
                          <span className="inline-flex items-center gap-1 text-stone-400 text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-teal-400" />
                            Avail: {mentor.availability}
                          </span>
                        )}

                        {mentor.specialties && mentor.specialties.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {mentor.specialties.map((spec, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 text-[10px] font-mono"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center sm:flex-col lg:flex-row gap-2 shrink-0 self-end sm:self-auto pt-2 lg:pt-0">
                    {status !== 'approved' && (
                      <button
                        onClick={() => onUpdateStatus(mentor.id, 'approved', mentor.name)}
                        disabled={isActionRunning}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-950/40 transition-all cursor-pointer disabled:opacity-50"
                        title="Approve mentor to appear in public directory"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve &amp; Publish</span>
                      </button>
                    )}

                    {status !== 'rejected' && (
                      <button
                        onClick={() => onUpdateStatus(mentor.id, 'rejected', mentor.name)}
                        disabled={isActionRunning}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 text-rose-300 hover:text-white text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
                        title="Reject mentor application"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    )}

                    {status !== 'pending' && (
                      <button
                        onClick={() => onUpdateStatus(mentor.id, 'pending', mentor.name)}
                        disabled={isActionRunning}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-400 hover:text-stone-200 text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
                        title="Reset application status to pending"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
