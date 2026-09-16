import React from 'react';
import { motion } from 'motion/react';
import { Target, HeartHandshake } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const pillars = [
    { value: 'ATS', label: 'Resume Analysis', sub: 'ATS-friendly formatting & structure' },
    { value: 'Skills', label: 'Gap Identification', sub: 'Identify missing in-demand skills' },
    { value: 'Jobs', label: 'Local Career Search', sub: 'Filter opportunities by location' },
    { value: 'Guidance', label: 'Student & Grad Focus', sub: 'Tailored for entry-level seekers' },
  ];

  return (
    <section className="py-24 bg-[#F7F6F3] dark:bg-[#111111] text-[#1F2937] dark:text-stone-100 relative overflow-hidden border-t border-stone-200/80 dark:border-stone-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/50 text-xs font-semibold text-[#0F766E] dark:text-teal-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] dark:bg-teal-400" />
              Our Mission & Philosophy
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-[1.15] font-display">
              Tackling Unemployment with <span className="text-[#0F766E] dark:text-teal-400">Skill-First Intelligence</span>
            </h2>

            <p className="text-base text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
              Traditional job portals rely on static keywords and degree barriers, trapping qualified workers in underpaid roles. WorkNext fundamentally restructures career mobility around verified skill competencies, real-time wage data, and local industry needs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs flex items-start gap-4">
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 shrink-0 border border-teal-200/60 dark:border-teal-800/40">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white font-display">Skill-Based Discovery</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed font-sans">
                    Matching algorithms prioritize practical ability over legacy resume titles.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs flex items-start gap-4">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 shrink-0 border border-amber-200/60 dark:border-amber-800/40">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white font-display">Community Mentorship</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed font-sans">
                    Subsidized 1-on-1 coaching for interview prep and wage negotiation.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-5 grid grid-cols-2 gap-4"
          >
            {pillars.map((pillar, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -3 }}
                className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs text-center flex flex-col justify-center transition-all group"
              >
                <p className="text-2xl sm:text-3xl font-extrabold text-[#0F766E] dark:text-teal-400 tracking-tight font-display">
                  {pillar.value}
                </p>
                <p className="text-xs font-bold text-stone-900 dark:text-white mt-2 font-display">{pillar.label}</p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 font-sans">{pillar.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

