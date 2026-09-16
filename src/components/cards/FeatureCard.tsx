import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  color?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  badge,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="p-8 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs hover:shadow-md transition-all duration-300 relative group flex flex-col justify-between h-full overflow-hidden cursor-pointer"
    >
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 flex items-center justify-center border border-teal-200/60 dark:border-teal-800/40 group-hover:scale-105 transition-transform">
            {icon}
          </div>
          {badge && (
            <span className="text-[11px] font-sans font-semibold px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-900 text-[#0F766E] dark:text-teal-400 border border-stone-200 dark:border-stone-800">
              {badge}
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-3 font-display flex items-center justify-between">
          <span>{title}</span>
          <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#0F766E] dark:group-hover:text-teal-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </h3>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans font-normal">
          {description}
        </p>
      </div>

      <div className="mt-8 pt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center text-xs font-semibold text-[#0F766E] dark:text-teal-400 group-hover:translate-x-1 transition-transform font-sans">
        <span>Explore Module →</span>
      </div>
    </motion.div>
  );
};
