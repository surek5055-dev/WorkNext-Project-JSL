import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Zap,
  Briefcase,
  Compass,
  BarChart3,
  Users,
  ArrowUpRight,
  Sparkles,
  Lock
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      id: 'resume',
      num: '01',
      title: 'ATS Resume Analysis & Architecture',
      description: 'Single-column, ATS-engineered structure with verified semantic keyword density, instant impact rewrites, and PDF export.',
      badge: 'Resume Studio',
      link: '/resume',
      icon: FileText,
      accent: 'emerald',
    },
    {
      id: 'skills',
      num: '02',
      title: 'Skill Gap Radar',
      description: 'Live competency diagnostics benchmarking your skillset directly against active requirements in your target field.',
      badge: 'Diagnostics',
      link: '/profile',
      icon: Zap,
      accent: 'teal',
    },
    {
      id: 'jobs',
      num: '03',
      title: 'Direct Job Finder',
      description: 'Curated tech and engineering opportunities across Bengaluru, NCR, Hyderabad, Pune, and India’s emerging tech hubs.',
      badge: 'Radar',
      link: '/jobs',
      icon: Briefcase,
      accent: 'amber',
    },
    {
      id: 'guidance',
      num: '04',
      title: 'Career Guidance & Roadmaps',
      description: 'Personalized milestone roadmaps, transition trajectories, and 1-on-1 prep with verified industry mentors.',
      badge: 'Pathways',
      link: '/community',
      icon: Compass,
      accent: 'emerald',
    },
    {
      id: 'analytics',
      num: '05',
      title: 'Workforce Analytics',
      description: 'Transparent regional compensation benchmarks, hiring demand indices, and emerging skill adoption metrics.',
      badge: 'Intelligence',
      link: '/analytics',
      icon: BarChart3,
      accent: 'teal',
    },
    {
      id: 'recruiter',
      num: '06',
      title: 'Recruiter Portal & Mentorship',
      description: 'Pre-vetted candidate talent pools for hiring managers and verified mentor networks for personalized career prep.',
      badge: 'Ecosystem',
      link: '/recruiter',
      icon: Users,
      accent: 'amber',
    },
  ];

  return (
    <section id="features" className="py-24 sm:py-32 bg-[#F8F7F4] dark:bg-[#090D0B] text-stone-900 dark:text-[#EDECE8] relative overflow-hidden border-t border-stone-200/80 dark:border-white/[0.06] transition-colors duration-300">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 dark:bg-[#064E3B]/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 dark:bg-[#B48C36]/08 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20 text-left space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-200/70 dark:bg-white/[0.04] border border-stone-300 dark:border-white/10 text-xs font-mono tracking-wider uppercase text-emerald-800 dark:text-emerald-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Platform Architecture</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-normal tracking-[-0.03em] text-stone-900 dark:text-[#EDECE8] font-sans"
          >
            <span className="font-extrabold text-stone-900 dark:text-white block">Specialized Capabilities</span>
            <span className="font-serif-editorial italic block text-stone-600 dark:text-stone-400 text-2xl sm:text-4xl lg:text-5xl mt-1">
              Accessible inside your dashboard
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-stone-600 dark:text-stone-400 font-sans leading-relaxed max-w-2xl pt-2"
          >
            Log in to unlock your full career intelligence suite — engineered with verified semantic analysis, unbiased skill benchmarks, and regional job telemetry.
          </motion.p>
        </div>

        {/* Features Grid: Clean, Premium, Spacious & Architectural */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <Link
                  to={feature.link}
                  className="group block h-full p-7 sm:p-8 rounded-[24px] bg-white dark:bg-[#0E1411]/80 hover:bg-stone-50 dark:hover:bg-[#121A16] border border-stone-200/80 dark:border-white/[0.08] hover:border-emerald-500/40 shadow-sm dark:shadow-none transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                >
                  {/* Subtle hover gradient top border */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="space-y-6">
                    {/* Top Row: Icon + Module Index */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-white/[0.04] border border-emerald-100 dark:border-white/10 group-hover:border-emerald-400/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs tracking-wider text-stone-500 dark:text-stone-400 uppercase">
                        {feature.num} // {feature.badge}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2.5">
                      <h3 className="text-xl font-bold font-sans text-stone-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors flex items-center justify-between">
                        <span>{feature.title}</span>
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-emerald-600 dark:text-emerald-400 -translate-x-1 group-hover:translate-x-0" />
                      </h3>
                      <p className="text-sm text-stone-600 dark:text-stone-400 font-sans leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer Micro Tag */}
                  <div className="mt-8 pt-4 border-t border-stone-100 dark:border-white/[0.06] flex items-center justify-between text-xs font-mono text-stone-500 dark:text-stone-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    <span className="inline-flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-stone-400 dark:text-stone-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                      <span>Accessible in Dashboard</span>
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Minimalist Bottom Sign-in Callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20 p-8 sm:p-10 rounded-[28px] bg-white dark:bg-white/[0.02] border border-stone-200 dark:border-white/[0.08] shadow-sm dark:shadow-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div className="space-y-1.5">
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white font-sans">
              Ready to access your dashboard?
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 font-sans max-w-xl">
              Create an account or sign in to run your real-time ATS audit, benchmark skill gaps, and view matching roles.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl border border-stone-300 dark:border-white/15 bg-stone-50 dark:bg-white/[0.04] hover:bg-stone-100 dark:hover:bg-white/[0.08] text-sm text-stone-800 dark:text-stone-200 hover:text-stone-950 dark:hover:text-white font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D655E] text-sm text-white font-semibold shadow-md shadow-teal-900/15 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
