import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { mockFAQs } from '../../data/mockData';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string>('faq_1');

  const toggle = (id: string) => {
    setOpenId(prev => (prev === id ? '' : id));
  };

  return (
    <section className="py-24 bg-[#F7F6F3] dark:bg-[#111111] text-[#1F2937] dark:text-stone-100 relative overflow-hidden transition-colors border-t border-stone-200/80 dark:border-stone-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/50 text-xs font-semibold text-[#0F766E] dark:text-teal-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] dark:bg-teal-400" />
            Clear Answers
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight font-display">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-stone-600 dark:text-stone-300 leading-relaxed max-w-xl mx-auto font-sans">
            Everything you need to know about WorkNext candidate tools, recruiter tools, and privacy guarantees.
          </p>
        </div>

        <div className="space-y-4">
          {mockFAQs.map(faq => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`rounded-[20px] border transition-colors overflow-hidden ${
                  isOpen
                    ? 'bg-white dark:bg-[#1A1A1A] border-teal-600/40 dark:border-teal-500/40 shadow-sm'
                    : 'bg-white dark:bg-[#1A1A1A] border-stone-200/90 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                >
                  <span className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-3 font-display">
                    <HelpCircle className={`w-5 h-5 shrink-0 transition-colors ${isOpen ? 'text-[#0F766E] dark:text-teal-400' : 'text-stone-400'}`} />
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#0F766E] dark:text-teal-400' : 'text-stone-500'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800/80 font-sans">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
