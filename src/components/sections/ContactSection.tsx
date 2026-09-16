import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-24 bg-[#F7F6F3] dark:bg-[#111111] text-[#1F2937] dark:text-stone-100 relative overflow-hidden transition-colors border-t border-stone-200/80 dark:border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/50 text-xs font-semibold text-[#0F766E] dark:text-teal-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] dark:bg-teal-400" />
              Connect With Us
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight font-display leading-tight">
              Partner with WorkNext
            </h2>
            <p className="text-base text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
              Are you an employer seeking pre-vetted talent, a university career counselor, or a regional workforce agency? Contact our strategic advisory team today.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4 p-4 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs">
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/40">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">Email Advisor</p>
                  <p className="text-sm font-bold text-stone-900 dark:text-white font-display">partnerships@worknext.ai</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs">
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/40">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">Regional Helpline</p>
                  <p className="text-sm font-bold text-stone-900 dark:text-white font-display">+1 (800) 555-WORK</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs">
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/40">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">Innovation Center</p>
                  <p className="text-sm font-bold text-stone-900 dark:text-white font-display">Chicago, IL • San Francisco, CA</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-white dark:bg-[#1A1A1A] p-8 sm:p-10 rounded-[20px] border border-stone-200/90 dark:border-stone-800 shadow-xs"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 flex items-center justify-center mx-auto border border-teal-200 dark:border-teal-800">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-stone-900 dark:text-white font-display">Inquiry Received!</h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto font-sans">
                  Thank you for reaching out. A WorkNext advisor will evaluate your request and get back to you within 24 hours.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Inquiry
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5 font-sans">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-sm text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-[#0F766E] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5 font-sans">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-sm text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-[#0F766E] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5 font-sans">
                    Subject / Category
                  </label>
                  <select
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E] transition-colors"
                  >
                    <option value="">Select interest area</option>
                    <option value="Job Seeker Assistance">Job Seeker Career Coaching</option>
                    <option value="Recruiter Hiring">Employer / Recruiter Portal</option>
                    <option value="Government Grant">Municipal Workforce Agency</option>
                    <option value="General Inquiry">General Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5 font-sans">
                    Message Detail
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your team or career goals..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-sm text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-[#0F766E] transition-colors"
                  />
                </div>

                <Button variant="primary" size="lg" icon={<Send className="w-4 h-4" />} type="submit" fullWidth className="bg-[#0F766E] hover:bg-[#0D655E]">
                  Send Inquiry
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
