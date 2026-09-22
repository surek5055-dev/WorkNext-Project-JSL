import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeMode, Language, FontSize, UserProfile, UserRole, AdminUser, Job, NotificationItem, ResumeAnalysisData, UserApplication } from '../types';
import { emptyUserProfile, mockCurrentUser, mockJobs, mockNotifications } from '../data/mockData';

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
  logout: (redirectUrl?: string) => void;
  
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
  addJob: (job: Job) => Promise<{ success: boolean; error?: string }>;
  savedJobIds: string[];
  appliedJobIds: string[];
  applications: UserApplication[];
  getApplication: (jobId: string) => UserApplication | undefined;
  refreshApplications: () => Promise<void>;
  toggleSaveJob: (jobId: string) => void;
  applyForJob: (jobId: string, jobData?: Job) => Promise<{ success: boolean; error?: string }> | void;
  
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
    try {
      if (typeof window !== 'undefined') {
        // Clear any old lingering localStorage auth keys to avoid demo user leakage across sessions
        if (window.localStorage) {
          localStorage.removeItem('worknext_is_logged_in');
          localStorage.removeItem('worknext_user_profile');
          localStorage.removeItem('interviewiq_is_logged_in');
          localStorage.removeItem('interviewiq_user_profile');
        }
        if (window.sessionStorage) {
          const sessionLoggedIn =
            sessionStorage.getItem('interviewiq_is_logged_in') === 'true' ||
            sessionStorage.getItem('worknext_is_logged_in') === 'true';
          return sessionLoggedIn;
        }
      }
    } catch (e) {
      console.warn('Session storage read error', e);
    }
    return false; // A fresh browser session always starts logged out
  });
  
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const sessionLoggedIn =
          sessionStorage.getItem('interviewiq_is_logged_in') === 'true' ||
          sessionStorage.getItem('worknext_is_logged_in') === 'true';

        if (sessionLoggedIn) {
          const savedSession =
            sessionStorage.getItem('interviewiq_session_user') ||
            sessionStorage.getItem('worknext_session_user');
          if (savedSession) {
            const parsed = JSON.parse(savedSession);
            // Ensure no hardcoded demo account is ever auto-displayed
            if (parsed && parsed.email && parsed.name !== 'Alex Morgan') {
              return {
                ...emptyUserProfile,
                ...parsed,
              };
            }
          }
        }
      }
    } catch (e) {
      console.warn('Failed to parse session user profile', e);
    }
    // Never auto-load or hardcode demo user
    return emptyUserProfile;
  });

  // Keep sessionStorage in sync with user state during active session
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        if (isLoggedIn && user.email) {
          sessionStorage.setItem('interviewiq_session_user', JSON.stringify(user));
          sessionStorage.setItem('worknext_session_user', JSON.stringify(user));
        } else if (!isLoggedIn) {
          sessionStorage.removeItem('interviewiq_session_user');
          sessionStorage.removeItem('worknext_session_user');
        }
      }
    } catch (e) {
      console.error('Failed to sync session user state', e);
    }
  }, [user, isLoggedIn]);

  const login = (email?: string, name?: string, id?: string, role?: UserRole, token?: string) => {
    setIsLoggedIn(true);
    const cleanEmail = email ? email.trim() : '';
    const cleanName = name ? name.trim() : (cleanEmail ? cleanEmail.split('@')[0] : '');
    const cleanId = id || ('usr_' + Date.now());
    const cleanRole = role || 'jobseeker';

    const updatedUser: UserProfile = {
      ...emptyUserProfile,
      id: cleanId,
      name: cleanName,
      email: cleanEmail,
      role: cleanRole,
      supabaseToken: token || undefined,
    };

    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem('interviewiq_is_logged_in', 'true');
        sessionStorage.setItem('worknext_is_logged_in', 'true');
        sessionStorage.setItem('interviewiq_session_user', JSON.stringify(updatedUser));
        sessionStorage.setItem('worknext_session_user', JSON.stringify(updatedUser));
        if (token) {
          sessionStorage.setItem('interviewiq_session_token', token);
          sessionStorage.setItem('worknext_session_token', token);
        }
      }
    } catch (e) {
      console.warn('Failed to store session state on login', e);
    }

    setUser(updatedUser);
  };

  const logout = (redirectUrl: string = '/login') => {
    setIsLoggedIn(false);
    setUser(emptyUserProfile);
    setAppliedJobIds([]);
    setSavedJobIds([]);

    try {
      if (typeof window !== 'undefined') {
        if (window.sessionStorage) {
          sessionStorage.removeItem('interviewiq_is_logged_in');
          sessionStorage.removeItem('worknext_is_logged_in');
          sessionStorage.removeItem('interviewiq_session_user');
          sessionStorage.removeItem('worknext_session_user');
          sessionStorage.removeItem('interviewiq_session_token');
          sessionStorage.removeItem('worknext_session_token');
          sessionStorage.clear();
        }
        if (window.localStorage) {
          localStorage.removeItem('interviewiq_is_logged_in');
          localStorage.removeItem('worknext_is_logged_in');
          localStorage.removeItem('interviewiq_user_profile');
          localStorage.removeItem('worknext_user_profile');
          localStorage.removeItem('worknext_supabase_token');
        }
      }
    } catch (e) {
      console.warn('Failed to clear session state on logout', e);
    }

    // Invalidate server session/cookies if any
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});

    // Redirect to login page
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== redirectUrl) {
        window.location.assign(redirectUrl);
      }
    }
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

  const addJob = async (job: Job): Promise<{ success: boolean; error?: string }> => {
    // Enforce role-based access: only recruiters, employers, or admins can post openings
    if (user.role !== 'recruiter' && (user.role as string) !== 'employer' && user.role !== 'admin' && !isAdminLoggedIn) {
      console.warn('Unauthorized: Only recruiter or employer accounts can post job openings.');
      return { success: false, error: 'Unauthorized: Only recruiter or employer accounts can post job openings.' };
    }
    const jobWithRecruiter: Job = {
      ...job,
      source: 'worknext',
      recruiterId: job.recruiterId || user.id || '',
      recruiterEmail: job.recruiterEmail || user.email || '',
    };
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': user.role || 'jobseeker',
          'x-recruiter-id': user.id || '',
          'x-recruiter-email': user.email || '',
        },
        body: JSON.stringify(jobWithRecruiter),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to post job opening' };
      }
      setJobs(prev => [data.job || jobWithRecruiter, ...prev]);
      return { success: true };
    } catch (err: any) {
      console.error('Failed to sync job with backend:', err);
      return { success: false, error: err.message || 'Network error while publishing job opening' };
    }
  };
  const getAppliedIdsForUser = (userId: string, initialList?: string[]): string[] => {
    const set = new Set<string>(initialList || []);
    if (!userId) return Array.from(set);
    try {
      // 1. Check user-specific list
      const saved = localStorage.getItem(`worknext_applied_${userId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          parsed.forEach(id => set.add(id));
        }
      }
      // 2. Check structured user-job map
      const mapRaw = localStorage.getItem('worknext_user_applied_jobs_map');
      if (mapRaw) {
        const map = JSON.parse(mapRaw);
        if (map && map[userId] && typeof map[userId] === 'object') {
          Object.keys(map[userId]).forEach(id => set.add(id));
        }
      }
    } catch (e) {
      console.warn('Error reading applied jobs for user', e);
    }
    return Array.from(set);
  };

  const getStoredNotificationsForUser = (userId?: string): NotificationItem[] => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return [];
      const cleanUserId = userId ? String(userId).trim() : '';
      if (cleanUserId) {
        const stored = localStorage.getItem(`worknext_notifications_${cleanUserId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
        const mapRaw = localStorage.getItem('worknext_user_notifications_map');
        if (mapRaw) {
          const map = JSON.parse(mapRaw);
          if (map && map[cleanUserId] && Array.isArray(map[cleanUserId]) && map[cleanUserId].length > 0) {
            return map[cleanUserId];
          }
        }
      }
      const guestStored = localStorage.getItem('worknext_notifications_guest');
      if (guestStored) {
        const parsedGuest = JSON.parse(guestStored);
        if (Array.isArray(parsedGuest) && parsedGuest.length > 0) return parsedGuest;
      }
    } catch (e) {
      console.warn('Error reading notifications for user', e);
    }
    return [];
  };

  const persistNotificationsForUser = (userId?: string, items: NotificationItem[] = []) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const cleanUserId = userId ? String(userId).trim() : '';
      if (cleanUserId) {
        localStorage.setItem(`worknext_notifications_${cleanUserId}`, JSON.stringify(items));
        const mapRaw = localStorage.getItem('worknext_user_notifications_map');
        const map = mapRaw ? JSON.parse(mapRaw) : {};
        map[cleanUserId] = items;
        localStorage.setItem('worknext_user_notifications_map', JSON.stringify(map));
      } else {
        localStorage.setItem('worknext_notifications_guest', JSON.stringify(items));
      }
    } catch (e) {
      console.warn('Failed to persist notifications locally', e);
    }
  };

  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => (isLoggedIn ? user.savedJobIds || [] : []));
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>(() => {
    if (!isLoggedIn || !user.id) return [];
    return getAppliedIdsForUser(user.id, user.appliedJobIds);
  });
  const [applications, setApplications] = useState<UserApplication[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    return getStoredNotificationsForUser(isLoggedIn ? user.id : undefined);
  });

  const getApplication = (jobId: string): UserApplication | undefined => {
    return applications.find(a => a.jobId === jobId);
  };

  const refreshApplications = async () => {
    const currentUserId = user.id || 'guest';
    const userEmail = user.email || '';
    if (!currentUserId && !userEmail) return;

    // Fetch real application records from database
    try {
      const res = await fetch(`/api/user/applications?userId=${encodeURIComponent(currentUserId)}&email=${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.applications)) {
          setApplications(data.applications);
          const syncedIds = data.applications.map((a: UserApplication) => a.jobId).filter(Boolean);
          if (syncedIds.length > 0) {
            setAppliedJobIds(prev => Array.from(new Set([...prev, ...syncedIds])));
          }
        }
      }
    } catch (e) {}

    // Fetch synced notifications from database (picks up recruiter status changes!)
    try {
      const notifRes = await fetch(`/api/user/notifications?userId=${encodeURIComponent(currentUserId)}&email=${encodeURIComponent(userEmail)}`);
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        if (notifData.success && Array.isArray(notifData.notifications) && notifData.notifications.length > 0) {
          setNotifications(prev => {
            const map = new Map<string, NotificationItem>();
            notifData.notifications.forEach((n: NotificationItem) => map.set(n.id, n));
            prev.forEach(p => {
              if (!map.has(p.id)) map.set(p.id, p);
            });
            const combined = Array.from(map.values());
            persistNotificationsForUser(currentUserId, combined);
            return combined;
          });
        }
      }
    } catch (e) {}
  };

  // Synchronize applied jobs and notifications whenever active user identity changes (user ID scoping)
  useEffect(() => {
    if (!isLoggedIn || !user.id) {
      setAppliedJobIds([]);
      const guestNotifs = getStoredNotificationsForUser();
      setNotifications(guestNotifs);
      return;
    }
    const userId = user.id;
    const loaded = getAppliedIdsForUser(userId, user.appliedJobIds);
    setAppliedJobIds(loaded);

    // 1. Load user notifications and merge any guest notifications created prior to login
    const localNotifs = getStoredNotificationsForUser(userId);
    const guestStored = localStorage.getItem('worknext_notifications_guest');
    let merged = [...localNotifs];
    if (guestStored) {
      try {
        const guestItems: NotificationItem[] = JSON.parse(guestStored);
        if (Array.isArray(guestItems)) {
          guestItems.forEach(item => {
            if (!merged.some(m => m.id === item.id)) {
              merged.push(item);
            }
          });
          localStorage.removeItem('worknext_notifications_guest');
        }
      } catch (e) {}
    }
    setNotifications(merged);
    persistNotificationsForUser(userId, merged);

    // Initial fetch of user applications and notifications
    refreshApplications();

    // Set up real-time polling to detect recruiter application status changes & notifications
    const pollInterval = setInterval(() => {
      refreshApplications();
    }, 6000);

    const onWindowFocus = () => {
      refreshApplications();
    };
    window.addEventListener('focus', onWindowFocus);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('focus', onWindowFocus);
    };
  }, [user.id, user.email, isLoggedIn]);
  
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

  const applyForJob = async (jobId: string, jobData?: Job): Promise<{ success: boolean; error?: string }> => {
    const job = jobData || jobs.find(j => j.id === jobId);
    const isExternal =
      job?.source === 'adzuna' ||
      job?.source === 'Adzuna' ||
      job?.source === 'linkedin' ||
      job?.source === 'LinkedIn' ||
      (typeof jobId === 'string' && (jobId.startsWith('adzuna_') || jobId.startsWith('linkedin_'))) ||
      (Boolean(job?.applyUrl) && job?.source !== 'worknext');

    const currentUserId = user.id || 'usr_init';

    // Helper to store applied status by user ID + job ID
    const persistUserJobApplication = (uId: string, jId: string, jObj?: Job) => {
      try {
        localStorage.setItem(`worknext_app_${uId}_${jId}`, 'true');

        const currentList = getAppliedIdsForUser(uId, appliedJobIds);
        if (!currentList.includes(jId)) {
          const nextList = [...currentList, jId];
          localStorage.setItem(`worknext_applied_${uId}`, JSON.stringify(nextList));
        }

        const mapRaw = localStorage.getItem('worknext_user_applied_jobs_map');
        const map = mapRaw ? JSON.parse(mapRaw) : {};
        if (!map[uId]) map[uId] = {};
        map[uId][jId] = {
          appliedAt: new Date().toISOString(),
          source: jObj?.source || 'External',
          title: jObj?.title || '',
        };
        localStorage.setItem('worknext_user_applied_jobs_map', JSON.stringify(map));
      } catch (e) {
        console.warn('Could not persist applied job locally', e);
      }
    };

    // For Adzuna / LinkedIn external jobs:
    // When user clicks Apply Now, open external application URL in new tab.
    // Immediately after click, save job as Applied for current user (user ID + job ID).
    // Change button from Apply Now to Applied.
    // When user comes back or refreshes, keep showing Applied for that job.
    // Do not require confirmation popup; do not wait for external confirmation.
    if (isExternal) {
      if (job?.applyUrl && typeof window !== 'undefined') {
        window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
      }

      // Store applied status by user ID + job ID
      persistUserJobApplication(currentUserId, jobId, job);

      // Immediately update state so UI changes from Apply Now to Applied
      if (!appliedJobIds.includes(jobId)) {
        const next = [...appliedJobIds, jobId];
        setAppliedJobIds(next);
        setUser(u => ({ ...u, appliedJobIds: next }));
      }

      // Record in applications state with status strictly 'applied'
      const extAppRecord: UserApplication = {
        id: `ext_${Date.now()}`,
        jobId,
        jobTitle: (job?.title || 'Open Position').trim(),
        company: (job?.company || 'Company').trim(),
        location: job?.location || '',
        source: job?.source || 'Adzuna',
        status: 'applied', // Strictly applied for external
        appliedDate: 'Just now',
        isExternal: true,
      };
      setApplications(prev => [extAppRecord, ...prev.filter(a => a.jobId !== jobId)]);

      // Create notification: "You applied for [Job Title] at [Company]."
      const jobTitle = (job?.title || 'Open Position').trim();
      const company = (job?.company || 'Company').trim();
      const newNotif: NotificationItem = {
        id: `notif_ext_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: 'Application Recorded',
        message: `You applied for ${jobTitle} at ${company}.`,
        timestamp: 'Just now',
        type: 'application',
        read: false,
        link: '/notifications'
      };

      setNotifications(prev => {
        const updated = [newNotif, ...prev.filter(n => n.id !== newNotif.id)];
        persistNotificationsForUser(currentUserId, updated);
        return updated;
      });

      // Sync notification to backend store
      fetch('/api/user/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          notification: newNotif,
        }),
      }).catch(err => console.warn('Sync external notification note:', err));

      // Sync asynchronously to backend user applied tracking
      fetch('/api/user/applied-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          jobId,
          jobTitle: job?.title || '',
          company: job?.company || '',
          source: job?.source || 'Adzuna',
        }),
      }).catch(err => console.warn('Sync external applied job note:', err));

      return { success: true };
    }

    // Keep WorkNext Recruiter applications separate; those submit directly to recruiter
    try {
      const res = await fetch('/api/recruiter/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUserId,
          'x-user-email': user.email || '',
        },
        body: JSON.stringify({
          userId: currentUserId,
          name: user.name || user.email || 'Job Applicant',
          email: user.email || '',
          phone: user.phone || '',
          location: user.location || '',
          role: user.title || user.extractedProfile?.targetRole || 'Applicant',
          experienceYears: user.experienceYears || 0,
          matchScore: job?.matchScore || 0,
          skills: user.extractedProfile?.skills || user.skills || [],
          bio: user.bio || '',
          status: 'applied',
          appliedJobTitle: job?.title || 'Open Position',
          appliedJobId: jobId,
          company: job?.company || 'WorkNext Recruiter Partner',
          source: 'WorkNext Recruiter',
          recruiterId: job?.recruiterId || '',
          recruiterEmail: job?.recruiterEmail || '',
        }),
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        return { success: false, error: data.error || 'Failed to submit application.' };
      }

      // Store applied status by user ID + job ID
      persistUserJobApplication(currentUserId, jobId, job);

      // Record in applications state with initial status 'applied'
      const recruiterAppRecord: UserApplication = {
        id: data.candidate?.id || `cand_${Date.now()}`,
        jobId,
        jobTitle: job?.title || 'Open Position',
        company: job?.company || 'WorkNext Recruiter Partner',
        location: job?.location || '',
        source: 'WorkNext Recruiter',
        status: 'applied',
        appliedDate: 'Just now',
        recruiterId: job?.recruiterId || '',
        isExternal: false,
      };
      setApplications(prev => [recruiterAppRecord, ...prev.filter(a => a.jobId !== jobId)]);

      if (!appliedJobIds.includes(jobId)) {
        const next = [...appliedJobIds, jobId];
        setAppliedJobIds(next);
        setUser(u => ({ ...u, appliedJobIds: next }));

        if (job) {
          const newNotif: NotificationItem = {
            id: 'not_' + Date.now(),
            title: 'Application Submitted',
            message: `You applied for ${job.title} at ${job.company}.`,
            timestamp: 'Just now',
            type: 'application',
            read: false,
            link: '/dashboard'
          };
          setNotifications(prev => {
            const updated = [newNotif, ...prev];
            persistNotificationsForUser(currentUserId, updated);
            return updated;
          });

          // Sync notification to backend
          fetch('/api/user/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: currentUserId,
              notification: newNotif,
            }),
          }).catch(() => {});
        }
      }

      return { success: true };
    } catch (err: any) {
      console.warn('Could not sync application to backend:', err);
      return { success: false, error: 'Could not connect to recruiter application service.' };
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => (n.id === id ? { ...n, read: true } : n));
      persistNotificationsForUser(user.id, updated);
      return updated;
    });
    if (user.id) {
      fetch('/api/user/notifications/read', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, notificationId: id }),
      }).catch(() => {});
    }
  };

  const clearAllNotifications = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      persistNotificationsForUser(user.id, updated);
      return updated;
    });
    if (user.id) {
      fetch('/api/user/notifications/read', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, all: true }),
      }).catch(() => {});
    }
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
        applications,
        getApplication,
        refreshApplications,
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
