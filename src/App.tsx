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

// Recruiter Pages
import { RecruiterDashboardPage } from './pages/RecruiterDashboardPage';

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

          {/* User Routes */}
          <Route path="/dashboard" element={<UserDashboardPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/resume" element={<ResumeBuilderPage />} />
          <Route path="/jobs" element={<LocalJobFinderPage />} />
          <Route path="/insights" element={<EmploymentDashboardPage />} />
          <Route path="/community" element={<CommunityMentorshipPage />} />

          {/* Recruiter Route */}
          <Route path="/recruiter" element={<RecruiterDashboardPage />} />

          {/* System Routes */}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
