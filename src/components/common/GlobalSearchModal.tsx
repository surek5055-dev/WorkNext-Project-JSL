import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Search, X, Briefcase, FileText, Users, BarChart3, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { globalSearchOpen, setGlobalSearchOpen, jobs } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  if (!globalSearchOpen) return null;

  const filteredJobs = query.trim()
    ? jobs.filter(
        j =>
          j.title.toLowerCase().includes(query.toLowerCase()) ||
          j.company.toLowerCase().includes(query.toLowerCase()) ||
          j.requirements.some(r => r.toLowerCase().includes(query.toLowerCase()))
      )
    : jobs.slice(0, 3);

  const quickNavs = [
    { label: 'Local Job Finder', path: '/jobs', icon: <Briefcase className="w-4 h-4 text-blue-500" /> },
    { label: 'AI Resume Builder', path: '/resume', icon: <FileText className="w-4 h-4 text-indigo-500" /> },
    { label: 'Market Insights Dashboard', path: '/insights', icon: <BarChart3 className="w-4 h-4 text-emerald-500" /> },
    { label: 'Mentors & Community', path: '/community', icon: <Users className="w-4 h-4 text-amber-500" /> },
  ];

  const handleSelectJob = (jobId: string) => {
    setGlobalSearchOpen(false);
    navigate(`/jobs`);
  };

  const handleNavigate = (path: string) => {
    setGlobalSearchOpen(false);
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search roles, skills (React, AI, Python), mentors, or insights..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none"
          />
          <button
            onClick={() => setGlobalSearchOpen(false)}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Navigation Links */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Quick Navigation
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {quickNavs.map((nav, i) => (
              <button
                key={i}
                onClick={() => handleNavigate(nav.path)}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors text-left"
              >
                {nav.icon}
                <span className="truncate">{nav.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        <div className="p-4 max-h-80 overflow-y-auto space-y-2">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {query.trim() ? `Matching Results (${filteredJobs.length})` : 'Recommended Opportunities'}
          </p>

          {filteredJobs.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No matching jobs found for "{query}".</p>
          ) : (
            filteredJobs.map(job => (
              <div
                key={job.id}
                onClick={() => handleSelectJob(job.id)}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img src={job.companyLogo} alt={job.company} className="w-9 h-9 rounded-lg object-cover" />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">{job.title}</h4>
                    <p className="text-[11px] text-slate-500">{job.company} • {job.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    {job.matchScore}% Match
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400 bg-slate-50/50 dark:bg-slate-900">
          Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono text-[10px]">ESC</kbd> to close
        </div>
      </div>
    </div>
  );
};
