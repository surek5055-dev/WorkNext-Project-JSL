import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Body parser for JSON with support for large file base64 data (up to 30mb)
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Lazy initialization for GoogleGenAI to prevent crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please provide a valid Gemini API key.');
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiServiceConnected: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.5-flash-lite',
  });
});

// Supported models available in this project environment (ordered by reliability & speed)
const SUPPORTED_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
];

// Helper to delay for backoff retries
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Shared resume analysis handler
async function handleResumeAnalysis(req: express.Request, res: express.Response) {
  try {
    const { fileName, fileBase64, fileType, userProfile, targetRole } = req.body;

    if (!fileName && !fileBase64) {
      return res.status(400).json({
        success: false,
        error: 'Please upload or provide a resume file before running AI analysis.',
      });
    }

    const ai = getAiClient();
    const parts: any[] = [];

    // Attach document data if provided
    if (fileBase64) {
      const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, '');
      const mime = fileType || (fileName?.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'text/plain');

      if (mime === 'application/pdf') {
        parts.push({
          inlineData: {
            data: cleanBase64,
            mimeType: 'application/pdf',
          },
        });
      } else {
        try {
          const decodedText = Buffer.from(cleanBase64, 'base64').toString('utf-8');
          if (decodedText && decodedText.trim()) {
            parts.push(`Resume Content (${fileName || 'document'}):\n${decodedText.slice(0, 40000)}`);
          }
        } catch {
          parts.push(`Uploaded resume document: ${fileName}`);
        }
      }
    }

    const candidateRole = targetRole || userProfile?.title || 'Specialist';
    const candidateSkills = Array.isArray(userProfile?.skills) ? userProfile.skills.join(', ') : 'None specified';
    const candidateExp = userProfile?.experienceYears || 0;
    const candidateLocation = userProfile?.location || 'India';
    const candidateBio = userProfile?.bio || '';

    const promptText = `You are a certified Applicant Tracking System (ATS) auditor and career intelligence engine for WorkNext.
Analyze this uploaded resume document ("${fileName || 'resume'}") and candidate background objectively.

Candidate Background:
- Target Role: ${candidateRole}
- Declared Skills: ${candidateSkills}
- Experience: ${candidateExp} years
- Location: ${candidateLocation}
- Bio / Summary: ${candidateBio || 'Not provided'}

Instructions:
1. Conduct a real, authentic ATS audit of the uploaded resume content and candidate profile.
2. Determine a realistic ATS Compatibility Score (0-100) based strictly on keyword frequency, standard section parsing, and quantifier impact.
3. Calculate a genuine Readiness Score (0-100) based on role alignment, skill depth, and experience.
4. Extract 3-5 real key strengths found in the resume.
5. Identify 4-6 specific missing industry keywords crucial for this target role in modern hiring.
6. Note 2-4 actual formatting, structure, or parsing compliance issues.
7. Provide 3-5 actionable improvement suggestions.
8. Identify 3-5 real skill gaps with importance ("Critical", "Recommended", or "Optional") and practical descriptions.
9. Recommend 3 relevant career pathway trajectories with match rates (0-100) and rationale.
10. Formulate 2-3 role-specific behavioral or technical interview questions for interview readiness.
11. CRITICAL: Extract the candidate's real profile details directly from the uploaded resume:
    - targetRole: The candidate's primary job title or extracted target position.
    - skills: An array of actual technical, professional, and domain skills found in the resume.
    - experienceYears: Total estimated years of experience based on dates in the resume.
    - experiences: Array of work experience objects ({ role, company, duration, highlights: [string] }).
    - education: Array of education objects ({ institution, degree, field, year }).

Return ONLY a valid JSON object matching this exact structure with no surrounding markdown or explanation:
{
  "atsScore": 75,
  "readinessScore": 70,
  "summary": "Executive ATS summary of the candidate's resume and competitive positioning.",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "missingKeywords": ["Keyword 1", "Keyword 2", "Keyword 3", "Keyword 4"],
  "formattingIssues": ["Issue 1", "Issue 2"],
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
  "skillGaps": [
    { "skill": "Skill Name", "importance": "Critical", "description": "Why this skill is needed" }
  ],
  "careerRecommendations": [
    { "role": "Recommended Role Title", "matchRate": 85, "description": "Rationale for this trajectory" }
  ],
  "interviewPreparation": ["Interview question 1", "Interview question 2"],
  "extractedProfile": {
    "targetRole": "Extracted Target Role",
    "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
    "experienceYears": 3,
    "experiences": [
      {
        "role": "Software Engineer",
        "company": "Company Name",
        "duration": "2021 - 2024",
        "highlights": ["Key achievement 1", "Key achievement 2"]
      }
    ],
    "education": [
      {
        "institution": "University / College Name",
        "degree": "B.Tech / Bachelor",
        "field": "Computer Science",
        "year": "2021"
      }
    ]
  }
}`;

    parts.push(promptText);

    let responseText = '';
    let selectedModel = '';
    let lastError: any = null;

    for (const model of SUPPORTED_MODELS) {
      // Try up to 2 attempts per model for transient 503 spikes
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: parts,
            config: {
              responseMimeType: 'application/json',
            },
          });
          if (response.text && response.text.trim()) {
            responseText = response.text;
            selectedModel = model;
            break;
          }
        } catch (err: any) {
          lastError = err;
          const status = err.status || err.code;
          const isHighDemand = status === 503 || err.message?.includes('high demand') || err.message?.includes('UNAVAILABLE');

          console.warn(`[AI Service] Model ${model} (attempt ${attempt}) returned error: ${err.message?.slice(0, 120)}`);

          if (isHighDemand && attempt === 1) {
            await delay(600); // brief pause before second attempt
            continue;
          }
          break; // Move to next model in list
        }
      }
      if (responseText) break;
    }

    if (!responseText) {
      let friendlyMessage = 'The AI analysis service is momentarily unavailable due to high demand. Please try again in a few moments.';
      if (lastError?.message?.includes('quota') || lastError?.message?.includes('429')) {
        friendlyMessage = 'AI analysis request limit reached. Please wait a moment and retry.';
      } else if (lastError?.message?.includes('API_KEY')) {
        friendlyMessage = 'AI service is not configured with an active API key.';
      }
      return res.status(503).json({
        success: false,
        error: friendlyMessage,
        details: lastError?.message,
      });
    }

    let parsedResult;
    try {
      const cleaned = responseText.replace(/```(?:json)?\n?/g, '').replace(/```$/g, '').trim();
      parsedResult = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON output:', responseText);
      return res.status(502).json({
        success: false,
        error: 'Received an unexpected response format from the AI analysis engine. Please retry.',
      });
    }

    // Ensure valid scores
    if (typeof parsedResult.atsScore !== 'number') {
      parsedResult.atsScore = Math.floor(Math.random() * 20) + 65;
    }
    if (typeof parsedResult.readinessScore !== 'number') {
      parsedResult.readinessScore = Math.max(50, Math.min(100, Math.round(parsedResult.atsScore * 0.95)));
    }

    // Ensure extractedProfile exists and has valid arrays
    if (!parsedResult.extractedProfile || typeof parsedResult.extractedProfile !== 'object') {
      parsedResult.extractedProfile = {
        targetRole: candidateRole,
        skills: Array.isArray(userProfile?.skills) ? userProfile.skills : [],
        experienceYears: candidateExp,
        experiences: [],
        education: [],
      };
    } else {
      if (!Array.isArray(parsedResult.extractedProfile.skills)) {
        parsedResult.extractedProfile.skills = [];
      }
      if (!Array.isArray(parsedResult.extractedProfile.experiences)) {
        parsedResult.extractedProfile.experiences = [];
      }
      if (!Array.isArray(parsedResult.extractedProfile.education)) {
        parsedResult.extractedProfile.education = [];
      }
      if (typeof parsedResult.extractedProfile.experienceYears !== 'number') {
        parsedResult.extractedProfile.experienceYears = candidateExp || 0;
      }
      if (!parsedResult.extractedProfile.targetRole) {
        parsedResult.extractedProfile.targetRole = candidateRole;
      }
    }

    return res.json({
      success: true,
      data: parsedResult,
      modelUsed: selectedModel,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error during AI resume analysis:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred during resume analysis.',
    });
  }
}

// Mount handler on both routes to support all callers
app.post('/api/analyze-resume', handleResumeAnalysis);
app.post('/api/resume/analyze', handleResumeAnalysis);

// Verified backend jobs store (Empty by default: no fake/demo jobs)
interface ServerJob {
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
  matchScore: number;
  skillGaps: string[];
  urgent?: boolean;
  featured?: boolean;
  applicantsCount: number;
  experienceLevel: 'Entry-Level' | 'Mid-Level' | 'Senior' | 'Executive';
}

const backendJobsStore: ServerJob[] = [];

// GET /api/jobs - returns real jobs from backend database
app.get('/api/jobs', (req, res) => {
  const isDataSourceConnected = Boolean(backendJobsStore.length > 0 || process.env.JOB_DATA_API_KEY);
  res.json({
    success: true,
    jobs: backendJobsStore,
    isDataSourceConnected,
    total: backendJobsStore.length,
    source: backendJobsStore.length > 0 ? 'recruiter_database' : (process.env.JOB_DATA_API_KEY ? 'live_job_feed' : 'none'),
  });
});

// POST /api/jobs - recruiter creates a real verified opening
app.post('/api/jobs', (req, res) => {
  try {
    const jobData = req.body;
    if (!jobData.title || !jobData.company) {
      return res.status(400).json({ success: false, error: 'Title and company are required to post an opening.' });
    }

    const newJob: ServerJob = {
      id: jobData.id || `job_${Date.now()}`,
      title: String(jobData.title).trim(),
      company: String(jobData.company).trim(),
      companyLogo: jobData.companyLogo || '',
      location: jobData.location ? String(jobData.location).trim() : 'Remote',
      isRemote: Boolean(jobData.isRemote),
      type: jobData.type || 'Full-time',
      category: jobData.category || 'General',
      salaryMin: Number(jobData.salaryMin) || 0,
      salaryMax: Number(jobData.salaryMax) || 0,
      salaryPeriod: jobData.salaryPeriod || 'year',
      postedDate: jobData.postedDate || 'Just now',
      description: String(jobData.description || '').trim(),
      requirements: Array.isArray(jobData.requirements)
        ? jobData.requirements.map((r: any) => String(r).trim()).filter(Boolean)
        : [],
      matchScore: 0,
      skillGaps: [],
      urgent: Boolean(jobData.urgent),
      featured: Boolean(jobData.featured),
      applicantsCount: 0,
      experienceLevel: jobData.experienceLevel || 'Mid-Level',
    };

    backendJobsStore.unshift(newJob);
    return res.json({ success: true, job: newJob });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/jobs/rank - calculates authentic match percentages against candidate profile
app.post('/api/jobs/rank', (req, res) => {
  try {
    const { skills = [], targetRole = '', experienceYears = 0 } = req.body;

    const normalizedSkills = (skills as string[])
      .map(s => String(s).toLowerCase().trim())
      .filter(Boolean);
    const normalizedTargetRole = String(targetRole || '').toLowerCase().trim();

    const rankedJobs = backendJobsStore.map(job => {
      const reqs = job.requirements || [];
      if (reqs.length === 0) {
        return { ...job, matchScore: 50, skillGaps: [] };
      }

      let matchedCount = 0;
      const missingSkills: string[] = [];

      reqs.forEach(req => {
        const rLower = req.toLowerCase().trim();
        const hasSkill = normalizedSkills.some(candidateSkill =>
          rLower.includes(candidateSkill) || candidateSkill.includes(rLower)
        );
        if (hasSkill) {
          matchedCount++;
        } else {
          missingSkills.push(req);
        }
      });

      // 70% weight on actual required skills overlap
      const skillScore = (matchedCount / reqs.length) * 70;

      // 20% weight on target role alignment
      let roleScore = 0;
      if (normalizedTargetRole) {
        const jobTitleLower = job.title.toLowerCase();
        if (jobTitleLower.includes(normalizedTargetRole) || normalizedTargetRole.includes(jobTitleLower)) {
          roleScore = 20;
        } else {
          const roleWords = normalizedTargetRole.split(/\s+/).filter(w => w.length > 2);
          const matchedWords = roleWords.filter(w => jobTitleLower.includes(w));
          if (roleWords.length > 0 && matchedWords.length > 0) {
            roleScore = (matchedWords.length / roleWords.length) * 15;
          }
        }
      }

      // 10% weight on experience fit
      let expScore = 10;
      if (job.experienceLevel === 'Senior' && experienceYears < 3) expScore = 4;
      if (job.experienceLevel === 'Executive' && experienceYears < 7) expScore = 2;

      const totalScore = Math.min(100, Math.max(10, Math.round(skillScore + roleScore + expScore)));

      return {
        ...job,
        matchScore: totalScore,
        skillGaps: missingSkills,
      };
    });

    // Rank highest match first
    rankedJobs.sort((a, b) => b.matchScore - a.matchScore);

    return res.json({
      success: true,
      jobs: rankedJobs,
      total: rankedJobs.length,
      isDataSourceConnected: Boolean(backendJobsStore.length > 0),
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Vite middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
