import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, LogIn, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { adminUser, isAdminLoggedIn, user, isLoggedIn, logout } = useApp();
  const location = useLocation();

  // 1. Check if admin session exists
  if (!isAdminLoggedIn || !adminUser || adminUser.role !== 'admin') {
    // If user is logged in as standard user (jobseeker/recruiter), show explicit 403 Forbidden screen
    if (isLoggedIn && user?.role !== 'admin') {
      return (
        <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-stone-900/90 border border-rose-800/60 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-700/50 flex items-center justify-center mx-auto mb-6 text-rose-400 shadow-inner">
              <ShieldAlert className="w-9 h-9" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
              403 Access Forbidden
            </div>

            <h1 className="text-2xl font-bold font-display text-white mb-2">
              Administrator Privileges Required
            </h1>

            <p className="text-stone-400 text-xs leading-relaxed mb-6 font-sans">
              You are currently authenticated as standard user <span className="font-semibold text-stone-200">{user.email || user.name}</span> with role <span className="font-mono text-amber-400 font-bold uppercase">{user.role || 'jobseeker'}</span>.
              <br /><br />
              Normal users are strictly restricted from accessing the WorkNext Admin Console. Only authorized administrators with verified credentials can review and approve mentor registrations.
            </p>

            <div className="space-y-3 pt-2">
              <Link to="/admin/login">
                <Button variant="primary" fullWidth icon={<LogIn className="w-4 h-4" />} className="bg-rose-600 hover:bg-rose-700 text-white font-semibold">
                  Sign In with Administrator Account
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" fullWidth icon={<ArrowLeft className="w-4 h-4" />} className="border-stone-800 text-stone-300 hover:bg-stone-850">
                  Return to User Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Otherwise, redirect to the separate Admin Login page
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
