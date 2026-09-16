import React from 'react';
import { motion } from 'motion/react';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { Footer } from '../components/common/Footer';
import { NotificationDrawer } from '../components/common/NotificationDrawer';
import { GlobalSearchModal } from '../components/common/GlobalSearchModal';
import { ScrollToTop } from '../components/common/ScrollToTop';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] dark:bg-slate-950 text-stone-900 dark:text-slate-100 font-sans relative overflow-x-hidden selection:bg-teal-500/30 selection:text-teal-900 dark:selection:text-teal-200 transition-colors duration-300">
      {/* Dynamic Animated Glowing Ambient Mesh Backdrops */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.08, 0.18, 0.08],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/15 dark:bg-blue-600/30 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.06, 0.14, 0.06],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-amber-500/10 dark:bg-indigo-600/25 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.05, 0.12, 0.05],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute -bottom-20 left-1/3 w-[28rem] h-[28rem] bg-emerald-500/10 dark:bg-purple-600/20 rounded-full blur-[130px]"
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-15" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
          <Sidebar />
          <motion.main
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 min-w-0"
          >
            {children}
          </motion.main>
        </div>
        <Footer />
        <NotificationDrawer />
        <GlobalSearchModal />
        <ScrollToTop />
      </div>
    </div>
  );
};
