import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useApp } from '../context/AppContext';
import { Job } from '../types';
import { JobCard } from '../components/cards/JobCard';
import { JobFilterForm } from '../components/forms/JobFilterForm';
import { PlaceholderCard } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Sparkles, X, CheckCircle2, Briefcase, FileText, ArrowRight, AlertCircle, Award, ExternalLink } from 'lucide-react';

export interface LocalJobFinderPageProps {
  jobs?: Job[];
  onApplyForJob?: (jobId: string) => void;
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

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [adzunaJobs, setAdzunaJobs] = useState<Job[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdzunaConfigured, setIsAdzunaConfigured] = useState<boolean | null>(null);

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
              setAdzunaJobs(data.jobs);
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

  // Compute real match scores and rank matching job listings based on authentic candidate profile
  const baseJobs = adzunaJobs !== null ? adzunaJobs : (initialJobs || jobs);
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
  };

  const filteredJobs = rankedJobs.filter(job => {
    // Only apply client-side text filtering if we are using the static fallback (adzunaJobs === null)
    if (adzunaJobs === null) {
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
          onReset={handleReset}
        />

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between text-xs font-sans text-stone-500 dark:text-stone-400 px-1">
          <span>Showing {filteredJobs.length} position{filteredJobs.length === 1 ? '' : 's'}</span>
          <span className="text-[#0F766E] dark:text-teal-400 flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Regional Opportunities
          </span>
        </div>

        {/* Jobs List */}
        {isLoading ? (
          <div className="p-12 rounded-[24px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 text-center space-y-4 max-w-2xl mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 flex items-center justify-center mx-auto animate-pulse">
              <Sparkles className="w-6 h-6 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900 dark:text-white font-display">
                Searching Real Jobs from Adzuna...
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sans max-w-md mx-auto">
                {candidateRole || candidateSkills.length > 0
                  ? `Filtering positions matching "${candidateRole || candidateSkills.slice(0, 3).join(', ')}" and calculating match scores.`
                  : 'Retrieving live job listings and open positions.'}
              </p>
            </div>
          </div>
        ) : isAdzunaConfigured === false && rankedJobs.length === 0 ? (
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
        ) : rankedJobs.length === 0 ? (
          <PlaceholderCard
            title="Adzuna Jobs Portal"
            placeholderText="No matching jobs found on Adzuna."
            description="No real job postings found for your current skills, role, or location criteria. Try widening your search keywords or removing location filters."
            icon={<Briefcase className="w-6 h-6" />}
            actionText="Reset Search Filters"
            onAction={handleReset}
          />
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

                  {appliedJobIds.includes(selectedJob.id) ? (
                    <Button variant="outline" size="md" disabled className="text-[#0F766E] border-teal-200 bg-teal-50">
                      <CheckCircle2 className="w-4 h-4" /> Application Submitted
                    </Button>
                  ) : selectedJob.applyUrl ? (
                    <a
                      href={selectedJob.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => applyForJob(selectedJob.id)}
                      className="inline-flex"
                    >
                      <Button variant="primary" size="md" className="bg-[#0F766E] hover:bg-[#0D655E] flex items-center gap-2">
                        Apply on Employer Site <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  ) : (
                    <Button variant="primary" size="md" onClick={() => applyForJob(selectedJob.id)} className="bg-[#0F766E] hover:bg-[#0D655E]">
                      Submit Direct Application
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

