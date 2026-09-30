import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  LogOut, 
  LayoutDashboard, 
  Shield, 
  BookOpen, 
  TrendingUp, 
  Cpu, 
  Award,
  Bot,
  Mic,
  FileText,
  GitBranch
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/85 dark:bg-[#09120e]/90 backdrop-blur-xl border-b border-sky-400/30 dark:border-emerald-500/30 transition-all duration-300 shadow-[0_4px_30px_rgba(14,165,233,0.12)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center shadow-sky-glow dark:shadow-emerald-glow group-hover:scale-105 transition-all duration-300 border border-sky-400/40 dark:border-emerald-400/30">
              <Cpu className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-cinzel font-black text-lg tracking-wider text-slate-900 dark:text-white">
                  SKILLGAP
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-tech font-extrabold uppercase bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 rounded tracking-widest">
                  ADVISOR
                </span>
              </div>
              <span className="text-[11px] font-tech font-bold text-sky-600 dark:text-emerald-400 uppercase tracking-widest -mt-1">
                Skill-Gap Analysis System
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-5 font-tech text-sm tracking-wide">
            <Link to="/trends" className="flex items-center space-x-1 text-slate-700 hover:text-sky-600 dark:text-gray-300 dark:hover:text-emerald-400 transition hover:scale-105 font-bold">
              <TrendingUp className="w-3.5 h-3.5 text-sky-500 dark:text-emerald-500" />
              <span>Trends</span>
            </Link>
            <Link to="/courses" className="flex items-center space-x-1 text-slate-700 hover:text-sky-600 dark:text-gray-300 dark:hover:text-emerald-400 transition hover:scale-105 font-bold">
              <BookOpen className="w-3.5 h-3.5 text-sky-500 dark:text-emerald-500" />
              <span>Courses</span>
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/advisor" className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 hover:text-amber-500 transition hover:scale-105 font-black">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Advisor</span>
                </Link>
                <Link to="/interview" className="flex items-center space-x-1 text-slate-700 hover:text-sky-600 dark:text-gray-300 dark:hover:text-emerald-400 transition hover:scale-105 font-bold">
                  <Bot className="w-3.5 h-3.5 text-sky-500 dark:text-emerald-500" />
                  <span>AI Interview</span>
                </Link>
                <Link to="/voice-screening" className="flex items-center space-x-1 text-slate-700 hover:text-sky-600 dark:text-gray-300 dark:hover:text-emerald-400 transition hover:scale-105 font-bold">
                  <Mic className="w-3.5 h-3.5 text-purple-500" />
                  <span>Voice Screening</span>
                </Link>
                <Link to="/resume" className="flex items-center space-x-1 text-slate-700 hover:text-sky-600 dark:text-gray-300 dark:hover:text-emerald-400 transition hover:scale-105 font-bold">
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>Resume</span>
                </Link>
                <Link to="/ats" className="flex items-center space-x-1 text-slate-700 hover:text-sky-600 dark:text-gray-300 dark:hover:text-emerald-400 transition hover:scale-105 font-bold">
                  <GitBranch className="w-3.5 h-3.5 text-emerald-500" />
                  <span>ATS</span>
                </Link>
                <Link to="/dashboard" className="flex items-center space-x-1 text-slate-700 hover:text-sky-600 dark:text-gray-300 dark:hover:text-emerald-400 transition hover:scale-105 font-bold">
                  <LayoutDashboard className="w-3.5 h-3.5 text-sky-500 dark:text-emerald-500" />
                  <span>Dashboard</span>
                </Link>
                {user?.role === 'ROLE_ADMIN' && (
                  <Link to="/admin" className="flex items-center space-x-1 text-purple-600 dark:text-purple-400 hover:text-purple-500 transition hover:scale-105 font-bold">
                    <Shield className="w-3.5 h-3.5 text-purple-500" />
                    <span>Admin</span>
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-sky-600 dark:text-emerald-400 hover:bg-sky-100 dark:hover:bg-emerald-950/50 border border-sky-400/30 dark:border-emerald-500/30 transition-all duration-200 shadow-sm cursor-pointer"
              aria-label="Toggle Theme"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-sky-600" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="flex items-center space-x-2 p-1.5 rounded-xl border border-sky-400/30 dark:border-emerald-500/30 hover:border-sky-500 dark:hover:border-emerald-400 bg-sky-50 dark:bg-emerald-950/40 transition">
                  {user?.profileImageUrl && !imgError ? (
                    <img
                      src={user.profileImageUrl}
                      alt="Profile"
                      onError={() => setImgError(true)}
                      className="w-8 h-8 rounded-full object-cover border-2 border-sky-400 dark:border-emerald-400"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 dark:from-emerald-500 dark:to-teal-700 text-white font-extrabold text-xs flex items-center justify-center border border-white/20">
                      {getInitials(user?.fullName)}
                    </div>
                  )}
                  <span className="hidden sm:inline font-tech font-bold text-xs text-slate-800 dark:text-white">
                    {user?.fullName?.split(' ')[0]}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-transparent hover:border-rose-400/30 transition cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 font-tech">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-emerald-400 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-extrabold text-white gradient-btn rounded-xl shadow-sm hover:scale-105 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
