import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Mentor } from '../types';
import { Button } from '../components/ui/Button';
import { WNMonogramIcon } from '../components/common/WNMonogramIcon';
import {
  ShieldCheck,
  LogOut,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Briefcase,
  Mail,
  DollarSign,
  Calendar,
  AlertCircle,
  UserCheck,
  Check,
  X,
  RotateCcw
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { adminUser, adminLogout } = useApp();
  const navigate = useNavigate();

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Fetch mentor applications from admin endpoint
  const fetchMentors = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('worknext_admin_token') || adminUser?.token;
      const res = await fetch('/api/admin/mentors', {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'x-admin-token': token || 'admin_master_token',
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMentors(data.data || []);
        if (data.counts) {
          setCounts(data.counts);
        }
      } else {
        throw new Error(data.error || 'Failed to fetch mentor registrations');
      }
    } catch (err: any) {
      console.error('Error fetching admin mentors:', err);
      showNotification('error', err.message || 'Error loading mentor applications.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected' | 'pending', mentorName: string) => {
    setActionLoadingId(id);
    try {
      const token = localStorage.getItem('worknext_admin_token') || adminUser?.token;
      const res = await fetch(`/api/admin/mentors/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'x-admin-token': token || 'admin_master_token',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || `Failed to update status to ${newStatus}`);
      }

      // Update in local state
      setMentors(prev =>
        prev.map(m => (m.id === id ? { ...m, status: newStatus } : m))
      );

      // Recompute counts
      setCounts(prev => {
        const updatedList = mentors.map(m => (m.id === id ? { ...m, status: newStatus } : m));
        return {
          total: updatedList.length,
          pending: updatedList.filter(m => m.status === 'pending').length,
          approved: updatedList.filter(m => m.status === 'approved').length,
          rejected: updatedList.filter(m => m.status === 'rejected').length,
        };
      });

      if (newStatus === 'approved') {
        showNotification('success', `Approved "${mentorName}"! This mentor is now live in the public directory.`);
      } else if (newStatus === 'rejected') {
        showNotification('info', `Marked "${mentorName}" as rejected. The applicant will see this status in their portal.`);
      } else {
        showNotification('info', `Reset "${mentorName}" to pending review.`);
      }
    } catch (err: any) {
      console.error('Failed to update mentor status:', err);
      showNotification('error', err.message || 'Failed to update application status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  // Filter mentors
  const filteredMentors = mentors.filter(mentor => {
    // Status filter
    if (activeTab !== 'all') {
      const currentStatus = mentor.status || 'pending';
      if (currentStatus !== activeTab) return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = mentor.name.toLowerCase().includes(q);
      const matchRole = mentor.role.toLowerCase().includes(q);
      const matchCompany = mentor.company?.toLowerCase().includes(q) || false;
      const matchEmail = mentor.userEmail?.toLowerCase().includes(q) || false;
      const matchSpecialty = mentor.specialties.some(s => s.toLowerCase().includes(q));
      return matchName || matchRole || matchCompany || matchEmail || matchSpecialty;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 px-4 sm:px-8 py-3.5 border-b border-stone-800 bg-stone-900/90 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <WNMonogramIcon className="w-8 h-8" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold font-display tracking-tight text-white">WorkNext</span>
                <span className="px-2 py-0.5 rounded-full bg-teal-950 border border-teal-800 text-[10px] font-mono font-bold text-teal-400 uppercase tracking-wider">
                  Admin Console
                </span>
              </div>
              <span className="text-[10px] text-stone-400 block font-mono">
                Role-Based Access Control • Supabase Auth
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
            title="Inspect the public mentor directory in a new tab"
          >
            <span>Public Directory</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </Link>

          <button
            onClick={fetchMentors}
            disabled={isLoading}
            className="p-2 rounded-xl bg-stone-850 hover:bg-stone-800 border border-stone-700/80 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh mentor applications"
            aria-label="Refresh mentor applications"
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
        {/* Notification Toast */}
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
              className="text-stone-400 hover:text-white ml-3 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Dashboard Title & Intro */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
              <ShieldCheck className="w-7 h-7 text-teal-400" />
              Mentor Approvals &amp; Directory Governance
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 font-sans">
              Review incoming mentor applications. Only registrations approved by an administrator will appear in the public WorkNext Mentorship Directory.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-950/70 border border-teal-800 text-xs font-mono text-teal-300">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              Supabase Auth &amp; RLS Enforced
            </span>
          </div>
        </div>

        {/* Statistics Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pending Card */}
          <div
            onClick={() => setActiveTab('pending')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-amber-950/40 border-amber-500/80 shadow-lg shadow-amber-950/20'
                : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-stone-400 uppercase tracking-wider">
                Pending Review
              </span>
              <span className="p-2 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/60">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-display text-amber-300">
                {counts.pending}
              </span>
              <span className="text-xs text-stone-500 font-sans">awaiting action</span>
            </div>
          </div>

          {/* Approved Card */}
          <div
            onClick={() => setActiveTab('approved')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'approved'
                ? 'bg-teal-950/40 border-teal-500/80 shadow-lg shadow-teal-950/20'
                : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-stone-400 uppercase tracking-wider">
                Approved &amp; Live
              </span>
              <span className="p-2 rounded-xl bg-teal-950/80 text-teal-400 border border-teal-800/60">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-display text-teal-300">
                {counts.approved}
              </span>
              <span className="text-xs text-stone-500 font-sans">in directory</span>
            </div>
          </div>

          {/* Rejected Card */}
          <div
            onClick={() => setActiveTab('rejected')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'rejected'
                ? 'bg-rose-950/40 border-rose-500/80 shadow-lg shadow-rose-950/20'
                : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-stone-400 uppercase tracking-wider">
                Rejected
              </span>
              <span className="p-2 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-800/60">
                <XCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-display text-rose-300">
                {counts.rejected}
              </span>
              <span className="text-xs text-stone-500 font-sans">denied</span>
            </div>
          </div>

          {/* Total Card */}
          <div
            onClick={() => setActiveTab('all')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-stone-800/80 border-stone-600 shadow-lg'
                : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-stone-400 uppercase tracking-wider">
                Total Applications
              </span>
              <span className="p-2 rounded-xl bg-stone-800 text-stone-300 border border-stone-700">
                <UserCheck className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-display text-white">
                {counts.total}
              </span>
              <span className="text-xs text-stone-500 font-sans">all submissions</span>
            </div>
          </div>
        </div>

        {/* Controls Toolbar: Tab Filters & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-stone-900/90 border border-stone-800">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-950 border border-stone-800/80 overflow-x-auto">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Pending Review ({counts.pending})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'approved'
                  ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Approved ({counts.approved})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'rejected'
                  ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/40'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Rejected ({counts.rejected})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-stone-800 text-white font-semibold border border-stone-700'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              All ({counts.total})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, role, email..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 placeholder-stone-500 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all"
            />
          </div>
        </div>

        {/* Mentors List / Applications */}
        {isLoading ? (
          <div className="p-16 rounded-3xl bg-stone-900/40 border border-stone-800/60 text-center">
            <RefreshCw className="w-8 h-8 text-teal-400 animate-spin mx-auto mb-3" />
            <p className="text-xs text-stone-400 font-mono">Loading mentor applications from database...</p>
          </div>
        ) : filteredMentors.length === 0 ? (
          <div className="p-16 rounded-3xl bg-stone-900/40 border border-stone-800/60 text-center">
            <div className="w-12 h-12 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-center mx-auto mb-3 text-stone-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">No applications in this view</h3>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No results matching "${searchQuery}". Try clearing search keywords.`
                : activeTab === 'pending'
                ? 'All mentor registrations have been reviewed. Outstanding pending queue is empty!'
                : `No mentor applications found with status "${activeTab}".`}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs text-stone-300 font-medium transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMentors.map((mentor, mIdx) => {
              const status = mentor.status || 'pending';
              const isActionRunning = actionLoadingId === mentor.id;

              return (
                <div
                  key={mentor.id ? `${mentor.id}-${mIdx}` : `mentor-${mIdx}`}
                  className={`p-6 rounded-3xl border transition-all ${
                    status === 'pending'
                      ? 'bg-stone-900/90 border-amber-800/40 hover:border-amber-700/60'
                      : status === 'approved'
                      ? 'bg-stone-900/60 border-teal-900/40 hover:border-teal-800/60'
                      : 'bg-stone-900/40 border-stone-800/80 opacity-80'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    {/* Left: Applicant info */}
                    <div className="flex items-start gap-4">
                      {mentor.avatar ? (
                        <img
                          src={mentor.avatar}
                          alt={mentor.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-stone-700 shrink-0 shadow-md"
                          onError={e => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-center text-lg font-bold text-teal-300 shrink-0 font-display">
                          {mentor.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h2 className="text-base font-bold font-display text-white">
                            {mentor.name}
                          </h2>

                          {/* Status Badge */}
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 ${
                              status === 'approved'
                                ? 'bg-teal-950 border border-teal-700 text-teal-300'
                                : status === 'rejected'
                                ? 'bg-rose-950 border border-rose-800 text-rose-300'
                                : 'bg-amber-950 border border-amber-700 text-amber-300 animate-pulse'
                            }`}
                          >
                            {status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                            {status === 'rejected' && <XCircle className="w-3 h-3" />}
                            {status === 'pending' && <Clock className="w-3 h-3" />}
                            {status}
                          </span>

                          <span className="text-[11px] font-mono text-stone-500">
                            ID: {mentor.id.substring(0, 16)}...
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-stone-400 flex-wrap">
                          <span className="font-medium text-stone-200 flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 text-teal-400" />
                            {mentor.role}
                            {mentor.company && ` @ ${mentor.company}`}
                          </span>

                          {mentor.userEmail && (
                            <span className="flex items-center gap-1 text-stone-400 font-mono text-[11px]">
                              <Mail className="w-3.5 h-3.5 text-stone-500" />
                              {mentor.userEmail}
                            </span>
                          )}

                          {mentor.createdAt && (
                            <span className="flex items-center gap-1 text-stone-500 text-[11px]">
                              <Calendar className="w-3 h-3" />
                              Registered: {new Date(mentor.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {/* Bio / Application summary */}
                        {mentor.bio && (
                          <p className="text-xs text-stone-300 mt-2 line-clamp-3 leading-relaxed bg-stone-950/60 p-3 rounded-xl border border-stone-800/80 font-sans">
                            {mentor.bio}
                          </p>
                        )}

                        {/* Details row: rate, availability, specialties */}
                        <div className="flex items-center gap-4 text-xs pt-1 flex-wrap">
                          {mentor.hourlyRate && (
                            <span className="inline-flex items-center gap-1 text-stone-300 font-semibold">
                              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                              Rate: {mentor.hourlyRate}
                            </span>
                          )}

                          {mentor.availability && (
                            <span className="inline-flex items-center gap-1 text-stone-400 text-[11px]">
                              <Clock className="w-3.5 h-3.5 text-teal-400" />
                              Avail: {mentor.availability}
                            </span>
                          )}

                          {mentor.specialties && mentor.specialties.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {mentor.specialties.map((spec, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 text-[10px] font-mono"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Decision Actions */}
                    <div className="flex items-center sm:flex-col lg:flex-row gap-2 shrink-0 self-end sm:self-auto pt-2 lg:pt-0">
                      {status !== 'approved' && (
                        <button
                          onClick={() => handleUpdateStatus(mentor.id, 'approved', mentor.name)}
                          disabled={isActionRunning}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-950/40 transition-all cursor-pointer disabled:opacity-50"
                          title="Approve mentor to appear in public directory"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve &amp; Publish</span>
                        </button>
                      )}

                      {status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateStatus(mentor.id, 'rejected', mentor.name)}
                          disabled={isActionRunning}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 text-rose-300 hover:text-white text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
                          title="Reject mentor application"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      )}

                      {status !== 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(mentor.id, 'pending', mentor.name)}
                          disabled={isActionRunning}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-400 hover:text-stone-200 text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
                          title="Reset application status to pending"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-stone-900 text-center text-xs text-stone-600 font-mono">
        WorkNext Administrator Console • Role-Based Access Control • Supabase Realtime Storage
      </footer>
    </div>
  );
};
