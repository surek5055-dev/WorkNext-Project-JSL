import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Bot,
  BrainCircuit,
  TrendingUp,
  ShieldCheck,
  Zap,
  Code2,
  FileCheck,
  Check,
  ChevronRight,
  Play,
  RotateCcw,
  Terminal,
  Send
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

export const AIFeaturesDeepDiveSection: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<'ats' | 'salary' | 'interview'>('ats');
  
  // Interactive simulator states
  const [simulatedInterviewInput, setSimulatedInterviewInput] = useState('');
  const [interviewFeedback, setInterviewFeedback] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateInterview = () => {
    if (!simulatedInterviewInput.trim()) return;
    setIsSimulating(true);
    setTimeout(() => {
      setInterviewFeedback(
        "Strong STAR format structure! Your mention of 'reducing API latency by 35%' provided great quantifiable proof. Tip: Mention how you communicated trade-offs with product stakeholders to boost executive presence score."
      );
      setIsSimulating(false);
    }, 900);
  };

  return (
    <section className="py-24 bg-white/60 dark:bg-[#16181A]/60 border-t border-stone-200/80 dark:border-stone-800/80 relative overflow-hidden transition-colors">
      
      {/* Background Soft Gradient Mesh */}
      <div className="absolute top-1/3 -right-20 w-[600px] h-[600px] bg-[#0F766E]/6 dark:bg-[#0F766E]/14 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-[500px] h-[500px] bg-[#D4A017]/5 dark:bg-[#D4A017]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200/80 dark:border-teal-800/60 text-xs font-semibold text-[#0F766E] dark:text-teal-400"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-[#0F766E] dark:text-teal-400" />
            Next-Gen Neural Intelligence
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black text-[#16181A] dark:text-white tracking-tight font-display"
          >
            AI Intelligence Built for Real Employment Outcomes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl mx-auto font-sans"
          >
            Unlike generic AI chat wrappers, WorkNext leverages purpose-trained career models tuned on verified hiring rubrics, labor economics, and enterprise ATS screening engines.
          </motion.p>
        </div>

        {/* Feature Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto mb-12 font-sans">
          {[
            {
              id: 'ats',
              title: 'Neural ATS Parser',
              icon: FileCheck,
              tag: '98.4% Accuracy'
            },
            {
              id: 'salary',
              title: 'Salary Arbitrage Radar',
              icon: TrendingUp,
              tag: '100% Transparent'
            },
            {
              id: 'interview',
              title: 'Real-Time Interview Simulator',
              icon: Bot,
              tag: 'Voice & Text'
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFeature === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFeature(tab.id as any)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  isActive
                    ? 'bg-[#0F766E] border-teal-600 text-white shadow-md shadow-teal-900/15'
                    : 'bg-white dark:bg-[#1A1D20] border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-teal-500/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.title}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-teal-900/40 text-teal-100' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                }`}>
                  {tab.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Feature Display Canvas */}
        <div className="rounded-[28px] bg-white dark:bg-[#1A1D20] border border-stone-200/90 dark:border-stone-800 shadow-2xl p-6 sm:p-10 overflow-hidden card-hover-lift">
          <AnimatePresence mode="wait">
            
            {/* Feature 1: Neural ATS Parser */}
            {activeFeature === 'ats' && (
              <motion.div
                key="ats"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                <div className="lg:col-span-6 space-y-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 border border-teal-200/60 text-xs font-semibold">
                    <FileCheck className="w-3.5 h-3.5" />
                    Deep Keyword & Semantic Match
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-bold font-display text-stone-900 dark:text-white">
                    Pass Enterprise Filters with 98.4% Confidence
                  </h3>

                  <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
                    Most candidate drop-off happens before a recruiter views the application. Our parser deconstructs job descriptions into required competencies, synonyms, and quantifiable metrics, adjusting your phrasing dynamically.
                  </p>

                  <div className="space-y-2.5 pt-2 text-xs font-sans">
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                      <span className="text-stone-700 dark:text-stone-300">
                        Workday, Taleo, Greenhouse & Lever compliance verified
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                      <span className="text-stone-700 dark:text-stone-300">
                        Automatic generation of quantified impact metrics (STAR framework)
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                      <span className="text-stone-700 dark:text-stone-300">
                        Instant single-click PDF & DOCX export with zero rendering glitches
                      </span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link to="/resume">
                      <Button variant="primary" size="md" className="bg-[#0F766E] hover:bg-[#0D655E] text-white">
                        Run Free ATS Scan Now →
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-stone-50 dark:bg-stone-900/80 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 font-sans text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                    <div className="flex items-center gap-2 font-mono">
                      <Terminal className="w-4 h-4 text-[#0F766E]" />
                      <span className="text-stone-700 dark:text-stone-300 font-bold">Neural ATS Scanner Output</span>
                    </div>
                    <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded">
                      MATCH: 98%
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-stone-900 dark:text-white">Role: Principal Frontend Engineer</span>
                        <span className="text-[#0F766E] dark:text-teal-400">Target Match</span>
                      </div>
                      <p className="text-[11px] text-stone-500">Key terms identified: State Management, TypeScript Strict, Webpack, Vite</p>
                    </div>

                    <div className="p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/60 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-[#0F766E] uppercase">Optimized Experience Bullet</span>
                      <p className="text-[12px] font-semibold text-stone-900 dark:text-white">
                        "Architected scalable design system in TypeScript and Tailwind, standardizing 40+ components and accelerating frontend delivery velocity by 42% across 3 product teams."
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Feature 2: Salary Arbitrage Radar */}
            {activeFeature === 'salary' && (
              <motion.div
                key="salary"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                <div className="lg:col-span-6 space-y-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-[#D4A017] border border-amber-200/60 text-xs font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Labor Market Intelligence
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-bold font-display text-stone-900 dark:text-white">
                    Unlock +$18,500 Average Salary Progression
                  </h3>

                  <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
                    Stop guessing your market worth. WorkNext aggregates verified state and regional labor department records, revealing true salary floors and high-paying skill combinations in your local radius.
                  </p>

                  <div className="space-y-2.5 pt-2 text-xs font-sans">
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                      <span className="text-stone-700 dark:text-stone-300">
                        100% pay transparency on all recommended job postings
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                      <span className="text-stone-700 dark:text-stone-300">
                        Skill gap ROI calculator showing exact dollar value per new skill
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                      <span className="text-stone-700 dark:text-stone-300">
                        Real-time regional cost of living vs. compensation arbitrage
                      </span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link to="/insights">
                      <Button variant="primary" size="md" className="bg-[#0F766E] hover:bg-[#0D655E] text-white">
                        Explore Labor Insights →
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-stone-50 dark:bg-stone-900/80 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 font-sans text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                    <span className="font-mono font-bold text-stone-700 dark:text-stone-300">Skill Value Arbitrage (Regional Benchmark)</span>
                    <span className="text-xs font-mono text-[#D4A017] font-bold">CHICAGO METRO</span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { role: 'Base Frontend Dev (HTML/CSS/JS)', pay: '$78,000 / yr', lift: 'Baseline', pct: 60 },
                      { role: 'With React & TypeScript Mastery', pay: '$102,000 / yr', lift: '+$24k Lift', pct: 82 },
                      { role: 'With Cloud / Microservices Architecture', pay: '$128,000 / yr', lift: '+$50k Lift', pct: 100 },
                    ].map((row, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1.5">
                        <div className="flex justify-between font-semibold">
                          <span className="text-stone-900 dark:text-white">{row.role}</span>
                          <span className="text-emerald-600 font-mono">{row.pay}</span>
                        </div>
                        <div className="h-1.5 w-full bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
                          <div className="h-full bg-[#0F766E]" style={{ width: `${row.pct}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                          <span>Market Tier {idx + 1}</span>
                          <span className="text-[#0F766E] font-bold">{row.lift}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Feature 3: Real-Time Interview Simulator */}
            {activeFeature === 'interview' && (
              <motion.div
                key="interview"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                <div className="lg:col-span-6 space-y-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 border border-teal-200/60 text-xs font-semibold">
                    <Bot className="w-3.5 h-3.5" />
                    AI Mock Interview Simulator
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-bold font-display text-stone-900 dark:text-white">
                    Master Behavioral & Technical Questions with Zero Pressure
                  </h3>

                  <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
                    Practice answering challenging interview questions in a safe sandbox. Receive instantaneous critique on clarity, confidence, keyword density, and executive presence.
                  </p>

                  <div className="space-y-2.5 pt-2 text-xs font-sans">
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                      <span className="text-stone-700 dark:text-stone-300">
                        Company-specific question bank modeled on real technical rounds
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                      <span className="text-stone-700 dark:text-stone-300">
                        Actionable feedback on tone, STAR technique, and quantifiable examples
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                      <span className="text-stone-700 dark:text-stone-300">
                        1-on-1 human mentor follow-up booking available
                      </span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link to="/community">
                      <Button variant="primary" size="md" className="bg-[#0F766E] hover:bg-[#0D655E] text-white">
                        Try Full Mock Interview →
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-stone-50 dark:bg-stone-900/80 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 font-sans text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#0F766E] text-white flex items-center justify-center font-bold text-xs">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-stone-900 dark:text-white">AI Coach Live Sandbox</span>
                    </div>
                    <span className="text-[10px] font-mono text-stone-400">Interactive Demo</span>
                  </div>

                  {/* Simulator Interaction */}
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                      <span className="text-[10px] font-mono text-[#0F766E] font-bold block mb-1">INTERVIEWER PROMPT:</span>
                      <p className="font-medium text-stone-800 dark:text-stone-200">
                        "Tell me about a time you optimized a slow-performing system under a tight production deadline."
                      </p>
                    </div>

                    <div className="space-y-2">
                      <textarea
                        value={simulatedInterviewInput}
                        onChange={(e) => setSimulatedInterviewInput(e.target.value)}
                        placeholder="Type your mock response here (e.g. 'I profiled the database queries using EXPLAIN ANALYZE and added composite indexes...')"
                        rows={3}
                        className="w-full p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-teal-500 transition-all font-sans placeholder-stone-400"
                      />

                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-stone-400">Try answering with action verbs + metrics</span>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleSimulateInterview}
                          disabled={isSimulating || !simulatedInterviewInput.trim()}
                          icon={<Send className="w-3.5 h-3.5" />}
                          className="bg-[#0F766E] text-white text-xs py-2 px-4"
                        >
                          {isSimulating ? 'Evaluating...' : 'Get AI Feedback'}
                        </Button>
                      </div>
                    </div>

                    {interviewFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 space-y-1.5"
                      >
                        <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                          <Check className="w-3.5 h-3.5" />
                          <span>AI Feedback Score: 92/100</span>
                        </div>
                        <p className="text-[11px] text-emerald-900 dark:text-emerald-200 leading-relaxed font-sans">
                          {interviewFeedback}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
