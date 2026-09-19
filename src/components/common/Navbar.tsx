import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { ProfileDropdown } from './ProfileDropdown';
import { WNMonogramIcon } from './WNMonogramIcon';
import {
  TrendingUp,
  Bell,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    isLoggedIn,
    user,
    adminUser,
    isAdminLoggedIn,
    unreadCount,
    setNotificationsOpen,
    t
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isRecruiter = isLoggedIn && (user?.role === 'recruiter' || (user?.role as string) === 'employer');
  const isAdmin = isAdminLoggedIn || user?.role === 'admin' || adminUser?.role === 'admin';

  const recruiterNavLinks = [
    { name: 'Recruiter Dashboard', path: '/recruiter?tab=dashboard' },
    { name: 'Post Jobs', path: '/recruiter?tab=post' },
    { name: 'Active Openings', path: '/recruiter?tab=openings' },
    { name: 'Matched Candidates', path: '/recruiter?tab=candidates' },
    { name: 'Applications', path: '/recruiter?tab=applications' },
    { name: 'Candidate Management', path: '/recruiter?tab=management' },
    { name: 'Recruiter Profile', path: '/recruiter?tab=profile' },
  ];

  const standardNavLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.jobs'), path: '/jobs' },
    { name: t('nav.resume'), path: '/resume' },
    { name: t('nav.insights'), path: '/insights' },
    { name: t('nav.community'), path: '/community' },
    ...(isAdmin ? [{ name: 'Admin Console', path: '/admin/dashboard' }] : []),
  ];

  const navLinks = isRecruiter ? recruiterNavLinks : standardNavLinks;

  const isActive = (path: string) => {
    if (isRecruiter) {
      if (location.pathname !== '/recruiter') return false;
      const urlParams = new URLSearchParams(location.search);
      const currentTab = urlParams.get('tab') || 'dashboard';
      const itemTab = path.includes('?tab=') ? path.split('?tab=')[1] : 'dashboard';
      return currentTab === itemTab;
    }
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F7F6F3]/85 dark:bg-[#111111]/85 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <Link to={isRecruiter ? '/recruiter' : '/'} id="brand-header-logo" className="flex items-center gap-3 shrink-0 group">
            <WNMonogramIcon className="w-10 h-10 sm:w-11 sm:h-11" />
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 dark:text-white font-display">
                WorkNext
              </span>
              <span className="text-[10px] uppercase font-bold text-[#0F766E] dark:text-teal-400 tracking-widest block -mt-1 font-mono">
                AI Workforce
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1.5 bg-white/80 dark:bg-[#1A1A1A]/80 rounded-full border border-stone-200/80 dark:border-stone-800/80 shadow-xs backdrop-blur-md">
            {navLinks.map(link => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                    active
                      ? 'text-white'
                      : 'text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className="absolute inset-0 rounded-full bg-[#0F766E] shadow-sm shadow-teal-900/20"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle: Dark Mode ↔ Light Mode */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2.5 rounded-2xl bg-white/80 dark:bg-[#1A1A1A]/80 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:text-[#0F766E] dark:hover:text-teal-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer flex items-center justify-center shadow-xs"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-600 dark:text-stone-300" />
              )}
            </button>

            {/* Notifications Button */}
            <button
              onClick={() => setNotificationsOpen(true)}
              aria-label="View notifications"
              className="p-2.5 rounded-2xl bg-white/80 dark:bg-[#1A1A1A]/80 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:text-[#0F766E] dark:hover:text-teal-400 transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown or Auth Action Buttons */}
            <div className="pl-1 border-l border-stone-200/80 dark:border-stone-800/80 flex items-center gap-2">
              {isLoggedIn ? (
                <ProfileDropdown />
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="font-semibold text-xs py-2 px-3.5 text-stone-700 dark:text-stone-200 hover:text-[#0F766E]">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary" size="sm" className="font-bold text-xs py-2 px-4 bg-[#0F766E] hover:bg-[#0D655E] text-white rounded-xl shadow-xs">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-stone-200 dark:border-stone-800 bg-[#F7F6F3] dark:bg-[#111111] px-4 pt-3 pb-6 space-y-2 overflow-hidden"
          >
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isActive(link.path)
                    ? 'bg-[#0F766E] text-white shadow-sm'
                    : 'text-stone-700 dark:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800/80 grid grid-cols-2 gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" fullWidth>
                  Log In
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="sm" fullWidth>
                  Sign Up
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

