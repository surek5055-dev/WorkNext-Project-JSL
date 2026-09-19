import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  Compass,
  Sparkles,
  Zap,
  FileText,
  Briefcase,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../ui/Button';

export const HeroSection: React.FC = () => {
  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const elem = document.getElementById('features');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = 'features';
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-28 bg-[#FAF9F6] dark:bg-[#070A08] text-[#16181A] dark:text-[#EDECE8] selection:bg-emerald-500/20 selection:text-emerald-900 dark:selection:text-emerald-200 transition-colors duration-300">
      
      {/* Background Architectural Atmosphere: Warm Parchment (Light) / Forest Obsidian (Dark) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Subtle geometric precision grid */}
        <div 
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Deep forest emerald ambient glow (top-right) */}
        <motion.div
          animate={{
            opacity: [0.12, 0.22, 0.12],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 right-0 w-[680px] h-[680px] bg-emerald-500/15 dark:bg-[#064E3B]/30 rounded-full blur-[160px]"
        />

        {/* Muted antique brass ambient bloom (bottom-left) */}
        <motion.div
          animate={{
            opacity: [0.06, 0.12, 0.06],
            scale: [1, 1.06, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute -bottom-36 -left-20 w-[540px] h-[540px] bg-amber-500/10 dark:bg-[#B48C36]/15 rounded-full blur-[150px]"
        />

        {/* Edge vignette for dark mode */}
        <div className="hidden dark:block absolute inset-0 bg-radial-gradient from-transparent via-[#070A08]/40 to-[#070A08] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ============================================================
              LEFT COLUMN: Editorial Typography & Human-Centric Narrative
             ============================================================ */}
          <div className="lg:col-span-7 space-y-8 lg:space-y-10 text-left">
            
            {/* Minimal Brand Tag */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-stone-200/60 dark:bg-white/[0.03] border border-stone-300 dark:border-white/10 backdrop-blur-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              <span className="font-mono text-[11px] font-semibold tracking-[0.2em] uppercase text-emerald-800 dark:text-emerald-300">
                WorkNext
              </span>
              <span className="text-stone-400 dark:text-white/20">|</span>
              <span className="text-xs text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                Career Platform
              </span>
            </motion.div>

            {/* Oversized Headline: Modern Sans + Elegant Serif Italic */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-1"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-[76px] xl:text-[84px] font-normal tracking-[-0.03em] leading-[1.03]">
                <span className="font-sans font-extrabold tracking-tight block text-stone-900 dark:text-white drop-shadow-xs dark:drop-shadow-sm">
                  Empowering
                </span>
                <span className="font-serif-editorial italic font-normal block text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-teal-700 to-amber-700 dark:from-[#F6F4ED] dark:via-[#ECDAB9] dark:to-[#86EFAC] mt-1 sm:mt-2">
                  India’s Workforce
                </span>
              </h1>
            </motion.div>

            {/* Exact Requested Hero Content & Quotation */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative pl-5 sm:pl-6 border-l-2 border-emerald-600 dark:border-emerald-500/40 max-w-2xl"
            >
              <p className="text-base sm:text-lg lg:text-xl text-stone-700 dark:text-[#B9C4BC] font-serif-editorial italic leading-relaxed">
                “An AI-powered career platform helping students and job seekers identify skill gaps, improve their resumes, discover opportunities, and plan their career growth.”
              </p>
            </motion.div>

            {/* High-End Editorial Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <Link to="/signup" className="group">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
                  iconPosition="right"
                  className="w-full sm:w-auto text-base py-4 px-8 bg-[#0F766E] hover:bg-[#0D655E] text-white font-semibold rounded-[16px] shadow-lg shadow-teal-900/20 dark:shadow-emerald-950/50 border border-teal-400/25 transition-all duration-300"
                >
                  Get Started
                </Button>
              </Link>

              <button
                onClick={scrollToFeatures}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 text-base py-4 px-7 rounded-[16px] border border-stone-300 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] hover:bg-stone-100 dark:hover:bg-white/[0.07] hover:border-emerald-500/40 text-stone-800 dark:text-stone-200 hover:text-stone-950 dark:hover:text-white font-medium transition-all duration-300 backdrop-blur-sm cursor-pointer shadow-xs dark:shadow-none group"
              >
                <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:rotate-45 transition-transform duration-300" />
                <span>Explore Features</span>
              </button>
            </motion.div>

          </div>

          {/* ============================================================
              RIGHT COLUMN: Abstract Digital Globe & Connected Career Growth
              Subtle latitude/longitude lines, glowing connection points,
              4 small labels (Resume, Skills, Jobs, Career Guidance),
              and luminous trajectories converging toward Career Growth.
             ============================================================ */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            <div className="relative w-full max-w-[520px] aspect-square flex items-center justify-center select-none">
              
              {/* Soft Ambient Radiance Blooms */}
              <div className="absolute inset-0 rounded-full bg-radial-gradient from-emerald-500/15 via-emerald-950/20 to-transparent blur-3xl pointer-events-none" />
              <div className="absolute top-8 right-8 w-48 h-48 rounded-full bg-[#D4AF37]/[0.08] blur-2xl pointer-events-none" />
              <div className="absolute bottom-10 left-6 w-44 h-44 rounded-full bg-[#064E3B]/25 blur-2xl pointer-events-none" />

              {/* Master SVG Canvas: Abstract Digital Globe Wireframe & Career Paths */}
              <svg
                viewBox="0 0 540 540"
                className="w-full h-full overflow-visible pointer-events-none"
              >
                <defs>
                  {/* Sphere Deep Ambient Core Gradient (Dark) */}
                  <radialGradient id="globeSphereGrad" cx="38%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#064E3B" stopOpacity="0.25" />
                    <stop offset="55%" stopColor="#0A1813" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#030806" stopOpacity="0.04" />
                  </radialGradient>

                  {/* Sphere Deep Ambient Core Gradient (Light) */}
                  <radialGradient id="globeSphereGradLight" cx="38%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#99F6E4" stopOpacity="0.30" />
                    <stop offset="55%" stopColor="#CCFBF1" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#FAF9F6" stopOpacity="0.05" />
                  </radialGradient>

                  {/* Luminous Rim Gradient */}
                  <linearGradient id="globeRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
                    <stop offset="35%" stopColor="#10B981" stopOpacity="0.75" />
                    <stop offset="70%" stopColor="#34D399" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.25" />
                  </linearGradient>

                  {/* Flowing Path Gradients */}
                  <linearGradient id="pathSkillsResume" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#F5F3EF" stopOpacity="0.9" />
                  </linearGradient>

                  <linearGradient id="pathResumeGuidance" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5F3EF" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.85" />
                  </linearGradient>

                  <linearGradient id="pathGuidanceJobs" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#34D399" stopOpacity="0.9" />
                  </linearGradient>

                  <linearGradient id="pathJobsGrowth" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#34D399" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#F5F3EF" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="1" />
                  </linearGradient>

                  <linearGradient id="pathGuidanceGrowth" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.75" />
                    <stop offset="70%" stopColor="#D4AF37" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Outer Atmospheric Orbital Rims */}
                <circle cx="270" cy="270" r="216" fill="none" className="stroke-stone-900/[0.05] dark:stroke-white/[0.03]" strokeWidth="1" />
                <circle cx="270" cy="270" r="208" fill="none" className="stroke-emerald-600/25 dark:stroke-emerald-400/15" strokeWidth="1" strokeDasharray="3 8" />

                {/* Outer Horizon Ring */}
                <ellipse cx="270" cy="270" rx="234" ry="68" fill="none" className="stroke-amber-600/25 dark:stroke-amber-400/20" strokeWidth="1" strokeDasharray="4 12" />

                {/* Main Digital Globe Sphere Silhouette */}
                <circle
                  cx="270"
                  cy="270"
                  r="195"
                  className="fill-[url(#globeSphereGradLight)] dark:fill-[url(#globeSphereGrad)]"
                  stroke="url(#globeRimGrad)"
                  strokeWidth="1.6"
                />

                {/* ============================================================
                    TILTED AXIAL GLOBE WIREFRAME: Latitude & Longitude Coordinates
                   ============================================================ */}
                <g transform="rotate(-18 270 270)">
                  {/* Subtle Polar Axis Line */}
                  <line x1="270" y1="52" x2="270" y2="488" className="stroke-stone-900/15 dark:stroke-white/10" strokeWidth="1" strokeDasharray="4 8" />
                  <circle cx="270" cy="75" r="2.5" fill="#D4AF37" opacity="0.8" />
                  <circle cx="270" cy="465" r="2" fill="#10B981" opacity="0.7" />

                  {/* Parallels (Latitude lines) */}
                  {/* Equator */}
                  <ellipse cx="270" cy="270" rx="195" ry="52" fill="none" className="stroke-emerald-600/40 dark:stroke-emerald-400/40" strokeWidth="1.4" />
                  <motion.ellipse
                    cx="270"
                    cy="270"
                    rx="195"
                    ry="52"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="1.2"
                    strokeDasharray="4 16"
                    animate={{ strokeDashoffset: [0, -80] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* North Latitudes */}
                  <ellipse cx="270" cy="216" rx="187" ry="45" fill="none" className="stroke-stone-900/15 dark:stroke-white/12" strokeWidth="1" />
                  <ellipse cx="270" cy="165" rx="155" ry="35" fill="none" className="stroke-emerald-600/25 dark:stroke-emerald-400/25" strokeWidth="1" strokeDasharray="4 8" />
                  <ellipse cx="270" cy="116" rx="104" ry="22" fill="none" className="stroke-stone-900/15 dark:stroke-white/[0.08]" strokeWidth="1" />

                  {/* South Latitudes */}
                  <ellipse cx="270" cy="324" rx="187" ry="45" fill="none" className="stroke-stone-900/15 dark:stroke-white/12" strokeWidth="1" />
                  <ellipse cx="270" cy="375" rx="155" ry="35" fill="none" className="stroke-emerald-600/25 dark:stroke-emerald-400/25" strokeWidth="1" strokeDasharray="4 8" />
                  <ellipse cx="270" cy="424" rx="104" ry="22" fill="none" className="stroke-stone-900/15 dark:stroke-white/[0.08]" strokeWidth="1" />

                  {/* Meridians (Longitude lines) */}
                  <ellipse cx="270" cy="270" rx="44" ry="195" fill="none" className="stroke-stone-900/15 dark:stroke-white/16" strokeWidth="1" />
                  <ellipse cx="270" cy="270" rx="98" ry="195" fill="none" className="stroke-emerald-600/30 dark:stroke-emerald-400/30" strokeWidth="1" strokeDasharray="5 9" />
                  <ellipse cx="270" cy="270" rx="148" ry="195" fill="none" className="stroke-stone-900/15 dark:stroke-white/12" strokeWidth="1" />
                  <ellipse cx="270" cy="270" rx="182" ry="195" fill="none" className="stroke-emerald-600/25 dark:stroke-emerald-400/20" strokeWidth="1" />

                  {/* Mesh Intersection Glowing Data Points */}
                  {[
                    { cx: 226, cy: 216 },
                    { cx: 314, cy: 216 },
                    { cx: 172, cy: 270 },
                    { cx: 368, cy: 270 },
                    { cx: 226, cy: 324 },
                    { cx: 314, cy: 324 },
                    { cx: 270, cy: 165 },
                    { cx: 270, cy: 375 },
                    { cx: 195, cy: 165 },
                    { cx: 345, cy: 165 },
                    { cx: 195, cy: 375 },
                    { cx: 345, cy: 375 },
                  ].map((pt, idx) => (
                    <g key={idx}>
                      <circle cx={pt.cx} cy={pt.cy} r="1.8" fill="#FAF8F5" />
                      <circle cx={pt.cx} cy={pt.cy} r="4.5" fill="none" stroke="rgba(16, 185, 129, 0.35)" strokeWidth="0.8" />
                    </g>
                  ))}
                </g>

                {/* ============================================================
                    FLOWING CAREER CONNECTIONS: Leading toward Career Growth
                   ============================================================ */}

                {/* Path 1: Skills (135, 345) to Resume (170, 185) */}
                <path
                  d="M 135 345 C 120 265, 145 205, 170 185"
                  fill="none"
                  stroke="url(#pathSkillsResume)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <motion.path
                  d="M 135 345 C 120 265, 145 205, 170 185"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.6"
                  strokeDasharray="4 12"
                  animate={{ strokeDashoffset: [0, -48] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                />

                {/* Path 2: Resume (170, 185) to Career Guidance (300, 270) */}
                <path
                  d="M 170 185 C 215 190, 260 230, 300 270"
                  fill="none"
                  stroke="url(#pathResumeGuidance)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <motion.path
                  d="M 170 185 C 215 190, 260 230, 300 270"
                  fill="none"
                  stroke="#A7F3D0"
                  strokeWidth="1.6"
                  strokeDasharray="4 12"
                  animate={{ strokeDashoffset: [0, -48] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                />

                {/* Supporting Baseline Corridor: Skills (135, 345) to Career Guidance (300, 270) */}
                <path
                  d="M 135 345 C 190 355, 255 320, 300 270"
                  fill="none"
                  stroke="rgba(16, 185, 129, 0.22)"
                  strokeWidth="1.2"
                  strokeDasharray="4 6"
                />

                {/* Path 3: Career Guidance (300, 270) to Jobs (380, 385) */}
                <path
                  d="M 300 270 C 335 305, 360 345, 380 385"
                  fill="none"
                  stroke="url(#pathGuidanceJobs)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <motion.path
                  d="M 300 270 C 335 305, 360 345, 380 385"
                  fill="none"
                  stroke="#6EE7B7"
                  strokeWidth="1.6"
                  strokeDasharray="4 12"
                  animate={{ strokeDashoffset: [0, -48] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                />

                {/* Trajectory toward Career Growth from Jobs (380, 385) to (445, 105) */}
                <path
                  d="M 380 385 C 445 350, 475 230, 445 105"
                  fill="none"
                  stroke="url(#pathJobsGrowth)"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
                <path
                  d="M 380 385 C 445 350, 475 230, 445 105"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="6"
                  className="opacity-25 blur-sm"
                />
                <motion.path
                  d="M 380 385 C 445 350, 475 230, 445 105"
                  fill="none"
                  stroke="#FEF3C7"
                  strokeWidth="2"
                  strokeDasharray="6 14"
                  animate={{ strokeDashoffset: [0, -60] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: 'linear' }}
                />

                {/* Direct Strategic Conduit from Career Guidance (300, 270) into Career Growth (445, 105) */}
                <path
                  d="M 300 270 C 355 210, 405 150, 445 105"
                  fill="none"
                  stroke="url(#pathGuidanceGrowth)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <motion.path
                  d="M 300 270 C 355 210, 405 150, 445 105"
                  fill="none"
                  stroke="#FEF08A"
                  strokeWidth="1.6"
                  strokeDasharray="4 12"
                  animate={{ strokeDashoffset: [0, -48] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                />

                {/* Apex Vector Arrow pointing toward Career Growth */}
                <g transform="translate(445, 105) rotate(-45)">
                  <path
                    d="M -5 -3.5 L 0 0 L -5 3.5"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </g>
              </svg>

              {/* ============================================================
                  LAYER 2: Connected Nodes with 4 Minimal Labels + Career Growth
                 ============================================================ */}

              {/* 1. SKILLS */}
              <div 
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={{ left: '25%', top: '64%' }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#0A110D]/90 border border-emerald-600/30 dark:border-emerald-500/35 backdrop-blur-md shadow-md shadow-stone-400/20 dark:shadow-black/50 hover:border-emerald-400 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30 dark:border-emerald-400/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Zap className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-sans font-bold text-stone-900 dark:text-white tracking-wide leading-none pr-1">
                    Skills
                  </span>
                  <span className="absolute -inset-1 rounded-full border border-emerald-400/30 animate-ping pointer-events-none opacity-40" />
                </motion.div>
              </div>

              {/* 2. RESUME */}
              <div 
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={{ left: '31.5%', top: '34%' }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#0A110D]/90 border border-stone-300 dark:border-stone-300/35 backdrop-blur-md shadow-md shadow-stone-400/20 dark:shadow-black/50 hover:border-stone-400 dark:hover:border-white transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-stone-100 dark:bg-white/15 border border-stone-300 dark:border-white/30 flex items-center justify-center text-stone-700 dark:text-stone-100 shrink-0">
                    <FileText className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-sans font-bold text-stone-900 dark:text-white tracking-wide leading-none pr-1">
                    Resume
                  </span>
                </motion.div>
              </div>

              {/* 3. CAREER GUIDANCE */}
              <div 
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={{ left: '55.5%', top: '50%' }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#0A110D]/90 border border-teal-500/40 dark:border-teal-500/35 backdrop-blur-md shadow-md shadow-stone-400/20 dark:shadow-black/50 hover:border-teal-400 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-teal-500/15 dark:bg-teal-500/20 border border-teal-500/30 dark:border-teal-400/40 flex items-center justify-center text-teal-600 dark:text-teal-300 shrink-0">
                    <Compass className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-sans font-bold text-stone-900 dark:text-white tracking-wide leading-none whitespace-nowrap pr-1">
                    Career Guidance
                  </span>
                </motion.div>
              </div>

              {/* 4. JOBS */}
              <div 
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={{ left: '70.5%', top: '71%' }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#0A110D]/90 border border-emerald-600/30 dark:border-emerald-400/35 backdrop-blur-md shadow-md shadow-stone-400/20 dark:shadow-black/50 hover:border-emerald-400 dark:hover:border-emerald-300 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/15 dark:bg-emerald-400/20 border border-emerald-500/30 dark:border-emerald-300/40 flex items-center justify-center text-emerald-600 dark:text-emerald-300 shrink-0">
                    <Briefcase className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-sans font-bold text-stone-900 dark:text-white tracking-wide leading-none pr-1">
                    Jobs
                  </span>
                </motion.div>
              </div>

              {/* DESTINATION: CAREER GROWTH */}
              <div 
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={{ left: '82.5%', top: '19.5%' }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="group relative flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-[#0A110D]/95 border border-amber-500/60 dark:border-amber-400/50 backdrop-blur-md shadow-lg shadow-amber-900/15 dark:shadow-amber-950/40 hover:border-amber-400 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-500/15 dark:bg-amber-400/20 border border-amber-500/40 dark:border-amber-400/50 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
                    <TrendingUp className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-sans font-bold text-amber-900 dark:text-amber-200 tracking-wide leading-none pr-1">
                    Career Growth
                  </span>
                  {/* Radiant Ambient Beacon */}
                  <span className="absolute -inset-1.5 rounded-full border border-amber-400/30 animate-pulse pointer-events-none" />
                </motion.div>
              </div>

              {/* Minimal Digital Coordinate Footnote at visual corner */}
              <div className="absolute bottom-1 right-2 text-right pointer-events-none opacity-50 dark:opacity-40">
                <span className="text-[9px] font-mono tracking-[0.25em] text-emerald-700 dark:text-emerald-400 uppercase">
                  Global Opportunity Network
                </span>
              </div>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
};
