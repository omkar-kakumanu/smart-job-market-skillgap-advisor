import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  User,
  TrendingUp,
  BookOpen,
  Shield,
  Award,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeftRight,
  Bot,
  Mic,
  FileText,
  GitBranch,
  Sliders
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSidebar } from '../context/SidebarContext';

const Sidebar = () => {
  const { user } = useAuth();
  const { isCollapsed, toggleCollapse, position, togglePosition } = useSidebar();

  const links = [
    { to: '/dashboard', label: 'Candidate Dashboard', icon: LayoutDashboard },
    { to: '/advisor', label: 'Skill Gap Advisor', icon: Sparkles },
    { to: '/interview', label: 'AI Technical Interview', icon: Bot },
    { to: '/voice-screening', label: 'Voice Competency Screening', icon: Mic },
    { to: '/resume', label: 'Resume & ATS Analyzer', icon: FileText },
    { to: '/ats', label: 'Talent Pipeline (ATS)', icon: GitBranch },
    { to: '/trends', label: 'Market Demand Telemetry', icon: TrendingUp },
    { to: '/courses', label: 'Accredited Courses', icon: BookOpen },
    { to: '/certificates', label: 'Verified Credentials', icon: Award },
    { to: '/profile', label: 'Candidate Profile', icon: User },
  ];

  if (user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_MANAGER') {
    links.push({ to: '/admin', label: 'Administrative Console', icon: Shield });
  }

  const isLeft = position === 'left';

  return (
    <aside
      className={`glass hidden md:flex flex-col transition-all duration-300 min-h-[calc(100vh-4rem)] p-3 space-y-3 font-tech select-none ${
        isLeft
          ? 'order-first border-r border-slate-200/80 dark:border-emerald-500/30'
          : 'order-last border-l border-slate-200/80 dark:border-emerald-500/30'
      } ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Navigation Control Header */}
      <div className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-indigo-50/70 dark:bg-emerald-500/10 border border-indigo-100 dark:border-emerald-500/20">
        {!isCollapsed && (
          <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-indigo-700 dark:text-emerald-400 truncate">
            <Sliders className="w-3.5 h-3.5 text-indigo-600 dark:text-emerald-400" />
            <span>Navigation Console</span>
          </div>
        )}

        <div className={`flex items-center gap-1 ${isCollapsed ? 'mx-auto' : ''}`}>
          {/* Position Toggle Button (Left vs Right) */}
          <button
            onClick={togglePosition}
            type="button"
            className="p-1.5 rounded-lg text-slate-600 dark:text-gray-300 hover:bg-indigo-100/70 dark:hover:bg-emerald-900/50 hover:text-indigo-700 dark:hover:text-emerald-300 transition-colors"
            title={`Dock navigation to ${isLeft ? 'Right' : 'Left'}`}
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          {/* Minimize / Maximize Toggle Button */}
          <button
            onClick={toggleCollapse}
            type="button"
            className="p-1.5 rounded-lg text-slate-600 dark:text-gray-300 hover:bg-indigo-100/70 dark:hover:bg-emerald-900/50 hover:text-indigo-700 dark:hover:text-emerald-300 transition-colors"
            title={isCollapsed ? 'Expand Navigation Console' : 'Collapse Navigation Console'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-indigo-600 dark:text-emerald-400" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Menu Nav Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              title={isCollapsed ? link.label : ''}
              className={({ isActive }) =>
                `flex items-center font-bold text-xs transition-all duration-200 ${
                  isCollapsed ? 'justify-center px-3 py-2.5 rounded-xl' : 'space-x-3 px-3.5 py-2.5 rounded-xl'
                } ${
                  isActive
                    ? 'gradient-btn text-white shadow-brand-glow dark:shadow-emerald-glow border border-indigo-300/40 dark:border-emerald-400/40'
                    : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 hover:scale-[1.02]'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{link.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Status / Mode indicator when expanded */}
      {!isCollapsed && (
        <div className="pt-2 border-t border-slate-200 dark:border-emerald-500/20 text-[10px] text-gray-500 dark:text-gray-400 px-2 flex items-center justify-between font-sans">
          <span>Dock: <strong className="uppercase text-indigo-600 dark:text-emerald-400">{position}</strong></span>
          <span>System: <strong className="uppercase text-emerald-500">Active</strong></span>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
