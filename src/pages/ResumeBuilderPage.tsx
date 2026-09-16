import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useApp } from '../context/AppContext';
import { createEmptyResume } from '../data/mockData';
import { Resume } from '../types';
import { Button } from '../components/ui/Button';
import { PlaceholderCard } from '../components/ui/EmptyState';
import { Sparkles, Download, CheckCircle, FileText, Layout, Upload, Target, Video, BarChart2, AlertCircle, Trash2, Plus, X } from 'lucide-react';

export interface ResumeBuilderPageProps {
  resume?: Resume;
  resumeAnalysis?: string;
  careerRecommendations?: string;
  skillGapReport?: string;
  mockInterviewFeedback?: string;
  onUploadResume?: (file: File) => void;
  onRunAiScan?: () => void;
}

export const ResumeBuilderPage: React.FC<ResumeBuilderPageProps> = ({
  resume: initialResume,
  resumeAnalysis: initialAnalysis,
  careerRecommendations: initialCareer,
  skillGapReport: initialGap,
  mockInterviewFeedback: initialInterview,
  onUploadResume,
  onRunAiScan
}) => {
  const {
    user,
    uploadResume,
    analyzeResumeWithAI,
    isAnalyzingResume,
    analysisError,
    clearAnalysisError,
    deleteResume
  } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeResume, setActiveResume] = useState<Resume>(() => initialResume || createEmptyResume(user));
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [newExpRole, setNewExpRole] = useState('');
  const [newExpCompany, setNewExpCompany] = useState('');
  const [newExpYears, setNewExpYears] = useState('');
  const [newExpHighlight, setNewExpHighlight] = useState('');
  const [showAddExp, setShowAddExp] = useState(false);

  const handleFileUpload = (file: File) => {
    // Validate file extension
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      setStatusNotice('Please select a valid PDF or DOC/DOCX resume file.');
      setTimeout(() => setStatusNotice(null), 4000);
      return;
    }

    const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      uploadResume(file.name, sizeMb, base64Data);
      if (onUploadResume) onUploadResume(file);
      setStatusNotice('Resume uploaded successfully. Click "Analyze Resume" to run AI evaluation.');
      setTimeout(() => setStatusNotice(null), 5000);
    };
    reader.onerror = () => {
      uploadResume(file.name, sizeMb);
      if (onUploadResume) onUploadResume(file);
      setStatusNotice('Resume uploaded successfully.');
      setTimeout(() => setStatusNotice(null), 5000);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // reset input so selecting the same file triggers change
    if (e.target) e.target.value = '';
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleAnalyzeResume = async () => {
    if (onRunAiScan) {
      onRunAiScan();
      return;
    }

    if (!user.resumeFileName && !user.resumeFileBase64) {
      setStatusNotice('Please upload a resume file first before running analysis.');
      setTimeout(() => setStatusNotice(null), 4000);
      return;
    }

    clearAnalysisError();
    const result = await analyzeResumeWithAI(activeResume.targetRole || user.title);
    if (result.success) {
      if (result.data?.extractedProfile) {
        const ep = result.data.extractedProfile;
        setActiveResume(prev => ({
          ...prev,
          targetRole: ep.targetRole || prev.targetRole,
          skills: ep.skills?.length ? Array.from(new Set([...prev.skills, ...ep.skills])) : prev.skills,
          experiences: ep.experiences && ep.experiences.length > 0 && prev.experiences.length === 0
            ? ep.experiences.map((e, idx) => ({
                id: `exp_ext_${idx}`,
                role: e.role,
                company: e.company,
                startDate: e.duration || '2023',
                endDate: 'Present',
                current: true,
                highlights: e.highlights && e.highlights.length > 0 ? e.highlights : ['Executed key responsibilities and team objectives.']
              }))
            : prev.experiences,
          education: ep.education && ep.education.length > 0 && prev.education.length === 0
            ? ep.education.map((edu, idx) => ({
                id: `edu_ext_${idx}`,
                institution: edu.institution,
                degree: edu.degree || 'Degree',
                field: edu.field || 'General',
                year: edu.year || '2022'
              }))
            : prev.education
        }));
      }
      setStatusNotice('Resume analyzed successfully. Skills, education, and target role extracted for job matching.');
      setTimeout(() => setStatusNotice(null), 6000);
    }
  };

  const handleAddExperience = () => {
    if (!newExpRole.trim() || !newExpCompany.trim()) return;
    const newEntry = {
      id: 'exp_' + Date.now(),
      role: newExpRole.trim(),
      company: newExpCompany.trim(),
      startDate: newExpYears || '2023',
      endDate: 'Present',
      highlights: newExpHighlight.trim() ? [newExpHighlight.trim()] : ['Executed core development deliverables and team projects.']
    };
    setActiveResume(prev => ({
      ...prev,
      experiences: [newEntry, ...prev.experiences]
    }));
    setNewExpRole('');
    setNewExpCompany('');
    setNewExpYears('');
    setNewExpHighlight('');
    setShowAddExp(false);
  };

  const handleRemoveExperience = (id: string) => {
    setActiveResume(prev => ({
      ...prev,
      experiences: prev.experiences.filter(e => e.id !== id)
    }));
  };

  const isAnalysisRequested = Boolean(user.analysisRequested);

  return (
    <DashboardLayout>
      <div className="space-y-8 font-sans">
        {/* Hidden File Input for PDF/DOC/DOCX selection */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/50 text-xs font-semibold text-[#0F766E] dark:text-teal-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] dark:bg-teal-400" />
              ATS Resume Optimizer & AI Tools
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-white mt-2 font-display">
              AI Resume Builder
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 font-sans">
              Build ATS-parsable resumes and receive automated skill and interview analysis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="md"
              icon={<Upload className="w-4 h-4" />}
              onClick={() => fileInputRef.current?.click()}
            >
              {user.resumeFileName ? 'Replace Resume' : 'Upload Resume'}
            </Button>

            <Button
              variant="primary"
              size="md"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={handleAnalyzeResume}
              disabled={isAnalyzingResume}
              className="bg-[#0F766E] hover:bg-[#0D655E]"
            >
              {isAnalyzingResume ? 'Analyzing Resume...' : 'Analyze Resume'}
            </Button>
          </div>
        </div>

        {/* Analysis Error Alert */}
        {analysisError && (
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start justify-between gap-4 text-rose-800 dark:text-rose-200 text-xs font-sans shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-sm">Resume Analysis Failed</p>
                <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">{analysisError}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAnalyzeResume}
                disabled={isAnalyzingResume}
                className="text-rose-700 dark:text-rose-200 border-rose-300 dark:border-rose-700 hover:bg-rose-100 dark:hover:bg-rose-900/50"
              >
                Retry Analysis
              </Button>
              <button
                onClick={clearAnalysisError}
                className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-500"
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Status Notification Banner */}
        <AnimatePresence>
          {statusNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-stone-900 text-white dark:bg-white dark:text-stone-900 text-xs flex items-center justify-between font-sans font-medium shadow-lg"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-teal-400 dark:text-[#0F766E] shrink-0" />
                <span>{statusNotice}</span>
              </div>
              <button
                className="font-bold cursor-pointer hover:opacity-80 ml-4 px-2 py-1"
                onClick={() => setStatusNotice(null)}
                aria-label="Close notification"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Functional Resume Upload Section */}
        <div className="p-6 sm:p-8 rounded-[24px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white font-display flex items-center gap-2.5">
                <Upload className="w-5 h-5 text-[#0F766E] dark:text-teal-400" />
                Resume Upload
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans mt-0.5">
                Select your PDF or DOC/DOCX resume file to evaluate compatibility and verify competencies.
              </p>
            </div>
            
            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                icon={<Upload className="w-3.5 h-3.5" />}
                onClick={() => fileInputRef.current?.click()}
              >
                {user.resumeFileName ? 'Choose Different File' : 'Upload Resume'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Sparkles className="w-3.5 h-3.5" />}
                onClick={handleAnalyzeResume}
                disabled={isAnalyzingResume}
                className="bg-[#0F766E] hover:bg-[#0D655E]"
              >
                {isAnalyzingResume ? 'Analyzing...' : 'Analyze Resume'}
              </Button>
            </div>
          </div>

          {/* Active Upload Card or Drag-and-Drop Area */}
          {user.resumeFileName ? (
            <div className="p-5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/90 dark:border-teal-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0F766E] dark:text-teal-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Resume uploaded successfully
                    </span>
                  </div>
                  <p className="font-bold text-sm text-stone-900 dark:text-white mt-0.5">
                    {user.resumeFileName}
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sans mt-0.5">
                    Uploaded: {user.resumeUploadedAt || 'Recently'} • Size: {user.resumeFileSize || '1.2 MB'} • Format: {user.resumeFileName.split('.').pop()?.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Sparkles className="w-3.5 h-3.5" />}
                  onClick={handleAnalyzeResume}
                  disabled={isAnalyzingResume}
                  className="bg-[#0F766E] hover:bg-[#0D655E]"
                >
                  {isAnalyzingResume ? 'Analyzing...' : 'Analyze Resume'}
                </Button>
                <button
                  onClick={deleteResume}
                  className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Remove uploaded resume"
                  aria-label="Remove resume"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-3 ${
                isDragging
                  ? 'border-[#0F766E] bg-teal-50/50 dark:bg-teal-950/30'
                  : 'border-stone-300 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/30 hover:border-[#0F766E]'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-stone-900 dark:text-white font-display">
                  Select your resume or drag and drop here
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                  Accepts PDF or DOC/DOCX files (Max 10MB)
                </p>
              </div>
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Upload className="w-3.5 h-3.5" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Upload Resume
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* AI Results Grid Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900 dark:text-white font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#0F766E] dark:text-teal-400" /> AI Career & Resume Intelligence
            </h2>
            <span className="text-xs font-mono text-stone-500 font-sans">
              {isAnalyzingResume
                ? 'AI Analysis Running...'
                : user.detailedAnalysis
                ? 'AI Analysis Complete'
                : isAnalysisRequested
                ? 'Analysis Requested'
                : 'Awaiting Resume Analysis'}
            </span>
          </div>

          {/* Live Loading State Banner */}
          {isAnalyzingResume && (
            <div className="p-8 rounded-[24px] bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 flex flex-col items-center justify-center text-center space-y-3 font-sans shadow-sm">
              <div className="w-10 h-10 border-3 border-[#0F766E] border-t-transparent rounded-full animate-spin" />
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white font-display">
                  Evaluating Resume with AI Intelligence Service
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 max-w-md mx-auto">
                  Running ATS compatibility scan, auditing skill gaps, extracting keywords, and calculating your career readiness score...
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Resume Analysis & ATS Compatibility */}
            {user.detailedAnalysis ? (
              <div className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0F766E]" />
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white font-display">
                      Resume Analysis & ATS Compatibility
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-[#0F766E] dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                    {user.detailedAnalysis.atsScore}/100 ATS Score
                  </span>
                </div>

                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-sans font-medium">
                  {user.detailedAnalysis.summary}
                </p>

                {/* Key Strengths */}
                {user.detailedAnalysis.strengths && user.detailedAnalysis.strengths.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-sans">
                      Verified Strengths
                    </p>
                    <ul className="space-y-1 text-xs text-stone-600 dark:text-stone-300 font-sans">
                      {user.detailedAnalysis.strengths.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Missing Keywords */}
                {user.detailedAnalysis.missingKeywords && user.detailedAnalysis.missingKeywords.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider font-sans">
                      Missing ATS Keywords
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {user.detailedAnalysis.missingKeywords.map((kw, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-mono font-medium"
                        >
                          +{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Formatting Issues */}
                {user.detailedAnalysis.formattingIssues && user.detailedAnalysis.formattingIssues.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider font-sans">
                      Formatting & Structure Issues
                    </p>
                    <ul className="space-y-1 text-xs text-stone-600 dark:text-stone-300 font-sans">
                      {user.detailedAnalysis.formattingIssues.map((issue, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-rose-500 font-bold shrink-0">•</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* High Impact Suggestions */}
                {user.detailedAnalysis.suggestions && user.detailedAnalysis.suggestions.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-bold text-[#0F766E] dark:text-teal-400 uppercase tracking-wider font-sans">
                      Optimization Suggestions
                    </p>
                    <ul className="space-y-1 text-xs text-stone-600 dark:text-stone-300 font-sans">
                      {user.detailedAnalysis.suggestions.map((sug, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#0F766E] dark:text-teal-400 font-bold shrink-0">{idx + 1}.</span>
                          <span>{sug}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : isAnalysisRequested ? (
              <div className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white font-display flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0F766E]" /> Resume Analysis
                  </h3>
                  <span className="text-[10px] bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 font-semibold px-2 py-0.5 rounded border border-amber-200/80 dark:border-amber-800/80">
                    AI Service Pending
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-sans font-medium">
                  {user.resumeAnalysis || 'Analysis will appear here after the AI service is connected.'}
                </p>
              </div>
            ) : (
              <PlaceholderCard
                title="Resume Analysis"
                placeholderText="No analysis available yet"
                description="Upload your resume and click 'Analyze Resume' to request an automated ATS keyword and formatting breakdown."
                badgeText="Pending Analysis"
                icon={<FileText className="w-6 h-6" />}
              />
            )}

            {/* 2. AI Career Recommendations */}
            {user.detailedAnalysis?.careerRecommendations && user.detailedAnalysis.careerRecommendations.length > 0 ? (
              <div className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#0F766E]" />
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white font-display">
                      AI Career Recommendations
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950 text-[#0F766E] dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                    {user.detailedAnalysis.careerRecommendations.length} Pathways
                  </span>
                </div>

                <div className="space-y-3 font-sans">
                  {user.detailedAnalysis.careerRecommendations.map((career, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-stone-900 dark:text-white">
                          {career.role}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950 text-[#0F766E] dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                          {career.matchRate}% Match
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                        {career.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : isAnalysisRequested ? (
              <div className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white font-display flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#0F766E]" /> AI Career Recommendations
                  </h3>
                  <span className="text-[10px] bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 font-semibold px-2 py-0.5 rounded border border-amber-200/80 dark:border-amber-800/80">
                    AI Service Pending
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-sans font-medium">
                  {user.careerRecommendations || 'Analysis will appear here after the AI service is connected.'}
                </p>
              </div>
            ) : (
              <PlaceholderCard
                title="Career Path Guidance"
                placeholderText="No analysis available yet"
                description="Upload your resume and click 'Analyze Resume' to receive targeted role pathways based on your background."
                badgeText="Pending Analysis"
                icon={<Target className="w-6 h-6" />}
              />
            )}

            {/* 3. Skill Gap Report */}
            {user.detailedAnalysis?.skillGaps && user.detailedAnalysis.skillGaps.length > 0 ? (
              <div className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-[#0F766E]" />
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white font-display">
                      Skill Gap Report
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950 text-[#0F766E] dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                    {user.detailedAnalysis.skillGaps.length} Gaps Detected
                  </span>
                </div>

                <div className="space-y-3 font-sans">
                  {user.detailedAnalysis.skillGaps.map((gap, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-stone-900 dark:text-white">
                          {gap.skill}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            gap.importance === 'Critical'
                              ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                              : gap.importance === 'Recommended'
                              ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                          }`}
                        >
                          {gap.importance}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                        {gap.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : isAnalysisRequested ? (
              <div className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white font-display flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-[#0F766E]" /> Skill Gap Report
                  </h3>
                  <span className="text-[10px] bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 font-semibold px-2 py-0.5 rounded border border-amber-200/80 dark:border-amber-800/80">
                    AI Service Pending
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-sans font-medium">
                  {user.skillGapReport || 'Analysis will appear here after the AI service is connected.'}
                </p>
              </div>
            ) : (
              <PlaceholderCard
                title="Competency Gap Audit"
                placeholderText="No analysis available yet"
                description="Upload your resume and click 'Analyze Resume' to compare your skills against market requirements."
                badgeText="Pending Analysis"
                icon={<BarChart2 className="w-6 h-6" />}
              />
            )}

            {/* 4. AI Mock Interview Feedback */}
            {user.detailedAnalysis?.interviewPreparation && user.detailedAnalysis.interviewPreparation.length > 0 ? (
              <div className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#0F766E]" />
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white font-display">
                      AI Mock Interview Feedback
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950 text-[#0F766E] dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                    Personalized Q&A
                  </span>
                </div>

                <div className="space-y-2.5 font-sans">
                  {user.detailedAnalysis.interviewPreparation.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 leading-relaxed flex items-start gap-2"
                    >
                      <span className="font-bold text-[#0F766E] dark:text-teal-400 shrink-0">
                        Q{idx + 1}:
                      </span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : isAnalysisRequested ? (
              <div className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white font-display flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#0F766E]" /> AI Mock Interview Feedback
                  </h3>
                  <span className="text-[10px] bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 font-semibold px-2 py-0.5 rounded border border-amber-200/80 dark:border-amber-800/80">
                    AI Service Pending
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-sans font-medium">
                  {user.interviewFeedback || 'Analysis will appear here after the AI service is connected.'}
                </p>
              </div>
            ) : (
              <PlaceholderCard
                title="Interview Readiness"
                placeholderText="No analysis available yet"
                description="Upload your resume and click 'Analyze Resume' to generate personalized interview questions."
                badgeText="Pending Analysis"
                icon={<Video className="w-6 h-6" />}
              />
            )}
          </div>
        </div>

        {/* Main Editor & Live Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Editor Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-8 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2.5 font-display">
                <FileText className="w-5 h-5 text-[#0F766E] dark:text-teal-400" /> Target Role & Summary
              </h2>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 font-sans">
                  Target Role Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={activeResume.targetRole}
                  onChange={e => setActiveResume({ ...activeResume, targetRole: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E] transition-colors font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 font-sans">
                  Executive Profile Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Summarize your core competencies and career achievements..."
                  value={activeResume.summary}
                  onChange={e => setActiveResume({ ...activeResume, summary: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E] font-sans leading-relaxed transition-colors"
                />
              </div>
            </div>

            {/* Experience list */}
            <div className="p-8 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2.5 font-display">
                  <Layout className="w-5 h-5 text-[#0F766E] dark:text-teal-400" /> Professional Experience
                </h2>
                <Button variant="outline" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setShowAddExp(!showAddExp)}>
                  {showAddExp ? 'Cancel' : 'Add Experience'}
                </Button>
              </div>

              {/* Add Experience Drawer/Form */}
              {showAddExp && (
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Role (e.g. Software Engineer)"
                      value={newExpRole}
                      onChange={e => setNewExpRole(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1A1A1A] text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={newExpCompany}
                      onChange={e => setNewExpCompany(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1A1A1A] text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Duration (e.g. 2022 - Present)"
                    value={newExpYears}
                    onChange={e => setNewExpYears(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1A1A1A] text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                  />
                  <input
                    type="text"
                    placeholder="Key accomplishment / highlight..."
                    value={newExpHighlight}
                    onChange={e => setNewExpHighlight(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1A1A1A] text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                  />
                  <Button variant="primary" size="sm" onClick={handleAddExperience} className="bg-[#0F766E] hover:bg-[#0D655E]">
                    Save Experience
                  </Button>
                </div>
              )}

              {activeResume.experiences.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-stone-200 dark:border-stone-800 text-center text-xs text-stone-500">
                  <p>No work experience added yet.</p>
                  <p className="text-[11px] text-stone-400 mt-1">Add your previous roles or upload your resume above.</p>
                </div>
              ) : (
                activeResume.experiences.map((exp) => (
                  <div key={exp.id} className="p-5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 space-y-2.5 font-sans relative">
                    <div className="flex justify-between items-center text-xs font-bold text-stone-900 dark:text-white">
                      <span>{exp.role} @ {exp.company}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-stone-500 font-normal text-[11px]">{exp.startDate} - {exp.endDate}</span>
                        <button
                          onClick={() => handleRemoveExperience(exp.id)}
                          className="text-stone-400 hover:text-rose-500 p-1"
                          aria-label="Remove role"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                      {exp.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Live Resume Document Preview */}
          <div className="lg:col-span-6">
            <div className="sticky top-24 p-8 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-6 min-h-[550px] text-stone-900 dark:text-white font-sans">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-4 text-center space-y-1">
                <h2 className="text-2xl font-extrabold tracking-tight text-stone-900 dark:text-white font-display uppercase">
                  {user?.name || 'Your Name'}
                </h2>
                <p className={`text-xs font-semibold tracking-wider uppercase font-sans ${
                  activeResume.targetRole ? 'text-[#0F766E] dark:text-teal-400' : 'text-stone-400 italic'
                }`}>
                  {activeResume.targetRole || 'Target Role Title'}
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sans">
                  {user?.location || 'Your Location'} • {user?.email || 'email@example.com'}
                </p>
              </div>

              {/* Summary */}
              <div>
                <h3 className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2 border-b border-stone-100 dark:border-stone-800 pb-1 font-sans">
                  Professional Summary
                </h3>
                <p className={`text-xs leading-relaxed font-sans ${
                  activeResume.summary ? 'text-stone-700 dark:text-stone-300' : 'text-stone-400 italic'
                }`}>
                  {activeResume.summary || 'Summary will appear here as you type in the editor.'}
                </p>
              </div>

              {/* Experience */}
              <div>
                <h3 className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3 border-b border-stone-100 dark:border-stone-800 pb-1 font-sans">
                  Work Experience
                </h3>
                {activeResume.experiences.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">Work experience entries will appear here.</p>
                ) : (
                  <div className="space-y-4">
                    {activeResume.experiences.map(exp => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-baseline text-xs font-bold text-stone-900 dark:text-white font-display">
                          <span>{exp.role} — <span className="font-normal text-stone-500 font-sans">{exp.company}</span></span>
                          <span className="text-[11px] text-stone-400 font-sans">{exp.startDate} - {exp.endDate}</span>
                        </div>
                        <ul className="mt-2 space-y-1.5 font-sans">
                          {exp.highlights.map((hl, i) => (
                            <li key={i} className="text-xs text-stone-600 dark:text-stone-300 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] dark:bg-teal-400 mt-1.5 shrink-0" />
                              <span>{hl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2 border-b border-stone-100 dark:border-stone-800 pb-1 font-sans">
                  Technical Core Competencies
                </h3>
                {(user.skills && user.skills.length > 0) || activeResume.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 font-sans">
                    {((user.skills && user.skills.length > 0) ? user.skills : activeResume.skills).map((s, idx) => (
                      <span key={idx} className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-400 italic">Add skills in your profile to display competencies here.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
