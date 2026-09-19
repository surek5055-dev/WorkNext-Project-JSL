import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  User,
  Settings,
  LogOut,
  Briefcase,
  FileText,
  Bookmark,
  Bell,
  ChevronDown,
  CheckCircle2,
  Building2,
  ShieldCheck,
  PlusCircle,
  Sparkles,
  FileCheck,
  Users
} from 'lucide-react';

export const ProfileDropdown: React.FC = () => {
  const { user, logout, adminUser, isAdminLoggedIn } = useApp();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isRecruiter = user?.role === 'recruiter' || (user?.role as string) === 'employer';
  const isAdmin = isAdminLoggedIn || user?.role === 'admin' || adminUser?.role === 'admin';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
        aria-label="User profile menu"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name || 'User'}
            className="w-9 h-9 rounded-full object-cover border border-teal-500/40"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-[#0F766E] text-white font-bold text-xs flex items-center justify-center border border-teal-500/30">
            {user.name ? user.name.charAt(0).toUpperCase() : (isRecruiter ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />)}
          </div>
        )}
        <div className="hidden sm:block text-left">
          <p className="text-xs font-semibold text-stone-900 dark:text-white leading-tight">
            {user.name || (isRecruiter ? 'Hiring Partner' : 'User')}
          </p>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 capitalize">
            {isRecruiter ? (user.company || 'Verified Employer') : (user.role || 'Job Seeker')}
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1A1D20] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40">
            <p className="font-semibold text-sm text-stone-900 dark:text-white">{user.name || 'User'}</p>
            <p className="text-xs text-stone-500 truncate">{user.email || 'No email registered'}</p>
            
            {/* Recruiter vs Job Seeker status */}
            {isRecruiter ? (
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-stone-500">Employer Status:</span>
                <span className="font-bold text-[#0F766E] dark:text-teal-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            ) : (
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-stone-500">Readiness Score:</span>
                {user.hasAnalyzedResume && user.readinessScore && user.readinessScore > 0 ? (
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {user.readinessScore}%
                  </span>
                ) : (
                  <span className="text-stone-400 text-xs font-medium">Pending data</span>
                )}
              </div>
            )}
          </div>

          <div className="p-2 space-y-1 text-xs">
            {isRecruiter ? (
              /* Strictly Recruiter Menu */
              <>
                <Link
                  to="/recruiter?tab=dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors font-medium"
                >
                  <Building2 className="w-4 h-4 text-[#0F766E] dark:text-teal-400" />
                  <span>Recruiter Dashboard</span>
                </Link>

                <Link
                  to="/recruiter?tab=post"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <PlusCircle className="w-4 h-4 text-stone-400" />
                  <span>Post Jobs</span>
                </Link>

                <Link
                  to="/recruiter?tab=openings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <Briefcase className="w-4 h-4 text-stone-400" />
                  <span>Active Openings</span>
                </Link>

                <Link
                  to="/recruiter?tab=candidates"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Matched Candidates</span>
                </Link>

                <Link
                  to="/recruiter?tab=applications"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <FileCheck className="w-4 h-4 text-stone-400" />
                  <span>Applications</span>
                </Link>

                <Link
                  to="/recruiter?tab=management"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <Users className="w-4 h-4 text-stone-400" />
                  <span>Candidate Management</span>
                </Link>

                <Link
                  to="/recruiter?tab=profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <User className="w-4 h-4 text-stone-400" />
                  <span>Recruiter Profile</span>
                </Link>
              </>
            ) : (
              /* Standard Job Seeker Menu */
              <>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>User Profile</span>
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span>Career Dashboard</span>
                </Link>

                <Link
                  to="/resume"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>AI Resume Builder</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors font-medium"
                  >
                    <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="p-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
