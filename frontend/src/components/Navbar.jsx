import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { 
  Sun, 
  Moon, 
  LogOut, 
  Cpu
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
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-[#09120e]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-emerald-500/30 transition-all duration-300 shadow-[0_4px_20px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center shadow-brand-glow dark:shadow-emerald-glow group-hover:scale-105 transition-all duration-300 border border-indigo-400/40 dark:border-emerald-400/30">
              <Cpu className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-heading font-black text-lg tracking-wider text-slate-900 dark:text-white">
                  SKILLGAP
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-tech font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-500/40 rounded tracking-widest">
                  ADVISOR
                </span>
              </div>
              <span className="text-[11px] font-tech font-bold text-indigo-600 dark:text-emerald-400 uppercase tracking-widest -mt-1">
                Competency & Career Intelligence
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-700 dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-emerald-950/50 border border-slate-200 dark:border-emerald-500/30 transition-all duration-200 shadow-sm cursor-pointer"
              aria-label="Toggle Theme"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="flex items-center space-x-2 p-1.5 rounded-xl border border-slate-200 dark:border-emerald-500/30 hover:border-indigo-400 dark:hover:border-emerald-400 bg-slate-50 dark:bg-emerald-950/40 transition">
                  {user?.profileImageUrl && !imgError ? (
                    <img
                      src={user.profileImageUrl}
                      alt="Profile"
                      onError={() => setImgError(true)}
                      className="w-8 h-8 rounded-full object-cover border-2 border-indigo-400 dark:border-emerald-400"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 dark:from-emerald-500 dark:to-teal-700 text-white font-extrabold text-xs flex items-center justify-center border border-white/20">
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
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-emerald-400 transition"
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
