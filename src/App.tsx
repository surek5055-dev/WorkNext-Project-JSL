import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';

// User Pages
import { UserDashboardPage } from './pages/UserDashboardPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { LocalJobFinderPage } from './pages/LocalJobFinderPage';
import { EmploymentDashboardPage } from './pages/EmploymentDashboardPage';
import { CommunityMentorshipPage } from './pages/CommunityMentorshipPage';
import { JobSeekerRoute } from './components/auth/JobSeekerRoute';

// Recruiter Pages & RBAC Guard
import { RecruiterDashboardPage } from './pages/RecruiterDashboardPage';
import { RecruiterProtectedRoute } from './components/auth/RecruiterProtectedRoute';

// Admin Pages & RBAC Guard
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminProtectedRoute } from './components/auth/AdminProtectedRoute';

// System Pages
import { SettingsPage } from './pages/SettingsPage';
import { NotificationsPage } from './pages/NotificationsPage';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* User Routes (Restricted for Recruiters) */}
          <Route path="/dashboard" element={<JobSeekerRoute><UserDashboardPage /></JobSeekerRoute>} />
          <Route path="/profile" element={<JobSeekerRoute><UserProfilePage /></JobSeekerRoute>} />
          <Route path="/resume" element={<JobSeekerRoute><ResumeBuilderPage /></JobSeekerRoute>} />
          <Route path="/jobs" element={<JobSeekerRoute><LocalJobFinderPage /></JobSeekerRoute>} />
          <Route path="/insights" element={<JobSeekerRoute><EmploymentDashboardPage /></JobSeekerRoute>} />
          <Route path="/community" element={<JobSeekerRoute><CommunityMentorshipPage /></JobSeekerRoute>} />

          {/* Recruiter Route with RBAC Protection */}
          <Route
            path="/recruiter"
            element={
              <RecruiterProtectedRoute>
                <RecruiterDashboardPage />
              </RecruiterProtectedRoute>
            }
          />

          {/* Admin Routes with RBAC Protection */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage />
              </AdminProtectedRoute>
            }
          />

          {/* System Routes */}
          <Route path="/settings" element={<JobSeekerRoute><SettingsPage /></JobSeekerRoute>} />
          <Route path="/notifications" element={<JobSeekerRoute><NotificationsPage /></JobSeekerRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
