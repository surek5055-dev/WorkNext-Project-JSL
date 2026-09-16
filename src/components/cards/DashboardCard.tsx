import React from 'react';
import { motion } from 'motion/react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  color?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtext,
  change,
  isPositive = true,
  icon,
}) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs relative group overflow-hidden transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-sans">
          {title}
        </span>
        <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/40 flex items-center justify-center">
          {icon}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight font-display">
          {value}
        </h2>
        {change && (
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border font-sans ${
              isPositive
                ? 'bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 border-teal-200 dark:border-teal-800'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
            }`}
          >
            {change}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 font-sans font-normal">
          {subtext}
        </p>
      )}
    </motion.div>
  );
};
