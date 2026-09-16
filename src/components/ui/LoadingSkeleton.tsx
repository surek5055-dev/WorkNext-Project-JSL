import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'job' | 'profile' | 'table' | 'text';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'card',
  count = 1
}) => {
  const items = Array.from({ length: count });

  const renderSkeleton = () => {
    switch (type) {
      case 'job':
        return (
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
              </div>
            </div>
            <div className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded-xl" />
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse space-y-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-3 flex-1">
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 animate-pulse space-y-3">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
            <div className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded-lg w-full" />
            <div className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded-lg w-full" />
            <div className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded-lg w-full" />
          </div>
        );

      default:
        return (
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse space-y-4">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
          </div>
        );
    }
  };

  return (
    <div className="grid gap-4">
      {items.map((_, i) => (
        <React.Fragment key={i}>{renderSkeleton()}</React.Fragment>
      ))}
    </div>
  );
};
