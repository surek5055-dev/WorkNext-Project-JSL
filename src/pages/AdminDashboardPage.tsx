import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Mentor,
  RecruiterAccount,
  ServerUser,
  PlatformReport,
  Job
} from '../types';
import { WNMonogramIcon } from '../components/common/WNMonogramIcon';
import {
  ShieldCheck,
  LogOut,
  RefreshCw,
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  FileCheck,
  Award,
  AlertTriangle,
  DollarSign,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';

import { AdminOverviewTab } from '../components/admin/AdminOverviewTab';
import { AdminRecruitersTab } from '../components/admin/AdminRecruitersTab';
import { AdminUsersTab } from '../components/admin/AdminUsersTab';
import { AdminJobsTab } from '../components/admin/AdminJobsTab';
import { AdminApplicationsTab } from '../components/admin/AdminApplicationsTab';
import { AdminMentorsTab } from '../components/admin/AdminMentorsTab';
import { AdminReportsTab } from '../components/admin/AdminReportsTab';
import { AdminRevenueTab } from '../components/admin/AdminRevenueTab';

type AdminSection =
  | 'overview'
  | 'recruiters'
  | 'users'
  | 'jobs'
  | 'applications'
  | 'mentors'
  | 'reports'
  | 'revenue';

export const AdminDashboardPage: React.FC = () => {
  const { adminUser, adminLogout } = useApp();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Data Stores
  const [overviewStats, setOverviewStats] = useState<any>(null);
  const [recruiters, setRecruiters] = useState<RecruiterAccount[]>([]);
  const [users, setUsers] = useState<ServerUser[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [reports, setReports] = useState<PlatformReport[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mentorCounts, setMentorCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const getAdminHeaders = () => {
    const token = localStorage.getItem('worknext_admin_token') || adminUser?.token;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'x-admin-token': token || 'admin_master_token',
      'x-user-role': 'admin'
    };
  };

  // Fetch Overview Stats
  const fetchOverview = async () => {
    try {
      const res = await fetch('/api/admin/overview', { headers: getAdminHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setOverviewStats(data.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch admin overview:', err);
    }
  };

  // Fetch Recruiters
  const fetchRecruiters = async () => {
    try {
      const res = await fetch('/api/admin/recruiters', { headers: getAdminHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.recruiters)) {
          setRecruiters(data.recruiters);
        }
      }
    } catch (err) {
      console.error('Failed to fetch admin recruiters:', err);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', { headers: getAdminHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) {
          setUsers(data.users);
        }
      }
    } catch (err) {
      console.error('Failed to fetch admin users:', err);
    }
  };

  // Fetch Jobs
  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/admin/jobs', { headers: getAdminHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        }
      }
    } catch (err) {
      console.error('Failed to fetch admin jobs:', err);
    }
  };

  // Fetch Applications
  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/admin/applications', { headers: getAdminHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.applications)) {
          setApplications(data.applications);
        }
      }
    } catch (err) {
      console.error('Failed to fetch admin applications:', err);
    }
  };

  // Fetch Reports
  const fetchReports = async () => {
    try {
      const res = await fetch('/api/admin/reports', { headers: getAdminHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.reports)) {
          setReports(data.reports);
        }
      }
    } catch (err) {
      console.error('Failed to fetch admin reports:', err);
    }
  };

  // Fetch Mentors
  const fetchMentors = async () => {
    try {
      const res = await fetch('/api/admin/mentors', { headers: getAdminHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMentors(data.data || []);
          if (data.counts) {
            setMentorCounts(data.counts);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch admin mentors:', err);
    }
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchOverview(),
      fetchRecruiters(),
      fetchUsers(),
      fetchJobs(),
      fetchApplications(),
      fetchReports(),
      fetchMentors()
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Update Recruiter Verification Status
  const handleUpdateRecruiterStatus = async (
    recruiterId: string,
    status: 'approved' | 'rejected' | 'pending' | 'suspended',
    companyName: string
  ) => {
    setActionLoadingId(recruiterId);
    try {
      const res = await fetch(`/api/admin/recruiters/${recruiterId}/status`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update recruiter status');
      }

      setRecruiters(prev =>
        prev.map(r => (r.id === recruiterId ? { ...r, status } : r))
      );
      showNotification(
        'success',
        `Recruiter "${companyName}" status set to ${status}.`
      );
      fetchOverview();
    } catch (err: any) {
      showNotification('error', err.message || 'Error updating recruiter status');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Toggle User Status
  const handleToggleUserStatus = async (
    userId: string,
    currentStatus: 'active' | 'suspended',
    name: string
  ) => {
    setActionLoadingId(userId);
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update user status');
      }

      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, status: newStatus } : u))
      );
      showNotification(
        'success',
        `User "${name}" is now ${newStatus}.`
      );
    } catch (err: any) {
      showNotification('error', err.message || 'Error updating user status');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Toggle Job Status
  const handleToggleJobStatus = async (jobId: string, currentStatus: string, title: string) => {
    setActionLoadingId(jobId);
    const nextStatus = currentStatus === 'closed' ? 'active' : 'closed';
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update job status');
      }

      setJobs(prev =>
        prev.map(j => (j.id === jobId ? { ...j, status: nextStatus as any } : j))
      );
      showNotification('success', `Opening "${title}" marked as ${nextStatus}.`);
      fetchOverview();
    } catch (err: any) {
      showNotification('error', err.message || 'Error updating job status');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Job
  const handleDeleteJob = async (jobId: string, title: string) => {
    setActionLoadingId(jobId);
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete job opening');
      }

      setJobs(prev => prev.filter(j => j.id !== jobId));
      showNotification('info', `Opening "${title}" was permanently removed.`);
      fetchOverview();
    } catch (err: any) {
      showNotification('error', err.message || 'Error removing job opening');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Update Application Status
  const handleUpdateApplicationStatus = async (applicationId: string, newStatus: string) => {
    setActionLoadingId(applicationId);
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update application');
      }

      setApplications(prev =>
        prev.map(a => (a.id === applicationId ? { ...a, status: newStatus } : a))
      );
      showNotification('success', `Application status updated to "${newStatus.replace('_', ' ')}".`);
    } catch (err: any) {
      showNotification('error', err.message || 'Error updating application status');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Update Mentor Status
  const handleUpdateMentorStatus = async (
    id: string,
    newStatus: 'approved' | 'rejected' | 'pending',
    mentorName: string
  ) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/mentors/${id}/status`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || `Failed to update status to ${newStatus}`);
      }

      setMentors(prev =>
        prev.map(m => (m.id === id ? { ...m, status: newStatus } : m))
      );
      setMentorCounts(prev => {
        const updated = mentors.map(m => (m.id === id ? { ...m, status: newStatus } : m));
        return {
          total: updated.length,
          pending: updated.filter(m => m.status === 'pending').length,
          approved: updated.filter(m => m.status === 'approved').length,
          rejected: updated.filter(m => m.status === 'rejected').length
        };
      });

      if (newStatus === 'approved') {
        showNotification('success', `Approved "${mentorName}"! Live in public directory.`);
      } else if (newStatus === 'rejected') {
        showNotification('info', `Marked "${mentorName}" as rejected.`);
      } else {
        showNotification('info', `Reset "${mentorName}" to pending review.`);
      }
      fetchOverview();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update application status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Update Report Status
  const handleUpdateReportStatus = async (
    reportId: string,
    newStatus: 'pending' | 'investigating' | 'resolved' | 'dismissed'
  ) => {
    setActionLoadingId(reportId);
    try {
      const res = await fetch(`/api/admin/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update report');
      }

      setReports(prev =>
        prev.map(r => (r.id === reportId ? { ...r, status: newStatus } : r))
      );
      showNotification('success', `Report marked as ${newStatus}.`);
      fetchOverview();
    } catch (err: any) {
      showNotification('error', err.message || 'Error updating report');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const pendingRecruitersCount = recruiters.filter(r => (r.status || 'pending') === 'pending').length;
  const pendingMentorsCount = mentorCounts.pending;
  const pendingReportsCount = reports.filter(r => (r.status || 'pending') === 'pending').length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 px-4 sm:px-8 py-3.5 border-b border-stone-800 bg-stone-900/90 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <WNMonogramIcon className="w-8 h-8" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold font-display tracking-tight text-white">
                  WorkNext
                </span>
                <span className="px-2 py-0.5 rounded-full bg-teal-950 border border-teal-800 text-[10px] font-mono font-bold text-teal-400 uppercase tracking-wider">
                  Admin Console
                </span>
              </div>
              <span className="text-[10px] text-stone-400 block font-mono">
                Role-Based Access Control • Platform Governance
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/community"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-850 hover:bg-stone-800 border border-stone-700/80 text-xs text-stone-300 hover:text-white transition-all font-sans"
            title="Inspect public directory"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </Link>

          <button
            onClick={fetchAllData}
            disabled={isLoading}
            className="p-2 rounded-xl bg-stone-850 hover:bg-stone-800 border border-stone-700/80 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh database records"
            aria-label="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-teal-400' : ''}`} />
          </button>

          {/* Admin User Chip */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800">
            <div className="w-6 h-6 rounded-full bg-teal-800/80 text-teal-200 flex items-center justify-center text-xs font-bold font-mono">
              A
            </div>
            <div className="text-left">
              <span className="text-xs font-semibold text-stone-200 block leading-none">
                {adminUser?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-stone-500 font-mono">
                {adminUser?.email || 'admin@worknext.io'}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 border border-rose-800/60 text-xs font-medium text-rose-300 transition-colors cursor-pointer"
            title="Sign out of administrative session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Toast Notification */}
        {notification && (
          <div
            className={`p-4 rounded-2xl text-xs font-medium flex items-center justify-between border shadow-lg transition-all animate-in fade-in slide-in-from-top-2 ${
              notification.type === 'success'
                ? 'bg-teal-950/80 border-teal-700/80 text-teal-200'
                : notification.type === 'error'
                ? 'bg-rose-950/80 border-rose-700/80 text-rose-200'
                : 'bg-stone-900 border-stone-700 text-stone-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />}
              {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              {notification.type === 'info' && <Clock className="w-4 h-4 text-amber-400 shrink-0" />}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-stone-400 hover:text-white ml-3 font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Dashboard Title & Navigation Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
              <ShieldCheck className="w-7 h-7 text-teal-400" />
              Platform Administration &amp; Governance
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 font-sans">
              Comprehensive management of verified employers, registered users, jobs, candidate applications, and mentor governance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-950/70 border border-teal-800 text-xs font-mono text-teal-300">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              RBAC Verified
            </span>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-stone-900 border border-stone-800 overflow-x-auto">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSection === 'overview'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveSection('recruiters')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSection === 'recruiters'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Recruiters</span>
            {pendingRecruitersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-stone-950 text-[10px] font-bold font-mono">
                {pendingRecruitersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSection('users')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSection === 'users'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users</span>
          </button>

          <button
            onClick={() => setActiveSection('jobs')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSection === 'jobs'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Jobs</span>
          </button>

          <button
            onClick={() => setActiveSection('applications')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSection === 'applications'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Applications</span>
          </button>

          <button
            onClick={() => setActiveSection('mentors')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSection === 'mentors'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Mentors</span>
            {pendingMentorsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-stone-950 text-[10px] font-bold font-mono">
                {pendingMentorsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSection('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSection === 'reports'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Reports</span>
            {pendingReportsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold font-mono">
                {pendingReportsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSection('revenue')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSection === 'revenue'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Revenue Model</span>
          </button>
        </div>

        {/* Section Content */}
        {activeSection === 'overview' && (
          <AdminOverviewTab
            stats={overviewStats}
            isLoading={isLoading}
            onNavigateTab={tab => setActiveSection(tab as AdminSection)}
          />
        )}

        {activeSection === 'recruiters' && (
          <AdminRecruitersTab
            recruiters={recruiters}
            isLoading={isLoading}
            onUpdateStatus={handleUpdateRecruiterStatus}
            actionLoadingId={actionLoadingId}
          />
        )}

        {activeSection === 'users' && (
          <AdminUsersTab
            users={users}
            isLoading={isLoading}
            onToggleStatus={handleToggleUserStatus}
            actionLoadingId={actionLoadingId}
          />
        )}

        {activeSection === 'jobs' && (
          <AdminJobsTab
            jobs={jobs}
            isLoading={isLoading}
            onToggleStatus={handleToggleJobStatus}
            onDeleteJob={handleDeleteJob}
            actionLoadingId={actionLoadingId}
          />
        )}

        {activeSection === 'applications' && (
          <AdminApplicationsTab
            applications={applications}
            isLoading={isLoading}
            onUpdateStatus={handleUpdateApplicationStatus}
            actionLoadingId={actionLoadingId}
          />
        )}

        {activeSection === 'mentors' && (
          <AdminMentorsTab
            mentors={mentors}
            isLoading={isLoading}
            onUpdateStatus={handleUpdateMentorStatus}
            actionLoadingId={actionLoadingId}
            counts={mentorCounts}
          />
        )}

        {activeSection === 'reports' && (
          <AdminReportsTab
            reports={reports}
            isLoading={isLoading}
            onUpdateStatus={handleUpdateReportStatus}
            actionLoadingId={actionLoadingId}
          />
        )}

        {activeSection === 'revenue' && (
          <AdminRevenueTab
            stats={{
              usersCount: users.length,
              recruitersCount: recruiters.length,
              jobsCount: jobs.length,
              mentorsCount: mentorCounts.approved
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-stone-900 text-center text-xs text-stone-600 font-mono">
        WorkNext Administrator Console • Role-Based Access Control • Supabase Realtime Storage
      </footer>
    </div>
  );
};
