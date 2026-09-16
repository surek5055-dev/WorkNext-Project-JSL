import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '../ui/Button';

export const CallToActionSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#FAF9F6] dark:bg-[#111315] relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[32px] bg-gradient-to-br from-[#0F766E] via-[#0D655E] to-[#114B46] text-white p-8 sm:p-14 lg:p-16 relative overflow-hidden shadow-2xl border border-teal-700/50"
        >
          {/* Ambient Gold Glow Corner */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#D4A017]/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-400/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-3xl space-y-6 relative z-10 text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-semibold text-teal-100">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />
              <span>Free for Students, Graduates & Job Seekers</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.08]">
              Ready to Accelerate Your Career Trajectory?
            </h2>

            <p className="text-base sm:text-lg text-teal-100/90 leading-relaxed max-w-2xl font-sans">
              Join thousands of job seekers using WorkNext to optimize resumes, bridge skill gaps, and land higher-paying roles with verified wage transparency.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link to="/signup">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto bg-white text-[#0F766E] hover:bg-teal-50 font-bold py-4 px-8 rounded-[16px] shadow-lg text-base"
                >
                  Create Free Account
                </Button>
              </Link>

              <Link to="/jobs">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 py-4 px-7 rounded-[16px] text-base"
                >
                  Explore Jobs First
                </Button>
              </Link>
            </div>

            <div className="pt-6 border-t border-teal-600/60 flex flex-wrap items-center gap-6 text-xs text-teal-100/80 font-sans">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4A017]" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-300" />
                <span>Instant 2-Minute Setup</span>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
