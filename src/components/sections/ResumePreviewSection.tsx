import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, Sparkles, ArrowRight, Upload, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';

export const ResumePreviewSection: React.FC = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<'keywords' | 'formatting' | 'impact'>('keywords');

  return (
    <section className="py-24 bg-white/50 dark:bg-[#16191C]/50 border-t border-stone-200/80 dark:border-stone-800/80 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/50 text-xs font-semibold text-[#0F766E] dark:text-teal-400">
              <FileText className="w-3.5 h-3.5" />
              Live ATS Resume Optimizer
            </span>

            <h2 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-white tracking-tight font-display leading-[1.12]">
              Pass Every Screener. <br />
              <span className="text-[#0F766E] dark:text-teal-400">Get More Interviews.</span>
            </h2>

            <p className="text-base text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
              Most resumes are rejected by automated ATS screeners before a human ever sees them. WorkNext parses your resume against live job descriptions, scores compatibility, and suggests precise bullet-point rewrites.
            </p>

            <div className="space-y-3 pt-2 font-sans text-sm text-stone-700 dark:text-stone-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0F766E] dark:text-teal-400 shrink-0" />
                <span>1-Click PDF & DOCX Export</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0F766E] dark:text-teal-400 shrink-0" />
                <span>Quantified Impact Bullet Point Generator</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0F766E] dark:text-teal-400 shrink-0" />
                <span>Job Description Keyword Matcher</span>
              </div>
            </div>

            <div className="pt-3">
              <Link to="/resume">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-4 h-4" />}
                  className="bg-[#0F766E] hover:bg-[#0D655E] text-white py-3.5 px-7 rounded-[16px] shadow-md shadow-teal-900/15"
                >
                  {user.hasAnalyzedResume ? 'View Your Resume Analysis →' : 'Build Your Resume Free →'}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Live/Empty Resume Visual */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-[24px] bg-white dark:bg-[#1A1D20] border border-stone-200/90 dark:border-stone-800 shadow-2xl p-6 sm:p-8 space-y-6 card-hover-lift"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-stone-900 dark:text-white font-display">
                      {user.resumeFileName ? user.resumeFileName : 'Resume ATS Analyzer'}
                    </h4>
                    <p className="text-xs text-stone-500 font-sans">
                      {user.resumeFileName
                        ? `Uploaded ${user.resumeUploadedAt || 'recently'} • ${user.resumeFileSize || '1.2 MB'}`
                        : 'No resume uploaded yet'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-2xl font-black text-stone-500 dark:text-stone-400 font-display">
                      {user.atsScore ? user.atsScore : '--'}
                    </span>
                    <span className="text-[10px] text-stone-400 block font-mono">/ 100 ATS</span>
                  </div>
                </div>
              </div>

              {!user.resumeFileName ? (
                <div className="p-8 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-dashed border-stone-200 dark:border-stone-800 text-center space-y-4 font-sans">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-stone-900 dark:text-white font-display">
                      Upload your resume to get started
                    </h5>
                    <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                      Supports PDF, DOC, and DOCX files. Select your resume to view compatibility.
                    </p>
                  </div>
                  <Link to="/resume">
                    <Button variant="primary" size="sm" className="bg-[#0F766E] hover:bg-[#0D655E]">
                      Upload Resume
                    </Button>
                  </Link>
                </div>
              ) : user.analysisRequested ? (
                <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 text-center space-y-2 font-sans">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    AI Service Pending
                  </p>
                  <p className="text-sm font-bold text-stone-900 dark:text-white font-display">
                    Analysis will appear here after the AI service is connected.
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto">
                    A live AI service integration is required to parse resume text and compute compatibility.
                  </p>
                  <div className="pt-2">
                    <Link to="/resume">
                      <Button variant="outline" size="sm">
                        Manage Resume
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 text-center space-y-3 font-sans">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900 text-[#0F766E] dark:text-teal-300 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resume uploaded successfully
                  </div>
                  <p className="text-sm font-bold text-stone-900 dark:text-white font-display">
                    {user.resumeFileName}
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Click 'Analyze Resume' in the Resume Builder to request analysis.
                  </p>
                  <Link to="/resume">
                    <Button variant="primary" size="sm" className="bg-[#0F766E] hover:bg-[#0D655E]">
                      Analyze Resume
                    </Button>
                  </Link>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-stone-500 font-sans">
                <span>Real-Time ATS Evaluator</span>
                <Link to="/resume" className="text-[#0F766E] dark:text-teal-400 font-bold hover:underline">
                  Open Resume Builder →
                </Link>
              </div>

            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
};
