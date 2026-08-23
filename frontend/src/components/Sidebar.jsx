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
  ChevronLeft,
  ChevronRight,
  Sliders
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSidebar } from '../context/SidebarContext';

const Sidebar = () => {
  const { user } = useAuth();
  const { isCollapsed, toggleCollapse, position, togglePosition } = useSidebar();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/advisor', label: 'AI Gap Advisor', icon: Sparkles },
    { to: '/trends', label: 'Market Trends', icon: TrendingUp },
    { to: '/courses', label: 'Courses Directory', icon: BookOpen },
    { to: '/certificates', label: 'Skill Certificates', icon: Award },
    { to: '/profile', label: 'Skill Profile', icon: User },
  ];

  if (user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_MANAGER') {
    links.push({ to: '/admin', label: 'Admin Portal', icon: Shield });
  }

  const isLeft = position === 'left';

  return (
    <aside
      className={`glass hidden md:flex flex-col transition-all duration-300 min-h-[calc(100vh-4rem)] p-3 space-y-3 font-tech select-none ${
        isLeft
          ? 'order-first border-r border-sky-400/30 dark:border-emerald-500/30'
          : 'order-last border-l border-sky-400/30 dark:border-emerald-500/30'
      } ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Command Menu Control Header */}
      <div className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-sky-500/10 dark:bg-emerald-500/10 border border-sky-400/20 dark:border-emerald-500/20">
        {!isCollapsed && (
          <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-sky-700 dark:text-emerald-400 truncate">
            <Sliders className="w-3.5 h-3.5 text-sky-500 dark:text-emerald-400" />
            <span>Command Menu</span>
          </div>
        )}

        <div className={`flex items-center gap-1 ${isCollapsed ? 'mx-auto' : ''}`}>
          {/* Position Toggle Button (Left vs Right) */}
          <button
            onClick={togglePosition}
            type="button"
            className="p-1.5 rounded-lg text-slate-600 dark:text-gray-300 hover:bg-sky-200/60 dark:hover:bg-emerald-900/50 hover:text-sky-700 dark:hover:text-emerald-300 transition-colors"
            title={`Move menu bar to ${isLeft ? 'Right' : 'Left'} side`}
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          {/* Minimize / Maximize Toggle Button */}
          <button
            onClick={toggleCollapse}
            type="button"
            className="p-1.5 rounded-lg text-slate-600 dark:text-gray-300 hover:bg-sky-200/60 dark:hover:bg-emerald-900/50 hover:text-sky-700 dark:hover:text-emerald-300 transition-colors"
            title={isCollapsed ? 'Maximize Command Menu' : 'Minimize Command Menu'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-sky-600 dark:text-emerald-400" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Menu Nav Links */}
      <nav className="flex-1 space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              title={isCollapsed ? link.label : ''}
              className={({ isActive }) =>
                `flex items-center font-bold text-sm transition-all duration-300 ${
                  isCollapsed ? 'justify-center px-3 py-3 rounded-xl' : 'space-x-3 px-4 py-3 rounded-xl'
                } ${
                  isActive
                    ? 'gradient-btn text-white shadow-solo-glow dark:shadow-emerald-glow border border-sky-300/40 dark:border-emerald-400/40'
                    : 'text-slate-700 hover:bg-sky-100/80 hover:text-sky-600 dark:text-gray-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 hover:scale-[1.02]'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{link.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Status / Mode indicator when expanded */}
      {!isCollapsed && (
        <div className="pt-2 border-t border-sky-400/20 dark:border-emerald-500/20 text-[11px] text-gray-500 dark:text-gray-400 px-2 flex items-center justify-between font-sans">
          <span>Position: <strong className="uppercase text-sky-600 dark:text-emerald-400">{position}</strong></span>
          <span>Width: <strong className="uppercase text-sky-600 dark:text-emerald-400">Maximized</strong></span>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
