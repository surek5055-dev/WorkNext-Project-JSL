import React, { useState } from 'react';
import { PlatformReport } from '../../types';
import {
  AlertTriangle,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  Calendar,
  Mail,
  Check,
  X
} from 'lucide-react';

interface AdminReportsTabProps {
  reports: PlatformReport[];
  isLoading: boolean;
  onUpdateStatus: (reportId: string, newStatus: 'pending' | 'investigating' | 'resolved' | 'dismissed') => Promise<void>;
  actionLoadingId: string | null;
}

export const AdminReportsTab: React.FC<AdminReportsTabProps> = ({
  reports,
  isLoading,
  onUpdateStatus,
  actionLoadingId
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = reports.filter(r => {
    if (filterStatus !== 'all' && (r.status || 'pending') !== filterStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = (r.targetTitle || '').toLowerCase().includes(q);
      const matchReason = (r.reason || '').toLowerCase().includes(q);
      const matchReporter = (r.reporterEmail || '').toLowerCase().includes(q);
      return matchTitle || matchReason || matchReporter;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-900 border border-stone-800">
          {(['all', 'pending', 'investigating', 'resolved', 'dismissed'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                filterStatus === s
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search report reason, target..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Reports List */}
      {isLoading ? (
        <div className="p-12 text-center text-stone-400 text-xs font-mono">
          Loading safety and integrity reports...
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-stone-800 bg-stone-900/40 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-teal-500 mx-auto" />
          <p className="text-sm font-semibold text-stone-300">
            Platform integrity clean. No reports found.
          </p>
          <p className="text-xs text-stone-500">
            User and recruiter safety flags will appear here for administrative investigation.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReports.map(r => {
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
                      {r.targetTitle || 'Reported Entity'}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-stone-800 text-[10px] font-mono uppercase tracking-wider text-stone-300">
                      Target: {r.targetType}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                        status === 'resolved'
                          ? 'bg-teal-950 border border-teal-700 text-teal-300'
                          : status === 'investigating'
                          ? 'bg-amber-950 border border-amber-800 text-amber-300'
                          : status === 'dismissed'
                          ? 'bg-stone-800 border border-stone-700 text-stone-400'
                          : 'bg-rose-950 border border-rose-800 text-rose-300'
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <p className="text-xs text-rose-300 font-medium">
                    Reason: {r.reason}
                  </p>

                  {r.details && (
                    <p className="text-xs text-stone-400 leading-relaxed bg-stone-950/60 p-3 rounded-xl border border-stone-800/80">
                      {r.details}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-stone-500 pt-1 flex-wrap">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Mail className="w-3.5 h-3.5 text-stone-600" />
                      Reported by: {r.reporterEmail}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      Date: {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                  {status !== 'resolved' && (
                    <button
                      onClick={() => onUpdateStatus(r.id, 'resolved')}
                      disabled={isActing}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  )}

                  {status !== 'dismissed' && (
                    <button
                      onClick={() => onUpdateStatus(r.id, 'dismissed')}
                      disabled={isActing}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-400 hover:text-stone-200 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Dismiss</span>
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
