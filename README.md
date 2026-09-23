# WorkNext – Empowering India’s Workforce

WorkNext is an AI-powered workforce platform designed to help students and job seekers build better careers by connecting **resumes, skills, jobs, career guidance, and recruiters** in one platform.

The platform focuses on making the job-search process simpler, more accessible, and more personalized for users.

## 🚀 Key Features

* **User Authentication** – Secure signup and login using Supabase
* **Profile Management** – Create and manage professional profiles
* **Resume Builder** – Build and customize resumes directly on the platform
* **Resume Upload & Export** – Upload existing resumes and export resumes created on WorkNext
* **ATS Compatibility** – Analyze resumes for ATS compatibility
* **Skill Gap Analysis** – Identify skills that may be missing for a target career
* **Career Recommendations** – Get career suggestions based on profile and skills
* **Job Finder** – Discover relevant job and internship opportunities
* **Application Tracking** – Track submitted job and internship applications
* **AI Career Mentor** – Get career-related guidance through an AI chatbot
* **AI Mock Interview** – Practice interview questions and receive feedback
* **Recruiter Dashboard** – Recruiters can post opportunities and manage candidates
* **Notifications** – Receive updates about applications, jobs, and platform activities
* **Admin Dashboard** – Admins can monitor platform activity and manage users/recruiters
* **Responsive UI** – Designed for desktop, tablet, and mobile screens
* **Accessibility Support** – Focus on readable typography, contrast, and easy navigation

## 🧠 AI Features

WorkNext is designed to integrate AI into different stages of the career journey:

### AI Resume Analyzer

Analyzes a user's resume and can provide:

* ATS compatibility analysis
* Missing skills
* Resume improvement suggestions
* Grammar and content suggestions

### Skill Gap Analyzer

Compares a user's current skills with the skills required for a selected career or job role.

### Career Recommendation

Provides career-role suggestions based on the user's profile, skills, interests, and resume information.

### AI Career Mentor

A conversational assistant designed to provide career-related guidance and answer user questions.

### AI Mock Interview

Allows users to practice interview questions and receive feedback on their responses.

### Smart Job Matching

Helps connect users with job opportunities based on their profile, skills, resume, and preferences.

## 🛠️ Technology Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* JavaScript

### Backend & Database

* Supabase
* Supabase Authentication
* Supabase Database
* Supabase Storage

### AI

* AI-based resume analysis
* Skill gap analysis
* Career recommendations
* AI career mentor
* AI mock interview
* Smart job matching

## 📂 Project Structure

```text
WorkNext/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── services/
│   ├── hooks/
│   ├── lib/
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## 🔐 Data & Authentication

WorkNext uses Supabase for authentication and data management.

The application is designed to use real user information instead of hard-coded demo accounts or fake user statistics.

Features such as readiness scores, ATS analysis, skill gaps, recommendations, and application information should be generated from available user data and connected backend/AI services.

When sufficient data is not available, the interface displays an appropriate pending or empty state instead of presenting fake results.

## 👥 User Roles

WorkNext supports different platform roles:

### Job Seeker / Student

Users can:

* Create their profile
* Build or upload a resume
* Analyze their resume
* Identify skill gaps
* Explore jobs and internships
* Track applications
* Get career guidance
* Practice interviews

### Recruiter

Recruiters can:

* Create a recruiter profile
* Post job opportunities
* View candidates
* Manage applications
* Review candidate information

### Admin

Admins can:

* Monitor platform activity
* Manage users
* Review recruiter accounts
* Monitor job postings
* Manage platform-level information

## 🎨 Design Approach

WorkNext follows a modern, professional interface designed around career and workforce needs.

The UI focuses on:

* Clean navigation
* Responsive layouts
* Accessible design
* Clear information hierarchy
* Interactive components
* Professional typography
* Light and dark mode support
* Minimal unnecessary visual clutter

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd WorkNext
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Add any additional environment variables required by the connected AI or backend services.

### 4. Start the development server

```bash
npm run dev
```

The application will be available at the local development URL shown in the terminal.

## 🔄 Application Flow

```text
User
  ↓
Sign Up / Login
  ↓
Create Profile
  ↓
Build / Upload Resume
  ↓
Resume & Skill Analysis
  ↓
Career Guidance
  ↓
Job / Internship Discovery
  ↓
Apply
  ↓
Track Applications
  ↓
Interview Preparation
```

## 👩‍💻 Team – The Bachelors

| Member    | Role                                |
| --------- | ----------------------------------- |
| Sureka    | Frontend Development & UI/UX Design |
| Divyanshi | Backend Development & Database      |
| Vishal    | AI/ML Development                   |
| Kritika   | Research, Data & Integrations       |
| Prakriti  | Project Management & Documentation  |

## 🎯 Project Goal

The goal of WorkNext is to create a unified platform that helps students and job seekers move from **career discovery to employment** through personalized tools, AI-assisted guidance, resume support, job discovery, and application tracking.

## 📌 Project Status

WorkNext is being developed as an internship project by **The Bachelors**.

Some features depend on integration with backend, database, and AI services. The frontend provides the interface and user experience for these modules while connected services handle the underlying functionality.

## 📄 License

This project is developed for educational and internship purposes.

---

### WorkNext

**Empowering India’s Workforce**

**Project done by the team – The Bachelors**
