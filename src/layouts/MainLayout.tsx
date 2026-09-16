import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { NotificationDrawer } from '../components/common/NotificationDrawer';
import { GlobalSearchModal } from '../components/common/GlobalSearchModal';
import { ScrollToTop } from '../components/common/ScrollToTop';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] dark:bg-[#111315] text-[#16181A] dark:text-stone-100 font-sans transition-colors">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <NotificationDrawer />
      <GlobalSearchModal />
      <ScrollToTop />
    </div>
  );
};
