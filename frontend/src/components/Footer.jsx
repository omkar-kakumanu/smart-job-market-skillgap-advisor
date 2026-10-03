import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ExternalLink, ShieldCheck, Sparkles, BookOpen, TrendingUp, Layers, CheckCircle, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Footer = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <footer className="border-t border-slate-200/90 dark:border-emerald-500/30 bg-white/90 dark:bg-[#050a08]/95 backdrop-blur-md mt-16 font-tech">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-200 dark:border-emerald-500/20">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl gradient-btn shadow-sm">
                <Cpu className="w-5 h-5 text-white animate-pulse" />
              </div>
              <span className="font-heading font-black text-slate-900 dark:text-white text-base tracking-wider">
                SKILLGAP ADVISOR
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-gray-400 font-sans leading-relaxed">
              Enterprise competency analytics and career progression platform aligning talent capabilities with real-time labor market requisitions.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Cloud-Native Architecture • High-Precision Skill Analytics</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-700 dark:text-emerald-400">
              Platform Solutions
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-gray-300 font-medium">
              <li>
                <Link to="/advisor" className="hover:text-indigo-600 dark:hover:text-emerald-300 flex items-center space-x-1.5 transition">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-emerald-400" />
                  <span>Skill Gap Advisor</span>
                </Link>
              </li>
              <li>
                <Link to="/trends" className="hover:text-indigo-600 dark:hover:text-emerald-300 flex items-center space-x-1.5 transition">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-500 dark:text-emerald-400" />
                  <span>Market Intelligence</span>
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-indigo-600 dark:hover:text-emerald-300 flex items-center space-x-1.5 transition">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500 dark:text-teal-400" />
                  <span>Accredited Course Catalog</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-emerald-300 flex items-center space-x-1.5 transition">
                  <Layers className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Executive Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Developer & Technical Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-700 dark:text-emerald-400">
              Technical Resources
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-gray-300 font-medium">
              <li>
                <a
                  href="https://petstore.swagger.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 dark:hover:text-emerald-300 flex items-center space-x-1.5 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>API Documentation (Swagger UI)</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://spec.openapis.org/oas/latest.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 dark:hover:text-emerald-300 flex items-center space-x-1.5 transition"
                >
                  <Cpu className="w-3.5 h-3.5 text-indigo-500 dark:text-emerald-400" />
                  <span>OpenAPI Specification</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 dark:hover:text-emerald-300 flex items-center space-x-1.5 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 dark:text-emerald-400" />
                  <span>Administrative Console (Cloud Actuator)</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Auth / Candidate Quick Actions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-700 dark:text-emerald-400">
              {isAuthenticated ? 'Candidate Portal' : 'Account Access'}
            </h4>
            <div className="space-y-2 font-sans">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center justify-center space-x-1.5 w-full py-2 px-3 text-center text-xs font-bold rounded-xl gradient-btn text-white shadow-sm transition"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Candidate Dashboard</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center justify-center space-x-1.5 w-full py-2 px-3 text-center text-xs font-bold rounded-xl border border-slate-200 dark:border-emerald-500/50 bg-slate-50 dark:bg-emerald-950/40 text-slate-800 dark:text-emerald-300 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Profile ({user?.fullName?.split(' ')[0]})</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block w-full py-2 px-3 text-center text-xs font-bold rounded-xl border border-slate-200 dark:border-emerald-500/50 bg-slate-50 dark:bg-emerald-950/40 text-slate-800 dark:text-emerald-300 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    Sign In to Portal
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full py-2 px-3 text-center text-xs font-bold rounded-xl gradient-btn text-white shadow-sm transition"
                  >
                    Create Professional Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-gray-400">
          <p className="uppercase tracking-wider font-bold">
            &copy; {new Date().getFullYear()} SKILLGAP ADVISOR. Enterprise Workforce Intelligence. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
              Systems Operational • v1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
