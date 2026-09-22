import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useApp } from '../context/AppContext';
import { Job } from '../types';
import {
  LayoutDashboard,
  Plus,
  Briefcase,
  Users,
  Sparkles,
  FileText,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Globe,
  TrendingUp,
  UserCheck,
  ChevronRight,
  Eye,
  Edit3,
  AlertCircle,
  Trash2,
  PlusCircle,
  FileCheck,
  Star,
  ChevronLeft,
  Ban,
  XCircle,
  ShieldAlert
} from 'lucide-react';
import { Button } from '../components/ui/Button';

interface Candidate {
  id: string;
  name: string;
  role: string;
  location: string;
  experienceYears: number;
  matchScore: number;
  skills: string[];
  email: string;
  phone: string;
  bio: string;
  status: 'applied' | 'under_review' | 'shortlisted' | 'selected' | 'rejected' | 'screening' | 'interview' | 'offer' | 'archived';
  appliedJobTitle: string;
  appliedDate: string;
  notes?: string;
  rating?: number;
}

export const RecruiterDashboardPage: React.FC = () => {
  const { jobs, addJob, user, setUser, isLoggedIn } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const isRecruiter = isLoggedIn && (user?.role === 'recruiter' || (user?.role as string) === 'employer');

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isRecruiter) {
    return <Navigate to="/dashboard" replace />;
  }

  const currentTab = searchParams.get('tab') || 'dashboard';

  const setTab = (tab: string) => {
    setSearchParams({ tab });
  };

  // Real Recruiter Jobs State from Backend Database (starts empty)
  const [recruiterJobs, setRecruiterJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Real Candidates & Applications State from Backend
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(true);

  // Fetch real recruiter-posted jobs and candidates from backend database on mount
  useEffect(() => {
    // Purge any legacy synthetic candidates cached in browser localStorage
    try {
      localStorage.removeItem('worknext_recruiter_candidates_v1');
    } catch (e) {
      console.error(e);
    }

    const fetchRecruiterJobs = async () => {
      setLoadingJobs(true);
      try {
        const q = new URLSearchParams();
        if (user?.id) q.set('recruiterId', user.id);
        if (user?.email) q.set('recruiterEmail', user.email);

        const res = await fetch(`/api/recruiter/jobs?${q.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.jobs)) {
            // Strictly show only this recruiter's own posted jobs
            const ownJobs = data.jobs.filter((j: Job) => {
              if (user?.id && j.recruiterId === user.id) return true;
              if (user?.email && j.recruiterEmail === user.email) return true;
              if (!j.recruiterId && !j.recruiterEmail) return true;
              return false;
            });
            setRecruiterJobs(ownJobs);
          }
        }
      } catch (err) {
        console.error('Error fetching recruiter jobs:', err);
      } finally {
        setLoadingJobs(false);
      }
    };

    const fetchRealCandidates = async () => {
      setLoadingCandidates(true);
      try {
        const q = new URLSearchParams();
        if (user?.id) q.set('recruiterId', user.id);
        if (user?.email) q.set('recruiterEmail', user.email);

        const res = await fetch(`/api/recruiter/candidates?${q.toString()}`, {
          headers: {
            'x-recruiter-id': user?.id || '',
            'x-recruiter-email': user?.email || '',
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.candidates)) {
            setCandidates(data.candidates);
          }
        }
      } catch (err) {
        console.error('Error fetching real candidates:', err);
      } finally {
        setLoadingCandidates(false);
      }
    };

    const fetchVerificationStatus = async () => {
      setStatusLoading(true);
      try {
        const q = new URLSearchParams();
        if (user?.id) q.set('recruiterId', user.id);
        if (user?.email) q.set('recruiterEmail', user.email);
        if (user?.company) q.set('company', user.company);
        if (user?.name) q.set('name', user.name);

        const res = await fetch(`/api/recruiter/status?${q.toString()}`, {
          headers: {
            'x-recruiter-id': user?.id || '',
            'x-recruiter-email': user?.email || '',
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.status) {
            setRecruiterStatus(data.status);
          }
        }
      } catch (err) {
        console.warn('Error checking recruiter verification status:', err);
      } finally {
        setStatusLoading(false);
      }
    };

    fetchRecruiterJobs();
    fetchRealCandidates();
    fetchVerificationStatus();
  }, [user?.id, user?.email]);

  // Recruiter Verification Status ('pending' | 'approved' | 'rejected' | 'suspended')
  const [recruiterStatus, setRecruiterStatus] = useState<'pending' | 'approved' | 'rejected' | 'suspended'>('approved');
  const [statusLoading, setStatusLoading] = useState(true);
  const [postErrorAlert, setPostErrorAlert] = useState<string | null>(null);

  // Selected Candidate for Detailed Credentials Modal
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Post Job Form State
  const [newJob, setNewJob] = useState({
    title: '',
    company: user.company || user.name || '',
    location: user.location || '',
    isRemote: true,
    type: 'Full-time' as const,
    category: 'Software Engineering',
    salaryMin: 0,
    salaryMax: 0,
    experienceLevel: 'Mid-Level',
    description: '',
    requirements: ''
  });

  const [postSuccessAlert, setPostSuccessAlert] = useState(false);
  const [profileSuccessAlert, setProfileSuccessAlert] = useState(false);

  // Recruiter Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user.name || '',
    email: user.email || '',
    company: user.company || '',
    title: user.title || '',
    location: user.location || '',
    website: user.website || '',
    phone: user.phone || '',
    bio: user.bio || ''
  });

  // Handle Save Recruiter Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name: profileForm.name,
      company: profileForm.company,
      title: profileForm.title,
      location: profileForm.location,
      website: profileForm.website,
      phone: profileForm.phone,
      bio: profileForm.bio
    }));
    setProfileSuccessAlert(true);
    setTimeout(() => setProfileSuccessAlert(false), 3500);
  };

  // Handle Create Job Post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostErrorAlert(null);
    if (!newJob.title.trim() || !newJob.company.trim()) return;

    if (recruiterStatus !== 'approved') {
      setPostErrorAlert(
        recruiterStatus === 'pending'
          ? 'Recruiter verification pending: Your account is currently under administrator review. Job postings can only be published once verified by a WorkNext administrator.'
          : recruiterStatus === 'rejected'
          ? 'Verification not approved: Your recruiter account is not authorized to publish job listings. Please contact admin support.'
          : 'Account suspended: Your recruiter privileges are paused by the platform administrator.'
      );
      return;
    }

    const created: Job = {
      id: 'job_' + Date.now(),
      title: newJob.title.trim(),
      company: newJob.company.trim(),
      companyLogo: '',
      location: newJob.location.trim() || 'Remote',
      isRemote: newJob.isRemote,
      type: newJob.type,
      category: newJob.category,
      salaryMin: Number(newJob.salaryMin) || 0,
      salaryMax: Number(newJob.salaryMax) || 0,
      salaryPeriod: 'year',
      postedDate: 'Just now',
      description: newJob.description.trim(),
      requirements: newJob.requirements.split(',').map(r => r.trim()).filter(Boolean),
      matchScore: 0,
      skillGaps: [],
      applicantsCount: 0,
      experienceLevel: newJob.experienceLevel as any,
      source: 'worknext',
      recruiterId: user.id || '',
      recruiterEmail: user.email || '',
    };

    const result = await addJob(created);
    if (!result?.success) {
      setPostErrorAlert(result?.error || 'Failed to publish job opening. Please ensure your recruiter status is approved.');
      return;
    }

    setRecruiterJobs(prev => [created, ...prev]);
    setPostSuccessAlert(true);
    setNewJob({
      title: '',
      company: user.company || user.name || '',
      location: user.location || '',
      isRemote: true,
      type: 'Full-time',
      category: 'Software Engineering',
      salaryMin: 0,
      salaryMax: 0,
      experienceLevel: 'Mid-Level',
      description: '',
      requirements: ''
    });
    setTimeout(() => setPostSuccessAlert(false), 4000);
  };

  // Close or delete recruiter job opening
  const handleDeleteJob = async (jobId: string) => {
    setRecruiterJobs(prev => prev.filter(j => j.id !== jobId));
    try {
      const q = new URLSearchParams();
      if (user?.id) q.set('recruiterId', user.id);
      if (user?.email) q.set('recruiterEmail', user.email);
      await fetch(`/api/recruiter/jobs/${jobId}?${q.toString()}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Error deleting recruiter job:', err);
    }
  };

  // Toggle opening status between active and closed
  const handleToggleJobStatus = async (jobId: string, currentStatus?: string) => {
    const nextStatus = currentStatus === 'closed' ? 'active' : 'closed';
    setRecruiterJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: nextStatus } : j));
    try {
      const q = new URLSearchParams();
      if (user?.id) q.set('recruiterId', user.id);
      if (user?.email) q.set('recruiterEmail', user.email);
      await fetch(`/api/recruiter/jobs/${jobId}/status?${q.toString()}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (err) {
      console.warn('Error updating recruiter job status:', err);
    }
  };

  // Candidate Status Updater with backend sync
  const updateCandidateStatus = (candidateId: string, newStatus: Candidate['status']) => {
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status: newStatus } : c));
    fetch(`/api/recruiter/candidates/${candidateId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    }).catch(e => console.warn('Could not update status on backend', e));
  };

  // Candidate Note Updater with backend sync
  const updateCandidateNote = (candidateId: string, notes: string) => {
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, notes } : c));
    fetch(`/api/recruiter/candidates/${candidateId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    }).catch(e => console.warn('Could not update notes on backend', e));
  };

  // Filter States
  const [candidateFilter, setCandidateFilter] = useState<'all' | '90' | '80'>('all');
  const [applicationStageFilter, setApplicationStageFilter] = useState<'all' | 'applied' | 'under_review' | 'shortlisted' | 'selected' | 'rejected'>('all');
  const [jobSearchQuery, setJobSearchQuery] = useState('');

  const normalizeStatus = (status: string): 'applied' | 'under_review' | 'shortlisted' | 'selected' | 'rejected' => {
    if (status === 'screening') return 'under_review';
    if (status === 'interview') return 'shortlisted';
    if (status === 'offer') return 'selected';
    if (status === 'archived') return 'rejected';
    if (status === 'under_review' || status === 'shortlisted' || status === 'selected' || status === 'rejected') return status;
    return 'applied';
  };

  const filteredCandidates = candidates.filter(c => {
    if (candidateFilter === '90') return c.matchScore >= 90;
    if (candidateFilter === '80') return c.matchScore >= 80;
    return true;
  });

  const filteredApplications = candidates.filter(c => {
    if (applicationStageFilter === 'all') return true;
    return normalizeStatus(c.status) === applicationStageFilter;
  });

  const filteredJobs = recruiterJobs.filter(j => {
    if (!jobSearchQuery.trim()) return true;
    const q = jobSearchQuery.toLowerCase();
    return j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.location.toLowerCase().includes(q);
  });

  // WorkNext Recruiter Pipeline counts: Applied -> Under Review -> Shortlisted -> Selected / Rejected
  const countApplied = candidates.filter(c => normalizeStatus(c.status) === 'applied').length;
  const countUnderReview = candidates.filter(c => normalizeStatus(c.status) === 'under_review').length;
  const countShortlisted = candidates.filter(c => normalizeStatus(c.status) === 'shortlisted').length;
  const countSelected = candidates.filter(c => normalizeStatus(c.status) === 'selected').length;
  const countRejected = candidates.filter(c => normalizeStatus(c.status) === 'rejected').length;

  return (
    <DashboardLayout>
      <div className="space-y-8 font-sans">
        {/* Top Header & Navigation Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Recruiter Verification Status Badge */}
              <span
                id="recruiter-verification-status-badge"
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  recruiterStatus === 'approved'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                    : recruiterStatus === 'pending'
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                    : recruiterStatus === 'rejected'
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400'
                    : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
                title={`Verification Status: ${recruiterStatus}`}
              >
                {recruiterStatus === 'approved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                {recruiterStatus === 'pending' && <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                {recruiterStatus === 'rejected' && <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />}
                {recruiterStatus === 'suspended' && <Ban className="w-3.5 h-3.5 text-stone-500" />}
                <span>
                  {recruiterStatus === 'approved' && 'Verified Recruiter'}
                  {recruiterStatus === 'pending' && 'Verification Pending'}
                  {recruiterStatus === 'rejected' && 'Verification Rejected'}
                  {recruiterStatus === 'suspended' && 'Account Suspended'}
                </span>
              </span>
              <span className="text-xs text-stone-400 dark:text-stone-500">•</span>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                {user.company || 'Enterprise Talent Partner'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white mt-1.5 font-display">
              {currentTab === 'dashboard' && 'Recruiter Dashboard'}
              {currentTab === 'post' && 'Post New Job Opening'}
              {currentTab === 'openings' && 'Active Job Openings'}
              {currentTab === 'candidates' && 'Matched Candidates Radar'}
              {currentTab === 'applications' && 'Candidate Applications Pool'}
              {currentTab === 'management' && 'Candidate Management Pipeline'}
              {currentTab === 'profile' && 'Recruiter & Employer Profile'}
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={currentTab === 'post' ? 'primary' : 'outline'}
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setTab('post')}
              className={currentTab === 'post' ? 'bg-[#0F766E] hover:bg-[#0D655E]' : ''}
            >
              Post Job
            </Button>
            <Button
              variant={currentTab === 'candidates' ? 'primary' : 'outline'}
              size="sm"
              icon={<Sparkles className="w-3.5 h-3.5" />}
              onClick={() => setTab('candidates')}
              className={currentTab === 'candidates' ? 'bg-[#0F766E] hover:bg-[#0D655E]' : ''}
            >
              Find Talent
            </Button>
          </div>
        </div>

        {/* Recruiter Navigation Pills Bar */}
        <div className="flex items-center gap-1.5 p-1.5 bg-stone-100 dark:bg-stone-900/90 rounded-2xl border border-stone-200/80 dark:border-stone-800 overflow-x-auto text-xs scrollbar-none">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
            { id: 'post', label: 'Post Jobs', icon: <PlusCircle className="w-3.5 h-3.5" /> },
            { id: 'openings', label: 'Active Openings', count: recruiterJobs.length, icon: <Briefcase className="w-3.5 h-3.5" /> },
            { id: 'candidates', label: 'Matched Candidates', count: candidates.length, icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: 'applications', label: 'Applications', count: candidates.length, icon: <FileCheck className="w-3.5 h-3.5" /> },
            { id: 'management', label: 'Candidate Management', icon: <Users className="w-3.5 h-3.5" /> },
            { id: 'profile', label: 'Recruiter Profile', icon: <Building2 className="w-3.5 h-3.5" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                currentTab === tab.id
                  ? 'bg-white dark:bg-stone-800 text-[#0F766E] dark:text-teal-300 shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  currentTab === tab.id
                    ? 'bg-teal-500/15 text-[#0F766E] dark:text-teal-400 font-bold'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Global Notifications for Job, Profile, or Verification Status */}
        <AnimatePresence>
          {postErrorAlert && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-medium flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{postErrorAlert}</span>
              </div>
              <button
                onClick={() => setPostErrorAlert(null)}
                className="font-bold text-rose-600 dark:text-rose-400 hover:opacity-80 ml-4 px-2 py-0.5 cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          )}

          {recruiterStatus !== 'approved' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border text-xs font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
                recruiterStatus === 'pending'
                  ? 'bg-amber-50/90 dark:bg-amber-950/60 border-amber-200/90 dark:border-amber-800/70 text-amber-900 dark:text-amber-200'
                  : recruiterStatus === 'rejected'
                  ? 'bg-rose-50/90 dark:bg-rose-950/60 border-rose-200/90 dark:border-rose-800/70 text-rose-900 dark:text-rose-200'
                  : 'bg-stone-100 dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-300'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3">
                {recruiterStatus === 'pending' && <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" />}
                {recruiterStatus === 'rejected' && <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 sm:mt-0" />}
                {recruiterStatus === 'suspended' && <Ban className="w-4 h-4 text-stone-500 shrink-0 mt-0.5 sm:mt-0" />}
                <div>
                  <span className="font-bold mr-1.5">
                    {recruiterStatus === 'pending' && 'Account Verification Under Review:'}
                    {recruiterStatus === 'rejected' && 'Account Verification Rejected:'}
                    {recruiterStatus === 'suspended' && 'Account Suspended:'}
                  </span>
                  <span>
                    {recruiterStatus === 'pending' && 'Your corporate recruiter credentials have been submitted for administrator verification. Publishing live job postings is temporarily disabled until approved.'}
                    {recruiterStatus === 'rejected' && 'Your recruiter organization application was not approved by administration. Please contact admin@worknext.io to request re-evaluation.'}
                    {recruiterStatus === 'suspended' && 'Your hiring privileges have been temporarily paused by an administrator.'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-white/70 dark:bg-stone-800/70 border border-current/20 font-bold uppercase tracking-wider">
                  Status: {recruiterStatus}
                </span>
              </div>
            </motion.div>
          )}

          {postSuccessAlert && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-[#0F766E] dark:text-teal-300 text-xs font-medium flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0F766E] dark:text-teal-400 shrink-0" />
                <span>Job opening successfully published! WorkNext AI match engine is routing candidates.</span>
              </div>
              <button onClick={() => setTab('openings')} className="font-bold underline text-xs cursor-pointer ml-4">
                View in Active Openings →
              </button>
            </motion.div>
          )}

          {profileSuccessAlert && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-[#0F766E] dark:text-teal-300 text-xs font-medium flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0F766E] dark:text-teal-400 shrink-0" />
                <span>Recruiter and corporate organization profile updated successfully.</span>
              </div>
              <span className="font-bold cursor-pointer" onClick={() => setProfileSuccessAlert(false)}>✕</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =========================================================================
            TAB 1: RECRUITER DASHBOARD
            ========================================================================= */}
        {currentTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Executive KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Active Postings</span>
                  <Briefcase className="w-4 h-4 text-[#0F766E] dark:text-teal-400" />
                </div>
                <p className="text-3xl font-extrabold text-stone-900 dark:text-white font-display">{recruiterJobs.length}</p>
                <p className="text-[11px] text-[#0F766E] dark:text-teal-400 font-medium flex items-center gap-1">
                  {recruiterJobs.length === 0 ? (
                    <span className="text-stone-400">No active openings</span>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] dark:bg-teal-400" />
                      Live in Job Finder
                    </>
                  )}
                </p>
              </div>

              <div className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Matched Candidates</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-3xl font-extrabold text-stone-900 dark:text-white font-display">{candidates.length}</p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {candidates.length === 0 ? 'No candidates yet' : 'Scored by verified skills'}
                </p>
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setTab('post')}
                className="p-5 rounded-2xl bg-gradient-to-r from-teal-600 to-[#0F766E] text-white text-left transition-all hover:shadow-lg hover:shadow-teal-500/20 group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <PlusCircle className="w-6 h-6" />
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-bold text-sm font-display">Post New Opening</h3>
                <p className="text-xs text-teal-100 mt-1">Publish verified roles with wage transparency</p>
              </button>

              <button
                onClick={() => setTab('candidates')}
                className="p-5 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 text-stone-900 dark:text-white text-left transition-all hover:border-teal-500/50 hover:shadow-sm group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-bold text-sm font-display">Browse Matched Talent</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Source candidates matched by verified competencies</p>
              </button>

              <button
                onClick={() => setTab('applications')}
                className="p-5 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 text-stone-900 dark:text-white text-left transition-all hover:border-teal-500/50 hover:shadow-sm group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <FileCheck className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-bold text-sm font-display">Candidate Applications</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Review applicant submissions and verified qualifications</p>
              </button>
            </div>

            {/* Active Job Openings Overview */}
            <div className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2 font-display">
                  <Briefcase className="w-4 h-4 text-[#0F766E] dark:text-teal-400" />
                  Active Job Openings ({recruiterJobs.length})
                </h3>
                {recruiterJobs.length > 0 && (
                  <button
                    onClick={() => setTab('openings')}
                    className="text-xs font-bold text-[#0F766E] dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    View All →
                  </button>
                )}
              </div>

              {recruiterJobs.length === 0 ? (
                <div className="p-10 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800 text-center space-y-3 bg-stone-50/50 dark:bg-stone-900/40">
                  <Briefcase className="w-10 h-10 mx-auto text-stone-400" />
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white font-display">No active openings</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                    You have not published any job openings yet. List positions with transparent salary bands to match verified candidates.
                  </p>
                  <Button variant="primary" size="sm" onClick={() => setTab('post')} className="bg-[#0F766E] hover:bg-[#0D655E]">
                    Post Your First Opening
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recruiterJobs.slice(0, 5).map(job => (
                    <div
                      key={job.id}
                      className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-stone-900 dark:text-white font-display">{job.title}</h4>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sans">
                          {job.company} • {job.location} • {job.type}
                        </p>
                        {job.requirements && job.requirements.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {job.requirements.slice(0, 4).map((req, rIdx) => (
                              <span key={rIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                                {req}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {(job.salaryMin > 0 || job.salaryMax > 0) && (
                          <span className="text-xs font-mono font-bold text-[#0F766E] dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-lg">
                            ₹{job.salaryMin.toLocaleString()} - ₹{job.salaryMax.toLocaleString()}/yr
                          </span>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTab('candidates')}
                          className="text-xs"
                        >
                          Matches
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: POST JOBS
            ========================================================================= */}
        {currentTab === 'post' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 p-8 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-stone-900 dark:text-white font-display flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-[#0F766E] dark:text-teal-400" />
                    Create Verified Job Opening
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    List positions with transparent salary bands to match verified skill profiles immediately.
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold self-start border ${
                  recruiterStatus === 'approved'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 text-emerald-700 dark:text-emerald-400'
                    : recruiterStatus === 'pending'
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 text-amber-800 dark:text-amber-300'
                    : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 text-rose-700 dark:text-rose-400'
                }`}>
                  {recruiterStatus === 'approved' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  <span>Posting: {recruiterStatus === 'approved' ? 'Active' : 'Locked (' + recruiterStatus + ')'}</span>
                </span>
              </div>

              {recruiterStatus !== 'approved' && (
                <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
                  recruiterStatus === 'pending'
                    ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                    : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                }`}>
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">
                      {recruiterStatus === 'pending' ? 'Administrator Approval Required' : 'Recruiter Account Not Approved'}
                    </p>
                    <p className="mt-0.5 leading-relaxed">
                      {recruiterStatus === 'pending'
                        ? 'Your recruiter account is currently pending administrator verification in the WorkNext Admin Console. You may draft your job posting below, but publishing live will become available once approved.'
                        : 'Your recruiter verification was rejected or suspended. Live job postings cannot be published.'}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="block font-semibold text-stone-700 dark:text-stone-300">Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    value={newJob.title}
                    onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-semibold text-stone-700 dark:text-stone-300">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={newJob.company}
                      onChange={e => setNewJob({ ...newJob, company: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-stone-700 dark:text-stone-300">Location *</label>
                    <input
                      type="text"
                      required
                      value={newJob.location}
                      onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block font-semibold text-stone-700 dark:text-stone-300">Employment Type</label>
                    <select
                      value={newJob.type}
                      onChange={e => setNewJob({ ...newJob, type: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-stone-700 dark:text-stone-300">Category</label>
                    <select
                      value={newJob.category}
                      onChange={e => setNewJob({ ...newJob, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                    >
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="Data Science & AI">Data Science & AI</option>
                      <option value="Design & Creative">Design & Creative</option>
                      <option value="Product Management">Product Management</option>
                      <option value="DevOps & Cloud">DevOps & Cloud</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-stone-700 dark:text-stone-300">Experience Level</label>
                    <select
                      value={newJob.experienceLevel}
                      onChange={e => setNewJob({ ...newJob, experienceLevel: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                    >
                      <option value="Entry-Level">Entry-Level (0-2 yrs)</option>
                      <option value="Mid-Level">Mid-Level (3-5 yrs)</option>
                      <option value="Senior">Senior (5-8 yrs)</option>
                      <option value="Lead / Executive">Lead / Executive (8+ yrs)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-semibold text-stone-700 dark:text-stone-300">Minimum Annual Salary (₹)</label>
                    <input
                      type="number"
                      step={50000}
                      value={newJob.salaryMin}
                      onChange={e => setNewJob({ ...newJob, salaryMin: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-semibold text-stone-700 dark:text-stone-300">Maximum Annual Salary (₹)</label>
                    <input
                      type="number"
                      step={50000}
                      value={newJob.salaryMax}
                      onChange={e => setNewJob({ ...newJob, salaryMax: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-stone-700 dark:text-stone-300">Required Skills (Comma separated) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. React, TypeScript, GraphQL, Tailwind CSS"
                    value={newJob.requirements}
                    onChange={e => setNewJob({ ...newJob, requirements: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-stone-700 dark:text-stone-300">Job Description & Responsibilities</label>
                  <textarea
                    rows={4}
                    placeholder="Outline the core responsibilities, key milestones, and growth opportunities for this role..."
                    value={newJob.description}
                    onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-3">
                  <Button variant="outline" size="sm" type="button" onClick={() => setTab('openings')}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    disabled={recruiterStatus !== 'approved'}
                    className={`bg-[#0F766E] hover:bg-[#0D655E] ${recruiterStatus !== 'approved' ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {recruiterStatus === 'approved'
                      ? 'Publish Opening Live'
                      : recruiterStatus === 'pending'
                      ? 'Pending Admin Approval'
                      : recruiterStatus === 'rejected'
                      ? 'Verification Rejected'
                      : 'Account Suspended'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Live Posting Preview */}
            <div className="space-y-4">
              <div className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  <Eye className="w-3.5 h-3.5" />
                  Live Seeker Preview
                </div>

                <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 font-mono">
                      {newJob.type} • {newJob.experienceLevel}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 dark:text-white mt-1 font-display">
                      {newJob.title || 'Untitled Opening'}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                      {newJob.company || 'Organization Name'} • {newJob.location || 'Location'}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/40 text-xs font-mono font-bold text-[#0F766E] dark:text-teal-300">
                    ₹{Number(newJob.salaryMin || 0).toLocaleString()} - ₹{Number(newJob.salaryMax || 0).toLocaleString()}/yr
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                    {newJob.description || 'Describe role responsibilities and qualifications to attract matched applicants.'}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {newJob.requirements.split(',').map((req, idx) => {
                      const trimmed = req.trim();
                      if (!trimmed) return null;
                      return (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                          {trimmed}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-900 dark:text-teal-200 space-y-1">
                  <span className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    Verified Wage Transparency
                  </span>
                  <p className="text-[11px] text-teal-800 dark:text-teal-300 leading-snug">
                    WorkNext highlights verified compensation transparently to encourage high-quality candidate applications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: ACTIVE JOB OPENINGS
            ========================================================================= */}
        {currentTab === 'openings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search openings by title or location..."
                  value={jobSearchQuery}
                  onChange={e => setJobSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1A1A1A] text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'Opening' : 'Openings'}
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setTab('post')}
                  className="bg-[#0F766E] hover:bg-[#0D655E]"
                >
                  Post Another Opening
                </Button>
              </div>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="p-12 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-dashed border-stone-200 dark:border-stone-800 text-center space-y-4">
                <Briefcase className="w-10 h-10 mx-auto text-stone-400" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-white font-display">No active openings</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                  {jobSearchQuery ? 'No openings match your search query.' : 'You have not published any job openings yet.'}
                </p>
                <Button variant="primary" size="sm" onClick={() => setTab('post')} className="bg-[#0F766E] hover:bg-[#0D655E]">
                  Post New Opening
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map(job => (
                  <div
                    key={job.id}
                    className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {job.status === 'closed' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-mono">
                            Closed / Inactive
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-mono">
                            Active / Open
                          </span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 font-mono">
                          {job.type}
                        </span>
                        {job.isRemote && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 font-mono">
                            Remote
                          </span>
                        )}
                        <span className="text-xs text-stone-400">• Posted {job.postedDate}</span>
                      </div>

                      <h3 className="text-base font-bold text-stone-900 dark:text-white font-display">
                        {job.title}
                      </h3>

                      <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-3">
                        <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {job.company}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.requirements.map((req, rIdx) => (
                          <span key={rIdx} className="text-[10px] px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-stone-100 dark:border-stone-800">
                      <span className="text-xs font-mono font-bold text-[#0F766E] dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-3 py-1.5 rounded-xl border border-teal-200/50 dark:border-teal-800/40">
                        ₹{job.salaryMin.toLocaleString()} - ₹{job.salaryMax.toLocaleString()}/yr
                      </span>

                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleJobStatus(job.id, job.status)}
                          className={`text-xs ${job.status === 'closed' ? 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400' : 'border-amber-500/40 text-amber-600 dark:text-amber-400'}`}
                        >
                          {job.status === 'closed' ? 'Reopen Job' : 'Close Job'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTab('candidates')}
                          icon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                          className="text-xs"
                        >
                          Matched Talent
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setTab('applications')}
                          icon={<Users className="w-3.5 h-3.5" />}
                          className="text-xs bg-[#0F766E] hover:bg-[#0D655E]"
                        >
                          Applications
                        </Button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border border-stone-200 dark:border-stone-800 transition-colors cursor-pointer"
                          title="Delete Opening"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 4: MATCHED CANDIDATES
            ========================================================================= */}
        {currentTab === 'candidates' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2 font-display">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Pre-Vetted Candidate Radar
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Talent scored dynamically by verified competencies, project portfolios, and career readiness.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 dark:text-stone-400">Match score:</span>
                <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-900 p-1 rounded-xl border border-stone-200 dark:border-stone-800 text-xs">
                  <button
                    onClick={() => setCandidateFilter('all')}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer ${candidateFilter === 'all' ? 'bg-white dark:bg-stone-800 font-bold text-[#0F766E] dark:text-teal-400 shadow-xs' : 'text-stone-600 dark:text-stone-400'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setCandidateFilter('80')}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer ${candidateFilter === '80' ? 'bg-white dark:bg-stone-800 font-bold text-[#0F766E] dark:text-teal-400 shadow-xs' : 'text-stone-600 dark:text-stone-400'}`}
                  >
                    &gt;80%
                  </button>
                  <button
                    onClick={() => setCandidateFilter('90')}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer ${candidateFilter === '90' ? 'bg-white dark:bg-stone-800 font-bold text-[#0F766E] dark:text-teal-400 shadow-xs' : 'text-stone-600 dark:text-stone-400'}`}
                  >
                    &gt;90%
                  </button>
                </div>
              </div>
            </div>

            {loadingCandidates ? (
              <div className="p-12 text-center text-xs text-stone-500 dark:text-stone-400">
                Loading candidate pool...
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="p-12 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-dashed border-stone-200 dark:border-stone-800 text-center space-y-4">
                <Users className="w-10 h-10 mx-auto text-stone-400" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-white font-display">No candidates yet</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                  {candidateFilter !== 'all'
                    ? 'No candidates match the selected match score filter.'
                    : 'No candidates have applied or matched your active criteria yet.'}
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button variant="primary" size="sm" onClick={() => setTab('post')} className="bg-[#0F766E] hover:bg-[#0D655E]">
                    Post New Opening
                  </Button>
                  {candidateFilter !== 'all' && (
                    <Button variant="outline" size="sm" onClick={() => setCandidateFilter('all')}>
                      Show All Candidates
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCandidates.map(candidate => (
                  <div
                    key={candidate.id}
                    className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-4 relative flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-stone-900 dark:text-white font-display">{candidate.name}</h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Skill Verified
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 dark:text-stone-300 font-medium">{candidate.role}</p>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-2 mt-0.5">
                            <span><MapPin className="w-3 h-3 inline mr-0.5" />{candidate.location}</span>
                            <span>• {candidate.experienceYears} yrs experience</span>
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-teal-500/15 text-[#0F766E] dark:text-teal-400 font-mono font-bold text-xs">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            {candidate.matchScore}% Match
                          </span>
                          <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-1">Target: {candidate.appliedJobTitle}</p>
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                        {candidate.bio}
                      </p>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Verified Competencies</span>
                        <div className="flex flex-wrap gap-1.5">
                          {candidate.skills.map((s, sIdx) => (
                            <span key={sIdx} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCandidate(candidate)}
                        icon={<Eye className="w-3.5 h-3.5" />}
                        className="text-xs"
                      >
                        View Profile
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            updateCandidateStatus(candidate.id, 'interview');
                            setTab('management');
                          }}
                          icon={<Mail className="w-3.5 h-3.5" />}
                          className="text-xs bg-[#0F766E] hover:bg-[#0D655E]"
                        >
                          Invite to Interview
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 5: APPLICATIONS
            ========================================================================= */}
        {currentTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2 font-display">
                  <FileCheck className="w-4 h-4 text-[#0F766E] dark:text-teal-400" />
                  Candidate Applications Review
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Review applicant profiles, qualifications, and stage transitions.
                </p>
              </div>

              {/* Stage Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs bg-stone-100 dark:bg-stone-900 p-1 rounded-xl border border-stone-200 dark:border-stone-800">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'applied', label: 'Applied' },
                  { id: 'under_review', label: 'Under Review' },
                  { id: 'shortlisted', label: 'Shortlisted' },
                  { id: 'selected', label: 'Selected' },
                  { id: 'rejected', label: 'Rejected' },
                ].map(stage => (
                  <button
                    key={stage.id}
                    onClick={() => setApplicationStageFilter(stage.id as any)}
                    className={`px-3 py-1 rounded-lg capitalize cursor-pointer ${
                      applicationStageFilter === stage.id
                        ? 'bg-white dark:bg-stone-800 text-[#0F766E] dark:text-teal-400 font-bold shadow-xs'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {stage.label}
                  </button>
                ))}
              </div>
            </div>

            {loadingCandidates ? (
              <div className="p-12 text-center text-xs text-stone-500 dark:text-stone-400">
                Loading applications...
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-12 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-dashed border-stone-200 dark:border-stone-800 text-center space-y-4">
                <FileCheck className="w-10 h-10 mx-auto text-stone-400" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-white font-display">No applications yet</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                  {applicationStageFilter !== 'all'
                    ? `No applications currently in the "${applicationStageFilter.replace('_', ' ')}" stage.`
                    : 'No candidate applications have been received yet.'}
                </p>
                {applicationStageFilter !== 'all' && (
                  <Button variant="outline" size="sm" onClick={() => setApplicationStageFilter('all')}>
                    Show All Stages
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredApplications.map(app => (
                  <div
                    key={app.id}
                    className="p-5 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="text-sm font-bold text-stone-900 dark:text-white font-display">{app.name}</h4>
                        <span className="text-[11px] text-stone-500 dark:text-stone-400 font-sans">
                          applied for <span className="font-semibold text-stone-800 dark:text-stone-200">{app.appliedJobTitle}</span>
                        </span>
                        <span className="text-xs text-stone-400 font-mono">• {app.appliedDate}</span>
                      </div>

                      <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-4">
                        <span><Mail className="w-3 h-3 inline mr-1" /> {app.email}</span>
                        <span><Phone className="w-3 h-3 inline mr-1" /> {app.phone}</span>
                        <span><MapPin className="w-3 h-3 inline mr-1" /> {app.location}</span>
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {app.skills.map((s, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-stone-100 dark:border-stone-800">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-[#0F766E] dark:text-teal-400">
                          {app.matchScore}% Match
                        </span>
                      </div>

                      <select
                        value={normalizeStatus(app.status)}
                        onChange={e => updateCandidateStatus(app.id, e.target.value as any)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-[#0F766E]"
                      >
                        <option value="applied">Applied</option>
                        <option value="under_review">Under Review</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="selected">Selected</option>
                        <option value="rejected">Rejected</option>
                      </select>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCandidate(app)}
                        icon={<Eye className="w-3.5 h-3.5" />}
                        className="text-xs"
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 6: CANDIDATE MANAGEMENT (PIPELINE KANBAN)
            ========================================================================= */}
        {currentTab === 'management' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2 font-display">
                <Users className="w-4 h-4 text-[#0F766E] dark:text-teal-400" />
                Candidate Hiring Pipeline
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Move candidates through evaluation stages and record assessment feedback.
              </p>
            </div>

            {candidates.length === 0 && (
              <div className="p-8 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-dashed border-stone-200 dark:border-stone-800 text-center space-y-2">
                <Users className="w-8 h-8 mx-auto text-stone-400" />
                <h3 className="text-xs font-bold text-stone-900 dark:text-white font-display">No candidates yet</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                  Applications submitted by verified job seekers will appear here in the hiring pipeline.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
              {[
                { id: 'applied', title: '1. Applied', prev: null, next: 'under_review' as const },
                { id: 'under_review', title: '2. Under Review', prev: 'applied' as const, next: 'shortlisted' as const },
                { id: 'shortlisted', title: '3. Shortlisted', prev: 'under_review' as const, next: 'selected' as const },
                { id: 'selected', title: '4. Selected', prev: 'shortlisted' as const, next: null },
                { id: 'rejected', title: '5. Rejected', prev: 'under_review' as const, next: null }
              ].map(col => {
                const colCandidates = candidates.filter(c => normalizeStatus(c.status) === col.id);
                return (
                  <div
                    key={col.id}
                    className="p-3.5 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
                      <h3 className="text-xs font-bold text-stone-900 dark:text-white font-display">{col.title}</h3>
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                        {colCandidates.length}
                      </span>
                    </div>

                    <div className="space-y-3 min-h-[260px]">
                      {colCandidates.map(candidate => (
                        <div
                          key={candidate.id}
                          className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 space-y-2 hover:shadow-xs transition-shadow"
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <div>
                              <h4 className="text-xs font-bold text-stone-900 dark:text-white font-display">{candidate.name}</h4>
                              <p className="text-[10px] text-stone-500 dark:text-stone-400 line-clamp-1">{candidate.appliedJobTitle}</p>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-[#0F766E] dark:text-teal-400 shrink-0">
                              {candidate.matchScore}%
                            </span>
                          </div>

                          {candidate.notes && (
                            <p className="text-[10px] text-stone-600 dark:text-stone-300 italic bg-white dark:bg-stone-800/60 p-1.5 rounded-lg border border-stone-200/60 dark:border-stone-700/50 line-clamp-2">
                              "{candidate.notes}"
                            </p>
                          )}

                          {/* Quick Status Select */}
                          <div className="pt-1">
                            <select
                              value={normalizeStatus(candidate.status)}
                              onChange={e => updateCandidateStatus(candidate.id, e.target.value as any)}
                              className="w-full text-[11px] font-semibold py-1 px-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-[#0F766E]"
                            >
                              <option value="applied">Applied</option>
                              <option value="under_review">Under Review</option>
                              <option value="shortlisted">Shortlisted</option>
                              <option value="selected">Selected</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>

                          <div className="flex items-center justify-between pt-1.5 border-t border-stone-200/60 dark:border-stone-800 text-xs">
                            <button
                              onClick={() => setSelectedCandidate(candidate)}
                              className="text-[10px] text-[#0F766E] dark:text-teal-400 font-bold hover:underline cursor-pointer"
                            >
                              Details
                            </button>

                            <div className="flex items-center gap-1">
                              {col.prev && (
                                <button
                                  title={`Move back to ${col.prev.replace('_', ' ')}`}
                                  onClick={() => updateCandidateStatus(candidate.id, col.prev!)}
                                  className="p-1 rounded bg-stone-200/70 dark:bg-stone-800 hover:bg-stone-300 text-stone-700 dark:text-stone-300 cursor-pointer"
                                >
                                  <ChevronLeft className="w-3 h-3" />
                                </button>
                              )}
                              {col.next && (
                                <button
                                  title={`Advance to ${col.next.replace('_', ' ')}`}
                                  onClick={() => updateCandidateStatus(candidate.id, col.next!)}
                                  className="p-1 rounded bg-teal-600 hover:bg-teal-500 text-white cursor-pointer"
                                >
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              )}
                              {col.id === 'shortlisted' && (
                                <button
                                  title="Reject candidate"
                                  onClick={() => updateCandidateStatus(candidate.id, 'rejected')}
                                  className="p-1 rounded bg-red-100 dark:bg-red-950/60 hover:bg-red-200 text-red-600 dark:text-red-400 cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {colCandidates.length === 0 && (
                        <div className="p-4 rounded-xl border border-dashed border-stone-200 dark:border-stone-800 text-center text-[11px] text-stone-400">
                          No candidates
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 7: RECRUITER PROFILE
            ========================================================================= */}
        {currentTab === 'profile' && (
          <div className="max-w-4xl mx-auto p-8 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-stone-900 dark:text-white font-display flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#0F766E] dark:text-teal-400" />
                  Recruiter & Corporate Profile
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Manage your organization's talent branding, verified contact info, and employer credentials.
                </p>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Employer
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-stone-700 dark:text-stone-300">Recruiter Full Name *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-stone-700 dark:text-stone-300">Official Work Email *</label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-stone-700 dark:text-stone-300">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.company}
                    onChange={e => setProfileForm({ ...profileForm, company: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-stone-700 dark:text-stone-300">Recruiter Job Title</label>
                  <input
                    type="text"
                    value={profileForm.title}
                    onChange={e => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-stone-700 dark:text-stone-300">Headquarters / Location</label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-stone-700 dark:text-stone-300">Company Careers Website</label>
                  <input
                    type="text"
                    value={profileForm.website}
                    onChange={e => setProfileForm({ ...profileForm, website: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-stone-700 dark:text-stone-300">Direct Contact Phone</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-stone-700 dark:text-stone-300">About Organization & Hiring Philosophy</label>
                <textarea
                  rows={4}
                  value={profileForm.bio}
                  onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  icon={<Check className="w-3.5 h-3.5" />}
                  className="bg-[#0F766E] hover:bg-[#0D655E]"
                >
                  Save Recruiter Profile
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Candidate Credentials Modal */}
        <AnimatePresence>
          {selectedCandidate && (
            <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 rounded-[20px] shadow-xl w-full max-w-lg p-6 space-y-5 text-stone-900 dark:text-white font-sans text-xs"
              >
                <div className="flex items-start justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold font-display">{selectedCandidate.name}</h3>
                    <p className="text-stone-500 dark:text-stone-400">
                      {selectedCandidate.role}{selectedCandidate.experienceYears ? ` • ${selectedCandidate.experienceYears} yrs exp` : ''}
                    </p>
                  </div>
                  <button onClick={() => setSelectedCandidate(null)} className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800">
                    <div>
                      <span className="text-[11px] text-teal-800 dark:text-teal-300 font-medium">Competency Alignment</span>
                      <p className="font-bold text-sm text-[#0F766E] dark:text-teal-400 font-mono">{selectedCandidate.matchScore || 0}% Match Score</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                      Verified Competencies
                    </span>
                  </div>

                  <div>
                    <span className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">Professional Summary:</span>
                    <p className="text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-900 p-3 rounded-xl border border-stone-200/60 dark:border-stone-800">
                      {selectedCandidate.bio || 'No profile summary provided.'}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">Verified Skills:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCandidate.skills && selectedCandidate.skills.length > 0 ? (
                        selectedCandidate.skills.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-mono text-[10px]">
                            ✓ {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-stone-400 text-xs italic">No skills specified</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
                      <span className="text-[10px] text-stone-400 block">Email</span>
                      <span className="font-medium text-stone-800 dark:text-stone-200">{selectedCandidate.email || 'N/A'}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
                      <span className="text-[10px] text-stone-400 block">Phone</span>
                      <span className="font-medium text-stone-800 dark:text-stone-200">{selectedCandidate.phone || 'N/A'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">Interview Assessment Notes:</label>
                    <textarea
                      rows={2}
                      defaultValue={selectedCandidate.notes}
                      onBlur={e => updateCandidateNote(selectedCandidate.id, e.target.value)}
                      placeholder="Add recruiter / hiring manager notes..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 whitespace-nowrap">Status:</span>
                    <select
                      value={normalizeStatus(selectedCandidate.status)}
                      onChange={e => {
                        const newSt = e.target.value as any;
                        updateCandidateStatus(selectedCandidate.id, newSt);
                        setSelectedCandidate(prev => prev ? { ...prev, status: newSt } : null);
                      }}
                      className="text-xs font-semibold px-2.5 py-1 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-[#0F766E]"
                    >
                      <option value="applied">Applied</option>
                      <option value="under_review">Under Review</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="selected">Selected</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" onClick={() => setSelectedCandidate(null)}>
                      Close
                    </Button>
                    {normalizeStatus(selectedCandidate.status) !== 'shortlisted' && normalizeStatus(selectedCandidate.status) !== 'selected' && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-[#0F766E] hover:bg-[#0D655E]"
                        onClick={() => {
                          updateCandidateStatus(selectedCandidate.id, 'shortlisted');
                          setSelectedCandidate(null);
                          setTab('management');
                        }}
                      >
                        Shortlist Candidate
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};
