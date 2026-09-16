import React from 'react';
import { Resume } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FileText, Sparkles, Clock, Download, Edit3, CheckCircle, AlertTriangle } from 'lucide-react';

interface ResumeCardProps {
  resume: Resume;
  onEdit?: (resume: Resume) => void;
  onDownload?: (resume: Resume) => void;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({ resume, onEdit, onDownload }) => {
  return (
    <Card hoverEffect className="p-6 relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/80">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">{resume.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Target Role: {resume.targetRole}</p>
          </div>
        </div>

        {/* ATS Score pill */}
        <div className="text-right">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800/50">
            <Sparkles className="w-3.5 h-3.5" />
            {resume.score}/100 ATS Score
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-end gap-1">
            <Clock className="w-3 h-3" /> Updated {resume.updatedAt}
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 italic bg-slate-100/60 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800">
        "{resume.summary}"
      </p>

      {/* AI Key Insights */}
      {resume.aiSuggestions.length > 0 && (
        <div className="mb-5 space-y-2">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            Top AI Recommendations
          </p>
          <ul className="space-y-1.5">
            {resume.aiSuggestions.slice(0, 2).map((sug, idx) => (
              <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>{sug}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-slate-500 capitalize">Template: {resume.template}</span>
        <div className="flex items-center gap-2">
          {onDownload && (
            <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />} onClick={() => onDownload(resume)}>
              PDF
            </Button>
          )}
          {onEdit && (
            <Button variant="primary" size="sm" icon={<Edit3 className="w-3.5 h-3.5" />} onClick={() => onEdit(resume)}>
              Optimize
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
