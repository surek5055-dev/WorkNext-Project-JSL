import React from 'react';
import { motion } from 'motion/react';
import { Quote, TrendingUp, Sparkles, CheckCircle2, Award } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const stories = [
    {
      id: 1,
      name: 'Maya Patel',
      transition: 'Transitioned from Junior Support to Full-Stack Engineer',
      salaryLift: '+$24,000 / yr',
      quote: 'The AI resume optimizer pinpointed exactly why my resume was bouncing off ATS screeners. Adding quantified TypeScript bullets and practicing mock questions changed everything.',
      role: 'Full-Stack Developer (Demo Profile)',
      badge: 'Demo Preview',
      impact: 'ATS Score: 64 → 96'
    },
    {
      id: 2,
      name: 'David Alvarez',
      transition: 'Bootcamp Graduate to Associate Software Engineer',
      salaryLift: '+$21,500 / yr',
      quote: 'WorkNext highlighted the precise 2 missing skills (GraphQL & Docker) preventing local recruiters from reaching out. Within 3 weeks of closing the gap, I had 2 offers.',
      role: 'Frontend Engineer (Demo Profile)',
      badge: 'Demo Preview',
      impact: 'Skill Gap Solved: 3 wks'
    },
    {
      id: 3,
      name: 'Samantha Vance',
      transition: 'Career Re-entry after 3-year gap to Tech PM',
      salaryLift: '+$32,000 / yr',
      quote: 'The 1-on-1 mentorship coaching and transparent wage benchmarks gave me the confidence to counter-offer during final negotiations.',
      role: 'Associate Product Manager (Demo Profile)',
      badge: 'Demo Preview',
      impact: 'Offer Negotiated: +12%'
    }
  ];

  return (
    <section className="py-24 bg-[#FAF9F6] dark:bg-[#111315] text-[#16181A] dark:text-stone-100 relative overflow-hidden transition-colors border-t border-stone-200/80 dark:border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/50 text-xs font-semibold text-[#0F766E] dark:text-teal-400">
            <Sparkles className="w-3.5 h-3.5" />
            Career Transition Case Studies (Demo Preview)
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-white tracking-tight font-display">
            Designed for Real Economic Mobility
          </h2>
          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl mx-auto font-sans">
            Representative candidate journeys illustrating how structured skill gap remediation and ATS resume engineering elevate placement rates.
          </p>
        </div>

        {/* Story Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {stories.map((s, idx) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-[24px] bg-white dark:bg-[#1A1D20] border border-stone-200/90 dark:border-stone-800 shadow-xl flex flex-col justify-between relative group transition-all card-hover-lift"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                    {s.badge}
                  </span>
                  <div className="flex items-center gap-1.5 text-[#0F766E] dark:text-teal-400 font-bold text-xs bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/40 px-3 py-1 rounded-full font-mono">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {s.salaryLift}
                  </div>
                </div>

                <Quote className="w-7 h-7 text-[#0F766E]/20 dark:text-teal-400/20 mb-3" />
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed italic mb-6 font-sans">
                  "{s.quote}"
                </p>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/80 border border-stone-200/70 dark:border-stone-800 text-xs space-y-1 mb-4">
                  <span className="text-[10px] font-mono font-bold uppercase text-stone-400">Trajectory Outcome</span>
                  <p className="font-semibold text-stone-900 dark:text-white font-sans">{s.transition}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800 text-xs">
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white font-display">{s.name}</h4>
                  <p className="text-[11px] text-stone-500 font-sans">{s.role}</p>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#0F766E] dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded">
                  {s.impact}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
