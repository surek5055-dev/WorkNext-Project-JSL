import { Job, Resume, Mentor, NotificationItem, EmploymentStat, Testimonial, FAQItem, UserProfile } from '../types';

export const emptyUserProfile: UserProfile = {
  id: 'usr_init',
  name: '',
  email: '',
  role: 'jobseeker',
  title: '',
  location: '',
  avatar: '',
  bio: '',
  phone: '',
  website: '',
  skills: [],
  experienceYears: 0,
  readinessScore: 0, // 0 indicates not calculated / not available yet
  savedJobIds: [],
  appliedJobIds: [],
  preferredLocation: '',
  desiredSalary: '',
  resumeFileName: '',
  resumeUploadedAt: '',
  atsScore: null,
  hasAnalyzedResume: false,
  analysisRequested: false,
  resumeAnalysis: null,
  careerRecommendations: null,
  skillGapReport: null,
  interviewFeedback: null,
};

export const mockCurrentUser: UserProfile = emptyUserProfile;

// Clean integration-ready arrays: no dummy or fake data
export const mockJobs: Job[] = [];

export const mockResumes: Resume[] = [];

export const createEmptyResume = (user?: UserProfile): Resume => ({
  id: 'res_' + Date.now(),
  title: user?.title ? `${user.title} Resume` : 'My Resume',
  targetRole: user?.title || '',
  updatedAt: 'Just now',
  score: 0,
  summary: user?.bio || '',
  skills: user?.skills || [],
  experiences: [],
  education: [],
  aiSuggestions: [],
  template: 'modern'
});

export const mockMentors: Mentor[] = [];

export const sampleDemoNotifications: NotificationItem[] = [];

export const mockNotifications: NotificationItem[] = [];

export const mockEmploymentStats: EmploymentStat = {
  region: "India's Tech & Workforce Corridors",
  unemploymentRate: 0,
  underemploymentRate: 0,
  activeJobOpenings: 0,
  avgSalaryGrowth: 0,
  topSkillsInDemand: [],
  hiringTrends: []
};

export const mockTestimonials: Testimonial[] = [];

export const mockFAQs: FAQItem[] = [
  {
    id: 'faq_1',
    category: 'General',
    question: 'How does WorkNext address both unemployment and underemployment?',
    answer: 'WorkNext goes beyond traditional job boards by analyzing individual skill profiles against local labor market demands. For underemployed individuals, WorkNext identifies transferable skills and bridges wage gaps by recommending targeted micro-credentials and high-value career pathways.'
  },
  {
    id: 'faq_2',
    category: 'Job Seekers',
    question: 'How does the AI Resume Builder optimize my resume for ATS filters?',
    answer: 'Our AI engine scans job postings to extract industry-specific keywords, action verbs, and structural requirements. It scores your resume live and suggests edits to ensure ATS-friendly formatting through automated Applicant Tracking Systems.'
  },
  {
    id: 'faq_3',
    category: 'Job Seekers',
    question: 'Is WorkNext free for job seekers?',
    answer: 'Yes! WorkNext provides core career guidance, local job search, resume builder tools, and market insight dashboards completely free to job seekers as part of our mission to reduce employment disparities.'
  },
  {
    id: 'faq_4',
    category: 'Recruiters',
    question: 'How do recruiters benefit from WorkNext?',
    answer: 'Recruiters gain access to candidates matched by skill competency rather than arbitrary filters. You can post openings, evaluate candidate profiles, and streamline hiring workflows.'
  },
  {
    id: 'faq_5',
    category: 'Accessibility',
    question: 'What accessibility features are supported on WorkNext?',
    answer: 'WorkNext supports full WCAG 2.1 AA guidelines, including screen-reader friendly DOM structure, keyboard-first navigation, customizable font sizes, high-contrast toggle, and dark/light modes.'
  }
];
