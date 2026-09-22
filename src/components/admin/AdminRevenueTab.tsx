import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Building2,
  Users,
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Briefcase
} from 'lucide-react';

interface AdminRevenueTabProps {
  stats: {
    usersCount: number;
    recruitersCount: number;
    jobsCount: number;
    mentorsCount: number;
  } | null;
}

export const AdminRevenueTab: React.FC<AdminRevenueTabProps> = ({ stats }) => {
  const verifiedRecruiters = stats?.recruitersCount || 0;
  const approvedMentors = stats?.mentorsCount || 0;

  // Projected platform unit economics based on real active counts
  const estRecruiterSubMonthly = verifiedRecruiters * 4999;
  const estMentorCommissionMonthly = approvedMentors * 1500 * 4 * 0.15; // 4 sessions/month @ ₹1500 rate * 15% take-rate

  return (
    <div className="space-y-6">
      {/* Top Overview Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-teal-950/40 border border-stone-800 space-y-3">
        <div className="flex items-center gap-2 text-teal-400 font-mono text-xs font-bold uppercase tracking-wider">
          <DollarSign className="w-4 h-4" />
          WorkNext Monetization Strategy & Business Architecture
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
          Multi-Sided Platform Economics for India's Workforce
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 max-w-3xl leading-relaxed">
          WorkNext operates a sustainable, dual-revenue marketplace architecture: free access for job seekers and candidates to foster talent liquidity, powered by enterprise recruiter hiring subscriptions, placement success fees, and a 15% platform take-rate on 1:1 professional mentorship sessions.
        </p>
      </div>

      {/* Revenue Streams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Stream 1: Recruiter Subscriptions */}
        <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-950 text-teal-300 border border-teal-800 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider font-bold">
                B2B Subscription
              </span>
              <h3 className="text-lg font-bold text-white font-display mt-0.5">
                Verified Recruiter Tiers
              </h3>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Employers pay a monthly or annual SaaS fee for verified company profiles, priority search placement, and candidate pipeline unlocks.
            </p>
            <ul className="space-y-2 text-xs text-stone-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span><strong>Pro Recruiter:</strong> ₹4,999 / mo (10 active posts)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span><strong>Enterprise Hire:</strong> ₹24,999 / mo (Unlimited + ATS sync)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Direct candidate contact and resume downloads</span>
              </li>
            </ul>
          </div>
          <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs">
            <span className="text-stone-400">Current active pool:</span>
            <span className="font-bold text-teal-300 font-mono">{verifiedRecruiters} registered</span>
          </div>
        </div>

        {/* Stream 2: Direct Placement Success Fee */}
        <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                Success-Based
              </span>
              <h3 className="text-lg font-bold text-white font-display mt-0.5">
                Placement Commission
              </h3>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Performance fee charged upon verified job seeker offer acceptance. 8% of candidate first-year annual compensation.
            </p>
            <ul className="space-y-2 text-xs text-stone-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>8% standard fee:</strong> payable on candidate day 30</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>90-day replacement guarantee for employer security</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Direct escrow integration with candidate onboarding</span>
              </li>
            </ul>
          </div>
          <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs">
            <span className="text-stone-400">Average placement:</span>
            <span className="font-bold text-emerald-300 font-mono">₹48,000 / hire</span>
          </div>
        </div>

        {/* Stream 3: Mentorship Commission */}
        <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-950 text-amber-300 border border-amber-800 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                Marketplace Take-Rate
              </span>
              <h3 className="text-lg font-bold text-white font-display mt-0.5">
                1:1 Mentorship Take-Rate
              </h3>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              WorkNext provides calendar booking, video room routing, and escrow payouts. The platform retains a 15% marketplace commission per session.
            </p>
            <ul className="space-y-2 text-xs text-stone-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span><strong>15% commission:</strong> on mentor hourly bookings</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Mentors set their own rates (₹500 - ₹3,000 / hr)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Weekly automated Stripe / UPI payouts to verified mentors</span>
              </li>
            </ul>
          </div>
          <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs">
            <span className="text-stone-400">Mentor network:</span>
            <span className="font-bold text-amber-300 font-mono">{approvedMentors} live mentors</span>
          </div>
        </div>
      </div>

      {/* Financial Unit Economics Card */}
      <div className="p-6 rounded-3xl bg-stone-900/60 border border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-400" />
            Current Run-Rate Model (Estimated MRR at Scale)
          </h3>
          <span className="text-[10px] font-mono text-stone-500 uppercase">
            Currency: INR (₹)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800">
            <span className="text-xs text-stone-400 block font-mono">
              Recruiter MRR (Base)
            </span>
            <span className="text-2xl font-bold font-display text-teal-300 mt-1 block">
              ₹{estRecruiterSubMonthly.toLocaleString()}
            </span>
            <span className="text-[11px] text-stone-500">
              Based on {verifiedRecruiters} verified recruiter subscriptions
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800">
            <span className="text-xs text-stone-400 block font-mono">
              Monthly Mentor Platform Fee
            </span>
            <span className="text-2xl font-bold font-display text-amber-300 mt-1 block">
              ₹{Math.round(estMentorCommissionMonthly).toLocaleString()}
            </span>
            <span className="text-[11px] text-stone-500">
              15% take-rate on scheduled mock interviews & mentorship
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800">
            <span className="text-xs text-stone-400 block font-mono">
              Talent Pool Liquidity
            </span>
            <span className="text-2xl font-bold font-display text-white mt-1 block">
              {stats?.usersCount || 0}
            </span>
            <span className="text-[11px] text-stone-500">
              Active candidates available for employer matching
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
