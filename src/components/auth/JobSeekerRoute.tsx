import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

interface JobSeekerRouteProps {
  children: React.ReactNode;
}

/**
 * Route protection to ensure that recruiter / employer accounts
 * cannot view job-seeker pages (Overview Dashboard, Resume Builder, etc.).
 * Recruiters are redirected to the Recruiter Hub.
 */
export const JobSeekerRoute: React.FC<JobSeekerRouteProps> = ({ children }) => {
  const { user, isLoggedIn } = useApp();
  const location = useLocation();

  const isRecruiter = isLoggedIn && (user?.role === 'recruiter' || (user?.role as string) === 'employer');

  if (isRecruiter) {
    if (location.pathname === '/profile' || location.pathname === '/settings') {
      return <Navigate to="/recruiter?tab=profile" replace />;
    }
    return <Navigate to="/recruiter" replace />;
  }

  return <>{children}</>;
};
