import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useApp } from '../context/AppContext';
import { Job } from '../types';
import { Plus, CheckCircle2, Sparkles, X, Users, Briefcase } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const RecruiterDashboardPage: React.FC = () => {
  const { jobs, addJob } = useApp();
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [postedSuccessAlert, setPostedSuccessAlert] = useState(false);

  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    isRemote: true,
    type: 'Full-time' as const,
    category: 'Software Engineering',
    salaryMin: 600000,
    salaryMax: 1200000,
    description: '',
    requirements: ''
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title.trim() || !newJob.company.trim()) return;

    const created: Job = {
      id: 'job_' + Date.now(),
      title: newJob.title.trim(),
      company: newJob.company.trim(),
      companyLogo: '',
      location: newJob.location.trim() || 'Remote, India',
      isRemote: newJob.isRemote,
      type: newJob.type,
      category: newJob.category,
      salaryMin: Number(newJob.salaryMin) || 0,
      salaryMax: Number(newJob.salaryMax) || 0,
      salaryPeriod: 'year',
      postedDate: 'Just now',
      description: newJob.description.trim() || 'Join our team for this verified role.',
      requirements: newJob.requirements.split(',').map(r => r.trim()).filter(Boolean),
      matchScore: 0,
      skillGaps: [],
      applicantsCount: 0,
      experienceLevel: 'Mid-Level'
    };

    addJob(created);
    setPostModalOpen(false);
    setPostedSuccessAlert(true);
    setNewJob({
      title: '',
      company: '',
      location: '',
      isRemote: true,
      type: 'Full-time',
      category: 'Software Engineering',
      salaryMin: 600000,
      salaryMax: 1200000,
      description: '',
      requirements: ''
    });
    setTimeout(() => setPostedSuccessAlert(false), 4000);
  };

  const candidates: Array<{
    name: string;
    role: string;
    match: number;
    skills: string[];
    status: string;
    avatar: string;
  }> = [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/50 text-xs font-semibold text-[#0F766E] dark:text-teal-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] dark:bg-teal-400" />
              Employer Talent Portal
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-white mt-2 font-display">
              Recruiter Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 font-sans">
              Source pre-vetted candidates matched by verified skill competency rather than arbitrary filters.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setPostModalOpen(true)}
            className="bg-[#0F766E] hover:bg-[#0D655E]"
          >
            Post Opening
          </Button>
        </div>

        <AnimatePresence>
          {postedSuccessAlert && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-[#0F766E] dark:text-teal-300 text-xs font-sans font-medium flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F766E] dark:text-teal-400 shrink-0" />
                <span>Job opening posted live! WorkNext AI match engine is routing candidates.</span>
              </div>
              <span className="font-bold cursor-pointer hover:opacity-80" onClick={() => setPostedSuccessAlert(false)}>✕</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recruiter Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-2">
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider font-sans">Active Postings</p>
            <p className="text-3xl font-extrabold text-stone-900 dark:text-white font-display">{jobs.length}</p>
            <p className="text-[11px] font-sans text-[#0F766E] dark:text-teal-400 font-bold">Open Positions</p>
          </div>

          <div className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-2">
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider font-sans">Matched Applicants</p>
            <p className="text-3xl font-extrabold text-[#0F766E] dark:text-teal-400 font-display">0</p>
            <p className="text-[11px] font-sans text-stone-500 dark:text-stone-400">Applications Pending</p>
          </div>

          <div className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-2">
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider font-sans">Vetting Status</p>
            <p className="text-3xl font-extrabold text-stone-900 dark:text-white font-display">Active</p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sans font-normal">Skill-based verification</p>
          </div>
        </div>

        {/* Active Openings Section */}
        <div className="p-8 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2.5 font-display">
              <Briefcase className="w-5 h-5 text-[#0F766E] dark:text-teal-400" /> Active Job Openings ({jobs.length})
            </h2>
            <Button
              variant="outline"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setPostModalOpen(true)}
            >
              Add Job
            </Button>
          </div>

          {jobs.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800 text-center space-y-3 bg-stone-50/50 dark:bg-stone-900/40">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 flex items-center justify-center mx-auto">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-white font-display">No Job Postings Yet</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto font-sans">
                Post your organization's open roles with verified wage transparency. Your openings will instantly become discoverable to job seekers.
              </p>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setPostModalOpen(true)}
                className="bg-[#0F766E] hover:bg-[#0D655E]"
              >
                Post Your First Opening
              </Button>
            </div>
          ) : (
            <div className="space-y-3 font-sans">
              {jobs.map(job => (
                <div key={job.id} className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white font-display">{job.title}</h4>
                    <p className="text-xs text-stone-500 font-sans">{job.company} • {job.location} • {job.type}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {job.requirements.map((r, idx) => (
                        <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-xs font-mono font-bold text-[#0F766E] dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-lg">
                      ₹{job.salaryMin.toLocaleString()} - ₹{job.salaryMax.toLocaleString()}/yr
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Candidate Applications Pipeline */}
        <div className="p-8 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2.5 font-display">
              <Users className="w-5 h-5 text-[#0F766E] dark:text-teal-400" /> Candidate Applications Pool
            </h2>
            <span className="text-xs font-sans text-stone-500 dark:text-stone-400">Skill-Vetted Applicants</span>
          </div>

          <div className="p-8 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800 text-center space-y-3 bg-stone-50/50 dark:bg-stone-900/40">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-white font-display">No Applications Received Yet</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto font-sans">
              As job seekers apply to your active postings, their verified profiles, skill competency radars, and ATS-matched credentials will be organized here.
            </p>
          </div>
        </div>

        {/* Job Post Modal */}
        <AnimatePresence>
          {postModalOpen && (
            <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 rounded-[20px] shadow-lg w-full max-w-lg p-8 space-y-5 text-stone-900 dark:text-white"
              >
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4 font-display">
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">Post New Job Opening</h3>
                  <button onClick={() => setPostModalOpen(false)} className="p-1 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreatePost} className="space-y-4 text-xs font-sans">
                  <div className="space-y-1">
                    <label className="block font-semibold text-stone-700 dark:text-stone-300">Job Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Frontend Engineer"
                      value={newJob.title}
                      onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block font-semibold text-stone-700 dark:text-stone-300">Location</label>
                      <input
                        type="text"
                        value={newJob.location}
                        onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-semibold text-stone-700 dark:text-stone-300">Type</label>
                      <select
                        value={newJob.type}
                        onChange={e => setNewJob({ ...newJob, type: e.target.value as any })}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-stone-700 dark:text-stone-300">Required Skills (CSV)</label>
                    <input
                      type="text"
                      value={newJob.requirements}
                      onChange={e => setNewJob({ ...newJob, requirements: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-stone-700 dark:text-stone-300">Job Description</label>
                    <textarea
                      rows={3}
                      value={newJob.description}
                      onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                      placeholder="Describe role responsibilities..."
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>

                  <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-3 font-sans">
                    <Button variant="outline" size="sm" type="button" onClick={() => setPostModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" type="submit" className="bg-[#0F766E] hover:bg-[#0D655E]">
                      Publish Position
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};
