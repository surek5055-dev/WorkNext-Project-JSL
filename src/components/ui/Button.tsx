import React, { ButtonHTMLAttributes } from 'react';
import { motion } from 'motion/react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent' | 'glass' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-[18px] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none relative overflow-hidden group cursor-pointer';

  const variants = {
    primary: 'bg-[#0F766E] hover:bg-[#0D655E] text-white shadow-md shadow-teal-900/15 border border-teal-600/30 focus:ring-teal-700',
    secondary: 'bg-[#1F2937] hover:bg-[#111827] text-white shadow-md shadow-slate-900/10 border border-slate-700/30 focus:ring-slate-800',
    accent: 'bg-[#C9A227] hover:bg-[#B59120] text-slate-950 shadow-md shadow-amber-900/10 border border-amber-500/30 font-bold focus:ring-amber-600',
    gradient: 'bg-gradient-to-r from-[#0F766E] to-teal-800 hover:from-[#0D655E] hover:to-teal-900 text-white shadow-lg shadow-teal-900/20 border border-white/20 focus:ring-teal-700',
    glass: 'bg-white/80 dark:bg-stone-900/80 hover:bg-white dark:hover:bg-stone-900 text-[#1F2937] dark:text-stone-100 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-sm',
    outline: 'border border-stone-300 dark:border-stone-700 hover:border-[#0F766E] dark:hover:border-teal-500 hover:bg-teal-500/10 text-[#1F2937] dark:text-stone-200 focus:ring-teal-600',
    ghost: 'hover:bg-stone-200/60 dark:hover:bg-stone-800/70 text-[#1F2937] dark:text-stone-200 focus:ring-stone-400',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 border border-rose-500/30 focus:ring-rose-500'
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5 rounded-xl',
    md: 'px-5 py-2.5 text-sm gap-2 rounded-2xl',
    lg: 'px-7 py-3.5 text-base gap-3 rounded-2xl font-bold tracking-tight'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled}
      {...(props as any)}
    >
      {/* Light shimmer hover effect */}
      <span className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />

      {icon && iconPosition === 'left' && (
        <span className="shrink-0 group-hover:scale-110 transition-transform duration-200">{icon}</span>
      )}
      <span className="relative z-10">{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="shrink-0 group-hover:translate-x-0.5 transition-transform duration-200">{icon}</span>
      )}
    </motion.button>
  );
};

