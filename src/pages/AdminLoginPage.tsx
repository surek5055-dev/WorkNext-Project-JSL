import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { WNMonogramIcon } from '../components/common/WNMonogramIcon';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, KeyRound, Server } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { adminLogin, isAdminLoggedIn } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in as admin
  React.useEffect(() => {
    if (isAdminLoggedIn) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdminLoggedIn, navigate]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Administrator authentication failed');
      }

      adminLogin(
        {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: 'admin',
          token: data.token,
          lastLogin: new Date().toISOString(),
        },
        data.token
      );

      navigate('/admin/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@worknext.io');
    setPassword('AdminWorkNext2026!');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between selection:bg-teal-500 selection:text-white font-sans">
      {/* Top Bar */}
      <header className="px-6 py-4 border-b border-stone-800/80 bg-stone-900/60 backdrop-blur-md flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <WNMonogramIcon className="w-8 h-8" />
          <div>
            <span className="text-lg font-bold font-display tracking-tight text-white">WorkNext</span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-teal-400 block -mt-1">
              Admin Console
            </span>
          </div>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to WorkNext</span>
        </Link>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="max-w-md w-full">
          {/* Security Banner Card */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Subtle glow accent */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header / Security Badge */}
            <div className="text-center mb-6 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-stone-800 to-stone-950 border border-stone-700 flex items-center justify-center mx-auto mb-4 text-teal-400 shadow-inner">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800/90 border border-stone-700 text-[11px] font-mono font-semibold text-amber-400 mb-3">
                <Lock className="w-3 h-3 text-amber-400" />
                RESTRICTED PORTAL • ROLE-BASED ACCESS
              </div>
              <h1 className="text-2xl font-bold font-display text-white tracking-tight">
                WorkNext Admin Login
              </h1>
              <p className="text-stone-400 text-xs mt-1.5 leading-relaxed">
                Sign in with administrative credentials to manage mentor approvals, applications, and verified directory records.
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-950/70 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAdminLogin} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@worknext.io"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={loading}
                  className="bg-[#0F766E] hover:bg-[#0D655E] text-white font-semibold py-2.5 shadow-lg shadow-teal-950/40"
                >
                  {loading ? 'Verifying Admin Privileges...' : 'Authenticate & Open Dashboard'}
                </Button>
              </div>
            </form>

            {/* Quick Demo Access Helper */}
            <div className="mt-6 pt-5 border-t border-stone-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-stone-400 flex items-center gap-1">
                  <Server className="w-3 h-3 text-teal-400" />
                  Default Admin Credentials
                </span>
                <button
                  type="button"
                  onClick={fillDemoAdmin}
                  className="text-[11px] font-semibold text-teal-400 hover:text-teal-300 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Auto-fill
                </button>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed font-sans">
                You can auto-fill the preconfigured administrator credentials (<code className="text-stone-300">admin@worknext.io</code>) or sign in with your Supabase Admin account.
              </p>
            </div>

            {/* Normal User Redirection */}
            <div className="mt-5 text-center">
              <p className="text-xs text-stone-500">
                Are you a job seeker or recruiter?{' '}
                <Link to="/login" className="text-stone-300 hover:text-teal-400 underline underline-offset-2">
                  Use Standard User Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-stone-900 text-center text-xs text-stone-600 font-mono">
        WorkNext Administration Security Layer • Protected by Supabase Auth &amp; RBAC
      </footer>
    </div>
  );
};
