import React from 'react';
import { motion } from 'motion/react';
import { NotificationItem } from '../../types';
import { Sparkles, Briefcase, Calendar, CheckCircle2, Bell } from 'lucide-react';

interface NotificationCardProps {
  notification: NotificationItem;
  onRead: (id: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onRead }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'match':
        return <Sparkles className="w-4 h-4 text-[#0F766E] dark:text-teal-400" />;
      case 'application':
        return <Briefcase className="w-4 h-4 text-[#0F766E] dark:text-teal-400" />;
      case 'interview':
        return <Calendar className="w-4 h-4 text-[#0F766E] dark:text-teal-400" />;
      case 'mentor':
        return <CheckCircle2 className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-stone-400" />;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => onRead(notification.id)}
      className={`p-5 rounded-xl transition-all cursor-pointer border ${
        notification.read
          ? 'bg-stone-50/50 dark:bg-stone-900/50 border-stone-200/80 dark:border-stone-800/80 text-stone-600 dark:text-stone-400'
          : 'bg-white dark:bg-[#1A1A1A] border border-teal-200/90 dark:border-teal-800 text-stone-900 dark:text-white shadow-xs'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0 font-sans">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="text-xs font-bold font-display truncate">{notification.title}</h4>
            <span className="text-[10px] text-stone-400 font-sans shrink-0">{notification.timestamp}</span>
          </div>
          <p className="text-xs leading-relaxed text-stone-600 dark:text-stone-300 font-sans">{notification.message}</p>
        </div>
      </div>
    </motion.div>
  );
};
