import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top of page"
      className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/30 transition-all duration-200 active:scale-90 hover:-translate-y-1"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};
