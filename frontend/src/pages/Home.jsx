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
    <div className="w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-white font-rubik selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      {/* 
        Hero Section:
        - FIX: Added ample top padding (pt-12 sm:pt-16 md:pt-20) to ensure zero overlap/hidden content behind the sticky SkillGap Navbar!
        - FIX: Dynamic Day Mode & Dark Mode with rich aesthetics, ambient glows, and crystal-clear contrast.
      */}
      <section className="relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center pt-12 sm:pt-16 md:pt-20 pb-16 px-4 overflow-hidden select-none">
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
                ? 'opacity-35 dark:opacity-100 z-0'
                : 'opacity-0 z-0'
            }`}
          />
        ))}

        {/* Ambient Glows for Attractive Day & Night Modes */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-indigo-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[300px] bg-purple-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Dynamic Glass Tint Overlay for Maximum Text Clarity */}
        <div className="absolute inset-0 z-[1] bg-white/80 dark:bg-black/65 backdrop-blur-[1px] pointer-events-none transition-colors duration-500" />

        {/* Transparent Pattern Overlay */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none bg-cover bg-center animate-train-bob opacity-40 dark:opacity-70"
          style={{
            backgroundImage: `url('https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png')`,
          }}
        />

        {/* Content Layer (z-index 3) - Centered Main Hero with Generous Spacing */}
        <div className="relative z-[3] flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-6 sm:space-y-8 my-auto">
          {/* Audience Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-white/90 dark:bg-white/10 backdrop-blur-md border border-indigo-200/80 dark:border-white/20 text-indigo-900 dark:text-white/90 shadow-sm transition-all hover:scale-105">
            <Sparkles className="w-4 h-4 mr-2 text-amber-500 dark:text-amber-300 animate-pulse" />
            <span>Trusted by over 10,000+ professionals and talent acquisition leaders</span>
          </div>

          {/* Main Heading - Highly attractive in both Day and Dark mode */}
          <h1 className="font-rubik font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] leading-[1.12] tracking-tight text-slate-950 dark:text-white">
            Bridge the gap between <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 dark:from-amber-300 dark:to-yellow-400 bg-clip-text text-transparent italic font-serif">
              academics & industry demands
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-sm sm:text-base md:text-lg max-w-2xl font-normal text-slate-600 dark:text-white/80 leading-relaxed">
            Synthesize real-time labor market telemetry, benchmark your technical readiness score, and execute targeted capability roadmaps for sustainable career mobility.
          </p>

          {/* Search Alignment Form */}
          <form onSubmit={handleAnalyzeSearch} className="w-full max-w-[360px] sm:max-w-md pt-2">
            <div className="flex items-center p-1.5 rounded-full bg-white/95 dark:bg-white/10 backdrop-blur-xl border border-slate-300/80 dark:border-white/25 shadow-lg shadow-indigo-500/5 dark:shadow-none focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <Search className="w-4 h-4 ml-3 flex-shrink-0 text-slate-400 dark:text-white/70" />
              <input
                type="text"
                value={targetRoleInput}
                onChange={(e) => setTargetRoleInput(e.target.value)}
                placeholder="Enter target role (e.g. Full Stack Engineer, Cloud Architect)"
                className="w-full px-3 py-1.5 bg-transparent text-xs sm:text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/50 font-medium"
              />
              <button
                type="submit"
                className="flex-shrink-0 px-5 py-2 text-xs font-bold text-white gradient-btn rounded-full transition shadow-md whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95"
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
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/25 dark:bg-white dark:text-slate-950 dark:shadow-none'
                      : 'bg-white/85 text-slate-700 hover:bg-white hover:text-indigo-600 border border-slate-200/80 dark:bg-white/10 dark:text-white/70 dark:border-transparent dark:hover:bg-white/20 dark:hover:text-white'
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
      <section className="relative z-10 py-14 bg-white dark:bg-slate-900/90 border-y border-slate-200/80 dark:border-white/10 font-rubik transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STAT_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="glass p-6 rounded-3xl border border-slate-200/90 dark:border-white/10 text-center hover:border-indigo-400/60 dark:hover:border-amber-400/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 border ${item.bgColor}`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className={`text-2xl sm:text-3xl font-black ${item.color} tracking-tight`}>
                    {item.value}
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-1 uppercase tracking-wider">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-gray-400 mt-1 font-normal leading-tight hidden sm:block">
                    {item.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXTENDED PLATFORM CAPABILITIES SECTION */}
      <section className="relative z-10 py-20 px-4 sm:px-8 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-gray-200 font-rubik transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-amber-400 bg-indigo-50 dark:bg-amber-400/10 px-3.5 py-1 rounded-full border border-indigo-200 dark:border-amber-400/20">
              Enterprise Competency Analytics
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Align Talent Potential with Live Industry Demands
            </h2>
            <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed font-normal">
              Evaluate candidate capability matrices against active market requirements, establish objective readiness benchmarks, and deploy structured upskilling pathways.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200/90 dark:border-white/10 space-y-4 hover:border-amber-400/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Weighted Competency Matrix</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-normal">
                Accurately assesses core engineering disciplines against secondary domain prerequisites to deliver definitive readiness scores.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200/90 dark:border-white/10 space-y-4 hover:border-indigo-400/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-sky-400 border border-indigo-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Real-Time Market Telemetry</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-normal">
                Continuous data feeds and dynamic distribution models uncovering high-velocity hiring requisitions across global tech hubs.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200/90 dark:border-white/10 space-y-4 hover:border-emerald-400/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
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
