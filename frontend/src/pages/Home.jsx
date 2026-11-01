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
    <div className="w-full bg-slate-100/60 dark:bg-black text-slate-900 dark:text-white font-rubik selection:bg-amber-400 selection:text-black transition-colors duration-300 overflow-x-hidden">
      {/* 
        Flagship Cinematic Hero Showcase:
        - Full-fidelity video projection with pure black vignette for crystal clarity.
        - Authentic high-resolution train cockpit overlay bobbing naturally without negative filter glitches.
        - The animation bobs downward by 4px so the roof beam NEVER enters or hides behind the sticky Navbar.
        - Elegant glowing typography with amber/gold highlights and frosted glass search form.
      */}
      <section className="relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-black select-none">
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
              i === activeVideo ? 'opacity-100 z-0' : 'opacity-0 z-0'
            }`}
          />
        ))}

        {/* Clean Contrast Vignette */}
        <div className="absolute inset-0 z-[1] bg-black/60 pointer-events-none" />

        {/* Authentic Transparent Train & Bridge Pattern Overlay */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none bg-cover bg-center animate-train-bob opacity-75"
          style={{
            backgroundImage: `url('https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png')`,
          }}
        />

        {/* Centered Main Hero Content */}
        <div className="relative z-[3] flex flex-col h-full px-4 sm:px-8 pt-8 pb-12 max-w-7xl mx-auto font-rubik my-auto">
          <div className="flex-1 flex flex-col items-center justify-center text-center my-auto px-2 max-w-3xl mx-auto space-y-6">
            {/* Audience Badge */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-white/10 backdrop-blur-md border border-white/20 text-white/95 shadow-sm hover:scale-105 transition-all">
              <Sparkles className="w-3.5 h-3.5 mr-2 text-amber-300 animate-pulse" />
              <span>Trusted by over 10,000 professionals and talent leaders</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-rubik font-bold text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] leading-tight max-w-3xl text-white">
              Bridge the gap between <br className="hidden sm:inline" />
              <span className="text-amber-300 font-serif italic">academics & industry demands</span>
            </h1>

            {/* Subtext */}
            <p className="text-xs sm:text-sm md:text-base max-w-xl font-normal text-white/80 leading-relaxed">
              Synthesize real-time labor market telemetry, benchmark your technical readiness score, and execute targeted capability roadmaps for sustainable career mobility.
            </p>

            {/* Target Role Search Form */}
            <form onSubmit={handleAnalyzeSearch} className="w-full max-w-[340px] sm:max-w-md pt-1">
              <div className="flex items-center p-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/25 shadow-2xl focus-within:border-white focus-within:ring-2 focus-within:ring-white/30 transition-all">
                <Search className="w-4 h-4 ml-3 flex-shrink-0 text-white/70" />
                <input
                  type="text"
                  value={targetRoleInput}
                  onChange={(e) => setTargetRoleInput(e.target.value)}
                  placeholder="Enter target role (e.g. Senior Full Stack Engineer, Cloud Architect)"
                  className="w-full px-3 py-1.5 bg-transparent text-xs sm:text-sm focus:outline-none text-white placeholder:text-white/50 font-normal"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 px-5 py-2 text-xs font-bold text-black bg-white hover:bg-gray-100 rounded-full transition shadow-lg whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95"
                >
                  Analyze Alignment
                </button>
              </div>
            </form>

            {/* Video Switcher Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
              {VIDEOS.map((vid, idx) => {
                const isActive = activeVideo === idx;
                return (
                  <button
                    key={vid.label}
                    onClick={() => handleVideoSwitch(idx)}
                    disabled={isTransitioning}
                    className={`px-3.5 py-1 rounded-full text-xs font-normal transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-white text-slate-900 font-bold shadow-lg shadow-white/20 scale-105'
                        : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
                    }`}
                  >
                    {vid.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* DEDICATED STATISTICS SECTION (Clean Day Mode & Dark Mode) */}
      <section className="relative z-10 py-14 bg-white dark:bg-slate-900 border-y border-slate-200/90 dark:border-white/10 font-rubik transition-colors duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STAT_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="p-6 rounded-3xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/90 dark:border-white/10 text-center hover:border-amber-400/80 dark:hover:border-amber-400/50 hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 shadow-sm group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 border ${item.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className={`text-2xl sm:text-3xl font-black ${item.color} tracking-tight font-tech`}>
                    {item.value}
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-1 uppercase tracking-wider">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-gray-400 mt-1 font-normal leading-tight hidden sm:block">
                    {item.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXTENDED PLATFORM CAPABILITIES SECTION (Clean Day Mode & Dark Mode) */}
      <section className="relative z-10 py-20 px-4 sm:px-8 bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-gray-200 font-rubik transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-700 dark:text-amber-400 bg-indigo-50 dark:bg-amber-400/10 px-3.5 py-1 rounded-full border border-indigo-200 dark:border-amber-400/20">
              Integrated Skill-Gap Intelligence
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Bridge your potential with live market realities
            </h2>
            <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed font-normal max-w-2xl mx-auto">
              Compare your candidate profile against active market demands, calculate weighted readiness percentages, and execute custom learning paths.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200/90 dark:border-white/10 space-y-4 hover:border-amber-400/60 dark:hover:border-amber-400/50 hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-none hover:-translate-y-1.5 transition-all duration-300 group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Weighted AI Skill Engine</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-normal">
                Evaluates critical tech skills against secondary requirements to yield accurate career readiness scores.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200/90 dark:border-white/10 space-y-4 hover:border-indigo-400/60 dark:hover:border-sky-400/50 hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-none hover:-translate-y-1.5 transition-all duration-300 group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-sky-400 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Market Intelligence Trends</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-normal">
                Live statistics and interactive distributions highlighting high-demand skills across industries.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200/90 dark:border-white/10 space-y-4 hover:border-emerald-400/60 dark:hover:border-emerald-400/50 hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-none hover:-translate-y-1.5 transition-all duration-300 group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Curated Course Catalog</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-normal">
                Direct mapping of missing skills to verified masterclasses, certifications, and portfolio projects.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
