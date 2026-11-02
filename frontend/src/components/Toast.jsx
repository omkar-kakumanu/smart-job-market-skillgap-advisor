import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-600 dark:text-sky-400 shrink-0" />,
  };

  // Dedicated Day Mode & Dark Mode card styles:
  const toastThemes = {
    success: 'bg-white/95 dark:bg-[#071a12]/95 border-emerald-300 dark:border-emerald-500/40 text-slate-900 dark:text-emerald-100 shadow-[0_10px_30px_rgba(16,185,129,0.15)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.6)]',
    error: 'bg-white/95 dark:bg-[#1a080a]/95 border-rose-300 dark:border-rose-500/40 text-slate-900 dark:text-rose-100 shadow-[0_10px_30px_rgba(244,63,94,0.15)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.6)]',
    info: 'bg-white/95 dark:bg-[#0b1329]/95 border-indigo-200 dark:border-sky-500/40 text-slate-900 dark:text-sky-100 shadow-[0_10px_30px_rgba(99,102,241,0.15)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.6)]',
  };

  // High-visibility 3-second countdown progress bar:
  const progressColors = {
    success: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    error: 'bg-gradient-to-r from-rose-500 to-pink-500',
    info: 'bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-sky-400 dark:to-cyan-300',
  };

  return (
    <div 
      className={`relative overflow-hidden pointer-events-auto flex items-center justify-between p-4 pr-3 rounded-2xl border ${toastThemes[type] || toastThemes.info} backdrop-blur-2xl transition-all duration-300 animate-fade-in font-sans`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center space-x-3 mr-3">
        {icons[type] || icons.info}
        <span className="text-xs sm:text-sm font-bold tracking-wide leading-snug">
          {message}
        </span>
      </div>

      <button 
        onClick={onClose} 
        aria-label="Close notification"
        className="text-slate-400 hover:text-slate-700 dark:text-white/60 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition shrink-0 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

            {/* 3-Second Countdown Pop Bar Track & Indicator with vivid contrast in both Day and Dark mode */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200/90 dark:bg-slate-800/90 overflow-hidden rounded-b-2xl">
        <div 
          className={`h-full ${progressColors[type] || progressColors.info} shadow-sm`}
          style={{
            width: '100%',
            animation: `toastProgress ${duration}ms linear forwards`
          }}
        />
      </div>
    </div>
  );
};

export default Toast;
