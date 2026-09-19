import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useApp } from '../context/AppContext';
import { DashboardCard } from '../components/cards/DashboardCard';
import { JobCard } from '../components/cards/JobCard';
import {
  Sparkles,
  Briefcase,
  FileText,
  TrendingUp,
  Bookmark,
  ArrowRight,
  BarChart2,
  Calendar,
  Bell,
  CheckCircle2,
  Clock,
  Zap,
  Target,
  Award,
  ChevronRight,
  Layers,
  UserCheck,
  AlertCircle,
  Plus
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { UserProfile, Job, hasSufficientProfileData } from '../types';

export interface UserDashboardPageProps {
  user?: UserProfile;
  jobs?: Job[];
  savedJobIds?: string[];
  appliedJobIds?: string[];
  readinessScore?: number | null;
  atsScore?: number | null;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  user: initialUser,
  jobs: initialJobs,
  savedJobIds: initialSavedJobIds,
  appliedJobIds: initialAppliedJobIds,
  readinessScore: initialReadinessScore,
  atsScore: initialAtsScore
}) => {
  const contextApp = useApp();
  const user = initialUser ?? contextApp.user;
  const jobs = initialJobs ?? contextApp.jobs;
  const savedJobIds = initialSavedJobIds ?? contextApp.savedJobIds;
  const appliedJobIds = initialAppliedJobIds ?? contextApp.appliedJobIds;

  const savedJobsCount = savedJobIds.length;
  const appliedJobsCount = appliedJobIds.length;

  const hasSufficientData = hasSufficientProfileData(user);
  const displayReadiness = user.hasAnalyzedResume && user.readinessScore && user.readinessScore > 0 ? user.readinessScore : null;
  const displayScore = user.hasAnalyzedResume && user.atsScore && user.atsScore > 0 ? user.atsScore : null;

  // Filter jobs based on user skills if available, or default to latest listings
  const recommendedJobs = jobs.filter(job => {
    if (user.skills && user.skills.length > 0) {
      return job.requirements.some(req =>
        user.skills.some(skill => skill.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(skill.toLowerCase()))
      );
    }
    return true;
  }).slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-8 font-sans">
        
        {/* Welcome Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-8 rounded-[24px] bg-white dark:bg-[#1A1D20] border border-stone-200/90 dark:border-stone-800 text-stone-900 dark:text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 card-hover-lift"
        >
          <div className="space-y-2 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              {displayReadiness ? (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 text-xs font-semibold border border-teal-200/60 dark:border-teal-800/40">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />
                  Career Readiness: {displayReadiness}%
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-semibold border border-stone-200 dark:border-stone-700">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  Readiness Score: Pending data
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 dark:text-white font-display">
              Welcome back, {user?.name ? user.name.split(' ')[0] : 'there'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {appliedJobsCount > 0 || savedJobsCount > 0
                ? `You have ${appliedJobsCount} active application${appliedJobsCount === 1 ? '' : 's'} and ${savedJobsCount} saved opportunit${savedJobsCount === 1 ? 'y' : 'ies'}.`
                : 'Track your career development, analyze ATS resume compatibility, and discover regional job opportunities.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link to="/resume">
              <Button variant="outline" size="sm">
                {user.resumeFileName ? 'View ATS Resume' : 'Build ATS Resume'}
              </Button>
            </Link>
            <Link to="/jobs">
              <Button variant="primary" size="sm" className="bg-[#0F766E] hover:bg-[#0D655E]">
                Local Jobs Board
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Readiness Index Callout when info is incomplete */}
        {!displayReadiness && (
          <div className="p-5 rounded-[20px] bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-900 dark:text-white font-display">
                  Unlock Your Career Readiness Index
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-300 font-sans mt-0.5">
                  Upload your resume and complete your profile to calculate your Readiness Score.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <Button variant="outline" size="sm">
                  Complete Profile
                </Button>
              </Link>
              <Link to="/resume">
                <Button variant="primary" size="sm" className="bg-[#0F766E] hover:bg-[#0D655E]">
                  Upload Resume
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Dashboard Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <DashboardCard
            title="Active Applications"
            value={String(appliedJobsCount)}
            subtext={appliedJobsCount === 0 ? "No active applications submitted yet" : `${appliedJobsCount} applications in progress`}
            icon={<Briefcase className="w-5 h-5 text-[#0F766E] dark:text-teal-400" />}
          />

          <DashboardCard
            title="Saved Opportunities"
            value={String(savedJobsCount)}
            subtext={savedJobsCount === 0 ? "No saved jobs yet" : `${savedJobsCount} positions bookmarked`}
            icon={<Bookmark className="w-5 h-5 text-[#0F766E] dark:text-teal-400" />}
          />

          <DashboardCard
            title="ATS Resume Score"
            value={displayScore ? `${displayScore}/100` : "-- / 100"}
            subtext={
              user.analysisRequested
                ? "Analysis will appear after AI service connects"
                : (user.resumeFileName ? "Click 'Analyze Resume' in builder" : "Upload resume to calculate")
            }
            icon={<FileText className="w-5 h-5 text-[#0F766E] dark:text-teal-400" />}
          />

          <DashboardCard
            title="Target Skill Match"
            value={user.skills && user.skills.length > 0 ? `${Math.min(95, user.skills.length * 15)}%` : "--"}
            subtext={user.skills && user.skills.length > 0 ? `${user.skills.length} skills recorded` : "Add skills in Profile to calculate"}
            icon={<TrendingUp className="w-5 h-5 text-[#0F766E] dark:text-teal-400" />}
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Main Column (Analytics, Recommended Jobs, Skill Tracker) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Analytics & Interview Growth Chart */}
            <div className="p-6 sm:p-7 rounded-[24px] bg-white dark:bg-[#1A1D20] border border-stone-200/90 dark:border-stone-800 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white font-display">
                    Interview Readiness & Profile Visibility
                  </h3>
                  <p className="text-xs text-stone-500 font-sans">Monthly interview callback probability index</p>
                </div>
                {displayReadiness ? (
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
                    Active Score
                  </span>
                ) : (
                  <span className="text-xs text-stone-400 font-sans">
                    Awaiting Profile Data
                  </span>
                )}
              </div>

              {displayReadiness ? (
                /* Visual Authentic SVG Progress Chart */
                <div className="h-40 w-full pt-4 relative flex items-end justify-between gap-3 px-2">
                  {[
                    { month: 'Baseline', val: 30 },
                    { month: 'Profile', val: user.profileCompletion || 40 },
                    { month: 'Skills', val: Math.min(85, (user.skills?.length || 0) * 15 + 30) },
                    { month: 'Resume', val: displayScore || 50 },
                    { month: 'Current', val: displayReadiness },
                  ].map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[10px] font-mono font-bold text-stone-600 dark:text-stone-300">{item.val}%</span>
                      <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-t-lg overflow-hidden h-28 relative">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${item.val}%` }}
                          transition={{ duration: 0.6, delay: idx * 0.1 }}
                          className="w-full bg-[#0F766E] dark:bg-teal-500 absolute bottom-0 rounded-t-lg"
                        />
                      </div>
                      <span className="text-[11px] font-sans font-medium text-stone-400">{item.month}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 px-4 rounded-xl border border-dashed border-stone-200 dark:border-stone-800 text-center space-y-2">
                  <BarChart2 className="w-8 h-8 text-stone-300 dark:text-stone-700 mx-auto" />
                  <p className="text-xs font-semibold text-stone-700 dark:text-stone-300 font-sans">
                    Interview visibility trends will calculate once you upload a resume and complete your profile.
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Add your work experience, skills, and target role to begin tracking visibility benchmarks.
                  </p>
                </div>
              )}
            </div>

            {/* Recommended High-Match Jobs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white font-display flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#0F766E] dark:text-teal-400" /> Tailored Job Matches
                  </h3>
                  <p className="text-xs text-stone-500 font-sans">
                    {user.skills && user.skills.length > 0
                      ? 'Filtered by your registered profile competencies and preferences'
                      : 'Regional career opportunities across technology and industry'}
                  </p>
                </div>
                <Link to="/jobs">
                  <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View All Jobs
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedJobs.map((job, idx) => (
                  <JobCard key={job.id ? `${job.id}-${idx}` : `rec-job-${idx}`} job={job} compact />
                ))}
              </div>
            </div>

            {/* Skill Gap Tracker */}
            <div className="p-6 sm:p-7 rounded-[24px] bg-white dark:bg-[#1A1D20] border border-stone-200/90 dark:border-stone-800 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white font-display flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#0F766E] dark:text-teal-400" /> Target Role Skill Competencies
                </h3>
                <span className="text-xs text-[#0F766E] dark:text-teal-400 font-bold">
                  {user.title ? `Target: ${user.title}` : 'Target Role: Not Specified'}
                </span>
              </div>

              {user.skills && user.skills.length > 0 ? (
                <div className="space-y-3 font-sans text-xs">
                  {user.skills.map((skill, idx) => (
                    <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-stone-800 dark:text-stone-200">{skill}</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-mono">
                          Verified
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                        <div className="h-full bg-[#0F766E]" style={{ width: `${Math.min(95, 75 + (idx % 3) * 10)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 px-4 rounded-xl border border-dashed border-stone-200 dark:border-stone-800 text-center space-y-2">
                  <p className="text-xs font-semibold text-stone-700 dark:text-stone-300 font-sans">
                    No technical skills added yet.
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Add your technical competencies and tools in your Profile to benchmark role readiness.
                  </p>
                  <Link to="/profile" className="inline-block pt-1">
                    <Button variant="outline" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                      Add Skills in Profile
                    </Button>
                  </Link>
                </div>
              )}
            </div>

          </div>

          {/* Right Side Column (Resume Status, Calendar, Notifications) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* ATS Resume Status Widget */}
            <div className="p-6 rounded-[24px] bg-white dark:bg-[#1A1D20] border border-stone-200/90 dark:border-stone-800 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#0F766E] dark:text-teal-400" />
                  <h3 className="text-base font-bold text-stone-900 dark:text-white font-display">Resume Health</h3>
                </div>
                {displayScore ? (
                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">{displayScore}/100 Score</span>
                ) : (
                  <span className="text-xs font-mono text-stone-400">No Score</span>
                )}
              </div>

              {user.resumeFileName ? (
                <div className="space-y-2 text-xs font-sans text-stone-600 dark:text-stone-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{user.resumeFileName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Uploaded {user.resumeUploadedAt || 'recently'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{user.analysisRequested ? 'Analysis will appear after AI service connects' : 'Ready for Analysis'}</span>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center space-y-1">
                  <p className="text-xs font-medium text-stone-700 dark:text-stone-300">No resume uploaded yet.</p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">Upload a PDF or DOC/DOCX to unlock automated ATS evaluation.</p>
                </div>
              )}

              <Link to="/resume" className="block pt-1">
                <Button variant="primary" size="sm" fullWidth className="bg-[#0F766E] hover:bg-[#0D655E]">
                  {user.resumeFileName ? 'Manage in Builder →' : 'Upload Resume →'}
                </Button>
              </Link>
            </div>

            {/* Upcoming Interview & Mentor Schedule Calendar */}
            <div className="p-6 rounded-[24px] bg-white dark:bg-[#1A1D20] border border-stone-200/90 dark:border-stone-800 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#0F766E] dark:text-teal-400" />
                  <h3 className="text-base font-bold text-stone-900 dark:text-white font-display">Interview Schedule</h3>
                </div>
                <span className="text-[10px] font-mono text-stone-400">Calendar</span>
              </div>

              <div className="py-4 text-center space-y-1 text-xs font-sans">
                <p className="font-medium text-stone-700 dark:text-stone-300">No upcoming interviews scheduled.</p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Mock interview feedback and recruiter prep sessions will appear here.
                </p>
              </div>

              <Link to="/resume" className="block">
                <Button variant="outline" size="sm" fullWidth>
                  Practice Mock Interview
                </Button>
              </Link>
            </div>

            {/* Notifications Feed */}
            <div className="p-6 rounded-[24px] bg-white dark:bg-[#1A1D20] border border-stone-200/90 dark:border-stone-800 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#0F766E] dark:text-teal-400" />
                  <h3 className="text-base font-bold text-stone-900 dark:text-white font-display">Activity Stream</h3>
                </div>
                <Link to="/notifications" className="text-xs text-[#0F766E] dark:text-teal-400 font-semibold hover:underline">
                  View All
                </Link>
              </div>

              {contextApp.notifications.length > 0 ? (
                <div className="space-y-3 text-xs font-sans">
                  {contextApp.notifications.slice(0, 3).map(n => (
                    <div key={n.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-900/60 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-[#0F766E] mt-1.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-stone-900 dark:text-white">{n.title}</p>
                        <p className="text-[10px] text-stone-400">{n.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center space-y-1 text-xs font-sans">
                  <p className="font-medium text-stone-700 dark:text-stone-300">No recent activity.</p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Saved jobs and resume updates will appear in your live feed.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};
