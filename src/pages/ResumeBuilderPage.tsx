import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useApp } from '../context/AppContext';
import { createEmptyResume } from '../data/mockData';
import { Resume, ResumeSectionEducation } from '../types';
import { Button } from '../components/ui/Button';
import { PlaceholderCard } from '../components/ui/EmptyState';
import {
  Sparkles,
  Download,
  CheckCircle,
  FileText,
  Layout,
  Upload,
  Target,
  Video,
  BarChart2,
  AlertCircle,
  Trash2,
  Plus,
  X,
  Palette,
  Printer,
  FileDown,
  Eye,
  SlidersHorizontal,
  BookOpen,
  GraduationCap,
  Check,
  Columns,
  Layers,
  Type
} from 'lucide-react';

export type ResumeTemplateId = 'ats_classic' | 'modern_executive' | 'tech_minimalist' | 'creative_compact';
export type ResumeFontPairing = 'sans' | 'serif' | 'mono';
export type ResumeDensity = 'compact' | 'balanced' | 'spacious';

export interface ResumeDesignConfig {
  template: ResumeTemplateId;
  accentColor: string;
  fontPairing: ResumeFontPairing;
  density: ResumeDensity;
}

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

  // Redesign Configuration State
  const [designConfig, setDesignConfig] = useState<ResumeDesignConfig>({
    template: 'ats_classic',
    accentColor: '#0F766E',
    fontPairing: 'sans',
    density: 'balanced'
  });
  const [showRedesignStudio, setShowRedesignStudio] = useState(false);

  // Experience Form State
  const [newExpRole, setNewExpRole] = useState('');
  const [newExpCompany, setNewExpCompany] = useState('');
  const [newExpYears, setNewExpYears] = useState('');
  const [newExpHighlight, setNewExpHighlight] = useState('');
  const [showAddExp, setShowAddExp] = useState(false);

  // Education Form State
  const [newEduInstitution, setNewEduInstitution] = useState('');
  const [newEduDegree, setNewEduDegree] = useState('');
  const [newEduField, setNewEduField] = useState('');
  const [newEduYear, setNewEduYear] = useState('');
  const [showAddEdu, setShowAddEdu] = useState(false);

  // Quick Skill Form State
  const [newSkillInput, setNewSkillInput] = useState('');

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

  const handleAddEducation = () => {
    if (!newEduInstitution.trim() || !newEduDegree.trim()) return;
    const newEdu: ResumeSectionEducation = {
      id: 'edu_' + Date.now(),
      institution: newEduInstitution.trim(),
      degree: newEduDegree.trim(),
      field: newEduField.trim() || 'General Studies',
      year: newEduYear.trim() || '2024'
    };
    setActiveResume(prev => ({
      ...prev,
      education: [...(prev.education || []), newEdu]
    }));
    setNewEduInstitution('');
    setNewEduDegree('');
    setNewEduField('');
    setNewEduYear('');
    setShowAddEdu(false);
  };

  const handleRemoveEducation = (id: string) => {
    setActiveResume(prev => ({
      ...prev,
      education: (prev.education || []).filter(e => e.id !== id)
    }));
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    const skillName = newSkillInput.trim();
    if (!activeResume.skills.includes(skillName)) {
      setActiveResume(prev => ({
        ...prev,
        skills: [...prev.skills, skillName]
      }));
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setActiveResume(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  // PDF Export Trigger
  const handleExportPDF = () => {
    window.print();
  };

  // ATS Plain Text File Download
  const handleDownloadText = () => {
    const skillsList = ((user.skills && user.skills.length > 0) ? user.skills : activeResume.skills).join(', ');
    const content = [
      (user?.name || 'Your Name').toUpperCase(),
      activeResume.targetRole || '',
      `${user?.location || ''} | ${user?.email || ''} | ${user?.phone || ''}`,
      '',
      '========================================',
      'PROFESSIONAL SUMMARY',
      '========================================',
      activeResume.summary || 'Summary not provided.',
      '',
      '========================================',
      'WORK EXPERIENCE',
      '========================================',
      ...(activeResume.experiences.length > 0
        ? activeResume.experiences.map(exp => [
            `${exp.role} - ${exp.company} (${exp.startDate} - ${exp.endDate})`,
            ...exp.highlights.map(h => `  • ${h}`),
            ''
          ].join('\n'))
        : ['No experience listed.']),
      '========================================',
      'EDUCATION',
      '========================================',
      ...((activeResume.education && activeResume.education.length > 0)
        ? activeResume.education.map(edu => 
            `${edu.degree} in ${edu.field} | ${edu.institution} (${edu.year})`
          )
        : ['No education listed.']),
      '',
      '========================================',
      'CORE TECHNICAL COMPETENCIES',
      '========================================',
      skillsList || 'No skills listed.'
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(user?.name || 'Candidate').replace(/\s+/g, '_')}_ATS_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

          <div className="flex flex-wrap items-center gap-2.5 no-print">
            <Button
              variant="outline"
              size="md"
              icon={<Palette className="w-4 h-4 text-[#0F766E] dark:text-teal-400" />}
              onClick={() => setShowRedesignStudio(prev => !prev)}
              className={showRedesignStudio ? 'border-[#0F766E] text-[#0F766E] bg-teal-50/50 dark:bg-teal-950/40' : ''}
              id="btn-redesign-resume"
            >
              {showRedesignStudio ? 'Hide Design Studio' : 'Redesign Resume'}
            </Button>

            <Button
              variant="outline"
              size="md"
              icon={<Printer className="w-4 h-4" />}
              onClick={handleExportPDF}
              id="btn-export-pdf"
            >
              Export PDF
            </Button>

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

              {/* Education Section */}
              <div className="pt-6 border-t border-stone-200/80 dark:border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2 font-display">
                      <GraduationCap className="w-4 h-4 text-[#0F766E] dark:text-teal-400" />
                      Education & Credentials
                    </h3>
                    <p className="text-xs text-stone-500">Degree, institutions, and graduation timelines.</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={showAddEdu ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    onClick={() => setShowAddEdu(!showAddEdu)}
                  >
                    {showAddEdu ? 'Cancel' : 'Add Education'}
                  </Button>
                </div>

                {showAddEdu && (
                  <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 space-y-3 font-sans">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300">Degree *</label>
                        <input
                          type="text"
                          placeholder="e.g. B.Tech / B.S."
                          value={newEduDegree}
                          onChange={e => setNewEduDegree(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1A1A1A] text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300">Field of Study</label>
                        <input
                          type="text"
                          placeholder="e.g. Computer Science & Engineering"
                          value={newEduField}
                          onChange={e => setNewEduField(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1A1A1A] text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300">Institution / University *</label>
                        <input
                          type="text"
                          placeholder="e.g. National Institute of Technology"
                          value={newEduInstitution}
                          onChange={e => setNewEduInstitution(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1A1A1A] text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300">Graduation Year</label>
                        <input
                          type="text"
                          placeholder="e.g. 2024"
                          value={newEduYear}
                          onChange={e => setNewEduYear(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1A1A1A] text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                        />
                      </div>
                    </div>
                    <Button variant="primary" size="sm" onClick={handleAddEducation} className="bg-[#0F766E] hover:bg-[#0D655E]">
                      Save Education
                    </Button>
                  </div>
                )}

                {(!activeResume.education || activeResume.education.length === 0) ? (
                  <div className="p-5 rounded-xl border border-dashed border-stone-200 dark:border-stone-800 text-center text-xs text-stone-500">
                    <p>No education history added yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeResume.education.map(edu => (
                      <div key={edu.id} className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-stone-900 dark:text-white">{edu.degree} in {edu.field}</p>
                          <p className="text-[11px] text-stone-500">{edu.institution} • {edu.year}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveEducation(edu.id)}
                          className="text-stone-400 hover:text-rose-500 p-1"
                          aria-label="Remove education"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Skills Editor */}
              <div className="pt-6 border-t border-stone-200/80 dark:border-stone-800 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2 font-display">
                    <Layers className="w-4 h-4 text-[#0F766E] dark:text-teal-400" />
                    Core Skills & ATS Keywords
                  </h3>
                  <p className="text-xs text-stone-500">Skills matched by recruiters and ATS search parsers.</p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add technical or domain skill..."
                    value={newSkillInput}
                    onChange={e => setNewSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                  />
                  <Button variant="outline" size="sm" onClick={handleAddSkill}>
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {((user.skills && user.skills.length > 0) ? user.skills : activeResume.skills).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200/80 dark:border-stone-700"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-rose-500 text-stone-400"
                        title="Remove skill"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Live Resume Document Preview & Redesign Studio */}
          <div className="lg:col-span-6 space-y-4">
            {/* Top Toolbar */}
            <div className="no-print p-4 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: designConfig.accentColor }} />
                <span className="text-xs font-bold text-stone-900 dark:text-white capitalize">
                  {designConfig.template.replace('_', ' ')}
                </span>
                <span className="text-stone-300 dark:text-stone-700">•</span>
                <span className="text-xs text-stone-500 dark:text-stone-400 capitalize">
                  {designConfig.fontPairing} Font
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Palette className="w-3.5 h-3.5 text-[#0F766E] dark:text-teal-400" />}
                  onClick={() => setShowRedesignStudio(!showRedesignStudio)}
                  className={showRedesignStudio ? 'border-[#0F766E] text-[#0F766E] bg-teal-50/50 dark:bg-teal-950/40' : ''}
                >
                  {showRedesignStudio ? 'Close Studio' : 'Redesign Resume'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  icon={<FileDown className="w-3.5 h-3.5" />}
                  onClick={handleDownloadText}
                  title="Download plain text for ATS paste"
                >
                  Plain Text
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  icon={<Printer className="w-3.5 h-3.5" />}
                  onClick={handleExportPDF}
                  className="bg-[#0F766E] hover:bg-[#0D655E]"
                  id="btn-export-pdf-preview"
                >
                  Export PDF
                </Button>
              </div>
            </div>

            {/* Redesign Studio Panel */}
            <AnimatePresence>
              {showRedesignStudio && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="no-print p-6 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-teal-200 dark:border-teal-900 shadow-sm space-y-6 overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-[#0F766E] dark:text-teal-400" />
                      <h3 className="text-sm font-bold text-stone-900 dark:text-white font-display">
                        Resume Redesign Studio
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowRedesignStudio(false)}
                      className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {/* 1. Template Chooser */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                      1. Select Layout & ATS Template
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: 'ats_classic', label: 'ATS Classic', desc: '100% ATS score, single-column standard', badge: 'Best ATS' },
                        { id: 'modern_executive', label: 'Modern Executive', desc: 'Accent borders & leadership header', badge: 'Executive' },
                        { id: 'tech_minimalist', label: 'Tech Minimalist', desc: 'Monospace badges for developers', badge: 'Tech' },
                        { id: 'creative_compact', label: 'Dual Column', desc: 'Sidebar skills + main role feed', badge: 'Modern' }
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setDesignConfig(prev => ({ ...prev, template: t.id as ResumeTemplateId }))}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            designConfig.template === t.id
                              ? 'border-[#0F766E] bg-teal-50/50 dark:bg-teal-950/40 ring-1 ring-[#0F766E]'
                              : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-stone-50/60 dark:bg-stone-900/60'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-mono">
                              {t.badge}
                            </span>
                            {designConfig.template === t.id && (
                              <Check className="w-3.5 h-3.5 text-[#0F766E] dark:text-teal-400" />
                            )}
                          </div>
                          <p className="text-xs font-bold text-stone-900 dark:text-white">{t.label}</p>
                          <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 leading-tight">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Accent Color Swatches */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                      2. Accent Theme Color
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      {[
                        { color: '#0F766E', name: 'WorkNext Teal' },
                        { color: '#1E3A8A', name: 'Slate Navy' },
                        { color: '#334155', name: 'Graphite Charcoal' },
                        { color: '#059669', name: 'Emerald Green' },
                        { color: '#4338CA', name: 'Royal Indigo' },
                        { color: '#881337', name: 'Crimson Wine' }
                      ].map(swatch => (
                        <button
                          key={swatch.color}
                          onClick={() => setDesignConfig(prev => ({ ...prev, accentColor: swatch.color }))}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs cursor-pointer transition-all ${
                            designConfig.accentColor === swatch.color
                              ? 'border-stone-900 dark:border-white bg-stone-100 dark:bg-stone-800 font-bold'
                              : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                            style={{ backgroundColor: swatch.color }}
                          />
                          <span className="text-stone-800 dark:text-stone-200">{swatch.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Font Pairing & Density Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-200 dark:border-stone-800">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                        3. Typography Pairing
                      </label>
                      <div className="flex gap-2">
                        {[
                          { id: 'sans', label: 'Clean Sans' },
                          { id: 'serif', label: 'Executive Serif' },
                          { id: 'mono', label: 'Technical Mono' }
                        ].map(f => (
                          <button
                            key={f.id}
                            onClick={() => setDesignConfig(prev => ({ ...prev, fontPairing: f.id as ResumeFontPairing }))}
                            className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-medium cursor-pointer ${
                              designConfig.fontPairing === f.id
                                ? 'border-[#0F766E] bg-teal-50/60 dark:bg-teal-950/40 text-[#0F766E] font-bold'
                                : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                        4. Information Density
                      </label>
                      <div className="flex gap-2">
                        {[
                          { id: 'compact', label: 'Compact (1 Page)' },
                          { id: 'balanced', label: 'Balanced' },
                          { id: 'spacious', label: 'Spacious' }
                        ].map(d => (
                          <button
                            key={d.id}
                            onClick={() => setDesignConfig(prev => ({ ...prev, density: d.id as ResumeDensity }))}
                            className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-medium cursor-pointer ${
                              designConfig.density === d.id
                                ? 'border-[#0F766E] bg-teal-50/60 dark:bg-teal-950/40 text-[#0F766E] font-bold'
                                : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                            }`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Document Preview Sheet */}
            <div
              id="resume-document-canvas"
              className={`resume-print-sheet rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-sm text-stone-900 dark:text-white transition-all ${
                designConfig.fontPairing === 'serif'
                  ? 'font-serif'
                  : designConfig.fontPairing === 'mono'
                  ? 'font-mono'
                  : 'font-sans'
              } ${
                designConfig.density === 'compact'
                  ? 'p-6 space-y-4 text-xs'
                  : designConfig.density === 'spacious'
                  ? 'p-10 space-y-8 text-sm'
                  : 'p-8 space-y-6 text-xs'
              }`}
            >
              {/* =========================================================
                  TEMPLATE 1: ATS CLASSIC (Single Column, Highest ATS Score)
                  ========================================================= */}
              {designConfig.template === 'ats_classic' && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="border-b-2 pb-4 text-center space-y-1" style={{ borderColor: designConfig.accentColor }}>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase text-stone-900 dark:text-white">
                      {user?.name || 'Your Name'}
                    </h2>
                    <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: designConfig.accentColor }}>
                      {activeResume.targetRole || 'Target Role Title'}
                    </p>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">
                      {user?.location || 'Location'} • {user?.email || 'email@example.com'} • {user?.phone || '+91 98765 43210'}
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white">
                      Professional Summary
                    </h3>
                    <p className="leading-relaxed text-stone-700 dark:text-stone-300">
                      {activeResume.summary || 'Summary will appear here as you type in the editor.'}
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white">
                      Professional Experience
                    </h3>
                    {activeResume.experiences.length === 0 ? (
                      <p className="text-stone-400 italic">Work experience entries will appear here.</p>
                    ) : (
                      <div className="space-y-4">
                        {activeResume.experiences.map(exp => (
                          <div key={exp.id} className="space-y-1.5">
                            <div className="flex justify-between items-baseline font-bold text-stone-900 dark:text-white">
                              <span>
                                {exp.role} — <span className="font-semibold text-stone-600 dark:text-stone-400">{exp.company}</span>
                              </span>
                              <span className="text-[11px] text-stone-500 font-normal">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <ul className="list-disc list-outside pl-4 space-y-1 text-stone-700 dark:text-stone-300">
                              {exp.highlights.map((hl, i) => (
                                <li key={i}>{hl}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Education */}
                  {activeResume.education && activeResume.education.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white">
                        Education & Academic Credentials
                      </h3>
                      <div className="space-y-2">
                        {activeResume.education.map(edu => (
                          <div key={edu.id} className="flex justify-between items-baseline text-stone-900 dark:text-white">
                            <div>
                              <span className="font-bold">{edu.degree} in {edu.field}</span>
                              <span className="text-stone-600 dark:text-stone-400 font-normal"> — {edu.institution}</span>
                            </div>
                            <span className="text-[11px] text-stone-500">{edu.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white">
                      Technical Competencies & Skills
                    </h3>
                    <p className="leading-relaxed text-stone-700 dark:text-stone-300">
                      {((user.skills && user.skills.length > 0) ? user.skills : activeResume.skills).join(' • ') || 'No competencies listed yet.'}
                    </p>
                  </div>
                </div>
              )}

              {/* =========================================================
                  TEMPLATE 2: MODERN EXECUTIVE (Accent Header & Badges)
                  ========================================================= */}
              {designConfig.template === 'modern_executive' && (
                <div className="space-y-6">
                  {/* Executive Header Banner */}
                  <div
                    className="p-6 rounded-xl border-l-4 space-y-1.5 bg-stone-50/70 dark:bg-stone-900/60"
                    style={{ borderLeftColor: designConfig.accentColor }}
                  >
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white font-display">
                      {user?.name || 'Your Name'}
                    </h2>
                    <p className="text-sm font-bold tracking-wide uppercase" style={{ color: designConfig.accentColor }}>
                      {activeResume.targetRole || 'Target Role Title'}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-stone-500 dark:text-stone-400 pt-1">
                      <span>{user?.location || 'Location'}</span>
                      <span>•</span>
                      <span>{user?.email || 'email@example.com'}</span>
                      <span>•</span>
                      <span>{user?.phone || '+91 98765 43210'}</span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: designConfig.accentColor }} />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white">
                        Executive Summary
                      </h3>
                    </div>
                    <p className="leading-relaxed text-stone-700 dark:text-stone-300 pl-4 border-l border-stone-200 dark:border-stone-800">
                      {activeResume.summary || 'Summary will appear here as you type in the editor.'}
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: designConfig.accentColor }} />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white">
                        Leadership & Work History
                      </h3>
                    </div>
                    <div className="space-y-4 pl-4 border-l border-stone-200 dark:border-stone-800">
                      {activeResume.experiences.map(exp => (
                        <div key={exp.id} className="space-y-1.5">
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-stone-900 dark:text-white text-sm">
                              {exp.role} <span style={{ color: designConfig.accentColor }}>@ {exp.company}</span>
                            </span>
                            <span className="text-[11px] text-stone-400 font-mono">{exp.startDate} - {exp.endDate}</span>
                          </div>
                          <ul className="space-y-1">
                            {exp.highlights.map((hl, i) => (
                              <li key={i} className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                                <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: designConfig.accentColor }} />
                                <span>{hl}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  {activeResume.education && activeResume.education.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: designConfig.accentColor }} />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white">
                          Education & Credentials
                        </h3>
                      </div>
                      <div className="space-y-2 pl-4 border-l border-stone-200 dark:border-stone-800">
                        {activeResume.education.map(edu => (
                          <div key={edu.id} className="flex justify-between items-baseline">
                            <div>
                              <p className="font-bold text-stone-900 dark:text-white">{edu.degree} in {edu.field}</p>
                              <p className="text-[11px] text-stone-500">{edu.institution}</p>
                            </div>
                            <span className="text-xs font-mono text-stone-400">{edu.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: designConfig.accentColor }} />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white">
                        Core Competencies
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pl-4 border-l border-stone-200 dark:border-stone-800">
                      {((user.skills && user.skills.length > 0) ? user.skills : activeResume.skills).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white shadow-2xs"
                          style={{ backgroundColor: designConfig.accentColor }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================
                  TEMPLATE 3: TECH MINIMALIST (Monospace & Developer Tags)
                  ========================================================= */}
              {designConfig.template === 'tech_minimalist' && (
                <div className="space-y-6 font-mono text-xs">
                  {/* Terminal Style Header */}
                  <div className="border-b border-stone-200 dark:border-stone-800 pb-4 space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white font-mono">
                        &gt; {user?.name || 'Your Name'}
                      </h2>
                      <span className="text-[11px] text-stone-400 font-mono">ID: {user?.id?.slice(0, 8)}</span>
                    </div>
                    <p className="text-xs font-bold font-mono" style={{ color: designConfig.accentColor }}>
                      // ROLE: {activeResume.targetRole || 'Software Engineer'}
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      [loc: {user?.location || 'Bengaluru'}] [email: {user?.email || 'email@example.com'}]
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold uppercase text-stone-500 dark:text-stone-400 font-mono">
                      // 01. SUMMARY
                    </h3>
                    <p className="leading-relaxed text-stone-700 dark:text-stone-300 font-sans">
                      {activeResume.summary || 'Summary will appear here.'}
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase text-stone-500 dark:text-stone-400 font-mono">
                      // 02. EXPERIENCE_HISTORY
                    </h3>
                    <div className="space-y-4">
                      {activeResume.experiences.map(exp => (
                        <div key={exp.id} className="space-y-1 font-mono">
                          <div className="flex justify-between items-baseline font-bold text-stone-900 dark:text-white">
                            <span>
                              {exp.role} <span style={{ color: designConfig.accentColor }}>@{exp.company}</span>
                            </span>
                            <span className="text-[10px] text-stone-400">[{exp.startDate} -&gt; {exp.endDate}]</span>
                          </div>
                          <ul className="space-y-1 font-sans text-stone-700 dark:text-stone-300">
                            {exp.highlights.map((hl, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-stone-400 font-mono shrink-0">$</span>
                                <span>{hl}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  {activeResume.education && activeResume.education.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase text-stone-500 dark:text-stone-400 font-mono">
                        // 03. ACADEMICS
                      </h3>
                      <div className="space-y-1.5">
                        {activeResume.education.map(edu => (
                          <div key={edu.id} className="flex justify-between items-baseline">
                            <span className="text-stone-900 dark:text-white font-bold">
                              {edu.degree} [{edu.field}] - {edu.institution}
                            </span>
                            <span className="text-stone-400 text-[10px]">{edu.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills / Stack */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase text-stone-500 dark:text-stone-400 font-mono">
                      // 04. TECH_STACK
                    </h3>
                    <div className="flex flex-wrap gap-1.5 font-mono">
                      {((user.skills && user.skills.length > 0) ? user.skills : activeResume.skills).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-[11px]"
                        >
                          #{skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================
                  TEMPLATE 4: CREATIVE COMPACT (Dual Column Layout)
                  ========================================================= */}
              {designConfig.template === 'creative_compact' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column: Profile, Contacts, Skills & Education */}
                  <div className="space-y-6 md:border-r border-stone-200 dark:border-stone-800 md:pr-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white font-display">
                        {user?.name || 'Your Name'}
                      </h2>
                      <p className="text-xs font-bold" style={{ color: designConfig.accentColor }}>
                        {activeResume.targetRole || 'Target Role'}
                      </p>
                    </div>

                    <div className="space-y-1 text-[11px] text-stone-600 dark:text-stone-400">
                      <p className="font-bold text-stone-900 dark:text-white uppercase text-[10px] tracking-wider mb-1">Contact</p>
                      <p>{user?.location || 'Location'}</p>
                      <p className="truncate">{user?.email || 'email@example.com'}</p>
                      <p>{user?.phone || '+91 98765 43210'}</p>
                    </div>

                    {/* Education */}
                    {activeResume.education && activeResume.education.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-bold text-stone-900 dark:text-white uppercase text-[10px] tracking-wider">Education</p>
                        <div className="space-y-2">
                          {activeResume.education.map(edu => (
                            <div key={edu.id} className="text-[11px]">
                              <p className="font-bold text-stone-900 dark:text-white">{edu.degree}</p>
                              <p className="text-stone-500">{edu.field}</p>
                              <p className="text-stone-400">{edu.institution} ({edu.year})</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    <div className="space-y-2">
                      <p className="font-bold text-stone-900 dark:text-white uppercase text-[10px] tracking-wider">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {((user.skills && user.skills.length > 0) ? user.skills : activeResume.skills).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Summary & Detailed Experience */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Summary */}
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white border-b pb-1" style={{ borderColor: designConfig.accentColor }}>
                        Professional Summary
                      </h3>
                      <p className="text-xs leading-relaxed text-stone-700 dark:text-stone-300">
                        {activeResume.summary || 'Summary will appear here as you type in the editor.'}
                      </p>
                    </div>

                    {/* Work Experience */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white border-b pb-1" style={{ borderColor: designConfig.accentColor }}>
                        Experience
                      </h3>
                      <div className="space-y-4">
                        {activeResume.experiences.map(exp => (
                          <div key={exp.id} className="space-y-1">
                            <div className="flex justify-between items-baseline">
                              <span className="font-bold text-stone-900 dark:text-white text-xs">
                                {exp.role} <span style={{ color: designConfig.accentColor }}>@ {exp.company}</span>
                              </span>
                              <span className="text-[11px] text-stone-400">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-stone-600 dark:text-stone-300">
                              {exp.highlights.map((hl, i) => (
                                <li key={i}>{hl}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
