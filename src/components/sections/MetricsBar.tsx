import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Target, Zap, Globe, Sparkles } from 'lucide-react';

export const MetricsBar: React.FC = () => {
  const pillars = [
    {
      pillar: 'Pan-India Reach',
      label: 'Regional Tech Hubs',
      sub: 'Openings spanning Bengaluru, Hyderabad, Pune, NCR & Tier 2 cities',
      icon: Globe,
      badge: 'National'
    },
    {
      pillar: 'ATS Architecture',
      label: 'Enterprise Format',
      sub: 'Single-column semantic hierarchy tested against major hiring algorithms',
      icon: ShieldCheck,
      badge: 'Standard'
    },
    {
      pillar: 'Skill Gap Radar',
      label: 'Real-Time Insights',
      sub: 'Live diagnostic mapping directly against current industry job specs',
      icon: Zap,
      badge: 'Diagnostics'
    },
    {
      pillar: 'Open & Free',
      label: 'Student Centric',
      sub: 'Zero paywalls on resume auditing, job discovery and growth roadmaps',
      icon: Sparkles,
      badge: 'Accessible'
    }
  ];

  return (
    <section className="py-10 bg-[#0A0F0D] border-y border-white/[0.07] transition-colors relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: true }}
                className="p-5 rounded-[18px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-emerald-500/30 transition-all duration-300 group space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-emerald-950/60 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/40">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono tracking-wider uppercase font-semibold text-stone-400 bg-white/[0.05] px-2 py-0.5 rounded border border-white/10">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-display text-white tracking-tight">
                    {item.pillar}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-400 font-mono mt-0.5">
                    {item.label}
                  </p>
                  <p className="text-xs text-stone-400 font-sans mt-1.5 leading-relaxed">
                    {item.sub}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
