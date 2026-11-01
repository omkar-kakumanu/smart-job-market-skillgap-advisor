import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  BookOpen,
  Target,
  Search,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Cpu
} from 'lucide-react';

import { useAuth } from '../hooks/useAuth';

const VIDEOS = [
  {
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081127_0992a171-d3c6-4978-8213-0ec5df8b6d63.mp4',
    label: 'Platform Overview',
  },
  {
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_092026_dd05b805-ea0f-40b2-8c52-332b88502592.mp4',
    label: 'Market Telemetry',
  },
  {
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081042_df7202bf-bd80-4b2b-bbc6-1f09ba2870e9.mp4',
    label: 'Skill Diagnostic',
  },
  {
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_080959_4cac5234-3573-464e-a5b7-76b94b8a7d61.mp4',
    label: 'AI Interview Studio',
  },
];

const STAT_ITEMS = [
  {
    value: '99.8%',
    label: 'Benchmark Accuracy',
    description: 'High-precision weighted scoring evaluating core versus complementary technical proficiencies',
    icon: Target,
    color: 'text-amber-500 dark:text-amber-400',
    bgColor: 'bg-amber-500/10 dark:bg-amber-400/10 border-amber-500/20 dark:border-amber-400/20',
  },
  {
    value: '10,000+',
    label: 'Market Signals Tracked',
    description: 'Real-time hiring requisitions analyzed continuously from top-tier tech employers',
    icon: TrendingUp,
    color: 'text-indigo-600 dark:text-sky-400',
    bgColor: 'bg-indigo-500/10 dark:bg-sky-400/10 border-indigo-500/20 dark:border-sky-400/20',
  },
  {
    value: '500+',
    label: 'Curated Skill Curricula',
    description: 'Direct algorithmic mapping of detected competency gaps to accredited certifications',
    icon: BookOpen,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10 dark:bg-emerald-400/10 border-emerald-500/20 dark:border-emerald-400/20',
  },
  {
    value: 'Verified',
    label: 'Auditable Credentials',
    description: 'Official candidate competency certificates backed by cryptographically secure verification',
    icon: ShieldCheck,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10 dark:bg-purple-400/10 border-purple-500/20 dark:border-purple-400/20',
  },
];

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [activeVideo, setActiveVideo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetRoleInput, setTargetRoleInput] = useState('');
  const navigate = useNavigate();

  // Automatic video rotation loop (1 -> 2 -> 3 -> 4 -> 1) every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveVideo((prev) => (prev + 1) % VIDEOS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleVideoSwitch = (index) => {
    if (index === activeVideo || isTransitioning) return;
    setIsTransitioning(true);
    setActiveVideo(index);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  const handleAnalyzeSearch = (e) => {
    e.preventDefault();
    const query = targetRoleInput.trim();
    if (isAuthenticated) {
      navigate(query ? `/advisor?role=${encodeURIComponent(query)}` : '/advisor');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-white font-rubik selection:bg-indigo-500 selection:text-white transition-colors duration-300 overflow-x-hidden">
      {/* 
        Hero Section:
        - FIX: Added generous top spacing (pt-16 sm:pt-20 md:pt-24) to ensure zero overlap with the sticky Navbar.
        - FIX: The train animation is placed with explicit top clearance (top-12 sm:top-16 md:top-20) and anchored to bottom
               so the top of the train roof is 100% visible and NEVER hidden behind the Navbar.
        - FIX: Premium Day Mode aesthetics: luminous ambient glows, sleek pearl/silver train frame, high-contrast typography,
               frosted search pill with deep indigo shadow, and fine architectural dot grid.
      */}
      <section className="relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center pt-16 sm:pt-20 md:pt-24 pb-20 px-4 overflow-hidden select-none">
        
        {/* Subtle Architectural Dot Matrix Grid (Day Mode) */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-70 dark:opacity-0 pointer-events-none z-0" />

        {/* Ambient Mesh Glows for Luminous Day & Dark Themes */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-sky-400/15 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute top-36 right-0 w-[450px] h-[350px] bg-sky-400/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute top-48 left-0 w-[450px] h-[350px] bg-purple-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none z-0" />

        {/* Background Video Layer */}
        {VIDEOS.map((vid, i) => (
          <video
            key={vid.url}
            src={vid.url}
            autoPlay
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              i === activeVideo
                ? 'opacity-30 dark:opacity-100 z-0'
                : 'opacity-0 z-0'
            }`}
          />
        ))}

        {/* Dynamic Glass Tint Overlay for Clean Video Projection */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-white/75 via-white/55 to-white/80 dark:from-black/60 dark:via-black/70 dark:to-black/85 backdrop-blur-[1px] pointer-events-none transition-colors duration-500" />

        {/* 
          Train & Bridge Animation Overlay Layer:
          - Positioned with explicit top clearance (top-12 sm:top-16 md:top-20) and anchored at the bottom.
          - In Day Mode: .train-frame-day converts the dark cockpit into a gleaming, high-tech pearlescent silver/white cockpit.
          - In Dark Mode: Preserves the authentic dark cyberpunk cockpit.
          - Never overlaps or gets hidden behind the sticky Navbar!
        */}
        <div
          className="absolute inset-x-0 bottom-0 top-12 sm:top-16 md:top-20 z-[2] pointer-events-none bg-contain sm:bg-cover bg-bottom animate-train-bob train-frame-day opacity-90 dark:opacity-85 transition-all duration-500"
          style={{
            backgroundImage: `url('https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png')`,
          }}
        />

        {/* Content Layer (z-index 3) - Centered Main Hero */}
        <div className="relative z-[3] flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-6 sm:space-y-8 my-auto">
          {/* Audience Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-white/95 dark:bg-white/10 backdrop-blur-md border border-indigo-200/90 dark:border-white/20 text-indigo-950 dark:text-white/90 shadow-md shadow-indigo-500/5 dark:shadow-none transition-all hover:scale-105">
            <Sparkles className="w-4 h-4 mr-2 text-amber-500 dark:text-amber-300 animate-pulse" />
            <span>Trusted by over 10,000+ professionals and talent acquisition leaders</span>
          </div>

          {/* Main Heading - Highly attractive in both Day and Dark mode */}
          <h1 className="font-rubik font-black text-3xl sm:text-5xl md:text-6xl lg:text-[4.2rem] leading-[1.12] tracking-tight text-slate-950 dark:text-white max-w-4xl">
            Bridge the gap between <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 dark:from-amber-300 dark:to-yellow-400 bg-clip-text text-transparent italic font-serif">
              academics & industry demands
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-sm sm:text-base md:text-lg max-w-2xl font-medium text-slate-600 dark:text-white/80 leading-relaxed">
            Synthesize real-time labor market telemetry, benchmark your technical readiness score, and execute targeted capability roadmaps for sustainable career mobility.
          </p>

          {/* Search Alignment Form */}
          <form onSubmit={handleAnalyzeSearch} className="w-full max-w-[360px] sm:max-w-md pt-2">
            <div className="flex items-center p-2 rounded-full bg-white/95 dark:bg-white/10 backdrop-blur-2xl border border-slate-300 dark:border-white/25 shadow-xl shadow-indigo-500/10 dark:shadow-none focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-500/15 transition-all">
              <Search className="w-4 h-4 ml-3 flex-shrink-0 text-slate-500 dark:text-white/70" />
              <input
                type="text"
                value={targetRoleInput}
                onChange={(e) => setTargetRoleInput(e.target.value)}
                placeholder="Enter target role (e.g. Full Stack Engineer, Cloud Architect)"
                className="w-full px-3 py-1.5 bg-transparent text-xs sm:text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/50 font-medium"
              />
              <button
                type="submit"
                className="flex-shrink-0 px-6 py-2.5 text-xs font-black text-white gradient-btn rounded-full transition shadow-md shadow-indigo-600/30 whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 uppercase tracking-wider"
              >
                Analyze Alignment
              </button>
            </div>
          </form>

          {/* Interactive Video Switcher Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
            {VIDEOS.map((vid, idx) => {
              const isActive = activeVideo === idx;
              return (
                <button
                  key={vid.url || idx}
                  onClick={() => handleVideoSwitch(idx)}
                  disabled={isTransitioning}
                  className={`px-4 py-1.5 rounded-full text-xs transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white font-extrabold shadow-lg shadow-indigo-500/30 dark:bg-white dark:text-slate-950 dark:shadow-none scale-105'
                      : 'bg-white/90 text-slate-700 hover:bg-white hover:text-indigo-600 border border-slate-200/90 shadow-sm dark:bg-white/10 dark:text-white/70 dark:border-transparent dark:hover:bg-white/20 dark:hover:text-white'
                  }`}
                >
                  {vid.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* DEDICATED STATISTICS SECTION */}
      <section className="relative z-10 py-16 bg-white dark:bg-slate-900/90 border-y border-slate-200/90 dark:border-white/10 font-rubik transition-colors duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STAT_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="p-6 sm:p-7 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/90 dark:border-white/10 text-center hover:border-indigo-400 dark:hover:border-amber-400/50 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1.5 transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3.5 border ${item.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className={`text-3xl sm:text-4xl font-black ${item.color} tracking-tight font-tech`}>
                    {item.value}
                  </div>
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white mt-1.5 uppercase tracking-wider">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-gray-400 mt-1 font-medium leading-relaxed hidden sm:block">
                    {item.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXTENDED PLATFORM CAPABILITIES SECTION */}
      <section className="relative z-10 py-24 px-4 sm:px-8 bg-gradient-to-b from-slate-50/70 via-white to-slate-100/60 dark:from-slate-950 dark:via-darkbg dark:to-slate-950 text-slate-900 dark:text-gray-200 font-rubik transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-700 dark:text-amber-400 bg-indigo-50 dark:bg-amber-400/10 px-4 py-1.5 rounded-full border border-indigo-200 dark:border-amber-400/20 shadow-sm">
              Enterprise Competency Analytics
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-white">
              Align Talent Potential with Live Industry Demands
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-gray-400 leading-relaxed font-medium max-w-2xl mx-auto">
              Evaluate candidate capability matrices against active market requirements, establish objective readiness benchmarks, and deploy structured upskilling pathways.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 sm:p-9 rounded-3xl bg-white dark:bg-white/5 border border-slate-200/90 dark:border-white/10 space-y-4 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-2 transition-all duration-300 group shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Weighted Competency Matrix</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-normal">
                Accurately assesses core engineering disciplines against secondary domain prerequisites to deliver definitive readiness scores.
              </p>
            </div>

            <div className="p-8 sm:p-9 rounded-3xl bg-white dark:bg-white/5 border border-slate-200/90 dark:border-white/10 space-y-4 hover:border-indigo-400/50 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-2 transition-all duration-300 group shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-sky-400 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Real-Time Market Telemetry</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-normal">
                Continuous data feeds and dynamic distribution models uncovering high-velocity hiring requisitions across global tech hubs.
              </p>
            </div>

            <div className="p-8 sm:p-9 rounded-3xl bg-white dark:bg-white/5 border border-slate-200/90 dark:border-white/10 space-y-4 hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-2 transition-all duration-300 group shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Accredited Learning Roadmaps</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-normal">
                Precision algorithmic mapping linking identified capability deficits to accredited masterclasses, verified credentials, and industry projects.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
