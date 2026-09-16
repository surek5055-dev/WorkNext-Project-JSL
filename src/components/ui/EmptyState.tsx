import React from 'react';
import { FolderOpen, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'Try adjusting your search or filters to find what you are looking for.',
  icon,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-[#0F766E] dark:text-teal-400 flex items-center justify-center mb-4">
        {icon || <FolderOpen className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-1 font-display">{title}</h3>
      <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mb-6 font-sans">{description}</p>
      {actionText && onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

interface PlaceholderCardProps {
  title: string;
  placeholderText: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  badgeText?: string;
  className?: string;
}

export const PlaceholderCard: React.FC<PlaceholderCardProps> = ({
  title,
  placeholderText,
  description,
  icon,
  actionText,
  onAction,
  badgeText = 'Integration Ready',
  className = ''
}) => {
  return (
    <div className={`p-8 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-4 text-center flex flex-col items-center justify-center min-h-[220px] ${className}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-[10px] font-mono font-semibold text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
          <Sparkles className="w-3 h-3 text-amber-500" />
          {badgeText}
        </span>
      </div>
      <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 flex items-center justify-center">
        {icon || <Sparkles className="w-6 h-6" />}
      </div>
      <div className="space-y-1 max-w-md">
        <h3 className="text-base font-bold text-stone-900 dark:text-white font-display">{title}</h3>
        <p className="text-sm font-semibold text-[#0F766E] dark:text-teal-400 font-sans">{placeholderText}</p>
        {description && <p className="text-xs text-stone-500 dark:text-stone-400 font-sans mt-1">{description}</p>}
      </div>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-2">
          {actionText}
        </Button>
      )}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  description = 'Unable to load data. Please check your internet connection and try again.',
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20">
      <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-200 mb-1">{title}</h3>
      <p className="text-sm text-rose-700/80 dark:text-rose-300/70 max-w-md mb-5">{description}</p>
      {onRetry && (
        <Button variant="danger" size="sm" icon={<RefreshCw className="w-4 h-4" />} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

