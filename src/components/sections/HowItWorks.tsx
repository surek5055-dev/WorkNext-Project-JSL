import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, FileSearch, Sparkles, Rocket, ArrowRight, CheckCircle2, ShieldCheck, Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      step: '01',
      title: 'Profile Diagnostic & Goal Setting',
      desc: 'Input your background, education, and target career trajectory in under 2 minutes.',
      icon: UserPlus,
      preview: {
        headline: 'Intelligent Profile Diagnostics',
        sub: 'Neural parsing of current experience and regional goals',
        points: ['Fast 2-minute onboarding questionnaire', 'Automatic resume parsing from PDF/Word', 'Target salary & remote preference calibration'],
        badge: 'Step 1 of 4 • Initial Setup'
      }
    },
    {
      step: '02',
      title: 'AI ATS & Skill Gap Audit',
      desc: 'Our engine scans live regional postings, rates your resume, and highlights high-impact skills to acquire.',
      icon: FileSearch,
      preview: {
        headline: 'Automated Skill Gap & ATS Scoring',
        sub: 'Real-time benchmark against active regional openings',
        points: ['Pinpoints missing technical keywords', 'Generates STAR-formatted bullet rewrites', 'Calculates potential salary lift per skill bridge'],
        badge: 'Step 2 of 4 • Skill Diagnosis'
      }
    },
    {
      step: '03',
      title: 'Precision Match & Mentor Coaching',
      desc: 'Discover tailored job recommendations with verified wage floors and schedule mock prep with industry mentors.',
      icon: Sparkles,
      preview: {
        headline: 'Tailored Job Radar & Mentor Prep',
        sub: 'Curated openings with mandatory pay transparency',
        points: ['100% verified employer salary floors', '1-on-1 mock behavioral & technical interview prep', 'Direct connections to verified industry coaches'],
        badge: 'Step 3 of 4 • Acceleration'
      }
    },
    {
      step: '04',
      title: 'Apply, Negotiate & Elevate',
      desc: 'Apply directly through simplified tracking, negotiate with wage data, and land your ideal high-wage offer.',
      icon: Rocket,
      preview: {
        headline: 'Offer Acceleration & Compensation Strategy',
        sub: 'Data-backed negotiation and career elevation',
        points: ['Instant 1-click application packet generator', 'Real-time regional offer counter-proposal tools', 'Long-term promotion roadmap tracking'],
        badge: 'Step 4 of 4 • Placement & Growth'
      }
    }
  ];

  const current = steps[activeStep];

  return (
    <section className="py-24 bg-[#FAF9F6] dark:bg-[#111315] border-t border-stone-200/80 dark:border-stone-800/80 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/50 text-xs font-semibold text-[#0F766E] dark:text-teal-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] dark:bg-teal-400" />
            Interactive Workflow Walkthrough
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-white tracking-tight font-display">
            How WorkNext Transforms Your Career
          </h2>
          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl mx-auto font-sans">
            From skill diagnosis to landing your ideal offer letter—streamlined for maximum efficiency.
          </p>
        </div>

        {/* Interactive Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: 4 Step Buttons */}
          <div className="lg:col-span-5 space-y-3 flex flex-col justify-center">
            {steps.map((st, i) => {
              const Icon = st.icon;
              const isSelected = activeStep === i;
              return (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`w-full text-left p-5 rounded-[20px] border transition-all cursor-pointer flex items-start gap-4 ${
                    isSelected
                      ? 'bg-white dark:bg-[#1A1D20] border-teal-500/80 shadow-lg shadow-teal-900/5 dark:shadow-black/50'
                      : 'bg-stone-50/70 dark:bg-stone-900/40 border-stone-200/70 dark:border-stone-800/70 hover:bg-white dark:hover:bg-[#1A1D20]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                    isSelected
                      ? 'bg-[#0F766E] text-white border-teal-600 shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                        isSelected ? 'text-[#0F766E] dark:text-teal-400' : 'text-stone-400'
                      }`}>
                        Phase {st.step}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#0F766E] dark:bg-teal-400 animate-pulse" />
                      )}
                    </div>
                    <h3 className={`text-base font-bold font-display ${
                      isSelected ? 'text-stone-900 dark:text-white' : 'text-stone-700 dark:text-stone-300'
                    }`}>
                      {st.title}
                    </h3>
                    <p className="text-xs text-stone-500 font-sans leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Dynamic Interactive Preview Visual Canvas */}
          <div className="lg:col-span-7 flex">
            <div className="w-full rounded-[28px] bg-white dark:bg-[#1A1D20] border border-stone-200/90 dark:border-stone-800 shadow-2xl p-7 sm:p-9 flex flex-col justify-between space-y-6 overflow-hidden card-hover-lift">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6 flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                      <span className="text-xs font-mono font-bold text-[#0F766E] dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-full border border-teal-200/60">
                        {current.preview.badge}
                      </span>
                      <span className="text-xs font-mono text-stone-400">
                        WORKFLOW EXECUTION
                      </span>
                    </div>

                    <div>
                      <h4 className="text-2xl font-bold text-stone-900 dark:text-white font-display">
                        {current.preview.headline}
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-500 font-sans mt-1">
                        {current.preview.sub}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      {current.preview.points.map((pt, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800 flex items-center gap-3 text-xs font-sans">
                          <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />
                          <span className="font-medium text-stone-800 dark:text-stone-200">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <span className="text-xs text-stone-500 font-sans">Zero credit card required</span>
                    <Link to="/jobs">
                      <Button variant="primary" size="sm" icon={<ChevronRight className="w-3.5 h-3.5" />} iconPosition="right" className="bg-[#0F766E] hover:bg-[#0D655E] text-white">
                        Try Step {current.step}
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
