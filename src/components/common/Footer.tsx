import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { WNMonogramIcon } from './WNMonogramIcon';
import jslWorksLogo from '../../assets/images/WhatsApp_Image_2026-09-13_at_2.40.52_PM-removebg-preview.png';
import { TrendingUp, Github, Twitter, Linkedin, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const Footer: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-stone-100 dark:bg-[#111613] text-stone-700 dark:text-stone-300 pt-20 pb-12 border-t border-stone-200 dark:border-stone-800/80 overflow-hidden transition-colors duration-300">
      {/* Background glow effects */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-600/5 dark:bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/5 dark:bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3 group">
              <WNMonogramIcon className="w-10 h-10" />
              <div>
                <span className="text-2xl font-black text-stone-900 dark:text-white tracking-tight font-display">WorkNext</span>
                <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-400 tracking-widest block -mt-1 font-mono">
                  AI Workforce Engine
                </span>
              </div>
            </Link>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed max-w-sm font-sans">
              WorkNext is an AI-powered workforce platform dedicated to eliminating unemployment and underemployment through verified skill matching, resume engineering, and regional job intelligence.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a href="#" className="p-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 hover:border-teal-500/50 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-all shadow-xs" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 hover:border-teal-500/50 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-all shadow-xs" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 hover:border-teal-500/50 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-all shadow-xs" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-900 dark:text-stone-200 mb-5">Job Seekers</h4>
            <ul className="space-y-3 text-xs text-stone-600 dark:text-stone-400">
              <li><Link to="/jobs" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Local Job Finder</Link></li>
              <li><Link to="/resume" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">AI Resume Builder</Link></li>
              <li><Link to="/insights" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Skill Gap Analyzer</Link></li>
              <li><Link to="/community" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">1-on-1 Mentorship</Link></li>
              <li><Link to="/dashboard" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Career Dashboard</Link></li>
            </ul>
          </div>

          {/* Employer & Partners */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-900 dark:text-stone-200 mb-5">Employers</h4>
            <ul className="space-y-3 text-xs text-stone-600 dark:text-stone-400">
              <li><Link to="/recruiter" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Recruiter Dashboard</Link></li>
              <li><Link to="/recruiter" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Post Openings</Link></li>
              <li><Link to="/insights" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Regional Wage Data</Link></li>
              <li><Link to="/community" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Apprenticeships</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-900 dark:text-stone-200 mb-5">Workforce Briefing</h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
              Weekly intelligence on regional hiring sprees, salary trends, and high-demand skills.
            </p>
            {subscribed ? (
              <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-600 dark:text-teal-400" />
                <span>Subscribed! Check your inbox soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter work email..."
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-teal-500 transition-all"
                />
                <Button variant="primary" size="sm" fullWidth icon={<ArrowRight className="w-3.5 h-3.5" />} iconPosition="right" className="bg-[#0F766E] hover:bg-[#0D655E]">
                  Subscribe Intel
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* JSL Works & Team Attribution */}
        <div id="footer-jsl-attribution" className="pt-10 pb-6 border-t border-stone-300 dark:border-stone-800/80 flex flex-col items-center justify-center text-center space-y-4">
          <img
            id="team-project-logo"
            src={jslWorksLogo}
            alt="JSL WORKS"
            className="h-44 sm:h-56 md:h-64 w-auto max-w-[340px] sm:max-w-[440px] object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/WhatsApp_Image_2026-09-13_at_2.40.52_PM-removebg-preview.png';
            }}
          />
          <p id="team-project-attribution" className="text-sm sm:text-base font-medium tracking-wide text-stone-800 dark:text-stone-200 font-sans">
            Project done by the team <span className="text-teal-700 dark:text-teal-400 font-bold">The Bachelors</span>
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-stone-200 dark:border-stone-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} WorkNext. Empowering India’s Workforce.</p>
          <div className="flex items-center gap-6 text-stone-600 dark:text-stone-400">
            <Link to="/settings" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Accessibility</Link>
            <Link to="/settings" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Privacy Policy</Link>
            <Link to="/settings" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

