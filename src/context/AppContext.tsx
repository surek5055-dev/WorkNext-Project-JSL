import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeMode, Language, FontSize, UserProfile, UserRole, AdminUser, Job, NotificationItem, ResumeAnalysisData } from '../types';
import { mockCurrentUser, mockJobs, mockNotifications } from '../data/mockData';

interface AppContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  
  language: Language;
  setLanguage: (lang: Language) => void;
  
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  
  highContrast: boolean;
  setHighContrast: (active: boolean) => void;
  toggleHighContrast: () => void;
  
  isLoggedIn: boolean;
  login: (email?: string, name?: string, id?: string, role?: UserRole, token?: string) => void;
  logout: () => void;
  
  adminUser: AdminUser | null;
  isAdminLoggedIn: boolean;
  adminLogin: (admin: AdminUser, token?: string) => void;
  adminLogout: () => void;
  
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  uploadResume: (fileName: string, fileSize?: string, fileBase64?: string) => void;
  runAtsAnalysis: () => Promise<{ success: boolean; data?: ResumeAnalysisData; error?: string }>;
  analyzeResumeWithAI: (targetRole?: string) => Promise<{ success: boolean; data?: ResumeAnalysisData; error?: string }>;
  isAnalyzingResume: boolean;
  analysisError: string | null;
  clearAnalysisError: () => void;
  deleteResume: () => void;
  
  jobs: Job[];
  addJob: (job: Job) => void;
  savedJobIds: string[];
  appliedJobIds: string[];
  toggleSaveJob: (jobId: string) => void;
  applyForJob: (jobId: string, jobData?: Job) => void;
  
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  unreadCount: number;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  globalSearchOpen: boolean;
  setGlobalSearchOpen: (open: boolean) => void;
  
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;

  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Simple dictionary for multilingual translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.jobs': 'Job Finder',
    'nav.resume': 'Resume Builder',
    'nav.insights': 'Market Insights',
    'nav.community': 'Community & Mentors',
    'nav.recruiter': 'Recruiter Portal',
    'nav.login': 'Log In',
    'nav.signup': 'Get Started',
    'nav.settings': 'Settings',
    'hero.title': 'Bridge the Workforce Gap with AI Guidance',
    'hero.subtitle': 'Empowering job seekers and workers to unlock higher wages, discover local careers, and build verified resumes in minutes.',
    'search.placeholder': 'Search jobs, skills, mentors, or insights...',
    'btn.applyNow': 'Apply Now',
    'btn.saveJob': 'Save Job',
    'btn.saved': 'Saved',
    'btn.applied': 'Applied',
    'btn.exploreJobs': 'Explore Jobs',
    'btn.buildResume': 'Build Resume',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.dashboard': 'Panel Principal',
    'nav.jobs': 'Buscador de Empleo',
    'nav.resume': 'Creador de CV',
    'nav.insights': 'Estadísticas del Mercado',
    'nav.community': 'Comunidad y Mentores',
    'nav.recruiter': 'Portal de Reclutadores',
    'nav.login': 'Iniciar Sesión',
    'nav.signup': 'Registrarse',
    'nav.settings': 'Configuración',
    'hero.title': 'Reduzca la Brecha Laboral con Guía de IA',
    'hero.subtitle': 'Empoderando a profesionales para obtener mejores salarios, empleos locales y currículums verificados en minutos.',
    'search.placeholder': 'Buscar empleos, habilidades o mentores...',
    'btn.applyNow': 'Postularme',
    'btn.saveJob': 'Guardar Empleo',
    'btn.saved': 'Guardado',
    'btn.applied': 'Postulado',
    'btn.exploreJobs': 'Explorar Empleos',
    'btn.buildResume': 'Crear CV',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.dashboard': 'Tableau de bord',
    'nav.jobs': 'Offres d\'Emploi',
    'nav.resume': 'Générateur de CV',
    'nav.insights': 'Aperçu du Marché',
    'nav.community': 'Communauté & Mentors',
    'nav.recruiter': 'Espace Recruteur',
    'nav.login': 'Connexion',
    'nav.signup': 'S\'inscrire',
    'nav.settings': 'Paramètres',
    'hero.title': 'Comblez l\'écart d\'emploi grâce à l\'IA',
    'hero.subtitle': 'Permettre aux chercheurs d\'emploi d\'accéder à de meilleurs salaires et de créer des CV optimisés.',
    'search.placeholder': 'Rechercher un emploi, une compétence...',
    'btn.applyNow': 'Postuler',
    'btn.saveJob': 'Enregistrer',
    'btn.saved': 'Enregistré',
    'btn.applied': 'Candidaté',
    'btn.exploreJobs': 'Explorer',
    'btn.buildResume': 'Créer mon CV',
  },
  de: {
    'nav.home': 'Startseite',
    'nav.dashboard': 'Dashboard',
    'nav.jobs': 'Jobsuche',
    'nav.resume': 'Lebenslauf-Builder',
    'nav.insights': 'Arbeitsmarkteinblicke',
    'nav.community': 'Community & Mentoren',
    'nav.recruiter': 'Recruiter Portal',
    'nav.login': 'Anmelden',
    'nav.signup': 'Registrieren',
    'nav.settings': 'Einstellungen',
    'hero.title': 'Schließen Sie die Arbeitsmarktlücke mit KI',
    'hero.subtitle': 'Bessere Löhne, lokale Karrierechancen und optimierte Lebensläufe in wenigen Minuten.',
    'search.placeholder': 'Jobs, Fähigkeiten oder Mentoren suchen...',
    'btn.applyNow': 'Jetzt Bewerben',
    'btn.saveJob': 'Job Speichern',
    'btn.saved': 'Gespeichert',
    'btn.applied': 'Beworben',
    'btn.exploreJobs': 'Jobs Erkunden',
    'btn.buildResume': 'Lebenslauf Erstellen',
  },
  hi: {
    'nav.home': 'होम',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.jobs': 'जॉब खोजें',
    'nav.resume': 'रिज्यूमे बिल्डर',
    'nav.insights': 'रोजगार डेटा',
    'nav.community': 'समुदाय और मेंटर्स',
    'nav.recruiter': 'रिक्रूटर पोर्टल',
    'nav.login': 'लॉग इन',
    'nav.signup': 'शुरू करें',
    'nav.settings': 'सेटिंग्स',
    'hero.title': 'एआई मार्गदर्शन के साथ रोजगार अंतराल को भरें',
    'hero.subtitle': 'बेहतर वेतन, स्थानीय नौकरियों और एआई-सत्यापित रिज्यूमे के साथ अपने करियर को सशक्त बनाएं।',
    'search.placeholder': 'नौकरी, कौशल या मेंटर्स खोजें...',
    'btn.applyNow': 'आवेदन करें',
    'btn.saveJob': 'सेव करें',
    'btn.saved': 'सेव किया गया',
    'btn.applied': 'आवेदन किया',
    'btn.exploreJobs': 'नौकरियां देखें',
    'btn.buildResume': 'रिज्यूमे बनाएं',
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('worknext_theme');
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {
      console.error('Failed to read theme from localStorage', e);
    }
    return 'light';
  });
  const [language, setLanguage] = useState<Language>('en');
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('worknext_is_logged_in') === 'true';
  });
  
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('worknext_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Clean out any legacy mock data or unverified/generated readiness scores (like 88 or 94)
        if (
          parsed.name === 'Alex Morgan' ||
          parsed.location === 'Chicago, IL' ||
          parsed.title === 'Full Stack Engineer & AI Specialist' ||
          parsed.readinessScore === 88 ||
          parsed.readinessScore === 94 ||
          (!parsed.hasAnalyzedResume && parsed.readinessScore > 0)
        ) {
          parsed.readinessScore = 0;
          if (parsed.name === 'Alex Morgan') {
            localStorage.removeItem('worknext_user_profile');
            return mockCurrentUser;
          }
        }
        // Ensure default properties exist
        return {
          ...mockCurrentUser,
          ...parsed
        };
      } catch (e) {
        console.error('Failed to parse saved user profile', e);
      }
    }
    return mockCurrentUser;
  });

  // Keep localStorage in sync with user state
  useEffect(() => {
    try {
      localStorage.setItem('worknext_user_profile', JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user profile to localStorage', e);
    }
  }, [user]);

  const login = (email?: string, name?: string, id?: string, role?: UserRole, token?: string) => {
    setIsLoggedIn(true);
    localStorage.setItem('worknext_is_logged_in', 'true');
    if (token) {
      localStorage.setItem('worknext_supabase_token', token);
    }
    setUser(prev => {
      const updated: UserProfile = {
        ...prev,
        id: id || prev.id || ('user_' + Date.now()),
        name: name ? name.trim() : (prev.name || (email ? email.split('@')[0] : '')),
        email: email ? email.trim() : (prev.email || ''),
        role: role || prev.role || 'jobseeker',
        supabaseToken: token || prev.supabaseToken,
      };
      return updated;
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('worknext_is_logged_in', 'false');
    localStorage.removeItem('worknext_supabase_token');
  };

  // Admin authentication state & persistence
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem('worknext_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const isAdminLoggedIn = Boolean(adminUser && adminUser.role === 'admin');

  const adminLogin = (admin: AdminUser, token?: string) => {
    setAdminUser(admin);
    localStorage.setItem('worknext_admin_user', JSON.stringify(admin));
    if (token) {
      localStorage.setItem('worknext_admin_token', token);
    }
  };

  const adminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('worknext_admin_user');
    localStorage.removeItem('worknext_admin_token');
  };

  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const clearAnalysisError = () => setAnalysisError(null);

  const uploadResume = (fileName: string, fileSize?: string, fileBase64?: string) => {
    setUser(prev => {
      const updated: UserProfile = {
        ...prev,
        resumeFileName: fileName,
        resumeUploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        resumeFileSize: fileSize || '1.2 MB',
        resumeFileBase64: fileBase64 || prev.resumeFileBase64 || '',
        atsScore: null,
        hasAnalyzedResume: false,
        analysisRequested: false,
        resumeAnalysis: null,
        careerRecommendations: null,
        skillGapReport: null,
        interviewFeedback: null,
        detailedAnalysis: null,
      };
      return updated;
    });
    setAnalysisError(null);
  };

  const analyzeResumeWithAI = async (targetRole?: string): Promise<{ success: boolean; data?: ResumeAnalysisData; error?: string }> => {
    if (!user.resumeFileName && !user.resumeFileBase64) {
      const err = 'Please upload a resume file first before running analysis.';
      setAnalysisError(err);
      return { success: false, error: err };
    }

    setIsAnalyzingResume(true);
    setAnalysisError(null);

    try {
      const payload = {
        fileName: user.resumeFileName,
        fileBase64: user.resumeFileBase64,
        fileType: user.resumeFileName?.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'text/plain',
        targetRole: targetRole || user.title || 'Specialist',
        userProfile: {
          name: user.name,
          title: user.title,
          skills: user.skills,
          experienceYears: user.experienceYears,
          location: user.location,
          bio: user.bio,
        },
      };

      let response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Fallback to /api/resume/analyze if /api/analyze-resume returns 404
      if (response.status === 404) {
        response = await fetch('/api/resume/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }

      let json: any;
      try {
        json = await response.json();
      } catch {
        throw new Error('Could not read server response. Please try again.');
      }

      if (!response.ok || !json.success) {
        const errorMsg = json.error || 'Failed to analyze resume with AI service. Please retry.';
        setAnalysisError(errorMsg);
        setIsAnalyzingResume(false);
        return { success: false, error: errorMsg };
      }

      const analysis: ResumeAnalysisData = json.data;

      setUser(prev => {
        const ext = analysis.extractedProfile;
        const newSkills = ext?.skills && ext.skills.length > 0
          ? Array.from(new Set([...(prev.skills || []), ...ext.skills]))
          : prev.skills;
        const newTitle = ext?.targetRole || prev.title;
        const newExp = (ext?.experienceYears && ext.experienceYears > 0)
          ? ext.experienceYears
          : prev.experienceYears;

        const updated: UserProfile = {
          ...prev,
          title: newTitle,
          skills: newSkills,
          experienceYears: newExp,
          atsScore: analysis.atsScore,
          readinessScore: analysis.readinessScore,
          hasAnalyzedResume: true,
          analysisRequested: true,
          resumeAnalysis: analysis.summary,
          detailedAnalysis: analysis,
          extractedProfile: ext || null,
          careerRecommendations: analysis.careerRecommendations?.map(c => `${c.role} (${c.matchRate}% match): ${c.description}`).join('\n\n'),
          skillGapReport: analysis.skillGaps?.map(g => `• [${g.importance}] ${g.skill}: ${g.description}`).join('\n'),
          interviewFeedback: analysis.interviewPreparation?.join('\n'),
        };
        return updated;
      });

      setIsAnalyzingResume(false);
      return { success: true, data: analysis };
    } catch (err: any) {
      console.error('AI resume analysis request failed:', err);
      const errorMsg = err.message || 'Network error while connecting to the AI analysis service.';
      setAnalysisError(errorMsg);
      setIsAnalyzingResume(false);
      return { success: false, error: errorMsg };
    }
  };

  const runAtsAnalysis = async () => {
    return analyzeResumeWithAI();
  };

  const deleteResume = () => {
    setUser(prev => {
      const updated: UserProfile = {
        ...prev,
        resumeFileName: '',
        resumeUploadedAt: '',
        resumeFileSize: '',
        resumeFileBase64: '',
        atsScore: null,
        hasAnalyzedResume: false,
        analysisRequested: false,
        readinessScore: 0,
        resumeAnalysis: null,
        careerRecommendations: null,
        skillGapReport: null,
        interviewFeedback: null,
        detailedAnalysis: null,
        extractedProfile: null,
      };
      return updated;
    });
    setAnalysisError(null);
  };

  const [jobs, setJobs] = useState<Job[]>([]);

  // Load real jobs from backend on initial mount
  useEffect(() => {
    const fetchBackendJobs = async () => {
      try {
        const res = await fetch('/api/jobs');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.jobs)) {
            setJobs(data.jobs);
          }
        }
      } catch (err) {
        console.error('Error fetching jobs from backend:', err);
      }
    };
    fetchBackendJobs();
  }, []);

  const addJob = async (job: Job) => {
    // Enforce role-based access: only recruiters, employers, or admins can post openings
    if (user.role !== 'recruiter' && (user.role as string) !== 'employer' && user.role !== 'admin' && !isAdminLoggedIn) {
      console.warn('Unauthorized: Only recruiter or employer accounts can post job openings.');
      return;
    }
    const jobWithRecruiter: Job = {
      ...job,
      source: 'worknext',
      recruiterId: job.recruiterId || user.id || '',
      recruiterEmail: job.recruiterEmail || user.email || '',
    };
    setJobs(prev => [jobWithRecruiter, ...prev]);
    try {
      await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': user.role || 'jobseeker',
          'x-recruiter-id': user.id || '',
          'x-recruiter-email': user.email || '',
        },
        body: JSON.stringify(jobWithRecruiter),
      });
    } catch (err) {
      console.error('Failed to sync job with backend:', err);
    }
  };
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => user.savedJobIds || []);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>(() => user.appliedJobIds || []);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [globalSearchOpen, setGlobalSearchOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);

  // Sync theme class on document element and persist in localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    }
    try {
      localStorage.setItem('worknext_theme', theme);
    } catch (e) {
      console.error('Failed to save theme to localStorage', e);
    }
  }, [theme]);

  // Sync high contrast mode on document element
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Sync font size attribute on root
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-font-size', fontSize);
  }, [fontSize]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds(prev => {
      const exists = prev.includes(jobId);
      const next = exists ? prev.filter(id => id !== jobId) : [...prev, jobId];
      setUser(u => ({ ...u, savedJobIds: next }));
      return next;
    });
  };

  const applyForJob = (jobId: string, jobData?: Job) => {
    if (!appliedJobIds.includes(jobId)) {
      const next = [...appliedJobIds, jobId];
      setAppliedJobIds(next);
      setUser(u => ({ ...u, appliedJobIds: next }));

      // Add notification for applying
      const job = jobData || jobs.find(j => j.id === jobId);
      if (job) {
        const newNotif: NotificationItem = {
          id: 'not_' + Date.now(),
          title: 'Application Submitted!',
          message: `Your application for ${job.title} at ${job.company} was submitted.`,
          timestamp: 'Just now',
          type: 'application',
          read: false,
          link: '/dashboard'
        };
        setNotifications(prev => [newNotif, ...prev]);

        // Sync real candidate application to backend
        fetch('/api/recruiter/candidates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: user.name || 'Job Applicant',
            email: user.email || '',
            phone: user.phone || '',
            location: user.location || '',
            role: user.title || 'Applicant',
            experienceYears: user.experienceYears || 0,
            matchScore: job.matchScore || 0,
            skills: user.skills || [],
            bio: user.bio || '',
            status: 'applied',
            appliedJobTitle: job.title,
            appliedJobId: job.id,
            recruiterId: job.recruiterId || '',
            recruiterEmail: job.recruiterEmail || '',
          }),
        }).catch(err => {
          console.warn('Could not sync application to backend:', err);
        });
      }
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        language,
        setLanguage,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        toggleHighContrast,
        isLoggedIn,
        login,
        logout,
        adminUser,
        isAdminLoggedIn,
        adminLogin,
        adminLogout,
        user,
        setUser,
        uploadResume,
        runAtsAnalysis,
        analyzeResumeWithAI,
        isAnalyzingResume,
        analysisError,
        clearAnalysisError,
        deleteResume,
        jobs,
        addJob,
        savedJobIds,
        appliedJobIds,
        toggleSaveJob,
        applyForJob,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        unreadCount,
        searchQuery,
        setSearchQuery,
        globalSearchOpen,
        setGlobalSearchOpen,
        notificationsOpen,
        setNotificationsOpen,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
