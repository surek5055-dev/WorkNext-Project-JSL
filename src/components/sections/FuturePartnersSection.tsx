import React from 'react';
import { motion } from 'motion/react';
import { Building2, GraduationCap, Briefcase, Award, Sparkles, Clock } from 'lucide-react';

export const FuturePartnersSection: React.FC = () => {
  const partners = [
    {
      title: 'Company Logo',
      subtitle: 'Corporate Hiring Partner',
      icon: <Building2 className="w-7 h-7 text-stone-400 dark:text-stone-500" />,
      status: 'Coming Soon',
      description: 'Future integration for direct entry-level applications and corporate recruitment pipelines.'
    },
    {
      title: 'Partner Logo',
      subtitle: 'University & College Network',
      icon: <GraduationCap className="w-7 h-7 text-stone-400 dark:text-stone-500" />,
      status: 'Future Integration',
      description: 'Academic partner connection for campus recruiting and graduate transition programs.'
    },
    {
      title: 'Recruiter Partner',
      subtitle: 'Talent Acquisition Network',
      icon: <Briefcase className="w-7 h-7 text-stone-400 dark:text-stone-500" />,
      status: 'Coming Soon',
      description: 'Verified recruiter partnerships to connect job seekers with skill-matched openings.'
    },
    {
      title: 'Training Partner',
      subtitle: 'Vocational & Upskilling Provider',
      icon: <Award className="w-7 h-7 text-stone-400 dark:text-stone-500" />,
      status: 'Future Integration',
      description: 'Certification and micro-credential providers to bridge identified skill gaps.'
    }
  ];

  return (
    <section className="py-24 bg-[#F7F6F3] dark:bg-[#111111] text-[#1F2937] dark:text-stone-100 relative overflow-hidden transition-colors border-t border-stone-200/80 dark:border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/50 text-xs font-semibold text-[#0F766E] dark:text-teal-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Ecosystem Roadmaps
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight font-display">
            Future Industry Partners
          </h2>
          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl mx-auto font-sans">
            Designed to help students, fresh graduates, and job seekers connect directly with upcoming hiring, academic, and training networks.
          </p>
        </div>

        {/* Placeholder Partner Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map((partner, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-6 transition-all group"
            >
              <div className="space-y-4">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-[10px] font-sans font-semibold text-stone-600 dark:text-stone-400 border border-stone-200/80 dark:border-stone-700/80">
                    <Clock className="w-3 h-3 text-amber-500" />
                    {partner.status}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">INTEGRATION</span>
                </div>

                {/* Placeholder Box Visual */}
                <div className="w-full h-28 rounded-xl bg-stone-50 dark:bg-stone-900/80 border border-dashed border-stone-300 dark:border-stone-700 flex flex-col items-center justify-center p-3 text-center space-y-2 group-hover:border-[#0F766E]/50 transition-colors">
                  <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800">
                    {partner.icon}
                  </div>
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300 font-display">
                    {partner.title}
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider font-sans mb-1">
                    {partner.subtitle}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                    {partner.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[11px] font-sans text-stone-400">
                <span>Status</span>
                <span className="font-semibold text-stone-600 dark:text-stone-300">Placeholder Card</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note banner */}
        <div className="mt-12 p-4 rounded-2xl bg-stone-100/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-center text-xs text-stone-600 dark:text-stone-400 font-sans max-w-2xl mx-auto">
          💡 WorkNext is an open workforce platform. Partner APIs and verified recruiter profiles will be onboarded in upcoming releases.
        </div>

      </div>
    </section>
  );
};
