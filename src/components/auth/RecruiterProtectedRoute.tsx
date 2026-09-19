import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Building2, ArrowLeft, LogIn } from 'lucide-react';
import { Button } from '../ui/Button';

interface RecruiterProtectedRouteProps {
  children: React.ReactNode;
}

export const RecruiterProtectedRoute: React.FC<RecruiterProtectedRouteProps> = ({ children }) => {
  const { user, isLoggedIn } = useApp();
  const location = useLocation();

  // 1. If not logged in, redirect to login page with return state
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check if user has recruiter or employer role
  const isRecruiter = user?.role === 'recruiter' || (user?.role as string) === 'employer';

  // 3. If logged in as normal user / job seeker, block access with 403 Forbidden screen
  if (!isRecruiter) {
    return (
      <div className="min-h-screen bg-[#F7F6F3] dark:bg-[#0E1310] text-stone-900 dark:text-stone-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white dark:bg-stone-900 border border-amber-200 dark:border-amber-900/60 rounded-3xl p-8 text-center shadow-xl backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center mx-auto mb-6 text-amber-600 dark:text-amber-400 shadow-xs">
            <Building2 className="w-9 h-9" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 dark:bg-amber-950/60 border border-amber-300/80 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            403 Recruiter Access Required
          </div>

          <h1 className="text-2xl font-bold font-display text-stone-900 dark:text-white mb-2">
            Employer Privileges Required
          </h1>

          <p className="text-stone-600 dark:text-stone-400 text-xs leading-relaxed mb-6 font-sans">
            You are currently logged in as <span className="font-semibold text-stone-900 dark:text-stone-200">{user.email || user.name || 'Job Seeker'}</span> with account role <span className="font-mono text-teal-700 dark:text-teal-400 font-bold uppercase">{user.role || 'jobseeker'}</span>.
            <br /><br />
            Normal users and job seekers do not have access to the Recruiter Hub or candidate talent pipelines. This dashboard is strictly reserved for verified employer and recruiter accounts.
          </p>

          <div className="space-y-3 pt-2">
            <Link to="/dashboard">
              <Button variant="primary" fullWidth icon={<ArrowLeft className="w-4 h-4" />} className="bg-[#0F766E] hover:bg-teal-700 text-white font-semibold">
                Return to Career Dashboard
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" fullWidth icon={<LogIn className="w-4 h-4" />} className="border-stone-300 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800">
                Register a Recruiter Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authenticated recruiter
  return <>{children}</>;
};
