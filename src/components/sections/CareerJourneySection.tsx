import React from 'react';
import { motion } from 'motion/react';
import { UserCheck, FileSearch, Sparkles, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const CareerJourneySection: React.FC = () => {
  const steps = [
    {
      phase: '01',
      title: 'Profile & Goal Setting',
      desc: 'Connect your current background, education, and target career trajectory in under 3 minutes.',
      icon: UserCheck,
      badge: 'Input Phase',
      metrics: 'Quick 2-Min Onboarding'
    },
    {
      phase: '02',
      title: 'AI ATS Audit & Skill Gap Analysis',
      desc: 'Our engine scans live regional postings, rates your resume, and highlights high-impact skills to acquire.',
      icon: FileSearch,
      badge: 'Diagnosis',
      metrics: 'Instant ATS Score + Feedback'
    },
    {
      phase: '03',
      title: 'Precision Job Match & Mentor Coaching',
      desc: 'Discover tailored job recommendations with verified wage floors and schedule mock prep with industry mentors.',
      icon: Sparkles,
      badge: 'Acceleration',
      metrics: '1-on-1 Practice & Guidance'
    },
    {
      phase: '04',
      title: 'Interview & High-Wage Offer',
      desc: 'Apply directly through simplified tracking, negotiate with wage data, and land your ideal role.',
      icon: Trophy,
      badge: 'Outcome',
      metrics: 'Avg $18.5k Salary Increase'
    }
  ];

  return (
    <section className="py-24 bg-[#FAF9F6] dark:bg-[#111315] border-t border-stone-200/80 dark:border-stone-800/80 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/50 text-xs font-semibold text-[#0F766E] dark:text-teal-400"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] dark:bg-teal-400 animate-pulse" />
            Structured Career Pathway
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-white tracking-tight font-display"
          >
            From Application to Offer Letter
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl mx-auto font-sans"
          >
            A step-by-step roadmap designed to take you from uncertain applicant to confident, high-earning candidate.
          </motion.p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                viewport={{ once: true }}
                className="p-7 rounded-[22px] bg-white dark:bg-[#1A1D20] border border-stone-200/90 dark:border-stone-800 shadow-lg relative flex flex-col justify-between space-y-6 card-hover-lift group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-black font-display text-stone-300 dark:text-stone-700">
                      PHASE {st.phase}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F766E] dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200/40">
                      {st.badge}
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white mt-2 font-display">
                      {st.title}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-1.5 leading-relaxed font-sans">
                      {st.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 dark:border-stone-800 text-[11px] font-medium text-stone-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>{st.metrics}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner inside Timeline */}
        <div className="mt-14 p-6 sm:p-8 rounded-[24px] bg-gradient-to-r from-[#0F766E] to-[#115E59] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold font-display">Ready to start your journey?</h3>
            <p className="text-xs sm:text-sm text-teal-100 font-sans">No credit card required. Free for all students and job seekers.</p>
          </div>
          <Link to="/jobs">
            <Button variant="primary" size="md" className="bg-white text-[#0F766E] hover:bg-teal-50 font-bold px-6 py-3 rounded-xl shadow-md">
              Start Free Today →
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
};
