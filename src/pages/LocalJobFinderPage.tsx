import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useApp } from '../context/AppContext';
import { Job } from '../types';
import { JobCard } from '../components/cards/JobCard';
import { JobFilterForm } from '../components/forms/JobFilterForm';
import { PlaceholderCard } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Sparkles, X, CheckCircle2, Briefcase, FileText, ArrowRight, AlertCircle, Award, ExternalLink, Globe, Building2 } from 'lucide-react';

export interface LocalJobFinderPageProps {
  jobs?: Job[];
  onApplyForJob?: (jobId: string, jobData?: Job) => void;
  onToggleSaveJob?: (jobId: string) => void;
  savedJobIds?: string[];
  appliedJobIds?: string[];
}

export const LocalJobFinderPage: React.FC<LocalJobFinderPageProps> = ({
  jobs: initialJobs,
  onApplyForJob,
  onToggleSaveJob,
  savedJobIds: initialSavedJobIds,
  appliedJobIds: initialAppliedJobIds
}) => {
  const contextApp = useApp();
  const { user } = contextApp;
  const jobs = initialJobs ?? contextApp.jobs;
  const applyForJob = onApplyForJob ?? contextApp.applyForJob;
  const toggleSaveJob = onToggleSaveJob ?? contextApp.toggleSaveJob;
  const savedJobIds = initialSavedJobIds ?? contextApp.savedJobIds;
  const appliedJobIds = initialAppliedJobIds ?? contextApp.appliedJobIds;

  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedExp, setSelectedExp] = useState('');
  const [isRemoteOnly, setIsRemoteOnly] = useState(false);
  const [minMatchScore, setMinMatchScore] = useState(0);
  const [sourceFilter, setSourceFilter] = useState<'all' | 'worknext' | 'adzuna'>('all');

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [adzunaJobs, setAdzunaJobs] = useState<Job[] | null>(null);
  const [recruiterJobs, setRecruiterJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecruiter, setIsLoadingRecruiter] = useState(false);
  const [isAdzunaConfigured, setIsAdzunaConfigured] = useState<boolean | null>(null);
  const [applyStatusMessage, setApplyStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);

  // Extract real user skills, education, experience and target role from resume
  const candidateSkills = useMemo(() => {
    const raw = [
      ...(user.extractedProfile?.skills || []),
      ...(user.skills || [])
    ];
    return Array.from(new Set(raw.map(s => String(s).trim()))).filter(Boolean);
  }, [user.extractedProfile, user.skills]);

  const candidateRole = user.extractedProfile?.targetRole || user.title || '';
  const candidateExp = user.extractedProfile?.experienceYears ?? user.experienceYears ?? 0;
  const candidateEducation = user.extractedProfile?.education || [];
  const candidateLocation = user.extractedProfile?.location || user.location || user.preferredLocation || '';
  const hasResumeAnalyzed = Boolean(user.hasAnalyzedResume && (candidateSkills.length > 0 || candidateRole));

  // Fetch real recruiter-created jobs from database - only active/open jobs are shown
  useEffect(() => {
    let isMounted = true;
    const fetchRecruiterJobs = async () => {
      setIsLoadingRecruiter(true);
      try {
        const res = await fetch('/api/recruiter/jobs?public=true');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && Array.isArray(data.jobs)) {
            // Strictly show only active/open recruiter jobs; closed/deleted ones are excluded
            const activeJobs: Job[] = data.jobs
              .filter((j: any) => j.status !== 'closed')
              .map((j: any) => ({
                ...j,
                source: 'worknext',
                status: (j.status === 'closed' ? 'closed' : 'active') as 'active' | 'closed',
              }));
            setRecruiterJobs(activeJobs);
          }
        }
      } catch (err) {
        console.warn('Could not fetch public recruiter jobs:', err);
      } finally {
        if (isMounted) {
          setIsLoadingRecruiter(false);
        }
      }
    };

    fetchRecruiterJobs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Query real jobs from Adzuna API using analyzed resume details and user filters
  useEffect(() => {
    let isMounted = true;
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/jobs/adzuna', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            skills: candidateSkills,
            targetRole: candidateRole,
            location: locationFilter || candidateLocation,
            experienceYears: candidateExp,
            searchQuery: searchQuery,
            locationFilter: locationFilter,
            isRemoteOnly: isRemoteOnly,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setIsAdzunaConfigured(Boolean(data.isConfigured));
            if (Array.isArray(data.jobs)) {
              const labeledAdzunaJobs: Job[] = data.jobs.map((j: any) => ({
                ...j,
                source: 'adzuna',
                status: 'active',
              }));
              setAdzunaJobs(labeledAdzunaJobs);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch jobs from Adzuna:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const timer = setTimeout(() => {
      fetchJobs();
    }, 350);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [candidateSkills, candidateRole, candidateExp, candidateLocation, searchQuery, locationFilter, isRemoteOnly]);

  // Counts for the All | WorkNext Recruiter | Adzuna tabs
  const counts = useMemo(() => {
    const activeRecruiter = recruiterJobs.filter(j => j.status !== 'closed').length;
    const adzCount = adzunaJobs !== null ? adzunaJobs.length : 0;
    return {
      all: activeRecruiter + adzCount,
      worknext: activeRecruiter,
      adzuna: adzCount,
    };
  }, [recruiterJobs, adzunaJobs]);

  // Determine base list based on source filter: All | WorkNext Recruiter | Adzuna
  const baseJobs = useMemo(() => {
    const activeRecruiter = recruiterJobs.filter(j => j.status !== 'closed');
    const adz = adzunaJobs !== null ? adzunaJobs : [];

    if (sourceFilter === 'worknext') {
      return activeRecruiter;
    }
    if (sourceFilter === 'adzuna') {
      return adz;
    }
    return [...activeRecruiter, ...adz];
  }, [sourceFilter, recruiterJobs, adzunaJobs]);
  const rankedJobs = useMemo(() => {
    if (baseJobs.length === 0) return [];

    const normSkills = candidateSkills.map(s => s.toLowerCase());
    const normRole = candidateRole.toLowerCase();

    return baseJobs.map(job => {
      const reqs = job.requirements || [];

      if (!hasResumeAnalyzed && candidateSkills.length === 0 && !candidateRole) {
        // No resume uploaded or analyzed yet: do not show fake match scores
        return { ...job, matchScore: 0, skillGaps: reqs };
      }

      if (reqs.length === 0) {
        return { ...job, matchScore: hasResumeAnalyzed ? 60 : 0, skillGaps: [] };
      }

      let matchedCount = 0;
      const missingSkills: string[] = [];

      reqs.forEach(req => {
        const rLower = req.toLowerCase().trim();
        const hasSkill = normSkills.some(cs => rLower.includes(cs) || cs.includes(rLower));
        if (hasSkill) {
          matchedCount++;
        } else {
          missingSkills.push(req);
        }
      });

      // 60% weight on authentic required skills overlap
      const skillScore = (matchedCount / reqs.length) * 60;

      // 20% weight on target role alignment
      let roleScore = 0;
      if (normRole) {
        const jobTitleLower = job.title.toLowerCase();
        if (jobTitleLower.includes(normRole) || normRole.includes(jobTitleLower)) {
          roleScore = 20;
        } else {
          const roleWords = normRole.split(/\s+/).filter(w => w.length > 2);
          const matchedWords = roleWords.filter(w => jobTitleLower.includes(w));
          if (roleWords.length > 0 && matchedWords.length > 0) {
            roleScore = (matchedWords.length / roleWords.length) * 15;
          }
        }
      }

      // 10% weight on experience fit
      let expScore = 10;
      if (job.experienceLevel === 'Senior' && candidateExp < 3) expScore = 4;
      if (job.experienceLevel === 'Executive' && candidateExp < 7) expScore = 2;
      if (job.experienceLevel === 'Entry-Level' && candidateExp <= 2) expScore = 10;

      // 10% weight on education match
      let eduScore = 5;
      if (candidateEducation.length > 0) {
        const eduFields = candidateEducation.map(e => `${e.degree || ''} ${e.field || ''}`.toLowerCase());
        const jobDescLower = (job.description + ' ' + job.title + ' ' + reqs.join(' ')).toLowerCase();
        const hasRelevantDegree = eduFields.some(f => 
          f.includes('computer') || f.includes('engineer') || f.includes('science') || f.includes('tech') ||
          jobDescLower.includes(f)
        );
        eduScore = hasRelevantDegree ? 10 : 7;
      }

      const totalScore = Math.min(100, Math.max(10, Math.round(skillScore + roleScore + expScore + eduScore)));

      return {
        ...job,
        matchScore: totalScore,
        skillGaps: missingSkills,
      };
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }, [baseJobs, candidateSkills, candidateRole, candidateExp, candidateEducation, hasResumeAnalyzed]);

  const handleReset = () => {
    setSearchQuery('');
    setLocationFilter('');
    setSelectedType('');
    setSelectedExp('');
    setIsRemoteOnly(false);
    setMinMatchScore(0);
    setSourceFilter('all');
  };

  const handleApply = async (job: Job) => {
    const isExternal =
      job.source === 'adzuna' ||
      job.source === 'Adzuna' ||
      job.source === 'linkedin' ||
      job.source === 'LinkedIn' ||
      (typeof job.id === 'string' && (job.id.startsWith('adzuna_') || job.id.startsWith('linkedin_'))) ||
      (Boolean(job.applyUrl) && job.source !== 'worknext');

    // External jobs: clicking Apply Now only opens the external application URL.
    // Do NOT mark as Applied without confirmed API integration; keep status as Apply Now.
    if (isExternal) {
      if (job.applyUrl) {
        window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    if (job.status === 'closed') {
      setApplyStatusMessage({
        type: 'error',
        message: 'This job opening has been closed by the recruiter and is no longer accepting applications.'
      });
      return;
    }

    setIsSubmittingApp(true);
    try {
      const result: any = await applyForJob(job.id, job);

      if (result && result.success === false) {
        setApplyStatusMessage({
          type: 'error',
          message: result.error || 'Failed to submit application.'
        });
      } else {
        setApplyStatusMessage({
          type: 'success',
          message: 'Application submitted directly to the WorkNext Recruiter!'
        });
        setTimeout(() => setApplyStatusMessage(null), 5000);
      }
    } catch (err: any) {
      setApplyStatusMessage({
        type: 'error',
        message: err.message || 'Error submitting application.'
      });
    } finally {
      setIsSubmittingApp(false);
    }
  };

  const filteredJobs = rankedJobs.filter(job => {
    // Only active jobs should appear in Job Finder
    if (job.status === 'closed') return false;

    // Apply client-side text filtering for worknext recruiter jobs or when adzunaJobs is null
    const isWorknext = job.source === 'worknext' || !job.source?.includes('adzuna');
    if (isWorknext || adzunaJobs === null) {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = job.title.toLowerCase().includes(q);
        const companyMatch = job.company.toLowerCase().includes(q);
        const reqMatch = job.requirements.some(r => r.toLowerCase().includes(q));
        if (!titleMatch && !companyMatch && !reqMatch) return false;
      }

      if (locationFilter.trim()) {
        if (!job.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
      }
    }

    if (selectedType && job.type !== selectedType) return false;
    if (selectedExp && job.experienceLevel !== selectedExp) return false;
    if (isRemoteOnly && !job.isRemote) return false;
    if (minMatchScore > 0 && (job.matchScore || 0) < minMatchScore) return false;

    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/50 text-xs font-semibold text-[#0F766E] dark:text-teal-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] dark:bg-teal-400" />
              Regional Job Engine
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-white mt-2 font-display">
              Local Job & Skill Finder
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 font-sans">
              Discover openings filtered by location, skill requirements, and wage transparency.
            </p>
          </div>
        </div>

        {/* Application Status Feedback Banner */}
        {applyStatusMessage && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-sans ${
              applyStatusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {applyStatusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span className="font-medium">{applyStatusMessage.message}</span>
            </div>
            <button
              onClick={() => setApplyStatusMessage(null)}
              className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* User Resume & Skills Connection Card */}
        {hasResumeAnalyzed ? (
          <div className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-teal-200/80 dark:border-teal-900/50 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-200 dark:border-teal-800">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-stone-900 dark:text-white text-base font-display">
                      {candidateRole || 'Extracted Candidate Profile'}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-[11px] font-semibold text-[#0F766E] dark:text-teal-400 font-sans">
                      <Sparkles className="w-3 h-3" /> Resume Connected
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-sans mt-0.5">
                    Verified from <span className="font-medium text-stone-700 dark:text-stone-300">{user.resumeFileName || 'uploaded resume'}</span> • {candidateExp} year{candidateExp === 1 ? '' : 's'} exp
                    {candidateEducation.length > 0 && ` • ${candidateEducation[0].degree || 'Education'} (${candidateEducation[0].institution})`}
                  </p>
                </div>
              </div>
              <a href="/resume" className="shrink-0 font-sans">
                <Button variant="outline" size="sm" className="text-xs">
                  Update Resume in Builder
                </Button>
              </a>
            </div>

            {candidateSkills.length > 0 && (
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center gap-2 font-sans">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider text-[10px]">
                  Extracted Skills:
                </span>
                {candidateSkills.slice(0, 8).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2.5 py-0.5 rounded-lg bg-teal-50/70 dark:bg-teal-950/40 text-[#0F766E] dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/40"
                  >
                    {skill}
                  </span>
                ))}
                {candidateSkills.length > 8 && (
                  <span className="text-xs font-medium text-stone-400 px-2 py-0.5">
                    +{candidateSkills.length - 8} more
                  </span>
                )}
              </div>
            )}
          </div>
        ) : user.resumeFileName ? (
          <div className="p-5 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-amber-200/80 dark:border-amber-900/50 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-white font-display">
                  Resume Uploaded: {user.resumeFileName}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-sans mt-0.5">
                  Analyze your resume in the Resume Builder to extract your skills, education, and target role for authentic job matching.
                </p>
              </div>
            </div>
            <a href="/resume" className="shrink-0 font-sans">
              <Button variant="primary" size="sm" className="bg-[#0F766E] hover:bg-[#0D655E] text-xs">
                Analyze Resume Now
              </Button>
            </a>
          </div>
        ) : (
          <div className="p-5 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-white font-display">
                  Connect Your Resume for Real Job Matching
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-sans mt-0.5">
                  Upload your resume to extract verified skills, education, and experience for genuine match ranking.
                </p>
              </div>
            </div>
            <a href="/resume" className="shrink-0 font-sans">
              <Button variant="outline" size="sm" className="text-xs">
                Upload & Analyze Resume
              </Button>
            </a>
          </div>
        )}

        {/* Filters */}
        <JobFilterForm
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          locationFilter={locationFilter}
          onLocationChange={setLocationFilter}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedExp={selectedExp}
          onExpChange={setSelectedExp}
          isRemoteOnly={isRemoteOnly}
          onRemoteToggle={setIsRemoteOnly}
          minMatchScore={minMatchScore}
          onMatchScoreChange={setMinMatchScore}
          sourceFilter={sourceFilter}
          onSourceFilterChange={setSourceFilter}
          counts={counts}
          onReset={handleReset}
        />

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between text-xs font-sans text-stone-500 dark:text-stone-400 px-1">
          <span>
            Showing {filteredJobs.length} {sourceFilter === 'worknext' ? 'WorkNext Recruiter ' : sourceFilter === 'adzuna' ? 'Adzuna ' : ''}position{filteredJobs.length === 1 ? '' : 's'}
          </span>
          <span className="text-[#0F766E] dark:text-teal-400 flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Regional Opportunities
          </span>
        </div>

        {/* Jobs List */}
        {isLoading || isLoadingRecruiter ? (
          <div className="p-12 rounded-[24px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 text-center space-y-4 max-w-2xl mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 flex items-center justify-center mx-auto animate-pulse">
              <Sparkles className="w-6 h-6 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900 dark:text-white font-display">
                {sourceFilter === 'worknext'
                  ? 'Loading Active WorkNext Recruiter Jobs...'
                  : 'Searching Real Jobs from Adzuna & WorkNext...'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sans max-w-md mx-auto">
                {candidateRole || candidateSkills.length > 0
                  ? `Filtering positions matching "${candidateRole || candidateSkills.slice(0, 3).join(', ')}" and calculating match scores.`
                  : 'Retrieving live job listings and open positions.'}
              </p>
            </div>
          </div>
        ) : sourceFilter === 'worknext' && counts.worknext === 0 ? (
          <PlaceholderCard
            title="WorkNext Recruiter Openings"
            placeholderText="No active recruiter postings right now."
            description="Only positions created and maintained open by verified recruiters appear under WorkNext Recruiter. There are currently no active job postings published by recruiters. You can also browse live Adzuna positions."
            icon={<Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
            actionText="Browse All Available Jobs"
            onAction={() => setSourceFilter('all')}
          />
        ) : sourceFilter === 'adzuna' && counts.adzuna === 0 ? (
          <PlaceholderCard
            title="Adzuna External Jobs"
            placeholderText="No Adzuna jobs available."
            description="No real job postings found on Adzuna matching your current skills or location criteria. Try widening your keywords or checking WorkNext Recruiter postings."
            icon={<Globe className="w-6 h-6 text-sky-600 dark:text-sky-400" />}
            actionText="Browse All Available Jobs"
            onAction={() => setSourceFilter('all')}
          />
        ) : isAdzunaConfigured === false && sourceFilter === 'adzuna' && counts.adzuna === 0 ? (
          <div className="p-12 rounded-[24px] bg-white dark:bg-[#1A1A1A] border border-dashed border-stone-200 dark:border-stone-800 text-center space-y-4 max-w-2xl mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200/60 dark:border-amber-800/40">
              <Briefcase className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white font-display">Adzuna Jobs API Credentials Required</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sans max-w-md mx-auto">
                To stream real matching jobs and calculate genuine candidate match scores, configure the server environment variables <code className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono text-[11px] text-stone-800 dark:text-stone-200">ADZUNA_APP_ID</code> and <code className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono text-[11px] text-stone-800 dark:text-stone-200">ADZUNA_APP_KEY</code>.
              </p>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <PlaceholderCard
            title="Jobs Search Portal"
            placeholderText="No matching jobs found."
            description="Try adjusting your search criteria, removing location filters, or lowering the match score threshold."
            icon={<Briefcase className="w-6 h-6" />}
            actionText="Reset Search Filters"
            onAction={handleReset}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, idx) => (
              <div key={job.id ? `${job.id}-${idx}` : `job-${idx}`} className="relative h-full flex flex-col">
                <JobCard job={job} onSelect={j => setSelectedJob(j)} />
              </div>
            ))}
          </div>
        )}

        {/* Job Detail Modal */}
        <AnimatePresence>
          {selectedJob && (
            <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 rounded-[20px] shadow-lg w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 space-y-6 text-stone-900 dark:text-white"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-6">
                  <div className="flex items-center gap-4">
                    {selectedJob.companyLogo ? (
                      <img
                        src={selectedJob.companyLogo}
                        alt={selectedJob.company}
                        className="w-14 h-14 rounded-2xl object-cover border border-stone-200 dark:border-stone-800 shrink-0 bg-stone-50"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center font-bold text-xl text-[#0F766E] dark:text-teal-400 shrink-0 font-display">
                        {selectedJob.company ? selectedJob.company.charAt(0).toUpperCase() : 'J'}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {selectedJob.source === 'worknext' || (!selectedJob.source?.includes('adzuna') && !selectedJob.id.startsWith('adzuna_')) ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800/60 font-sans">
                            <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            WorkNext Recruiter Opening
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-300/80 dark:border-sky-800/60 font-sans">
                            <Globe className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                            Adzuna Partner Opening
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-stone-900 dark:text-white font-display">{selectedJob.title}</h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-sans mt-0.5">{selectedJob.company} • {selectedJob.location}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Closed Opening Notice */}
                {selectedJob.status === 'closed' && (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center gap-3 text-amber-800 dark:text-amber-300 text-xs font-sans">
                    <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>This job opening has been closed by the recruiter and is no longer accepting new applications.</span>
                  </div>
                )}

                {/* Match Banner */}
                <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/50 flex items-center justify-between font-sans">
                  <div>
                    <span className="text-xs font-bold text-[#0F766E] dark:text-teal-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> {selectedJob.matchScore > 0 ? `${selectedJob.matchScore}% Match with Your Profile` : 'Match Score Pending Resume Analysis'}
                    </span>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                      {hasResumeAnalyzed
                        ? `Calculated from your verified skills (${candidateSkills.length} extracted) and target role (${candidateRole || 'Candidate'}).`
                        : 'Upload and analyze your resume in the Resume Builder to calculate your personalized match score.'}
                    </p>
                  </div>
                </div>

                {/* Job Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-sans">Position Overview</h4>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans font-normal">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Requirements */}
                <div className="space-y-3 font-sans">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-sans font-normal">Required Skills & Competencies</h4>
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((req, i) => {
                      const isMatched = candidateSkills.some(cs => req.toLowerCase().includes(cs.toLowerCase()) || cs.toLowerCase().includes(req.toLowerCase()));
                      return (
                        <li key={i} className="text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2.5">
                          <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${isMatched ? 'text-[#0F766E] dark:text-teal-400' : 'text-stone-300 dark:text-stone-600'}`} />
                          <span className={isMatched ? 'font-semibold text-stone-900 dark:text-white' : ''}>
                            {req} {isMatched && <span className="text-[10px] text-[#0F766E] dark:text-teal-400 font-bold ml-1.5">(Matched)</span>}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Modal Actions */}
                <div className="pt-6 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-4 font-sans">
                  <Button variant="outline" size="sm" onClick={() => toggleSaveJob(selectedJob.id)}>
                    {savedJobIds.includes(selectedJob.id) ? 'Saved' : 'Save Opening'}
                  </Button>

                  {(() => {
                    const isSelectedExternal =
                      selectedJob.source === 'adzuna' ||
                      selectedJob.source === 'Adzuna' ||
                      selectedJob.source === 'linkedin' ||
                      selectedJob.source === 'LinkedIn' ||
                      (typeof selectedJob.id === 'string' &&
                        (selectedJob.id.startsWith('adzuna_') || selectedJob.id.startsWith('linkedin_'))) ||
                      (Boolean(selectedJob.applyUrl) && selectedJob.source !== 'worknext');

                    const isConfirmedApplied = isSelectedExternal
                      ? Boolean(selectedJob.externalConfirmedSubmission)
                      : appliedJobIds.includes(selectedJob.id);

                    if (selectedJob.status === 'closed') {
                      return (
                        <Button variant="outline" size="md" disabled className="text-amber-700 dark:text-amber-400 border-amber-300 bg-amber-50 dark:bg-amber-950/40">
                          Opening Closed
                        </Button>
                      );
                    }

                    if (isConfirmedApplied) {
                      return (
                        <Button variant="outline" size="md" disabled className="text-[#0F766E] border-teal-200 bg-teal-50 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Applied
                        </Button>
                      );
                    }

                    if (isSelectedExternal && selectedJob.applyUrl) {
                      return (
                        <a
                          href={selectedJob.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex"
                        >
                          <Button variant="primary" size="md" className="bg-[#0F766E] hover:bg-[#0D655E] flex items-center gap-2">
                            Apply Now <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      );
                    }

                    return (
                      <Button
                        variant="primary"
                        size="md"
                        disabled={isSubmittingApp}
                        onClick={() => handleApply(selectedJob)}
                        className="bg-[#0F766E] hover:bg-[#0D655E]"
                      >
                        Apply Now
                      </Button>
                    );
                  })()}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

