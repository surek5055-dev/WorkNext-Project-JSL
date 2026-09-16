import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useApp } from '../context/AppContext';
import { Eye, Globe, Bell, Moon, Sun, Save, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const SettingsPage: React.FC = () => {
  const {
    theme,
    toggleTheme,
    language,
    setLanguage,
    fontSize,
    setFontSize,
    highContrast,
    toggleHighContrast
  } = useApp();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [matchNotifications, setMatchNotifications] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/50 text-xs font-semibold text-[#0F766E] dark:text-teal-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] dark:bg-teal-400" />
            System Preferences
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-white mt-2 font-display">
            Global Settings
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 font-sans">
            Manage accessibility features, theme palette, language localization, and notification rules.
          </p>
        </div>

        <AnimatePresence>
          {savedSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-[#0F766E] dark:text-teal-300 text-xs font-sans font-medium flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F766E] dark:text-teal-400 shrink-0" />
                <span>Settings saved successfully across session state!</span>
              </div>
              <span className="font-bold cursor-pointer hover:opacity-80" onClick={() => setSavedSuccess(false)}>✕</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSave} className="space-y-6 font-sans">
          {/* Appearance & Theme */}
          <div className="p-8 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2.5 font-display">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-[#0F766E] dark:text-teal-400" /> : <Sun className="w-5 h-5 text-amber-500" />} Appearance & Visual Theme
            </h2>

            <div className="flex items-center justify-between p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800">
              <div>
                <p className="text-xs font-bold text-stone-900 dark:text-white font-display">Color Palette Mode</p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sans mt-0.5">Currently operating in {theme} mode</p>
              </div>
              <Button variant="outline" size="sm" type="button" onClick={toggleTheme}>
                Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
              </Button>
            </div>
          </div>

          {/* Accessibility Settings */}
          <div className="p-8 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2.5 font-display">
              <Eye className="w-5 h-5 text-[#0F766E] dark:text-teal-400" /> Accessibility & Legibility
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2 font-sans">
                  Display Font Scale
                </label>
                <div className="grid grid-cols-3 gap-3 max-w-md font-sans">
                  <button
                    type="button"
                    onClick={() => setFontSize('normal')}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      fontSize === 'normal'
                        ? 'bg-[#0F766E] text-white border-teal-600 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    Normal (100%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize('large')}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      fontSize === 'large'
                        ? 'bg-[#0F766E] text-white border-teal-600 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    Large (112%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize('extralarge')}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      fontSize === 'extralarge'
                        ? 'bg-[#0F766E] text-white border-teal-600 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    X-Large (125%)
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 font-sans">
                <div>
                  <p className="text-xs font-bold text-stone-900 dark:text-white font-display">High Contrast UI Filter</p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sans mt-0.5">Sharpen element borders and contrast ratios</p>
                </div>
                <button
                  type="button"
                  onClick={toggleHighContrast}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    highContrast ? 'bg-[#0F766E]' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                      highContrast ? 'left-6.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Localization & Language */}
          <div className="p-8 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2.5 font-display">
              <Globe className="w-5 h-5 text-[#0F766E] dark:text-teal-400" /> UI Language Selection
            </h2>

            <div className="max-w-xs text-xs font-sans">
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
              >
                <option value="en">English (US)</option>
                <option value="es">Español (Spanish)</option>
                <option value="fr">Français (French)</option>
                <option value="de">Deutsch (German)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>

          {/* Notification Alerts */}
          <div className="p-8 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2.5 font-display">
              <Bell className="w-5 h-5 text-[#0F766E] dark:text-teal-400" /> Notification Rules
            </h2>

            <div className="space-y-3 text-xs font-sans">
              <label className="flex items-center justify-between p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 cursor-pointer">
                <div>
                  <p className="font-bold text-stone-900 dark:text-white font-display">Email High-Match Job Alerts</p>
                  <p className="text-stone-500 dark:text-stone-400 text-xs mt-0.5">Notify when jobs with 90%+ match score appear in my ZIP code</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={e => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 text-[#0F766E] focus:ring-[#0F766E] rounded border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 cursor-pointer">
                <div>
                  <p className="font-bold text-stone-900 dark:text-white font-display">Application & Interview Updates</p>
                  <p className="text-stone-500 dark:text-stone-400 text-xs mt-0.5">Receive real-time notifications for employer interview requests</p>
                </div>
                <input
                  type="checkbox"
                  checked={matchNotifications}
                  onChange={e => setMatchNotifications(e.target.checked)}
                  className="w-4 h-4 text-[#0F766E] focus:ring-[#0F766E] rounded border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </label>
            </div>
          </div>

          <div className="text-right font-sans">
            <Button variant="primary" size="md" icon={<Save className="w-4 h-4" />} type="submit" className="bg-[#0F766E] hover:bg-[#0D655E]">
              Save All Preferences
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
