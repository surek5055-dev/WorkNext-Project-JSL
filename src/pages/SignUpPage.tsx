import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { useApp } from '../context/AppContext';
import { Sparkles, Mail, Lock, User, Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { WNMonogramIcon } from '../components/common/WNMonogramIcon';

export const SignUpPage: React.FC = () => {
  const { login } = useApp();
  const [role, setRole] = useState<'jobseeker' | 'recruiter'>('jobseeker');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to sign up with Supabase');
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
      setErrorMsg(err.message || 'Failed to create account. Please check your details.');
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Join WorkNext Today</h1>
            <p className="text-xs text-slate-500">Accelerate your career with AI job matching and ATS resumes</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setRole('jobseeker')}
              className={`py-2 rounded-lg transition-all ${
                role === 'jobseeker'
                  ? 'bg-white dark:bg-slate-900 text-[#0F766E] dark:text-teal-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => setRole('recruiter')}
              className={`py-2 rounded-lg transition-all ${
                role === 'recruiter'
                  ? 'bg-white dark:bg-slate-900 text-[#0F766E] dark:text-teal-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Employer / Recruiter
            </button>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-xs rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                {errorMsg}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

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
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <Button variant="primary" size="md" fullWidth type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Get Started Free'}
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
