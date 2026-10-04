import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  BookOpen,
  Target,
  Search,
  ShieldCheck
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
    color: 'text-amber-400',
  },
  {
    value: '10,000+',
    label: 'Market Signals Tracked',
    description: 'Real-time hiring requisitions analyzed continuously from top-tier tech employers',
    icon: TrendingUp,
    color: 'text-sky-400',
  },
  {
    value: '500+',
    label: 'Curated Skill Curricula',
    description: 'Direct algorithmic mapping of detected competency gaps to accredited certifications',
    icon: BookOpen,
    color: 'text-emerald-400',
  },
  {
    value: 'Verified',
    label: 'Auditable Credentials',
    description: 'Official candidate competency certificates backed by cryptographically secure verification',
    icon: ShieldCheck,
    color: 'text-purple-400',
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
    <div className="w-full bg-black text-white font-rubik selection:bg-white selection:text-black">
      {/* Fullscreen Motion Hero Section - Simple & Classic */}
      <section className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-black select-none">
        {/* Background Video Layer */}
        {VIDEOS.map((vid, i) => (
          <video
            key={vid.url}
            src={vid.url}
            autoPlay
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${i === activeVideo ? 'opacity-100 z-0' : 'opacity-0 z-0'
              }`}
          />
        ))}

        {/* Dark Overlay for Clean Contrast */}
        <div className="absolute inset-0 z-[1] bg-black/60 pointer-events-none" />

        {/* Transparent PNG Overlay (z-index 2) with Train-Bob Animation */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none bg-cover bg-center animate-train-bob opacity-70"
          style={{
            backgroundImage: `url('https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png')`,
          }}
        />

        {/* Content Layer (z-index 3) - Centered Main Hero */}
        <div className="relative z-[3] flex flex-col h-full px-4 sm:px-8 py-8 max-w-7xl mx-auto font-rubik">
          <div className="flex-1 flex flex-col items-center justify-center text-center my-auto px-2 max-w-3xl mx-auto space-y-6">
            {/* Simple Classic Audience Badge */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-normal bg-white/10 backdrop-blur-md border border-white/20 text-white/90">
              <Sparkles className="w-3.5 h-3.5 mr-2 text-amber-300" />
              <span>Trusted by over 10,000 professionals and talent leaders</span>
            </div>

            {/* Simple Classic Main Heading */}
            <h1 className="font-rubik font-medium text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] leading-tight max-w-3xl text-white">
              Bridge the gap between <br className="hidden sm:inline" />
              <span className="text-amber-300 font-serif italic">academics & industry demands</span>
            </h1>

            {/* Simple Classic Subtext */}
            <p className="text-xs sm:text-sm md:text-base max-w-xl font-normal text-white/80 leading-relaxed">
              Synthesize real-time labor market telemetry, benchmark your technical readiness score, and execute targeted capability roadmaps for sustainable career mobility.
            </p>

            {/* Simple Target Role Search Form */}
            <form onSubmit={handleAnalyzeSearch} className="w-full max-w-[340px] sm:max-w-md pt-1">
              <div className="flex items-center p-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/25">
                <Search className="w-4 h-4 ml-3 flex-shrink-0 text-white/70" />
                <input
                  type="text"
                  value={targetRoleInput}
                  onChange={(e) => setTargetRoleInput(e.target.value)}
                  placeholder="Enter target role (e.g., Senior Full Stack Engineer, Cloud Architect)"
                  className="w-full px-3 py-1.5 bg-transparent text-xs sm:text-sm focus:outline-none text-white placeholder:text-white/50 font-normal"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 px-5 py-2 text-xs font-medium text-black bg-white rounded-full hover:bg-gray-100 transition shadow whitespace-nowrap"
                >
                  Analyze Skill Alignment
                </button>
              </div>
            </form>

            {/* Simple Video Switcher */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
              {VIDEOS.map((vid, idx) => {
                const isActive = activeVideo === idx;
                return (
                  <button
                    key={vid.url || idx}
                    onClick={() => handleVideoSwitch(idx)}
                    disabled={isTransitioning}
                    className={`px-3.5 py-1 rounded-full text-xs font-normal transition-all duration-300 ${isActive
                      ? 'bg-white text-slate-900 font-medium'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
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

      {/* DEDICATED STATISTICS SECTION (Kept outside the motion animation) */}
      <section className="relative z-10 py-12 bg-slate-900 border-y border-white/10 font-rubik">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STAT_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="glass p-6 rounded-3xl border border-white/10 text-center hover:border-amber-400/50 transition-all duration-300 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div className={`text-2xl sm:text-3xl font-medium ${item.color}`}>
                    {item.value}
                  </div>
                  <div className="text-xs font-medium text-white mt-1">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1 font-normal leading-tight hidden sm:block">
                    {item.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Extended Platform Capabilities Section */}
      <section className="relative z-10 py-20 px-4 sm:px-8 bg-slate-950 text-gray-200 font-rubik">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-medium text-amber-400">
              Enterprise Competency Analytics
            </span>
            <h2 className="text-2xl sm:text-4xl font-medium text-white">
              Align Talent Potential with Live Industry Demands
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed font-normal">
              Evaluate candidate capability matrices against active market requirements, establish objective readiness benchmarks, and deploy structured upskilling pathways.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4 hover:border-amber-400/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center text-amber-400">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium text-white">Weighted Competency Matrix</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Accurately assesses core engineering disciplines against secondary domain prerequisites to deliver definitive readiness scores.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4 hover:border-sky-400/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-sky-400/10 flex items-center justify-center text-sky-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium text-white">Real-Time Market Telemetry</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Continuous data feeds and dynamic distribution models uncovering high-velocity hiring requisitions across global tech hubs.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4 hover:border-emerald-400/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 flex items-center justify-center text-emerald-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium text-white">Accredited Learning Roadmaps</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
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
