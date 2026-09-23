# WorkNext – Empowering India’s Workforce

WorkNext is an AI-powered workforce platform that helps students and job seekers manage **resumes, skills, careers, jobs, and applications** in one place.

## 🚀 Key Features

* **Authentication & Profiles** – Secure login and professional profiles
* **Resume Builder** – Create, upload, customize, and export resumes
* **ATS Compatibility** – Analyze resumes for ATS readiness
* **Skill Gap Analysis** – Identify skills required for target roles
* **Career Recommendations** – Get personalized career guidance
* **Job & Internship Finder** – Discover relevant opportunities
* **Application Tracking** – Manage and track applications
* **AI Career Mentor** – Interactive career guidance
* **AI Mock Interview** – Practice interviews with AI feedback
* **Recruiter Dashboard** – Post jobs and manage candidates
* **Admin Dashboard** – Manage users, recruiters, and job postings
* **Notifications** – Receive important application and platform updates
* **Responsive & Accessible UI** – Optimized for different devices and users

## 🧠 AI-Powered Features

* **Resume Analysis** – ATS compatibility, skill identification, and improvement suggestions
* **Skill Gap Analysis** – Compare current skills with target-role requirements
* **Career Recommendations** – Personalized career-path suggestions
* **AI Career Mentor** – Career-focused conversational assistance
* **AI Mock Interviews** – Interview practice with AI-powered feedback
* **Smart Job Matching** – Connect users with relevant opportunities

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
