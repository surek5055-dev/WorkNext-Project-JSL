import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Sparkles, MessageSquare, Star, ArrowRight, Calendar, CheckCircle2, ShieldCheck, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const CommunityPreviewSection: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<'all' | 'swe' | 'product' | 'career'>('all');

  const mentors = [
    {
      id: 1,
      name: 'Elena Rostova',
      role: 'Staff Frontend Engineer',
      company: 'Tech Scale-up',
      experience: '9+ yrs exp',
      focus: ['React Architecture', 'System Design', 'Resume Reviews'],
      rating: 4.9,
      sessions: '140+ sessions',
      category: 'swe',
      tag: 'Verified Mentor',
      quote: 'Helping self-taught and transition engineers land tier-1 software roles with confidence.'
    },
    {
      id: 2,
      name: 'Marcus Chen',
      role: 'Head of Product Management',
      company: 'Enterprise Cloud Corp',
      experience: '12+ yrs exp',
      focus: ['Behavioral Prep', 'Product Strategy', 'Salary Negotiation'],
      rating: 5.0,
      sessions: '210+ sessions',
      category: 'product',
      tag: 'Top Rated',
      quote: 'We focus heavily on executive presence, quantifiable metrics, and offer counter-proposals.'
    },
    {
      id: 3,
      name: 'Dr. Sarah Jenkins',
      role: 'Workforce Development Director',
      company: 'Midwest Career Alliance',
      experience: '15+ yrs exp',
      focus: ['Career Re-Entry', 'Skill Gap Bridging', 'Apprenticeships'],
      rating: 4.9,
      sessions: '320+ sessions',
      category: 'career',
      tag: 'Workforce Partner',
      quote: 'Transforming underemployment into high-demand technical pathways through targeted coaching.'
    }
  ];

  const filteredMentors = selectedTopic === 'all'
    ? mentors
    : mentors.filter(m => m.category === selectedTopic);

  return (
    <section className="py-24 bg-[#FAF9F6] dark:bg-[#111315] border-t border-stone-200/80 dark:border-stone-800/80 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/50 text-xs font-semibold text-[#0F766E] dark:text-teal-400">
              <Users className="w-3.5 h-3.5" />
              1-on-1 Mentorship & Peer Network
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-white tracking-tight font-display">
              Learn Directly from Senior Industry Practitioners
            </h2>
            <p className="text-base text-stone-600 dark:text-stone-300 font-sans">
              Connect with experienced engineers, hiring managers, and career strategists for mock interviews, resume feedback, and compensation coaching.
            </p>
          </div>

          <Link to="/community">
            <Button variant="outline" icon={<ArrowRight className="w-4 h-4" />}>
              Explore Mentorship Hub
            </Button>
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 font-sans text-xs">
          {[
            { id: 'all', label: 'All Mentors' },
            { id: 'swe', label: 'Software & Engineering' },
            { id: 'product', label: 'Product & Design' },
            { id: 'career', label: 'Career Transition & Negotiation' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedTopic(f.id as any)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                selectedTopic === f.id
                  ? 'bg-[#0F766E] text-white shadow-xs'
                  : 'bg-white dark:bg-[#1A1D20] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Masonry / Grid of Mentors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredMentors.map((mentor, i) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-7 rounded-[24px] bg-white dark:bg-[#1A1D20] border border-stone-200/90 dark:border-stone-800 shadow-xl flex flex-col justify-between space-y-5 card-hover-lift group relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-[#0F766E] dark:text-teal-300 text-[10px] font-mono font-bold border border-teal-200/60 dark:border-teal-800/40">
                    {mentor.tag}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                    <span>{mentor.rating}</span>
                    <span className="text-stone-400 font-normal">({mentor.sessions})</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white font-display">
                    {mentor.name}
                  </h3>
                  <p className="text-xs text-stone-500 font-sans mt-0.5">
                    {mentor.role} • <span className="font-semibold text-stone-700 dark:text-stone-300">{mentor.company}</span>
                  </p>
                  <p className="text-[11px] font-mono text-stone-400 mt-0.5">{mentor.experience}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-xs italic text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
                  "{mentor.quote}"
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-stone-400">Specialties:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.focus.map((f, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] font-sans font-medium">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <span className="text-[11px] text-stone-400 font-mono">1-on-1 Sessions Available</span>
                <Link to="/community">
                  <Button variant="ghost" size="sm" icon={<Calendar className="w-3.5 h-3.5" />}>
                    Book Prep
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-stone-100/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#0F766E] shrink-0" />
            <span className="text-stone-700 dark:text-stone-300">
              All mentors are manually vetted for verified industry experience and hiring committee participation.
            </span>
          </div>
          <Link to="/community" className="text-[#0F766E] dark:text-teal-400 font-bold hover:underline shrink-0">
            Apply to Become a Mentor →
          </Link>
        </div>

      </div>
    </section>
  );
};
