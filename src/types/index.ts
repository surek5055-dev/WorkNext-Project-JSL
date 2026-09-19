export type Language = 'en' | 'es' | 'fr' | 'de' | 'hi';
export type ThemeMode = 'light' | 'dark';
export type FontSize = 'normal' | 'large' | 'extralarge';
export type UserRole = 'jobseeker' | 'recruiter' | 'admin';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  token?: string;
  lastLogin?: string;
}

export interface SkillGapItem {
  skill: string;
  importance: 'Critical' | 'Recommended' | 'Optional';
  description: string;
}

export interface CareerRecommendationItem {
  role: string;
  matchRate: number;
  description: string;
}

export interface ExtractedExperience {
  role: string;
  company: string;
  duration?: string;
  highlights?: string[];
}

export interface ExtractedEducation {
  institution: string;
  degree?: string;
  field?: string;
  year?: string;
}

export interface ExtractedCandidateProfile {
  targetRole?: string;
  skills: string[];
  experienceYears?: number;
  experiences?: ExtractedExperience[];
  education?: ExtractedEducation[];
}

export interface ResumeAnalysisData {
  atsScore: number;
  readinessScore: number;
  summary: string;
  strengths: string[];
  missingKeywords: string[];
  formattingIssues: string[];
  suggestions: string[];
  skillGaps: SkillGapItem[];
  careerRecommendations: CareerRecommendationItem[];
  interviewPreparation: string[];
  extractedProfile?: ExtractedCandidateProfile;
  analyzedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  location: string;
  avatar: string;
  bio: string;
  company?: string;
  phone?: string;
  website?: string;
  skills: string[];
  experienceYears: number;
  readinessScore: number; // 0 indicates not available/calculated yet
  savedJobIds: string[];
  appliedJobIds: string[];
  preferredLocation: string;
  desiredSalary: string;
  resumeFileName?: string;
  resumeUploadedAt?: string;
  resumeFileSize?: string;
  resumeFileBase64?: string;
  atsScore?: number | null;
  hasAnalyzedResume?: boolean;
  analysisRequested?: boolean;
  resumeAnalysis?: string | null;
  careerRecommendations?: string | null;
  skillGapReport?: string | null;
  interviewFeedback?: string | null;
  detailedAnalysis?: ResumeAnalysisData | null;
  extractedProfile?: ExtractedCandidateProfile | null;
  mentorStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  mentorId?: string;
  supabaseToken?: string;
}

export const hasSufficientProfileData = (user: UserProfile | null | undefined): boolean => {
  if (!user) return false;
  const hasBasicProfile = Boolean(user.title?.trim() && user.skills?.length > 0 && user.location?.trim());
  const hasResume = Boolean(user.resumeFileName?.trim());
  return hasBasicProfile && hasResume;
};

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  isRemote: boolean;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Hybrid' | 'Internship';
  category: string;
  salaryMin: number;
  salaryMax: number;
  salaryPeriod: 'year' | 'month' | 'hour';
  postedDate: string;
  description: string;
  requirements: string[];
  matchScore: number; // AI match score %
  skillGaps: string[];
  urgent?: boolean;
  featured?: boolean;
  applicantsCount: number;
  experienceLevel: 'Entry-Level' | 'Mid-Level' | 'Senior' | 'Executive';
  applyUrl?: string; // Real apply URL from Adzuna / employer
  source?: 'worknext' | 'adzuna' | string;
  recruiterId?: string;
  recruiterEmail?: string;
}

export interface ResumeSectionExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
}

export interface ResumeSectionEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  year: string;
}

export interface Resume {
  id: string;
  title: string;
  targetRole: string;
  updatedAt: string;
  score: number;
  summary: string;
  skills: string[];
  experiences: ResumeSectionExperience[];
  education: ResumeSectionEducation[];
  aiSuggestions: string[];
  template: 'modern' | 'minimal' | 'executive' | 'tech';
}

export interface Mentor {
  id: string;
  userId?: string;
  userEmail?: string;
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  rating?: number;
  reviewCount?: number;
  specialties: string[];
  hourlyRate?: string;
  availability?: string;
  bio?: string;
  sessionsCompleted?: number;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'application' | 'match' | 'mentor' | 'system' | 'interview';
  read: boolean;
  link?: string;
}

export interface EmploymentStat {
  region: string;
  unemploymentRate: number; // e.g. 3.8
  underemploymentRate: number; // e.g. 6.2
  activeJobOpenings: number;
  avgSalaryGrowth: number;
  topSkillsInDemand: { name: string; count: number; growth: string }[];
  hiringTrends: { month: string; openings: number; placements: number }[];
}

export interface CompetencyStat {
  name: string;
  category: string;
  count: number;
  percentage: number;
}

export interface MonthlySalaryPoint {
  month: string;
  formattedMonth: string;
  avgSalaryInr: number;
}

export interface MospiUnemploymentPoint {
  month: string;
  rate: number;
}

export interface RegionalHubStat {
  region: string;
  count: number;
}

export interface RealMarketInsights {
  region: string;
  unemploymentRate: {
    value: number;
    previousValue: number;
    urbanRate: number;
    ruralRate: number;
    lfpr: number;
    wpr: number;
    annualRate: number;
    youthRate: number;
    source: string;
    period: string;
  };
  underemploymentIndex: {
    value: number | null;
    displayText: string;
    note: string;
    source: string;
  };
  activeListings: {
    count: number;
    source: string;
    fetchedAt: string;
  };
  wageGrowth: {
    yoyPercentage: number;
    currentAvgSalaryInr: number;
    previousYearAvgSalaryInr: number;
    period: string;
    source: string;
  };
  topCompetencies: CompetencyStat[];
  salaryTimeline: MonthlySalaryPoint[];
  unemploymentTimeline: MospiUnemploymentPoint[];
  regionalHubs: RegionalHubStat[];
  lastUpdated: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  badge: string;
  salaryBoost: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}
