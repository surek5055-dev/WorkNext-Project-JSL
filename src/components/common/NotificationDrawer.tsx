import React from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationCard } from '../cards/NotificationCard';
import { X, Bell, CheckCheck, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

export const NotificationDrawer: React.FC = () => {
  const { notifications, notificationsOpen, setNotificationsOpen, markNotificationRead, clearAllNotifications, unreadCount } = useApp();

  if (!notificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">Notifications</h3>
              <p className="text-xs text-slate-500">{unreadCount} unread update{unreadCount === 1 ? '' : 's'}</p>
            </div>
          </div>
          <button
            onClick={() => setNotificationsOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Actions */}
        {notifications.length > 0 && (
          <div className="p-3 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
            <button
              onClick={clearAllNotifications}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map(notif => (
              <NotificationCard key={notif.id} notification={notif} onRead={markNotificationRead} />
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
          <Button variant="outline" size="sm" fullWidth onClick={() => setNotificationsOpen(false)}>
            Close Panel
          </Button>
        </div>
      </div>
    </div>
  );
};
