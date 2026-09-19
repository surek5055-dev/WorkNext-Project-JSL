import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { useApp } from '../context/AppContext';
import { Sparkles, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { WNMonogramIcon } from '../components/common/WNMonogramIcon';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to authenticate with Supabase');
      }

      login(
        data.user.email,
        data.user.name,
        data.user.id,
        data.user.role,
        data.session?.access_token
      );
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="py-16 sm:py-24 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-3">
            <WNMonogramIcon className="w-14 h-14 mx-auto" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Welcome Back</h1>
            <p className="text-xs text-slate-500">Log in to track your career progress, resume, and applications</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-xs rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                {errorMsg}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <a href="#" className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <Button variant="primary" size="md" fullWidth type="submit" disabled={loading} className="bg-[#0F766E] hover:bg-[#0D655E]">
              {loading ? 'Authenticating...' : 'Sign In to Account'}
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
            Don't have a WorkNext account yet?{' '}
            <Link to="/signup" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Create free profile
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
