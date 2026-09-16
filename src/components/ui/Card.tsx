import React, { HTMLAttributes } from 'react';
import { motion } from 'motion/react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'bordered' | 'flat' | 'gradient';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-3xl transition-all duration-300 overflow-hidden relative group';

  const variants = {
    default: 'bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none backdrop-blur-xl',
    glass: 'glass-card shadow-2xl backdrop-blur-2xl',
    bordered: 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800',
    flat: 'bg-slate-100/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60',
    gradient: 'bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 text-white shadow-2xl'
  };

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, transition: { duration: 0.2, ease: 'easeOut' } } : undefined}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...(props as any)}
    >
      {/* Subtle top glow highlight on hover */}
      {hoverEffect && (
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      {children}
    </motion.div>
  );
};

