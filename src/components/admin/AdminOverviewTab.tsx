import React from 'react';
import {
  Users,
  Briefcase,
  Building2,
  FileCheck,
  Award,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

interface OverviewStats {
  usersCount: number;
  recruitersCount: number;
  pendingRecruitersCount: number;
  approvedRecruitersCount: number;
  jobsCount: number;
  activeJobsCount: number;
  applicationsCount: number;
  mentorsCount: number;
  pendingMentorsCount: number;
  reportsCount: number;
  pendingReportsCount: number;
}

interface AdminOverviewTabProps {
  stats: OverviewStats | null;
  isLoading: boolean;
  onNavigateTab: (tab: string) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  stats,
  isLoading,
  onNavigateTab
}) => {
  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Users Card */}
        <div
          onClick={() => onNavigateTab('users')}
          className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-stone-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-stone-400 uppercase tracking-wider">
              Total Users
            </span>
            <div className="p-2 rounded-xl bg-stone-800 text-stone-300 group-hover:text-teal-400 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-white">
              {isLoading ? '...' : (stats?.usersCount ?? 0)}
            </span>
            <span className="text-xs text-stone-500 font-sans">registered</span>
          </div>
        </div>

        {/* Recruiters Card */}
        <div
          onClick={() => onNavigateTab('recruiters')}
          className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-teal-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-stone-400 uppercase tracking-wider">
              Recruiters
            </span>
            <div className="p-2 rounded-xl bg-teal-950/80 text-teal-400 border border-teal-800/60">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-teal-300">
              {isLoading ? '...' : (stats?.recruitersCount ?? 0)}
            </span>
            {(stats?.pendingRecruitersCount ?? 0) > 0 && (
              <span className="text-xs font-medium text-amber-400 font-sans flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {stats?.pendingRecruitersCount} pending
              </span>
            )}
          </div>
        </div>

        {/* Jobs Card */}
        <div
          onClick={() => onNavigateTab('jobs')}
          className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-stone-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-stone-400 uppercase tracking-wider">
              WorkNext Jobs
            </span>
            <div className="p-2 rounded-xl bg-stone-800 text-stone-300 group-hover:text-teal-400 transition-colors">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-white">
              {isLoading ? '...' : (stats?.jobsCount ?? 0)}
            </span>
            <span className="text-xs text-stone-500 font-sans">
              {stats?.activeJobsCount ?? 0} active
            </span>
          </div>
        </div>

        {/* Applications Card */}
        <div
          onClick={() => onNavigateTab('applications')}
          className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-stone-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-stone-400 uppercase tracking-wider">
              Applications
            </span>
            <div className="p-2 rounded-xl bg-stone-800 text-stone-300 group-hover:text-teal-400 transition-colors">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-white">
              {isLoading ? '...' : (stats?.applicationsCount ?? 0)}
            </span>
            <span className="text-xs text-stone-500 font-sans">processed</span>
          </div>
        </div>

        {/* Mentors Card */}
        <div
          onClick={() => onNavigateTab('mentors')}
          className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-stone-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-stone-400 uppercase tracking-wider">
              Mentors
            </span>
            <div className="p-2 rounded-xl bg-stone-800 text-stone-300 group-hover:text-teal-400 transition-colors">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-white">
              {isLoading ? '...' : (stats?.mentorsCount ?? 0)}
            </span>
            {(stats?.pendingMentorsCount ?? 0) > 0 && (
              <span className="text-xs font-medium text-amber-400 font-sans">
                {stats?.pendingMentorsCount} pending
              </span>
            )}
          </div>
        </div>

        {/* Reports Card */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-rose-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-stone-400 uppercase tracking-wider">
              Trust & Safety
            </span>
            <div className="p-2 rounded-xl bg-stone-800 text-stone-300 group-hover:text-rose-400 transition-colors">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-white">
              {isLoading ? '...' : (stats?.reportsCount ?? 0)}
            </span>
            {(stats?.pendingReportsCount ?? 0) > 0 ? (
              <span className="text-xs font-medium text-rose-400 font-sans">
                {stats?.pendingReportsCount} unresolved
              </span>
            ) : (
              <span className="text-xs text-stone-500 font-sans">all clear</span>
            )}
          </div>
        </div>

        {/* Revenue Model Card */}
        <div
          onClick={() => onNavigateTab('revenue')}
          className="p-5 rounded-2xl bg-gradient-to-br from-teal-950/60 to-stone-900 border border-teal-800/80 hover:border-teal-500 transition-all cursor-pointer group col-span-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-teal-400 uppercase tracking-wider">
              Business Model & Monetization
            </span>
            <div className="p-2 rounded-xl bg-teal-900/80 text-teal-200">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-lg font-bold font-display text-white">
                Platform Revenue Architecture
              </p>
              <p className="text-xs text-stone-400">
                Verified Recruiter Tiers • Placement Fees • 15% Mentor Commission
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-teal-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Platform Health & Governance Banner */}
      <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
        <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          Governance & Operational Security Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800/80 space-y-1">
            <div className="flex items-center gap-2 text-teal-400 font-semibold font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Recruiter Verification
            </div>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Enforced: Recruiters cannot publish live openings until approved by an administrator.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800/80 space-y-1">
            <div className="flex items-center gap-2 text-teal-400 font-semibold font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Database Persistence
            </div>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Active: Local JSON data persistence synced with server memory stores.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800/80 space-y-1">
            <div className="flex items-center gap-2 text-teal-400 font-semibold font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> AI Model Service
            </div>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Active: Server-side Gemini 2.5 Flash / Pro fallback pipeline with quota error resilience.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800/80 space-y-1">
            <div className="flex items-center gap-2 text-teal-400 font-semibold font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Candidate Notification Pipeline
            </div>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Active: Applied → Under Review → Shortlisted → Selected/Rejected instant alerts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
